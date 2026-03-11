import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  afterFileEnd,
  afterTestDelay,
  bucketClient,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  susdbLpType,
  usdcCoinType,
} from './helpers/setup.js';

describe('E2E Object info helpers', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it(
    'getAggregatorObjectInfo returns aggregator for SUI',
    async () => {
      const info = await bucketClient.getAggregatorObjectInfo({ coinType: SUI_TYPE_ARG });
      const agg = 'Pyth' in info ? info.Pyth : info.DerivativeInfo;
      expect(agg).toBeDefined();
      expect(agg!.priceAggregator).toHaveProperty('objectId');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAggregatorObjectInfo throws for unsupported coin type',
    async () => {
      await expect(bucketClient.getAggregatorObjectInfo({ coinType: '0x1::invalid::INVALID' })).rejects.toThrow(
        'Unsupported coin type',
      );
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getSavingPoolObjectInfo returns pool info for SUSDB',
    async () => {
      const info = await bucketClient.getSavingPoolObjectInfo({ lpType: susdbLpType });
      expect(info).toHaveProperty('pool');
      expect(info.pool).toHaveProperty('objectId');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getSavingPoolObjectInfo throws for unsupported lp type',
    async () => {
      await expect(bucketClient.getSavingPoolObjectInfo({ lpType: '0x1::invalid::INVALID' })).rejects.toThrow(
        'Unsupported coin type',
      );
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getPsmPoolObjectInfo returns pool info for USDC',
    async () => {
      const info = await bucketClient.getPsmPoolObjectInfo({ coinType: usdcCoinType });
      expect(info).toHaveProperty('pool');
      expect(info.pool).toHaveProperty('objectId');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getPsmPoolObjectInfo throws for unsupported coin type',
    async () => {
      await expect(bucketClient.getPsmPoolObjectInfo({ coinType: '0x1::invalid::INVALID' })).rejects.toThrow(
        'Unsupported coin type',
      );
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getVaultObjectInfo throws for unsupported collateral type',
    async () => {
      await expect(bucketClient.getVaultObjectInfo({ coinType: '0x1::invalid::INVALID' })).rejects.toThrow(
        'Unsupported collateral type',
      );
    },
    MAINNET_TIMEOUT_MS,
  );
});
