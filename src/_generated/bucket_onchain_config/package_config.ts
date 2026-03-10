/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/bucket_onchain_config::package_config';
export const PackageConfig = new MoveStruct({ name: `${$moduleName}::PackageConfig`, fields: {
        id: bcs.Address,
        original_framework_package_id: bcs.string(),
        original_usdb_package_id: bcs.string(),
        original_oracle_package_id: bcs.string(),
        original_cdp_package_id: bcs.string(),
        original_psm_package_id: bcs.string(),
        original_flash_package_id: bcs.string(),
        original_saving_package_id: bcs.string(),
        original_saving_incentive_package_id: bcs.string(),
        original_borrow_incentive_package_id: bcs.string(),
        original_blacklist_package_id: bcs.string(),
        framework_package_id: bcs.string(),
        usdb_package_id: bcs.string(),
        oracle_package_id: bcs.string(),
        cdp_package_id: bcs.string(),
        psm_package_id: bcs.string(),
        flash_package_id: bcs.string(),
        saving_package_id: bcs.string(),
        saving_incentive_package_id: bcs.string(),
        borrow_incentive_package_id: bcs.string(),
        blacklist_package_id: bcs.string()
    } });
export interface NewPackageConfigArguments {
    Admin: RawTransactionArgument<string>;
    originalFrameworkPackageId: RawTransactionArgument<string>;
    originalUsdbPackageId: RawTransactionArgument<string>;
    originalOraclePackageId: RawTransactionArgument<string>;
    originalCdpPackageId: RawTransactionArgument<string>;
    originalPsmPackageId: RawTransactionArgument<string>;
    originalFlashPackageId: RawTransactionArgument<string>;
    originalSavingPackageId: RawTransactionArgument<string>;
    originalSavingIncentivePackageId: RawTransactionArgument<string>;
    originalBorrowIncentivePackageId: RawTransactionArgument<string>;
    originalBlacklistPackageId: RawTransactionArgument<string>;
    frameworkPackageId: RawTransactionArgument<string>;
    usdbPackageId: RawTransactionArgument<string>;
    oraclePackageId: RawTransactionArgument<string>;
    cdpPackageId: RawTransactionArgument<string>;
    psmPackageId: RawTransactionArgument<string>;
    flashPackageId: RawTransactionArgument<string>;
    savingPackageId: RawTransactionArgument<string>;
    savingIncentivePackageId: RawTransactionArgument<string>;
    borrowIncentivePackageId: RawTransactionArgument<string>;
    blacklistPackageId: RawTransactionArgument<string>;
}
export interface NewPackageConfigOptions {
    package?: string;
    arguments: NewPackageConfigArguments | [
        Admin: RawTransactionArgument<string>,
        originalFrameworkPackageId: RawTransactionArgument<string>,
        originalUsdbPackageId: RawTransactionArgument<string>,
        originalOraclePackageId: RawTransactionArgument<string>,
        originalCdpPackageId: RawTransactionArgument<string>,
        originalPsmPackageId: RawTransactionArgument<string>,
        originalFlashPackageId: RawTransactionArgument<string>,
        originalSavingPackageId: RawTransactionArgument<string>,
        originalSavingIncentivePackageId: RawTransactionArgument<string>,
        originalBorrowIncentivePackageId: RawTransactionArgument<string>,
        originalBlacklistPackageId: RawTransactionArgument<string>,
        frameworkPackageId: RawTransactionArgument<string>,
        usdbPackageId: RawTransactionArgument<string>,
        oraclePackageId: RawTransactionArgument<string>,
        cdpPackageId: RawTransactionArgument<string>,
        psmPackageId: RawTransactionArgument<string>,
        flashPackageId: RawTransactionArgument<string>,
        savingPackageId: RawTransactionArgument<string>,
        savingIncentivePackageId: RawTransactionArgument<string>,
        borrowIncentivePackageId: RawTransactionArgument<string>,
        blacklistPackageId: RawTransactionArgument<string>
    ];
}
export function newPackageConfig(options: NewPackageConfigOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["Admin", "originalFrameworkPackageId", "originalUsdbPackageId", "originalOraclePackageId", "originalCdpPackageId", "originalPsmPackageId", "originalFlashPackageId", "originalSavingPackageId", "originalSavingIncentivePackageId", "originalBorrowIncentivePackageId", "originalBlacklistPackageId", "frameworkPackageId", "usdbPackageId", "oraclePackageId", "cdpPackageId", "psmPackageId", "flashPackageId", "savingPackageId", "savingIncentivePackageId", "borrowIncentivePackageId", "blacklistPackageId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'new_package_config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyFrameworkPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyFrameworkPackageIdOptions {
    package?: string;
    arguments: ModifyFrameworkPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyFrameworkPackageId(options: ModifyFrameworkPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_framework_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalFrameworkPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalFrameworkPackageIdOptions {
    package?: string;
    arguments: ModifyOriginalFrameworkPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalFrameworkPackageId(options: ModifyOriginalFrameworkPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_framework_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalUsdbPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalUsdbPackageIdOptions {
    package?: string;
    arguments: ModifyOriginalUsdbPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalUsdbPackageId(options: ModifyOriginalUsdbPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_usdb_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalOraclePackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalOraclePackageIdOptions {
    package?: string;
    arguments: ModifyOriginalOraclePackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalOraclePackageId(options: ModifyOriginalOraclePackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_oracle_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalCdpPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalCdpPackageIdOptions {
    package?: string;
    arguments: ModifyOriginalCdpPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalCdpPackageId(options: ModifyOriginalCdpPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_cdp_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalPsmPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalPsmPackageIdOptions {
    package?: string;
    arguments: ModifyOriginalPsmPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalPsmPackageId(options: ModifyOriginalPsmPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_psm_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalFlashPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalFlashPackageIdOptions {
    package?: string;
    arguments: ModifyOriginalFlashPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalFlashPackageId(options: ModifyOriginalFlashPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_flash_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalSavingPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalSavingPackageIdOptions {
    package?: string;
    arguments: ModifyOriginalSavingPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalSavingPackageId(options: ModifyOriginalSavingPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_saving_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalSavingIncentivePackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalSavingIncentivePackageIdOptions {
    package?: string;
    arguments: ModifyOriginalSavingIncentivePackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalSavingIncentivePackageId(options: ModifyOriginalSavingIncentivePackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_saving_incentive_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalBorrowIncentivePackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalBorrowIncentivePackageIdOptions {
    package?: string;
    arguments: ModifyOriginalBorrowIncentivePackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalBorrowIncentivePackageId(options: ModifyOriginalBorrowIncentivePackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_borrow_incentive_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOriginalBlacklistPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOriginalBlacklistPackageIdOptions {
    package?: string;
    arguments: ModifyOriginalBlacklistPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOriginalBlacklistPackageId(options: ModifyOriginalBlacklistPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_original_blacklist_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyUsdbPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyUsdbPackageIdOptions {
    package?: string;
    arguments: ModifyUsdbPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyUsdbPackageId(options: ModifyUsdbPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_usdb_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyOraclePackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyOraclePackageIdOptions {
    package?: string;
    arguments: ModifyOraclePackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyOraclePackageId(options: ModifyOraclePackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_oracle_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyCdpPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyCdpPackageIdOptions {
    package?: string;
    arguments: ModifyCdpPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyCdpPackageId(options: ModifyCdpPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_cdp_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyPsmPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyPsmPackageIdOptions {
    package?: string;
    arguments: ModifyPsmPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyPsmPackageId(options: ModifyPsmPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_psm_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyFlashPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyFlashPackageIdOptions {
    package?: string;
    arguments: ModifyFlashPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyFlashPackageId(options: ModifyFlashPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_flash_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifySavingPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifySavingPackageIdOptions {
    package?: string;
    arguments: ModifySavingPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifySavingPackageId(options: ModifySavingPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_saving_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifySavingIncentivePackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifySavingIncentivePackageIdOptions {
    package?: string;
    arguments: ModifySavingIncentivePackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifySavingIncentivePackageId(options: ModifySavingIncentivePackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_saving_incentive_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyBorrowIncentivePackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyBorrowIncentivePackageIdOptions {
    package?: string;
    arguments: ModifyBorrowIncentivePackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyBorrowIncentivePackageId(options: ModifyBorrowIncentivePackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_borrow_incentive_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ModifyBlacklistPackageIdArguments {
    config: RawTransactionArgument<string>;
    Admin: RawTransactionArgument<string>;
    newId: RawTransactionArgument<string>;
}
export interface ModifyBlacklistPackageIdOptions {
    package?: string;
    arguments: ModifyBlacklistPackageIdArguments | [
        config: RawTransactionArgument<string>,
        Admin: RawTransactionArgument<string>,
        newId: RawTransactionArgument<string>
    ];
}
export function modifyBlacklistPackageId(options: ModifyBlacklistPackageIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_onchain_config';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["config", "Admin", "newId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'package_config',
        function: 'modify_blacklist_package_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}