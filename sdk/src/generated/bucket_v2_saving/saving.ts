/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs, type BcsType } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as double from './deps/bucket_v2_framework/double.js';
import * as balance from './deps/sui/balance.js';
import * as object from './deps/sui/object.js';
import * as table from './deps/sui/table.js';
import * as vec_set from './deps/sui/vec_set.js';
import * as type_name from './deps/std/type_name.js';
const $moduleName = '@local-pkg/bucket_v2_saving::saving';
export const InterestConfig = new MoveStruct({ name: `${$moduleName}::InterestConfig`, fields: {
        /** Annual interest rate as a Double (basis points converted to decimal) */
        saving_rate: double.Double,
        /** Timestamp (in milliseconds) when interest was last distributed */
        last_emitted: bcs.u64()
    } });
export const Position = new MoveStruct({ name: `${$moduleName}::Position`, fields: {
        /** User's LP token balance in the pool */
        balance: balance.Balance,
        /** Timestamp when this position was last updated */
        last_update_timestamp: bcs.u64()
    } });
export const SavingPool = new MoveStruct({ name: `${$moduleName}::SavingPool`, fields: {
        /** Unique identifier for this saving pool */
        id: object.UID,
        /** Total supply of LP tokens issued by this pool */
        lp_supply: balance.Supply,
        /** Optional maximum deposit limit for the pool */
        deposit_cap_amount: bcs.option(bcs.u64()),
        /** USDB balance held in the pool reserves */
        usdb_reserve_balance: balance.Balance,
        /** Mapping of user addresses to their positions */
        positions: table.Table,
        /** Interest rate configuration for the pool */
        saving_config: InterestConfig,
        /** Required witness types for deposit operations */
        deposit_response_checklist: vec_set.VecSet(type_name.TypeName),
        /** Required witness types for withdraw operations */
        withdraw_response_checklist: vec_set.VecSet(type_name.TypeName),
        /** Set of addresses with locked positions (ongoing operations) */
        position_locker: vec_set.VecSet(bcs.Address)
    } });
export const DepositResponse = new MoveStruct({ name: `${$moduleName}::DepositResponse`, fields: {
        /** Address of the account that made the deposit */
        account_address: bcs.Address,
        /** Amount of USDB deposited into the pool */
        deposited_usdb_amount: bcs.u64(),
        /** Amount of LP tokens minted for this deposit */
        minted_lp_amount: bcs.u64(),
        /** Previous LP token balance before this deposit */
        prev_lp_balance: bcs.u64(),
        /** Previous last update timestamp before this deposit */
        prev_last_update_timestamp: bcs.u64(),
        /** Set of witness types that have been validated */
        witnesses: vec_set.VecSet(type_name.TypeName)
    } });
export const WithdrawResponse = new MoveStruct({ name: `${$moduleName}::WithdrawResponse`, fields: {
        /** Address of the account that made the withdrawal */
        account_address: bcs.Address,
        /** Amount of LP tokens burned for this withdrawal */
        burned_lp_amount: bcs.u64(),
        /** Previous LP token balance before this withdrawal */
        prev_lp_balance: bcs.u64(),
        /** Previous last update timestamp before this withdrawal */
        prev_last_update_timestamp: bcs.u64(),
        /** Amount of USDB withdrawn from the pool */
        withdrawal_usdb_amount: bcs.u64(),
        /** Set of witness types that have been validated */
        witnesses: vec_set.VecSet(type_name.TypeName)
    } });
