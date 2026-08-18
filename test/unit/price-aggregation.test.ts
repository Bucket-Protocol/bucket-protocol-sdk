/**
 * Unit tests for the PTB shape `aggregateBasicPrices` builds.
 *
 * Pyth's Hermes fetch and price-update calls are mocked, so these assert command
 * order and coverage without touching the network. The invariant under test is the
 * LST one: `<lst>_rule::feed` takes the aggregated `PriceResult<SUI>`, so
 * `aggregate<SUI>` has to be an earlier command in the same PTB — including when
 * the caller asks for an LST on its own and never mentions SUI.
 */
import type { SuiGrpcClient } from '@mysten/sui/grpc';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeStructTag } from '@mysten/sui/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BucketClient } from '../../src/client.js';
import type { AggregatorObjectInfo, ConfigType, SharedObjectRef } from '../../src/types/index.js';
import * as pyth from '../../src/utils/pyth.js';

const SUI = normalizeStructTag('0x2::sui::SUI');
const HASUI = normalizeStructTag('0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI');
const VSUI = normalizeStructTag('0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT');
const USDC = normalizeStructTag('0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC');
/**
 * An sCoin over an LST. No such aggregator is listed on mainnet today — every
 * derivative there sits on a plain Pyth coin type — so this fixture stands in for
 * the one listing that would stack the two rules: the sCoin rule needs the
 * aggregated haSUI price, which in turn needs the aggregated SUI price.
 */
const SCALLOP_HASUI = normalizeStructTag(`${'0x' + 'a'.repeat(64)}::scallop_hasui::SCALLOP_HASUI`);

const address = (n: number) => `0x${n.toString(16).padStart(64, '0')}`;
const sharedRef = (n: number, mutable = false): SharedObjectRef => ({
  objectId: address(n),
  initialSharedVersion: '1',
  mutable,
});
const pythAggregator = (n: number): AggregatorObjectInfo => ({
  Pyth: { priceAggregator: sharedRef(n), pythPriceId: address(n) },
});

const asSuiClient = (m: unknown) => m as unknown as SuiGrpcClient;

function priceConfig(): ConfigType {
  const emptyRef = sharedRef(0);
  return {
    PRICE_SERVICE_ENDPOINT: 'https://hermes.test',
    PYTH_STATE_ID: address(0x11),
    WORMHOLE_STATE_ID: address(0x12),
    PYTH_RULE_PACKAGE_ID: address(0x13),
    PYTH_RULE_CONFIG_OBJ: sharedRef(0x14),
    ORIGINAL_FRAMEWORK_PACKAGE_ID: address(0x20),
    ORIGINAL_USDB_PACKAGE_ID: address(0x21),
    ORIGINAL_ORACLE_PACKAGE_ID: address(0x22),
    ORIGINAL_CDP_PACKAGE_ID: address(0x23),
    ORIGINAL_PSM_PACKAGE_ID: address(0x24),
    ORIGINAL_FLASH_PACKAGE_ID: address(0x25),
    ORIGINAL_SAVING_PACKAGE_ID: address(0x26),
    ORIGINAL_SAVING_INCENTIVE_PACKAGE_ID: address(0x27),
    ORIGINAL_BORROW_INCENTIVE_PACKAGE_ID: address(0x28),
    ORIGINAL_BLACKLIST_PACKAGE_ID: address(0x29),
    FRAMEWORK_PACKAGE_ID: address(0x30),
    USDB_PACKAGE_ID: address(0x31),
    ORACLE_PACKAGE_ID: address(0x32),
    CDP_PACKAGE_ID: address(0x33),
    PSM_PACKAGE_ID: address(0x34),
    FLASH_PACKAGE_ID: address(0x35),
    SAVING_PACKAGE_ID: address(0x36),
    SAVING_INCENTIVE_PACKAGE_ID: address(0x37),
    BORROW_INCENTIVE_PACKAGE_ID: address(0x38),
    BLACKLIST_PACKAGE_ID: address(0x39),
    TREASURY_OBJ: sharedRef(0x40, true),
    VAULT_REWARDER_REGISTRY: emptyRef,
    SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: emptyRef,
    FLASH_GLOBAL_CONFIG_OBJ: sharedRef(0x41, true),
    BLACKLIST_OBJ: emptyRef,
    AGGREGATOR_OBJS: {
      [SUI]: pythAggregator(0x50),
      [HASUI]: pythAggregator(0x51),
      [VSUI]: pythAggregator(0x52),
      [USDC]: pythAggregator(0x53),
      [SCALLOP_HASUI]: {
        DerivativeInfo: {
          priceAggregator: sharedRef(0x54),
          underlying_coin_type: HASUI,
          derivative_kind: 'sCoin',
        },
      },
    },
    VAULT_OBJS: {},
    SAVING_POOL_OBJS: {},
    PSM_POOL_OBJS: {},
    PRICE_OBJS: {
      scoin: {
        SCOIN: {
          package: address(0x60),
          scoin_rule_config: sharedRef(0x61),
          scallop_version: sharedRef(0x62),
          scallop_market: sharedRef(0x63, true),
        },
      },
    },
  };
}

