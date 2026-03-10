/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as share from './share.js';
const $moduleName = '@local-pkg/bucket_onchain_config::object_config';
export const ObjectConfig = new MoveStruct({ name: `${$moduleName}::ObjectConfig`, fields: {
        id: bcs.Address,
        treasury_obj: share.SharedObjectRef,
        vault_rewarder_registry: share.SharedObjectRef,
        saving_pool_incentive_global_config_obj: share.SharedObjectRef,
        flash_global_config_obj: share.SharedObjectRef,
        blacklist_obj: share.SharedObjectRef
    } });
export interface NewObjectConfigArguments {
    Admin: RawTransactionArgument<string>;
    treasuryObj: RawTransactionArgument<string>;
    vaultRewarderRegistry: RawTransactionArgument<string>;
    savingPoolIncentiveGlobalConfigObj: RawTransactionArgument<string>;
    flashGlobalConfigObj: RawTransactionArgument<string>;
    blacklistObj: RawTransactionArgument<string>;
}
export interface NewObjectConfigOptions {
    package?: string;
    arguments: NewObjectConfigArguments | [
        Admin: RawTransactionArgument<string>,
        treasuryObj: RawTransactionArgument<string>,
        vaultRewarderRegistry: RawTransactionArgument<string>,
        savingPoolIncentiveGlobalConfigObj: RawTransactionArgument<string>,
        flashGlobalConfigObj: RawTransactionArgument<string>,
        blacklistObj: RawTransactionArgument<string>
    ];
}
export function newObjectConfig(options: NewObjectConfigOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        null,
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "treasuryObj", "vaultRewarderRegistry", "savingPoolIncentiveGlobalConfigObj", "flashGlobalConfigObj", "blacklistObj"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'object_config',
        function: 'new_object_config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyTreasuryObjArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newObj: RawTransactionArgument<string>;
}
export interface ModifyTreasuryObjOptions {
    package?: string;
    arguments: ModifyTreasuryObjArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newObj: RawTransactionArgument<string>
    ];
}
export function modifyTreasuryObj(options: ModifyTreasuryObjOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newObj"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'object_config',
        function: 'modify_treasury_obj',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyBlacklistObjArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newObj: RawTransactionArgument<string>;
}
export interface ModifyBlacklistObjOptions {
    package?: string;
    arguments: ModifyBlacklistObjArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newObj: RawTransactionArgument<string>
    ];
}
export function modifyBlacklistObj(options: ModifyBlacklistObjOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newObj"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'object_config',
        function: 'modify_blacklist_obj',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyVaultRewarderRegistryArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newObj: RawTransactionArgument<string>;
}
export interface ModifyVaultRewarderRegistryOptions {
    package?: string;
    arguments: ModifyVaultRewarderRegistryArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newObj: RawTransactionArgument<string>
    ];
}
export function modifyVaultRewarderRegistry(options: ModifyVaultRewarderRegistryOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newObj"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'object_config',
        function: 'modify_vault_rewarder_registry',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifySavingPoolIncentiveGlobalConfigObjArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newObj: RawTransactionArgument<string>;
}
export interface ModifySavingPoolIncentiveGlobalConfigObjOptions {
    package?: string;
    arguments: ModifySavingPoolIncentiveGlobalConfigObjArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newObj: RawTransactionArgument<string>
    ];
}
export function modifySavingPoolIncentiveGlobalConfigObj(options: ModifySavingPoolIncentiveGlobalConfigObjOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newObj"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'object_config',
        function: 'modify_saving_pool_incentive_global_config_obj',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyFlashGlobalConfigObjArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newObj: RawTransactionArgument<string>;
}
export interface ModifyFlashGlobalConfigObjOptions {
    package?: string;
    arguments: ModifyFlashGlobalConfigObjArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newObj: RawTransactionArgument<string>
    ];
}
export function modifyFlashGlobalConfigObj(options: ModifyFlashGlobalConfigObjOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newObj"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'object_config',
        function: 'modify_flash_global_config_obj',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}