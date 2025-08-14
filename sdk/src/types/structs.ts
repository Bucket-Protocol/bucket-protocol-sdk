export type VaultInfo = {
  coinType: string;
  interestRate: number;
  positionTableSize: string;
  collateralDecimal: number;
  collateralBalance: string;
  minCollateralRatio: number;
  supply: string;
  maxSupply: string;
};

export type PositionInfo = {
  coinType: string;
  collAmount: string;
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

export type VaultObjectInfo = {
  coinType: string;
  priceAggregater: SharedObjectRef;
  vault: SharedObjectRef;
  pythPriceId?: string;
  rewarders?: SharedObjectRef[];
};

export type CdpPositionsResponse = {
  coinType: string;
  positions: {
    debtor: string;
    collAmount: number;
    debtAmount: number;
  }[];
  nextCursor: string | null;
};
