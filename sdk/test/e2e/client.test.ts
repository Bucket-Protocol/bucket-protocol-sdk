import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { describe, expect, it } from 'vitest';

import { BucketV2Client } from '@/client';
import { COIN_TYPES } from '@/consts/coin';

describe('Interacting with Bucket Client on mainnet', () => {
  const network = 'mainnet';
  const testAccount = '0x26266b1381bcf03ab3acc37c1e87beffb52d49f345248bc3efb9114176990ae4';
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  const bucketClient = new BucketV2Client({ suiClient, network });
  const usdbCoinType = bucketClient.getUsdbCoinType();
  const usdcCoinType = '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';
  const usdtCoinType = '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT';

  //   it('test usdbCoinType()', async () => {
  //     const usdbMetadata = await suiClient.getCoinMetadata({
  //       coinType: usdbCoinType,
  //     });
  //     expect(usdbMetadata?.decimals).toBe(6);
  //     expect(usdbMetadata?.symbol).toBe('USDB');
  //     expect(usdbMetadata?.name).toBe('Bucket USD');
  //   });
  //
  //   it('test aggregatePrice()', async () => {
  //     const coinTypes = [
  //       ...bucketClient.getAllCollateralTypes(),
  //       '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
  //     ];
  //     const tx = new Transaction();
  //     await bucketClient.aggregatePrices(tx, { coinTypes });
  //     tx.setSender(testAccount);
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(coinTypes.length * 2);
  //     type PriceResult = { result: string };
  //     const [suiPriceResult, btcPriceResult, walPriceResult, usdcPriceResult] = dryrunRes.events.slice(coinTypes.length);
  //     const pricePrecision = 10 ** 9;
  //     expect(+(suiPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeGreaterThan(1);
  //     expect(+(suiPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeLessThan(1000);
  //     expect(+(btcPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeGreaterThan(1000);
  //     expect(+(btcPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeLessThan(1000000);
  //     expect(+(walPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeGreaterThan(0.01);
  //     expect(+(walPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeLessThan(10);
  //     expect(+(usdcPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeGreaterThan(0.99);
  //     expect(+(usdcPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeLessThan(1.01);
  //   });
  //
  //   it('test buildManagePositionTransaction()', async () => {
  //     const depositAmount = 1 * 10 ** 9; // 1 SUI
  //     const borrowAmount = 1 * 10 ** 6; // 1 USDB
  //     const tx = new Transaction();
  //     const [, usdbCoin] = await bucketClient.buildManagePositionTransaction(
  //       tx,
  //       {
  //         coinType: SUI_TYPE_ARG,
  //         depositAmount,
  //         borrowAmount,
  //       },
  //       testAccount,
  //     );
  //     tx.transferObjects([usdbCoin], testAccount);
  //     tx.setSender(testAccount);
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(4);
  //     const [, , positionUpdatedEvent, mintUSDBEvent] = dryrunRes.events;
  //     const mintUSDBEventData = mintUSDBEvent.parsedJson as {
  //       amount: string;
  //     };
  //     expect(+mintUSDBEventData.amount).toBe(borrowAmount);
  //     const positionUpdatedEventData = positionUpdatedEvent.parsedJson as {
  //       vault_id: string;
  //       coll_type: string;
  //       debtor: string;
  //       deposit_amount: string;
  //       borrow_amount: string;
  //       withdraw_amount: string;
  //       repay_amount: string;
  //       interest_amount: string;
  //       current_coll_amount: string;
  //       current_debt_amount: string;
  //       memo: string;
  //     };
  //     expect(positionUpdatedEventData.debtor).toBe(testAccount);
  //     expect(+positionUpdatedEventData.deposit_amount).toBe(depositAmount);
  //     expect(+positionUpdatedEventData.borrow_amount).toBe(borrowAmount);
  //     expect(+positionUpdatedEventData.withdraw_amount).toBe(0);
  //     expect(+positionUpdatedEventData.repay_amount).toBe(0);
  //     expect(positionUpdatedEventData.memo).toBe('cdp_manage');
  //   });
  //
  //   it('test psmSwapIn()', async () => {
  //     // tx
  //     const tx = new Transaction();
  //     tx.setSender(testAccount);
  //
  //     const amount = 1 * 10 ** 6; // 1 USDC
  //
  //     const usdcCoin = coinWithBalance({ type: usdcCoinType, useGasCoin: false, balance: amount });
  //     const usdtCoin = coinWithBalance({ type: usdtCoinType, useGasCoin: false, balance: amount });
  //     const usdbCoin1 = await bucketClient.buildPSMSwapInTransaction(tx, {
  //       coinType: usdcCoinType,
  //       inputCoin: usdcCoin,
  //     });
  //     const usdbCoin2 = await bucketClient.buildPSMSwapInTransaction(tx, {
  //       coinType: usdtCoinType,
  //       inputCoin: usdtCoin,
  //     });
  //
  //     tx.transferObjects([usdbCoin1, usdbCoin2], testAccount);
  //
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.balanceChanges.find((c) => c.coinType === usdcCoinType)?.amount).toBe('-1000000');
  //     expect(dryrunRes.balanceChanges.find((c) => c.coinType === usdtCoinType)?.amount).toBe('-1000000');
  //     expect(dryrunRes.balanceChanges.find((c) => c.coinType === usdbCoinType)?.amount).toBe('1997000');
  //   });
  //
  //   it('test flashMint 1000 USDB with default fee config', async () => {
  //     // tx
  //     const tx = new Transaction();
  //     tx.setSender(testAccount);
  //
  //     const amount = 1_000 * 10 ** 6; // 1000 USDB
  //     const feeAmount = amount * 0.0005;
  //
  //     // flash mint
  //     const [usdbCoin, flashMintReceipt] = bucketClient.flashMint(tx, { amount });
  //     const feeCollateralCoin = coinWithBalance({ type: usdcCoinType, useGasCoin: false, balance: feeAmount });
  //     const feeUsdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
  //       coinType: usdcCoinType,
  //       inputCoin: feeCollateralCoin,
  //     });
  //     tx.mergeCoins(usdbCoin, [feeUsdbCoin]);
  //     bucketClient.flashBurn(tx, { usdbCoin, flashMintReceipt });
  //
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(8);
  //   });
  // });
  //
  // describe('Interacting with Bucket Client on testnet', () => {
  //   const network = 'testnet';
  //   const testAccount = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
  //   const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  //   const bucketClient = new BucketV2Client({ suiClient, network });
  //
  //   it('test psmSwapIn()', async () => {
  //     // tx
  //     const tx = new Transaction();
  //     tx.setSender(testAccount);
  //
  //     const amount = 0.1 * 10 ** 6; // 1 USDC
  //     const coinType = COIN_TYPES.USDC;
  //
  //     const inputCoin = coinWithBalance({ type: coinType, useGasCoin: false, balance: amount });
  //     const usdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
  //       coinType,
  //       inputCoin,
  //     });
  //
  //     tx.transferObjects([usdbCoin], testAccount);
  //
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(4);
  //   });
  //
  //   it('test psmSwapOut()', async () => {
  //     // tx
  //     const tx = new Transaction();
  //     tx.setSender(testAccount);
  //
  //     const amount = 0.1 * 10 ** 6; // 1 USDB
  //     const usdbCoin = coinWithBalance({ type: COIN_TYPES.USDB, useGasCoin: false, balance: amount });
  //
  //     const inputCoin = await bucketClient.buildPSMSwapOutTransaction(tx, {
  //       coinType: COIN_TYPES.USDC,
  //       usdbCoin,
  //     });
  //
  //     tx.transferObjects([inputCoin], testAccount);
  //
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(5);
  //   });
  //
  //   it('test flashMint 1 USDB with default fee config', async () => {
  //     // tx
  //     const tx = new Transaction();
  //     tx.setSender(testAccount);
  //
  //     const amount = 0.1 * 10 ** 6; // 1 USDB
  //     const feeAmount = (amount * 30) / 10000;
  //     const coinType = COIN_TYPES.USDC;
  //
  //     // flash mint
  //     const [usdbCoin, flashMintReceipt] = bucketClient.flashMint(tx, { amount });
  //     const feeCollateralCoin = coinWithBalance({ type: coinType, useGasCoin: false, balance: feeAmount });
  //     const feeUsdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
  //       coinType,
  //       inputCoin: feeCollateralCoin,
  //     });
  //     tx.mergeCoins(usdbCoin, [feeUsdbCoin]);
  //     bucketClient.flashBurn(tx, { usdbCoin, flashMintReceipt });
  //
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(8);
  //   });
  //
  //   it('test psmSwapIn then deposit to saving pool', async () => {
  //     // tx
  //     const tx = new Transaction();
  //     tx.setSender(testAccount);
  //
  //     const amount = 0.1 * 10 ** 6; // 0.1 USDB
  //     const coinType = COIN_TYPES.USDC;
  //     const inputCoin = coinWithBalance({ type: coinType, useGasCoin: false, balance: amount });
  //
  //     // psmSwapIn
  //     const usdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
  //       coinType,
  //       inputCoin,
  //     });
  //
  //     await bucketClient.buildDepositToSavingPoolTransaction(tx, {
  //       savingPoolType: 'Allen',
  //       account: testAccount,
  //       usdbCoin,
  //     });
  //
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(6);
  //   });
  //
  //   it('test deposit to saving pool', async () => {
  //     // tx
  //     const tx = new Transaction();
  //     tx.setSender(testAccount);
  //
  //     const amount = 0.1 * 10 ** 6; // 0.1 USDB
  //
  //     const usdbCoin = coinWithBalance({ type: COIN_TYPES.USDB, useGasCoin: false, balance: amount });
  //     await bucketClient.buildDepositToSavingPoolTransaction(tx, {
  //       savingPoolType: 'Allen',
  //       account: testAccount,
  //       usdbCoin,
  //     });
  //
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(2);
  //   });
  //
  //   it('test withdraw from saving pool', async () => {
  //     // tx
  //     const tx = new Transaction();
  //     tx.setSender(testAccount);
  //
  //     const amount = 0.1 * 10 ** 6; // 0.1 SUSDB
  //
  //     const usdbCoin = await bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
  //       savingPoolType: 'Allen',
  //       amount,
  //     });
  //
  //     tx.transferObjects([usdbCoin], testAccount);
  //
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(2);
  //   });
  //
  //   it('test claim from saving pool', async () => {
  //     // tx
  //     const tx = new Transaction();
  //     tx.setSender(testAccount);
  //
  //     const rewardCoins = await bucketClient.buildClaimRewardsFromSavingPoolTransaction(tx, {
  //       savingPoolType: 'Allen',
  //     });
  //
  //     tx.transferObjects([...rewardCoins], testAccount);
  //
  //     const dryrunRes = await suiClient.dryRunTransactionBlock({
  //       transactionBlock: await tx.build({ client: suiClient }),
  //     });
  //
  //     expect(dryrunRes.effects.status.status).toBe('success');
  //     expect(dryrunRes.events.length).toBe(1);
  //   });
  // it('test usdbCoinType()', async () => {
  //   const bucketClient = new BucketV2Client();
  //   const usdbCoinType = bucketClient.usdbCoinType();
  //   const usdbMetadata = await bucketClient.getSuiClient().getCoinMetadata({
  //     coinType: usdbCoinType,
  //   });
  //   expect(usdbMetadata?.decimals).toBe(6);
  //   expect(usdbMetadata?.symbol).toBe('USDB');
  //   expect(usdbMetadata?.name).toBe('Bucket USD');
  // });
  //
  // it('test aggregatePrice()', async () => {
  //   const bucketClient = new BucketV2Client({
  //     sender: '0x95b0ce9775382b88a4e698d31a0a7fd796922c91bb80de66e940bd4cae5a9916',
  //   });
  //   const suiClient = bucketClient.getSuiClient();
  //   bucketClient.resetTransaction();
  //   bucketClient.tx.setSender(bucketClient.sender);
  //   const coinTypes = bucketClient.getCDPCollateralTypes();
  //   await bucketClient.aggregatePrices({ coinTypes });
  //   const tx = bucketClient.getTransaction();
  //   const dryrunRes = await suiClient.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client: suiClient }),
  //   });
  //   expect(dryrunRes.effects.status.status).toBe('success');
  //   expect(dryrunRes.events.length).toBe(coinTypes.length * 2);
  //   type PriceResult = { result: string };
  //   const [suiPriceResult, btcPriceResult, walPriceResult] = dryrunRes.events.slice(coinTypes.length);
  //   const pricePrecision = 10 ** 9;
  //   expect(+(suiPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeGreaterThan(1);
  //   expect(+(suiPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeLessThan(1000);
  //   expect(+(btcPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeGreaterThan(1000);
  //   expect(+(btcPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeLessThan(1000000);
  //   expect(+(walPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeGreaterThan(0.01);
  //   expect(+(walPriceResult.parsedJson as PriceResult).result / pricePrecision).toBeLessThan(10);
  // });
  //
  // it('test buildManagePositionTransaction()', async () => {
  //   const bucketClient = new BucketV2Client({
  //     sender: '0x95b0ce9775382b88a4e698d31a0a7fd796922c91bb80de66e940bd4cae5a9916',
  //   });
  //   const suiClient = bucketClient.getSuiClient();
  //   const depositAmount = 1 * 10 ** 9; // 1 SUI
  //   const borrowAmount = 1 * 10 ** 6; // 1 USDB
  //   const tx = await bucketClient.buildManagePositionTransaction({
  //     collateralCoinType: SUI_TYPE_ARG,
  //     depositAmount,
  //     borrowAmount,
  //   });
  //   const dryrunRes = await suiClient.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client: suiClient }),
  //   });
  //   expect(dryrunRes.effects.status.status).toBe('success');
  //   expect(dryrunRes.events.length).toBe(4);
  //   const [, , positionUpdatedEvent, mintUSDBEvent] = dryrunRes.events;
  //   const mintUSDBEventData = mintUSDBEvent.parsedJson as {
  //     amount: string;
  //   };
  //   expect(+mintUSDBEventData.amount).toBe(borrowAmount);
  //   const positionUpdatedEventData = positionUpdatedEvent.parsedJson as {
  //     vault_id: string;
  //     coll_type: string;
  //     debtor: string;
  //     deposit_amount: string;
  //     borrow_amount: string;
  //     withdraw_amount: string;
  //     repay_amount: string;
  //     interest_amount: string;
  //     current_coll_amount: string;
  //     current_debt_amount: string;
  //     memo: string;
  //   };
  //   expect(positionUpdatedEventData.debtor).toBe(bucketClient.sender);
  //   expect(+positionUpdatedEventData.deposit_amount).toBe(depositAmount);
  //   expect(+positionUpdatedEventData.borrow_amount).toBe(borrowAmount);
  //   expect(+positionUpdatedEventData.withdraw_amount).toBe(0);
  //   expect(+positionUpdatedEventData.repay_amount).toBe(0);
  //   expect(positionUpdatedEventData.memo).toBe('cdp_manage');
  // });
  it('test getAllPSMPool() on testnet', async () => {
    const network = 'testnet';
    const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
    const bucketClient = new BucketV2Client({ suiClient, network });
    const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';

    // const psmPools = await bucketClient.getAllPSMPool();
    // const savingPools = await bucketClient.getAllSavingPool();
    // const rewards = await bucketClient.getSavingPoolRewards('Allen');
    const lpBalance = await bucketClient.getUserSavingPoolBalance('Allen', sender);
    const lpValue = await bucketClient.getUserSavingPoolValue('Allen', sender);

    console.log({ lpBalance, lpValue });
  });

  // it('test psmSwapIn() on testnet', async () => {
  //   const network = 'testnet';
  //   const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
  //   const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  //   const bucketClient = new BucketV2Client({ suiClient, network });
  //
  //   // tx
  //   const tx = new Transaction();
  //   tx.setSender(sender);
  //
  //   const amount = 0.1 * 10 ** 6; // 1 USDC
  //   const coinType = COIN_TYPES.USDC;
  //
  //   const collateralCoin = coinWithBalance({ type: coinType, useGasCoin: false, balance: amount });
  //   const usdbCoin = await bucketClient.buildPSMSwapInTransaction(
  //     tx,
  //     {
  //       coinType,
  //       collateralCoin,
  //     },
  //     sender,
  //   );
  //
  //   tx.transferObjects([usdbCoin], sender);
  //
  //   const dryrunRes = await suiClient.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client: suiClient }),
  //   });
  //   expect(dryrunRes.effects.status.status).toBe('success');
  //   expect(dryrunRes.events.length).toBe(4);
  // });
  //
  // it('test psmSwapOut() on testnet', async () => {
  //   const network = 'testnet';
  //   const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
  //   const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  //   const bucketClient = new BucketV2Client({ suiClient, network });
  //
  //   // tx
  //   const tx = new Transaction();
  //   tx.setSender(sender);
  //
  //   const amount = 0.1 * 10 ** 6; // 1 USDB
  //   const usdbCoin = coinWithBalance({ type: COIN_TYPES.USDB, useGasCoin: false, balance: amount });
  //
  //   const collateralCoin = await bucketClient.buildPSMSwapOutTransaction(
  //     tx,
  //     {
  //       coinType: COIN_TYPES.USDC,
  //       usdbCoin,
  //     },
  //     sender,
  //   );
  //
  //   tx.transferObjects([collateralCoin], sender);
  //
  //   const dryrunRes = await suiClient.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client: suiClient }),
  //   });
  //
  //   expect(dryrunRes.effects.status.status).toBe('success');
  //   expect(dryrunRes.events.length).toBe(5);
  // });
  //
  // it('test flashMint 1 USDB with default fee config on testnet', async () => {
  //   const network = 'testnet';
  //   const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
  //   const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  //   const bucketClient = new BucketV2Client({ suiClient, network });
  //
  //   // tx
  //   const tx = new Transaction();
  //   tx.setSender(sender);
  //
  //   const amount = 0.1 * 10 ** 6; // 1 USDB
  //   const feeAmount = (amount * 30) / 10000;
  //   const coinType = COIN_TYPES.USDC;
  //
  //   // flash mint
  //   const [usdbCoin, flashMintReceipt] = bucketClient.flashMint(tx, { amount });
  //   const feeCollateralCoin = coinWithBalance({ type: coinType, useGasCoin: false, balance: feeAmount });
  //   const feeUsdbCoin = await bucketClient.buildPSMSwapInTransaction(
  //     tx,
  //     {
  //       coinType,
  //       collateralCoin: feeCollateralCoin,
  //     },
  //     sender,
  //   );
  //   tx.mergeCoins(usdbCoin, [feeUsdbCoin]);
  //   bucketClient.flashBurn(tx, { usdbCoin, flashMintReceipt });
  //
  //   const dryrunRes = await suiClient.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client: suiClient }),
  //   });
  //
  //   expect(dryrunRes.effects.status.status).toBe('success');
  //   expect(dryrunRes.events.length).toBe(8);
  // });
  //
  // it('test psmSwapIn then deposit to saving pool', async () => {
  //   const network = 'testnet';
  //   const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
  //   const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  //   const bucketClient = new BucketV2Client({ suiClient, network });
  //
  //   // tx
  //   const tx = new Transaction();
  //   tx.setSender(sender);
  //
  //   const amount = 0.1 * 10 ** 6; // 0.1 USDB
  //   const coinType = COIN_TYPES.USDC;
  //   const collateralCoin = coinWithBalance({ type: coinType, useGasCoin: false, balance: amount });
  //
  //   // psmSwapIn
  //   const usdbCoin = await bucketClient.buildPSMSwapInTransaction(
  //     tx,
  //     {
  //       coinType,
  //       collateralCoin,
  //     },
  //     sender,
  //   );
  //
  //   await bucketClient.buildDepositToSavingPoolTransaction(
  //     tx,
  //     {
  //       savingPoolType: 'Allen',
  //       account: sender,
  //       usdbCoin,
  //     },
  //     sender,
  //   );
  //
  //   const dryrunRes = await suiClient.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client: suiClient }),
  //   });
  //
  //   expect(dryrunRes.effects.status.status).toBe('success');
  //   expect(dryrunRes.events.length).toBe(6);
  // });
  //
  // it('test deposit to saving pool', async () => {
  //   const network = 'testnet';
  //   const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
  //   const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  //   const bucketClient = new BucketV2Client({ suiClient, network });
  //
  //   // tx
  //   const tx = new Transaction();
  //   tx.setSender(sender);
  //
  //   const amount = 0.1 * 10 ** 6; // 0.1 USDB
  //
  //   const usdbCoin = coinWithBalance({ type: COIN_TYPES.USDB, useGasCoin: false, balance: amount });
  //   await bucketClient.buildDepositToSavingPoolTransaction(
  //     tx,
  //     {
  //       savingPoolType: 'Allen',
  //       account: sender,
  //       usdbCoin,
  //     },
  //     sender,
  //   );
  //
  //   const dryrunRes = await suiClient.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client: suiClient }),
  //   });
  //
  //   expect(dryrunRes.effects.status.status).toBe('success');
  //   expect(dryrunRes.events.length).toBe(2);
  // });
  //
  // it('test withdraw from saving pool', async () => {
  //   const network = 'testnet';
  //   const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
  //   const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  //   const bucketClient = new BucketV2Client({ suiClient, network });
  //
  //   // tx
  //   const tx = new Transaction();
  //   tx.setSender(sender);
  //
  //   const amount = 0.1 * 10 ** 6; // 0.1 SUSDB
  //
  //   const usdbCoin = await bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
  //     savingPoolType: 'Allen',
  //     amount,
  //   });
  //
  //   tx.transferObjects([usdbCoin], sender);
  //
  //   const dryrunRes = await suiClient.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client: suiClient }),
  //   });
  //
  //   expect(dryrunRes.effects.status.status).toBe('success');
  //   expect(dryrunRes.events.length).toBe(2);
  // });
  //
  // it('test claim from saving pool', async () => {
  //   const network = 'testnet';
  //   const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
  //   const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  //   const bucketClient = new BucketV2Client({ suiClient, network });
  //
  //   // tx
  //   const tx = new Transaction();
  //   tx.setSender(sender);
  //
  //   const rewardCoins = await bucketClient.buildClaimRewardsFromSavingPoolTransaction(tx, {
  //     savingPoolType: 'Allen',
  //   });
  //
  //   tx.transferObjects([...rewardCoins], sender);
  //
  //   const dryrunRes = await suiClient.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client: suiClient }),
  //   });
  //
  //   expect(dryrunRes.effects.status.status).toBe('success');
  //   expect(dryrunRes.events.length).toBe(1);
  // });
});
