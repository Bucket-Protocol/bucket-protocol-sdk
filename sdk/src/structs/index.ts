import { bcs } from '@mysten/sui/bcs';

export const POSITION_DATA = bcs.struct('CdpPositionData', {
  debtor: bcs.Address,
  coll_amount: bcs.U64,
  debt_amount: bcs.U64,
});
