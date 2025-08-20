export type VaultInfo = {
  collateralCoinType: string;
  collateralDecimal: number;
  collateralBalance: string;
  minCollateralRatio: number;
  interestRate: number;
  usdbSupply: string;
  maxSupply: string;
  positionTableSize: string;
};

export type PositionInfo = {
  collateralCoinType: string;
  collateralAmount: string;
  debtAmount: string;
};

export type Rewards = {
  coinType: string;
  amount: number;
}[];

export type SharedObjectRef = {
  objectId: string;
  mutable: boolean;
  initialSharedVersion: string;
  coinType?: string;
};

export type AggregatorObjectInfo = {
  coinType: string;
  priceAggregater: SharedObjectRef;
  pythPriceId?: string;
};

export type VaultObjectInfo = {
  collateralCoinType: string;
  vault: SharedObjectRef;
  rewarders?: SharedObjectRef[];
};

export type PSMPoolObjectInfo = {
  collateralCoinType: string;
  pool: SharedObjectRef;
};

export type CdpPositionsResponse = {
  collateralCoinType: string;
  positions: {
    debtor: string;
    collateralAmount: number;
    debtAmount: number;
  }[];
  nextCursor: string | null;
};
