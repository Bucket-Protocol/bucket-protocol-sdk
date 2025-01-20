import { SuiObjectResponse } from "@mysten/sui/client";
import {
  BucketInfo,
  DeCenterResponse,
  DeTokenResponse,
  LiquidStakingResponse,
  SBUCKFlaskResponse,
  SupraPriceFeedResponse,
} from "../types";
import { getObjectFields } from "./object";
import { MAX_STAKING_WEEKS } from "../constants/detoken";

export function computeBorrowFeeRate(
  bucketInfo: BucketInfo | null | undefined,
): number {
  if (!bucketInfo) return 0.005;
  const interval =
    (new Date().valueOf() - bucketInfo.latestRedemptionTime) / (3600_000 * 12);
  const borrowFee = (bucketInfo.baseFeeRate / 1_000_000) * 0.5 ** interval;

  if (borrowFee < 0.005) return 0.005;
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
  return (
    (Number(bias.fields.bits) -
      (Number(slope.fields.bits) * (now - Number(timestamp))) / 10 ** 9) /
    10 ** 9
  );
};
