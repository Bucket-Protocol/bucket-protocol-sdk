import type { SuiGrpcClient } from '@mysten/sui/grpc';

import type { Network } from '@/types/index.js';
import { ENTRY_CONFIG_ID } from '@/consts/entry.js';

// ============================================================
// Type identifiers (suffix matching on object type string)
// ============================================================

const TYPE_PACKAGE_CONFIG = '::package_config::PackageConfig';
const TYPE_ORACLE_CONFIG = '::oracle_config::OracleConfig';
const TYPE_OBJECT_CONFIG = '::object_config::ObjectConfig';
const TYPE_AGGREGATOR = '::aggregator::Aggregator';
const TYPE_VAULT = '::vault::Vault';
const TYPE_SAVING_POOL = '::saving_pool::SavingPool';
const TYPE_PSM_POOL = '::psm_pool::PsmPool';
const TYPE_PRICE_CONFIG = '::price::PriceConfig';

// ============================================================
// Query Helpers
// ============================================================

/**
 * Parse a VecMap JSON representation into a Record<string, unknown>.
 *
 * VecMap<K,V> on-chain serializes to JSON as an array of { key, value } entries.
 * This replaces the old Table-based dynamic field queries — VecMap data is
 * embedded directly in the parent object's JSON, eliminating extra RPC calls.
 */
function parseVecMap(vecMap: unknown): Record<string, unknown> {
  const entries: Record<string, unknown> = {};
  if (!vecMap) return entries;

  // VecMap serializes as { contents: [{ key, value }, ...] }
  let items: unknown[];
  if (Array.isArray(vecMap)) {
    items = vecMap;
  } else if (typeof vecMap === 'object' && vecMap !== null && 'contents' in vecMap) {
    items = (vecMap as Record<string, unknown>).contents as unknown[];
  } else {
    return entries;
  }

  for (const item of items) {
    const entry = item as Record<string, unknown>;
    entries[entry.key as string] = entry.value;
  }

  return entries;
}

// ============================================================
// Output Types
// ============================================================

export interface BucketOnchainConfig {
  config: {
    id: string;
    id_vector: string[];
  };
  packageConfig?: Record<string, unknown>;
  oracleConfig?: Record<string, unknown>;
  objectConfig?: Record<string, unknown>;
  aggregator?: {
    id: string;
    entries: Record<string, unknown>;
  };
  vault?: {
    id: string;
    entries: Record<string, unknown>;
  };
  savingPool?: {
    id: string;
    entries: Record<string, unknown>;
  };
  psmPool?: {
    id: string;
    entries: Record<string, unknown>;
  };
  priceConfig?: {
    id: string;
    entries: Record<string, unknown>;
  };
}

// ============================================================
// Main Queryer
// ============================================================

/**
 * Query the entry Config object, resolve all referenced sub-objects by type,
 * and return the complete onchain config as a structured JSON-serializable object.
 */
export async function queryAllConfig(
  client: SuiGrpcClient,
  network: Network = 'mainnet',
): Promise<BucketOnchainConfig> {
  const entryId = ENTRY_CONFIG_ID[network];
  if (!entryId) {
    throw new Error(`No ENTRY_CONFIG_ID configured for network "${network}".`);
  }

  // 1. Fetch entry Config object
  const {
    objects: [configObj],
  } = await client.getObjects({
    objectIds: [entryId],
    include: { json: true },
  });

  if (configObj instanceof Error) {
    throw new Error(`Failed to fetch Config object: ${configObj.message}`);
  }
  if (!configObj.json) {
    throw new Error('Config object has no JSON content');
  }

  const configJson = configObj.json as Record<string, unknown>;
  const result: BucketOnchainConfig = {
    config: {
      id: configJson.id as string,
      id_vector: configJson.id_vector as string[],
    },
  };

  if ((configJson.id_vector as string[]).length === 0) return result;

  // 2. Batch fetch all sub-objects referenced by id_vector
  const { objects } = await client.getObjects({
    objectIds: configJson.id_vector as string[],
    include: { json: true },
  });

  // 3. Read each object's JSON based on its on-chain type
  for (const obj of objects) {
    if (obj instanceof Error) {
      console.error('Failed to fetch object:', obj.message);
      continue;
    }

    const type = obj.type;
    const json = obj.json as Record<string, unknown> | null;
    if (!json) continue;

    try {
      if (type.endsWith(TYPE_PACKAGE_CONFIG)) {
        result.packageConfig = json;
      } else if (type.endsWith(TYPE_ORACLE_CONFIG)) {
        result.oracleConfig = json;
      } else if (type.endsWith(TYPE_OBJECT_CONFIG)) {
        result.objectConfig = json;
      } else if (type.endsWith(TYPE_AGGREGATOR)) {
        const entries = parseVecMap(json.table);
        result.aggregator = { id: json.id as string, entries };
      } else if (type.endsWith(TYPE_VAULT)) {
        const entries = parseVecMap(json.table);
        result.vault = { id: json.id as string, entries };
      } else if (type.endsWith(TYPE_SAVING_POOL)) {
        const entries = parseVecMap(json.table);
        result.savingPool = { id: json.id as string, entries };
      } else if (type.endsWith(TYPE_PSM_POOL)) {
        const entries = parseVecMap(json.table);
        result.psmPool = { id: json.id as string, entries };
      } else if (type.endsWith(TYPE_PRICE_CONFIG)) {
        const entries = parseVecMap(json.table);
        result.priceConfig = { id: json.id as string, entries };
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Unknown object type: ${type} (objectId: ${obj.objectId})`);
      }
    } catch (e) {
      console.error(`Failed to process object ${obj.objectId} (type: ${type}):`, e);
    }
  }

  return result;
}

// ============================================================
// JSON serialization (handles BigInt from bcs.u64)
// ============================================================

function jsonReplacer(_key: string, value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString();
  return value;
}

export function toJson(config: BucketOnchainConfig): string {
  return JSON.stringify(config, jsonReplacer, 2);
}
