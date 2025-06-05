import { PUBLISHED_AT } from "..";
import { ID } from "../../_dependencies/source/0x2/object/structs";
import { obj, pure } from "../../_framework/util";
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
} from "@mysten/sui/transactions";

export interface NewArgs {
  cap: TransactionObjectInput;
  offset: bigint | TransactionArgument;
  clock: TransactionObjectInput;
  claimable: boolean | TransactionArgument;
}

export function new_(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: NewArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::new`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.cap),
      pure(tx, args.offset, `u64`),
      obj(tx, args.clock),
      pure(tx, args.claimable, `bool`),
    ],
  });
}

export interface SupplyArgs {
  self: TransactionObjectInput;
  balance: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function supply(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: SupplyArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::supply`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.balance), obj(tx, args.clock)],
  });
}

export interface ClaimArgs {
  self: TransactionObjectInput;
  deWrapper: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function claim(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: ClaimArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::claim`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.deWrapper),
      obj(tx, args.clock),
    ],
  });
}

export function assertVersion(
  tx: Transaction,
  typeArgs: [string, string, string],
  self: TransactionObjectInput,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::assert_version`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  });
}

export function offset(
  tx: Transaction,
  typeArgs: [string, string, string],
  self: TransactionObjectInput,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::offset`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  });
}

export function packageVersion(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::package_version`,
    arguments: [],
  });
}

export interface AddVotingStateIfNotExistsArgs {
  self: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function addVotingStateIfNotExists(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: AddVotingStateIfNotExistsArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::add_voting_state_if_not_exists`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.clock)],
  });
}

export interface AssertFreshVoteArgs {
  self: TransactionObjectInput;
  deWrapper: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function assertFreshVote(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: AssertFreshVoteArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::assert_fresh_vote`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.deWrapper),
      obj(tx, args.clock),
    ],
  });
}

export interface CheckInArgs {
  self: TransactionObjectInput;
  deWrapper: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function checkIn(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: CheckInArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::check_in`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.deWrapper),
      obj(tx, args.clock),
    ],
  });
}

export function claimable(
  tx: Transaction,
  typeArgs: [string, string, string],
  self: TransactionObjectInput,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::claimable`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  });
}

export function defaultVotingState(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::default_voting_state`,
    typeArguments: [typeArg],
    arguments: [],
  });
}

export function errAlreadyCheckedIn(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::err_already_checked_in`,
    arguments: [],
  });
}

export function errInvalidPackageVersion(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::err_invalid_package_version`,
    arguments: [],
  });
}

export interface GetCastedWeightByEpochArgs {
  self: TransactionObjectInput;
  deWrapperId: string | TransactionArgument;
  epoch: bigint | TransactionArgument;
}

export function getCastedWeightByEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetCastedWeightByEpochArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_casted_weight_by_epoch`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.deWrapperId, `${ID.$typeName}`),
      pure(tx, args.epoch, `u64`),
    ],
  });
}

export interface GetCurrentEpochTimeArgs {
  self: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function getCurrentEpochTime(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetCurrentEpochTimeArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_current_epoch_time`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.clock)],
  });
}

export interface GetCurrentVotingStateArgs {
  self: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function getCurrentVotingState(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetCurrentVotingStateArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_current_voting_state`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.clock)],
  });
}

export interface GetCurrentVotingStateMutArgs {
  self: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function getCurrentVotingStateMut(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetCurrentVotingStateMutArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_current_voting_state_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.clock)],
  });
}

export interface GetCurrentVotingStateRewardArgs {
  self: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function getCurrentVotingStateReward(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetCurrentVotingStateRewardArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_current_voting_state_reward`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.clock)],
  });
}

export interface GetCurrentVotingStateTotalRewardsArgs {
  self: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function getCurrentVotingStateTotalRewards(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetCurrentVotingStateTotalRewardsArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_current_voting_state_total_rewards`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.clock)],
  });
}

