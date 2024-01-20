"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lpProofToObject = exports.proofTypeToCoinType = exports.getCoinSymbol = exports.parseBigInt = exports.parseUnits = exports.formatUnits = exports.U64FromBytes = exports.getObjectNames = void 0;
const constants_1 = require("../constants");
function getObjectNames(objectTypes) {
    const accept_coin_type = Object.values(constants_1.COINS_TYPE_LIST);
    const accept_coin_name = Object.keys(constants_1.COINS_TYPE_LIST);
    const coinTypeList = objectTypes.map((type) => type.split("<").pop()?.replace(">", "") ?? "");
    const objectNameList = [];
    coinTypeList.forEach((type) => {
        const typeIndex = accept_coin_type.indexOf(type);
        const coinName = accept_coin_name[typeIndex];
        objectNameList.push(coinName ?? "");
    });
    return objectNameList;
}
exports.getObjectNames = getObjectNames;
function U64FromBytes(x) {
    let u64 = BigInt(0);
    for (let i = x.length - 1; i >= 0; i--) {
        u64 = (u64 << BigInt(8)) | BigInt(x[i] ?? 0);
    }
    return u64;
}
exports.U64FromBytes = U64FromBytes;
const formatUnits = (value, decimals) => {
    let display = value.toString();
    const negative = display.startsWith("-");
    if (negative)
        display = display.slice(1);
    display = display.padStart(decimals, "0");
    const integer = display.slice(0, display.length - decimals);
    let fraction = display.slice(display.length - decimals);
    fraction = fraction.replace(/(0+)$/, "");
    return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
};
exports.formatUnits = formatUnits;
const parseUnits = (value, decimals) => {
    let [integer, fraction = "0"] = value.split(".");
    if (integer === undefined) {
        return BigInt(0);
    }
    const negative = integer.startsWith("-");
    if (negative)
        integer = integer.slice(1);
    // trim leading zeros.
    fraction = fraction.replace(/(0+)$/, "");
    // round off if the fraction is larger than the number of decimals.
    if (decimals === 0) {
        integer = `${Math.round(Number(`${integer}.${fraction}`))}`;
        fraction = "";
    }
    else if (fraction.length > decimals) {
        const [before, after] = [
            fraction.slice(0, decimals),
            fraction.slice(decimals),
        ];
        fraction = `${/^0+$/.test(before) ? before.slice(0, before.length - 1) : ""}${Math.round(Number(`${before}.${after}`))}`;
    }
    else {
        fraction = fraction.padEnd(decimals, "0");
    }
    return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
};
exports.parseUnits = parseUnits;
const parseBigInt = (number, decimal) => {
    return (0, exports.parseUnits)(number, decimal);
};
exports.parseBigInt = parseBigInt;
const getCoinSymbol = (coinType) => {
    return Object.keys(constants_1.COINS_TYPE_LIST).find(key => constants_1.COINS_TYPE_LIST[key] === coinType);
};
exports.getCoinSymbol = getCoinSymbol;
const proofTypeToCoinType = (poolType) => {
    const coinTypes = poolType.split("<")[1].replace(">", "").split(", ");
    return coinTypes;
};
exports.proofTypeToCoinType = proofTypeToCoinType;
const lpProofToObject = (lpProof) => {
    return {
        objectId: lpProof.objectId,
        digest: lpProof.digest,
        version: lpProof.version,
    };
};
exports.lpProofToObject = lpProofToObject;
//# sourceMappingURL=index.js.map