import { normalizeSuiAddress } from '@mysten/sui/utils';

export * from './coin';
export * from './object';
export * from './strap';
export * from './price';
export * from './point';
export * from './deBut';

export const DUMMY_ADDRESS = normalizeSuiAddress('0x0');

export const MAX_LOCK_TIME = 4838400_000; // 8 weeks
