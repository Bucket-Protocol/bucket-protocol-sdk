import { bcs } from '@mysten/sui/bcs';
import type { ClientWithCoreApi, SuiClientTypes } from '@mysten/sui/client';
import {
  type BuildTransactionOptions,
  Inputs,
  TransactionCommands,
  TransactionDataBuilder,
  type TransactionResult,
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
  const coinsByType = new Map<string, SuiClientTypes.Coin[]>();
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
          client: client as ClientWithCoreApi,
          owner: transactionData.sender!,
          usedIds,
        }),
      );
    }),
  );
  const mergedCoins = new Map<string, ReturnType<TransactionDataBuilder['addInput']>>();

  mergedCoins.set('gas', { $kind: 'GasCoin', GasCoin: true } as never);

  for (const [index, transaction] of transactionData.commands.entries()) {
    if (transaction.$kind !== '$Intent' || transaction.$Intent.name !== COIN_WITH_BALANCE_RESOLVER) {
      continue;
    }
    const { type, balance } = transaction.$Intent.data as {
      type: string;
      balance: bigint;
    };
    if (balance === 0n && type !== 'gas') {
      transactionData.replaceCommand(index, TransactionCommands.MoveCall({ target: '0x2::coin::zero', typeArguments: [type] }));
      continue;
    }
    const commands = [];

    if (!mergedCoins.has(type)) {
      const [first, ...rest] = coinsByType.get(type)!.map((coin) =>
        transactionData.addInput(
          'object',
          Inputs.ObjectRef({
            objectId: coin.objectId,
            digest: coin.digest,
            version: coin.version,
          }),
        ),
      );
      if (rest.length > 0) {
        commands.push(TransactionCommands.MergeCoins(first, rest));
      }
      mergedCoins.set(type, first);
    }
    commands.push(
      TransactionCommands.SplitCoins(mergedCoins.get(type)!, [
        typeof balance === 'bigint'
          ? transactionData.addInput('pure', Inputs.Pure(bcs.u64().serialize(balance)))
          : balance,
      ]),
    );
    transactionData.replaceCommand(index, commands);

    transactionData.mapArguments((arg: Parameters<Parameters<typeof transactionData.mapArguments>[0]>[0]) => {
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
