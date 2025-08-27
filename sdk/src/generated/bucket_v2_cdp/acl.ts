/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Vault module for assigning managers for each security level */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as vec_map from './deps/sui/vec_map.js';
const $moduleName = '@local-pkg/bucket_v2_cdp::acl';
export const Acl = new MoveStruct({ name: `${$moduleName}::Acl`, fields: {
        managers: vec_map.VecMap(bcs.Address, bcs.u8())
    } });
export interface RoleLevelArguments {
    self: RawTransactionArgument<string>;
    manager: RawTransactionArgument<string>;
}
export interface RoleLevelOptions {
    package?: string;
    arguments: RoleLevelArguments | [
        self: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>
    ];
}
export function roleLevel(options: RoleLevelOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::acl::Acl`,
        'address'
    ] satisfies string[];
    const parameterNames = ["self", "manager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'acl',
        function: 'role_level',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}