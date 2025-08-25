import {PUBLISHED_AT} from "..";
import {ID} from "../../_dependencies/source/0x2/object/structs";
import {pure} from "../../_framework/util";
import {Transaction, TransactionArgument} from "@mysten/sui/transactions";

export function emitNewSavingPoolEvent( tx: Transaction, typeArg: string, savingPoolId: string | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::events::emit_new_saving_pool_event`, typeArguments: [typeArg], arguments: [ pure(tx, savingPoolId, `${ID.$typeName}`) ], }) }

export interface EmitUpdateSavingRateEventArgs { savingPoolId: string | TransactionArgument; savingRateBps: bigint | TransactionArgument }

export function emitUpdateSavingRateEvent( tx: Transaction, typeArg: string, args: EmitUpdateSavingRateEventArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::events::emit_update_saving_rate_event`, typeArguments: [typeArg], arguments: [ pure(tx, args.savingPoolId, `${ID.$typeName}`), pure(tx, args.savingRateBps, `u64`) ], }) }

export interface EmitDepositEventArgs { savingPoolId: string | TransactionArgument; accountAddress: string | TransactionArgument; depositedUsdbAmount: bigint | TransactionArgument; mintedLpAmount: bigint | TransactionArgument }

export function emitDepositEvent( tx: Transaction, typeArg: string, args: EmitDepositEventArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::events::emit_deposit_event`, typeArguments: [typeArg], arguments: [ pure(tx, args.savingPoolId, `${ID.$typeName}`), pure(tx, args.accountAddress, `address`), pure(tx, args.depositedUsdbAmount, `u64`), pure(tx, args.mintedLpAmount, `u64`) ], }) }

export interface EmitWithdrawEventArgs { savingPoolId: string | TransactionArgument; accountAddress: string | TransactionArgument; burnedLpAmount: bigint | TransactionArgument; withdrawalUsdbAmount: bigint | TransactionArgument }

export function emitWithdrawEvent( tx: Transaction, typeArg: string, args: EmitWithdrawEventArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::events::emit_withdraw_event`, typeArguments: [typeArg], arguments: [ pure(tx, args.savingPoolId, `${ID.$typeName}`), pure(tx, args.accountAddress, `address`), pure(tx, args.burnedLpAmount, `u64`), pure(tx, args.withdrawalUsdbAmount, `u64`) ], }) }

export interface EmitInterestEmittedEventArgs { savingPoolId: string | TransactionArgument; interestAmount: bigint | TransactionArgument }

export function emitInterestEmittedEvent( tx: Transaction, typeArg: string, args: EmitInterestEmittedEventArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::events::emit_interest_emitted_event`, typeArguments: [typeArg], arguments: [ pure(tx, args.savingPoolId, `${ID.$typeName}`), pure(tx, args.interestAmount, `u64`) ], }) }
