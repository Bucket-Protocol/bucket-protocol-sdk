export type Float = { fields: { value: string } };
export type Double = { fields: { value: string } };

export type VaultResponse = {
  balance: string;
  decimal: number;
  interest_rate: Double;
  limited_supply: {
    fields: {
      limit: string;
      supply: string;
    };
  };
  min_collateral_ratio: Float;
  position_table: {
    fields: {
      head: string | null;
      tail: string | null;
      id: { id: string };
      size: string;
    };
  };
};

export type VaultInfo = {
  collateralType: string;
  collateralDecimal: number;
  collateralBalance: string;
  minCollateralRatio: number;
  interestRate: number;
  usdbSupply: string;
  maxSupply: string;
  positionTableSize: string;
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
