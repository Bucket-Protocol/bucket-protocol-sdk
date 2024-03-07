import { COIN } from "./types";
export declare const BUCKET_OPERATIONS_PACKAGE_ID: string;
export declare const PROTOCOL_ID = "0x9e3dab13212b27f5434416939db5dec6a319d15b89a84fd074d03ece6350d3df";
export declare const CONTRIBUTOR_TOKEN_ID = "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2";
export declare const CORE_PACKAGE_ID = "0x2545d6a3da56cfd79a0394710f42d038baf87bcf6cfd7f5bb14906dcd7f4e8b3";
export declare const COINS_TYPE_LIST: Record<COIN, string>;
export declare const COIN_DECIMALS: Record<COIN, number>;
export declare const PSM_POOL_IDS: Partial<Record<COIN, string>>;
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
export declare const CLOCK_OBJECT: {
    objectId: string;
    mutable: boolean;
    initialSharedVersion: number;
};
export declare const ORACLE_OBJECT: {
    objectId: string;
    mutable: boolean;
    initialSharedVersion: number;
};
export declare const TREASURY_OBJECT: {
    objectId: string;
    mutable: boolean;
    initialSharedVersion: number;
};
export declare const PROTOCOL_OBJECT: {
    objectId: string;
    mutable: boolean;
    initialSharedVersion: number;
};
export declare const FOUNTAIN_PERIHERY_PACKAGE_ID = "0xba3e34a587ea2b994069998a21e2d9bfcb8de2168ade2717e0f400dc45e51225";
export declare const CETUS_SUI_BUCK_LP_REGISTRY_ID = "0x7778d68f02810b2c002b6f40084c5f3fe0b1bcc7d7a7c64d72ba40ff9a815bac";
export declare const CETUS_SUI_BUCK_LP_REGISTRY: {
    objectId: string;
    mutable: boolean;
    initialSharedVersion: number;
};
export declare const CETUS_USDC_BUCK_25_LP_REGISTRY_ID = "0xb9d46d57d933fabaf9c81f4fc6f54f9c1570d3ef49785c6b7200cad6fe302909";
export declare const CETUS_USDC_BUCK_25_LP_REGISTRY: {
    objectId: string;
    mutable: boolean;
    initialSharedVersion: number;
};
export declare const CETUS_USDC_BUCK_01_LP_REGISTRY_ID = "0x504799d041ea541d252b4742ba9388ff602a9e91b23ccb239d4abc499761f42f";
export declare const CETUS_USDC_BUCK_01_LP_REGISTRY: {
    objectId: string;
    mutable: boolean;
    initialSharedVersion: number;
};
export declare const CETUS_USDC_BUCK_05_LP_REGISTRY_ID = "0x81fe26939ed676dd766358a60445341a06cea407ca6f3671ef30f162c84126d5";
export declare const CETUS_USDC_BUCK_05_LP_REGISTRY: {
    objectId: string;
    mutable: boolean;
    initialSharedVersion: number;
};
export declare const KRIYA_SUI_BUCK_LP_REGISTRY_ID = "0xcc39bcc2c438a79beb2656ff043714a60baf89ba37592bef2e14ee8bca0cf007";
export declare const KRIYA_SUI_BUCK_LP_REGISTRY: {
    objectId: string;
    initialSharedVersion: number;
    mutable: boolean;
};
export declare const KRIYA_USDC_BUCK_LP_REGISTRY_ID = "0xae1910e5bcb13a4f5b12688f0da939b9c9d3e8a9e8d0a2e02c818f6a94e598fd";
export declare const KRIYA_USDC_BUCK_LP_REGISTRY: {
    objectId: string;
    initialSharedVersion: number;
    mutable: boolean;
};
export declare const AF_SUI_BUCK_LP_REGISTRY_ID = "0xe2569ee20149c2909f0f6527c210bc9d97047fe948d34737de5420fab2db7062";
export declare const AF_SUI_BUCK_LP_REGISTRY: {
    objectId: string;
    initialSharedVersion: number;
    mutable: boolean;
};
export declare const AF_USDC_BUCK_LP_REGISTRY_ID = "0x885e09419b395fcf5c8ee5e2b7c77e23b590e58ef3d61260b6b4eb44bbcc8c62";
export declare const AF_USDC_BUCK_LP_REGISTRY: {
    objectId: string;
    initialSharedVersion: number;
    mutable: boolean;
};
export declare const CETUS_SUI_BUCK_POOL_ID = "0x9379d2d3f221dcea70f7f7d4a7bf30bab0128bcfda0d13a85267e51f7e6e15c0";
export declare const CETUS_BUCK_USDC_POOL_ID = "0x6ecf6d01120f5f055f9a605b56fd661412a81ec7c8b035255e333c664a0c12e7";
export declare const CETUS_BUCK_USDC_POOL_2_ID = "0xd4573bdd25c629127d54c5671d72a0754ef47767e6c01758d6dc651f57951e7d";
export declare const KRIYA_SUI_BUCK_POOL_ID = "0x3c334f9d1b969767007d26bc886786f9f197ffb14771f7903cd8772c46d08dea";
export declare const KRIYA_BUCK_USDC_POOL_ID = "0xbb4a712b3353176092cdfe3dd2d1251b725f9372e954248e5dd2eb2ab6a5f21a";
export declare const AF_SUI_BUCK_POOL_ID = "0xdeacf7ab460385d4bcb567f183f916367f7d43666a2c72323013822eb3c57026";
export declare const AF_USDC_BUCK_POOL_ID = "0xeec6b5fb1ddbbe2eb1bdcd185a75a8e67f52a5295704dd73f3e447394775402b";
export declare const AF_OBJS: {
    pool: string;
    poolRegistry: string;
    protocolFeeVault: string;
    treasury: string;
    insuranceFund: string;
    referralVault: string;
};
export declare const CETUS_OBJS: {
    poolBuckUsdc: string;
    globalConfig: string;
};
export declare const BUCKETUS_TREASURY: {
    objectId: string;
    initialSharedVersion: number;
    mutable: boolean;
};
export declare const BUCKETUS_LP_VAULT: {
    objectId: string;
    initialSharedVersion: number;
    mutable: boolean;
};
export declare const FOUNTAIN_PACKAGE_ID = "0x8f16cb934fa0c4ad403ac3fddaab8585a642f2073a47a32215a77448c3e353c6";
export declare const KRIYA_FOUNTAIN_PACKAGE_ID = "0x3daf65b7356c560bd5bdd989aa2526e38a8e1d0b34c653b93fd65fa9bedc8dc0";
//# sourceMappingURL=constants.d.ts.map