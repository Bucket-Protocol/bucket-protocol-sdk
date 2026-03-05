/**
 * Unit tests for BucketClient config loading behavior.
 * Mocks queryAllConfig, convertOnchainConfig, enrichSharedObjectRefs to avoid RPC.
 */
import type { SuiGrpcClient } from '@mysten/sui/grpc';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BucketClient } from '../../src/client.js';
import type { ConfigType } from '../../src/types/index.js';
import * as bucketConfig from '../../src/utils/bucketConfig.js';
import * as configAdapter from '../../src/utils/configAdapter.js';

const asSuiClient = (m: unknown) => m as unknown as SuiGrpcClient;

function minimalConfig(overrides: Partial<ConfigType> = {}): ConfigType {
  const emptyRef = { objectId: '', initialSharedVersion: '0', mutable: false };
  return {
    PRICE_SERVICE_ENDPOINT: 'https://hermes.pyth.network',
    PYTH_STATE_ID: '',
    WORMHOLE_STATE_ID: '',
    PYTH_RULE_PACKAGE_ID: '',
    PYTH_RULE_CONFIG_OBJ: emptyRef,
    ORIGINAL_FRAMEWORK_PACKAGE_ID: '',
    ORIGINAL_USDB_PACKAGE_ID: '',
    ORIGINAL_ORACLE_PACKAGE_ID: '',
    ORIGINAL_CDP_PACKAGE_ID: '',
    ORIGINAL_PSM_PACKAGE_ID: '',
    ORIGINAL_FLASH_PACKAGE_ID: '',
    ORIGINAL_SAVING_PACKAGE_ID: '',
    ORIGINAL_SAVING_INCENTIVE_PACKAGE_ID: '',
    ORIGINAL_BORROW_INCENTIVE_PACKAGE_ID: '',
    ORIGINAL_BLACKLIST_PACKAGE_ID: '',
    FRAMEWORK_PACKAGE_ID: '',
    USDB_PACKAGE_ID: '',
    ORACLE_PACKAGE_ID: '',
    CDP_PACKAGE_ID: '',
    PSM_PACKAGE_ID: '',
    FLASH_PACKAGE_ID: '',
    SAVING_PACKAGE_ID: '',
    SAVING_INCENTIVE_PACKAGE_ID: '',
    BORROW_INCENTIVE_PACKAGE_ID: '',
    BLACKLIST_PACKAGE_ID: '',
    TREASURY_OBJ: { ...emptyRef, mutable: true },
    VAULT_REWARDER_REGISTRY: emptyRef,
    SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: emptyRef,
    FLASH_GLOBAL_CONFIG_OBJ: { ...emptyRef, mutable: true },
    BLACKLIST_OBJ: emptyRef,
    AGGREGATOR_OBJS: {},
    VAULT_OBJS: {},
    SAVING_POOL_OBJS: {},
    PSM_POOL_OBJS: {},
    PRICE_OBJS: {},
    ...overrides,
  };
}

