import * as aggregator from "./aggregator/structs";
import * as collector from "./collector/structs";
import * as listing from "./listing/structs";
import * as result from "./result/structs";
import {StructClassLoader} from "../../../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(aggregator.NewPriceAggregator);
loader.register(aggregator.WeightUpdated);
loader.register(aggregator.ThresholdUpdated);
loader.register(aggregator.OutlierToleranceUpdated);
loader.register(aggregator.PriceAggregated);
loader.register(aggregator.PriceAggregator);
loader.register(collector.PriceCollector);
loader.register(listing.ListingCap);
loader.register(result.PriceResult);
 }
