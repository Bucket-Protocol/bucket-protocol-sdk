import {PUBLISHED_AT} from "..";
import {Transaction} from "@mysten/sui/transactions";

export function savingPool( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::memo::saving_pool`, arguments: [ ], }) }
