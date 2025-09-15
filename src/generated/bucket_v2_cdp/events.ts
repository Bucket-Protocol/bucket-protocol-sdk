/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * Module for emitting events related to the BucketV2 CDP (Collateralized Debt
 * Position) system. This module defines event structs and emit functions for
 * tracking important changes and actions within the CDP system, such as vault
 * creation, supply limit updates, liquidation rule changes, and position updates.
 */

import { MoveStruct } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = '@local-pkg/bucket_v2_cdp::events';
export const VaultCreated = new MoveStruct({ name: `${$moduleName}::VaultCreated`, fields: {
        /** Unique identifier for the vault */
        vault_id: bcs.Address,
        /** The coll type of the vault */
        coll_type: bcs.string(),
        /** The interest rate for the vault (scaled value) */
        interest_rate: bcs.u256(),
        /** The supply limit for the vault */
        supply_limit: bcs.u64(),
        /** The minimum coll ratio required */
        min_coll_ratio: bcs.u128()
    } });
export const SupplyLimitUpdated = new MoveStruct({ name: `${$moduleName}::SupplyLimitUpdated`, fields: {
        /** Unique identifier for the vault */
        vault_id: bcs.Address,
        /** The coll type of the vault */
        coll_type: bcs.string(),
        /** Previous supply limit */
        before: bcs.u64(),
        /** New supply limit */
        after: bcs.u64()
    } });
export const InterestRateUpdated = new MoveStruct({ name: `${$moduleName}::InterestRateUpdated`, fields: {
        /** Unique identifier for the vault */
        vault_id: bcs.Address,
        /** The coll type of the vault */
        coll_type: bcs.string(),
        /** New interest rate */
        interest_rate_bps: bcs.u64()
    } });
export const LiquidationRuleUpdated = new MoveStruct({ name: `${$moduleName}::LiquidationRuleUpdated`, fields: {
        /** Unique identifier for the vault */
        vault_id: bcs.Address,
        /** The coll type of the vault */
        coll_type: bcs.string(),
        /** Previous liquidation rule type */
        before: bcs.string(),
        /** New liquidation rule type */
        after: bcs.string()
    } });
export const PositionUpdated = new MoveStruct({ name: `${$moduleName}::PositionUpdated`, fields: {
        /** Unique identifier for the vault */
        vault_id: bcs.Address,
        /** The coll type of the vault */
        coll_type: bcs.string(),
        /** Address of the debtor (user) */
        debtor: bcs.Address,
        /** Amount deposited in this update */
        deposit_amount: bcs.u64(),
        /** Amount borrowed in this update */
        borrow_amount: bcs.u64(),
        /** Amount withdrawn in this update */
        withdraw_amount: bcs.u64(),
        /** Amount repaid in this update */
        repay_amount: bcs.u64(),
        /** Interest accrued in this update */
        interest_amount: bcs.u64(),
        /** Current coll after the update */
        current_coll_amount: bcs.u64(),
        /** Current debt after the update */
        current_debt_amount: bcs.u64(),
        /** Optional memo or note for the update */
        memo: bcs.string()
    } });
export const SetSecurity = new MoveStruct({ name: `${$moduleName}::SetSecurity`, fields: {
        vault_id: bcs.Address,
        coll_type: bcs.string(),
        sender: bcs.Address,
        level: bcs.option(bcs.u8())
    } });