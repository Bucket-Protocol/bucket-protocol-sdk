import {PUBLISHED_AT} from "..";
import {obj} from "../../_framework/util";
import {Transaction, TransactionObjectInput} from "@mysten/sui/transactions";

export function packageVersion( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::version::package_version`, arguments: [ ], }) }

export function assertValidPackage( tx: Transaction, treasury: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::version::assert_valid_package`, arguments: [ obj(tx, treasury) ], }) }
