import * as deCenter from "./de-center/structs";
import * as deToken from "./de-token/structs";
import * as i128 from "./i128/structs";
import * as point from "./point/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(i128.I128);
loader.register(point.Point);
loader.register(deToken.DE_TOKEN);
loader.register(deToken.DeToken);
loader.register(deToken.DeTokenUpdateEvent);
loader.register(deCenter.AdminCap);
loader.register(deCenter.CreatePoolEvent);
loader.register(deCenter.DE_CENTER);
loader.register(deCenter.DeCenter);
loader.register(deCenter.DeTokenUpdateResponse);
loader.register(deCenter.IncreaseUnlockAmountEvent);
loader.register(deCenter.IncreaseUnlockTimeEvent);
loader.register(deCenter.LockEvent);
loader.register(deCenter.MergeEvent);
loader.register(deCenter.PenaltyEvent);
loader.register(deCenter.PenaltyInfo);
loader.register(deCenter.UnlockEvent);
loader.register(deCenter.WithdrawEvent);
 }
