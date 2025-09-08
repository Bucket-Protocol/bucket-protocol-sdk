import { bcs } from '@mysten/sui/bcs';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import {
  Transaction,
  TransactionArgument,
  TransactionObjectArgument,
  TransactionResult,
} from '@mysten/sui/transactions';
import { normalizeStructTag } from '@mysten/sui/utils';
import { SuiPriceServiceConnection, SuiPythClient } from '@pythnetwork/pyth-sui-js';

import { TransactionNestedResult } from '@/types';
import {
  AggregatorObjectInfo,
  ConfigType,
  DerivativeKind,
  Network,
  PsmPoolObjectInfo,
  SavingPoolObjectInfo,
  VaultObjectInfo,
} from '@/types/config';
import {
  PaginatedPositionsResult,
  PositionInfo,
  PsmPoolInfo,
  SavingInfo,
  SavingPoolInfo,
  VaultInfo,
} from '@/types/struct';
import { DOUBLE_OFFSET, DUMMY_ADDRESS, FLOAT_OFFSET } from '@/consts';
import { CONFIG } from '@/consts/config';
import { coinWithBalance, destroyZeroCoin, getZeroCoin } from '@/utils/transaction';

import { VaultRewarder } from './generated/bucket_v2_borrow_incentive/borrow_incentive';
import { PositionData, Vault } from './generated/bucket_v2_cdp/vault';
import { Pool } from './generated/bucket_v2_psm/pool';
import { Field } from './generated/bucket_v2_saving_incentive/deps/sui/dynamic_field';
import { Rewarder, RewarderKey } from './generated/bucket_v2_saving_incentive/saving_incentive';
import { SavingPool } from './generated/bucket_v2_saving/saving';

export class BucketClient {
  /**
   * @description a TypeScript wrapper over Bucket V2 client.
   * @param suiClient
   * @param network
   */
  private config: ConfigType;
  private suiClient: SuiClient;
  private pythConnection: SuiPriceServiceConnection;
  private pythClient: SuiPythClient;

  constructor({
    suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') }),
    network = 'mainnet',
  }: {
    suiClient?: SuiClient;
    network?: Network;
  }) {
    this.config = CONFIG[network];
    this.suiClient = suiClient;
    this.pythConnection = new SuiPriceServiceConnection(this.config.PRICE_SERVICE_ENDPOINT);
    this.pythClient = new SuiPythClient(this.suiClient, this.config.PYTH_STATE_ID, this.config.WORMHOLE_STATE_ID);
  }

  /* ----- Getter ----- */

  /**
   * @description Get this.suiClient
   */
  getSuiClient(): SuiClient {
    return this.suiClient;
  }

  /**
   * @description Get this.pythConnection
   */
  getPythConnection(): SuiPriceServiceConnection {
    return this.pythConnection;
  }

