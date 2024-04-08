import { COINS_TYPE_LIST } from "../constants";
export function coinIntoBalance(tx, coinType, coinInput) {
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
export function coinFromBalance(tx, coinType, balanceInput) {
    return tx.moveCall({
        target: "0x2::coin::from_balance",
        typeArguments: [coinType],
        arguments: [balanceInput],
    });
}
export async function getInputCoins(tx, client, owner, coinType, ...amounts) {
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
        return tx.splitCoins(tx.gas, amounts.map(amount => tx.pure(amount, "u64")));
    }
    else {
        const { data: userCoins } = await client.getCoins({ owner, coinType });
        const [mainCoin, ...otherCoins] = userCoins.map((coin) => tx.objectRef({
            objectId: coin.coinObjectId,
            version: coin.version,
            digest: coin.digest,
        }));
        if (!mainCoin) {
            return tx.moveCall({
                target: `0x2::coin::zero`,
                typeArguments: [coinType],
            });
        }
        if (otherCoins.length > 0)
            tx.mergeCoins(mainCoin, otherCoins);
        return tx.splitCoins(mainCoin, amounts.map(amount => tx.pure(amount, "u64")));
    }
}
;
export async function getMainCoin(tx, client, owner, coinType) {
    if (coinType === COINS_TYPE_LIST.SUI) {
        return undefined;
    }
    const { data: userCoins } = await client.getCoins({ owner, coinType });
    const [mainCoin, ...otherCoins] = userCoins.map((coin) => tx.objectRef({
        objectId: coin.coinObjectId,
        version: coin.version,
        digest: coin.digest,
    }));
    if (!mainCoin) {
        return tx.moveCall({
            target: `0x2::coin::zero`,
            typeArguments: [coinType],
        });
    }
    if (otherCoins.length > 0)
        tx.mergeCoins(mainCoin, otherCoins);
    return mainCoin;
}
;
//# sourceMappingURL=coin.js.map