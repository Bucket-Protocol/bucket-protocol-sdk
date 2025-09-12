/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as double from './deps/bucket_v2_framework/double.js';
import * as balance from './deps/sui/balance.js';
import * as object from './deps/sui/object.js';
import * as table from './deps/sui/table.js';
import * as vec_set from './deps/sui/vec_set.js';
import * as request from './deps/bucket_v2_cdp/request.js';
const $moduleName = '@local-pkg/bucket_v2_borrow_incentive::borrow_incentive';
export const BucketV2BorrowIncentive = new MoveStruct({ name: `${$moduleName}::BucketV2BorrowIncentive`, fields: {
        dummy_field: bcs.bool()
    } });
export const StakeData = new MoveStruct({ name: `${$moduleName}::StakeData`, fields: {
        unit: double.Double,
        reward: balance.Balance
    } });
export const AdminCap = new MoveStruct({ name: `${$moduleName}::AdminCap`, fields: {
        id: object.UID
    } });
export const VaultRewarderRegistry = new MoveStruct({ name: `${$moduleName}::VaultRewarderRegistry`, fields: {
        id: object.UID,
        vault_rewarders: table.Table,
        versions: vec_set.VecSet(bcs.u16()),
        managers: vec_set.VecSet(bcs.Address)
    } });
export const VaultRewarder = new MoveStruct({ name: `${$moduleName}::VaultRewarder`, fields: {
        id: object.UID,
        vault_id: bcs.Address,
        source: balance.Balance,
        pool: balance.Balance,
        flow_rate: double.Double,
        stake_table: table.Table,
        unit: double.Double,
        timestamp: bcs.u64()
    } });
export const RequestChecker = new MoveStruct({ name: `${$moduleName}::RequestChecker`, fields: {
        vault_id: bcs.Address,
        rewarder_ids: vec_set.VecSet(bcs.Address),
        request: request.UpdateRequest
    } });
