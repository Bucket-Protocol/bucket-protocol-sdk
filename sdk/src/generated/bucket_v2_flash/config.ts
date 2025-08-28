/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as float from './deps/bucket_v2_framework/float.js';
import * as object from './deps/sui/object.js';
import * as vec_map from './deps/sui/vec_map.js';
const $moduleName = '@local-pkg/bucket_v2_flash::config';
export const Config = new MoveStruct({ name: `${$moduleName}::Config`, fields: {
        fee_rate: float.Float,
        max_amount: bcs.u64(),
        total_amount: bcs.u64()
    } });
export const GlobalConfig = new MoveStruct({ name: `${$moduleName}::GlobalConfig`, fields: {
        id: object.UID,
        default_config: Config,
        partner_configs: vec_map.VecMap(bcs.Address, Config)
    } });
export const FlashMintReceipt = new MoveStruct({ name: `${$moduleName}::FlashMintReceipt`, fields: {
        partner: bcs.option(bcs.Address),
        mint_amount: bcs.u64(),
        fee_amount: bcs.u64()
    } });
export interface SetFlashConfigArguments {
    self: RawTransactionArgument<string>;
    _: RawTransactionArgument<string>;
    partner: RawTransactionArgument<string | null>;
    feeRateBps: RawTransactionArgument<number | bigint>;
    maxAmount: RawTransactionArgument<number | bigint>;
}
export interface SetFlashConfigOptions {
    package?: string;
    arguments: SetFlashConfigArguments | [
        self: RawTransactionArgument<string>,
        _: RawTransactionArgument<string>,
        partner: RawTransactionArgument<string | null>,
        feeRateBps: RawTransactionArgument<number | bigint>,
        maxAmount: RawTransactionArgument<number | bigint>
    ];
}
export function setFlashConfig(options: SetFlashConfigOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    const argumentsTypes = [
        `${packageAddress}::config::GlobalConfig`,
        `${packageAddress}::admin::AdminCap`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>',
        'u64',
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "_", "partner", "feeRateBps", "maxAmount"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'set_flash_config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FlashMintArguments {
    self: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    partner: RawTransactionArgument<string | null>;
    value: RawTransactionArgument<number | bigint>;
}
export interface FlashMintOptions {
    package?: string;
    arguments: FlashMintArguments | [
        self: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        partner: RawTransactionArgument<string | null>,
        value: RawTransactionArgument<number | bigint>
    ];
}
export function flashMint(options: FlashMintOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    const argumentsTypes = [
        `${packageAddress}::config::GlobalConfig`,
        `${packageAddress}::usdb::Treasury`,
        `0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<${packageAddress}::account::AccountRequest>`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "treasury", "partner", "value"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'flash_mint',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FlashBurnArguments {
    self: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    repayment: RawTransactionArgument<string>;
    receipt: RawTransactionArgument<string>;
}
export interface FlashBurnOptions {
    package?: string;
    arguments: FlashBurnArguments | [
        self: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        repayment: RawTransactionArgument<string>,
        receipt: RawTransactionArgument<string>
    ];
}
export function flashBurn(options: FlashBurnOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    const argumentsTypes = [
        `${packageAddress}::config::GlobalConfig`,
        `${packageAddress}::usdb::Treasury`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${packageAddress}::usdb::USDB>`,
        `${packageAddress}::config::FlashMintReceipt`
    ] satisfies string[];
    const parameterNames = ["self", "treasury", "repayment", "receipt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'flash_burn',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ConfigArguments {
    self: RawTransactionArgument<string>;
    partnerOpt: RawTransactionArgument<string | null>;
}
export interface ConfigOptions {
    package?: string;
    arguments: ConfigArguments | [
        self: RawTransactionArgument<string>,
        partnerOpt: RawTransactionArgument<string | null>
    ];
}
export function config(options: ConfigOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    const argumentsTypes = [
        `${packageAddress}::config::GlobalConfig`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>'
    ] satisfies string[];
    const parameterNames = ["self", "partnerOpt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FeeRateArguments {
    self: RawTransactionArgument<string>;
    partnerOpt: RawTransactionArgument<string | null>;
}
export interface FeeRateOptions {
    package?: string;
    arguments: FeeRateArguments | [
        self: RawTransactionArgument<string>,
        partnerOpt: RawTransactionArgument<string | null>
    ];
}
export function feeRate(options: FeeRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    const argumentsTypes = [
        `${packageAddress}::config::GlobalConfig`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>'
    ] satisfies string[];
    const parameterNames = ["self", "partnerOpt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'fee_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MaxAmountArguments {
    self: RawTransactionArgument<string>;
    partnerOpt: RawTransactionArgument<string | null>;
}
export interface MaxAmountOptions {
    package?: string;
    arguments: MaxAmountArguments | [
        self: RawTransactionArgument<string>,
        partnerOpt: RawTransactionArgument<string | null>
    ];
}
export function maxAmount(options: MaxAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    const argumentsTypes = [
        `${packageAddress}::config::GlobalConfig`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>'
    ] satisfies string[];
    const parameterNames = ["self", "partnerOpt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'max_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TotalAmountArguments {
    self: RawTransactionArgument<string>;
    partnerOpt: RawTransactionArgument<string | null>;
}
export interface TotalAmountOptions {
    package?: string;
    arguments: TotalAmountArguments | [
        self: RawTransactionArgument<string>,
        partnerOpt: RawTransactionArgument<string | null>
    ];
}
export function totalAmount(options: TotalAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    const argumentsTypes = [
        `${packageAddress}::config::GlobalConfig`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>'
    ] satisfies string[];
    const parameterNames = ["self", "partnerOpt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'total_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MintAmountArguments {
    receipt: RawTransactionArgument<string>;
}
export interface MintAmountOptions {
    package?: string;
    arguments: MintAmountArguments | [
        receipt: RawTransactionArgument<string>
    ];
}
export function mintAmount(options: MintAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    const argumentsTypes = [
        `${packageAddress}::config::FlashMintReceipt`
    ] satisfies string[];
    const parameterNames = ["receipt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'mint_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FeeAmountArguments {
    receipt: RawTransactionArgument<string>;
}
export interface FeeAmountOptions {
    package?: string;
    arguments: FeeAmountArguments | [
        receipt: RawTransactionArgument<string>
    ];
}
export function feeAmount(options: FeeAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    const argumentsTypes = [
        `${packageAddress}::config::FlashMintReceipt`
    ] satisfies string[];
    const parameterNames = ["receipt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'fee_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}