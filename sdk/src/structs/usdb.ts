import { bcs } from '@mysten/sui/dist/cjs/bcs';

export const LIMITED_SUPPLY = bcs.struct('LimitedSupply', {
  limit: bcs.U64,
  supply: bcs.U64,
});
