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
    depositToTank(assetBuck: string, assetType: string, tankId: string, depositAmount: string): Promise<TransactionBlock>;
    absorbFromTank(assetBuck: string, assetType: string, tankId: string, collteralInput: string, debtAmount: number): Promise<TransactionBlock>;
    withdrawFromTank(assetBuck: string, assetType: string, tankId: string, contributorToken: string): Promise<TransactionBlock>;
    claimFromTank(assetBuck: string, assetType: string, tankId: string, contributorToken: string): Promise<TransactionBlock>;
    claimBkt(assetBuck: string, assetType: string, tankId: string, contributorToken: string): Promise<TransactionBlock>;
    borrow(assetType: string, protocol: string, collateralInput: TransactionResult, bucketOutputAmount: number, insertionPlace: string): Promise<TransactionBlock>;
    topUp(assetType: string, protocol: string, collateralInput: string, forAddress: string, insertionPlace: string): Promise<TransactionBlock>;
    withdraw(assetType: string, protocol: string, oracle: string, collateralAmount: string, insertionPlace: string): Promise<TransactionBlock>;
    repay(assetType: string, protocol: string, buckInput: string): Promise<TransactionBlock>;
    redeem(assetType: string, protocol: string, oracle: string, buckInput: string, insertionPlace: string): Promise<TransactionBlock>;
    stake(assetType: string, well: string, bktInput: string, lockTime: string): Promise<TransactionBlock>;
    unstake(assetType: string, well: string, stakedBkt: string): Promise<TransactionBlock>;
    forceUnstake(assetType: string, well: string, bktTreasury: string, stakedBkt: string): Promise<TransactionBlock>;
    claimFromWell(assetType: string, well: string, stakedBkt: string): Promise<TransactionBlock>;
    private encodedBucketConstants;
    getBucketConstants(): Promise<BucketConstants | undefined>;
    getProtocol(): Promise<ProtocolInfo>;
    getAllBottles(): Promise<PaginatedBottleSummary>;
    getDestroyedBottles(): Promise<PaginatedBottleSummary>;
    getAllBuckets(): Promise<BucketList>;
    getAllTanks(): Promise<TankList>;
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
    getAPYs(): Promise<Partial<{
        SUI: number;
        USDC: number;
        USDT: number;
        afSUI: number;
        haSUI: number;
        vSUI: number;
        AF_LP_USDC_BUCK: number;
        AF_LP_SUI_BUCK: number;
        WETH: number;
        BUCK: number;
        BKT: number;
        USDCbnb: number;
        USDCsol: number;
        USDCpol: number;
        USDCarb: number;
        BUCKETUS: number;
    }>>;
    getBorrowTx(tx: TransactionBlock, isNewBottle: boolean, collateralType: string, collateralAmount: number, borrowAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getRepayTx(tx: TransactionBlock, collateralType: string, repayAmount: number, withdrawAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getTankDepositTx(tx: TransactionBlock, tankType: string, depositAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getTankWithdrawTx(tx: TransactionBlock, tankType: string, withdrawAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getTankClaimTx(tx: TransactionBlock, tankType: string, walletAddress: string): Promise<TransactionBlock>;
    getStakeUsdcTx(tx: TransactionBlock, isAf: boolean, stakeAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getAfUnstakeTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof): Promise<TransactionBlock>;
    getKriyaUnstakeTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof): Promise<TransactionBlock>;
    getCetusUnstakeTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof, walletAddress: string): Promise<TransactionBlock>;
    getAfClaimTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof): Promise<TransactionBlock>;
    getCetusClaimTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof, walletAddress: string): Promise<TransactionBlock>;
    getKriyaClaimTx(tx: TransactionBlock, fountainId: string, lpProof: UserLpProof, walletAddress: string): Promise<TransactionBlock>;
    getPsmTx(tx: TransactionBlock, psmCoin: string, psmAmount: number, psmSwith: boolean, walletAddress: string): Promise<TransactionBlock>;
    getRedeemTx(tx: TransactionBlock, collateralType: string, redeemAmount: number, walletAddress: string): Promise<TransactionBlock>;
    getInputCoin(tx: TransactionBlock, owner: string, coinType: string, ...amounts: number[]): Promise<TransactionResult>;
}
//# sourceMappingURL=client.d.ts.map