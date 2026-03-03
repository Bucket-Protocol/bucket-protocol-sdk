import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  afterFileEnd,
  afterTestDelay,
  bucketClient,
  MAINNET_TIMEOUT_MS,
  setupE2E,
  testAccount,
} from './helpers/setup.js';

describe('E2E Positions & accounts', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);
  afterEach(afterTestDelay);

  it(
    'getAccountPositions length <= getUserPositions length',
    async () => {
      const accountPositions = await bucketClient.getAccountPositions({ address: testAccount });
      const userPositions = await bucketClient.getUserPositions({ address: testAccount });
      expect(accountPositions.length).toBeLessThanOrEqual(userPositions.length);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAllPositions returns paginated positions for SUI vault',
    async () => {
      const result = await bucketClient.getAllPositions({
        coinType: SUI_TYPE_ARG,
        pageSize: 10,
        cursor: null,
      });
      expect(result).toHaveProperty('positions');
      expect(result).toHaveProperty('nextCursor');
      expect(Array.isArray(result.positions)).toBe(true);
      for (const pos of result.positions) {
        expect(pos).toHaveProperty('collateralType', SUI_TYPE_ARG);
        expect(pos).toHaveProperty('collateralAmount');
        expect(pos).toHaveProperty('debtAmount');
        expect(pos).toHaveProperty('debtor');
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAllPositions fetches next page when cursor is provided',
    async () => {
      const first = await bucketClient.getAllPositions({
        coinType: SUI_TYPE_ARG,
        pageSize: 2,
        cursor: null,
      });
      if (!first.nextCursor) return;
      const next = await bucketClient.getAllPositions({
        coinType: SUI_TYPE_ARG,
        pageSize: 2,
        cursor: first.nextCursor,
      });
      expect(next).toHaveProperty('positions');
      expect(next).toHaveProperty('nextCursor');
      expect(Array.isArray(next.positions)).toBe(true);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getUserAccounts returns array (may be empty)',
    async () => {
      const accounts = await bucketClient.getUserAccounts({ address: testAccount });
      expect(Array.isArray(accounts)).toBe(true);
    },
    MAINNET_TIMEOUT_MS,
  );
});
