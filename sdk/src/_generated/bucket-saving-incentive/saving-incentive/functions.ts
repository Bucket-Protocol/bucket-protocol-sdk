import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function errInvalidReward( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::err_invalid_reward`, arguments: [ ], }) }

export function errMissingRewarderCheck( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::err_missing_rewarder_check`, arguments: [ ], }) }

export function errInvalidTimestamp( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::err_invalid_timestamp`, arguments: [ ], }) }

export function errOngoingAction( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::err_ongoing_action`, arguments: [ ], }) }

export function errIncentiveAlreadyStart( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::err_incentive_already_start`, arguments: [ ], }) }

export function rewardManagerIds( tx: Transaction, reg: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::reward_manager_ids`, arguments: [ obj(tx, reg) ], }) }

export function getRewarder( tx: Transaction, typeArgs: [string, string], rewardManager: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::get_rewarder`, typeArguments: typeArgs, arguments: [ obj(tx, rewardManager) ], }) }

export function getRewarderMut( tx: Transaction, typeArgs: [string, string], rewardManager: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::get_rewarder_mut`, typeArguments: typeArgs, arguments: [ obj(tx, rewardManager) ], }) }

export function rewarderIds( tx: Transaction, typeArg: string, rewardManager: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::rewarder_ids`, typeArguments: [typeArg], arguments: [ obj(tx, rewardManager) ], }) }

export function rewarderSource( tx: Transaction, typeArgs: [string, string], rewarder: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::rewarder_source`, typeArguments: typeArgs, arguments: [ obj(tx, rewarder) ], }) }

export function rewarderPool( tx: Transaction, typeArgs: [string, string], rewarder: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::rewarder_pool`, typeArguments: typeArgs, arguments: [ obj(tx, rewarder) ], }) }

export function rewarderFlowRate( tx: Transaction, typeArgs: [string, string], rewarder: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::rewarder_flow_rate`, typeArguments: typeArgs, arguments: [ obj(tx, rewarder) ], }) }

export function rewarderTotalStake( tx: Transaction, typeArgs: [string, string], rewarder: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::rewarder_total_stake`, typeArguments: typeArgs, arguments: [ obj(tx, rewarder) ], }) }

export function rewarderStakeTable( tx: Transaction, typeArgs: [string, string], rewarder: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::rewarder_stake_table`, typeArguments: typeArgs, arguments: [ obj(tx, rewarder) ], }) }

export function rewarderUnit( tx: Transaction, typeArgs: [string, string], rewarder: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::rewarder_unit`, typeArguments: typeArgs, arguments: [ obj(tx, rewarder) ], }) }

export function rewarderLastUpdateTimestamp( tx: Transaction, typeArgs: [string, string], rewarder: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::rewarder_last_update_timestamp`, typeArguments: typeArgs, arguments: [ obj(tx, rewarder) ], }) }

export interface UnitOfArgs { rewarder: TransactionObjectInput; account: string | TransactionArgument }

export function unitOf( tx: Transaction, typeArgs: [string, string], args: UnitOfArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::unit_of`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewarder), pure(tx, args.account, `address`) ], }) }

export interface RewardOfArgs { rewarder: TransactionObjectInput; account: string | TransactionArgument }

export function rewardOf( tx: Transaction, typeArgs: [string, string], args: RewardOfArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::reward_of`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewarder), pure(tx, args.account, `address`) ], }) }

export interface AccountExistsArgs { rewarder: TransactionObjectInput; accountAddress: string | TransactionArgument }

export function accountExists( tx: Transaction, typeArgs: [string, string], args: AccountExistsArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::account_exists`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewarder), pure(tx, args.accountAddress, `address`) ], }) }

export interface RealtimeRewardAmountArgs { rewarder: TransactionObjectInput; savingPool: TransactionObjectInput; account: string | TransactionArgument; clock: TransactionObjectInput }

export function realtimeRewardAmount( tx: Transaction, typeArgs: [string, string], args: RealtimeRewardAmountArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::realtime_reward_amount`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewarder), obj(tx, args.savingPool), pure(tx, args.account, `address`), obj(tx, args.clock) ], }) }

