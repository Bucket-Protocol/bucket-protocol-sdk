// Copyright Andrei <andreid.dev@gmail.com>

import { DevInspectResults, SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionBlock, TransactionResult } from "@mysten/sui.js/transactions";
import { normalizeSuiAddress, SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";
import { BCS, getSuiMoveConfig } from "@mysten/bcs"
import { getObjectFields } from "./objects/objectTypes";

import { MAINNET_PACKAGE_ID, TESTNET_PACKAGE_ID, COINS_TYPE_LIST, MAINNET_PROTOCOL_ID, TESTNET_PROTOCOL_ID, SUPRA_PRICE_FEEDS, ACCEPT_ASSETS, HASUI_APY_URL, AFSUI_APY_URL, SUPRA_UPDATE_TARGET, SUPRA_HANDLER_OBJECT, SUPRA_ID, ORACLE_OBJECT_ID, TESTNET_BUCKET_OPERATIONS_PACKAGE_ID, MAINNET_BUCKET_OPERATIONS_PACKAGE_ID, MAINNET_CONTRIBUTOR_TOKEN_ID, TESTNET_CONTRIBUTOR_TOKEN_ID, MAINNET_CORE_PACKAGE_ID, TESTNET_CORE_PACKAGE_ID, COIN_DECIMALS, COIN, TREASURY_OBJECT_ID, FOUNTAIN_PERIHERY_PACKAGE_ID, AF_OBJS, AF_USDC_BUCK_LP_REGISTRY_ID, BUCKETUS_TREASURY, BUCKETUS_LP_VAULT, CETUS_OBJS, CETUS_USDC_BUCK_LP_REGISTRY_ID } from "./constants";
import { BucketConstants, PaginatedBottleSummary, PackageType, BucketResponse, BottleInfoResponse, BucketProtocolResponse, SupraPriceFeed, BucketInfo, TankInfoReponse, TankInfo, BottleInfo, ContributorToken, UserTankInfo, UserTankList, ProtocolInfo, TankList } from "./types";
import { U64FromBytes, formatUnits, getCoinSymbol, getObjectNames, parseBigInt } from "./utils";

const DUMMY_ADDRESS = normalizeSuiAddress("0x0");

const packageAddress = { "mainnet": MAINNET_PACKAGE_ID, "testnet": TESTNET_PACKAGE_ID };
const protocolAddress = { "mainnet": MAINNET_PROTOCOL_ID, "testnet": TESTNET_PROTOCOL_ID };
const bucketOpAddress = { "mainnet": MAINNET_BUCKET_OPERATIONS_PACKAGE_ID, "testnet": TESTNET_BUCKET_OPERATIONS_PACKAGE_ID };
const contributorId = { "mainnet": MAINNET_CONTRIBUTOR_TOKEN_ID, "testnet": TESTNET_CONTRIBUTOR_TOKEN_ID };
const corePackageId = { "mainnet": MAINNET_CORE_PACKAGE_ID, "testnet": TESTNET_CORE_PACKAGE_ID };

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

  async getProtocol(): Promise<ProtocolInfo> {
    /**
     * @description Get protocol information including BUCK supply.
     * @returns Promise<ProtocolInfo>
     */
    const PROTOCOL_ID = protocolAddress[this.packageType];

    const resp = (await this.client.getObject({
      id: PROTOCOL_ID,
      options: {
        showContent: true,
      },
    })) as any;

    const buckSupply = Number(
      resp.data?.content.fields.buck_treasury_cap.fields.total_supply.fields
        .value
    ) / 10 ** 9;

    return {
      buckSupply
    };
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
        const token = getCoinSymbol(typeId);
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

  async getAllTanks(): Promise<TankList> {
    /**
   * @description Get all tanks objects
   */

    const tankInfoList: TankList = {};

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

      response.forEach((res, index) => {
        const fields = getObjectFields(res) as TankInfoReponse;

        let token = "";
        const objectType = res.data?.type;
        if (objectType) {
          const assetType = objectType.split(",")[1].trim().split(">")[0].trim();
          token = getCoinSymbol(assetType) ?? "";
        }

        const tankInfo: TankInfo = {
          buckReserve: fields?.reserve || "0",
          collateralPool: fields?.collateral_pool || "0",
          currentS: fields?.current_s || "0",
          currentP: fields?.current_p || "1",
        };

        tankInfoList[token] = tankInfo;
      });

    } catch (error) {
    }

    return tankInfoList;
  };

  async getUserBottles(address: string): Promise<BottleInfo[]> {
    /**
     * @description Get positions array for input address
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

  async getUserTanks(address: string): Promise<UserTankList> {
    /**
     * @description Get tanks array for input address
     * @address User address that belong to bottle
     * @returns Promise<TankInfo>
     */
    if (!address) return {};

    const CONTRIBUTOR_TOKEN_ID = contributorId[this.packageType];

    let userTanks: UserTankList = {};

    try {
      // Get all tank objects
      const protocolFields = await this.client.getDynamicFields({
        parentId: protocolAddress[this.packageType]
      });

      const tankList = protocolFields.data.filter((item) =>
        item.objectType.includes("Tank")
      );

      // Split coin type from result
      const tankTypes = tankList.map(tank => {
        const tankType = tank.objectType;
        const splitTypeString = tankType.split("<").pop();
        if (!splitTypeString) return;

        const coinType = splitTypeString.replace(">", "").split(",").pop();
        if (!coinType) return;

        return coinType.trim();
      });

      // Build contributor token filter
      const filters = tankTypes.map(tankType => {
        return {
          StructType: `${CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`
        }
      });

      // Get contributor token accounts for user address
      const { data: contributorTokens } = await this.client.getOwnedObjects({
        owner: address,
        filter: {
          MatchAny: filters
        },
        options: {
          showContent: true,
        }
      });

      for (const tankType of tankTypes) {

        if (!tankType) {
          continue;
        }

        const token = getCoinSymbol(tankType);
        if (!token) {
          continue;
        }

        // Filter contributor tokens by selected tank
        const tokens = contributorTokens.filter(x => {
          if (x.data?.content?.dataType == 'moveObject') {
            const typeId = x.data.content.type;
            return typeId.endsWith(tankType + ">");
          }

          return false;
        })

        const totalBUCK = await this.getUserTankBUCK(tankType, tokens);
        const totalEarned = await this.getUserTankEarn(tankType, tokens);
        userTanks[token] = {
          totalBUCK,
          totalEarned,
        };
      }
    } catch (error) {
    }

    return userTanks;
  };

  async getUserTankBUCK(tankType: string, tokens: SuiObjectResponse[]) {
    if (tokens.length == 0) {
      return 0;
    }

    const tx = new TransactionBlock();

    const CORE_PACKAGE_ID = corePackageId[this.packageType];
    const PROTOCOL_ID = protocolAddress[this.packageType];

    const tank = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::borrow_tank` as `${string}::${string}::${string}`,
      typeArguments: [tankType],
      arguments: [tx.object(PROTOCOL_ID)],
    });

    const target =
      `${CORE_PACKAGE_ID}::tank::get_token_weight` as `${string}::${string}::${string}`;
    for (const token of tokens) {
      if (!token.data) {
        continue;
      }

      tx.moveCall({
        target: target,
        typeArguments: [COINS_TYPE_LIST.BUCK, tankType],
        arguments: [tank, tx.objectRef({
          objectId: token.data.objectId,
          digest: token.data.digest,
          version: token.data.version,
        })],
      });
    }

    const res = await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: PROTOCOL_ID,
    });

    const resultArray = res?.results?.slice(1);

    if (resultArray?.length === 0) return 0;

    const bytesArray = resultArray?.map((result) => {
      if (result?.returnValues === undefined) return [0];
      if (result?.returnValues[0] === undefined) return [0];
      return result?.returnValues[0][0];
    });

    if (!bytesArray) return 0;

    let total = 0;
    bytesArray.forEach((bytes) => {
      const u64 = U64FromBytes(bytes);
      total += Number(formatUnits(u64, 9)); //BUCK decimals
    });

    return total;
  }

  async getUserTankEarn(tankType: string, tokens: SuiObjectResponse[]) {
    if (tokens.length == 0) {
      return 0;
    }

    const token = getCoinSymbol(tankType);
    if (!token) {
      return 0;
    }

    const tx = new TransactionBlock();

    const CORE_PACKAGE_ID = corePackageId[this.packageType];
    const PROTOCOL_ID = protocolAddress[this.packageType];

    const tank = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::borrow_tank` as `${string}::${string}::${string}`,
      typeArguments: [tankType],
      arguments: [tx.object(PROTOCOL_ID)],
    });

    const target =
      `${CORE_PACKAGE_ID}::tank::get_collateral_reward_amount` as `${string}::${string}::${string}`;
    for (const token of tokens) {
      if (!token.data) {
        continue;
      }

      tx.moveCall({
        target: target,
        typeArguments: [COINS_TYPE_LIST.BUCK, tankType],
        arguments: [tank, tx.objectRef({
          objectId: token.data.objectId,
          digest: token.data.digest,
          version: token.data.version,
        })],
      });
    }

    const res = await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: PROTOCOL_ID,
    });

    const resultArray = res?.results?.slice(1);

    if (resultArray?.length === 0) return 0;

    const bytesArray = resultArray?.map((result) => {
      if (result?.returnValues === undefined) return [0];
      if (result?.returnValues[0] === undefined) return [0];
      return result?.returnValues[0][0];
    });

    if (!bytesArray) return 0;

    let total = 0;
    bytesArray.forEach((bytes) => {
      const u64 = U64FromBytes(bytes);
      total += Number(formatUnits(u64, COIN_DECIMALS[token] ?? 9));
    });

    return total;
  }

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

    const token = getCoinSymbol(collateralType);
    if (!token) {
      return tx;
    }

    const { data: coins } = await this.client.getCoins({
      owner: walletAddress,
      coinType: collateralType,
    });

    const protocolId = protocolAddress[this.packageType];
    const packageId = bucketOpAddress[this.packageType];

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
          tx.pure(SUPRA_ID[token] ?? "", "u32"),
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

    const token = getCoinSymbol(collateralType);
    if (!token) {
      return tx;
    }

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

    tx.moveCall({
      target: SUPRA_UPDATE_TARGET,
      typeArguments: [collateralType],
      arguments: [
        tx.object(ORACLE_OBJECT_ID),
        tx.object(SUI_CLOCK_OBJECT_ID),
        tx.object(SUPRA_HANDLER_OBJECT),
        tx.pure(SUPRA_ID[token] ?? "", "u32"),
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

  async getTankDepositTx(
    tankType: string,
    depositAmount: number,
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for deposit token to tank
     * @param tankType Asset , e.g "0x2::sui::SUI"
     * @param depositAmount
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const protocolId = protocolAddress[this.packageType];
    const packageId = bucketOpAddress[this.packageType];

    const { data: coins } = await this.client.getCoins({
      owner: walletAddress,
      coinType: COINS_TYPE_LIST.BUCK,
    });

    const [mainCoin, ...otherCoins] = coins.map((coin) =>
      tx.objectRef({
        objectId: coin.coinObjectId,
        digest: coin.digest,
        version: coin.version,
      })
    );
    if (!mainCoin) return tx;

    if (otherCoins.length > 0) {
      tx.mergeCoins(mainCoin, otherCoins);
    }

    const buckCoinInput = tx.splitCoins(mainCoin, [
      tx.pure(depositAmount * 10 ** 9, "u64"),
    ]);
    if (!buckCoinInput) return tx;

    tx.moveCall({
      target: `${packageId}::tank_operations::deposit`,
      typeArguments: [tankType],
      arguments: [
        tx.object(protocolId),
        buckCoinInput
      ],
    });

    return tx;
  }

  async getTankWithdrawTx(
    tankType: string,
    withdrawAmount: number,
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for withdraw token from tank
     * @param tankType Asset , e.g "0x2::sui::SUI"
     * @param withdrawAmount
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const protocolId = protocolAddress[this.packageType];
    const packageId = bucketOpAddress[this.packageType];
    const CONTRIBUTOR_TOKEN_ID = contributorId[this.packageType];

    const token = getCoinSymbol(tankType);
    if (!token) {
      return tx;
    }

    const { data: contributorTokens } = await this.client.getOwnedObjects({
      owner: walletAddress,
      filter: {
        StructType: `${CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`
      },
      options: {
        showContent: true,
      },
    });
    const tokens = contributorTokens.map((token) =>
      tx.objectRef({
        objectId: token.data?.objectId ?? "",
        digest: token.data?.digest ?? "",
        version: token.data?.version ?? "",
      })
    );
    const tokenObjs = tx.makeMoveVec({
      objects: tokens,
    });

    tx.moveCall({
      target: SUPRA_UPDATE_TARGET,
      typeArguments: [tankType],
      arguments: [
        tx.object(ORACLE_OBJECT_ID),
        tx.object(SUI_CLOCK_OBJECT_ID),
        tx.object(SUPRA_HANDLER_OBJECT),
        tx.pure(SUPRA_ID[token] ?? "", "u32"),
      ],
    });

    tx.moveCall({
      target: `${packageId}::tank_operations::withdraw`,
      typeArguments: [tankType],
      arguments: [
        tx.object(protocolId),
        tx.object(ORACLE_OBJECT_ID),
        tx.object(SUI_CLOCK_OBJECT_ID),
        tx.object(TREASURY_OBJECT_ID),
        tokenObjs,
        tx.pure(parseBigInt(`${withdrawAmount ?? 0}`, 9), "u64"),
      ],
    });

    return tx;
  }

  async getTankClaimTx(
    tankType: string,
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for claim token from tank
     * @param tankType Asset , e.g "0x2::sui::SUI"
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const protocolId = protocolAddress[this.packageType];
    const packageId = bucketOpAddress[this.packageType];
    const CONTRIBUTOR_TOKEN_ID = contributorId[this.packageType];

    const token = getCoinSymbol(tankType);
    if (!token) {
      return tx;
    }

    const { data: contributorTokens } = await this.client.getOwnedObjects({
      owner: walletAddress,
      filter: {
        StructType: `${CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`
      },
      options: {
        showContent: true,
      },
    });
    const tokens = contributorTokens.map((token) =>
      tx.objectRef({
        objectId: token.data?.objectId ?? "",
        digest: token.data?.digest ?? "",
        version: token.data?.version ?? "",
      })
    );
    if (!tokens || tokens.length === 0) return tx;

    for (const token of tokens) {
      tx.moveCall({
        target: `${packageId}::tank_operations::claim`,
        typeArguments: [tankType],
        arguments: [
          tx.object(protocolId),
          tx.object(TREASURY_OBJECT_ID),
          token,
        ],
      });
    }

    return tx;
  }

  async getStakeUSDCTx(
    isAf: boolean,
    stakeAmount: number,
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for stake token to pool
     * @param isAf Boolean value for Aftermath or not
     * @param stakeAmount
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const protocolId = protocolAddress[this.packageType];

    const { data: coins } = await this.client.getCoins({
      owner: walletAddress,
      coinType: COINS_TYPE_LIST.BUCK,
    });

    const [mainCoin, ...otherCoins] = coins.map((coin) =>
      tx.objectRef({
        objectId: coin.coinObjectId,
        digest: coin.digest,
        version: coin.version,
      })
    );
    if (!mainCoin) return tx;

    if (otherCoins.length > 0) tx.mergeCoins(mainCoin, otherCoins);

    const stakeCoinInput = tx.splitCoins(mainCoin, [
      tx.pure(stakeAmount * 10 ** COIN_DECIMALS['USDC'], "u64"),
    ]);
    if (!stakeCoinInput) return tx;

    if (isAf) {
      tx.moveCall({
        target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::aftermath_fountain::stake`,
        typeArguments: [COINS_TYPE_LIST.AF_LP_USDC_BUCK, COINS_TYPE_LIST.USDC],
        arguments: [
          tx.object(protocolId),
          tx.object(AF_OBJS.pool),
          tx.object(AF_OBJS.poolRegistry),
          tx.object(AF_OBJS.protocolFeeVault),
          tx.object(AF_OBJS.treasury),
          tx.object(AF_OBJS.insuranceFund),
          tx.object(AF_OBJS.referralVault),
          tx.object(AF_USDC_BUCK_LP_REGISTRY_ID),
          tx.object(SUI_CLOCK_OBJECT_ID),
          stakeCoinInput,
          tx.pure(walletAddress, "address"),
        ]
      });
    }
    else {
      tx.moveCall({
        target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::cetus_fountain::stake`,
        typeArguments: [COINS_TYPE_LIST.USDC],
        arguments: [
          tx.object(protocolId),
          tx.object(CETUS_USDC_BUCK_LP_REGISTRY_ID),
          tx.object(BUCKETUS_TREASURY),
          tx.object(BUCKETUS_LP_VAULT),
          tx.object(CETUS_OBJS.globalConfig),
          tx.object(CETUS_OBJS.poolBuckUsdc),
          tx.object(SUI_CLOCK_OBJECT_ID),
          stakeCoinInput,
          tx.pure(walletAddress, "address"),
        ]
      });
    }

    return tx;
  }
}
