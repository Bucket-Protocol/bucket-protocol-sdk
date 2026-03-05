/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveEnum, MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as share from './share.js';
import * as vec_map from './deps/sui/vec_map.js';
const $moduleName = '@local-pkg/bucket_onchain_config::price';
export const PriceConfigInfo = new MoveEnum({ name: `${$moduleName}::PriceConfigInfo`, fields: {
        SCOIN: new MoveStruct({ name: `PriceConfigInfo.SCOIN`, fields: {
                package: bcs.string(),
                scoin_rule_config: share.SharedObjectRef,
                scallop_version: share.SharedObjectRef,
                scallop_market: share.SharedObjectRef
            } }),
        GCOIN: new MoveStruct({ name: `PriceConfigInfo.GCOIN`, fields: {
                package: bcs.string(),
                gcoin_rule_config: share.SharedObjectRef,
                unihouse_object: share.SharedObjectRef
            } }),
        BFBTC: new MoveStruct({ name: `PriceConfigInfo.BFBTC`, fields: {
                package: bcs.string(),
                bfbtc_rule_config: share.SharedObjectRef
            } })
    } });
export const PriceConfig = new MoveStruct({ name: `${$moduleName}::PriceConfig`, fields: {
        id: bcs.Address,
        table: vec_map.VecMap(bcs.string(), PriceConfigInfo)
    } });
export interface NewPriceConfigArguments {
    Admin: RawTransactionArgument<string>;
}
export interface NewPriceConfigOptions {
    package?: string;
    arguments: NewPriceConfigArguments | [
        Admin: RawTransactionArgument<string>
    ];
}
export function newPriceConfig(options: NewPriceConfigOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'price',
        function: 'new_price_config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewScoinPriceConfigInfoArguments {
    Admin: RawTransactionArgument<string>;
    package: RawTransactionArgument<string>;
    scoinRuleConfig: RawTransactionArgument<string>;
    scallopVersion: RawTransactionArgument<string>;
    scallopMarket: RawTransactionArgument<string>;
}
export interface NewScoinPriceConfigInfoOptions {
    package?: string;
    arguments: NewScoinPriceConfigInfoArguments | [
        Admin: RawTransactionArgument<string>,
        pkg: RawTransactionArgument<string>,
        scoinRuleConfig: RawTransactionArgument<string>,
        scallopVersion: RawTransactionArgument<string>,
        scallopMarket: RawTransactionArgument<string>
    ];
}
export function newScoinPriceConfigInfo(options: NewScoinPriceConfigInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        '0x1::string::String',
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "package", "scoinRuleConfig", "scallopVersion", "scallopMarket"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'price',
        function: 'new_scoin_price_config_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewGcoinPriceConfigInfoArguments {
    Admin: RawTransactionArgument<string>;
    package: RawTransactionArgument<string>;
    gcoinRuleConfig: RawTransactionArgument<string>;
    unihouseObject: RawTransactionArgument<string>;
}
export interface NewGcoinPriceConfigInfoOptions {
    package?: string;
    arguments: NewGcoinPriceConfigInfoArguments | [
        Admin: RawTransactionArgument<string>,
        pkg: RawTransactionArgument<string>,
        gcoinRuleConfig: RawTransactionArgument<string>,
        unihouseObject: RawTransactionArgument<string>
    ];
}
export function newGcoinPriceConfigInfo(options: NewGcoinPriceConfigInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        '0x1::string::String',
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "package", "gcoinRuleConfig", "unihouseObject"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'price',
        function: 'new_gcoin_price_config_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewBfbtcPriceConfigInfoArguments {
    Admin: RawTransactionArgument<string>;
    package: RawTransactionArgument<string>;
    bfbtcRuleConfig: RawTransactionArgument<string>;
}
export interface NewBfbtcPriceConfigInfoOptions {
    package?: string;
    arguments: NewBfbtcPriceConfigInfoArguments | [
        Admin: RawTransactionArgument<string>,
        pkg: RawTransactionArgument<string>,
        bfbtcRuleConfig: RawTransactionArgument<string>
    ];
}
export function newBfbtcPriceConfigInfo(options: NewBfbtcPriceConfigInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        '0x1::string::String',
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "package", "bfbtcRuleConfig"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'price',
        function: 'new_bfbtc_price_config_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyPriceConfigArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    key: RawTransactionArgument<string>;
    newInfo: RawTransactionArgument<string>;
}
export interface ModifyPriceConfigOptions {
    package?: string;
    arguments: ModifyPriceConfigArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        key: RawTransactionArgument<string>,
        newInfo: RawTransactionArgument<string>
    ];
}
export function modifyPriceConfig(options: ModifyPriceConfigOptions) {
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
        module: 'price',
        function: 'modify_price_config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}