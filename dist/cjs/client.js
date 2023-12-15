"use strict";
// Copyright Andrei <andreid.dev@gmail.com>
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketClient = void 0;
const transactions_1 = require("@mysten/sui.js/transactions");
const utils_1 = require("@mysten/sui.js/utils");
const bcs_1 = require("@mysten/bcs");
const objectTypes_1 = require("./objects/objectTypes");
const constants_1 = require("./utils/constants");
const DUMMY_ADDRESS = (0, utils_1.normalizeSuiAddress)("0x0");
const packageAddress = { "mainnet": constants_1.MAINNET_PACKAGE_ID, "testnet": constants_1.TESTNET_PACKAGE_ID };
class BucketClient {
    currentAddress;
    /**
     * @description a TS wrapper over Bucket Protocol Move packages.
     * @param client connection to fullnode
     * @param currentAddress (optional) address of the current user (default: DUMMY_ADDRESS)
     */
    client;
    packageType;
    constructor(client, options, currentAddress = DUMMY_ADDRESS) {
        this.currentAddress = currentAddress;
        this.client = client;
        this.packageType = options?.packageType ?? "mainnet";
    }
    async depositToTank(assetBuck, assetType, tankId, depositAmount) {
        /**
         * @description Deposit BUCK into tank
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id to deposit to , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param depositAmount BUCK amount to deposit into tank
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::tank::deposit`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(depositAmount)],
        });
        return tx;
    }
    async absorbFromTank(assetBuck, assetType, tankId, collteralInput, debtAmount) {
        /**
         * @description Offset the specified debt against the BUCK contained in the Tank
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param collteralInput The collateral to add to the tank
         * @param debtAmount The amount of debt to offset
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
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
    async withdrawFromTank(assetBuck, assetType, tankId, contributorToken) {
        /**
         * @description Withdraw BUCK and collateral gain from the Tank
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param contributorToken The contributor token
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::tank::withdraw`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(contributorToken)],
        });
        return tx;
    }
    async claimFromTank(assetBuck, assetType, tankId, contributorToken) {
        /**
         * @description Claim collateral gain and BKT reward from the Tank
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param contributorToken The contributor token
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::tank::claim`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(contributorToken)],
        });
        return tx;
    }
    async claimBkt(assetBuck, assetType, tankId, contributorToken) {
        /**
         * @description Claim BKT reward earned by a deposit since its last snapshots were taken
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param contributorToken The contributor token
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::tank::claim_bkt`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(contributorToken)],
        });
        return tx;
    }
    async borrow(assetType, protocol, oracle, collateralInput, bucketOutputAmount, insertionPlace) {
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
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::buck::borrow`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.object(oracle),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
                tx.pure(collateralInput),
                tx.pure(bucketOutputAmount),
                tx.pure([insertionPlace]),
            ],
        });
        return tx;
    }
    async topUp(assetType, protocol, collateralInput, forAddress, insertionPlace) {
        /**
         * @description Top up function
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param protocol Protocol id
         * @param collateralInput collateral input
         * @param forAddress
         * @param insertionPlace
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
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
    async withdraw(assetType, protocol, oracle, collateralAmount, insertionPlace) {
        /**
         * @description withdraw
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param protocol Protocol id
         * @param oracle
         * @param collateralAmount
         * @param insertionPlace
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::buck::withdraw`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.object(oracle),
                tx.pure(utils_1.SUI_CLOCK_OBJECT_ID),
                tx.pure(collateralAmount),
                tx.pure([insertionPlace]),
            ],
        });
        return tx;
    }
    async repay(assetType, protocol, buckInput) {
        /**
         * @description Repay borrowed amount
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param protocol Protocol id
         * @param buckInput Amount to be repaid
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::buck::repay`,
            typeArguments: [assetType],
            arguments: [tx.object(protocol), tx.pure(buckInput)],
        });
        return tx;
    }
    async redeem(assetType, protocol, oracle, buckInput, insertionPlace) {
        /**
         * @description redeem
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param protocol Protocol id
         * @param oracle
         * @param buckInput
         * @param insertionPlace
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::buck::redeem`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.object(oracle),
                tx.pure(utils_1.SUI_CLOCK_OBJECT_ID),
                tx.pure(buckInput),
                tx.pure([insertionPlace]),
            ],
        });
        return tx;
    }
    async stake(assetType, well, bktInput, lockTime) {
        /**
         * @description stake to well
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param well well object
         * @param bktInput Amount to stake
         * @param lockTime Locked time for staking
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::well::stake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(bktInput),
                tx.pure(lockTime),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID)
            ],
        });
        return tx;
    }
    async unstake(assetType, well, stakedBkt) {
        /**
         * @description unstake from well
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param well well object
         * @param stakedBkt Amount to stake
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::well::unstake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(stakedBkt),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID)
            ],
        });
        return tx;
    }
    async forceUnstake(assetType, well, bktTreasury, stakedBkt) {
        /**
         * @description forced unstake from well
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param well well object
         * @param stakedBkt Amount to stake
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::well::force_unstake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.object(bktTreasury),
                tx.pure(stakedBkt),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID)
            ],
        });
        return tx;
    }
    async claimFromWell(assetType, well, stakedBkt) {
        /**
         * @description claim from well
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param well well object
         * @param stakedBkt Staked BKT
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
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
    async getAllBottles() {
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
                MoveEventType: `${packageAddress[this.packageType]}::bucket_events::BottleDestroyed`,
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
    async encodedBucketConstants() {
        /**
         * @description Get encoded BCS Bucket values
         * @returns devInspectTransactionBlock
         */
        const tx = new transactions_1.TransactionBlock();
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
        let bucketObject = {};
        bucketObject = {
            ...bucketObject,
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
    async getAllBuckets() {
        /**
       * @description Get all buckets
       */
        try {
            const protocolFields = await this.client.getDynamicFields({
                parentId: constants_1.PROTOCOL_ID,
            });
            const bucketList = protocolFields.data.filter((item) => item.objectType.includes("Bucket"));
            const objectTypeList = bucketList.map((item) => item.objectType);
            const accept_coin_type = Object.values(constants_1.MARKET_COINS_TYPE_LIST);
            const accept_coin_name = Object.keys(constants_1.MARKET_COINS_TYPE_LIST);
            const coinTypeList = objectTypeList.map((type) => type.split("<").pop()?.replace(">", "") ?? "");
            const objectNameList = [];
            coinTypeList.forEach((type) => {
                const typeIndex = accept_coin_type.indexOf(type);
                const coinName = accept_coin_name[typeIndex];
                objectNameList.push(coinName ?? "");
            });
            const objectIdList = bucketList.map((item) => item.objectId);
            const respones = await this.client.multiGetObjects({
                ids: objectIdList,
                options: {
                    showContent: true,
                    showType: true, //Check could we get type from response later
                },
            });
            const bucketInfoList = {};
            respones.map((res, index) => {
                const fields = (0, objectTypes_1.getObjectFields)(res);
                const bucketInfo = {
                    baseFeeRate: Number(fields.base_fee_rate ?? 5_000),
                    bottleTableSize: fields.bottle_table.fields.table.fields.size ?? "",
                    collateralDecimal: fields.collateral_decimal ?? 0,
                    collateralVault: fields.collateral_vault ?? "",
                    latestRedemptionTime: Number(fields.latest_redemption_time ?? 0),
                    minCollateralRatio: fields.min_collateral_ratio ?? "",
                    mintedBuckAmount: fields.minted_buck_amount ?? "",
                    minBottleSize: fields.min_bottle_size ?? "",
                    recoveryModeThreshold: fields.recovery_mode_threshold ?? "",
                };
                bucketInfoList[objectNameList[index] ?? ""] = bucketInfo;
            });
            return bucketInfoList;
        }
        catch (error) {
            return {};
        }
    }
    ;
    async getUserBottle(address) {
        /**
       * @description Get bucket constants (decoded BCS values)
       * @address User address that belong to bottle
       */
        if (!address)
            return null;
        try {
            const protocolFields = await this.client.getDynamicFields({
                parentId: constants_1.PROTOCOL_ID,
            });
            const bucketList = protocolFields.data.filter((item) => item.objectType.includes("Bucket"));
            const objectTypeList = bucketList.map((item) => item.objectType);
            const accept_coin_type = Object.values(constants_1.MARKET_COINS_TYPE_LIST);
            const accept_coin_name = Object.keys(constants_1.MARKET_COINS_TYPE_LIST);
            const coinTypeList = objectTypeList.map((type) => type.split("<").pop()?.replace(">", "") ?? "");
            const objectNameList = [];
            coinTypeList.forEach((type) => {
                const typeIndex = accept_coin_type.indexOf(type);
                const coinName = accept_coin_name[typeIndex];
                objectNameList.push(coinName ?? "");
            });
            const objectIdList = bucketList.map((item) => item.objectId);
            const respones = await this.client.multiGetObjects({
                ids: objectIdList,
                options: {
                    showContent: true,
                    showType: true, //Check could we get type from response later
                },
            });
            const bottleIdList = [];
            respones.map((res, index) => {
                //Filter out WBTC and WETH
                //When we launch WBTC and WETH, we need to remove this exception
                if (objectNameList[index] === "WBTC" || objectNameList[index] === "WETH")
                    return;
                const bucketFields = (0, objectTypes_1.getObjectFields)(res);
                bottleIdList.push({
                    name: objectNameList[index] ?? "",
                    id: bucketFields.bottle_table.fields.table.fields.id.id,
                    dec: bucketFields.collateral_decimal,
                });
            });
            const bottleAmountsList = {};
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
                    const bottleInfoFields = (0, objectTypes_1.getObjectFields)(bottleInfo);
                    if (!bottleInfoFields) {
                        bottleAmountsList[bottle.name ?? ""] = {
                            collateralAmount: 0,
                            buckAmount: 0,
                            decimals: bottle.dec,
                        };
                    }
                    else {
                        bottleAmountsList[bottle.name ?? ""] = {
                            collateralAmount: bottleInfoFields.value.fields.value.fields.collateral_amount,
                            buckAmount: bottleInfoFields.value.fields.value.fields.buck_amount,
                            decimals: bottle.dec,
                        };
                    }
                })
                    .catch((error) => {
                    console.log("error", error);
                });
            }
            return bottleAmountsList;
        }
        catch (error) {
            return {};
        }
    }
    ;
}
exports.BucketClient = BucketClient;
