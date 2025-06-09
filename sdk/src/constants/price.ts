import { SuiClient, SuiObjectResponse } from '@mysten/sui/dist/cjs/client';

import { COIN } from '@/types';
import {
  computeBlizzardStakingRate,
  computeHaWalStakingRate,
  computeLiquidStakingRate,
  computeSbuckRate,
  computeSupraPrice,
  computeUnihouseRate,
  getAlphafiStSUIFtPrice,
  getCetusVaultLpPrice,
  getScoinRates,
} from '@/utils';

import { SBUCK_FLASK_OBJECT_ID } from './object';

export const ORACLE_OBJECT = {
  objectId: '0xf578d73f54b3068166d73c1a1edd5a105ce82f97f5a8ea1ac17d53e0132a1078',
  mutable: true,
  initialSharedVersion: 5174506,
};

export const SUPRA_UPDATE_TARGET =
  '0xe2077d678de929d64d3fcd79c1adfbd23d97324e9bae3a60102d44367fbe008c::bucket_oracle::update_price_from_supra';

export const SUPRA_HANDLER_OBJECT = {
  objectId: '0xaa0315f0748c1f24ddb2b45f7939cff40f7a8104af5ccbc4a1d32f870c0b4105',
  initialSharedVersion: 5963053,
  mutable: true,
};

export const SUPRA_PRICE_FEEDS = {
  usdc_usd: '0x1c400c096e8b52a22c43c080fea4aa22661c9a35b469493dfac5332aecb4789c',
  usdt_usd: '0x11ea8c7b6287f1410c8bac2e475b4fe6fea45fd59e036a058522ab3acec8fed3',
  usdy_usd: '0x95d93c5bed776b020ce848964572d90bf4694a73fd06c7238a4be05bf438d724',
  navx_usd: '0x996cfab93ecd365cea4e2ea5bb6d29160192513eec5e08521d0edad3796f667c',
  cetus_usd: '0xc0205c51048f09dee3d28c08d1f3dd8c8b5aca65337aac63562e8b8140b32ac6',
  btc_usd: '0xd3eb1720c811452b3abcef9179abd0674dd8a7a9ab050f3993a6e2176671f67a',
  sca_usd: '0x94dff56ca222ecb8b1df97596720e1d5de65e31e242067f19c8ef9544050233c',
  eth_usdt: '0x258d0f9c61768d184d218a068ff8117728f5becb1bfe2b1e3b6e231dda875a67',
  sui_usdt: '0x898236b8f93d5ea7f94fbec1b3ac152ae51901e3078859a92cbf06c46c20b316',
  deep_usdt: '0x4d3db9e6fb2e4f28d6b0e9a06f2f13a6db5f52c45f36124710a98fda9dfadd7e',
  hasui_sui: '0xd741ca15eb5e19f2d138b9e9cb95d70dc90667370dee7cbad184acfbb35063cf',
  vsui_sui: '0xd291ea0aebb1a9314cd60d5142755267f9badbeccd30b91e92b54bef29864f33',
  afsui_sui: '0xbe4289cf638a9ad1f085bd8a3e0aeaed814078e3961b77fb08cc7550ee5d8c00',
  wal_usd: '0x331cedd90ec0adf2a0cc8d6739e7b21154bd3c1bd2c2bdbd84b43b73e297b87e',
};

export const SUPRA_ID: Record<string, number> = {
  wUSDT: 48,
  wUSDC: 89,
  USDC: 89,
  WETH: 19,
  SUI: 90,
  afSUI: 90,
  haSUI: 90,
  vSUI: 90,
  USDY: 185,
  NAVX: 408,
  CETUS: 93,
  SCA: 476,
  sbETH: 19,
  DEEP: 491,
  sbUSDT: 48,
  sbWBTC: 18,
  WAL: 534,
  LBTC: 18,
  HAEDAL: 540,
  xBTC: 18,
};

