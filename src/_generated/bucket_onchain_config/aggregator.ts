/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveEnum, MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as share from './share.js';
import * as vec_map from './deps/sui/vec_map.js';
const $moduleName = '@local-pkg/bucket_onchain_config::aggregator';
export const AggregatorObjectInfo = new MoveEnum({ name: `${$moduleName}::AggregatorObjectInfo`, fields: {
        Pyth: new MoveStruct({ name: `AggregatorObjectInfo.Pyth`, fields: {
                priceAggregator: share.SharedObjectRef,
                pythPriceId: bcs.string()
            } }),
        DerivativeInfo: new MoveStruct({ name: `AggregatorObjectInfo.DerivativeInfo`, fields: {
                priceAggregator: share.SharedObjectRef,
                underlying_coin_type: bcs.string(),
                derivative_kind: bcs.string()
            } })
    } });
export const Aggregator = new MoveStruct({ name: `${$moduleName}::Aggregator`, fields: {
        id: bcs.Address,
        table: vec_map.VecMap(bcs.string(), AggregatorObjectInfo)
    } });
export interface NewAggregatorArguments {
    Admin: RawTransactionArgument<string>;
}
export interface NewAggregatorOptions {
    package?: string;
    arguments: NewAggregatorArguments | [
        Admin: RawTransactionArgument<string>
    ];
}
export function newAggregator(options: NewAggregatorOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'aggregator',
        function: 'new_aggregator',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewPythAggregatorObjectInfoArguments {
    Admin: RawTransactionArgument<string>;
    priceAggregator: RawTransactionArgument<string>;
    pythPriceId: RawTransactionArgument<string>;
}
export interface NewPythAggregatorObjectInfoOptions {
    package?: string;
    arguments: NewPythAggregatorObjectInfoArguments | [
        Admin: RawTransactionArgument<string>,
        priceAggregator: RawTransactionArgument<string>,
        pythPriceId: RawTransactionArgument<string>
    ];
}
export function newPythAggregatorObjectInfo(options: NewPythAggregatorObjectInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "priceAggregator", "pythPriceId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'aggregator',
        function: 'new_pyth_aggregator_object_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewDerivativeAggregatorObjectInfoArguments {
    Admin: RawTransactionArgument<string>;
    priceAggregator: RawTransactionArgument<string>;
    underlyingCoinType: RawTransactionArgument<string>;
    derivativeKind: RawTransactionArgument<string>;
}
export interface NewDerivativeAggregatorObjectInfoOptions {
    package?: string;
    arguments: NewDerivativeAggregatorObjectInfoArguments | [
        Admin: RawTransactionArgument<string>,
        priceAggregator: RawTransactionArgument<string>,
        underlyingCoinType: RawTransactionArgument<string>,
        derivativeKind: RawTransactionArgument<string>
    ];
}
export function newDerivativeAggregatorObjectInfo(options: NewDerivativeAggregatorObjectInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String',
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "priceAggregator", "underlyingCoinType", "derivativeKind"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'aggregator',
        function: 'new_derivative_aggregator_object_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyAggregatorObjArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    key: RawTransactionArgument<string>;
    newInfo: RawTransactionArgument<string>;
}
export interface ModifyAggregatorObjOptions {
    package?: string;
    arguments: ModifyAggregatorObjArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        key: RawTransactionArgument<string>,
        newInfo: RawTransactionArgument<string>
    ];
}
export function modifyAggregatorObj(options: ModifyAggregatorObjOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String',
        null
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "key", "newInfo"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'aggregator',
        function: 'modify_aggregator_obj',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}