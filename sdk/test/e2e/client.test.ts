import { describe, expect, it } from 'vitest';

import { BucketClient } from '@/index';
import { COINS_TYPE_LIST } from '@/constants';

describe('Interacting with Bucket Client on mainnet', () => {
  // Instantiate BucketClient
  const bucketClient = new BucketClient();

  it('tests getBucketConstants() function', async () => {
    expect(await bucketClient.getBucketConstants()).toMatchObject({
      feePrecision: '1000000',
      liquidationRebate: '5000',
      flashLoanFee: '500',
      buckDecimal: 9,
      maxLockTime: '31104000000',
      minLockTime: '2592000000',
      minFee: '3000',
      maxFee: '50000',
    });
  });

  it('tests getProtocol() function', async () => {
    const protocol = await bucketClient.getProtocol();
    expect(protocol).toBeDefined();
  });

  it('tests getAllBottle() function', async () => {
    expect(await bucketClient.getAllBottles()).toBeDefined();
  });

  it('tests getDestroyedBottle() function', async () => {
    expect(await bucketClient.getDestroyedBottles()).toBeDefined();
  });

  it('tests getAllBuckets() function', async () => {
    const buckets = await bucketClient.getAllBuckets();
    expect(buckets).toBeDefined();
  });

  it('tests getBucket() function', async () => {
    const bucket = await bucketClient.getBucket('afSUI');
    expect(bucket).toBeDefined();
  });

  it('tests getPrices() function', async () => {
    const prices = await bucketClient.getPrices();
    expect(prices).toBeDefined();
  });

  it('tests getAllTanks() function', async () => {
    const tanks = await bucketClient.getAllTanks();
    expect(tanks).toBeDefined();
  });

  it(
    'tests getUserTanks() function',
    async () => {
      const tanks = await bucketClient.getUserTanks('');
      expect(tanks).toBeDefined();
    },
    {
      timeout: 1000 * 60,
    },
  );

  it(
    'tests getUserBottle() function',
    async () => {
      const bottles = await bucketClient.getUserBottles('');
      expect(bottles).toBeDefined();
    },
    {
      timeout: 60_000,
    },
  );

  it('tests getAllPsms() function', async () => {
    const psms = await bucketClient.getAllPsms();
    expect(psms).toBeDefined();
  });

  it(
    'tests findInsertionPlace() function',
    async () => {
      const owner = await bucketClient.findInsertionPlace(
        `0x44529d74a43073c40963fe42c8d2e51d8a441d480ee105ea0c27f3847433ae21`,
        1,
        50,
        COINS_TYPE_LIST.SUI,
      );
      expect(owner).toBeDefined();
    },
    {
      timeout: 60 * 1000,
    },
  );

  it(
    'tests getAllFountains() function',
    async () => {
      const fountains = await bucketClient.getAllFountains();
      expect(fountains).toBeDefined();
    },
    {
      timeout: 60_000,
    },
  );

  it(
    'tests getAllStrapFountains() function',
    async () => {
      const strapFountains = await bucketClient.getAllStrapFountains();
      expect(strapFountains).toBeDefined();
    },
    {
      timeout: 60_000,
    },
  );

  it('tests getStrapFountainApr() function', async () => {
    const apr = await bucketClient.getStrapFountainApr('afSUI');
    expect(apr).toBeDefined();
  });

  it('tests getSBUCKTvl() function', async () => {
    const tvl = await bucketClient.getSBUCKTvl();
    expect(tvl).toBeDefined();
  });

  it('tests getSavingApr() function', async () => {
    const apr = await bucketClient.getSavingApr();
    expect(apr).toBeDefined();
  });

  it('tests getUserDeButInfo() function', async () => {
    const deBUT = await bucketClient.getUserDeButInfo(
      '0x3662e00a85fdae17d5732770b8d0658105fe9c0ca91c259790e6fb1498686abc',
    );
    expect(deBUT).toBeDefined();
  });
});
