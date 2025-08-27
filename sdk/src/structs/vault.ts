import { bcs } from '@mysten/sui/bcs';

import { BALANCE, TYPE_NAME, UID, VEC_SET } from '@/structs/dependencies';
import { DOUBLE, FLOAT, LINKED_TABLE } from '@/structs/framework';

import { ACL } from './cdp';
import { LIMITED_SUPPLY } from './usdb';

export const POSITION = bcs.struct('Position', {
  coll_amount: bcs.U64,
  debt_amount: bcs.U64,
});

export const VAULT = bcs.struct('Vault', {
  id: UID,
  security_level: bcs.U8,
  access_control: ACL,
  decimal: bcs.U8,
  interest_rate: DOUBLE,
  interest_unit: DOUBLE,
  timestamp: bcs.U64,
  total_pending_interest_amount: bcs.U64,
  limited_supply: LIMITED_SUPPLY,
  total_debt_amount: bcs.U64,
  min_collateral_ratio: FLOAT,
  liquidation_rule: TYPE_NAME,
  request_checklist: bcs.vector(TYPE_NAME),
  response_checklist: bcs.vector(TYPE_NAME),
  position_table: LINKED_TABLE(bcs.Address, POSITION),
  balance: BALANCE,
  position_locker: VEC_SET(bcs.Address),
});

export const POSITION_DATA = bcs.struct('PositionData', {
  debtor: bcs.Address,
  coll_amount: bcs.U64,
  debt_amount: bcs.U64,
});
