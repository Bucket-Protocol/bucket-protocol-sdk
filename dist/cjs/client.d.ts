import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { BucketConstants, PaginatedBottleSummary, PackageType, BucketList, BottleAmountsList } from "./types";
export declare class BucketClient {
    currentAddress: string;
    /**
     * @description a TS wrapper over Bucket Protocol Move packages.
     * @param client connection to fullnode
     * @param currentAddress (optional) address of the current user (default: DUMMY_ADDRESS)
     */
    private client;
    packageType: PackageType;
    constructor(client: SuiClient, options?: {
        packageType?: PackageType;
    }, currentAddress?: string);
    depositToTank(assetBuck: string, assetType: string, tankId: string, depositAmount: string): Promise<TransactionBlock>;
    absorbFromTank(assetBuck: string, assetType: string, tankId: string, collteralInput: string, debtAmount: number): Promise<TransactionBlock>;
    withdrawFromTank(assetBuck: string, assetType: string, tankId: string, contributorToken: string): Promise<TransactionBlock>;
    claimFromTank(assetBuck: string, assetType: string, tankId: string, contributorToken: string): Promise<TransactionBlock>;
    claimBkt(assetBuck: string, assetType: string, tankId: string, contributorToken: string): Promise<TransactionBlock>;
    borrow(assetType: string, protocol: string, oracle: string, collateralInput: string, bucketOutputAmount: number, insertionPlace: string): Promise<TransactionBlock>;
    topUp(assetType: string, protocol: string, collateralInput: string, forAddress: string, insertionPlace: string): Promise<TransactionBlock>;
    withdraw(assetType: string, protocol: string, oracle: string, collateralAmount: string, insertionPlace: string): Promise<TransactionBlock>;
    repay(assetType: string, protocol: string, buckInput: string): Promise<TransactionBlock>;
    redeem(assetType: string, protocol: string, oracle: string, buckInput: string, insertionPlace: string): Promise<TransactionBlock>;
    stake(assetType: string, well: string, bktInput: string, lockTime: string): Promise<TransactionBlock>;
    unstake(assetType: string, well: string, stakedBkt: string): Promise<TransactionBlock>;
    forceUnstake(assetType: string, well: string, bktTreasury: string, stakedBkt: string): Promise<TransactionBlock>;
    claimFromWell(assetType: string, well: string, stakedBkt: string): Promise<TransactionBlock>;
    getAllBottles(): Promise<PaginatedBottleSummary>;
    getDestroyedBottles(): Promise<PaginatedBottleSummary>;
    private encodedBucketConstants;
    getBucketConstants(): Promise<BucketConstants | undefined>;
    getAllBuckets(): Promise<BucketList>;
    getUserBottle(address: string): Promise<BottleAmountsList | null>;
}
//# sourceMappingURL=client.d.ts.map