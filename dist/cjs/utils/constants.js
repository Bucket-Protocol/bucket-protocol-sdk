"use strict";
// Copyright Andrei <andreid.dev@gmail.com>
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUI_LP_REGISTRY_IDS = exports.HASUI_APY_URL = exports.AFSUI_APY_URL = exports.SUPRA_PRICE_FEEDS = exports.MARKET_COINS_TYPE_LIST = exports.MAINNET_PROTOCOL_ID = exports.TESTNET_PROTOCOL_ID = exports.TESTNET_BUCKET_OPERATIONS_PACKAGE_ID = exports.TESTNET_PACKAGE_ID = exports.MAINNET_BUCKET_OPERATIONS_PACKAGE_ID = exports.MAINNET_PACKAGE_ID = void 0;
exports.MAINNET_PACKAGE_ID = "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2";
exports.MAINNET_BUCKET_OPERATIONS_PACKAGE_ID = "0x6f206ba15a7d81662e20ac1e6a4e0b443f3972861327584e8a1148c9880e4a09";
exports.TESTNET_PACKAGE_ID = "0x1ca47988f33d06d748a779e78f321b9ba74f6ad25b3de2840da425022dfaa969";
exports.TESTNET_BUCKET_OPERATIONS_PACKAGE_ID = "0x6f206ba15a7d81662e20ac1e6a4e0b443f3972861327584e8a1148c9880e4a09";
exports.TESTNET_PROTOCOL_ID = "0x8b7ff1f21c8e80683a4504f8e564ad42e51361875ecce8c9ecc5596a67abd225";
exports.MAINNET_PROTOCOL_ID = "0x9e3dab13212b27f5434416939db5dec6a319d15b89a84fd074d03ece6350d3df";
exports.MARKET_COINS_TYPE_LIST = {
    SUI: "0x2::sui::SUI",
    USDC: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
    USDT: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
    afSUI: "0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI",
    haSUI: "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI",
    vSUI: "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT",
    WETH: "0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN"
};
exports.SUPRA_PRICE_FEEDS = {
    usdc_usd: "0x1c400c096e8b52a22c43c080fea4aa22661c9a35b469493dfac5332aecb4789c",
    usdt_usd: "0x11ea8c7b6287f1410c8bac2e475b4fe6fea45fd59e036a058522ab3acec8fed3",
    eth_usdt: "0x258d0f9c61768d184d218a068ff8117728f5becb1bfe2b1e3b6e231dda875a67",
    sui_usdt: "0x898236b8f93d5ea7f94fbec1b3ac152ae51901e3078859a92cbf06c46c20b316",
    hasui_sui: "0xd741ca15eb5e19f2d138b9e9cb95d70dc90667370dee7cbad184acfbb35063cf",
    vsui_sui: "0xd291ea0aebb1a9314cd60d5142755267f9badbeccd30b91e92b54bef29864f33",
    afsui_sui: "0xbe4289cf638a9ad1f085bd8a3e0aeaed814078e3961b77fb08cc7550ee5d8c00",
};
exports.AFSUI_APY_URL = "https://aftermath.finance/api/staking/apy";
exports.HASUI_APY_URL = "https://www.haedal.xyz/api/stats/home";
exports.SUI_LP_REGISTRY_IDS = {
    CETUS: [
        "0x7778d68f02810b2c002b6f40084c5f3fe0b1bcc7d7a7c64d72ba40ff9a815bac", // CETUS_SUI_BUCK_LP_REGISTRY_ID
        "0x8533d3b9a2c33bc9fef49022d80d7db11a823d6a53038a782bdc01a14f0f409a", // CETUS_USDC_BUCK_LP_REGISTRY_ID
    ],
    KRIYA: [
        "0xcc39bcc2c438a79beb2656ff043714a60baf89ba37592bef2e14ee8bca0cf007", // KRIYA_SUI_BUCK_LP_REGISTRY_ID
        "0xae1910e5bcb13a4f5b12688f0da939b9c9d3e8a9e8d0a2e02c818f6a94e598fd", // KRIYA_USDC_BUCK_LP_REGISTRY_ID
    ],
    AF: [
        "0xe2569ee20149c2909f0f6527c210bc9d97047fe948d34737de5420fab2db7062", // AF_SUI_BUCK_LP_REGISTRY_ID
        "0x885e09419b395fcf5c8ee5e2b7c77e23b590e58ef3d61260b6b4eb44bbcc8c62", // AF_USDC_BUCK_LP_REGISTRY_ID
    ],
};
//# sourceMappingURL=constants.js.map