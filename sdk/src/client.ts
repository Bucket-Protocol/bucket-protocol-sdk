import { bcs } from '@mysten/sui/bcs';
import { SuiClient } from '@mysten/sui/client';
import { Transaction, TransactionArgument, TransactionObjectArgument } from '@mysten/sui/transactions';
import { normalizeStructTag } from '@mysten/sui/utils';
import { SuiPriceServiceConnection, SuiPythClient } from '@pythnetwork/pyth-sui-js';

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

import { COIN_TYPES } from './consts/coin';

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
    return Object.keys(this.config.VAULT_OBJS);
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
    const vaultObjectIds = Object.values(this.config.VAULT_OBJS).map((v) => v.vault.objectId);

    const res = await this.suiClient.multiGetObjects({
      ids: vaultObjectIds,
      options: {
        showBcs: true,
      },
    });
    return Object.keys(this.config.VAULT_OBJS).map((collateralType, index) => {
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

    Object.entries(this.config.VAULT_OBJS).map(([coinType, { vault }]) => {
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
    return Object.keys(this.config.VAULT_OBJS).reduce((result, collateralType, index) => {
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
    const [collateralCoin, usdbCoin, response] = tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::update_position`,
      typeArguments: [coinType],
      arguments: [this.vault(tx, { coinType }), this.treasury(tx), tx.object.clock(), priceResultOpt, updateRequest],
    });
    return [collateralCoin, usdbCoin, response];
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
      collateralCoin,
      accountObj,
    }: {
      coinType: string;
      priceResult: TransactionArgument;
      collateralCoin: TransactionObjectArgument;
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
      arguments: [this.psmPoolObj(tx, { coinType }), this.treasury(tx), priceResult, collateralCoin, partner],
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
    const collateralCoin = tx.moveCall({
      target: `${this.config.PSM_PACKAGE_ID}::pool::swap_out`,
      typeArguments: [coinType],
      arguments: [this.psmPoolObj(tx, { coinType }), this.treasury(tx), priceResult, usdbCoin, partner],
    });

    return collateralCoin;
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
    const [depositCoin, repaymentCoin] = await Promise.all([
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
    let collateralCoin, usdbCoin, response;

    if (borrowAmount > 0 || withdrawAmount > 0) {
      const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

      [collateralCoin, usdbCoin, response] = this.updatePosition(tx, {
        coinType,
        updateRequest,
        priceResult,
      });
    } else {
      [collateralCoin, usdbCoin, response] = this.updatePosition(tx, {
        coinType,
        updateRequest,
      });
    }
    this.checkResponse(tx, { coinType, response });

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
    const [collateralCoin, usdbCoin, response] = this.updatePosition(tx, {
      coinType,
      updateRequest,
    });
    this.checkResponse(tx, { coinType, response });
    destroyZeroCoin(tx, { coinType: this.getUsdbCoinType(), coin: usdbCoin });

    return collateralCoin;
  }

  async buildPSMSwapInTransaction(
    tx: Transaction,
    {
      coinType,
      amount,
      accountObjId,
    }: {
      coinType: string;
      amount: number;
      accountObjId?: string;
      recipient?: string;
    },
    sender: string,
  ): Promise<TransactionArgument> {
    const [collateralCoin] = await splitInputCoins(tx, { coinType, amounts: [amount] }, this.suiClient, sender);
    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapIn(tx, { coinType, priceResult, collateralCoin, accountObj: accountObjId });
  }

  async buildPSMSwapOutTransaction(
    tx: Transaction,
    {
      coinType,
      amount,
      accountObjId,
    }: {
      coinType: string;
      amount: number;
      accountObjId?: string;
      recipient?: string;
    },
    sender: string,
  ): Promise<TransactionArgument> {
    const [usdbCoin] = await splitInputCoins(
      tx,
      { coinType: COIN_TYPES.USDB, amounts: [amount] },
      this.suiClient,
      sender,
    );
    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapOut(tx, { coinType, priceResult, usdbCoin, accountObj: accountObjId });
  }

  async buildDepositToSavingPoolTransaction(
    tx: Transaction,
    {
      savingPoolType,
      amount,
      account,
    }: {
      savingPoolType: SupportedSavingPoolType;
      amount: number;
      account: string;
    },
    sender: string,
  ) {
    const [usdbCoin] = await splitInputCoins(
      tx,
      { coinType: COIN_TYPES.USDB, amounts: [amount] },
      this.suiClient,
      sender,
    );

    const depositResponse = this.savingPoolDeposit(tx, {
      savingPoolType,
      usdbCoin,
      account,
    });

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
    const [usdbCoin, withdrawResponse] = this.savingPoolWithdraw(tx, {
      savingPoolType,
      amount,
      accountObj: accountObjId,
    });

    this.checkWithdrawResponse(tx, { savingPoolType, withdrawResponse });

    return usdbCoin;
  }
}
