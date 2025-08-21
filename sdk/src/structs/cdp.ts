import { bcs } from '@mysten/sui/dist/cjs/bcs';

import { VEC_MAP } from '@/structs/dependencies';

export const ACL = bcs.struct('Acl', {
  managers: VEC_MAP(bcs.Address, bcs.U8),
});
