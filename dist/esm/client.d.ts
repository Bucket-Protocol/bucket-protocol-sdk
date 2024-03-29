import { SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionArgument, TransactionBlock, TransactionResult } from "@mysten/sui.js/transactions";
import { BucketConstants, PaginatedBottleSummary, UserTankList, ProtocolInfo, TankList, FountainList, UserLpProof, UserLpList, BucketList, TvlList, FountainInfo, UserBottleInfo, StrapFountainInfo, StrapFountainList } from "./types";
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
    borrow(tx: TransactionBlock, collateralType: string, collateralInput: TransactionResult, buckOutput: number | TransactionArgument, insertionPlace?: string, strapId?: string | TransactionArgument): TransactionResult;
    topUp(tx: TransactionBlock, collateralType: string, collateralInput: TransactionResult, forAddress: string, insertionPlace?: string): void;
    withdraw(tx: TransactionBlock, assetType: string, collateralAmount: string, insertionPlace?: string, strapId?: string | TransactionArgument): TransactionResult;
    repay(tx: TransactionBlock, assetType: string, buckInput: TransactionResult, strapId?: string | TransactionArgument): TransactionResult;
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
    getAllStrapFountains(): Promise<StrapFountainList>;
    getStakeProofFountain(fountainId: string): Promise<StrapFountainInfo>;
    getUserBottles(address: string): Promise<UserBottleInfo[]>;
    getUserTanks(address: string): Promise<UserTankList>;
    getUserTankBUCK(tankType: string, tokens: SuiObjectResponse[]): Promise<number>;
    getUserTankEarn(tankType: string, tokens: SuiObjectResponse[]): Promise<number>;
    getUserLpProofs(owner: string): Promise<UserLpList>;
    getPrices(): Promise<{
        [key: string]: number;
    }>;
    getBorrowTx(tx: TransactionBlock, collateralType: string, collateralAmount: number, borrowAmount: number, recipient: string, isUpdateOracle: boolean, insertionPlace?: string, strapId?: string): Promise<boolean>;
    getRepayTx(tx: TransactionBlock, collateralType: string, repayAmount: number, withdrawAmount: number, walletAddress: string, insertionPlace?: string, strapId?: string): Promise<boolean>;
    getSurplusWithdrawTx(tx: TransactionBlock, collateralType: string, walletAddress: string, strapId?: string): Promise<TransactionBlock>;
    getPsmTx(tx: TransactionBlock, psmCoin: string, psmAmount: number, psmSwith: boolean, walletAddress: string): Promise<boolean>;
    getRedeemTx(tx: TransactionBlock, collateralType: string, redeemAmount: number, walletAddress: string, insertionPlace?: string): Promise<boolean>;
    getTankDepositTx(tx: TransactionBlock, tankType: string, depositAmount: number, walletAddress: string): Promise<boolean>;
    getTankWithdrawTx(tx: TransactionBlock, tankType: string, withdrawAmount: number, walletAddress: string): Promise<boolean>;
    getTankClaimTx(tx: TransactionBlock, tankType: string, walletAddress: string): Promise<boolean>;
    getStakeUsdcTx(tx: TransactionBlock, isAf: boolean, stakeAmount: number, walletAddress: string): Promise<boolean>;
    getAfUnstakeTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof, recipient: string): Promise<boolean>;
    getKriyaUnstakeTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof): Promise<boolean>;
    getCetusUnstakeTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof, walletAddress: string): Promise<boolean>;
    getAfClaimTx(tx: TransactionBlock, fountainId: string, lpProofs: UserLpProof[]): Promise<boolean>;
    getCetusClaimTx(tx: TransactionBlock, fountainId: string, lpProofs: UserLpProof[], walletAddress: string): Promise<boolean>;
    getKriyaClaimTx(tx: TransactionBlock, fountainId: string, lpProofs: UserLpProof[]): Promise<boolean>;
    getStrapStakeTx(tx: TransactionBlock, collateralType: string, strapId: string | TransactionArgument, address: string): boolean;
    getStrapUnstakeTx(tx: TransactionBlock, collateralType: string, strapId: string | TransactionArgument, address: string): boolean;
    getStrapClaimTx(tx: TransactionBlock, collateralType: string, strapId: string | TransactionArgument, address: string): boolean;
    getDestroyPositionTx(tx: TransactionBlock, collateralType: string, strapId: string | TransactionArgument): boolean;
}
//# sourceMappingURL=client.d.ts.map