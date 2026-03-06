/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/bucket_onchain_config::share';
export const SharedObjectRef = new MoveStruct({ name: `${$moduleName}::SharedObjectRef`, fields: {
        objectId: bcs.string(),
        initialSharedVersion: bcs.string(),
        mutable: bcs.bool()
    } });
export interface NewSharedObjectRefArguments {
    Admin: RawTransactionArgument<string>;
    objectId: RawTransactionArgument<string>;
    initialSharedVersion: RawTransactionArgument<string>;
    mutable: RawTransactionArgument<boolean>;
}
export interface NewSharedObjectRefOptions {
    package?: string;
    arguments: NewSharedObjectRefArguments | [
        Admin: RawTransactionArgument<string>,
        objectId: RawTransactionArgument<string>,
        initialSharedVersion: RawTransactionArgument<string>,
        mutable: RawTransactionArgument<boolean>
    ];
}
export function newSharedObjectRef(options: NewSharedObjectRefOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        '0x1::string::String',
        '0x1::string::String',
        'bool'
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "objectId", "initialSharedVersion", "mutable"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'share',
        function: 'new_shared_object_ref',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}