/** `module::function` per Move call, in PTB order, with its type arguments. */
function moveCalls(tx: Transaction): { target: string; typeArguments: readonly string[] }[] {
  return tx.getData().commands.flatMap((command) =>
    command.$kind === 'MoveCall'
      ? [
          {
            target: `${command.MoveCall.module}::${command.MoveCall.function}`,
            typeArguments: command.MoveCall.typeArguments,
          },
        ]
      : [],
  );
}

/** Index of the `aggregate<coinType>` call, or -1. */
function aggregateIndex(tx: Transaction, coinType: string): number {
  return moveCalls(tx).findIndex(
    (call) => call.target === 'aggregator::aggregate' && normalizeStructTag(call.typeArguments[0] ?? '') === coinType,
  );
}

/**
 * Object id of the `PriceInfoObject` handed to `pyth_rule::feed<coinType>`.
 *
 * The mocked `buildPythPriceUpdateCalls` returns each feed id as its own object
 * id, so this traces a coin type back to the Pyth feed it was actually priced
 * from — the alignment between the feed-id list and the collector loop.
 */
function pythFeedObjectId(tx: Transaction, coinType: string): string | undefined {
  const data = tx.getData();
  const call = data.commands.find(
    (command) =>
      command.$kind === 'MoveCall' &&
      command.MoveCall.module === 'pyth_rule' &&
      command.MoveCall.function === 'feed' &&
      normalizeStructTag(command.MoveCall.typeArguments[0] ?? '') === coinType,
  );
  if (call?.$kind !== 'MoveCall') return undefined;
  const priceInfoArg = call.MoveCall.arguments.at(-1);
  if (priceInfoArg?.$kind !== 'Input') return undefined;
  const input = data.inputs[priceInfoArg.Input];
  return input?.$kind === 'UnresolvedObject' ? input.UnresolvedObject.objectId : undefined;
}

function makeClient() {
  return new BucketClient({
    suiClient: asSuiClient({}),
    network: 'mainnet',
    config: priceConfig(),
  });
}

