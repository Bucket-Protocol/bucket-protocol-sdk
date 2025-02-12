import { SuiObjectResponse } from "@mysten/sui/client";

import {
  BucketInfo,
  DeCenterResponse,
  DeTokenResponse,
  LiquidStakingResponse,
  SBUCKFlaskResponse,
  SupraPriceFeedResponse,
  UnihouseResponse,
} from "../types";
import { getObjectFields } from "./object";
import { MAX_STAKING_WEEKS } from "../constants/detoken";
import { formatUnits } from "./format";
import Decimal from "./decimal";

export function computeBorrowFeeRate(
  bucketInfo: BucketInfo | null | undefined,
): number {
  if (!bucketInfo) return 0.003;
  const interval =
    (new Date().valueOf() - bucketInfo.latestRedemptionTime) / (3600_000 * 12);
  const borrowFee = (bucketInfo.baseFeeRate / 1_000_000) * 0.5 ** interval;

  if (borrowFee < 0.003) return 0.003;
  else if (borrowFee > 0.05) return 0.05;
  else return borrowFee;
}

export function computeSupraPrice(res: SuiObjectResponse): number {
  const priceFeed = getObjectFields(res) as SupraPriceFeedResponse;
  const priceBn = priceFeed.value.fields.value;
  const decimals = priceFeed.value.fields.decimal;
  const price = parseInt(priceBn) / Math.pow(10, decimals);
  return price;
}

export function computeSBUCKPrice(res: SuiObjectResponse): number {
  const priceFeed = getObjectFields(res) as SBUCKFlaskResponse;
  const reserves = priceFeed.reserves;
  const sBuckSupply = priceFeed.sbuck_supply.fields.value;
  const price = Number(reserves) / Number(sBuckSupply);
  return price;
}

export function computeLiquidStakingRate(res: SuiObjectResponse): number {
  const resp = getObjectFields(res) as LiquidStakingResponse;
  const totalSuiSupply = Number(resp.storage.fields.total_sui_supply) / 10 ** 9;
  const totalLstSupply =
    Number(resp.lst_treasury_cap.fields.total_supply.fields.value) / 10 ** 9;
  const rate = totalSuiSupply / totalLstSupply;
  return rate;
}

export function computeUnihouseRate(res: SuiObjectResponse): number {
  const resp = getObjectFields(res) as UnihouseResponse;
  const debtAmount = Number(
    formatUnits(BigInt(resp.pipe_debt.fields.value), 9),
  );
  const poolAmount = Number(formatUnits(BigInt(resp.pool), 9));
  const gsuiSupply = Number(formatUnits(BigInt(resp.supply.fields.value), 9));
  const rate = (debtAmount + poolAmount) / gsuiSupply;
  return rate;
}

export function calculateRewardAmount(
  flowAmount: number,
  flowInterval: number,
) {
  return (flowAmount / 10 ** 9 / flowInterval) * 86400000;
}

export function calculateAPR(
  rewardAmount: number,
  totalAmount: number,
  CR: number,
  price: number,
) {
  if (totalAmount > 0) {
    return (
      ((rewardAmount * 365 * price) / (totalAmount / 10 ** 9) / (CR / 100)) *
      100
    );
  }

  return 0;
}

export const getEstimatedDeButAmount = (
  stakeAmount: number,
  unlockDate: number,
) => {
  const remainingTime = Math.max(unlockDate - Date.now(), 0);

  return (
    stakeAmount *
    Math.min(remainingTime / (MAX_STAKING_WEEKS * 7 * 86400000), 1)
  );
};

export const getDeButAmount = (
  deToken: DeCenterResponse | DeTokenResponse,
  now: number,
): number => {
  const { timestamp, bias, slope } = deToken.point.fields;
  if (now < Number(timestamp)) {
    return 0;
  }
  return Math.max(
    (Number(bias.fields.bits) -
      (Number(slope.fields.bits) * (now - Number(timestamp))) / 10 ** 9) /
      10 ** 9,
    0,
  );
};

export const calculateClmmPrice = (
  sqrtPrice: string,
  decimalsA: number,
  decimalsB: number,
): number => {
  const priceX64 = new Decimal(sqrtPrice).mul(Decimal.pow(2, -64));
  const price = priceX64.pow(2).mul(Decimal.pow(10, decimalsA - decimalsB));
  return price.toNumber();
};
