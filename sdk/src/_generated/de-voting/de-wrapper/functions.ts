import {PUBLISHED_AT} from "..";
import {ID} from "../../_dependencies/source/0x2/object/structs";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export interface TransferArgs { wrapper: TransactionObjectInput; creation: TransactionObjectInput }

export function transfer( tx: Transaction, typeArgs: [string, string], args: TransferArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::transfer`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), obj(tx, args.creation) ], }) }

export interface ReceiveArgs { wrapper: TransactionObjectInput; receiving: TransactionObjectInput }

export function receive( tx: Transaction, typeArgs: [string, string, string], args: ReceiveArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::receive`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), obj(tx, args.receiving) ], }) }

export function create( tx: Transaction, typeArgs: [string, string], ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::create`, typeArguments: typeArgs, arguments: [ ], }) }

export interface TakeArgs { wrapper: TransactionObjectInput; tokenId: string | TransactionArgument }

export function take( tx: Transaction, typeArgs: [string, string], args: TakeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::take`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), pure(tx, args.tokenId, `${ID.$typeName}`) ], }) }

export interface TokenArgs { wrapper: TransactionObjectInput; tokenId: string | TransactionArgument }

export function token( tx: Transaction, typeArgs: [string, string], args: TokenArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::token`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), pure(tx, args.tokenId, `${ID.$typeName}`) ], }) }

export function init( tx: Transaction, otw: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::init`, arguments: [ obj(tx, otw) ], }) }

export interface ForceUnlockWithPenaltyArgs { wrapper: TransactionObjectInput; center: TransactionObjectInput; clock: TransactionObjectInput; tokenId: string | TransactionArgument }

export function forceUnlockWithPenalty( tx: Transaction, typeArgs: [string, string], args: ForceUnlockWithPenaltyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::force_unlock_with_penalty`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), obj(tx, args.center), obj(tx, args.clock), pure(tx, args.tokenId, `${ID.$typeName}`) ], }) }

export interface IncreaseUnlockAmountArgs { wrapper: TransactionObjectInput; tokenId: string | TransactionArgument; center: TransactionObjectInput; clock: TransactionObjectInput; coin: TransactionObjectInput }

export function increaseUnlockAmount( tx: Transaction, typeArgs: [string, string], args: IncreaseUnlockAmountArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::increase_unlock_amount`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), pure(tx, args.tokenId, `${ID.$typeName}`), obj(tx, args.center), obj(tx, args.clock), obj(tx, args.coin) ], }) }

export interface IncreaseUnlockTimeArgs { wrapper: TransactionObjectInput; tokenId: string | TransactionArgument; center: TransactionObjectInput; clock: TransactionObjectInput; extendedDuration: bigint | TransactionArgument }

export function increaseUnlockTime( tx: Transaction, typeArgs: [string, string], args: IncreaseUnlockTimeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::increase_unlock_time`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), pure(tx, args.tokenId, `${ID.$typeName}`), obj(tx, args.center), obj(tx, args.clock), pure(tx, args.extendedDuration, `u64`) ], }) }

export interface MergeArgs { wrapper: TransactionObjectInput; primaryId: string | TransactionArgument; mergedId: string | TransactionArgument; center: TransactionObjectInput; clock: TransactionObjectInput }

export function merge( tx: Transaction, typeArgs: [string, string], args: MergeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::merge`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), pure(tx, args.primaryId, `${ID.$typeName}`), pure(tx, args.mergedId, `${ID.$typeName}`), obj(tx, args.center), obj(tx, args.clock) ], }) }

export interface TotalVotingWeightArgs { wrapper: TransactionObjectInput; clock: TransactionObjectInput }

export function totalVotingWeight( tx: Transaction, typeArgs: [string, string], args: TotalVotingWeightArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::total_voting_weight`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), obj(tx, args.clock) ], }) }

export interface UnlockArgs { wrapper: TransactionObjectInput; center: TransactionObjectInput; clock: TransactionObjectInput; tokenId: string | TransactionArgument }

export function unlock( tx: Transaction, typeArgs: [string, string], args: UnlockArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::unlock`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), obj(tx, args.center), obj(tx, args.clock), pure(tx, args.tokenId, `${ID.$typeName}`) ], }) }

export function errInvalidCreation( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::err_invalid_creation`, arguments: [ ], }) }

export function errTokenIdNotFound( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::err_token_id_not_found`, arguments: [ ], }) }

export interface TokenMutArgs { wrapper: TransactionObjectInput; tokenId: string | TransactionArgument }

export function tokenMut( tx: Transaction, typeArgs: [string, string], args: TokenMutArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::token_mut`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), pure(tx, args.tokenId, `${ID.$typeName}`) ], }) }

export interface WrapArgs { wrapper: TransactionObjectInput; token: TransactionObjectInput }

export function wrap( tx: Transaction, typeArgs: [string, string], args: WrapArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_wrapper::wrap`, typeArguments: typeArgs, arguments: [ obj(tx, args.wrapper), obj(tx, args.token) ], }) }
