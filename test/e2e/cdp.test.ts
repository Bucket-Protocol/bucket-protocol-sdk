import { Transaction } from '@mysten/sui/transactions';
import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { describe, expect, it } from 'vitest';

import { PositionUpdated } from '../../src/_generated/bucket_v2_cdp/events.js';
import { coinWithBalance } from '../../src/utils/transaction.js';

import {
  MAINNET_TIMEOUT_MS,
  bucketClient,
  suiClient,
  testAccount,
} from './helpers/setup.js';

describe('E2E CDP', () => {
  it(
    'buildManagePositionTransaction: fixed deposit/borrow, event shape',
    async () => {
      const depositAmount = 1 * 10 ** 9; // 1 SUI
      const borrowAmount = 0.8 * 10 ** 6; // 0.8 USDB
      const tx = new Transaction();
      tx.setSender(testAccount);
      const [, usdbCoin] = await bucketClient.buildManagePositionTransaction(tx, {
        coinType: SUI_TYPE_ARG,
        depositCoinOrAmount: depositAmount,
        borrowAmount,
      });
      tx.transferObjects([usdbCoin], testAccount);
      const dryrunRes = await suiClient.simulateTransaction({
        transaction: tx,
        include: { events: true },
      });
      expect(dryrunRes.$kind).toBe('Transaction');
      const events = (dryrunRes.Transaction ?? dryrunRes.FailedTransaction)!.events!;
      const positionUpdatedEvent = events.find((e) => e.eventType.includes('PositionUpdated'));
      expect(positionUpdatedEvent).toBeDefined();
      if (!positionUpdatedEvent) return;
      const data = PositionUpdated.parse(positionUpdatedEvent.bcs);
      expect(data.debtor).toBe(testAccount);
      expect(+data.deposit_amount).toBe(depositAmount);
      expect(+data.borrow_amount).toBe(borrowAmount);
      expect(+data.withdraw_amount).toBe(0);
      expect(+data.repay_amount).toBe(0);
      expect(data.memo).toBe('cdp_manage');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'buildManagePositionTransaction: borrow 1 USDB at CR 110% using live SUI price',
    async () => {
      // CR = collateral_value / debt_value; min CR = 110%. USDB = 1 USD.
      // So: deposit_sui * sui_price_usd >= 1.1 * 1 => deposit_sui >= 1.1 / sui_price_usd.
      // Use 1.15x buffer to stay safely above 110%. SUI has 9 decimals.
      const prices = await bucketClient.getOraclePrices({ coinTypes: [SUI_TYPE_ARG] });
      const suiPrice = prices[SUI_TYPE_ARG];
      expect(suiPrice).toBeDefined();
      expect(suiPrice).toBeGreaterThan(0);
      const borrowAmount = 1 * 10 ** 6; // 1 USDB
      const minCollateralValueUsd = 1.15; // 115% of 1 USDB
      const depositAmount = Math.ceil((minCollateralValueUsd / suiPrice) * 10 ** 9); // SUI 9 decimals
      expect(depositAmount).toBeGreaterThan(0);

      const tx = new Transaction();
      tx.setSender(testAccount);
      const [, usdbCoin] = await bucketClient.buildManagePositionTransaction(tx, {
        coinType: SUI_TYPE_ARG,
        depositCoinOrAmount: depositAmount,
        borrowAmount,
      });
      tx.transferObjects([usdbCoin], testAccount);
      const dryrunRes = await suiClient.simulateTransaction({
        transaction: tx,
        include: { events: true },
      });
      expect(dryrunRes.$kind).toBe('Transaction');
      const events = (dryrunRes.Transaction ?? dryrunRes.FailedTransaction)!.events!;
      const positionUpdatedEvent = events.find((e) => e.eventType.includes('PositionUpdated'));
      expect(positionUpdatedEvent).toBeDefined();
      if (!positionUpdatedEvent) return;
      const data = PositionUpdated.parse(positionUpdatedEvent.bcs);
      expect(data.debtor).toBe(testAccount);
      expect(+data.deposit_amount).toBe(depositAmount);
      expect(+data.borrow_amount).toBe(borrowAmount);
      expect(+data.withdraw_amount).toBe(0);
      expect(+data.repay_amount).toBe(0);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'buildManagePositionTransaction with type:gas uses gas coin as collateral',
    async () => {
      const prices = await bucketClient.getOraclePrices({ coinTypes: [SUI_TYPE_ARG] });
      const suiPrice = prices[SUI_TYPE_ARG];
      expect(suiPrice).toBeDefined();
      const depositAmount = Math.ceil((1.15 / suiPrice) * 10 ** 9);
      const borrowAmount = 1 * 10 ** 6;
      const tx = new Transaction();
      tx.setSender(testAccount);
      const depositCoin = coinWithBalance({ type: 'gas', balance: depositAmount });
      const [, usdbCoin] = await bucketClient.buildManagePositionTransaction(tx, {
        coinType: SUI_TYPE_ARG,
        depositCoinOrAmount: depositCoin,
        borrowAmount,
      });
      tx.transferObjects([usdbCoin], testAccount);
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'buildManagePositionTransaction with useGasCoin:false uses SUI coins instead of gas',
    async () => {
      const prices = await bucketClient.getOraclePrices({ coinTypes: [SUI_TYPE_ARG] });
      const suiPrice = prices[SUI_TYPE_ARG];
      expect(suiPrice).toBeDefined();
      const depositAmount = Math.ceil((1.15 / suiPrice) * 10 ** 9);
      const borrowAmount = 1 * 10 ** 6;
      const tx = new Transaction();
      tx.setSender(testAccount);
      const depositCoin = coinWithBalance({
        type: SUI_TYPE_ARG,
        balance: depositAmount,
        useGasCoin: false,
      });
      const [, usdbCoin] = await bucketClient.buildManagePositionTransaction(tx, {
        coinType: SUI_TYPE_ARG,
        depositCoinOrAmount: depositCoin,
        borrowAmount,
      });
      tx.transferObjects([usdbCoin], testAccount);
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'buildClosePositionTransaction dry run succeeds when account has SUI position',
    async () => {
      const positions = await bucketClient.getAccountPositions({ address: testAccount });
      const hasSuiPosition = positions.some(
        (p) => normalizeStructTag(p.collateralType) === normalizeStructTag(SUI_TYPE_ARG) && p.debtAmount > 0n,
      );
      if (!hasSuiPosition) {
        return; // skip: no SUI position to close
      }
      const tx = new Transaction();
      tx.setSender(testAccount);
      const [collateralCoin, repayCoin] = bucketClient.buildClosePositionTransaction(tx, {
        address: testAccount,
        coinType: SUI_TYPE_ARG,
      });
      if (repayCoin) tx.transferObjects([repayCoin], testAccount);
      tx.transferObjects([collateralCoin], testAccount);
      const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
      expect(dryrunRes.$kind).toBe('Transaction');
    },
    MAINNET_TIMEOUT_MS,
  );
});
