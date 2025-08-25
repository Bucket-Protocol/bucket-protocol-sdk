import {PUBLISHED_AT} from "..";
import {Option} from "../../_dependencies/source/0x1/option/structs";
import {AccountRequest} from "../../_dependencies/source/0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/account/structs";
import {obj, option, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function errPoolNotEnough( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::err_pool_not_enough`, arguments: [ ], }) }

export function errFluctuatingPrice( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::err_fluctuating_price`, arguments: [ ], }) }

export interface NewArgs { treasury: TransactionObjectInput; cap: TransactionObjectInput; decimal: number | TransactionArgument; swapInFeeRateBps: bigint | TransactionArgument; swapOutFeeRateBps: bigint | TransactionArgument; priceToleranceBps: bigint | TransactionArgument }

export function new_( tx: Transaction, typeArg: string, args: NewArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::new`, typeArguments: [typeArg], arguments: [ obj(tx, args.treasury), obj(tx, args.cap), pure(tx, args.decimal, `u8`), pure(tx, args.swapInFeeRateBps, `u64`), pure(tx, args.swapOutFeeRateBps, `u64`), pure(tx, args.priceToleranceBps, `u64`) ], }) }

export interface CreateArgs { treasury: TransactionObjectInput; cap: TransactionObjectInput; decimal: number | TransactionArgument; swapInFeeRateBps: bigint | TransactionArgument; swapOutFeeRateBps: bigint | TransactionArgument; priceToleranceBps: bigint | TransactionArgument }

export function create( tx: Transaction, typeArg: string, args: CreateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::create`, typeArguments: [typeArg], arguments: [ obj(tx, args.treasury), obj(tx, args.cap), pure(tx, args.decimal, `u8`), pure(tx, args.swapInFeeRateBps, `u64`), pure(tx, args.swapOutFeeRateBps, `u64`), pure(tx, args.priceToleranceBps, `u64`) ], }) }

export interface SetFeeConfigArgs { pool: TransactionObjectInput; cap: TransactionObjectInput; partner: (string | TransactionArgument | TransactionArgument | null); swapInFeeRateBps: bigint | TransactionArgument; swapOutFeeRateBps: bigint | TransactionArgument }

export function setFeeConfig( tx: Transaction, typeArg: string, args: SetFeeConfigArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::set_fee_config`, typeArguments: [typeArg], arguments: [ obj(tx, args.pool), obj(tx, args.cap), pure(tx, args.partner, `${Option.$typeName}<address>`), pure(tx, args.swapInFeeRateBps, `u64`), pure(tx, args.swapOutFeeRateBps, `u64`) ], }) }

export interface SetPriceToleranceArgs { pool: TransactionObjectInput; cap: TransactionObjectInput; toleranceBps: bigint | TransactionArgument }

export function setPriceTolerance( tx: Transaction, typeArg: string, args: SetPriceToleranceArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::set_price_tolerance`, typeArguments: [typeArg], arguments: [ obj(tx, args.pool), obj(tx, args.cap), pure(tx, args.toleranceBps, `u64`) ], }) }

export interface SwapInArgs { pool: TransactionObjectInput; treasury: TransactionObjectInput; price: TransactionObjectInput; assetCoin: TransactionObjectInput; partner: (TransactionObjectInput | TransactionArgument | null) }

export function swapIn( tx: Transaction, typeArg: string, args: SwapInArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::swap_in`, typeArguments: [typeArg], arguments: [ obj(tx, args.pool), obj(tx, args.treasury), obj(tx, args.price), obj(tx, args.assetCoin), option(tx, `${AccountRequest.$typeName}`, args.partner) ], }) }

export interface SwapOutArgs { pool: TransactionObjectInput; treasury: TransactionObjectInput; price: TransactionObjectInput; usdbCoin: TransactionObjectInput; partner: (TransactionObjectInput | TransactionArgument | null) }

export function swapOut( tx: Transaction, typeArg: string, args: SwapOutArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::swap_out`, typeArguments: [typeArg], arguments: [ obj(tx, args.pool), obj(tx, args.treasury), obj(tx, args.price), obj(tx, args.usdbCoin), option(tx, `${AccountRequest.$typeName}`, args.partner) ], }) }

export function decimal( tx: Transaction, typeArg: string, pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::decimal`, typeArguments: [typeArg], arguments: [ obj(tx, pool) ], }) }

export function conversionRate( tx: Transaction, typeArg: string, pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::conversion_rate`, typeArguments: [typeArg], arguments: [ obj(tx, pool) ], }) }

export interface SwapInFeeRateArgs { pool: TransactionObjectInput; partner: (string | TransactionArgument | TransactionArgument | null) }

export function swapInFeeRate( tx: Transaction, typeArg: string, args: SwapInFeeRateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::swap_in_fee_rate`, typeArguments: [typeArg], arguments: [ obj(tx, args.pool), pure(tx, args.partner, `${Option.$typeName}<address>`) ], }) }

export interface SwapOutFeeRateArgs { pool: TransactionObjectInput; partner: (string | TransactionArgument | TransactionArgument | null) }

export function swapOutFeeRate( tx: Transaction, typeArg: string, args: SwapOutFeeRateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::swap_out_fee_rate`, typeArguments: [typeArg], arguments: [ obj(tx, args.pool), pure(tx, args.partner, `${Option.$typeName}<address>`) ], }) }

export function balance( tx: Transaction, typeArg: string, pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::balance`, typeArguments: [typeArg], arguments: [ obj(tx, pool) ], }) }

export function balanceAmount( tx: Transaction, typeArg: string, pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::balance_amount`, typeArguments: [typeArg], arguments: [ obj(tx, pool) ], }) }

export function usdbSupply( tx: Transaction, typeArg: string, pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::usdb_supply`, typeArguments: [typeArg], arguments: [ obj(tx, pool) ], }) }

export function priceTolerance( tx: Transaction, typeArg: string, pool: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::price_tolerance`, typeArguments: [typeArg], arguments: [ obj(tx, pool) ], }) }

export interface SwapInInternalArgs { pool: TransactionObjectInput; treasury: TransactionObjectInput; assetCoin: TransactionObjectInput; feeRate: TransactionObjectInput }

export function swapInInternal( tx: Transaction, typeArg: string, args: SwapInInternalArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::swap_in_internal`, typeArguments: [typeArg], arguments: [ obj(tx, args.pool), obj(tx, args.treasury), obj(tx, args.assetCoin), obj(tx, args.feeRate) ], }) }

export interface SwapOutInternalArgs { pool: TransactionObjectInput; treasury: TransactionObjectInput; usdbCoin: TransactionObjectInput; feeRate: TransactionObjectInput }

export function swapOutInternal( tx: Transaction, typeArg: string, args: SwapOutInternalArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::swap_out_internal`, typeArguments: [typeArg], arguments: [ obj(tx, args.pool), obj(tx, args.treasury), obj(tx, args.usdbCoin), obj(tx, args.feeRate) ], }) }

export interface CheckPriceArgs { pool: TransactionObjectInput; price: TransactionObjectInput }

export function checkPrice( tx: Transaction, typeArg: string, args: CheckPriceArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::pool::check_price`, typeArguments: [typeArg], arguments: [ obj(tx, args.pool), obj(tx, args.price) ], }) }
