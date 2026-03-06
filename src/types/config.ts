import type * as psm_pool from '@/_generated/bucket_onchain_config/psm_pool.js';
import type * as share from '@/_generated/bucket_onchain_config/share.js';
import type * as vault from '@/_generated/bucket_onchain_config/vault.js';

// SharedObjectRef from generated (BCS-decoded shape)
export type SharedObjectRef = (typeof share.SharedObjectRef)['$inferType'];

// RewarderInfo, PsmPoolObjectInfo: exact match with generated (MoveStruct)
export type RewarderInfo = (typeof vault.RewarderInfo)['$inferType'];
export type PsmPoolObjectInfo = (typeof psm_pool.PsmPoolObjectInfo)['$inferType'];

// AggregatorObjectInfo, PriceConfigInfo: manual — generated MoveEnum requires $kind,
// but we parse from JSON which uses { Pyth: {...} } | { DerivativeInfo: {...} } shape.
export type AggregatorObjectInfo =
  | { Pyth: { priceAggregator: SharedObjectRef; pythPriceId: string } }
  | { DerivativeInfo: { priceAggregator: SharedObjectRef; underlying_coin_type: string; derivative_kind: string } };

export type PriceConfigInfo =
  | {
      SCOIN: {
        package: string;
        scoin_rule_config: SharedObjectRef;
        scallop_version: SharedObjectRef;
        scallop_market: SharedObjectRef;
      };
    }
  | { GCOIN: { package: string; gcoin_rule_config: SharedObjectRef; unihouse_object: SharedObjectRef } }
  | { BFBTC: { package: string; bfbtc_rule_config: SharedObjectRef } };

// VaultObjectInfo, SavingPoolObjectInfo: manual — generated requires rewarders/reward
// (option types become T | null), but we omit when empty for JSON parsing.
export type VaultObjectInfo = { vault: SharedObjectRef; rewarders?: RewarderInfo[] };

export type SavingPoolObjectInfo = {
  pool: SharedObjectRef;
  reward?: { reward_manager: SharedObjectRef; reward_types: string[] };
};

export type Network = 'mainnet' | 'testnet';

export type DerivativeKind = 'sCoin' | 'gCoin' | 'TLP' | 'BFBTC';

export type ConfigType = {
  PRICE_SERVICE_ENDPOINT: string;
  PYTH_STATE_ID: string;
  WORMHOLE_STATE_ID: string;
  PYTH_RULE_PACKAGE_ID: string;
  PYTH_RULE_CONFIG_OBJ: SharedObjectRef;

  ORIGINAL_FRAMEWORK_PACKAGE_ID: string;
  ORIGINAL_USDB_PACKAGE_ID: string;
  ORIGINAL_ORACLE_PACKAGE_ID: string;
  ORIGINAL_CDP_PACKAGE_ID: string;
  ORIGINAL_PSM_PACKAGE_ID: string;
  ORIGINAL_FLASH_PACKAGE_ID: string;
  ORIGINAL_SAVING_PACKAGE_ID: string;
  ORIGINAL_SAVING_INCENTIVE_PACKAGE_ID: string;
  ORIGINAL_BORROW_INCENTIVE_PACKAGE_ID: string;
  ORIGINAL_BLACKLIST_PACKAGE_ID: string;

  FRAMEWORK_PACKAGE_ID: string;
  USDB_PACKAGE_ID: string;
  ORACLE_PACKAGE_ID: string;
  CDP_PACKAGE_ID: string;
  PSM_PACKAGE_ID: string;
  FLASH_PACKAGE_ID: string;
  SAVING_PACKAGE_ID: string;
  SAVING_INCENTIVE_PACKAGE_ID: string;
  BORROW_INCENTIVE_PACKAGE_ID: string;
  BLACKLIST_PACKAGE_ID: string;

  TREASURY_OBJ: SharedObjectRef;
  VAULT_REWARDER_REGISTRY: SharedObjectRef;
  SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: SharedObjectRef;
  FLASH_GLOBAL_CONFIG_OBJ: SharedObjectRef;
  BLACKLIST_OBJ: SharedObjectRef;

  AGGREGATOR_OBJS: Record<string, AggregatorObjectInfo>;
  VAULT_OBJS: Record<string, VaultObjectInfo>;
  SAVING_POOL_OBJS: Record<string, SavingPoolObjectInfo>;
  PSM_POOL_OBJS: Record<string, PsmPoolObjectInfo>;
  PRICE_OBJS: Record<string, PriceConfigInfo>;
};
