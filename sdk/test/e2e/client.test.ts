import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { describe, expect, it } from 'vitest';

import { BucketV2Client } from '@/client';
import { COIN_TYPES } from '@/consts/coin';

describe('Interacting with Bucket Client on mainnet', () => {
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

  it('test psmSwapIn() on testnet', async () => {
    const network = 'testnet';
    const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
    const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
    const bucketClient = new BucketV2Client({ suiClient, network });

    // tx
    const tx = new Transaction();
    tx.setSender(sender);

    const amount = 1 * 10 ** 6; // 1 USDC
    const usdbCoin = await bucketClient.buildPSMSwapInTransaction(
      tx,
      {
        coinType: COIN_TYPES.USDC,
        amount,
      },
      sender,
    );

    tx.transferObjects([usdbCoin], sender);

    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });
    expect(dryrunRes.effects.status.status).toBe('success');
    expect(dryrunRes.events.length).toBe(4);
  });

  it('test psmSwapOut() on testnet', async () => {
    const network = 'testnet';
    const sender = '0xa718efc9ae5452b22865101438a8286a5b0ca609cc58018298108c636cdda89c';
    const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
    const bucketClient = new BucketV2Client({ suiClient, network });

    // tx
    const tx = new Transaction();
    tx.setSender(sender);

    const amount = 1 * 10 ** 6; // 1 USDB
    const usdbCoin = await bucketClient.buildPSMSwapOutTransaction(
      tx,
      {
        coinType: COIN_TYPES.USDC,
        amount,
      },
      sender,
    );

    tx.transferObjects([usdbCoin], sender);

    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });

    expect(dryrunRes.effects.status.status).toBe('success');
    expect(dryrunRes.events.length).toBe(5);
  });
});
