import { describe, expect, it } from 'vitest';

import { MAINNET_TIMEOUT_MS, bucketClient } from './helpers/setup.js';

describe('E2E Supply & pools', () => {
  it(
    'getUsdbSupply returns non-negative bigint',
    async () => {
      const supply = await bucketClient.getUsdbSupply();
      expect(typeof supply).toBe('bigint');
      expect(supply).toBeGreaterThanOrEqual(0n);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAllSavingPoolObjects returns pools with SavingPoolInfo shape',
    async () => {
      const pools = await bucketClient.getAllSavingPoolObjects();
      expect(typeof pools).toBe('object');
      expect(Object.keys(pools).length).toBeGreaterThan(0);
      for (const [lpType, pool] of Object.entries(pools)) {
        expect(pool).toHaveProperty('lpType', lpType);
        expect(typeof pool.lpSupply).toBe('bigint');
        expect(typeof pool.usdbBalance).toBe('bigint');
        expect(typeof pool.savingRate).toBe('number');
        expect(typeof pool.rewardRate).toBe('object');
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAllPsmPoolObjects returns pools with PsmPoolInfo shape',
    async () => {
      const pools = await bucketClient.getAllPsmPoolObjects();
      expect(typeof pools).toBe('object');
      expect(Object.keys(pools).length).toBeGreaterThan(0);
      for (const [coinType, pool] of Object.entries(pools)) {
        expect(pool).toHaveProperty('coinType', coinType);
        expect(typeof pool.decimal).toBe('number');
        expect(typeof pool.balance).toBe('bigint');
        expect(typeof pool.usdbSupply).toBe('bigint');
        expect(pool.feeRate).toHaveProperty('swapIn');
        expect(pool.feeRate).toHaveProperty('swapOut');
        expect(typeof pool.partnerFeeRate).toBe('object');
      }
    },
    MAINNET_TIMEOUT_MS,
  );
});
