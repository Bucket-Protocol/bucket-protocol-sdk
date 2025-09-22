import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { describe, expect, it } from 'vitest';

import { BucketClient } from '../../src/client.js';
import { coinWithBalance } from '../../src/utils/transaction.js';

describe('Interacting with Bucket Client on mainnet', () => {
  const network = 'mainnet';
  const testAccount = '0x26266b1381bcf03ab3acc37c1e87beffb52d49f345248bc3efb9114176990ae4';
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  const bucketClient = new BucketClient({ suiClient, network });
  const usdbCoinType = bucketClient.getUsdbCoinType();
  const usdcCoinType = '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';
  const usdtCoinType = '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT';

  it('test usdbCoinType()', async () => {
    const usdbMetadata = await suiClient.getCoinMetadata({
      coinType: usdbCoinType,
    });
    expect(usdbMetadata?.decimals).toBe(6);
    expect(usdbMetadata?.symbol).toBe('USDB');
    expect(usdbMetadata?.name).toBe('Bucket USD');
  }, 20_000);

  it('test getAllOraclePrices()', async () => {
    const prices = await bucketClient.getAllOraclePrices();
    Object.keys(prices).map((coinType) => {
      const price = prices[coinType];
      if (coinType.includes('BTC')) {
        expect(price).toBeLessThan(500000);
        expect(price).toBeGreaterThan(10000);
      } else if (coinType.includes('ETH')) {
        expect(price).toBeLessThan(10000);
        expect(price).toBeGreaterThan(1000);
      } else if (coinType.includes('::USD') || coinType.includes('::BUCK')) {
        expect(price).toBeLessThan(1.1);
        expect(price).toBeGreaterThan(0.9);
      } else {
        expect(price).toBeDefined();
      }
    });
  }, 20_000);

  it('test getAccountPositions() and getUserPositions()', async () => {
    const accountPositions = await bucketClient.getAccountPositions({ address: testAccount });
    const userPositions = await bucketClient.getUserPositions({ address: testAccount });
    expect(accountPositions.length).toBeLessThanOrEqual(userPositions.length);
  }, 20_000);

  it('test buildClaimBorrowRewardsTransaction()', async () => {
    const tx = new Transaction();
    tx.setSender(testAccount);
    bucketClient.getAllCollateralTypes().map((coinType) => {
      const rewards = bucketClient.buildClaimBorrowRewardsTransaction(tx, { coinType });
      if (rewards) tx.transferObjects(rewards, testAccount);
    });
    const res = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });
    expect(res.balanceChanges.length).toBe(3);
    res.balanceChanges.map((bc) => {
      if (normalizeStructTag(bc.coinType) !== normalizeStructTag('0x2::sui::SUI')) {
        expect(Number(bc.amount)).toBeGreaterThan(0);
      }
    });
  }, 20_000);

  it('test psmSwapIn()', async () => {
    // tx
    const tx = new Transaction();
    tx.setSender(testAccount);

    const amount = 1 * 10 ** 6; // 1 USDC

    const usdcCoin = coinWithBalance({ type: usdcCoinType, balance: amount });
    const usdtCoin = coinWithBalance({ type: usdtCoinType, balance: amount });
    const usdbCoin1 = await bucketClient.buildPSMSwapInTransaction(tx, {
      coinType: usdcCoinType,
      inputCoinOrAmount: usdcCoin,
    });
    const usdbCoin2 = await bucketClient.buildPSMSwapInTransaction(tx, {
      coinType: usdtCoinType,
      inputCoinOrAmount: usdtCoin,
    });

    tx.transferObjects([usdbCoin1, usdbCoin2], testAccount);

    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });
    expect(dryrunRes.effects.status.status).toBe('success');
    expect(dryrunRes.balanceChanges.find((c) => c.coinType === usdcCoinType)?.amount).toBe('-1000000');
    expect(dryrunRes.balanceChanges.find((c) => c.coinType === usdtCoinType)?.amount).toBe('-1000000');
    expect(dryrunRes.balanceChanges.find((c) => c.coinType === usdbCoinType)?.amount).toBe('1999500');
  }, 20_000);

  it('test flashMint 1000 USDB with default fee config', async () => {
    // tx
    const tx = new Transaction();
    tx.setSender(testAccount);

    const amount = 1_000 * 10 ** 6; // 1000 USDB
    const feeAmount = amount * 0.0005;

    // flash mint
    const [usdbCoin, flashMintReceipt] = bucketClient.flashMint(tx, { amount });
    const feeCollateralCoin = coinWithBalance({ type: usdcCoinType, balance: feeAmount });
    const feeUsdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
      coinType: usdcCoinType,
      inputCoinOrAmount: feeCollateralCoin,
    });
    tx.mergeCoins(usdbCoin, [feeUsdbCoin]);
    bucketClient.flashBurn(tx, { usdbCoin, flashMintReceipt });

    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });

    expect(dryrunRes.effects.status.status).toBe('success');
  }, 20_000);

  it('test psmSwapIn() then deposit to saving pool', async () => {
    // tx
    const tx = new Transaction();
    tx.setSender(testAccount);

    const amount = 0.1 * 10 ** 6; // 0.1 USDB
    const usdcCoin = coinWithBalance({ type: usdcCoinType, balance: amount });

    // psmSwapIn
    const usdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
      coinType: usdcCoinType,
      inputCoinOrAmount: usdcCoin,
    });

    bucketClient.buildDepositToSavingPoolTransaction(tx, {
      lpType: '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB',
      address: testAccount,
      depositCoinOrAmount: usdbCoin,
    });

    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });

    expect(dryrunRes.effects.status.status).toBe('success');
  }, 20_000);

  it('test deposit to saving pool', async () => {
    // tx
    const tx = new Transaction();
    tx.setSender(testAccount);

    const amount = 0.1 * 10 ** 6; // 0.1 USDB

    const usdbCoin = coinWithBalance({ type: usdbCoinType, balance: amount });
    bucketClient.buildDepositToSavingPoolTransaction(tx, {
      lpType: '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB',
      address: testAccount,
      depositCoinOrAmount: usdbCoin,
    });

    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });

    expect(dryrunRes.effects.status.status).toBe('success');
  }, 20_000);

  it('test withdraw from saving pool', async () => {
    // tx
    const tx = new Transaction();
    tx.setSender(testAccount);

    const amount = 0.1 * 10 ** 6; // 0.1 SUSDB

    const usdbCoin = bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
      lpType: '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB',
      amount,
    });

    tx.transferObjects([usdbCoin], testAccount);

    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });

    expect(dryrunRes.effects.status.status).toBe('success');
  }, 20_000);

  it('test claim from saving pool', async () => {
    // tx
    const tx = new Transaction();
    tx.setSender(testAccount);

    const rewardCoins = bucketClient.buildClaimSavingRewardsTransaction(tx, {
      lpType: '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB',
    });

    tx.transferObjects([...rewardCoins], testAccount);

    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });

    expect(dryrunRes.effects.status.status).toBe('success');
  }, 20_000);

  it('test getAllVaultObjects()', async () => {
    const allVaults = await bucketClient.getAllVaultObjects();
    Object.entries(allVaults)
      .filter(([coinType]) => coinType.includes('SCALLOP_') && !coinType.includes('_DEEP'))
      .map(([, vault]) => {
        expect(
          vault.rewardRate['0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA'],
        ).toBeDefined();
      });
  }, 20_000);

  it('test buildManagePositionTransaction()', async () => {
    const depositAmount = 1 * 10 ** 9; // 1 SUI
    const borrowAmount = 1 * 10 ** 6; // 1 USDB
    const tx = new Transaction();
    tx.setSender(testAccount);

    const [, usdbCoin] = await bucketClient.buildManagePositionTransaction(tx, {
      coinType: SUI_TYPE_ARG,
      depositCoinOrAmount: depositAmount,
      borrowAmount,
    });
    tx.transferObjects([usdbCoin], testAccount);
    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });
    expect(dryrunRes.effects.status.status).toBe('success');
    const positionUpdatedEvent = dryrunRes.events.find((e) => e.type.includes('PositionUpdated'));
    expect(positionUpdatedEvent).toBeDefined();
    if (!positionUpdatedEvent) return;
    const positionUpdatedEventData = positionUpdatedEvent.parsedJson as {
      vault_id: string;
      coll_type: string;
      debtor: string;
      deposit_amount: string;
      borrow_amount: string;
      withdraw_amount: string;
      repay_amount: string;
      interest_amount: string;
      current_coll_amount: string;
      current_debt_amount: string;
      memo: string;
    };
    expect(positionUpdatedEventData.debtor).toBe(testAccount);
    expect(+positionUpdatedEventData.deposit_amount).toBe(depositAmount);
    expect(+positionUpdatedEventData.borrow_amount).toBe(borrowAmount);
    expect(+positionUpdatedEventData.withdraw_amount).toBe(0);
    expect(+positionUpdatedEventData.repay_amount).toBe(0);
    expect(positionUpdatedEventData.memo).toBe('cdp_manage');
  }, 20_000);
});

