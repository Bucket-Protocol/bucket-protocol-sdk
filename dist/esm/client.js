// Copyright Andrei <andreid.dev@gmail.com>
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { normalizeSuiAddress } from "@mysten/sui.js/utils";
import { BCS, getSuiMoveConfig } from "@mysten/bcs";
import { getObjectFields } from "./objects/objectTypes";
import { COINS_TYPE_LIST, PROTOCOL_ID, SUPRA_PRICE_FEEDS, HASUI_APY_URL, AFSUI_APY_URL, SUPRA_UPDATE_TARGET, SUPRA_HANDLER_OBJECT, SUPRA_ID, TREASURY_OBJECT, BUCKET_OPERATIONS_PACKAGE_ID, CONTRIBUTOR_TOKEN_ID, CORE_PACKAGE_ID, COIN_DECIMALS, FOUNTAIN_PERIHERY_PACKAGE_ID, AF_OBJS, AF_USDC_BUCK_LP_REGISTRY_ID, BUCKETUS_TREASURY, BUCKETUS_LP_VAULT, CETUS_OBJS, CETUS_USDC_BUCK_LP_REGISTRY_ID, KRIYA_SUI_BUCK_LP_REGISTRY_ID, KRIYA_USDC_BUCK_LP_REGISTRY_ID, AF_SUI_BUCK_LP_REGISTRY_ID, CETUS_SUI_BUCK_LP_REGISTRY_ID, FOUNTAIN_PACKAGE_ID, KRIYA_FOUNTAIN_PACKAGE_ID, CETUS_USDC_BUCK_LP_REGISTRY, ORACLE_OBJECT, CLOCK_OBJECT, AF_USDC_BUCK_LP_REGISTRY, PROTOCOL_OBJECT, PSM_POOL_IDS } from "./constants";
import { U64FromBytes, coinFromBalance, coinIntoBalance, formatUnits, getCoinSymbol, getObjectNames, lpProofToObject, parseBigInt, proofTypeToCoinType } from "./utils";
const DUMMY_ADDRESS = normalizeSuiAddress("0x0");
export class BucketClient {
    owner;
    /**
     * @description a TS wrapper over Bucket Protocol Move packages.
     * @param client connection to fullnode
     * @param owner (optional) address of the current user (default: DUMMY_ADDRESS)
     */
    client;
    constructor(client, owner = DUMMY_ADDRESS) {
        this.owner = owner;
        this.client = client;
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::tank::deposit`,
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::tank::absorb`,
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::tank::withdraw`,
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::tank::claim`,
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::tank::claim_bkt`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(contributorToken)],
        });
        return tx;
    }
    async borrow(assetType, protocol, collateralInput, bucketOutputAmount, insertionPlace) {
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
            target: `${CORE_PACKAGE_ID}::buck::borrow`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.object(ORACLE_OBJECT),
                tx.object(CLOCK_OBJECT),
                collateralInput,
                tx.pure(bucketOutputAmount, "u64"),
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::buck::top_up`,
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::buck::withdraw`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.object(oracle),
                tx.pure(CLOCK_OBJECT),
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::buck::repay`,
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::buck::redeem`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.object(oracle),
                tx.pure(CLOCK_OBJECT),
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::well::stake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(bktInput),
                tx.pure(lockTime),
                tx.object(CLOCK_OBJECT)
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::well::unstake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(stakedBkt),
                tx.object(CLOCK_OBJECT)
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::well::force_unstake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.object(bktTreasury),
                tx.pure(stakedBkt),
                tx.object(CLOCK_OBJECT)
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
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${CORE_PACKAGE_ID}::well::claim`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(stakedBkt),
            ],
        });
        return tx;
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
            };
        });
        return fountains;
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
                    let coin = coins[0];
                    tvlList[coin] = Number(formatUnits(BigInt(fields.pool), COIN_DECIMALS[coin] ?? 9));
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
                //Filter out WBTC and WETH
                //When we launch WBTC and WETH, we need to remove this exception
                if (objectNameList[index] === "WBTC" || objectNameList[index] === "WETH")
                    return;
                const bucketFields = getObjectFields(res);
                bottleIdList.push({
                    name: objectNameList[index] ?? "",
                    id: bucketFields.bottle_table.fields.table.fields.id.id,
                });
            });
            const userBottles = [];
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
                    const bottleInfoFields = getObjectFields(bottleInfo);
                    if (bottleInfoFields) {
                        userBottles.push({
                            token: bottle.name ?? "",
                            collateralAmount: bottleInfoFields.value.fields.value.fields.collateral_amount,
                            buckAmount: bottleInfoFields.value.fields.value.fields.buck_amount,
                        });
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
            arguments: [tx.object(PROTOCOL_OBJECT)],
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
            arguments: [tx.object(PROTOCOL_OBJECT)],
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
    async getAPYs() {
        /**
         * @description Get APYs for vSUI, afSUI, haSUI
        */
        let apys = {
            vSUI: 4.2 // Use constant value
        };
        // Get haSUI APY
        try {
            const response = await (await fetch(HASUI_APY_URL)).json();
            apys["haSUI"] = response.data.apy;
        }
        catch (error) {
            // console.log(error);
        }
        // Get afSUI APY
        try {
            const apy = await (await fetch(AFSUI_APY_URL)).text();
            apys["afSUI"] = parseFloat(apy) * 100;
        }
        catch (error) {
            // console.log(error);
        }
        return apys;
    }
    async getBorrowTx(tx, isNewBottle, collateralType, collateralAmount, borrowAmount, walletAddress) {
        /**
         * @description Borrow
         * @param isNewBottle
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param collateralAmount
         * @param borrowAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const token = getCoinSymbol(collateralType);
        if (!token) {
            return tx;
        }
        const { data: coins } = await this.client.getCoins({
            owner: walletAddress,
            coinType: collateralType,
        });
        let collateralCoinInput = undefined;
        if (collateralType === COINS_TYPE_LIST.SUI) {
            collateralCoinInput = tx.splitCoins(tx.gas, [
                tx.pure(collateralAmount, "u64"),
            ]);
        }
        else {
            const [mainCoin, ...otherCoins] = coins
                .filter((coin) => coin.coinType === collateralType)
                .map((coin) => tx.objectRef({
                objectId: coin.coinObjectId,
                digest: coin.digest,
                version: coin.version,
            }));
            if (mainCoin) {
                if (otherCoins.length > 0) {
                    tx.mergeCoins(mainCoin, otherCoins);
                    collateralCoinInput = tx.splitCoins(mainCoin, [
                        tx.pure(collateralAmount, "u64"),
                    ]);
                }
                else {
                    collateralCoinInput = tx.splitCoins(mainCoin, [
                        tx.pure(collateralAmount, "u64"),
                    ]);
                }
            }
        }
        if (!collateralCoinInput)
            return tx;
        if (borrowAmount == 0) {
            tx.moveCall({
                target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::top_up`,
                typeArguments: [collateralType],
                arguments: [
                    tx.object(PROTOCOL_OBJECT),
                    collateralCoinInput,
                    tx.pure(walletAddress, "address"),
                    isNewBottle ?
                        tx.pure([]) :
                        tx.pure([walletAddress]),
                ],
            });
        }
        else {
            tx.moveCall({
                target: SUPRA_UPDATE_TARGET,
                typeArguments: [collateralType],
                arguments: [
                    tx.object(ORACLE_OBJECT),
                    tx.object(CLOCK_OBJECT),
                    tx.object(SUPRA_HANDLER_OBJECT),
                    tx.pure(SUPRA_ID[token] ?? "", "u32"),
                ],
            });
            tx.moveCall({
                target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::borrow`,
                typeArguments: [collateralType],
                arguments: [
                    tx.object(PROTOCOL_OBJECT),
                    tx.object(ORACLE_OBJECT),
                    tx.object(CLOCK_OBJECT),
                    collateralCoinInput,
                    tx.pure(borrowAmount, "u64"),
                    isNewBottle ?
                        tx.pure([]) :
                        tx.pure([walletAddress]),
                ],
            });
        }
        ;
        return tx;
    }
    async getRepayTx(tx, collateralType, repayAmount, withdrawAmount, walletAddress) {
        /**
         * @description Repay
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param repayAmount
         * @param withdrawAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const token = getCoinSymbol(collateralType);
        if (!token) {
            return tx;
        }
        const { data: coins } = await this.client.getCoins({
            owner: walletAddress,
            coinType: COINS_TYPE_LIST.BUCK,
        });
        let buckCoinInput = undefined;
        const [mainCoin, ...otherCoins] = coins
            .filter((coin) => coin.coinType === COINS_TYPE_LIST.BUCK)
            .map((coin) => tx.objectRef({
            objectId: coin.coinObjectId,
            digest: coin.digest,
            version: coin.version,
        }));
        if (mainCoin) {
            if (otherCoins.length !== 0)
                tx.mergeCoins(mainCoin, otherCoins);
            buckCoinInput = tx.splitCoins(mainCoin, [
                tx.pure(repayAmount, "u64"),
            ]);
        }
        if (!buckCoinInput)
            return tx;
        tx.moveCall({
            target: SUPRA_UPDATE_TARGET,
            typeArguments: [collateralType],
            arguments: [
                tx.object(ORACLE_OBJECT),
                tx.object(CLOCK_OBJECT),
                tx.object(SUPRA_HANDLER_OBJECT),
                tx.pure(SUPRA_ID[token] ?? "", "u32"),
            ],
        });
        tx.moveCall({
            target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::repay_and_withdraw`,
            typeArguments: [collateralType],
            arguments: [
                tx.object(PROTOCOL_OBJECT),
                tx.object(ORACLE_OBJECT),
                tx.object(CLOCK_OBJECT),
                buckCoinInput,
                tx.pure(withdrawAmount, "u64"),
                tx.pure([walletAddress]),
            ],
        });
        return tx;
    }
    async getTankDepositTx(tx, tankType, depositAmount, walletAddress) {
        /**
         * @description Get transaction for deposit token to tank
         * @param tankType Asset , e.g "0x2::sui::SUI"
         * @param depositAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const { data: coins } = await this.client.getCoins({
            owner: walletAddress,
            coinType: COINS_TYPE_LIST.BUCK,
        });
        const [mainCoin, ...otherCoins] = coins.map((coin) => tx.objectRef({
            objectId: coin.coinObjectId,
            digest: coin.digest,
            version: coin.version,
        }));
        if (!mainCoin)
            return tx;
        if (otherCoins.length > 0) {
            tx.mergeCoins(mainCoin, otherCoins);
        }
        const buckCoinInput = tx.splitCoins(mainCoin, [
            tx.pure(depositAmount * 10 ** 9, "u64"),
        ]);
        if (!buckCoinInput)
            return tx;
        tx.moveCall({
            target: `${BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::deposit`,
            typeArguments: [tankType],
            arguments: [
                tx.object(PROTOCOL_OBJECT),
                buckCoinInput
            ],
        });
        return tx;
    }
    async getTankWithdrawTx(tx, tankType, withdrawAmount, walletAddress) {
        /**
         * @description Get transaction for withdraw token from tank
         * @param tankType Asset , e.g "0x2::sui::SUI"
         * @param withdrawAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
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
        tx.moveCall({
            target: SUPRA_UPDATE_TARGET,
            typeArguments: [tankType],
            arguments: [
                tx.object(ORACLE_OBJECT),
                tx.object(CLOCK_OBJECT),
                tx.object(SUPRA_HANDLER_OBJECT),
                tx.pure(SUPRA_ID[token] ?? "", "u32"),
            ],
        });
        tx.moveCall({
            target: `${BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::withdraw`,
            typeArguments: [tankType],
            arguments: [
                tx.object(PROTOCOL_OBJECT),
                tx.object(ORACLE_OBJECT),
                tx.object(CLOCK_OBJECT),
                tx.object(TREASURY_OBJECT),
                tokenObjs,
                tx.pure(parseBigInt(`${withdrawAmount ?? 0}`, 9), "u64"),
            ],
        });
        return tx;
    }
    async getTankClaimTx(tx, tankType, walletAddress) {
        /**
         * @description Get transaction for claim token from tank
         * @param tankType Asset , e.g "0x2::sui::SUI"
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
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
                    tx.object(PROTOCOL_OBJECT),
                    tx.object(TREASURY_OBJECT),
                    token,
                ],
            });
        }
        return tx;
    }
    async getStakeUsdcTx(tx, isAf, stakeAmount, walletAddress) {
        /**
         * @description Get transaction for stake token to pool
         * @param isAf Boolean value for Aftermath or not
         * @param stakeAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const { data: coins } = await this.client.getCoins({
            owner: walletAddress,
            coinType: COINS_TYPE_LIST.USDC,
        });
        const [mainCoin, ...otherCoins] = coins.map((coin) => tx.objectRef({
            objectId: coin.coinObjectId,
            digest: coin.digest,
            version: coin.version,
        }));
        if (!mainCoin)
            return tx;
        if (otherCoins.length > 0)
            tx.mergeCoins(mainCoin, otherCoins);
        const stakeCoinInput = tx.splitCoins(mainCoin, [
            tx.pure(stakeAmount * 10 ** COIN_DECIMALS.USDC, "u64"),
        ]);
        if (!stakeCoinInput)
            return tx;
        if (isAf) {
            tx.moveCall({
                target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::aftermath_fountain::stake`,
                typeArguments: [COINS_TYPE_LIST.AF_LP_USDC_BUCK, COINS_TYPE_LIST.USDC],
                arguments: [
                    tx.object(PROTOCOL_OBJECT),
                    tx.object(AF_OBJS.pool),
                    tx.object(AF_OBJS.poolRegistry),
                    tx.object(AF_OBJS.protocolFeeVault),
                    tx.object(AF_OBJS.treasury),
                    tx.object(AF_OBJS.insuranceFund),
                    tx.object(AF_OBJS.referralVault),
                    tx.object(AF_USDC_BUCK_LP_REGISTRY),
                    tx.object(CLOCK_OBJECT),
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
                    tx.object(PROTOCOL_OBJECT),
                    tx.object(CETUS_USDC_BUCK_LP_REGISTRY),
                    tx.object(BUCKETUS_TREASURY),
                    tx.object(BUCKETUS_LP_VAULT),
                    tx.object(CETUS_OBJS.globalConfig),
                    tx.object(CETUS_OBJS.poolBuckUsdc),
                    tx.object(CLOCK_OBJECT),
                    stakeCoinInput,
                    tx.pure(walletAddress, "address"),
                ]
            });
        }
        return tx;
    }
    async getAfUnstakeTx(tx, fountainId, lpProof) {
        /**
         * @description Get transaction for unstake token from AF pool
         * @param fountainId
         * @param lpProof UserLpProof object
         * @returns Promise<TransactionBlock>
         */
        const [stakeType, rewardType] = proofTypeToCoinType(lpProof.typeName);
        tx.moveCall({
            target: "0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_periphery::force_unstake",
            typeArguments: [stakeType, rewardType],
            arguments: [
                tx.object(CLOCK_OBJECT),
                tx.object(fountainId),
                tx.objectRef(lpProofToObject(lpProof)),
            ]
        });
        return tx;
    }
    async getCetusUnstakeTx(tx, fountainId, lpProof, walletAddress) {
        /**
         * @description Get transaction for unstake token from Cetus pool
         * @param fountainId
         * @param lpProof UserLpProof object
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const [bucketusOut, suiReward] = tx.moveCall({
            target: "0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_core::force_unstake",
            typeArguments: [COINS_TYPE_LIST.BUCKETUS, COINS_TYPE_LIST.SUI],
            arguments: [
                tx.object(CLOCK_OBJECT),
                tx.object(fountainId),
                tx.objectRef(lpProofToObject(lpProof)),
            ],
        });
        const suiCoin = tx.moveCall({
            target: "0x2::coin::from_balance",
            typeArguments: [COINS_TYPE_LIST.SUI],
            arguments: [suiReward],
        });
        const bucketusCoin = tx.moveCall({
            target: "0x2::coin::from_balance",
            typeArguments: [COINS_TYPE_LIST.BUCKETUS],
            arguments: [bucketusOut],
        });
        const [buckCoin, usdcCoin] = tx.moveCall({
            target: "0x8d1aee27f8537c06d19c16641f27008caafc42affd2d2fb7adb96919470481ec::bucketus::withdraw",
            typeArguments: [COINS_TYPE_LIST.BUCK, COINS_TYPE_LIST.USDC],
            arguments: [
                tx.object(BUCKETUS_TREASURY),
                tx.object(BUCKETUS_LP_VAULT),
                tx.object(CETUS_OBJS.globalConfig),
                tx.object(CETUS_OBJS.poolBuckUsdc),
                tx.object(CLOCK_OBJECT),
                bucketusCoin,
            ],
        });
        tx.transferObjects([buckCoin, usdcCoin, suiCoin], tx.pure(walletAddress, "address"));
        return tx;
    }
    async getAfClaimTx(tx, fountainId, lpProof) {
        /**
         * @description Get transaction for claim token from AF pool
         * @param fountainId
         * @param lpProof UserLpProof object
         * @returns Promise<TransactionBlock>
         */
        const [stakeType, rewardType] = proofTypeToCoinType(lpProof.typeName);
        tx.moveCall({
            target: `${FOUNTAIN_PACKAGE_ID}::fountain_periphery::claim`,
            typeArguments: [stakeType, rewardType],
            arguments: [
                tx.object(CLOCK_OBJECT),
                tx.object(fountainId),
                tx.objectRef(lpProofToObject(lpProof)),
            ]
        });
        return tx;
    }
    async getCetusClaimTx(tx, fountainId, lpProof, walletAddress) {
        /**
         * @description Get transaction for unstake token from Cetus pool
         * @param fountainId
         * @param lpObject UserLpProof object
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        tx.moveCall({
            target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::cetus_fountain::claim`,
            arguments: [
                tx.object(fountainId),
                tx.object(CLOCK_OBJECT),
                tx.objectRef(lpProofToObject(lpProof)),
                tx.pure(walletAddress, "address"),
            ],
        });
        return tx;
    }
    async getPsmTx(tx, psmCoin, psmAmount, psmSwith, walletAddress) {
        /**
         * @description Get transaction for PSM
         * @param psmCoin Asset , e.g "0x2::sui::SUI"
         * @param psmAmount
         * @param psmSwith stable coin -> BUCK or not
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const inputCoinType = psmSwith ? COINS_TYPE_LIST.BUCK : COINS_TYPE_LIST[psmCoin];
        const inputCoinDecimals = COIN_DECIMALS[psmSwith ? 'BUCK' : psmCoin] ?? 9;
        const [inputCoin] = await this.getInputCoin(tx, walletAddress, inputCoinType, psmAmount * 10 ** inputCoinDecimals);
        const outCoinType = psmSwith ? COINS_TYPE_LIST[psmCoin] : COINS_TYPE_LIST.BUCK;
        const inputCoinBalance = coinIntoBalance(tx, inputCoinType, inputCoin);
        if (psmSwith) {
            let outBalance = tx.moveCall({
                target: `${CORE_PACKAGE_ID}::buck::discharge_reservoir`,
                typeArguments: [outCoinType],
                arguments: [
                    tx.object(PROTOCOL_OBJECT),
                    inputCoinBalance
                ],
            });
            const coinOut = coinFromBalance(tx, outCoinType, outBalance);
            tx.transferObjects([coinOut], tx.pure(walletAddress, "address"));
        }
        else {
            let outBalance = tx.moveCall({
                target: `${CORE_PACKAGE_ID}::buck::charge_reservoir`,
                typeArguments: [inputCoinType],
                arguments: [
                    tx.object(PROTOCOL_OBJECT),
                    inputCoinBalance
                ],
            });
            const coinOut = coinFromBalance(tx, outCoinType, outBalance);
            tx.transferObjects([coinOut], tx.pure(walletAddress, "address"));
        }
        return tx;
    }
    async getRedeemTx(tx, collateralType, redeemAmount, walletAddress) {
        /**
         * @description Get transaction for Redeem
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param redeemAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const coinSymbol = getCoinSymbol(collateralType) ?? "";
        const { data: coins } = await this.client.getCoins({
            owner: walletAddress,
            coinType: COINS_TYPE_LIST.BUCK,
        });
        const [mainCoin, ...otherCoins] = coins
            .filter(x => x.coinType == COINS_TYPE_LIST.BUCK)
            .map((coin) => tx.objectRef({
            objectId: coin.coinObjectId,
            version: coin.version,
            digest: coin.digest,
        }));
        let buckCoinInput;
        if (mainCoin) {
            if (otherCoins.length !== 0)
                tx.mergeCoins(mainCoin, otherCoins);
            buckCoinInput = tx.splitCoins(mainCoin, [
                tx.pure(redeemAmount * 10 ** 9, "u64"),
            ]);
        }
        if (!buckCoinInput)
            return tx;
        tx.moveCall({
            target: SUPRA_UPDATE_TARGET,
            typeArguments: [collateralType],
            arguments: [
                tx.object(ORACLE_OBJECT),
                tx.object(CLOCK_OBJECT),
                tx.object(SUPRA_HANDLER_OBJECT),
                tx.pure(SUPRA_ID[coinSymbol] ?? "", "u32"),
            ],
        });
        tx.moveCall({
            target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::redeem`,
            typeArguments: [collateralType],
            arguments: [
                tx.object(PROTOCOL_OBJECT),
                tx.object(ORACLE_OBJECT),
                tx.object(CLOCK_OBJECT),
                buckCoinInput,
                tx.pure([]),
            ],
        });
        return tx;
    }
    async getInputCoin(tx, owner, coinType, ...amounts) {
        const { data: userCoins } = await this.client.getCoins({ owner, coinType });
        const [mainCoin, ...otherCoins] = userCoins.map((coin) => tx.objectRef({
            objectId: coin.coinObjectId,
            version: coin.version,
            digest: coin.digest,
        }));
        if (otherCoins.length > 0)
            tx.mergeCoins(mainCoin, otherCoins);
        return tx.splitCoins(mainCoin, amounts.map(amount => tx.pure(amount, "u64")));
    }
    ;
}
//# sourceMappingURL=client.js.map