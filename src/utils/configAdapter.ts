import type { SuiGrpcClient } from '@mysten/sui/grpc';

import type {
  AggregatorObjectInfo,
  ConfigType,
  PriceConfigInfo,
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
  const toStr = (v: unknown) => (v === undefined || v === null ? '0' : String(v));
  if (typeof json === 'string') {
    return { objectId: json, initialSharedVersion: '0', mutable };
  }
  const obj = json as Record<string, unknown>;
  return {
    objectId: (obj.id ?? obj.objectId ?? '') as string,
    initialSharedVersion: toStr(obj.initial_shared_version ?? obj.initialSharedVersion ?? '0'),
    mutable: (obj.mutable as boolean | undefined) ?? mutable,
  };
}

function needsVersionEnrichment(ref: SharedObjectRef): boolean {
  if (!ref.objectId || ref.objectId === '') return false;
  const v = ref.initialSharedVersion;
  return String(v) === '0';
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
  const pkg = (onchain.packageConfig ?? {}) as Record<string, unknown>;
  const oracle = (onchain.oracleConfig ?? {}) as Record<string, unknown>;
  const obj = (onchain.objectConfig ?? {}) as Record<string, unknown>;

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
      : { objectId: '', initialSharedVersion: '0', mutable: false },

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
      : { objectId: '', initialSharedVersion: '0', mutable: true },
    VAULT_REWARDER_REGISTRY: obj.vault_rewarder_registry
      ? toSharedObjectRef(obj.vault_rewarder_registry, false)
      : { objectId: '', initialSharedVersion: '0', mutable: false },
    SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: obj.saving_pool_incentive_global_config_obj
      ? toSharedObjectRef(obj.saving_pool_incentive_global_config_obj, false)
      : { objectId: '', initialSharedVersion: '0', mutable: false },
    FLASH_GLOBAL_CONFIG_OBJ: obj.flash_global_config_obj
      ? toSharedObjectRef(obj.flash_global_config_obj, true)
      : { objectId: '', initialSharedVersion: '0', mutable: true },
    BLACKLIST_OBJ: obj.blacklist_obj
      ? toSharedObjectRef(obj.blacklist_obj, false)
      : { objectId: '', initialSharedVersion: '0', mutable: false },

    // Per-coin records (populated below)
    AGGREGATOR_OBJS: {},
    VAULT_OBJS: {},
    SAVING_POOL_OBJS: {},
    PSM_POOL_OBJS: {},
    PRICE_OBJS: {},
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

  // --- Price config entries ---
  if (onchain.priceConfig?.entries) {
    for (const [key, entry] of Object.entries(onchain.priceConfig.entries)) {
      config.PRICE_OBJS[key] = parsePriceEntry(entry);
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
  const variant = e['@variant'] as string | undefined;
  const priceAgg = toSharedObjectRef(e.price_aggregator ?? e.priceAggregator, false);

  if (variant === 'Pyth') {
    return {
      Pyth: {
        priceAggregator: priceAgg,
        pythPriceId: (e.pyth_price_id ?? e.pythPriceId ?? '') as string,
      },
    };
  }

  if (variant === 'DerivativeInfo') {
    const di = (e.derivative_info ?? e.derivativeInfo) as Record<string, unknown> | undefined;
    return {
      DerivativeInfo: {
        priceAggregator: priceAgg,
        underlying_coin_type: (di?.underlying_coin_type ??
          di?.underlyingCoinType ??
          e.underlying_coin_type ??
          e.underlyingCoinType ??
          '') as string,
        derivative_kind: (di?.derivative_kind ??
          di?.derivativeKind ??
          e.derivative_kind ??
          e.derivativeKind ??
          '') as string,
      },
    };
  }

  // Fallback: flat struct format (legacy)
  const derivativeRaw = e.derivative_info ?? e.derivativeInfo;
  if (derivativeRaw) {
    const di = derivativeRaw as Record<string, unknown>;
    return {
      DerivativeInfo: {
        priceAggregator: priceAgg,
        underlying_coin_type: (di.underlying_coin_type ?? di.underlyingCoinType ?? '') as string,
        derivative_kind: (di.derivative_kind ?? di.derivativeKind ?? '') as string,
      },
    };
  }

  return {
    Pyth: {
      priceAggregator: priceAgg,
      pythPriceId: (e.pyth_price_id ?? e.pythPriceId ?? '') as string,
    },
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
        rewarder_id: (rr.rewarder_id ?? rr.rewarderId ?? '') as string,
        reward_type: (rr.reward_type ?? rr.rewardType ?? '') as string,
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
      reward_manager: toSharedObjectRef(reward.reward_manager ?? reward.rewardManager, true),
      reward_types: (reward.reward_types ?? reward.rewardTypes ?? []) as string[],
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

function parsePriceEntry(entry: unknown): PriceConfigInfo {
  const e = entry as Record<string, unknown>;
  const variant = e['@variant'] as string | undefined;

  switch (variant) {
    case 'SCOIN':
      return {
        SCOIN: {
          package: (e.package ?? '') as string,
          scoin_rule_config: toSharedObjectRef(e.scoin_rule_config ?? e.scoinRuleConfig, false),
          scallop_version: toSharedObjectRef(e.scallop_version ?? e.scallopVersion, false),
          scallop_market: toSharedObjectRef(e.scallop_market ?? e.scallopMarket, false),
        },
      };
    case 'GCOIN':
      return {
        GCOIN: {
          package: (e.package ?? '') as string,
          gcoin_rule_config: toSharedObjectRef(e.gcoin_rule_config ?? e.gcoinRuleConfig, false),
          unihouse_object: toSharedObjectRef(e.unihouse_object ?? e.unihouseObject, false),
        },
      };
    case 'BFBTC':
      return {
        BFBTC: {
          package: (e.package ?? '') as string,
          bfbtc_rule_config: toSharedObjectRef(e.bfbtc_rule_config ?? e.bfbtcRuleConfig, false),
        },
      };
    default:
      throw new Error(`Unknown PriceConfigInfo variant: ${variant}`);
  }
}

// ============================================================
// Enrichment: fetch initialSharedVersion for refs that only have objectId
// ============================================================

/**
 * Fetches initialSharedVersion for SharedObjectRefs that have objectId but
 * initialSharedVersion 0 (e.g. from on-chain JSON storing just the ID string).
 * Sui PTB requires correct initialSharedVersion; using 0 causes tx failure.
 */
export async function enrichSharedObjectRefs(config: ConfigType, client: SuiGrpcClient): Promise<ConfigType> {
  const refsToEnrich: SharedObjectRef[] = [];

  const collect = (ref: SharedObjectRef) => {
    if (needsVersionEnrichment(ref)) refsToEnrich.push(ref);
  };

  collect(config.PYTH_RULE_CONFIG_OBJ);
  collect(config.TREASURY_OBJ);
  collect(config.VAULT_REWARDER_REGISTRY);
  collect(config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ);
  collect(config.FLASH_GLOBAL_CONFIG_OBJ);
  collect(config.BLACKLIST_OBJ);
  for (const priceInfo of Object.values(config.PRICE_OBJS)) {
    if ('SCOIN' in priceInfo && priceInfo.SCOIN) {
      collect(priceInfo.SCOIN.scoin_rule_config);
      collect(priceInfo.SCOIN.scallop_version);
      collect(priceInfo.SCOIN.scallop_market);
    } else if ('GCOIN' in priceInfo && priceInfo.GCOIN) {
      collect(priceInfo.GCOIN.gcoin_rule_config);
      collect(priceInfo.GCOIN.unihouse_object);
    } else if ('BFBTC' in priceInfo && priceInfo.BFBTC) {
      collect(priceInfo.BFBTC.bfbtc_rule_config);
    }
  }
  for (const info of Object.values(config.AGGREGATOR_OBJS)) {
    const agg = 'Pyth' in info ? info.Pyth : info.DerivativeInfo;
    if (agg) collect(agg.priceAggregator);
  }
  for (const info of Object.values(config.VAULT_OBJS)) {
    collect(info.vault);
  }
  for (const info of Object.values(config.SAVING_POOL_OBJS)) {
    collect(info.pool);
    if (info.reward) collect(info.reward.reward_manager);
  }
  for (const info of Object.values(config.PSM_POOL_OBJS)) {
    collect(info.pool);
  }

  const objectIds = [...new Set(refsToEnrich.map((r) => r.objectId))];
  if (objectIds.length === 0) return config;

  const { objects } = await client.getObjects({ objectIds, include: { json: false } });
  const versionMap = new Map<string, string>();

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    if (obj instanceof Error) {
      const objectId = objectIds[i] ?? '(unknown)';
      // eslint-disable-next-line no-console
      console.warn(
        `[enrichSharedObjectRefs] getObjects returned Error for objectId ${objectId}; initialSharedVersion will remain 0 and PTB may fail at execution:`,
        obj.message ?? obj,
      );
      continue;
    }
    const owner = (obj as { owner?: { $kind?: string; Shared?: { initialSharedVersion?: string } } }).owner;
    if (owner?.$kind === 'Shared' && owner.Shared?.initialSharedVersion) {
      versionMap.set(obj.objectId, owner.Shared.initialSharedVersion);
    }
  }

  const enriched = JSON.parse(JSON.stringify(config)) as ConfigType;

  const apply = (ref: SharedObjectRef) => {
    const v = versionMap.get(ref.objectId);
    if (v) ref.initialSharedVersion = v;
  };

  apply(enriched.PYTH_RULE_CONFIG_OBJ);
  apply(enriched.TREASURY_OBJ);
  apply(enriched.VAULT_REWARDER_REGISTRY);
  apply(enriched.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ);
  apply(enriched.FLASH_GLOBAL_CONFIG_OBJ);
  apply(enriched.BLACKLIST_OBJ);
  for (const priceInfo of Object.values(enriched.PRICE_OBJS)) {
    if ('SCOIN' in priceInfo && priceInfo.SCOIN) {
      apply(priceInfo.SCOIN.scoin_rule_config);
      apply(priceInfo.SCOIN.scallop_version);
      apply(priceInfo.SCOIN.scallop_market);
    } else if ('GCOIN' in priceInfo && priceInfo.GCOIN) {
      apply(priceInfo.GCOIN.gcoin_rule_config);
      apply(priceInfo.GCOIN.unihouse_object);
    } else if ('BFBTC' in priceInfo && priceInfo.BFBTC) {
      apply(priceInfo.BFBTC.bfbtc_rule_config);
    }
  }
  for (const info of Object.values(enriched.AGGREGATOR_OBJS)) {
    const agg = 'Pyth' in info ? info.Pyth : info.DerivativeInfo;
    if (agg) apply(agg.priceAggregator);
  }
  for (const info of Object.values(enriched.VAULT_OBJS)) apply(info.vault);
  for (const info of Object.values(enriched.SAVING_POOL_OBJS)) {
    apply(info.pool);
    if (info.reward) apply(info.reward.reward_manager);
  }
  for (const info of Object.values(enriched.PSM_POOL_OBJS)) apply(info.pool);

  return enriched;
}
