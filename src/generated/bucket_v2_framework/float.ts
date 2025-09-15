/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for floating points */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/bucket_v2_framework::float';
export const Float = new MoveStruct({ name: `${$moduleName}::Float`, fields: {
        value: bcs.u128()
    } });
export interface ZeroOptions {
    package?: string;
    arguments?: [
    ];
}
/** Public Funs */
export function zero(options: ZeroOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'zero',
    });
}
export interface OneOptions {
    package?: string;
    arguments?: [
    ];
}
export function one(options: OneOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'one',
    });
}
export interface TenOptions {
    package?: string;
    arguments?: [
    ];
}
export function ten(options: TenOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'ten',
    });
}
export interface FromArguments {
    v: RawTransactionArgument<number | bigint>;
}
export interface FromOptions {
    package?: string;
    arguments: FromArguments | [
        v: RawTransactionArgument<number | bigint>
    ];
}
export function _from(options: FromOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        'u64'
    ] satisfies string[];
    const parameterNames = ["v"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'from',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FromPercentArguments {
    v: RawTransactionArgument<number>;
}
export interface FromPercentOptions {
    package?: string;
    arguments: FromPercentArguments | [
        v: RawTransactionArgument<number>
    ];
}
export function fromPercent(options: FromPercentOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        'u8'
    ] satisfies string[];
    const parameterNames = ["v"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'from_percent',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FromPercentU64Arguments {
    v: RawTransactionArgument<number | bigint>;
}
export interface FromPercentU64Options {
    package?: string;
    arguments: FromPercentU64Arguments | [
        v: RawTransactionArgument<number | bigint>
    ];
}
export function fromPercentU64(options: FromPercentU64Options) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        'u64'
    ] satisfies string[];
    const parameterNames = ["v"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'from_percent_u64',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FromBpsArguments {
    v: RawTransactionArgument<number | bigint>;
}
export interface FromBpsOptions {
    package?: string;
    arguments: FromBpsArguments | [
        v: RawTransactionArgument<number | bigint>
    ];
}
export function fromBps(options: FromBpsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        'u64'
    ] satisfies string[];
    const parameterNames = ["v"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'from_bps',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FromFractionArguments {
    n: RawTransactionArgument<number | bigint>;
    m: RawTransactionArgument<number | bigint>;
}
export interface FromFractionOptions {
    package?: string;
    arguments: FromFractionArguments | [
        n: RawTransactionArgument<number | bigint>,
        m: RawTransactionArgument<number | bigint>
    ];
}
export function fromFraction(options: FromFractionOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        'u64',
        'u64'
    ] satisfies string[];
    const parameterNames = ["n", "m"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'from_fraction',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FromScaledValArguments {
    v: RawTransactionArgument<number | bigint>;
}
export interface FromScaledValOptions {
    package?: string;
    arguments: FromScaledValArguments | [
        v: RawTransactionArgument<number | bigint>
    ];
}
export function fromScaledVal(options: FromScaledValOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        'u128'
    ] satisfies string[];
    const parameterNames = ["v"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'from_scaled_val',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ToScaledValArguments {
    v: RawTransactionArgument<string>;
}
export interface ToScaledValOptions {
    package?: string;
    arguments: ToScaledValArguments | [
        v: RawTransactionArgument<string>
    ];
}
export function toScaledVal(options: ToScaledValOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["v"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'to_scaled_val',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface AddOptions {
    package?: string;
    arguments: AddArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function add(options: AddOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'add',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SubArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface SubOptions {
    package?: string;
    arguments: SubArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function sub(options: SubOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'sub',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SaturatingSubArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface SaturatingSubOptions {
    package?: string;
    arguments: SaturatingSubArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function saturatingSub(options: SaturatingSubOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'saturating_sub',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MulArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface MulOptions {
    package?: string;
    arguments: MulArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function mul(options: MulOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'mul',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DivArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface DivOptions {
    package?: string;
    arguments: DivArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function div(options: DivOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'div',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddU64Arguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<number | bigint>;
}
export interface AddU64Options {
    package?: string;
    arguments: AddU64Arguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<number | bigint>
    ];
}
export function addU64(options: AddU64Options) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'add_u64',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SubU64Arguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<number | bigint>;
}
export interface SubU64Options {
    package?: string;
    arguments: SubU64Arguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<number | bigint>
    ];
}
export function subU64(options: SubU64Options) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'sub_u64',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SaturatingSubU64Arguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<number | bigint>;
}
export interface SaturatingSubU64Options {
    package?: string;
    arguments: SaturatingSubU64Arguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<number | bigint>
    ];
}
export function saturatingSubU64(options: SaturatingSubU64Options) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'saturating_sub_u64',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MulU64Arguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<number | bigint>;
}
export interface MulU64Options {
    package?: string;
    arguments: MulU64Arguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<number | bigint>
    ];
}
export function mulU64(options: MulU64Options) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'mul_u64',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DivU64Arguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<number | bigint>;
}
export interface DivU64Options {
    package?: string;
    arguments: DivU64Arguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<number | bigint>
    ];
}
export function divU64(options: DivU64Options) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'div_u64',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface PowArguments {
    b: RawTransactionArgument<string>;
    e: RawTransactionArgument<number | bigint>;
}
export interface PowOptions {
    package?: string;
    arguments: PowArguments | [
        b: RawTransactionArgument<string>,
        e: RawTransactionArgument<number | bigint>
    ];
}
export function pow(options: PowOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["b", "e"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'pow',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FloorArguments {
    v: RawTransactionArgument<string>;
}
export interface FloorOptions {
    package?: string;
    arguments: FloorArguments | [
        v: RawTransactionArgument<string>
    ];
}
export function floor(options: FloorOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["v"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'floor',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CeilArguments {
    v: RawTransactionArgument<string>;
}
export interface CeilOptions {
    package?: string;
    arguments: CeilArguments | [
        v: RawTransactionArgument<string>
    ];
}
export function ceil(options: CeilOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["v"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'ceil',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RoundArguments {
    v: RawTransactionArgument<string>;
}
export interface RoundOptions {
    package?: string;
    arguments: RoundArguments | [
        v: RawTransactionArgument<string>
    ];
}
export function round(options: RoundOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["v"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'round',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface EqArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface EqOptions {
    package?: string;
    arguments: EqArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function eq(options: EqOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'eq',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GtArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface GtOptions {
    package?: string;
    arguments: GtArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function gt(options: GtOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'gt',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GteArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface GteOptions {
    package?: string;
    arguments: GteArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function gte(options: GteOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'gte',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface LtArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface LtOptions {
    package?: string;
    arguments: LtArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function lt(options: LtOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'lt',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface LteArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface LteOptions {
    package?: string;
    arguments: LteArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function lte(options: LteOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'lte',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MinArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface MinOptions {
    package?: string;
    arguments: MinArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function min(options: MinOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'min',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MaxArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface MaxOptions {
    package?: string;
    arguments: MaxArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function max(options: MaxOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'max',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DiffArguments {
    a: RawTransactionArgument<string>;
    b: RawTransactionArgument<string>;
}
export interface DiffOptions {
    package?: string;
    arguments: DiffArguments | [
        a: RawTransactionArgument<string>,
        b: RawTransactionArgument<string>
    ];
}
export function diff(options: DiffOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    const argumentsTypes = [
        `${packageAddress}::float::Float`,
        `${packageAddress}::float::Float`
    ] satisfies string[];
    const parameterNames = ["a", "b"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'diff',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface PrecisionOptions {
    package?: string;
    arguments?: [
    ];
}
export function precision(options: PrecisionOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_framework';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'float',
        function: 'precision',
    });
}