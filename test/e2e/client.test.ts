import { describe, expect, it } from 'vitest';

import { BucketClient } from '@/index';
import { COINS_TYPE_LIST } from '@/constants';

describe('Interacting with Bucket Client on mainnet', () => {
  // Instantiate BucketClient
  const buck = new BucketClient();

  it('tests getBucketConstants() function', async () => {
    expect(await buck.getBucketConstants()).toMatchObject({
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
    const protocol = await buck.getProtocol();
    expect(protocol).toBeDefined();
  });

  it('tests getAllBottle() function', async () => {
    expect(await buck.getAllBottles()).toBeDefined();
  });

  it('tests getDestroyedBottle() function', async () => {
    expect(await buck.getDestroyedBottles()).toBeDefined();
  });

  it('tests getAllBuckets() function', async () => {
    const buckets = await buck.getAllBuckets();
    expect(buckets).toBeDefined();
  });

  it('tests getBucket() function', async () => {
    const bucket = await buck.getBucket('afSUI');
    expect(bucket).toBeDefined();
  });

  it('tests getPrices() function', async () => {
    const prices = await buck.getPrices();
    expect(prices).toBeDefined();
  });

  it('tests getAllTanks() function', async () => {
    const tanks = await buck.getAllTanks();
    expect(tanks).toBeDefined();
  });

  it(
    'tests getUserTanks() function',
    async () => {
      const tanks = await buck.getUserTanks('');
      expect(tanks).toBeDefined();
    },
    {
      timeout: 1000 * 60,
    },
  );

  it(
    'tests getUserBottle() function',
    async () => {
      const bottles = await buck.getUserBottles('');
      expect(bottles).toBeDefined();
    },
    {
      timeout: 60_000,
    },
  );

  it('tests getAllPsms() function', async () => {
    const psms = await buck.getAllPsms();
    expect(psms).toBeDefined();
  });

  it(
    'tests findInsertionPlace() function',
    async () => {
      const owner = await buck.findInsertionPlace(
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
      const fountains = await buck.getAllFountains();
      expect(fountains).toBeDefined();
    },
    {
      timeout: 60_000,
    },
  );

  it(
    'tests getAllStrapFountains() function',
    async () => {
      const strapFountains = await buck.getAllStrapFountains();
      expect(strapFountains).toBeDefined();
    },
    {
      timeout: 60_000,
    },
  );

  it('tests getStrapFountainApr() function', async () => {
    const apr = await buck.getStrapFountainApr('afSUI');
    expect(apr).toBeDefined();
  });

  it('tests getSBUCKTvl() function', async () => {
    const tvl = await buck.getSBUCKTvl();
    expect(tvl).toBeDefined();
  });

  it('tests getSavingApr() function', async () => {
    const apr = await buck.getSavingApr();
    expect(apr).toBeDefined();
  });

  it('tests getDeTokenInfo() function', async () => {
    const info = await buck.getDeTokenInfo();
    expect(info).toBeDefined();
  });

  it('tests getUserDeTokens() function', async () => {
    const tokens = await buck.getUserDeTokens('0x93c8e48b6a2bdfd0bb581c29c4b1f95dc136fbe4898b495b62fd3a3cf1986278');
    expect(tokens).toBeDefined();
  });

  it('tests getUserDeWrappers() function', async () => {
    const wrapperObj = await buck.getUserDeWrapper(
      '0x3662e00a85fdae17d5732770b8d0658105fe9c0ca91c259790e6fb1498686abc',
    );
    expect(wrapperObj).toBeDefined();
  });

  it('tests getUserDropsAmount() function', async () => {
    const dropsAmount = await buck.getUserDropsAmount(
      '0x3662e00a85fdae17d5732770b8d0658105fe9c0ca91c259790e6fb1498686abc',
      '0x663dbb1675f7186a73f67b7973431c7eb9d79bfc6687c27730db4ec56be43444',
    );
    expect(dropsAmount).toBeDefined();
  });

  it('tests getUserDeButInfo() function', async () => {
    const deBUT = await buck.getUserDeButInfo('0x3662e00a85fdae17d5732770b8d0658105fe9c0ca91c259790e6fb1498686abc');
    expect(deBUT).toBeDefined();
  });
});