  /**
   * @description Get this.pythClient
   */
  getPythClient(): SuiPythClient {
    return this.pythClient;
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
  async getOraclePrices({ coinTypes }: { coinTypes: string[] }): Promise<Record<string, number>> {
    const tx = new Transaction();
    await this.aggregatePrices(tx, { coinTypes });
    tx.setSender(DUMMY_ADDRESS);
    const dryrunRes = await this.suiClient.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client: this.suiClient }),
    });
    const priceResultEvent = dryrunRes.events.filter((e) => e.type.includes('PriceAggregated'));
    const pricePrecision = 10 ** 9;
    const result: Record<string, number> = {};
    priceResultEvent.map((e) => {
      const startIdx = e.type.indexOf('<') + 1;
      const endIdx = e.type.indexOf('>');
      const coinType = normalizeStructTag(e.type.slice(startIdx, endIdx));
      result[coinType] = +(e.parsedJson as { result: string }).result / pricePrecision;
    });
    return result;
  }

  /**
   * @description
   */
  async getAllOraclePrices(): Promise<Record<string, number>> {
    const coinTypes = this.getAllOracleCoinTypes();
    return this.getOraclePrices({ coinTypes });
  }

  /**
   * @description Get all vault objects
   */
  async getAllVaultObjects(): Promise<Record<string, VaultInfo>> {
    const vaultObjectIds = Object.values(this.config.VAULT_OBJS).map((v) => v.vault.objectId);
    const allCollateralTypes = this.getAllCollateralTypes();

    const res = await this.suiClient.multiGetObjects({
      ids: vaultObjectIds,
      options: {
        showBcs: true,
      },
    });
    const rewardFlowRates = await Promise.all(
      allCollateralTypes.map((coinType) => this.getBorrowRewardFlowRate({ coinType })),
    );
    return Object.keys(this.config.VAULT_OBJS).reduce(
      (result, collateralType, index) => {
        const data = res[index].data;
        const flowRates = rewardFlowRates[index];

        if (data?.bcs?.dataType !== 'moveObject') {
          throw new Error(`Failed to parse vault object`);
        }
        const vault = Vault.fromBase64(data.bcs.bcsBytes);

        result[collateralType] = {
          collateralType,
          positionTableSize: +vault.position_table.size,
          collateralDecimal: +vault.decimal,
          collateralBalance: BigInt(vault.balance.value),
          usdbSupply: BigInt(vault.limited_supply.supply),
          maxUsdbSupply: BigInt(vault.limited_supply.limit),
          interestRate: Number((BigInt(vault.interest_rate.value) * 10000n) / DOUBLE_OFFSET) / 10000,
          minCollateralRatio: Number((BigInt(vault.min_collateral_ratio.value) * 10000n) / FLOAT_OFFSET) / 10000,
          rewardRate: Object.keys(flowRates).reduce(
            (result, rewardType) => ({
              ...result,
              [rewardType]:
                Number(
                  ((flowRates[rewardType] / BigInt(vault.limited_supply.supply)) * 365n * 86400000n * 10000n) /
                    DOUBLE_OFFSET,
                ) / 10000,
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
      .getDynamicFields({ parentId: pool.reward.rewardManager.objectId })
      .then((res) => res.data.map((df) => df.objectId));

    const savingPoolRewards = await this.suiClient.multiGetObjects({
      ids: rewardObjectIds,
      options: {
        showBcs: true,
      },
    });
    const rewarders = savingPoolRewards.map((rewarder) => {
      if (rewarder.data?.bcs?.dataType !== 'moveObject') {
        throw new Error(`Failed to parse reward object for ${lpType} SavingPool`);
      }
      return Field(RewarderKey, Rewarder).fromBase64(rewarder.data.bcs.bcsBytes);
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
   * @description
   */
  async getBorrowRewardFlowRate({ coinType }: { coinType: string }): Promise<Record<string, bigint>> {
    const vault = this.getVaultObjectInfo({ coinType });
    if (!vault.rewarders) {
      return {};
    }
    const rewardObjectIds = vault.rewarders.map((rewarder) => rewarder.rewarderId);

    const vaultRewardersRes = await this.suiClient.multiGetObjects({
      ids: rewardObjectIds,
      options: {
        showBcs: true,
      },
    });
    const rewarders = vaultRewardersRes.map((rewarder) => {
      if (rewarder.data?.bcs?.dataType !== 'moveObject') {
        throw new Error(`Failed to parse reward object for ${coinType}`);
      }
      return VaultRewarder.fromBase64(rewarder.data.bcs.bcsBytes);
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
   * @description Get all Saving pool objects
   */
  async getAllSavingPoolObjects(): Promise<Record<string, SavingPoolInfo>> {
    const lpTypes = Object.keys(this.config.SAVING_POOL_OBJS);
    const poolObjectIds = Object.values(this.config.SAVING_POOL_OBJS).map((v) => v.pool.objectId);

    const res = await this.suiClient.multiGetObjects({
      ids: poolObjectIds,
      options: {
        showBcs: true,
      },
    });
    const rewardFlowRates = await Promise.all(lpTypes.map((lpType) => this.getSavingPoolRewardFlowRate({ lpType })));

    return Object.keys(this.config.SAVING_POOL_OBJS).reduce(
      (result, lpType, index) => {
        const data = res[index].data;
        const flowRates = rewardFlowRates[index];

        if (data?.bcs?.dataType !== 'moveObject') {
          throw new Error(`Failed to parse pool object`);
        }
        const pool = SavingPool.fromBase64(data.bcs.bcsBytes);

        result[lpType] = {
          lpType,
          lpSupply: BigInt(pool.lp_supply.value),
          usdbBalance: BigInt(pool.usdb_reserve_balance.value),
          usdbDepositCap: pool.deposit_cap_amount !== null ? BigInt(pool.deposit_cap_amount) : null,
          savingRate: Number((BigInt(pool.saving_config.saving_rate.value) * 10000n) / DOUBLE_OFFSET) / 10000,
          rewardRate: Object.keys(flowRates).reduce(
            (result, rewardType) => ({
              ...result,
              [rewardType]:
                Number(
                  ((flowRates[rewardType] / BigInt(pool.usdb_reserve_balance.value)) * 365n * 86400000n * 10000n) /
                    DOUBLE_OFFSET,
                ) / 10000,
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

    const res = await this.suiClient.multiGetObjects({
      ids: poolObjectIds,
      options: {
        showBcs: true,
      },
    });
    return Object.keys(this.config.PSM_POOL_OBJS).reduce(
      (result, coinType, index) => {
        const data = res[index].data;

        if (data?.bcs?.dataType !== 'moveObject') {
          throw new Error(`Failed to parse pool object`);
        }
        const pool = Pool.fromBase64(data.bcs.bcsBytes);

        result[coinType] = {
          coinType,
          decimal: +pool.decimal,
          balance: BigInt(pool.balance.value),
          usdbSupply: BigInt(pool.usdb_supply),
          feeRate: {
            swapIn: Number((BigInt(pool.default_fee_config.swap_in_fee_rate.value) * 10000n) / FLOAT_OFFSET) / 10000,
            swapOut: Number((BigInt(pool.default_fee_config.swap_out_fee_rate.value) * 10000n) / FLOAT_OFFSET) / 10000,
          },
          partnerFeeRate: pool.partner_fee_configs.contents.reduce(
            (result, { key, value }) => {
              result[key] = {
                swapIn: Number((BigInt(value.swap_in_fee_rate.value) * 10000n) / FLOAT_OFFSET) / 10000,
                swapOut: Number((BigInt(value.swap_out_fee_rate.value) * 10000n) / FLOAT_OFFSET) / 10000,
              };
              return result;
            },
            {} as PsmPoolInfo['partnerFeeRate'],
          ),
        };
        return result;
      },
      {} as Record<string, PsmPoolInfo>,
    );
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
    const res = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: DUMMY_ADDRESS,
    });
    if (!res.results?.[0]?.returnValues) {
      return {
        positions: [],
        nextCursor: null,
      };
    }
    const [positionBytes, nextCursorBytes] = res.results[0].returnValues;

    return {
      positions: bcs
        .vector(PositionData)
        .parse(Uint8Array.from(positionBytes ? positionBytes[0] : []))
        .map((pos) => ({
          collateralType: coinType,
          collateralAmount: BigInt(pos.coll_amount),
          debtAmount: BigInt(pos.debt_amount),
          debtor: pos.debtor,
        })),
      nextCursor: bcs.option(bcs.Address).parse(Uint8Array.from(nextCursorBytes ? nextCursorBytes[0] : [])),
    };
  }

  /**
   * @description Get position data given account (can be wallet address or Account object ID)
   */
  async getAccountPositions({
    address,
    isAccountId = false,
  }: {
    address: string;
    isAccountId?: boolean;
  }): Promise<PositionInfo[]> {
    const tx = new Transaction();

    Object.entries(this.config.VAULT_OBJS).map(([coinType, { vault }]) => {
      tx.moveCall({
        target: `${this.config.CDP_PACKAGE_ID}::vault::try_get_position_data`,
        typeArguments: [coinType],
        arguments: [tx.sharedObjectRef(vault), tx.pure.address(address), tx.object.clock()],
      });
    });
    const res = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: DUMMY_ADDRESS,
    });
    if (!res.results) {
      return [];
    }
    const accountId = isAccountId ? address : undefined;
    return Object.keys(this.config.VAULT_OBJS).reduce((result, collateralType, index) => {
      if (!res.results?.[index]?.returnValues) {
        return result;
      }
      const collateralAmount = BigInt(bcs.u64().parse(Uint8Array.from(res.results[index].returnValues[0][0])));
      const debtAmount = BigInt(bcs.u64().parse(Uint8Array.from(res.results[index].returnValues[1][0])));

      if (collateralAmount || debtAmount) {
        result.push({
          collateralType,
          collateralAmount,
          debtAmount,
          debtor: address,
          accountId,
        });
      }
      return result;
    }, [] as PositionInfo[]);
  }

  /**
   * @description Get position data given wallet address
   */
  async getUserPositions({ address }: { address: string }): Promise<PositionInfo[]> {
    const accountObjRes = await this.suiClient.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${this.config.ORIGINAL_FRAMEWORK_PACKAGE_ID}::account::Account`,
      },
    });
    const positionPromises = [
      this.getAccountPositions({ address }),
      ...accountObjRes.data
        .map((data) => data.data?.objectId)
        .map((accountId) => {
          if (accountId) {
            return this.getAccountPositions({ address: accountId, isAccountId: true });
          } else {
            return [];
          }
        }),
    ];
    return (await Promise.all(positionPromises)).flat();
  }

  /**
   * @description Get debtor's borrow rewards of given collateral coin type
   */
  async getUserBorrowRewards({
    address,
    coinType,
  }: {
    address: string;
    coinType: string;
  }): Promise<Record<string, number>> {
    const tx = new Transaction();
    const vaultInfo = this.getVaultObjectInfo({ coinType });
    const rewarders = vaultInfo.rewarders;
    const vaultObj = tx.sharedObjectRef(vaultInfo.vault);
    if (!rewarders) return {};
    rewarders.map((rewarder) => {
      tx.moveCall({
        target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::realtime_reward_amount`,
        typeArguments: [coinType, rewarder.rewardType],
        arguments: [tx.object(rewarder.rewarderId), vaultObj, tx.pure.address(address), tx.object.clock()],
      });
    });
    const res = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: address,
    });
    if (!res.results) return {};
    const rewards: Record<string, number> = {};
    res.results.map((value, idx) => {
      const rewarder = rewarders[idx];
      if (rewarder && value.returnValues) {
        const [rewardAmount] = value.returnValues;
        rewards[rewarder.rewardType] = Number(rewardAmount ? bcs.u64().parse(Uint8Array.from(rewardAmount[0])) : '0');
      }
    });
    return rewards;
  }

  async getUserSavingPoolRewards({
    lpType,
    address,
  }: {
    lpType: string;
    address: string;
  }): Promise<Record<string, bigint>> {
    const pool = this.getSavingPoolObjectInfo({ lpType });

    if (!pool.reward) {
      return {};
    }
    const tx = new Transaction();

    pool.reward.rewardTypes.forEach((rewardType) => {
      const rewarder = tx.moveCall({
        target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::get_rewarder`,
        typeArguments: [lpType, rewardType],
        arguments: [tx.sharedObjectRef(pool.reward!.rewardManager)],
      });
      tx.moveCall({
        target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::realtime_reward_amount`,
        typeArguments: [lpType, rewardType],
        arguments: [rewarder, tx.sharedObjectRef(pool.pool), tx.pure.address(address), tx.object.clock()],
      });
    });
    const res = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: DUMMY_ADDRESS,
    });
    return pool.reward.rewardTypes.reduce(
      (result, rewardType, index) => {
        if (!res.results?.[2 * index + 1]?.returnValues) {
          return result;
        }
        const realtimeReward = bcs.u64().parse(Uint8Array.from(res.results[2 * index + 1].returnValues![0][0]));

        return { ...result, [rewardType]: BigInt(realtimeReward) };
      },
      {} as Record<string, bigint>,
    );
  }

  /**
   * @description
   */
  async getUserSavings({ address }: { address: string }): Promise<Record<string, SavingInfo>> {
    const lpTypes = Object.keys(this.config.SAVING_POOL_OBJS);

    const tx = new Transaction();

    lpTypes.map((lpType) => {
      tx.moveCall({
        target: `${this.config.SAVING_PACKAGE_ID}::saving::lp_token_value_of`,
        typeArguments: [lpType],
        arguments: [this.savingPoolObj(tx, { lpType }), tx.pure.address(address), tx.object.clock()],
      });
      tx.moveCall({
        target: `${this.config.SAVING_PACKAGE_ID}::saving::lp_balance_of`,
        typeArguments: [lpType],
        arguments: [this.savingPoolObj(tx, { lpType }), tx.pure.address(address)],
      });
    });
    const res = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: DUMMY_ADDRESS,
    });
    const rewards = await Promise.all(lpTypes.map((lpType) => this.getUserSavingPoolRewards({ lpType, address })));

    return Object.keys(this.config.SAVING_POOL_OBJS).reduce(
      (result, lpType, index) => {
        if (!res.results?.[2 * index]?.returnValues || !res.results?.[2 * index + 1]?.returnValues) {
          return result;
        }
        const usdbBalance = BigInt(bcs.u64().parse(Uint8Array.from(res.results[2 * index].returnValues![0][0])));
        const lpBalance = BigInt(bcs.u64().parse(Uint8Array.from(res.results[2 * index + 1].returnValues![0][0])));

        return {
          ...result,
          [lpType]: {
            lpType,
            usdbBalance,
            lpBalance,
            rewards: rewards[index],
          },
        };
      },
      {} as Record<string, SavingInfo>,
    );
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
    const aggInfo = this.getAggregatorObjectInfo({ coinType });
    const underlyingCoinType = aggInfo.derivativeInfo?.underlyingCoinType as string;
    const kind = aggInfo.derivativeInfo?.derivativeKind as DerivativeKind;
    const collector = this.newPriceCollector(tx, { coinType });
    if (kind === 'sCoin') {
      const scoinRuleConfig = tx.sharedObjectRef({
        objectId: '0xe5a7b5c2a17811b03a48b9fa277319ffe4e629ce93b862c08fed71fb11b27618',
        initialSharedVersion: 610893718,
        mutable: false,
      });
      const scallopVersion = tx.sharedObjectRef({
        objectId: '0x07871c4b3c847a0f674510d4978d5cf6f960452795e8ff6f189fd2088a3f6ac7',
        initialSharedVersion: 7765848,
        mutable: false,
      });
      const scallopMarket = tx.sharedObjectRef({
        objectId: '0xa757975255146dc9686aa823b7838b507f315d704f428cbadad2f4ea061939d9',
        initialSharedVersion: 7765848,
        mutable: true,
      });
      tx.moveCall({
        target: '0x18f4f3cd05ab7ff6dc0c41c692e3caae925927cc096f1de3de81d85a89f87aca::scoin_rule::feed',
        typeArguments: [coinType, underlyingCoinType],
        arguments: [
          collector,
          scoinRuleConfig,
          underlyingPriceResult,
          scallopVersion,
          scallopMarket,
          tx.object.clock(),
        ],
      });
    } else {
      const gcoinRuleConfig = tx.sharedObjectRef({
        objectId: '0x6466f287d8864c56de1459ad294907d2a06767e9589ae953cc5e0f009fc1cfd7',
        initialSharedVersion: 610893721,
        mutable: false,
      });
      const unihouse = tx.sharedObjectRef({
        objectId: '0x75c63644536b1a7155d20d62d9f88bf794dc847ea296288ddaf306aa320168ab',
        initialSharedVersion: 333730283,
        mutable: false,
      });
      tx.moveCall({
        target: '0xba3c970933047c6e235424d7040a9a4e89d8fc1200d780a69b2666434f3a7313::gcoin_rule::feed',
        typeArguments: [coinType, underlyingCoinType],
        arguments: [collector, underlyingPriceResult, gcoinRuleConfig, unihouse],
      });
    }
    return tx.moveCall({
      target: `${this.config.ORACLE_PACKAGE_ID}::aggregator::aggregate`,
      typeArguments: [coinType],
      arguments: [tx.sharedObjectRef(aggInfo.priceAggregator), collector],
    });
  }

  /**
   * @description Get a basic (not derivative) price result
   * @param collateral coin type, e.g "0x2::sui::SUI"
   * @return [PriceResult]
   */
  async aggregateBasicPrices(tx: Transaction, { coinTypes }: { coinTypes: string[] }): Promise<TransactionResult[]> {
    const aggInfoList = coinTypes.map((coinType) => {
      const aggInfo = this.getAggregatorObjectInfo({ coinType });
      if (!aggInfo.pythPriceId) throw new Error(`${coinType} has no basic price`);
      return aggInfo;
    });
    const pythPriceIds = aggInfoList.map((aggInfo) => aggInfo.pythPriceId ?? '');

    const updateData = await this.pythConnection.getPriceFeedsUpdateData(pythPriceIds);
    const priceInfoObjIds = await this.pythClient.updatePriceFeeds(tx, updateData, pythPriceIds);

    return coinTypes.map((coinType, idx) => {
      const collector = this.newPriceCollector(tx, { coinType });

      tx.moveCall({
        target: `${this.config.PYTH_RULE_PACKAGE_ID}::pyth_rule::feed`,
        typeArguments: [coinType],
        arguments: [
          collector,
          tx.sharedObjectRef(this.config.PYTH_RULE_CONFIG_OBJ),
          tx.object.clock(),
          tx.object(this.config.PYTH_STATE_ID),
          tx.object(priceInfoObjIds[idx]),
        ],
      });
      const priceResult = tx.moveCall({
        target: `${this.config.ORACLE_PACKAGE_ID}::aggregator::aggregate`,
        typeArguments: [coinType],
        arguments: [tx.sharedObjectRef(aggInfoList[idx].priceAggregator), collector],
      });
      return priceResult;
    });
  }

  /**
   * @description
   */
  async aggregatePrices(tx: Transaction, { coinTypes }: { coinTypes: string[] }): Promise<TransactionResult[]> {
    const basicCoinTypes = coinTypes.filter((coinType) => {
      const aggInfo = this.getAggregatorObjectInfo({ coinType });
      return aggInfo.pythPriceId !== undefined;
    });
    const underlyingCoinTypes = coinTypes
      .map((coinType) => {
        const aggInfo = this.getAggregatorObjectInfo({ coinType });
        return aggInfo.derivativeInfo?.underlyingCoinType ?? '';
      })
      .filter((coinType) => coinType.length > 0 && !basicCoinTypes.includes(coinType));
    const totalBasicCoinTypes = [...basicCoinTypes, ...underlyingCoinTypes];
    const priceResults = await this.aggregateBasicPrices(tx, { coinTypes: totalBasicCoinTypes });
    const priceResultRecord: Record<string, TransactionResult> = {};
    totalBasicCoinTypes.map((coinType, idx) => {
      priceResultRecord[coinType] = priceResults[idx];
    });

    // deal with exchange rate
    coinTypes
      .filter((coinType) => {
        const aggInfo = this.getAggregatorObjectInfo({ coinType });
        return aggInfo.derivativeInfo !== undefined;
      })
      .map((coinType) => {
        const aggInfo = this.getAggregatorObjectInfo({ coinType });
        const underlyingCoinType = aggInfo.derivativeInfo?.underlyingCoinType ?? '';
        priceResultRecord[coinType] = this.getDerivativePrice(tx, {
          coinType,
          underlyingPriceResult: priceResultRecord[underlyingCoinType],
        });
      });
    return coinTypes.map((coinType) => priceResultRecord[coinType]);
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
      coinType,
      depositCoin = getZeroCoin(tx, { coinType: coinType }),
      borrowAmount = 0,
      repayCoin = getZeroCoin(tx, { coinType: this.getUsdbCoinType() }),
      withdrawAmount = 0,
      accountObjectOrId,
    }: {
      coinType: string;
      depositCoin?: TransactionArgument;
      borrowAmount?: number | TransactionArgument;
      repayCoin?: TransactionArgument;
      withdrawAmount?: number | TransactionArgument;
      accountObjectOrId?: string | TransactionArgument;
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
    const clockObj = tx.sharedObjectRef({
      objectId: '0x6',
      initialSharedVersion: 1,
      mutable: false,
    });
    const checker = tx.moveCall({
      target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::new_checker`,
      typeArguments: [coinType],
      arguments: [registryObj, request],
    });
    (rewarders ?? []).map((rewarder) => {
      tx.moveCall({
        target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::update`,
        typeArguments: [coinType, rewarder.rewardType],
        arguments: [registryObj, checker, vaultObj, tx.object(rewarder.rewarderId), clockObj],
      });
    });
    return tx.moveCall({
      target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::destroy_checker`,
      typeArguments: [coinType],
      arguments: [registryObj, checker],
    });
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
      lpType,
      usdbCoin,
      account,
    }: {
      lpType: string;
      usdbCoin: TransactionArgument;
      account: string;
    },
  ): TransactionResult {
    const depositResponse = tx.moveCall({
      target: `${this.config.SAVING_PACKAGE_ID}::saving::deposit`,
      typeArguments: [lpType],
      arguments: [
        this.savingPoolObj(tx, { lpType }),
        this.treasury(tx),
        tx.pure.address(account),
        usdbCoin,
        tx.object.clock(),
      ],
    });
    return depositResponse;
  }

  /**
   * @description
   */
  updateSavingPoolIncentiveDepositAction(
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
      arguments: [depositResponse, this.savingPoolObj(tx, { lpType }), this.treasury(tx)],
    });
  }

  /**
   * @description
   */
  savingPoolWithdraw(
    tx: Transaction,
    {
      lpType,
      amount,
      accountObjectOrId,
    }: {
      lpType: string;
      amount: number;
      accountObjectOrId?: string | TransactionArgument;
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
  updateSavingPoolIncentiveWithdrawAction(
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
      arguments: [withdrawResponse, this.savingPoolObj(tx, { lpType }), this.treasury(tx)],
    });
  }

  /**
   * @description
   */
  claimPoolIncentive(
    tx: Transaction,
    {
      lpType,
      rewardType,
      accountObjectOrId,
    }: {
      lpType: string;
      rewardType: string;
      accountObjectOrId?: string | TransactionArgument;
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
      coinType,
      priceResult,
      inputCoin,
      accountObjectOrId,
    }: {
      coinType: string;
      priceResult: TransactionArgument;
      inputCoin: TransactionArgument;
      accountObjectOrId?: string | TransactionArgument;
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
      coinType,
      priceResult,
      usdbCoin,
      accountObjectOrId,
    }: {
      coinType: string;
      priceResult: TransactionArgument;
      usdbCoin: TransactionArgument;
      accountObjectOrId?: string | TransactionArgument;
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
      amount,
      accountObjectOrId,
    }: {
      amount: number | TransactionArgument;
      accountObjectOrId?: string | TransactionArgument;
    },
  ): [TransactionNestedResult, TransactionNestedResult] {
    const partner = tx.object.option({
      type: `${this.config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: accountObjectOrId ? this.newAccountRequest(tx, { accountObjectOrId: accountObjectOrId }) : null,
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
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param depositAmount: how much amount to deposit (collateral)
   * @param borrowAmount: how much amount to borrow (USDB)
   * @param repayAmount: how much amount to repay (USDB)
   * @param withdrawAmount: how much amount to withdraw (collateral)
   * @param accountObjectOrId: the Account object to hold position (undefined if just use EOA)
   * @param recipient (optional): the recipient of the output coins
   * @returns Transaction
   */
  async buildManagePositionTransaction(
    tx: Transaction,
    {
      coinType,
      depositCoinOrAmount = 0,
      borrowAmount = 0,
      repayCoinOrAmount = 0,
      withdrawAmount = 0,
      accountObjectOrId,
    }: {
      coinType: string;
      depositCoinOrAmount?: number | TransactionArgument;
      borrowAmount?: number | TransactionArgument;
      repayCoinOrAmount?: number | TransactionArgument;
      withdrawAmount?: number | TransactionArgument;
      accountObjectOrId?: string | TransactionArgument;
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
      coinType,
      depositCoin,
      borrowAmount,
      repayCoin,
      withdrawAmount,
      accountObjectOrId: accountObjectOrId,
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
      coinType,
      repayCoin,
      accountObjectOrId,
      address,
    }: {
      coinType: string;
      repayCoin?: TransactionObjectArgument;
      accountObjectOrId?: string | TransactionArgument;
      address: string;
    },
  ): [TransactionNestedResult, TransactionObjectArgument | undefined] {
    const [collateralAmount, debtAmount] = tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::get_position_data`,
      typeArguments: [coinType],
      arguments: [this.vault(tx, { coinType }), tx.pure.address(address), tx.object.clock()],
    });
    const splittedRepayCoin = repayCoin
      ? tx.splitCoins(repayCoin, [debtAmount])[0]
      : coinWithBalance({ balance: debtAmount, type: this.getUsdbCoinType() });

    const debtorRequest = this.debtorRequest(tx, {
      coinType,
      repayCoin: splittedRepayCoin,
      withdrawAmount: collateralAmount,
      accountObjectOrId: accountObjectOrId,
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
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param accountObjectOrId: the Account object to hold position (undefined if just use EOA)
   * @returns Transaction[] if has rewards else undefined
   */
  buildClaimBorrowRewardsTransaction(
    tx: Transaction,
    {
      coinType,
      accountObjectOrId,
    }: {
      coinType: string;
      accountObjectOrId?: string | TransactionArgument;
    },
  ): TransactionResult[] | undefined {
    const vaultObj = this.vault(tx, { coinType });
    const rewarders = this.getVaultObjectInfo({ coinType }).rewarders;
    const registryObj = tx.sharedObjectRef(this.config.VAULT_REWARDER_REGISTRY);

    return rewarders?.map((rewarder) => {
      return tx.moveCall({
        target: `${this.config.BORROW_INCENTIVE_PACKAGE_ID}::borrow_incentive::claim`,
        typeArguments: [coinType, rewarder.rewardType],
        arguments: [
          registryObj,
          tx.object(rewarder.rewarderId),
          vaultObj,
          this.newAccountRequest(tx, { accountObjectOrId }),
          tx.object.clock(),
        ],
      });
    });
  }

  /**
   * @description
   */
  buildDepositToSavingPoolTransaction(
    tx: Transaction,
    {
      lpType,
      depositCoinOrAmount,
      account,
    }: {
      lpType: string;
      depositCoinOrAmount: number | TransactionArgument;
      account: string;
    },
  ): void {
    const depositCoin =
      typeof depositCoinOrAmount === 'number'
        ? coinWithBalance({ balance: depositCoinOrAmount, type: this.getUsdbCoinType() })
        : depositCoinOrAmount;

    const depositResponse = this.savingPoolDeposit(tx, {
      lpType,
      usdbCoin: depositCoin,
      account,
    });
    const finalResponse = this.getSavingPoolObjectInfo({ lpType }).reward
      ? this.updateSavingPoolIncentiveDepositAction(tx, { lpType, depositResponse })
      : depositResponse;

    this.checkDepositResponse(tx, { lpType, depositResponse: finalResponse });
  }

  /**
   * @description
   */
  buildWithdrawFromSavingPoolTransaction(
    tx: Transaction,
    {
      lpType,
      amount,
      accountObjectOrId,
    }: {
      lpType: string;
      amount: number;
      accountObjectOrId?: string | TransactionArgument;
    },
  ): TransactionNestedResult {
    const [usdbCoin, withdrawResponse] = this.savingPoolWithdraw(tx, {
      lpType,
      amount,
      accountObjectOrId,
    });
    const finalResponse = this.getSavingPoolObjectInfo({ lpType }).reward
      ? this.updateSavingPoolIncentiveWithdrawAction(tx, { lpType, withdrawResponse })
      : withdrawResponse;

    this.checkWithdrawResponse(tx, { lpType, withdrawResponse: finalResponse });

    return usdbCoin;
  }

  /**
   * @description
   */
  buildClaimSavingRewardsTransaction(
    tx: Transaction,
    {
      lpType,
      accountObjectOrId,
    }: {
      lpType: string;
      accountObjectOrId?: string | TransactionArgument;
    },
  ): TransactionResult[] {
    const savingPool = this.getSavingPoolObjectInfo({ lpType });

    if (!savingPool.reward) {
      return [];
    }
    return savingPool.reward.rewardTypes.map((rewardType) =>
      this.claimPoolIncentive(tx, {
        lpType,
        rewardType,
        accountObjectOrId: accountObjectOrId,
      }),
    );
  }

  /**
   * @description
   */
  async buildPSMSwapInTransaction(
    tx: Transaction,
    {
      coinType,
      inputCoinOrAmount,
      accountObjectOrId,
    }: {
      coinType: string;
      inputCoinOrAmount: number | TransactionArgument;
      accountObjectOrId?: string | TransactionArgument;
    },
  ): Promise<TransactionResult> {
    const inputCoin =
      typeof inputCoinOrAmount === 'number'
        ? coinWithBalance({ balance: inputCoinOrAmount, type: coinType })
        : inputCoinOrAmount;

    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapIn(tx, { coinType, priceResult, inputCoin, accountObjectOrId: accountObjectOrId });
  }

  /**
   * @description
   */
  async buildPSMSwapOutTransaction(
    tx: Transaction,
    {
      coinType,
      usdbCoinOrAmount,
      accountObjectOrId,
    }: {
      coinType: string;
      usdbCoinOrAmount: number | TransactionArgument;
      accountObjectOrId?: string | TransactionArgument;
    },
  ): Promise<TransactionResult> {
    const usdbCoin =
      typeof usdbCoinOrAmount === 'number'
        ? coinWithBalance({ balance: usdbCoinOrAmount, type: this.getUsdbCoinType() })
        : usdbCoinOrAmount;

    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapOut(tx, { coinType, priceResult, usdbCoin, accountObjectOrId: accountObjectOrId });
  }
}
