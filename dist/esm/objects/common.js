// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { boolean, define, literal, nullable, object, record, string, union, } from "superstruct";
export const ObjectOwner = union([
    object({
        AddressOwner: string(),
    }),
    object({
        ObjectOwner: string(),
    }),
    object({
        Shared: object({
            initial_shared_version: nullable(string()),
        }),
    }),
    literal("Immutable"),
]);
export const SuiJsonValue = define("SuiJsonValue", () => true);
const ProtocolConfigValue = union([
    object({ u32: string() }),
    object({ u64: string() }),
    object({ f64: string() }),
]);
export const ProtocolConfig = object({
    attributes: record(string(), nullable(ProtocolConfigValue)),
    featureFlags: record(string(), boolean()),
    maxSupportedProtocolVersion: string(),
    minSupportedProtocolVersion: string(),
    protocolVersion: string(),
});
