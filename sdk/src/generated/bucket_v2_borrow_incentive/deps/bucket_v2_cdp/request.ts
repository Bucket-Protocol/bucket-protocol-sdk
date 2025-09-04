/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for handling requests in the BucketV2 CDP system. */

import { MoveStruct } from '../../../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import * as coin from '../sui/coin.js';
import * as vec_set from '../sui/vec_set.js';
import * as type_name from '../std/type_name.js';
const $moduleName = 'bucket_v2_cdp::request';
export const UpdateRequest = new MoveStruct({ name: `${$moduleName}::UpdateRequest`, fields: {
        vault_id: bcs.Address,
        account: bcs.Address,
        deposit: coin.Coin,
        borrow_amount: bcs.u64(),
        repayment: coin.Coin,
        withdraw_amount: bcs.u64(),
        witnesses: vec_set.VecSet(type_name.TypeName),
        memo: bcs.string()
    } });