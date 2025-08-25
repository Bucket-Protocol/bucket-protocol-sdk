import * as events from "./events/structs";
import * as pool from "./pool/structs";
import * as witness from "./witness/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(events.NewPsmPool);
loader.register(events.PsmSwapIn);
loader.register(events.PsmSwapOut);
loader.register(pool.FeeConfig);
loader.register(pool.Pool);
loader.register(witness.BucketV2PSM);
 }
