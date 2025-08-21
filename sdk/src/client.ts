import { bcs } from '@mysten/sui/bcs';
import { SuiClient } from '@mysten/sui/client';
import { Transaction, TransactionArgument, TransactionObjectArgument } from '@mysten/sui/transactions';
import { normalizeStructTag } from '@mysten/sui/utils';
import { SuiPriceServiceConnection, SuiPythClient } from '@pythnetwork/pyth-sui-js';

import { DUMMY_SENDER } from '@/consts';
import { CONFIG, PRICE_SERVICE_ENDPOINT, PRICE_SERVICE_TESTNET_ENDPOINT } from '@/consts/config';
import { POSITION_DATA } from '@/structs';
import { AggregatorObjectInfo, ConfigType, Network, PSMPoolObjectInfo, VaultObjectInfo } from '@/types/config';
import { PaginatedPositionsResult, PositionInfo, VaultInfo, VaultResponse } from '@/types/struct';
import { getObjectFields } from '@/utils/object';
import { parseVaultObject } from '@/utils/parse';
import { destroyZeroCoin, getZeroCoin, splitInputCoins } from '@/utils/transaction';

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
        showContent: true,
      },
    });
    return Object.keys(this.config.VAULT_OBJS).map((collateralType, index) => {
      const fields = getObjectFields(res[index]) as VaultResponse;

      // TODO: move to bsc parsing
      return parseVaultObject(collateralType, fields);
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
      accountObj,
    }: {
      amount: number | TransactionArgument;
      accountObj?: string | TransactionArgument;
    },
  ) {
    const partner = tx.object.option({
      type: `${this.config.FRAMEWORK_PACKAGE_ID}::account::AccountRequest`,
      value: this.newAccountRequest(tx, { accountObj }),
    });

    const [usdbCoin, flash_mint_receipt] = tx.moveCall({
      target: `${this.config.FLASH_PACKAGE_ID}::config::flash_mint`,
      arguments: [
        this.flashGlobalConfig(tx),
        this.treasury(tx),
        partner,
        typeof amount === 'number' ? tx.pure.u64(amount) : amount,
      ],
    });

    return [usdbCoin, flash_mint_receipt];
  }

  flashBurn(
    tx: Transaction,
    {
      usdbCoin,
      flash_mint_receipt,
    }: {
      usdbCoin: TransactionObjectArgument;
      flash_mint_receipt: TransactionArgument;
    },
  ) {
    tx.moveCall({
      target: `${this.config.FLASH_PACKAGE_ID}::config::flash_burn`,
      arguments: [this.flashGlobalConfig(tx), this.treasury(tx), usdbCoin, flash_mint_receipt],
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
      keepTransaction = false,
    }: {
      coinType: string;
      amount: number;
      accountObjId?: string;
      recipient?: string;
      keepTransaction?: boolean;
    },
    sender: string,
  ): Promise<TransactionArgument> {
    const [collateralCoin] = await splitInputCoins(tx, { coinType, amounts: [amount]}, this.suiClient, sender);
    const [priceResult] = await this.aggregatePrices(tx, { coinTypes: [coinType] });

    return this.psmSwapIn(tx, { coinType, priceResult, collateralCoin, accountObj: accountObjId });
  }
}
