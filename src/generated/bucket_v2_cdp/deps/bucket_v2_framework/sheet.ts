/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Module for the record of Credit and Debt of certain entity */

import { MoveTuple, MoveStruct } from '../../../utils/index.js';
import * as type_name from '../std/type_name.js';
import * as vec_map from '../sui/vec_map.js';
import * as liability from './liability.js';
import * as vec_set from '../sui/vec_set.js';
const $moduleName = 'bucket_v2_framework::sheet';
export const Entity = new MoveTuple({ name: `${$moduleName}::Entity`, fields: [type_name.TypeName] });
export const Sheet = new MoveStruct({ name: `${$moduleName}::Sheet`, fields: {
        credits: vec_map.VecMap(Entity, liability.Credit),
        debts: vec_map.VecMap(Entity, liability.Debt),
        blacklist: vec_set.VecSet(Entity)
    } });