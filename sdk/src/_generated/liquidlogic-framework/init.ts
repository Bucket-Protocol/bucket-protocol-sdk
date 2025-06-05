import * as account from "./account/structs";
import * as double_ from "./double/structs";
import * as float_ from "./float/structs";
import * as sheet from "./sheet/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(double_.Float);
loader.register(float_.Float);
loader.register(account.ACCOUNT);
loader.register(account.Account);
loader.register(account.AccountRequest);
loader.register(sheet.Collector);
loader.register(sheet.Creditor);
loader.register(sheet.Debtor);
loader.register(sheet.Credit);
loader.register(sheet.Debt);
loader.register(sheet.Loan);
loader.register(sheet.Repayment);
loader.register(sheet.Sheet);
 }
