/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * Module: saving_incentive This module implements a reward system for saving
 * pools, allowing users to earn incentive tokens based on their LP token holdings
 * over time. It uses a flow-based reward distribution mechanism.
 */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object.js';
import * as vec_map from './deps/sui/vec_map.js';
import * as type_name from './deps/std/type_name.js';
import * as vec_set from './deps/sui/vec_set.js';
import * as double from './deps/bucket_v2_framework/double.js';
import * as balance from './deps/sui/balance.js';
import * as table from './deps/sui/table.js';
import * as saving from './deps/bucket_v2_saving/saving.js';
const $moduleName = '@local-pkg/bucket_saving_incentive::saving_incentive';
export const SavingPoolIncentives = new MoveStruct({ name: `${$moduleName}::SavingPoolIncentives`, fields: {
        dummy_field: bcs.bool()
    } });
export const Registry = new MoveStruct({ name: `${$moduleName}::Registry`, fields: {
        id: object.UID,
        /** Maps saving pool type to its reward manager ID */
        reward_manager_ids: vec_map.VecMap(type_name.TypeName, bcs.Address)
    } });
export const RewardManager = new MoveStruct({ name: `${$moduleName}::RewardManager`, fields: {
        id: object.UID,
        /** Set of all reward IDs managed by this manager */
        rewarder_ids: vec_set.VecSet(bcs.Address)
    } });
export const StakeData = new MoveStruct({ name: `${$moduleName}::StakeData`, fields: {
        /** User's unit value for reward calculation */
        unit: double.Double,
        /** User's accumulated unclaimed rewards */
        reward: balance.Balance
    } });
export const RewarderKey = new MoveStruct({ name: `${$moduleName}::RewarderKey`, fields: {
        dummy_field: bcs.bool()
    } });
export const Rewarder = new MoveStruct({ name: `${$moduleName}::Rewarder`, fields: {
        id: object.UID,
        /** Total reward tokens available for distribution */
        source: balance.Balance,
        /** Reward tokens ready for claiming */
        pool: balance.Balance,
        /** Rate of reward distribution (tokens per millisecond) */
        flow_rate: double.Double,
        /** Total LP tokens staked (snapshot) */
        total_stake: bcs.u64(),
        /** Individual user stake data */
        stake_table: table.Table,
        /** Global unit for reward calculation */
        unit: double.Double,
        /** Last update timestamp */
        last_update_timestamp: bcs.u64()
    } });
export const DepositResponseChecker = new MoveStruct({ name: `${$moduleName}::DepositResponseChecker`, fields: {
        /** Set of rewarders that need to be updated */
        rewarder_ids: vec_set.VecSet(bcs.Address),
        /** Original deposit response */
        response: saving.DepositResponse
    } });
export const WithdrawResponseChecker = new MoveStruct({ name: `${$moduleName}::WithdrawResponseChecker`, fields: {
        /** Set of rewarders that need to be updated */
        rewarder_ids: vec_set.VecSet(bcs.Address),
        /** Original withdraw response */
        response: saving.WithdrawResponse
    } });
