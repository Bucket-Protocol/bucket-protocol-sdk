import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock, TransactionArgument } from "@mysten/sui.js/transactions";
export declare function coinIntoBalance(tx: TransactionBlock, coinType: string, coinInput: TransactionArgument): import("@mysten/sui.js/transactions").TransactionResult;
export declare function coinFromBalance(tx: TransactionBlock, coinType: string, balanceInput: TransactionArgument): import("@mysten/sui.js/transactions").TransactionResult;
export declare function getInputCoins(tx: TransactionBlock, client: SuiClient, owner: string, coinType: string, ...amounts: number[]): Promise<import("@mysten/sui.js/transactions").TransactionResult>;
export declare function getMainCoin(tx: TransactionBlock, client: SuiClient, owner: string, coinType: string): Promise<import("@mysten/sui.js/transactions").TransactionObjectArgument | undefined>;
//# sourceMappingURL=coin.d.ts.map