export type ACCEPT_ASSETS = "SUI" | "USDC" | "USDT" | "afSUI" | "haSUI" | "vSUI" | "WETH";
export type COIN = "SUI" | "USDC" | "USDT" | "afSUI" | "haSUI" | "vSUI" | "WETH" | "BUCK" | "BKT";
export type FOUNTAIN_PROVIDER = "CETUS" | "KRIYA" | "AF";
export declare const MAINNET_PACKAGE_ID: string;
export declare const MAINNET_BUCKET_OPERATIONS_PACKAGE_ID: string;
export declare const TESTNET_PACKAGE_ID: string;
export declare const TESTNET_BUCKET_OPERATIONS_PACKAGE_ID: string;
export declare const TESTNET_PROTOCOL_ID = "0x8b7ff1f21c8e80683a4504f8e564ad42e51361875ecce8c9ecc5596a67abd225";
export declare const MAINNET_PROTOCOL_ID = "0x9e3dab13212b27f5434416939db5dec6a319d15b89a84fd074d03ece6350d3df";
export declare const COINS_TYPE_LIST: Record<COIN, string>;
export declare const SUPRA_PRICE_FEEDS: {
    usdc_usd: string;
    usdt_usd: string;
    eth_usdt: string;
    sui_usdt: string;
    hasui_sui: string;
    vsui_sui: string;
    afsui_sui: string;
};
export declare const SUPRA_ID: Record<string, string>;
export declare const SWITCHBOARD_UPDATE_TARGET = "0xe2077d678de929d64d3fcd79c1adfbd23d97324e9bae3a60102d44367fbe008c::bucket_oracle::update_price_from_switchboard";
export declare const SUPRA_HANDLER_OBJECT = "0xaa0315f0748c1f24ddb2b45f7939cff40f7a8104af5ccbc4a1d32f870c0b4105";
export declare const SUPRA_UPDATE_TARGET = "0xe2077d678de929d64d3fcd79c1adfbd23d97324e9bae3a60102d44367fbe008c::bucket_oracle::update_price_from_supra";
export declare const ORACLE_OBJECT_ID = "0xf578d73f54b3068166d73c1a1edd5a105ce82f97f5a8ea1ac17d53e0132a1078";
export declare const AFSUI_APY_URL = "https://aftermath.finance/api/staking/apy";
export declare const HASUI_APY_URL = "https://www.haedal.xyz/api/stats/home";
//# sourceMappingURL=constants.d.ts.map