export function init( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::init`, arguments: [ ], }) }

export interface NewRewardManagerArgs { registry: TransactionObjectInput; config: TransactionObjectInput; cap: TransactionObjectInput; savingPool: TransactionObjectInput }

export function newRewardManager( tx: Transaction, typeArg: string, args: NewRewardManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::new_reward_manager`, typeArguments: [typeArg], arguments: [ obj(tx, args.registry), obj(tx, args.config), obj(tx, args.cap), obj(tx, args.savingPool) ], }) }

export interface AddRewardArgs { rewardManager: TransactionObjectInput; cap: TransactionObjectInput; config: TransactionObjectInput; savingPool: TransactionObjectInput; flowAmount: bigint | TransactionArgument; flowInterval: bigint | TransactionArgument; startTime: bigint | TransactionArgument }

export function addReward( tx: Transaction, typeArgs: [string, string], args: AddRewardArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::add_reward`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewardManager), obj(tx, args.cap), obj(tx, args.config), obj(tx, args.savingPool), pure(tx, args.flowAmount, `u64`), pure(tx, args.flowInterval, `u64`), pure(tx, args.startTime, `u64`) ], }) }

export interface WithdrawFromSourceArgs { rewardManager: TransactionObjectInput; config: TransactionObjectInput; cap: TransactionObjectInput; clock: TransactionObjectInput; amount: bigint | TransactionArgument }

export function withdrawFromSource( tx: Transaction, typeArgs: [string, string], args: WithdrawFromSourceArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::withdraw_from_source`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewardManager), obj(tx, args.config), obj(tx, args.cap), obj(tx, args.clock), pure(tx, args.amount, `u64`) ], }) }

export interface UpdateFlowRateArgs { rewardManager: TransactionObjectInput; config: TransactionObjectInput; clock: TransactionObjectInput; flowAmount: bigint | TransactionArgument; flowInterval: bigint | TransactionArgument; request: TransactionObjectInput }

export function updateFlowRate( tx: Transaction, typeArgs: [string, string], args: UpdateFlowRateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::update_flow_rate`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewardManager), obj(tx, args.config), obj(tx, args.clock), pure(tx, args.flowAmount, `u64`), pure(tx, args.flowInterval, `u64`), obj(tx, args.request) ], }) }

export interface UpdateRewardTimestampArgs { rewardManager: TransactionObjectInput; config: TransactionObjectInput; clock: TransactionObjectInput; timestamp: bigint | TransactionArgument; request: TransactionObjectInput }

export function updateRewardTimestamp( tx: Transaction, typeArgs: [string, string], args: UpdateRewardTimestampArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::update_reward_timestamp`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewardManager), obj(tx, args.config), obj(tx, args.clock), pure(tx, args.timestamp, `u64`), obj(tx, args.request) ], }) }

export interface SupplyArgs { rewardManager: TransactionObjectInput; coin: TransactionObjectInput }

export function supply( tx: Transaction, typeArgs: [string, string], args: SupplyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::supply`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewardManager), obj(tx, args.coin) ], }) }

export interface NewCheckerForDepositActionArgs { rewardManager: TransactionObjectInput; config: TransactionObjectInput; depositResponse: TransactionObjectInput }

export function newCheckerForDepositAction( tx: Transaction, typeArg: string, args: NewCheckerForDepositActionArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::new_checker_for_deposit_action`, typeArguments: [typeArg], arguments: [ obj(tx, args.rewardManager), obj(tx, args.config), obj(tx, args.depositResponse) ], }) }

export interface UpdateDepositActionArgs { depositChecker: TransactionObjectInput; config: TransactionObjectInput; rewardManager: TransactionObjectInput; savingPool: TransactionObjectInput; clock: TransactionObjectInput }

