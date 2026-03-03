import type {
  AggregatorObjectInfo,
  ConfigType,
  DerivativeKind,
  PsmPoolObjectInfo,
  SavingPoolObjectInfo,
  SharedObjectRef,
  VaultObjectInfo,
} from '@/types/index.js';

import type { BucketOnchainConfig } from './bucketConfig.js';

// ============================================================
// Helper: parse a shared object ref from on-chain JSON
// ============================================================

function toSharedObjectRef(json: unknown, mutable = false): SharedObjectRef {
  if (typeof json === 'string') {
    return { objectId: json, initialSharedVersion: 0, mutable };
  }
  const obj = json as Record<string, unknown>;
  return {
    objectId: (obj.id ?? obj.objectId ?? '') as string,
    initialSharedVersion: (obj.initial_shared_version ?? obj.initialSharedVersion ?? 0) as number | string,
    mutable: (obj.mutable as boolean | undefined) ?? mutable,
  };
}

// ============================================================
// Adapter: BucketOnchainConfig → ConfigType
// ============================================================

/**
 * Convert the raw on-chain config (queried via `queryAllConfig`) into the
 * `ConfigType` shape used by `BucketClient`.
 *
 * Field name mapping relies on the Move struct field names exposed via JSON
 * representation. If the on-chain field names change, update the string
 * keys here accordingly.
 *
 * @param onchain - The raw on-chain config returned by `queryAllConfig`
 * @param overrides - Optional partial overrides (e.g. PRICE_SERVICE_ENDPOINT
 *   is off-chain and must always be provided externally)
 */
export function convertOnchainConfig(onchain: BucketOnchainConfig, overrides: Partial<ConfigType> = {}): ConfigType {
  const pkg: Record<string, unknown> = onchain.packageConfig ?? {};
  const oracle: Record<string, unknown> = onchain.oracleConfig ?? {};
  const obj: Record<string, unknown> = onchain.objectConfig ?? {};

  // --- Package IDs ---
  const config: ConfigType = {
    // Off-chain endpoint — must be supplied via overrides or falls back to public Hermes
    PRICE_SERVICE_ENDPOINT:
      overrides.PRICE_SERVICE_ENDPOINT ??
      (oracle.price_service_endpoint as string | undefined) ??
      'https://hermes.pyth.network',
    PYTH_STATE_ID: (oracle.pyth_state_id as string | undefined) ?? '',
    WORMHOLE_STATE_ID: (oracle.wormhole_state_id as string | undefined) ?? '',
    PYTH_RULE_PACKAGE_ID: (oracle.pyth_rule_package_id as string | undefined) ?? '',
    PYTH_RULE_CONFIG_OBJ: oracle.pyth_rule_config_obj
      ? toSharedObjectRef(oracle.pyth_rule_config_obj, false)
      : { objectId: '', initialSharedVersion: 0, mutable: false },

    // Original (type-origin) package IDs
    ORIGINAL_FRAMEWORK_PACKAGE_ID: (pkg.original_framework_package_id as string | undefined) ?? '',
    ORIGINAL_USDB_PACKAGE_ID: (pkg.original_usdb_package_id as string | undefined) ?? '',
    ORIGINAL_ORACLE_PACKAGE_ID: (pkg.original_oracle_package_id as string | undefined) ?? '',
    ORIGINAL_CDP_PACKAGE_ID: (pkg.original_cdp_package_id as string | undefined) ?? '',
    ORIGINAL_PSM_PACKAGE_ID: (pkg.original_psm_package_id as string | undefined) ?? '',
    ORIGINAL_FLASH_PACKAGE_ID: (pkg.original_flash_package_id as string | undefined) ?? '',
    ORIGINAL_SAVING_PACKAGE_ID: (pkg.original_saving_package_id as string | undefined) ?? '',
    ORIGINAL_SAVING_INCENTIVE_PACKAGE_ID: (pkg.original_saving_incentive_package_id as string | undefined) ?? '',
    ORIGINAL_BORROW_INCENTIVE_PACKAGE_ID: (pkg.original_borrow_incentive_package_id as string | undefined) ?? '',
    ORIGINAL_BLACKLIST_PACKAGE_ID: (pkg.original_blacklist_package_id as string | undefined) ?? '',

    // Latest (call-target) package IDs
    FRAMEWORK_PACKAGE_ID: (pkg.framework_package_id as string | undefined) ?? '',
    USDB_PACKAGE_ID: (pkg.usdb_package_id as string | undefined) ?? '',
    ORACLE_PACKAGE_ID: (pkg.oracle_package_id as string | undefined) ?? '',
    CDP_PACKAGE_ID: (pkg.cdp_package_id as string | undefined) ?? '',
    PSM_PACKAGE_ID: (pkg.psm_package_id as string | undefined) ?? '',
    FLASH_PACKAGE_ID: (pkg.flash_package_id as string | undefined) ?? '',
    SAVING_PACKAGE_ID: (pkg.saving_package_id as string | undefined) ?? '',
    SAVING_INCENTIVE_PACKAGE_ID: (pkg.saving_incentive_package_id as string | undefined) ?? '',
    BORROW_INCENTIVE_PACKAGE_ID: (pkg.borrow_incentive_package_id as string | undefined) ?? '',
    BLACKLIST_PACKAGE_ID: (pkg.blacklist_package_id as string | undefined) ?? '',

    // Shared object references
    TREASURY_OBJ: obj.treasury_obj
      ? toSharedObjectRef(obj.treasury_obj, true)
      : { objectId: '', initialSharedVersion: 0, mutable: true },
    VAULT_REWARDER_REGISTRY: obj.vault_rewarder_registry
      ? toSharedObjectRef(obj.vault_rewarder_registry, false)
      : { objectId: '', initialSharedVersion: 0, mutable: false },
    SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: obj.saving_pool_incentive_global_config_obj
      ? toSharedObjectRef(obj.saving_pool_incentive_global_config_obj, false)
      : { objectId: '', initialSharedVersion: 0, mutable: false },
    FLASH_GLOBAL_CONFIG_OBJ: obj.flash_global_config_obj
      ? toSharedObjectRef(obj.flash_global_config_obj, true)
      : { objectId: '', initialSharedVersion: 0, mutable: true },
    BLACKLIST_OBJ: obj.blacklist_obj
      ? toSharedObjectRef(obj.blacklist_obj, false)
      : { objectId: '', initialSharedVersion: 0, mutable: false },

    // Per-coin records (populated below)
    AGGREGATOR_OBJS: {},
    VAULT_OBJS: {},
    SAVING_POOL_OBJS: {},
    PSM_POOL_OBJS: {},
  };

  // --- Aggregator entries ---
  if (onchain.aggregator?.entries) {
    for (const [coinType, entry] of Object.entries(onchain.aggregator.entries)) {
      config.AGGREGATOR_OBJS[coinType] = parseAggregatorEntry(entry);
    }
  }

  // --- Vault entries ---
  if (onchain.vault?.entries) {
    for (const [coinType, entry] of Object.entries(onchain.vault.entries)) {
      config.VAULT_OBJS[coinType] = parseVaultEntry(entry);
    }
  }

  // --- Saving pool entries ---
  if (onchain.savingPool?.entries) {
    for (const [lpType, entry] of Object.entries(onchain.savingPool.entries)) {
      config.SAVING_POOL_OBJS[lpType] = parseSavingPoolEntry(entry);
    }
  }

  // --- PSM pool entries ---
  if (onchain.psmPool?.entries) {
    for (const [coinType, entry] of Object.entries(onchain.psmPool.entries)) {
      config.PSM_POOL_OBJS[coinType] = parsePsmPoolEntry(entry);
    }
  }

  // Apply any explicit overrides last
  return { ...config, ...overrides };
}

