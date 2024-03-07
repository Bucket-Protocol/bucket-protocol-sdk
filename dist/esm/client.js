// Copyright Andrei <andreid.dev@gmail.com>
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { normalizeSuiAddress } from "@mysten/sui.js/utils";
import { BCS, getSuiMoveConfig } from "@mysten/bcs";
import { getObjectFields } from "./objects/objectTypes";
import { COINS_TYPE_LIST, PROTOCOL_ID, SUPRA_PRICE_FEEDS, SUPRA_UPDATE_TARGET, SUPRA_HANDLER_OBJECT, SUPRA_ID, TREASURY_OBJECT, BUCKET_OPERATIONS_PACKAGE_ID, CONTRIBUTOR_TOKEN_ID, CORE_PACKAGE_ID, COIN_DECIMALS, FOUNTAIN_PERIHERY_PACKAGE_ID, AF_OBJS, AF_USDC_BUCK_LP_REGISTRY_ID, BUCKETUS_TREASURY, BUCKETUS_LP_VAULT, CETUS_OBJS, KRIYA_SUI_BUCK_LP_REGISTRY_ID, KRIYA_USDC_BUCK_LP_REGISTRY_ID, AF_SUI_BUCK_LP_REGISTRY_ID, CETUS_SUI_BUCK_LP_REGISTRY_ID, FOUNTAIN_PACKAGE_ID, KRIYA_FOUNTAIN_PACKAGE_ID, ORACLE_OBJECT, CLOCK_OBJECT, AF_USDC_BUCK_LP_REGISTRY, PROTOCOL_OBJECT, PSM_POOL_IDS, CETUS_USDC_BUCK_LP_REGISTRY_ID, CETUS_USDC_BUCK_LP_REGISTRY } from "./constants";
import { U64FromBytes, formatUnits, getCoinSymbol, getObjectNames, lpProofToObject, parseBigInt, proofTypeToCoinType, getInputCoins, coinFromBalance, coinIntoBalance, getMainCoin } from "./utils";
import { objectToFountain } from "./utils/convert";
const DUMMY_ADDRESS = normalizeSuiAddress("0x0");
export class BucketClient {
    network;
    owner;
    /**
     * @description a TS wrapper over Bucket Protocol Move packages.
     * @param network connection to fullnode: 'mainnet' | 'testnet' | 'devnet' | 'localnet' | string
     * @param owner (optional) address of the current user (default: DUMMY_ADDRESS)
     */
    client;
    constructor(network = 'mainnet', owner = DUMMY_ADDRESS) {
        this.network = network;
        this.owner = owner;
        let url = "";
        if (network == 'mainnet'
            || network == 'testnet'
            || network == 'devnet'
            || network == 'localnet') {
            url = getFullnodeUrl(network);
        }
        else {
            url = network;
        }
        this.client = new SuiClient({ url });
    }
    depositToTank(tx, assetBuck, assetType, tankId, depositAmount) {
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
    withdrawFromTank(tx, assetBuck, assetType, tankId, contributorToken) {
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
    claimFromTank(tx, assetBuck, assetType, tankId, contributorToken) {
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
    claimBkt(tx, assetBuck, assetType, tankId, contributorToken) {
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
    borrow(tx, collateralType, collateralInput, bucketOutputAmount, insertionPlace, strapId) {
        /**
         * @description Borrow
         * @param tx
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param collateralInput collateral input
         * @param bucketOutputAmount
         * @param insertionPlace optional
         * @returns TransactionResult
         */
        if (strapId) {
            if (strapId === "new") {
                const [strap] = tx.moveCall({
                    target: `${CORE_PACKAGE_ID}::strap::new`,
                    typeArguments: [collateralType],
                });
                const [buckOut] = tx.moveCall({
                    target: `${CORE_PACKAGE_ID}::buck::borrow_with_strap`,
                    typeArguments: [collateralType],
                    arguments: [
                        tx.sharedObjectRef(PROTOCOL_OBJECT),
                        tx.sharedObjectRef(ORACLE_OBJECT),
                        tx.object(strapId),
                        tx.sharedObjectRef(CLOCK_OBJECT),
                        collateralInput,
                        tx.pure(bucketOutputAmount, "u64"),
                        tx.pure(insertionPlace ? [insertionPlace] : []),
                    ],
                });
                return [strap, buckOut];
            }
            else {
                return tx.moveCall({
                    target: `${CORE_PACKAGE_ID}::buck::borrow_with_strap`,
                    typeArguments: [collateralType],
                    arguments: [
                        tx.sharedObjectRef(PROTOCOL_OBJECT),
                        tx.sharedObjectRef(ORACLE_OBJECT),
                        tx.object(strapId),
                        tx.sharedObjectRef(CLOCK_OBJECT),
                        collateralInput,
                        tx.pure(bucketOutputAmount, "u64"),
                        tx.pure(insertionPlace ? [insertionPlace] : []),
                    ],
                });
            }
        }
        else {
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
    }
    topUp(tx, collateralType, collateralInput, forAddress, insertionPlace) {
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
            target: `${CORE_PACKAGE_ID}::buck::top_up_coll`,
            typeArguments: [collateralType],
            arguments: [
                tx.sharedObjectRef(PROTOCOL_OBJECT),
                collateralInput,
                tx.pure(forAddress, "address"),
                tx.pure(insertionPlace ? [insertionPlace] : []),
                tx.sharedObjectRef(CLOCK_OBJECT),
            ],
        });
    }
    withdraw(tx, assetType, collateralAmount, insertionPlace, strapId) {
        /**
         * @description withdraw
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param collateralAmount
         * @param insertionPlace
         * @returns TransactionResult
         */
        if (strapId) {
            return tx.moveCall({
                target: `${CORE_PACKAGE_ID}::buck::withdraw_with_strap`,
                typeArguments: [assetType],
                arguments: [
                    tx.sharedObjectRef(PROTOCOL_OBJECT),
                    tx.sharedObjectRef(ORACLE_OBJECT),
                    tx.object(strapId),
                    tx.pure(CLOCK_OBJECT),
                    tx.pure(collateralAmount, "u64"),
                    tx.pure(insertionPlace ? [insertionPlace] : []),
                ],
            });
        }
        else {
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
    }
    repay(tx, assetType, buckInput, strapId) {
        /**
         * @description Repay borrowed amount
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param buckInput Amount to be repaid
         * @returns TransactionResult
         */
        if (strapId) {
            return tx.moveCall({
                target: `${CORE_PACKAGE_ID}::buck::repay_with_strap`,
                typeArguments: [assetType],
                arguments: [
                    tx.sharedObjectRef(PROTOCOL_OBJECT),
                    tx.object(strapId),
                    buckInput,
                    tx.pure(CLOCK_OBJECT),
                ],
            });
        }
        else {
            return tx.moveCall({
                target: `${CORE_PACKAGE_ID}::buck::repay_debt`,
                typeArguments: [assetType],
                arguments: [
                    tx.sharedObjectRef(PROTOCOL_OBJECT),
                    buckInput,
                    tx.pure(CLOCK_OBJECT),
                ],
            });
        }
    }
    redeem(tx, assetType, buckInput, insertionPlace) {
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
    stake(tx, assetType, well, bktInput, lockTime) {
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
    unstake(tx, assetType, well, stakedBkt) {
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
    forceUnstake(tx, assetType, well, bktTreasury, stakedBkt) {
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
    claimFromWell(tx, assetType, well, stakedBkt) {
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
    updateSupraOracle(tx, token) {
        /**
         * @description update token price using supra oracle
         * @param assetType Asset , e.g "0x2::sui::SUI"
         */
        if (token === "afSUI" || token === "AF_LP_SUI_SUI") {
            tx.moveCall({
                target: SUPRA_UPDATE_TARGET,
                typeArguments: [COINS_TYPE_LIST['SUI']],
                arguments: [
                    tx.sharedObjectRef(ORACLE_OBJECT),
                    tx.sharedObjectRef(CLOCK_OBJECT),
                    tx.object(SUPRA_HANDLER_OBJECT),
                    tx.pure(SUPRA_ID['SUI'] ?? "", "u32"),
                ],
            });
            // update afSUI price
            tx.moveCall({
                target: "0x2480d9a3ff2c821061df22c4365316f894c6fa686fbd03ba828fe7c5bef9ad22::afsui_rule::update_price",
                arguments: [
                    tx.sharedObjectRef(ORACLE_OBJECT),
                    tx.object("0x2f8f6d5da7f13ea37daa397724280483ed062769813b6f31e9788e59cc88994d"),
                    tx.object("0xeb685899830dd5837b47007809c76d91a098d52aabbf61e8ac467c59e5cc4610"),
                    tx.sharedObjectRef(CLOCK_OBJECT),
                ],
            });
            if (token === "AF_LP_SUI_SUI") {
                // update afSUI/SUI LP price using afSUI and SUI price
                tx.moveCall({
                    target: "0x928ff0be132d9bad7926008780d2a5adfefa1a24559a567dafbfd267d1b1b294::af_lp_rule::update_price",
                    typeArguments: [
                        "0x42d0b3476bc10d18732141a471d7ad3aa588a6fb4ba8e1a6608a4a7b78e171bf::af_lp::AF_LP",
                        COINS_TYPE_LIST.SUI,
                        COINS_TYPE_LIST.afSUI,
                    ],
                    arguments: [
                        tx.sharedObjectRef(ORACLE_OBJECT),
                        tx.object("0x97aae7a80abb29c9feabbe7075028550230401ffe7fb745757d3c28a30437408"),
                        tx.sharedObjectRef(CLOCK_OBJECT),
                    ],
                });
            }
        }
        else {
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
    }
    async encodedBucketConstants() {
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
    async getBucketConstants() {
        /**
       * @description Get bucket constants (decoded BCS values)
       * @returns Promise<DecodedBucketConstants | undefined>
       */
        const results = await this.encodedBucketConstants();
        if (!results) {
            return undefined;
        }
        const bcs = new BCS(getSuiMoveConfig());
        const bucketObject = {
            feePrecision: bcs.de("u64", Uint8Array.from(results.results[0].returnValues[0][0])),
            liquidationRebate: bcs.de("u64", Uint8Array.from(results.results[1].returnValues[0][0])),
            flashLoanFee: bcs.de("u64", Uint8Array.from(results.results[2].returnValues[0][0])),
            buckDecimal: bcs.de("u8", Uint8Array.from(results.results[3].returnValues[0][0])),
            maxLockTime: bcs.de("u64", Uint8Array.from(results.results[4].returnValues[0][0])),
            minLockTime: bcs.de("u64", Uint8Array.from(results.results[5].returnValues[0][0])),
            minFee: bcs.de("u64", Uint8Array.from(results.results[6].returnValues[0][0])),
            maxFee: bcs.de("u64", Uint8Array.from(results.results[7].returnValues[0][0])),
        };
        return bucketObject;
    }
    async getProtocol() {
        /**
         * @description Get protocol information including BUCK supply.
         * @returns Promise<ProtocolInfo>
         */
        const resp = (await this.client.getObject({
            id: PROTOCOL_ID,
            options: {
                showContent: true,
            },
        }));
        const buckSupply = Number(resp.data?.content.fields.buck_treasury_cap.fields.total_supply.fields
            .value) / 10 ** 9;
        return {
            buckSupply
        };
    }
    async getAllBottles() {
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
            const rawEvent = event.parsedJson;
            return {
                bottleId: rawEvent.bottle_id,
            };
        });
        return {
            data: bottles,
            nextCursor: resp.nextCursor,
            hasNextPage: resp.hasNextPage,
        };
    }
    async getDestroyedBottles() {
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
            const rawEvent = event.parsedJson;
            return {
                bottleId: rawEvent.bottle_id,
            };
        });
        return {
            data: destroyedBottles,
            nextCursor: resp.nextCursor,
            hasNextPage: resp.hasNextPage,
        };
    }
    async getAllBuckets() {
        /**
       * @description Get all buckets
       */
        let buckets = {};
        try {
            const generalInfo = await this.client.getObject({
                id: PROTOCOL_ID,
                options: {
                    showContent: true,
                }
            });
            const generalInfoField = generalInfo.data?.content;
            const minBottleSize = generalInfoField.fields.min_bottle_size;
            const protocolFields = await this.client.getDynamicFields({
                parentId: PROTOCOL_ID,
            });
            const bucketList = protocolFields.data.filter((item) => item.objectType.includes("Bucket"));
            const objectIdList = bucketList.map((item) => item.objectId);
            const response = await this.client.multiGetObjects({
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
                const fields = getObjectFields(res);
                const bucketInfo = {
                    token: token,
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
        }
        catch (error) {
            console.log(error);
        }
        return buckets;
    }
    ;
    async getAllTanks() {
        /**
       * @description Get all tanks objects
       */
        const tankInfoList = {};
        try {
            const protocolFields = await this.client.getDynamicFields({
                parentId: PROTOCOL_ID
            });
            const tankList = protocolFields.data.filter((item) => item.objectType.includes("Tank"));
            const objectIdList = tankList.map((item) => item.objectId);
            const response = await this.client.multiGetObjects({
                ids: objectIdList,
                options: {
                    showContent: true,
                    showType: true, //Check could we get type from response later
                },
            });
            response.forEach((res, index) => {
                const fields = getObjectFields(res);
                let token = "";
                const objectType = res.data?.type;
                if (objectType) {
                    const assetType = objectType.split(",")[1].trim().split(">")[0].trim();
                    token = getCoinSymbol(assetType) ?? "";
                }
                const tankInfo = {
                    buckReserve: fields?.reserve || "0",
                    collateralPool: fields?.collateral_pool || "0",
                    currentS: fields?.current_s || "0",
                    currentP: fields?.current_p || "1",
                };
                tankInfoList[token] = tankInfo;
            });
        }
        catch (error) {
        }
        return tankInfoList;
    }
    ;
    async findInsertionPlace(bottleTableId, targetCR, tolerance) {
        /**
       * @description Find insertaion place in tolerance range
       */
        try {
            let cursor = null;
            while (true) {
                const bottlesResp = await this.client.getDynamicFields({
                    parentId: bottleTableId,
                    cursor,
                });
                const bottles = bottlesResp.data;
                const objectIdList = bottles.map((item) => item.objectId);
                const response = await this.client.multiGetObjects({
                    ids: objectIdList,
                    options: {
                        showContent: true,
                        showOwner: true,
                    },
                });
                for (const res of response) {
                    const bottleInfo = getObjectFields(res);
                    const bottleFields = bottleInfo.value.fields.value.fields;
                    const cr = bottleFields.collateral_amount / bottleFields.buck_amount;
                    if (cr > targetCR * (1 - (tolerance / 100))
                        && cr < targetCR * (1 + (tolerance / 100))) {
                        return bottleInfo.value.fields.next;
                    }
                }
                ;
                if (!bottlesResp.hasNextPage) {
                    break;
                }
                cursor = bottlesResp.nextCursor;
            }
        }
        catch (error) {
            console.log(error);
        }
        return "";
    }
    ;
    async getAllFountains() {
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
        const fountains = {};
        fountainResults.map((res) => {
            const fountain = objectToFountain(res);
            fountains[fountain.id] = fountain;
        });
        return fountains;
    }
    async getFountain(lpRegistryId) {
        /**
         * @description Get all fountains from KRIYA, CETUS, AFTERMATHs
         * @param lpRegistryId Fountain lp registry id
         * @returns Promise<FountainList>
         */
        const res = await this.client.getObject({
            id: lpRegistryId,
            options: {
                showContent: true,
            }
        });
        return objectToFountain(res);
    }
    async getPsmTVL() {
        /**
       * @description Get all PSM's TVL
       */
        let tvlList = {};
        try {
            const objectIdList = Object.values(PSM_POOL_IDS);
            const response = await this.client.multiGetObjects({
                ids: objectIdList,
                options: {
                    showContent: true,
                    showType: true, //Check could we get type from response later
                },
            });
            response.map((res) => {
                const fields = getObjectFields(res);
                const poolId = fields.id.id;
                const coins = Object.keys(PSM_POOL_IDS).filter(symbol => PSM_POOL_IDS[symbol] == poolId);
                if (coins.length > 0) {
                    const coin = coins[0];
                    tvlList[coin] = Number(formatUnits(BigInt(fields.pool), COIN_DECIMALS[coins[0]] ?? 9));
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        return tvlList;
    }
    ;
    async getUserBottles(address) {
        /**
         * @description Get positions array for input address
         * @address User address that belong to bottle
         * @returns Promise<BottleInfo>
         */
        if (!address)
            return [];
        try {
            const protocolFields = await this.client.getDynamicFields({
                parentId: PROTOCOL_ID
            });
            const bucketList = protocolFields.data.filter((item) => item.objectType.includes("Bucket"));
            const objectTypeList = bucketList.map((item) => item.objectType);
            const objectIdList = bucketList.map((item) => item.objectId);
            const objectNameList = getObjectNames(objectTypeList);
            const response = await this.client.multiGetObjects({
                ids: objectIdList,
                options: {
                    showContent: true,
                    showType: true, //Check could we get type from response later
                },
            });
            const bottleIdList = [];
            response.map((res, index) => {
                //Filter out WBTC, when we launch WBTC we need to remove this exception
                if (objectNameList[index] === "WBTC")
                    return;
                const bucketFields = getObjectFields(res);
                bottleIdList.push({
                    name: objectNameList[index] ?? "",
                    id: bucketFields.bottle_table.fields.table.fields.id.id,
                    surplus_id: bucketFields.surplus_bottle_table.fields.id.id,
                });
            });
            const userBottles = [];
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
                    const bottleInfoFields = getObjectFields(bottleInfo);
                    if (bottleInfoFields) {
                        userBottles.push({
                            token,
                            collateralAmount: bottleInfoFields.value.fields.value.fields.collateral_amount,
                            buckAmount: bottleInfoFields.value.fields.value.fields.buck_amount,
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
        }
        catch (error) {
            return [];
        }
    }
    ;
    async getUserTanks(address) {
        /**
         * @description Get tanks array for input address
         * @address User address that belong to bottle
         * @returns Promise<TankInfo>
         */
        if (!address)
            return {};
        let userTanks = {};
        try {
            // Get all tank objects
            const protocolFields = await this.client.getDynamicFields({
                parentId: PROTOCOL_ID
            });
            const tankList = protocolFields.data.filter((item) => item.objectType.includes("Tank"));
            // Split coin type from result
            const tankTypes = tankList.map(tank => {
                const tankType = tank.objectType;
                const splitTypeString = tankType.split("<").pop();
                if (!splitTypeString)
                    return;
                const coinType = splitTypeString.replace(">", "").split(",").pop();
                if (!coinType)
                    return;
                return coinType.trim();
            });
            // Build contributor token filter
            const filters = tankTypes.map(tankType => {
                return {
                    StructType: `${CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`
                };
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
                });
                const totalBUCK = await this.getUserTankBUCK(tankType, tokens);
                const totalEarned = await this.getUserTankEarn(tankType, tokens);
                userTanks[token] = {
                    totalBUCK,
                    totalEarned,
                };
            }
        }
        catch (error) {
        }
        return userTanks;
    }
    ;
    async getUserTankBUCK(tankType, tokens) {
        if (tokens.length == 0) {
            return 0;
        }
        const tx = new TransactionBlock();
        const tank = tx.moveCall({
            target: `${CORE_PACKAGE_ID}::buck::borrow_tank`,
            typeArguments: [tankType],
            arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT)],
        });
        const target = `${CORE_PACKAGE_ID}::tank::get_token_weight`;
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
        if (resultArray?.length === 0)
            return 0;
        const bytesArray = resultArray?.map((result) => {
            if (result?.returnValues === undefined)
                return [0];
            if (result?.returnValues[0] === undefined)
                return [0];
            return result?.returnValues[0][0];
        });
        if (!bytesArray)
            return 0;
        let total = 0;
        bytesArray.forEach((bytes) => {
            const u64 = U64FromBytes(bytes);
            total += Number(formatUnits(u64, 9)); //BUCK decimals
        });
        return total;
    }
    async getUserTankEarn(tankType, tokens) {
        if (tokens.length == 0) {
            return 0;
        }
        const token = getCoinSymbol(tankType);
        if (!token) {
            return 0;
        }
        const tx = new TransactionBlock();
        const tank = tx.moveCall({
            target: `${CORE_PACKAGE_ID}::buck::borrow_tank`,
            typeArguments: [tankType],
            arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT)],
        });
        const target = `${CORE_PACKAGE_ID}::tank::get_collateral_reward_amount`;
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
        if (resultArray?.length === 0)
            return 0;
        const bytesArray = resultArray?.map((result) => {
            if (result?.returnValues === undefined)
                return [0];
            if (result?.returnValues[0] === undefined)
                return [0];
            return result?.returnValues[0][0];
        });
        if (!bytesArray)
            return 0;
        let total = 0;
        bytesArray.forEach((bytes) => {
            const u64 = U64FromBytes(bytes);
            total += Number(formatUnits(u64, COIN_DECIMALS[token] ?? 9));
        });
        return total;
    }
    async getUserLpProofs(owner) {
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
        const proofs = res.data.map((object) => {
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
            };
        });
        const userLpList = {};
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
        const priceObjects = await this.client.multiGetObjects({
            ids,
            options: {
                showContent: true,
                showType: true, //Check could we get type from response later
            },
        });
        const prices = {
            WETH: 1,
            SUI: 1,
            vSUI: 1,
            afSUI: 1,
            haSUI: 1,
            USDC: 1,
            USDT: 1,
            USDY: 1,
            BUCK: 1,
            CETABLE: 1,
        };
        priceObjects.map((res, index) => {
            const priceFeed = getObjectFields(res);
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
    async getBorrowTx(collateralType, collateralAmount, borrowAmount, recipient, isNewBottle, isUpdateOracle, insertionPlace) {
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
        if (!collateralInput)
            return tx;
        const collateralBalance = coinIntoBalance(tx, collateralType, collateralInput);
        if (borrowAmount == 0) {
            this.topUp(tx, collateralType, collateralBalance, recipient, isNewBottle ? insertionPlace : recipient);
        }
        else {
            if (isUpdateOracle) {
                this.updateSupraOracle(tx, token);
            }
            const buckBalance = this.borrow(tx, collateralType, collateralBalance, borrowAmount, isNewBottle ? insertionPlace : recipient);
            const buckCoinBalance = coinFromBalance(tx, COINS_TYPE_LIST.BUCK, buckBalance);
            tx.transferObjects([buckCoinBalance], tx.pure(recipient, "address"));
        }
        ;
        return tx;
    }
    async getRepayTx(collateralType, repayAmount, withdrawAmount, walletAddress) {
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
        let buckCoinInput;
        if (repayAmount > 0) {
            [buckCoinInput] = await getInputCoins(tx, this.client, walletAddress, COINS_TYPE_LIST.BUCK, repayAmount);
        }
        else {
            buckCoinInput = await getMainCoin(tx, this.client, walletAddress, COINS_TYPE_LIST.BUCK);
        }
        if (!buckCoinInput)
            return tx;
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
    async getSurplusWithdrawTx(collateralType, walletAddress) {
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
    async getPsmTx(psmCoin, psmAmount, psmSwith, walletAddress) {
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
    async getRedeemTx(collateralType, redeemAmount, walletAddress, insertionPlace) {
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
        if (!buckCoinInput)
            return tx;
        this.updateSupraOracle(tx, token);
        tx.moveCall({
            target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::redeem`,
            typeArguments: [collateralType],
            arguments: [
                tx.sharedObjectRef(PROTOCOL_OBJECT),
                tx.sharedObjectRef(ORACLE_OBJECT),
                tx.sharedObjectRef(CLOCK_OBJECT),
                buckCoinInput,
                tx.pure(insertionPlace ? [insertionPlace] : []),
            ],
        });
        return tx;
    }
    async getTankDepositTx(tankType, depositAmount, walletAddress) {
        /**
         * @description Get transaction for deposit token to tank
         * @param tankType Asset , e.g "0x2::sui::SUI"
         * @param depositAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const tx = new TransactionBlock();
        const [buckCoinInput] = await getInputCoins(tx, this.client, walletAddress, COINS_TYPE_LIST.BUCK, depositAmount);
        if (!buckCoinInput)
            return tx;
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
    async getTankWithdrawTx(tankType, withdrawAmount, walletAddress) {
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
        const tokens = contributorTokens.map((token) => tx.objectRef({
            objectId: token.data?.objectId ?? "",
            digest: token.data?.digest ?? "",
            version: token.data?.version ?? "",
        }));
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
    async getTankClaimTx(tankType, walletAddress) {
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
        const tokens = contributorTokens.map((token) => tx.objectRef({
            objectId: token.data?.objectId ?? "",
            digest: token.data?.digest ?? "",
            version: token.data?.version ?? "",
        }));
        if (!tokens || tokens.length === 0)
            return tx;
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
    async getStakeUsdcTx(isAf, stakeAmount, walletAddress) {
        /**
         * @description Get transaction for stake token to pool
         * @param isAf Boolean value for Aftermath or not
         * @param stakeAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const tx = new TransactionBlock();
        const [stakeCoinInput] = await getInputCoins(tx, this.client, walletAddress, COINS_TYPE_LIST.USDC, stakeAmount);
        if (!stakeCoinInput)
            return tx;
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
    async getAfUnstakeTx(fountainId, lpProof, recipient) {
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
    async getKriyaUnstakeTx(fountainId, lpProof) {
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
    async getCetusUnstakeTx(fountainId, lpProof, walletAddress) {
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
    async getAfClaimTx(fountainId, lpProofs) {
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
    async getCetusClaimTx(fountainId, lpProofs, walletAddress) {
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
    async getKriyaClaimTx(fountainId, lpProofs) {
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
//# sourceMappingURL=client.js.map