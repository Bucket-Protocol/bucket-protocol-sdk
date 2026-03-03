import { Transaction } from '@mysten/sui/transactions';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { coinWithBalance, destroyZeroCoin, getZeroCoin } from '../../src/utils/transaction.js';
import {
  afterFileEnd,
  afterTestDelay,
  bucketClient,
  getUsdbCoinType,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  suiClient,
  susdbLpType,
  testAccount,
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
      const tx = new Transaction();
      tx.setSender(testAccount);
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
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'deposit to saving pool',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const amount = TEST_AMOUNT_USDB;
      const usdbCoin = coinWithBalance({ type: getUsdbCoinType(), balance: amount });
      bucketClient.buildDepositToSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        address: testAccount,
        depositCoinOrAmount: usdbCoin,
      });
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'withdraw from saving pool',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const amount = TEST_AMOUNT_USDB;
      const usdbCoin = bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        amount,
      });
      tx.transferObjects([usdbCoin], testAccount);
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'claim from saving pool',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const rewardsRecord = bucketClient.buildClaimSavingRewardsTransaction(tx, {
        lpType: susdbLpType,
      });
      tx.transferObjects(Object.values(rewardsRecord), testAccount);
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'deposit/withdraw zero to saving pool',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const zeroUsdbCoin = getZeroCoin(tx, { coinType: getUsdbCoinType() });
      bucketClient.buildDepositToSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        address: testAccount,
        depositCoinOrAmount: zeroUsdbCoin,
      });
      const usdbOut = bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        amount: 0,
      });
      destroyZeroCoin(tx, { coinType: getUsdbCoinType(), coin: usdbOut });
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'deposit zero via coinWithBalance(balance:0) exercises resolver zero-coin path',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const zeroUsdbCoin = coinWithBalance({ type: getUsdbCoinType(), balance: 0 });
      bucketClient.buildDepositToSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        address: testAccount,
        depositCoinOrAmount: zeroUsdbCoin,
      });
      const usdbOut = bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
        lpType: susdbLpType,
        amount: 0,
      });
      destroyZeroCoin(tx, { coinType: getUsdbCoinType(), coin: usdbOut });
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );
});
