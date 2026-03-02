/**
 * E2E test: validates that BucketClient.create() can fetch Config from
 * the on-chain Config object and produce a working BucketClient.
 *
 * The entry Config object is currently deployed on **testnet**.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { beforeAll, describe, expect, it } from 'vitest';

import { BucketClient } from '../../src/client.js';
import { queryAllConfig, toJson } from '../../src/utils/bucketConfig.js';

const TIMEOUT_MS = 30_000;
const network = 'testnet';
const suiClient = new SuiGrpcClient({ network, baseUrl: 'https://fullnode.testnet.sui.io:443' });

describe('On-chain config (testnet)', () => {
  describe('queryAllConfig', () => {
    it(
      'fetches the raw on-chain config and returns all expected sections',
      async () => {
        const raw = await queryAllConfig(suiClient, network);

        // Basic structure
        expect(raw.config).toBeDefined();
        expect(raw.config.id).toBeTruthy();
        expect(Array.isArray(raw.config.id_vector)).toBe(true);
        expect(raw.config.id_vector.length).toBeGreaterThan(0);

        // At least packageConfig and oracleConfig should be present
        expect(raw.packageConfig).toBeDefined();
        expect(raw.oracleConfig).toBeDefined();

        // JSON serialization should succeed
        const jsonStr = toJson(raw);
        expect(typeof jsonStr).toBe('string');
        expect(jsonStr.length).toBeGreaterThan(0);

        // Round-trip: JSON.parse shouldn't throw
        const parsed = JSON.parse(jsonStr);
        expect(parsed.config.id).toBe(raw.config.id);
      },
      TIMEOUT_MS,
    );
  });

  describe('BucketClient.create()', () => {
    let bucketClient: BucketClient;

    beforeAll(async () => {
      bucketClient = await BucketClient.create({ suiClient, network });
    }, TIMEOUT_MS);

    it('returns a BucketClient instance', () => {
      expect(bucketClient).toBeInstanceOf(BucketClient);
    });

    it(
      'getConfig returns a populated ConfigType',
      async () => {
        const config = await bucketClient.getConfig();
        expect(config).toBeDefined();

        // Package IDs should be non-empty hex strings
        expect(config!.ORIGINAL_FRAMEWORK_PACKAGE_ID).toBeTruthy();
        expect(config!.ORIGINAL_USDB_PACKAGE_ID).toBeTruthy();
        expect(config!.FRAMEWORK_PACKAGE_ID).toBeTruthy();
        expect(config!.USDB_PACKAGE_ID).toBeTruthy();
        expect(config!.ORACLE_PACKAGE_ID).toBeTruthy();
        expect(config!.CDP_PACKAGE_ID).toBeTruthy();
        expect(config!.PSM_PACKAGE_ID).toBeTruthy();
      },
      TIMEOUT_MS,
    );

    it('getUsdbCoinType returns a valid coin type string', () => {
      const usdbType = bucketClient.getUsdbCoinType();
      expect(usdbType).toContain('::usdb::USDB');
      expect(usdbType.startsWith('0x')).toBe(true);
    });

    it('getSuiClient returns the same SuiGrpcClient', () => {
      expect(bucketClient.getSuiClient()).toBe(suiClient);
    });
  });
});
