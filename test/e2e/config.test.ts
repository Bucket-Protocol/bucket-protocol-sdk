import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  afterFileEnd,
  afterTestDelay,
  bucketClient,
  getUsdbCoinType,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  suiClient,
} from './helpers/setup.js';

describe('E2E Config & metadata', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it(
    'getConfig returns config with package IDs and object refs',
    async () => {
      const config = bucketClient.getConfig();
      expect(config).toBeDefined();
      expect(config).toHaveProperty('ORIGINAL_USDB_PACKAGE_ID');
      expect(config).toHaveProperty('TREASURY_OBJ');
      expect(config).toHaveProperty('AGGREGATOR_OBJS');
      expect(config).toHaveProperty('VAULT_OBJS');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'usdbCoinType returns USDB metadata (6 decimals)',
    async () => {
      const { coinMetadata: usdbMetadata } = await suiClient.getCoinMetadata({
        coinType: getUsdbCoinType(),
      });
      expect(usdbMetadata?.decimals).toBe(6);
      expect(usdbMetadata?.symbol).toBe('USDB');
      expect(usdbMetadata?.name).toBe('Bucket USD');
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getFlashMintInfo returns feeRate and partner config',
    async () => {
      const info = await bucketClient.getFlashMintInfo();
      expect(info).toHaveProperty('feeRate');
      expect(typeof info.feeRate).toBe('number');
      expect(info.feeRate).toBeGreaterThanOrEqual(0);
      expect(info).toHaveProperty('partner');
      expect(typeof info.partner).toBe('object');
    },
    MAINNET_TIMEOUT_MS,
  );
});
