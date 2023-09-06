// Copyright Andrei <andreid.dev@gmail.com>

import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { normalizeSuiAddress } from "@mysten/sui.js/utils";

import { TESTNET_PACKAGE_ID } from "./utils/constants";

const DUMMY_ADDRESS = normalizeSuiAddress("0x0");

export class BucketClient {
  /**
   * @description a TS wrapper over Bucket Protocol Move packages.
   * @param client connection to fullnode
   * @param currentAddress (optional) address of the current user (default: DUMMY_ADDRESS)
   */

  constructor(
    public client: SuiClient = new SuiClient({
      url: getFullnodeUrl("testnet"),
    }),
    public currentAddress: string = DUMMY_ADDRESS,
  ) {}

  public createTank(assetBuck: string, assetType: string): TransactionBlock {
    /**
     * @description Create a new pool tank
     * @param assetBuck base asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType quote asset , e.g "0x2::sui::SUI"
     * @returns TransactionBlock
     */

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${TESTNET_PACKAGE_ID}::tank::new`,
      typeArguments: [assetBuck, assetType],
      arguments: [],
    });

    return tx;
  }

  public createBucket(
    assetType: string,
    minCollateralRatio: number,
    recoveryModeThreshold: number,
    collateralDecimal: number,
    maxMintAmount: number,
  ): TransactionBlock {
    /**
     * @description Create a new pool tank
     * @param assetType base asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param minCollateralRatio
     * @param recoveryModeThreshold
     * @param collateralDecimal
     * @param maxMintAmount
     * @returns TransactionBlock
     */

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${TESTNET_PACKAGE_ID}::bucket::new`,
      typeArguments: [assetType],
      arguments: [
        tx.pure(minCollateralRatio),
        tx.pure(recoveryModeThreshold),
        tx.pure(collateralDecimal),
        tx.pure([maxMintAmount]),
      ],
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
      target: `${TESTNET_PACKAGE_ID}::tank::deposit`,
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
      target: `${TESTNET_PACKAGE_ID}::tank::absorb`,
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
      target: `${TESTNET_PACKAGE_ID}::tank::withdraw`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(contributorToken)],
    });

    return tx;
  }

  async claimFromTank(assetBuck: string, assetType: string, tankId: string, contributorToken: string): Promise<TransactionBlock> {
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
        target: `${TESTNET_PACKAGE_ID}::tank::claim`,
        typeArguments: [assetBuck, assetType],
        arguments: [tx.object(tankId), tx.pure(contributorToken)],
      });
  
    return tx;

  }

  async claimBkt(assetBuck: string, assetType: string, tankId: string, contributorToken: string): Promise<TransactionBlock> {
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
      target: `${TESTNET_PACKAGE_ID}::tank::claim_bkt`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(contributorToken)],
    });
  
    return tx
  }


}
