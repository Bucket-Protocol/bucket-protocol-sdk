import { Argument } from '@mysten/sui/transactions';

export type SharedObjectRef = {
  objectId: string;
  initialSharedVersion: number | string;
  mutable: boolean;
};

export type TransactionNestedResult = Extract<
  Argument,
  {
    NestedResult: unknown;
  }
>;
