import { BucketInfo, DeCenterResponse, DeTokenResponse } from '@/types';
import { MAX_STAKING_WEEKS } from '@/constants/detoken';

export function computeBorrowFeeRate(bucketInfo: BucketInfo | null | undefined): number {
  if (!bucketInfo) return 0.003;
  const interval = (new Date().valueOf() - bucketInfo.latestRedemptionTime) / (3600_000 * 12);
  const borrowFee = (bucketInfo.baseFeeRate / 1_000_000) * 0.5 ** interval;

  if (borrowFee < 0.003) return 0.003;
  else if (borrowFee > 0.05) return 0.05;
  else return borrowFee;
}

export function calculateRewardAmount(flowAmount: number, flowInterval: number) {
  return (flowAmount / 10 ** 9 / flowInterval) * 86400000;
}

export function calculateAPR(rewardAmount: number, totalAmount: number, CR: number, price: number) {
  if (totalAmount > 0) {
    return ((rewardAmount * 365 * price) / (totalAmount / 10 ** 9) / (CR / 100)) * 100;
  }

  return 0;
}

export const getEstimatedDeButAmount = (stakeAmount: number, unlockDate: number) => {
  const remainingTime = Math.max(unlockDate - Date.now(), 0);

  return stakeAmount * Math.min(remainingTime / (MAX_STAKING_WEEKS * 7 * 86400000), 1);
};

export const getDeButAmount = (deToken: DeCenterResponse | DeTokenResponse, now: number): number => {
  const { timestamp, bias, slope } = deToken.point.fields;
  if (now < Number(timestamp)) {
    return 0;
  }
  return Math.max(
    (Number(bias.fields.bits) - (Number(slope.fields.bits) * (now - Number(timestamp))) / 10 ** 9) / 10 ** 9,
    0,
  );
};
