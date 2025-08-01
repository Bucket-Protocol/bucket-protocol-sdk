import { bcs } from '@mysten/sui/bcs';
import { DevInspectResults } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

import { BaseService } from './base';
import {
  CORE_PACKAGE_ID,
  PROTOCOL_OBJECT,
  PSM_BALANCE_IDS,
  PSM_POOL_IDS,
  STRAP_FOUNTAIN_IDS,
  FOUNTAIN_PERIHERY_PACKAGE_ID,
} from '../constants';
import {
  BucketConstants,
  BucketProtocolResponse,
  FountainList,
  PsmList,
  StrapFountainList,
  TankList,
} from '../types';
import {
  getMultiGetObjects,
  getObjectFields,
  objectToFountain,
  objectToPsm,
  objectToStrapFountain,
} from '../utils';

/**
 * Service for handling protocol-related operations
 */
export class ProtocolService extends BaseService {
  /**
   * Get encoded BCS Bucket values
   */
  private async encodedBucketConstants(): Promise<DevInspectResults> {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::fee_precision`,
    });
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::liquidation_rebate`,
    });
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::flash_loan_fee`,
    });
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::buck_decimal`,
    });
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::max_lock_time`,
    });
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::min_lock_time`,
    });
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::min_fee`,
    });
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::max_fee`,
    });

    return await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.owner,
    });
  }

  /**
   * Get bucket constants (decoded BCS values)
   */
  async getBucketConstants(): Promise<BucketConstants | undefined> {
    const results: any = await this.encodedBucketConstants();

    if (!results) {
      return undefined;
    }

    const bucketObject = {
      feePrecision: bcs.U64.parse(Uint8Array.from(results.results![0].returnValues[0][0])),
      liquidationRebate: bcs.U64.parse(Uint8Array.from(results.results![1].returnValues[0][0])),
      flashLoanFee: bcs.U64.parse(Uint8Array.from(results.results![2].returnValues[0][0])),
      buckDecimal: bcs.U64.parse(Uint8Array.from(results.results![3].returnValues[0][0])),
      maxLockTime: bcs.U64.parse(Uint8Array.from(results.results![4].returnValues[0][0])),
      minLockTime: bcs.U64.parse(Uint8Array.from(results.results![5].returnValues[0][0])),
      minFee: bcs.U64.parse(Uint8Array.from(results.results![6].returnValues[0][0])),
      maxFee: bcs.U64.parse(Uint8Array.from(results.results![7].returnValues[0][0])),
    };

    return bucketObject;
  }

  /**
   * Get protocol information
   */
  async getProtocol(): Promise<BucketProtocolResponse | undefined> {
    const protocolObject = await this.client.getObject({
      id: PROTOCOL_OBJECT.objectId,
      options: {
        showContent: true,
      },
    });

    if (!protocolObject.data?.content || protocolObject.data.content.dataType !== 'moveObject') {
      return undefined;
    }

    const fields = getObjectFields(protocolObject);
    if (!fields) return undefined;

    return {
      id: protocolObject.data.objectId,
      version: protocolObject.data.version,
      fields,
    };
  }

  /**
   * Get all tanks
   */
  async getAllTanks(): Promise<TankList> {
    const tankIds = Object.values(PSM_BALANCE_IDS);
    
    const tankObjects = await getMultiGetObjects({
      client: this.client,
      objectIds: tankIds,
      options: {
        showContent: true,
      },
    });

    const tanks = tankObjects
      .map((obj) => {
        if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
          return null;
        }
        const fields = getObjectFields(obj);
        if (!fields) return null;

        return {
          id: obj.data.objectId,
          version: obj.data.version,
          fields,
        };
      })
      .filter(Boolean);

    return tanks;
  }

  /**
   * Get all PSMs (Price Stability Modules)
   */
  async getAllPsms(): Promise<PsmList> {
    const psmIds = Object.values(PSM_POOL_IDS);
    
    const psmObjects = await getMultiGetObjects({
      client: this.client,
      objectIds: psmIds,
      options: {
        showContent: true,
      },
    });

    const psms = psmObjects
      .map((obj) => objectToPsm(obj))
      .filter(Boolean);

    return psms;
  }

  /**
   * Get all fountains
   */
  async getAllFountains(): Promise<FountainList> {
    const tx = new Transaction();
    tx.moveCall({
      target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::fountain_periphery::get_all_fountain_data`,
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT)],
    });

    const results = await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.owner,
    });

    if (!results.results?.[0]?.returnValues?.[0]?.[0]) {
      return [];
    }

    const fountainData = bcs.vector(bcs.vector(bcs.u8())).parse(
      Uint8Array.from(results.results[0].returnValues[0][0])
    );

    const fountains = fountainData
      .map((data: number[]) => {
        try {
          const fountainObject = bcs.de('FountainData', Uint8Array.from(data));
          return objectToFountain({ data: { content: { fields: fountainObject } } } as any);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return fountains;
  }

  /**
   * Get all strap fountains
   */
  async getAllStrapFountains(): Promise<StrapFountainList> {
    const strapFountainIds = Object.values(STRAP_FOUNTAIN_IDS);
    
    const strapFountainObjects = await getMultiGetObjects({
      client: this.client,
      objectIds: strapFountainIds,
      options: {
        showContent: true,
      },
    });

    const strapFountains = strapFountainObjects
      .map((obj) => objectToStrapFountain(obj))
      .filter(Boolean);

    return strapFountains;
  }
}