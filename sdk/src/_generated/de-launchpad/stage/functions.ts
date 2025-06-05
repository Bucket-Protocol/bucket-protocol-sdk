import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function endTime( tx: Transaction, config: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::stage::end_time`, arguments: [ obj(tx, config) ], }) }

export function ended( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::stage::ended`, arguments: [ ], }) }

export interface GetStageArgs { config: TransactionObjectInput; clock: TransactionObjectInput }

export function getStage( tx: Transaction, args: GetStageArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::stage::get_stage`, arguments: [ obj(tx, args.config), obj(tx, args.clock) ], }) }

export interface NewConfigArgs { whitelistTime: bigint | TransactionArgument; publicTime: bigint | TransactionArgument; endTime: bigint | TransactionArgument }

export function newConfig( tx: Transaction, args: NewConfigArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::stage::new_config`, arguments: [ pure(tx, args.whitelistTime, `u64`), pure(tx, args.publicTime, `u64`), pure(tx, args.endTime, `u64`) ], }) }

export function whitelistTime( tx: Transaction, config: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::stage::whitelist_time`, arguments: [ obj(tx, config) ], }) }

export function publicTime( tx: Transaction, config: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::stage::public_time`, arguments: [ obj(tx, config) ], }) }

export function notStarted( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::stage::not_started`, arguments: [ ], }) }

export function publicSale( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::stage::public_sale`, arguments: [ ], }) }

export function whitelistSale( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::stage::whitelist_sale`, arguments: [ ], }) }
