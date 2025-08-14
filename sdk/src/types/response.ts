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
