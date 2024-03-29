"use strict";
// Copyright Andrei <andreid.dev@gmail.com>
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketClient = void 0;
const client_1 = require("@mysten/sui.js/client");
const transactions_1 = require("@mysten/sui.js/transactions");
const utils_1 = require("@mysten/sui.js/utils");
const bcs_1 = require("@mysten/bcs");
const objectTypes_1 = require("./objects/objectTypes");
const constants_1 = require("./constants");
const utils_2 = require("./utils");
const convert_1 = require("./utils/convert");
const DUMMY_ADDRESS = (0, utils_1.normalizeSuiAddress)("0x0");
class BucketClient {
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
            url = (0, client_1.getFullnodeUrl)(network);
        }
        else {
            url = network;
        }
        this.client = new client_1.SuiClient({ url });
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
            target: `${constants_1.CORE_PACKAGE_ID}::tank::deposit`,
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
            target: `${constants_1.CORE_PACKAGE_ID}::tank::withdraw`,
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
            target: `${constants_1.CORE_PACKAGE_ID}::tank::claim`,
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
            target: `${constants_1.CORE_PACKAGE_ID}::tank::claim_bkt`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(contributorToken)],
        });
    }
    borrow(tx, collateralType, collateralInput, buckOutput, insertionPlace, strapId) {
        /**
         * @description Borrow
         * @param tx
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param collateralInput collateral input
         * @param buckOutput
         * @param insertionPlace optional
         * @returns TransactionResult
         */
        if (strapId) {
            if (strapId === "new") {
                const [strap] = tx.moveCall({
                    target: `${constants_1.CORE_PACKAGE_ID}::strap::new`,
                    typeArguments: [collateralType],
                });
                const [buckOut] = tx.moveCall({
                    target: `${constants_1.CORE_PACKAGE_ID}::buck::borrow_with_strap`,
                    typeArguments: [collateralType],
                    arguments: [
                        tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                        tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                        strap,
                        tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                        collateralInput,
                        buckOutput,
                        tx.pure(insertionPlace ? [insertionPlace] : []),
                    ],
                });
                return [strap, buckOut];
            }
            else {
                // console.log(strapId, insertionPlace);
                return tx.moveCall({
                    target: `${constants_1.CORE_PACKAGE_ID}::buck::borrow_with_strap`,
                    typeArguments: [collateralType],
                    arguments: [
                        tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                        tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                        typeof strapId === "string" ? tx.pure(strapId) : strapId,
                        tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                        collateralInput,
                        buckOutput,
                        tx.pure(insertionPlace ? [insertionPlace] : []),
                    ],
                });
            }
        }
        else {
            return tx.moveCall({
                target: `${constants_1.CORE_PACKAGE_ID}::buck::borrow`,
                typeArguments: [collateralType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    collateralInput,
                    buckOutput,
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
            target: `${constants_1.CORE_PACKAGE_ID}::buck::top_up_coll`,
            typeArguments: [collateralType],
            arguments: [
                tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                collateralInput,
                tx.pure(forAddress, "address"),
                tx.pure(insertionPlace ? [insertionPlace] : []),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
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
                target: `${constants_1.CORE_PACKAGE_ID}::buck::withdraw_with_strap`,
                typeArguments: [assetType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                    typeof strapId === "string" ? tx.pure(strapId) : strapId,
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    tx.pure(collateralAmount, "u64"),
                    tx.pure(insertionPlace ? [insertionPlace] : []),
                ],
            });
        }
        else {
            return tx.moveCall({
                target: `${constants_1.CORE_PACKAGE_ID}::buck::withdraw`,
                typeArguments: [assetType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
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
                target: `${constants_1.CORE_PACKAGE_ID}::buck::repay_with_strap`,
                typeArguments: [assetType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    typeof strapId === "string" ? tx.object(strapId) : strapId,
                    buckInput,
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                ],
            });
        }
        else {
            return tx.moveCall({
                target: `${constants_1.CORE_PACKAGE_ID}::buck::repay_debt`,
                typeArguments: [assetType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    buckInput,
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
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
            target: `${constants_1.CORE_PACKAGE_ID}::buck::redeem`,
            typeArguments: [assetType],
            arguments: [
                tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
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
            target: `${constants_1.CORE_PACKAGE_ID}::well::stake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(bktInput),
                tx.pure(lockTime),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT)
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
            target: `${constants_1.CORE_PACKAGE_ID}::well::unstake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(stakedBkt),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT)
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
            target: `${constants_1.CORE_PACKAGE_ID}::well::force_unstake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.object(bktTreasury),
                tx.pure(stakedBkt),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT)
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
            target: `${constants_1.CORE_PACKAGE_ID}::well::claim`,
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
                target: constants_1.SUPRA_UPDATE_TARGET,
                typeArguments: [constants_1.COINS_TYPE_LIST['SUI']],
                arguments: [
                    tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    tx.object(constants_1.SUPRA_HANDLER_OBJECT),
                    tx.pure(constants_1.SUPRA_ID['SUI'] ?? "", "u32"),
                ],
            });
            // update afSUI price
            tx.moveCall({
                target: "0x2480d9a3ff2c821061df22c4365316f894c6fa686fbd03ba828fe7c5bef9ad22::afsui_rule::update_price",
                arguments: [
                    tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                    tx.object("0x2f8f6d5da7f13ea37daa397724280483ed062769813b6f31e9788e59cc88994d"),
                    tx.object("0xeb685899830dd5837b47007809c76d91a098d52aabbf61e8ac467c59e5cc4610"),
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                ],
            });
            if (token === "AF_LP_SUI_SUI") {
                // update afSUI/SUI LP price using afSUI and SUI price
                tx.moveCall({
                    target: "0x928ff0be132d9bad7926008780d2a5adfefa1a24559a567dafbfd267d1b1b294::af_lp_rule::update_price",
                    typeArguments: [
                        "0x42d0b3476bc10d18732141a471d7ad3aa588a6fb4ba8e1a6608a4a7b78e171bf::af_lp::AF_LP",
                        constants_1.COINS_TYPE_LIST.SUI,
                        constants_1.COINS_TYPE_LIST.afSUI,
                    ],
                    arguments: [
                        tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                        tx.object("0x97aae7a80abb29c9feabbe7075028550230401ffe7fb745757d3c28a30437408"),
                        tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    ],
                });
            }
        }
        else {
            tx.moveCall({
                target: constants_1.SUPRA_UPDATE_TARGET,
                typeArguments: [constants_1.COINS_TYPE_LIST[token]],
                arguments: [
                    tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    tx.object(constants_1.SUPRA_HANDLER_OBJECT),
                    tx.pure(constants_1.SUPRA_ID[token] ?? "", "u32"),
                ],
            });
        }
    }
    async encodedBucketConstants() {
        /**
         * @description Get encoded BCS Bucket values
         * @returns devInspectTransactionBlock
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::constants::fee_precision`,
        });
        tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::constants::liquidation_rebate`,
        });
        tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::constants::flash_loan_fee`,
        });
        tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::constants::buck_decimal`,
        });
        tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::constants::max_lock_time`,
        });
        tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::constants::min_lock_time`,
        });
        tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::constants::min_fee`,
        });
        tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::constants::max_fee`,
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
        const bcs = new bcs_1.BCS((0, bcs_1.getSuiMoveConfig)());
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
            id: constants_1.PROTOCOL_ID,
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
                MoveEventType: `${constants_1.CORE_PACKAGE_ID}::bucket_events::BottleCreated`,
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
                MoveEventType: `${constants_1.CORE_PACKAGE_ID}::bucket_events::BottleDestroyed`,
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
                id: constants_1.PROTOCOL_ID,
                options: {
                    showContent: true,
                }
            });
            const generalInfoField = generalInfo.data?.content;
            const minBottleSize = generalInfoField.fields.min_bottle_size;
            const protocolFields = await this.client.getDynamicFields({
                parentId: constants_1.PROTOCOL_ID,
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
                const token = (0, utils_2.getCoinSymbol)(typeId);
                if (!token) {
                    return;
                }
                const fields = (0, objectTypes_1.getObjectFields)(res);
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
                parentId: constants_1.PROTOCOL_ID
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
                const fields = (0, objectTypes_1.getObjectFields)(res);
                let token = "";
                const objectType = res.data?.type;
                if (objectType) {
                    const assetType = objectType.split(",")?.[1]?.trim().split(">")?.[0]?.trim();
                    token = (0, utils_2.getCoinSymbol)(assetType ?? "") ?? "";
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
                    const bottleInfo = (0, objectTypes_1.getObjectFields)(res);
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
            constants_1.KRIYA_SUI_BUCK_LP_REGISTRY_ID,
            constants_1.KRIYA_USDC_BUCK_LP_REGISTRY_ID,
            constants_1.AF_SUI_BUCK_LP_REGISTRY_ID,
            constants_1.AF_USDC_BUCK_LP_REGISTRY_ID,
            constants_1.CETUS_SUI_BUCK_LP_REGISTRY_ID,
            constants_1.CETUS_USDC_BUCK_LP_REGISTRY_ID,
        ];
        const fountainResults = await this.client.multiGetObjects({
            ids: objectIds,
            options: {
                showContent: true,
            }
        });
        const fountains = {};
        fountainResults.map((res) => {
            const fountain = (0, convert_1.objectToFountain)(res);
            fountains[fountain.id] = fountain;
        });
        return fountains;
    }
    async getFountain(lpRegistryId) {
        /**
         * @description Get fountain information from id
         * @param lpRegistryId Fountain lp registry id
         * @returns Promise<FountainInfo>
         */
        const res = await this.client.getObject({
            id: lpRegistryId,
            options: {
                showContent: true,
            }
        });
        return (0, convert_1.objectToFountain)(res);
    }
    async getPsmTVL() {
        /**
       * @description Get all PSM's TVL
       */
        let tvlList = {};
        try {
            const objectIdList = Object.values(constants_1.PSM_POOL_IDS);
            const response = await this.client.multiGetObjects({
                ids: objectIdList,
                options: {
                    showContent: true,
                    showType: true, //Check could we get type from response later
                },
            });
            response.map((res) => {
                const fields = (0, objectTypes_1.getObjectFields)(res);
                const poolId = fields.id.id;
                const coins = Object.keys(constants_1.PSM_POOL_IDS).filter(symbol => constants_1.PSM_POOL_IDS[symbol] == poolId);
                if (coins.length > 0) {
                    const coin = coins[0];
                    tvlList[coin] = Number((0, utils_2.formatUnits)(BigInt(fields.pool), constants_1.COIN_DECIMALS[coins[0]] ?? 9));
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        return tvlList;
    }
    ;
    async getAllStrapFountains() {
        /**
         * @description Get all stake proof list from afSUI, haSUI, vSUI fountains
         * @returns Promise<StrapFountainList>
         */
        const fountainIds = Object.keys(constants_1.STRAP_FOUNTAIN_IDS);
        const objectIdList = Object.values(constants_1.STRAP_FOUNTAIN_IDS).map(t => t.objectId);
        const response = await this.client.multiGetObjects({
            ids: objectIdList,
            options: {
                showContent: true,
                showType: true, //Check could we get type from response later
            },
        });
        const fountains = {};
        for (const id in response) {
            const fountain = (0, convert_1.objectToStrapFountain)(response[id]);
            const coin = fountainIds[id];
            fountains[coin] = fountain;
        }
        return fountains;
    }
    async getStakeProofFountain(fountainId) {
        /**
         * @description Get fountain information from id
         * @param lpRegistryId Fountain lp registry id
         * @returns Promise<StrapFountainInfo>
         */
        const res = await this.client.getObject({
            id: fountainId,
            options: {
                showContent: true,
            }
        });
        return (0, convert_1.objectToStrapFountain)(res);
    }
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
                parentId: constants_1.PROTOCOL_ID
            });
            const bucketList = protocolFields.data.filter((item) => item.objectType.includes("Bucket"));
            const objectTypeList = bucketList.map((item) => item.objectType);
            const objectIdList = bucketList.map((item) => item.objectId);
            const objectNameList = (0, utils_2.getObjectNames)(objectTypeList);
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
                const bucketFields = (0, objectTypes_1.getObjectFields)(res);
                bottleIdList.push({
                    name: objectNameList[index] ?? "",
                    id: bucketFields.bottle_table.fields.table.fields.id.id,
                    surplus_id: bucketFields.surplus_bottle_table.fields.id.id,
                });
            });
            const userBottles = [];
            // Get strapIds for user address
            const { data: strapObjects } = await this.client.getOwnedObjects({
                owner: address,
                filter: {
                    StructType: constants_1.STRAP_ID,
                },
                options: {
                    showContent: true,
                    showType: true,
                }
            });
            let strapIds = strapObjects.map(strapObj => {
                let obj = (0, objectTypes_1.getObjectFields)(strapObj);
                return {
                    id: obj?.id.id,
                    type: strapObj.data?.type,
                    strap_address: obj?.id.id,
                };
            });
            // Get stakeProofIds for user address
            const { data: stakeProofs } = await this.client.getOwnedObjects({
                owner: address,
                filter: {
                    StructType: constants_1.STAKE_PROOF_ID,
                },
                options: {
                    showContent: true,
                    showType: true,
                }
            });
            strapIds = strapIds.concat(stakeProofs.map(strapObj => {
                let obj = (0, objectTypes_1.getObjectFields)(strapObj);
                return {
                    id: obj?.id.id,
                    type: strapObj.data?.type,
                    strap_address: obj?.strap_address,
                };
            }));
            // Loop bottles
            for (const bottle of bottleIdList) {
                const token = bottle.name;
                const bottleStrapIds = strapIds.filter(t => t.type?.includes(`<${constants_1.COINS_TYPE_LIST[token]}`));
                const addresses = [address, ...bottleStrapIds.map(t => t.strap_address)];
                let startUnit = 0;
                let debtAmount = 0;
                if (bottleStrapIds.length > 0) {
                    if ((token == "afSUI"
                        || token == "vSUI"
                        || token == "haSUI")
                        && constants_1.STRAP_FOUNTAIN_IDS[token]) {
                        try {
                            let lstFountain = await this.getStakeProofFountain(constants_1.STRAP_FOUNTAIN_IDS[token]?.objectId);
                            const data = await this.client
                                .getDynamicFieldObject({
                                parentId: lstFountain.strapId,
                                name: {
                                    type: "address",
                                    value: bottleStrapIds[0]?.strap_address,
                                },
                            });
                            const ret = (0, objectTypes_1.getObjectFields)(data);
                            debtAmount = Number(ret?.value.fields.debt_amount ?? 0);
                            startUnit = Number(ret?.value.fields.start_unit ?? 0);
                        }
                        catch {
                        }
                    }
                }
                for (const _address of addresses) {
                    await this.client
                        .getDynamicFieldObject({
                        parentId: bottle.id ?? "",
                        name: {
                            type: "address",
                            value: _address,
                        },
                    })
                        .then(async (bottleInfo) => {
                        const bottleInfoFields = (0, objectTypes_1.getObjectFields)(bottleInfo);
                        if (bottleInfoFields) {
                            userBottles.push({
                                token,
                                collateralAmount: bottleInfoFields.value.fields.value.fields.collateral_amount,
                                buckAmount: bottleInfoFields.value.fields.value.fields.buck_amount,
                                strapId: bottleStrapIds.find(t => t.strap_address == _address)?.id,
                                startUnit,
                                debtAmount,
                            });
                        }
                        else {
                            const surplusBottleInfo = await this.client.getDynamicFieldObject({
                                parentId: bottle.surplus_id,
                                name: {
                                    type: "address",
                                    value: _address,
                                }
                            });
                            const surplusBottleFields = (0, objectTypes_1.getObjectFields)(surplusBottleInfo);
                            const collateralAmount = surplusBottleFields?.value.fields.collateral_amount ?? 0;
                            if (collateralAmount) {
                                userBottles.push({
                                    token,
                                    collateralAmount,
                                    buckAmount: 0,
                                    strapId: bottleStrapIds.find(t => t.strap_address == _address)?.id,
                                });
                            }
                        }
                    })
                        .catch((error) => {
                        console.log("error", error);
                    });
                }
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
                parentId: constants_1.PROTOCOL_ID
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
                    StructType: `${constants_1.CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${constants_1.CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`
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
                const token = (0, utils_2.getCoinSymbol)(tankType);
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
        const tx = new transactions_1.TransactionBlock();
        const tank = tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::buck::borrow_tank`,
            typeArguments: [tankType],
            arguments: [tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT)],
        });
        const target = `${constants_1.CORE_PACKAGE_ID}::tank::get_token_weight`;
        for (const token of tokens) {
            if (!token.data) {
                continue;
            }
            tx.moveCall({
                target: target,
                typeArguments: [constants_1.COINS_TYPE_LIST.BUCK, tankType],
                arguments: [tank, tx.objectRef({
                        objectId: token.data.objectId,
                        digest: token.data.digest,
                        version: token.data.version,
                    })],
            });
        }
        const res = await this.client.devInspectTransactionBlock({
            transactionBlock: tx,
            sender: constants_1.PROTOCOL_ID,
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
            const u64 = (0, utils_2.U64FromBytes)(bytes);
            total += Number((0, utils_2.formatUnits)(u64, 9)); //BUCK decimals
        });
        return total;
    }
    async getUserTankEarn(tankType, tokens) {
        if (tokens.length == 0) {
            return 0;
        }
        const token = (0, utils_2.getCoinSymbol)(tankType);
        if (!token) {
            return 0;
        }
        const tx = new transactions_1.TransactionBlock();
        const tank = tx.moveCall({
            target: `${constants_1.CORE_PACKAGE_ID}::buck::borrow_tank`,
            typeArguments: [tankType],
            arguments: [tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT)],
        });
        const target = `${constants_1.CORE_PACKAGE_ID}::tank::get_collateral_reward_amount`;
        for (const token of tokens) {
            if (!token.data) {
                continue;
            }
            tx.moveCall({
                target: target,
                typeArguments: [constants_1.COINS_TYPE_LIST.BUCK, tankType],
                arguments: [tank, tx.objectRef({
                        objectId: token.data.objectId,
                        digest: token.data.digest,
                        version: token.data.version,
                    })],
            });
        }
        const res = await this.client.devInspectTransactionBlock({
            transactionBlock: tx,
            sender: constants_1.PROTOCOL_ID,
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
            const u64 = (0, utils_2.U64FromBytes)(bytes);
            total += Number((0, utils_2.formatUnits)(u64, constants_1.COIN_DECIMALS[token] ?? 9));
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
            constants_1.AF_USDC_BUCK_LP_REGISTRY_ID,
            constants_1.AF_SUI_BUCK_LP_REGISTRY_ID,
            constants_1.CETUS_USDC_BUCK_LP_REGISTRY_ID,
            constants_1.CETUS_SUI_BUCK_LP_REGISTRY_ID,
            constants_1.KRIYA_USDC_BUCK_LP_REGISTRY_ID,
            constants_1.KRIYA_SUI_BUCK_LP_REGISTRY_ID,
        ];
        const res = await this.client.getOwnedObjects({
            owner,
            filter: {
                MatchAny: [
                    {
                        Package: constants_1.FOUNTAIN_PACKAGE_ID,
                    },
                    {
                        Package: constants_1.KRIYA_FOUNTAIN_PACKAGE_ID,
                    }
                ]
            },
            options: {
                showContent: true,
                showType: true,
            },
        });
        const proofs = res.data.map((object) => {
            const fields = (0, objectTypes_1.getObjectFields)(object);
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
        const ids = Object.values(constants_1.SUPRA_PRICE_FEEDS);
        const objectNameList = Object.keys(constants_1.SUPRA_PRICE_FEEDS);
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
            BUCKETUS: 1,
            CETABLE: 1,
            STAPEARL: 1,
        };
        priceObjects.map((res, index) => {
            const priceFeed = (0, objectTypes_1.getObjectFields)(res);
            const priceBn = priceFeed.value.fields.value;
            const decimals = priceFeed.value.fields.decimal;
            const price = parseInt(priceBn) / Math.pow(10, decimals);
            if (objectNameList[index] == 'usdc_usd') {
                prices['USDC'] = price;
            }
            else if (objectNameList[index] == 'usdt_usd') {
                prices['USDT'] = price;
            }
            else if (objectNameList[index] == 'navx_usd') {
                prices['NAVX'] = price;
            }
            else if (objectNameList[index] == 'cetus_usd') {
                prices['CETUS'] = price;
            }
            else if (objectNameList[index] == 'eth_usdt') {
                prices['WETH'] = (prices['USDT'] ?? 1) * price;
            }
            else if (objectNameList[index] == 'sui_usdt') {
                prices['SUI'] = (prices['USDT'] ?? 1) * price;
            }
            else if (objectNameList[index] == 'vsui_sui') {
                prices['vSUI'] = (prices['SUI'] ?? 1) * price;
            }
            else if (objectNameList[index] == 'hasui_sui') {
                prices['haSUI'] = (prices['SUI'] ?? 1) * price;
            }
            else if (objectNameList[index] == 'afsui_sui') {
                prices['afSUI'] = (prices['SUI'] ?? 1) * price;
            }
        });
        return prices;
    }
    async getBorrowTx(tx, collateralType, collateralAmount, borrowAmount, recipient, isUpdateOracle, insertionPlace, strapId) {
        /**
         * @description Borrow
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param collateralAmount
         * @param borrowAmount
         * @param recipient
         * @param isNewBottle
         * @param isUpdateOracle
         * @param insertionPlace Optional
         * @returns Promise<boolean>
         */
        const token = (0, utils_2.getCoinSymbol)(collateralType);
        if (!token) {
            return false;
        }
        const [collateralInput] = await (0, utils_2.getInputCoins)(tx, this.client, recipient, collateralType, collateralAmount);
        if (!collateralInput)
            return false;
        const collateralBalance = (0, utils_2.coinIntoBalance)(tx, collateralType, collateralInput);
        if (borrowAmount == 0) {
            this.topUp(tx, collateralType, collateralBalance, strapId ? strapId : recipient, insertionPlace ? insertionPlace : recipient);
        }
        else {
            if (isUpdateOracle) {
                this.updateSupraOracle(tx, token);
            }
            const borrowRet = this.borrow(tx, collateralType, collateralBalance, tx.pure(borrowAmount, "u64"), insertionPlace ? insertionPlace : (strapId ? (strapId === "new" ? undefined : strapId) : recipient), strapId);
            if (borrowRet) {
                if (strapId === 'new') {
                    const [strap, buckOut] = borrowRet;
                    if (strap && buckOut) {
                        const buckCoinBalance = (0, utils_2.coinFromBalance)(tx, constants_1.COINS_TYPE_LIST.BUCK, buckOut);
                        tx.transferObjects([buckCoinBalance], tx.pure(recipient, "address"));
                        tx.transferObjects([strap], tx.pure(recipient, "address"));
                    }
                }
                else {
                    const buckCoinBalance = (0, utils_2.coinFromBalance)(tx, constants_1.COINS_TYPE_LIST.BUCK, borrowRet);
                    tx.transferObjects([buckCoinBalance], tx.pure(recipient, "address"));
                }
            }
        }
        ;
        return true;
    }
    async getRepayTx(tx, collateralType, repayAmount, withdrawAmount, walletAddress, insertionPlace, strapId) {
        /**
         * @description Repay
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param repayAmount
         * @param withdrawAmount
         * @param walletAddress
         * @returns Promise<boolean>
         */
        const token = (0, utils_2.getCoinSymbol)(collateralType);
        if (!token) {
            return false;
        }
        let buckCoinInput;
        if (repayAmount > 0) {
            [buckCoinInput] = await (0, utils_2.getInputCoins)(tx, this.client, walletAddress, constants_1.COINS_TYPE_LIST.BUCK, repayAmount);
        }
        else {
            buckCoinInput = await (0, utils_2.getMainCoin)(tx, this.client, walletAddress, constants_1.COINS_TYPE_LIST.BUCK);
        }
        if (!buckCoinInput)
            return false;
        this.updateSupraOracle(tx, token);
        // Fully repay
        if (repayAmount == 0) {
            if (strapId) {
                tx.moveCall({
                    target: `${constants_1.BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::fully_repay_with_strap`,
                    typeArguments: [collateralType],
                    arguments: [
                        tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                        tx.pure(strapId),
                        buckCoinInput,
                        tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    ],
                });
            }
            else {
                tx.moveCall({
                    target: `${constants_1.BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::fully_repay`,
                    typeArguments: [collateralType],
                    arguments: [
                        tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                        buckCoinInput,
                        tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    ],
                });
            }
        }
        else {
            if (strapId) {
                tx.moveCall({
                    target: `${constants_1.BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::repay_and_withdraw_with_strap`,
                    typeArguments: [collateralType],
                    arguments: [
                        tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                        tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                        tx.pure(strapId),
                        tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                        buckCoinInput,
                        tx.pure(withdrawAmount, "u64"),
                        tx.pure([insertionPlace ? insertionPlace : strapId]),
                    ],
                });
            }
            else {
                tx.moveCall({
                    target: `${constants_1.BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::repay_and_withdraw`,
                    typeArguments: [collateralType],
                    arguments: [
                        tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                        tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                        tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                        buckCoinInput,
                        tx.pure(withdrawAmount, "u64"),
                        tx.pure([insertionPlace ? insertionPlace : walletAddress]),
                    ],
                });
            }
        }
        return true;
    }
    async getSurplusWithdrawTx(tx, collateralType, walletAddress, strapId) {
        /**
         * @description Withdraw
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param walletAddress
         * @param strapId Optional
         * @returns Promise<TransactionBlock>
         */
        const token = (0, utils_2.getCoinSymbol)(collateralType);
        if (!token) {
            return tx;
        }
        const surplusCollateral = strapId ?
            tx.moveCall({
                target: `${constants_1.CORE_PACKAGE_ID}::buck::withdraw_surplus_with_strap`,
                typeArguments: [collateralType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    tx.object(strapId),
                ],
            }) :
            tx.moveCall({
                target: `${constants_1.CORE_PACKAGE_ID}::buck::withdraw_surplus_collateral`,
                typeArguments: [collateralType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                ],
            });
        const surplusCoin = (0, utils_2.coinFromBalance)(tx, collateralType, surplusCollateral);
        tx.transferObjects([surplusCoin], tx.pure(walletAddress, "address"));
        return tx;
    }
    async getPsmTx(tx, psmCoin, psmAmount, psmSwith, walletAddress) {
        /**
         * @description Get transaction for PSM
         * @param psmCoin Asset , e.g "0x2::sui::SUI"
         * @param psmAmount
         * @param psmSwith stable coin -> BUCK or not
         * @param walletAddress
         * @returns Promise<boolean>
         */
        const inputCoinType = psmSwith ? constants_1.COINS_TYPE_LIST.BUCK : constants_1.COINS_TYPE_LIST[psmCoin];
        const [inputCoin] = await (0, utils_2.getInputCoins)(tx, this.client, walletAddress, inputCoinType, psmAmount);
        const outCoinType = psmSwith ? constants_1.COINS_TYPE_LIST[psmCoin] : constants_1.COINS_TYPE_LIST.BUCK;
        const inputCoinBalance = (0, utils_2.coinIntoBalance)(tx, inputCoinType, inputCoin);
        if (psmSwith) {
            const outBalance = tx.moveCall({
                target: `${constants_1.CORE_PACKAGE_ID}::buck::discharge_reservoir`,
                typeArguments: [outCoinType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    inputCoinBalance
                ],
            });
            const coinOut = (0, utils_2.coinFromBalance)(tx, outCoinType, outBalance);
            tx.transferObjects([coinOut], tx.pure(walletAddress, "address"));
        }
        else {
            const outBalance = tx.moveCall({
                target: `${constants_1.CORE_PACKAGE_ID}::buck::charge_reservoir`,
                typeArguments: [inputCoinType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    inputCoinBalance
                ],
            });
            const coinOut = (0, utils_2.coinFromBalance)(tx, outCoinType, outBalance);
            tx.transferObjects([coinOut], tx.pure(walletAddress, "address"));
        }
        return true;
    }
    async getRedeemTx(tx, collateralType, redeemAmount, walletAddress, insertionPlace) {
        /**
         * @description Get transaction for Redeem
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param redeemAmount
         * @param walletAddress
         * @param insertionPlace  Optional
         * @returns Promise<boolean>
         */
        const token = (0, utils_2.getCoinSymbol)(collateralType) ?? "";
        const [buckCoinInput] = await (0, utils_2.getInputCoins)(tx, this.client, walletAddress, constants_1.COINS_TYPE_LIST.BUCK, redeemAmount);
        if (!buckCoinInput)
            return false;
        this.updateSupraOracle(tx, token);
        tx.moveCall({
            target: `${constants_1.BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::redeem`,
            typeArguments: [collateralType],
            arguments: [
                tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                buckCoinInput,
                tx.pure(insertionPlace ? [insertionPlace] : []),
            ],
        });
        return true;
    }
    async getTankDepositTx(tx, tankType, depositAmount, walletAddress) {
        /**
         * @description Get transaction for deposit token to tank
         * @param tankType Asset , e.g "0x2::sui::SUI"
         * @param depositAmount
         * @param walletAddress
         * @returns Promise<boolean>
         */
        const [buckCoinInput] = await (0, utils_2.getInputCoins)(tx, this.client, walletAddress, constants_1.COINS_TYPE_LIST.BUCK, depositAmount);
        if (!buckCoinInput)
            return false;
        tx.moveCall({
            target: `${constants_1.BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::deposit`,
            typeArguments: [tankType],
            arguments: [
                tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                buckCoinInput
            ],
        });
        return true;
    }
    async getTankWithdrawTx(tx, tankType, withdrawAmount, walletAddress) {
        /**
         * @description Get transaction for withdraw token from tank
         * @param tankType Asset , e.g "0x2::sui::SUI"
         * @param withdrawAmount
         * @param walletAddress
         * @returns Promise<boolean>
         */
        const token = (0, utils_2.getCoinSymbol)(tankType);
        if (!token) {
            return false;
        }
        const { data: contributorTokens } = await this.client.getOwnedObjects({
            owner: walletAddress,
            filter: {
                StructType: `${constants_1.CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${constants_1.CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`
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
            target: `${constants_1.BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::withdraw`,
            typeArguments: [tankType],
            arguments: [
                tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                tx.sharedObjectRef(constants_1.ORACLE_OBJECT),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                tx.sharedObjectRef(constants_1.TREASURY_OBJECT),
                tokenObjs,
                tx.pure((0, utils_2.parseBigInt)(`${withdrawAmount ?? 0}`, 9), "u64"),
            ],
        });
        return true;
    }
    async getTankClaimTx(tx, tankType, walletAddress) {
        /**
         * @description Get transaction for claim token from tank
         * @param tankType Asset , e.g "0x2::sui::SUI"
         * @param walletAddress
         * @returns Promise<boolean>
         */
        const token = (0, utils_2.getCoinSymbol)(tankType);
        if (!token) {
            return false;
        }
        const { data: contributorTokens } = await this.client.getOwnedObjects({
            owner: walletAddress,
            filter: {
                StructType: `${constants_1.CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${constants_1.CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`
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
            return false;
        for (const token of tokens) {
            tx.moveCall({
                target: `${constants_1.BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::claim`,
                typeArguments: [tankType],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    tx.sharedObjectRef(constants_1.TREASURY_OBJECT),
                    token,
                ],
            });
        }
        return true;
    }
    async getStakeUsdcTx(tx, isAf, stakeAmount, walletAddress) {
        /**
         * @description Get transaction for stake token to pool
         * @param isAf Boolean value for Aftermath or not
         * @param stakeAmount
         * @param walletAddress
         * @returns Promise<boolean>
         */
        const [stakeCoinInput] = await (0, utils_2.getInputCoins)(tx, this.client, walletAddress, constants_1.COINS_TYPE_LIST.USDC, stakeAmount);
        if (!stakeCoinInput)
            return false;
        if (isAf) {
            tx.moveCall({
                target: `${constants_1.FOUNTAIN_PERIHERY_PACKAGE_ID}::aftermath_fountain::stake`,
                typeArguments: [constants_1.COINS_TYPE_LIST.AF_LP_USDC_BUCK, constants_1.COINS_TYPE_LIST.USDC],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    tx.object(constants_1.AF_OBJS.pool),
                    tx.object(constants_1.AF_OBJS.poolRegistry),
                    tx.object(constants_1.AF_OBJS.protocolFeeVault),
                    tx.object(constants_1.AF_OBJS.treasury),
                    tx.object(constants_1.AF_OBJS.insuranceFund),
                    tx.object(constants_1.AF_OBJS.referralVault),
                    tx.sharedObjectRef(constants_1.AF_USDC_BUCK_LP_REGISTRY),
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    stakeCoinInput,
                    tx.pure(walletAddress, "address"),
                ]
            });
        }
        else {
            tx.moveCall({
                target: `${constants_1.FOUNTAIN_PERIHERY_PACKAGE_ID}::cetus_fountain::stake`,
                typeArguments: [constants_1.COINS_TYPE_LIST.USDC],
                arguments: [
                    tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                    tx.sharedObjectRef(constants_1.CETUS_USDC_BUCK_LP_REGISTRY),
                    tx.sharedObjectRef(constants_1.BUCKETUS_TREASURY),
                    tx.sharedObjectRef(constants_1.BUCKETUS_LP_VAULT_05),
                    tx.object(constants_1.CETUS_OBJS.globalConfig),
                    tx.object(constants_1.CETUS_OBJS.buckUsdcPool),
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    stakeCoinInput,
                    tx.pure(walletAddress, "address"),
                ]
            });
        }
        return true;
    }
    async getAfUnstakeTx(tx, fountainId, lpProof, recipient) {
        /**
         * @description Get transaction for unstake token from AF pool
         * @param fountainId
         * @param lpProof UserLpProof object
         * @param recipient Recipient address
         * @returns Promise<boolean>
         */
        const [stakeType, rewardType] = (0, utils_2.proofTypeToCoinType)(lpProof.typeName);
        const [afLpBalance, rewardBalance] = tx.moveCall({
            target: "0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_core::force_unstake",
            typeArguments: [stakeType, rewardType],
            arguments: [
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                tx.object(fountainId),
                tx.objectRef((0, utils_2.lpProofToObject)(lpProof)),
            ]
        });
        const afLpCoin = (0, utils_2.coinFromBalance)(tx, constants_1.COINS_TYPE_LIST.AF_LP_USDC_BUCK, afLpBalance);
        const rewardCoin = (0, utils_2.coinFromBalance)(tx, constants_1.COINS_TYPE_LIST.SUI, rewardBalance);
        const [buckCoin, usdcCoin] = tx.moveCall({
            target: "0xefe170ec0be4d762196bedecd7a065816576198a6527c99282a2551aaa7da38c::withdraw::all_coin_withdraw_2_coins",
            typeArguments: [constants_1.COINS_TYPE_LIST.AF_LP_USDC_BUCK, constants_1.COINS_TYPE_LIST.BUCK, constants_1.COINS_TYPE_LIST.USDC],
            arguments: [
                tx.object(constants_1.AF_OBJS.pool),
                tx.object(constants_1.AF_OBJS.poolRegistry),
                tx.object(constants_1.AF_OBJS.protocolFeeVault),
                tx.object(constants_1.AF_OBJS.treasury),
                tx.object(constants_1.AF_OBJS.insuranceFund),
                tx.object(constants_1.AF_OBJS.referralVault),
                afLpCoin,
            ],
        });
        tx.transferObjects([buckCoin, usdcCoin, rewardCoin], tx.pure(recipient, "address"));
        return true;
    }
    async getKriyaUnstakeTx(tx, fountainId, lpProof) {
        /**
         * @description Get transaction for unstake token from Kriya pool
         * @param fountainId
         * @param lpProof UserLpProof object
         * @returns Promise<boolean>
         */
        tx.moveCall({
            target: "0x4379259b0f0f547b84ec1c81d704f24861edd8afd8fa6bb9c082e44fbf97a27a::fountain_periphery::force_unstake",
            typeArguments: (0, utils_2.proofTypeToCoinType)(lpProof.typeName),
            arguments: [
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                tx.object(fountainId),
                tx.objectRef((0, utils_2.lpProofToObject)(lpProof)),
            ]
        });
        return true;
    }
    async getCetusUnstakeTx(tx, fountainId, lpProof, walletAddress) {
        /**
         * @description Get transaction for unstake token from Cetus pool
         * @param fountainId
         * @param lpProof UserLpProof object
         * @param walletAddress
         * @returns Promise<boolean>
         */
        const [bucketusOut, suiReward] = tx.moveCall({
            target: "0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_core::force_unstake",
            typeArguments: [constants_1.COINS_TYPE_LIST.BUCKETUS, constants_1.COINS_TYPE_LIST.SUI],
            arguments: [
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                tx.object(fountainId),
                tx.objectRef((0, utils_2.lpProofToObject)(lpProof)),
            ],
        });
        const suiCoin = (0, utils_2.coinFromBalance)(tx, constants_1.COINS_TYPE_LIST.SUI, suiReward);
        const bucketusCoin = (0, utils_2.coinFromBalance)(tx, constants_1.COINS_TYPE_LIST.BUCKETUS, bucketusOut);
        const [buckCoin, usdcCoin] = tx.moveCall({
            target: "0x8da48ef1e49dcb81631ce468df5c273d2f8eb5770af4d27ec2f1049bc8a61f75::bucketus::withdraw",
            typeArguments: [constants_1.COINS_TYPE_LIST.BUCK, constants_1.COINS_TYPE_LIST.USDC],
            arguments: [
                tx.sharedObjectRef(constants_1.BUCKETUS_TREASURY),
                tx.sharedObjectRef(constants_1.BUCKETUS_LP_VAULT_05),
                tx.object(constants_1.CETUS_OBJS.globalConfig),
                tx.object(constants_1.CETUS_OBJS.buckUsdcPool),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                bucketusCoin,
            ],
        });
        tx.transferObjects([buckCoin, usdcCoin, suiCoin], tx.pure(walletAddress, "address"));
        return true;
    }
    async getAfClaimTx(tx, fountainId, lpProofs) {
        /**
         * @description Get transaction for claim token from AF pool
         * @param fountainId
         * @param lpProof UserLpProof object
         * @returns Promise<boolean>
         */
        for (const lpProof of lpProofs) {
            const [stakeType, rewardType] = (0, utils_2.proofTypeToCoinType)(lpProof.typeName);
            tx.moveCall({
                target: `${constants_1.FOUNTAIN_PACKAGE_ID}::fountain_periphery::claim`,
                typeArguments: [stakeType, rewardType],
                arguments: [
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    tx.object(fountainId),
                    tx.objectRef((0, utils_2.lpProofToObject)(lpProof)),
                ]
            });
        }
        return true;
    }
    async getCetusClaimTx(tx, fountainId, lpProofs, walletAddress) {
        /**
         * @description Get transaction for claim token from Cetus pool
         * @param fountainId
         * @param lpProofs UserLpProof objects array
         * @param walletAddress
         * @returns Promise<boolean>
         */
        for (const lpProof of lpProofs) {
            tx.moveCall({
                target: `${constants_1.FOUNTAIN_PERIHERY_PACKAGE_ID}::cetus_fountain::claim`,
                arguments: [
                    tx.object(fountainId),
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    tx.objectRef((0, utils_2.lpProofToObject)(lpProof)),
                    tx.pure(walletAddress, "address"),
                ],
            });
        }
        return true;
    }
    async getKriyaClaimTx(tx, fountainId, lpProofs) {
        /**
         * @description Get transaction for claim token from Kriya pool
         * @param fountainId
         * @param lpProofs UserLpProof object array
         * @param walletAddress
         * @returns Promise<boolean>
         */
        for (const lpProof of lpProofs) {
            tx.moveCall({
                target: `${constants_1.KRIYA_FOUNTAIN_PACKAGE_ID}::fountain_periphery::claim`,
                typeArguments: (0, utils_2.proofTypeToCoinType)(lpProof.typeName),
                arguments: [
                    tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                    tx.object(fountainId),
                    tx.objectRef((0, utils_2.lpProofToObject)(lpProof)),
                ],
            });
        }
        return true;
    }
    async getStrapStakeTx(tx, collateralType, strapId, address) {
        /**
         * @description Get transaction for stake token to strap fountain
         * @param collateralType
         * @param strapId
         * @param address
         * @returns Promise<boolean>
         */
        const coin = (0, utils_2.getCoinSymbol)(collateralType);
        if (!coin || !constants_1.STRAP_FOUNTAIN_IDS[coin]) {
            return false;
        }
        const proof = tx.moveCall({
            target: `${constants_1.STRAP_FOUNTAIN_PACKAGE_ID}::fountain::stake`,
            typeArguments: [collateralType, constants_1.COINS_TYPE_LIST.SUI],
            arguments: [
                tx.sharedObjectRef(constants_1.STRAP_FOUNTAIN_IDS[coin]),
                tx.sharedObjectRef(constants_1.PROTOCOL_OBJECT),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                typeof strapId === "string" ? tx.object(strapId) : strapId,
            ]
        });
        tx.transferObjects([proof], tx.pure.address(address));
        return true;
    }
    async getStrapUnstakeTx(tx, collateralType, strapId, address) {
        /**
         * @description Get transaction for unstake token from strap fountain
         * @param collateralType
         * @param strapId
         * @param address
         * @returns Promise<boolean>
         */
        const coin = (0, utils_2.getCoinSymbol)(collateralType);
        if (!coin || !constants_1.STRAP_FOUNTAIN_IDS[coin]) {
            return false;
        }
        const proof = tx.moveCall({
            target: `${constants_1.STRAP_FOUNTAIN_PACKAGE_ID}::fountain::unstake`,
            typeArguments: [collateralType, constants_1.COINS_TYPE_LIST.SUI],
            arguments: [
                tx.sharedObjectRef(constants_1.STRAP_FOUNTAIN_IDS[coin]),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                typeof strapId === "string" ? tx.object(strapId) : strapId,
            ]
        });
        tx.transferObjects([proof], tx.pure.address(address));
        return true;
    }
    async getStrapClaimTx(tx, collateralType, strapId, address) {
        /**
         * @description Get transaction for claim token from strap fountain
         * @param collateralType
         * @param strapId
         * @param address
         * @returns Promise<boolean>
         */
        const coin = (0, utils_2.getCoinSymbol)(collateralType);
        if (!coin || !constants_1.STRAP_FOUNTAIN_IDS[coin]) {
            return false;
        }
        const reward = tx.moveCall({
            target: `${constants_1.STRAP_FOUNTAIN_PACKAGE_ID}::fountain::claim`,
            typeArguments: [collateralType, constants_1.COINS_TYPE_LIST.SUI],
            arguments: [
                tx.sharedObjectRef(constants_1.STRAP_FOUNTAIN_IDS[coin]),
                tx.sharedObjectRef(constants_1.CLOCK_OBJECT),
                typeof strapId === "string" ? tx.object(strapId) : strapId,
            ]
        });
        tx.transferObjects([reward], tx.pure.address(address));
        return true;
    }
}
exports.BucketClient = BucketClient;
//# sourceMappingURL=client.js.map