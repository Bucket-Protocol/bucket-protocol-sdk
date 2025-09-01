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
};

export type PaginatedPositionsResult = {
  positions: PositionInfo[];
  nextCursor: string | null;
};
