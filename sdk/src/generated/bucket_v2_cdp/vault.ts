/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * Vault module for managing collateralized debt positions (CDPs) in the BucketV2
 * protocol. Handles vault creation, position management, interest accrual,
 * liquidation, and admin controls.
 */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs, type BcsType } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as double from './deps/bucket_v2_framework/double.js';
import * as object from './deps/sui/object.js';
import * as acl from './acl.js';
import * as limited_supply from './deps/bucket_v2_usd/limited_supply.js';
import * as float from './deps/bucket_v2_framework/float.js';
import * as type_name from './deps/std/type_name.js';
import * as linked_table from './deps/bucket_v2_framework/linked_table.js';
import * as balance from './deps/sui/balance.js';
import * as vec_set from './deps/sui/vec_set.js';
const $moduleName = '@local-pkg/bucket_v2_cdp::vault';
export const Position = new MoveStruct({ name: `${$moduleName}::Position`, fields: {
        coll_amount: bcs.u64(),
        debt_amount: bcs.u64(),
        interest_unit: double.Double
    } });
export const Vault = new MoveStruct({ name: `${$moduleName}::Vault`, fields: {
        id: object.UID,
        /**
         * No security checking when value equals 0; security == 1 is the strictest level.
         * Any level greater than or equal to the current non-zero security level will be
         * aborted.
         */
        security_level: bcs.u8(),
        access_control: acl.Acl,
        decimal: bcs.u8(),
        interest_rate: double.Double,
        interest_unit: double.Double,
        timestamp: bcs.u64(),
        total_pending_interest_amount: bcs.u64(),
        limited_supply: limited_supply.LimitedSupply,
        total_debt_amount: bcs.u64(),
        min_collateral_ratio: float.Float,
        liquidation_rule: type_name.TypeName,
        request_checklist: bcs.vector(type_name.TypeName),
        response_checklist: bcs.vector(type_name.TypeName),
        position_table: linked_table.LinkedTable(bcs.Address),
        balance: balance.Balance,
        position_locker: vec_set.VecSet(bcs.Address)
    } });
export const PositionData = new MoveStruct({ name: `${$moduleName}::PositionData`, fields: {
        debtor: bcs.Address,
        coll_amount: bcs.u64(),
        debt_amount: bcs.u64()
    } });
