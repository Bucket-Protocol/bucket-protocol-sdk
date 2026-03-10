/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as share from './share.js';
import * as vec_map from './deps/sui/vec_map.js';
const $moduleName = '@local-pkg/bucket_onchain_config::saving_pool';
export const RewardConfig = new MoveStruct({ name: `${$moduleName}::RewardConfig`, fields: {
        reward_manager: share.SharedObjectRef,
        reward_types: bcs.vector(bcs.string())
    } });
export const SavingPoolObjectInfo = new MoveStruct({ name: `${$moduleName}::SavingPoolObjectInfo`, fields: {
        pool: share.SharedObjectRef,
        reward: bcs.option(RewardConfig)
    } });
export const SavingPool = new MoveStruct({ name: `${$moduleName}::SavingPool`, fields: {
        id: bcs.Address,
        table: vec_map.VecMap(bcs.string(), SavingPoolObjectInfo)
    } });
export interface ModifySavingPoolObjArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    key: RawTransactionArgument<string>;
    newInfo: RawTransactionArgument<string>;
}
export interface ModifySavingPoolObjOptions {
    package?: string;
    arguments: ModifySavingPoolObjArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        key: RawTransactionArgument<string>,
        newInfo: RawTransactionArgument<string>
    ];
}
export function modifySavingPoolObj(options: ModifySavingPoolObjOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String',
        null
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "key", "newInfo"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_pool',
        function: 'modify_saving_pool_obj',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewSavingPoolArguments {
    Admin: RawTransactionArgument<string>;
}
export interface NewSavingPoolOptions {
    package?: string;
    arguments: NewSavingPoolArguments | [
        Admin: RawTransactionArgument<string>
    ];
}
export function newSavingPool(options: NewSavingPoolOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_pool',
        function: 'new_saving_pool',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewSavingPoolObjectInfoArguments {
    Admin: RawTransactionArgument<string>;
    pool: RawTransactionArgument<string>;
    reward: RawTransactionArgument<string | null>;
}
export interface NewSavingPoolObjectInfoOptions {
    package?: string;
    arguments: NewSavingPoolObjectInfoArguments | [
        Admin: RawTransactionArgument<string>,
        pool: RawTransactionArgument<string>,
        reward: RawTransactionArgument<string | null>
    ];
}
export function newSavingPoolObjectInfo(options: NewSavingPoolObjectInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::option::Option<null>'
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "pool", "reward"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_pool',
        function: 'new_saving_pool_object_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewRewardConfigArguments {
    Admin: RawTransactionArgument<string>;
    rewardManager: RawTransactionArgument<string>;
    rewardTypes: RawTransactionArgument<string[]>;
}
export interface NewRewardConfigOptions {
    package?: string;
    arguments: NewRewardConfigArguments | [
        Admin: RawTransactionArgument<string>,
        rewardManager: RawTransactionArgument<string>,
        rewardTypes: RawTransactionArgument<string[]>
    ];
}
export function newRewardConfig(options: NewRewardConfigOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        'vector<0x1::string::String>'
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "rewardManager", "rewardTypes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving_pool',
        function: 'new_reward_config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}