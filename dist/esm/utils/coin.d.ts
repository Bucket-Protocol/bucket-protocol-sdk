import { TransactionBlock, TransactionArgument } from "@mysten/sui.js/transactions";
export declare function coinIntoBalance(tx: TransactionBlock, coinType: string, coinInput: TransactionArgument): import("@mysten/sui.js/transactions").TransactionResult;
export declare function coinFromBalance(tx: TransactionBlock, coinType: string, balanceInput: TransactionArgument): import("@mysten/sui.js/transactions").TransactionResult;
export declare function getInputCoins(tx: TransactionBlock, owner: string, coinType: string, ...amounts: number[]): Promise<import("@mysten/sui.js/transactions").TransactionResult>;
//# sourceMappingURL=coin.d.ts.map