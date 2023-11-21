// Copyright Andrei <andreid.dev@gmail.com>

import { DevInspectResults, SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { normalizeSuiAddress, SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";
import { BCS, getSuiMoveConfig } from "@mysten/bcs"

import { MAINNET_PACKAGE_ID, TESTNET_PACKAGE_ID } from "./utils/constants";
import { BucketConstants, PaginatedBottleSummary, PackageType} from "./types";

const FAKE_ADDRESS = normalizeSuiAddress("0x0");

const packageAddress = {"mainnet" : MAINNET_PACKAGE_ID, "testnet": TESTNET_PACKAGE_ID};

export class BucketClient {
  /**
   * @description a TS wrapper over Bucket Protocol Move packages.
   * @param client connection to fullnode
   * @param currentAddress (optional) address of the current user (default: FAKE_ADDRESS)
   */
  private client: SuiClient;
  public packageType: PackageType;
  
  constructor(
    client: SuiClient,
    options?: {
        packageType?: PackageType;
    },
    public currentAddress: string = FAKE_ADDRESS,
  ) {

    this.client = client;
    this.packageType = options?.packageType ?? "mainnet";

  }

  public createTank(assetBuck: string, assetType: string): TransactionBlock {
    /**
     * @description Create a new pool tank
     * @param assetBuck base asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType quote asset , e.g "0x2::sui::SUI"
     * @returns TransactionBlock
     */

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageAddress[this.packageType]}::tank::new`,
      typeArguments: [assetBuck, assetType],
      arguments: [],
    });

    return tx;
  }

  async depositToTank(
    assetBuck: string,
    assetType: string,
    tankId: string,
    depositAmount: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Deposit BUCK into tank
     * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param tankId The tank object id to deposit to , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
     * @param depositAmount BUCK amount to deposit into tank
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageAddress[this.packageType]}::tank::deposit`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(depositAmount)],
    });

    return tx;
  }

  async absorbFromTank(
    assetBuck: string,
    assetType: string,
    tankId: string,
    collteralInput: string,
    debtAmount: number,
  ): Promise<TransactionBlock> {
    /**
     * @description Offset the specified debt against the BUCK contained in the Tank
     * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
     * @param collteralInput The collateral to add to the tank
     * @param debtAmount The amount of debt to offset
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageAddress[this.packageType]}::tank::absorb`,
      typeArguments: [assetBuck, assetType],
      arguments: [
        tx.object(tankId),
        tx.pure(collteralInput),
        tx.pure(debtAmount),
      ],
    });

    return tx;
  }

  async withdrawFromTank(
    assetBuck: string,
    assetType: string,
    tankId: string,
    contributorToken: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Withdraw BUCK and collateral gain from the Tank
     * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
     * @param contributorToken The contributor token
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageAddress[this.packageType]}::tank::withdraw`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(contributorToken)],
    });

    return tx;
  }

  async claimFromTank(
    assetBuck: string,
    assetType: string,
    tankId: string,
    contributorToken: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Claim collateral gain and BKT reward from the Tank
     * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
     * @param contributorToken The contributor token
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageAddress[this.packageType]}::tank::claim`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(contributorToken)],
    });

    return tx;
  }

  async claimBkt(
    assetBuck: string,
    assetType: string,
    tankId: string,
    contributorToken: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Claim BKT reward earned by a deposit since its last snapshots were taken
     * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
     * @param contributorToken The contributor token
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageAddress[this.packageType]}::tank::claim_bkt`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(contributorToken)],
    });

    return tx;
  }

  async borrow(
    assetType: string,
    protocol: string,
    oracle: string,
    collateralInput: string,
    bucketOutputAmount: number,
    insertionPlace: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Borrow
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param protocol Protocol id
     * @param oracle Oracle id
     * @param collateralInput collateral input
     * @param bucketOutputAmount
     * @param insertionPlace
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageAddress[this.packageType]}::buck::borrow`,
      typeArguments: [assetType],
      arguments: [
        tx.object(protocol),
        tx.object(oracle),
        tx.object(SUI_CLOCK_OBJECT_ID),
        tx.pure(collateralInput),
        tx.pure(bucketOutputAmount),
        tx.pure([insertionPlace]),
      ],
    });

    return tx;
  }

  async topUp(
    assetType: string,
    protocol: string,
    collateralInput: string,
    forAddress: string,
    insertionPlace: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Top up function
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param protocol Protocol id
     * @param collateralInput collateral input
     * @param forAddress
     * @param insertionPlace
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::buck::top_up`,
      typeArguments: [assetType],
      arguments: [
        tx.object(protocol),
        tx.pure(collateralInput),
        tx.pure(forAddress),
        tx.pure([insertionPlace]),
      ],
    });

    return tx;
  }

  async withdraw(
    assetType: string,
    protocol: string,
    oracle: string,
    collateralAmount: string,
    insertionPlace: string,
  ): Promise<TransactionBlock> {
    /**
     * @description withdraw
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param protocol Protocol id
     * @param oracle
     * @param collateralAmount
     * @param insertionPlace
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::buck::withdraw`,
      typeArguments: [assetType],
      arguments: [
        tx.object(protocol),
        tx.object(oracle),
        tx.pure(SUI_CLOCK_OBJECT_ID),
        tx.pure(collateralAmount),
        tx.pure([insertionPlace]),
      ],
    });

    return tx;
  }

  async repay(
    assetType: string,
    protocol: string,
    buckInput: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Repay borrowed amount
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param protocol Protocol id
     * @param buckInput Amount to be repaid
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::buck::repay`,
      typeArguments: [assetType],
      arguments: [tx.object(protocol), tx.pure(buckInput)],
    });

    return tx;
  }

  async reedem(
    assetType: string,
    protocol: string,
    oracle: string,
    buckInput: string,
    insertionPlace: string,
  ): Promise<TransactionBlock> {
    /**
     * @description reedem
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param protocol Protocol id
     * @param oracle
     * @param buckInput
     * @param insertionPlace
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::buck::redeem`,
      typeArguments: [assetType],
      arguments: [
        tx.object(protocol),
        tx.object(oracle),
        tx.pure(SUI_CLOCK_OBJECT_ID),
        tx.pure(buckInput),
        tx.pure([insertionPlace]),
      ],
    });

    return tx;
  }

  async stake(
    assetType: string,
    well: string,
    bktInput: string,
    lockTime: string,
  ): Promise<TransactionBlock> {
    /**
     * @description stake to well
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param well well object
     * @param bktInput Amount to stake
     * @param lockTime Locked time for staking
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::well::stake`,
      typeArguments: [assetType],
      arguments: [
        tx.object(well),
        tx.pure(bktInput),
        tx.pure(lockTime),
        tx.object(SUI_CLOCK_OBJECT_ID)
      ],
    });

    return tx;
  }


  async unstake(
    assetType: string,
    well: string,
    stakedBkt: string,
  ): Promise<TransactionBlock> {
    /**
     * @description unstake from well
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param well well object
     * @param stakedBkt Amount to stake
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::well::unstake`,
      typeArguments: [assetType],
      arguments: [
        tx.object(well),
        tx.pure(stakedBkt),
        tx.object(SUI_CLOCK_OBJECT_ID)
      ],
    });

    return tx;
  }

  async forceUnstake(
    assetType: string,
    well: string,
    bktTreasury: string,
    stakedBkt: string,
  ): Promise<TransactionBlock> {
    /**
     * @description forced unstake from well
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param well well object
     * @param stakedBkt Amount to stake
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::well::force_unstake`,
      typeArguments: [assetType],
      arguments: [
        tx.object(well),
        tx.object(bktTreasury),
        tx.pure(stakedBkt),
        tx.object(SUI_CLOCK_OBJECT_ID)
      ],
    });

    return tx;
  }


  async claimFromWell(
    assetType: string,
    well: string,
    stakedBkt: string,
  ): Promise<TransactionBlock> {
    /**
     * @description claim from well
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param well well object
     * @param stakedBkt Staked BKT
     * @returns Promise<TransactionBlock>
     */

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::well::claim`,
      typeArguments: [assetType],
      arguments: [
        tx.object(well),
        tx.pure(stakedBkt),
      ],
    });

    return tx;
  }

  async getAllBottles(): Promise<PaginatedBottleSummary> {
    /**
     * @description Get all bottles by querying `BottleCreated` event.
     * @returns Promise<PaginatedBottleSummary> - otherwise `null` if the upstream data source is pruned.
     */

    const resp = await this.client.queryEvents({
      query: {
        MoveEventType: `${packageAddress[this.packageType]}::bucket_events::BottleCreated`,
      },
    });
    const bottles = resp.data.map((event) => {
      const rawEvent = event.parsedJson as any;
      return {
        bottleId: rawEvent.bottle_id as string,
      };
    });

    return {
      data: bottles,
      nextCursor: resp.nextCursor,
      hasNextPage: resp.hasNextPage,
    };
  }

  async getDestroyedBottles(): Promise<PaginatedBottleSummary> {
    /**
     * @description Get all destroyed bottles by querying `BottleDestroyed` event.
     * @returns Promise<PaginatedBottleSummary> - otherwise `null` if the upstream data source is pruned.
     */

    const resp = await this.client.queryEvents({
      query: {
        MoveEventType: `${packageAddress[this.packageType]}::bucket_events::BottleDestroyed`,
      },
    });
    const destroyedBottles = resp.data.map((event) => {
      const rawEvent = event.parsedJson as any;
      return {
        bottleId: rawEvent.bottle_id as string,
      };
    });

    return {
      data: destroyedBottles,
      nextCursor: resp.nextCursor,
      hasNextPage: resp.hasNextPage,
    };
  }

  private async encodedBucketConstants() : Promise<DevInspectResults> {
    /**
     * @description Get encoded BCS Bucket values
     * @returns devInspectTransactionBlock
     */
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageAddress[this.packageType]}::constants::fee_precision`,
    });
    tx.moveCall({
      target: `${packageAddress[this.packageType]}::constants::liquidation_rebate`,
    });

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::constants::flash_loan_fee`,
    });

   tx.moveCall({
      target: `${packageAddress[this.packageType]}::constants::buck_decimal`,
    });

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::constants::max_lock_time`,
    });

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::constants::min_lock_time`,
    });

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::constants::min_fee`,
    });

    tx.moveCall({
      target: `${packageAddress[this.packageType]}::constants::max_fee`,
    });


    return await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.currentAddress,
    });
  }

  async getBucketConstants(): Promise<BucketConstants | undefined>{
      /**
     * @description Get bucket constants (decoded BCS values)
     * @returns Promise<DecodedBucketConstants | undefined>
     */

    const results: any = await this.encodedBucketConstants();

    if (!results) {
			return undefined;
		}

    const bcs = new BCS(getSuiMoveConfig());

    let bucketObject: any = {};
    bucketObject = {
      ...bucketObject,
      feePrecision: bcs.de("u64", Uint8Array.from(results.results![0].returnValues[0][0])),
      liquidationRebate: bcs.de("u64", Uint8Array.from(results.results![1].returnValues[0][0])),
      flashLoanFee: bcs.de("u64", Uint8Array.from(results.results![2].returnValues[0][0])),
      buckDecimal: bcs.de("u8", Uint8Array.from(results.results![3].returnValues[0][0])),
      maxLockTime: bcs.de("u64", Uint8Array.from(results.results![4].returnValues[0][0])),
      minLockTime: bcs.de("u64", Uint8Array.from(results.results![5].returnValues[0][0])),
      minFee: bcs.de("u64", Uint8Array.from(results.results![6].returnValues[0][0])),
      maxFee: bcs.de("u64", Uint8Array.from(results.results![7].returnValues[0][0])),
    }
    
    return bucketObject
    
  }

}
// Instantiate SuiClient connected to testnet
const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

// Instantiate BucketClient
const buck = new BucketClient(client, {
  packageType: "mainnet"
});

console.log(await packageAddress[buck.packageType])