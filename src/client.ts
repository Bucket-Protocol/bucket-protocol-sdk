// Copyright Andrei <andreid.dev@gmail.com>

import { DevInspectResults, SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionBlock, TransactionResult } from "@mysten/sui.js/transactions";
import { normalizeSuiAddress } from "@mysten/sui.js/utils";
import { BCS, getSuiMoveConfig } from "@mysten/bcs"
import { ObjectRead, getObjectFields, getObjectOwner } from "./objects/objectTypes";

import { COINS_TYPE_LIST, PROTOCOL_ID, SUPRA_PRICE_FEEDS, SUPRA_UPDATE_TARGET, SUPRA_HANDLER_OBJECT, SUPRA_ID, TREASURY_OBJECT, BUCKET_OPERATIONS_PACKAGE_ID, CONTRIBUTOR_TOKEN_ID, CORE_PACKAGE_ID, COIN_DECIMALS, COIN, FOUNTAIN_PERIHERY_PACKAGE_ID, AF_OBJS, AF_USDC_BUCK_LP_REGISTRY_ID, BUCKETUS_TREASURY, BUCKETUS_LP_VAULT, CETUS_OBJS, CETUS_USDC_BUCK_LP_REGISTRY_ID, KRIYA_SUI_BUCK_LP_REGISTRY_ID, KRIYA_USDC_BUCK_LP_REGISTRY_ID, AF_SUI_BUCK_LP_REGISTRY_ID, CETUS_SUI_BUCK_LP_REGISTRY_ID, FOUNTAIN_PACKAGE_ID, KRIYA_FOUNTAIN_PACKAGE_ID, CETUS_USDC_BUCK_LP_REGISTRY, ORACLE_OBJECT, CLOCK_OBJECT, AF_USDC_BUCK_LP_REGISTRY, PROTOCOL_OBJECT, PSM_POOL_IDS } from "./constants";
import { BucketConstants, PaginatedBottleSummary, BucketResponse, BottleInfoResponse, BucketProtocolResponse, SupraPriceFeedResponse, BucketInfo, TankInfoResponse, TankInfo, BottleInfo, UserTankList, ProtocolInfo, TankList, FountainList, UserLpProof, UserLpList, BucketList, PsmPoolResponse, TvlList } from "./types";
import { U64FromBytes, formatUnits, getCoinSymbol, getObjectNames, lpProofToObject, parseBigInt, proofTypeToCoinType, getInputCoins, coinFromBalance, coinIntoBalance } from "./utils";
import { ObjectOwner } from "@mysten/sui.js/src/types/common";

const DUMMY_ADDRESS = normalizeSuiAddress("0x0");

export class BucketClient {
  /**
   * @description a TS wrapper over Bucket Protocol Move packages.
   * @param client connection to fullnode
   * @param owner (optional) address of the current user (default: DUMMY_ADDRESS)
   */
  private client: SuiClient;

  constructor(
    client: SuiClient,
    public owner: string = DUMMY_ADDRESS,
  ) {

    this.client = client;
  }

