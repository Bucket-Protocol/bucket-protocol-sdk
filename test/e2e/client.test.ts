import { describe, it, expect } from 'vitest';
import { BucketClient } from '../../src';

describe('Interacting with Bucket Client on mainnet', () => {

    // Instantiate BucketClient
    const buck = new BucketClient("mainnet");

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

    it('tests getProtocol() function', async () => {
        const protocol = await buck.getProtocol();
        console.log(protocol);
        expect(protocol).toBeDefined()
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

    it('testsgetAllBuckets() function', async () => {
        const buckets = await buck.getAllBuckets();
        expect(buckets).toBeDefined()
    });

    it('tests getPrices() function', async () => {
        const prices = await buck.getPrices();
        expect(prices).toBeDefined()
    });

    it('tests getAllTanks() function', async () => {
        const tanks = await buck.getAllTanks();
        expect(tanks).toBeDefined()
    });

    it('tests getUserTanks() function', async () => {
        const tanks = await buck.getUserTanks("");
        console.log(tanks);
        expect(tanks).toBeDefined()
    }, {
        timeout: 1000 * 60
    });

    it('tests getUserBottle() function', async () => {
        const bottles = await buck.getUserBottles("");
        console.log(bottles)
        expect(bottles).toBeDefined()
    }, {
        timeout: 60_000
    });

    it('tests getPsmTVL() function', async () => {
        const tvl = await buck.getPsmTVL();
        expect(tvl).toBeDefined;
    });

    it('tests findInsertionPlace() function', async () => {
        const owner = await buck.findInsertionPlace(
            `0x44529d74a43073c40963fe42c8d2e51d8a441d480ee105ea0c27f3847433ae21`,
            1,
            50,
        );
        console.log(owner);
        expect(owner).toBeDefined;
    }, {
        timeout: 60 * 1000
    });

    it('tests getAllStrapFountains() function', async () => {
        const strapFountains = await buck.getAllStrapFountains();
        console.log(strapFountains);
        expect(strapFountains).toBeDefined()
    }, {
        timeout: 60_000
    });
    */

    it('tests getUserBottle() function', async () => {
        const bottles = await buck.getUserBottles("0x3662e00a85fdae17d5732770b8d0658105fe9c0ca91c259790e6fb1498686abc");
        console.log(bottles)
        expect(bottles).toBeDefined()
    }, {
        timeout: 60_000
    });
});