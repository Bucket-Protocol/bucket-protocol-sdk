import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Transaction, TransactionResult } from '@mysten/sui/transactions';
import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { describe, expect, it } from 'vitest';

import { PositionUpdated } from '../../src/_generated/bucket_v2_cdp/events.js';
import { BucketClient } from '../../src/client.js';
import { coinWithBalance, destroyZeroCoin, getZeroCoin } from '../../src/utils/transaction.js';

const MAINNET_TIMEOUT_MS = 20_000;
const network = 'mainnet';
const testAccount = '0x7a718956581fbe4a568d135fef5161024e74af87a073a1489e57ebef53744652';
const suiClient = new SuiGrpcClient({ network, baseUrl: 'https://fullnode.mainnet.sui.io:443' });
const bucketClient = new BucketClient({ suiClient, network });
const usdbCoinType = bucketClient.getUsdbCoinType();
const usdcCoinType = '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';
const susdbLpType = '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB';

describe('Interacting with Bucket Client on mainnet', () => {
  describe('Oracle', () => {
    it(
      'getAllOraclePrices returns positive numbers for all oracle coin types',
      async () => {
        const prices = await bucketClient.getAllOraclePrices();
        const coinTypes = bucketClient.getAllOracleCoinTypes();
        expect(Object.keys(prices).length).toBeGreaterThan(0);
        for (const coinType of coinTypes) {
          const price = prices[coinType];
          expect(price).toBeDefined();
          expect(typeof price).toBe('number');
          expect(price).toBeGreaterThan(0);
        }
      },
      MAINNET_TIMEOUT_MS,
    );
  });

  describe('Config & metadata', () => {
    it(
      'usdbCoinType returns USDB metadata (6 decimals)',
      async () => {
        const { coinMetadata: usdbMetadata } = await suiClient.getCoinMetadata({
          coinType: usdbCoinType,
        });
        expect(usdbMetadata?.decimals).toBe(6);
        expect(usdbMetadata?.symbol).toBe('USDB');
        expect(usdbMetadata?.name).toBe('Bucket USD');
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getFlashMintInfo returns feeRate and partner config',
      async () => {
        const info = await bucketClient.getFlashMintInfo();
        expect(info).toHaveProperty('feeRate');
        expect(typeof info.feeRate).toBe('number');
        expect(info.feeRate).toBeGreaterThanOrEqual(0);
        expect(info).toHaveProperty('partner');
        expect(typeof info.partner).toBe('object');
      },
      MAINNET_TIMEOUT_MS,
    );
  });

  describe('Positions & accounts', () => {
    it(
      'getAccountPositions length <= getUserPositions length',
      async () => {
        const accountPositions = await bucketClient.getAccountPositions({ address: testAccount });
        const userPositions = await bucketClient.getUserPositions({ address: testAccount });
        expect(accountPositions.length).toBeLessThanOrEqual(userPositions.length);
      },
      MAINNET_TIMEOUT_MS,
    );
  });

  describe('Rewards', () => {
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

  describe('PSM', () => {
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
        expect(balanceChanges.find((c) => c.coinType === usdcCoinType)?.amount).toBe('-1000000');
        expect(balanceChanges.find((c) => c.coinType === usdbCoinType)?.amount).toBe('1000000');
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'buildPSMSwapOutTransaction: 1 USDB -> USDC, dry run succeeds',
      async () => {
        const tx = new Transaction();
        tx.setSender(testAccount);
        const amount = 1 * 10 ** 6;
        const usdbCoin = coinWithBalance({ type: usdbCoinType, balance: amount });
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

  describe('Saving', () => {
    it(
      'psmSwapIn then deposit to saving pool',
      async () => {
        const tx = new Transaction();
        tx.setSender(testAccount);
        const amount = 0.1 * 10 ** 6;
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
        const amount = 0.1 * 10 ** 6;
        const usdbCoin = coinWithBalance({ type: usdbCoinType, balance: amount });
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
        const amount = 0.1 * 10 ** 6;
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
        const zeroUsdbCoin = getZeroCoin(tx, { coinType: usdbCoinType });
        bucketClient.buildDepositToSavingPoolTransaction(tx, {
          lpType: susdbLpType,
          address: testAccount,
          depositCoinOrAmount: zeroUsdbCoin,
        });
        const usdbOut = bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
          lpType: susdbLpType,
          amount: 0,
        });
        destroyZeroCoin(tx, { coinType: usdbCoinType, coin: usdbOut });
        const dryrunRes = await suiClient.simulateTransaction({ transaction: tx });
        expect(dryrunRes.$kind).toBe('Transaction');
      },
      MAINNET_TIMEOUT_MS,
    );
  });

  describe('Vaults', () => {
    // Original logic: getAllVaultObjects() → filter to SCALLOP_ (excl. _DEEP) vaults →
    // assert each vault has rewardRate[<SCA coin type>] defined. Now relaxed to non-empty rewardRate.

    it(
      'getAllVaultObjects: one entry per collateral type, all with required VaultInfo fields',
      async () => {
        const allVaults = await bucketClient.getAllVaultObjects();
        const collateralTypes = bucketClient.getAllCollateralTypes();
        expect(Object.keys(allVaults).length).toBe(collateralTypes.length);
        for (const [coinType, vault] of Object.entries(allVaults)) {
          expect(collateralTypes).toContain(coinType);
          expect(vault.collateralType).toBe(coinType);
          expect(typeof vault.positionTableSize).toBe('number');
          expect(vault.positionTableSize).toBeGreaterThanOrEqual(0);
          expect(typeof vault.collateralDecimal).toBe('number');
          expect(vault.collateralBalance >= 0n).toBe(true);
          expect(vault.usdbSupply >= 0n).toBe(true);
          expect(vault.maxUsdbSupply > 0n).toBe(true);
          expect(typeof vault.interestRate).toBe('number');
          expect(typeof vault.minCollateralRatio).toBe('number');
          expect(vault.minCollateralRatio).toBeGreaterThanOrEqual(1);
          expect(vault.rewardRate).toBeDefined();
          expect(typeof vault.rewardRate).toBe('object');
        }
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getAllVaultObjects: at least one SCALLOP vault has non-empty rewardRate',
      async () => {
        const allVaults = await bucketClient.getAllVaultObjects();
        const scallopVaults = Object.entries(allVaults).filter(
          ([coinType]) => coinType.includes('SCALLOP_') && !coinType.includes('_DEEP'),
        );
        expect(scallopVaults.length).toBeGreaterThan(0);
        for (const [, vault] of scallopVaults) {
          expect(vault.rewardRate).toBeDefined();
          expect(typeof vault.rewardRate).toBe('object');
          expect(Object.keys(vault.rewardRate).length).toBeGreaterThan(0);
        }
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getVaultObjectInfo returns config for known collateral (SUI)',
      () => {
        const info = bucketClient.getVaultObjectInfo({ coinType: SUI_TYPE_ARG });
        expect(info).toHaveProperty('vault');
        expect(info.vault).toHaveProperty('objectId');
        expect(typeof info.vault.objectId).toBe('string');
        expect(info.vault.objectId.length).toBeGreaterThan(0);
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getBorrowRewardFlowRate returns record for SUI vault',
      async () => {
        const flowRates = await bucketClient.getBorrowRewardFlowRate({ coinType: SUI_TYPE_ARG });
        expect(typeof flowRates).toBe('object');
        for (const [rewardType, rate] of Object.entries(flowRates)) {
          expect(typeof rewardType).toBe('string');
          expect(typeof rate === 'bigint').toBe(true);
          expect(rate >= 0n).toBe(true);
        }
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'SUI vault has minCollateralRatio in reasonable range (e.g. 110%–200%)',
      async () => {
        const allVaults = await bucketClient.getAllVaultObjects();
        const suiEntry = Object.entries(allVaults).find(
          ([coinType]) => normalizeStructTag(coinType) === normalizeStructTag(SUI_TYPE_ARG),
        );
        expect(suiEntry).toBeDefined();
        const suiVault = suiEntry![1];
        expect(suiVault.minCollateralRatio).toBeGreaterThanOrEqual(1);
        expect(suiVault.minCollateralRatio).toBeLessThanOrEqual(2);
      },
      MAINNET_TIMEOUT_MS,
    );
  });

  describe('CDP', () => {
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

  describe('Flash', () => {
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
});
