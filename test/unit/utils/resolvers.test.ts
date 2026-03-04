import { Inputs, TransactionCommands } from '@mysten/sui/transactions';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { COIN_WITH_BALANCE_RESOLVER, resolveCoinBalance } from '@/utils/resolvers.js';
import * as transactionUtils from '@/utils/transaction.js';

const mockCoin = {
  objectId: '0xcoin1',
  digest: 'digest1',
  version: '1',
  balance: 1000n,
};

const validSender = '0x0000000000000000000000000000000000000000000000000000000000000001';

function createMockTransactionData(
  overrides: {
    sender?: string;
    commands?: unknown[];
    inputs?: unknown[];
  } = {},
) {
  const commands = overrides.commands ?? [
    {
      $kind: '$Intent',
      $Intent: {
        name: COIN_WITH_BALANCE_RESOLVER,
        inputs: {},
        data: { type: '0x2::sui::SUI', balance: 1n },
      },
    },
  ];
  const inputs = overrides.inputs ?? [];
  const addInputResults: unknown[] = [];
  return {
    sender: overrides.sender ?? validSender,
    commands,
    inputs,
    replaceCommand: vi.fn((index: number, cmd: unknown) => {
      if (Array.isArray(cmd)) {
        commands.splice(index, 1, ...cmd);
      } else {
        commands[index] = cmd;
      }
    }),
    addInput: vi.fn((_kind: string, value: unknown) => {
      const ref = { $kind: 'Input', Input: addInputResults.length };
      addInputResults.push(value);
      return ref;
    }),
    mapArguments: vi.fn((fn: (arg: unknown) => unknown) => fn),
  };
}

describe('unit/utils/resolvers', () => {
  beforeEach(() => {
    vi.spyOn(transactionUtils, 'getCoinsOfType').mockResolvedValue([mockCoin] as Awaited<
      ReturnType<typeof transactionUtils.getCoinsOfType>
    >);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when sender is not set', async () => {
    const txData = createMockTransactionData();
    (txData as { sender?: string }).sender = undefined;
    const mockNext = vi.fn().mockResolvedValue(undefined);
    await expect(resolveCoinBalance(txData as never, { client: {} }, mockNext)).rejects.toThrow(
      'Sender must be set to resolve CoinWithBalance',
    );
  });

  it('throws when client is not passed to build', async () => {
    const txData = createMockTransactionData();
    const mockNext = vi.fn().mockResolvedValue(undefined);
    await expect(resolveCoinBalance(txData as never, {} as never, mockNext)).rejects.toThrow(
      'No sui client passed to Transaction#build',
    );
  });

  it('replaces balance 0n with zero coin MoveCall', async () => {
    const coinType = '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';
    const txData = createMockTransactionData({
      commands: [
        {
          $kind: '$Intent',
          $Intent: {
            name: COIN_WITH_BALANCE_RESOLVER,
            inputs: {},
            data: { type: coinType, balance: 0n },
          },
        },
      ],
    });
    const mockNext = vi.fn().mockResolvedValue(undefined);
    await resolveCoinBalance(txData as never, { client: {} }, mockNext);

    expect(txData.replaceCommand).toHaveBeenCalled();
    const replaceArg = (txData.replaceCommand as ReturnType<typeof vi.fn>).mock.calls[0]![1];
    const moveCall = replaceArg?.MoveCall ?? replaceArg;
    expect(moveCall?.function ?? moveCall?.target ?? JSON.stringify(replaceArg)).toMatch(/zero/);
    expect(mockNext).toHaveBeenCalled();
  });

  it('collects UnresolvedObject from inputs and passes to getCoinsOfType', async () => {
    const txData = createMockTransactionData({
      inputs: [{ UnresolvedObject: { objectId: '0xused', initialSharedVersion: 1 } }],
    });
    const mockNext = vi.fn().mockResolvedValue(undefined);
    await resolveCoinBalance(txData as never, { client: {} }, mockNext);

    expect(transactionUtils.getCoinsOfType).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: validSender,
        usedIds: expect.any(Set),
      }),
    );
    const usedIds = (transactionUtils.getCoinsOfType as ReturnType<typeof vi.fn>).mock.calls[0]![0].usedIds;
    expect(usedIds.has('0xused')).toBe(true);
  });
});
