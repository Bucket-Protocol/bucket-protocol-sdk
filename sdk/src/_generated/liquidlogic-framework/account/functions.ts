import {PUBLISHED_AT} from "..";
import {String} from "../../_dependencies/source/0x1/string/structs";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function new_( tx: Transaction, alias: string | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::account::new`, arguments: [ pure(tx, alias, `${String.$typeName}`) ], }) }

export interface ReceiveArgs { account: TransactionObjectInput; receiving: TransactionObjectInput }

export function receive( tx: Transaction, typeArg: string, args: ReceiveArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::account::receive`, typeArguments: [typeArg], arguments: [ obj(tx, args.account), obj(tx, args.receiving) ], }) }

export function destroy( tx: Transaction, req: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::account::destroy`, arguments: [ obj(tx, req) ], }) }

export function request( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::account::request`, arguments: [ ], }) }

export function init( tx: Transaction, otw: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::account::init`, arguments: [ obj(tx, otw) ], }) }

export function requestWithAccount( tx: Transaction, acc: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::account::request_with_account`, arguments: [ obj(tx, acc) ], }) }
