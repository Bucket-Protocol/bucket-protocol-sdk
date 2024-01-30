import { COINS_TYPE_LIST } from "../constants";
import { TransactionBlock, TransactionArgument } from "@mysten/sui.js/transactions";

export function coinIntoBalance(
    tx: TransactionBlock,
    coinType: string,
    coinInput: TransactionArgument,
) {
    return tx.moveCall({
        target: "0x2::coin::into_balance",
        typeArguments: [coinType],
        arguments: [coinInput],
    });
}

export function coinFromBalance(
    tx: TransactionBlock,
    coinType: string,
    balanceInput: TransactionArgument,
) {
    return tx.moveCall({
        target: "0x2::coin::from_balance",
        typeArguments: [coinType],
        arguments: [balanceInput],
    });
}

export async function getInputCoins(
    tx: TransactionBlock,
    owner: string,
    coinType: string,
    ...amounts: number[]
) {
    if (coinType === COINS_TYPE_LIST.SUI) {
        return tx.splitCoins(tx.gas, amounts.map(amount => tx.pure(amount, "u64")));
    } else {
        const { data: userCoins } = await this.client.getCoins({ owner, coinType });
        const [mainCoin, ...otherCoins] = userCoins.map((coin) =>
            tx.objectRef({
                objectId: coin.coinObjectId,
                version: coin.version,
                digest: coin.digest,
            })
        );
        if (otherCoins.length > 0) tx.mergeCoins(mainCoin, otherCoins);

        return tx.splitCoins(mainCoin, amounts.map(amount => tx.pure(amount, "u64")));
    }
};