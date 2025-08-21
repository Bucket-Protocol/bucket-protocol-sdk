import { SuiClient } from '@mysten/sui/client';
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions';
import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';

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
 * @description split the needed coins
 */
export const splitInputCoins = async (
  tx: Transaction,
  {
    coinType,
    amounts,
  }: {
    coinType: string;
    amounts: (number | TransactionArgument)[];
  },
  client: SuiClient,
  sender: string,
): Promise<TransactionResult> => {
  if (normalizeStructTag(coinType) === normalizeStructTag(SUI_TYPE_ARG)) {
    return tx.splitCoins(tx.gas, amounts);
  } else {
    const { data: userCoins } = await client.getCoins({
      owner: sender,
      coinType,
    });
    console.log({ userCoins });
    if (userCoins.length === 0) {
      return amounts.map((amount) => {
        if (typeof amount === 'number' && amount > 0) {
          throw new Error('Not enough balance');
        }
        const [zeroCoin] = getZeroCoin(tx, { coinType });
        return zeroCoin;
      }) as TransactionResult;
    }
    const [mainCoin, ...otherCoins] = userCoins.map((coin) =>
      tx.objectRef({
        objectId: coin.coinObjectId,
        version: coin.version,
        digest: coin.digest,
      }),
    );
    if (!mainCoin) {
      throw new Error('Not enough balance');
    }

    const ifMerge = otherCoins.length > 0;

    if (ifMerge) {
      tx.mergeCoins(mainCoin, otherCoins);
    }

    const out = tx.splitCoins(
      mainCoin,
      amounts.map((amount) => (typeof amount === 'string' ? tx.pure.u64(amount) : amount)),
    );

    if (ifMerge) {
      tx.transferObjects([mainCoin], sender);
    }

    return out;
  }
};
