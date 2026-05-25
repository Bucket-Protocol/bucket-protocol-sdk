import type { ClientWithCoreApi, SuiClientTypes } from '@mysten/sui/client';
import type { Argument } from '@mysten/sui/transactions';
import {
  Transaction,
  TransactionArgument,
  TransactionCommands,
  TransactionResult,
  coinWithBalance as upstreamCoinWithBalance,
} from '@mysten/sui/transactions';
import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';

import { COIN_WITH_BALANCE_RESOLVER, resolveCoinBalance } from '@/utils/resolvers.js';

/**
 * @description new zero coin
 */
export const getZeroCoin = (tx: Transaction, { coinType }: { coinType: string }): TransactionResult => {
  return tx.moveCall({
    target: '0x2::coin::zero',
    typeArguments: [coinType],
  });
};

/**
 * @description destroy zero coin
 */
export const destroyZeroCoin = (
  tx: Transaction,
  { coinType, coin }: { coinType: string; coin: TransactionArgument },
) => {
  tx.moveCall({
    target: '0x2::coin::destroy_zero',
    typeArguments: [coinType],
    arguments: [coin],
  });
};

/**
 * @description
 */
export const getCoinsOfType = async ({
  coinType,
  client,
  owner,
  usedIds,
}: {
  coinType: string;
  client: ClientWithCoreApi;
  owner: string;
  usedIds: Set<string>;
}): Promise<SuiClientTypes.Coin[]> => {
  const coins: SuiClientTypes.Coin[] = [];

  const loadMoreCoins = async (cursor: string | null = null): Promise<SuiClientTypes.Coin[]> => {
    const {
      objects,
      hasNextPage,
      cursor: nextCursor,
    } = await client.core.listCoins({
      owner,
      coinType,
      cursor,
    });

    for (const coin of objects) {
      if (usedIds.has(coin.objectId)) {
        continue;
      }
      coins.push(coin);
    }
    if (hasNextPage) {
      return loadMoreCoins(nextCursor);
    }
    return coins;
  };
  return loadMoreCoins();
};

/**
 * Augmented `coinWithBalance` — same surface as `@mysten/sui`'s
 * `coinWithBalance`, but `balance` may also be a `TransactionArgument`
 * (e.g. the dynamic result of a prior command).
 *
 * Bigint/number balances route to upstream's `coinWithBalance` so they pick
 * up its smarter sourcing (selective AB sizing, balance-only Path 1, future
 * improvements).
 *
 * `TransactionArgument` balances go through our augmented intent + resolver,
 * which sources owned coins + the full starting AB, runs one combined
 * `SplitCoins` whose amounts may be TxArgs, and pushes any remainder back
 * into AB. The TxArg is stored in `intent.inputs.balance` so the SDK
 * auto-remaps the reference as surrounding commands shift.
 */
export const coinWithBalance = ({
  type = SUI_TYPE_ARG,
  balance,
  useGasCoin = true,
}: {
  balance: bigint | number | TransactionArgument;
  type?: string;
  useGasCoin?: boolean;
}): ((tx: Transaction) => TransactionResult) => {
  if (typeof balance === 'bigint' || typeof balance === 'number') {
    return upstreamCoinWithBalance({ type, balance, useGasCoin });
  }

  let coinResult: TransactionResult | null = null;

  return (tx: Transaction) => {
    if (coinResult) {
      return coinResult;
    }
    tx.addIntentResolver(COIN_WITH_BALANCE_RESOLVER, resolveCoinBalance);

    const coinType = type === 'gas' ? type : normalizeStructTag(type);
    const resolvedType = coinType === normalizeStructTag(SUI_TYPE_ARG) && useGasCoin ? 'gas' : coinType;

    const resolvedArg = (typeof balance === 'function' ? balance(tx) : balance) as Argument;

    coinResult = tx.add(
      TransactionCommands.Intent({
        name: COIN_WITH_BALANCE_RESOLVER,
        inputs: { balance: resolvedArg },
        data: { type: resolvedType },
      }),
    );
    return coinResult;
  };
};
