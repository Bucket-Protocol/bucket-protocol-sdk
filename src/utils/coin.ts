import { SuiClient } from "@mysten/sui/client";
import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { COINS_TYPE_LIST } from "../constants";

export function coinIntoBalance(
    tx: Transaction,
    coinType: string,
    coinInput: TransactionArgument | undefined,
) {
    if (coinInput) {
        return tx.moveCall({
            target: "0x2::coin::into_balance",
            typeArguments: [coinType],
            arguments: [coinInput],
        });
    }
    else {
        return tx.moveCall({
            target: "0x2::balance::zero",
            typeArguments: [coinType],
        });
    }

}

export function coinFromBalance(
    tx: Transaction,
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
    tx: Transaction,
    client: SuiClient,
    owner: string,
    coinType: string,
    ...amounts: number[]
) {
    let totalAmount = 0;
    for (const amount of amounts) {
        totalAmount += amount;
    }

    if (totalAmount == 0) {
        return tx.moveCall({
            target: `0x2::coin::zero`,
            typeArguments: [coinType],
        });
    }

    if (coinType === COINS_TYPE_LIST.SUI) {
        return tx.splitCoins(tx.gas, amounts.map(amount => tx.pure.u64(amount)));
    } else {
        const { data: userCoins } = await client.getCoins({ owner, coinType });
        const [mainCoin, ...otherCoins] = userCoins.map((coin) =>
            tx.objectRef({
                objectId: coin.coinObjectId,
                version: coin.version,
                digest: coin.digest,
            })
        );
        if (!mainCoin) {
            return tx.moveCall({
                target: `0x2::coin::zero`,
                typeArguments: [coinType],
            });
        }

        if (otherCoins.length > 0) tx.mergeCoins(mainCoin, otherCoins);

        return tx.splitCoins(mainCoin, amounts.map(amount => tx.pure.u64(amount)));
    }
};

export async function getMainCoin(
    tx: Transaction,
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
    if (!mainCoin) {
        return tx.moveCall({
            target: `0x2::coin::zero`,
            typeArguments: [coinType],
        });
    }

    if (otherCoins.length > 0) tx.mergeCoins(mainCoin, otherCoins);
    return mainCoin;
};