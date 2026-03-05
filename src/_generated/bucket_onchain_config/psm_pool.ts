/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as share from './share.js';
import * as vec_map from './deps/sui/vec_map.js';
const $moduleName = '@local-pkg/bucket_onchain_config::psm_pool';
export const PsmPoolObjectInfo = new MoveStruct({ name: `${$moduleName}::PsmPoolObjectInfo`, fields: {
        pool: share.SharedObjectRef
    } });
export const PsmPool = new MoveStruct({ name: `${$moduleName}::PsmPool`, fields: {
        id: bcs.Address,
        table: vec_map.VecMap(bcs.string(), PsmPoolObjectInfo)
    } });
export interface NewPsmPoolArguments {
    Admin: RawTransactionArgument<string>;
}
export interface NewPsmPoolOptions {
    package?: string;
    arguments: NewPsmPoolArguments | [
        Admin: RawTransactionArgument<string>
    ];
}
export function newPsmPool(options: NewPsmPoolOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'psm_pool',
        function: 'new_psm_pool',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewPsmPoolObjectInfoArguments {
    Admin: RawTransactionArgument<string>;
    pool: RawTransactionArgument<string>;
}
export interface NewPsmPoolObjectInfoOptions {
    package?: string;
    arguments: NewPsmPoolObjectInfoArguments | [
        Admin: RawTransactionArgument<string>,
        pool: RawTransactionArgument<string>
    ];
}
export function newPsmPoolObjectInfo(options: NewPsmPoolObjectInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "pool"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'psm_pool',
        function: 'new_psm_pool_object_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyPsmPoolObjArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    key: RawTransactionArgument<string>;
    newInfo: RawTransactionArgument<string>;
}
export interface ModifyPsmPoolObjOptions {
    package?: string;
    arguments: ModifyPsmPoolObjArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        key: RawTransactionArgument<string>,
        newInfo: RawTransactionArgument<string>
    ];
}
export function modifyPsmPoolObj(options: ModifyPsmPoolObjOptions) {
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
        module: 'psm_pool',
        function: 'modify_psm_pool_obj',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}