export const SPSUI_LIQUID_STAKING_OBJECT_ID = '0x15eda7330c8f99c30e430b4d82fd7ab2af3ead4ae17046fcb224aa9bad394f6b';
export const MSUI_LIQUID_STAKING_OBJECT_ID = '0x985dd33bc2a8b5390f2c30a18d32e9a63a993a5b52750c6fe2e6ac8baeb69f48';
export const STSUI_LIQUID_STAKING_OBJECT_ID = '0x1adb343ab351458e151bc392fbf1558b3332467f23bda45ae67cd355a57fd5f5';
export const GSUI_UNIHOUSE_OBJECT_ID = '0x811fe901ed2a5d75cd125912ad6110efdff8be00fe694601a94167e2bd545ac2';
export const UNIHOUSE_OBJECT_ID = '0x75c63644536b1a7155d20d62d9f88bf794dc847ea296288ddaf306aa320168ab';
export const WALRUS_STAKING_OBJECT_ID = '0x9e5f6537be1a5b658ec7eed23160df0b28c799563f6c41e9becc9ad633cb592b';
export const BLIZZARD_STAKING_OBJECT_ID = '0xccf034524a2bdc65295e212128f77428bb6860d757250c43323aa38b3d04df6d';

export const SCOIN_BALANCE_SHEET_ID = {
  sSUI: '0x9c9077abf7a29eebce41e33addbcd6f5246a5221dd733e56ea0f00ae1b25c9e8',
  sSCA: '0x6fc7d4211fc7018b6c75e7b908b88f2e0536443239804a3d32af547637bd28d7',
  sUSDC: '0xd3be98bf540f7603eeb550c0c0a19dbfc78822f25158b5fa84ebd9609def415f',
  swUSDC: '0x2f4df5e1368fbbdaa5c712d28b837b3d41c2d3872979ccededcdfdac55ff8a93',
  swUSDT: '0xfbc056f126dd35adc1f8fe985e2cedc8010e687e8e851e1c5b99fdf63cd1c879',
  sSBETH: '0xaa34c938e0394e5186c7dc626ad69be96af2194b23fdc6ac1c63090e399f5ba4',
  sDEEP: '0xf4a67ffb43da1e1c61c049f188f19463ea8dbbf2d5ef4722d6df854ff1b1cc03',
  sSBUSDT: '0x958ca02058a7dd8b00e26ed6988f45d7c2834ae2a47ee4c4a8fdedea155f18ca',
  sWAL: '0xd1dc54a659a5f1b5b26864a1ee0327585c0bd07f066bd3864163db7e73df1209',
};

export const CETUS_VAULT_PACKAGE_ID = '0x58e5de6e425397eeaf952d55c0f94637bee91b25d6138ce222f89cda0aefec03';
export const CETUS_HASUI_SUI_VAULT_LP_OBJECT_ID = '0xde97452e63505df696440f86f0b805263d8659b77b8c316739106009d514c270';
export const CETUS_HASUI_SUI_POOL_OBJECT_ID = '0x871d8a227114f375170f149f7e9d45be822dd003eba225e83c05ac80828596bc';
export const ALPHAFI_STSUI_SUI_PACKAGE_ID = '0xbfbd59ec10e2b62c887e268a051ae84570ecf0d621480c0418300f28913d7380';

type PriceMapItem = {
  objectId?: string;
  processFn?: ({
    suiClient,
    object,
    prices,
  }: {
    suiClient: SuiClient;
    object?: SuiObjectResponse;
    prices: number[];
  }) => number | Promise<number>;
} & {
  dependentTokens?: COIN | COIN[];
  defaultValue?: number;
};

