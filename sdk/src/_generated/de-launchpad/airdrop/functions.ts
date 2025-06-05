import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export interface NewArgs { cap: TransactionObjectInput; clock: TransactionObjectInput; startTime: bigint | TransactionArgument; endTime: bigint | TransactionArgument; fund: TransactionObjectInput }

export function new_( tx: Transaction, typeArgs: [string, string], args: NewArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::new`, typeArguments: typeArgs, arguments: [ obj(tx, args.cap), obj(tx, args.clock), pure(tx, args.startTime, `u64`), pure(tx, args.endTime, `u64`), obj(tx, args.fund) ], }) }

export function amount( tx: Transaction, eligibility: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::amount`, arguments: [ obj(tx, eligibility) ], }) }

export interface CreateArgs { cap: TransactionObjectInput; clock: TransactionObjectInput; startTime: bigint | TransactionArgument; endTime: bigint | TransactionArgument; fund: TransactionObjectInput }

export function create( tx: Transaction, typeArgs: [string, string], args: CreateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::create`, typeArguments: typeArgs, arguments: [ obj(tx, args.cap), obj(tx, args.clock), pure(tx, args.startTime, `u64`), pure(tx, args.endTime, `u64`), obj(tx, args.fund) ], }) }

export function balance( tx: Transaction, typeArgs: [string, string], pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::balance`, typeArguments: typeArgs, arguments: [ obj(tx, pool) ], }) }

export interface SupplyArgs { pool: TransactionObjectInput; coin: TransactionObjectInput }

export function supply( tx: Transaction, typeArgs: [string, string], args: SupplyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::supply`, typeArguments: typeArgs, arguments: [ obj(tx, args.pool), obj(tx, args.coin) ], }) }

export interface DestroyArgs { pool: TransactionObjectInput; cap: TransactionObjectInput; clock: TransactionObjectInput }

export function destroy( tx: Transaction, typeArgs: [string, string], args: DestroyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::destroy`, typeArguments: typeArgs, arguments: [ obj(tx, args.pool), obj(tx, args.cap), obj(tx, args.clock) ], }) }

export function totalSupply( tx: Transaction, typeArgs: [string, string], pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::total_supply`, typeArguments: typeArgs, arguments: [ obj(tx, pool) ], }) }

export interface ClaimArgs { pool: TransactionObjectInput; clock: TransactionObjectInput; eligibility: TransactionObjectInput }

export function claim( tx: Transaction, typeArgs: [string, string], args: ClaimArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::claim`, typeArguments: typeArgs, arguments: [ obj(tx, args.pool), obj(tx, args.clock), obj(tx, args.eligibility) ], }) }

export function poolId( tx: Transaction, eligibility: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::pool_id`, arguments: [ obj(tx, eligibility) ], }) }

export interface AddManagerArgs { pool: TransactionObjectInput; cap: TransactionObjectInput; manager: string | TransactionArgument }

export function addManager( tx: Transaction, typeArgs: [string, string], args: AddManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::add_manager`, typeArguments: typeArgs, arguments: [ obj(tx, args.pool), obj(tx, args.cap), pure(tx, args.manager, `address`) ], }) }

export interface AllocateArgs { pool: TransactionObjectInput; amount: bigint | TransactionArgument }

export function allocate( tx: Transaction, typeArgs: [string, string], args: AllocateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::allocate`, typeArguments: typeArgs, arguments: [ obj(tx, args.pool), pure(tx, args.amount, `u64`) ], }) }

export function assertSenderIsManager( tx: Transaction, typeArgs: [string, string], pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::assert_sender_is_manager`, typeArguments: typeArgs, arguments: [ obj(tx, pool) ], }) }

export function errAirdropEnded( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::err_airdrop_ended`, arguments: [ ], }) }

export function errAirdropNotEnded( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::err_airdrop_not_ended`, arguments: [ ], }) }

export function errAirdropNotStarted( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::err_airdrop_not_started`, arguments: [ ], }) }

export function errAllocateTooMuch( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::err_allocate_too_much`, arguments: [ ], }) }

export function errInvalidTimeSettings( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::err_invalid_time_settings`, arguments: [ ], }) }

export function errSenderIsNotManager( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::err_sender_is_not_manager`, arguments: [ ], }) }

export function errWrongPool( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::err_wrong_pool`, arguments: [ ], }) }

export interface IsManagerArgs { pool: TransactionObjectInput; manager: string | TransactionArgument }

export function isManager( tx: Transaction, typeArgs: [string, string], args: IsManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::is_manager`, typeArguments: typeArgs, arguments: [ obj(tx, args.pool), pure(tx, args.manager, `address`) ], }) }

export interface RemoveManagerArgs { pool: TransactionObjectInput; cap: TransactionObjectInput; manager: string | TransactionArgument }

export function removeManager( tx: Transaction, typeArgs: [string, string], args: RemoveManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::remove_manager`, typeArguments: typeArgs, arguments: [ obj(tx, args.pool), obj(tx, args.cap), pure(tx, args.manager, `address`) ], }) }

export function timeSettings( tx: Transaction, typeArgs: [string, string], pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::time_settings`, typeArguments: typeArgs, arguments: [ obj(tx, pool) ], }) }

export function totalAllocated( tx: Transaction, typeArgs: [string, string], pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::total_allocated`, typeArguments: typeArgs, arguments: [ obj(tx, pool) ], }) }

export interface UpdateStageArgs { pool: TransactionObjectInput; startTime: bigint | TransactionArgument; endTime: bigint | TransactionArgument }

export function updateStage( tx: Transaction, typeArgs: [string, string], args: UpdateStageArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::airdrop::update_stage`, typeArguments: typeArgs, arguments: [ obj(tx, args.pool), pure(tx, args.startTime, `u64`), pure(tx, args.endTime, `u64`) ], }) }
