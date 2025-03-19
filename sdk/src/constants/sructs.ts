import { bcs } from '@mysten/sui/bcs';

import { BUCKET_OPERATIONS_PACKAGE_ID } from './object';

export const STRUCT_BOTTLE_DATA = bcs.struct(`${BUCKET_OPERATIONS_PACKAGE_ID}::utils::BottleData`, {
  debtor: bcs.Address,
  coll_amount: bcs.U64,
  debt_amount: bcs.U64,
});
