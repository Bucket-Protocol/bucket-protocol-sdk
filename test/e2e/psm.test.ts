import { Transaction } from '@mysten/sui/transactions';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { coinWithBalance } from '../../src/utils/transaction.js';
import {
  afterFileEnd,
  afterTestDelay,
  bucketClient,
  getUsdbCoinType,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  suiClient,
  testAccount,
  usdcCoinType,
} from './helpers/setup.js';

describe('E2E PSM', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it(
    'buildPSMSwapInTransaction: 1 USDC -> USDB, dry run and balance delta',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const amount = 1 * 10 ** 6;
      const usdcCoin = coinWithBalance({ type: usdcCoinType, balance: amount });
      const usdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
        coinType: usdcCoinType,
        inputCoinOrAmount: usdcCoin,
      });
      tx.transferObjects([usdbCoin], testAccount);
      const dryrunRes = await suiClient.simulateTransaction({
        transaction: tx,
        include: { balanceChanges: true },
      });
      expect(dryrunRes.$kind).toBe('Transaction');
      const balanceChanges = (dryrunRes.Transaction ?? dryrunRes.FailedTransaction)!.balanceChanges!;
      const usdbType = await getUsdbCoinType();
      expect(balanceChanges.find((c) => c.coinType === usdcCoinType)?.amount).toBe('-1000000');
      expect(balanceChanges.find((c) => c.coinType === usdbType)?.amount).toBe('1000000');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'buildPSMSwapOutTransaction: 1 USDB -> USDC, dry run succeeds',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const amount = 1 * 10 ** 6;
      const usdbCoin = coinWithBalance({ type: await getUsdbCoinType(), balance: amount });
      const usdcCoin = await bucketClient.buildPSMSwapOutTransaction(tx, {
        coinType: usdcCoinType,
        usdbCoinOrAmount: usdbCoin,
      });
      tx.transferObjects([usdcCoin], testAccount);
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'buildPSMSwapOutTransaction with balance as bigint',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const amount = 1n * 10n ** 6n;
      const usdbCoin = coinWithBalance({ type: await getUsdbCoinType(), balance: amount });
      const usdcCoin = await bucketClient.buildPSMSwapOutTransaction(tx, {
        coinType: usdcCoinType,
        usdbCoinOrAmount: usdbCoin,
      });
      tx.transferObjects([usdcCoin], testAccount);
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );
});
