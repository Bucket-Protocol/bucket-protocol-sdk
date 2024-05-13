import { COIN, FountainInfo, PsmInfo, PsmPoolResponse, StrapFountainInfo } from "../types";
import { COIN_DECIMALS, KRIYA_SUI_BUCK_LP_REGISTRY_ID, KRIYA_USDC_BUCK_LP_REGISTRY_ID, PSM_POOL_IDS } from "../constants";
import { SuiObjectResponse, getObjectFields } from "../objects/objectTypes";
import { formatUnits } from "./format";

export function objectToFountain(res: SuiObjectResponse): FountainInfo {
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
    }
}

export function objectToStrapFountain(res: SuiObjectResponse): StrapFountainInfo {
    const fields = getObjectFields(res);

    return {
        id: res.data?.objectId ?? "",
        flowAmount: Number(fields?.flow_amount ?? 0),
        flowInterval: Number(fields?.flow_interval ?? 1),
        sourceBalance: Number(fields?.source ?? 0),
        poolBalance: Number(fields?.pool ?? 0),
        totalDebtAmount: Number(fields?.total_debt_amount ?? 0),
        cumulativeUnit: Number(fields?.cumulative_unit ?? 0),
        latestReleaseTime: Number(fields?.latest_release_time ?? 0),
        strapId: fields?.strap_table.fields.id.id,
    }
}

export function objectToPsm(res: SuiObjectResponse): PsmInfo {
    const fields = getObjectFields(res) as PsmPoolResponse;
    const poolId = fields.id.id;
    const coin = Object.keys(PSM_POOL_IDS).find(symbol => PSM_POOL_IDS[symbol as COIN] == poolId) as string;

    return {
        id: poolId,
        tvl: Number(formatUnits(BigInt(fields.pool), COIN_DECIMALS[coin as COIN] ?? 9)),
        chargeRate: Number(fields.charge_fee_rate),
        dischargeRate: Number(fields.discharge_fee_rate),
        conversionRate: Number(fields.conversion_rate),
    };
}