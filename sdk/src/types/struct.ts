export type Float = { fields: { value: string } };
export type Double = { fields: { value: string } };

export type VaultInfo = {
  collateralType: string;
  collateralDecimal: number;
  collateralBalance: number;
  minCollateralRatio: number;
  interestRate: number;
  usdbSupply: number;
  maxSupply: number;
  positionTableSize: number;
};

export type PositionInfo = {
  collateralType: string;
  collateralAmount: string;
  debtAmount: string;
  debtor: string;
};

export type PaginatedPositionsResult = {
  positions: PositionInfo[];
  nextCursor: string | null;
};
