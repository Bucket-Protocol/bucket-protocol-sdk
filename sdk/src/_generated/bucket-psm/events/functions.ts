import {PUBLISHED_AT} from "..";
import {ID} from "../../_dependencies/source/0x2/object/structs";
import {pure} from "../../_framework/util";
import {Transaction, TransactionArgument} from "@mysten/sui/transactions";

export interface EmitNewPoolArgs { poolId: string | TransactionArgument; decimal: number | TransactionArgument; swapInFeeBps: bigint | TransactionArgument; swapOutFeeBps: bigint | TransactionArgument }

export function emitNewPool( tx: Transaction, typeArg: string, args: EmitNewPoolArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::events::emit_new_pool`, typeArguments: [typeArg], arguments: [ pure(tx, args.poolId, `${ID.$typeName}`), pure(tx, args.decimal, `u8`), pure(tx, args.swapInFeeBps, `u64`), pure(tx, args.swapOutFeeBps, `u64`) ], }) }

export interface EmitSwapInArgs { assetInAmount: bigint | TransactionArgument; assetBalance: bigint | TransactionArgument; usdbOutAmount: bigint | TransactionArgument; usdbSupply: bigint | TransactionArgument }

export function emitSwapIn( tx: Transaction, typeArg: string, args: EmitSwapInArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::events::emit_swap_in`, typeArguments: [typeArg], arguments: [ pure(tx, args.assetInAmount, `u64`), pure(tx, args.assetBalance, `u64`), pure(tx, args.usdbOutAmount, `u64`), pure(tx, args.usdbSupply, `u64`) ], }) }

export interface EmitSwapOutArgs { usdbInAmount: bigint | TransactionArgument; usdbSupply: bigint | TransactionArgument; assetOutAmount: bigint | TransactionArgument; assetBalance: bigint | TransactionArgument }

export function emitSwapOut( tx: Transaction, typeArg: string, args: EmitSwapOutArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::events::emit_swap_out`, typeArguments: [typeArg], arguments: [ pure(tx, args.usdbInAmount, `u64`), pure(tx, args.usdbSupply, `u64`), pure(tx, args.assetOutAmount, `u64`), pure(tx, args.assetBalance, `u64`) ], }) }
