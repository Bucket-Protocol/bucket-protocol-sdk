import { type CallArg } from "@mysten/sui.js/bcs";
import type { Infer } from "superstruct";
export declare const ObjectOwner: import("superstruct").Struct<"Immutable" | {
    AddressOwner: string;
} | {
    ObjectOwner: string;
} | {
    Shared: {
        initial_shared_version: string | null;
    };
}, null>;
export type ObjectOwner = Infer<typeof ObjectOwner>;
export type SuiJsonValue = boolean | number | string | CallArg | Array<SuiJsonValue>;
export declare const SuiJsonValue: import("superstruct").Struct<SuiJsonValue, null>;
export declare const ProtocolConfig: import("superstruct").Struct<{
    attributes: Record<string, {
        u32: string;
    } | {
        u64: string;
    } | {
        f64: string;
    } | null>;
    featureFlags: Record<string, boolean>;
    maxSupportedProtocolVersion: string;
    minSupportedProtocolVersion: string;
    protocolVersion: string;
}, {
    attributes: import("superstruct").Struct<Record<string, {
        u32: string;
    } | {
        u64: string;
    } | {
        f64: string;
    } | null>, null>;
    featureFlags: import("superstruct").Struct<Record<string, boolean>, null>;
    maxSupportedProtocolVersion: import("superstruct").Struct<string, null>;
    minSupportedProtocolVersion: import("superstruct").Struct<string, null>;
    protocolVersion: import("superstruct").Struct<string, null>;
}>;
export type ProtocolConfig = Infer<typeof ProtocolConfig>;
//# sourceMappingURL=common.d.ts.map