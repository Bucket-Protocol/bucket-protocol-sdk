import { COIN, SharedObjectRef } from "./types";

export const BUCKET_OPERATIONS_PACKAGE_ID: string =
  "0xa1f1e93a392f011c69175d9064f5c4cb45ecd46468c1c9f537d3efa1d021cb95";
export const PROTOCOL_ID =
  "0x9e3dab13212b27f5434416939db5dec6a319d15b89a84fd074d03ece6350d3df";
export const CONTRIBUTOR_TOKEN_ID =
  "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2";
export const CORE_PACKAGE_ID =
  "0xb71c0893203d0f59622fc3fac849d0833de559d7503af21c5daf880d60d754ed";
export const STRAP_FOUNTAIN_PACKAGE_ID =
  "0x563bab87935fc27517a505c3ba8f7603b80b232de6abf24c71363773c930f70d";

export const COINS_TYPE_LIST: Record<COIN, string> = {
  SUI: "0x2::sui::SUI",
  wUSDC:
    "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
  USDC: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
  USDT: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
  afSUI:
    "0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI",
  haSUI:
    "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI",
  vSUI: "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT",
  WETH: "0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN",

  USDCbnb:
    "0x909cba62ce96d54de25bec9502de5ca7b4f28901747bbf96b76c2e63ec5f1cba::coin::COIN",
  USDCsol:
    "0xb231fcda8bbddb31f2ef02e6161444aec64a514e2c89279584ac9806ce9cf037::coin::COIN",
  USDCpol:
    "0xcf72ec52c0f8ddead746252481fb44ff6e8485a39b803825bde6b00d77cdb0bb::coin::COIN",
  USDCarb:
    "0xe32d3ebafa42e6011b87ef1087bbc6053b499bf6f095807b9013aff5a6ecd7bb::coin::COIN",

  BUCK: "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK",
  BKT: "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::bkt::BKT",
  BUCKETUS:
    "0x8d1aee27f8537c06d19c16641f27008caafc42affd2d2fb7adb96919470481ec::bucketus::BUCKETUS",
  USDY: "0x960b531667636f39e85867775f52f6b1f220a058c4de786905bdf761e06a56bb::usdy::USDY",
  NAVX: "0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX",
  SCA: "0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA",
  SCABLE:
    "0x08a7a3c873402d7cf9d44192aae337e0b27a72c2a4a230d10230488cf614c5a2::scable::SCABLE",
  STAPEARL:
    "0xcffc684610db2d1956cfb25858678be8ea96d2766b4c756d4096abd38461f40a::stapearl::STAPEARL",
  sBUCK:
    "0x1798f84ee72176114ddbf5525a6d964c5f8ea1b3738d08d50d0d3de4cf584884::sbuck::SBUCK",
  CETUS:
    "0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS",
  AUSD: "0x2053d08c1e2bd02791056171aab0fd12bd7cd7efad2ab8f6b9c8902f14df2ff2::ausd::AUSD",
  sUSDC: "0x854950aa624b1df59fe64e630b2ba7c550642e9342267a33061d59fb31582da5::scallop_usdc::SCALLOP_USDC",
  swUSDC: "0xad4d71551d31092230db1fd482008ea42867dbf27b286e9c70a79d2a6191d58d::scallop_wormhole_usdc::SCALLOP_WORMHOLE_USDC",

  AF_LP_USDC_BUCK:
    "0xf1b901d93cc3652ee26e8d88fff8dc7b9402b2b2e71a59b244f938a140affc5e::af_lp::AF_LP",
  AF_LP_SUI_BUCK:
    "0x62e39f5554a2badccab46bf3fab044e3f7dc889d42a567a68d3c1b2e5463001f::af_lp::AF_LP",
};

export const COIN_DECIMALS: Record<COIN, number> = {
  SUI: 9,
  wUSDC: 6,
  USDC: 6,
  USDT: 6,
  afSUI: 9,
  haSUI: 9,
  vSUI: 9,
  WETH: 8,
  BUCK: 9,
  BKT: 9,
  BUCKETUS: 9,
  STAPEARL: 6,
  USDY: 6,
  NAVX: 9,
  SCA: 9,
  CETUS: 9,
  SCABLE: 6,
  AUSD: 6,
  sUSDC: 6,
  swUSDC: 6,

  sBUCK: 9,

  AF_LP_USDC_BUCK: 9,
  AF_LP_SUI_BUCK: 9,

  USDCarb: 6,
  USDCpol: 6,
  USDCsol: 6,
  USDCbnb: 8,
};

