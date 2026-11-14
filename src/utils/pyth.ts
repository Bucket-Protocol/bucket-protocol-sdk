/**
 * Pyth price feed integration: resolve the on-chain `PriceInfoObject` for each feed (SuiGrpcClient).
 */

import { fromHex, toHex } from '@mysten/bcs';
import { bcs } from '@mysten/sui/bcs';
import type { SuiGrpcClient } from '@mysten/sui/grpc';

async function runWithConcurrency<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    results.push(...(await Promise.all(batch.map(fn))));
  }
  return results;
}

type PriceTableInfo = { id: string; fieldType: string };

/** Per-instance cache for Pyth on-chain reads (use one per BucketClient). */
export class PythCache {
  priceTableInfo?: PriceTableInfo;
  priceFeedObjectIdCache = new Map<string, string | undefined>();
}

/**
 * Resolves the `PriceInfoObject` id backing each feed, reading only on-chain state.
 *
 * The lookup walks Pyth's own price table (a dynamic field on `PythState`) and
 * never touches an off-chain endpoint. The caller feeds the price object as it
 * already stands — `pyth_rule::feed` reads it with `get_price_unsafe` and abstains
 * on staleness rather than aborting.
 *
 * Throws when a feed has no price object: the id is required, since the rule has
 * to be fed for `remove_outliers` to count it as collected.
 */
export async function resolvePythPriceInfoObjectIds(
  client: SuiGrpcClient,
  pythStateId: string,
  feedIds: string[],
  cache?: PythCache,
): Promise<string[]> {
  if (feedIds.length === 0) return [];

  const table = await getPriceTableInfo(client, pythStateId, cache);
  const ids = await runWithConcurrency(feedIds, 4, (feedId) =>
    getPriceFeedObjectIdWithTable(client, table, feedId, cache, pythStateId),
  );

  return ids.map((id, i) => {
    if (!id) throw new Error(`Price feed ${feedIds[i]} not found; create it first`);
    return id;
  });
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
