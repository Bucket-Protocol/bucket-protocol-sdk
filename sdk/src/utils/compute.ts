import { BucketInfo } from '@/types';

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
