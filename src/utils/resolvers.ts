import { bcs } from '@mysten/sui/bcs';
import type { ClientWithCoreApi, SuiClientTypes } from '@mysten/sui/client';
import {
  Inputs,
  TransactionCommands,
  TransactionDataBuilder,
  type Argument,
  type BuildTransactionOptions,
  type Command,
} from '@mysten/sui/transactions';
import { normalizeStructTag, SUI_TYPE_ARG } from '@mysten/sui/utils';

import { getCoinsOfType } from '@/utils/transaction.js';

export const COIN_WITH_BALANCE_RESOLVER = 'AugmentedCoinWithBalance';
const SUI_TYPE = normalizeStructTag(SUI_TYPE_ARG);

type IntentCommand = Extract<Command, { $kind: '$Intent' }>;
type IntentData = { type: string; balance?: bigint };
type IntentInputs = { balance?: Argument };

/**
 * Mirror `TransactionDataBuilder.replaceCommand`'s `mapArguments` adjustment
 * for arguments going INTO the new commands (which `mapArguments` skips).
 * References at `replacedIndex` → `resultArg`; references > `replacedIndex`
 * are shifted by `sizeDiff`.
 */
const adjustArgForReplace = (
  arg: Argument,
  replacedIndex: number,
  sizeDiff: number,
  resultArg: Argument,
): Argument => {
  if (arg.$kind === 'Result') {
    if (arg.Result === replacedIndex) return resultArg;
    if (arg.Result > replacedIndex) return { $kind: 'Result', Result: arg.Result + sizeDiff };
    return arg;
  }
  if (arg.$kind === 'NestedResult') {
    if (arg.NestedResult[0] === replacedIndex) return resultArg;
    if (arg.NestedResult[0] > replacedIndex) {
      return {
        $kind: 'NestedResult',
        NestedResult: [arg.NestedResult[0] + sizeDiff, arg.NestedResult[1]],
      };
    }
    return arg;
  }
  return arg;
};

const isOurIntent = (cmd: Command): cmd is IntentCommand =>
  cmd.$kind === '$Intent' && cmd.$Intent.name === COIN_WITH_BALANCE_RESOLVER;

const readBalance = (cmd: IntentCommand): bigint | Argument => {
  const data = cmd.$Intent.data as IntentData;
  const inputs = cmd.$Intent.inputs as IntentInputs;
  if (inputs.balance !== undefined) return inputs.balance;
  if (data.balance !== undefined) return data.balance;
  throw new Error('CoinWithBalance intent is missing a balance');
};

