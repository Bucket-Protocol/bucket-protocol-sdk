import { Transaction } from '@mysten/sui/transactions';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mockFetchFail, mockFetchOk } from '../../__mocks__/fetch.js';
import { buildPythPriceUpdateCalls, fetchPriceFeedsUpdateDataFromHermes, PythCache } from '../../../src/utils/pyth.js';
import { PYTH_CONFIG, SUI_PYTH_PRICE_ID } from '../../fixtures/pyth-config.js';

const HERMES_ENDPOINT = 'https://hermes.pyth.network';

/** Minimal valid accumulator: header + trailingPayloadSize=0, vaaSize=4, 4-byte vaa. */
function createMinimalAccumulator(): Uint8Array {
  const acc = new Uint8Array(20);
  acc[6] = 0; // trailingPayloadSize
  acc[8] = 0;
  acc[9] = 4; // vaaSize = 4 (big endian)
  acc[10] = 1;
  acc[11] = 2;
  acc[12] = 3;
  acc[13] = 4; // vaa bytes
  return acc;
}

/** 32-byte object ID for getDynamicField mock. */
const MOCK_OBJECT_ID_BYTES = new Uint8Array(32);
MOCK_OBJECT_ID_BYTES.fill(0xab, 0, 32);

function createMockSuiClient(
  overrides: {
    pythStateJson?: Record<string, unknown>;
    wormholeJson?: Record<string, unknown>;
    listDynamicFields?: { dynamicFields: Array<{ childId?: string; valueType?: string }> };
    getDynamicField?: { dynamicField?: { value?: { bcs?: Uint8Array } } };
  } = {},
) {
  const pythPkg = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const defaultPythState = {
    upgrade_cap: { package: pythPkg },
    base_update_fee: '100',
    ...overrides.pythStateJson,
  };
  const defaultWormhole = {
    upgrade_cap: { package: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' },
    ...overrides.wormholeJson,
  };
  const defaultTableList = overrides.listDynamicFields ?? {
    dynamicFields: [
      {
        childId: '0xtable123',
        valueType: `${pythPkg}::price_identifier::PriceIdentifier<object::ID>`,
      },
    ],
  };
  const defaultDynamicField = {
    dynamicField: {
      value: { bcs: MOCK_OBJECT_ID_BYTES },
    },
    ...overrides.getDynamicField,
  };

  return {
    getObject: vi.fn().mockImplementation(({ objectId }: { objectId: string }) => {
      if (objectId === PYTH_CONFIG.pythStateId) {
        return Promise.resolve({ object: { json: defaultPythState } });
      }
      if (objectId === PYTH_CONFIG.wormholeStateId) {
        return Promise.resolve({ object: { json: defaultWormhole } });
      }
      return Promise.resolve({ object: null });
    }),
    listDynamicFields: vi.fn().mockResolvedValue(defaultTableList),
    getDynamicField: vi.fn().mockResolvedValue(defaultDynamicField),
  };
}

describe('unit/utils/pyth', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchPriceFeedsUpdateDataFromHermes', () => {
    it('returns empty array when priceIds is empty', async () => {
      const result = await fetchPriceFeedsUpdateDataFromHermes(HERMES_ENDPOINT, []);
      expect(result).toEqual([]);
    });

    it('throws when Hermes returns non-ok response', async () => {
      vi.stubGlobal('fetch', mockFetchFail(500, 'Internal Server Error'));
      await expect(fetchPriceFeedsUpdateDataFromHermes(HERMES_ENDPOINT, [SUI_PYTH_PRICE_ID])).rejects.toThrow(
        'Hermes price fetch failed',
      );
    });

    it('throws when Hermes returns no binary data', async () => {
      vi.stubGlobal('fetch', mockFetchOk({ binary: {} }));
      await expect(fetchPriceFeedsUpdateDataFromHermes(HERMES_ENDPOINT, [SUI_PYTH_PRICE_ID])).rejects.toThrow(
        'Hermes returned no binary price data',
      );
    });

    it('throws when Hermes returns empty data array', async () => {
      vi.stubGlobal('fetch', mockFetchOk({ binary: { data: [] } }));
      await expect(fetchPriceFeedsUpdateDataFromHermes(HERMES_ENDPOINT, [SUI_PYTH_PRICE_ID])).rejects.toThrow(
        'Hermes returned no binary price data',
      );
    });
  });

  type PythClient = Parameters<typeof buildPythPriceUpdateCalls>[1];
  const asClient = (m: unknown): PythClient => m as unknown as PythClient;

  describe('buildPythPriceUpdateCalls', () => {
    it('throws when updates array is empty', async () => {
      const tx = new Transaction();
      const client = asClient({});
      await expect(buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [], [], undefined)).rejects.toThrow(
        'No price update data provided',
      );
    });

    it('throws when more than one update is provided', async () => {
      const tx = new Transaction();
      const client = asClient({});
      const dummyUpdate = new Uint8Array(100);
      await expect(
        buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [dummyUpdate, dummyUpdate], ['0xabc'], undefined),
      ).rejects.toThrow('Only a single accumulator message is supported');
    });

    it('throws when price feed object ID is not found', async () => {
      const tx = new Transaction();
      const client = asClient(
        createMockSuiClient({
          getDynamicField: { dynamicField: { value: { bcs: new Uint8Array(16) } } },
        }),
      );
      const acc = createMinimalAccumulator();
      await expect(
        buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [acc], [SUI_PYTH_PRICE_ID], undefined),
      ).rejects.toThrow(/Price feed .* not found; create it first/);
    });

    it('succeeds with mocked client and returns price info object IDs', async () => {
      const tx = new Transaction();
      tx.setSender('0x1');
      const client = asClient(createMockSuiClient());
      const acc = createMinimalAccumulator();
      const ids = await buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [acc], [SUI_PYTH_PRICE_ID], undefined);
      expect(ids).toHaveLength(1);
      expect(ids[0]).toMatch(/^0x[a-fA-F0-9]+$/);
    });

    it('uses PythCache when provided', async () => {
      const tx = new Transaction();
      tx.setSender('0x1');
      const client = asClient(createMockSuiClient());
      const cache = new PythCache();
      cache.pythStateInfo = { packageId: '0xcached', baseUpdateFee: 100n };
      cache.wormholePackageId = '0xwormhole';
      cache.priceTableInfo = { id: '0xtable', fieldType: '0xcached' };
      cache.priceFeedObjectIdCache.set(
        `${PYTH_CONFIG.pythStateId}:${SUI_PYTH_PRICE_ID.replace(/^0x/, '')}`,
        '0xpriceobj',
      );
      const acc = createMinimalAccumulator();
      const ids = await buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [acc], [SUI_PYTH_PRICE_ID], cache);
      expect(ids[0]).toBe('0xpriceobj');
      expect(client.getObject).not.toHaveBeenCalled();
      expect(client.listDynamicFields).not.toHaveBeenCalled();
      expect(client.getDynamicField).not.toHaveBeenCalled();
    });

    it('parses getPackageIdFromObjectJson from json.fields.upgrade_cap and upgradeCap.fields.package', async () => {
      const tx = new Transaction();
      tx.setSender('0x1');
      const client = asClient(
        createMockSuiClient({
          pythStateJson: {
            upgrade_cap: undefined,
            fields: { upgrade_cap: { fields: { package: '0xfromfields' } } },
            base_update_fee: '100',
          },
          wormholeJson: {
            upgrade_cap: undefined,
            fields: { upgrade_cap: { fields: { package: '0xwormhole_from_fields' } } },
          },
        }),
      );
      const acc = createMinimalAccumulator();
      const ids = await buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [acc], [SUI_PYTH_PRICE_ID], undefined);
      expect(ids).toHaveLength(1);
    });

    it('throws when pyth state has no json', async () => {
      const tx = new Transaction();
      const client = asClient(createMockSuiClient());
      (client.getObject as ReturnType<typeof vi.fn>).mockImplementation(({ objectId }: { objectId: string }) => {
        if (objectId === PYTH_CONFIG.pythStateId) return Promise.resolve({ object: null });
        if (objectId === PYTH_CONFIG.wormholeStateId) {
          return Promise.resolve({ object: { json: { upgrade_cap: { package: '0xwh' } } } });
        }
        return Promise.resolve({ object: null });
      });
      const acc = createMinimalAccumulator();
      await expect(
        buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [acc], [SUI_PYTH_PRICE_ID], undefined),
      ).rejects.toThrow('Unable to fetch pyth state');
    });

    it('throws when price table not found in dynamic fields', async () => {
      const tx = new Transaction();
      const client = asClient(
        createMockSuiClient({
          listDynamicFields: { dynamicFields: [] },
        }),
      );
      const acc = createMinimalAccumulator();
      await expect(
        buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [acc], [SUI_PYTH_PRICE_ID], undefined),
      ).rejects.toThrow('Price table not found in Pyth state dynamic fields');
    });

    it('throws when price table valueType does not match PriceIdentifier pattern', async () => {
      const tx = new Transaction();
      const client = asClient(
        createMockSuiClient({
          listDynamicFields: {
            dynamicFields: [
              {
                childId: '0x1',
                valueType: '0x::price_identifier::PriceIdentifier<object::ID>',
              },
            ],
          },
        }),
      );
      const acc = createMinimalAccumulator();
      await expect(
        buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [acc], [SUI_PYTH_PRICE_ID], undefined),
      ).rejects.toThrow('Cannot extract package address from price table type');
    });

    it('throws when getPackageIdFromObjectJson cannot extract package', async () => {
      const tx = new Transaction();
      const client = asClient(
        createMockSuiClient({
          pythStateJson: { upgrade_cap: {}, base_update_fee: '100' },
        }),
      );
      const acc = createMinimalAccumulator();
      await expect(
        buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [acc], [SUI_PYTH_PRICE_ID], undefined),
      ).rejects.toThrow('Cannot get package id for object');
    });

    it('exercises runWithConcurrency with multiple feedIds', async () => {
      const tx = new Transaction();
      tx.setSender('0x1');
      const client = asClient(createMockSuiClient());
      const acc = createMinimalAccumulator();
      const feedIds = [
        SUI_PYTH_PRICE_ID,
        '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65745',
        '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65746',
        '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65747',
        '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65748',
      ];
      const ids = await buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [acc], feedIds, undefined);
      expect(ids).toHaveLength(5);
    });
  });

  describe('PythCache', () => {
    it('instantiates with empty cache', () => {
      const cache = new PythCache();
      expect(cache.priceFeedObjectIdCache).toBeInstanceOf(Map);
      expect(cache.priceFeedObjectIdCache.size).toBe(0);
      expect(cache.pythStateInfo).toBeUndefined();
      expect(cache.wormholePackageId).toBeUndefined();
      expect(cache.priceTableInfo).toBeUndefined();
    });

    it('allows setting cache properties', () => {
      const cache = new PythCache();
      cache.pythStateInfo = { packageId: '0xabc', baseUpdateFee: 1n };
      cache.wormholePackageId = '0xdef';
      cache.priceTableInfo = { id: '0x123', fieldType: '0x456' };
      cache.priceFeedObjectIdCache.set('key', '0x789');
      expect(cache.pythStateInfo?.packageId).toBe('0xabc');
      expect(cache.wormholePackageId).toBe('0xdef');
      expect(cache.priceTableInfo?.id).toBe('0x123');
      expect(cache.priceFeedObjectIdCache.get('key')).toBe('0x789');
    });
  });
});
