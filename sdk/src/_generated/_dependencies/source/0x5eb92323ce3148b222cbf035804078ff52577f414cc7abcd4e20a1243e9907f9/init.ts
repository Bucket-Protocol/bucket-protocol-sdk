import * as admin from "./admin/structs";
import * as limitedSupply from "./limited-supply/structs";
import * as treasury from "./treasury/structs";
import * as usdb from "./usdb/structs";
import {StructClassLoader} from "../../../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(admin.AdminCap);
loader.register(limitedSupply.LimitedSupply);
loader.register(treasury.CollectFee);
loader.register(treasury.ClaimFee);
loader.register(usdb.Mint);
loader.register(usdb.Burn);
loader.register(usdb.USDB);
loader.register(usdb.CapKey);
loader.register(usdb.ModuleConfig);
loader.register(usdb.Treasury);
 }