export const PSM_POOL_IDS: Partial<Record<COIN, string>> = {
  BUCKETUS:
    "0xba86a0f37377844f38060a9f62b5c5cd3f8ba13901fa6c4ee5777c1cc535306b",
  SCABLE: "0xe3a3ca38171458c6f310bc9b4ba5d7bff7850b190049dcdb1e89ddbd7893d528",
  STAPEARL:
    "0xccdaf635eb1c419dc5ab813cc64c728a9f5a851202769e254f348bff51f9a6dc",
  wUSDC: "0x0c2e5fbfeb5caa4c2f7c8645ffe9eca7e3c783536efef859be03146b235f9e04",
  USDT: "0x607e7d386e29066b964934e0eb1daa084538a79b5707c34f38e190d64e24923e",
  USDCbnb: "0x973c51875b3fb9c8cf5d8ec4aeac83fddaacb88c17960fd5258d8fa38bc4dd82",
  USDCsol: "0x596d696153f405cdee285a0da122c8c9a4cf6c883298aaf9bec1149e0909e168",
  USDCpol: "0x741ec9190953ee9eaa1b92b2285f15a0c7068bac2e591bfa5f7f596a75ada351",
  USDCarb: "0x10970069e17f31aee9cb55c53237d3a62584582e05f3c2030f92ce9fc6365c90",
  AUSD: "0x5a0373b5c08f0d6a33bd88bfd89db7557613699ae88e4c0039e8f7c542551a7b",
  USDC: "0xd22388010d7bdb9f02f14805a279322a3fa3fbde42896b7fb3d1214af404c455",
};

export const PSM_BALANCE_IDS: Record<string, string> = {
  wUSDC: "0x7b16192d63e6fa111b0dac03f99c5ff965205455089f846804c10b10be55983c",
  USDT: "0x6b68b42cbb4efccd9df30466c21fff3c090279992c005c45154bd1a0d87ac725",
  USDC: "0xdf91ef19f6038e662e9c89f111ffe19e808cdfb891d080208d15141932f9513b",
};

export const SUPRA_PRICE_FEEDS = {
  usdc_usd:
    "0x1c400c096e8b52a22c43c080fea4aa22661c9a35b469493dfac5332aecb4789c",
  usdt_usd:
    "0x11ea8c7b6287f1410c8bac2e475b4fe6fea45fd59e036a058522ab3acec8fed3",
  usdy_usd:
    "0x95d93c5bed776b020ce848964572d90bf4694a73fd06c7238a4be05bf438d724",
  eth_usdt:
    "0x258d0f9c61768d184d218a068ff8117728f5becb1bfe2b1e3b6e231dda875a67",
  sui_usdt:
    "0x898236b8f93d5ea7f94fbec1b3ac152ae51901e3078859a92cbf06c46c20b316",
  hasui_sui:
    "0xd741ca15eb5e19f2d138b9e9cb95d70dc90667370dee7cbad184acfbb35063cf",
  vsui_sui:
    "0xd291ea0aebb1a9314cd60d5142755267f9badbeccd30b91e92b54bef29864f33",
  afsui_sui:
    "0xbe4289cf638a9ad1f085bd8a3e0aeaed814078e3961b77fb08cc7550ee5d8c00",
  navx_usd:
    "0x996cfab93ecd365cea4e2ea5bb6d29160192513eec5e08521d0edad3796f667c",
  cetus_usd:
    "0xc0205c51048f09dee3d28c08d1f3dd8c8b5aca65337aac63562e8b8140b32ac6",
  sca_usd: "0x94dff56ca222ecb8b1df97596720e1d5de65e31e242067f19c8ef9544050233c",
};

export const SUPRA_ID: Record<string, number> = {
  USDT: 48,
  wUSDC: 89,
  // WBTC: 18,
  WETH: 19,
  SUI: 90,
  afSUI: 90,
  haSUI: 90,
  vSUI: 90,
  USDY: 185,
  NAVX: 408,
  CETUS: 93,
  SCA: 476,
};

export const SWITCHBOARD_UPDATE_TARGET =
  "0xf1bfcf3823bf418877c09e9dae54ec0e9edafebbf567af15812eb3ea116fbd07::bucket_oracle::update_price_from_switchboard";

