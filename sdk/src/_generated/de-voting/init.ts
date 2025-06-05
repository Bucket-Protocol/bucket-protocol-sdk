import * as deWrapper from "./de-wrapper/structs";
import * as rewardCenter from "./reward-center/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(deWrapper.DE_WRAPPER);
loader.register(deWrapper.DeWrapper);
loader.register(deWrapper.DeWrapperCreation);
loader.register(deWrapper.New);
loader.register(deWrapper.Receive);
loader.register(deWrapper.Wrap);
loader.register(rewardCenter.Supply);
loader.register(rewardCenter.CheckIn);
loader.register(rewardCenter.Claim);
loader.register(rewardCenter.NewCenter);
loader.register(rewardCenter.RewardCenter);
loader.register(rewardCenter.RewardState);
 }
