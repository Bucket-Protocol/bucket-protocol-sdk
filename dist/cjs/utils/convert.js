"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToPsm = exports.objectToStrapFountain = exports.objectToFountain = void 0;
const constants_1 = require("../constants");
const objectTypes_1 = require("../objects/objectTypes");
const format_1 = require("./format");
function objectToFountain(res) {
    const id = res.data?.objectId ?? "";
    const isKriya = id == constants_1.KRIYA_SUI_BUCK_LP_REGISTRY_ID || id == constants_1.KRIYA_USDC_BUCK_LP_REGISTRY_ID;
    const fields = (0, objectTypes_1.getObjectFields)(res);
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
exports.objectToFountain = objectToFountain;
function objectToStrapFountain(res) {
    const fields = (0, objectTypes_1.getObjectFields)(res);
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
    };
}
exports.objectToStrapFountain = objectToStrapFountain;
function objectToPsm(res) {
    const fields = (0, objectTypes_1.getObjectFields)(res);
    const poolId = fields.id.id;
    const coin = Object.keys(constants_1.PSM_POOL_IDS).find(symbol => constants_1.PSM_POOL_IDS[symbol] == poolId);
    return {
        id: poolId,
        tvl: Number((0, format_1.formatUnits)(BigInt(fields.pool), constants_1.COIN_DECIMALS[coin] ?? 9)),
        chargeRate: Number(fields.charge_fee_rate),
        dischargeRate: Number(fields.discharge_fee_rate),
        conversionRate: Number(fields.conversion_rate),
    };
}
exports.objectToPsm = objectToPsm;
//# sourceMappingURL=convert.js.map