// describe('Interacting with Bucket Client on testnet', () => {
//   const network = 'testnet';
//   const testAccount = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
//   const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
//   const bucketClient = new BucketClient({ suiClient, network });
//   const usdbCoinType = bucketClient.getUsdbCoinType();
//   const usdcCoinType = '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC';

//   it('test psmSwapIn()', async () => {
//     // tx
//     const tx = new Transaction();
//     tx.setSender(testAccount);

//     const amount = 0.1 * 10 ** 6; // 1 USDC
//     const coinType = usdcCoinType;

//     const inputCoin = coinWithBalance({ type: coinType, balance: amount });
//     const usdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
//       coinType,
//       inputCoinOrAmount: inputCoin,
//     });
//     tx.transferObjects([usdbCoin], testAccount);

//     const dryrunRes = await suiClient.dryRunTransactionBlock({
//       transactionBlock: await tx.build({ client: suiClient }),
//     });
//     expect(dryrunRes.effects.status.status).toBe('success');
//   });

//   it('test psmSwapOut()', async () => {
//     // tx
//     const tx = new Transaction();
//     tx.setSender(testAccount);

//     const amount = 0.1 * 10 ** 6; // 1 USDB
//     const usdbCoin = coinWithBalance({ type: usdbCoinType, balance: amount });

