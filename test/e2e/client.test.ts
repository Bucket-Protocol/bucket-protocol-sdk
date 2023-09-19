import { describe, it, expect } from 'vitest';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { BucketClient } from '../../src';

describe('Interacting with Bucket Client on testnet', () => {

    // Instantiate SuiClient connected to testnet
    const client = new SuiClient({ url: getFullnodeUrl('testnet') });

    // Instantiate BucketClient
    const buck = new BucketClient(client);

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

});