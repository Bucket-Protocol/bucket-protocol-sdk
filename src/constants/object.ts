import { COIN, ScableCoin, SharedObjectRef } from "../types";

export const BUCKET_OPERATIONS_PACKAGE_ID: string =
  "0xa1f1e93a392f011c69175d9064f5c4cb45ecd46468c1c9f537d3efa1d021cb95";
export const PROTOCOL_ID =
  "0x9e3dab13212b27f5434416939db5dec6a319d15b89a84fd074d03ece6350d3df";
export const CONTRIBUTOR_TOKEN_ID =
  "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2";
export const CORE_PACKAGE_ID =
  "0xb71c0893203d0f59622fc3fac849d0833de559d7503af21c5daf880d60d754ed";
export const FOUNTAIN_PERIHERY_PACKAGE_ID =
  "0x440ea4d7679c0fbf4a8a7f98ba1a44ac60fe268f767a4531f1a6843a482194bc";

export const FOUNTAIN_PACKAGE_ID =
  "0x8f16cb934fa0c4ad403ac3fddaab8585a642f2073a47a32215a77448c3e353c6";

export const KRIYA_FOUNTAIN_PACKAGE_ID =
  "0x3daf65b7356c560bd5bdd989aa2526e38a8e1d0b34c653b93fd65fa9bedc8dc0";

export const STRAP_FOUNTAIN_PACKAGE_ID =
  "0x563bab87935fc27517a505c3ba8f7603b80b232de6abf24c71363773c930f70d";

export const SBUCK_FOUNTAIN_PACKAGE_ID =
  "0x75b23bde4de9aca930d8c1f1780aa65ee777d8b33c3045b053a178b452222e82";

export const PSM_POOL_IDS: Partial<Record<COIN, string>> = {
  BUCKETUS:
    "0xba86a0f37377844f38060a9f62b5c5cd3f8ba13901fa6c4ee5777c1cc535306b",
  SCABLE: "0xe3a3ca38171458c6f310bc9b4ba5d7bff7850b190049dcdb1e89ddbd7893d528",
  STAPEARL:
    "0xccdaf635eb1c419dc5ab813cc64c728a9f5a851202769e254f348bff51f9a6dc",
  wUSDC: "0x0c2e5fbfeb5caa4c2f7c8645ffe9eca7e3c783536efef859be03146b235f9e04",
  wUSDT: "0x607e7d386e29066b964934e0eb1daa084538a79b5707c34f38e190d64e24923e",
  USDCbnb: "0x973c51875b3fb9c8cf5d8ec4aeac83fddaacb88c17960fd5258d8fa38bc4dd82",
  USDCsol: "0x596d696153f405cdee285a0da122c8c9a4cf6c883298aaf9bec1149e0909e168",
  USDCpol: "0x741ec9190953ee9eaa1b92b2285f15a0c7068bac2e591bfa5f7f596a75ada351",
  USDCarb: "0x10970069e17f31aee9cb55c53237d3a62584582e05f3c2030f92ce9fc6365c90",
  AUSD: "0x5a0373b5c08f0d6a33bd88bfd89db7557613699ae88e4c0039e8f7c542551a7b",
  USDC: "0xd22388010d7bdb9f02f14805a279322a3fa3fbde42896b7fb3d1214af404c455",
  FDUSD: "0xb23092f74b7bbea45056d8564a7325be993cc2926b89f384367b9ad309dd92c5",
  sbUSDT: "0x5c788db95a72c250ce1aaad29fefbaeed67b5b95a3a1fdd965ca94beb9352dff",
};

export const PSM_BALANCE_IDS: Record<string, string> = {
  wUSDC: "0x7b16192d63e6fa111b0dac03f99c5ff965205455089f846804c10b10be55983c",
  wUSDT: "0x6b68b42cbb4efccd9df30466c21fff3c090279992c005c45154bd1a0d87ac725",
  USDC: "0xdf91ef19f6038e662e9c89f111ffe19e808cdfb891d080208d15141932f9513b",
};

export const SWITCHBOARD_UPDATE_TARGET =
  "0xf1bfcf3823bf418877c09e9dae54ec0e9edafebbf567af15812eb3ea116fbd07::bucket_oracle::update_price_from_switchboard";

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

export const SBUCK_FLASK_OBJECT_ID =
  "0xc6ecc9731e15d182bc0a46ebe1754a779a4bfb165c201102ad51a36838a1a7b8";

export const SBUCK_FLASK_OBJECT = {
  objectId: SBUCK_FLASK_OBJECT_ID,
  mutable: true,
  initialSharedVersion: 90706194,
};

export const SBUCK_APR_OBJECT_ID =
  "0x4a9c3a7f42ead76b350e268976c502eafb448ff72da02923efcd4d202e46dee4";

export const SPSUI_LIQUID_STAKING_OBJECT_ID =
  "0x15eda7330c8f99c30e430b4d82fd7ab2af3ead4ae17046fcb224aa9bad394f6b";

export const MSUI_LIQUID_STAKING_OBJECT_ID =
  "0x985dd33bc2a8b5390f2c30a18d32e9a63a993a5b52750c6fe2e6ac8baeb69f48";

export const STSUI_LIQUID_STAKING_OBJECT_ID =
  "0x1adb343ab351458e151bc392fbf1558b3332467f23bda45ae67cd355a57fd5f5";

export const SCABLE_VAULTS: Record<ScableCoin, SharedObjectRef> = {
  wUSDC: {
    objectId:
      "0x7b16192d63e6fa111b0dac03f99c5ff965205455089f846804c10b10be55983c",
    initialSharedVersion: "272980432",
    mutable: true,
  },
  wUSDT: {
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
