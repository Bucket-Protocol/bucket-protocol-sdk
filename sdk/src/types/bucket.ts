import { TransactionArgument } from '@mysten/sui/transactions';

import { CollateralCoin } from './coin';

export type ProtocolInfo = {
  buckSupply: number;
};

export interface BucketConstants {
  feePrecision: string;
  liquidationRebate: string;
  flashLoanFee: string;
  buckDecimal: number;
  maxLockTime: string;
  minLockTime: string;
  minFee: string;
  maxFee: string;
}

export type BucketInfo = {
  token: CollateralCoin;
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
export type BucketList = Partial<Record<CollateralCoin, BucketInfo>>;

export type BottleInfo = {
  token: CollateralCoin;
  collateralAmount: number;
  buckAmount: number;
};

export type UserBottleInfo = {
  strapId?: string;
  debtAmount?: number;
  startUnit?: number;
  isLocked?: boolean;
  key?: string;
} & BottleInfo;

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
  isLocked: boolean;
};
export type UserLpList = Record<string, UserLpProof[]>;

export type ProofObject = {
  token: string;
  proof: TransactionArgument | string;
};

export type TankInfo = {
  buckReserve: string;
  collateralPool: string;
  currentS: string;
  currentP: string;
};
export type TankList = Partial<Record<CollateralCoin, TankInfo>>;

export type UserTankInfo = {
  totalEarned: number;
  totalBUCK: number;
};
export type UserTankList = Partial<Record<CollateralCoin, UserTankInfo>>;

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

export type BottlePage = {
  bottles: Bottle[];
  nextCursor: string | null;
};

export type Bottle = {
  debtor: string;
  collAmount: number;
  debtAmount: number;
  ncr: number;
};

export type DeButInfo = {
  totalStakedButAmount: number;
  totalDeButAmount: number;
  accumulatedPenaltyAmount: number;
  circulatingSupply: number;
};

export type DeButPosition = {
  id: string;
  stakedButAmount: number;
  stakedPeriod: number;
  startDate: number;
  unlockDate: number;
  deButAmount: number;
  earlyUnstakable: boolean;
};

export type DeButWrapper = {
  id: string;
  deButPositions: DeButPosition[];
};

export type UserDeButInfo = {
  deButWrapper: DeButWrapper | null;
  deButPositions: DeButPosition[];
  dropsAmount: number;
  lastDropsAmount: number;
  isCheckedIn: boolean;
};
