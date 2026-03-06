import type { ClientWithCoreApi } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { COIN_WITH_BALANCE_RESOLVER } from '@/utils/resolvers.js';
import { coinWithBalance, destroyZeroCoin, getCoinsOfType, getZeroCoin } from '@/utils/transaction.js';

function getIntentCommand(tx: Transaction) {
  const data = tx.getData() as { commands: Array<{ $kind?: string; $Intent?: { name: string; data: unknown } }> };
  return data.commands.find((c) => c.$Intent?.name === COIN_WITH_BALANCE_RESOLVER);
}

function getMoveCallTarget(cmd: {
  MoveCall?: { package?: string; module?: string; function?: string };
}): string | undefined {
  const mc = cmd.MoveCall;
  if (!mc) return undefined;
  return `${mc.package}::${mc.module}::${mc.function}`;
}

describe('unit/utils/transaction', () => {
  describe('getZeroCoin', () => {
    it('adds 0x2::coin::zero moveCall with given coinType', () => {
      const tx = new Transaction();
      const coinType = '0x2::sui::SUI';
      const result = getZeroCoin(tx, { coinType });
      expect(result).toBeDefined();
      const data = tx.getData() as {
        commands: Array<{ MoveCall?: { package: string; module: string; function: string; typeArguments: string[] } }>;
      };
      expect(data.commands.length).toBe(1);
      expect(getMoveCallTarget(data.commands[0]!)).toMatch(/::coin::zero$/);
      expect(data.commands[0]!.MoveCall?.module).toBe('coin');
      expect(data.commands[0]!.MoveCall?.function).toBe('zero');
    });
  });

  describe('destroyZeroCoin', () => {
    it('adds 0x2::coin::destroy_zero moveCall', () => {
      const tx = new Transaction();
      const zeroCoin = getZeroCoin(tx, { coinType: '0x2::sui::SUI' });
      destroyZeroCoin(tx, { coinType: '0x2::sui::SUI', coin: zeroCoin });
      const data = tx.getData() as { commands: unknown[] };
      expect(data.commands.length).toBe(2);
      const target = getMoveCallTarget(data.commands[1] as Parameters<typeof getMoveCallTarget>[0]);
      expect(target).toMatch(/::coin::destroy_zero$/);
    });
  });

  describe('coinWithBalance', () => {
    it('adds Intent with type "gas" when type is "gas"', () => {
      const tx = new Transaction();
      const fn = coinWithBalance({ type: 'gas', balance: 1n });
      const result = fn(tx);
      expect(result).toBeDefined();
      const cmd = getIntentCommand(tx);
      expect(cmd?.$Intent?.data).toMatchObject({ type: 'gas', balance: 1n });
    });

    it('adds Intent with coin type when useGasCoin is false', () => {
      const tx = new Transaction();
      const fn = coinWithBalance({ balance: 1n, useGasCoin: false });
      fn(tx);
      const cmd = getIntentCommand(tx);
      const data = cmd?.$Intent?.data as { type: string; balance: bigint };
      expect(data.type).toBe(SUI_TYPE_ARG);
      expect(data.balance).toBe(1n);
    });

    it('converts number balance to BigInt', () => {
      const tx = new Transaction();
      coinWithBalance({ balance: 100 })(tx);
      const cmd = getIntentCommand(tx);
      expect((cmd?.$Intent?.data as { balance: bigint }).balance).toBe(100n);
    });

    it('returns same result on second call (memoization)', () => {
      const tx = new Transaction();
      const fn = coinWithBalance({ balance: 1n });
      const r1 = fn(tx);
      const r2 = fn(tx);
      expect(r1).toBe(r2);
      const data = tx.getData() as { commands: unknown[] };
      expect(
        data.commands.filter((c: { $Intent?: { name: string } }) => c.$Intent?.name === COIN_WITH_BALANCE_RESOLVER)
          .length,
      ).toBe(1);
    });

    it('adds Intent with "gas" when default SUI and useGasCoin true', () => {
      const tx = new Transaction();
      coinWithBalance({ balance: 1n })(tx);
      const cmd = getIntentCommand(tx);
      expect((cmd?.$Intent?.data as { type: string }).type).toBe('gas');
    });
  });

  describe('getCoinsOfType', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('returns all coins when pagination has multiple pages', async () => {
      const page1 = {
        objects: [
          { objectId: '0xcoin1', digest: 'd1', version: '1', balance: 100n },
        ],
        hasNextPage: true,
        cursor: 'cursor1',
      };
      const page2 = {
        objects: [
          { objectId: '0xcoin2', digest: 'd2', version: '2', balance: 200n },
        ],
        hasNextPage: false,
        cursor: null,
      };
      const listCoins = vi
        .fn()
        .mockResolvedValueOnce(page1)
        .mockResolvedValueOnce(page2);
      const client = {
        core: { listCoins },
      } as unknown as ClientWithCoreApi;

      const coins = await getCoinsOfType({
        coinType: '0x2::sui::SUI',
        client,
        owner: '0xowner',
        usedIds: new Set(),
      });

      expect(listCoins).toHaveBeenCalledTimes(2);
      expect(listCoins).toHaveBeenNthCalledWith(1, { owner: '0xowner', coinType: '0x2::sui::SUI', cursor: null });
      expect(listCoins).toHaveBeenNthCalledWith(2, {
        owner: '0xowner',
        coinType: '0x2::sui::SUI',
        cursor: 'cursor1',
      });
      expect(coins).toHaveLength(2);
      expect(coins[0]!.objectId).toBe('0xcoin1');
      expect(coins[1]!.objectId).toBe('0xcoin2');
    });

    it('skips coins that are in usedIds', async () => {
      const listCoins = vi.fn().mockResolvedValue({
        objects: [
          { objectId: '0xused', digest: 'd1', version: '1', balance: 100n },
          { objectId: '0xfree', digest: 'd2', version: '2', balance: 200n },
        ],
        hasNextPage: false,
        cursor: null,
      });
      const client = { core: { listCoins } } as unknown as ClientWithCoreApi;
      const usedIds = new Set(['0xused']);

      const coins = await getCoinsOfType({
        coinType: '0x2::sui::SUI',
        client,
        owner: '0xowner',
        usedIds,
      });

      expect(coins).toHaveLength(1);
      expect(coins[0]!.objectId).toBe('0xfree');
    });
  });
});
