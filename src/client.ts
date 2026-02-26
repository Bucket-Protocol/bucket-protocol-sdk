import { bcs } from '@mysten/sui/bcs';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import {
  Transaction,
  TransactionArgument,
  TransactionObjectArgument,
  TransactionResult,
} from '@mysten/sui/transactions';
import { normalizeStructTag, parseStructTag } from '@mysten/sui/utils';

import {
  AggregatorObjectInfo,
  ConfigType,
  FlashMintInfo,
  Network,
  PaginatedPositionsResult,
  PositionInfo,
  PsmPoolInfo,
  PsmPoolObjectInfo,
  SavingInfo,
  SavingPoolInfo,
  SavingPoolObjectInfo,
  TransactionNestedResult,
  VaultInfo,
  VaultObjectInfo,
} from '@/types/index.js';
import { CONFIG, DOUBLE_OFFSET, DUMMY_ADDRESS, FLOAT_OFFSET } from '@/consts/index.js';
import { coinWithBalance, destroyZeroCoin, getZeroCoin } from '@/utils/index.js';
import { buildPythPriceUpdateCalls, fetchPriceFeedsUpdateDataFromHermes, PythCache } from '@/utils/pyth.js';

import { VaultRewarder } from '@/_generated/bucket_v2_borrow_incentive/borrow_incentive.js';
import { PositionData, Vault } from '@/_generated/bucket_v2_cdp/vault.js';
import { Account } from '@/_generated/bucket_v2_framework/account.js';
import { Pool } from '@/_generated/bucket_v2_psm/pool.js';
import { Field } from '@/_generated/bucket_v2_saving_incentive/deps/sui/dynamic_field.js';
import { Rewarder, RewarderKey } from '@/_generated/bucket_v2_saving_incentive/saving_incentive.js';
import { SavingPool } from '@/_generated/bucket_v2_saving/saving.js';

import { GlobalConfig } from './_generated/bucket_v2_flash/config.js';
import {
  GCOIN_RULE_CONFIG,
  SCALLOP_MARKET,
  SCALLOP_VERSION,
  SCOIN_RULE_CONFIG,
  UNIHOUSE_OBJECT,
} from './consts/price.js';

const NETWORK_RPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
};

export class BucketClient {
  /**
   * @description a TypeScript wrapper over Bucket V2 client.
   * @param suiClient
   * @param network
   */
  private config: ConfigType;
  private suiClient: SuiGrpcClient;
  private pythCache = new PythCache();

  constructor({ suiClient, network = 'mainnet' }: { suiClient?: SuiGrpcClient; network?: Network }) {
    this.config = CONFIG[network];
    const rpcUrl = NETWORK_RPC_URLS[network] ?? NETWORK_RPC_URLS['mainnet']!;
    this.suiClient = suiClient ?? new SuiGrpcClient({ network, baseUrl: rpcUrl });
  }

  /* ----- Getter ----- */

  /**
   * @description Get this.suiClient
   */
  getSuiClient(): SuiGrpcClient {
    return this.suiClient;
  }

  /**
   * @description
   */
  async getConfig(): Promise<ConfigType | undefined> {
    return this.config;
  }

  /**
   * @description
   */
  getUsdbCoinType(): string {
    return `${this.config.ORIGINAL_USDB_PACKAGE_ID}::usdb::USDB`;
  }

  /**
   * @description Get all Oracle coin types
   */
  getAllOracleCoinTypes(): string[] {
    return Object.keys(this.config.AGGREGATOR_OBJS);
  }

  /**
   * @description Get all CDP collateral types
   */
  getAllCollateralTypes(): string[] {
    return Object.keys(this.config.VAULT_OBJS);
  }

  /**
   * @description
   */
  getAggregatorObjectInfo({ coinType }: { coinType: string }): AggregatorObjectInfo {
    const aggregatorInfo = this.config.AGGREGATOR_OBJS[normalizeStructTag(coinType)];

    if (!aggregatorInfo) {
      throw new Error('Unsupported coin type');
    }
    return aggregatorInfo;
  }

  /**
   * @description
   */
  getVaultObjectInfo({ coinType }: { coinType: string }): VaultObjectInfo {
    const vaultInfo = this.config.VAULT_OBJS[normalizeStructTag(coinType)];

    if (!vaultInfo) {
      throw new Error('Unsupported collateral type');
    }
    return vaultInfo;
  }

  /**
   * @description
   */
  getSavingPoolObjectInfo({ lpType }: { lpType: string }): SavingPoolObjectInfo {
    const savingPoolInfo = this.config.SAVING_POOL_OBJS[normalizeStructTag(lpType)];

    if (!savingPoolInfo) {
      throw new Error('Unsupported coin type');
    }
    return savingPoolInfo;
  }

  /**
   * @description
   */
  getPsmPoolObjectInfo({ coinType }: { coinType: string }): PsmPoolObjectInfo {
    const psmPoolInfo = this.config.PSM_POOL_OBJS[normalizeStructTag(coinType)];

    if (!psmPoolInfo) {
      throw new Error('Unsupported coin type');
    }
    return psmPoolInfo;
  }

  /* ----- Queries ----- */

  /**
   * @description
   */
  async getUsdbSupply(): Promise<bigint> {
    const tx = new Transaction();

    const treasury = tx.moveCall({
      target: `${this.config.USDB_PACKAGE_ID}::usdb::borrow_cap_mut`,
      arguments: [this.treasury(tx)],
    });
    tx.moveCall({
      target: `0x2::coin::total_supply`,
      typeArguments: [this.getUsdbCoinType()],
      arguments: [treasury],
    });
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    if (res.$kind === 'FailedTransaction' || !res.commandResults?.[1]?.returnValues) {
      return 0n;
    }
    return BigInt(bcs.u64().parse(res.commandResults![1].returnValues[0].bcs));
  }

