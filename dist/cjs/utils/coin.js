"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputCoins = exports.coinFromBalance = exports.coinIntoBalance = void 0;
const constants_1 = require("../constants");
function coinIntoBalance(tx, coinType, coinInput) {
    return tx.moveCall({
        target: "0x2::coin::into_balance",
        typeArguments: [coinType],
        arguments: [coinInput],
    });
}
exports.coinIntoBalance = coinIntoBalance;
function coinFromBalance(tx, coinType, balanceInput) {
    return tx.moveCall({
        target: "0x2::coin::from_balance",
        typeArguments: [coinType],
        arguments: [balanceInput],
    });
}
exports.coinFromBalance = coinFromBalance;
async function getInputCoins(tx, owner, coinType, ...amounts) {
    if (coinType === constants_1.COINS_TYPE_LIST.SUI) {
        return tx.splitCoins(tx.gas, amounts.map(amount => tx.pure(amount, "u64")));
    }
    else {
        const { data: userCoins } = await this.client.getCoins({ owner, coinType });
        const [mainCoin, ...otherCoins] = userCoins.map((coin) => tx.objectRef({
            objectId: coin.coinObjectId,
            version: coin.version,
            digest: coin.digest,
        }));
        if (otherCoins.length > 0)
            tx.mergeCoins(mainCoin, otherCoins);
        return tx.splitCoins(mainCoin, amounts.map(amount => tx.pure(amount, "u64")));
    }
}
exports.getInputCoins = getInputCoins;
;
//# sourceMappingURL=coin.js.map