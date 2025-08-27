/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs, type BcsType } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as vec_set from './deps/sui/vec_set.js';
import * as type_name from './deps/std/type_name.js';
const $moduleName = '@local-pkg/bucket_v2_cdp::response';
export const UpdateResponse = new MoveStruct({ name: `${$moduleName}::UpdateResponse`, fields: {
        vault_id: bcs.Address,
        account: bcs.Address,
        coll_amount: bcs.u64(),
        debt_amount: bcs.u64(),
        interest_amount: bcs.u64(),
        witnesses: vec_set.VecSet(type_name.TypeName)
    } });
export interface AddWitnessArguments<R extends BcsType<any>> {
    res: RawTransactionArgument<string>;
    Witness: RawTransactionArgument<R>;
}
export interface AddWitnessOptions<R extends BcsType<any>> {
    package?: string;
    arguments: AddWitnessArguments<R> | [
        res: RawTransactionArgument<string>,
        Witness: RawTransactionArgument<R>
    ];
    typeArguments: [
        string,
        string
    ];
}
/**
 * Public Functions Adds a witness of type R to the UpdateResponse, aborting if it
 * already exists
 */
export function addWitness<R extends BcsType<any>>(options: AddWitnessOptions<R>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::response::UpdateResponse<${options.typeArguments[0]}>`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["res", "Witness"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'response',
        function: 'add_witness',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface VaultIdArguments {
    res: RawTransactionArgument<string>;
}
export interface VaultIdOptions {
    package?: string;
    arguments: VaultIdArguments | [
        res: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter Functions Returns the vault ID from the response */
export function vaultId(options: VaultIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::response::UpdateResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["res"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'response',
        function: 'vault_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AccountArguments {
    res: RawTransactionArgument<string>;
}
export interface AccountOptions {
    package?: string;
    arguments: AccountArguments | [
        res: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the account address from the response */
export function account(options: AccountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::response::UpdateResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["res"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'response',
        function: 'account',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CollAmountArguments {
    res: RawTransactionArgument<string>;
}
export interface CollAmountOptions {
    package?: string;
    arguments: CollAmountArguments | [
        res: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the collateral amount from the response */
export function collAmount(options: CollAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::response::UpdateResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["res"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'response',
        function: 'coll_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DebtAmountArguments {
    res: RawTransactionArgument<string>;
}
export interface DebtAmountOptions {
    package?: string;
    arguments: DebtAmountArguments | [
        res: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the debt amount from the response */
export function debtAmount(options: DebtAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::response::UpdateResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["res"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'response',
        function: 'debt_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface InterestAmountArguments {
    res: RawTransactionArgument<string>;
}
export interface InterestAmountOptions {
    package?: string;
    arguments: InterestAmountArguments | [
        res: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the interest amount from the response */
export function interestAmount(options: InterestAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::response::UpdateResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["res"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'response',
        function: 'interest_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WitnessesArguments {
    res: RawTransactionArgument<string>;
}
export interface WitnessesOptions {
    package?: string;
    arguments: WitnessesArguments | [
        res: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns a reference to the set of witnesses from the response */
export function witnesses(options: WitnessesOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::response::UpdateResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["res"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'response',
        function: 'witnesses',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}