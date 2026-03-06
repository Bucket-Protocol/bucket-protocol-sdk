/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as share from './share.js';
const $moduleName = '@local-pkg/bucket_onchain_config::oracle_config';
export const OracleConfig = new MoveStruct({ name: `${$moduleName}::OracleConfig`, fields: {
        id: bcs.Address,
        price_service_endpoint: bcs.string(),
        pyth_state_id: bcs.string(),
        wormhole_state_id: bcs.string(),
        pyth_rule_package_id: bcs.string(),
        pyth_rule_config_obj: share.SharedObjectRef
    } });
export interface NewOracleConfigArguments {
    priceServiceEndpoint: RawTransactionArgument<string>;
    pythStateId: RawTransactionArgument<string>;
    wormholeStateId: RawTransactionArgument<string>;
    pythRulePackageId: RawTransactionArgument<string>;
    pythRuleConfigObj: RawTransactionArgument<string>;
}
export interface NewOracleConfigOptions {
    package?: string;
    arguments: NewOracleConfigArguments | [
        priceServiceEndpoint: RawTransactionArgument<string>,
        pythStateId: RawTransactionArgument<string>,
        wormholeStateId: RawTransactionArgument<string>,
        pythRulePackageId: RawTransactionArgument<string>,
        pythRuleConfigObj: RawTransactionArgument<string>
    ];
}
export function newOracleConfig(options: NewOracleConfigOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        null
    ] satisfies (string | null)[];
    const parameterNames = ["priceServiceEndpoint", "pythStateId", "wormholeStateId", "pythRulePackageId", "pythRuleConfigObj"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'oracle_config',
        function: 'new_oracle_config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyPriceServiceEndpointArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newEndpoint: RawTransactionArgument<string>;
}
export interface ModifyPriceServiceEndpointOptions {
    package?: string;
    arguments: ModifyPriceServiceEndpointArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newEndpoint: RawTransactionArgument<string>
    ];
}
export function modifyPriceServiceEndpoint(options: ModifyPriceServiceEndpointOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newEndpoint"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'oracle_config',
        function: 'modify_price_service_endpoint',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyPythStateIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyPythStateIdOptions {
    package?: string;
    arguments: ModifyPythStateIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyPythStateId(options: ModifyPythStateIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'oracle_config',
        function: 'modify_pyth_state_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyWormholeStateIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyWormholeStateIdOptions {
    package?: string;
    arguments: ModifyWormholeStateIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyWormholeStateId(options: ModifyWormholeStateIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'oracle_config',
        function: 'modify_wormhole_state_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyPythRuleConfigObjArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newObj: RawTransactionArgument<string>;
}
export interface ModifyPythRuleConfigObjOptions {
    package?: string;
    arguments: ModifyPythRuleConfigObjArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newObj: RawTransactionArgument<string>
    ];
}
export function modifyPythRuleConfigObj(options: ModifyPythRuleConfigObjOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newObj"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'oracle_config',
        function: 'modify_pyth_rule_config_obj',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyPythRulePackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyPythRulePackageIdOptions {
    package?: string;
    arguments: ModifyPythRulePackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyPythRulePackageId(options: ModifyPythRulePackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'oracle_config',
        function: 'modify_pyth_rule_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}