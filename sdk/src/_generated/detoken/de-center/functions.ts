import {PUBLISHED_AT} from "..";
import {GenericArg, generic, obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export interface DefaultArgs { cap: TransactionObjectInput; maxTime: bigint | TransactionArgument; offset: bigint | TransactionArgument; clock: TransactionObjectInput }

export function default_( tx: Transaction, typeArgs: [string, string], args: DefaultArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::default`, typeArguments: typeArgs, arguments: [ obj(tx, args.cap), pure(tx, args.maxTime, `u64`), pure(tx, args.offset, `u64`), obj(tx, args.clock) ], }) }

export interface NewArgs { cap: TransactionObjectInput; maxTime: bigint | TransactionArgument; offset: bigint | TransactionArgument; clock: TransactionObjectInput }

export function new_( tx: Transaction, typeArgs: [string, string], args: NewArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::new`, typeArguments: typeArgs, arguments: [ obj(tx, args.cap), pure(tx, args.maxTime, `u64`), pure(tx, args.offset, `u64`), obj(tx, args.clock) ], }) }

export interface LockArgs { self: TransactionObjectInput; coin: TransactionObjectInput; duration: bigint | TransactionArgument; earlyUnlock: boolean | TransactionArgument; clock: TransactionObjectInput }

export function lock( tx: Transaction, typeArgs: [string, string], args: LockArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::lock`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.coin), pure(tx, args.duration, `u64`), pure(tx, args.earlyUnlock, `bool`), obj(tx, args.clock) ], }) }

export function point( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::point`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function maxTime( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::max_time`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function init( tx: Transaction, otw: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::init`, arguments: [ obj(tx, otw) ], }) }

export interface AddPenaltyArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput; elapsedPercentage: number | TransactionArgument; penaltyPercentage: number | TransactionArgument }

export function addPenalty( tx: Transaction, typeArgs: [string, string], args: AddPenaltyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::add_penalty`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap), pure(tx, args.elapsedPercentage, `u32`), pure(tx, args.penaltyPercentage, `u32`) ], }) }

export interface AddPenaltyFeeAdminArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput }

export function addPenaltyFeeAdmin( tx: Transaction, typeArgs: [string, string, string], args: AddPenaltyFeeAdminArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::add_penalty_fee_admin`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap) ], }) }

export interface AddPenaltyFeeBalanceArgs { self: TransactionObjectInput; bal: TransactionObjectInput }

export function addPenaltyFeeBalance( tx: Transaction, typeArgs: [string, string], args: AddPenaltyFeeBalanceArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::add_penalty_fee_balance`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.bal) ], }) }

export interface AddPenaltyReserveArgs { self: TransactionObjectInput; bal: TransactionObjectInput }

export function addPenaltyReserve( tx: Transaction, typeArgs: [string, string], args: AddPenaltyReserveArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::add_penalty_reserve`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.bal) ], }) }

export interface AddResponseChecklistsArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput }

export function addResponseChecklists( tx: Transaction, typeArgs: [string, string, string], args: AddResponseChecklistsArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::add_response_checklists`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap) ], }) }

export interface AddVersionArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput; version: bigint | TransactionArgument }

export function addVersion( tx: Transaction, typeArgs: [string, string], args: AddVersionArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::add_version`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap), pure(tx, args.version, `u64`) ], }) }

export interface AddWhitelistArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput }

export function addWhitelist( tx: Transaction, typeArgs: [string, string, string], args: AddWhitelistArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::add_whitelist`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap) ], }) }

export interface AssertMatchedEscrowArgs { self: TransactionObjectInput; escrow: TransactionObjectInput }

export function assertMatchedEscrow( tx: Transaction, typeArgs: [string, string], args: AssertMatchedEscrowArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::assert_matched_escrow`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow) ], }) }

export function assertVersion( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::assert_version`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface CheckpointArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function checkpoint( tx: Transaction, typeArgs: [string, string], args: CheckpointArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::checkpoint`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export interface Checkpoint_Args { self: TransactionObjectInput; escrowCheckpoint: boolean | TransactionArgument; oldLockedAmount: bigint | TransactionArgument; oldLockedEnd: bigint | TransactionArgument; newLockedAmount: bigint | TransactionArgument; newLockedEnd: bigint | TransactionArgument; clock: TransactionObjectInput }

export function checkpoint_( tx: Transaction, typeArgs: [string, string], args: Checkpoint_Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::checkpoint_`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), pure(tx, args.escrowCheckpoint, `bool`), pure(tx, args.oldLockedAmount, `u64`), pure(tx, args.oldLockedEnd, `u64`), pure(tx, args.newLockedAmount, `u64`), pure(tx, args.newLockedEnd, `u64`), obj(tx, args.clock) ], }) }

export interface CurrentPenaltyArgs { self: TransactionObjectInput; elapsedTime: bigint | TransactionArgument }

export function currentPenalty( tx: Transaction, typeArgs: [string, string], args: CurrentPenaltyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::current_penalty`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), pure(tx, args.elapsedTime, `u64`) ], }) }

