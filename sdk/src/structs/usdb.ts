import { bcs } from '@mysten/sui/bcs';

export const LIMITED_SUPPLY = bcs.struct('LimitedSupply', {
  limit: bcs.U64,
  supply: bcs.U64,
});
