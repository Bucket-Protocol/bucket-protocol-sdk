/**
 * E2E: BucketClient.initialize() fetches config from on-chain Config and creates a usable BucketClient.
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

  describe('BucketClient.initialize()', () => {
    let bucketClient: BucketClient;

    beforeAll(async () => {
      bucketClient = await BucketClient.initialize({ suiClient, network });
    }, TIMEOUT_MS);

    it('returns a BucketClient instance', () => {
      expect(bucketClient).toBeInstanceOf(BucketClient);
    });

    it(
      'getConfig returns a populated ConfigType',
      async () => {
        const config = bucketClient.getConfig();
        expect(config).toBeDefined();
        expect(config.ORIGINAL_FRAMEWORK_PACKAGE_ID).toBeTruthy();
        expect(config.ORIGINAL_USDB_PACKAGE_ID).toBeTruthy();
        expect(config.FRAMEWORK_PACKAGE_ID).toBeTruthy();
        expect(config.USDB_PACKAGE_ID).toBeTruthy();
        expect(config.ORACLE_PACKAGE_ID).toBeTruthy();
        expect(config.CDP_PACKAGE_ID).toBeTruthy();
        expect(config.PSM_PACKAGE_ID).toBeTruthy();
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

const mainnetSuiClient = new SuiGrpcClient({ network: 'mainnet', baseUrl: 'https://fullnode.mainnet.sui.io:443' });

describe('On-chain price config (mainnet)', () => {
  beforeAll(beforeFileStart);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it(
    'queryAllConfig includes priceConfig with table entries',
    async () => {
      const raw = await queryAllConfig(mainnetSuiClient, 'mainnet');
      expect(raw.priceConfig).toBeDefined();
      expect(raw.priceConfig!.id).toBeTruthy();
      expect(typeof raw.priceConfig!.entries).toBe('object');
      expect(Object.keys(raw.priceConfig!.entries).length).toBeGreaterThan(0);
    },
    TIMEOUT_MS,
  );

  it(
    'PRICE_OBJS contains required derivative price variants',
    async () => {
      const client = await BucketClient.initialize({ suiClient: mainnetSuiClient, network: 'mainnet' });
      const config = client.getConfig();
      expect(config).toBeDefined();

      const priceObjs = config.PRICE_OBJS;
      expect(priceObjs).toBeDefined();
      expect(typeof priceObjs).toBe('object');

      // Collect all variants present
      const variants = Object.values(priceObjs).map((info) => info.variant);

      // sCoin and gCoin feeds should be present
      expect(variants).toContain('SCOIN');
      expect(variants).toContain('GCOIN');
    },
    TIMEOUT_MS,
  );

  it(
    'PRICE_OBJS entries have valid PriceConfigInfo shape',
    async () => {
      const client = await BucketClient.initialize({ suiClient: mainnetSuiClient, network: 'mainnet' });
      const config = client.getConfig();
      const priceObjs = config.PRICE_OBJS;

      for (const [key, info] of Object.entries(priceObjs)) {
        expect(info, `${key} should have variant`).toHaveProperty('variant');
        expect(info, `${key} should have package`).toHaveProperty('package');
        expect(typeof info.package).toBe('string');
        expect(info.package).toBeTruthy();

        switch (info.variant) {
          case 'SCOIN':
            expect(info.scoinRuleConfig.objectId).toBeTruthy();
            expect(info.scallopVersion.objectId).toBeTruthy();
            expect(info.scallopMarket.objectId).toBeTruthy();
            break;
          case 'GCOIN':
            expect(info.gcoinRuleConfig.objectId).toBeTruthy();
            expect(info.unihouseObject.objectId).toBeTruthy();
            break;
          case 'BFBTC':
            expect(info.bfbtcRuleConfig.objectId).toBeTruthy();
            break;
        }
      }
    },
    TIMEOUT_MS,
  );
});
