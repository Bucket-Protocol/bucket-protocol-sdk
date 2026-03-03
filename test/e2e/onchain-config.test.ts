/**
 * E2E: BucketClient.create() fetches config from on-chain Config and creates a usable BucketClient.
 * The entry Config is currently deployed on testnet.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { BucketClient } from '../../src/client.js';
import { queryAllConfig, toJson } from '../../src/utils/bucketConfig.js';
import { afterFileEnd, afterTestDelay, beforeFileStart } from './helpers/rateLimit.js';

const TIMEOUT_MS = 30_000;
const network = 'testnet';
const suiClient = new SuiGrpcClient({ network, baseUrl: 'https://fullnode.testnet.sui.io:443' });

describe('On-chain config (testnet)', () => {
  beforeAll(beforeFileStart);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);
  describe('queryAllConfig', () => {
    it(
      'fetches the raw on-chain config and returns all expected sections',
      async () => {
        const raw = await queryAllConfig(suiClient, network);

        expect(raw.config).toBeDefined();
        expect(raw.config.id).toBeTruthy();
        expect(Array.isArray(raw.config.id_vector)).toBe(true);
        expect(raw.config.id_vector.length).toBeGreaterThan(0);

        expect(raw.packageConfig).toBeDefined();
        expect(raw.oracleConfig).toBeDefined();

        const jsonStr = toJson(raw);
        expect(typeof jsonStr).toBe('string');
        expect(jsonStr.length).toBeGreaterThan(0);

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
