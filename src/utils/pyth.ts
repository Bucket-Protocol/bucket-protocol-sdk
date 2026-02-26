/**
 * Pyth price feed integration: fetch update data from Hermes, build Move calls for Sui (SuiGrpcClient).
 */

import { fromHex, toHex } from '@mysten/bcs';
import { bcs } from '@mysten/sui/bcs';
import type { SuiGrpcClient } from '@mysten/sui/grpc';
import type { Transaction, TransactionArgument } from '@mysten/sui/transactions';

async function runWithConcurrency<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    results.push(...(await Promise.all(batch.map(fn))));
  }
  return results;
}

function getPackageIdFromObjectJson(json: Record<string, unknown>, objectId: string): string {
  const upgradeCap =
    (json.upgrade_cap as Record<string, unknown> | undefined) ??
    ((json.fields as Record<string, unknown> | undefined)?.upgrade_cap as Record<string, unknown> | undefined);
  const fromFields = (upgradeCap?.fields as Record<string, unknown> | undefined)?.package;
  const pkg =
    typeof upgradeCap?.package === 'string'
      ? upgradeCap.package
      : typeof fromFields === 'string'
        ? fromFields
        : undefined;
  if (!pkg) throw new Error(`Cannot get package id for object ${objectId}`);
  return pkg;
}

export type PythConfig = {
  pythStateId: string;
  wormholeStateId: string;
};

type PriceTableInfo = { id: string; fieldType: string };
type PythStateInfo = { packageId: string; baseUpdateFee: bigint };

/** Per-instance cache for Pyth on-chain reads (use one per BucketClient). */
export class PythCache {
  pythStateInfo?: PythStateInfo;
  wormholePackageId?: string;
  priceTableInfo?: PriceTableInfo;
  priceFeedObjectIdCache = new Map<string, string | undefined>();
}

/** Fetches latest price update data from Hermes (public REST; no token). Returns buffers for Pyth Move update. */
export async function fetchPriceFeedsUpdateDataFromHermes(endpoint: string, priceIds: string[]): Promise<Uint8Array[]> {
  if (priceIds.length === 0) return [];

  const url = new URL('/v2/updates/price/latest', endpoint);
  priceIds.forEach((id) => url.searchParams.append('ids[]', id));

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Hermes price fetch failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as {
    binary?: { encoding?: string; data?: string[] };
  };

  const data = json.binary?.data;
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Hermes returned no binary price data');
  }

  return data.map((hexStr: string) => fromHex(hexStr));
}

/**
 * Extracts VAA bytes from an accumulator message (first 6 bytes are header; VAA follows).
 */
function extractVaaBytesFromAccumulatorMessage(accumulatorMessage: Uint8Array): Uint8Array {
  const view = new DataView(accumulatorMessage.buffer, accumulatorMessage.byteOffset, accumulatorMessage.byteLength);
  const trailingPayloadSize = view.getUint8(6);
  const vaaSizeOffset = 7 + trailingPayloadSize + 1;
  const vaaSize = view.getUint16(vaaSizeOffset, false);
  const vaaOffset = vaaSizeOffset + 2;
  return accumulatorMessage.subarray(vaaOffset, vaaOffset + vaaSize);
}

/**
 * Appends Pyth price update Move calls to `tx` and returns price info object IDs (one per feed).
 * Uses SuiGrpcClient for on-chain reads. Pass a PythCache for per-BucketClient caching.
 */
export async function buildPythPriceUpdateCalls(
  tx: Transaction,
  client: SuiGrpcClient,
  config: PythConfig,
  updates: Uint8Array[],
  feedIds: string[],
  cache?: PythCache,
): Promise<string[]> {
  if (updates.length === 0) {
    throw new Error('No price update data provided; Hermes may have returned empty results');
  }
  if (updates.length > 1) {
    throw new Error('Only a single accumulator message is supported per transaction');
  }

  const [pythState, wormholePackageId, table] = await Promise.all([
    getPythStateInfo(client, config.pythStateId, cache),
    getWormholePackageId(client, config.wormholeStateId, cache),
    getPriceTableInfo(client, config.pythStateId, cache),
  ]);
  const priceInfoObjectIds = await runWithConcurrency(feedIds, 4, (feedId) =>
    getPriceFeedObjectIdWithTable(client, table, feedId, cache, config.pythStateId),
  );

  const { packageId: pythPackageId, baseUpdateFee } = pythState;

  const vaa = extractVaaBytesFromAccumulatorMessage(updates[0]!);
  const verifiedVaas = verifyVaas(tx, wormholePackageId, config.wormholeStateId, [vaa]);

  const accBytesArg = tx.pure.vector('u8', updates[0]!) as TransactionArgument;
  const [priceUpdatesHotPotato] = tx.moveCall({
    target: `${pythPackageId}::pyth::create_authenticated_price_infos_using_accumulator`,
    arguments: [tx.object(config.pythStateId), accBytesArg, verifiedVaas[0]!, tx.object.clock()],
  });

  const feeAmounts = feedIds.map(() => tx.pure.u64(baseUpdateFee));
  const coins = tx.splitCoins(tx.gas, feeAmounts);

  let hotPotato = priceUpdatesHotPotato;
  for (let i = 0; i < feedIds.length; i++) {
    const priceInfoObjectId = priceInfoObjectIds[i];
    if (!priceInfoObjectId) {
      throw new Error(`Price feed ${feedIds[i]} not found; create it first`);
    }
    [hotPotato] = tx.moveCall({
      target: `${pythPackageId}::pyth::update_single_price_feed`,
      arguments: [tx.object(config.pythStateId), hotPotato, tx.object(priceInfoObjectId), coins[i]!, tx.object.clock()],
    });
  }

  tx.moveCall({
    target: `${pythPackageId}::hot_potato_vector::destroy`,
    arguments: [hotPotato],
    typeArguments: [`${pythPackageId}::price_info::PriceInfo`],
  });

  return priceInfoObjectIds as string[];
}

