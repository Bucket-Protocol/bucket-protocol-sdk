import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export interface NewArgs { bias: TransactionObjectInput; slope: TransactionObjectInput; timestamp: bigint | TransactionArgument }

export function new_( tx: Transaction, args: NewArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::point::new`, arguments: [ obj(tx, args.bias), obj(tx, args.slope), pure(tx, args.timestamp, `u64`) ], }) }

export function bias( tx: Transaction, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::point::bias`, arguments: [ obj(tx, self) ], }) }

export function slope( tx: Transaction, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::point::slope`, arguments: [ obj(tx, self) ], }) }

export function timestamp( tx: Transaction, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::point::timestamp`, arguments: [ obj(tx, self) ], }) }
