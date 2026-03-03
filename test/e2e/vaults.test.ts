import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { describe, expect, it } from 'vitest';

import { MAINNET_TIMEOUT_MS, bucketClient } from './helpers/setup.js';

describe('E2E Vaults', () => {
  it(
    'getAllVaultObjects: one entry per collateral type, all with required VaultInfo fields',
    async () => {
      const allVaults = await bucketClient.getAllVaultObjects();
      const collateralTypes = bucketClient.getAllCollateralTypes();
      expect(Object.keys(allVaults).length).toBe(collateralTypes.length);
      for (const [coinType, vault] of Object.entries(allVaults)) {
        expect(collateralTypes).toContain(coinType);
        expect(vault.collateralType).toBe(coinType);
        expect(typeof vault.positionTableSize).toBe('number');
        expect(vault.positionTableSize).toBeGreaterThanOrEqual(0);
        expect(typeof vault.collateralDecimal).toBe('number');
        expect(vault.collateralBalance >= 0n).toBe(true);
        expect(vault.usdbSupply >= 0n).toBe(true);
        expect(vault.maxUsdbSupply > 0n).toBe(true);
        expect(typeof vault.interestRate).toBe('number');
        expect(typeof vault.minCollateralRatio).toBe('number');
        expect(vault.minCollateralRatio).toBeGreaterThanOrEqual(1);
        expect(vault.rewardRate).toBeDefined();
        expect(typeof vault.rewardRate).toBe('object');
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getAllVaultObjects: at least one SCALLOP vault has non-empty rewardRate',
    async () => {
      const allVaults = await bucketClient.getAllVaultObjects();
      const scallopVaults = Object.entries(allVaults).filter(
        ([coinType]) => coinType.includes('SCALLOP_') && !coinType.includes('_DEEP'),
      );
      expect(scallopVaults.length).toBeGreaterThan(0);
      for (const [, vault] of scallopVaults) {
        expect(vault.rewardRate).toBeDefined();
        expect(typeof vault.rewardRate).toBe('object');
        expect(Object.keys(vault.rewardRate).length).toBeGreaterThan(0);
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getVaultObjectInfo returns config for known collateral (SUI)',
    () => {
      const info = bucketClient.getVaultObjectInfo({ coinType: SUI_TYPE_ARG });
      expect(info).toHaveProperty('vault');
      expect(info.vault).toHaveProperty('objectId');
      expect(typeof info.vault.objectId).toBe('string');
      expect(info.vault.objectId.length).toBeGreaterThan(0);
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'getBorrowRewardFlowRate returns record for SUI vault',
    async () => {
      const flowRates = await bucketClient.getBorrowRewardFlowRate({ coinType: SUI_TYPE_ARG });
      expect(typeof flowRates).toBe('object');
      for (const [rewardType, rate] of Object.entries(flowRates)) {
        expect(typeof rewardType).toBe('string');
        expect(typeof rate === 'bigint').toBe(true);
        expect(rate >= 0n).toBe(true);
      }
    },
    MAINNET_TIMEOUT_MS,
  );

  it(
    'SUI vault has minCollateralRatio in reasonable range (e.g. 110%–200%)',
    async () => {
      const allVaults = await bucketClient.getAllVaultObjects();
      const suiEntry = Object.entries(allVaults).find(
        ([coinType]) => normalizeStructTag(coinType) === normalizeStructTag(SUI_TYPE_ARG),
      );
      expect(suiEntry).toBeDefined();
      const suiVault = suiEntry![1];
      expect(suiVault.minCollateralRatio).toBeGreaterThanOrEqual(1);
      expect(suiVault.minCollateralRatio).toBeLessThanOrEqual(2);
    },
    MAINNET_TIMEOUT_MS,
  );
});
