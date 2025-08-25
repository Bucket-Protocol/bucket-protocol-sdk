import {PUBLISHED_AT} from "..";
import {Transaction} from "@mysten/sui/transactions";

export function witness( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::witness::witness`, arguments: [ ], }) }