//     const inputCoin = await bucketClient.buildPSMSwapOutTransaction(tx, {
//       coinType: usdcCoinType,
//       usdbCoinOrAmount: usdbCoin,
//     });
//     tx.transferObjects([inputCoin], testAccount);

//     const dryrunRes = await suiClient.dryRunTransactionBlock({
//       transactionBlock: await tx.build({ client: suiClient }),
//     });

//     expect(dryrunRes.effects.status.status).toBe('success');
//   });

//   it('test flashMint 1 USDB with default fee config', async () => {
//     // tx
//     const tx = new Transaction();
//     tx.setSender(testAccount);

//     const amount = 0.1 * 10 ** 6; // 1 USDB
//     const feeAmount = (amount * 30) / 10000;
//     const coinType = usdcCoinType;

//     // flash mint
//     const [usdbCoin, flashMintReceipt] = bucketClient.flashMint(tx, { amount });
//     const feeCollateralCoin = coinWithBalance({ type: coinType, balance: feeAmount });
//     const feeUsdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
//       coinType,
//       inputCoinOrAmount: feeCollateralCoin,
//     });
//     tx.mergeCoins(usdbCoin, [feeUsdbCoin]);
//     bucketClient.flashBurn(tx, { usdbCoin, flashMintReceipt });

//     const dryrunRes = await suiClient.dryRunTransactionBlock({
//       transactionBlock: await tx.build({ client: suiClient }),
//     });

//     expect(dryrunRes.effects.status.status).toBe('success');
//   });

//   it('test psmSwapIn() then deposit to saving pool', async () => {
//     // tx
//     const tx = new Transaction();
//     tx.setSender(testAccount);

//     const amount = 0.1 * 10 ** 6; // 0.1 USDB
//     const usdcCoin = coinWithBalance({ type: usdcCoinType, balance: amount });

//     // psmSwapIn
//     const usdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
//       coinType: usdcCoinType,
//       inputCoinOrAmount: usdcCoin,
//     });

//     bucketClient.buildDepositToSavingPoolTransaction(tx, {
//       lpType: '0x784660d93d9f013f1c77c4bcb2e04a374fdb4038abf2637c75ca27828b2ac18c::allen_susdb::ALLEN_SUSDB',
//       account: testAccount,
//       usdbCoin,
//     });

//     const dryrunRes = await suiClient.dryRunTransactionBlock({
//       transactionBlock: await tx.build({ client: suiClient }),
//     });

//     expect(dryrunRes.effects.status.status).toBe('success');
//   });

//   it('test deposit to saving pool', async () => {
//     // tx
//     const tx = new Transaction();
//     tx.setSender(testAccount);

//     const amount = 0.1 * 10 ** 6; // 0.1 USDB

//     const usdbCoin = coinWithBalance({ type: usdbCoinType, balance: amount });
//     bucketClient.buildDepositToSavingPoolTransaction(tx, {
//       lpType: '0x784660d93d9f013f1c77c4bcb2e04a374fdb4038abf2637c75ca27828b2ac18c::allen_susdb::ALLEN_SUSDB',
//       account: testAccount,
//       usdbCoin,
//     });

//     const dryrunRes = await suiClient.dryRunTransactionBlock({
//       transactionBlock: await tx.build({ client: suiClient }),
//     });

//     expect(dryrunRes.effects.status.status).toBe('success');
//   });

//   it('test withdraw from saving pool', async () => {
//     // tx
//     const tx = new Transaction();
//     tx.setSender(testAccount);

//     const amount = 0.1 * 10 ** 6; // 0.1 SUSDB

//     const usdbCoin = bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
//       lpType: '0x784660d93d9f013f1c77c4bcb2e04a374fdb4038abf2637c75ca27828b2ac18c::allen_susdb::ALLEN_SUSDB',
//       amount,
//     });

//     tx.transferObjects([usdbCoin], testAccount);

//     const dryrunRes = await suiClient.dryRunTransactionBlock({
//       transactionBlock: await tx.build({ client: suiClient }),
//     });

//     expect(dryrunRes.effects.status.status).toBe('success');
//   });

//   it('test claim from saving pool', async () => {
//     // tx
//     const tx = new Transaction();
//     tx.setSender(testAccount);

//     const rewardCoins = bucketClient.buildClaimSavingRewardsTransaction(tx, {
//       lpType: '0x784660d93d9f013f1c77c4bcb2e04a374fdb4038abf2637c75ca27828b2ac18c::allen_susdb::ALLEN_SUSDB',
//     });

//     tx.transferObjects([...rewardCoins], testAccount);

//     const dryrunRes = await suiClient.dryRunTransactionBlock({
//       transactionBlock: await tx.build({ client: suiClient }),
//     });

//     expect(dryrunRes.effects.status.status).toBe('success');
//   });
// });
