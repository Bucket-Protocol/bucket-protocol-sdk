import { UserLpProof } from "src/types";
import { COIN } from "..";
export declare function getObjectNames(objectTypes: string[]): string[];
export declare function U64FromBytes(x: number[]): bigint;
export declare const formatUnits: (value: bigint, decimals: number) => string;
export declare const parseUnits: (value: `${number}`, decimals: number) => bigint;
export declare const parseBigInt: (number: `${number}`, decimal: number) => bigint;
export declare const proofTypeToCoinType: (poolType: string) => string[];
export declare const lpProofToObject: (lpProof: UserLpProof) => {
    objectId: string;
    digest: string;
    version: string;
};
export declare const getCoinSymbol: (coinType: string) => COIN | undefined;
//# sourceMappingURL=format.d.ts.map