import { EventId } from "@mysten/sui.js/src/client";

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