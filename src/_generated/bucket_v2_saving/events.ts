/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = '@local-pkg/bucket_v2_saving::events';
export const NewSavingPoolEvent = new MoveStruct({ name: `${$moduleName}::NewSavingPoolEvent`, fields: {
        saving_pool_id: bcs.Address
    } });
export const UpdateSavingRateEvent = new MoveStruct({ name: `${$moduleName}::UpdateSavingRateEvent`, fields: {
        saving_pool_id: bcs.Address,
        saving_rate_bps: bcs.u64()
    } });
export const DepositEvent = new MoveStruct({ name: `${$moduleName}::DepositEvent`, fields: {
        saving_pool_id: bcs.Address,
        account_address: bcs.Address,
        deposited_usdb_amount: bcs.u64(),
        minted_lp_amount: bcs.u64()
    } });
export const WithdrawEvent = new MoveStruct({ name: `${$moduleName}::WithdrawEvent`, fields: {
        saving_pool_id: bcs.Address,
        account_address: bcs.Address,
        burned_lp_amount: bcs.u64(),
        withdrawal_usdb_amount: bcs.u64()
    } });
export const InterestEmittedEvent = new MoveStruct({ name: `${$moduleName}::InterestEmittedEvent`, fields: {
        saving_pool_id: bcs.Address,
        interest_amount: bcs.u64()
    } });