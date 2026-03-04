import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { PositionUpdated } from '../../src/_generated/bucket_v2_cdp/events.js';
import { coinWithBalance } from '../../src/utils/transaction.js';
import {
  afterFileEnd,
  afterTestDelay,
  assertDryRunSucceeds,
  bucketClient,
  depositAmountForBorrowUsd,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  testAccount,
  txWithSender,
} from './helpers/setup.js';

type SuiEvent = { eventType: string; bcs: Uint8Array };

describe('E2E CDP', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it(
    'buildManagePositionTransaction: fixed deposit/borrow, event shape',
    async () => {
      const depositAmount = 1 * 10 ** 9; // 1 SUI
      const borrowAmount = 0.8 * 10 ** 6; // 0.8 USDB
      const tx = txWithSender();
      const [, usdbCoin] = await bucketClient.buildManagePositionTransaction(tx, {
        coinType: SUI_TYPE_ARG,
        depositCoinOrAmount: depositAmount,
        borrowAmount,
      });
      tx.transferObjects([usdbCoin], testAccount);
      const dryrunRes = await assertDryRunSucceeds(tx, { include: { events: true } });
      const events = (dryrunRes as { Transaction?: { events?: SuiEvent[] } }).Transaction!.events!;
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
      const borrowAmount = 1 * 10 ** 6; // 1 USDB
      const depositAmount = await depositAmountForBorrowUsd(1);
      expect(depositAmount).toBeGreaterThan(0);

      const tx = txWithSender();
      const [, usdbCoin] = await bucketClient.buildManagePositionTransaction(tx, {
        coinType: SUI_TYPE_ARG,
        depositCoinOrAmount: depositAmount,
        borrowAmount,
      });
      tx.transferObjects([usdbCoin], testAccount);
      const dryrunRes = await assertDryRunSucceeds(tx, { include: { events: true } });
      const events = (dryrunRes as { Transaction?: { events?: SuiEvent[] } }).Transaction!.events!;
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
      const depositAmount = await depositAmountForBorrowUsd(1);
      const borrowAmount = 1 * 10 ** 6;
      const tx = txWithSender();
      const depositCoin = coinWithBalance({ type: 'gas', balance: depositAmount });
      const [, usdbCoin] = await bucketClient.buildManagePositionTransaction(tx, {
        coinType: SUI_TYPE_ARG,
        depositCoinOrAmount: depositCoin,
        borrowAmount,
      });
      tx.transferObjects([usdbCoin], testAccount);
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'buildManagePositionTransaction with useGasCoin:false uses SUI coins instead of gas',
    async () => {
      const depositAmount = await depositAmountForBorrowUsd(1);
      const borrowAmount = 1 * 10 ** 6;
      const tx = txWithSender();
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
      await assertDryRunSucceeds(tx);
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
        return;
      }
      const tx = txWithSender();
      const [collateralCoin, repayCoin] = await bucketClient.buildClosePositionTransaction(tx, {
        address: testAccount,
        coinType: SUI_TYPE_ARG,
      });
      if (repayCoin) tx.transferObjects([repayCoin], testAccount);
      tx.transferObjects([collateralCoin], testAccount);
      await assertDryRunSucceeds(tx);
    },
    MAINNET_TIMEOUT_MS,
  );
});
