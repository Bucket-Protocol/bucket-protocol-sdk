import { bcs } from '@mysten/sui/bcs';
import { SuiClient } from '@mysten/sui/client';
import { Transaction, TransactionArgument, TransactionObjectArgument } from '@mysten/sui/transactions';
import { normalizeStructTag, normalizeSuiAddress, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { SuiPriceServiceConnection, SuiPythClient } from '@pythnetwork/pyth-sui-js';

import { Pool as PSMPool } from '@/_generated/bucket-psm/pool/structs';
import { getRewarder, realtimeRewardAmount } from '@/_generated/bucket-saving-incentive/saving-incentive/functions';
import { Rewarder } from '@/_generated/bucket-saving-incentive/saving-incentive/structs';
import { lpBalanceOf, lpTokenValueOf } from '@/_generated/bucket-saving/saving/functions';
import { SavingPool } from '@/_generated/bucket-saving/saving/structs';
import { POSITION_DATA, VAULT } from '@/structs';
import { AggregatorObjectInfo, ConfigType, Network, PSMPoolObjectInfo, VaultObjectInfo } from '@/types/config';
import { PaginatedPositionsResult, PositionInfo, VaultInfo } from '@/types/struct';
import { DUMMY_SENDER } from '@/consts';
import {
  CONFIG,
  PRICE_SERVICE_ENDPOINT,
  PRICE_SERVICE_TESTNET_ENDPOINT,
  SupportedSavingPoolType,
  TESTNET_SAVING_POOL,
} from '@/consts/config';
import { destroyZeroCoin, getZeroCoin, splitInputCoins } from '@/utils/transaction';

import { phantom } from './_generated/_framework/reified';
import { parseTypeName } from './_generated/_framework/util';
import { splitIntoChunks } from './utils';

export class BucketV2Client {
  /**
   * @description a TypeScript wrapper over Bucket V2 client.
   * @param suiClient
   * @param network
   */
  private config: ConfigType;
  private suiClient: SuiClient;
  private pythConnection: SuiPriceServiceConnection;
  private pythClient: SuiPythClient;

  constructor({ suiClient, network = 'mainnet' }: { suiClient: SuiClient; network?: Network }) {
    this.config = CONFIG[network];
    this.suiClient = suiClient;
    this.pythConnection = new SuiPriceServiceConnection(
      network === 'mainnet' ? PRICE_SERVICE_ENDPOINT : PRICE_SERVICE_TESTNET_ENDPOINT,
    );
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
   * @description Get all CDP collateral types
   */
  getAllCollateralTypes(): string[] {
    return Object.keys(this.config.CDP_VAULT_OBJS);
  }

  /**
   * @description
   */
  getVaultObjectInfo({ coinType }: { coinType: string }): VaultObjectInfo {
    const vaultInfo = this.config.CDP_VAULT_OBJS[normalizeStructTag(coinType)];

    if (!vaultInfo) {
      throw new Error('Unsupported collateral type');
    }
    return vaultInfo;
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
  getPsmPoolObjectInfo({ coinType }: { coinType: string }): PSMPoolObjectInfo {
    const psmPoolInfo = this.config.PSM_POOL_OBJS[normalizeStructTag(coinType)];

    if (!psmPoolInfo) {
      throw new Error('Unsupported coin type');
    }
    return psmPoolInfo;
  }

  /* ----- Queries ----- */

  /**
   * @description Get all vault objects
   */
  async getAllVaultObjects(): Promise<VaultInfo[]> {
    const vaultObjectIds = Object.values(this.config.CDP_VAULT_OBJS).map((v) => v.vault.objectId);

    const res = await this.suiClient.multiGetObjects({
      ids: vaultObjectIds,
      options: {
        showBcs: true,
      },
    });
    return Object.keys(this.config.CDP_VAULT_OBJS).map((collateralType, index) => {
      const data = res[index].data;

      if (data?.bcs?.dataType !== 'moveObject') {
        throw new Error(`Failed to parse vault object`);
      }
      const vault = VAULT.parse(Uint8Array.from(data.bcs.bcsBytes));

      return {
        collateralType,
        positionTableSize: +vault.position_table.size,
        collateralDecimal: +vault.decimal,
        collateralBalance: +vault.balance,
        usdbSupply: +vault.limited_supply.supply,
        maxSupply: +vault.limited_supply.limit,
        interestRate: +vault.interest_rate.value,
        minCollateralRatio: +vault.min_collateral_ratio.value,
      };
    });
  }

  /**
   * @description Get all positions bt collateral with pagination
   */
  async getAllPositions({
    coinType,
    pageSize,
    cursor,
  }: {
    coinType: string;
    pageSize: number;
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
      sender: DUMMY_SENDER,
    });
    if (!res.results || !res.results[0]?.returnValues) {
      return {
        positions: [],
        nextCursor: null,
      };
    }
    const [positionBytes, nextCursorBytes] = res.results[0].returnValues;

    return {
      positions: bcs
        .vector(POSITION_DATA)
        .parse(Uint8Array.from(positionBytes ? positionBytes[0] : []))
        .map((pos) => ({
          collateralType: coinType,
          collateralAmount: pos.coll_amount,
          debtAmount: pos.debt_amount,
          debtor: pos.debtor,
        })),
      nextCursor: bcs.option(bcs.Address).parse(Uint8Array.from(nextCursorBytes ? nextCursorBytes[0] : [])),
    };
  }

  /**
   * @description Get debtor's position data
   */
  async getDebtorPositions(debtor: string): Promise<PositionInfo[]> {
    const tx = new Transaction();

    Object.entries(this.config.CDP_VAULT_OBJS).map(([coinType, { vault }]) => {
      tx.moveCall({
        target: `${this.config.CDP_PACKAGE_ID}::vault::get_position_data`,
        typeArguments: [coinType],
        arguments: [tx.sharedObjectRef(vault), tx.pure.address(debtor), tx.object.clock()],
      });
    });
    const res = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: DUMMY_SENDER,
    });
    if (!res.results) {
      return [];
    }
    // TODO: move to bsc parsing
    return Object.keys(this.config.CDP_VAULT_OBJS).reduce((result, collateralType, index) => {
      if (!res.results || !res.results[index] || !res.results[index].returnValues) {
        return result;
      }
      result.push({
        collateralType,
        collateralAmount: bcs.u64().parse(Uint8Array.from(res.results[index].returnValues[0][0])),
        debtAmount: bcs.u64().parse(Uint8Array.from(res.results[index].returnValues[1][0])),
        debtor,
      });
      return result;
    }, [] as PositionInfo[]);
  }

  // >>> PSM
  async getAllPSMPool() {
    const psmPoolObjectIds = Object.values(this.config.PSM_POOL_OBJS).map((p) => p.pool.objectId);

    const psmPoolObjResponse = await this.suiClient.multiGetObjects({
      ids: psmPoolObjectIds,
      options: {
        showBcs: true,
      },
    });

    return Object.keys(this.config.PSM_POOL_OBJS).map((collateralType, idx) => {
      const pool = psmPoolObjResponse[idx];

      if (pool.data?.bcs?.dataType !== 'moveObject') {
        throw new Error(`Failed to parse psm pool object`);
      }
      const { typeArgs } = parseTypeName(pool.data.bcs.type);

      return PSMPool.fromBcs(phantom(typeArgs[0]), Uint8Array.from(pool.data?.bcs.bcsBytes));
    });
  }

  async getAllSavingPool() {
    const savingPoolObjectIds = Object.values(TESTNET_SAVING_POOL).map((pool) => pool.pool.objectId);

    const savingPoolObjResponse = await this.suiClient.multiGetObjects({
      ids: savingPoolObjectIds,
      options: {
        showBcs: true,
      },
    });

    return Object.keys(TESTNET_SAVING_POOL).map((savingPoolSymbol, idx) => {
      const savingPool = savingPoolObjResponse[idx];

      if (savingPool.data?.bcs?.dataType !== 'moveObject') {
        throw new Error(`Failed to parse saving pool object`);
      }
      const { typeArgs } = parseTypeName(savingPool.data.bcs.type);

      return SavingPool.fromBcs(phantom(typeArgs[0]), Uint8Array.from(savingPool.data?.bcs.bcsBytes));
    });
  }

  async getSavingPoolRewarders(savingPoolType: SupportedSavingPoolType) {
    const pool = TESTNET_SAVING_POOL[savingPoolType];
    if (!pool.reward) return {};

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
        throw new Error(`Failed to parse reward object for ${savingPoolType} SavingPool`);
      }

      // parse from dynamicField key
      const { typeArgs: rewardType } = parseTypeName(rewarder.data.bcs.type);
      const { typeArgs } = parseTypeName(rewardType[1]);
      return Rewarder.fromBcs(
        [phantom(typeArgs[0]), phantom(typeArgs[1])],
        Uint8Array.from(rewarder.data?.bcs.bcsBytes),
      );
    });

    return rewarders.reduce(
      (acc, rewarder) => ({ ...acc, [rewarder.$typeArgs[1]]: rewarder }),
      {} as Record<string, Rewarder<string, string>>,
    );
  }

  async getUserSavingPoolBalance(savingPoolType: SupportedSavingPoolType, account: string) {
    const pool = TESTNET_SAVING_POOL[savingPoolType];
    if (!pool.reward) return 0;

    const tx = new Transaction();
    lpBalanceOf(tx, pool.coinType, {
      self: tx.sharedObjectRef(pool.pool),
      accountAddress: account,
    });

    const devInspectResponse = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: normalizeSuiAddress(DUMMY_SENDER),
    });

    const results = devInspectResponse.results;

    if (!results || !results.length) return 0;

    const value = devInspectResponse?.results?.[0]?.returnValues?.[0][0];
    return value ? +bcs.u64().parse(new Uint8Array(value)) : 0;
  }

  /**
   * @this value is quoted in USDB
   */
  async getUserSavingPoolValue(savingPoolType: SupportedSavingPoolType, account: string) {
    const pool = TESTNET_SAVING_POOL[savingPoolType];
    if (!pool.reward) return 0;

    const tx = new Transaction();
    lpTokenValueOf(tx, pool.coinType, {
      self: tx.sharedObjectRef(pool.pool),
      accountAddress: account,
      clock: tx.object.clock(),
    });

    const devInspectResponse = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: normalizeSuiAddress(DUMMY_SENDER),
    });

    const results = devInspectResponse.results;

    if (!results || !results.length) return 0;

    const value = devInspectResponse?.results?.[0]?.returnValues?.[0][0];
    return value ? +bcs.u64().parse(new Uint8Array(value)) : 0;
  }

  /**
   * @this value is quoted in USDB
   */
  async getUserSavingPoolRealtimeRewards(savingPoolType: SupportedSavingPoolType, account: string) {
    const rewarders = await this.getSavingPoolRewarders(savingPoolType);
    const pool = TESTNET_SAVING_POOL[savingPoolType];
    if (!Object.keys(rewarders).length || !pool.reward) return {};
    const tx = new Transaction();

    for (const rewardType of pool.reward.rewardTypes) {
      const rewarder = rewarders[rewardType];
      const typeArgs = rewarder.$typeArgs;
      const rewarder_ref = getRewarder(tx, typeArgs, tx.sharedObjectRef(pool.reward.rewardManager));

      realtimeRewardAmount(tx, typeArgs, {
        rewarder: rewarder_ref,
        savingPool: tx.sharedObjectRef(pool.pool),
        account,
        clock: tx.object.clock(),
      });
    }

    const devInspectResponse = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: normalizeSuiAddress(DUMMY_SENDER),
    });

    const results = devInspectResponse.results;

    if (!results || !results.length) return 0;

    const chunks = splitIntoChunks(results, 2);

    return pool.reward.rewardTypes.reduce(
      (acc, rewardType, idx) => {
        const chunk = chunks[idx];
        const value = chunk[1]?.returnValues?.[0][0];
        const realtimeReward = value ? +bcs.u64().parse(new Uint8Array(value)) : 0;

        return { ...acc, [rewardType]: realtimeReward };
      },
      {} as Record<string, number>,
    );
  }

  /* ----- Transaction Methods ----- */

  /**
   * @description
   */
  treasury(tx: Transaction): TransactionArgument {
    return tx.sharedObjectRef(this.config.TREASURY_OBJ);
  }

  /**
   * @description
   */
  flashGlobalConfig(tx: Transaction): TransactionArgument {
    return tx.sharedObjectRef(this.config.FLASH_GLOBAL_CONFIG_OBJ);
  }

  /**
   * @description
   */
  vault(tx: Transaction, { coinType }: { coinType: string }): TransactionArgument {
    const vaultInfo = this.getVaultObjectInfo({ coinType });

    return tx.sharedObjectRef(vaultInfo.vault);
  }

  /**
   * @description
   */
  aggregator(tx: Transaction, { coinType }: { coinType: string }): TransactionArgument {
    const vaultInfo = this.getAggregatorObjectInfo({ coinType });

    return tx.sharedObjectRef(vaultInfo.priceAggregator);
  }

  /**
   * @description
   */
  psmPoolObj(tx: Transaction, { coinType }: { coinType: string }): TransactionArgument {
    const psmPoolInfo = this.getPsmPoolObjectInfo({ coinType });
    return tx.sharedObjectRef(psmPoolInfo.pool);
  }

  /**
   * @description Create a AccountRequest
   * @param accountObj (optional): Account object or EOA if undefined
   * @return AccountRequest
   */
  newAccountRequest(
    tx: Transaction,
    { accountObj }: { accountObj?: string | TransactionArgument },
  ): TransactionArgument {
    return accountObj
      ? tx.moveCall({
          target: `${this.config.FRAMEWORK_PACKAGE_ID}::account::request_with_account`,
          arguments: [typeof accountObj === 'string' ? tx.object(accountObj) : accountObj],
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
  newPriceCollector(tx: Transaction, { coinType }: { coinType: string }): TransactionArgument {
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
  async aggregateBasicPrices(tx: Transaction, { coinTypes }: { coinTypes: string[] }): Promise<TransactionArgument[]> {
    const aggInfoList = coinTypes.map((coinType) => this.getAggregatorObjectInfo({ coinType }));

    const pythPriceIds = aggInfoList.map((aggInfo) => aggInfo.pythPriceId ?? '');
    const invalidIdx = pythPriceIds.findIndex((id) => id === '');

    if (invalidIdx >= 0) {
      throw new Error(`No price feed for ${coinTypes[invalidIdx]}`);
    }
    const updateData = await this.pythConnection.getPriceFeedsUpdateData(pythPriceIds);
    const priceInfoObjIds = await this.pythClient.updatePriceFeeds(tx, updateData, pythPriceIds);

    return Promise.all(
      coinTypes.map(async (coinType, idx) => {
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
        const [priceResult] = tx.moveCall({
          target: `${this.config.ORACLE_PACKAGE_ID}::aggregator::aggregate`,
          typeArguments: [coinType],
          arguments: [tx.sharedObjectRef(aggInfoList[idx].priceAggregator), collector],
        });
        return priceResult;
      }),
    );
  }

  async aggregatePrices(tx: Transaction, { coinTypes }: { coinTypes: string[] }): Promise<TransactionArgument[]> {
    // TODO: impl aggregate prices for derivatives

    return this.aggregateBasicPrices(tx, { coinTypes });
  }

  /**
   * @description Get a request to Mange Position
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param depositCoin: collateral input coin
   * @param borrowAmount: the amount to borrow
   * @param repaymentCoin: repyment input coin (always USDB)
   * @param withdrawAmount: the amount to withdraw
   * @param accountObj (optional): account object id or transaction argument
   * @returns UpdateRequest
   */
  debtorRequest(
    tx: Transaction,
    {
      coinType,
      depositCoin = getZeroCoin(tx, { coinType: coinType }),
      borrowAmount = 0,
      repaymentCoin = getZeroCoin(tx, { coinType: this.getUsdbCoinType() }),
      withdrawAmount = 0,
      accountObj,
    }: {
      coinType: string;
      depositCoin?: TransactionArgument;
      borrowAmount?: number | TransactionArgument;
      repaymentCoin?: TransactionArgument;
      withdrawAmount?: number | TransactionArgument;
      accountObj?: string | TransactionArgument;
    },
  ): TransactionArgument {
    const accountReq = this.newAccountRequest(tx, { accountObj });

    return tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::debtor_request`,
      typeArguments: [coinType],
      arguments: [
        this.vault(tx, { coinType }),
        accountReq,
        this.treasury(tx),
        depositCoin,
        typeof borrowAmount === 'number' ? tx.pure.u64(borrowAmount) : borrowAmount,
        repaymentCoin,
        typeof withdrawAmount === 'number' ? tx.pure.u64(withdrawAmount) : withdrawAmount,
      ],
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
  ): [TransactionArgument, TransactionArgument, TransactionArgument] {
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
  checkResponse(tx: Transaction, { coinType, response }: { coinType: string; response: TransactionArgument }) {
    const vault = this.vault(tx, { coinType });

    tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::destroy_response`,
      typeArguments: [coinType],
      arguments: [vault, this.treasury(tx), response],
    });
  }

  psmSwapIn(
    tx: Transaction,
    {
      coinType,
      priceResult,
      inputCoin,
      accountObj,
    }: {
      coinType: string;
      priceResult: TransactionArgument;
      inputCoin: TransactionObjectArgument;
      accountObj?: string | TransactionArgument;
    },
  ): TransactionArgument {
    const partner = tx.object.option({
      type: `${this.config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: this.newAccountRequest(tx, { accountObj }),
    });
    const usdbCoin = tx.moveCall({
      target: `${this.config.PSM_PACKAGE_ID}::pool::swap_in`,
      typeArguments: [coinType],
      arguments: [this.psmPoolObj(tx, { coinType }), this.treasury(tx), priceResult, inputCoin, partner],
    });

    return usdbCoin;
  }

  psmSwapOut(
    tx: Transaction,
    {
      coinType,
      priceResult,
      usdbCoin,
      accountObj,
    }: {
      coinType: string;
      priceResult: TransactionArgument;
      usdbCoin: TransactionObjectArgument;
      accountObj?: string | TransactionArgument;
    },
  ): TransactionArgument {
    const partner = tx.object.option({
      type: `${this.config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: this.newAccountRequest(tx, { accountObj }),
    });
    const inputCoin = tx.moveCall({
      target: `${this.config.PSM_PACKAGE_ID}::pool::swap_out`,
      typeArguments: [coinType],
      arguments: [this.psmPoolObj(tx, { coinType }), this.treasury(tx), priceResult, usdbCoin, partner],
    });

    return inputCoin;
  }

  flashMint(
    tx: Transaction,
    {
      amount,
      partnerAccountObj,
    }: {
      amount: number | TransactionArgument;
      partnerAccountObj?: string | TransactionArgument;
    },
  ) {
    const partner = tx.object.option({
      type: `${this.config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: partnerAccountObj ? this.newAccountRequest(tx, { accountObj: partnerAccountObj }) : null,
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

  flashBurn(
    tx: Transaction,
    {
      usdbCoin,
      flashMintReceipt,
    }: {
      usdbCoin: TransactionObjectArgument;
      flashMintReceipt: TransactionArgument;
    },
  ) {
    tx.moveCall({
      target: `${this.config.FLASH_PACKAGE_ID}::config::flash_burn`,
      arguments: [this.flashGlobalConfig(tx), this.treasury(tx), usdbCoin, flashMintReceipt],
    });
  }

  savingPoolDeposit(
    tx: Transaction,
    {
      savingPoolType,
      usdbCoin,
      account,
    }: {
      savingPoolType: SupportedSavingPoolType;
      usdbCoin: TransactionObjectArgument;
      account: string;
    },
  ): TransactionArgument {
    const depositResponse = tx.moveCall({
      target: `${this.config.SAVING_PACKAGE_ID}::saving::deposit`,
      typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType],
      arguments: [
        tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].pool),
        this.treasury(tx),
        tx.pure.address(account),
        usdbCoin,
        tx.object.clock(),
      ],
    });

    return depositResponse;
  }

  checkDepositResponse(
    tx: Transaction,
    {
      savingPoolType,
      depositResponse,
    }: {
      savingPoolType: SupportedSavingPoolType;
      depositResponse: TransactionArgument;
    },
  ) {
    tx.moveCall({
      target: `${this.config.SAVING_PACKAGE_ID}::saving::check_deposit_response`,
      typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType],
      arguments: [depositResponse, tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].pool), this.treasury(tx)],
    });
  }

  savingPoolWithdraw(
    tx: Transaction,
    {
      savingPoolType,
      amount,
      accountObj,
    }: {
      savingPoolType: SupportedSavingPoolType;
      amount: number;
      accountObj?: string | TransactionArgument;
    },
  ): [TransactionArgument, TransactionArgument] {
    const accountReq = this.newAccountRequest(tx, { accountObj });
    const [usdbCoin, withdrawResponse] = tx.moveCall({
      target: `${this.config.SAVING_PACKAGE_ID}::saving::withdraw`,
      typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType],
      arguments: [
        tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].pool),
        this.treasury(tx),
        accountReq,
        tx.pure.u64(amount),
        tx.object.clock(),
      ],
    });

    return [usdbCoin, withdrawResponse];
  }

  checkWithdrawResponse(
    tx: Transaction,
    {
      savingPoolType,
      withdrawResponse,
    }: {
      savingPoolType: SupportedSavingPoolType;
      withdrawResponse: TransactionArgument;
    },
  ) {
    tx.moveCall({
      target: `${this.config.SAVING_PACKAGE_ID}::saving::check_withdraw_response`,
      typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType],
      arguments: [withdrawResponse, tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].pool), this.treasury(tx)],
    });
  }

  updateSavingPoolIncentiveDepositAction(
    tx: Transaction,
    {
      savingPoolType,
      depositResponse,
    }: {
      savingPoolType: SupportedSavingPoolType;
      depositResponse: TransactionArgument;
    },
  ): TransactionArgument {
    if (!TESTNET_SAVING_POOL[savingPoolType].reward) {
      throw new Error(`No Rewards to handle for ${savingPoolType}`);
    }

    const depositChecker = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::new_checker_for_deposit_action`,
      typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType],
      arguments: [
        tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].reward.rewardManager),
        tx.sharedObjectRef(this.config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ),
        depositResponse,
      ],
    });
    const rewards = TESTNET_SAVING_POOL[savingPoolType].reward.rewardTypes;

    for (const rewardType of rewards) {
      tx.moveCall({
        target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::update_deposit_action`,
        typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType, rewardType],
        arguments: [
          depositChecker,
          tx.sharedObjectRef(this.config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ),
          tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].reward.rewardManager),
          tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].pool),
          tx.object.clock(),
        ],
      });
    }

    const depositResponse_ = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::destroy_deposit_checker`,
      typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType],
      arguments: [depositChecker, tx.sharedObjectRef(this.config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ)],
    });

    return depositResponse_;
  }

  updateSavingPoolIncentiveWithdrawAction(
    tx: Transaction,
    {
      savingPoolType,
      withdrawResponse,
    }: {
      savingPoolType: SupportedSavingPoolType;
      withdrawResponse: TransactionArgument;
    },
  ): TransactionArgument {
    if (!TESTNET_SAVING_POOL[savingPoolType].reward) {
      throw new Error(`No Rewards to handle for ${savingPoolType}`);
    }

    const withdrawChecker = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::new_checker_for_withdraw_action`,
      typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType],
      arguments: [
        tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].reward.rewardManager),
        tx.sharedObjectRef(this.config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ),
        withdrawResponse,
      ],
    });
    const rewards = TESTNET_SAVING_POOL[savingPoolType].reward.rewardTypes;

    for (const rewardType of rewards) {
      tx.moveCall({
        target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::update_withdraw_action`,
        typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType, rewardType],
        arguments: [
          withdrawChecker,
          tx.sharedObjectRef(this.config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ),
          tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].reward.rewardManager),
          tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].pool),
          tx.object.clock(),
        ],
      });
    }

    const withdrawResponse_ = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::destroy_withdraw_checker`,
      typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType],
      arguments: [withdrawChecker, tx.sharedObjectRef(this.config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ)],
    });

    return withdrawResponse_;
  }

  claimPoolIncentive(
    tx: Transaction,
    {
      savingPoolType,
      rewardType,
      accountObj,
    }: {
      savingPoolType: SupportedSavingPoolType;
      rewardType: string;
      accountObj?: string | TransactionArgument;
    },
  ): TransactionArgument {
    if (!TESTNET_SAVING_POOL[savingPoolType].reward) return getZeroCoin(tx, { coinType: rewardType });

    const accountReq = this.newAccountRequest(tx, { accountObj });
    const rewardCoin = tx.moveCall({
      target: `${this.config.SAVING_INCENTIVE_PACKAGE_ID}::saving_incentive::claim`,
      typeArguments: [TESTNET_SAVING_POOL[savingPoolType].coinType, rewardType],
      arguments: [
        tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].reward.rewardManager),
        tx.sharedObjectRef(this.config.SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ),
        tx.sharedObjectRef(TESTNET_SAVING_POOL[savingPoolType].pool),
        accountReq,
        tx.object.clock(),
      ],
    });

    return rewardCoin;
  }

  /* ----- Transaction Methods ----- */
  /* ----- Transaction Builders ----- */

  /**
   * @description build and return Transaction of manage position
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param depositAmount: how much amount to deposit (collateral)
   * @param borrowAmount: how much amount to borrow (USDB)
   * @param repayAmount: how much amount to repay (USDB)
   * @param withdrawAmount: how much amount to withdraw (collateral)
   * @param accountObjId: the Account object to hold position (undefined if just use EOA)
   * @param recipient (optional): the recipient of the output coins
   * @returns Transaction
   */
  async buildManagePositionTransaction(
    tx: Transaction,
    {
      coinType,
      depositAmount = 0,
      borrowAmount = 0,
      repayAmount = 0,
      withdrawAmount = 0,
      accountObjId,
    }: {
      coinType: string;
      depositAmount?: number;
      borrowAmount?: number;
      repayAmount?: number;
      withdrawAmount?: number;
      accountObjId?: string;
    },
    sender: string,
  ): Promise<[TransactionArgument, TransactionArgument]> {
    const [[depositCoin], [repaymentCoin]] = await Promise.all([
      splitInputCoins(tx, { coinType: coinType, amounts: [depositAmount] }, this.suiClient, sender),
      splitInputCoins(tx, { coinType: this.getUsdbCoinType(), amounts: [repayAmount] }, this.suiClient, sender),
    ]);
    const updateRequest = this.debtorRequest(tx, {
      coinType,
      depositCoin,
      borrowAmount,
      repaymentCoin,
      withdrawAmount,
      accountObj: accountObjId,
    });
    let inputCoin, usdbCoin, response;

    if (borrowAmount > 0 || withdrawAmount > 0) {
      const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

      [inputCoin, usdbCoin, response] = this.updatePosition(tx, {
        coinType,
        updateRequest,
        priceResult,
      });
    } else {
      [inputCoin, usdbCoin, response] = this.updatePosition(tx, {
        coinType,
        updateRequest,
      });
    }
    this.checkResponse(tx, { coinType, response });

    if (withdrawAmount === 0) {
      destroyZeroCoin(tx, { coinType: coinType, coin: inputCoin });
    }
    if (borrowAmount === 0) {
      destroyZeroCoin(tx, { coinType: this.getUsdbCoinType(), coin: usdbCoin });
    }
    return [inputCoin, usdbCoin];
  }

  /**
   * @description build and return Transaction of close position
   * @param coinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param accountObjId: the Account object to hold position (undefined if just use EOA)
   * @param recipient (optional): the recipient of the output coins
   * @returns Transaction
   */
  async buildClosePositionTransaction(
    tx: Transaction,
    {
      coinType,
      accountObjId,
      debtor,
    }: {
      coinType: string;
      accountObjId?: string;
      debtor: string;
    },
    sender: string,
  ): Promise<TransactionArgument> {
    const [collateralAmount, debtAmount] = tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::get_position_data`,
      typeArguments: [coinType],
      arguments: [this.vault(tx, { coinType }), tx.pure.address(debtor), tx.object.clock()],
    });
    const [repaymentCoin] = await splitInputCoins(
      tx,
      { coinType: this.getUsdbCoinType(), amounts: [debtAmount] },
      this.suiClient,
      sender,
    );
    const updateRequest = this.debtorRequest(tx, {
      coinType,
      depositCoin: getZeroCoin(tx, { coinType: coinType }),
      borrowAmount: 0,
      repaymentCoin,
      withdrawAmount: collateralAmount,
      accountObj: accountObjId,
    });
    const [inputCoin, usdbCoin, response] = this.updatePosition(tx, {
      coinType,
      updateRequest,
    });
    this.checkResponse(tx, { coinType, response });
    destroyZeroCoin(tx, { coinType: this.getUsdbCoinType(), coin: usdbCoin });

    return inputCoin;
  }

  async buildPSMSwapInTransaction(
    tx: Transaction,
    {
      coinType,
      inputCoin,
      accountObjId,
    }: {
      coinType: string;
      inputCoin: TransactionArgument;
      accountObjId?: string;
      recipient?: string;
    },
  ): Promise<TransactionArgument> {
    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapIn(tx, { coinType, priceResult, inputCoin, accountObj: accountObjId });
  }

  async buildPSMSwapOutTransaction(
    tx: Transaction,
    {
      coinType,
      usdbCoin,
      accountObjId,
    }: {
      coinType: string;
      usdbCoin: TransactionArgument;
      accountObjId?: string;
      recipient?: string;
    },
  ): Promise<TransactionArgument> {
    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapOut(tx, { coinType, priceResult, usdbCoin, accountObj: accountObjId });
  }

  async buildDepositToSavingPoolTransaction(
    tx: Transaction,
    {
      savingPoolType,
      usdbCoin,
      account,
    }: {
      savingPoolType: SupportedSavingPoolType;
      usdbCoin: TransactionArgument;
      account: string;
    },
  ) {
    let depositResponse = this.savingPoolDeposit(tx, {
      savingPoolType,
      usdbCoin,
      account,
    });

    if (TESTNET_SAVING_POOL[savingPoolType].reward) {
      depositResponse = this.updateSavingPoolIncentiveDepositAction(tx, { savingPoolType, depositResponse });
    }

    this.checkDepositResponse(tx, { savingPoolType, depositResponse });
  }

  async buildWithdrawFromSavingPoolTransaction(
    tx: Transaction,
    {
      savingPoolType,
      amount,
      accountObjId,
    }: {
      savingPoolType: SupportedSavingPoolType;
      amount: number;
      accountObjId?: string;
    },
  ): Promise<TransactionArgument> {
    const withdrawResult = this.savingPoolWithdraw(tx, {
      savingPoolType,
      amount,
      accountObj: accountObjId,
    });

    const usdbCoin = withdrawResult[0];
    let withdrawResponse = withdrawResult[1];

    if (TESTNET_SAVING_POOL[savingPoolType].reward) {
      withdrawResponse = this.updateSavingPoolIncentiveWithdrawAction(tx, { savingPoolType, withdrawResponse });
    }

    this.checkWithdrawResponse(tx, { savingPoolType, withdrawResponse });

    return usdbCoin;
  }

  async buildClaimRewardsFromSavingPoolTransaction(
    tx: Transaction,
    {
      savingPoolType,
      accountObjId,
    }: {
      savingPoolType: SupportedSavingPoolType;
      accountObjId?: string;
    },
  ): Promise<TransactionArgument[]> {
    const rewards = [];

    for (const rewardType of TESTNET_SAVING_POOL[savingPoolType].reward?.rewardTypes || []) {
      const rewardCoin = this.claimPoolIncentive(tx, { savingPoolType, rewardType, accountObj: accountObjId });

      rewards.push(rewardCoin);
    }

    return rewards;
  }
}
