import { Transaction } from '@mysten/sui/transactions';
import { SuiObjectResponse } from '@mysten/sui/client';

import { BaseService } from './base';
import { 
  CLOCK_OBJECT,
  COINS_TYPE_LIST,
  ORACLE_OBJECT,
  PRICE_MAP,
  SUPRA_HANDLER_OBJECT,
  SUPRA_ID,
  SUPRA_UPDATE_TARGET,
} from '../constants';
import { COIN } from '../types';
import { getMultiGetObjects } from '../utils';

/**
 * Service for handling price-related operations
 */
export class PriceService extends BaseService {
  /**
   * Get all token prices
   */
  async getPrices(): Promise<Partial<Record<COIN, number>>> {
    const prices: Partial<Record<COIN, number>> = {};

    const objectIds = Object.values(PRICE_MAP)
      .map(({ objectId }) => objectId)
      .filter((objectId) => objectId !== undefined);

    const res = await getMultiGetObjects({
      client: this.client,
      objectIds,
      options: {
        showContent: true,
      },
    });

    const objects = Object.entries(PRICE_MAP).reduce(
      (result, [token, { objectId }]) => {
        if (objectId) {
          result[token as COIN] = res.shift();
        }
        return result;
      },
      {} as Partial<Record<COIN, SuiObjectResponse>>,
    );

    const getPrice = async (token: COIN): Promise<number> => {
      if (!(token in prices)) {
        const { processFn, dependentTokens = [], defaultValue = 0 } = PRICE_MAP[token] ?? {};

        const dependentObject = objects[token];
        try {
          const dependentPrices = await Promise.all(
            (Array.isArray(dependentTokens) ? dependentTokens : [dependentTokens]).map((token) => getPrice(token)),
          );
          const price = processFn
            ? await processFn({ suiClient: this.client, object: dependentObject, prices: dependentPrices })
            : dependentPrices[0];

          prices[token] = price ?? defaultValue;
        } catch {
          prices[token] = defaultValue;
        }
      }
      return prices[token] as number;
    };

    for (const token in PRICE_MAP) {
      await getPrice(token as COIN);
    }

    return prices;
  }

  /**
   * Update token price using supra oracle
   * @param tx Transaction object
   * @param token Asset type, e.g "0x2::sui::SUI"
   */
  updateSupraOracle(tx: Transaction, token: string): void {
    tx.moveCall({
      target: SUPRA_UPDATE_TARGET,
      typeArguments: [COINS_TYPE_LIST.SUI],
      arguments: [
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.sharedObjectRef(SUPRA_HANDLER_OBJECT),
        tx.pure.u32(SUPRA_ID.SUI),
      ],
    });

    if (token === 'afSUI' || token === 'AF_LP_SUI_SUI') {
      tx.moveCall({
        target: SUPRA_UPDATE_TARGET,
        typeArguments: [COINS_TYPE_LIST['SUI']],
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.sharedObjectRef(SUPRA_HANDLER_OBJECT),
          tx.pure.u32(SUPRA_ID['SUI']),
        ],
      });
    }

    // Add other token-specific oracle updates as needed
    const tokenUpdates: Record<string, string> = {
      'USDC': 'USDC',
      'USDT': 'USDT',
      'WETH': 'WETH',
      'WBTC': 'WBTC',
    };

    if (token in tokenUpdates) {
      const tokenKey = tokenUpdates[token];
      tx.moveCall({
        target: SUPRA_UPDATE_TARGET,
        typeArguments: [COINS_TYPE_LIST[tokenKey as keyof typeof COINS_TYPE_LIST]],
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.sharedObjectRef(SUPRA_HANDLER_OBJECT),
          tx.pure.u32(SUPRA_ID[tokenKey as keyof typeof SUPRA_ID]),
        ],
      });
    }
  }
}