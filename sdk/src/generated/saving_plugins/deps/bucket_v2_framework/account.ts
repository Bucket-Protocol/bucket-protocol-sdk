/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for Account Abstraction */

import { MoveStruct } from '../../../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import * as object from '../sui/object.js';
const $moduleName = 'bucket_v2_framework::account';
export const Account = new MoveStruct({ name: `${$moduleName}::Account`, fields: {
        id: object.UID,
        alias: bcs.option(bcs.string())
    } });