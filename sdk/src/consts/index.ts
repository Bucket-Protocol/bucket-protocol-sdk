import { SharedObjectRef } from '@mysten/sui/dist/cjs/bcs/types';
import { normalizeSuiAddress } from '@mysten/sui/utils';

export const DUMMY_ADDRESS = normalizeSuiAddress('0x0');

export const FLOAT_OFFSET = 10n ** 9n;
export const DOUBLE_OFFSET = 10n ** 18n;

export const CLOCK_OBJ: SharedObjectRef = {
  objectId: '0x6',
  initialSharedVersion: 1,
  mutable: false,
};
