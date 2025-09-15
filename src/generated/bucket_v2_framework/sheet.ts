/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for the record of Credit and Debt of certain entity */

import { MoveTuple, MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs, type BcsType } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as type_name from './deps/std/type_name.js';
import * as vec_map from './deps/sui/vec_map.js';
import * as liability from './liability.js';
import * as vec_set from './deps/sui/vec_set.js';
import * as balance_1 from './deps/sui/balance.js';
const $moduleName = '@local-pkg/bucket_v2_framework::sheet';
export const Entity = new MoveTuple({ name: `${$moduleName}::Entity`, fields: [type_name.TypeName] });
export const Sheet = new MoveStruct({ name: `${$moduleName}::Sheet`, fields: {
        credits: vec_map.VecMap(Entity, liability.Credit),
        debts: vec_map.VecMap(Entity, liability.Debt),
        blacklist: vec_set.VecSet(Entity)
    } });
export const Loan = new MoveStruct({ name: `${$moduleName}::Loan`, fields: {
        balance: balance_1.Balance,
        debt: liability.Debt
    } });
export const Request = new MoveStruct({ name: `${$moduleName}::Request`, fields: {
        requirement: bcs.u64(),
        balance: balance_1.Balance,
        checklist: bcs.option(bcs.vector(Entity)),
        payer_debts: vec_map.VecMap(Entity, liability.Debt)
    } });