export function offset( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::offset`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface EscrowPenaltyArgs { escrow: TransactionObjectInput; self: TransactionObjectInput; withdrawal: bigint | TransactionArgument; clock: TransactionObjectInput }

export function escrowPenalty( tx: Transaction, typeArgs: [string, string], args: EscrowPenaltyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::escrow_penalty`, typeArguments: typeArgs, arguments: [ obj(tx, args.escrow), obj(tx, args.self), pure(tx, args.withdrawal, `u64`), obj(tx, args.clock) ], }) }

export interface ForceUnlockWithPenaltyArgs { self: TransactionObjectInput; escrow: TransactionObjectInput; clock: TransactionObjectInput }

export function forceUnlockWithPenalty( tx: Transaction, typeArgs: [string, string], args: ForceUnlockWithPenaltyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::force_unlock_with_penalty`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow), obj(tx, args.clock) ], }) }

export interface ForceUnlockWithWhitelistArgs { self: TransactionObjectInput; escrow: TransactionObjectInput; witness: GenericArg; clock: TransactionObjectInput }

export function forceUnlockWithWhitelist( tx: Transaction, typeArgs: [string, string, string], args: ForceUnlockWithWhitelistArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::force_unlock_with_whitelist`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow), generic(tx, `${typeArgs[2]}`, args.witness), obj(tx, args.clock) ], }) }

export interface ForceWithdrawWithPenaltyArgs { self: TransactionObjectInput; escrow: TransactionObjectInput; value: bigint | TransactionArgument; clock: TransactionObjectInput }

export function forceWithdrawWithPenalty( tx: Transaction, typeArgs: [string, string], args: ForceWithdrawWithPenaltyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::force_withdraw_with_penalty`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow), pure(tx, args.value, `u64`), obj(tx, args.clock) ], }) }

export interface ForceWithdrawWithWhitelistArgs { self: TransactionObjectInput; escrow: TransactionObjectInput; witness: GenericArg; value: bigint | TransactionArgument; clock: TransactionObjectInput }

export function forceWithdrawWithWhitelist( tx: Transaction, typeArgs: [string, string, string], args: ForceWithdrawWithWhitelistArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::force_withdraw_with_whitelist`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow), generic(tx, `${typeArgs[2]}`, args.witness), pure(tx, args.value, `u64`), obj(tx, args.clock) ], }) }

export interface FulfillResponseArgs { res: TransactionObjectInput; self: TransactionObjectInput }

export function fulfillResponse( tx: Transaction, typeArgs: [string, string], args: FulfillResponseArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::fulfill_response`, typeArguments: typeArgs, arguments: [ obj(tx, args.res), obj(tx, args.self) ], }) }

export interface GetLockedEndArgs { self: TransactionObjectInput; duration: bigint | TransactionArgument; clock: TransactionObjectInput }

export function getLockedEnd( tx: Transaction, typeArgs: [string, string], args: GetLockedEndArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::get_locked_end`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), pure(tx, args.duration, `u64`), obj(tx, args.clock) ], }) }

export interface IncreaseUnlockAmountArgs { self: TransactionObjectInput; escrow: TransactionObjectInput; coin: TransactionObjectInput; clock: TransactionObjectInput }

export function increaseUnlockAmount( tx: Transaction, typeArgs: [string, string], args: IncreaseUnlockAmountArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::increase_unlock_amount`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow), obj(tx, args.coin), obj(tx, args.clock) ], }) }

export interface IncreaseUnlockTimeArgs { self: TransactionObjectInput; escrow: TransactionObjectInput; extendedDuration: bigint | TransactionArgument; clock: TransactionObjectInput }

export function increaseUnlockTime( tx: Transaction, typeArgs: [string, string], args: IncreaseUnlockTimeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::increase_unlock_time`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow), pure(tx, args.extendedDuration, `u64`), obj(tx, args.clock) ], }) }