  depositToTank(
    tx: TransactionBlock,
    assetBuck: string,
    assetType: string,
    tankId: string,
    depositAmount: string,
  ): TransactionResult {
    /**
     * @description Deposit BUCK into tank
     * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param tankId The tank object id to deposit to , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
     * @param depositAmount BUCK amount to deposit into tank
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::tank::deposit`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(depositAmount)],
    });
  }

  withdrawFromTank(
    tx: TransactionBlock,
    assetBuck: string,
    assetType: string,
    tankId: string,
    contributorToken: string,
  ): TransactionResult {
    /**
     * @description Withdraw BUCK and collateral gain from the Tank
     * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
     * @param contributorToken The contributor token
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::tank::withdraw`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(contributorToken)],
    });
  }

  claimFromTank(
    tx: TransactionBlock,
    assetBuck: string,
    assetType: string,
    tankId: string,
    contributorToken: string,
  ): TransactionResult {
    /**
     * @description Claim collateral gain and BKT reward from the Tank
     * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
     * @param contributorToken The contributor token
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::tank::claim`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(contributorToken)],
    });
  }

  claimBkt(
    tx: TransactionBlock,
    assetBuck: string,
    assetType: string,
    tankId: string,
    contributorToken: string,
  ): TransactionResult {
    /**
     * @description Claim BKT reward earned by a deposit since its last snapshots were taken
     * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
     * @param contributorToken The contributor token
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::tank::claim_bkt`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure(contributorToken)],
    });
  }

  borrow(
    tx: TransactionBlock,
    collateralType: string,
    collateralInput: TransactionResult,
    bucketOutputAmount: number,
    insertionPlace?: string,
  ): TransactionResult {
    /**
     * @description Borrow
     * @param tx
     * @param collateralType Asset , e.g "0x2::sui::SUI"
     * @param collateralInput collateral input
     * @param bucketOutputAmount
     * @param insertionPlace optional
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::borrow`,
      typeArguments: [collateralType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        collateralInput,
        tx.pure(bucketOutputAmount, "u64"),
        tx.pure(insertionPlace ? [insertionPlace] : []),
      ],
    });
  }

  topUp(
    tx: TransactionBlock,
    collateralType: string,
    collateralInput: TransactionResult,
    forAddress: string,
    insertionPlace?: string,
  ) {
    /**
     * @description Top up function
     * @param tx
     * @param collateralType Asset , e.g "0x2::sui::SUI"
     * @param collateralInput collateral input
     * @param forAddress
     * @param insertionPlace optional
     * @returns TransactionResult
     */

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::top_up`,
      typeArguments: [collateralType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        collateralInput,
        tx.pure(forAddress, "address"),
        tx.pure(insertionPlace ? [insertionPlace] : []),
      ],
    });
  }

  withdraw(
    tx: TransactionBlock,
    assetType: string,
    collateralAmount: string,
    insertionPlace?: string,
  ): TransactionResult {
    /**
     * @description withdraw
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param collateralAmount
     * @param insertionPlace
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::withdraw`,
      typeArguments: [assetType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.pure(CLOCK_OBJECT),
        tx.pure(collateralAmount, "u64"),
        tx.pure(insertionPlace ? [insertionPlace] : []),
      ],
    });
  }

  repay(
    tx: TransactionBlock,
    assetType: string,
    buckInput: TransactionResult,
  ): TransactionResult {
    /**
     * @description Repay borrowed amount
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param buckInput Amount to be repaid
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::repay`,
      typeArguments: [assetType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        buckInput,
      ],
    });
  }

  redeem(
    tx: TransactionBlock,
    assetType: string,
    buckInput: TransactionResult,
    insertionPlace?: string,
  ): TransactionResult {
    /**
     * @description redeem
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param buckInput
     * @param insertionPlace
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::redeem`,
      typeArguments: [assetType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.pure(CLOCK_OBJECT),
        buckInput,
        tx.pure(insertionPlace ? [insertionPlace] : []),
      ],
    });
  }

  stake(
    tx: TransactionBlock,
    assetType: string,
    well: string,
    bktInput: string,
    lockTime: string,
  ): TransactionResult {
    /**
     * @description stake to well
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param well well object
     * @param bktInput Amount to stake
     * @param lockTime Locked time for staking
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::well::stake`,
      typeArguments: [assetType],
      arguments: [
        tx.object(well),
        tx.pure(bktInput),
        tx.pure(lockTime),
        tx.sharedObjectRef(CLOCK_OBJECT)
      ],
    });
  }


  unstake(
    tx: TransactionBlock,
    assetType: string,
    well: string,
    stakedBkt: string,
  ): TransactionResult {
    /**
     * @description unstake from well
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param well well object
     * @param stakedBkt Amount to stake
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::well::unstake`,
      typeArguments: [assetType],
      arguments: [
        tx.object(well),
        tx.pure(stakedBkt),
        tx.sharedObjectRef(CLOCK_OBJECT)
      ],
    });
  }

  forceUnstake(
    tx: TransactionBlock,
    assetType: string,
    well: string,
    bktTreasury: string,
    stakedBkt: string,
  ): TransactionResult {
    /**
     * @description forced unstake from well
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param well well object
     * @param stakedBkt Amount to stake
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::well::force_unstake`,
      typeArguments: [assetType],
      arguments: [
        tx.object(well),
        tx.object(bktTreasury),
        tx.pure(stakedBkt),
        tx.sharedObjectRef(CLOCK_OBJECT)
      ],
    });
  }

  claimFromWell(
    tx: TransactionBlock,
    assetType: string,
    well: string,
    stakedBkt: string,
  ): TransactionResult {
    /**
     * @description claim from well
     * @param assetType Asset , e.g "0x2::sui::SUI"
     * @param well well object
     * @param stakedBkt Staked BKT
     * @returns TransactionResult
     */

    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::well::claim`,
      typeArguments: [assetType],
      arguments: [
        tx.object(well),
        tx.pure(stakedBkt),
      ],
    });
  }

  updateSupraOracle(
    tx: TransactionBlock,
    token: string,
  ) {
    /**
     * @description update token price using supra oracle
     * @param assetType Asset , e.g "0x2::sui::SUI"
     */

    tx.moveCall({
      target: SUPRA_UPDATE_TARGET,
      typeArguments: [COINS_TYPE_LIST[token]],
      arguments: [
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.object(SUPRA_HANDLER_OBJECT),
        tx.pure(SUPRA_ID[token] ?? "", "u32"),
      ],
    });
  }

  private async encodedBucketConstants(): Promise<DevInspectResults> {
    /**
     * @description Get encoded BCS Bucket values
     * @returns devInspectTransactionBlock
     */
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::fee_precision`,
    });
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::liquidation_rebate`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::flash_loan_fee`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::buck_decimal`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::max_lock_time`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::min_lock_time`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::min_fee`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::max_fee`,
    });


    return await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.owner,
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

    const bucketObject = {
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
        MoveEventType: `${CORE_PACKAGE_ID}::bucket_events::BottleCreated`,
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
        MoveEventType: `${CORE_PACKAGE_ID}::bucket_events::BottleDestroyed`,
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

  async getAllBuckets(): Promise<BucketList> {
    /**
   * @description Get all buckets
   */
    let buckets: BucketList = {};

    try {
      const generalInfo = await this.client.getObject({
        id: PROTOCOL_ID,
        options: {
          showContent: true,
        }
      });
      const generalInfoField = generalInfo.data?.content as BucketProtocolResponse;
      const minBottleSize = generalInfoField.fields.min_bottle_size;

      const protocolFields = await this.client.getDynamicFields({
        parentId: PROTOCOL_ID,
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
          token: token as COIN,
          baseFeeRate: Number(fields.base_fee_rate ?? 5_000),
          bottleTableSize: fields.bottle_table.fields.table.fields.size ?? "",
          bottleTableId: fields.bottle_table.fields.table.fields.id.id ?? "",
          collateralDecimal: fields.collateral_decimal ?? 0,
          collateralVault: fields.collateral_vault ?? "",
          latestRedemptionTime: Number(fields.latest_redemption_time ?? 0),
          minCollateralRatio: fields.min_collateral_ratio ?? "",
          mintedBuckAmount: fields.minted_buck_amount ?? "",
          minBottleSize: minBottleSize,
          maxMintAmount: fields.max_mint_amount ?? "",
          recoveryModeThreshold: fields.recovery_mode_threshold ?? "",
        };

        buckets[token] = bucketInfo;
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
        parentId: PROTOCOL_ID
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
        const fields = getObjectFields(res) as TankInfoResponse;

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

  async findInsertionPlace(
    bottleTableId: string,
    targetCR: number,
    tolerance: number,
  ): Promise<string> {
    /**
   * @description Find insertaion place in tolerance range
   */
    try {
      let cursor: string | null = null;

      while (true) {
        const bottlesResp = await this.client.getDynamicFields({
          parentId: bottleTableId,
          cursor,
        });

        const bottles = bottlesResp.data;
        const objectIdList = bottles.map((item) => item.objectId);

        const response: SuiObjectResponse[] = await this.client.multiGetObjects({
          ids: objectIdList,
          options: {
            showContent: true,
            showOwner: true,
          },
        });

        for (const res of response) {
          const bottleInfo = getObjectFields(
            res
          ) as BottleInfoResponse;
          const bottleFields = bottleInfo.value.fields.value.fields;
          const cr = bottleFields.collateral_amount / bottleFields.buck_amount;
          if (cr > targetCR * (1 - (tolerance / 100))
            && cr < targetCR * (1 + (tolerance / 100))) {
            return bottleInfo.value.fields.next;
          }
        };

        if (!bottlesResp.hasNextPage) {
          break;
        }
        cursor = bottlesResp.nextCursor;
      }
    } catch (error) {
      console.log(error)
    }

    return "";
  };

  async getAllFountains(): Promise<FountainList> {
    /**
     * @description Get all fountains from KRIYA, CETUS, AFTERMATHs
     * @returns Promise<FountainList>
     */

    const objectIds = [
      KRIYA_SUI_BUCK_LP_REGISTRY_ID,
      KRIYA_USDC_BUCK_LP_REGISTRY_ID,
      AF_SUI_BUCK_LP_REGISTRY_ID,
      AF_USDC_BUCK_LP_REGISTRY_ID,
      CETUS_SUI_BUCK_LP_REGISTRY_ID,
      CETUS_USDC_BUCK_LP_REGISTRY_ID,
    ];

    const fountainResults = await this.client.multiGetObjects({
      ids: objectIds,
      options: {
        showContent: true,
      }
    });

    const fountains: FountainList = {};
    fountainResults.map((res) => {
      const id = res.data?.objectId ?? "";
      const isKriya = id == KRIYA_SUI_BUCK_LP_REGISTRY_ID || id == KRIYA_USDC_BUCK_LP_REGISTRY_ID;
      const fields = getObjectFields(res);

      fountains[id] = {
        id: res.data?.objectId ?? "",
        flowAmount: Number(fields?.flow_amount ?? 0),
        flowInterval: Number(fields?.flow_interval ?? 1),
        sourceBalance: Number(fields?.source ?? 0),
        poolBalance: Number(fields?.pool ?? 0),
        stakedBalance: isKriya ? Number(fields?.staked?.fields?.lsp.fields?.balance ?? 0) : Number(fields?.staked ?? 0),
        totalWeight: Number(fields?.total_weight ?? 0),
        cumulativeUnit: Number(fields?.cumulative_unit ?? 0),
        latestReleaseTime: Number(fields?.latest_release_time ?? 0),
      }
    });

    return fountains;
  }

  async getPsmTVL(): Promise<TvlList> {
    /**
   * @description Get all PSM's TVL
   */
    let tvlList: TvlList = {};

    try {
      const objectIdList = Object.values(PSM_POOL_IDS);
      const response: SuiObjectResponse[] = await this.client.multiGetObjects({
        ids: objectIdList,
        options: {
          showContent: true,
          showType: true, //Check could we get type from response later
        },
      });

      response.map((res) => {
        const fields = getObjectFields(res) as PsmPoolResponse;
        const poolId = fields.id.id;
        const coins = Object.keys(PSM_POOL_IDS).filter(symbol => PSM_POOL_IDS[symbol] == poolId);
        if (coins.length > 0) {
          const coin = coins[0];
          tvlList[coin] = Number(formatUnits(BigInt(fields.pool), COIN_DECIMALS[coins[0]] ?? 9));
        }
      });
    } catch (error) {
      console.log(error);
    }

    return tvlList;
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
        parentId: PROTOCOL_ID
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
        surplus_id: string;
      }[] = [];

      response.map((res, index) => {
        //Filter out WBTC, when we launch WBTC we need to remove this exception
        if (objectNameList[index] === "WBTC")
          return;

        const bucketFields = getObjectFields(res) as BucketResponse;

        bottleIdList.push({
          name: objectNameList[index] ?? "",
          id: bucketFields.bottle_table.fields.table.fields.id.id,
          surplus_id: bucketFields.surplus_bottle_table.fields.id.id,
        });
      });

      const userBottles: BottleInfo[] = [];

      for (const bottle of bottleIdList) {
        const token = bottle.name ?? "";

        await this.client
          .getDynamicFieldObject({
            parentId: bottle.id ?? "",
            name: {
              type: "address",
              value: address,
            },
          })
          .then(async (bottleInfo) => {
            const bottleInfoFields = getObjectFields(
              bottleInfo
            ) as BottleInfoResponse;

            if (bottleInfoFields) {
              userBottles.push({
                token,
                collateralAmount:
                  bottleInfoFields.value.fields.value.fields.collateral_amount,
                buckAmount:
                  bottleInfoFields.value.fields.value.fields.buck_amount,
              });
            }
            else {
              const surplusBottleInfo = await this.client.getDynamicFieldObject({
                parentId: bottle.surplus_id,
                name: {
                  type: "address",
                  value: address,
                }
              });

              const surplusBottleFields = getObjectFields(surplusBottleInfo);
              const collateralAmount = surplusBottleFields?.value.fields.collateral_amount ?? 0;
              if (collateralAmount) {
                userBottles.push({
                  token,
                  collateralAmount,
                  buckAmount: 0,
                });
              }
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

    let userTanks: UserTankList = {};

    try {
      // Get all tank objects
      const protocolFields = await this.client.getDynamicFields({
        parentId: PROTOCOL_ID
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

    const tank = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::borrow_tank` as `${string}::${string}::${string}`,
      typeArguments: [tankType],
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT)],
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

    const tank = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::borrow_tank` as `${string}::${string}::${string}`,
      typeArguments: [tankType],
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT)],
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

  async getUserLpProofs(
    owner: string
  ): Promise<UserLpList> {
    /**
     * @description Get all LP proofs from KRIYA, CETUS, AFTERMATHs
     * @param owner User address
     * @returns Promise<UserLpList>
     */
    const lpRegistryIds = [
      AF_USDC_BUCK_LP_REGISTRY_ID,
      AF_SUI_BUCK_LP_REGISTRY_ID,
      CETUS_USDC_BUCK_LP_REGISTRY_ID,
      CETUS_SUI_BUCK_LP_REGISTRY_ID,
      KRIYA_USDC_BUCK_LP_REGISTRY_ID,
      KRIYA_SUI_BUCK_LP_REGISTRY_ID,
    ];

    const res = await this.client.getOwnedObjects({
      owner,
      filter: {
        MatchAny: [
          {
            Package: FOUNTAIN_PACKAGE_ID,
          },
          {
            Package: KRIYA_FOUNTAIN_PACKAGE_ID,
          }
        ]
      },
      options: {
        showContent: true,
        showType: true,
      },
    });
    const proofs: UserLpProof[] = res.data.map((object) => {
      const fields = getObjectFields(object);
      return {
        objectId: object.data?.objectId ?? "",
        version: object.data?.version ?? "",
        digest: object.data?.digest ?? "",
        typeName: object.data?.type ?? "",
        fountainId: fields?.fountain_id ?? "",
        startUnit: Number(fields?.start_uint ?? 0),
        stakeAmount: Number(fields?.stake_amount ?? 0),
        stakeWeight: Number(fields?.stake_weight ?? 0),
        lockUntil: Number(fields?.lock_until ?? 0),
      }
    });

    const userLpList: UserLpList = {};
    for (const lpRegistryId of lpRegistryIds) {
      userLpList[lpRegistryId] = proofs.filter((proof) => lpRegistryId === proof.fountainId);
    }

    return userLpList;
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
      const priceFeed = getObjectFields(res) as SupraPriceFeedResponse;
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

  async getBorrowTx(
    collateralType: string,
    collateralAmount: number,
    borrowAmount: number,
    recipient: string,
    isNewBottle: boolean,
    isUpdateOracle: boolean,
    insertionPlace?: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Borrow
     * @param collateralType Asset , e.g "0x2::sui::SUI"
     * @param collateralAmount
     * @param borrowAmount
     * @param recipient
     * @param isNewBottle
     * @param isUpdateOracle
     * @param insertionPlace Optional
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const token = getCoinSymbol(collateralType);
    if (!token) {
      return tx;
    }

    const [collateralInput] = await getInputCoins(tx, this.client, recipient, collateralType, collateralAmount);
    if (!collateralInput) return tx;

    const collateralBalance = coinIntoBalance(tx, collateralType, collateralInput);

    if (borrowAmount == 0) {
      this.topUp(tx, collateralType, collateralBalance, recipient, isNewBottle ? insertionPlace : recipient);
    } else {
      if (isUpdateOracle) {
        this.updateSupraOracle(tx, token);
      }

      const buckBalance = this.borrow(
        tx,
        collateralType,
        collateralBalance,
        borrowAmount,
        isNewBottle ? insertionPlace : recipient,
      );
      const buckCoinBalance = coinFromBalance(tx, COINS_TYPE_LIST.BUCK, buckBalance);
      tx.transferObjects([buckCoinBalance], tx.pure(recipient, "address"));
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

    const [buckCoinInput] = await getInputCoins(tx, this.client, walletAddress, COINS_TYPE_LIST.BUCK, repayAmount);
    if (!buckCoinInput) return tx;

    this.updateSupraOracle(tx, token);

    tx.moveCall({
      target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::repay_and_withdraw`,
      typeArguments: [collateralType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        buckCoinInput,
        tx.pure(withdrawAmount, "u64"),
        tx.pure([walletAddress]),
      ],
    });

    return tx;
  }

  async getSurplusWithdrawTx(
    collateralType: string,
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Withdraw
     * @param collateralType Asset , e.g "0x2::sui::SUI"
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const token = getCoinSymbol(collateralType);
    if (!token) {
      return tx;
    }

    const surplusCollateral = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::withdraw_surplus_collateral`,
      typeArguments: [collateralType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
      ],
    });

    const surplusCoin = coinFromBalance(tx, collateralType, surplusCollateral);
    tx.transferObjects([surplusCoin], tx.pure(walletAddress, "address"));

    return tx;
  }

  async getPsmTx(
    psmCoin: string,
    psmAmount: number,
    psmSwith: boolean,
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for PSM
     * @param psmCoin Asset , e.g "0x2::sui::SUI"
     * @param psmAmount
     * @param psmSwith stable coin -> BUCK or not
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const inputCoinType = psmSwith ? COINS_TYPE_LIST.BUCK : COINS_TYPE_LIST[psmCoin];
    const [inputCoin] = await getInputCoins(tx, this.client, walletAddress, inputCoinType, psmAmount);

    const outCoinType = psmSwith ? COINS_TYPE_LIST[psmCoin] : COINS_TYPE_LIST.BUCK;
    const inputCoinBalance = coinIntoBalance(tx, inputCoinType, inputCoin);

    if (psmSwith) {
      const outBalance = tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::discharge_reservoir`,
        typeArguments: [outCoinType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          inputCoinBalance
        ],
      });

      const coinOut = coinFromBalance(tx, outCoinType, outBalance);
      tx.transferObjects([coinOut], tx.pure(walletAddress, "address"));
    }
    else {
      const outBalance = tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::charge_reservoir`,
        typeArguments: [inputCoinType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          inputCoinBalance
        ],
      });

      const coinOut = coinFromBalance(tx, outCoinType, outBalance);
      tx.transferObjects([coinOut], tx.pure(walletAddress, "address"));
    }

    return tx;
  }

  async getRedeemTx(
    collateralType: string,
    redeemAmount: number,
    walletAddress: string,
    insertionPlace?: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for Redeem
     * @param collateralType Asset , e.g "0x2::sui::SUI"
     * @param redeemAmount
     * @param walletAddress
     * @param insertionPlace  Optional
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const token = getCoinSymbol(collateralType) ?? "";
    const [buckCoinInput] = await getInputCoins(tx, this.client, walletAddress, COINS_TYPE_LIST.BUCK, redeemAmount);
    if (!buckCoinInput) return tx;

    this.updateSupraOracle(tx, token);

    tx.moveCall({
      target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::redeem`,
      typeArguments: [collateralType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        buckCoinInput,
        tx.pure(insertionPlace ? [] : [insertionPlace]),
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

    const [buckCoinInput] = await getInputCoins(tx, this.client, walletAddress, COINS_TYPE_LIST.BUCK, depositAmount);
    if (!buckCoinInput) return tx;

    tx.moveCall({
      target: `${BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::deposit`,
      typeArguments: [tankType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
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

    this.updateSupraOracle(tx, token);

    tx.moveCall({
      target: `${BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::withdraw`,
      typeArguments: [tankType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.sharedObjectRef(TREASURY_OBJECT),
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
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::claim`,
        typeArguments: [tankType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.sharedObjectRef(TREASURY_OBJECT),
          token,
        ],
      });
    }

    return tx;
  }

  async getStakeUsdcTx(
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

    const [stakeCoinInput] = await getInputCoins(tx, this.client, walletAddress, COINS_TYPE_LIST.USDC, stakeAmount);
    if (!stakeCoinInput) return tx;

    if (isAf) {
      tx.moveCall({
        target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::aftermath_fountain::stake`,
        typeArguments: [COINS_TYPE_LIST.AF_LP_USDC_BUCK, COINS_TYPE_LIST.USDC],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.object(AF_OBJS.pool),
          tx.object(AF_OBJS.poolRegistry),
          tx.object(AF_OBJS.protocolFeeVault),
          tx.object(AF_OBJS.treasury),
          tx.object(AF_OBJS.insuranceFund),
          tx.object(AF_OBJS.referralVault),
          tx.sharedObjectRef(AF_USDC_BUCK_LP_REGISTRY),
          tx.sharedObjectRef(CLOCK_OBJECT),
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
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.sharedObjectRef(CETUS_USDC_BUCK_LP_REGISTRY),
          tx.sharedObjectRef(BUCKETUS_TREASURY),
          tx.sharedObjectRef(BUCKETUS_LP_VAULT),
          tx.object(CETUS_OBJS.globalConfig),
          tx.object(CETUS_OBJS.poolBuckUsdc),
          tx.sharedObjectRef(CLOCK_OBJECT),
          stakeCoinInput,
          tx.pure(walletAddress, "address"),
        ]
      });
    }

    return tx;
  }

  async getAfUnstakeTx(
    fountainId: string,
    lpProof: UserLpProof,
    recipient: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for unstake token from AF pool
     * @param fountainId
     * @param lpProof UserLpProof object
     * @param recipient Recipient address
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const [stakeType, rewardType] = proofTypeToCoinType(lpProof.typeName);

    const [afLpBalance, rewardBalance] = tx.moveCall({
      target: "0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_core::force_unstake",
      typeArguments: [stakeType, rewardType],
      arguments: [
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.object(fountainId),
        tx.objectRef(lpProofToObject(lpProof)),
      ]
    });
    const afLpCoin = coinFromBalance(tx, COINS_TYPE_LIST.AF_LP_USDC_BUCK, afLpBalance);
    const rewardCoin = coinFromBalance(tx, COINS_TYPE_LIST.SUI, rewardBalance);
    const [buckCoin, usdcCoin] = tx.moveCall({
      target: "0xefe170ec0be4d762196bedecd7a065816576198a6527c99282a2551aaa7da38c::withdraw::all_coin_withdraw_2_coins",
      typeArguments: [COINS_TYPE_LIST.AF_LP_USDC_BUCK, COINS_TYPE_LIST.BUCK, COINS_TYPE_LIST.USDC],
      arguments: [
        tx.object(AF_OBJS.pool),
        tx.object(AF_OBJS.poolRegistry),
        tx.object(AF_OBJS.protocolFeeVault),
        tx.object(AF_OBJS.treasury),
        tx.object(AF_OBJS.insuranceFund),
        tx.object(AF_OBJS.referralVault),
        afLpCoin,
      ],
    });

    tx.transferObjects([buckCoin, usdcCoin, rewardCoin], tx.pure(recipient, "address"));

    return tx;
  }

  async getKriyaUnstakeTx(
    fountainId: string,
    lpProof: UserLpProof,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for unstake token from Kriya pool
     * @param fountainId
     * @param lpProof UserLpProof object
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    tx.moveCall({
      target: "0x4379259b0f0f547b84ec1c81d704f24861edd8afd8fa6bb9c082e44fbf97a27a::fountain_periphery::force_unstake",
      typeArguments: proofTypeToCoinType(lpProof.typeName),
      arguments: [
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.object(fountainId),
        tx.objectRef(lpProofToObject(lpProof)),
      ]
    });

    return tx;
  }

  async getCetusUnstakeTx(
    fountainId: string,
    lpProof: UserLpProof,
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for unstake token from Cetus pool
     * @param fountainId
     * @param lpProof UserLpProof object
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    const [bucketusOut, suiReward] = tx.moveCall({
      target: "0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_core::force_unstake",
      typeArguments: [COINS_TYPE_LIST.BUCKETUS, COINS_TYPE_LIST.SUI],
      arguments: [
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.object(fountainId),
        tx.objectRef(lpProofToObject(lpProof)),
      ],
    });

    const suiCoin = coinFromBalance(tx, COINS_TYPE_LIST.SUI, suiReward);
    const bucketusCoin = coinFromBalance(tx, COINS_TYPE_LIST.BUCKETUS, bucketusOut);

    const [buckCoin, usdcCoin] = tx.moveCall({
      target: "0x8da48ef1e49dcb81631ce468df5c273d2f8eb5770af4d27ec2f1049bc8a61f75::bucketus::withdraw",
      typeArguments: [COINS_TYPE_LIST.BUCK, COINS_TYPE_LIST.USDC],
      arguments: [
        tx.sharedObjectRef(BUCKETUS_TREASURY),
        tx.sharedObjectRef(BUCKETUS_LP_VAULT),
        tx.object(CETUS_OBJS.globalConfig),
        tx.object(CETUS_OBJS.poolBuckUsdc),
        tx.sharedObjectRef(CLOCK_OBJECT),
        bucketusCoin,
      ],
    });

    tx.transferObjects([buckCoin, usdcCoin, suiCoin], tx.pure(walletAddress, "address"));

    return tx;
  }

  async getAfClaimTx(
    fountainId: string,
    lpProofs: UserLpProof[],
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for claim token from AF pool
     * @param fountainId
     * @param lpProof UserLpProof object
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    for (const lpProof of lpProofs) {
      const [stakeType, rewardType] = proofTypeToCoinType(lpProof.typeName);

      tx.moveCall({
        target: `${FOUNTAIN_PACKAGE_ID}::fountain_periphery::claim`,
        typeArguments: [stakeType, rewardType],
        arguments: [
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.object(fountainId),
          tx.objectRef(lpProofToObject(lpProof)),
        ]
      });
    }

    return tx;
  }

  async getCetusClaimTx(
    fountainId: string,
    lpProofs: UserLpProof[],
    walletAddress: string,
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for claim token from Cetus pool
     * @param fountainId
     * @param lpProofs UserLpProof objects array
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    for (const lpProof of lpProofs) {
      tx.moveCall({
        target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::cetus_fountain::claim`,
        arguments: [
          tx.object(fountainId),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.objectRef(lpProofToObject(lpProof)),
          tx.pure(walletAddress, "address"),
        ],
      });
    }

    return tx;
  }

  async getKriyaClaimTx(
    fountainId: string,
    lpProofs: UserLpProof[],
  ): Promise<TransactionBlock> {
    /**
     * @description Get transaction for claim token from Kriya pool
     * @param fountainId
     * @param lpProofs UserLpProof object array
     * @param walletAddress
     * @returns Promise<TransactionBlock>
     */
    const tx = new TransactionBlock();

    for (const lpProof of lpProofs) {
      tx.moveCall({
        target: `${KRIYA_FOUNTAIN_PACKAGE_ID}::fountain_periphery::claim`,
        typeArguments: proofTypeToCoinType(lpProof.typeName),
        arguments: [
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.object(fountainId),
          tx.objectRef(lpProofToObject(lpProof)),
        ],
      });
    }

    return tx;
  }

}