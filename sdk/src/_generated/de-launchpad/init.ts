import * as airdrop from "./airdrop/structs";
import * as deLaunchpad from "./de-launchpad/structs";
import * as stage from "./stage/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(airdrop.AirdropPool);
loader.register(airdrop.Claim);
loader.register(airdrop.DestroyAirdropPool);
loader.register(airdrop.Eligibility);
loader.register(airdrop.NewAirdropPool);
loader.register(airdrop.NewEligibility);
loader.register(stage.StageConfig);
loader.register(deLaunchpad.Allocation);
loader.register(deLaunchpad.DeLaunchpad);
loader.register(deLaunchpad.NewLaunchpad);
loader.register(deLaunchpad.PublicPurchase);
loader.register(deLaunchpad.WhitelistPurchase);
loader.register(deLaunchpad.WithdrawLaunchpad);
 }