describe('unit/client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('refreshConfig preserves configOverrides', () => {
    it('when refreshConfig() is called without args, keeps configOverrides from initialize', async () => {
      vi.spyOn(bucketConfig, 'queryAllConfig').mockResolvedValue({
        config: { id: '0x1', id_vector: [] },
      } as Awaited<ReturnType<typeof bucketConfig.queryAllConfig>>);
      const mockConvert = vi
        .spyOn(configAdapter, 'convertOnchainConfig')
        .mockImplementation((_onchain, overrides = {}) => minimalConfig(overrides));
      vi.spyOn(configAdapter, 'enrichSharedObjectRefs').mockImplementation((c) => Promise.resolve(c));

      const client = await BucketClient.initialize({
        suiClient: asSuiClient({ getObjects: vi.fn() }),
        network: 'mainnet',
        configOverrides: { PRICE_SERVICE_ENDPOINT: 'https://custom.hermes.test' },
      });

      mockConvert.mockClear();

      await client.refreshConfig();

      expect(mockConvert).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ PRICE_SERVICE_ENDPOINT: 'https://custom.hermes.test' }),
      );
      const config = client.getConfig();
      expect(config.PRICE_SERVICE_ENDPOINT).toBe('https://custom.hermes.test');
    });

    it('refreshConfig({}) uses empty overrides, not configOverrides', async () => {
      vi.spyOn(bucketConfig, 'queryAllConfig').mockResolvedValue({
        config: { id: '0x1', id_vector: [] },
      } as Awaited<ReturnType<typeof bucketConfig.queryAllConfig>>);
      const mockConvert = vi
        .spyOn(configAdapter, 'convertOnchainConfig')
        .mockImplementation((_onchain, overrides = {}) => minimalConfig(overrides));
      vi.spyOn(configAdapter, 'enrichSharedObjectRefs').mockImplementation((c) => Promise.resolve(c));

      const client = await BucketClient.initialize({
        suiClient: asSuiClient({ getObjects: vi.fn() }),
        network: 'mainnet',
        configOverrides: { PRICE_SERVICE_ENDPOINT: 'https://from.configOverrides.test' },
      });

      mockConvert.mockClear();

      await client.refreshConfig({});

      expect(mockConvert).toHaveBeenCalledWith(expect.anything(), {});
      expect(mockConvert).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ PRICE_SERVICE_ENDPOINT: 'https://from.configOverrides.test' }),
      );
    });

    it('when refreshConfig(overrides) is called with explicit overrides, uses those instead of configOverrides', async () => {
      vi.spyOn(bucketConfig, 'queryAllConfig').mockResolvedValue({
        config: { id: '0x1', id_vector: [] },
      } as Awaited<ReturnType<typeof bucketConfig.queryAllConfig>>);
      const mockConvert = vi
        .spyOn(configAdapter, 'convertOnchainConfig')
        .mockImplementation((_onchain, overrides = {}) => minimalConfig(overrides));
      vi.spyOn(configAdapter, 'enrichSharedObjectRefs').mockImplementation((c) => Promise.resolve(c));

      const client = await BucketClient.initialize({
        suiClient: asSuiClient({ getObjects: vi.fn() }),
        network: 'mainnet',
        configOverrides: { PRICE_SERVICE_ENDPOINT: 'https://original.override.test' },
      });

      mockConvert.mockClear();

      await client.refreshConfig({ PRICE_SERVICE_ENDPOINT: 'https://explicit.override.test' });

      expect(mockConvert).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ PRICE_SERVICE_ENDPOINT: 'https://explicit.override.test' }),
      );
      const config = client.getConfig();
      expect(config.PRICE_SERVICE_ENDPOINT).toBe('https://explicit.override.test');
    });

    it('refreshConfig() uses configObjectId from initialize', async () => {
      const querySpy = vi.spyOn(bucketConfig, 'queryAllConfig').mockResolvedValue({
        config: { id: '0x1', id_vector: [] },
      } as Awaited<ReturnType<typeof bucketConfig.queryAllConfig>>);
      vi.spyOn(configAdapter, 'convertOnchainConfig').mockImplementation(() => minimalConfig());
      vi.spyOn(configAdapter, 'enrichSharedObjectRefs').mockImplementation((c) => Promise.resolve(c));

      const customConfigId = '0xcustom-config-for-testing';
      const client = await BucketClient.initialize({
        suiClient: asSuiClient({ getObjects: vi.fn() }),
        network: 'mainnet',
        configObjectId: customConfigId,
      });

      querySpy.mockClear();
      await client.refreshConfig();

      expect(querySpy).toHaveBeenCalledWith(expect.anything(), 'mainnet', customConfigId);
    });
  });

  describe('constructor requires config', () => {
    it('throws when config is undefined', () => {
      expect(
        () =>
          new BucketClient({
            suiClient: asSuiClient({}),
            network: 'mainnet',
            config: undefined as unknown as ConfigType,
          }),
      ).toThrow('BucketClient requires config');
    });

    it('throws when config is null', () => {
      expect(
        () =>
          new BucketClient({
            suiClient: asSuiClient({}),
            network: 'mainnet',
            config: null as unknown as ConfigType,
          }),
      ).toThrow('BucketClient requires config');
    });

    it('accepts custom config for testing', () => {
      const custom = minimalConfig({ PRICE_SERVICE_ENDPOINT: 'https://custom.test' });
      const client = new BucketClient({
        suiClient: asSuiClient({ getObjects: vi.fn() }),
        network: 'mainnet',
        config: custom,
      });
      const config = client.getConfig();
      expect(config).toBeDefined();
      expect(config.PRICE_SERVICE_ENDPOINT).toBe('https://custom.test');
    });
  });

  describe('initialize with custom config', () => {
    it('skips chain fetch when config is provided', async () => {
      const querySpy = vi.spyOn(bucketConfig, 'queryAllConfig');
      vi.spyOn(configAdapter, 'enrichSharedObjectRefs').mockImplementation((c) => Promise.resolve(c));

      const custom = minimalConfig({ PRICE_SERVICE_ENDPOINT: 'https://prebuilt.test' });
      const client = await BucketClient.initialize({
        suiClient: asSuiClient({ getObjects: vi.fn() }),
        network: 'mainnet',
        config: custom,
      });

      expect(querySpy).not.toHaveBeenCalled();
      expect(client.getConfig().PRICE_SERVICE_ENDPOINT).toBe('https://prebuilt.test');
    });

    it('uses provided config as-is (configOverrides ignored when config is passed)', async () => {
      vi.spyOn(configAdapter, 'enrichSharedObjectRefs').mockImplementation((c) => Promise.resolve(c));

      const custom = minimalConfig({ PRICE_SERVICE_ENDPOINT: 'https://base.test' });
      const client = await BucketClient.initialize({
        suiClient: asSuiClient({ getObjects: vi.fn() }),
        network: 'mainnet',
        config: custom,
        configOverrides: { PRICE_SERVICE_ENDPOINT: 'https://override.test' },
      });

      // When config is passed, configOverrides is not applied (only used with chain fetch)
      expect(client.getConfig().PRICE_SERVICE_ENDPOINT).toBe('https://base.test');
    });
  });

  describe('initialize failure cases', () => {
    it('propagates error when queryAllConfig fails', async () => {
      vi.spyOn(bucketConfig, 'queryAllConfig').mockRejectedValue(new Error('RPC failed'));

      await expect(
        BucketClient.initialize({
          suiClient: asSuiClient({ getObjects: vi.fn() }),
          network: 'mainnet',
        }),
      ).rejects.toThrow('RPC failed');
    });

    it('propagates error when enrichSharedObjectRefs fails', async () => {
      vi.spyOn(bucketConfig, 'queryAllConfig').mockResolvedValue({
        config: { id: '0x1', id_vector: [] },
      } as Awaited<ReturnType<typeof bucketConfig.queryAllConfig>>);
      vi.spyOn(configAdapter, 'convertOnchainConfig').mockImplementation(() => minimalConfig());
      vi.spyOn(configAdapter, 'enrichSharedObjectRefs').mockRejectedValue(new Error('Enrich failed'));

      await expect(
        BucketClient.initialize({
          suiClient: asSuiClient({ getObjects: vi.fn() }),
          network: 'mainnet',
        }),
      ).rejects.toThrow('Enrich failed');
    });

    it('propagates error when passing custom config and enrichSharedObjectRefs fails', async () => {
      vi.spyOn(configAdapter, 'enrichSharedObjectRefs').mockRejectedValue(new Error('Enrich custom failed'));

      await expect(
        BucketClient.initialize({
          suiClient: asSuiClient({ getObjects: vi.fn() }),
          network: 'mainnet',
          config: minimalConfig(),
        }),
      ).rejects.toThrow('Enrich custom failed');
    });

    it('propagates error when configObjectId is invalid and chain fetch fails', async () => {
      vi.spyOn(bucketConfig, 'queryAllConfig').mockRejectedValue(new Error('Object not found'));

      await expect(
        BucketClient.initialize({
          suiClient: asSuiClient({ getObjects: vi.fn() }),
          network: 'mainnet',
          configObjectId: '0xinvalid',
        }),
      ).rejects.toThrow('Object not found');
    });
  });
});
