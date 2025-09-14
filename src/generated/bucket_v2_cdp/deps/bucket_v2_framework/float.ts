/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for floating points */

import { MoveStruct } from '../../../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = 'bucket_v2_framework::float';
export const Float = new MoveStruct({ name: `${$moduleName}::Float`, fields: {
        value: bcs.u128()
    } });