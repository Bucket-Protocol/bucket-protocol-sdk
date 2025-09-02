import { SharedObjectRef } from '@mysten/sui/dist/cjs/bcs/types';

export type Network = 'mainnet' | 'testnet';

export type DerivativeKind = 'sCoin' | 'gCoin';

export type AggregatorObjectInfo = {
  priceAggregator: SharedObjectRef;
  pythPriceId?: string;
  derivativeInfo?: {
    underlyingCoinType: string;
    derivativeKind: DerivativeKind;
  };
};

export type RewarderInfo = {
  rewarderId: string;
  rewardType: string;
};

export type VaultObjectInfo = {
  vault: SharedObjectRef;
  rewarders?: RewarderInfo[];
};

export type PsmPoolObjectInfo = {
  pool: SharedObjectRef;
};

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

  FRAMEWORK_PACKAGE_ID: string;
  USDB_PACKAGE_ID: string;
  ORACLE_PACKAGE_ID: string;
  CDP_PACKAGE_ID: string;
  PSM_PACKAGE_ID: string;
  FLASH_PACKAGE_ID: string;
  SAVING_PACKAGE_ID: string;
  SAVING_INCENTIVE_PACKAGE_ID: string;
  BORROW_INCENTIVE_PACKAGE_ID: string;

  TREASURY_OBJ: SharedObjectRef;
  FLASH_GLOBAL_CONFIG_OBJ: SharedObjectRef;
  SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: SharedObjectRef;
  VAULT_REWARDER_REGISTRY: SharedObjectRef;
  VAULT_OBJS: Record<string, VaultObjectInfo>;
  AGGREGATOR_OBJS: Record<string, AggregatorObjectInfo>;
  PSM_POOL_OBJS: Record<string, PsmPoolObjectInfo>;
};