export const SUPRA_HANDLER_OBJECT = {
  objectId:
    "0xaa0315f0748c1f24ddb2b45f7939cff40f7a8104af5ccbc4a1d32f870c0b4105",
  initialSharedVersion: 5963053,
  mutable: true,
};

export const SUPRA_UPDATE_TARGET =
  "0xe2077d678de929d64d3fcd79c1adfbd23d97324e9bae3a60102d44367fbe008c::bucket_oracle::update_price_from_supra";

export const CLOCK_OBJECT = {
  objectId:
    "0x0000000000000000000000000000000000000000000000000000000000000006",
  mutable: false,
  initialSharedVersion: 1,
};

export const ORACLE_OBJECT = {
  objectId:
    "0xf578d73f54b3068166d73c1a1edd5a105ce82f97f5a8ea1ac17d53e0132a1078",
  mutable: true,
  initialSharedVersion: 5174506,
};

export const TREASURY_OBJECT = {
  objectId:
    "0x7032c4d7afd30cd0dd04c924d63f1127de6fcc429968306807091d3ad3ff78b1",
  mutable: true,
  initialSharedVersion: 6365975,
};

export const PROTOCOL_OBJECT = {
  objectId: PROTOCOL_ID,
  mutable: true,
  initialSharedVersion: 6365975,
};

export const FLASK_ID =
  "0xc6ecc9731e15d182bc0a46ebe1754a779a4bfb165c201102ad51a36838a1a7b8";

export const FLASK_OBJECT = {
  objectId: FLASK_ID,
  mutable: true,
  initialSharedVersion: 90706194,
};

export const FOUNTAIN_PERIHERY_PACKAGE_ID =
  "0x440ea4d7679c0fbf4a8a7f98ba1a44ac60fe268f767a4531f1a6843a482194bc";

export const CETUS_SUI_BUCK_LP_REGISTRY_ID =
  "0x7778d68f02810b2c002b6f40084c5f3fe0b1bcc7d7a7c64d72ba40ff9a815bac";

export const CETUS_SUI_BUCK_LP_REGISTRY = {
  objectId: CETUS_SUI_BUCK_LP_REGISTRY_ID,
  mutable: true,
  initialSharedVersion: 7598161,
};

export const CETUS_USDC_BUCK_LP_REGISTRY_ID =
  "0xb9d46d57d933fabaf9c81f4fc6f54f9c1570d3ef49785c6b7200cad6fe302909";

export const CETUS_USDC_BUCK_LP_REGISTRY = {
  objectId: CETUS_USDC_BUCK_LP_REGISTRY_ID,
  mutable: true,
  initialSharedVersion: 61717743,
};

export const KRIYA_SUI_BUCK_LP_REGISTRY_ID =
  "0xcc39bcc2c438a79beb2656ff043714a60baf89ba37592bef2e14ee8bca0cf007";

export const KRIYA_SUI_BUCK_LP_REGISTRY = {
  objectId: KRIYA_SUI_BUCK_LP_REGISTRY_ID,
  initialSharedVersion: 18368425,
  mutable: true,
};

export const KRIYA_USDC_BUCK_LP_REGISTRY_ID =
  "0xae1910e5bcb13a4f5b12688f0da939b9c9d3e8a9e8d0a2e02c818f6a94e598fd";

export const KRIYA_USDC_BUCK_LP_REGISTRY = {
  objectId: KRIYA_USDC_BUCK_LP_REGISTRY_ID,
  initialSharedVersion: 18368428,
  mutable: true,
};

export const AF_SUI_BUCK_LP_REGISTRY_ID =
  "0xe2569ee20149c2909f0f6527c210bc9d97047fe948d34737de5420fab2db7062";

export const AF_SUI_BUCK_LP_REGISTRY = {
  objectId: AF_SUI_BUCK_LP_REGISTRY_ID,
  initialSharedVersion: 6366296,
  mutable: true,
};

export const AF_USDC_BUCK_LP_REGISTRY_ID =
  "0x885e09419b395fcf5c8ee5e2b7c77e23b590e58ef3d61260b6b4eb44bbcc8c62";

export const AF_USDC_BUCK_LP_REGISTRY = {
  objectId: AF_USDC_BUCK_LP_REGISTRY_ID,
  initialSharedVersion: 6366295,
  mutable: true,
};

export const SBUCK_BUCK_LP_REGISTRY_ID =
  "0xbdf91f558c2b61662e5839db600198eda66d502e4c10c4fc5c683f9caca13359";

