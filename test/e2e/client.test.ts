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
        const bottles = await buck.getUserBottle("0x95b0ce9775382b88a4e698d31a0a7fd796922c91bb80de66e940bd4cae5a9916");
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
    */

    it('tests getFountains() function', async () => {
        const fountains = await buck.getFountains();
        expect(fountains).toBeDefined()
    });

});