export type Float = { fields: { value: string } };
export type Double = { fields: { value: string } };

export type VaultInfo = {
  collateralType: string;
  collateralDecimal: number;
  collateralBalance: bigint;
  usdbSupply: bigint;
  maxUsdbSupply: bigint;
  minCollateralRatio: number;
  interestRate: number;
  positionTableSize: number;
  rewardRate: Record<string, number>;
};

export type SavingPoolInfo = {
  lpType: string;
  lpSupply: bigint;
  usdbBalance: bigint;
  usdbDepositCap: bigint | null;
  savingRate: number;
  rewardRate: Record<string, number>;
};

export type PsmPoolInfo = {
  coinType: string;
  decimal: number;
  balance: bigint;
  usdbSupply: bigint;
  feeRate: {
    swapIn: number;
    swapOut: number;
  };
  partnerFeeRate: Record<
    string,
    {
      swapIn: number;
      swapOut: number;
    }
  >;
};

export type PositionInfo = {
  collateralType: string;
  collateralAmount: bigint;
  debtAmount: bigint;
  debtor: string;
  accountId?: string;
};

export type SavingInfo = {
  lpType: string;
  usdbBalance: bigint;
  lpBalance: bigint;
  rewards: Record<string, bigint>;
};

export type PaginatedPositionsResult = {
  positions: PositionInfo[];
  nextCursor: string | null;
};
