/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for managing Credit and Debt for DeFi protocol usage */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/bucket_v2_framework::liability';
export const Credit = new MoveStruct({ name: `${$moduleName}::Credit`, fields: {
        value: bcs.u64()
    } });
export const Debt = new MoveStruct({ name: `${$moduleName}::Debt`, fields: {
        value: bcs.u64()
    } });
export interface NewArguments {
    value: RawTransactionArgument<number | bigint>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        value: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
/** Public Funs */
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        'u64'
    ] satisfies string[];
    const parameterNames = ["value"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ZeroCreditOptions {
    package?: string;
    arguments?: [
    ];
    typeArguments: [
        string
    ];
}
export function zeroCredit(options: ZeroCreditOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'zero_credit',
        typeArguments: options.typeArguments
    });
}
export interface ZeroDebtOptions {
    package?: string;
    arguments?: [
    ];
    typeArguments: [
        string
    ];
}
export function zeroDebt(options: ZeroDebtOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'zero_debt',
        typeArguments: options.typeArguments
    });
}
export interface DestroyZeroCreditArguments {
    credit: RawTransactionArgument<string>;
}
export interface DestroyZeroCreditOptions {
    package?: string;
    arguments: DestroyZeroCreditArguments | [
        credit: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function destroyZeroCredit(options: DestroyZeroCreditOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Credit<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["credit"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'destroy_zero_credit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyZeroDebtArguments {
    debt: RawTransactionArgument<string>;
}
export interface DestroyZeroDebtOptions {
    package?: string;
    arguments: DestroyZeroDebtArguments | [
        debt: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function destroyZeroDebt(options: DestroyZeroDebtOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Debt<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["debt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'destroy_zero_debt',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddCreditArguments {
    self: RawTransactionArgument<string>;
    credit: RawTransactionArgument<string>;
}
export interface AddCreditOptions {
    package?: string;
    arguments: AddCreditArguments | [
        self: RawTransactionArgument<string>,
        credit: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function addCredit(options: AddCreditOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Credit<${options.typeArguments[0]}>`,
        `${packageAddress}::liability::Credit<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self", "credit"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'add_credit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddDebtArguments {
    self: RawTransactionArgument<string>;
    debt: RawTransactionArgument<string>;
}
export interface AddDebtOptions {
    package?: string;
    arguments: AddDebtArguments | [
        self: RawTransactionArgument<string>,
        debt: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function addDebt(options: AddDebtOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Debt<${options.typeArguments[0]}>`,
        `${packageAddress}::liability::Debt<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self", "debt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'add_debt',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AutoSettleArguments {
    credit: RawTransactionArgument<string>;
    debt: RawTransactionArgument<string>;
}
export interface AutoSettleOptions {
    package?: string;
    arguments: AutoSettleArguments | [
        credit: RawTransactionArgument<string>,
        debt: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function autoSettle(options: AutoSettleOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Credit<${options.typeArguments[0]}>`,
        `${packageAddress}::liability::Debt<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["credit", "debt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'auto_settle',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SettleDebtArguments {
    credit: RawTransactionArgument<string>;
    debt: RawTransactionArgument<string>;
}
export interface SettleDebtOptions {
    package?: string;
    arguments: SettleDebtArguments | [
        credit: RawTransactionArgument<string>,
        debt: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function settleDebt(options: SettleDebtOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Credit<${options.typeArguments[0]}>`,
        `${packageAddress}::liability::Debt<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["credit", "debt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'settle_debt',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SettleCreditArguments {
    debt: RawTransactionArgument<string>;
    credit: RawTransactionArgument<string>;
}
export interface SettleCreditOptions {
    package?: string;
    arguments: SettleCreditArguments | [
        debt: RawTransactionArgument<string>,
        credit: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function settleCredit(options: SettleCreditOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Debt<${options.typeArguments[0]}>`,
        `${packageAddress}::liability::Credit<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["debt", "credit"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'settle_credit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CreditValueArguments {
    credit: RawTransactionArgument<string>;
}
export interface CreditValueOptions {
    package?: string;
    arguments: CreditValueArguments | [
        credit: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function creditValue(options: CreditValueOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Credit<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["credit"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'credit_value',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DebtValueArguments {
    debt: RawTransactionArgument<string>;
}
export interface DebtValueOptions {
    package?: string;
    arguments: DebtValueArguments | [
        debt: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function debtValue(options: DebtValueOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Debt<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["debt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'debt_value',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyCreditForTestingArguments {
    credit: RawTransactionArgument<string>;
}
export interface DestroyCreditForTestingOptions {
    package?: string;
    arguments: DestroyCreditForTestingArguments | [
        credit: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function destroyCreditForTesting(options: DestroyCreditForTestingOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Credit<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["credit"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'destroy_credit_for_testing',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyDebtForTestingArguments {
    debt: RawTransactionArgument<string>;
}
export interface DestroyDebtForTestingOptions {
    package?: string;
    arguments: DestroyDebtForTestingArguments | [
        debt: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function destroyDebtForTesting(options: DestroyDebtForTestingOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::liability::Debt<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["debt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'liability',
        function: 'destroy_debt_for_testing',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}