async function getWormholePackageId(
  client: SuiGrpcClient,
  wormholeStateId: string,
  cache?: PythCache,
): Promise<string> {
  if (cache?.wormholePackageId) return cache.wormholePackageId;
  const result = await client.getObject({ objectId: wormholeStateId, include: { json: true } });
  const json = result.object?.json as Record<string, unknown> | null | undefined;
  if (!json) throw new Error(`Cannot get package id for object ${wormholeStateId}`);
  const pkg = getPackageIdFromObjectJson(json, wormholeStateId);
  if (cache) cache.wormholePackageId = pkg;
  return pkg;
}

async function getPythStateInfo(client: SuiGrpcClient, pythStateId: string, cache?: PythCache): Promise<PythStateInfo> {
  if (cache?.pythStateInfo) return cache.pythStateInfo;
  const result = await client.getObject({ objectId: pythStateId, include: { json: true } });
  const json = result.object?.json as Record<string, unknown> | null | undefined;
  if (!json) throw new Error('Unable to fetch pyth state');
  const packageId = getPackageIdFromObjectJson(json, pythStateId);
  const fields = json.fields as Record<string, unknown> | undefined;
  const fee = (fields?.base_update_fee ?? json.base_update_fee) as string | undefined;
  if (fee === undefined) throw new Error('Unable to fetch pyth state base_update_fee');
  const info: PythStateInfo = { packageId, baseUpdateFee: BigInt(fee) };
  if (cache) cache.pythStateInfo = info;
  return info;
}

function verifyVaas(
  tx: Transaction,
  wormholePackageId: string,
  wormholeStateId: string,
  vaas: Uint8Array[],
): TransactionArgument[] {
  const verified: TransactionArgument[] = [];
  for (const vaa of vaas) {
    const vaaArg = tx.pure.vector('u8', vaa);
    const [verifiedVaa] = tx.moveCall({
      target: `${wormholePackageId}::vaa::parse_and_verify`,
      arguments: [tx.object(wormholeStateId), vaaArg, tx.object.clock()],
    });
    verified.push(verifiedVaa as TransactionArgument);
  }
  return verified;
}

async function getPriceTableInfo(
  client: SuiGrpcClient,
  pythStateId: string,
  cache?: PythCache,
): Promise<PriceTableInfo> {
  if (cache?.priceTableInfo) return cache.priceTableInfo;

  const list = await client.listDynamicFields({ parentId: pythStateId, limit: 256 });
  const priceInfoEntry = list.dynamicFields.find(
    (e) => e.valueType?.includes('PriceIdentifier') && e.valueType?.includes('object::ID'),
  ) as { childId?: string; valueType?: string } | undefined;

  if (!priceInfoEntry?.childId) {
    throw new Error('Price table not found in Pyth state dynamic fields');
  }

  const pkgMatch = (priceInfoEntry.valueType ?? '').match(/(0x[a-fA-F0-9]+)::price_identifier::PriceIdentifier/);
  if (!pkgMatch) {
    throw new Error(`Cannot extract package address from price table type: ${priceInfoEntry.valueType}`);
  }
  const info: PriceTableInfo = { id: priceInfoEntry.childId, fieldType: pkgMatch[1]! };
  if (cache) cache.priceTableInfo = info;
  return info;
}

async function getPriceFeedObjectIdWithTable(
  client: SuiGrpcClient,
  table: PriceTableInfo,
  feedId: string,
  cache?: PythCache,
  pythStateId?: string,
): Promise<string | undefined> {
  const normalized = feedId.replace(/^0x/, '');
  const cacheKey = pythStateId ? `${pythStateId}:${normalized}` : normalized;
  if (cache?.priceFeedObjectIdCache.has(cacheKey)) {
    return cache.priceFeedObjectIdCache.get(cacheKey);
  }

  const keyBytes = bcs
    .struct('PriceIdentifier', { bytes: bcs.vector(bcs.u8()) })
    .serialize({
      bytes: fromHex(normalized),
    })
    .toBytes();
  const result = await client.getDynamicField({
    parentId: table.id,
    name: { type: `${table.fieldType}::price_identifier::PriceIdentifier`, bcs: keyBytes },
  });
  const value = result.dynamicField?.value as { bcs?: Uint8Array } | undefined;
  const objectId = !value?.bcs || value.bcs.length < 32 ? undefined : '0x' + toHex(value.bcs);

  if (cache) cache.priceFeedObjectIdCache.set(cacheKey, objectId);
  return objectId;
}
