import { KRIYA_SUI_BUCK_LP_REGISTRY_ID, KRIYA_USDC_BUCK_LP_REGISTRY_ID } from "../constants";
import { getObjectFields } from "../objects/objectTypes";
export function objectToFountain(res) {
    const id = res.data?.objectId ?? "";
    const isKriya = id == KRIYA_SUI_BUCK_LP_REGISTRY_ID || id == KRIYA_USDC_BUCK_LP_REGISTRY_ID;
    const fields = getObjectFields(res);
    return {
        id: res.data?.objectId ?? "",
        flowAmount: Number(fields?.flow_amount ?? 0),
        flowInterval: Number(fields?.flow_interval ?? 1),
        sourceBalance: Number(fields?.source ?? 0),
        poolBalance: Number(fields?.pool ?? 0),
        stakedBalance: isKriya ? Number(fields?.staked?.fields?.lsp.fields?.balance ?? 0) : Number(fields?.staked ?? 0),
        totalWeight: Number(fields?.total_weight ?? 0),
        cumulativeUnit: Number(fields?.cumulative_unit ?? 0),
        latestReleaseTime: Number(fields?.latest_release_time ?? 0),
    };
}
//# sourceMappingURL=convert.js.map