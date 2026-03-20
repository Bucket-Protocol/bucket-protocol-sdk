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
  DerivativeKind,
  FlashMintInfo,
  Network,
  PaginatedPositionsResult,
  PositionInfo,
  PriceConfigInfo,
  PsmPoolInfo,
  PsmPoolObjectInfo,
  SavingInfo,
  SavingPoolInfo,
  SavingPoolObjectInfo,
  TransactionNestedResult,
  VaultInfo,
  VaultObjectInfo,
} from '@/types/index.js';
import { DOUBLE_OFFSET, DUMMY_ADDRESS, FLOAT_OFFSET } from '@/consts/index.js';
import { queryAllConfig } from '@/utils/bucketConfig.js';
import { convertOnchainConfig, enrichSharedObjectRefs } from '@/utils/configAdapter.js';
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

// Full BCS schema for aggregator::PriceAggregated<T> (phantom T has no effect on layout)
const PriceAggregatedBcs = bcs.struct('PriceAggregated', {
  aggregator_id: bcs.Address,
  sources: bcs.vector(bcs.string()),
  prices: bcs.vector(bcs.u128()),
  weights: bcs.vector(bcs.u8()),
  current_threshold: bcs.u64(),
  result: bcs.u128(),
});

const NETWORK_RPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
};

function isValidPythPriceId(id: string): boolean {
  if (typeof id !== 'string') return false;
  const trimmed = id.trim();
  if (trimmed.length === 0) return false;
  const noPrefix = trimmed.startsWith('0x') || trimmed.startsWith('0X') ? trimmed.slice(2) : trimmed;
  return /^[0-9a-fA-F]{64}$/.test(noPrefix);
}

export class BucketClient {
  /**
   * @description a TypeScript wrapper over Bucket V2 client.
   * Use `BucketClient.initialize()` to create a client. Config is required.
   */
  private configObjectId?: string;
  private configParam?: ConfigType;
  private configOverrides?: Partial<ConfigType>;
  private config?: ConfigType;
  private configLoadingPromise?: Promise<void>;
  private suiClient: SuiGrpcClient;
  private network: Network;
  private pythCache = new PythCache();

  /**
   * @description Creates a BucketClient with config fetched from on-chain.
   *
   * @param configObjectId - Optional. Override the default entry config object ID (e.g. for testing).
   *   When provided, refreshConfig() will use the same source.
   * @param config - Optional. Pre-built config for testing; skips chain fetch when provided.
   *   When config is provided, configOverrides are not applied to the initial config; they are
   *   stored for use on refreshConfig() only.
   * @param configOverrides - Optional overrides (e.g. PRICE_SERVICE_ENDPOINT). Applied when
   *   fetching from chain; when config is provided, used only after refreshConfig().
   */
  constructor({
    suiClient,
    network = 'mainnet',
    configObjectId,
    config: configParam,
    configOverrides,
  }: {
    suiClient?: SuiGrpcClient;
    network?: Network;
    configObjectId?: string;
    config?: ConfigType;
    configOverrides?: Partial<ConfigType>;
  }) {
    const rpcUrl = NETWORK_RPC_URLS[network] ?? NETWORK_RPC_URLS['mainnet']!;

    this.network = network;
    this.suiClient = suiClient ?? new SuiGrpcClient({ network, baseUrl: rpcUrl });

    this.configParam = configParam;
    this.configObjectId = configObjectId;
    this.configOverrides = configOverrides;

    this.configLoadingPromise = this.loadConfig();
  }

  /**
   * @description Creates a BucketClient and waits for config to be ready.
   * Prefer this over `new BucketClient(...)` when you need config to be available immediately.
   *
   * @param configObjectId - Optional. Override the default entry config object ID.
   * @param config - Optional. Pre-built config for testing; skips chain fetch when provided.
   * @param configOverrides - Optional overrides (e.g. PRICE_SERVICE_ENDPOINT).
   */
  static async initialize({
    suiClient,
    network = 'mainnet',
    configObjectId,
    config,
    configOverrides,
  }: {
    suiClient?: SuiGrpcClient;
    network?: Network;
    configObjectId?: string;
    config?: ConfigType;
    configOverrides?: Partial<ConfigType>;
  } = {}): Promise<BucketClient> {
    const bc = new BucketClient({ suiClient, network, configObjectId, config, configOverrides });
    await bc.getConfig();
    return bc;
  }

  private async loadConfig(): Promise<void> {
    if (this.configParam) {
      this.config = await enrichSharedObjectRefs(this.configParam, this.suiClient);
    } else {
      await this.fetchConfig();
    }
  }

  /**
   * @description Re-fetch config from on-chain and update this client's config.
   * When overrides is omitted, preserves configOverrides from initialize().
   * Uses the same config source (configObjectId) as initialize() when one was provided.
   */
  async refreshConfig(overrides?: Partial<ConfigType>): Promise<void> {
    await this.configLoadingPromise;

    this.configLoadingPromise = this.fetchConfig(overrides);

    return this.configLoadingPromise;
  }

