import { EventId } from "@mysten/sui.js/src/client";


export type BucketResponseResult = {
  baseFeeRate: number;
  bottleTableSize: string;
  collateralDecimal: number;
  collateralVault: string;
  latestRedemptionTime: number;
  minCollateralRatio: string;
  mintedBuckAmount: string;
  minBottleSize: string;
  recoveryModeThreshold: string;
};

export type BucketList = {
  [key: string]: BucketResponseResult;
};

export type BucketTypeInfo = {
  base_fee_rate: string;
  bottle_table: {
    type: string;
    fields: {
      debt_per_unit_stake: string;
      id: {
        id: string;
      };
      reward_per_unit_stake: string;
      table: {
        type: string;
        fields: {
          head: string;
          id: {
            id: string;
          };
          size: string;
          tail: string;
        };
      };
      total_collateral_snapshot: string;
      total_stake: string;
      total_stake_snapshot: string;
    };
  };
  collateral_decimal: number;
  collateral_vault: string;
  id: {
    id: string;
  };
  latest_redemption_time: string;
  min_collateral_ratio: string;
  minted_buck_amount: string;
  min_bottle_size: string;
  recovery_mode_threshold: string;
  total_flash_loan_amount: string;
};

export type BottleInfo = {
  collateralAmount: number;
  buckAmount: number; //user debt
  decimals: number;
};

export type BottleInfoResult = {
  value: {
    fields: {
      value: {
        fields: {
          collateral_amount: number;
          buck_amount: number;
        };
      };
    };
  };
};

export type BottleAmountsList = {
  [key: string]: BottleInfo;
};


export interface BottleSummary {
  bottleId: string;
}

export interface PaginatedBottleSummary {
  data: BottleSummary[];
  hasNextPage: boolean;
  nextCursor?: EventId | null;
}

export interface BucketConstants {
  feePrecision: string,
  liquidationRebate: string,
  flashLoanFee: string,
  buckDecimal: number,
  maxLockTime: string,
  minLockTime: string,
  minFee: string,
  maxFee: string
}

export type PackageType = "mainnet" | "testnet";