export function lockedTotal( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::locked_total`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface MaxLockedEndArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function maxLockedEnd( tx: Transaction, typeArgs: [string, string], args: MaxLockedEndArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::max_locked_end`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export interface MergeArgs { self: TransactionObjectInput; escrow: TransactionObjectInput; burnedEscrow: TransactionObjectInput; clock: TransactionObjectInput }

export function merge( tx: Transaction, typeArgs: [string, string], args: MergeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::merge`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow), obj(tx, args.burnedEscrow), obj(tx, args.clock) ], }) }

export function mintedEscrow( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::minted_escrow`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function newAdmin( tx: Transaction, typeArg: string, witness: GenericArg ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::new_admin`, typeArguments: [typeArg], arguments: [ generic(tx, `${typeArg}`, witness) ], }) }

export function packageVersion( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::package_version`, arguments: [ ], }) }

export function penaltyFeeAdmin( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::penalty_fee_admin`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function penaltyFeeBalance( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::penalty_fee_balance`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function penaltyFeeBps( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::penalty_fee_bps`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function penaltyInfo( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::penalty_info`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function penaltyInfoElapsedPercentage( tx: Transaction, info: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::penalty_info_elapsed_percentage`, arguments: [ obj(tx, info) ], }) }

export function penaltyInfoPenaltyPercentage( tx: Transaction, info: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::penalty_info_penalty_percentage`, arguments: [ obj(tx, info) ], }) }

export function penaltyReserve( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::penalty_reserve`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface RemovePenaltyArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput; elapsedPercentage: number | TransactionArgument }

export function removePenalty( tx: Transaction, typeArgs: [string, string], args: RemovePenaltyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::remove_penalty`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap), pure(tx, args.elapsedPercentage, `u32`) ], }) }

export interface RemovePenaltyFeeAdminArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput }

export function removePenaltyFeeAdmin( tx: Transaction, typeArgs: [string, string], args: RemovePenaltyFeeAdminArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::remove_penalty_fee_admin`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap) ], }) }

export interface RemoveResponseChecklistsArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput }

export function removeResponseChecklists( tx: Transaction, typeArgs: [string, string, string], args: RemoveResponseChecklistsArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::remove_response_checklists`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap) ], }) }

export interface RemoveVersionArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput; version: bigint | TransactionArgument }

export function removeVersion( tx: Transaction, typeArgs: [string, string], args: RemoveVersionArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::remove_version`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap), pure(tx, args.version, `u64`) ], }) }

export interface RemoveWhitelistArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput }

export function removeWhitelist( tx: Transaction, typeArgs: [string, string, string], args: RemoveWhitelistArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::remove_whitelist`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap) ], }) }

export interface ResponseCheckRuleArgs { res: TransactionObjectInput; r: GenericArg }

export function responseCheckRule( tx: Transaction, typeArgs: [string, string, string], args: ResponseCheckRuleArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::response_check_rule`, typeArguments: typeArgs, arguments: [ obj(tx, args.res), generic(tx, `${typeArgs[2]}`, args.r) ], }) }

export function responseChecklists( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::response_checklists`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function roundDownWeek( tx: Transaction, t: bigint | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::round_down_week`, arguments: [ pure(tx, t, `u64`) ], }) }

export function scaling( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::scaling`, arguments: [ ], }) }

export interface ToVestingTokenUpdateResponseArgs { escrow: TransactionObjectInput; clock: TransactionObjectInput }

export function toVestingTokenUpdateResponse( tx: Transaction, typeArgs: [string, string], args: ToVestingTokenUpdateResponseArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::to_vesting_token_update_response`, typeArguments: typeArgs, arguments: [ obj(tx, args.escrow), obj(tx, args.clock) ], }) }

export interface TotalVotingWeightArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function totalVotingWeight( tx: Transaction, typeArgs: [string, string], args: TotalVotingWeightArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::total_voting_weight`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export interface TotalVotingWeightAtArgs { self: TransactionObjectInput; timestamp: bigint | TransactionArgument }

export function totalVotingWeightAt( tx: Transaction, typeArgs: [string, string], args: TotalVotingWeightAtArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::total_voting_weight_at`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), pure(tx, args.timestamp, `u64`) ], }) }

export interface UnlockArgs { self: TransactionObjectInput; escrow: TransactionObjectInput; clock: TransactionObjectInput }

export function unlock( tx: Transaction, typeArgs: [string, string], args: UnlockArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::unlock`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow), obj(tx, args.clock) ], }) }

export interface Unlock_Args { self: TransactionObjectInput; escrow: TransactionObjectInput; clock: TransactionObjectInput }

export function unlock_( tx: Transaction, typeArgs: [string, string], args: Unlock_Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::unlock_`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.escrow), obj(tx, args.clock) ], }) }

export function vestingTokenUpdateResponseBalance( tx: Transaction, typeArgs: [string, string], response: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_token_update_response_balance`, typeArguments: typeArgs, arguments: [ obj(tx, response) ], }) }

