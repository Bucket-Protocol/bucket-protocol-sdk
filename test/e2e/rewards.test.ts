import { Transaction, TransactionResult } from '@mysten/sui/transactions';
import { normalizeStructTag } from '@mysten/sui/utils';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  afterFileEnd,
  afterTestDelay,
  bucketClient,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  suiClient,
  testAccount,
} from './helpers/setup.js';

describe('E2E Rewards', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it(
    'buildClaimBorrowRewardsTransaction dry run succeeds and has reward balance changes',
    async () => {
      const tx = new Transaction();
      tx.setSender(testAccount);
      const collateralTypes = await bucketClient.getAllCollateralTypes();
      const result: Record<string, TransactionResult> = {};
      for (const coinType of collateralTypes) {
        const rewardsRecord = await bucketClient.buildClaimBorrowRewardsTransaction(tx, { coinType });
        for (const [ct, rewardCoin] of Object.entries(rewardsRecord)) {
          if (result[ct]) tx.mergeCoins(result[ct], [rewardCoin]);
          else result[ct] = rewardCoin;
        }
      }
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
