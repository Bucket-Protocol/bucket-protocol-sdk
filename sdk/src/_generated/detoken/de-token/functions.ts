import {PUBLISHED_AT} from "..";
import {Coin} from "../../_dependencies/source/0x2/coin/structs";
import {ID} from "../../_dependencies/source/0x2/object/structs";
import {obj, option, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export interface NewArgs { lockedCoin: TransactionObjectInput; poolId: string | TransactionArgument; maxTime: bigint | TransactionArgument; unlockTime: bigint | TransactionArgument; earlyUnlock: boolean | TransactionArgument; clock: TransactionObjectInput }

export function new_( tx: Transaction, typeArgs: [string, string], args: NewArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::new`, typeArguments: typeArgs, arguments: [ obj(tx, args.lockedCoin), pure(tx, args.poolId, `${ID.$typeName}`), pure(tx, args.maxTime, `u64`), pure(tx, args.unlockTime, `u64`), pure(tx, args.earlyUnlock, `bool`), obj(tx, args.clock) ], }) }

export function balance( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::balance`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface WithdrawAllArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function withdrawAll( tx: Transaction, typeArgs: [string, string], args: WithdrawAllArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::withdraw_all`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export function destroy( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::destroy`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface WithdrawArgs { self: TransactionObjectInput; value: bigint | TransactionArgument; clock: TransactionObjectInput }

export function withdraw( tx: Transaction, typeArgs: [string, string], args: WithdrawArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::withdraw`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), pure(tx, args.value, `u64`), obj(tx, args.clock) ], }) }

export function point( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::point`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface CalculateBiasArgs { amount: bigint | TransactionArgument; end: bigint | TransactionArgument; ts: bigint | TransactionArgument; maxTime: bigint | TransactionArgument }

export function calculateBias( tx: Transaction, args: CalculateBiasArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::calculate_bias`, arguments: [ pure(tx, args.amount, `u64`), pure(tx, args.end, `u64`), pure(tx, args.ts, `u64`), pure(tx, args.maxTime, `u64`) ], }) }

export function end( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::end`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function maxTime( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::max_time`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface CalculateBiasBySlopeArgs { slope: TransactionObjectInput; end: bigint | TransactionArgument; ts: bigint | TransactionArgument }

export function calculateBiasBySlope( tx: Transaction, args: CalculateBiasBySlopeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::calculate_bias_by_slope`, arguments: [ obj(tx, args.slope), pure(tx, args.end, `u64`), pure(tx, args.ts, `u64`) ], }) }

export interface CalculateSlopeArgs { amount: bigint | TransactionArgument; maxTime: bigint | TransactionArgument }

export function calculateSlope( tx: Transaction, args: CalculateSlopeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::calculate_slope`, arguments: [ pure(tx, args.amount, `u64`), pure(tx, args.maxTime, `u64`) ], }) }

export function earlyUnlock( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::early_unlock`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function escrowEpoch( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::escrow_epoch`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface ExtendArgs { self: TransactionObjectInput; coin: (TransactionObjectInput | TransactionArgument | null); unlockTime: bigint | TransactionArgument; clock: TransactionObjectInput }

export function extend( tx: Transaction, typeArgs: [string, string], args: ExtendArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::extend`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), option(tx, `${Coin.$typeName}<${typeArgs[0]}>`, args.coin), pure(tx, args.unlockTime, `u64`), obj(tx, args.clock) ], }) }

export function init( tx: Transaction, otw: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::init`, arguments: [ obj(tx, otw) ], }) }

export interface IsExpiredArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function isExpired( tx: Transaction, typeArgs: [string, string], args: IsExpiredArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::is_expired`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export function multiplierI128( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::multiplier_i128`, arguments: [ ], }) }

export function poolId( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::pool_id`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function rawVotingWeight( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::raw_voting_weight`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export interface UpdatePlayerPoint_Args { self: TransactionObjectInput; clock: TransactionObjectInput }

export function updatePlayerPoint_( tx: Transaction, typeArgs: [string, string], args: UpdatePlayerPoint_Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::update_player_point_`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export interface VotingWeightArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function votingWeight( tx: Transaction, typeArgs: [string, string], args: VotingWeightArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::voting_weight`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export interface VotingWeightAtArgs { self: TransactionObjectInput; timestamp: bigint | TransactionArgument }

export function votingWeightAt( tx: Transaction, typeArgs: [string, string], args: VotingWeightAtArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_token::voting_weight_at`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), pure(tx, args.timestamp, `u64`) ], }) }