export const PRICE_MAP: Partial<Record<COIN, PriceMapItem>> = {
  BUCK: {
    defaultValue: 1,
  },
  AUSD: {
    defaultValue: 1,
  },
  FDUSD: {
    defaultValue: 1,
  },
  BUCKETUS: {
    defaultValue: 1,
  },
  SCABLE: {
    defaultValue: 1,
  },
  STAPEARL: {
    defaultValue: 1,
  },
  bluefin_BUCK_USDC_LP: {
    defaultValue: 1,
  },
  MMT_STABLE_LP: {
    defaultValue: 1,
  },
  SUI: {
    objectId: SUPRA_PRICE_FEEDS.sui_usdt,
    processFn: ({ object, prices }) => computeSupraPrice(object) * prices[0],
    dependentTokens: 'wUSDT',
  },
  USDC: {
    objectId: SUPRA_PRICE_FEEDS.usdc_usd,
    processFn: ({ object }) => computeSupraPrice(object),
    defaultValue: 1,
  },
  wUSDC: {
    dependentTokens: 'USDC',
    defaultValue: 1,
  },
  wUSDT: {
    objectId: SUPRA_PRICE_FEEDS.usdt_usd,
    processFn: ({ object }) => computeSupraPrice(object),
    defaultValue: 1,
  },
  sbUSDT: {
    dependentTokens: 'wUSDT',
    defaultValue: 1,
  },
  USDY: {
    objectId: SUPRA_PRICE_FEEDS.usdy_usd,
    processFn: ({ object }) => computeSupraPrice(object),
    defaultValue: 1,
  },
  sbWBTC: {
    objectId: SUPRA_PRICE_FEEDS.btc_usd,
    processFn: ({ object }) => computeSupraPrice(object),
  },
  WETH: {
    objectId: SUPRA_PRICE_FEEDS.eth_usdt,
    processFn: ({ object, prices }) => computeSupraPrice(object) * prices[0],
    dependentTokens: 'wUSDT',
  },
  sbETH: {
    dependentTokens: 'WETH',
  },
  SCA: {
    objectId: SUPRA_PRICE_FEEDS.sca_usd,
    processFn: ({ object }) => computeSupraPrice(object),
  },
  DEEP: {
    objectId: SUPRA_PRICE_FEEDS.deep_usdt,
    processFn: ({ object, prices }) => computeSupraPrice(object) * prices[0],
    dependentTokens: 'wUSDT',
  },
  NAVX: {
    objectId: SUPRA_PRICE_FEEDS.navx_usd,
    processFn: ({ object }) => computeSupraPrice(object),
  },
  CETUS: {
    objectId: SUPRA_PRICE_FEEDS.cetus_usd,
    processFn: ({ object }) => computeSupraPrice(object),
  },
  haSUI: {
    objectId: SUPRA_PRICE_FEEDS.hasui_sui,
    processFn: ({ object, prices }) => computeSupraPrice(object) * prices[0],
    dependentTokens: 'SUI',
  },
  vSUI: {
    objectId: SUPRA_PRICE_FEEDS.vsui_sui,
    processFn: ({ object, prices }) => computeSupraPrice(object) * prices[0],
    dependentTokens: 'SUI',
  },
  afSUI: {
    objectId: SUPRA_PRICE_FEEDS.afsui_sui,
    processFn: ({ object, prices }) => computeSupraPrice(object) * prices[0],
    dependentTokens: 'SUI',
  },
  WAL: {
    objectId: SUPRA_PRICE_FEEDS.wal_usd,
    processFn: ({ object }) => computeSupraPrice(object),
  },
  sBUCK: {
    objectId: SBUCK_FLASK_OBJECT_ID,
    processFn: ({ object, prices }) => computeSbuckRate(object) * prices[0],
    dependentTokens: 'BUCK',
  },
  spSUI: {
    objectId: SPSUI_LIQUID_STAKING_OBJECT_ID,
    processFn: ({ object, prices }) => computeLiquidStakingRate(object) * prices[0],
    dependentTokens: 'SUI',
  },
  mSUI: {
    objectId: MSUI_LIQUID_STAKING_OBJECT_ID,
    processFn: ({ object, prices }) => computeLiquidStakingRate(object) * prices[0],
    dependentTokens: 'SUI',
  },
  stSUI: {
    objectId: STSUI_LIQUID_STAKING_OBJECT_ID,
    processFn: ({ object, prices }) => computeLiquidStakingRate(object) * prices[0],
    dependentTokens: 'SUI',
  },
  gSUI: {
    objectId: GSUI_UNIHOUSE_OBJECT_ID,
    processFn: ({ object, prices }) => computeUnihouseRate(object) * prices[0],
    dependentTokens: 'SUI',
  },
  haWAL: {
    objectId: WALRUS_STAKING_OBJECT_ID,
    processFn: ({ object, prices }) => computeHaWalStakingRate(object) * prices[0],
    dependentTokens: 'WAL',
  },
  wWAL: {
    processFn: async ({ suiClient, prices }) => (await computeBlizzardStakingRate(suiClient)) * prices[0],
    dependentTokens: 'WAL',
  },
  sSUI: {
    objectId: SCOIN_BALANCE_SHEET_ID.sSUI,
    processFn: ({ object, prices }) => getScoinRates(object) * prices[0],
    dependentTokens: 'SUI',
  },
  sSCA: {
    objectId: SCOIN_BALANCE_SHEET_ID.sSCA,
    processFn: ({ object, prices }) => getScoinRates(object) * prices[0],
    dependentTokens: 'SCA',
  },
  sUSDC: {
    objectId: SCOIN_BALANCE_SHEET_ID.sUSDC,
    processFn: ({ object, prices }) => getScoinRates(object) * prices[0],
    dependentTokens: 'USDC',
  },
  swUSDC: {
    objectId: SCOIN_BALANCE_SHEET_ID.swUSDC,
    processFn: ({ object, prices }) => getScoinRates(object) * prices[0],
    dependentTokens: 'wUSDC',
  },
  swUSDT: {
    objectId: SCOIN_BALANCE_SHEET_ID.swUSDT,
    processFn: ({ object, prices }) => getScoinRates(object) * prices[0],
    dependentTokens: 'wUSDT',
  },
  sSBETH: {
    objectId: SCOIN_BALANCE_SHEET_ID.sSBETH,
    processFn: ({ object, prices }) => getScoinRates(object) * prices[0],
    dependentTokens: 'sbETH',
  },
  sDEEP: {
    objectId: SCOIN_BALANCE_SHEET_ID.sDEEP,
    processFn: ({ object, prices }) => getScoinRates(object) * prices[0],
    dependentTokens: 'DEEP',
  },
  sSBUSDT: {
    objectId: SCOIN_BALANCE_SHEET_ID.sSBUSDT,
    processFn: ({ object, prices }) => getScoinRates(object) * prices[0],
    dependentTokens: 'sbUSDT',
  },
  sWAL: {
    objectId: SCOIN_BALANCE_SHEET_ID.sWAL,
    processFn: ({ object, prices }) => getScoinRates(object) * prices[0],
    dependentTokens: 'WAL',
  },
  haSUI_SUI_CETUS_VT_LP: {
    objectId: CETUS_HASUI_SUI_POOL_OBJECT_ID,
    processFn: ({ suiClient, object, prices }) =>
      getCetusVaultLpPrice(
        suiClient,
        object,
        CETUS_HASUI_SUI_POOL_OBJECT_ID,
        CETUS_HASUI_SUI_VAULT_LP_OBJECT_ID,
        'haSUI_SUI_CETUS_VT_LP',
        'haSUI',
        'SUI',
        prices[0],
      ),
    dependentTokens: 'SUI',
  },
  stSUI_SUI_ALPHAFI_FT: {
    processFn: ({ suiClient, prices: [stSuiPrice, suiPrice] }) =>
      getAlphafiStSUIFtPrice(suiClient, stSuiPrice, suiPrice),
    dependentTokens: ['stSUI', 'SUI'],
  },
};
