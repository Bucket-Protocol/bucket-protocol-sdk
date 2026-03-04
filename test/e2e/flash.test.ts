import { Transaction } from '@mysten/sui/transactions';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { coinWithBalance } from '../../src/utils/transaction.js';
import {
  afterFileEnd,
  afterTestDelay,
  bucketClient,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  suiClient,
  testAccount,
  usdcCoinType,
} from './helpers/setup.js';

describe('E2E Flash', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it(
    'flashMint 1000 USDB then flashBurn',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const amount = 1_000 * 10 ** 6;
      const feeAmount = amount * 0.0005;
      const [usdbCoin, flashMintReceipt] = await bucketClient.flashMint(tx, { amount });
      const feeCollateralCoin = coinWithBalance({ type: usdcCoinType, balance: feeAmount });
      const feeUsdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
        coinType: usdcCoinType,
        inputCoinOrAmount: feeCollateralCoin,
      });
      tx.mergeCoins(usdbCoin, [feeUsdbCoin]);
      await bucketClient.flashBurn(tx, { usdbCoin, flashMintReceipt });
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );
});
