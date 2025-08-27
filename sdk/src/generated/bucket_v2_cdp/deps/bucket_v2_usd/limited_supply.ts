/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * Module for managing a limited supply of tokens or assets. Provides functionality
 * to create, increase, decrease, and destroy a supply with an upper limit.
 */

import { MoveStruct } from '../../../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = 'bucket_v2_usd::limited_supply';
export const LimitedSupply = new MoveStruct({ name: `${$moduleName}::LimitedSupply`, fields: {
        /** The maximum allowed supply. */
        limit: bcs.u64(),
        /** The current supply. */
        supply: bcs.u64()
    } });