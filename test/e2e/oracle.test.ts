import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  afterFileEnd,
  afterTestDelay,
  assertDryRunSucceeds,
  bucketClient,
  getPricedOracleCoinTypes,
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

  // `getAllOraclePrices` itself would abort on the unpriced coin types, so this
  // prices every other oracle coin type in one batch instead.
  it(
    'getOraclePrices returns positive numbers for all priced oracle coin types',
    async () => {
      const coinTypes = await getPricedOracleCoinTypes();
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
    'getOraclePrices with subset (simple alternative) returns prices',
    async () => {
      const allCoinTypes = await getPricedOracleCoinTypes();
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

  /**
   * The Pyth read end to end, with nothing mocked: the real on-chain resolver
   * supplies the `PriceInfoObject`, `pyth_rule::feed` receives it as it stands, and
   * the resulting PTB dry-runs successfully.
   *
   * Depends on mainnet's SUI price object sitting inside `pyth_rule`'s 30s tolerance,
   * which other protocols' transactions keep it comfortably within. If it ever does
   * go stale this aborts `ERiskyPrice` unless the remaining sources clear the weight
   * threshold on their own.
   */
  it(
    'prices SUI from the Pyth price object as it stands, with no price update',
    async () => {
      const tx = txWithSender();
      const priceResults = await bucketClient.aggregatePrices(tx, { coinTypes: [SUI_TYPE_ARG] });
      expect(priceResults.length).toBe(1);

      const targets = tx
        .getData()
        .commands.flatMap((command) =>
          command.$kind === 'MoveCall' ? [`${command.MoveCall.module}::${command.MoveCall.function}`] : [],
        );
      // The rule is still fed — omitting it would abort EMissingPriceSource...
      expect(targets).toContain('pyth_rule::feed');
      // ...and nothing a VAA update would add is there.
      expect(targets).not.toContain('vaa::parse_and_verify');
      expect(targets).not.toContain('pyth::update_single_price_feed');
      expect(targets).not.toContain('pyth::create_authenticated_price_infos_using_accumulator');

      // The aggregate still resolves on-chain, which is the whole point.
      await assertDryRunSucceeds(tx);

      const prices = await bucketClient.getOraclePrices({ coinTypes: [SUI_TYPE_ARG] });
      expect(prices[SUI_TYPE_ARG]).toBeGreaterThan(0);
    },
    MAINNET_TIMEOUT_MS,
  );
});
