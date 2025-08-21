import { bcs, BcsType } from '@mysten/sui/bcs';

import { UID } from './dependencies';

export const FLOAT = bcs.struct('Float', {
  value: bcs.U128,
});

export const DOUBLE = bcs.struct('Double', {
  value: bcs.U256,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LINKED_TABLE = <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
  bcs.struct(`LinkedTable<${K.name}, ${V.name}>`, {
    id: UID,
    size: bcs.U64,
    head: bcs.option(K),
    tail: bcs.option(K),
  });
