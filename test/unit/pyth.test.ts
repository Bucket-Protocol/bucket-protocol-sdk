import { Transaction } from '@mysten/sui/transactions';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildPythPriceUpdateCalls,
  fetchPriceFeedsUpdateDataFromHermes,
  PythCache,
  type PythConfig,
} from '../../src/utils/pyth.js';

describe('pyth utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchPriceFeedsUpdateDataFromHermes', () => {
    it('returns empty array when priceIds is empty', async () => {
      const result = await fetchPriceFeedsUpdateDataFromHermes('https://hermes.pyth.network', []);
      expect(result).toEqual([]);
    });

    it('throws when Hermes returns non-ok response', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          text: () => Promise.resolve('Internal Server Error'),
        }),
      );
      await expect(
        fetchPriceFeedsUpdateDataFromHermes('https://hermes.pyth.network', [
          '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744',
        ]),
      ).rejects.toThrow('Hermes price fetch failed');
    });

    it('throws when Hermes returns no binary data', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ binary: {} }) }));
      await expect(
        fetchPriceFeedsUpdateDataFromHermes('https://hermes.pyth.network', [
          '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744',
        ]),
      ).rejects.toThrow('Hermes returned no binary price data');
    });

    it('throws when Hermes returns empty data array', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ binary: { data: [] } }) }));
      await expect(
        fetchPriceFeedsUpdateDataFromHermes('https://hermes.pyth.network', [
          '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744',
        ]),
      ).rejects.toThrow('Hermes returned no binary price data');
    });
  });

  describe('buildPythPriceUpdateCalls', () => {
    const config: PythConfig = {
      pythStateId: '0x1f9310238ee9298fb703c3419030b35b22bb1cc37113e3bb5007c99aec79e5b8',
      wormholeStateId: '0xaeab97f96cf9877fee2883315d459552b2b921edc16d7ceac6eab944dd88919c',
    };

    it('throws when updates array is empty', async () => {
      const tx = new Transaction();
      const client = {} as Parameters<typeof buildPythPriceUpdateCalls>[1];
      await expect(
        buildPythPriceUpdateCalls(tx, client, config, [], [], undefined),
      ).rejects.toThrow('No price update data provided');
    });

    it('throws when more than one update is provided', async () => {
      const tx = new Transaction();
      const client = {} as Parameters<typeof buildPythPriceUpdateCalls>[1];
      const dummyUpdate = new Uint8Array(100);
      await expect(
        buildPythPriceUpdateCalls(tx, client, config, [dummyUpdate, dummyUpdate], ['0xabc'], undefined),
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