export interface PackageVersionOptions {
    package?: string;
    arguments?: [
    ];
}
export function packageVersion(options: PackageVersionOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'package_version',
    });
}
export interface CreateArguments {
    registry: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    vault: RawTransactionArgument<string>;
    flowAmount: RawTransactionArgument<number | bigint>;
    flowInterval: RawTransactionArgument<number | bigint>;
    startTimestamp: RawTransactionArgument<number | bigint>;
}
export interface CreateOptions {
    package?: string;
    arguments: CreateArguments | [
        registry: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        vault: RawTransactionArgument<string>,
        flowAmount: RawTransactionArgument<number | bigint>,
        flowInterval: RawTransactionArgument<number | bigint>,
        startTimestamp: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Admin Funs */
export function create(options: CreateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::AdminCap`,
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        'u64',
        'u64',
        'u64'
    ] satisfies string[];
    const parameterNames = ["registry", "Cap", "vault", "flowAmount", "flowInterval", "startTimestamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'create',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawFromSourceArguments {
    registry: RawTransactionArgument<string>;
    rewarder: RawTransactionArgument<string>;
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    amount: RawTransactionArgument<number | bigint>;
}
export interface WithdrawFromSourceOptions {
    package?: string;
    arguments: WithdrawFromSourceArguments | [
        registry: RawTransactionArgument<string>,
        rewarder: RawTransactionArgument<string>,
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        amount: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function withdrawFromSource(options: WithdrawFromSourceOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[1]}>`,
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        `${packageAddress}::borrow_incentive::AdminCap`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        'u64'
    ] satisfies string[];
    const parameterNames = ["registry", "rewarder", "vault", "Cap", "amount"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'withdraw_from_source',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddVersionArguments {
    registry: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    version: RawTransactionArgument<number>;
}
export interface AddVersionOptions {
    package?: string;
    arguments: AddVersionArguments | [
        registry: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        version: RawTransactionArgument<number>
    ];
}
/** Admin Funs */
export function addVersion(options: AddVersionOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::AdminCap`,
        'u16'
    ] satisfies string[];
    const parameterNames = ["registry", "Cap", "version"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'add_version',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemoveVersionArguments {
    registry: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    version: RawTransactionArgument<number>;
}
export interface RemoveVersionOptions {
    package?: string;
    arguments: RemoveVersionArguments | [
        registry: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        version: RawTransactionArgument<number>
    ];
}
export function removeVersion(options: RemoveVersionOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::AdminCap`,
        'u16'
    ] satisfies string[];
    const parameterNames = ["registry", "Cap", "version"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'remove_version',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddManagerArguments {
    registry: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    manager: RawTransactionArgument<string>;
}
export interface AddManagerOptions {
    package?: string;
    arguments: AddManagerArguments | [
        registry: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>
    ];
}
export function addManager(options: AddManagerOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::AdminCap`,
        'address'
    ] satisfies string[];
    const parameterNames = ["registry", "Cap", "manager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'add_manager',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemoveManagerArguments {
    registry: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    manager: RawTransactionArgument<string>;
}
export interface RemoveManagerOptions {
    package?: string;
    arguments: RemoveManagerArguments | [
        registry: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>
    ];
}
export function removeManager(options: RemoveManagerOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::AdminCap`,
        'address'
    ] satisfies string[];
    const parameterNames = ["registry", "Cap", "manager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'remove_manager',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdateFlowRateArguments {
    registry: RawTransactionArgument<string>;
    rewarder: RawTransactionArgument<string>;
    vault: RawTransactionArgument<string>;
    flowAmount: RawTransactionArgument<number | bigint>;
    flowInterval: RawTransactionArgument<number | bigint>;
    request: RawTransactionArgument<string>;
}
export interface UpdateFlowRateOptions {
    package?: string;
    arguments: UpdateFlowRateArguments | [
        registry: RawTransactionArgument<string>,
        rewarder: RawTransactionArgument<string>,
        vault: RawTransactionArgument<string>,
        flowAmount: RawTransactionArgument<number | bigint>,
        flowInterval: RawTransactionArgument<number | bigint>,
        request: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Manager Funs */
export function updateFlowRate(options: UpdateFlowRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[1]}>`,
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        'u64',
        'u64',
        `${packageAddress}::account::AccountRequest`
    ] satisfies string[];
    const parameterNames = ["registry", "rewarder", "vault", "flowAmount", "flowInterval", "request"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'update_flow_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateRewarderTimestampArguments {
    registry: RawTransactionArgument<string>;
    rewarder: RawTransactionArgument<string>;
    vault: RawTransactionArgument<string>;
    timestamp: RawTransactionArgument<number | bigint>;
    request: RawTransactionArgument<string>;
}
export interface UpdateRewarderTimestampOptions {
    package?: string;
    arguments: UpdateRewarderTimestampArguments | [
        registry: RawTransactionArgument<string>,
        rewarder: RawTransactionArgument<string>,
        vault: RawTransactionArgument<string>,
        timestamp: RawTransactionArgument<number | bigint>,
        request: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function updateRewarderTimestamp(options: UpdateRewarderTimestampOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[1]}>`,
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        'u64',
        `${packageAddress}::account::AccountRequest`
    ] satisfies string[];
    const parameterNames = ["registry", "rewarder", "vault", "timestamp", "request"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'update_rewarder_timestamp',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositToSourceArguments {
    rewarder: RawTransactionArgument<string>;
    coin: RawTransactionArgument<string>;
}
export interface DepositToSourceOptions {
    package?: string;
    arguments: DepositToSourceArguments | [
        rewarder: RawTransactionArgument<string>,
        coin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Public Fun */
export function depositToSource(options: DepositToSourceOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[0]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder", "coin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'deposit_to_source',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositToPoolArguments {
    rewarder: RawTransactionArgument<string>;
    coin: RawTransactionArgument<string>;
}
export interface DepositToPoolOptions {
    package?: string;
    arguments: DepositToPoolArguments | [
        rewarder: RawTransactionArgument<string>,
        coin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function depositToPool(options: DepositToPoolOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[0]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder", "coin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'deposit_to_pool',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface NewCheckerArguments {
    registry: RawTransactionArgument<string>;
    request: RawTransactionArgument<string>;
}
export interface NewCheckerOptions {
    package?: string;
    arguments: NewCheckerArguments | [
        registry: RawTransactionArgument<string>,
        request: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function newChecker(options: NewCheckerOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["registry", "request"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'new_checker',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateArguments {
    registry: RawTransactionArgument<string>;
    checker: RawTransactionArgument<string>;
    vault: RawTransactionArgument<string>;
    rewarder: RawTransactionArgument<string>;
}
export interface UpdateOptions {
    package?: string;
    arguments: UpdateArguments | [
        registry: RawTransactionArgument<string>,
        checker: RawTransactionArgument<string>,
        vault: RawTransactionArgument<string>,
        rewarder: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function update(options: UpdateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::RequestChecker<${options.typeArguments[0]}>`,
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["registry", "checker", "vault", "rewarder"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'update',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyCheckerArguments {
    registry: RawTransactionArgument<string>;
    checker: RawTransactionArgument<string>;
}
export interface DestroyCheckerOptions {
    package?: string;
    arguments: DestroyCheckerArguments | [
        registry: RawTransactionArgument<string>,
        checker: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function destroyChecker(options: DestroyCheckerOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::RequestChecker<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["registry", "checker"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'destroy_checker',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimArguments {
    registry: RawTransactionArgument<string>;
    rewarder: RawTransactionArgument<string>;
    vault: RawTransactionArgument<string>;
    request: RawTransactionArgument<string>;
}
export interface ClaimOptions {
    package?: string;
    arguments: ClaimArguments | [
        registry: RawTransactionArgument<string>,
        rewarder: RawTransactionArgument<string>,
        vault: RawTransactionArgument<string>,
        request: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function claim(options: ClaimOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarderRegistry`,
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[1]}>`,
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        `${packageAddress}::account::AccountRequest`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["registry", "rewarder", "vault", "request"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'claim',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface IdArguments {
    rewarder: RawTransactionArgument<string>;
}
export interface IdOptions {
    package?: string;
    arguments: IdArguments | [
        rewarder: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter Funs */
export function id(options: IdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["rewarder"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface StakeExistsArguments {
    rewarder: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface StakeExistsOptions {
    package?: string;
    arguments: StakeExistsArguments | [
        rewarder: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function stakeExists(options: StakeExistsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[0]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["rewarder", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'stake_exists',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RealtimeRewardAmountArguments {
    rewarder: RawTransactionArgument<string>;
    vault: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface RealtimeRewardAmountOptions {
    package?: string;
    arguments: RealtimeRewardAmountArguments | [
        rewarder: RawTransactionArgument<string>,
        vault: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function realtimeRewardAmount(options: RealtimeRewardAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_borrow_incentive';
    const argumentsTypes = [
        `${packageAddress}::borrow_incentive::VaultRewarder<${options.typeArguments[1]}>`,
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        'address',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["rewarder", "vault", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'borrow_incentive',
        function: 'realtime_reward_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}