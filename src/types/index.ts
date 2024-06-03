export * from "./response";
export * from "./config";
export * from "./bucket";

import { bcs } from "@mysten/sui/bcs";
export type SharedObjectRef = typeof bcs.SharedObjectRef.$inferType;