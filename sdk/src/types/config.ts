import { SharedObjectRef } from '@mysten/sui/dist/cjs/bcs/types';

export type Network = 'mainnet' /* | 'testnet' | 'devnet' | 'localnet' */;

export type AggregatorObjectInfo = {
  priceAggregator: SharedObjectRef;
  pythPriceId?: string;
};

export type VaultObjectInfo = {
  vault: SharedObjectRef;
  rewarders?: SharedObjectRef[];
};

export type CollateralObjectsInfo = {
  vault: SharedObjectRef;
  priceAggregator: SharedObjectRef;
  pythPriceId?: string;
  rewarders?: SharedObjectRef[];
};

export type ConfigType = {
  ORIGINAL_FRAMEWORK_PACKAGE_ID: string;
  ORIGINAL_USDB_PACKAGE_ID: string;
  ORIGINAL_ORACLE_PACKAGE_ID: string;
  ORIGINAL_CDP_PACKAGE_ID: string;

  FRAMEWORK_PACKAGE_ID: string;
  VUSD_PACKAGE_ID: string;
  ORACLE_PACKAGE_ID: string;
  CDP_PACKAGE_ID: string;

  TREASURY_OBJ: SharedObjectRef;

  PYTH_STATE_ID: string;
  WORMHOLE_STATE_ID: string;
  PYTH_RULE_PACKAGE_ID: string;
  PYTH_RULE_CONFIG_OBJ: SharedObjectRef;

  VAULT_OBJS: Record<string, VaultObjectInfo>;
  AGGREGATOR_OBJS: Record<string, AggregatorObjectInfo>;
};
