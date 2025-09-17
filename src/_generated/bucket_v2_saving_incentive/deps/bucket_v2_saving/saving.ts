/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { bcs } from '@mysten/sui/bcs';

import { MoveStruct } from '../../../utils/index.js';
import * as type_name from '../std/type_name.js';
import * as vec_set from '../sui/vec_set.js';

const $moduleName = 'bucket_v2_saving::saving';
export const DepositResponse = new MoveStruct({
  name: `${$moduleName}::DepositResponse`,
  fields: {
    /** Address of the account that made the deposit */
    account_address: bcs.Address,
    /** Amount of USDB deposited into the pool */
    deposited_usdb_amount: bcs.u64(),
    /** Amount of LP tokens minted for this deposit */
    minted_lp_amount: bcs.u64(),
    /** Previous LP token balance before this deposit */
    prev_lp_balance: bcs.u64(),
    /** Previous last update timestamp before this deposit */
    prev_last_update_timestamp: bcs.u64(),
    /** Set of witness types that have been validated */
    witnesses: vec_set.VecSet(type_name.TypeName),
  },
});
export const WithdrawResponse = new MoveStruct({
  name: `${$moduleName}::WithdrawResponse`,
  fields: {
    /** Address of the account that made the withdrawal */
    account_address: bcs.Address,
    /** Amount of LP tokens burned for this withdrawal */
    burned_lp_amount: bcs.u64(),
    /** Previous LP token balance before this withdrawal */
    prev_lp_balance: bcs.u64(),
    /** Previous last update timestamp before this withdrawal */
    prev_last_update_timestamp: bcs.u64(),
    /** Amount of USDB withdrawn from the pool */
    withdrawal_usdb_amount: bcs.u64(),
    /** Set of witness types that have been validated */
    witnesses: vec_set.VecSet(type_name.TypeName),
  },
});
