// Copyright Andrei <andreid.dev@gmail.com>

export type ACCEPT_ASSETS = "SUI" | "USDC" | "USDT" | "afSUI" | "haSUI" | "vSUI" | "WETH";
export type COIN = "SUI" | "USDC" | "USDT" | "afSUI" | "haSUI" | "vSUI" | "AF_LP_USDC_BUCK" | "AF_LP_SUI_BUCK" | "WETH" | "BUCK" | "BKT";

export type FOUNTAIN_PROVIDER = "CETUS" | "KRIYA" | "AF";

export const MAINNET_PACKAGE_ID: string =
  "0x275b6c59f68837f7c8d7076254373a5bb16e20e6435967defdd86f943e70a2db";
export const MAINNET_BUCKET_OPERATIONS_PACKAGE_ID: string =
  "0xb59c19de88addb7b3e721066c6c99987d09ad22fa829c69dbf0f0c1c0be20625";
export const MAINNET_PROTOCOL_ID =
  "0x9e3dab13212b27f5434416939db5dec6a319d15b89a84fd074d03ece6350d3df";
export const MAINNET_CONTRIBUTOR_TOKEN_ID =
  "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2";
export const MAINNET_CORE_PACKAGE_ID =
  "0x275b6c59f68837f7c8d7076254373a5bb16e20e6435967defdd86f943e70a2db";

export const TESTNET_PACKAGE_ID: string =
  "0x1ca47988f33d06d748a779e78f321b9ba74f6ad25b3de2840da425022dfaa969";
export const TESTNET_BUCKET_OPERATIONS_PACKAGE_ID: string =
  "0x6f206ba15a7d81662e20ac1e6a4e0b443f3972861327584e8a1148c9880e4a09";
export const TESTNET_PROTOCOL_ID =
  "0x8b7ff1f21c8e80683a4504f8e564ad42e51361875ecce8c9ecc5596a67abd225";
export const TESTNET_CONTRIBUTOR_TOKEN_ID =
  "0x1ca47988f33d06d748a779e78f321b9ba74f6ad25b3de2840da425022dfaa969";
export const TESTNET_CORE_PACKAGE_ID =
  "0x275b6c59f68837f7c8d7076254373a5bb16e20e6435967defdd86f943e70a2db";

export const COINS_TYPE_LIST: Record<COIN, string> = {
  SUI: "0x2::sui::SUI",
  USDC: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
  USDT: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
  afSUI: "0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI",
  haSUI: "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI",
  vSUI: "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT",
  WETH: "0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN",
  AF_LP_USDC_BUCK:
    "0xf1b901d93cc3652ee26e8d88fff8dc7b9402b2b2e71a59b244f938a140affc5e::af_lp::AF_LP",
  AF_LP_SUI_BUCK:
    "0x62e39f5554a2badccab46bf3fab044e3f7dc889d42a567a68d3c1b2e5463001f::af_lp::AF_LP",
  BUCK: "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK",
  BKT: "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::bkt::BKT",
};

export const COIN_DECIMALS: Record<COIN, number> = {
  SUI: 9,
  USDC: 6,
  USDT: 6,
  afSUI: 9,
  haSUI: 9,
  vSUI: 9,
  WETH: 8,
  BUCK: 9,
  BKT: 9,
  AF_LP_USDC_BUCK: 9,
  AF_LP_SUI_BUCK: 9,
};

export const SUPRA_PRICE_FEEDS = {
  usdc_usd: "0x1c400c096e8b52a22c43c080fea4aa22661c9a35b469493dfac5332aecb4789c",
  usdt_usd: "0x11ea8c7b6287f1410c8bac2e475b4fe6fea45fd59e036a058522ab3acec8fed3",
  eth_usdt: "0x258d0f9c61768d184d218a068ff8117728f5becb1bfe2b1e3b6e231dda875a67",
  sui_usdt: "0x898236b8f93d5ea7f94fbec1b3ac152ae51901e3078859a92cbf06c46c20b316",
  hasui_sui: "0xd741ca15eb5e19f2d138b9e9cb95d70dc90667370dee7cbad184acfbb35063cf",
  vsui_sui: "0xd291ea0aebb1a9314cd60d5142755267f9badbeccd30b91e92b54bef29864f33",
  afsui_sui: "0xbe4289cf638a9ad1f085bd8a3e0aeaed814078e3961b77fb08cc7550ee5d8c00",
}

export const SUPRA_ID: Record<string, string> = {
  USDT: "48",
  USDC: "89",
  // WBTC: "18",
  WETH: "19",
  SUI: "90",
  afSUI: "90",
  haSUI: "90",
  vSUI: "90",
};

export const SWITCHBOARD_UPDATE_TARGET =
  "0xe2077d678de929d64d3fcd79c1adfbd23d97324e9bae3a60102d44367fbe008c::bucket_oracle::update_price_from_switchboard";

export const SUPRA_HANDLER_OBJECT =
  "0xaa0315f0748c1f24ddb2b45f7939cff40f7a8104af5ccbc4a1d32f870c0b4105";

export const SUPRA_UPDATE_TARGET =
  "0xe2077d678de929d64d3fcd79c1adfbd23d97324e9bae3a60102d44367fbe008c::bucket_oracle::update_price_from_supra";

export const ORACLE_OBJECT_ID = "0xf578d73f54b3068166d73c1a1edd5a105ce82f97f5a8ea1ac17d53e0132a1078";

export const AFSUI_APY_URL = "https://aftermath.finance/api/staking/apy";
export const HASUI_APY_URL = "https://www.haedal.xyz/api/stats/home";