beforeEach(() => {
  vi.spyOn(pyth, 'fetchPriceFeedsUpdateDataFromHermes').mockResolvedValue([new Uint8Array([1])]);
  // Return each feed id as its own price info object id, so a coin type can be
  // traced back to the feed it was priced from.
  vi.spyOn(pyth, 'buildPythPriceUpdateCalls').mockImplementation(async (_tx, _client, _config, _updates, feedIds) => [
    ...feedIds,
  ]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('unit/aggregateBasicPrices', () => {
  it('pulls SUI into the PTB for an LST-only request, and does not return it', async () => {
    const tx = new Transaction();
    const results = await makeClient().aggregateBasicPrices(tx, { coinTypes: [HASUI] });

    // The caller asked for one price and gets one back — SUI is an implementation
    // detail of the haSUI rule, not a result.
    expect(results).toHaveLength(1);

    const calls = moveCalls(tx);
    expect(calls.filter((call) => call.target === 'hasui_rule::feed')).toHaveLength(1);
    expect(aggregateIndex(tx, SUI)).toBeGreaterThanOrEqual(0);
    // The rule reads the aggregated SUI price, so that command has to come first.
    expect(aggregateIndex(tx, SUI)).toBeLessThan(calls.findIndex((call) => call.target === 'hasui_rule::feed'));
    expect(aggregateIndex(tx, SUI)).toBeLessThan(aggregateIndex(tx, HASUI));
  });

  it('does not aggregate SUI twice when the caller asks for it alongside an LST', async () => {
    const tx = new Transaction();
    const results = await makeClient().aggregateBasicPrices(tx, { coinTypes: [SUI, HASUI] });

    expect(results).toHaveLength(2);
    const calls = moveCalls(tx);
    expect(
      calls.filter(
        (call) => call.target === 'collector::new' && normalizeStructTag(call.typeArguments[0] ?? '') === SUI,
      ),
    ).toHaveLength(1);
    expect(aggregateIndex(tx, SUI)).toBeLessThan(aggregateIndex(tx, HASUI));
  });

  it('shares one SUI price across several LSTs', async () => {
    const tx = new Transaction();
    const results = await makeClient().aggregateBasicPrices(tx, { coinTypes: [HASUI, VSUI] });

    expect(results).toHaveLength(2);
    const calls = moveCalls(tx);
    expect(
      calls.filter((call) => call.target === 'aggregator::aggregate' && call.typeArguments[0] === SUI),
    ).toHaveLength(1);
    expect(aggregateIndex(tx, SUI)).toBeLessThan(calls.findIndex((call) => call.target === 'hasui_rule::feed'));
    expect(aggregateIndex(tx, SUI)).toBeLessThan(calls.findIndex((call) => call.target === 'vsui_rule::feed'));
  });

  it('returns results in the caller order, not the build order', async () => {
    const tx = new Transaction();
    // haSUI is built last (it needs SUI), so build order and caller order differ.
    const [hasuiResult, usdcResult] = await makeClient().aggregateBasicPrices(tx, { coinTypes: [HASUI, USDC] });

    expect(hasuiResult).toBeDefined();
    expect(usdcResult).toBeDefined();
    expect(hasuiResult?.$kind).toBe('Result');
    expect(hasuiResult?.Result).toBe(aggregateIndex(tx, HASUI));
    expect(usdcResult?.Result).toBe(aggregateIndex(tx, USDC));
    expect(aggregateIndex(tx, USDC)).toBeLessThan(aggregateIndex(tx, HASUI));
  });

  it('prices each coin type from its own Pyth feed once SUI is pulled in', async () => {
    const tx = new Transaction();
    // The pulled-in SUI is appended past the caller's list, so a feed id read by
    // position would hand haSUI the wrong price info object.
    await makeClient().aggregateBasicPrices(tx, { coinTypes: [HASUI, USDC] });

    expect(pythFeedObjectId(tx, HASUI)).toBe(address(0x51));
    expect(pythFeedObjectId(tx, USDC)).toBe(address(0x53));
    expect(pythFeedObjectId(tx, SUI)).toBe(address(0x50));
  });

  it('leaves a non-LST request untouched', async () => {
    const tx = new Transaction();
    const results = await makeClient().aggregateBasicPrices(tx, { coinTypes: [USDC] });

    expect(results).toHaveLength(1);
    const calls = moveCalls(tx);
    expect(calls.some((call) => call.target.endsWith('_rule::feed') && call.target.startsWith('hasui'))).toBe(false);
    expect(aggregateIndex(tx, SUI)).toBe(-1);
  });

  it('still rejects a derivative, which has no Pyth feed of its own', async () => {
    const tx = new Transaction();
    await expect(makeClient().aggregateBasicPrices(tx, { coinTypes: [SCALLOP_HASUI] })).rejects.toThrow(
      'has no basic price',
    );
  });
});

/**
 * When Hermes is unreachable the PTB is still built, against Pyth's price objects
 * as they already stand. The freshness decision moves on-chain rather than
 * disappearing: `pyth_rule::feed` abstains on a stale reading, and `aggregate`
 * aborts `ERiskyPrice` if nothing left clears the weight threshold.
 */
describe('unit/aggregateBasicPrices Hermes fallback', () => {
  const hermesDown = () =>
    vi
      .spyOn(pyth, 'fetchPriceFeedsUpdateDataFromHermes')
      .mockRejectedValue(new Error('Hermes price fetch failed: 503 upstream'));

  /** Resolve ids the same way the mocked update path does, so the two are comparable. */
  const mockResolve = () =>
    vi
      .spyOn(pyth, 'resolvePythPriceInfoObjectIds')
      .mockImplementation(async (_client, _state, feedIds) => [...feedIds]);

  it('still feeds pyth_rule, because omitting it aborts EMissingPriceSource', async () => {
    hermesDown();
    mockResolve();
    const tx = new Transaction();

    const results = await new BucketClient({
      suiClient: asSuiClient({}),
      network: 'mainnet',
      config: priceConfig(),
      onPythStaleRead: () => {},
    }).aggregateBasicPrices(tx, { coinTypes: [USDC] });

    expect(results).toHaveLength(1);
    const calls = moveCalls(tx);
    // Abstaining counts as collected; omitting the call does not.
    expect(calls.filter((call) => call.target === 'pyth_rule::feed')).toHaveLength(1);
    expect(aggregateIndex(tx, USDC)).toBeGreaterThanOrEqual(0);
    // ...against the same price object the update path would have refreshed.
    expect(pythFeedObjectId(tx, USDC)).toBe(address(0x53));
  });

  it('skips the update builder entirely, so no VAA verify and no update fee', async () => {
    hermesDown();
    mockResolve();
    const tx = new Transaction();

    await new BucketClient({
      suiClient: asSuiClient({}),
      network: 'mainnet',
      config: priceConfig(),
      onPythStaleRead: () => {},
    }).aggregateBasicPrices(tx, { coinTypes: [USDC] });

    // The update builder is what emits `parse_and_verify`, the accumulator call and
    // the per-feed fee split; not calling it is what drops all three. Asserting on
    // the PTB alone would prove nothing here, since it is mocked to add no commands.
    expect(pyth.buildPythPriceUpdateCalls).not.toHaveBeenCalled();
    expect(pyth.resolvePythPriceInfoObjectIds).toHaveBeenCalledOnce();
  });

  it('reports the degradation instead of failing silently', async () => {
    hermesDown();
    mockResolve();
    const onPythStaleRead = vi.fn();
    const tx = new Transaction();

    await new BucketClient({
      suiClient: asSuiClient({}),
      network: 'mainnet',
      config: priceConfig(),
      onPythStaleRead,
    }).aggregateBasicPrices(tx, { coinTypes: [HASUI] });

    expect(onPythStaleRead).toHaveBeenCalledTimes(1);
    const event = onPythStaleRead.mock.calls[0]?.[0];
    // Both the requested feed and the SUI its rule pulls in are read stale.
    expect(event.feedIds).toEqual([address(0x51), address(0x50)]);
    expect(event.cause).toBeInstanceOf(Error);
    expect(String(event.cause)).toContain('503');
  });

  /**
   * The hook reports a degraded read; it must not be able to cause one. A throw
   * escaping it would turn a survivable Hermes outage into a hard failure — the
   * opposite of what the fallback is for.
   */
  it('survives a handler that throws synchronously', async () => {
    hermesDown();
    mockResolve();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tx = new Transaction();

    const results = await new BucketClient({
      suiClient: asSuiClient({}),
      network: 'mainnet',
      config: priceConfig(),
      onPythStaleRead: () => {
        throw new Error('metrics endpoint exploded');
      },
    }).aggregateBasicPrices(tx, { coinTypes: [USDC] });

    expect(results).toHaveLength(1);
    expect(moveCalls(tx).filter((call) => call.target === 'pyth_rule::feed')).toHaveLength(1);
    expect(consoleError).toHaveBeenCalled();
  });

  it('survives a handler that rejects, without an unhandled rejection', async () => {
    hermesDown();
    mockResolve();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled = vi.fn();
    process.on('unhandledRejection', unhandled);
    const tx = new Transaction();

    try {
      // TypeScript admits an async handler at a `void` return position, so the
      // discarded promise is a live hazard rather than a hypothetical one.
      const results = await new BucketClient({
        suiClient: asSuiClient({}),
        network: 'mainnet',
        config: priceConfig(),
        onPythStaleRead: async () => {
          throw new Error('telemetry POST failed');
        },
      }).aggregateBasicPrices(tx, { coinTypes: [USDC] });

      expect(results).toHaveLength(1);
      // Let any stray rejection reach the process handler before asserting.
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(unhandled).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalled();
    } finally {
      process.off('unhandledRejection', unhandled);
    }
  });

  it('honours pythStaleReadFallback: false by rejecting instead', async () => {
    hermesDown();
    mockResolve();
    const tx = new Transaction();

    await expect(
      new BucketClient({
        suiClient: asSuiClient({}),
        network: 'mainnet',
        config: priceConfig(),
        pythStaleReadFallback: false,
      }).aggregateBasicPrices(tx, { coinTypes: [USDC] }),
    ).rejects.toThrow('Hermes price fetch failed');

    expect(pyth.resolvePythPriceInfoObjectIds).not.toHaveBeenCalled();
  });

  it('does not swallow errors from the update path itself', async () => {
    // Hermes answered; a failure past that point means a malformed PTB, not an
    // outage, and must not be downgraded to a stale read.
    vi.spyOn(pyth, 'buildPythPriceUpdateCalls').mockRejectedValue(
      new Error('Price feed 0x… not found; create it first'),
    );
    mockResolve();
    const tx = new Transaction();

    await expect(
      new BucketClient({
        suiClient: asSuiClient({}),
        network: 'mainnet',
        config: priceConfig(),
        onPythStaleRead: () => {},
      }).aggregateBasicPrices(tx, { coinTypes: [USDC] }),
    ).rejects.toThrow('not found; create it first');

    expect(pyth.resolvePythPriceInfoObjectIds).not.toHaveBeenCalled();
  });
});

describe('unit/aggregatePrices', () => {
  it('stacks the rules for a derivative that sits on an LST', async () => {
    const tx = new Transaction();
    const results = await makeClient().aggregatePrices(tx, { coinTypes: [SCALLOP_HASUI] });

    expect(results).toHaveLength(1);
    const calls = moveCalls(tx);
    const indexOf = (target: string) => calls.findIndex((call) => call.target === target);
    // Each rule reads the aggregated price of the layer below it, so the whole
    // chain has to be ordered: SUI → haSUI → the sCoin over it.
    expect(aggregateIndex(tx, SUI)).toBeGreaterThanOrEqual(0);
    expect(aggregateIndex(tx, SUI)).toBeLessThan(indexOf('hasui_rule::feed'));
    expect(indexOf('hasui_rule::feed')).toBeLessThan(aggregateIndex(tx, HASUI));
    expect(aggregateIndex(tx, HASUI)).toBeLessThan(indexOf('scoin_rule::feed'));
    expect(indexOf('scoin_rule::feed')).toBeLessThan(aggregateIndex(tx, SCALLOP_HASUI));
  });

  it('returns only what the caller asked for when a derivative pulls in two layers', async () => {
    const tx = new Transaction();
    const results = await makeClient().aggregatePrices(tx, { coinTypes: [SCALLOP_HASUI, USDC] });

    expect(results).toHaveLength(2);
    expect(results[0]?.Result).toBe(aggregateIndex(tx, SCALLOP_HASUI));
    expect(results[1]?.Result).toBe(aggregateIndex(tx, USDC));
  });
});
