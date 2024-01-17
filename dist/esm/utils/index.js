import { COINS_TYPE_LIST } from "../constants";
export * from "../constants";
export function getObjectNames(objectTypes) {
    const accept_coin_type = Object.values(COINS_TYPE_LIST);
    const accept_coin_name = Object.keys(COINS_TYPE_LIST);
    const coinTypeList = objectTypes.map((type) => type.split("<").pop()?.replace(">", "") ?? "");
    const objectNameList = [];
    coinTypeList.forEach((type) => {
        const typeIndex = accept_coin_type.indexOf(type);
        const coinName = accept_coin_name[typeIndex];
        objectNameList.push(coinName ?? "");
    });
    return objectNameList;
}
export function U64FromBytes(x) {
    let u64 = BigInt(0);
    for (let i = x.length - 1; i >= 0; i--) {
        u64 = (u64 << BigInt(8)) | BigInt(x[i] ?? 0);
    }
    return u64;
}
export const formatUnits = (value, decimals) => {
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
//# sourceMappingURL=index.js.map