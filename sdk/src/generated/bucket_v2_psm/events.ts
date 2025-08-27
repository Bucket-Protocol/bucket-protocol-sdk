/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = '@local-pkg/bucket_v2_psm::events';
export const NewPsmPool = new MoveStruct({ name: `${$moduleName}::NewPsmPool`, fields: {
        pool_id: bcs.Address,
        coin_type: bcs.string(),
        decimal: bcs.u8(),
        swap_in_fee_bps: bcs.u64(),
        swap_out_fee_bps: bcs.u64()
    } });
export const PsmSwapIn = new MoveStruct({ name: `${$moduleName}::PsmSwapIn`, fields: {
        asset_in_amount: bcs.u64(),
        asset_balance: bcs.u64(),
        usdb_out_amount: bcs.u64(),
        usdb_supply: bcs.u64()
    } });
export const PsmSwapOut = new MoveStruct({ name: `${$moduleName}::PsmSwapOut`, fields: {
        usdb_in_amount: bcs.u64(),
        usdb_supply: bcs.u64(),
        asset_out_amount: bcs.u64(),
        asset_balance: bcs.u64()
    } });