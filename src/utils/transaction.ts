import { CoinStruct, SuiClient } from '@mysten/sui/client';
import { Commands, Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions';
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
  client: SuiClient;
  owner: string;
  usedIds: Set<string>;
}): Promise<CoinStruct[]> => {
  const coins: CoinStruct[] = [];

  const loadMoreCoins = async (cursor: string | null = null): Promise<CoinStruct[]> => {
    const { data, hasNextPage, nextCursor } = await client.getCoins({ owner, coinType, cursor });

    for (const coin of data) {
      if (usedIds.has(coin.coinObjectId)) {
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
 * @description
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
  let coinResult: TransactionResult | null = null;

  return (tx: Transaction) => {
    if (coinResult) {
      return coinResult;
    }
    tx.addIntentResolver(COIN_WITH_BALANCE_RESOLVER, resolveCoinBalance);
    const coinType = type === 'gas' ? type : normalizeStructTag(type);

    coinResult = tx.add(
      Commands.Intent({
        name: COIN_WITH_BALANCE_RESOLVER,
        inputs: {},
        data: {
          type: coinType === normalizeStructTag(SUI_TYPE_ARG) && useGasCoin ? 'gas' : coinType,
          balance: typeof balance === 'number' ? BigInt(balance) : balance,
        },
      }),
    );
    return coinResult;
  };
};
