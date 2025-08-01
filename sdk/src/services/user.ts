import { BaseService } from './base';
import {
  PROTOCOL_OBJECT,
  STRUCT_BOTTLE_DATA,
  STRAP_FOUNTAIN_IDS,
} from '../constants';
import {
  UserBottleInfo,
  UserTankList,
  UserLpList,
  UserDeButInfo,
} from '../types';
import {
  getMultiGetObjects,
  getObjectFields,
  lpProofToObject,
} from '../utils';
import {
  getUserDeButPositions,
  getUserDeButWrapper,
} from '../utils/deBut';

/**
 * Service for handling user-related operations
 */
export class UserService extends BaseService {
  /**
   * Get user bottles
   * @param address User address
   */
  async getUserBottles(address: string): Promise<UserBottleInfo[]> {
    const bottles: UserBottleInfo[] = [];

    try {
      const response = await this.client.getOwnedObjects({
        owner: address,
        filter: {
          StructType: STRUCT_BOTTLE_DATA,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      for (const bottle of response.data) {
        if (!bottle.data?.content || bottle.data.content.dataType !== 'moveObject') {
          continue;
        }

        const fields = getObjectFields(bottle);
        if (!fields) continue;

        bottles.push({
          id: bottle.data.objectId,
          version: bottle.data.version,
          type: bottle.data.type!,
          fields,
        });
      }
    } catch (error) {
      console.error('Error fetching user bottles:', error);
    }

    return bottles;
  }

  /**
   * Get user tanks
   * @param address User address
   */
  async getUserTanks(address: string): Promise<UserTankList> {
    const tanks: UserTankList = [];

    try {
      const response = await this.client.getOwnedObjects({
        owner: address,
        filter: {
          MatchAny: [
            {
              StructType: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::tank::TankAdminCap',
            },
            {
              StructType: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::tank::ContributorToken',
            },
          ],
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      for (const tank of response.data) {
        if (!tank.data?.content || tank.data.content.dataType !== 'moveObject') {
          continue;
        }

        const fields = getObjectFields(tank);
        if (!fields) continue;

        tanks.push({
          id: tank.data.objectId,
          version: tank.data.version,
          type: tank.data.type!,
          fields,
        });
      }
    } catch (error) {
      console.error('Error fetching user tanks:', error);
    }

    return tanks;
  }

  /**
   * Get user LP proofs
   * @param address User address
   */
  async getUserLpProofs(address: string): Promise<UserLpList> {
    const lpProofs: UserLpList = [];

    try {
      const response = await this.client.getOwnedObjects({
        owner: address,
        filter: {
          MatchAny: [
            {
              StructType: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::fountain_core::StakeProof',
            },
            {
              StructType: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::fountain_core::StakeProofV2',
            },
          ],
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      for (const proof of response.data) {
        if (!proof.data?.content || proof.data.content.dataType !== 'moveObject') {
          continue;
        }

        const lpProof = lpProofToObject(proof);
        if (lpProof) {
          lpProofs.push(lpProof);
        }
      }
    } catch (error) {
      console.error('Error fetching user LP proofs:', error);
    }

    return lpProofs;
  }

  /**
   * Get user strap fountain positions
   * @param address User address
   */
  async getUserStrapPositions(address: string) {
    const positions: any[] = [];

    try {
      const strapFountainIds = Object.values(STRAP_FOUNTAIN_IDS);
      
      for (const strapInfo of strapFountainIds) {
        const response = await this.client.getOwnedObjects({
          owner: address,
          filter: {
            StructType: strapInfo.stakeProofType,
          },
          options: {
            showContent: true,
            showType: true,
          },
        });

        for (const position of response.data) {
          if (!position.data?.content || position.data.content.dataType !== 'moveObject') {
            continue;
          }

          const fields = getObjectFields(position);
          if (!fields) continue;

          positions.push({
            id: position.data.objectId,
            version: position.data.version,
            type: position.data.type!,
            fields,
            strapType: strapInfo.coinType,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user strap positions:', error);
    }

    return positions;
  }

  /**
   * Get user DeBut information
   * @param address User address
   */
  async getUserDeButInfo(address: string): Promise<UserDeButInfo> {
    try {
      const [positions, wrapper] = await Promise.all([
        getUserDeButPositions(this.client, address),
        getUserDeButWrapper(this.client, address),
      ]);

      return {
        positions,
        wrapper,
      };
    } catch (error) {
      console.error('Error fetching user DeBut info:', error);
      return {
        positions: [],
        wrapper: null,
      };
    }
  }

  /**
   * Get user's total collateral value across all positions
   * @param address User address
   */
  async getUserTotalCollateral(address: string): Promise<number> {
    try {
      const bottles = await this.getUserBottles(address);
      let totalCollateral = 0;

      for (const bottle of bottles) {
        if (bottle.fields.collateral_amount) {
          totalCollateral += parseFloat(bottle.fields.collateral_amount.toString());
        }
      }

      return totalCollateral;
    } catch (error) {
      console.error('Error calculating user total collateral:', error);
      return 0;
    }
  }

  /**
   * Get user's total debt across all positions
   * @param address User address
   */
  async getUserTotalDebt(address: string): Promise<number> {
    try {
      const bottles = await this.getUserBottles(address);
      let totalDebt = 0;

      for (const bottle of bottles) {
        if (bottle.fields.buck_amount) {
          totalDebt += parseFloat(bottle.fields.buck_amount.toString());
        }
      }

      return totalDebt;
    } catch (error) {
      console.error('Error calculating user total debt:', error);
      return 0;
    }
  }
}