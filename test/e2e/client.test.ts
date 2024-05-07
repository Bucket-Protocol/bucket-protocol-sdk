import { describe, it, expect } from 'vitest';
import { BucketClient } from '../../src';

describe('Interacting with Bucket Client on mainnet', () => {

    // Instantiate BucketClient
    const buck = new BucketClient("https://sui-mainnet-endpoint.blockvision.org/");

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

    it('tests getProtocol() function', async () => {
        const protocol = await buck.getProtocol();
        expect(protocol).toBeDefined()
    });

    it('tests getAllBottle() function', async () => {
        expect(await buck.getAllBottles()).toBeDefined()
    });

    it('tests getDestroyedBottle() function', async () => {
        expect(await buck.getDestroyedBottles()).toBeDefined()
    });

    it('tests getAllBuckets() function', async () => {
        const buckets = await buck.getAllBuckets();
        expect(buckets).toBeDefined()
    });

    it('tests getPrices() function', async () => {
        const prices = await buck.getPrices();
        console.log(prices);
        expect(prices).toBeDefined()
    });

    it('tests getAllTanks() function', async () => {
        const tanks = await buck.getAllTanks();
        expect(tanks).toBeDefined()
    });

    it('tests getUserTanks() function', async () => {
        const tanks = await buck.getUserTanks("");
        expect(tanks).toBeDefined()
    }, {
        timeout: 1000 * 60
    });

    it('tests getUserBottle() function', async () => {
        const bottles = await buck.getUserBottles("");
        expect(bottles).toBeDefined()
    }, {
        timeout: 60_000
    });

    it('tests getAllPsms() function', async () => {
        const psms = await buck.getAllPsms();
        expect(psms).toBeDefined;
    });

    it('tests findInsertionPlace() function', async () => {
        const owner = await buck.findInsertionPlace(
            `0x44529d74a43073c40963fe42c8d2e51d8a441d480ee105ea0c27f3847433ae21`,
            1,
            50,
        );
        expect(owner).toBeDefined;
    }, {
        timeout: 60 * 1000
    });

    it('tests getAllFountains() function', async () => {
        const fountains = await buck.getAllFountains();
        expect(fountains).toBeDefined()
    }, {
        timeout: 60_000
    });

    it('tests getAllStrapFountains() function', async () => {
        const strapFountains = await buck.getAllStrapFountains();
        expect(strapFountains).toBeDefined()
    }, {
        timeout: 60_000
    });
});