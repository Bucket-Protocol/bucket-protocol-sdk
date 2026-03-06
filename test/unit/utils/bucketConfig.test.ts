import type { SuiGrpcClient } from '@mysten/sui/grpc';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Network } from '../../../src/types/index.js';
import { queryAllConfig, toJson } from '../../../src/utils/bucketConfig.js';
import type { BucketOnchainConfig } from '../../../src/utils/bucketConfig.js';

const TYPE_PACKAGE_CONFIG = '::package_config::PackageConfig';
const TYPE_ORACLE_CONFIG = '::oracle_config::OracleConfig';
const TYPE_OBJECT_CONFIG = '::object_config::ObjectConfig';
const TYPE_AGGREGATOR = '::aggregator::Aggregator';

describe('unit/utils/bucketConfig', () => {
  const asSuiClient = (m: unknown) => m as unknown as SuiGrpcClient;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('queryAllConfig', () => {
    it('throws when network has no ENTRY_CONFIG_ID', async () => {
      const getObjects = vi.fn();
      const client = asSuiClient({ getObjects });
      await expect(queryAllConfig(client, 'invalid' as Network)).rejects.toThrow(
        'No ENTRY_CONFIG_ID configured for network "invalid"',
      );
      expect(getObjects).not.toHaveBeenCalled();
    });

    it('throws when config object fetch returns Error', async () => {
      const client = asSuiClient({
        getObjects: vi.fn().mockResolvedValue({
          objects: [new Error('RPC failed')],
        }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow('Failed to fetch Config object: RPC failed');
    });

    it('throws when config object has no JSON content', async () => {
      const client = asSuiClient({
        getObjects: vi.fn().mockResolvedValue({
          objects: [{ type: '0x1::config::Config', objectId: '0x1', json: null }],
        }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow('Config object has no JSON content');
    });

    it('returns minimal result when id_vector is empty', async () => {
      const getObjects = vi.fn().mockResolvedValue({
        objects: [
          {
            type: '0x1::config::Config',
            objectId: '0xconfig',
            json: { id: '0xconfig', id_vector: [] },
          },
        ],
      });
      const result = await queryAllConfig(asSuiClient({ getObjects }), 'mainnet');
      expect(result).toEqual({
        config: { id: '0xconfig', id_vector: [] },
      });
      expect(getObjects).toHaveBeenCalledTimes(1);
    });

    it('throws when sub-object has no JSON content (fail-fast)', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [{ type: '0x1::config::Config', objectId: '0xc', json: { id: '0xc', id_vector: ['0xo1'] } }],
          })
          .mockResolvedValueOnce({
            objects: [
              {
                type: `0x1${TYPE_PACKAGE_CONFIG}`,
                objectId: '0xo1',
                json: null,
              },
            ],
          }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow(
        'Config sub-object 0xo1 (type: 0x1::package_config::PackageConfig) has no JSON content',
      );
    });

    it('throws when sub-object fetch returns Error (fail-fast)', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              { type: '0x1::config::Config', objectId: '0xc', json: { id: '0xc', id_vector: ['0xo1', '0xo2'] } },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              new Error('Object not found'),
              {
                type: `0x1${TYPE_PACKAGE_CONFIG}`,
                objectId: '0xo2',
                json: { id: '0xo2', framework_package_id: '0xpkg' },
              },
            ],
          }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow(
        'Failed to fetch config sub-object: Object not found',
      );
    });

    it('parses VecMap from array format', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle', '0xobj', '0xagg'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              { type: `0x1${TYPE_PACKAGE_CONFIG}`, objectId: '0xpkg', json: { framework_package_id: '0xfw' } },
              { type: `0x1${TYPE_ORACLE_CONFIG}`, objectId: '0xoracle', json: { pyth_state_id: '0xpyth' } },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { treasury_obj: { objectId: '0xt' } },
              },
              {
                type: `0x1${TYPE_AGGREGATOR}`,
                objectId: '0xagg',
                json: {
                  id: '0xagg',
                  table: [{ key: '0x2::sui::SUI', value: { priceAggregator: '0xpa' } }],
                },
              },
            ],
          }),
      });
      const result = await queryAllConfig(client, 'mainnet');
      expect(result.aggregator?.entries['0x2::sui::SUI']).toEqual({ priceAggregator: '0xpa' });
    });

    it('parses VecMap when table is null (returns empty entries)', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle', '0xobj', '0xagg'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              { type: `0x1${TYPE_PACKAGE_CONFIG}`, objectId: '0xpkg', json: { framework_package_id: '0xfw' } },
              { type: `0x1${TYPE_ORACLE_CONFIG}`, objectId: '0xoracle', json: { pyth_state_id: '0xpyth' } },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { treasury_obj: { objectId: '0xt' } },
              },
              {
                type: `0x1${TYPE_AGGREGATOR}`,
                objectId: '0xagg',
                json: { id: '0xagg', table: null },
              },
            ],
          }),
      });
      const result = await queryAllConfig(client, 'mainnet');
      expect(result.aggregator?.entries).toEqual({});
    });

    it('parses VecMap when table is neither array nor contents (returns empty entries)', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle', '0xobj', '0xagg'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              { type: `0x1${TYPE_PACKAGE_CONFIG}`, objectId: '0xpkg', json: { framework_package_id: '0xfw' } },
              { type: `0x1${TYPE_ORACLE_CONFIG}`, objectId: '0xoracle', json: { pyth_state_id: '0xpyth' } },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { treasury_obj: { objectId: '0xt' } },
              },
              {
                type: `0x1${TYPE_AGGREGATOR}`,
                objectId: '0xagg',
                json: { id: '0xagg', table: 123 },
              },
            ],
          }),
      });
      const result = await queryAllConfig(client, 'mainnet');
      expect(result.aggregator?.entries).toEqual({});
    });

    it('parses VecMap from contents object format', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle', '0xobj', '0xagg'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              { type: `0x1${TYPE_PACKAGE_CONFIG}`, objectId: '0xpkg', json: { framework_package_id: '0xfw' } },
              { type: `0x1${TYPE_ORACLE_CONFIG}`, objectId: '0xoracle', json: { pyth_state_id: '0xpyth' } },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { treasury_obj: { objectId: '0xt' } },
              },
              {
                type: `0x1${TYPE_AGGREGATOR}`,
                objectId: '0xagg',
                json: {
                  id: '0xagg',
                  table: {
                    contents: [{ key: 'coin', value: { pool: '0xp' } }],
                  },
                },
              },
            ],
          }),
      });
      const result = await queryAllConfig(client, 'mainnet');
      expect(result.aggregator?.entries.coin).toEqual({ pool: '0xp' });
    });

    it('warns on unknown object type', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle', '0xobj', '0xunknown'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              { type: `0x1${TYPE_PACKAGE_CONFIG}`, objectId: '0xpkg', json: { framework_package_id: '0xfw' } },
              { type: `0x1${TYPE_ORACLE_CONFIG}`, objectId: '0xoracle', json: { pyth_state_id: '0xpyth' } },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { treasury_obj: { objectId: '0xt' } },
              },
              {
                type: '0x1::unknown::UnknownType',
                objectId: '0xunknown',
                json: { id: '0xunknown' },
              },
            ],
          }),
      });
      const result = await queryAllConfig(client, 'mainnet');
      expect(warnSpy).toHaveBeenCalledWith('Unknown object type: 0x1::unknown::UnknownType (objectId: 0xunknown)');
      expect(result.packageConfig).toBeDefined();
      warnSpy.mockRestore();
    });

    it('throws when processing fails (fail-fast)', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xbad', '0xgood'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              {
                type: `0x1${TYPE_AGGREGATOR}`,
                objectId: '0xbad',
                json: { id: '0xbad', table: { contents: 123 } },
              },
              {
                type: `0x1${TYPE_PACKAGE_CONFIG}`,
                objectId: '0xgood',
                json: { id: '0xgood', framework_package_id: '0xpkg' },
              },
            ],
          }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow(/Failed to process config sub-object 0xbad/);
    });

    it('assigns packageConfig, oracleConfig, objectConfig from sub-objects', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle', '0xobj'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              {
                type: `0x1${TYPE_PACKAGE_CONFIG}`,
                objectId: '0xpkg',
                json: { id: '0xpkg', framework_package_id: '0xfw', usdb_package_id: '0xusdb' },
              },
              {
                type: `0x1${TYPE_ORACLE_CONFIG}`,
                objectId: '0xoracle',
                json: { id: '0xoracle', pyth_state_id: '0xpyth' },
              },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { id: '0xobj', treasury_obj: { objectId: '0xtreasury', initial_shared_version: 1 } },
              },
            ],
          }),
      });
      const result = await queryAllConfig(client, 'mainnet');
      expect(result.packageConfig?.usdb_package_id).toBe('0xusdb');
      expect(result.oracleConfig?.pyth_state_id).toBe('0xpyth');
      expect(result.objectConfig?.treasury_obj).toBeDefined();
    });

    it('throws when required section is missing - expect.fail if no throw', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xunknown'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::unknown::UnknownType',
                objectId: '0xunknown',
                json: { id: '0xunknown' },
              },
            ],
          }),
      });
      try {
        await queryAllConfig(client, 'mainnet');
        expect.fail('Should have thrown for missing required section');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toContain('required section "PackageConfig"');
      }
      warnSpy.mockRestore();
    });

    it('throws when required key field is empty', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle', '0xobj'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              {
                type: `0x1${TYPE_PACKAGE_CONFIG}`,
                objectId: '0xpkg',
                json: { id: '0xpkg', framework_package_id: '', usdb_package_id: '0xusdb' },
              },
              {
                type: `0x1${TYPE_ORACLE_CONFIG}`,
                objectId: '0xoracle',
                json: { id: '0xoracle', pyth_state_id: '0xpyth' },
              },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { id: '0xobj', treasury_obj: { objectId: '0xtreasury', initial_shared_version: 1 } },
              },
            ],
          }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow(
        'required field "framework_package_id" in PackageConfig is missing or empty',
      );
    });

    it('throws when oracleConfig section is missing', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xobj'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              { type: `0x1${TYPE_PACKAGE_CONFIG}`, objectId: '0xpkg', json: { framework_package_id: '0xfw' } },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { treasury_obj: { objectId: '0xt' } },
              },
            ],
          }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow(
        'Config incomplete: required section "OracleConfig" (oracleConfig) is missing',
      );
    });

    it('throws when objectConfig section is missing', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              { type: `0x1${TYPE_PACKAGE_CONFIG}`, objectId: '0xpkg', json: { framework_package_id: '0xfw' } },
              { type: `0x1${TYPE_ORACLE_CONFIG}`, objectId: '0xoracle', json: { pyth_state_id: '0xpyth' } },
            ],
          }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow(
        'Config incomplete: required section "ObjectConfig" (objectConfig) is missing',
      );
    });

    it('throws when pyth_state_id is empty', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle', '0xobj'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              { type: `0x1${TYPE_PACKAGE_CONFIG}`, objectId: '0xpkg', json: { framework_package_id: '0xfw' } },
              { type: `0x1${TYPE_ORACLE_CONFIG}`, objectId: '0xoracle', json: { pyth_state_id: '' } },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { treasury_obj: { objectId: '0xt' } },
              },
            ],
          }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow(
        'required field "pyth_state_id" in OracleConfig is missing or empty',
      );
    });

    it('throws when treasury_obj has empty objectId', async () => {
      const client = asSuiClient({
        getObjects: vi
          .fn()
          .mockResolvedValueOnce({
            objects: [
              {
                type: '0x1::config::Config',
                objectId: '0xc',
                json: { id: '0xc', id_vector: ['0xpkg', '0xoracle', '0xobj'] },
              },
            ],
          })
          .mockResolvedValueOnce({
            objects: [
              { type: `0x1${TYPE_PACKAGE_CONFIG}`, objectId: '0xpkg', json: { framework_package_id: '0xfw' } },
              { type: `0x1${TYPE_ORACLE_CONFIG}`, objectId: '0xoracle', json: { pyth_state_id: '0xpyth' } },
              {
                type: `0x1${TYPE_OBJECT_CONFIG}`,
                objectId: '0xobj',
                json: { treasury_obj: { objectId: '', initial_shared_version: 1 } },
              },
            ],
          }),
      });
      await expect(queryAllConfig(client, 'mainnet')).rejects.toThrow(
        'required field "treasury_obj" in ObjectConfig is missing or empty',
      );
    });
  });

  describe('toJson', () => {
    it('serializes BigInt to string', () => {
      const config: BucketOnchainConfig = {
        config: { id: '0x1', id_vector: [] },
        packageConfig: { fee: 100n },
      };
      const json = toJson(config);
      expect(json).toContain('"100"');
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('produces pretty-printed JSON with 2-space indent', () => {
      const config: BucketOnchainConfig = {
        config: { id: '0x1', id_vector: [] },
      };
      const json = toJson(config);
      expect(json).toContain('\n  ');
    });
  });
});
