import { EventId } from "@mysten/sui.js/src/client";
import { ACCEPT_ASSETS, COIN } from "src/constants";

export type ProtocolInfo = {
  buckSupply: number;
}

export type BucketInfo = {
  token: ACCEPT_ASSETS;
  baseFeeRate: number;
  bottleTableSize: string;
  collateralDecimal: number;
  collateralVault: string;
  latestRedemptionTime: number;
  minCollateralRatio: string;
  mintedBuckAmount: string;
  minBottleSize: string;
  maxMintAmount: string;
  recoveryModeThreshold: string;
};

export type BucketProtocolResponse = {
  dataType: string;
  type: string;
  hasPublicTransfer: boolean;
  fields: {
    buck_treasury_cap: {
      type: string;
      fields: {
        id: {
          id: string;
        };
        total_supply: {
          type: string;
          fields: {
            value: string;
          }
        }
      };
    };
    id: {
      id: string;
    };
    min_bottle_size: string;
    version: string;
  };
};

export type BucketResponse = {
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
  max_mint_amount: string;
  min_collateral_ratio: string;
  minted_buck_amount: string;
  min_bottle_size: string;
  recovery_mode_threshold: string;
  total_flash_loan_amount: string;
};

export type BottleInfo = {
  token: string;
  collateralAmount: number;
  buckAmount: number;
};

export type BottleInfoResponse = {
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

export type TankInfoReponse = {
  reserve: string;
  collateral_pool: string;
  current_s: string;
  current_p: string;
};

export type TankInfo = {
  buckReserve: string;
  collateralPool: string;
  currentS: string;
  currentP: string;
};

export type TankList = Partial<Record<COIN, TankInfo>>;


export type FountainInfo = {
  id: string;
  sourceBalance: number;
  flowAmount: number;
  flowInterval: number;
  poolBalance: number;
  stakedBalance: number;
  totalWeight: number;
  cumulativeUnit: number;
  latestReleaseTime: number;
};

export type FountainList = Record<string, FountainInfo>;

export type ContributorToken = {
  data: {
    digest: string;
    objectId: string;
    version: string;
  };
};

export type UserTankInfo = {
  totalEarned: number;
  totalBUCK: number;
};

export type UserTankList = Partial<Record<COIN, UserTankInfo>>;

export type SupraPriceFeed = {
  id: {
    id: string;
  };
  name: number;
  value: {
    type: string;
    fields: {
      decimal: number;
      round: string;
      timestamp: string;
      value: string;
    }
  }
};

export type UserLpProof = {
  objectId: string;
  version: string;
  digest: string;
  typeName: string;
  fountainId: string;
  startUnit: number;
  stakeAmount: number;
  stakeWeight: number;
  lockUntil: number;
};

export type UserLpList = Record<string, UserLpProof[]>;