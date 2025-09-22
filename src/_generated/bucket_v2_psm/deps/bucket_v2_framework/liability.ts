/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for managing Credit and Debt for DeFi protocol usage */

import { MoveStruct } from '../../../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = 'bucket_v2_framework::liability';
export const Credit = new MoveStruct({ name: `${$moduleName}::Credit`, fields: {
        value: bcs.u64()
    } });
export const Debt = new MoveStruct({ name: `${$moduleName}::Debt`, fields: {
        value: bcs.u64()
    } });