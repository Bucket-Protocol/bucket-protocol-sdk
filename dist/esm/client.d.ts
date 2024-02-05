import { SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionBlock, TransactionResult } from "@mysten/sui.js/transactions";
import { BucketConstants, PaginatedBottleSummary, BottleInfo, UserTankList, ProtocolInfo, TankList, FountainList, UserLpProof, UserLpList, BucketList, TvlList } from "./types";
export declare class BucketClient {
    owner: string;
    /**
     * @description a TS wrapper over Bucket Protocol Move packages.
     * @param client connection to fullnode
     * @param owner (optional) address of the current user (default: DUMMY_ADDRESS)
     */
    private client;
    constructor(client: SuiClient, owner?: string);
    depositToTank(tx: TransactionBlock, assetBuck: string, assetType: string, tankId: string, depositAmount: string): TransactionResult;
    withdrawFromTank(tx: TransactionBlock, assetBuck: string, assetType: string, tankId: string, contributorToken: string): TransactionResult;
    claimFromTank(tx: TransactionBlock, assetBuck: string, assetType: string, tankId: string, contributorToken: string): TransactionResult;
    claimBkt(tx: TransactionBlock, assetBuck: string, assetType: string, tankId: string, contributorToken: string): TransactionResult;
    borrow(tx: TransactionBlock, collateralType: string, collateralInput: TransactionResult, bucketOutputAmount: number, insertionPlace?: string): TransactionResult;
    topUp(tx: TransactionBlock, collateralType: string, collateralInput: TransactionResult, forAddress: string, insertionPlace?: string): void;
    withdraw(tx: TransactionBlock, assetType: string, collateralAmount: string, insertionPlace?: string): TransactionResult;
    repay(tx: TransactionBlock, assetType: string, buckInput: TransactionResult): TransactionResult;
    redeem(tx: TransactionBlock, assetType: string, buckInput: TransactionResult, insertionPlace?: string): TransactionResult;
    stake(tx: TransactionBlock, assetType: string, well: string, bktInput: string, lockTime: string): TransactionResult;
    unstake(tx: TransactionBlock, assetType: string, well: string, stakedBkt: string): TransactionResult;
    forceUnstake(tx: TransactionBlock, assetType: string, well: string, bktTreasury: string, stakedBkt: string): TransactionResult;
    claimFromWell(tx: TransactionBlock, assetType: string, well: string, stakedBkt: string): TransactionResult;
    updateSupraOracle(tx: TransactionBlock, token: string): void;
    private encodedBucketConstants;
    getBucketConstants(): Promise<BucketConstants | undefined>;
    getProtocol(): Promise<ProtocolInfo>;
    getAllBottles(): Promise<PaginatedBottleSummary>;
    getDestroyedBottles(): Promise<PaginatedBottleSummary>;
    getAllBuckets(): Promise<BucketList>;
    getAllTanks(): Promise<TankList>;
    findInsertionPlace(bottleTableId: string, targetCR: number, tolerance: number): Promise<string>;
    getAllFountains(): Promise<FountainList>;
    getPsmTVL(): Promise<TvlList>;
    getUserBottles(address: string): Promise<BottleInfo[]>;
    getUserTanks(address: string): Promise<UserTankList>;
    getUserTankBUCK(tankType: string, tokens: SuiObjectResponse[]): Promise<number>;
    getUserTankEarn(tankType: string, tokens: SuiObjectResponse[]): Promise<number>;
    getUserLpProofs(owner: string): Promise<UserLpList>;
    getPrices(): Promise<{
        [key: string]: number;
    }>;
    getBorrowTx(collateralType: string, collateralAmount: number, borrowAmount: number, recipient: string, isNewBottle: boolean, isUpdateOracle: boolean, insertionPlace?: string): Promise<TransactionBlock>;
    getRepayTx(collateralType: string, repayAmount: number, withdrawAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getSurplusWithdrawTx(collateralType: string, walletAddress: string): Promise<TransactionBlock>;
    getPsmTx(psmCoin: string, psmAmount: number, psmSwith: boolean, walletAddress: string): Promise<TransactionBlock>;
    getRedeemTx(collateralType: string, redeemAmount: number, walletAddress: string, insertionPlace?: string): Promise<TransactionBlock>;
    getTankDepositTx(tankType: string, depositAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getTankWithdrawTx(tankType: string, withdrawAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getTankClaimTx(tankType: string, walletAddress: string): Promise<TransactionBlock>;
    getStakeUsdcTx(isAf: boolean, stakeAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getAfUnstakeTx(fountainId: string, lpProof: UserLpProof, recipient: string): Promise<TransactionBlock>;
    getKriyaUnstakeTx(fountainId: string, lpProof: UserLpProof): Promise<TransactionBlock>;
    getCetusUnstakeTx(fountainId: string, lpProof: UserLpProof, walletAddress: string): Promise<TransactionBlock>;
    getAfClaimTx(fountainId: string, lpProofs: UserLpProof[]): Promise<TransactionBlock>;
    getCetusClaimTx(fountainId: string, lpProofs: UserLpProof[], walletAddress: string): Promise<TransactionBlock>;
    getKriyaClaimTx(fountainId: string, lpProofs: UserLpProof[]): Promise<TransactionBlock>;
}
//# sourceMappingURL=client.d.ts.map