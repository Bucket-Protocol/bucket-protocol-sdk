import * as account from "./account/structs";
import * as double_ from "./double/structs";
import * as float_ from "./float/structs";
import * as liability from "./liability/structs";
import * as linkedTable from "./linked-table/structs";
import * as sheet from "./sheet/structs";
import {StructClassLoader} from "../../../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(account.ACCOUNT);
loader.register(account.Account);
loader.register(account.AccountRequest);
loader.register(double_.Double);
loader.register(float_.Float);
loader.register(liability.Credit);
loader.register(liability.Debt);
loader.register(linkedTable.LinkedTable);
loader.register(linkedTable.Node);
loader.register(sheet.Entity);
loader.register(sheet.Sheet);
loader.register(sheet.Loan);
loader.register(sheet.Request);
 }
