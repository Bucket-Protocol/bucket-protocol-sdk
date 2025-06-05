import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function isZero( tx: Transaction, x: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::is_zero`, arguments: [ obj(tx, x) ], }) }

export interface AddArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function add( tx: Transaction, args: AddArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::add`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface DivArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function div( tx: Transaction, args: DivArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::div`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface MulArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function mul( tx: Transaction, args: MulArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::mul`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface SubArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function sub( tx: Transaction, args: SubArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::sub`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export function from( tx: Transaction, x: bigint | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::from`, arguments: [ pure(tx, x, `u128`) ], }) }

export function zero( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::zero`, arguments: [ ], }) }

export function abs( tx: Transaction, x: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::abs`, arguments: [ obj(tx, x) ], }) }

export function asU128( tx: Transaction, x: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::as_u128`, arguments: [ obj(tx, x) ], }) }

export interface CompareArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function compare( tx: Transaction, args: CompareArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::compare`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export function isNeg( tx: Transaction, x: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::is_neg`, arguments: [ obj(tx, x) ], }) }

export function neg( tx: Transaction, x: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::neg`, arguments: [ obj(tx, x) ], }) }

export function negFrom( tx: Transaction, x: bigint | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::i128::neg_from`, arguments: [ pure(tx, x, `u128`) ], }) }
