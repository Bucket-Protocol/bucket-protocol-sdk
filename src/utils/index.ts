import { MARKET_COINS_TYPE_LIST } from "../constants";

export * from "../constants";

export function getObjectNames(objectTypes: string[]) {

    const accept_coin_type = Object.values(MARKET_COINS_TYPE_LIST);
    const accept_coin_name = Object.keys(MARKET_COINS_TYPE_LIST);

    const coinTypeList = objectTypes.map(
        (type) => type.split("<").pop()?.replace(">", "") ?? ""
    );

    const objectNameList: string[] = [];

    coinTypeList.forEach((type) => {
        const typeIndex = accept_coin_type.indexOf(type);
        const coinName = accept_coin_name[typeIndex];
        objectNameList.push(coinName ?? "");
    });

    return objectNameList;
}