export function vestingTokenUpdateResponseChecklists( tx: Transaction, typeArgs: [string, string], response: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_token_update_response_checklists`, typeArguments: typeArgs, arguments: [ obj(tx, response) ], }) }

export function vestingTokenUpdateResponseEarlyUnlock( tx: Transaction, typeArgs: [string, string], response: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_token_update_response_early_unlock`, typeArguments: typeArgs, arguments: [ obj(tx, response) ], }) }

export function vestingTokenUpdateResponseEnd( tx: Transaction, typeArgs: [string, string], response: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_token_update_response_end`, typeArguments: typeArgs, arguments: [ obj(tx, response) ], }) }

export function vestingTokenUpdateResponseId( tx: Transaction, typeArgs: [string, string], response: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_token_update_response_id`, typeArguments: typeArgs, arguments: [ obj(tx, response) ], }) }

export function vestingTokenUpdateResponseMaxTime( tx: Transaction, typeArgs: [string, string], response: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_token_update_response_max_time`, typeArguments: typeArgs, arguments: [ obj(tx, response) ], }) }

export function vestingTokenUpdateResponsePoolId( tx: Transaction, typeArgs: [string, string], response: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_token_update_response_pool_id`, typeArguments: typeArgs, arguments: [ obj(tx, response) ], }) }

export function vestingTokenUpdateResponseRawVotingWeight( tx: Transaction, typeArgs: [string, string], response: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_token_update_response_raw_voting_weight`, typeArguments: typeArgs, arguments: [ obj(tx, response) ], }) }

export function vestingTokenUpdateResponseVotingWeight( tx: Transaction, typeArgs: [string, string], response: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_token_update_response_voting_weight`, typeArguments: typeArgs, arguments: [ obj(tx, response) ], }) }

export function vestingTokenupdateResponseBalance( tx: Transaction, typeArgs: [string, string], res: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_tokenupdate_response_balance`, typeArguments: typeArgs, arguments: [ obj(tx, res) ], }) }

export function vestingTokenupdateResponseChecklists( tx: Transaction, typeArgs: [string, string], res: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_tokenupdate_response_checklists`, typeArguments: typeArgs, arguments: [ obj(tx, res) ], }) }

export function vestingTokenupdateResponseEarlyUnlock( tx: Transaction, typeArgs: [string, string], res: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_tokenupdate_response_early_unlock`, typeArguments: typeArgs, arguments: [ obj(tx, res) ], }) }

export function vestingTokenupdateResponseEnd( tx: Transaction, typeArgs: [string, string], res: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_tokenupdate_response_end`, typeArguments: typeArgs, arguments: [ obj(tx, res) ], }) }

export function vestingTokenupdateResponseId( tx: Transaction, typeArgs: [string, string], res: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_tokenupdate_response_id`, typeArguments: typeArgs, arguments: [ obj(tx, res) ], }) }

export function vestingTokenupdateResponseMaxTime( tx: Transaction, typeArgs: [string, string], res: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_tokenupdate_response_max_time`, typeArguments: typeArgs, arguments: [ obj(tx, res) ], }) }

export function vestingTokenupdateResponsePoolId( tx: Transaction, typeArgs: [string, string], res: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_tokenupdate_response_pool_id`, typeArguments: typeArgs, arguments: [ obj(tx, res) ], }) }

export function vestingTokenupdateResponseRawVotingWeight( tx: Transaction, typeArgs: [string, string], res: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_tokenupdate_response_raw_voting_weight`, typeArguments: typeArgs, arguments: [ obj(tx, res) ], }) }

export function vestingTokenupdateResponseVotingWeight( tx: Transaction, typeArgs: [string, string], res: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::vesting_tokenupdate_response_voting_weight`, typeArguments: typeArgs, arguments: [ obj(tx, res) ], }) }

export function week( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::week`, arguments: [ ], }) }

export function whitelist( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::whitelist`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface WithdrawPenaltyFeeArgs { self: TransactionObjectInput; adminCap: TransactionObjectInput; value: bigint | TransactionArgument }

export function withdrawPenaltyFee( tx: Transaction, typeArgs: [string, string], args: WithdrawPenaltyFeeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::withdraw_penalty_fee`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.adminCap), pure(tx, args.value, `u64`) ], }) }

export interface WithdrawPenaltyReserveArgs { self: TransactionObjectInput; witness: GenericArg; value: bigint | TransactionArgument }

export function withdrawPenaltyReserve( tx: Transaction, typeArgs: [string, string, string], args: WithdrawPenaltyReserveArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_center::withdraw_penalty_reserve`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), generic(tx, `${typeArgs[2]}`, args.witness), pure(tx, args.value, `u64`) ], }) }