export const SBUCK_BUCK_LP_REGISTRY = {
  objectId: SBUCK_BUCK_LP_REGISTRY_ID,
  mutable: true,
  initialSharedVersion: 87170268,
};

export const CETUS_SUI_BUCK_POOL_ID =
  "0x9379d2d3f221dcea70f7f7d4a7bf30bab0128bcfda0d13a85267e51f7e6e15c0";
export const CETUS_BUCK_USDC_POOL_01_ID =
  "0xd4573bdd25c629127d54c5671d72a0754ef47767e6c01758d6dc651f57951e7d";
export const CETUS_BUCK_USDC_POOL_05_ID =
  "0x81fe26939ed676dd766358a60445341a06cea407ca6f3671ef30f162c84126d5";
export const CETUS_BUCK_USDC_POOL_25_ID =
  "0x6ecf6d01120f5f055f9a605b56fd661412a81ec7c8b035255e333c664a0c12e7";

export const KRIYA_SUI_BUCK_POOL_ID =
  "0x3c334f9d1b969767007d26bc886786f9f197ffb14771f7903cd8772c46d08dea";
export const KRIYA_BUCK_USDC_POOL_ID =
  "0xbb4a712b3353176092cdfe3dd2d1251b725f9372e954248e5dd2eb2ab6a5f21a";

export const AF_SUI_BUCK_POOL_ID =
  "0xdeacf7ab460385d4bcb567f183f916367f7d43666a2c72323013822eb3c57026";
export const AF_USDC_BUCK_POOL_ID =
  "0xeec6b5fb1ddbbe2eb1bdcd185a75a8e67f52a5295704dd73f3e447394775402b";

export const AF_OBJS = {
  pool: "0xeec6b5fb1ddbbe2eb1bdcd185a75a8e67f52a5295704dd73f3e447394775402b",
  poolRegistry:
    "0xfcc774493db2c45c79f688f88d28023a3e7d98e4ee9f48bbf5c7990f651577ae",
  protocolFeeVault:
    "0xf194d9b1bcad972e45a7dd67dd49b3ee1e3357a00a50850c52cd51bb450e13b4",
  treasury:
    "0x28e499dff5e864a2eafe476269a4f5035f1c16f338da7be18b103499abf271ce",
  insuranceFund:
    "0xf0c40d67b078000e18032334c3325c47b9ec9f3d9ae4128be820d54663d14e3b",
  referralVault:
    "0x35d35b0e5b177593d8c3a801462485572fc30861e6ce96a55af6dc4730709278",
};

export const CETUS_OBJS = {
  globalConfig:
    "0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f",
  buckUsdcPool: CETUS_BUCK_USDC_POOL_05_ID,
};

export const BUCKETUS_TREASURY = {
  objectId:
    "0x781d3060afe9f5427bb865088ab25c8d827ed2b0be71ab140ff9ab5a0d8c9466",
  initialSharedVersion: 61707529,
  mutable: true,
};

export const BUCKETUS_LP_VAULT_25 = {
  objectId:
    "0x1a0b93fd2965ce3ceb4039c90b232ddee7b0e79015cab0ca10528bb5f4285188",
  initialSharedVersion: 61717741,
  mutable: true,
};
export const BUCKETUS_LP_VAULT_05 = {
  objectId:
    "0x6edfc992f6e775fe926a5e850661c151ad01e6149e9b34792a2102e1721065fc",
  initialSharedVersion: 75359688,
  mutable: true,
};

export const FOUNTAIN_PACKAGE_ID =
  "0x8f16cb934fa0c4ad403ac3fddaab8585a642f2073a47a32215a77448c3e353c6";

export const KRIYA_FOUNTAIN_PACKAGE_ID =
  "0x3daf65b7356c560bd5bdd989aa2526e38a8e1d0b34c653b93fd65fa9bedc8dc0";

export const SBUCK_FOUNTAIN_PACKAGE_ID =
  "0x75b23bde4de9aca930d8c1f1780aa65ee777d8b33c3045b053a178b452222e82";

export const STRAP_ID = `0xd9162764da404339384fe40487499dc867c3f1fa3eb870381c41a8b41458b0e5::strap::BottleStrap`;

