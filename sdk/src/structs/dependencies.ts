import { bcs, BcsType } from '@mysten/sui/bcs';

export const STRING = bcs.struct('String', {
  bytes: bcs.vector(bcs.U8),
});

export const TYPE_NAME = bcs.struct('TypeName', {
  name: STRING,
});

export const ID = bcs.struct('UID', {
  bytes: bcs.Address,
});

export const UID = bcs.struct('UID', {
  id: ID,
});

export const BALANCE = bcs.struct('Balance', {
  value: bcs.U64,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ENTRY = <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
  bcs.struct(`Entry<${K.name}, ${V.name}>`, {
    key: K,
    value: V,
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VEC_MAP = <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
  bcs.struct(`VecMap<${K.name}, ${V.name}>`, {
    contents: bcs.vector(ENTRY(K, V)),
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VEC_SET = <K extends BcsType<any>>(K: K) =>
  bcs.struct(`VecSet<${K.name}>`, {
    contents: bcs.vector(K),
  });
