import {PUBLISHED_AT} from "..";
import {Transaction} from "@mysten/sui/transactions";

export function swapIn( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::memo::swap_in`, arguments: [ ], }) }

export function swapOut( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::memo::swap_out`, arguments: [ ], }) }
