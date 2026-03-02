import { Transaction } from '@mysten/sui/transactions';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildPythPriceUpdateCalls,
  fetchPriceFeedsUpdateDataFromHermes,
  PythCache,
} from '@/utils/pyth.js';

import { mockFetchFail, mockFetchOk } from '../../__mocks__/fetch.js';
import { PYTH_CONFIG, SUI_PYTH_PRICE_ID } from '../../fixtures/pyth-config.js';

const HERMES_ENDPOINT = 'https://hermes.pyth.network';

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
      await expect(
        fetchPriceFeedsUpdateDataFromHermes(HERMES_ENDPOINT, [SUI_PYTH_PRICE_ID]),
      ).rejects.toThrow('Hermes price fetch failed');
    });

    it('throws when Hermes returns no binary data', async () => {
      vi.stubGlobal('fetch', mockFetchOk({ binary: {} }));
      await expect(
        fetchPriceFeedsUpdateDataFromHermes(HERMES_ENDPOINT, [SUI_PYTH_PRICE_ID]),
      ).rejects.toThrow('Hermes returned no binary price data');
    });

    it('throws when Hermes returns empty data array', async () => {
      vi.stubGlobal('fetch', mockFetchOk({ binary: { data: [] } }));
      await expect(
        fetchPriceFeedsUpdateDataFromHermes(HERMES_ENDPOINT, [SUI_PYTH_PRICE_ID]),
      ).rejects.toThrow('Hermes returned no binary price data');
    });
  });

  describe('buildPythPriceUpdateCalls', () => {
    it('throws when updates array is empty', async () => {
      const tx = new Transaction();
      const client = {} as Parameters<typeof buildPythPriceUpdateCalls>[1];
      await expect(
        buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [], [], undefined),
      ).rejects.toThrow('No price update data provided');
    });

    it('throws when more than one update is provided', async () => {
      const tx = new Transaction();
      const client = {} as Parameters<typeof buildPythPriceUpdateCalls>[1];
      const dummyUpdate = new Uint8Array(100);
      await expect(
        buildPythPriceUpdateCalls(tx, client, PYTH_CONFIG, [dummyUpdate, dummyUpdate], ['0xabc'], undefined),
      ).rejects.toThrow('Only a single accumulator message is supported');
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
