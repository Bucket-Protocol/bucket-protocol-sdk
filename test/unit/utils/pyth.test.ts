import { afterEach, describe, expect, it, vi } from 'vitest';

import { PythCache, resolvePythPriceInfoObjectIds } from '../../../src/utils/pyth.js';
import { PYTH_CONFIG, SUI_PYTH_PRICE_ID } from '../../fixtures/pyth-config.js';

/** 32-byte object ID for getDynamicField mock. */
const MOCK_OBJECT_ID_BYTES = new Uint8Array(32);
MOCK_OBJECT_ID_BYTES.fill(0xab, 0, 32);

function createMockSuiClient(
  overrides: {
    listDynamicFields?: { dynamicFields: Array<{ childId?: string; valueType?: string }> };
    getDynamicField?: { dynamicField?: { value?: { bcs?: Uint8Array } } };
  } = {},
) {
  const pythPkg = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
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
    listDynamicFields: vi.fn().mockResolvedValue(defaultTableList),
    getDynamicField: vi.fn().mockResolvedValue(defaultDynamicField),
  };
}

describe('unit/utils/pyth', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  type PythClient = Parameters<typeof resolvePythPriceInfoObjectIds>[0];
  const asClient = (m: unknown): PythClient => m as unknown as PythClient;

  describe('resolvePythPriceInfoObjectIds', () => {
    it('resolves ids from the price table', async () => {
      const client = asClient(createMockSuiClient());

      const ids = await resolvePythPriceInfoObjectIds(client, PYTH_CONFIG.pythStateId, [SUI_PYTH_PRICE_ID], undefined);

      expect(ids).toEqual(['0x' + 'ab'.repeat(32)]);
    });

    it('returns an empty array for no feeds, without any RPC', async () => {
      const client = asClient(createMockSuiClient());

      await expect(resolvePythPriceInfoObjectIds(client, PYTH_CONFIG.pythStateId, [], undefined)).resolves.toEqual([]);
      expect(client.listDynamicFields).not.toHaveBeenCalled();
    });

    it('throws when a feed has no price object, since the rule still has to be fed', async () => {
      const client = asClient(
        createMockSuiClient({ getDynamicField: { dynamicField: { value: { bcs: new Uint8Array(4) } } } }),
      );

      await expect(
        resolvePythPriceInfoObjectIds(client, PYTH_CONFIG.pythStateId, [SUI_PYTH_PRICE_ID], undefined),
      ).rejects.toThrow('not found; create it first');
    });

    it('throws when price table not found in dynamic fields', async () => {
      const client = asClient(createMockSuiClient({ listDynamicFields: { dynamicFields: [] } }));

      await expect(
        resolvePythPriceInfoObjectIds(client, PYTH_CONFIG.pythStateId, [SUI_PYTH_PRICE_ID], undefined),
      ).rejects.toThrow('Price table not found in Pyth state dynamic fields');
    });

    it('throws when price table valueType does not match PriceIdentifier pattern', async () => {
      const client = asClient(
        createMockSuiClient({
          listDynamicFields: {
            dynamicFields: [{ childId: '0x1', valueType: '0x::price_identifier::PriceIdentifier<object::ID>' }],
          },
        }),
      );

      await expect(
        resolvePythPriceInfoObjectIds(client, PYTH_CONFIG.pythStateId, [SUI_PYTH_PRICE_ID], undefined),
      ).rejects.toThrow('Cannot extract package address from price table type');
    });

    it('exercises runWithConcurrency with multiple feedIds', async () => {
      const client = asClient(createMockSuiClient());
      const feedIds = [
        SUI_PYTH_PRICE_ID,
        '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65745',
        '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65746',
        '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65747',
        '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65748',
      ];

      const ids = await resolvePythPriceInfoObjectIds(client, PYTH_CONFIG.pythStateId, feedIds, undefined);

      expect(ids).toHaveLength(5);
    });

    it('uses PythCache when provided', async () => {
      const client = asClient(createMockSuiClient());
      const cache = new PythCache();
      cache.priceTableInfo = { id: '0xtable', fieldType: '0xcached' };
      cache.priceFeedObjectIdCache.set(
        `${PYTH_CONFIG.pythStateId}:${SUI_PYTH_PRICE_ID.replace(/^0x/, '')}`,
        '0xpriceobj',
      );

      const ids = await resolvePythPriceInfoObjectIds(client, PYTH_CONFIG.pythStateId, [SUI_PYTH_PRICE_ID], cache);

      expect(ids[0]).toBe('0xpriceobj');
      expect(client.listDynamicFields).not.toHaveBeenCalled();
      expect(client.getDynamicField).not.toHaveBeenCalled();
    });

    it('fills a shared PythCache, so a second resolve needs no RPC', async () => {
      const cache = new PythCache();
      const client = asClient(createMockSuiClient());

      await resolvePythPriceInfoObjectIds(client, PYTH_CONFIG.pythStateId, [SUI_PYTH_PRICE_ID], cache);
      const ids = await resolvePythPriceInfoObjectIds(client, PYTH_CONFIG.pythStateId, [SUI_PYTH_PRICE_ID], cache);

      expect(ids).toEqual(['0x' + 'ab'.repeat(32)]);
      expect(client.listDynamicFields).toHaveBeenCalledOnce();
      expect(client.getDynamicField).toHaveBeenCalledOnce();
    });
  });

  describe('PythCache', () => {
    it('instantiates with empty cache', () => {
      const cache = new PythCache();
      expect(cache.priceFeedObjectIdCache).toBeInstanceOf(Map);
      expect(cache.priceFeedObjectIdCache.size).toBe(0);
      expect(cache.priceTableInfo).toBeUndefined();
    });

    it('allows setting cache properties', () => {
      const cache = new PythCache();
      cache.priceTableInfo = { id: '0x123', fieldType: '0x456' };
      cache.priceFeedObjectIdCache.set('key', '0x789');
      expect(cache.priceTableInfo?.id).toBe('0x123');
      expect(cache.priceFeedObjectIdCache.get('key')).toBe('0x789');
    });
  });
});
