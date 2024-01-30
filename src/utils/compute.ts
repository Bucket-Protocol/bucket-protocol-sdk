import { BucketInfo } from "src/types";

export function computeBorrowFeeRate(
    bucketInfo: BucketInfo | null | undefined
): number {
    if (!bucketInfo) return 0.005;
    const interval =
        (new Date().valueOf() - bucketInfo.latestRedemptionTime) / (3600_000 * 12);
    const borrowFee = (bucketInfo.baseFeeRate / 1_000_000) * 0.5 ** interval;

    if (borrowFee < 0.005) return 0.005;
    else if (borrowFee > 0.05) return 0.05;
    else return borrowFee;
}