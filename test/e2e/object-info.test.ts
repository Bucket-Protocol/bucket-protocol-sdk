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
    () => {
      const info = bucketClient.getAggregatorObjectInfo({ coinType: SUI_TYPE_ARG });
      expect(info).toHaveProperty('priceAggregator');
      expect(info.priceAggregator).toHaveProperty('objectId');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAggregatorObjectInfo throws for unsupported coin type',
    () => {
      expect(() => bucketClient.getAggregatorObjectInfo({ coinType: '0x1::invalid::INVALID' })).toThrow(
        'Unsupported coin type',
      );
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getSavingPoolObjectInfo returns pool info for SUSDB',
    () => {
      const info = bucketClient.getSavingPoolObjectInfo({ lpType: susdbLpType });
      expect(info).toHaveProperty('pool');
      expect(info.pool).toHaveProperty('objectId');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getSavingPoolObjectInfo throws for unsupported lp type',
    () => {
      expect(() => bucketClient.getSavingPoolObjectInfo({ lpType: '0x1::invalid::INVALID' })).toThrow(
        'Unsupported coin type',
      );
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getPsmPoolObjectInfo returns pool info for USDC',
    () => {
      const info = bucketClient.getPsmPoolObjectInfo({ coinType: usdcCoinType });
      expect(info).toHaveProperty('pool');
      expect(info.pool).toHaveProperty('objectId');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getPsmPoolObjectInfo throws for unsupported coin type',
    () => {
      expect(() => bucketClient.getPsmPoolObjectInfo({ coinType: '0x1::invalid::INVALID' })).toThrow(
        'Unsupported coin type',
      );
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getVaultObjectInfo throws for unsupported collateral type',
    () => {
      expect(() => bucketClient.getVaultObjectInfo({ coinType: '0x1::invalid::INVALID' })).toThrow(
        'Unsupported collateral type',
      );
    },
    MAINNET_TIMEOUT_MS,
  );
});
