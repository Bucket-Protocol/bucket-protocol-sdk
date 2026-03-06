import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  afterFileEnd,
  afterTestDelay,
  assertDryRunSucceeds,
  bucketClient,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  suiClient,
  txWithSender,
} from './helpers/setup.js';

describe('E2E Oracle', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(afterTestDelay);

  // Expect this to fail until Scallop upgrade or batching: fetching all 26 triggers version::assert_current_version abort.
  it(
    'getAllOraclePrices returns positive numbers for all oracle coin types',
    async () => {
      const prices = await bucketClient.getAllOraclePrices();
      const coinTypes = await bucketClient.getAllOracleCoinTypes();
      expect(Object.keys(prices).length).toBeGreaterThan(0);
      for (const coinType of coinTypes) {
        const price = prices[coinType];
        expect(price).toBeDefined();
        expect(typeof price).toBe('number');
        expect(price).toBeGreaterThan(0);
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getOraclePrices with subset (simple alternative) returns prices',
    async () => {
      const allCoinTypes = await bucketClient.getAllOracleCoinTypes();
      const coinTypes = allCoinTypes.slice(0, 2);
      expect(coinTypes.length).toBeGreaterThan(0);
      const prices = await bucketClient.getOraclePrices({ coinTypes });
      expect(Object.keys(prices).length).toBeGreaterThan(0);
      for (const coinType of coinTypes) {
        const price = prices[coinType];
        expect(price).toBeDefined();
        expect(typeof price).toBe('number');
        expect(price).toBeGreaterThan(0);
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getOraclePrices twice with same coins exercises PythCache (second call hits cache)',
    async () => {
      const coinTypes = (await bucketClient.getAllOracleCoinTypes()).slice(0, 1);
      expect(coinTypes.length).toBeGreaterThan(0);

      const getObjectSpy = vi.spyOn(suiClient, 'getObject');

      const prices1 = await bucketClient.getOraclePrices({ coinTypes });
      expect(prices1[coinTypes[0]!]).toBeDefined();
      expect(prices1[coinTypes[0]!]).toBeGreaterThan(0);

      getObjectSpy.mockClear();
      const prices2 = await bucketClient.getOraclePrices({ coinTypes });
      expect(getObjectSpy).toHaveBeenCalledTimes(0);
      expect(prices2[coinTypes[0]!]).toBeDefined();
      expect(prices2[coinTypes[0]!]).toBeGreaterThan(0);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'aggregatePrices returns price results and dry run succeeds',
    async () => {
      const tx = txWithSender();
      const priceResults = await bucketClient.aggregatePrices(tx, {
        coinTypes: [SUI_TYPE_ARG],
      });
      expect(Array.isArray(priceResults)).toBe(true);
      expect(priceResults.length).toBe(1);
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'newPriceCollector creates collector for coin type',
    async () => {
      const tx = txWithSender();
      const collector = bucketClient.newPriceCollector(tx, { coinType: SUI_TYPE_ARG });
      expect(collector).toBeDefined();
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );
});
