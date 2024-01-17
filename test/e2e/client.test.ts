import { describe, it, expect } from 'vitest';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { BucketClient } from '../../src';

describe('Interacting with Bucket Client on mainnet', () => {

    // Instantiate SuiClient connected to mainnet
    const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

    // Instantiate BucketClient
    const buck = new BucketClient(client, {
        packageType: "mainnet"
    });

    /*
    it('tests getBucketConstants() function', async () => {
        expect(await buck.getBucketConstants()).toMatchObject({
            feePrecision: "1000000",
            liquidationRebate: "2500",
            flashLoanFee: "500",
            buckDecimal: 9,
            maxLockTime: "31104000000",
            minLockTime: "2592000000",
            minFee: "5000",
            maxFee: "50000"
        }
        )
    });

    it('tests getAllBottle() function', async () => {
        expect(await buck.getAllBottles()).toBeDefined()
    });

    it('tests getDestroyedBottle() function', async () => {
        expect(await buck.getDestroyedBottles()).toBeDefined()
    });

    it('tests getUserBottle() function', async () => {
        const bottles = await buck.getUserBottles("");
        expect(bottles).toBeDefined()
    });

    it('tests getAllBuckets() function', async () => {
        const buckets = await buck.getAllBuckets();
        expect(buckets).toBeDefined()
    });

    it('tests getAPYs() function', async () => {
        const apys = await buck.getAPYs();
        expect(apys).toBeDefined()
    });

    it('tests getPrices() function', async () => {
        const prices = await buck.getPrices();
        expect(prices).toBeDefined()
    });

    it('tests getAllTanks() function', async () => {
        const tanks = await buck.getAllTanks();
        expect(tanks).toBeDefined()
    });
    */

    it('tests getUserTanks() function', async () => {
        const tanks = await buck.getUserTanks("0xb5f59df8059cccb0f4f9a55e8adf60f0bbc16180cb9ccf5d50e0c1c3e2bd4401");
        console.log(tanks);
        expect(tanks).toBeDefined()
    }, {
        timeout: 1000 * 60
    });
});