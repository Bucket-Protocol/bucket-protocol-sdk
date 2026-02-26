/**
 * Pyth price feed integration without @pythnetwork/pyth-sui-js.
 * Fetches update data from Hermes and builds Move calls for Sui 2.0 (SuiGrpcClient).
 */

import { bcs } from '@mysten/sui/bcs';
import type { SuiGrpcClient } from '@mysten/sui/grpc';
import type { Transaction } from '@mysten/sui/transactions';

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  return new Uint8Array(clean.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type PythConfig = {
  pythStateId: string;
  wormholeStateId: string;
};

/**
 * Fetches latest price update data from Hermes (REST). Returns buffers suitable for
 * Pyth Move contract update. Uses public Hermes endpoint; no token required.
 */
export async function fetchPriceFeedsUpdateDataFromHermes(
  endpoint: string,
  priceIds: string[],
): Promise<Uint8Array[]> {
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

  return data.map((hexStr: string) => hexToBytes(hexStr));
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
 * Builds Pyth price update Move calls on the transaction and returns the resulting
 * price info object IDs (one per feed), for use with pyth_rule::feed.
 * Uses SuiGrpcClient for on-chain reads (package IDs, price table, base fee).
 */
export async function buildPythPriceUpdateCalls(
  tx: Transaction,
  client: SuiGrpcClient,
  config: PythConfig,
  updates: Uint8Array[],
  feedIds: string[],
): Promise<string[]> {
  if (updates.length > 1) {
    throw new Error('Only a single accumulator message is supported per transaction');
  }

  const pythPackageId = await getPackageId(client, config.pythStateId);
  const wormholePackageId = await getPackageId(client, config.wormholeStateId);
  const baseUpdateFee = await getBaseUpdateFee(client, config.pythStateId);

  const vaa = extractVaaBytesFromAccumulatorMessage(updates[0]!);
  const verifiedVaas = await verifyVaas(tx, client, wormholePackageId, config.wormholeStateId, [vaa]);

  // Move expects vector<u8>; serialize with BCS length prefix, then cast for tx.pure
  const accBcsSerialized = bcs.vector(bcs.u8()).serialize(Array.from(updates[0]!));
  const [priceUpdatesHotPotato] = tx.moveCall({
    target: `${pythPackageId}::pyth::create_authenticated_price_infos_using_accumulator`,
    arguments: [
      tx.object(config.pythStateId),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tx.pure(accBcsSerialized) as any,
      verifiedVaas[0]!,
      tx.object.clock(),
    ],
  });

  const feeAmounts = feedIds.map(() => tx.pure.u64(baseUpdateFee));
  const coins = tx.splitCoins(tx.gas, feeAmounts);

  const priceInfoObjectIds: string[] = [];
  let hotPotato = priceUpdatesHotPotato;

  for (let i = 0; i < feedIds.length; i++) {
    const feedId = feedIds[i]!;
    const priceInfoObjectId = await getPriceFeedObjectId(client, config.pythStateId, feedId);
    if (!priceInfoObjectId) {
      throw new Error(`Price feed ${feedId} not found; create it first`);
    }
    priceInfoObjectIds.push(priceInfoObjectId);

    [hotPotato] = tx.moveCall({
      target: `${pythPackageId}::pyth::update_single_price_feed`,
      arguments: [
        tx.object(config.pythStateId),
        hotPotato,
        tx.object(priceInfoObjectId),
        coins[i]!,
        tx.object.clock(),
      ],
    });
  }

  tx.moveCall({
    target: `${pythPackageId}::hot_potato_vector::destroy`,
    arguments: [hotPotato],
    typeArguments: [`${pythPackageId}::price_info::PriceInfo`],
  });

  return priceInfoObjectIds;
}

async function getPackageId(client: SuiGrpcClient, objectId: string): Promise<string> {
  const result = await client.getObject({
    objectId,
    include: { json: true },
  });

  const json = result.object?.json as Record<string, unknown> | null | undefined;
  if (!json) throw new Error(`Cannot get package id for object ${objectId}`);

  // gRPC returns upgrade_cap directly at root; JSON-RPC wraps it under fields
  const upgradeCap =
    (json.upgrade_cap as Record<string, unknown> | undefined) ??
    ((json.fields as Record<string, unknown> | undefined)?.upgrade_cap as
      | Record<string, unknown>
      | undefined);

  const pkg =
    typeof upgradeCap?.package === 'string'
      ? upgradeCap.package
      : typeof (upgradeCap?.fields as Record<string, unknown> | undefined)?.package === 'string'
        ? ((upgradeCap!.fields as Record<string, unknown>).package as string)
        : undefined;

  if (!pkg) throw new Error(`Cannot get package id for object ${objectId}`);
  return pkg;
}

async function getBaseUpdateFee(client: SuiGrpcClient, pythStateId: string): Promise<bigint> {
  const result = await client.getObject({
    objectId: pythStateId,
    include: { json: true },
  });

  const json = result.object?.json as Record<string, unknown> | null | undefined;
  if (!json) throw new Error('Unable to fetch pyth state');
  const fields = json.fields as Record<string, unknown> | undefined;
  const fee = (fields?.base_update_fee ?? json.base_update_fee) as string | undefined;
  if (fee === undefined) throw new Error('Unable to fetch pyth state base_update_fee');
  return BigInt(fee);
}

async function verifyVaas(
  tx: Transaction,
  _client: SuiGrpcClient,
  wormholePackageId: string,
  wormholeStateId: string,
  vaas: Uint8Array[],
): Promise<unknown[]> {
  const verified: unknown[] = [];
  for (const vaa of vaas) {
    const vaaArg = tx.pure.vector('u8', Array.from(vaa));
    const [verifiedVaa] = tx.moveCall({
      target: `${wormholePackageId}::vaa::parse_and_verify`,
      arguments: [
        tx.object(wormholeStateId),
        vaaArg,
        tx.object.clock(),
      ],
    });
    verified.push(verifiedVaa);
  }
  return verified;
}

type PriceTableInfo = { id: string; fieldType: string };

async function getPriceTableInfo(client: SuiGrpcClient, pythStateId: string): Promise<PriceTableInfo> {
  const list = await client.listDynamicFields({ parentId: pythStateId, limit: 256 });
  const priceInfoEntry = list.dynamicFields.find(
    (e) => e.valueType?.includes('PriceIdentifier') && e.valueType?.includes('object::ID'),
  ) as { childId?: string; valueType?: string } | undefined;

  if (!priceInfoEntry?.childId) {
    throw new Error('Price table not found in Pyth state dynamic fields');
  }

  // valueType is e.g. "0x0000...0002::table::Table<0x<pkg>::price_identifier::PriceIdentifier,...>"
  // Extract the package address preceding "::price_identifier::PriceIdentifier"
  const pkgMatch = (priceInfoEntry.valueType ?? '').match(/(0x[a-fA-F0-9]+)::price_identifier::PriceIdentifier/);
  if (!pkgMatch) {
    throw new Error(`Cannot extract package address from price table type: ${priceInfoEntry.valueType}`);
  }
  return { id: priceInfoEntry.childId, fieldType: pkgMatch[1]! };
}

const priceTableCache = new Map<string, PriceTableInfo>();

async function getPriceFeedObjectId(
  client: SuiGrpcClient,
  pythStateId: string,
  feedId: string,
): Promise<string | undefined> {
  const normalized = feedId.replace(/^0x/, '');
  let table = priceTableCache.get(pythStateId);
  if (!table) {
    table = await getPriceTableInfo(client, pythStateId);
    priceTableCache.set(pythStateId, table);
  }

  const keyBytes = bcs.struct('PriceIdentifier', { bytes: bcs.vector(bcs.u8()) }).serialize({
    bytes: Array.from(hexToBytes(normalized)),
  }).toBytes();

  const result = await client.getDynamicField({
    parentId: table.id,
    name: { type: `${table.fieldType}::price_identifier::PriceIdentifier`, bcs: keyBytes },
  });

  const value = result.dynamicField?.value as { bcs?: Uint8Array } | undefined;
  if (!value?.bcs || value.bcs.length < 32) return undefined;

  return '0x' + bytesToHex(value.bcs);
}
