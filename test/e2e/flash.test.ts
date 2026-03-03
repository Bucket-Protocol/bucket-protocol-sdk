import { Transaction } from '@mysten/sui/transactions';
import { describe, expect, it } from 'vitest';

import { coinWithBalance } from '../../src/utils/transaction.js';
import { bucketClient, MAINNET_TIMEOUT_MS, suiClient, testAccount, usdcCoinType } from './helpers/setup.js';

describe('E2E Flash', () => {
  it(
    'flashMint 1000 USDB then flashBurn',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const amount = 1_000 * 10 ** 6;
      const feeAmount = amount * 0.0005;
      const [usdbCoin, flashMintReceipt] = bucketClient.flashMint(tx, { amount });
      const feeCollateralCoin = coinWithBalance({ type: usdcCoinType, balance: feeAmount });
      const feeUsdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
        coinType: usdcCoinType,
        inputCoinOrAmount: feeCollateralCoin,
      });
      tx.mergeCoins(usdbCoin, [feeUsdbCoin]);
      bucketClient.flashBurn(tx, { usdbCoin, flashMintReceipt });
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );
});