export const STRAP_FOUNTAIN_IDS: Partial<Record<COIN, SharedObjectRef>> = {
  afSUI: {
    objectId:
      "0xcfc2678c5ba0d8f57dc4984b6875988a92d34c55a3bdc47c593710931d128e68",
    initialSharedVersion: "77035444",
    mutable: true,
  },
  vSUI: {
    objectId:
      "0x1f7cc70940fa415fb1af862642ff9791d4376453496d28b95eea01604dc5291f",
    initialSharedVersion: "77035445",
    mutable: true,
  },
  haSUI: {
    objectId:
      "0x07df6066e0a92bfb61f54f0a65f765030c8624849916eed9afbd634840082f5e",
    initialSharedVersion: "77035446",
    mutable: true,
  },
};

export const STRAP_TYPE_ID =
  "0x5d019c033bb8051fe9631cf910d0f4d077364d64ed4bb1940e98e6dc419a8d59";

export const STAKE_PROOF_ID = `${STRAP_TYPE_ID}::fountain::StakeProof`;

export const SBUCK_FLASK_OBJECT_ID =
  "0xc6ecc9731e15d182bc0a46ebe1754a779a4bfb165c201102ad51a36838a1a7b8";

export const SBUCK_APR_OBJECT_ID =
  "0x4a9c3a7f42ead76b350e268976c502eafb448ff72da02923efcd4d202e46dee4";

export const MAX_LOCK_TIME = 4838400_000; // 8 weeks

export const BUCKET_POINT_PACKAGE_ID =
  "0x9c7289341e07dbeb09bbf805ade663a529ea12d4826a63d467f6326b8fd0c13e";
export const BUCKET_POINT_CONFIG_OBJ = {
  objectId:
    "0x89d71e7c0dbd2ce47e0c44df0c1cd65858bbc57304d0392cd0b9389f53ceb5f1",
  initialSharedVersion: "337351213",
  mutable: false,
};

export const LOCKER_MAP = {
  afSUI: {
    objectId:
      "0x69550d2439ae19da902c1fa430fe7e3251cf0ddea8af76121f61d705bb95673b",
    initialSharedVersion: "337351217",
    mutable: true,
  },
  haSUI: {
    objectId:
      "0xcae53a48cf09957be981498d1a2bf549f1a548b3c5e85fe9a2c9564207e7b2f0",
    initialSharedVersion: "337351218",
    mutable: true,
  },
  vSUI: {
    objectId:
      "0x0cdc2b47abf0914991a7bac115788c5ace6c2936c7135736e9df87c3e6bb80c3",
    initialSharedVersion: "337351219",
    mutable: true,
  },
  sBUCK: {
    objectId:
      "0xf0ac007f3532c0612a99183160f4bc0d2a41ee9a98013eba1949d753c2d7f6b5",
    initialSharedVersion: "337351220",
    mutable: true,
  },
};

export type LstToken = "afSUI" | "haSUI" | "vSUI";

export const LOCKER_TABLE: Record<LstToken, string> = {
  afSUI: "0x95d0d20ab42f78f75a7d63513ed60415b9dcb41c58ef493a7a69b531b212e713",
  haSUI: "0x3674f3183780166553d42174d02229c679e431b9a5911d02a28271a8fd9abd88",
  vSUI: "0x502760cac10dd4fae78672c1e27bc0e5cdbae449aa2b15dbfb72434af33cb8f6",
};

export type ScableToken = "wUSDC" | "USDT" | "USDC";

export const SCABLE_VAULTS: Record<ScableToken, SharedObjectRef> = {
  wUSDC: {
    objectId:
      "0x7b16192d63e6fa111b0dac03f99c5ff965205455089f846804c10b10be55983c",
    initialSharedVersion: "272980432",
    mutable: true,
  },
  USDT: {
    objectId:
      "0x6b68b42cbb4efccd9df30466c21fff3c090279992c005c45154bd1a0d87ac725",
    initialSharedVersion: "272980433",
    mutable: true,
  },
  USDC: {
    objectId:
      "0xdf91ef19f6038e662e9c89f111ffe19e808cdfb891d080208d15141932f9513b",
    initialSharedVersion: "373914575",
    mutable: true,
  },
};

export const SUSDC_PRICE_FEED_OBJECT_ID = "0xe83dae90d004e07db82186fd7d2ebb216f161977da5d78ca5cf7778ff56a2bf5";

export const SWUSDC_PRICE_FEED_OBJECT_ID = "0x8ddfb53b381fdeb95b0923c6c827582e9f5a64dcad3fb3b0b55ae11a0a144ed2";