/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = '@local-pkg/bucket_saving_incentive::saving_incentive_events';
export const CreateSavingPoolRewardManager = new MoveStruct({ name: `${$moduleName}::CreateSavingPoolRewardManager`, fields: {
        reward_manager_id: bcs.Address
    } });
export const AddRewarder = new MoveStruct({ name: `${$moduleName}::AddRewarder`, fields: {
        reward_manager_id: bcs.Address,
        rewarder_id: bcs.Address
    } });
export const SourceChanged = new MoveStruct({ name: `${$moduleName}::SourceChanged`, fields: {
        kind: bcs.string(),
        rewarder_id: bcs.Address,
        reward_type: bcs.string(),
        reward_amount: bcs.u64(),
        is_deposit: bcs.bool()
    } });
export const FlowRateChanged = new MoveStruct({ name: `${$moduleName}::FlowRateChanged`, fields: {
        kind: bcs.string(),
        rewarder_id: bcs.Address,
        asset_type: bcs.string(),
        reward_type: bcs.string(),
        flow_rate: bcs.u256()
    } });
export const RewarderTimestampChanged = new MoveStruct({ name: `${$moduleName}::RewarderTimestampChanged`, fields: {
        kind: bcs.string(),
        rewarder_id: bcs.Address,
        reward_timestamp: bcs.u64()
    } });
export const ClaimReward = new MoveStruct({ name: `${$moduleName}::ClaimReward`, fields: {
        kind: bcs.string(),
        rewarder_id: bcs.Address,
        account_address: bcs.Address,
        asset_type: bcs.string(),
        reward_type: bcs.string(),
        reward_amount: bcs.u64()
    } });