export function updateDepositAction( tx: Transaction, typeArgs: [string, string], args: UpdateDepositActionArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::update_deposit_action`, typeArguments: typeArgs, arguments: [ obj(tx, args.depositChecker), obj(tx, args.config), obj(tx, args.rewardManager), obj(tx, args.savingPool), obj(tx, args.clock) ], }) }

export interface DestroyDepositCheckerArgs { depositChecker: TransactionObjectInput; config: TransactionObjectInput }

export function destroyDepositChecker( tx: Transaction, typeArg: string, args: DestroyDepositCheckerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::destroy_deposit_checker`, typeArguments: [typeArg], arguments: [ obj(tx, args.depositChecker), obj(tx, args.config) ], }) }

export interface ClaimArgs { rewardManager: TransactionObjectInput; config: TransactionObjectInput; savingPool: TransactionObjectInput; request: TransactionObjectInput; clock: TransactionObjectInput }

export function claim( tx: Transaction, typeArgs: [string, string], args: ClaimArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::claim`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewardManager), obj(tx, args.config), obj(tx, args.savingPool), obj(tx, args.request), obj(tx, args.clock) ], }) }

export interface NewCheckerForWithdrawActionArgs { rewardManager: TransactionObjectInput; config: TransactionObjectInput; withdrawResponse: TransactionObjectInput }

export function newCheckerForWithdrawAction( tx: Transaction, typeArg: string, args: NewCheckerForWithdrawActionArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::new_checker_for_withdraw_action`, typeArguments: [typeArg], arguments: [ obj(tx, args.rewardManager), obj(tx, args.config), obj(tx, args.withdrawResponse) ], }) }

export interface UpdateWithdrawActionArgs { withdrawChecker: TransactionObjectInput; config: TransactionObjectInput; rewardManager: TransactionObjectInput; savingPool: TransactionObjectInput; clock: TransactionObjectInput }

export function updateWithdrawAction( tx: Transaction, typeArgs: [string, string], args: UpdateWithdrawActionArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::update_withdraw_action`, typeArguments: typeArgs, arguments: [ obj(tx, args.withdrawChecker), obj(tx, args.config), obj(tx, args.rewardManager), obj(tx, args.savingPool), obj(tx, args.clock) ], }) }

export interface DestroyWithdrawCheckerArgs { withdrawChecker: TransactionObjectInput; config: TransactionObjectInput }

export function destroyWithdrawChecker( tx: Transaction, typeArg: string, args: DestroyWithdrawCheckerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::destroy_withdraw_checker`, typeArguments: [typeArg], arguments: [ obj(tx, args.withdrawChecker), obj(tx, args.config) ], }) }

export interface SettlePoolRewardArgs { rewarder: TransactionObjectInput; clock: TransactionObjectInput }

export function settlePoolReward( tx: Transaction, typeArgs: [string, string], args: SettlePoolRewardArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::settle_pool_reward`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewarder), obj(tx, args.clock) ], }) }

export interface RealtimeRewardReleaseAndUnitArgs { rewarder: TransactionObjectInput; clock: TransactionObjectInput }

export function realtimeRewardReleaseAndUnit( tx: Transaction, typeArgs: [string, string], args: RealtimeRewardReleaseAndUnitArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::realtime_reward_release_and_unit`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewarder), obj(tx, args.clock) ], }) }

export interface UnsettledRewardAmountArgs { rewarder: TransactionObjectInput; account: string | TransactionArgument; prevLpBalance: bigint | TransactionArgument; clock: TransactionObjectInput }

export function unsettledRewardAmount( tx: Transaction, typeArgs: [string, string], args: UnsettledRewardAmountArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::unsettled_reward_amount`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewarder), pure(tx, args.account, `address`), pure(tx, args.prevLpBalance, `u64`), obj(tx, args.clock) ], }) }

export interface SettleAccountRewardArgs { rewarder: TransactionObjectInput; account: string | TransactionArgument; prevLpBalance: bigint | TransactionArgument; clock: TransactionObjectInput }

export function settleAccountReward( tx: Transaction, typeArgs: [string, string], args: SettleAccountRewardArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive::settle_account_reward`, typeArguments: typeArgs, arguments: [ obj(tx, args.rewarder), pure(tx, args.account, `address`), pure(tx, args.prevLpBalance, `u64`), obj(tx, args.clock) ], }) }