export interface NewArguments {
    treasury: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    decimal: RawTransactionArgument<number>;
    interestRate: RawTransactionArgument<string>;
    supplyLimit: RawTransactionArgument<number | bigint>;
    minCollateralRatio: RawTransactionArgument<string>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        treasury: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        decimal: RawTransactionArgument<number>,
        interestRate: RawTransactionArgument<string>,
        supplyLimit: RawTransactionArgument<number | bigint>,
        minCollateralRatio: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Admin Funs Create a new vault with specified parameters. Only callable by admin. */
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
        'u8',
        '0x070e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63::double::Double',
        'u64',
        '0x070e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63::float::Float'
    ] satisfies string[];
    const parameterNames = ["treasury", "Cap", "decimal", "interestRate", "supplyLimit", "minCollateralRatio"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SetSupplyLimitArguments {
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    limit: RawTransactionArgument<number | bigint>;
}
export interface SetSupplyLimitOptions {
    package?: string;
    arguments: SetSupplyLimitArguments | [
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        limit: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
export function setSupplyLimit(options: SetSupplyLimitOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
        'u64'
    ] satisfies string[];
    const parameterNames = ["vault", "Cap", "limit"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'set_supply_limit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SetInterestRateArguments {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    interestRateBps: RawTransactionArgument<number | bigint>;
}
export interface SetInterestRateOptions {
    package?: string;
    arguments: SetInterestRateArguments | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        interestRateBps: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
export function setInterestRate(options: SetInterestRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        'u64'
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "Cap", "clock", "interestRateBps"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'set_interest_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SetLiquidationRuleArguments {
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface SetLiquidationRuleOptions {
    package?: string;
    arguments: SetLiquidationRuleArguments | [
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function setLiquidationRule(options: SetLiquidationRuleOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap'
    ] satisfies string[];
    const parameterNames = ["vault", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'set_liquidation_rule',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddRequestCheckArguments {
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface AddRequestCheckOptions {
    package?: string;
    arguments: AddRequestCheckArguments | [
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function addRequestCheck(options: AddRequestCheckOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap'
    ] satisfies string[];
    const parameterNames = ["vault", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'add_request_check',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveRequestCheckArguments {
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface RemoveRequestCheckOptions {
    package?: string;
    arguments: RemoveRequestCheckArguments | [
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function removeRequestCheck(options: RemoveRequestCheckOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap'
    ] satisfies string[];
    const parameterNames = ["vault", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'remove_request_check',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddResponseCheckArguments {
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface AddResponseCheckOptions {
    package?: string;
    arguments: AddResponseCheckArguments | [
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function addResponseCheck(options: AddResponseCheckOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap'
    ] satisfies string[];
    const parameterNames = ["vault", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'add_response_check',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveResponseCheckArguments {
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface RemoveResponseCheckOptions {
    package?: string;
    arguments: RemoveResponseCheckArguments | [
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function removeResponseCheck(options: RemoveResponseCheckOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap'
    ] satisfies string[];
    const parameterNames = ["vault", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'remove_response_check',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SetManagerRoleArguments {
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    manager: RawTransactionArgument<string>;
    level: RawTransactionArgument<number>;
}
export interface SetManagerRoleOptions {
    package?: string;
    arguments: SetManagerRoleArguments | [
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>,
        level: RawTransactionArgument<number>
    ];
    typeArguments: [
        string
    ];
}
export function setManagerRole(options: SetManagerRoleOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
        'address',
        'u8'
    ] satisfies string[];
    const parameterNames = ["vault", "Cap", "manager", "level"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'set_manager_role',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveManagerRoleArguments {
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    manager: RawTransactionArgument<string>;
}
export interface RemoveManagerRoleOptions {
    package?: string;
    arguments: RemoveManagerRoleArguments | [
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function removeManagerRole(options: RemoveManagerRoleOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
        'address'
    ] satisfies string[];
    const parameterNames = ["vault", "Cap", "manager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'remove_manager_role',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SetSecurityByAdminArguments {
    vault: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    level: RawTransactionArgument<number>;
}
export interface SetSecurityByAdminOptions {
    package?: string;
    arguments: SetSecurityByAdminArguments | [
        vault: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        level: RawTransactionArgument<number>
    ];
    typeArguments: [
        string
    ];
}
export function setSecurityByAdmin(options: SetSecurityByAdminOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
        'u8'
    ] satisfies string[];
    const parameterNames = ["vault", "Cap", "level"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'set_security_by_admin',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SetSecurityByManagerLevelArguments {
    vault: RawTransactionArgument<string>;
}
export interface SetSecurityByManagerLevelOptions {
    package?: string;
    arguments: SetSecurityByManagerLevelArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function setSecurityByManagerLevel(options: SetSecurityByManagerLevelOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'set_security_by_manager_level',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdatePositionArguments {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    collPriceOpt: RawTransactionArgument<string | null>;
    request: RawTransactionArgument<string>;
}
export interface UpdatePositionOptions {
    package?: string;
    arguments: UpdatePositionArguments | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        collPriceOpt: RawTransactionArgument<string | null>,
        request: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Public Funs Update a user's position in the vault (deposit, withdraw, borrow,
 * repay) Handles interest accrual, collateralization checks, and emits events.
 */
export function updatePosition(options: UpdatePositionOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce::result::PriceResult<${options.typeArguments[0]}>>`,
        `${packageAddress}::request::UpdateRequest<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "clock", "collPriceOpt", "request"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'update_position',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyResponseArguments {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    response: RawTransactionArgument<string>;
}
export interface DestroyResponseOptions {
    package?: string;
    arguments: DestroyResponseArguments | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        response: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Destroy a response object, checking required witnesses (for post-processing) */
export function destroyResponse(options: DestroyResponseOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
        `${packageAddress}::response::UpdateResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "response"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'destroy_response',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DebtorRequestArguments {
    vault: RawTransactionArgument<string>;
    accountReq: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    deposit: RawTransactionArgument<string>;
    borrowAmount: RawTransactionArgument<number | bigint>;
    repayment: RawTransactionArgument<string>;
    withdrawAmount: RawTransactionArgument<number | bigint>;
}
export interface DebtorRequestOptions {
    package?: string;
    arguments: DebtorRequestArguments | [
        vault: RawTransactionArgument<string>,
        accountReq: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        deposit: RawTransactionArgument<string>,
        borrowAmount: RawTransactionArgument<number | bigint>,
        repayment: RawTransactionArgument<string>,
        withdrawAmount: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
/** Creates a debtor request (user borrows or repays, can deposit/withdraw) */
export function debtorRequest(options: DebtorRequestOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x070e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63::account::AccountRequest',
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`,
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::USDB>',
        'u64'
    ] satisfies string[];
    const parameterNames = ["vault", "accountReq", "treasury", "deposit", "borrowAmount", "repayment", "withdrawAmount"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'debtor_request',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DonorRequestArguments {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    debtor: RawTransactionArgument<string>;
    deposit: RawTransactionArgument<string>;
    repayment: RawTransactionArgument<string>;
}
export interface DonorRequestOptions {
    package?: string;
    arguments: DonorRequestArguments | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        debtor: RawTransactionArgument<string>,
        deposit: RawTransactionArgument<string>,
        repayment: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Creates a donor request (third party repays on behalf of a debtor, can deposit) */
export function donorRequest(options: DonorRequestOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
        'address',
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::USDB>'
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "debtor", "deposit", "repayment"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'donor_request',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LiquidateArguments<LR extends BcsType<any>> {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    collPrice: RawTransactionArgument<string>;
    debtor: RawTransactionArgument<string>;
    repayment: RawTransactionArgument<string>;
    LiqudationRule: RawTransactionArgument<LR>;
}
export interface LiquidateOptions<LR extends BcsType<any>> {
    package?: string;
    arguments: LiquidateArguments<LR> | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        collPrice: RawTransactionArgument<string>,
        debtor: RawTransactionArgument<string>,
        repayment: RawTransactionArgument<string>,
        LiqudationRule: RawTransactionArgument<LR>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Liquidate an unhealthy position, returning a request to update the position */
export function liquidate<LR extends BcsType<any>>(options: LiquidateOptions<LR>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce::result::PriceResult<${options.typeArguments[0]}>`,
        'address',
        '0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::USDB>',
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "clock", "collPrice", "debtor", "repayment", "LiqudationRule"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'liquidate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CollectInterestArguments {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
}
export interface CollectInterestOptions {
    package?: string;
    arguments: CollectInterestArguments | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function collectInterest(options: CollectInterestOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'collect_interest',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DecimalArguments {
    vault: RawTransactionArgument<string>;
}
export interface DecimalOptions {
    package?: string;
    arguments: DecimalArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter Funs Get vault's collateral decimal places */
export function decimal(options: DecimalOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'decimal',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface InterestRateArguments {
    vault: RawTransactionArgument<string>;
}
export interface InterestRateOptions {
    package?: string;
    arguments: InterestRateArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get vault's interest rate */
export function interestRate(options: InterestRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'interest_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LimitedSupplyArguments {
    vault: RawTransactionArgument<string>;
}
export interface LimitedSupplyOptions {
    package?: string;
    arguments: LimitedSupplyArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get reference to vault's limited supply object */
export function limitedSupply(options: LimitedSupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'limited_supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MinCollateralRatioArguments {
    vault: RawTransactionArgument<string>;
}
export interface MinCollateralRatioOptions {
    package?: string;
    arguments: MinCollateralRatioArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get vault's minimum collateral ratio */
export function minCollateralRatio(options: MinCollateralRatioOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'min_collateral_ratio',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LiquidationRuleArguments {
    vault: RawTransactionArgument<string>;
}
export interface LiquidationRuleOptions {
    package?: string;
    arguments: LiquidationRuleArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get vault's liquidation rule type */
export function liquidationRule(options: LiquidationRuleOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'liquidation_rule',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RequestChecklistArguments {
    vault: RawTransactionArgument<string>;
}
export interface RequestChecklistOptions {
    package?: string;
    arguments: RequestChecklistArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get reference to request witness checklist */
export function requestChecklist(options: RequestChecklistOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'request_checklist',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ResponseChecklistArguments {
    vault: RawTransactionArgument<string>;
}
export interface ResponseChecklistOptions {
    package?: string;
    arguments: ResponseChecklistArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get reference to response witness checklist */
export function responseChecklist(options: ResponseChecklistOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'response_checklist',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PositionTableArguments {
    vault: RawTransactionArgument<string>;
}
export interface PositionTableOptions {
    package?: string;
    arguments: PositionTableArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get reference to the position table */
export function positionTable(options: PositionTableOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'position_table',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PositionExistsArguments {
    vault: RawTransactionArgument<string>;
    debtor: RawTransactionArgument<string>;
}
export interface PositionExistsOptions {
    package?: string;
    arguments: PositionExistsArguments | [
        vault: RawTransactionArgument<string>,
        debtor: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Check if a position exists for a given debtor */
export function positionExists(options: PositionExistsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["vault", "debtor"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'position_exists',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PositionIsHealthyArguments {
    vault: RawTransactionArgument<string>;
    debtor: RawTransactionArgument<string>;
    collPrice: RawTransactionArgument<string>;
}
export interface PositionIsHealthyOptions {
    package?: string;
    arguments: PositionIsHealthyArguments | [
        vault: RawTransactionArgument<string>,
        debtor: RawTransactionArgument<string>,
        collPrice: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function positionIsHealthy(options: PositionIsHealthyOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        'address',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce::result::PriceResult<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault", "debtor", "clock", "collPrice"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'position_is_healthy',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface GetPositionDataArguments {
    vault: RawTransactionArgument<string>;
    debtor: RawTransactionArgument<string>;
}
export interface GetPositionDataOptions {
    package?: string;
    arguments: GetPositionDataArguments | [
        vault: RawTransactionArgument<string>,
        debtor: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get up-to-date collateral and debt for a debtor (including accrued interest) */
export function getPositionData(options: GetPositionDataOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        'address',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["vault", "debtor", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'get_position_data',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface GetRawPositionDataArguments {
    vault: RawTransactionArgument<string>;
    debtor: RawTransactionArgument<string>;
}
export interface GetRawPositionDataOptions {
    package?: string;
    arguments: GetRawPositionDataArguments | [
        vault: RawTransactionArgument<string>,
        debtor: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get raw position data (collateral, debt, timestamp) for a debtor */
export function getRawPositionData(options: GetRawPositionDataOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["vault", "debtor"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'get_raw_position_data',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface IdArguments {
    vault: RawTransactionArgument<string>;
}
export interface IdOptions {
    package?: string;
    arguments: IdArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Get the vault's object ID */
export function id(options: IdOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface GetPositionsArguments {
    vault: RawTransactionArgument<string>;
    cursor: RawTransactionArgument<string | null>;
    pageSize: RawTransactionArgument<number | bigint>;
}
export interface GetPositionsOptions {
    package?: string;
    arguments: GetPositionsArguments | [
        vault: RawTransactionArgument<string>,
        cursor: RawTransactionArgument<string | null>,
        pageSize: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
/** Get a paginated list of positions in the vault */
export function getPositions(options: GetPositionsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::Vault<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>',
        'u64'
    ] satisfies string[];
    const parameterNames = ["vault", "clock", "cursor", "pageSize"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'get_positions',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PositionDataArguments {
    position: RawTransactionArgument<string>;
}
export interface PositionDataOptions {
    package?: string;
    arguments: PositionDataArguments | [
        position: RawTransactionArgument<string>
    ];
}
/** Get tuple of (debtor, collateral, debt) from PositionData */
export function positionData(options: PositionDataOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    const argumentsTypes = [
        `${packageAddress}::vault::PositionData`
    ] satisfies string[];
    const parameterNames = ["position"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'vault',
        function: 'position_data',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}