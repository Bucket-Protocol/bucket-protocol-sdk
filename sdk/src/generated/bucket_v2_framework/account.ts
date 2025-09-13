/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for Account Abstraction */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object.js';
const $moduleName = '@local-pkg/bucket_v2_framework::account';
export const ACCOUNT = new MoveStruct({ name: `${$moduleName}::ACCOUNT`, fields: {
        dummy_field: bcs.bool()
    } });
export const Account = new MoveStruct({ name: `${$moduleName}::Account`, fields: {
        id: object.UID,
        alias: bcs.option(bcs.string())
    } });
export const AccountRequest = new MoveStruct({ name: `${$moduleName}::AccountRequest`, fields: {
        account: bcs.Address
    } });
export interface NewArguments {
    alias: RawTransactionArgument<string | null>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        alias: RawTransactionArgument<string | null>
    ];
}
/** Public Funs */
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<0x0000000000000000000000000000000000000000000000000000000000000001::string::String>'
    ] satisfies string[];
    const parameterNames = ["alias"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'account',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RequestOptions {
    package?: string;
    arguments?: [
    ];
}
export function request(options: RequestOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'account',
        function: 'request',
    });
}
export interface RequestWithAccountArguments {
    account: RawTransactionArgument<string>;
}
export interface RequestWithAccountOptions {
    package?: string;
    arguments: RequestWithAccountArguments | [
        account: RawTransactionArgument<string>
    ];
}
export function requestWithAccount(options: RequestWithAccountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::account::Account`
    ] satisfies string[];
    const parameterNames = ["account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'account',
        function: 'request_with_account',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ReceiveArguments {
    account: RawTransactionArgument<string>;
    receiving: RawTransactionArgument<string>;
}
export interface ReceiveOptions {
    package?: string;
    arguments: ReceiveArguments | [
        account: RawTransactionArgument<string>,
        receiving: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function receive(options: ReceiveOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::account::Account`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::transfer::Receiving<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["account", "receiving"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'account',
        function: 'receive',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateAliasArguments {
    account: RawTransactionArgument<string>;
    alias: RawTransactionArgument<string>;
}
export interface UpdateAliasOptions {
    package?: string;
    arguments: UpdateAliasArguments | [
        account: RawTransactionArgument<string>,
        alias: RawTransactionArgument<string>
    ];
}
export function updateAlias(options: UpdateAliasOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::account::Account`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["account", "alias"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'account',
        function: 'update_alias',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AccountAddressArguments {
    account: RawTransactionArgument<string>;
}
export interface AccountAddressOptions {
    package?: string;
    arguments: AccountAddressArguments | [
        account: RawTransactionArgument<string>
    ];
}
export function accountAddress(options: AccountAddressOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::account::Account`
    ] satisfies string[];
    const parameterNames = ["account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'account',
        function: 'account_address',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RequestAddressArguments {
    req: RawTransactionArgument<string>;
}
export interface RequestAddressOptions {
    package?: string;
    arguments: RequestAddressArguments | [
        req: RawTransactionArgument<string>
    ];
}
export function requestAddress(options: RequestAddressOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::account::AccountRequest`
    ] satisfies string[];
    const parameterNames = ["req"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'account',
        function: 'request_address',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AliasLengthLimitOptions {
    package?: string;
    arguments?: [
    ];
}
export function aliasLengthLimit(options: AliasLengthLimitOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'account',
        function: 'alias_length_limit',
    });
}