// ============================================================
// Entry parsers (adjust field names to match on-chain JSON)
// ============================================================

function parseAggregatorEntry(entry: unknown): AggregatorObjectInfo {
  const e = entry as Record<string, unknown>;
  const base = {
    priceAggregator: toSharedObjectRef(e.price_aggregator ?? e.priceAggregator, false),
  };

  const derivativeRaw = e.derivative_info ?? e.derivativeInfo;
  if (derivativeRaw) {
    const di = derivativeRaw as Record<string, unknown>;
    return {
      ...base,
      derivativeInfo: {
        underlyingCoinType: (di.underlying_coin_type ?? di.underlyingCoinType) as string,
        derivativeKind: (di.derivative_kind ?? di.derivativeKind) as DerivativeKind,
      },
    };
  }

  return {
    ...base,
    pythPriceId: (e.pyth_price_id ?? e.pythPriceId ?? '') as string,
  };
}

function parseVaultEntry(entry: unknown): VaultObjectInfo {
  const e = entry as Record<string, unknown>;
  const result: VaultObjectInfo = {
    vault: toSharedObjectRef(e.vault, true),
  };

  const rewarders = e.rewarders;
  if (Array.isArray(rewarders) && rewarders.length > 0) {
    result.rewarders = rewarders.map((r: unknown) => {
      const rr = r as Record<string, unknown>;
      return {
        rewardType: (rr.reward_type ?? rr.rewardType) as string,
        rewarderId: (rr.rewarder_id ?? rr.rewarderId) as string,
      };
    });
  }
  return result;
}

function parseSavingPoolEntry(entry: unknown): SavingPoolObjectInfo {
  const e = entry as Record<string, unknown>;
  const result: SavingPoolObjectInfo = {
    pool: toSharedObjectRef(e.pool, true),
  };

  const reward = e.reward as Record<string, unknown> | undefined;
  if (reward) {
    result.reward = {
      rewardManager: toSharedObjectRef(reward.reward_manager ?? reward.rewardManager, true),
      rewardTypes: (reward.reward_types ?? reward.rewardTypes ?? []) as string[],
    };
  }
  return result;
}

function parsePsmPoolEntry(entry: unknown): PsmPoolObjectInfo {
  const e = entry as Record<string, unknown>;
  return {
    pool: toSharedObjectRef(e.pool, true),
  };
}