export interface GetCurrentVotingStateTotalWeightsArgs {
  self: TransactionObjectInput;
  clock: TransactionObjectInput;
}

export function getCurrentVotingStateTotalWeights(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetCurrentVotingStateTotalWeightsArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_current_voting_state_total_weights`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.clock)],
  });
}

export interface GetPendingRewardsArgs {
  self: TransactionObjectInput;
  deWrapperId: string | TransactionArgument;
  clock: TransactionObjectInput;
}

export function getPendingRewards(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetPendingRewardsArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_pending_rewards`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.deWrapperId, `${ID.$typeName}`),
      obj(tx, args.clock),
    ],
  });
}

export interface GetRewardsByEpochArgs {
  state: TransactionObjectInput;
  deWrapperId: string | TransactionArgument;
}

export function getRewardsByEpoch(
  tx: Transaction,
  typeArg: string,
  args: GetRewardsByEpochArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_rewards_by_epoch`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.state),
      pure(tx, args.deWrapperId, `${ID.$typeName}`),
    ],
  });
}

export interface GetVotingStateByEpochArgs {
  self: TransactionObjectInput;
  epoch: bigint | TransactionArgument;
}

export function getVotingStateByEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetVotingStateByEpochArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_voting_state_by_epoch`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), pure(tx, args.epoch, `u64`)],
  });
}

export interface GetVotingStateRewardByEpochArgs {
  self: TransactionObjectInput;
  epoch: bigint | TransactionArgument;
}

export function getVotingStateRewardByEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetVotingStateRewardByEpochArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_voting_state_reward_by_epoch`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), pure(tx, args.epoch, `u64`)],
  });
}

export interface GetVotingStateTotalRewardsByEpochArgs {
  self: TransactionObjectInput;
  epoch: bigint | TransactionArgument;
}

export function getVotingStateTotalRewardsByEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetVotingStateTotalRewardsByEpochArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_voting_state_total_rewards_by_epoch`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), pure(tx, args.epoch, `u64`)],
  });
}

export interface GetVotingStateTotalWeightsByEpochArgs {
  self: TransactionObjectInput;
  epoch: bigint | TransactionArgument;
}

export function getVotingStateTotalWeightsByEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetVotingStateTotalWeightsByEpochArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_voting_state_total_weights_by_epoch`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), pure(tx, args.epoch, `u64`)],
  });
}

export interface GetWeeklyEpochTimeArgs {
  timeMs: bigint | TransactionArgument;
  offset: bigint | TransactionArgument;
}

export function getWeeklyEpochTime(
  tx: Transaction,
  args: GetWeeklyEpochTimeArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::get_weekly_epoch_time`,
    arguments: [pure(tx, args.timeMs, `u64`), pure(tx, args.offset, `u64`)],
  });
}

export interface LastClaimedArgs {
  self: TransactionObjectInput;
  deWrapperId: string | TransactionArgument;
}

export function lastClaimed(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: LastClaimedArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::last_claimed`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.deWrapperId, `${ID.$typeName}`),
    ],
  });
}

export function startEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  self: TransactionObjectInput,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::start_epoch`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  });
}

export interface ToggleClaimableArgs {
  self: TransactionObjectInput;
  cap: TransactionObjectInput;
}

export function toggleClaimable(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: ToggleClaimableArgs,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::toggle_claimable`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  });
}

export function votingStateReward(
  tx: Transaction,
  typeArg: string,
  state: TransactionObjectInput,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::voting_state_reward`,
    typeArguments: [typeArg],
    arguments: [obj(tx, state)],
  });
}

export function votingStateTotalRewards(
  tx: Transaction,
  typeArg: string,
  state: TransactionObjectInput,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::voting_state_total_rewards`,
    typeArguments: [typeArg],
    arguments: [obj(tx, state)],
  });
}

export function votingStateVotes(
  tx: Transaction,
  typeArg: string,
  state: TransactionObjectInput,
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::reward_center::voting_state_votes`,
    typeArguments: [typeArg],
    arguments: [obj(tx, state)],
  });
}
