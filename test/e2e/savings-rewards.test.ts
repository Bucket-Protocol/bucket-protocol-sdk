import { Transaction, TransactionResult } from '@mysten/sui/transactions';
import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { describe, expect, it } from 'vitest';

import {
  MAINNET_TIMEOUT_MS,
  bucketClient,
  suiClient,
  susdbLpType,
  testAccount,
} from './helpers/setup.js';

describe('E2E Savings & rewards', () => {
  it(
    'getUserSavings returns array with SavingInfo shape',
    async () => {
      const savings = await bucketClient.getUserSavings({ address: testAccount });
      expect(Array.isArray(savings)).toBe(true);
      for (const s of savings) {
        expect(s).toHaveProperty('lpType');
        expect(s).toHaveProperty('address', testAccount);
        expect(typeof s.usdbBalance).toBe('bigint');
        expect(typeof s.lpBalance).toBe('bigint');
        expect(s.rewards == null || typeof s.rewards === 'object').toBe(true);
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
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
        for (const [rewardType, amount] of Object.entries(suiRewards)) {
          expect(typeof amount).toBe('bigint');
          expect(amount).toBeGreaterThanOrEqual(0n);
        }
      }
      // May be empty if vault has no rewarders
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
      for (const [, vaultRewards] of Object.entries(rewards)) {
        if (vaultRewards) {
          for (const amount of Object.values(vaultRewards)) {
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
      for (const [rewardType, rate] of Object.entries(flowRates)) {
        expect(typeof rate).toBe('bigint');
        expect(rate).toBeGreaterThanOrEqual(0n);
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAccountSavingPoolRewards returns record for SUSDB',
    async () => {
      const rewards = await bucketClient.getAccountSavingPoolRewards({
        address: testAccount,
        lpTypes: [susdbLpType],
      });
      expect(typeof rewards).toBe('object');
      const susdbRewards = rewards[susdbLpType];
      if (susdbRewards) {
        for (const [rewardType, amount] of Object.entries(susdbRewards)) {
          expect(typeof amount).toBe('bigint');
          expect(amount).toBeGreaterThanOrEqual(0n);
        }
      }
      // May be empty if pool has no reward types
    },
    MAINNET_TIMEOUT_MS,
  );
});

describe('E2E Rewards', () => {
  it(
    'buildClaimBorrowRewardsTransaction dry run succeeds and has reward balance changes',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const result = bucketClient.getAllCollateralTypes().reduce(
        (acc, coinType) => {
          const rewardsRecord = bucketClient.buildClaimBorrowRewardsTransaction(tx, { coinType });
          for (const [ct, rewardCoin] of Object.entries(rewardsRecord)) {
            if (acc[ct]) tx.mergeCoins(acc[ct], [rewardCoin]);
            else acc[ct] = rewardCoin;
          }
          return acc;
        },
        {} as Record<string, TransactionResult>,
      );
      tx.transferObjects(Object.values(result), testAccount);
      const dryrunRes = await suiClient.simulateTransaction({
        transaction: tx,
        include: { balanceChanges: true },
      });
      expect(dryrunRes.$kind).toBe('Transaction');
      const balanceChanges = (dryrunRes.Transaction ?? dryrunRes.FailedTransaction)!.balanceChanges!;
      expect(balanceChanges.length).toBeGreaterThanOrEqual(1);
      for (const bc of balanceChanges) {
        if (normalizeStructTag(bc.coinType) !== normalizeStructTag('0x2::sui::SUI')) {
          expect(Number(bc.amount)).toBeGreaterThan(0);
        }
      }
    },
    MAINNET_TIMEOUT_MS,
  );
});
