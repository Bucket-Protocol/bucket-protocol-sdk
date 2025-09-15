/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for double precision floating points */

import { MoveStruct } from '../../../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = 'bucket_v2_framework::double';
export const Double = new MoveStruct({ name: `${$moduleName}::Double`, fields: {
        value: bcs.u256()
    } });