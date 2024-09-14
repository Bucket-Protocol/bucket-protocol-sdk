import { COIN } from "./config";

export type ProtocolInfo = {
  buckSupply: number;
}

export type BucketInfo = {
  token: COIN;
  baseFeeRate: number;
  bottleTableSize: string;
  bottleTableId: string;
  collateralDecimal: number;
  collateralVault: string;
  latestRedemptionTime: number;
  minCollateralRatio: string;
  mintedBuckAmount: string;
  minBottleSize: string;
  maxMintAmount: string;
  recoveryModeThreshold: string;
};

export type BucketList = Partial<Record<COIN, BucketInfo>>;

export type BottleInfo = {
  token: COIN;
  collateralAmount: number;
  buckAmount: number;
};

export type UserBottleInfo = {
  strapId?: string;
  debtAmount?: number;
  startUnit?: number;
} & BottleInfo;

export interface BucketConstants {
  feePrecision: string,
  liquidationRebate: string,
  flashLoanFee: string,
  buckDecimal: number,
  maxLockTime: string,
  minLockTime: string,
  minFee: string,
  maxFee: string
}

export type TankInfo = {
  buckReserve: string;
  collateralPool: string;
  currentS: string;
  currentP: string;
};

export type TankList = Partial<Record<COIN, TankInfo>>;

export type FountainInfo = {
  id: string;
  sourceBalance: number;
  flowAmount: number;
  flowInterval: number;
  poolBalance: number;
  stakedBalance: number;
  totalWeight: number;
  cumulativeUnit: number;
  latestReleaseTime: number;
};

export type FountainList = Record<string, FountainInfo>;

export type StrapFountainInfo = {
  id: string;
  strapId: string;
  sourceBalance: number;
  flowAmount: number;
  flowInterval: number;
  poolBalance: number;
  totalDebtAmount: number;
  cumulativeUnit: number;
  latestReleaseTime: number;
};

export type StrapFountainList = Record<string, StrapFountainInfo>;


export type PsmInfo = {
  id: string;
  tvl: number;
  chargeRate: number;
  dischargeRate: number;
  conversionRate: number;
  balance?: number;
};

export type PsmList = Record<string, PsmInfo>;

export type ContributorToken = {
  data: {
    digest: string;
    objectId: string;
    version: string;
  };
};

export type UserTankInfo = {
  totalEarned: number;
  totalBUCK: number;
};

export type UserTankList = Partial<Record<COIN, UserTankInfo>>;

export type UserLpProof = {
  objectId: string;
  version: string;
  digest: string;
  typeName: string;
  fountainId: string;
  startUnit: number;
  stakeAmount: number;
  stakeWeight: number;
  lockUntil: number;
};

export type UserLpList = Record<string, UserLpProof[]>;