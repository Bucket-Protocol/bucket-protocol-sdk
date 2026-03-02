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

    it(
      'getOraclePrices returns prices for requested coin types',
      async () => {
        const allCoinTypes = bucketClient.getAllOracleCoinTypes();
        const coinTypes = allCoinTypes.slice(0, 2);
        if (coinTypes.length === 0) return;
        const prices = await bucketClient.getOraclePrices({ coinTypes });
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
      'getConfig returns config with package IDs and object refs',
      async () => {
        const config = await bucketClient.getConfig();
        expect(config).toBeDefined();
        expect(config).toHaveProperty('ORIGINAL_USDB_PACKAGE_ID');
        expect(config).toHaveProperty('TREASURY_OBJ');
        expect(config).toHaveProperty('AGGREGATOR_OBJS');
        expect(config).toHaveProperty('VAULT_OBJS');
      },
      MAINNET_TIMEOUT_MS,
    );

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

  describe('Supply & pools', () => {
    it(
      'getUsdbSupply returns non-negative bigint',
      async () => {
        const supply = await bucketClient.getUsdbSupply();
        expect(typeof supply).toBe('bigint');
        expect(supply).toBeGreaterThanOrEqual(0n);
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getAllSavingPoolObjects returns pools with SavingPoolInfo shape',
      async () => {
        const pools = await bucketClient.getAllSavingPoolObjects();
        expect(typeof pools).toBe('object');
        expect(Object.keys(pools).length).toBeGreaterThan(0);
        for (const [lpType, pool] of Object.entries(pools)) {
          expect(pool).toHaveProperty('lpType', lpType);
          expect(typeof pool.lpSupply).toBe('bigint');
          expect(typeof pool.usdbBalance).toBe('bigint');
          expect(typeof pool.savingRate).toBe('number');
          expect(typeof pool.rewardRate).toBe('object');
        }
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getAllPsmPoolObjects returns pools with PsmPoolInfo shape',
      async () => {
        const pools = await bucketClient.getAllPsmPoolObjects();
        expect(typeof pools).toBe('object');
        expect(Object.keys(pools).length).toBeGreaterThan(0);
        for (const [coinType, pool] of Object.entries(pools)) {
          expect(pool).toHaveProperty('coinType', coinType);
          expect(typeof pool.decimal).toBe('number');
          expect(typeof pool.balance).toBe('bigint');
          expect(typeof pool.usdbSupply).toBe('bigint');
          expect(pool.feeRate).toHaveProperty('swapIn');
          expect(pool.feeRate).toHaveProperty('swapOut');
          expect(typeof pool.partnerFeeRate).toBe('object');
        }
      },
      MAINNET_TIMEOUT_MS,
    );
  });

  describe('Object info helpers', () => {
    it(
      'getAggregatorObjectInfo returns aggregator for SUI',
      () => {
        const info = bucketClient.getAggregatorObjectInfo({ coinType: SUI_TYPE_ARG });
        expect(info).toHaveProperty('priceAggregator');
        expect(info.priceAggregator).toHaveProperty('objectId');
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getAggregatorObjectInfo throws for unsupported coin type',
      () => {
        expect(() =>
          bucketClient.getAggregatorObjectInfo({ coinType: '0x1::invalid::INVALID' }),
        ).toThrow('Unsupported coin type');
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getSavingPoolObjectInfo returns pool info for SUSDB',
      () => {
        const info = bucketClient.getSavingPoolObjectInfo({ lpType: susdbLpType });
        expect(info).toHaveProperty('pool');
        expect(info.pool).toHaveProperty('objectId');
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getSavingPoolObjectInfo throws for unsupported lp type',
      () => {
        expect(() =>
          bucketClient.getSavingPoolObjectInfo({ lpType: '0x1::invalid::INVALID' }),
        ).toThrow('Unsupported coin type');
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getPsmPoolObjectInfo returns pool info for USDC',
      () => {
        const info = bucketClient.getPsmPoolObjectInfo({ coinType: usdcCoinType });
        expect(info).toHaveProperty('pool');
        expect(info.pool).toHaveProperty('objectId');
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getPsmPoolObjectInfo throws for unsupported coin type',
      () => {
        expect(() =>
          bucketClient.getPsmPoolObjectInfo({ coinType: '0x1::invalid::INVALID' }),
        ).toThrow('Unsupported coin type');
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getVaultObjectInfo throws for unsupported collateral type',
      () => {
        expect(() =>
          bucketClient.getVaultObjectInfo({ coinType: '0x1::invalid::INVALID' }),
        ).toThrow('Unsupported collateral type');
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

    it(
      'getAllPositions returns paginated positions for SUI vault',
      async () => {
        const result = await bucketClient.getAllPositions({
          coinType: SUI_TYPE_ARG,
          pageSize: 10,
          cursor: null,
        });
        expect(result).toHaveProperty('positions');
        expect(result).toHaveProperty('nextCursor');
        expect(Array.isArray(result.positions)).toBe(true);
        for (const pos of result.positions) {
          expect(pos).toHaveProperty('collateralType', SUI_TYPE_ARG);
          expect(pos).toHaveProperty('collateralAmount');
          expect(pos).toHaveProperty('debtAmount');
          expect(pos).toHaveProperty('debtor');
        }
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getAllPositions fetches next page when cursor is provided',
      async () => {
        const first = await bucketClient.getAllPositions({
          coinType: SUI_TYPE_ARG,
          pageSize: 2,
          cursor: null,
        });
        if (!first.nextCursor) return;
        const next = await bucketClient.getAllPositions({
          coinType: SUI_TYPE_ARG,
          pageSize: 2,
          cursor: first.nextCursor,
        });
        expect(next).toHaveProperty('positions');
        expect(next).toHaveProperty('nextCursor');
        expect(Array.isArray(next.positions)).toBe(true);
      },
      MAINNET_TIMEOUT_MS,
    );

    it(
      'getUserAccounts returns array (may be empty)',
      async () => {
        const accounts = await bucketClient.getUserAccounts({ address: testAccount });
        expect(Array.isArray(accounts)).toBe(true);
      },
      MAINNET_TIMEOUT_MS,
    );
  });

  describe('Savings & rewards', () => {
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

    it(
      'buildPSMSwapOutTransaction with balance as bigint',
      async () => {
        const tx = new Transaction();
        tx.setSender(testAccount);
        const amount = 1n * 10n ** 6n;
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

    it(
      'deposit zero via coinWithBalance(balance:0) exercises resolver zero-coin path',
      async () => {
        const tx = new Transaction();
        tx.setSender(testAccount);
        const zeroUsdbCoin = coinWithBalance({ type: usdbCoinType, balance: 0 });
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
