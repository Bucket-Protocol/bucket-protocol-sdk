import { VaultInfo, VaultResponse } from '@/types/struct';
import { formatBigInt } from '@/utils/format';

/**
 * @description convert response into vault object
 */
export const parseVaultObject = (collateralType: string, fields: VaultResponse): VaultInfo => ({
  collateralType,
  positionTableSize: fields.position_table.fields.size,
  collateralDecimal: Number(fields.decimal),
  collateralBalance: fields.balance,
  usdbSupply: fields.limited_supply.fields.supply,
  maxSupply: fields.limited_supply.fields.limit,
  interestRate: formatBigInt(fields.interest_rate.fields.value, 18),
  minCollateralRatio: formatBigInt(fields.min_collateral_ratio.fields.value),
});
