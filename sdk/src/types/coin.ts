import { COLLATERAL_ASSETS } from '@/constants';

export type COIN =
  | 'SUI'
  | 'wUSDC'
  | 'wUSDT'
  | 'afSUI'
  | 'haSUI'
  | 'vSUI'
  | 'AF_LP_USDC_BUCK'
  | 'AF_LP_SUI_BUCK'
  | 'WETH'
  | 'BUCK'
  | 'BKT'
  | 'USDCbnb'
  | 'USDCsol'
  | 'USDCpol'
  | 'USDCarb'
  | 'BUCKETUS'
  | 'USDY'
  | 'NAVX'
  | 'SCABLE'
  | 'STAPEARL'
  | 'sBUCK'
  | 'CETUS'
  | 'AUSD'
  | 'USDC'

  // scallop
  | 'SCA'
  | 'sUSDC'
  | 'swUSDC'
  | 'sSUI'
  | 'sSCA'
  | 'swUSDT'
  | 'sSBETH'

  //
  | 'spSUI'
  | 'mSUI'
  | 'KOTO'
  | 'sbETH'
  | 'sbUSDT'
  | 'sbWBTC'
  | 'FDUSD'
  | 'stSUI'
  | 'BUT'
  | 'DROP'
  | 'DEEP'
  | 'sDEEP'
  | 'sSBUSDT'
  | 'gSUI'
  | 'haSUI_SUI_CETUS_VT_LP'
  | 'stSUI_SUI_ALPHAFI_FT'
  | 'bluefin_BUCK_USDC_LP'
  | 'WAL'
  | 'sWAL'
  | 'MMT_STABLE_LP'
  | 'wWAL'
  | 'haWAL'
  | 'LBTC'
  | 'HAEDAL'
  | 'xBTC';

export type ScableCoin = 'USDC' | 'sbUSDT';

export type LockupCoin = 'afSUI' | 'haSUI' | 'vSUI' | 'sBUCK';

export type CollateralCoin = (typeof COLLATERAL_ASSETS)[number];