export interface NewArguments<E extends BcsType<any>> {
    _: RawTransactionArgument<E>;
}
export interface NewOptions<E extends BcsType<any>> {
    package?: string;
    arguments: NewArguments<E> | [
        _: RawTransactionArgument<E>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Public Funs */
export function _new<E extends BcsType<any>>(options: NewOptions<E>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["_"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LendArguments<L extends BcsType<any>> {
    sheet: RawTransactionArgument<string>;
    balance: RawTransactionArgument<string>;
    LenderStamp: RawTransactionArgument<L>;
}
export interface LendOptions<L extends BcsType<any>> {
    package?: string;
    arguments: LendArguments<L> | [
        sheet: RawTransactionArgument<string>,
        balance: RawTransactionArgument<string>,
        LenderStamp: RawTransactionArgument<L>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
export function lend<L extends BcsType<any>>(options: LendOptions<L>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::balance::Balance<${options.typeArguments[0]}>`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["sheet", "balance", "LenderStamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'lend',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ReceiveArguments<R extends BcsType<any>> {
    sheet: RawTransactionArgument<string>;
    loan: RawTransactionArgument<string>;
    ReceiverStamp: RawTransactionArgument<R>;
}
export interface ReceiveOptions<R extends BcsType<any>> {
    package?: string;
    arguments: ReceiveArguments<R> | [
        sheet: RawTransactionArgument<string>,
        loan: RawTransactionArgument<string>,
        ReceiverStamp: RawTransactionArgument<R>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
export function receive<R extends BcsType<any>>(options: ReceiveOptions<R>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[2]}>`,
        `${packageAddress}::sheet::Loan<${options.typeArguments[0]}, ${options.typeArguments[1]}, ${options.typeArguments[2]}>`,
        `${options.typeArguments[2]}`
    ] satisfies string[];
    const parameterNames = ["sheet", "loan", "ReceiverStamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'receive',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RequestArguments<C extends BcsType<any>> {
    requirement: RawTransactionArgument<number | bigint>;
    checklist: RawTransactionArgument<string[] | null>;
    CollectorStamp: RawTransactionArgument<C>;
}
export interface RequestOptions<C extends BcsType<any>> {
    package?: string;
    arguments: RequestArguments<C> | [
        requirement: RawTransactionArgument<number | bigint>,
        checklist: RawTransactionArgument<string[] | null>,
        CollectorStamp: RawTransactionArgument<C>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function request<C extends BcsType<any>>(options: RequestOptions<C>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        'u64',
        `0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<vector<${packageAddress}::sheet::Entity>>`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["requirement", "checklist", "CollectorStamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'request',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PayArguments<P extends BcsType<any>> {
    sheet: RawTransactionArgument<string>;
    req: RawTransactionArgument<string>;
    balance: RawTransactionArgument<string>;
    PayerStamp: RawTransactionArgument<P>;
}
export interface PayOptions<P extends BcsType<any>> {
    package?: string;
    arguments: PayArguments<P> | [
        sheet: RawTransactionArgument<string>,
        req: RawTransactionArgument<string>,
        balance: RawTransactionArgument<string>,
        PayerStamp: RawTransactionArgument<P>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
export function pay<P extends BcsType<any>>(options: PayOptions<P>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[2]}>`,
        `${packageAddress}::sheet::Request<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::balance::Balance<${options.typeArguments[0]}>`,
        `${options.typeArguments[2]}`
    ] satisfies string[];
    const parameterNames = ["sheet", "req", "balance", "PayerStamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'pay',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CollectArguments<C extends BcsType<any>> {
    sheet: RawTransactionArgument<string>;
    req: RawTransactionArgument<string>;
    Stamp: RawTransactionArgument<C>;
}
export interface CollectOptions<C extends BcsType<any>> {
    package?: string;
    arguments: CollectArguments<C> | [
        sheet: RawTransactionArgument<string>,
        req: RawTransactionArgument<string>,
        Stamp: RawTransactionArgument<C>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function collect<C extends BcsType<any>>(options: CollectOptions<C>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::sheet::Request<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["sheet", "req", "Stamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'collect',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddDebtorArguments<E extends BcsType<any>> {
    sheet: RawTransactionArgument<string>;
    debtor: RawTransactionArgument<string>;
    Stamp: RawTransactionArgument<E>;
}
export interface AddDebtorOptions<E extends BcsType<any>> {
    package?: string;
    arguments: AddDebtorArguments<E> | [
        sheet: RawTransactionArgument<string>,
        debtor: RawTransactionArgument<string>,
        Stamp: RawTransactionArgument<E>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function addDebtor<E extends BcsType<any>>(options: AddDebtorOptions<E>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::sheet::Entity`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["sheet", "debtor", "Stamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'add_debtor',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddCreditorArguments<E extends BcsType<any>> {
    sheet: RawTransactionArgument<string>;
    creditor: RawTransactionArgument<string>;
    Stamp: RawTransactionArgument<E>;
}
export interface AddCreditorOptions<E extends BcsType<any>> {
    package?: string;
    arguments: AddCreditorArguments<E> | [
        sheet: RawTransactionArgument<string>,
        creditor: RawTransactionArgument<string>,
        Stamp: RawTransactionArgument<E>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function addCreditor<E extends BcsType<any>>(options: AddCreditorOptions<E>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::sheet::Entity`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["sheet", "creditor", "Stamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'add_creditor',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BanArguments<E extends BcsType<any>> {
    sheet: RawTransactionArgument<string>;
    entity: RawTransactionArgument<string>;
    Stamp: RawTransactionArgument<E>;
}
export interface BanOptions<E extends BcsType<any>> {
    package?: string;
    arguments: BanArguments<E> | [
        sheet: RawTransactionArgument<string>,
        entity: RawTransactionArgument<string>,
        Stamp: RawTransactionArgument<E>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function ban<E extends BcsType<any>>(options: BanOptions<E>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::sheet::Entity`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["sheet", "entity", "Stamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'ban',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UnbanArguments<E extends BcsType<any>> {
    sheet: RawTransactionArgument<string>;
    entity: RawTransactionArgument<string>;
    Stamp: RawTransactionArgument<E>;
}
export interface UnbanOptions<E extends BcsType<any>> {
    package?: string;
    arguments: UnbanArguments<E> | [
        sheet: RawTransactionArgument<string>,
        entity: RawTransactionArgument<string>,
        Stamp: RawTransactionArgument<E>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function unban<E extends BcsType<any>>(options: UnbanOptions<E>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::sheet::Entity`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["sheet", "entity", "Stamp"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'unban',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface EntityOptions {
    package?: string;
    arguments?: [
    ];
    typeArguments: [
        string
    ];
}
/** Getter Funs */
export function entity(options: EntityOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'entity',
        typeArguments: options.typeArguments
    });
}
export interface CreditsArguments {
    sheet: RawTransactionArgument<string>;
}
export interface CreditsOptions {
    package?: string;
    arguments: CreditsArguments | [
        sheet: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function credits(options: CreditsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["sheet"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'credits',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DebtsArguments {
    sheet: RawTransactionArgument<string>;
}
export interface DebtsOptions {
    package?: string;
    arguments: DebtsArguments | [
        sheet: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function debts(options: DebtsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["sheet"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'debts',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BlacklistArguments {
    sheet: RawTransactionArgument<string>;
}
export interface BlacklistOptions {
    package?: string;
    arguments: BlacklistArguments | [
        sheet: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function blacklist(options: BlacklistOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["sheet"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'blacklist',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface TotalCreditArguments {
    sheet: RawTransactionArgument<string>;
}
export interface TotalCreditOptions {
    package?: string;
    arguments: TotalCreditArguments | [
        sheet: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function totalCredit(options: TotalCreditOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["sheet"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'total_credit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface TotalDebtArguments {
    sheet: RawTransactionArgument<string>;
}
export interface TotalDebtOptions {
    package?: string;
    arguments: TotalDebtArguments | [
        sheet: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function totalDebt(options: TotalDebtOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Sheet<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["sheet"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'total_debt',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LoanValueArguments {
    loan: RawTransactionArgument<string>;
}
export interface LoanValueOptions {
    package?: string;
    arguments: LoanValueArguments | [
        loan: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
export function loanValue(options: LoanValueOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Loan<${options.typeArguments[1]}, ${options.typeArguments[2]}, ${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["loan"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'loan_value',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RequirementArguments {
    req: RawTransactionArgument<string>;
}
export interface RequirementOptions {
    package?: string;
    arguments: RequirementArguments | [
        req: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function requirement(options: RequirementOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Request<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["req"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'requirement',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BalanceArguments {
    req: RawTransactionArgument<string>;
}
export interface BalanceOptions {
    package?: string;
    arguments: BalanceArguments | [
        req: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function balance(options: BalanceOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Request<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["req"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'balance',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ShortageArguments {
    req: RawTransactionArgument<string>;
}
export interface ShortageOptions {
    package?: string;
    arguments: ShortageArguments | [
        req: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function shortage(options: ShortageOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Request<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["req"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'shortage',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PayerDebtsArguments {
    req: RawTransactionArgument<string>;
}
export interface PayerDebtsOptions {
    package?: string;
    arguments: PayerDebtsArguments | [
        req: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function payerDebts(options: PayerDebtsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::sheet::Request<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["req"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sheet',
        function: 'payer_debts',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}