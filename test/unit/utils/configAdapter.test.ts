import type { SuiGrpcClient } from '@mysten/sui/grpc';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ConfigType } from '../../../src/types/index.js';
import type { BucketOnchainConfig } from '../../../src/utils/bucketConfig.js';
import { convertOnchainConfig, enrichSharedObjectRefs } from '../../../src/utils/configAdapter.js';

describe('unit/utils/configAdapter', () => {
  const minimalOnchain: BucketOnchainConfig = {
    config: { id: '0xconfig', id_vector: [] },
  };

  describe('convertOnchainConfig', () => {
    it('returns config with defaults when onchain is minimal', () => {
      const config = convertOnchainConfig(minimalOnchain);
      expect(config.PRICE_SERVICE_ENDPOINT).toBe('https://hermes.pyth.network');
      expect(config.PYTH_STATE_ID).toBe('');
      expect(config.ORIGINAL_USDB_PACKAGE_ID).toBe('');
      expect(config.TREASURY_OBJ).toEqual({ objectId: '', initialSharedVersion: 0, mutable: true });
      expect(config.AGGREGATOR_OBJS).toEqual({});
      expect(config.VAULT_OBJS).toEqual({});
    });

    it('applies overrides and takes precedence', () => {
      const config = convertOnchainConfig(minimalOnchain, {
        PRICE_SERVICE_ENDPOINT: 'https://custom.hermes.test',
        ORIGINAL_USDB_PACKAGE_ID: '0xoverride',
      });
      expect(config.PRICE_SERVICE_ENDPOINT).toBe('https://custom.hermes.test');
      expect(config.ORIGINAL_USDB_PACKAGE_ID).toBe('0xoverride');
    });

    it('parses toSharedObjectRef from string (objectId only)', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        oracleConfig: {
          pyth_rule_config_obj: '0xabc123',
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.PYTH_RULE_CONFIG_OBJ).toEqual({
        objectId: '0xabc123',
        initialSharedVersion: 0,
        mutable: false,
      });
    });

    it('parses toSharedObjectRef from object with snake_case fields', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        objectConfig: {
          treasury_obj: {
            id: '0xtreasury',
            initial_shared_version: 5,
            mutable: true,
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.TREASURY_OBJ).toEqual({
        objectId: '0xtreasury',
        initialSharedVersion: 5,
        mutable: true,
      });
    });

    it('parses toSharedObjectRef from object with camelCase fields', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        objectConfig: {
          vault_rewarder_registry: {
            objectId: '0xregistry',
            initialSharedVersion: 1,
            mutable: false,
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.VAULT_REWARDER_REGISTRY).toEqual({
        objectId: '0xregistry',
        initialSharedVersion: 1,
        mutable: false,
      });
    });

    it('parses aggregator Pyth variant', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        aggregator: {
          id: '0xagg',
          entries: {
            '0x2::sui::SUI': {
              '@variant': 'Pyth',
              priceAggregator: '0xagg1',
              pythPriceId: '0xprice123',
            },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.AGGREGATOR_OBJS['0x2::sui::SUI']).toEqual({
        priceAggregator: { objectId: '0xagg1', initialSharedVersion: 0, mutable: false },
        pythPriceId: '0xprice123',
      });
    });

    it('parses aggregator DerivativeInfo variant', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        aggregator: {
          id: '0xagg',
          entries: {
            '0x::scoin::SCOIN': {
              '@variant': 'DerivativeInfo',
              priceAggregator: '0xagg2',
              underlying_coin_type: '0x2::sui::SUI',
              derivative_kind: 'Scallop',
            },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.AGGREGATOR_OBJS['0x::scoin::SCOIN']).toEqual({
        priceAggregator: { objectId: '0xagg2', initialSharedVersion: 0, mutable: false },
        derivativeInfo: {
          underlyingCoinType: '0x2::sui::SUI',
          derivativeKind: 'Scallop',
        },
      });
    });

    it('parses aggregator DerivativeInfo with camelCase fields', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        aggregator: {
          id: '0xagg',
          entries: {
            coin: {
              '@variant': 'DerivativeInfo',
              priceAggregator: '0xagg3',
              underlyingCoinType: '0x2::sui::SUI',
              derivativeKind: 'GCoin',
            },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.AGGREGATOR_OBJS.coin.derivativeInfo).toEqual({
        underlyingCoinType: '0x2::sui::SUI',
        derivativeKind: 'GCoin',
      });
    });

    it('parses aggregator legacy flat format with pyth_price_id', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        aggregator: {
          id: '0xagg',
          entries: {
            coin: {
              price_aggregator: '0xagg4',
              pyth_price_id: '0xlegacy',
            },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.AGGREGATOR_OBJS.coin).toEqual({
        priceAggregator: { objectId: '0xagg4', initialSharedVersion: 0, mutable: false },
        pythPriceId: '0xlegacy',
      });
    });

    it('parses aggregator legacy format with derivative_info', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        aggregator: {
          id: '0xagg',
          entries: {
            coin: {
              priceAggregator: '0xagg5',
              derivativeInfo: {
                underlying_coin_type: '0x2::sui::SUI',
                derivative_kind: 'Unihouse',
              },
            },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.AGGREGATOR_OBJS.coin).toEqual({
        priceAggregator: { objectId: '0xagg5', initialSharedVersion: 0, mutable: false },
        derivativeInfo: {
          underlyingCoinType: '0x2::sui::SUI',
          derivativeKind: 'Unihouse',
        },
      });
    });

    it('parses vault entry with rewarders (snake_case)', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        vault: {
          id: '0xvault',
          entries: {
            '0x2::sui::SUI': {
              vault: '0xv1',
              rewarders: [{ reward_type: 'BUCK', rewarder_id: '0xr1' }],
            },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.VAULT_OBJS['0x2::sui::SUI']).toEqual({
        vault: { objectId: '0xv1', initialSharedVersion: 0, mutable: true },
        rewarders: [{ rewardType: 'BUCK', rewarderId: '0xr1' }],
      });
    });

    it('parses vault entry with rewarders (camelCase)', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        vault: {
          id: '0xvault',
          entries: {
            coin: {
              vault: '0xv2',
              rewarders: [{ rewardType: 'BUCK', rewarderId: '0xr2' }],
            },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.VAULT_OBJS.coin.rewarders).toEqual([{ rewardType: 'BUCK', rewarderId: '0xr2' }]);
    });

    it('parses vault entry without rewarders', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        vault: {
          id: '0xvault',
          entries: {
            coin: { vault: '0xv3' },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.VAULT_OBJS.coin).toEqual({
        vault: { objectId: '0xv3', initialSharedVersion: 0, mutable: true },
      });
      expect(config.VAULT_OBJS.coin).not.toHaveProperty('rewarders');
    });

    it('parses saving pool entry with reward', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        savingPool: {
          id: '0xpool',
          entries: {
            lp: {
              pool: '0xp1',
              reward: {
                reward_manager: '0xrm',
                reward_types: ['BUCK', 'SUI'],
              },
            },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.SAVING_POOL_OBJS.lp).toEqual({
        pool: { objectId: '0xp1', initialSharedVersion: 0, mutable: true },
        reward: {
          rewardManager: { objectId: '0xrm', initialSharedVersion: 0, mutable: true },
          rewardTypes: ['BUCK', 'SUI'],
        },
      });
    });

    it('parses saving pool entry with camelCase reward', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        savingPool: {
          id: '0xpool',
          entries: {
            lp: {
              pool: '0xp2',
              reward: {
                rewardManager: '0xrm2',
                rewardTypes: ['BUCK'],
              },
            },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.SAVING_POOL_OBJS.lp.reward?.rewardTypes).toEqual(['BUCK']);
    });

    it('parses PSM pool entry', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        psmPool: {
          id: '0xpsm',
          entries: {
            '0x::usdc::USDC': { pool: '0xpsm1' },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.PSM_POOL_OBJS['0x::usdc::USDC']).toEqual({
        pool: { objectId: '0xpsm1', initialSharedVersion: 0, mutable: true },
      });
    });

    it('parses price config entries', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        priceConfig: {
          id: '0xprice',
          entries: {
            SCOIN_RULE: '0xprice1',
            GCOIN_RULE: { objectId: '0xprice2', initialSharedVersion: 1 },
          },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.PRICE_OBJS.SCOIN_RULE).toEqual({
        objectId: '0xprice1',
        initialSharedVersion: 0,
        mutable: false,
      });
      expect(config.PRICE_OBJS.GCOIN_RULE).toEqual({
        objectId: '0xprice2',
        initialSharedVersion: 1,
        mutable: false,
      });
    });

    it('uses oracle price_service_endpoint when not overridden', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        oracleConfig: {
          price_service_endpoint: 'https://oracle.hermes.test',
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.PRICE_SERVICE_ENDPOINT).toBe('https://oracle.hermes.test');
    });

    it('parses all shared object ref fallbacks when obj fields missing', () => {
      const config = convertOnchainConfig(minimalOnchain);
      expect(config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ).toEqual({
        objectId: '',
        initialSharedVersion: 0,
        mutable: false,
      });
      expect(config.FLASH_GLOBAL_CONFIG_OBJ).toEqual({
        objectId: '',
        initialSharedVersion: 0,
        mutable: true,
      });
      expect(config.BLACKLIST_OBJ).toEqual({
        objectId: '',
        initialSharedVersion: 0,
        mutable: false,
      });
    });

    it('handles mutable default in toSharedObjectRef', () => {
      const onchain: BucketOnchainConfig = {
        ...minimalOnchain,
        objectConfig: {
          treasury_obj: { id: '0xt', initial_shared_version: 0 },
        },
      };
      const config = convertOnchainConfig(onchain);
      expect(config.TREASURY_OBJ.mutable).toBe(true);
    });
  });

  describe('enrichSharedObjectRefs', () => {
    const asSuiClient = (m: unknown) => m as unknown as SuiGrpcClient;

    afterEach(() => {
      vi.restoreAllMocks();
    });

    function minimalConfigWithRefsNeedingEnrichment(): ConfigType {
      return convertOnchainConfig(
        {
          ...minimalOnchain,
          oracleConfig: { pyth_rule_config_obj: '0xrule' },
          aggregator: {
            id: '0xagg',
            entries: {
              '0x2::sui::SUI': { '@variant': 'Pyth', priceAggregator: '0xpa', pythPriceId: '0xprice' },
            },
          },
        },
        {},
      );
    }

    it('enriches refs with initialSharedVersion 0 when getObjects returns Shared owner', async () => {
      const config = minimalConfigWithRefsNeedingEnrichment();
      const getObjects = vi.fn().mockResolvedValue({
        objects: [
          {
            objectId: '0xrule',
            owner: { $kind: 'Shared', Shared: { initialSharedVersion: '42' } },
          },
          {
            objectId: '0xpa',
            owner: { $kind: 'Shared', Shared: { initialSharedVersion: '100' } },
          },
        ],
      });
      const client = asSuiClient({ getObjects });

      const enriched = await enrichSharedObjectRefs(config, client);

      expect(enriched.PYTH_RULE_CONFIG_OBJ.initialSharedVersion).toBe('42');
      expect(enriched.AGGREGATOR_OBJS['0x2::sui::SUI'].priceAggregator.initialSharedVersion).toBe('100');
      expect(getObjects).toHaveBeenCalledWith({
        objectIds: expect.arrayContaining(['0xrule', '0xpa']),
        include: { json: false },
      });
    });

    it('returns config unchanged when no refs need enrichment', async () => {
      const config = minimalConfigWithRefsNeedingEnrichment();
      config.PYTH_RULE_CONFIG_OBJ.initialSharedVersion = 5;
      config.AGGREGATOR_OBJS['0x2::sui::SUI'].priceAggregator.initialSharedVersion = 10;
      const getObjects = vi.fn();
      const client = asSuiClient({ getObjects });

      const enriched = await enrichSharedObjectRefs(config, client);

      expect(enriched.PYTH_RULE_CONFIG_OBJ.initialSharedVersion).toBe(5);
      expect(enriched.AGGREGATOR_OBJS['0x2::sui::SUI'].priceAggregator.initialSharedVersion).toBe(10);
      expect(getObjects).not.toHaveBeenCalled();
    });

    it('skips refs when fetch returns Error', async () => {
      const config = minimalConfigWithRefsNeedingEnrichment();
      const getObjects = vi.fn().mockResolvedValue({
        objects: [
          new Error('Object not found'),
          { objectId: '0xpa', owner: { $kind: 'Shared', Shared: { initialSharedVersion: '100' } } },
        ],
      });
      const client = asSuiClient({ getObjects });

      const enriched = await enrichSharedObjectRefs(config, client);

      expect(enriched.PYTH_RULE_CONFIG_OBJ.initialSharedVersion).toBe(0);
      expect(enriched.AGGREGATOR_OBJS['0x2::sui::SUI'].priceAggregator.initialSharedVersion).toBe('100');
    });

    it('does not fetch refs with empty objectId', async () => {
      const config = minimalConfigWithRefsNeedingEnrichment();
      config.PYTH_RULE_CONFIG_OBJ.objectId = '';
      const getObjects = vi.fn().mockResolvedValue({
        objects: [{ objectId: '0xpa', owner: { $kind: 'Shared', Shared: { initialSharedVersion: '100' } } }],
      });
      const client = asSuiClient({ getObjects });

      const enriched = await enrichSharedObjectRefs(config, client);

      expect(getObjects).toHaveBeenCalledWith({
        objectIds: ['0xpa'],
        include: { json: false },
      });
      expect(enriched.PYTH_RULE_CONFIG_OBJ.objectId).toBe('');
      expect(enriched.AGGREGATOR_OBJS['0x2::sui::SUI'].priceAggregator.initialSharedVersion).toBe('100');
    });

    it('deduplicates objectIds when multiple refs point to same object', async () => {
      const config = minimalConfigWithRefsNeedingEnrichment();
      config.AGGREGATOR_OBJS['0x2::sui::SUI'].priceAggregator.objectId = '0xrule';
      const getObjects = vi.fn().mockResolvedValue({
        objects: [{ objectId: '0xrule', owner: { $kind: 'Shared', Shared: { initialSharedVersion: '99' } } }],
      });
      const client = asSuiClient({ getObjects });

      const enriched = await enrichSharedObjectRefs(config, client);

      expect(getObjects).toHaveBeenCalledWith({
        objectIds: ['0xrule'],
        include: { json: false },
      });
      expect(enriched.PYTH_RULE_CONFIG_OBJ.initialSharedVersion).toBe('99');
      expect(enriched.AGGREGATOR_OBJS['0x2::sui::SUI'].priceAggregator.initialSharedVersion).toBe('99');
    });

    it('skips objects with non-Shared owner', async () => {
      const config = minimalConfigWithRefsNeedingEnrichment();
      const getObjects = vi.fn().mockResolvedValue({
        objects: [
          { objectId: '0xrule', owner: { $kind: 'AddressOwner', AddressOwner: '0xaddr' } },
          { objectId: '0xpa', owner: { $kind: 'Shared', Shared: { initialSharedVersion: '100' } } },
        ],
      });
      const client = asSuiClient({ getObjects });

      const enriched = await enrichSharedObjectRefs(config, client);

      expect(enriched.PYTH_RULE_CONFIG_OBJ.initialSharedVersion).toBe(0);
      expect(enriched.AGGREGATOR_OBJS['0x2::sui::SUI'].priceAggregator.initialSharedVersion).toBe('100');
    });

    it('returns config unchanged when config has no refs needing enrichment', async () => {
      const config = convertOnchainConfig(minimalOnchain);
      const getObjects = vi.fn();
      const client = asSuiClient({ getObjects });

      const enriched = await enrichSharedObjectRefs(config, client);

      expect(enriched).toEqual(config);
      expect(getObjects).not.toHaveBeenCalled();
    });
  });
});
