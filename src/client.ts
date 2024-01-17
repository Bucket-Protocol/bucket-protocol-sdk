// Copyright Andrei <andreid.dev@gmail.com>

import { DevInspectResults, SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionBlock, TransactionResult } from "@mysten/sui.js/transactions";
import { normalizeSuiAddress, SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";
import { BCS, getSuiMoveConfig } from "@mysten/bcs"
import { getObjectFields } from "./objects/objectTypes";

import { MAINNET_PACKAGE_ID, TESTNET_PACKAGE_ID, COINS_TYPE_LIST, MAINNET_PROTOCOL_ID, TESTNET_PROTOCOL_ID, SUPRA_PRICE_FEEDS, ACCEPT_ASSETS, HASUI_APY_URL, AFSUI_APY_URL, SUPRA_UPDATE_TARGET, SUPRA_HANDLER_OBJECT, SUPRA_ID, ORACLE_OBJECT_ID, TESTNET_BUCKET_OPERATIONS_PACKAGE_ID, MAINNET_BUCKET_OPERATIONS_PACKAGE_ID } from "./constants";
import { BucketConstants, PaginatedBottleSummary, PackageType, BucketResponse, BottleInfoResponse, BucketProtocolResponse, SupraPriceFeed, BucketInfo, TankInfoReponse, TankInfo, BottleInfo } from "./types";
import { getObjectNames } from "./utils";

const DUMMY_ADDRESS = normalizeSuiAddress("0x0");

const packageAddress = { "mainnet": MAINNET_PACKAGE_ID, "testnet": TESTNET_PACKAGE_ID };
const protocolAddress = { "mainnet": MAINNET_PROTOCOL_ID, "testnet": TESTNET_PROTOCOL_ID };
const bucketOpAddress = { "mainnet": MAINNET_BUCKET_OPERATIONS_PACKAGE_ID, "testnet": TESTNET_BUCKET_OPERATIONS_PACKAGE_ID };

export class BucketClient {
  /**
   * @description a TS wrapper over Bucket Protocol Move packages.
   * @param client connection to fullnode
   * @param currentAddress (optional) address of the current user (default: DUMMY_ADDRESS)
   */
  private client: SuiClient;
  public packageType: PackageType;

  constructor(
    client: SuiClient,
    options?: {
      packageType?: PackageType;
    },
    public currentAddress: string = DUMMY_ADDRESS,
  ) {

    this.client = client;
    this.packageType = options?.packageType ?? "mainnet";
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
    collateralInput: TransactionResult,
    bucketOutputAmount: number,
    insertionPlace: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Borrow
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param protocol Protocol id
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
        tx.object(ORACLE_OBJECT_ID),
        tx.object(SUI_CLOCK_OBJECT_ID),
        collateralInput,
        tx.pure(bucketOutputAmount, "u64"),
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

  async redeem(
    assetType: string,
    protocol: string,
    oracle: string,
    buckInput: string,
    insertionPlace: string,
  ): Promise<TransactionBlock> {
    /**
     * @description redeem
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

  private async encodedBucketConstants(): Promise<DevInspectResults> {
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

  async getBucketConstants(): Promise<BucketConstants | undefined> {
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

  async getAllBuckets(): Promise<BucketInfo[]> {
    /**
   * @description Get all buckets
   */
    let buckets: BucketInfo[] = [];

    try {
      const generalInfo = await this.client.getObject({
        id: protocolAddress[this.packageType],
        options: {
          showContent: true,
        }
      });
      const generalInfoField = generalInfo.data?.content as BucketProtocolResponse;
      const minBottleSize = generalInfoField.fields.min_bottle_size;

      const protocolFields = await this.client.getDynamicFields({
        parentId: protocolAddress[this.packageType],
      });

      const bucketList = protocolFields.data.filter((item) =>
        item.objectType.includes("Bucket")
      );
      const objectIdList = bucketList.map((item) => item.objectId);

      const response: SuiObjectResponse[] = await this.client.multiGetObjects({
        ids: objectIdList,
        options: {
          showContent: true,
          showType: true, //Check could we get type from response later
        },
      });

      response.map((res, index) => {
        const typeId = res.data?.type?.split("<").pop()?.replace(">", "") ?? "";
        const token = Object.keys(COINS_TYPE_LIST).find(key => COINS_TYPE_LIST[key] === typeId);
        if (!token) {
          return;
        }

        const fields = getObjectFields(res) as BucketResponse;

        const bucketInfo: BucketInfo = {
          token: token as ACCEPT_ASSETS,
          baseFeeRate: Number(fields.base_fee_rate ?? 5_000),
          bottleTableSize: fields.bottle_table.fields.table.fields.size ?? "",
          collateralDecimal: fields.collateral_decimal ?? 0,
          collateralVault: fields.collateral_vault ?? "",
          latestRedemptionTime: Number(fields.latest_redemption_time ?? 0),
          minCollateralRatio: fields.min_collateral_ratio ?? "",
          mintedBuckAmount: fields.minted_buck_amount ?? "",
          minBottleSize: minBottleSize,
          maxMintAmount: fields.max_mint_amount ?? "",
          recoveryModeThreshold: fields.recovery_mode_threshold ?? "",
        };

        buckets.push(bucketInfo);
      });
    } catch (error) {
      console.log(error);
    }

    return buckets;
  };

  async getUserBottles(address: string): Promise<BottleInfo[]> {
    /**
     * @description Get bucket constants (decoded BCS values)
     * @address User address that belong to bottle
     * @returns Promise<BottleInfo>
     */
    if (!address) return [];

    try {
      const protocolFields = await this.client.getDynamicFields({
        parentId: protocolAddress[this.packageType]
      });

      const bucketList = protocolFields.data.filter((item) =>
        item.objectType.includes("Bucket")
      );

      const objectTypeList = bucketList.map((item) => item.objectType);
      const objectIdList = bucketList.map((item) => item.objectId);
      const objectNameList = getObjectNames(objectTypeList);

      const response: SuiObjectResponse[] = await this.client.multiGetObjects({
        ids: objectIdList,
        options: {
          showContent: true,
          showType: true, //Check could we get type from response later
        },
      });

      const bottleIdList: {
        name: string;
        id: string;
      }[] = [];

      response.map((res, index) => {
        //Filter out WBTC and WETH
        //When we launch WBTC and WETH, we need to remove this exception
        if (objectNameList[index] === "WBTC" || objectNameList[index] === "WETH")
          return;

        const bucketFields = getObjectFields(res) as BucketResponse;

        bottleIdList.push({
          name: objectNameList[index] ?? "",
          id: bucketFields.bottle_table.fields.table.fields.id.id,
        });
      });

      const userBottles: BottleInfo[] = [];

      for (const bottle of bottleIdList) {
        await this.client
          .getDynamicFieldObject({
            parentId: bottle.id ?? "",
            name: {
              type: "address",
              value: address,
            },
          })
          .then((bottleInfo) => {
            const bottleInfoFields = getObjectFields(
              bottleInfo
            ) as BottleInfoResponse;

            if (bottleInfoFields) {
              userBottles.push({
                token: bottle.name ?? "",
                collateralAmount:
                  bottleInfoFields.value.fields.value.fields.collateral_amount,
                buckAmount:
                  bottleInfoFields.value.fields.value.fields.buck_amount,
              });
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      }

      return userBottles;
    } catch (error) {
      return [];
    }
  };

  async getAllTanks(): Promise<TankInfo[]> {
    /**
   * @description Get all tanks objects
   */
    try {
      const protocolFields = await this.client.getDynamicFields({
        parentId: protocolAddress[this.packageType]
      });

      const tankList = protocolFields.data.filter((item) =>
        item.objectType.includes("Tank")
      );

      const objectIdList = tankList.map((item) => item.objectId);

      const response: SuiObjectResponse[] = await this.client.multiGetObjects({
        ids: objectIdList,
        options: {
          showContent: true,
          showType: true, //Check could we get type from response later
        },
      });
      const tankInfoList: TankInfo[] = [];

      response.forEach((res, index) => {
        const fields = getObjectFields(res) as TankInfoReponse;

        let token = "";
        const objectType = res.data?.type;
        if (objectType) {
          const assetType = objectType.split(",")[1].trim().split(">")[0].trim();
          token = Object.keys(COINS_TYPE_LIST).find(symbol => COINS_TYPE_LIST[symbol] == assetType) ?? "";
        }

        const tankInfo: TankInfo = {
          token,
          buckReserve: fields?.reserve || "0",
          collateralPool: fields?.collateral_pool || "0",
          currentS: fields?.current_s || "0",
          currentP: fields?.current_p || "1",
        };

        tankInfoList.push(tankInfo);
      });

      return tankInfoList;
    } catch (error) {
      return [];
    }
  };


  async getPrices() {
    /**
     * @description Get all prices
    */
    const ids = Object.values(SUPRA_PRICE_FEEDS);
    const objectNameList = Object.keys(SUPRA_PRICE_FEEDS);
    const priceObjects: SuiObjectResponse[] = await this.client.multiGetObjects({
      ids,
      options: {
        showContent: true,
        showType: true, //Check could we get type from response later
      },
    });

    const prices: { [key: string]: number } = {
      WETH: 0,
      SUI: 0,
      vSUI: 0,
      afSUI: 0,
      haSUI: 0,
      USDC: 1,
      USDT: 1,
      BUCK: 1,
    };

    priceObjects.map((res, index) => {
      const priceFeed = getObjectFields(res) as SupraPriceFeed;
      const priceBn = priceFeed.value.fields.value;
      const decimals = priceFeed.value.fields.decimal;
      const price = parseInt(priceBn) / Math.pow(10, decimals);

      if (objectNameList[index] == 'usdc_usd') {
        prices['USDC'] = price;
      }
      else if (objectNameList[index] == 'usdt_usd') {
        prices['USDT'] = price;
      }
      else if (objectNameList[index] == 'eth_usdt') {
        prices['WETH'] = prices['USDT'] * price;
      }
      else if (objectNameList[index] == 'sui_usdt') {
        prices['SUI'] = prices['USDT'] * price;
      }
      else if (objectNameList[index] == 'vsui_sui') {
        prices['vSUI'] = prices['SUI'] * price;
      }
      else if (objectNameList[index] == 'hasui_sui') {
        prices['haSUI'] = prices['SUI'] * price;
      }
      else if (objectNameList[index] == 'afsui_sui') {
        prices['afSUI'] = prices['SUI'] * price;
      }
    });

    return prices;
  }

  async getAPYs() {
    /**
     * @description Get APYs for vSUI, afSUI, haSUI
    */

    let apys: Partial<{ [key in ACCEPT_ASSETS]: number }> = {
      vSUI: 4.2 // Use constant value
    };

    // Get haSUI APY
    try {
      const response = await (await fetch(HASUI_APY_URL)).json();
      apys["haSUI"] = response.data.apy;
    } catch (error) {
      // console.log(error);
    }

    // Get afSUI APY
    try {
      const apy = await (await fetch(AFSUI_APY_URL)).text();
      apys["afSUI"] = parseFloat(apy) * 100;
    } catch (error) {
      // console.log(error);
    }

    return apys;
  }

  async getBorrowTx(
    isNewBottle: boolean,
    collateralType: string,
    collateralAmount: number,
    borrowAmount: number,
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Borrow
     * @param isNewBottle
     * @param collateralType Asset , e.g "0x2::sui::SUI"
     * @param collateralAmount
     * @param borrowAmount
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const { data: coins } = await this.client.getCoins({
      owner: walletAddress,
      coinType: collateralType,
    });

    const protocolId = protocolAddress[this.packageType];
    const packageId = bucketOpAddress[this.packageType];

    let coinSymbol = Object.keys(COINS_TYPE_LIST).filter(symbol => COINS_TYPE_LIST[symbol] == collateralType)[0];

    let collateralCoinInput: TransactionResult | undefined = undefined;
    if (collateralType === COINS_TYPE_LIST.SUI) {
      collateralCoinInput = tx.splitCoins(tx.gas, [
        tx.pure(collateralAmount, "u64"),
      ]);
    } else {
      const [mainCoin, ...otherCoins] = coins
        .filter((coin) => coin.coinType === collateralType)
        .map((coin) =>
          tx.objectRef({
            objectId: coin.coinObjectId,
            digest: coin.digest,
            version: coin.version,
          })
        );

      if (mainCoin) {
        if (otherCoins.length > 0) {
          tx.mergeCoins(mainCoin, otherCoins);
          collateralCoinInput = tx.splitCoins(mainCoin, [
            tx.pure(collateralAmount, "u64"),
          ]);
        } else {
          collateralCoinInput = tx.splitCoins(mainCoin, [
            tx.pure(collateralAmount, "u64"),
          ]);
        }
      }
    }
    if (!collateralCoinInput) return tx;

    if (borrowAmount == 0) {
      tx.moveCall({
        target: `${packageId}::bucket_operations::top_up`,
        typeArguments: [collateralType],
        arguments: [
          tx.object(protocolId),
          collateralCoinInput,
          tx.pure(walletAddress, "address"),
          isNewBottle ?
            tx.pure([]) :
            tx.pure([walletAddress]),
        ],
      });
    } else {
      tx.moveCall({
        target: SUPRA_UPDATE_TARGET,
        typeArguments: [collateralType],
        arguments: [
          tx.object(ORACLE_OBJECT_ID),
          tx.object(SUI_CLOCK_OBJECT_ID),
          tx.object(SUPRA_HANDLER_OBJECT),
          tx.pure(SUPRA_ID[coinSymbol] ?? "", "u32"),
        ],
      });

      tx.moveCall({
        target: `${packageId}::bucket_operations::borrow`,
        typeArguments: [collateralType],
        arguments: [
          tx.object(protocolId),
          tx.object(ORACLE_OBJECT_ID),
          tx.object(SUI_CLOCK_OBJECT_ID),
          collateralCoinInput,
          tx.pure(borrowAmount, "u64"),
          isNewBottle ?
            tx.pure([]) :
            tx.pure([walletAddress]),
        ],
      });
    };

    return tx;
  }

  async getRepayTx(
    collateralType: string,
    repayAmount: number,
    withdrawAmount: number,
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Repay
     * @param collateralType Asset , e.g "0x2::sui::SUI"
     * @param repayAmount
     * @param withdrawAmount
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const { data: coins } = await this.client.getCoins({
      owner: walletAddress,
      coinType: COINS_TYPE_LIST.BUCK,
    });

    const protocolId = protocolAddress[this.packageType];
    const packageId = bucketOpAddress[this.packageType];

    let buckCoinInput: TransactionResult | undefined = undefined;
    const [mainCoin, ...otherCoins] = coins
      .filter((coin) => coin.coinType === COINS_TYPE_LIST.BUCK)
      .map((coin) =>
        tx.objectRef({
          objectId: coin.coinObjectId,
          digest: coin.digest,
          version: coin.version,
        })
      );
    if (mainCoin) {
      if (otherCoins.length !== 0) tx.mergeCoins(mainCoin, otherCoins);
      buckCoinInput = tx.splitCoins(mainCoin, [
        tx.pure(repayAmount, "u64"),
      ]);
    }
    if (!buckCoinInput) return tx;

    let coinSymbol = Object.keys(COINS_TYPE_LIST).filter(symbol => COINS_TYPE_LIST[symbol] == collateralType)[0];
    tx.moveCall({
      target: SUPRA_UPDATE_TARGET,
      typeArguments: [collateralType],
      arguments: [
        tx.object(ORACLE_OBJECT_ID),
        tx.object(SUI_CLOCK_OBJECT_ID),
        tx.object(SUPRA_HANDLER_OBJECT),
        tx.pure(SUPRA_ID[coinSymbol] ?? "", "u32"),
      ],
    });

    tx.moveCall({
      target: `${packageId}::bucket_operations::repay_and_withdraw`,
      typeArguments: [collateralType],
      arguments: [
        tx.object(protocolId),
        tx.object(ORACLE_OBJECT_ID),
        tx.object(SUI_CLOCK_OBJECT_ID),
        buckCoinInput,
        tx.pure(withdrawAmount, "u64"),
        tx.pure([walletAddress]),
      ],
    });

    return tx;
  }

}
