/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for handling requests in the BucketV2 CDP system. */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs, type BcsType } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as coin from './deps/sui/coin.js';
import * as vec_set from './deps/sui/vec_set.js';
import * as type_name from './deps/std/type_name.js';
const $moduleName = '@local-pkg/bucket_v2_cdp::request';
export const UpdateRequest = new MoveStruct({ name: `${$moduleName}::UpdateRequest`, fields: {
        vault_id: bcs.Address,
        account: bcs.Address,
        deposit: coin.Coin,
        borrow_amount: bcs.u64(),
        repayment: coin.Coin,
        withdraw_amount: bcs.u64(),
        witnesses: vec_set.VecSet(type_name.TypeName),
        memo: bcs.string()
    } });
export interface AddWitnessArguments<W extends BcsType<any>> {
    self: RawTransactionArgument<string>;
    Witness: RawTransactionArgument<W>;
}
export interface AddWitnessOptions<W extends BcsType<any>> {
    package?: string;
    arguments: AddWitnessArguments<W> | [
        self: RawTransactionArgument<string>,
        Witness: RawTransactionArgument<W>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Adds a witness type to the request, aborts if already present */
export function addWitness<W extends BcsType<any>>(options: AddWitnessOptions<W>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["self", "Witness"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'request',
        function: 'add_witness',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface VaultIdArguments {
    self: RawTransactionArgument<string>;
}
export interface VaultIdOptions {
    package?: string;
    arguments: VaultIdArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter for vault_id field */
export function vaultId(options: VaultIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'request',
        function: 'vault_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AccountArguments {
    self: RawTransactionArgument<string>;
}
export interface AccountOptions {
    package?: string;
    arguments: AccountArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter for account field */
export function account(options: AccountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'request',
        function: 'account',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositAmountArguments {
    self: RawTransactionArgument<string>;
}
export interface DepositAmountOptions {
    package?: string;
    arguments: DepositAmountArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter for deposit amount (value of Coin<T>) */
export function depositAmount(options: DepositAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'request',
        function: 'deposit_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RepayAmountArguments {
    self: RawTransactionArgument<string>;
}
export interface RepayAmountOptions {
    package?: string;
    arguments: RepayAmountArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter for repay amount (value of Coin<USDB>) */
export function repayAmount(options: RepayAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'request',
        function: 'repay_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BorrowAmountArguments {
    self: RawTransactionArgument<string>;
}
export interface BorrowAmountOptions {
    package?: string;
    arguments: BorrowAmountArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter for borrow amount */
export function borrowAmount(options: BorrowAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'request',
        function: 'borrow_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawAmountArguments {
    self: RawTransactionArgument<string>;
}
export interface WithdrawAmountOptions {
    package?: string;
    arguments: WithdrawAmountArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter for withdraw amount */
export function withdrawAmount(options: WithdrawAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'request',
        function: 'withdraw_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MemoArguments {
    self: RawTransactionArgument<string>;
}
export interface MemoOptions {
    package?: string;
    arguments: MemoArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter for memo field */
export function memo(options: MemoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'request',
        function: 'memo',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WitnessesArguments {
    self: RawTransactionArgument<string>;
}
export interface WitnessesOptions {
    package?: string;
    arguments: WitnessesArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter for witnesses set */
export function witnesses(options: WitnessesOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'request',
        function: 'witnesses',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}