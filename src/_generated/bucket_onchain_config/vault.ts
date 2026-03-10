/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as share from './share.js';
import * as vec_map from './deps/sui/vec_map.js';
const $moduleName = '@local-pkg/bucket_onchain_config::vault';
export const RewarderInfo = new MoveStruct({ name: `${$moduleName}::RewarderInfo`, fields: {
        rewarder_id: bcs.string(),
        reward_type: bcs.string()
    } });
export const VaultObjectInfo = new MoveStruct({ name: `${$moduleName}::VaultObjectInfo`, fields: {
        vault: share.SharedObjectRef,
        rewarders: bcs.option(bcs.vector(RewarderInfo))
    } });
export const Vault = new MoveStruct({ name: `${$moduleName}::Vault`, fields: {
        id: bcs.Address,
        table: vec_map.VecMap(bcs.string(), VaultObjectInfo)
    } });
export interface NewVaultArguments {
    Admin: RawTransactionArgument<string>;
}
export interface NewVaultOptions {
    package?: string;
    arguments: NewVaultArguments | [
        Admin: RawTransactionArgument<string>
    ];
}
export function newVault(options: NewVaultOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["Admin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'new_vault',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyVaultObjArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    key: RawTransactionArgument<string>;
    newInfo: RawTransactionArgument<string>;
}
export interface ModifyVaultObjOptions {
    package?: string;
    arguments: ModifyVaultObjArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        key: RawTransactionArgument<string>,
        newInfo: RawTransactionArgument<string>
    ];
}
export function modifyVaultObj(options: ModifyVaultObjOptions) {
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
        module: 'vault',
        function: 'modify_vault_obj',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewRewarderInfoArguments {
    Admin: RawTransactionArgument<string>;
    rewarderId: RawTransactionArgument<string>;
    rewardType: RawTransactionArgument<string>;
}
export interface NewRewarderInfoOptions {
    package?: string;
    arguments: NewRewarderInfoArguments | [
        Admin: RawTransactionArgument<string>,
        rewarderId: RawTransactionArgument<string>,
        rewardType: RawTransactionArgument<string>
    ];
}
export function newRewarderInfo(options: NewRewarderInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        '0x1::string::String',
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "rewarderId", "rewardType"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'new_rewarder_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewVaultObjectInfoArguments {
    Admin: RawTransactionArgument<string>;
    vault: RawTransactionArgument<string>;
    rewarders: RawTransactionArgument<string[] | null>;
}
export interface NewVaultObjectInfoOptions {
    package?: string;
    arguments: NewVaultObjectInfoArguments | [
        Admin: RawTransactionArgument<string>,
        vault: RawTransactionArgument<string>,
        rewarders: RawTransactionArgument<string[] | null>
    ];
}
export function newVaultObjectInfo(options: NewVaultObjectInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::option::Option<vector<null>>'
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "vault", "rewarders"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'new_vault_object_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}