export interface MsInYearOptions {
    package?: string;
    arguments?: [
    ];
}
export function msInYear(options: MsInYearOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'ms_in_year',
    });
}
export interface LpSupplyArguments {
    self: RawTransactionArgument<string>;
}
export interface LpSupplyOptions {
    package?: string;
    arguments: LpSupplyArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function lpSupply(options: LpSupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'lp_supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UsdbReserveArguments {
    self: RawTransactionArgument<string>;
}
export interface UsdbReserveOptions {
    package?: string;
    arguments: UsdbReserveArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the current USDB reserves held in the pool (excluding pending interest) */
export function usdbReserve(options: UsdbReserveOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'usdb_reserve',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositCapAmountArguments {
    self: RawTransactionArgument<string>;
}
export interface DepositCapAmountOptions {
    package?: string;
    arguments: DepositCapAmountArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the optional deposit cap limit for the pool */
export function depositCapAmount(options: DepositCapAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'deposit_cap_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LpBalanceOfArguments {
    self: RawTransactionArgument<string>;
    accountAddress: RawTransactionArgument<string>;
}
export interface LpBalanceOfOptions {
    package?: string;
    arguments: LpBalanceOfArguments | [
        self: RawTransactionArgument<string>,
        accountAddress: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the LP token balance for a specific account */
export function lpBalanceOf(options: LpBalanceOfOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["self", "accountAddress"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'lp_balance_of',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LastUpdateArguments {
    self: RawTransactionArgument<string>;
    accountAddress: RawTransactionArgument<string>;
}
export interface LastUpdateOptions {
    package?: string;
    arguments: LastUpdateArguments | [
        self: RawTransactionArgument<string>,
        accountAddress: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the last update timestamp for a specific account's position */
export function lastUpdate(options: LastUpdateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["self", "accountAddress"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'last_update',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SavingRateArguments {
    self: RawTransactionArgument<string>;
}
export interface SavingRateOptions {
    package?: string;
    arguments: SavingRateArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the current annual saving rate as a Double */
export function savingRate(options: SavingRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'saving_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LastEmittedArguments {
    self: RawTransactionArgument<string>;
}
export interface LastEmittedOptions {
    package?: string;
    arguments: LastEmittedArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the timestamp when interest was last distributed */
export function lastEmitted(options: LastEmittedOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'last_emitted',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositResponseChecklistArguments {
    self: RawTransactionArgument<string>;
}
export interface DepositResponseChecklistOptions {
    package?: string;
    arguments: DepositResponseChecklistArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the set of required witness types for deposit operations */
export function depositResponseChecklist(options: DepositResponseChecklistOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'deposit_response_checklist',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawResponseChecklistArguments {
    self: RawTransactionArgument<string>;
}
export interface WithdrawResponseChecklistOptions {
    package?: string;
    arguments: WithdrawResponseChecklistArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the set of required witness types for withdraw operations */
export function withdrawResponseChecklist(options: WithdrawResponseChecklistOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'withdraw_response_checklist',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PositionLockerArguments {
    self: RawTransactionArgument<string>;
}
export interface PositionLockerOptions {
    package?: string;
    arguments: PositionLockerArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the set of addresses with currently locked positions */
export function positionLocker(options: PositionLockerOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'position_locker',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositResponseAccountArguments {
    depositRes: RawTransactionArgument<string>;
}
export interface DepositResponseAccountOptions {
    package?: string;
    arguments: DepositResponseAccountArguments | [
        depositRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the account address from deposit response */
export function depositResponseAccount(options: DepositResponseAccountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::DepositResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["depositRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'deposit_response_account',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositResponseDepositedUsdbAmountArguments {
    depositRes: RawTransactionArgument<string>;
}
export interface DepositResponseDepositedUsdbAmountOptions {
    package?: string;
    arguments: DepositResponseDepositedUsdbAmountArguments | [
        depositRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the amount of USDB deposited */
export function depositResponseDepositedUsdbAmount(options: DepositResponseDepositedUsdbAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::DepositResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["depositRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'deposit_response_deposited_usdb_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositResponseMintedLpAmountArguments {
    depositRes: RawTransactionArgument<string>;
}
export interface DepositResponseMintedLpAmountOptions {
    package?: string;
    arguments: DepositResponseMintedLpAmountArguments | [
        depositRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the amount of LP tokens minted */
export function depositResponseMintedLpAmount(options: DepositResponseMintedLpAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::DepositResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["depositRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'deposit_response_minted_lp_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositResponsePrevLpBalanceArguments {
    depositRes: RawTransactionArgument<string>;
}
export interface DepositResponsePrevLpBalanceOptions {
    package?: string;
    arguments: DepositResponsePrevLpBalanceArguments | [
        depositRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the previous LP balance before deposit */
export function depositResponsePrevLpBalance(options: DepositResponsePrevLpBalanceOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::DepositResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["depositRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'deposit_response_prev_lp_balance',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositResponsePrevLastUpdateTimestampArguments {
    depositRes: RawTransactionArgument<string>;
}
export interface DepositResponsePrevLastUpdateTimestampOptions {
    package?: string;
    arguments: DepositResponsePrevLastUpdateTimestampArguments | [
        depositRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the previous last update timestamp before deposit */
export function depositResponsePrevLastUpdateTimestamp(options: DepositResponsePrevLastUpdateTimestampOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::DepositResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["depositRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'deposit_response_prev_last_update_timestamp',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawResponseAccountArguments {
    withdrawRes: RawTransactionArgument<string>;
}
export interface WithdrawResponseAccountOptions {
    package?: string;
    arguments: WithdrawResponseAccountArguments | [
        withdrawRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the account address from withdraw response */
export function withdrawResponseAccount(options: WithdrawResponseAccountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::WithdrawResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["withdrawRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'withdraw_response_account',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawResponseBurnedLpAmountArguments {
    withdrawRes: RawTransactionArgument<string>;
}
export interface WithdrawResponseBurnedLpAmountOptions {
    package?: string;
    arguments: WithdrawResponseBurnedLpAmountArguments | [
        withdrawRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the amount of LP tokens burned */
export function withdrawResponseBurnedLpAmount(options: WithdrawResponseBurnedLpAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::WithdrawResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["withdrawRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'withdraw_response_burned_lp_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawResponseWithdrawalUsdbAmountArguments {
    withdrawRes: RawTransactionArgument<string>;
}
export interface WithdrawResponseWithdrawalUsdbAmountOptions {
    package?: string;
    arguments: WithdrawResponseWithdrawalUsdbAmountArguments | [
        withdrawRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the amount of USDB withdrawn */
export function withdrawResponseWithdrawalUsdbAmount(options: WithdrawResponseWithdrawalUsdbAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::WithdrawResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["withdrawRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'withdraw_response_withdrawal_usdb_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawResponsePrevLpBalanceArguments {
    withdrawRes: RawTransactionArgument<string>;
}
export interface WithdrawResponsePrevLpBalanceOptions {
    package?: string;
    arguments: WithdrawResponsePrevLpBalanceArguments | [
        withdrawRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the previous LP balance before withdrawal */
export function withdrawResponsePrevLpBalance(options: WithdrawResponsePrevLpBalanceOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::WithdrawResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["withdrawRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'withdraw_response_prev_lp_balance',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawResponsePrevLastUpdateTimestampArguments {
    withdrawRes: RawTransactionArgument<string>;
}
export interface WithdrawResponsePrevLastUpdateTimestampOptions {
    package?: string;
    arguments: WithdrawResponsePrevLastUpdateTimestampArguments | [
        withdrawRes: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the previous last update timestamp before withdrawal */
export function withdrawResponsePrevLastUpdateTimestamp(options: WithdrawResponsePrevLastUpdateTimestampOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::WithdrawResponse<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["withdrawRes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'withdraw_response_prev_last_update_timestamp',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PendingInterestArguments {
    self: RawTransactionArgument<string>;
}
export interface PendingInterestOptions {
    package?: string;
    arguments: PendingInterestArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Returns the amount of interest that has accumulated since last distribution but
 * has not yet been distributed to the pool reserves
 */
export function pendingInterest(options: PendingInterestOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'pending_interest',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface TotalReserveArguments {
    self: RawTransactionArgument<string>;
}
export interface TotalReserveOptions {
    package?: string;
    arguments: TotalReserveArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Returns the total reserve amount including current reserves plus accumulated
 * interest
 */
export function totalReserve(options: TotalReserveOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'total_reserve',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LpTokenRatioArguments {
    self: RawTransactionArgument<string>;
}
export interface LpTokenRatioOptions {
    package?: string;
    arguments: LpTokenRatioArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Returns the current ratio of LP token value to total reserve Used to calculate
 * how much each LP token is worth in USDB terms
 */
export function lpTokenRatio(options: LpTokenRatioOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'lp_token_ratio',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LpTokenValueArguments {
    self: RawTransactionArgument<string>;
    shares: RawTransactionArgument<number | bigint>;
}
export interface LpTokenValueOptions {
    package?: string;
    arguments: LpTokenValueArguments | [
        self: RawTransactionArgument<string>,
        shares: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the USDB value for a given amount of LP token shares */
export function lpTokenValue(options: LpTokenValueOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "shares", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'lp_token_value',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LpTokenValueOfArguments {
    self: RawTransactionArgument<string>;
    accountAddress: RawTransactionArgument<string>;
}
export interface LpTokenValueOfOptions {
    package?: string;
    arguments: LpTokenValueOfArguments | [
        self: RawTransactionArgument<string>,
        accountAddress: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Returns the total USDB value of LP tokens held by a specific account */
export function lpTokenValueOf(options: LpTokenValueOfOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        'address',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "accountAddress", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'lp_token_value_of',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CalculateLpMintAmountArguments {
    self: RawTransactionArgument<string>;
    value: RawTransactionArgument<number | bigint>;
}
export interface CalculateLpMintAmountOptions {
    package?: string;
    arguments: CalculateLpMintAmountArguments | [
        self: RawTransactionArgument<string>,
        value: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
/** Calculates how many LP tokens would be minted for a given USDB deposit amount */
export function calculateLpMintAmount(options: CalculateLpMintAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "value", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'calculate_lp_mint_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PositionExistsArguments {
    self: RawTransactionArgument<string>;
    accountAddress: RawTransactionArgument<string>;
}
export interface PositionExistsOptions {
    package?: string;
    arguments: PositionExistsArguments | [
        self: RawTransactionArgument<string>,
        accountAddress: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Checks if a position exists for the given account address */
export function positionExists(options: PositionExistsOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["self", "accountAddress"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'position_exists',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface NewArguments {
    Cap: RawTransactionArgument<string>;
    treasuryCap: RawTransactionArgument<string>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        Cap: RawTransactionArgument<string>,
        treasuryCap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Creates a new saving pool with the given treasury capability Only callable by
 * admin with AdminCap
 */
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::admin::AdminCap`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::TreasuryCap<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["Cap", "treasuryCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DefaultArguments {
    cap: RawTransactionArgument<string>;
    treasuryCap: RawTransactionArgument<string>;
}
export interface DefaultOptions {
    package?: string;
    arguments: DefaultArguments | [
        cap: RawTransactionArgument<string>,
        treasuryCap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function _default(options: DefaultOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::admin::AdminCap`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::TreasuryCap<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["cap", "treasuryCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'default',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateSavingRateArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    savingRateBps: RawTransactionArgument<number | bigint>;
}
export interface UpdateSavingRateOptions {
    package?: string;
    arguments: UpdateSavingRateArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        savingRateBps: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Updates the annual saving interest rate for the pool Collects any accumulated
 * rewards before applying the new rate
 */
export function updateSavingRate(options: UpdateSavingRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`,
        `${packageAddress}::usdb::Treasury`,
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "treasury", "savingRateBps", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'update_saving_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateDepositCapArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    depositCapAmount: RawTransactionArgument<number | bigint | null>;
}
export interface UpdateDepositCapOptions {
    package?: string;
    arguments: UpdateDepositCapArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        depositCapAmount: RawTransactionArgument<number | bigint | null>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Updates the maximum deposit cap limit for the pool Set to None to remove deposit
 * limits
 */
export function updateDepositCap(options: UpdateDepositCapOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<u64>'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "depositCapAmount"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'update_deposit_cap',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddDepositResponseCheckArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface AddDepositResponseCheckOptions {
    package?: string;
    arguments: AddDepositResponseCheckArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/**
 * Adds a required witness type check for deposit operations The witness must be
 * provided during deposit response validation
 */
export function addDepositResponseCheck(options: AddDepositResponseCheckOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'add_deposit_response_check',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveDepositResponseCheckArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface RemoveDepositResponseCheckOptions {
    package?: string;
    arguments: RemoveDepositResponseCheckArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Removes a witness type check requirement for deposit operations */
export function removeDepositResponseCheck(options: RemoveDepositResponseCheckOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'remove_deposit_response_check',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddWithdrawResponseCheckArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface AddWithdrawResponseCheckOptions {
    package?: string;
    arguments: AddWithdrawResponseCheckArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/**
 * Adds a required witness type check for withdraw operations The witness must be
 * provided during withdraw response validation
 */
export function addWithdrawResponseCheck(options: AddWithdrawResponseCheckOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'add_withdraw_response_check',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveWithdrawResponseCheckArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface RemoveWithdrawResponseCheckOptions {
    package?: string;
    arguments: RemoveWithdrawResponseCheckArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Removes a witness type check requirement for withdraw operations */
export function removeWithdrawResponseCheck(options: RemoveWithdrawResponseCheckOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'remove_withdraw_response_check',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CheckDepositResponseArguments {
    res: RawTransactionArgument<string>;
    self: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
}
export interface CheckDepositResponseOptions {
    package?: string;
    arguments: CheckDepositResponseArguments | [
        res: RawTransactionArgument<string>,
        self: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Validates and consumes a deposit response hot potato Ensures all required
 * witness checks have been satisfied before unlocking the position
 */
export function checkDepositResponse(options: CheckDepositResponseOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::DepositResponse<${options.typeArguments[0]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::usdb::Treasury`
    ] satisfies string[];
    const parameterNames = ["res", "self", "treasury"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'check_deposit_response',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CheckWithdrawResponseArguments {
    res: RawTransactionArgument<string>;
    self: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
}
export interface CheckWithdrawResponseOptions {
    package?: string;
    arguments: CheckWithdrawResponseArguments | [
        res: RawTransactionArgument<string>,
        self: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Validates and consumes a withdraw response hot potato Ensures all required
 * witness checks have been satisfied before unlocking the position
 */
export function checkWithdrawResponse(options: CheckWithdrawResponseOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::WithdrawResponse<${options.typeArguments[0]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::usdb::Treasury`
    ] satisfies string[];
    const parameterNames = ["res", "self", "treasury"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'check_withdraw_response',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddDepositWitnessArguments<W extends BcsType<any>> {
    response: RawTransactionArgument<string>;
    Witness: RawTransactionArgument<W>;
}
export interface AddDepositWitnessOptions<W extends BcsType<any>> {
    package?: string;
    arguments: AddDepositWitnessArguments<W> | [
        response: RawTransactionArgument<string>,
        Witness: RawTransactionArgument<W>
    ];
    typeArguments: [
        string,
        string
    ];
}
/**
 * Adds a witness proof to the deposit response for validation Each witness type
 * can only be added once per response
 */
export function addDepositWitness<W extends BcsType<any>>(options: AddDepositWitnessOptions<W>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::DepositResponse<${options.typeArguments[0]}>`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["response", "Witness"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'add_deposit_witness',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddWithdrawWitnessArguments<W extends BcsType<any>> {
    response: RawTransactionArgument<string>;
    Witness: RawTransactionArgument<W>;
}
export interface AddWithdrawWitnessOptions<W extends BcsType<any>> {
    package?: string;
    arguments: AddWithdrawWitnessArguments<W> | [
        response: RawTransactionArgument<string>,
        Witness: RawTransactionArgument<W>
    ];
    typeArguments: [
        string,
        string
    ];
}
/**
 * Adds a witness proof to the withdraw response for validation Each witness type
 * can only be added once per response
 */
export function addWithdrawWitness<W extends BcsType<any>>(options: AddWithdrawWitnessOptions<W>) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::WithdrawResponse<${options.typeArguments[0]}>`,
        `${options.typeArguments[1]}`
    ] satisfies string[];
    const parameterNames = ["response", "Witness"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'add_withdraw_witness',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DepositArguments {
    self: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
    usdb: RawTransactionArgument<string>;
}
export interface DepositOptions {
    package?: string;
    arguments: DepositArguments | [
        self: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>,
        usdb: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Deposits USDB into the saving pool and mints LP tokens Collects accumulated
 * interest before processing the deposit Returns a DepositResponse hot potato that
 * must be validated
 */
export function deposit(options: DepositOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::usdb::Treasury`,
        'address',
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${packageAddress}::usdb::USDB>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "treasury", "account", "usdb", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'deposit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface WithdrawArguments {
    self: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    accountReq: RawTransactionArgument<string>;
    burnedLp: RawTransactionArgument<number | bigint>;
}
export interface WithdrawOptions {
    package?: string;
    arguments: WithdrawArguments | [
        self: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        accountReq: RawTransactionArgument<string>,
        burnedLp: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Withdraws USDB from the saving pool by burning LP tokens Collects accumulated
 * interest before processing the withdrawal Returns USDB coin and WithdrawResponse
 * hot potato that must be validated
 */
export function withdraw(options: WithdrawOptions) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_saving';
    const argumentsTypes = [
        `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
        `${packageAddress}::usdb::Treasury`,
        `${packageAddress}::account::AccountRequest`,
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "treasury", "accountReq", "burnedLp", "clock"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'saving',
        function: 'withdraw',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}