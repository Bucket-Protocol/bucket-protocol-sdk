import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export interface AddArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function add( tx: Transaction, args: AddArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::add`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface DivArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function div( tx: Transaction, args: DivArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::div`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface GeArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function ge( tx: Transaction, args: GeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::ge`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface GtArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function gt( tx: Transaction, args: GtArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::gt`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface LeArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function le( tx: Transaction, args: LeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::le`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface LtArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function lt( tx: Transaction, args: LtArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::lt`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface MulArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function mul( tx: Transaction, args: MulArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::mul`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface SubArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function sub( tx: Transaction, args: SubArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::sub`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface AddU64Args { a: TransactionObjectInput; b: bigint | TransactionArgument }

export function addU64( tx: Transaction, args: AddU64Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::add_u64`, arguments: [ obj(tx, args.a), pure(tx, args.b, `u64`) ], }) }

export function ceil( tx: Transaction, a: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::ceil`, arguments: [ obj(tx, a) ], }) }

export interface DivU64Args { a: TransactionObjectInput; b: bigint | TransactionArgument }

export function divU64( tx: Transaction, args: DivU64Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::div_u64`, arguments: [ obj(tx, args.a), pure(tx, args.b, `u64`) ], }) }

export interface EqArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function eq( tx: Transaction, args: EqArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::eq`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export function errDividedByZero( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::err_divided_by_zero`, arguments: [ ], }) }

export function errSubtrahendTooLarge( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::err_subtrahend_too_large`, arguments: [ ], }) }

export function floor( tx: Transaction, a: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::floor`, arguments: [ obj(tx, a) ], }) }

export function from( tx: Transaction, v: bigint | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::from`, arguments: [ pure(tx, v, `u64`) ], }) }

export function fromBps( tx: Transaction, v: bigint | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::from_bps`, arguments: [ pure(tx, v, `u64`) ], }) }

export interface FromFractionArgs { n: bigint | TransactionArgument; m: bigint | TransactionArgument }

export function fromFraction( tx: Transaction, args: FromFractionArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::from_fraction`, arguments: [ pure(tx, args.n, `u64`), pure(tx, args.m, `u64`) ], }) }

export function fromPercent( tx: Transaction, v: number | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::from_percent`, arguments: [ pure(tx, v, `u8`) ], }) }

export function fromPercentU64( tx: Transaction, v: bigint | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::from_percent_u64`, arguments: [ pure(tx, v, `u64`) ], }) }

export function fromScaledVal( tx: Transaction, v: bigint | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::from_scaled_val`, arguments: [ pure(tx, v, `u128`) ], }) }

export interface MaxArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function max( tx: Transaction, args: MaxArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::max`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface MinArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function min( tx: Transaction, args: MinArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::min`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface MulU64Args { a: TransactionObjectInput; b: bigint | TransactionArgument }

export function mulU64( tx: Transaction, args: MulU64Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::mul_u64`, arguments: [ obj(tx, args.a), pure(tx, args.b, `u64`) ], }) }

export interface PowArgs { b: TransactionObjectInput; e: bigint | TransactionArgument }

export function pow( tx: Transaction, args: PowArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::pow`, arguments: [ obj(tx, args.b), pure(tx, args.e, `u64`) ], }) }

export interface SaturatingSubArgs { a: TransactionObjectInput; b: TransactionObjectInput }

export function saturatingSub( tx: Transaction, args: SaturatingSubArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::saturating_sub`, arguments: [ obj(tx, args.a), obj(tx, args.b) ], }) }

export interface SaturatingSubU64Args { a: TransactionObjectInput; b: bigint | TransactionArgument }

export function saturatingSubU64( tx: Transaction, args: SaturatingSubU64Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::saturating_sub_u64`, arguments: [ obj(tx, args.a), pure(tx, args.b, `u64`) ], }) }

export interface SubU64Args { a: TransactionObjectInput; b: bigint | TransactionArgument }

export function subU64( tx: Transaction, args: SubU64Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::sub_u64`, arguments: [ obj(tx, args.a), pure(tx, args.b, `u64`) ], }) }

export function toScaledVal( tx: Transaction, v: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::to_scaled_val`, arguments: [ obj(tx, v) ], }) }

export function wad( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::float::wad`, arguments: [ ], }) }
