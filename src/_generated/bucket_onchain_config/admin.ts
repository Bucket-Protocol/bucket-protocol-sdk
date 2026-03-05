/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = '@local-pkg/bucket_onchain_config::admin';
export const AdminCap = new MoveStruct({ name: `${$moduleName}::AdminCap`, fields: {
        id: bcs.Address
    } });