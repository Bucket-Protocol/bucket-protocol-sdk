import { SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionBlock, TransactionResult } from "@mysten/sui.js/transactions";
import { BucketConstants, PaginatedBottleSummary, BottleInfo, UserTankList, ProtocolInfo, TankList, FountainList, UserLpProof, UserLpList, BucketList, TvlList, FountainInfo } from "./types";
export declare class BucketClient {
    network: string;
    owner: string;
    /**
     * @description a TS wrapper over Bucket Protocol Move packages.
     * @param network connection to fullnode: 'mainnet' | 'testnet' | 'devnet' | 'localnet' | string
     * @param owner (optional) address of the current user (default: DUMMY_ADDRESS)
     */
    private client;
    constructor(network?: string, owner?: string);
    depositToTank(tx: TransactionBlock, assetBuck: string, assetType: string, tankId: string, depositAmount: string): TransactionResult;
    withdrawFromTank(tx: TransactionBlock, assetBuck: string, assetType: string, tankId: string, contributorToken: string): TransactionResult;
    claimFromTank(tx: TransactionBlock, assetBuck: string, assetType: string, tankId: string, contributorToken: string): TransactionResult;
    claimBkt(tx: TransactionBlock, assetBuck: string, assetType: string, tankId: string, contributorToken: string): TransactionResult;
    borrow(tx: TransactionBlock, collateralType: string, collateralInput: TransactionResult, bucketOutputAmount: number, insertionPlace?: string, strapId?: string | "new"): TransactionResult;
    topUp(tx: TransactionBlock, collateralType: string, collateralInput: TransactionResult, forAddress: string, insertionPlace?: string): void;
    withdraw(tx: TransactionBlock, assetType: string, collateralAmount: string, insertionPlace?: string, strapId?: string): TransactionResult;
    repay(tx: TransactionBlock, assetType: string, buckInput: TransactionResult, strapId?: string): TransactionResult;
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
    getFountain(lpRegistryId: string): Promise<FountainInfo>;
    getPsmTVL(): Promise<TvlList>;
    getUserBottles(address: string): Promise<BottleInfo[]>;
    getUserTanks(address: string): Promise<UserTankList>;
    getUserTankBUCK(tankType: string, tokens: SuiObjectResponse[]): Promise<number>;
    getUserTankEarn(tankType: string, tokens: SuiObjectResponse[]): Promise<number>;
    getUserLpProofs(owner: string): Promise<UserLpList>;
    getPrices(): Promise<{
        [key: string]: number;
    }>;
    getBorrowTx(tx: TransactionBlock, collateralType: string, collateralAmount: number, borrowAmount: number, recipient: string, isNewBottle: boolean, isUpdateOracle: boolean, insertionPlace?: string, strapId?: string): Promise<TransactionBlock>;
    getRepayTx(tx: TransactionBlock, collateralType: string, repayAmount: number, withdrawAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getSurplusWithdrawTx(tx: TransactionBlock, collateralType: string, walletAddress: string): Promise<TransactionBlock>;
    getPsmTx(tx: TransactionBlock, psmCoin: string, psmAmount: number, psmSwith: boolean, walletAddress: string): Promise<TransactionBlock>;
    getRedeemTx(tx: TransactionBlock, collateralType: string, redeemAmount: number, walletAddress: string, insertionPlace?: string): Promise<TransactionBlock>;
    getTankDepositTx(tx: TransactionBlock, tankType: string, depositAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getTankWithdrawTx(tx: TransactionBlock, tankType: string, withdrawAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getTankClaimTx(tx: TransactionBlock, tankType: string, walletAddress: string): Promise<TransactionBlock>;
    getStakeUsdcTx(tx: TransactionBlock, isAf: boolean, stakeAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getAfUnstakeTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof, recipient: string): Promise<TransactionBlock>;
    getKriyaUnstakeTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof): Promise<TransactionBlock>;
    getCetusUnstakeTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof, walletAddress: string): Promise<TransactionBlock>;
    getAfClaimTx(tx: TransactionBlock, fountainId: string, lpProofs: UserLpProof[]): Promise<TransactionBlock>;
    getCetusClaimTx(tx: TransactionBlock, fountainId: string, lpProofs: UserLpProof[], walletAddress: string): Promise<TransactionBlock>;
    getKriyaClaimTx(tx: TransactionBlock, fountainId: string, lpProofs: UserLpProof[]): Promise<TransactionBlock>;
}
//# sourceMappingURL=client.d.ts.map