export interface RewardManagerIdsArguments {
    reg: RawTransactionArgument<string>;
}
export interface RewardManagerIdsOptions {
    package?: string;
    arguments: RewardManagerIdsArguments | [
        reg: RawTransactionArgument<string>
    ];
}
/** Returns the mapping of saving pool types to reward manager IDs */
export function rewardManagerIds(options: RewardManagerIdsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Registry`
    ] satisfies string[];
    const parameterNames = ["reg"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'reward_manager_ids',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GetRewarderArguments {
    rewardManager: RawTransactionArgument<string>;
}
export interface GetRewarderOptions {
    package?: string;
    arguments: GetRewarderArguments | [
        rewardManager: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Gets an immutable reference to a specific rewarder */
export function getRewarder(options: GetRewarderOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["rewardManager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'get_rewarder',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RewarderIdsArguments {
    rewardManager: RawTransactionArgument<string>;
}
export interface RewarderIdsOptions {
    package?: string;
    arguments: RewarderIdsArguments | [
        rewardManager: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns all reward IDs managed by this reward manager */
export function rewarderIds(options: RewarderIdsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["rewardManager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'rewarder_ids',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RewarderSourceArguments {
    rewarder: RawTransactionArgument<string>;
}
export interface RewarderSourceOptions {
    package?: string;
    arguments: RewarderSourceArguments | [
        rewarder: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Returns the total source balance available for rewards */
export function rewarderSource(options: RewarderSourceOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'rewarder_source',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RewarderPoolArguments {
    rewarder: RawTransactionArgument<string>;
}
export interface RewarderPoolOptions {
    package?: string;
    arguments: RewarderPoolArguments | [
        rewarder: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Returns the pool balance ready for claiming */
export function rewarderPool(options: RewarderPoolOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'rewarder_pool',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RewarderFlowRateArguments {
    rewarder: RawTransactionArgument<string>;
}
export interface RewarderFlowRateOptions {
    package?: string;
    arguments: RewarderFlowRateArguments | [
        rewarder: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Returns the current flow rate (tokens per millisecond) */
export function rewarderFlowRate(options: RewarderFlowRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'rewarder_flow_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RewarderTotalStakeArguments {
    rewarder: RawTransactionArgument<string>;
}
export interface RewarderTotalStakeOptions {
    package?: string;
    arguments: RewarderTotalStakeArguments | [
        rewarder: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Returns the total staked LP tokens */
export function rewarderTotalStake(options: RewarderTotalStakeOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'rewarder_total_stake',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RewarderStakeTableArguments {
    rewarder: RawTransactionArgument<string>;
}
export interface RewarderStakeTableOptions {
    package?: string;
    arguments: RewarderStakeTableArguments | [
        rewarder: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Returns reference to the stake table */
export function rewarderStakeTable(options: RewarderStakeTableOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'rewarder_stake_table',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RewarderUnitArguments {
    rewarder: RawTransactionArgument<string>;
}
export interface RewarderUnitOptions {
    package?: string;
    arguments: RewarderUnitArguments | [
        rewarder: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Returns the global reward unit */
export function rewarderUnit(options: RewarderUnitOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'rewarder_unit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RewarderLastUpdateTimestampArguments {
    rewarder: RawTransactionArgument<string>;
}
export interface RewarderLastUpdateTimestampOptions {
    package?: string;
    arguments: RewarderLastUpdateTimestampArguments | [
        rewarder: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Returns the last update timestamp */
export function rewarderLastUpdateTimestamp(options: RewarderLastUpdateTimestampOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'rewarder_last_update_timestamp',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UnitOfArguments {
    rewarder: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface UnitOfOptions {
    package?: string;
    arguments: UnitOfArguments | [
        rewarder: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Returns the unit value for a specific account */
export function unitOf(options: UnitOfOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["rewarder", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'unit_of',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RewardOfArguments {
    rewarder: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface RewardOfOptions {
    package?: string;
    arguments: RewardOfArguments | [
        rewarder: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Returns the reward balance for a specific account */
export function rewardOf(options: RewardOfOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["rewarder", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'reward_of',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AccountExistsArguments {
    rewarder: RawTransactionArgument<string>;
    accountAddress: RawTransactionArgument<string>;
}
export interface AccountExistsOptions {
    package?: string;
    arguments: AccountExistsArguments | [
        rewarder: RawTransactionArgument<string>,
        accountAddress: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Checks if an account has staking data in the rewarder */
export function accountExists(options: AccountExistsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["rewarder", "accountAddress"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'account_exists',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RealtimeRewardAmountArguments {
    rewarder: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface RealtimeRewardAmountOptions {
    package?: string;
    arguments: RealtimeRewardAmountArguments | [
        rewarder: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Calculates the real-time reward amount for an account (settled + unsettled) */
export function realtimeRewardAmount(options: RealtimeRewardAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Rewarder<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        'address',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["rewarder", "savingPool", "account", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'realtime_reward_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface NewRewardManagerArguments {
    registry: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    SavingPool: RawTransactionArgument<string>;
}
export interface NewRewardManagerOptions {
    package?: string;
    arguments: NewRewardManagerArguments | [
        registry: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        SavingPool: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Creates a new reward manager for a specific saving pool type Only admins can
 * call this function
 */
export function newRewardManager(options: NewRewardManagerOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::Registry`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        `${packageAddress}::admin::AdminCap`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["registry", "config", "Cap", "SavingPool"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'new_reward_manager',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddRewardArguments {
    rewardManager: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    flowAmount: RawTransactionArgument<number | bigint>;
    flowInterval: RawTransactionArgument<number | bigint>;
    startTime: RawTransactionArgument<number | bigint>;
}
export interface AddRewardOptions {
    package?: string;
    arguments: AddRewardArguments | [
        rewardManager: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        flowAmount: RawTransactionArgument<number | bigint>,
        flowInterval: RawTransactionArgument<number | bigint>,
        startTime: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
/**
 * Adds a new reward token to the reward manager flow_amount: tokens to distribute
 * per flow_interval flow_interval: time interval in milliseconds start_time: when
 * the reward distribution starts
 */
export function addReward(options: AddRewardOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        'u64',
        'u64',
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["rewardManager", "Cap", "config", "savingPool", "flowAmount", "flowInterval", "startTime", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'add_reward',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawFromSourceArguments {
    rewardManager: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    amount: RawTransactionArgument<number | bigint>;
}
export interface WithdrawFromSourceOptions {
    package?: string;
    arguments: WithdrawFromSourceArguments | [
        rewardManager: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        amount: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Withdraws tokens from the reward source (admin only) */
export function withdrawFromSource(options: WithdrawFromSourceOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        `${packageAddress}::admin::AdminCap`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        'u64'
    ] satisfies string[];
    const parameterNames = ["rewardManager", "config", "Cap", "clock", "amount"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'withdraw_from_source',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateFlowRateArguments {
    rewardManager: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    flowAmount: RawTransactionArgument<number | bigint>;
    flowInterval: RawTransactionArgument<number | bigint>;
    request: RawTransactionArgument<string>;
}
export interface UpdateFlowRateOptions {
    package?: string;
    arguments: UpdateFlowRateArguments | [
        rewardManager: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        flowAmount: RawTransactionArgument<number | bigint>,
        flowInterval: RawTransactionArgument<number | bigint>,
        request: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Updates the reward flow rate (manager only) */
export function updateFlowRate(options: UpdateFlowRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        'u64',
        'u64',
        `${packageAddress}::account::AccountRequest`
    ] satisfies string[];
    const parameterNames = ["rewardManager", "config", "clock", "flowAmount", "flowInterval", "request"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'update_flow_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateRewardTimestampArguments {
    rewardManager: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    timestamp: RawTransactionArgument<number | bigint>;
    request: RawTransactionArgument<string>;
}
export interface UpdateRewardTimestampOptions {
    package?: string;
    arguments: UpdateRewardTimestampArguments | [
        rewardManager: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        timestamp: RawTransactionArgument<number | bigint>,
        request: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Updates when the reward distribution starts (manager only, before start time) */
export function updateRewardTimestamp(options: UpdateRewardTimestampOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        'u64',
        `${packageAddress}::account::AccountRequest`
    ] satisfies string[];
    const parameterNames = ["rewardManager", "config", "clock", "timestamp", "request"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'update_reward_timestamp',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SupplyArguments {
    rewardManager: RawTransactionArgument<string>;
    coin: RawTransactionArgument<string>;
}
export interface SupplyOptions {
    package?: string;
    arguments: SupplyArguments | [
        rewardManager: RawTransactionArgument<string>,
        coin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Supplies reward tokens to the reward source */
export function supply(options: SupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["rewardManager", "coin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface NewCheckerForDepositActionArguments {
    rewardManager: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    depositResponse: RawTransactionArgument<string>;
}
export interface NewCheckerForDepositActionOptions {
    package?: string;
    arguments: NewCheckerForDepositActionArguments | [
        rewardManager: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        depositResponse: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Creates a checker for deposit actions to ensure rewarders are updated */
export function newCheckerForDepositAction(options: NewCheckerForDepositActionOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        `${packageAddress}::saving::DepositResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["rewardManager", "config", "depositResponse"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'new_checker_for_deposit_action',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateDepositActionArguments {
    depositChecker: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    rewardManager: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
}
export interface UpdateDepositActionOptions {
    package?: string;
    arguments: UpdateDepositActionArguments | [
        depositChecker: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        rewardManager: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Updates reward state for a specific reward during deposit */
export function updateDepositAction(options: UpdateDepositActionOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::DepositResponseChecker<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["depositChecker", "config", "rewardManager", "savingPool", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'update_deposit_action',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyDepositCheckerArguments {
    depositChecker: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
}
export interface DestroyDepositCheckerOptions {
    package?: string;
    arguments: DestroyDepositCheckerArguments | [
        depositChecker: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Destroys the deposit checker and returns the original response */
export function destroyDepositChecker(options: DestroyDepositCheckerOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::DepositResponseChecker<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`
    ] satisfies string[];
    const parameterNames = ["depositChecker", "config"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'destroy_deposit_checker',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimArguments {
    rewardManager: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    request: RawTransactionArgument<string>;
}
export interface ClaimOptions {
    package?: string;
    arguments: ClaimArguments | [
        rewardManager: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        request: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Claims all available rewards for the user */
export function claim(options: ClaimOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::account::AccountRequest`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["rewardManager", "config", "savingPool", "request", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'claim',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface NewCheckerForWithdrawActionArguments {
    rewardManager: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    withdrawResponse: RawTransactionArgument<string>;
}
export interface NewCheckerForWithdrawActionOptions {
    package?: string;
    arguments: NewCheckerForWithdrawActionArguments | [
        rewardManager: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        withdrawResponse: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Creates a checker for withdraw actions to ensure rewarders are updated */
export function newCheckerForWithdrawAction(options: NewCheckerForWithdrawActionOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        `${packageAddress}::saving::WithdrawResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["rewardManager", "config", "withdrawResponse"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'new_checker_for_withdraw_action',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateWithdrawActionArguments {
    withdrawChecker: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    rewardManager: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
}
export interface UpdateWithdrawActionOptions {
    package?: string;
    arguments: UpdateWithdrawActionArguments | [
        withdrawChecker: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        rewardManager: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Updates reward state for a specific reward during withdrawal */
export function updateWithdrawAction(options: UpdateWithdrawActionOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::WithdrawResponseChecker<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[0]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["withdrawChecker", "config", "rewardManager", "savingPool", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'update_withdraw_action',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyWithdrawCheckerArguments {
    withdrawChecker: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
}
export interface DestroyWithdrawCheckerOptions {
    package?: string;
    arguments: DestroyWithdrawCheckerArguments | [
        withdrawChecker: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Destroys the withdraw checker and returns the original response */
export function destroyWithdrawChecker(options: DestroyWithdrawCheckerOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    const argumentsTypes = [
        `${packageAddress}::saving_incentive::WithdrawResponseChecker<${options.typeArguments[0]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`
    ] satisfies string[];
    const parameterNames = ["withdrawChecker", "config"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_incentive',
        function: 'destroy_withdraw_checker',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}