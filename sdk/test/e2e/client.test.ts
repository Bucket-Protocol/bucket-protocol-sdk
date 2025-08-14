import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { describe, expect, it } from 'vitest';

import { BucketV2Client } from '@/index';

describe('Interacting with Bucket Client on mainnet', () => {
  // Instantiate BucketClient
  const bucketClient = new BucketV2Client();

  it('test usdbCoinType()', async () => {
    const usdbCoinType = bucketClient.usdbCoinType();
    const usdbMetadata = await bucketClient.getSuiClient().getCoinMetadata({
      coinType: usdbCoinType,
    });
    expect(usdbMetadata?.decimals).toBe(6);
    expect(usdbMetadata?.symbol).toBe('USDB');
    expect(usdbMetadata?.name).toBe('Bucket USD');
  });

  it('test aggregatePrice()', async () => {
    const suiClient = bucketClient.getSuiClient();
    bucketClient.resetTransaction();
    bucketClient.sender = '0x95b0ce9775382b88a4e698d31a0a7fd796922c91bb80de66e940bd4cae5a9916';
    bucketClient.tx.setSender(bucketClient.sender);
    const coinTypes = bucketClient.getCDPCollateralTypes();
    await Promise.all(coinTypes.map((coinType) => bucketClient.aggregatePrice({ coinType })));
    const tx = bucketClient.getTransaction();
    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });
    expect(dryrunRes.effects.status.status).toBe('success');
    expect(dryrunRes.events.length).toBe(6);
    // const priceResults = dryrunRes.events.map((e) => {
    //   return {
    //     eventType: e.type,
    //     priceResult: (e.parsedJson as any).result,
    //   };
    // });
    // console.log(priceResults);
  });

  it('test Borrow', async () => {
    const suiClient = bucketClient.getSuiClient();
    const tx = await bucketClient.buildManagePositionTransaction({
      collateralCoinType: SUI_TYPE_ARG,
      depositAmount: 1 * 10 ** 9,
      borrowAmount: 1 * 10 ** 6,
    });
    // bucketClient.resetTransaction();
    // const collateralCoinType = SUI_TYPE_ARG;
    // const updateRequest = bucketClient.debtorRequest({ collateralCoinType });
    // const [collCoin, usdbCoin, response] = bucketClient.updatePosition({ collateralCoinType, updateRequest });
    // bucketClient.destroyZeroCoin({ coinType: collateralCoinType, coin: collCoin });
    // bucketClient.destroyZeroCoin({ coinType: bucketClient.usdbCoinType(), coin: usdbCoin });
    // bucketClient.checkResponse({ collateralCoinType, response });
    // bucketClient.tx.setSender(bucketClient.sender);
    // const tx = bucketClient.getTransaction();
    const dryrunRes = await suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: suiClient }),
    });
    expect(dryrunRes.effects.status.status).toBe('success');
  });
});
