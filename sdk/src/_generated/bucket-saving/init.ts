import * as events from "./events/structs";
import * as saving from "./saving/structs";
import * as witness from "./witness/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(events.NewSavingPoolEvent);
loader.register(events.UpdateSavingRateEvent);
loader.register(events.DepositEvent);
loader.register(events.WithdrawEvent);
loader.register(events.InterestEmittedEvent);
loader.register(saving.InterestConfig);
loader.register(saving.Position);
loader.register(saving.SavingPool);
loader.register(saving.DepositResponse);
loader.register(saving.WithdrawResponse);
loader.register(witness.BucketV2Saving);
 }