export const resolveCoinBalance = async (
  transactionData: TransactionDataBuilder,
  buildOptions: BuildTransactionOptions,
  next: () => Promise<void>,
) => {
  if (!transactionData.sender) {
    throw new Error('Sender must be set to resolve CoinWithBalance');
  }
  const sender = transactionData.sender;

  // Pass 1: short-circuit zero-bigint intents in place; collect non-gas types.
  const coinTypes = new Set<string>();
  for (const [i, command] of transactionData.commands.entries()) {
    if (!isOurIntent(command)) continue;
    const data = command.$Intent.data as IntentData;
    const balance = readBalance(command);

    if (typeof balance === 'bigint' && balance === 0n) {
      const coinType = data.type === 'gas' ? SUI_TYPE : data.type;
      transactionData.replaceCommand(
        i,
        TransactionCommands.MoveCall({
          target: '0x2::coin::zero',
          typeArguments: [coinType],
        }),
      );
      continue;
    }
    if (data.type !== 'gas') coinTypes.add(data.type);
  }

  // Pass 2: fetch owned coins and address-balance per non-gas type.
  const usedIds = new Set<string>();
  for (const input of transactionData.inputs) {
    if (input.Object?.ImmOrOwnedObject) usedIds.add(input.Object.ImmOrOwnedObject.objectId);
    if (input.UnresolvedObject?.objectId) usedIds.add(input.UnresolvedObject.objectId);
  }
  const { client } = buildOptions;
  if (!client) {
    throw new Error(
      'No sui client passed to Transaction#build, but transaction data was not sufficient to build offline.',
    );
  }
  const coreClient = client as ClientWithCoreApi;
  const coinsByType = new Map<string, SuiClientTypes.Coin[]>();
  const abByType = new Map<string, bigint>();
  await Promise.all(
    [...coinTypes].map(async (coinType) => {
      const [coins, response] = await Promise.all([
        getCoinsOfType({ coinType, client: coreClient, owner: sender, usedIds }),
        coreClient.core.getBalance({ owner: sender, coinType }),
      ]);
      coinsByType.set(coinType, coins);
      abByType.set(coinType, BigInt(response.balance.addressBalance));
    }),
  );

  // Pass 3: walk and resolve. For each non-gas type, use owned coins and an
  // AB redemption as parallel sources (Sui validates `FundsWithdrawal` against
  // the *starting* AB, so we can't deposit-then-withdraw in the same tx),
  // merge them into one base coin, run a single combined `SplitCoins`
  // (amounts may be bigint or TxArg), and push the remainder back into AB via
  // `coin::send_funds`. `gas` type uses `tx.gas` as the source and skips the
  // AB / remainder round-trip.
  type TypeState = { results: Argument[]; nextIntent: number };
  const typeState = new Map<string, TypeState>();

  let index = 0;
  while (index < transactionData.commands.length) {
    const command = transactionData.commands[index];
    if (!isOurIntent(command)) {
      index++;
      continue;
    }
    const data = command.$Intent.data as IntentData;
    const type = data.type;

    const existing = typeState.get(type);
    if (existing) {
      const resultArg = existing.results[existing.nextIntent++];
      transactionData.replaceCommand(
        index,
        [],
        resultArg as { NestedResult: [number, number] },
      );
      continue;
    }

    // First intent of this type — collect balances for every intent of the
    // same type via forward scan. Reading from CURRENT command state so any
    // prior auto-remaps (other types) are picked up.
    const balances: (bigint | Argument)[] = [];
    for (let j = index; j < transactionData.commands.length; j++) {
      const c = transactionData.commands[j];
      if (!isOurIntent(c)) continue;
      const d = c.$Intent.data as IntentData;
      if (d.type !== type) continue;
      balances.push(readBalance(c));
    }

    const commands: Command[] = [];
    let baseCoin: Argument;
    const isGas = type === 'gas';

    if (isGas) {
      baseCoin = { $kind: 'GasCoin', GasCoin: true };
    } else {
      const owned = coinsByType.get(type)!;
      const ab = abByType.get(type)!;
      if (owned.length === 0 && ab === 0n) {
        throw new Error(`No balance of type ${type} for ${sender}`);
      }

      // Build parallel sources: owned coin object refs, plus a one-shot
      // `coin::redeem_funds` pulling the entire starting AB (cap is enforced
      // by Sui against pre-tx state, so we redeem at most `ab`).
      const sources: Argument[] = owned.map((coin) =>
        transactionData.addInput(
          'object',
          Inputs.ObjectRef({
            objectId: coin.objectId,
            digest: coin.digest,
            version: coin.version,
          }),
        ),
      );
      if (ab > 0n) {
        commands.push(
          TransactionCommands.MoveCall({
            target: '0x2::coin::redeem_funds',
            typeArguments: [type],
            arguments: [
              transactionData.addInput(
                'withdrawal',
                Inputs.FundsWithdrawal({
                  reservation: { $kind: 'MaxAmountU64', MaxAmountU64: String(ab) },
                  typeArg: { $kind: 'Balance', Balance: type },
                  withdrawFrom: { $kind: 'Sender', Sender: true },
                }),
              ),
            ],
          }),
        );
        sources.push({ $kind: 'Result', Result: index + commands.length - 1 });
      }

      baseCoin = sources[0];
      const rest = sources.slice(1);
      for (let i = 0; i < rest.length; i += 500) {
        commands.push(TransactionCommands.MergeCoins(baseCoin, rest.slice(i, i + 500)));
      }
    }

    // 3. Combined SplitCoins. Total command count must be known up-front so
    // TxArg balance args can be pre-shifted for the splice.
    const splitCmdLocalIdx = commands.length;
    const splitCmdIndex = index + splitCmdLocalIdx;
    const totalCommands = commands.length + 1 + (isGas ? 0 : 1); // + split [+ remainder]
    const sizeDiff = totalCommands - 1;
    const resultArg: Argument = {
      $kind: 'NestedResult',
      NestedResult: [splitCmdIndex, 0],
    };

    const splitAmounts = balances.map((b) => {
      if (typeof b === 'bigint') {
        return transactionData.addInput('pure', Inputs.Pure(bcs.u64().serialize(b)));
      }
      return adjustArgForReplace(b, index, sizeDiff, resultArg);
    });
    commands.push(TransactionCommands.SplitCoins(baseCoin, splitAmounts));

    // 4. Push leftover back into AB (non-gas only; gas coin retains remainder).
    if (!isGas) {
      commands.push(
        TransactionCommands.MoveCall({
          target: '0x2::coin::send_funds',
          typeArguments: [type],
          arguments: [
            baseCoin,
            transactionData.addInput('pure', Inputs.Pure(bcs.Address.serialize(sender))),
          ],
        }),
      );
    }

    const results: Argument[] = balances.map((_, i) => ({
      $kind: 'NestedResult',
      NestedResult: [splitCmdIndex, i],
    }));
    typeState.set(type, { results, nextIntent: 1 });

    transactionData.replaceCommand(
      index,
      commands,
      resultArg as { NestedResult: [number, number] },
    );
    index += commands.length;
  }

  return next();
};
