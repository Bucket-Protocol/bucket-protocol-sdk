import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  afterFileEnd,
  afterTestDelay,
  bucketClient,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  susdbLpType,
  testAccount,
} from './helpers/setup.js';

describe('E2E Savings & rewards', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it.skip(
    'getUserSavings returns array with SavingInfo shape',
    async () => {
      const savings = await bucketClient.getUserSavings({ address: testAccount });
      expect(Array.isArray(savings)).toBe(true);
      for (const s of savings) {
        expect(s).toHaveProperty('lpType');
        expect(s).toHaveProperty('address', testAccount);
        expect(typeof s.usdbBalance).toBe('bigint');
        expect(typeof s.lpBalance).toBe('bigint');
        expect(s.rewards === null || s.rewards === undefined || typeof s.rewards === 'object').toBe(true);
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it.skip(
    'getAccountSavings returns array (same or subset of getUserSavings)',
    async () => {
      const accountSavings = await bucketClient.getAccountSavings({ address: testAccount });
      const userSavings = await bucketClient.getUserSavings({ address: testAccount });
      expect(accountSavings.length).toBeLessThanOrEqual(userSavings.length);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAccountBorrowRewards returns record for SUI vault',
    async () => {
      const rewards = await bucketClient.getAccountBorrowRewards({
        address: testAccount,
        coinTypes: [SUI_TYPE_ARG],
      });
      expect(typeof rewards).toBe('object');
      const suiKey = Object.keys(rewards).find((k) => normalizeStructTag(k) === normalizeStructTag(SUI_TYPE_ARG));
      const suiRewards = suiKey ? rewards[suiKey] : undefined;
      if (suiRewards) {
        for (const [, amount] of Object.entries(suiRewards)) {
          expect(typeof amount).toBe('bigint');
          expect(amount).toBeGreaterThanOrEqual(0n);
        }
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAccountBorrowRewards with multiple collateral types exercises vault iteration',
    async () => {
      const coinTypes = bucketClient.getAllCollateralTypes().slice(0, 3);
      const rewards = await bucketClient.getAccountBorrowRewards({
        address: testAccount,
        coinTypes,
      });
      expect(typeof rewards).toBe('object');
      expect(Object.keys(rewards).length).toBeGreaterThanOrEqual(1);
      for (const coinType of coinTypes) {
        if (rewards[coinType]) {
          for (const amount of Object.values(rewards[coinType]!)) {
            expect(typeof amount).toBe('bigint');
            expect(amount).toBeGreaterThanOrEqual(0n);
          }
        }
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getSavingPoolRewardFlowRate returns record for SUSDB',
    async () => {
      const flowRates = await bucketClient.getSavingPoolRewardFlowRate({ lpType: susdbLpType });
      expect(typeof flowRates).toBe('object');
      expect(Object.keys(flowRates).length).toBeGreaterThan(0);
      for (const [, rate] of Object.entries(flowRates)) {
        expect(typeof rate).toBe('bigint');
        expect(rate).toBeGreaterThanOrEqual(0n);
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it.skip(
    'getAccountSavingPoolRewards returns record for SUSDB',
    async () => {
      const rewards = await bucketClient.getAccountSavingPoolRewards({
        address: testAccount,
        lpTypes: [susdbLpType],
      });
      expect(typeof rewards).toBe('object');
      expect(rewards).toHaveProperty(susdbLpType);
      const susdbRewards = rewards[susdbLpType]!;
      for (const [, amount] of Object.entries(susdbRewards)) {
        expect(typeof amount).toBe('bigint');
        expect(amount).toBeGreaterThanOrEqual(0n);
      }
    },
    MAINNET_TIMEOUT_MS,
  );
});
