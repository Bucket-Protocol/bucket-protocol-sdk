// Copyright Andrei <andreid.dev@gmail.com>

declare var process : {
  env: {
    NEXT_PUBLIC_ACTIVE_CHAIN: string
  }
};

const IS_MAINNET = process.env.NEXT_PUBLIC_ACTIVE_CHAIN === "mainnet";

export const MAINNET_PACKAGE_ID: string = 
  "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2";

export const MAINNET_BUCKET_OPERATIONS_PACKAGE_ID: string =
  "0x6f206ba15a7d81662e20ac1e6a4e0b443f3972861327584e8a1148c9880e4a09";

export const TESTNET_PACKAGE_ID: string =
  "0x1ca47988f33d06d748a779e78f321b9ba74f6ad25b3de2840da425022dfaa969";

export const TESTNET_BUCKET_OPERATIONS_PACKAGE_ID: string =
  "0x6f206ba15a7d81662e20ac1e6a4e0b443f3972861327584e8a1148c9880e4a09";

export const TESTNET_PROTOCOL_ID = 
"0x8b7ff1f21c8e80683a4504f8e564ad42e51361875ecce8c9ecc5596a67abd225";

export const MAINNET_PROTOCOL_ID =
  "0x9e3dab13212b27f5434416939db5dec6a319d15b89a84fd074d03ece6350d3df";

export const PROTOCOL_ID = IS_MAINNET ? MAINNET_PROTOCOL_ID : TESTNET_PROTOCOL_ID;

export type ACCEPT_ASSETS = "SUI" | "USDC" | "USDT" | "afSUI" | "haSUI" | "vSUI" | "WETH";

export const MARKET_COINS_TYPE_LIST: Record<ACCEPT_ASSETS, string> = {
    SUI: "0x2::sui::SUI",
    USDC: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
    USDT: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
    afSUI: "0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI",
    haSUI: "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI",
    vSUI: "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT",
    WETH : "0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN"
  };
  