  private async fetchConfig(overrides?: Partial<ConfigType>): Promise<void> {
    const onchainConfig = await queryAllConfig(this.suiClient, this.network, this.configObjectId);
    const config = convertOnchainConfig(onchainConfig, overrides ?? this.configOverrides);
    this.config = await enrichSharedObjectRefs(config, this.suiClient);
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
  async getConfig(): Promise<ConfigType> {
    await this.configLoadingPromise;

    return this.config!;
  }

  /**
   * @description Get a price config info entry matching the given derivative kind.
   */
  private async getPriceConfigInfo(derivativeKind: DerivativeKind): Promise<PriceConfigInfo> {
    const config = await this.getConfig();
    const variantMap: Partial<Record<DerivativeKind, 'SCOIN' | 'GCOIN' | 'BFBTC'>> = {
      sCoin: 'SCOIN',
      gCoin: 'GCOIN',
      BFBTC: 'BFBTC',
    };
    const targetVariant = variantMap[derivativeKind];
    if (!targetVariant) {
      throw new Error(`No PriceConfigInfo mapping for derivativeKind "${derivativeKind}".`);
    }
    for (const info of Object.values(config.PRICE_OBJS)) {
      if (targetVariant in info) return info;
    }
    throw new Error(`PriceConfigInfo for derivativeKind "${derivativeKind}" not found in PRICE_OBJS.`);
  }

  async getUsdbCoinType(): Promise<string> {
    const config = await this.getConfig();
    return `${config.ORIGINAL_USDB_PACKAGE_ID}::usdb::USDB`;
  }

  /**
   * @description Get all Oracle coin types that have a valid Pyth price (basic or derivative with priceable underlying).
   */
  async getAllOracleCoinTypes(): Promise<string[]> {
    const config = await this.getConfig();
    const isPriceable = (coinType: string, visiting: Set<string>): boolean => {
      const normalized = normalizeStructTag(coinType);
      if (visiting.has(normalized)) return false;
      visiting.add(normalized);
      const aggregatorInfo = config.AGGREGATOR_OBJS[normalized];
      if (!aggregatorInfo) return false;
      if ('Pyth' in aggregatorInfo && aggregatorInfo.Pyth) {
        return isValidPythPriceId(aggregatorInfo.Pyth.pythPriceId);
      }
      if ('DerivativeInfo' in aggregatorInfo && aggregatorInfo.DerivativeInfo) {
        return isPriceable(aggregatorInfo.DerivativeInfo.underlying_coin_type, visiting);
      }
      return false;
    };
    return Object.keys(config.AGGREGATOR_OBJS).filter((coinType) => isPriceable(coinType, new Set()));
  }

  /**
   * @description Get all CDP collateral types
   */
  async getAllCollateralTypes(): Promise<string[]> {
    const config = await this.getConfig();
    return Object.keys(config.VAULT_OBJS);
  }

  async getAggregatorObjectInfo({ coinType }: { coinType: string }): Promise<AggregatorObjectInfo> {
    const config = await this.getConfig();
    const aggregatorInfo = config.AGGREGATOR_OBJS[normalizeStructTag(coinType)];

    if (!aggregatorInfo) {
      throw new Error('Unsupported coin type');
    }
    return aggregatorInfo;
  }

  async getVaultObjectInfo({ coinType }: { coinType: string }): Promise<VaultObjectInfo> {
    const config = await this.getConfig();
    const vaultInfo = config.VAULT_OBJS[normalizeStructTag(coinType)];

    if (!vaultInfo) {
      throw new Error('Unsupported collateral type');
    }
    return vaultInfo;
  }

  async getSavingPoolObjectInfo({ lpType }: { lpType: string }): Promise<SavingPoolObjectInfo> {
    const config = await this.getConfig();
    const savingPoolInfo = config.SAVING_POOL_OBJS[normalizeStructTag(lpType)];

    if (!savingPoolInfo) {
      throw new Error('Unsupported coin type');
    }
    return savingPoolInfo;
  }

  async getPsmPoolObjectInfo({ coinType }: { coinType: string }): Promise<PsmPoolObjectInfo> {
    const config = await this.getConfig();
    const psmPoolInfo = config.PSM_POOL_OBJS[normalizeStructTag(coinType)];

    if (!psmPoolInfo) {
      throw new Error('Unsupported coin type');
    }
    return psmPoolInfo;
  }

  /* ----- Queries ----- */

  /**
   * @description Get total USDB supply via RPC.
   * Uses stateService.getCoinInfo (avoids PTB reference limitation: borrow_cap_mut returns
   * &mut which cannot be passed between commands; SDK v2 validates this and rejects).
   */
  async getUsdbSupply(): Promise<bigint> {
    const coinType = await this.getUsdbCoinType();
    const { response } = await this.suiClient.stateService.getCoinInfo({ coinType });
    const supply = response.treasury?.totalSupply;
    if (supply === null || supply === undefined) {
      throw new Error('Failed to fetch USDB supply: treasury totalSupply is missing');
    }
    return BigInt(supply);
  }

  /**
   * @description
   */
  async getOraclePrices({ coinTypes }: { coinTypes: string[] }): Promise<Record<string, number>> {
    const tx = new Transaction();

    await this.aggregatePrices(tx, { coinTypes });

    tx.setSender(DUMMY_ADDRESS);

    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { events: true } });
    if (res.$kind === 'FailedTransaction') {
      const err = (res as { FailedTransaction?: { status?: { error?: unknown } } }).FailedTransaction?.status?.error;
      throw Object.assign(new Error('Failed to fetch oracle prices'), { cause: err ?? res });
    }
    const events = res.Transaction?.events ?? [];
    return events.reduce((result, e) => {
      const typeStruct = parseStructTag(e.eventType);

      if (typeStruct.module !== 'aggregator' || typeStruct.name !== 'PriceAggregated') {
        return result;
      }
      const coinType = normalizeStructTag(typeStruct.typeParams[0]);

      return {
        ...result,
        [coinType]: Number(PriceAggregatedBcs.parse(e.bcs).result) / 10 ** 9,
      };
    }, {});
  }

  /**
   * @description
   */
  async getAllOraclePrices(): Promise<Record<string, number>> {
    const coinTypes = await this.getAllOracleCoinTypes();

    return this.getOraclePrices({ coinTypes });
  }

  /**
   * @description
   */
  async getBorrowRewardFlowRate({ coinType }: { coinType: string }): Promise<Record<string, bigint>> {
    const vault = await this.getVaultObjectInfo({ coinType });

    if (!vault.rewarders) {
      return {};
    }
    const rewardObjectIds = vault.rewarders!.map((rewarder) => rewarder.rewarder_id);

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
    return vault.rewarders!.reduce(
      (result, rewarder, idx) => ({
        ...result,
        [rewarder.reward_type]: BigInt(rewarders[idx].flow_rate.value),
      }),
      {} as Record<string, bigint>,
    );
  }

  /**
   * @description Get all vault objects
   */
  async getAllVaultObjects(): Promise<Record<string, VaultInfo>> {
    const config = await this.getConfig();
    const vaultObjectIds = Object.values(config.VAULT_OBJS).map((v) => v.vault.objectId);
    const allCollateralTypes = await this.getAllCollateralTypes();

    const res = await this.suiClient.getObjects({
      objectIds: vaultObjectIds,
      include: {
        content: true,
      },
    });
    const rewardFlowRates = await Promise.all(
      allCollateralTypes.map((coinType) => this.getBorrowRewardFlowRate({ coinType })),
    );
    return Object.keys(config.VAULT_OBJS).reduce(
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
    const pool = await this.getSavingPoolObjectInfo({ lpType });

    if (!pool.reward) {
      return {};
    }
    const rewardObjectIds = await this.suiClient
      .listDynamicFields({ parentId: pool.reward.reward_manager.objectId })
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
    return pool.reward.reward_types.reduce(
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
    const config = await this.getConfig();
    const lpTypes = Object.keys(config.SAVING_POOL_OBJS);
    const poolObjectIds = Object.values(config.SAVING_POOL_OBJS).map((v) => v.pool.objectId);

    const res = await this.suiClient.getObjects({
      objectIds: poolObjectIds,
      include: {
        content: true,
      },
    });
    const rewardFlowRates = await Promise.all(lpTypes.map((lpType) => this.getSavingPoolRewardFlowRate({ lpType })));

    return Object.keys(config.SAVING_POOL_OBJS).reduce(
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
    const config = await this.getConfig();
    const poolObjectIds = Object.values(config.PSM_POOL_OBJS).map((v) => v.pool.objectId);

    const res = await this.suiClient.getObjects({
      objectIds: poolObjectIds,
      include: {
        content: true,
      },
    });
    return Object.keys(config.PSM_POOL_OBJS).reduce(
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
    const config = await this.getConfig();
    const data = await this.suiClient.getObject({
      objectId: config.FLASH_GLOBAL_CONFIG_OBJ.objectId,
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
    const config = await this.getConfig();
    const tx = new Transaction();

    tx.moveCall({
      target: `${config.CDP_PACKAGE_ID}::vault::get_positions`,
      typeArguments: [coinType],
      arguments: [
        await this.vault(tx, { coinType }),
        tx.object.clock(),
        tx.pure.option('address', cursor),
        tx.pure.u64(pageSize),
      ],
    });
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    if (res.$kind === 'FailedTransaction') {
      const err = (res as { FailedTransaction?: { status?: { error?: unknown } } }).FailedTransaction?.status?.error;
      throw Object.assign(new Error('Failed to fetch positions'), { cause: err ?? res });
    }
    if (!res.commandResults?.[0]?.returnValues) {
      throw new Error('Failed to fetch positions');
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
    const config = await this.getConfig();
    const accountRes = await this.suiClient.listOwnedObjects({
      owner: address,
      type: `${config.ORIGINAL_FRAMEWORK_PACKAGE_ID}::account::Account`,
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
    const config = await this.getConfig();
    const tx = new Transaction();

    for (const coinType of coinTypes) {
      const vaultInfo = await this.getVaultObjectInfo({ coinType });

      if (!vaultInfo.rewarders) {
        continue;
      }
      vaultInfo.rewarders.forEach((rewarder) => {
        tx.moveCall({
          target: `${config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::realtime_reward_amount`,
          typeArguments: [coinType, rewarder.reward_type],
          arguments: [
            tx.object(rewarder.rewarder_id),
            tx.sharedObjectRef(vaultInfo.vault),
            tx.pure.address(accountId ?? address),
            tx.object.clock(),
          ],
        });
      });
    }
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    if (res.$kind === 'FailedTransaction' || !res.commandResults) {
      return {};
    }
    const result: Record<string, Record<string, bigint>> = {};
    for (const coinType of coinTypes) {
      const vaultInfo = await this.getVaultObjectInfo({ coinType });

      if (!vaultInfo.rewarders?.length) {
        continue;
      }
      const responses = res.commandResults!.splice(0, vaultInfo.rewarders.length);

      result[coinType] = vaultInfo.rewarders.reduce((acc, rewarder, index) => {
        const resItem = responses[index]?.returnValues;
        if (!resItem) {
          return acc;
        }
        const realtimeReward = bcs.u64().parse(resItem[0].bcs);

        return { ...acc, [rewarder.reward_type]: BigInt(realtimeReward) };
      }, {});
    }
    return result;
  }

  /**
   * @description Get position data given account (can be wallet address or Account object ID)
   */
  async getAccountPositions({ address, accountId }: { address: string; accountId?: string }): Promise<PositionInfo[]> {
    const config = await this.getConfig();
    const tx = new Transaction();
    const allCollateralTypes = await this.getAllCollateralTypes();

    for (const coinType of allCollateralTypes) {
      const vaultInfo = await this.getVaultObjectInfo({ coinType });

      tx.moveCall({
        target: `${config.CDP_PACKAGE_ID}::vault::try_get_position_data`,
        typeArguments: [coinType],
        arguments: [tx.sharedObjectRef(vaultInfo.vault), tx.pure.address(accountId ?? address), tx.object.clock()],
      });
    }
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    if (res.$kind === 'FailedTransaction' || !res.commandResults) {
      return [];
    }
    const borrowRewards = await this.getAccountBorrowRewards({ address, accountId, coinTypes: allCollateralTypes });

    return allCollateralTypes.reduce((result, coinType, index) => {
      const cmdRes = res.commandResults?.[index]?.returnValues;
      if (!cmdRes) {
        return result;
      }
      const collateralAmount = BigInt(bcs.u64().parse(cmdRes[0].bcs));
      const debtAmount = BigInt(bcs.u64().parse(cmdRes[1].bcs));
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
    const config = await this.getConfig();
    const tx = new Transaction();

    for (const lpType of lpTypes) {
      const poolInfo = await this.getSavingPoolObjectInfo({ lpType });

      if (!poolInfo.reward) {
        continue;
      }
      poolInfo.reward.reward_types.forEach((rewardType) => {
        tx.moveCall({
          target: `${config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::get_realtime_reward_amount`,
          typeArguments: [lpType, rewardType],
          arguments: [
            tx.sharedObjectRef(poolInfo.reward!.reward_manager),
            tx.sharedObjectRef(poolInfo.pool),
            tx.pure.address(accountId ?? address),
            tx.object.clock(),
          ],
        });
      });
    }
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    if (res.$kind === 'FailedTransaction' || !res.commandResults) {
      return {};
    }
    const result: Record<string, Record<string, bigint>> = {};
    for (const lpType of lpTypes) {
      const poolInfo = await this.getSavingPoolObjectInfo({ lpType });

      if (!poolInfo.reward?.reward_types?.length) {
        continue;
      }
      const responses = res.commandResults!.splice(0, poolInfo.reward.reward_types.length);

      result[lpType] = poolInfo.reward.reward_types.reduce((acc, rewardType, index) => {
        const amountRes = responses[index]?.returnValues;
        if (!amountRes) {
          return acc;
        }
        const realtimeReward = bcs.u64().parse(amountRes[0].bcs);

        return { ...acc, [rewardType]: BigInt(realtimeReward) };
      }, {});
    }
    return result;
  }

  /**
   * @description
   */
  async getAccountSavings({ address, accountId }: { address: string; accountId?: string }): Promise<SavingInfo[]> {
    const config = await this.getConfig();
    const lpTypes = Object.keys(config.SAVING_POOL_OBJS);

    const tx = new Transaction();

    for (const lpType of lpTypes) {
      tx.moveCall({
        target: `${config.SAVING_PACKAGE_ID}::saving::lp_token_value_of`,
        typeArguments: [lpType],
        arguments: [await this.savingPoolObj(tx, { lpType }), tx.pure.address(accountId ?? address), tx.object.clock()],
      });
      tx.moveCall({
        target: `${config.SAVING_PACKAGE_ID}::saving::lp_balance_of`,
        typeArguments: [lpType],
        arguments: [await this.savingPoolObj(tx, { lpType }), tx.pure.address(accountId ?? address)],
      });
    }
    tx.setSender(DUMMY_ADDRESS);
    const res = await this.suiClient.simulateTransaction({ transaction: tx, include: { commandResults: true } });
    const savingRewards = await this.getAccountSavingPoolRewards({ lpTypes, address, accountId });

    return lpTypes.reduce((result, lpType, index) => {
      const valRes = res.commandResults?.[2 * index]?.returnValues;
      const balRes = res.commandResults?.[2 * index + 1]?.returnValues;
      if (!valRes || !balRes) {
        return result;
      }
      const usdbBalance = BigInt(bcs.u64().parse(valRes[0].bcs));
      const lpBalance = BigInt(bcs.u64().parse(balRes[0].bcs));
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
  async treasury(tx: Transaction) {
    const config = await this.getConfig();
    return tx.sharedObjectRef(config.TREASURY_OBJ);
  }

  /**
   * @description
   */
  async vaultRewarderRegistry(tx: Transaction) {
    const config = await this.getConfig();
    return tx.sharedObjectRef(config.VAULT_REWARDER_REGISTRY);
  }

  /**
   * @description
   */
  async savingPoolGlobalConfig(tx: Transaction) {
    const config = await this.getConfig();
    return tx.sharedObjectRef(config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ);
  }

  /**
   * @description
   */
  async flashGlobalConfig(tx: Transaction) {
    const config = await this.getConfig();
    return tx.sharedObjectRef(config.FLASH_GLOBAL_CONFIG_OBJ);
  }

  /**
   * @description
   */
  async aggregator(tx: Transaction, { coinType }: { coinType: string }) {
    const aggregatorInfo = await this.getAggregatorObjectInfo({ coinType });

    const agg = 'Pyth' in aggregatorInfo ? aggregatorInfo.Pyth : aggregatorInfo.DerivativeInfo;
    return tx.sharedObjectRef(agg!.priceAggregator);
  }

  /**
   * @description
   */
  async vault(tx: Transaction, { coinType }: { coinType: string }) {
    const vaultInfo = await this.getVaultObjectInfo({ coinType });

    return tx.sharedObjectRef(vaultInfo.vault);
  }

  /**
   * @description
   */
  async savingPoolObj(tx: Transaction, { lpType }: { lpType: string }) {
    const savingPoolInfo = await this.getSavingPoolObjectInfo({ lpType });

    return tx.sharedObjectRef(savingPoolInfo.pool);
  }

  /**
   * @description
   */
  async psmPoolObj(tx: Transaction, { coinType }: { coinType: string }) {
    const psmPoolInfo = await this.getPsmPoolObjectInfo({ coinType });

    return tx.sharedObjectRef(psmPoolInfo.pool);
  }

  async accountAddress(
    tx: Transaction,
    {
      address,
      accountObjectOrId,
    }: {
      address: string;
      accountObjectOrId?: string | TransactionArgument;
    },
  ): Promise<TransactionArgument> {
    const config = await this.getConfig();
    if (accountObjectOrId) {
      return typeof accountObjectOrId === 'string'
        ? tx.pure.address(accountObjectOrId)
        : tx.moveCall({
            target: `${config.FRAMEWORK_PACKAGE_ID}::account::account_address`,
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
  async newAccountRequest(
    tx: Transaction,
    { accountObjectOrId }: { accountObjectOrId?: string | TransactionArgument },
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    return accountObjectOrId
      ? tx.moveCall({
          target: `${config.FRAMEWORK_PACKAGE_ID}::account::request_with_account`,
          arguments: [typeof accountObjectOrId === 'string' ? tx.object(accountObjectOrId) : accountObjectOrId],
        })
      : tx.moveCall({
          target: `${config.FRAMEWORK_PACKAGE_ID}::account::request`,
        });
  }

  /**
   * @description Create a price collector
   * @param collateral coin type, e.g "0x2::sui::SUI"
   * @return PriceCollector
   */
  async newPriceCollector(tx: Transaction, { coinType }: { coinType: string }): Promise<TransactionResult> {
    const config = await this.getConfig();
    return tx.moveCall({
      target: `${config.ORACLE_PACKAGE_ID}::collector::new`,
      typeArguments: [coinType],
    });
  }

  /**
   * @description Get a basic (not derivative) price result
   * @param collateral coin type, e.g "0x2::sui::SUI"
   * @return [PriceResult]
   */
  async aggregateBasicPrices(tx: Transaction, { coinTypes }: { coinTypes: string[] }): Promise<TransactionResult[]> {
    const config = await this.getConfig();
    if (!coinTypes.length) {
      return [];
    }
    const pythPriceIds: string[] = [];
    for (const coinType of coinTypes) {
      const aggregator = await this.getAggregatorObjectInfo({ coinType });

      if (!('Pyth' in aggregator) || !aggregator.Pyth) {
        throw new Error(`${coinType} has no basic price`);
      }
      pythPriceIds.push(aggregator.Pyth.pythPriceId);
    }
    const updateData = await fetchPriceFeedsUpdateDataFromHermes(config.PRICE_SERVICE_ENDPOINT, pythPriceIds);
    const priceInfoObjIds = await buildPythPriceUpdateCalls(
      tx,
      this.suiClient,
      {
        pythStateId: config.PYTH_STATE_ID,
        wormholeStateId: config.WORMHOLE_STATE_ID,
      },
      updateData,
      pythPriceIds,
      this.pythCache,
    );

    const results: TransactionResult[] = [];
    for (let index = 0; index < coinTypes.length; index++) {
      const coinType = coinTypes[index];
      const collector = await this.newPriceCollector(tx, { coinType });
      const aggInfo = await this.getAggregatorObjectInfo({ coinType });
      const agg = 'Pyth' in aggInfo ? aggInfo.Pyth : aggInfo.DerivativeInfo;
      if (!agg) throw new Error(`${coinType} has no aggregator info`);

      tx.moveCall({
        target: `${config.PYTH_RULE_PACKAGE_ID}::pyth_rule::feed`,
        typeArguments: [coinType],
        arguments: [
          collector,
          tx.sharedObjectRef(config.PYTH_RULE_CONFIG_OBJ),
          tx.object.clock(),
          tx.object(config.PYTH_STATE_ID),
          tx.object(priceInfoObjIds[index]!),
        ],
      });
      const priceResult = tx.moveCall({
        target: `${config.ORACLE_PACKAGE_ID}::aggregator::aggregate`,
        typeArguments: [coinType],
        arguments: [tx.sharedObjectRef(agg.priceAggregator), collector],
      });
      results.push(priceResult);
    }
    return results;
  }

  /**
   * @description
   */
  private async getDerivativePrice(
    tx: Transaction,
    {
      coinType,
      underlyingPriceResult,
    }: {
      coinType: string;
      underlyingPriceResult: TransactionArgument;
    },
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    const aggregator = await this.getAggregatorObjectInfo({ coinType });

    if (!('DerivativeInfo' in aggregator) || !aggregator.DerivativeInfo) {
      throw new Error(`${coinType} has no derivative info`);
    }
    const { priceAggregator, underlying_coin_type, derivative_kind } = aggregator.DerivativeInfo;
    const collector = await this.newPriceCollector(tx, { coinType });
    // Map on-chain derivative_kind (Scallop, GCoin, Unihouse, BFBTC) to SDK DerivativeKind
    const dk: DerivativeKind =
      derivative_kind === 'Scallop' || derivative_kind === 'sCoin'
        ? 'sCoin'
        : derivative_kind === 'GCoin' || derivative_kind === 'gCoin' || derivative_kind === 'Unihouse'
          ? 'gCoin'
          : derivative_kind === 'BFBTC'
            ? 'BFBTC'
            : derivative_kind === 'TLP'
              ? 'TLP'
              : 'sCoin'; // fallback
    const priceConfig = await this.getPriceConfigInfo(dk);

    switch (derivative_kind) {
      case 'sCoin':
      case 'Scallop': {
        if (!('SCOIN' in priceConfig) || !priceConfig.SCOIN)
          throw new Error('Unexpected price config variant for sCoin');
        const pc = priceConfig.SCOIN;
        tx.moveCall({
          target: `${pc.package}::scoin_rule::feed`,
          typeArguments: [coinType, underlying_coin_type],
          arguments: [
            collector,
            tx.sharedObjectRef(pc.scoin_rule_config),
            underlyingPriceResult,
            tx.sharedObjectRef(pc.scallop_version),
            tx.sharedObjectRef(pc.scallop_market),
            tx.object.clock(),
          ],
        });
        break;
      }
      case 'gCoin':
      case 'GCoin':
      case 'Unihouse': {
        if (!('GCOIN' in priceConfig) || !priceConfig.GCOIN)
          throw new Error('Unexpected price config variant for gCoin');
        const pc = priceConfig.GCOIN;
        tx.moveCall({
          target: `${pc.package}::gcoin_rule::feed`,
          typeArguments: [coinType, underlying_coin_type],
          arguments: [
            collector,
            underlyingPriceResult,
            tx.sharedObjectRef(pc.gcoin_rule_config),
            tx.sharedObjectRef(pc.unihouse_object),
          ],
        });
        break;
      }
      case 'BFBTC': {
        if (!('BFBTC' in priceConfig) || !priceConfig.BFBTC)
          throw new Error('Unexpected price config variant for BFBTC');
        const pc = priceConfig.BFBTC;
        tx.moveCall({
          target: `${pc.package}::bfbtc_rule::feed`,
          typeArguments: [underlying_coin_type],
          arguments: [collector, underlyingPriceResult, tx.sharedObjectRef(pc.bfbtc_rule_config)],
        });
        break;
      }
      default:
        throw new Error(`Unsupported derivative kind: ${derivative_kind}`);
    }
    return tx.moveCall({
      target: `${config.ORACLE_PACKAGE_ID}::aggregator::aggregate`,
      typeArguments: [coinType],
      arguments: [tx.sharedObjectRef(priceAggregator), collector],
    });
  }

  /**
   * @description
   */
  async aggregatePrices(tx: Transaction, { coinTypes }: { coinTypes: string[] }): Promise<TransactionResult[]> {
    const allBasicCoinTypes: string[] = [];
    const seen = new Set<string>();
    for (const coinType of coinTypes) {
      const aggregator = await this.getAggregatorObjectInfo({ coinType });
      const basicType = 'Pyth' in aggregator ? coinType : aggregator.DerivativeInfo.underlying_coin_type;

      if (!seen.has(basicType)) {
        seen.add(basicType);
        allBasicCoinTypes.push(basicType);
      }
    }
    const basicPriceResults = await this.aggregateBasicPrices(tx, { coinTypes: allBasicCoinTypes });

    const priceResults: Record<string, TransactionResult> = Object.fromEntries(
      allBasicCoinTypes.map((coinType, index) => [coinType, basicPriceResults[index]]),
    );
    // deal with exchange rate
    for (const coinType of coinTypes) {
      const aggregator = await this.getAggregatorObjectInfo({ coinType });

      if (!('DerivativeInfo' in aggregator)) {
        continue;
      }
      const { underlying_coin_type: underlyingCoinType } = aggregator.DerivativeInfo!;

      priceResults[coinType] = await this.getDerivativePrice(tx, {
        coinType,
        underlyingPriceResult: priceResults[underlyingCoinType],
      });
    }
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
  async debtorRequest(
    tx: Transaction,
    {
      accountObjectOrId,
      coinType,
      depositCoin = getZeroCoin(tx, { coinType: coinType }),
      borrowAmount = 0,
      repayCoin,
      withdrawAmount = 0,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
      depositCoin?: TransactionArgument;
      borrowAmount?: number | TransactionArgument;
      repayCoin?: TransactionArgument;
      withdrawAmount?: number | TransactionArgument;
    },
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    const usdbCoinType = await this.getUsdbCoinType();
    const resolvedRepayCoin = repayCoin ?? getZeroCoin(tx, { coinType: usdbCoinType });
    const accountReq = await this.newAccountRequest(tx, { accountObjectOrId });

    return tx.moveCall({
      target: `${config.CDP_PACKAGE_ID}::vault::debtor_request`,
      typeArguments: [coinType],
      arguments: [
        await this.vault(tx, { coinType }),
        accountReq,
        await this.treasury(tx),
        depositCoin,
        typeof borrowAmount === 'number' ? tx.pure.u64(borrowAmount) : borrowAmount,
        resolvedRepayCoin,
        typeof withdrawAmount === 'number' ? tx.pure.u64(withdrawAmount) : withdrawAmount,
      ],
    });
  }

  /**
   * @description check and destroy UpdateResponse
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param response: UpdateResponse generated by update_position
   */
  async checkUpdatePositionRequest(
    tx: Transaction,
    { coinType, request }: { coinType: string; request: TransactionArgument },
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    const vaultObj = await this.vault(tx, { coinType });
    const rewarders = (await this.getVaultObjectInfo({ coinType })).rewarders;
    const registryObj = tx.sharedObjectRef(config.VAULT_REWARDER_REGISTRY);
    const checker = tx.moveCall({
      target: `${config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::new_checker`,
      typeArguments: [coinType],
      arguments: [registryObj, request],
    });
    (rewarders ?? []).map((rewarder) => {
      tx.moveCall({
        target: `${config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::update`,
        typeArguments: [coinType, rewarder.reward_type],
        arguments: [registryObj, checker, vaultObj, tx.object(rewarder.rewarder_id), tx.object.clock()],
      });
    });
    const updateRequest = tx.moveCall({
      target: `${config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::destroy_checker`,
      typeArguments: [coinType],
      arguments: [registryObj, checker],
    });
    tx.moveCall({
      target: `${config.BLACKLIST_PACKAGE_ID}::blacklist_rule::check`,
      typeArguments: [coinType],
      arguments: [tx.sharedObjectRef(config.BLACKLIST_OBJ), updateRequest],
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
  async updatePosition(
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
  ): Promise<TransactionNestedResult[]> {
    const config = await this.getConfig();
    const priceResultType = `${config.ORIGINAL_ORACLE_PACKAGE_ID}::result::PriceResult<${coinType}>`;
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
      target: `${config.CDP_PACKAGE_ID}::vault::update_position`,
      typeArguments: [coinType],
      arguments: [
        await this.vault(tx, { coinType }),
        await this.treasury(tx),
        tx.object.clock(),
        priceResultOpt,
        updateRequest,
      ],
    });
    return [inputCoin, usdbCoin, response];
  }

  /**
   * @description check and destroy UpdateResponse
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param response: UpdateResponse generated by update_position
   */
  async checkUpdatePositionResponse(
    tx: Transaction,
    { coinType, response }: { coinType: string; response: TransactionArgument },
  ): Promise<void> {
    const config = await this.getConfig();
    tx.moveCall({
      target: `${config.CDP_PACKAGE_ID}::vault::destroy_response`,
      typeArguments: [coinType],
      arguments: [await this.vault(tx, { coinType }), await this.treasury(tx), response],
    });
  }

  /**
   * @description
   */
  async savingPoolDeposit(
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
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    const depositResponse = tx.moveCall({
      target: `${config.SAVING_PACKAGE_ID}::saving::deposit`,
      typeArguments: [lpType],
      arguments: [
        await this.savingPoolObj(tx, { lpType }),
        await this.treasury(tx),
        await this.accountAddress(tx, { address, accountObjectOrId }),
        usdbCoin,
        tx.object.clock(),
      ],
    });
    return depositResponse;
  }

  /**
   * @description
   */
  private async updateSavingPoolIncentiveDepositAction(
    tx: Transaction,
    {
      lpType,
      depositResponse,
    }: {
      lpType: string;
      depositResponse: TransactionArgument;
    },
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    const savingPool = await this.getSavingPoolObjectInfo({ lpType });

    if (!savingPool.reward) {
      throw new Error(`No rewards for ${lpType}`);
    }
    const depositChecker = tx.moveCall({
      target: `${config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::new_checker_for_deposit_action`,
      typeArguments: [lpType],
      arguments: [
        tx.sharedObjectRef(savingPool.reward.reward_manager),
        tx.sharedObjectRef(config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ),
        depositResponse,
      ],
    });
    savingPool.reward.reward_types.forEach((rewardType) => {
      tx.moveCall({
        target: `${config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::update_deposit_action`,
        typeArguments: [lpType, rewardType],
        arguments: [
          depositChecker,
          tx.sharedObjectRef(config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ),
          tx.sharedObjectRef(savingPool.reward!.reward_manager),
          tx.sharedObjectRef(savingPool.pool),
          tx.object.clock(),
        ],
      });
    });
    const finalResponse = tx.moveCall({
      target: `${config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::destroy_deposit_checker`,
      typeArguments: [lpType],
      arguments: [depositChecker, tx.sharedObjectRef(config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ)],
    });
    return finalResponse;
  }

  /**
   * @description
   */
  async checkDepositResponse(
    tx: Transaction,
    {
      lpType,
      depositResponse,
    }: {
      lpType: string;
      depositResponse: TransactionArgument;
    },
  ): Promise<void> {
    const config = await this.getConfig();
    tx.moveCall({
      target: `${config.SAVING_PACKAGE_ID}::saving::check_deposit_response`,
      typeArguments: [lpType],
      arguments: [
        await this.updateSavingPoolIncentiveDepositAction(tx, { lpType, depositResponse }),
        await this.savingPoolObj(tx, { lpType }),
        await this.treasury(tx),
      ],
    });
  }

  /**
   * @description
   */
  async savingPoolWithdraw(
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
  ): Promise<[TransactionNestedResult, TransactionNestedResult]> {
    const config = await this.getConfig();
    const accountReq = await this.newAccountRequest(tx, { accountObjectOrId });

    const [usdbCoin, withdrawResponse] = tx.moveCall({
      target: `${config.SAVING_PACKAGE_ID}::saving::withdraw`,
      typeArguments: [lpType],
      arguments: [
        await this.savingPoolObj(tx, { lpType }),
        await this.treasury(tx),
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
  private async updateSavingPoolIncentiveWithdrawAction(
    tx: Transaction,
    {
      lpType,
      withdrawResponse,
    }: {
      lpType: string;
      withdrawResponse: TransactionArgument;
    },
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    const savingPool = await this.getSavingPoolObjectInfo({ lpType });

    if (!savingPool.reward) {
      throw new Error(`No rewards for ${lpType}`);
    }
    const withdrawChecker = tx.moveCall({
      target: `${config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::new_checker_for_withdraw_action`,
      typeArguments: [lpType],
      arguments: [
        tx.sharedObjectRef(savingPool.reward.reward_manager),
        tx.sharedObjectRef(config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ),
        withdrawResponse,
      ],
    });
    savingPool.reward.reward_types.forEach((rewardType) => {
      tx.moveCall({
        target: `${config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::update_withdraw_action`,
        typeArguments: [lpType, rewardType],
        arguments: [
          withdrawChecker,
          tx.sharedObjectRef(config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ),
          tx.sharedObjectRef(savingPool.reward!.reward_manager),
          tx.sharedObjectRef(savingPool.pool),
          tx.object.clock(),
        ],
      });
    });
    const finalResponse = tx.moveCall({
      target: `${config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::destroy_withdraw_checker`,
      typeArguments: [lpType],
      arguments: [withdrawChecker, tx.sharedObjectRef(config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ)],
    });
    return finalResponse;
  }

  /**
   * @description
   */
  async checkWithdrawResponse(
    tx: Transaction,
    {
      lpType,
      withdrawResponse,
    }: {
      lpType: string;
      withdrawResponse: TransactionArgument;
    },
  ): Promise<void> {
    const config = await this.getConfig();
    tx.moveCall({
      target: `${config.SAVING_PACKAGE_ID}::saving::check_withdraw_response`,
      typeArguments: [lpType],
      arguments: [
        await this.updateSavingPoolIncentiveWithdrawAction(tx, { lpType, withdrawResponse }),
        await this.savingPoolObj(tx, { lpType }),
        await this.treasury(tx),
      ],
    });
  }

  /**
   * @description
   */
  async claimPoolIncentive(
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
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    const savingPool = await this.getSavingPoolObjectInfo({ lpType });

    if (!savingPool.reward) {
      return getZeroCoin(tx, { coinType: rewardType });
    }
    const accountReq = await this.newAccountRequest(tx, { accountObjectOrId });

    const rewardCoin = tx.moveCall({
      target: `${config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::claim`,
      typeArguments: [lpType, rewardType],
      arguments: [
        tx.sharedObjectRef(savingPool.reward.reward_manager),
        await this.savingPoolGlobalConfig(tx),
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
  async psmSwapIn(
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
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    const partner = tx.object.option({
      type: `${config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: await this.newAccountRequest(tx, { accountObjectOrId }),
    });
    const usdbCoin = tx.moveCall({
      target: `${config.PSM_PACKAGE_ID}::pool::swap_in`,
      typeArguments: [coinType],
      arguments: [await this.psmPoolObj(tx, { coinType }), await this.treasury(tx), priceResult, inputCoin, partner],
    });
    return usdbCoin;
  }

  /**
   * @description
   */
  async psmSwapOut(
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
  ): Promise<TransactionResult> {
    const config = await this.getConfig();
    const partner = tx.object.option({
      type: `${config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: await this.newAccountRequest(tx, { accountObjectOrId }),
    });
    const inputCoin = tx.moveCall({
      target: `${config.PSM_PACKAGE_ID}::pool::swap_out`,
      typeArguments: [coinType],
      arguments: [await this.psmPoolObj(tx, { coinType }), await this.treasury(tx), priceResult, usdbCoin, partner],
    });
    return inputCoin;
  }

  /**
   * @description
   */
  async flashMint(
    tx: Transaction,
    {
      accountObjectOrId,
      amount,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      amount: number | TransactionArgument;
    },
  ): Promise<[TransactionNestedResult, TransactionNestedResult]> {
    const config = await this.getConfig();
    const partner = tx.object.option({
      type: `${config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: await this.newAccountRequest(tx, { accountObjectOrId }),
    });
    const [usdbCoin, flashMintReceipt] = tx.moveCall({
      target: `${config.FLASH_PACKAGE_ID}::config::flash_mint`,
      arguments: [
        await this.flashGlobalConfig(tx),
        await this.treasury(tx),
        partner,
        typeof amount === 'number' ? tx.pure.u64(amount) : amount,
      ],
    });
    return [usdbCoin, flashMintReceipt];
  }

  /**
   * @description
   */
  async flashBurn(
    tx: Transaction,
    {
      usdbCoin,
      flashMintReceipt,
    }: {
      usdbCoin: TransactionArgument;
      flashMintReceipt: TransactionArgument;
    },
  ): Promise<void> {
    const config = await this.getConfig();
    tx.moveCall({
      target: `${config.FLASH_PACKAGE_ID}::config::flash_burn`,
      arguments: [await this.flashGlobalConfig(tx), await this.treasury(tx), usdbCoin, flashMintReceipt],
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
    const usdbCoinType = await this.getUsdbCoinType();
    const depositCoin =
      typeof depositCoinOrAmount === 'number'
        ? coinWithBalance({ balance: depositCoinOrAmount, type: coinType })
        : depositCoinOrAmount;
    const repayCoin =
      typeof repayCoinOrAmount === 'number'
        ? coinWithBalance({ balance: repayCoinOrAmount, type: usdbCoinType })
        : repayCoinOrAmount;

    const debtorRequest = await this.debtorRequest(tx, {
      accountObjectOrId,
      coinType,
      depositCoin,
      borrowAmount,
      repayCoin,
      withdrawAmount,
    });
    const updateRequest = await this.checkUpdatePositionRequest(tx, { coinType, request: debtorRequest });
    const [priceResult] =
      borrowAmount || withdrawAmount ? await this.aggregatePrices(tx, { coinTypes: [coinType] }) : [];

    const [collateralCoin, usdbCoin, response] = await this.updatePosition(tx, {
      coinType,
      updateRequest,
      priceResult,
    });
    await this.checkUpdatePositionResponse(tx, { coinType, response });

    if (withdrawAmount === 0) {
      destroyZeroCoin(tx, { coinType: coinType, coin: collateralCoin });
    }
    if (borrowAmount === 0) {
      destroyZeroCoin(tx, { coinType: usdbCoinType, coin: usdbCoin });
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
  async buildClosePositionTransaction(
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
  ): Promise<[TransactionNestedResult, TransactionObjectArgument | undefined]> {
    const config = await this.getConfig();
    const usdbCoinType = await this.getUsdbCoinType();
    const [collateralAmount, debtAmount] = tx.moveCall({
      target: `${config.CDP_PACKAGE_ID}::vault::get_position_data`,
      typeArguments: [coinType],
      arguments: [
        await this.vault(tx, { coinType }),
        await this.accountAddress(tx, { address, accountObjectOrId }),
        tx.object.clock(),
      ],
    });
    const splittedRepayCoin = repayCoin
      ? tx.splitCoins(repayCoin, [debtAmount])[0]
      : coinWithBalance({ balance: debtAmount, type: usdbCoinType });

    const debtorRequest = await this.debtorRequest(tx, {
      accountObjectOrId,
      coinType,
      repayCoin: splittedRepayCoin,
      withdrawAmount: collateralAmount,
    });
    const updateRequest = await this.checkUpdatePositionRequest(tx, { coinType, request: debtorRequest });
    const [collateralCoin, usdbCoin, response] = await this.updatePosition(tx, {
      coinType,
      updateRequest,
    });
    await this.checkUpdatePositionResponse(tx, { coinType, response });

    destroyZeroCoin(tx, { coinType: usdbCoinType, coin: usdbCoin });

    return [collateralCoin, repayCoin];
  }

  /**
   * @description claim borrow rewards and return
   * @param accountObjectOrId: the Account object to hold position (undefined if just use EOA)
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @returns Transaction[] if has rewards else undefined
   */
  async buildClaimBorrowRewardsTransaction(
    tx: Transaction,
    {
      accountObjectOrId,
      coinType,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      coinType: string;
    },
  ): Promise<Record<string, TransactionResult>> {
    const config = await this.getConfig();
    const vaultObj = await this.vault(tx, { coinType });
    const rewarders = (await this.getVaultObjectInfo({ coinType })).rewarders;
    const registryObj = tx.sharedObjectRef(config.VAULT_REWARDER_REGISTRY);

    if (!rewarders) {
      return {};
    }
    const result: Record<string, TransactionResult> = {};
    for (const { reward_type, rewarder_id } of rewarders) {
      result[reward_type] = tx.moveCall({
        target: `${config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::claim`,
        typeArguments: [coinType, reward_type],
        arguments: [
          registryObj,
          tx.object(rewarder_id),
          vaultObj,
          await this.newAccountRequest(tx, { accountObjectOrId }),
          tx.object.clock(),
        ],
      });
    }
    return result;
  }

  /**
   * @description
   */
  async buildDepositToSavingPoolTransaction(
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
  ): Promise<void> {
    const usdbCoinType = await this.getUsdbCoinType();
    const depositCoin =
      typeof depositCoinOrAmount === 'number'
        ? coinWithBalance({ balance: depositCoinOrAmount, type: usdbCoinType })
        : depositCoinOrAmount;

    const depositResponse = await this.savingPoolDeposit(tx, {
      address,
      accountObjectOrId,
      lpType,
      usdbCoin: depositCoin,
    });

    await this.checkDepositResponse(tx, { lpType, depositResponse });
  }

  /**
   * @description
   */
  async buildWithdrawFromSavingPoolTransaction(
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
  ): Promise<TransactionNestedResult> {
    const [usdbCoin, withdrawResponse] = await this.savingPoolWithdraw(tx, {
      accountObjectOrId,
      lpType,
      amount,
    });

    await this.checkWithdrawResponse(tx, { lpType, withdrawResponse });

    return usdbCoin;
  }

  /**
   * @description
   */
  async buildClaimSavingRewardsTransaction(
    tx: Transaction,
    {
      accountObjectOrId,
      lpType,
    }: {
      accountObjectOrId?: string | TransactionArgument;
      lpType: string;
    },
  ): Promise<Record<string, TransactionResult>> {
    const savingPool = await this.getSavingPoolObjectInfo({ lpType });

    if (!savingPool.reward) {
      return {};
    }
    const result: Record<string, TransactionResult> = {};
    for (const rewardType of savingPool.reward.reward_types) {
      result[rewardType] = await this.claimPoolIncentive(tx, {
        accountObjectOrId,
        lpType,
        rewardType,
      });
    }
    return result;
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
    const usdbCoinType = await this.getUsdbCoinType();
    const usdbCoin =
      typeof usdbCoinOrAmount === 'number'
        ? coinWithBalance({ balance: usdbCoinOrAmount, type: usdbCoinType })
        : usdbCoinOrAmount;

    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapOut(tx, { accountObjectOrId, coinType, priceResult, usdbCoin });
  }
}
