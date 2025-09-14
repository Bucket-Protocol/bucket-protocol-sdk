/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = '@local-pkg/bucket_v2_flash::events';
export const UpdateFlashMintConfig = new MoveStruct({ name: `${$moduleName}::UpdateFlashMintConfig`, fields: {
        config_id: bcs.Address,
        partner_address: bcs.option(bcs.Address),
        fee_rate_bps: bcs.u64(),
        max_amount: bcs.u64()
    } });
export const FlashMint = new MoveStruct({ name: `${$moduleName}::FlashMint`, fields: {
        partner_address: bcs.option(bcs.Address),
        value: bcs.u64(),
        fee_amount: bcs.u64()
    } });