  /**
   * @description
   */
  async getOraclePrices({ coinTypes }: { coinTypes: string[] }): Promise<Record<string, number>> {
    const tx = new Transaction();

    await this.aggregatePrices(tx, { coinTypes });

    tx.setSender(DUMMY_ADDRESS);

    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { events: true } });
    return ((res.Transaction ?? res.FailedTransaction)?.events ?? []).reduce((result, e) => {
      const typeStruct = parseStructTag(e.eventType);

      if (typeStruct.module !== 'aggregator' || typeStruct.name !== 'PriceAggregated') {
        return result;
      }
      const coinType = normalizeStructTag(typeStruct.typeParams[0]);

      return {
        ...result,
        [coinType]: Number(bcs.u128().parse(e.bcs.slice(-16))) / 10 ** 9,
      };
    }, {});
  }

  /**
   * @description
   */
  async getAllOraclePrices(): Promise<Record<string, number>> {
    const coinTypes = this.getAllOracleCoinTypes();

    return this.getOraclePrices({ coinTypes });
  }

  /**
   * @description
   */
  async getBorrowRewardFlowRate({ coinType }: { coinType: string }): Promise<Record<string, bigint>> {
    const vault = this.getVaultObjectInfo({ coinType });

    if (!vault.rewarders) {
      return {};
    }
    const rewardObjectIds = vault.rewarders.map((rewarder) => rewarder.rewarderId);

    const vaultRewardersRes = await this.suiClient.getObjects({
      objectIds: rewardObjectIds,
      include: {
        content: true,
      },
    });
    const rewarders = vaultRewardersRes.objects.map((object) => {
      if (object instanceof Error || !object.content) {
        throw new Error(`Failed to parse reward object for ${coinType}`);
      }
      return VaultRewarder.parse(object.content);
    });
    return vault.rewarders.reduce(
      (result, rewarder, idx) => ({
        ...result,
        [rewarder.rewardType]: BigInt(rewarders[idx].flow_rate.value),
      }),
      {} as Record<string, bigint>,
    );
  }

  /**
   * @description Get all vault objects
   */
  async getAllVaultObjects(): Promise<Record<string, VaultInfo>> {
    const vaultObjectIds = Object.values(this.config.VAULT_OBJS).map((v) => v.vault.objectId);
    const allCollateralTypes = this.getAllCollateralTypes();

    const res = await this.suiClient.getObjects({
      objectIds: vaultObjectIds,
      include: {
        content: true,
      },
    });
    const rewardFlowRates = await Promise.all(
      allCollateralTypes.map((coinType) => this.getBorrowRewardFlowRate({ coinType })),
    );
    return Object.keys(this.config.VAULT_OBJS).reduce(
      (result, collateralType, index) => {
        const object = res.objects[index];
        const flowRates = rewardFlowRates[index];

        if (object instanceof Error || !object.content) {
          throw new Error(`Failed to parse vault object`);
        }
        const vault = Vault.parse(object.content);
        const usdbSupply = BigInt(vault.limited_supply.supply);

        result[collateralType] = {
          collateralType,
          positionTableSize: +vault.position_table.size,
          collateralDecimal: +vault.decimal,
          collateralBalance: BigInt(vault.total_coll_amount),
          usdbSupply,
          maxUsdbSupply: BigInt(vault.limited_supply.limit),
          interestRate: Number((BigInt(vault.interest_rate.value) * 10000n) / DOUBLE_OFFSET) / 10000,
          minCollateralRatio: Number((BigInt(vault.min_collateral_ratio.value) * 10000n) / FLOAT_OFFSET) / 10000,
          rewardRate: Object.keys(flowRates).reduce(
            (result, rewardType) => ({
              ...result,
              [rewardType]: usdbSupply
                ? Number(((flowRates[rewardType] / usdbSupply) * 365n * 86400000n * 10000n) / DOUBLE_OFFSET) / 10000
                : Infinity,
            }),
            {},
          ),
        };
        return result;
      },
      {} as Record<string, VaultInfo>,
    );
  }

  /**
   * @description
   */
  async getSavingPoolRewardFlowRate({ lpType }: { lpType: string }): Promise<Record<string, bigint>> {
    const pool = this.getSavingPoolObjectInfo({ lpType });

    if (!pool.reward) {
      return {};
    }
    const rewardObjectIds = await this.suiClient
      .listDynamicFields({ parentId: pool.reward.rewardManager.objectId })
      .then((res) => res.dynamicFields.map((df) => df.fieldId));

    const savingPoolRewards = await this.suiClient.getObjects({
      objectIds: rewardObjectIds,
      include: {
        content: true,
      },
    });
    const rewarders = savingPoolRewards.objects.map((object) => {
      if (object instanceof Error || !object.content) {
        throw new Error(`Failed to parse reward object for ${lpType} SavingPool`);
      }
      return Field(RewarderKey, Rewarder).parse(object.content);
    });
    return pool.reward.rewardTypes.reduce(
      (result, rewardType, index) => ({
        ...result,
        [rewardType]: BigInt(rewarders[index].value.flow_rate.value),
      }),
      {} as Record<string, bigint>,
    );
  }

  /**
   * @description Get all Saving pool objects
   */
  async getAllSavingPoolObjects(): Promise<Record<string, SavingPoolInfo>> {
    const lpTypes = Object.keys(this.config.SAVING_POOL_OBJS);
    const poolObjectIds = Object.values(this.config.SAVING_POOL_OBJS).map((v) => v.pool.objectId);

    const res = await this.suiClient.getObjects({
      objectIds: poolObjectIds,
      include: {
        content: true,
      },
    });
    const rewardFlowRates = await Promise.all(lpTypes.map((lpType) => this.getSavingPoolRewardFlowRate({ lpType })));

    return Object.keys(this.config.SAVING_POOL_OBJS).reduce(
      (result, lpType, index) => {
        const object = res.objects[index];
        const flowRates = rewardFlowRates[index];

        if (object instanceof Error || !object.content) {
          throw new Error(`Failed to parse pool object`);
        }
        const pool = SavingPool.parse(object.content);
        const usdbBalance = BigInt(pool.usdb_reserve_balance.value);

        result[lpType] = {
          lpType,
          lpSupply: BigInt(pool.lp_supply.value),
          usdbBalance,
          usdbDepositCap: pool.deposit_cap_amount !== null ? BigInt(pool.deposit_cap_amount) : null,
          savingRate: Number((BigInt(pool.saving_config.saving_rate.value) * 10000n) / DOUBLE_OFFSET) / 10000,
          rewardRate: Object.keys(flowRates).reduce(
            (result, rewardType) => ({
              ...result,
              [rewardType]: usdbBalance
                ? Number(((flowRates[rewardType] / usdbBalance) * 365n * 86400000n * 10000n) / DOUBLE_OFFSET) / 10000
                : Infinity,
            }),
            {},
          ),
        };
        return result;
      },
      {} as Record<string, SavingPoolInfo>,
    );
  }

  /**
   * @description Get all PSM pool objects
   */
  async getAllPsmPoolObjects(): Promise<Record<string, PsmPoolInfo>> {
    const poolObjectIds = Object.values(this.config.PSM_POOL_OBJS).map((v) => v.pool.objectId);

    const res = await this.suiClient.getObjects({
      objectIds: poolObjectIds,
      include: {
        content: true,
      },
    });
    return Object.keys(this.config.PSM_POOL_OBJS).reduce(
      (result, coinType, index) => {
        const object = res.objects[index];

        if (object instanceof Error || !object.content) {
          throw new Error(`Failed to parse pool object`);
        }
        const pool = Pool.parse(object.content);

        result[coinType] = {
          coinType,
          decimal: +pool.decimal,
          balance: BigInt(pool.balance_amount),
          usdbSupply: BigInt(pool.usdb_supply),
          feeRate: {
            swapIn: Number((BigInt(pool.default_fee_config.swap_in_fee_rate.value) * 10000n) / FLOAT_OFFSET) / 10000,
            swapOut: Number((BigInt(pool.default_fee_config.swap_out_fee_rate.value) * 10000n) / FLOAT_OFFSET) / 10000,
          },
          partnerFeeRate: pool.partner_fee_configs.contents.reduce<PsmPoolInfo['partnerFeeRate']>(
            (result, { key, value }) => {
              result[key] = {
                swapIn: Number((BigInt(value.swap_in_fee_rate.value) * 10000n) / FLOAT_OFFSET) / 10000,
                swapOut: Number((BigInt(value.swap_out_fee_rate.value) * 10000n) / FLOAT_OFFSET) / 10000,
              };
              return result;
            },
            {},
          ),
        };
        return result;
      },
      {} as Record<string, PsmPoolInfo>,
    );
  }

  /**
   * @description
   */
  async getFlashMintInfo(): Promise<FlashMintInfo> {
    const data = await this.suiClient.getObject({
      objectId: this.config.FLASH_GLOBAL_CONFIG_OBJ.objectId,
      include: {
        content: true,
      },
    });
    if (!data.object.content) {
      throw new Error(`Failed to parse pool object`);
    }
    const flashConfig = GlobalConfig.parse(data.object.content);

    return {
      feeRate: Number((BigInt(flashConfig.default_config.fee_rate.value) * 100000n) / FLOAT_OFFSET) / 100000,
      partner: flashConfig.partner_configs.contents.reduce<Record<string, number>>(
        (result, { key, value }) => ({
          ...result,
          [key]: Number((BigInt(value.fee_rate.value) * 100000n) / FLOAT_OFFSET) / 100000,
        }),
        {},
      ),
    };
  }

  /**
   * @description Get all positions by collateral with pagination
   */
  async getAllPositions({
    coinType,
    pageSize = 50,
    cursor,
  }: {
    coinType: string;
    pageSize?: number;
    cursor?: string | null;
  }): Promise<PaginatedPositionsResult> {
    const tx = new Transaction();

    tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::get_positions`,
      typeArguments: [coinType],
      arguments: [
        this.vault(tx, { coinType }),
        tx.object.clock(),
        tx.pure.option('address', cursor),
        tx.pure.u64(pageSize),
      ],
    });
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    if (res.$kind === 'FailedTransaction' || !res.commandResults?.[0]?.returnValues) {
      return {
        positions: [],
        nextCursor: null,
      };
    }
    const [positionBytes, nextCursorBytes] = res.commandResults![0].returnValues;

    return {
      positions: bcs
        .vector(PositionData)
        .parse(positionBytes ? positionBytes.bcs : new Uint8Array())
        .map((pos) => ({
          collateralType: coinType,
          collateralAmount: BigInt(pos.coll_amount),
          debtAmount: BigInt(pos.debt_amount),
          debtor: pos.debtor,
        })),
      nextCursor: bcs.option(bcs.Address).parse(nextCursorBytes ? nextCursorBytes.bcs : new Uint8Array()),
    };
  }

  /**
   * @description
   */
  async getUserAccounts({ address }: { address: string }) {
    const accountRes = await this.suiClient.listOwnedObjects({
      owner: address,
      type: `${this.config.ORIGINAL_FRAMEWORK_PACKAGE_ID}::account::Account`,
      include: {
        content: true,
      },
    });
    return accountRes.objects.map((account) => {
      if (!account.content) {
        throw new Error(`Failed to parse account object for ${address}`);
      }
      return Account.parse(account.content);
    });
  }

  /**
   * @description Get debtor's borrow rewards of given collateral coin type
   */
  async getAccountBorrowRewards({
    address,
    accountId,
    coinTypes,
  }: {
    address: string;
    accountId?: string;
    coinTypes: string[];
  }): Promise<Record<string, Record<string, bigint>>> {
    const tx = new Transaction();

    coinTypes.forEach((coinType) => {
      const vaultInfo = this.getVaultObjectInfo({ coinType });

      if (!vaultInfo.rewarders) {
        return;
      }
      vaultInfo.rewarders.forEach((rewarder) => {
        tx.moveCall({
          target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::realtime_reward_amount`,
          typeArguments: [coinType, rewarder.rewardType],
          arguments: [
            tx.object(rewarder.rewarderId),
            tx.sharedObjectRef(vaultInfo.vault),
            tx.pure.address(accountId ?? address),
            tx.object.clock(),
          ],
        });
      });
    });
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    if (res.$kind === 'FailedTransaction' || !res.commandResults) {
      return {};
    }
    return coinTypes.reduce((result, coinType) => {
      const vaultInfo = this.getVaultObjectInfo({ coinType });

      if (!vaultInfo.rewarders?.length) {
        return result;
      }
      const responses = res.commandResults!.splice(0, vaultInfo.rewarders.length);

      return {
        ...result,
        [coinType]: vaultInfo.rewarders.reduce((result, rewarder, index) => {
          if (!responses[index]?.returnValues) {
            return result;
          }
          const realtimeReward = bcs.u64().parse(responses[index].returnValues[0].bcs);

          return { ...result, [rewarder.rewardType]: BigInt(realtimeReward) };
        }, {}),
      };
    }, {});
  }

  /**
   * @description Get position data given account (can be wallet address or Account object ID)
   */
  async getAccountPositions({ address, accountId }: { address: string; accountId?: string }): Promise<PositionInfo[]> {
    const tx = new Transaction();
    const allCollateralTypes = this.getAllCollateralTypes();

    allCollateralTypes.forEach((coinType) => {
      const vaultInfo = this.getVaultObjectInfo({ coinType });

      tx.moveCall({
        target: `${this.config.CDP_PACKAGE_ID}::vault::try_get_position_data`,
        typeArguments: [coinType],
        arguments: [tx.sharedObjectRef(vaultInfo.vault), tx.pure.address(accountId ?? address), tx.object.clock()],
      });
    });
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    if (res.$kind === 'FailedTransaction' || !res.commandResults) {
      return [];
    }
    const borrowRewards = await this.getAccountBorrowRewards({ address, accountId, coinTypes: allCollateralTypes });

    return allCollateralTypes.reduce((result, coinType, index) => {
      if (!res.commandResults?.[index]?.returnValues) {
        return result;
      }
      const collateralAmount = BigInt(bcs.u64().parse(res.commandResults[index].returnValues[0].bcs));
      const debtAmount = BigInt(bcs.u64().parse(res.commandResults[index].returnValues[1].bcs));
      const hasReward = borrowRewards[coinType] && Object.values(borrowRewards[coinType]).some((reward) => reward);

      if (collateralAmount || debtAmount || hasReward) {
        result.push({
          collateralType: coinType,
          collateralAmount,
          debtAmount,
          debtor: address,
          accountId,
          rewards: borrowRewards[coinType] ?? {},
        });
      }
      return result;
    }, [] as PositionInfo[]);
  }

  /**
   * @description Get position data given wallet address
   */
  async getUserPositions({ address }: { address: string }): Promise<PositionInfo[]> {
    const accounts = await this.getUserAccounts({ address });
    const accountObjectIds = accounts.map((account) => account.id.id);

    const positionsForAccount = await Promise.all([
      this.getAccountPositions({ address }),
      ...accountObjectIds.map((accountId) => this.getAccountPositions({ address, accountId })),
    ]);
    return positionsForAccount.flat();
  }

  /**
   * @description
   */
  async getAccountSavingPoolRewards({
    address,
    accountId,
    lpTypes,
  }: {
    address: string;
    accountId?: string;
    lpTypes: string[];
  }): Promise<Record<string, Record<string, bigint>>> {
    const tx = new Transaction();

    lpTypes.forEach((lpType) => {
      const poolInfo = this.getSavingPoolObjectInfo({ lpType });

      if (!poolInfo.reward) {
        return;
      }
      poolInfo.reward.rewardTypes.forEach((rewardType) => {
        const rewarder = tx.moveCall({
          target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::get_rewarder`,
          typeArguments: [lpType, rewardType],
          arguments: [tx.sharedObjectRef(poolInfo.reward!.rewardManager)],
        });
        tx.moveCall({
          target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::realtime_reward_amount`,
          typeArguments: [lpType, rewardType],
          arguments: [
            rewarder,
            tx.sharedObjectRef(poolInfo.pool),
            tx.pure.address(accountId ?? address),
            tx.object.clock(),
          ],
        });
      });
    });
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    if (res.$kind === 'FailedTransaction' || !res.commandResults) {
      return {};
    }
    return lpTypes.reduce((result, lpType) => {
      const poolInfo = this.getSavingPoolObjectInfo({ lpType });

      if (!poolInfo.reward?.rewardTypes?.length) {
        return result;
      }
      const responses = res.commandResults!.splice(0, 2 * poolInfo.reward.rewardTypes.length);

      return {
        ...result,
        [lpType]: poolInfo.reward.rewardTypes.reduce((result, rewardType, index) => {
          if (!responses[index]?.returnValues) {
            return result;
          }
          const realtimeReward = bcs.u64().parse(responses[index + 1].returnValues[0].bcs);

          return { ...result, [rewardType]: BigInt(realtimeReward) };
        }, {}),
      };
    }, {});
  }

  /**
   * @description
   */
  async getAccountSavings({ address, accountId }: { address: string; accountId?: string }): Promise<SavingInfo[]> {
    const lpTypes = Object.keys(this.config.SAVING_POOL_OBJS);

    const tx = new Transaction();

    lpTypes.map((lpType) => {
      tx.moveCall({
        target: `${this.config.SAVING_PACKAGE_ID}::saving::lp_token_value_of`,
        typeArguments: [lpType],
        arguments: [this.savingPoolObj(tx, { lpType }), tx.pure.address(accountId ?? address), tx.object.clock()],
      });
      tx.moveCall({
        target: `${this.config.SAVING_PACKAGE_ID}::saving::lp_balance_of`,
        typeArguments: [lpType],
        arguments: [this.savingPoolObj(tx, { lpType }), tx.pure.address(accountId ?? address)],
      });
    });
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    const savingRewards = await this.getAccountSavingPoolRewards({ lpTypes, address, accountId });

    return lpTypes.reduce((result, lpType, index) => {
      if (!res.commandResults?.[2 * index]?.returnValues || !res.commandResults?.[2 * index + 1]?.returnValues) {
        return result;
      }
      const usdbBalance = BigInt(bcs.u64().parse(res.commandResults![2 * index].returnValues[0].bcs));
      const lpBalance = BigInt(bcs.u64().parse(res.commandResults![2 * index + 1].returnValues[0].bcs));
      const hasReward = savingRewards[lpType] && Object.values(savingRewards[lpType]).every((reward) => reward);

      if (usdbBalance || lpBalance || hasReward) {
        result.push({
          lpType,
          address,
          accountId,
          usdbBalance,
          lpBalance,
          rewards: savingRewards[lpType],
        });
      }
      return result;
    }, [] as SavingInfo[]);
  }

  /**
   * @description Get position data given wallet address
   */
  async getUserSavings({ address }: { address: string }): Promise<SavingInfo[]> {
    const accounts = await this.getUserAccounts({ address });
    const accountObjectIds = accounts.map((account) => account.id.id);

    const savingsForAccount = await Promise.all([
      this.getAccountSavings({ address }),
      ...accountObjectIds.map((accountId) => this.getAccountSavings({ address, accountId })),
    ]);
    return savingsForAccount.flat();
  }

  /* ----- Transaction Methods ----- */

  /**
   * @description
   */
  treasury(tx: Transaction) {
    return tx.sharedObjectRef(this.config.TREASURY_OBJ);
  }

  /**
   * @description
   */
  vaultRewarderRegistry(tx: Transaction) {
    return tx.sharedObjectRef(this.config.VAULT_REWARDER_REGISTRY);
  }

  /**
   * @description
   */
  savingPoolGlobalConfig(tx: Transaction) {
    return tx.sharedObjectRef(this.config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ);
  }

  /**
   * @description
   */
  flashGlobalConfig(tx: Transaction) {
    return tx.sharedObjectRef(this.config.FLASH_GLOBAL_CONFIG_OBJ);
  }

  /**
   * @description
   */
  aggregator(tx: Transaction, { coinType }: { coinType: string }) {
    const vaultInfo = this.getAggregatorObjectInfo({ coinType });

    return tx.sharedObjectRef(vaultInfo.priceAggregator);
  }

  /**
   * @description
   */
  vault(tx: Transaction, { coinType }: { coinType: string }) {
    const vaultInfo = this.getVaultObjectInfo({ coinType });

    return tx.sharedObjectRef(vaultInfo.vault);
  }

  /**
   * @description
   */
  savingPoolObj(tx: Transaction, { lpType }: { lpType: string }) {
    const savingPoolInfo = this.getSavingPoolObjectInfo({ lpType });

    return tx.sharedObjectRef(savingPoolInfo.pool);
  }

  /**
   * @description
   */
  psmPoolObj(tx: Transaction, { coinType }: { coinType: string }) {
    const psmPoolInfo = this.getPsmPoolObjectInfo({ coinType });

    return tx.sharedObjectRef(psmPoolInfo.pool);
  }

  accountAddress(
    tx: Transaction,
    {
      address,
      accountObjectOrId,
    }: {
      address: string;
      accountObjectOrId?: string | TransactionArgument;
    },
  ): TransactionArgument {
    if (accountObjectOrId) {
      return typeof accountObjectOrId === 'string'
        ? tx.pure.address(accountObjectOrId)
        : tx.moveCall({
            target: `${this.config.FRAMEWORK_PACKAGE_ID}::account::account_address`,
            arguments: [accountObjectOrId],
          });
    }
    return tx.pure.address(address);
  }

  /**
   * @description Create a AccountRequest
   * @param accountObjectOrId (optional): Account object or EOA if undefined
   * @return AccountRequest
   */
  newAccountRequest(
    tx: Transaction,
    { accountObjectOrId }: { accountObjectOrId?: string | TransactionArgument },
  ): TransactionResult {
    return accountObjectOrId
      ? tx.moveCall({
          target: `${this.config.FRAMEWORK_PACKAGE_ID}::account::request_with_account`,
          arguments: [typeof accountObjectOrId === 'string' ? tx.object(accountObjectOrId) : accountObjectOrId],
        })
      : tx.moveCall({
          target: `${this.config.FRAMEWORK_PACKAGE_ID}::account::request`,
        });
  }

  /**
   * @description Create a price collector
   * @param collateral coin type, e.g "0x2::sui::SUI"
   * @return PriceCollector
   */
  newPriceCollector(tx: Transaction, { coinType }: { coinType: string }): TransactionResult {
    return tx.moveCall({
      target: `${this.config.ORACLE_PACKAGE_ID}::collector::new`,
      typeArguments: [coinType],
    });
  }

  /**
   * @description Get a basic (not derivative) price result
   * @param collateral coin type, e.g "0x2::sui::SUI"
   * @return [PriceResult]
   */
  async aggregateBasicPrices(tx: Transaction, { coinTypes }: { coinTypes: string[] }): Promise<TransactionResult[]> {
    if (!coinTypes.length) {
      return [];
    }
    const pythPriceIds = coinTypes.map((coinType) => {
      const aggregator = this.getAggregatorObjectInfo({ coinType });

      if (!('pythPriceId' in aggregator)) {
        throw new Error(`${coinType} has no basic price`);
      }
      return aggregator.pythPriceId;
    });
    const updateData = await fetchPriceFeedsUpdateDataFromHermes(this.config.PRICE_SERVICE_ENDPOINT, pythPriceIds);
    const priceInfoObjIds = await buildPythPriceUpdateCalls(
      tx,
      this.suiClient,
      {
        pythStateId: this.config.PYTH_STATE_ID,
        wormholeStateId: this.config.WORMHOLE_STATE_ID,
      },
      updateData,
      pythPriceIds,
      this.pythCache,
    );

    return coinTypes.map((coinType, index) => {
      const collector = this.newPriceCollector(tx, { coinType });

      tx.moveCall({
        target: `${this.config.PYTH_RULE_PACKAGE_ID}::pyth_rule::feed`,
        typeArguments: [coinType],
        arguments: [
          collector,
          tx.sharedObjectRef(this.config.PYTH_RULE_CONFIG_OBJ),
          tx.object.clock(),
          tx.object(this.config.PYTH_STATE_ID),
          tx.object(priceInfoObjIds[index]!),
        ],
      });
      const priceResult = tx.moveCall({
        target: `${this.config.ORACLE_PACKAGE_ID}::aggregator::aggregate`,
        typeArguments: [coinType],
        arguments: [tx.sharedObjectRef(this.getAggregatorObjectInfo({ coinType }).priceAggregator), collector],
      });
      return priceResult;
    });
  }

  /**
   * @description
   */
  private getDerivativePrice(
    tx: Transaction,
    {
      coinType,
      underlyingPriceResult,
    }: {
      coinType: string;
      underlyingPriceResult: TransactionArgument;
    },
  ): TransactionResult {
    const aggregator = this.getAggregatorObjectInfo({ coinType });

    if (!('derivativeInfo' in aggregator)) {
      throw new Error(`${coinType} has no derivative info`);
    }
    const { priceAggregator, derivativeInfo } = aggregator;
    const collector = this.newPriceCollector(tx, { coinType });

    switch (derivativeInfo.derivativeKind) {
      case 'sCoin':
        tx.moveCall({
          target: '0x2252a1cc5a16a0c9f4530005908cced53783d96b4932ca3fa15b1fe9d5935972::scoin_rule::feed',
          typeArguments: [coinType, derivativeInfo.underlyingCoinType],
          arguments: [
            collector,
            tx.sharedObjectRef(SCOIN_RULE_CONFIG),
            underlyingPriceResult,
            tx.sharedObjectRef(SCALLOP_VERSION),
            tx.sharedObjectRef(SCALLOP_MARKET),
            tx.object.clock(),
          ],
        });
        break;
      case 'gCoin':
        tx.moveCall({
          target: '0xba3c970933047c6e235424d7040a9a4e89d8fc1200d780a69b2666434f3a7313::gcoin_rule::feed',
          typeArguments: [coinType, derivativeInfo.underlyingCoinType],
          arguments: [
            collector,
            underlyingPriceResult,
            tx.sharedObjectRef(GCOIN_RULE_CONFIG),
            tx.sharedObjectRef(UNIHOUSE_OBJECT),
          ],
        });
        break;
      case 'BFBTC':
        tx.moveCall({
          target: '0x6043cfb7e941a06526ed11e396d305ea547f55c55ae0e140d78652e8637ff60e::bfbtc_rule::feed',
          typeArguments: [derivativeInfo.underlyingCoinType],
          arguments: [
            collector,
            underlyingPriceResult,
            tx.object('0x05b526a3cb659b9074d3f3f84f10ee19971c4b7cf15e9079da084f9edcf835e6'),
          ],
        });
    }
    return tx.moveCall({
      target: `${this.config.ORACLE_PACKAGE_ID}::aggregator::aggregate`,
      typeArguments: [coinType],
      arguments: [tx.sharedObjectRef(priceAggregator), collector],
    });
  }

  /**
   * @description
   */
  async aggregatePrices(tx: Transaction, { coinTypes }: { coinTypes: string[] }): Promise<TransactionResult[]> {
    const allBasicCoinTypes = Array.from(
      new Set(
        coinTypes.map((coinType) => {
          const aggregator = this.getAggregatorObjectInfo({ coinType });

          return 'pythPriceId' in aggregator ? coinType : aggregator.derivativeInfo.underlyingCoinType;
        }),
      ),
    );
    const basicPriceResults = await this.aggregateBasicPrices(tx, { coinTypes: allBasicCoinTypes });

    const priceResults = Object.fromEntries(
      allBasicCoinTypes.map((coinType, index) => [coinType, basicPriceResults[index]]),
    );
    // deal with exchange rate
    coinTypes.forEach((coinType) => {
      const aggregator = this.getAggregatorObjectInfo({ coinType });

      if (!('derivativeInfo' in aggregator)) {
        return;
      }
      const { underlyingCoinType } = aggregator.derivativeInfo;

      priceResults[coinType] = this.getDerivativePrice(tx, {
        coinType,
        underlyingPriceResult: priceResults[underlyingCoinType],
      });
    });
    return coinTypes.map((coinType) => priceResults[coinType]);
  }

  /**
   * @description Get a request to Mange Position
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param depositCoin: collateral input coin
   * @param borrowAmount: the amount to borrow
   * @param withdrawAmount: the amount to withdraw
   * @param repayCoin: repay input coin (always USDB)
   * @param accountObjectOrId (optional): account object id or transaction argument
   * @returns UpdateRequest
   */
  debtorRequest(
    tx: Transaction,
    {
      accountObjectOrId,
      coinType,
      depositCoin = getZeroCoin(tx, { coinType: coinType }),
      borrowAmount = 0,
      repayCoin = getZeroCoin(tx, { coinType: this.getUsdbCoinType() }),
      withdrawAmount = 0,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
      depositCoin?: TransactionArgument;
      borrowAmount?: number | TransactionArgument;
      repayCoin?: TransactionArgument;
      withdrawAmount?: number | TransactionArgument;
    },
  ): TransactionResult {
    const accountReq = this.newAccountRequest(tx, { accountObjectOrId });

    return tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::debtor_request`,
      typeArguments: [coinType],
      arguments: [
        this.vault(tx, { coinType }),
        accountReq,
        this.treasury(tx),
        depositCoin,
        typeof borrowAmount === 'number' ? tx.pure.u64(borrowAmount) : borrowAmount,
        repayCoin,
        typeof withdrawAmount === 'number' ? tx.pure.u64(withdrawAmount) : withdrawAmount,
      ],
    });
  }

  /**
   * @description check and destroy UpdateResponse
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param response: UpdateResponse generated by update_position
   */
  checkUpdatePositionRequest(
    tx: Transaction,
    { coinType, request }: { coinType: string; request: TransactionArgument },
  ): TransactionResult {
    const vaultObj = this.vault(tx, { coinType });
    const rewarders = this.getVaultObjectInfo({ coinType }).rewarders;
    const registryObj = tx.sharedObjectRef(this.config.VAULT_REWARDER_REGISTRY);
    const checker = tx.moveCall({
      target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::new_checker`,
      typeArguments: [coinType],
      arguments: [registryObj, request],
    });
    (rewarders ?? []).map((rewarder) => {
      tx.moveCall({
        target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::update`,
        typeArguments: [coinType, rewarder.rewardType],
        arguments: [registryObj, checker, vaultObj, tx.object(rewarder.rewarderId), tx.object.clock()],
      });
    });
    const updateRequest = tx.moveCall({
      target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::destroy_checker`,
      typeArguments: [coinType],
      arguments: [registryObj, checker],
    });
    tx.moveCall({
      target: `${this.config.BLACKLIST_PACKAGE_ID}::blacklist_rule::check`,
      typeArguments: [coinType],
      arguments: [tx.sharedObjectRef(this.config.BLACKLIST_OBJ), updateRequest],
    });
    return updateRequest;
  }

  /**
   * @description Manage Position
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param updateRequest: manager request, ex: see this.debtorRequest
   * @param priceResult: price result, see this.aggregatePrice
   * @returns [Coin<T>, COIN<USDB>, UpdateResponse]
   */
  updatePosition(
    tx: Transaction,
    {
      coinType,
      updateRequest,
      priceResult,
    }: {
      coinType: string;
      updateRequest: TransactionArgument;
      priceResult?: TransactionArgument;
    },
  ): TransactionNestedResult[] {
    const priceResultType = `${this.config.ORIGINAL_ORACLE_PACKAGE_ID}::result::PriceResult<${coinType}>`;
    const priceResultOpt = priceResult
      ? tx.moveCall({
          target: `0x1::option::some`,
          typeArguments: [priceResultType],
          arguments: [priceResult],
        })
      : tx.moveCall({
          target: `0x1::option::none`,
          typeArguments: [priceResultType],
        });
    const [inputCoin, usdbCoin, response] = tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::update_position`,
      typeArguments: [coinType],
      arguments: [this.vault(tx, { coinType }), this.treasury(tx), tx.object.clock(), priceResultOpt, updateRequest],
    });
    return [inputCoin, usdbCoin, response];
  }

  /**
   * @description check and destroy UpdateResponse
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param response: UpdateResponse generated by update_position
   */
  checkUpdatePositionResponse(
    tx: Transaction,
    { coinType, response }: { coinType: string; response: TransactionArgument },
  ): void {
    tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::destroy_response`,
      typeArguments: [coinType],
      arguments: [this.vault(tx, { coinType }), this.treasury(tx), response],
    });
  }

  /**
   * @description
   */
  savingPoolDeposit(
    tx: Transaction,
    {
      address,
      accountObjectOrId,
      lpType,
      usdbCoin,
    }: {
      address: string;
      accountObjectOrId?: string | TransactionArgument;
      lpType: string;
      usdbCoin: TransactionArgument;
    },
  ): TransactionResult {
    const depositResponse = tx.moveCall({
      target: `${this.config.SAVING_PACKAGE_ID}::saving::deposit`,
      typeArguments: [lpType],
      arguments: [
        this.savingPoolObj(tx, { lpType }),
        this.treasury(tx),
        this.accountAddress(tx, { address, accountObjectOrId }),
        usdbCoin,
        tx.object.clock(),
      ],
    });
    return depositResponse;
  }

  /**
   * @description
   */
  private updateSavingPoolIncentiveDepositAction(
    tx: Transaction,
    {
      lpType,
      depositResponse,
    }: {
      lpType: string;
      depositResponse: TransactionArgument;
    },
  ): TransactionResult {
    const savingPool = this.getSavingPoolObjectInfo({ lpType });

    if (!savingPool.reward) {
      throw new Error(`No rewards for ${lpType}`);
    }
    const depositChecker = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::new_checker_for_deposit_action`,
      typeArguments: [lpType],
      arguments: [
        tx.sharedObjectRef(savingPool.reward.rewardManager),
        this.savingPoolGlobalConfig(tx),
        depositResponse,
      ],
    });
    savingPool.reward.rewardTypes.forEach((rewardType) => {
      tx.moveCall({
        target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::update_deposit_action`,
        typeArguments: [lpType, rewardType],
        arguments: [
          depositChecker,
          this.savingPoolGlobalConfig(tx),
          tx.sharedObjectRef(savingPool.reward!.rewardManager),
          tx.sharedObjectRef(savingPool.pool),
          tx.object.clock(),
        ],
      });
    });
    const finalResponse = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::destroy_deposit_checker`,
      typeArguments: [lpType],
      arguments: [depositChecker, this.savingPoolGlobalConfig(tx)],
    });
    return finalResponse;
  }

  /**
   * @description
   */
  checkDepositResponse(
    tx: Transaction,
    {
      lpType,
      depositResponse,
    }: {
      lpType: string;
      depositResponse: TransactionArgument;
    },
  ): void {
    tx.moveCall({
      target: `${this.config.SAVING_PACKAGE_ID}::saving::check_deposit_response`,
      typeArguments: [lpType],
      arguments: [
        this.updateSavingPoolIncentiveDepositAction(tx, { lpType, depositResponse }),
        this.savingPoolObj(tx, { lpType }),
        this.treasury(tx),
      ],
    });
  }

  /**
   * @description
   */
  savingPoolWithdraw(
    tx: Transaction,
    {
      accountObjectOrId,
      lpType,
      amount,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      lpType: string;
      amount: number;
    },
  ): [TransactionNestedResult, TransactionNestedResult] {
    const accountReq = this.newAccountRequest(tx, { accountObjectOrId });

    const [usdbCoin, withdrawResponse] = tx.moveCall({
      target: `${this.config.SAVING_PACKAGE_ID}::saving::withdraw`,
      typeArguments: [lpType],
      arguments: [
        this.savingPoolObj(tx, { lpType }),
        this.treasury(tx),
        accountReq,
        tx.pure.u64(amount),
        tx.object.clock(),
      ],
    });
    return [usdbCoin, withdrawResponse];
  }

  /**
   * @description
   */
  private updateSavingPoolIncentiveWithdrawAction(
    tx: Transaction,
    {
      lpType,
      withdrawResponse,
    }: {
      lpType: string;
      withdrawResponse: TransactionArgument;
    },
  ): TransactionResult {
    const savingPool = this.getSavingPoolObjectInfo({ lpType });

    if (!savingPool.reward) {
      throw new Error(`No rewards for ${lpType}`);
    }
    const withdrawChecker = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::new_checker_for_withdraw_action`,
      typeArguments: [lpType],
      arguments: [
        tx.sharedObjectRef(savingPool.reward.rewardManager),
        this.savingPoolGlobalConfig(tx),
        withdrawResponse,
      ],
    });
    savingPool.reward.rewardTypes.forEach((rewardType) => {
      tx.moveCall({
        target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::update_withdraw_action`,
        typeArguments: [lpType, rewardType],
        arguments: [
          withdrawChecker,
          this.savingPoolGlobalConfig(tx),
          tx.sharedObjectRef(savingPool.reward!.rewardManager),
          tx.sharedObjectRef(savingPool.pool),
          tx.object.clock(),
        ],
      });
    });
    const finalResponse = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::destroy_withdraw_checker`,
      typeArguments: [lpType],
      arguments: [withdrawChecker, this.savingPoolGlobalConfig(tx)],
    });
    return finalResponse;
  }

  /**
   * @description
   */
  checkWithdrawResponse(
    tx: Transaction,
    {
      lpType,
      withdrawResponse,
    }: {
      lpType: string;
      withdrawResponse: TransactionArgument;
    },
  ): void {
    tx.moveCall({
      target: `${this.config.SAVING_PACKAGE_ID}::saving::check_withdraw_response`,
      typeArguments: [lpType],
      arguments: [
        this.updateSavingPoolIncentiveWithdrawAction(tx, { lpType, withdrawResponse }),
        this.savingPoolObj(tx, { lpType }),
        this.treasury(tx),
      ],
    });
  }

  /**
   * @description
   */
  claimPoolIncentive(
    tx: Transaction,
    {
      accountObjectOrId,
      lpType,
      rewardType,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      lpType: string;
      rewardType: string;
    },
  ): TransactionResult {
    const savingPool = this.getSavingPoolObjectInfo({ lpType });

    if (!savingPool.reward) {
      return getZeroCoin(tx, { coinType: rewardType });
    }
    const accountReq = this.newAccountRequest(tx, { accountObjectOrId });

    const rewardCoin = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::claim`,
      typeArguments: [lpType, rewardType],
      arguments: [
        tx.sharedObjectRef(savingPool.reward.rewardManager),
        this.savingPoolGlobalConfig(tx),
        tx.sharedObjectRef(savingPool.pool),
        accountReq,
        tx.object.clock(),
      ],
    });
    return rewardCoin;
  }

  /**
   * @description
   */
  psmSwapIn(
    tx: Transaction,
    {
      accountObjectOrId,
      coinType,
      priceResult,
      inputCoin,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
      priceResult: TransactionArgument;
      inputCoin: TransactionArgument;
    },
  ): TransactionResult {
    const partner = tx.object.option({
      type: `${this.config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: this.newAccountRequest(tx, { accountObjectOrId }),
    });
    const usdbCoin = tx.moveCall({
      target: `${this.config.PSM_PACKAGE_ID}::pool::swap_in`,
      typeArguments: [coinType],
      arguments: [this.psmPoolObj(tx, { coinType }), this.treasury(tx), priceResult, inputCoin, partner],
    });
    return usdbCoin;
  }

  /**
   * @description
   */
  psmSwapOut(
    tx: Transaction,
    {
      accountObjectOrId,
      coinType,
      priceResult,
      usdbCoin,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
      priceResult: TransactionArgument;
      usdbCoin: TransactionArgument;
    },
  ): TransactionResult {
    const partner = tx.object.option({
      type: `${this.config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: this.newAccountRequest(tx, { accountObjectOrId }),
    });
    const inputCoin = tx.moveCall({
      target: `${this.config.PSM_PACKAGE_ID}::pool::swap_out`,
      typeArguments: [coinType],
      arguments: [this.psmPoolObj(tx, { coinType }), this.treasury(tx), priceResult, usdbCoin, partner],
    });
    return inputCoin;
  }

  /**
   * @description
   */
  flashMint(
    tx: Transaction,
    {
      accountObjectOrId,
      amount,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      amount: number | TransactionArgument;
    },
  ): [TransactionNestedResult, TransactionNestedResult] {
    const partner = tx.object.option({
      type: `${this.config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: this.newAccountRequest(tx, { accountObjectOrId }),
    });
    const [usdbCoin, flashMintReceipt] = tx.moveCall({
      target: `${this.config.FLASH_PACKAGE_ID}::config::flash_mint`,
      arguments: [
        this.flashGlobalConfig(tx),
        this.treasury(tx),
        partner,
        typeof amount === 'number' ? tx.pure.u64(amount) : amount,
      ],
    });
    return [usdbCoin, flashMintReceipt];
  }

  /**
   * @description
   */
  flashBurn(
    tx: Transaction,
    {
      usdbCoin,
      flashMintReceipt,
    }: {
      usdbCoin: TransactionArgument;
      flashMintReceipt: TransactionArgument;
    },
  ): void {
    tx.moveCall({
      target: `${this.config.FLASH_PACKAGE_ID}::config::flash_burn`,
      arguments: [this.flashGlobalConfig(tx), this.treasury(tx), usdbCoin, flashMintReceipt],
    });
  }

  /* ----- Transaction Builders ----- */

  /**
   * @description build and return Transaction of manage position
   * @param accountObjectOrId: the Account object to hold position (undefined if just use EOA)
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param depositAmount: how much amount to deposit (collateral)
   * @param borrowAmount: how much amount to borrow (USDB)
   * @param repayAmount: how much amount to repay (USDB)
   * @param withdrawAmount: how much amount to withdraw (collateral)
   * @param recipient (optional): the recipient of the output coins
   * @returns Transaction
   */
  async buildManagePositionTransaction(
    tx: Transaction,
    {
      accountObjectOrId,
      coinType,
      depositCoinOrAmount = 0,
      borrowAmount = 0,
      repayCoinOrAmount = 0,
      withdrawAmount = 0,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
      depositCoinOrAmount?: number | TransactionArgument;
      borrowAmount?: number | TransactionArgument;
      repayCoinOrAmount?: number | TransactionArgument;
      withdrawAmount?: number | TransactionArgument;
    },
  ): Promise<TransactionNestedResult[]> {
    const depositCoin =
      typeof depositCoinOrAmount === 'number'
        ? coinWithBalance({ balance: depositCoinOrAmount, type: coinType })
        : depositCoinOrAmount;
    const repayCoin =
      typeof repayCoinOrAmount === 'number'
        ? coinWithBalance({ balance: repayCoinOrAmount, type: this.getUsdbCoinType() })
        : repayCoinOrAmount;

    const debtorRequest = this.debtorRequest(tx, {
      accountObjectOrId,
      coinType,
      depositCoin,
      borrowAmount,
      repayCoin,
      withdrawAmount,
    });
    const updateRequest = this.checkUpdatePositionRequest(tx, { coinType, request: debtorRequest });
    const [priceResult] =
      borrowAmount || withdrawAmount ? await this.aggregatePrices(tx, { coinTypes: [coinType] }) : [];

    const [collateralCoin, usdbCoin, response] = this.updatePosition(tx, {
      coinType,
      updateRequest,
      priceResult,
    });
    this.checkUpdatePositionResponse(tx, { coinType, response });

    if (withdrawAmount === 0) {
      destroyZeroCoin(tx, { coinType: coinType, coin: collateralCoin });
    }
    if (borrowAmount === 0) {
      destroyZeroCoin(tx, { coinType: this.getUsdbCoinType(), coin: usdbCoin });
    }
    return [collateralCoin, usdbCoin];
  }

  /**
   * @description build and return Transaction of close position
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param accountObjectOrId: the Account object to hold position (undefined if just use EOA)
   * @param recipient (optional): the recipient of the output coins
   * @returns Transaction
   */
  buildClosePositionTransaction(
    tx: Transaction,
    {
      address,
      accountObjectOrId,
      coinType,
      repayCoin,
    }: {
      address: string;
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
      repayCoin?: TransactionObjectArgument;
    },
  ): [TransactionNestedResult, TransactionObjectArgument | undefined] {
    const [collateralAmount, debtAmount] = tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::get_position_data`,
      typeArguments: [coinType],
      arguments: [
        this.vault(tx, { coinType }),
        this.accountAddress(tx, { address, accountObjectOrId }),
        tx.object.clock(),
      ],
    });
    const splittedRepayCoin = repayCoin
      ? tx.splitCoins(repayCoin, [debtAmount])[0]
      : coinWithBalance({ balance: debtAmount, type: this.getUsdbCoinType() });

    const debtorRequest = this.debtorRequest(tx, {
      accountObjectOrId,
      coinType,
      repayCoin: splittedRepayCoin,
      withdrawAmount: collateralAmount,
    });
    const updateRequest = this.checkUpdatePositionRequest(tx, { coinType, request: debtorRequest });
    const [collateralCoin, usdbCoin, response] = this.updatePosition(tx, {
      coinType,
      updateRequest,
    });
    this.checkUpdatePositionResponse(tx, { coinType, response });

    destroyZeroCoin(tx, { coinType: this.getUsdbCoinType(), coin: usdbCoin });

    return [collateralCoin, repayCoin];
  }

  /**
   * @description claim borrow rewards and return
   * @param accountObjectOrId: the Account object to hold position (undefined if just use EOA)
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @returns Transaction[] if has rewards else undefined
   */
  buildClaimBorrowRewardsTransaction(
    tx: Transaction,
    {
      accountObjectOrId,
      coinType,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
    },
  ): Record<string, TransactionResult> {
    const vaultObj = this.vault(tx, { coinType });
    const rewarders = this.getVaultObjectInfo({ coinType }).rewarders;
    const registryObj = tx.sharedObjectRef(this.config.VAULT_REWARDER_REGISTRY);

    if (!rewarders) {
      return {};
    }
    return rewarders.reduce(
      (result, { rewardType, rewarderId }) => ({
        ...result,
        [rewardType]: tx.moveCall({
          target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::claim`,
          typeArguments: [coinType, rewardType],
          arguments: [
            registryObj,
            tx.object(rewarderId),
            vaultObj,
            this.newAccountRequest(tx, { accountObjectOrId }),
            tx.object.clock(),
          ],
        }),
      }),
      {},
    );
  }

  /**
   * @description
   */
  buildDepositToSavingPoolTransaction(
    tx: Transaction,
    {
      address,
      accountObjectOrId,
      lpType,
      depositCoinOrAmount,
    }: {
      address: string;
      accountObjectOrId?: string | TransactionArgument;
      lpType: string;
      depositCoinOrAmount: number | TransactionArgument;
    },
  ): void {
    const depositCoin =
      typeof depositCoinOrAmount === 'number'
        ? coinWithBalance({ balance: depositCoinOrAmount, type: this.getUsdbCoinType() })
        : depositCoinOrAmount;

    const depositResponse = this.savingPoolDeposit(tx, {
      address,
      accountObjectOrId,
      lpType,
      usdbCoin: depositCoin,
    });

    this.checkDepositResponse(tx, { lpType, depositResponse });
  }

  /**
   * @description
   */
  buildWithdrawFromSavingPoolTransaction(
    tx: Transaction,
    {
      accountObjectOrId,
      lpType,
      amount,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      lpType: string;
      amount: number;
    },
  ): TransactionNestedResult {
    const [usdbCoin, withdrawResponse] = this.savingPoolWithdraw(tx, {
      accountObjectOrId,
      lpType,
      amount,
    });

    this.checkWithdrawResponse(tx, { lpType, withdrawResponse });

    return usdbCoin;
  }

  /**
   * @description
   */
  buildClaimSavingRewardsTransaction(
    tx: Transaction,
    {
      accountObjectOrId,
      lpType,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      lpType: string;
    },
  ): Record<string, TransactionResult> {
    const savingPool = this.getSavingPoolObjectInfo({ lpType });

    if (!savingPool.reward) {
      return {};
    }
    return savingPool.reward.rewardTypes.reduce(
      (result, rewardType) => ({
        ...result,
        [rewardType]: this.claimPoolIncentive(tx, {
          accountObjectOrId,
          lpType,
          rewardType,
        }),
      }),
      {},
    );
  }

  /**
   * @description
   */
  async buildPSMSwapInTransaction(
    tx: Transaction,
    {
      accountObjectOrId,
      coinType,
      inputCoinOrAmount,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
      inputCoinOrAmount: number | TransactionArgument;
    },
  ): Promise<TransactionResult> {
    const inputCoin =
      typeof inputCoinOrAmount === 'number'
        ? coinWithBalance({ balance: inputCoinOrAmount, type: coinType })
        : inputCoinOrAmount;

    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapIn(tx, { accountObjectOrId, coinType, priceResult, inputCoin });
  }

  /**
   * @description
   */
  async buildPSMSwapOutTransaction(
    tx: Transaction,
    {
      accountObjectOrId,
      coinType,
      usdbCoinOrAmount,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
      usdbCoinOrAmount: number | TransactionArgument;
    },
  ): Promise<TransactionResult> {
    const usdbCoin =
      typeof usdbCoinOrAmount === 'number'
        ? coinWithBalance({ balance: usdbCoinOrAmount, type: this.getUsdbCoinType() })
        : usdbCoinOrAmount;

    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapOut(tx, { accountObjectOrId, coinType, priceResult, usdbCoin });
  }
}
