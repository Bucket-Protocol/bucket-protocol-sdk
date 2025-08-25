import * as incentiveConfig from "./incentive-config/structs";
import * as savingIncentiveEvents from "./saving-incentive-events/structs";
import * as savingIncentive from "./saving-incentive/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(incentiveConfig.GlobalConfig);
loader.register(savingIncentive.SavingPoolIncentives);
loader.register(savingIncentive.Registry);
loader.register(savingIncentive.RewardManager);
loader.register(savingIncentive.StakeData);
loader.register(savingIncentive.RewarderKey);
loader.register(savingIncentive.Rewarder);
loader.register(savingIncentive.DepositResponseChecker);
loader.register(savingIncentive.WithdrawResponseChecker);
loader.register(savingIncentiveEvents.CreateSavingPoolRewardManager);
loader.register(savingIncentiveEvents.AddRewarder);
loader.register(savingIncentiveEvents.SourceChanged);
loader.register(savingIncentiveEvents.FlowRateChanged);
loader.register(savingIncentiveEvents.RewarderTimestampChanged);
loader.register(savingIncentiveEvents.ClaimReward);
 }
