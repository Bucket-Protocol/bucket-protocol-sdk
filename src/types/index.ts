import { Argument } from '@mysten/sui/transactions';

export type TransactionNestedResult = Extract<
  Argument,
  {
    NestedResult: unknown;
  }
>;
