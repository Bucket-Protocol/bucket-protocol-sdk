import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock, TransactionArgument } from "@mysten/sui.js/transactions";
import { COINS_TYPE_LIST } from "../constants";

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
    client: SuiClient,
    owner: string,
    coinType: string,
    ...amounts: number[]
) {
    if (coinType === COINS_TYPE_LIST.SUI) {
        return tx.splitCoins(tx.gas, amounts.map(amount => tx.pure(amount, "u64")));
    } else {
        const { data: userCoins } = await client.getCoins({ owner, coinType });
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

export async function getMainCoin(
    tx: TransactionBlock,
    client: SuiClient,
    owner: string,
    coinType: string,
) {
    if (coinType === COINS_TYPE_LIST.SUI) {
        return undefined;
    }

    const { data: userCoins } = await client.getCoins({ owner, coinType });
    const [mainCoin, ...otherCoins] = userCoins.map((coin) =>
        tx.objectRef({
            objectId: coin.coinObjectId,
            version: coin.version,
            digest: coin.digest,
        })
    );

    if (otherCoins.length > 0) tx.mergeCoins(mainCoin, otherCoins);
    return mainCoin;
};