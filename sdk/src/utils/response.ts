import { VaultInfo, VaultResponse } from '@/types';

import { formatBigInt } from './format';

// Convert response into vault object
export const parseVaultObject = (coinType: string, fields: VaultResponse): VaultInfo => {
  return {
    coinType,
    positionTableSize: fields.position_table.fields.size,
    collateralDecimal: Number(fields.decimal),
    collateralBalance: fields.balance,
    supply: fields.limited_supply.fields.supply,
    maxSupply: fields.limited_supply.fields.limit,
    interestRate: formatBigInt(fields.interest_rate.fields.value, 18),
    minCollateralRatio: formatBigInt(fields.min_collateral_ratio.fields.value),
  };
};
