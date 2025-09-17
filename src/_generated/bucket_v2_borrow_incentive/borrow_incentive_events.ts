/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = '@local-pkg/bucket_v2_borrow_incentive::borrow_incentive_events';
export const RewarderCreated = new MoveStruct({ name: `${$moduleName}::RewarderCreated`, fields: {
        vault_id: bcs.Address,
        rewarder_id: bcs.Address,
        asset_type: bcs.string(),
        reward_type: bcs.string(),
        start_timestamp: bcs.u64(),
        flow_rate: bcs.u256()
    } });
export const SourceChanged = new MoveStruct({ name: `${$moduleName}::SourceChanged`, fields: {
        rewarder_id: bcs.Address,
        reward_type: bcs.string(),
        amount: bcs.u64(),
        is_deposit: bcs.bool()
    } });
export const FlowRateChanged = new MoveStruct({ name: `${$moduleName}::FlowRateChanged`, fields: {
        rewarder_id: bcs.Address,
        asset_type: bcs.string(),
        reward_type: bcs.string(),
        flow_rate: bcs.u256()
    } });
export const ClaimReward = new MoveStruct({ name: `${$moduleName}::ClaimReward`, fields: {
        rewarder_id: bcs.Address,
        account: bcs.Address,
        asset_type: bcs.string(),
        reward_type: bcs.string(),
        amount: bcs.u64()
    } });