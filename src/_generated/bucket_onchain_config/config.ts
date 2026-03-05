/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/bucket_onchain_config::config';
export const Config = new MoveStruct({ name: `${$moduleName}::Config`, fields: {
        id: bcs.Address,
        id_vector: bcs.vector(bcs.Address)
    } });
export interface NewConfigArguments {
    Admin: RawTransactionArgument<string>;
}
export interface NewConfigOptions {
    package?: string;
    arguments: NewConfigArguments | [
        Admin: RawTransactionArgument<string>
    ];
}
export function newConfig(options: NewConfigOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'new_config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface AddIdOptions {
    package?: string;
    arguments: AddIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function addId(options: AddIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x2::object::ID'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'add_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemoveIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    location: RawTransactionArgument<number | bigint>;
}
export interface RemoveIdOptions {
    package?: string;
    arguments: RemoveIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        location: RawTransactionArgument<number | bigint>
    ];
}
export function removeId(options: RemoveIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        'u64'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "location"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'remove_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}