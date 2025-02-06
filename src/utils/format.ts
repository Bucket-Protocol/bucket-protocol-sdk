import { COINS_TYPE_LIST } from "../constants";
import { COIN, UserLpProof } from "..";

export function getObjectNames(objectTypes: string[]) {
  const accept_coin_type = Object.values(COINS_TYPE_LIST);
  const accept_coin_name = Object.keys(COINS_TYPE_LIST);

  const coinTypeList = objectTypes.map(
    (type) => type.split("<").pop()?.replace(">", "") ?? "",
  );

  const objectNameList: string[] = [];

  coinTypeList.forEach((type) => {
    const typeIndex = accept_coin_type.indexOf(type);
    const coinName = accept_coin_name[typeIndex];
    objectNameList.push(coinName ?? "");
  });

  return objectNameList;
}

export function U64FromBytes(x: number[]) {
  let u64 = BigInt(0);
  for (let i = x.length - 1; i >= 0; i--) {
    u64 = (u64 << BigInt(8)) | BigInt(x[i] ?? 0);
  }
  return u64;
}

export const formatUnits = (value: bigint, decimals: number) => {
  let display = value.toString();

  const negative = display.startsWith("-");
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, "0");

  const integer = display.slice(0, display.length - decimals);
  let fraction = display.slice(display.length - decimals);

  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${
    fraction ? `.${fraction}` : ""
  }`;
};

export const parseUnits = (value: number | string, decimals: number) => {
  let [integer, fraction = "0"] =
    typeof value == "string" ? value.split(".") : value.toString().split(".");

  if (integer === undefined) {
    return BigInt(0);
  }
  const negative = integer.startsWith("-");
  if (negative) integer = integer.slice(1);

  // trim leading zeros.
  fraction = fraction.replace(/(0+)$/, "");

  // round off if the fraction is larger than the number of decimals.
  if (decimals === 0) {
    integer = `${Math.round(Number(`${integer}.${fraction}`))}`;
    fraction = "";
  } else if (fraction.length > decimals) {
    const [before, after] = [
      fraction.slice(0, decimals),
      fraction.slice(decimals),
    ];
    fraction = `${
      /^0+$/.test(before) ? before.slice(0, before.length - 1) : ""
    }${Math.round(Number(`${before}.${after}`))}`;
  } else {
    fraction = fraction.padEnd(decimals, "0");
  }

  return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
};

export const proofTypeToCoinType = (poolType: string): string[] => {
  const typeChunks = poolType.split("<");
  if (typeChunks[1]) {
    return typeChunks[1].replace(">", "").split(", ");
  }

  return [];
};

export const lpProofToObject = (lpProof: UserLpProof) => {
  return {
    objectId: lpProof.objectId,
    digest: lpProof.digest,
    version: lpProof.version,
  };
};

export const getCoinSymbol = (coinType: string) => {
  const coin = Object.keys(COINS_TYPE_LIST).find(
    (key) => COINS_TYPE_LIST[key as COIN] === coinType,
  );
  if (coin) {
    return coin as COIN;
  }

  return undefined;
};

export const getCoinType = (str: string) => {
  const startIndex = str.indexOf("<");
  const endIndex = str.lastIndexOf(">");

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return str.slice(startIndex + 1, endIndex);
  }

  return null;
};
