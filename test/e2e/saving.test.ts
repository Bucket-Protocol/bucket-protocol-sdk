import { afterAll, afterEach, beforeAll, describe, it } from 'vitest';

import { coinWithBalance, destroyZeroCoin, getZeroCoin } from '../../src/utils/transaction.js';
import {
  afterFileEnd,
  afterTestDelay,
  assertDryRunSucceeds,
  bucketClient,
  getUsdbCoinType,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  susdbLpType,
  testAccount,
  txWithSender,
  usdcCoinType,
} from './helpers/setup.js';

const TEST_AMOUNT_USDB = 0.1 * 10 ** 6;

describe('E2E Saving', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it(
    'psmSwapIn then deposit to saving pool',
    async () => {
      const tx = txWithSender();
      const amount = TEST_AMOUNT_USDB;
      const usdcCoin = coinWithBalance({ type: usdcCoinType, balance: amount });
      const usdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
        coinType: usdcCoinType,
        inputCoinOrAmount: usdcCoin,
      });
      bucketClient.buildDepositToSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        address: testAccount,
        depositCoinOrAmount: usdbCoin,
      });
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'deposit to saving pool',
    async () => {
      const tx = txWithSender();
      const amount = TEST_AMOUNT_USDB;
      const usdbCoin = coinWithBalance({ type: getUsdbCoinType(), balance: amount });
      bucketClient.buildDepositToSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        address: testAccount,
        depositCoinOrAmount: usdbCoin,
      });
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'withdraw from saving pool',
    async () => {
      const tx = txWithSender();
      const amount = TEST_AMOUNT_USDB;
      const usdbCoin = bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        amount,
      });
      tx.transferObjects([usdbCoin], testAccount);
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'claim from saving pool',
    async () => {
      const tx = txWithSender();
      const rewardsRecord = bucketClient.buildClaimSavingRewardsTransaction(tx, {
        lpType: susdbLpType,
      });
      tx.transferObjects(Object.values(rewardsRecord), testAccount);
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'deposit/withdraw zero to saving pool',
    async () => {
      const tx = txWithSender();
      const usdbType = getUsdbCoinType();
      const zeroUsdbCoin = getZeroCoin(tx, { coinType: usdbType });
      bucketClient.buildDepositToSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        address: testAccount,
        depositCoinOrAmount: zeroUsdbCoin,
      });
      const usdbOut = bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        amount: 0,
      });
      destroyZeroCoin(tx, { coinType: usdbType, coin: usdbOut });
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'deposit zero via coinWithBalance(balance:0) exercises resolver zero-coin path',
    async () => {
      const tx = txWithSender();
      const usdbType = getUsdbCoinType();
      const zeroUsdbCoin = coinWithBalance({ type: usdbType, balance: 0 });
      bucketClient.buildDepositToSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        address: testAccount,
        depositCoinOrAmount: zeroUsdbCoin,
      });
      const usdbOut = bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        amount: 0,
      });
      destroyZeroCoin(tx, { coinType: usdbType, coin: usdbOut });
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );
});
