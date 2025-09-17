import { bcs } from '@mysten/sui/bcs';
import { CoinStruct, SuiClient } from '@mysten/sui/client';
import {
  Argument,
  BuildTransactionOptions,
  Commands,
  Inputs,
  TransactionDataBuilder,
  TransactionResult,
} from '@mysten/sui/transactions';

import { TransactionNestedResult } from '@/types/index.js';
import { getCoinsOfType } from '@/utils/transaction.js';

export const COIN_WITH_BALANCE_RESOLVER = 'AugmentedCoinWithBalance';

export const resolveCoinBalance = async (
  transactionData: TransactionDataBuilder,
  buildOptions: BuildTransactionOptions,
  next: () => Promise<void>,
) => {
  const coinTypes = new Set<string>();

  if (!transactionData.sender) {
    throw new Error('Sender must be set to resolve CoinWithBalance');
  }
  for (const command of transactionData.commands) {
    if (command.$kind === '$Intent' && command.$Intent.name === COIN_WITH_BALANCE_RESOLVER) {
      const { type, balance } = command.$Intent.data as {
        type: string;
        balance: bigint | TransactionResult | TransactionNestedResult;
      };
      if (type !== 'gas' && (typeof balance !== 'bigint' || balance > 0n)) {
        coinTypes.add(type);
      }
    }
  }
  const usedIds = new Set<string>();

  for (const input of transactionData.inputs) {
    if (input.Object?.ImmOrOwnedObject) {
      usedIds.add(input.Object.ImmOrOwnedObject.objectId);
    }
    if (input.UnresolvedObject?.objectId) {
      usedIds.add(input.UnresolvedObject.objectId);
    }
  }
  const coinsByType = new Map<string, CoinStruct[]>();
  const { client } = buildOptions;
  if (!client) {
    throw new Error(
      `No sui client passed to Transaction#build, but transaction data was not sufficient to build offline.`,
    );
  }
  await Promise.all(
    [...coinTypes].map(async (coinType) => {
      coinsByType.set(
        coinType,
        await getCoinsOfType({
          coinType,
          client: client as SuiClient,
          owner: transactionData.sender!,
          usedIds,
        }),
      );
    }),
  );
  const mergedCoins = new Map<string, Argument>();

  mergedCoins.set('gas', { $kind: 'GasCoin', GasCoin: true });

  for (const [index, transaction] of transactionData.commands.entries()) {
    if (transaction.$kind !== '$Intent' || transaction.$Intent.name !== COIN_WITH_BALANCE_RESOLVER) {
      continue;
    }
    const { type, balance } = transaction.$Intent.data as {
      type: string;
      balance: bigint;
    };
    if (balance === 0n && type !== 'gas') {
      transactionData.replaceCommand(index, Commands.MoveCall({ target: '0x2::coin::zero', typeArguments: [type] }));
      continue;
    }
    const commands = [];

    if (!mergedCoins.has(type)) {
      const [first, ...rest] = coinsByType.get(type)!.map((coin) =>
        transactionData.addInput(
          'object',
          Inputs.ObjectRef({
            objectId: coin.coinObjectId,
            digest: coin.digest,
            version: coin.version,
          }),
        ),
      );
      if (rest.length > 0) {
        commands.push(Commands.MergeCoins(first, rest));
      }
      mergedCoins.set(type, first);
    }
    commands.push(
      Commands.SplitCoins(mergedCoins.get(type)!, [
        typeof balance === 'bigint'
          ? transactionData.addInput('pure', Inputs.Pure(bcs.u64().serialize(balance)))
          : balance,
      ]),
    );
    transactionData.replaceCommand(index, commands);

    transactionData.mapArguments((arg) => {
      if (arg.$kind === 'Result' && arg.Result === index) {
        return {
          $kind: 'NestedResult',
          NestedResult: [index + commands.length - 1, 0],
        };
      }
      return arg;
    });
  }
  return next();
};
