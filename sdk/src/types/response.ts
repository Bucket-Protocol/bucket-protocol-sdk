import { EventId } from '@mysten/sui/client';

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
          };
        };
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
  surplus_bottle_table: {
    fields: {
      id: {
        id: string;
      };
    };
  };
  latest_redemption_time: string;
  max_mint_amount: string;
  min_collateral_ratio: string;
  minted_buck_amount: string;
  min_bottle_size: string;
  recovery_mode_threshold: string;
  total_flash_loan_amount: string;
};

export type PipeResponse = {
  id: {
    id: string;
  };
  output_volume: string;
};

export type BottleInfoResponse = {
  value: {
    fields: {
      next: string;
      prev: string;
      value: {
        fields: {
          collateral_amount: number;
          buck_amount: number;
          id: {
            id: string;
          };
          reward_coll_snapshot: string;
          reward_debt_snapshot: string;
          stake_amount: string;
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

export type TankInfoResponse = {
  reserve: string;
  collateral_pool: string;
  current_s: string;
  current_p: string;
};

export type FountainResponse = {
  cumulative_unit: string;
  flow_amount: string;
  flow_interval: string;
  id: {
    id: string;
  };
  latest_release_time: string;
  max_lock_time: string;
  min_lock_time: string;
  pool: string;
  source: string;
  staked: string;
  total_weight: string;
};

export type StrapFountainResponse = {
  cumulative_unit: string;
  flow_amount: string;
  flow_interval: string;
  id: {
    id: string;
  };
  latest_release_time: string;
  total_debt_amount: string;
  pool: string;
  source: string;
  strap_table: {
    fields: {
      id: {
        id: string;
      };
    };
  };
  surplus_table: {
    fields: {
      id: {
        id: string;
      };
    };
  };
};

export type SupraPriceFeedResponse = {
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
    };
  };
};

export type SBUCKFlaskResponse = {
  id: {
    id: string;
  };
  reserves: string;
  sbuck_supply: {
    fields: {
      value: string;
    };
  };
};

export type ScallopPriceFeedResponse = {
  id: {
    id: string;
  };
  price: string;
  precision: string;
  precision_decimal: number;
  threshold: string;
  tolerance_ms: string;
  latest_update_ms: string;
};

export type LiquidStakingResponse = {
  id: {
    id: string;
  };
  accrued_spread_fees: string;
  fees: string;
  lst_treasury_cap: {
    fields: {
      total_supply: {
        fields: {
          value: string;
        };
      };
    };
  };
  storage: {
    fields: {
      last_refresh_epoch: string;
      sui_pool: string;
      total_sui_supply: string;
    };
  };
};

export type UnihouseResponse = {
  id: {
    id: string;
  };
  house_pool: string;
  max_supply: string;
  pool: string;
  voucher_pool: string;
  supply: {
    fields: {
      value: string;
    };
    type: string;
  };
  pipe_debt: {
    fields: {
      value: string;
    };
    type: string;
  };
  house_pipe_debt: {
    fields: {
      value: string;
    };
    type: string;
  };
};

export type PsmPoolResponse = {
  buck_minted_amount: string;
  charge_fee_rate: string;
  discharge_fee_rate: string;
  conversion_rate: string;
  id: {
    id: string;
  };
  pool: string;
};

export type PsmBalanceResponse = {
  coin_balance: string;
  scoin_balance: string;
  id: {
    id: string;
  };
};

export type AprResponse = {
  id: {
    id: string;
  };
  latest_time: string;
  rate: {
    fields: {
      value: string;
    };
    type: string;
  };
};

export type CetusPoolResponse = {
  coin_a: string;
  coin_b: string;
  fee_rate: string;
  liquidity: string;
  current_sqrt_price: string;
};

export type CetusVaultLpResponse = {
  finish_rebalance_threshold: string;
  liquidity: string;
  max_quota: string;
  pool: string;
  status: string;
};

export type LpTokenValueEvent = {
  lp_amount: string;
  amount_a: string;
  amount_b: string;
  clmm_pool: string;
  vault_id: string;
};
