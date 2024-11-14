export * from "./bucket";
export * from "./coin";
export * from "./config";
export * from "./response";

import { bcs } from "@mysten/sui/bcs";
export type SharedObjectRef = typeof bcs.SharedObjectRef.$inferType;