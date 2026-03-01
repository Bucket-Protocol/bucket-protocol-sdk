import type { SuiGrpcClient } from '@mysten/sui/grpc';

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

// ============================================================
// Query Helpers
// ============================================================

/**
 * List all dynamic fields under a parent object (handles pagination).
 */
async function listAllDynamicFields(client: SuiGrpcClient, parentId: string) {
  const allFields: unknown[] = [];
  let cursor: string | null = null;
  let hasNext = true;

  while (hasNext) {
    const page = await client.listDynamicFields({
      parentId,
      cursor,
      limit: 50,
    });
    allFields.push(...page.dynamicFields);
    hasNext = page.hasNextPage;
    cursor = page.cursor;
  }

  return allFields;
}

/**
 * Query all entries from a Table<String, V> by its table UID.
 * Uses JSON representation directly instead of BCS parsing.
 */
async function queryTableEntries(client: SuiGrpcClient, tableId: string): Promise<Record<string, unknown>> {
  // 1. List all dynamic fields
  const allFields = await listAllDynamicFields(client, tableId);
  if (allFields.length === 0) return {};

  // 2. Batch get all field objects with JSON
  const fieldIds = allFields.map((f) => (f as Record<string, unknown>).fieldId as string);
  const { objects: fieldObjects } = await client.getObjects({
    objectIds: fieldIds,
    include: { json: true },
  });

  // 3. Extract name/value from JSON
  const entries: Record<string, unknown> = {};
  for (const obj of fieldObjects) {
    if (obj instanceof Error) {
      console.error('Failed to fetch dynamic field:', obj.message);
      continue;
    }
    const json = obj.json as Record<string, unknown> | null;
    if (!json) continue;
    try {
      entries[json.name as string] = json.value;
    } catch (e) {
      console.error(`Failed to read dynamic field ${obj.objectId}:`, e);
    }
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
}

// ============================================================
// Main Queryer
// ============================================================

/**
 * Query the entry Config object, resolve all referenced sub-objects by type,
 * and return the complete onchain config as a structured JSON-serializable object.
 */
export async function queryAllConfig(client: SuiGrpcClient): Promise<BucketOnchainConfig> {
  // 1. Fetch entry Config object
  const {
    objects: [configObj],
  } = await client.getObjects({
    objectIds: [ENTRY_CONFIG_ID],
    include: { json: true },
  });

  if (configObj instanceof Error) {
    throw new Error(`Failed to fetch Config object: ${configObj.message}`);
  }
  if (!configObj.json) {
    throw new Error('Config object has no JSON content');
  }

  const configJson = configObj.json as Record<string, unknown>;
  const idObj = configJson.id as Record<string, unknown>;
  const result: BucketOnchainConfig = {
    config: {
      id: idObj.id as string,
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
        const table = json.table as Record<string, unknown>;
        const idField = json.id as Record<string, unknown>;
        const entries = await queryTableEntries(client, table.id as string);
        result.aggregator = { id: idField.id as string, entries };
      } else if (type.endsWith(TYPE_VAULT)) {
        const table = json.table as Record<string, unknown>;
        const idField = json.id as Record<string, unknown>;
        const entries = await queryTableEntries(client, table.id as string);
        result.vault = { id: idField.id as string, entries };
      } else if (type.endsWith(TYPE_SAVING_POOL)) {
        const table = json.table as Record<string, unknown>;
        const idField = json.id as Record<string, unknown>;
        const entries = await queryTableEntries(client, table.id as string);
        result.savingPool = { id: idField.id as string, entries };
      } else if (type.endsWith(TYPE_PSM_POOL)) {
        const table = json.table as Record<string, unknown>;
        const idField = json.id as Record<string, unknown>;
        const entries = await queryTableEntries(client, table.id as string);
        result.psmPool = { id: idField.id as string, entries };
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
