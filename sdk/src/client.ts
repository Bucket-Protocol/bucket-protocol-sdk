import { bcs } from '@mysten/sui/bcs';
import {
  DryRunTransactionBlockResponse,
  getFullnodeUrl,
  SuiClient,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
} from '@mysten/sui/client';
import { Keypair } from '@mysten/sui/cryptography';
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions';
import { normalizeStructTag, normalizeSuiAddress, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { SuiPriceServiceConnection, SuiPythClient } from '@pythnetwork/pyth-sui-js';

import {
  AggregatorObjectInfo,
  CdpPositionsResponse,
  PositionInfo,
  VaultInfo,
  VaultObjectInfo,
  VaultResponse,
} from '@/types';
import { CONFIG, ConfigType } from '@/constants';
import { getObjectFields, parseVaultObject } from '@/utils';

const DUMMY_ADDRESS = normalizeSuiAddress('0x0');

const CDP_POSITION_DATA = bcs.struct('CdpPositionData', {
  debtor: bcs.Address,
  coll_amount: bcs.U64,
  debt_amount: bcs.U64,
});

export class BucketV2Client {
  /**
   * @description a TS wrapper over Bucket V2 client.
   * @param network connection to fullnode: 'mainnet' | 'testnet'
   * @param owner (optional) address of the current user (default: DUMMY_ADDRESS)
   */
  private rpcEndpoint: string;
  private suiClient: SuiClient;
  private pythConnection: SuiPriceServiceConnection;
  private pythClient: SuiPythClient;
  private config: ConfigType;
  private usdbType: string;
  public tx: Transaction;
  public sender: string;

  constructor(inputs?: { network?: 'mainnet'; rpcUrl?: string; sender?: string }) {
    const { network, rpcUrl, sender } = inputs ?? {};
    this.config = CONFIG['mainnet'];
    this.usdbType = `${this.config.ORIGINAL_USDB_PACKAGE_ID}::usdb::USDB`;
    this.rpcEndpoint = rpcUrl ?? getFullnodeUrl(network ?? 'mainnet');
    this.sender = sender ? normalizeSuiAddress(sender) : DUMMY_ADDRESS;
    this.suiClient = new SuiClient({ url: this.rpcEndpoint, network: network ?? 'mainnet' });
    this.pythConnection = new SuiPriceServiceConnection('https://hermes.pyth.network');
    this.pythClient = new SuiPythClient(this.suiClient, this.config.PYTH_STATE_ID, this.config.WORMHOLE_STATE_ID);
    this.tx = new Transaction();
  }

  getVaultObjectInfo({ collateralCoinType }: { collateralCoinType: string }): VaultObjectInfo {
    const vaultInfo = this.config.VAULTS.find((v) => v.collateralCoinType === normalizeStructTag(collateralCoinType));
    if (!vaultInfo) throw new Error('Unsupported collateral type');
    return vaultInfo;
  }

  getAggregatorObjectInfo({ coinType }: { coinType: string }): AggregatorObjectInfo {
    const aggInfo = this.config.AGGREGATORS.find((a) => a.coinType === normalizeStructTag(coinType));
    if (!aggInfo) throw new Error('Unsupported coin type');
    return aggInfo;
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

  /* ----- Query ----- */

  /**
   * @description Get all CDP collateral types
   */
  getCDPCollateralTypes(): string[] {
    return this.config.VAULTS.map((v) => v.collateralCoinType);
  }

  /**
   * @description Get all vault objects
   */
  async getAllVaults(): Promise<VaultInfo[]> {
    // Get objectId from VAULT_MAP and get all vaults
    const vaultObjectIds = this.config.VAULTS.map((v) => v.vault.objectId);
    const vaultResults = await this.suiClient.multiGetObjects({
      ids: vaultObjectIds,
      options: {
        showContent: true,
      },
    });

    return vaultResults.map((res, idx) => {
      const fields = getObjectFields(res) as VaultResponse;

      return parseVaultObject(this.config.VAULTS[idx].collateralCoinType, fields);
    });
  }

  /**
   * @description Get debtor's position data
   */
  async getDebtorPositions(debtor?: string): Promise<PositionInfo[]> {
    const tx = new Transaction();
    const clockObj = tx.sharedObjectRef(this.config.CLOCK_OBJ);
    const debtorAddr = debtor ?? this.sender;
    if (debtorAddr === DUMMY_ADDRESS) {
      throw new Error('Invalid debtor address');
    }
    this.config.VAULTS.map((vault) => {
      tx.moveCall({
        target: `${this.config.CDP_PACKAGE_ID}::vault::try_get_position_data`,
        typeArguments: [vault.collateralCoinType],
        arguments: [tx.sharedObjectRef(vault.vault), tx.pure.address(debtorAddr), clockObj],
      });
    });

    const res = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: debtor ?? this.sender,
    });
    if (!res.results) return [];

    return res.results.map((value, idx) => {
      const collateralCoinType = this.config.VAULTS[idx].collateralCoinType;
      if (value.returnValues) {
        const [collReturn, debtReturn] = value.returnValues;
        return {
          collateralCoinType,
          collateralAmount: collReturn ? bcs.u64().parse(Uint8Array.from(collReturn[0])) : '0',
          debtAmount: debtReturn ? bcs.u64().parse(Uint8Array.from(debtReturn[0])) : '0',
        };
      } else {
        return {
          collateralCoinType,
          collateralAmount: '0',
          debtAmount: '0',
        };
      }
    });
  }

  /**
   * @description Get CDP Positions
   */
  async getCdpPositions({
    collateralCoinType,
    pageSize,
    cursor,
  }: {
    collateralCoinType: string;
    pageSize: number;
    cursor?: string | null;
  }): Promise<CdpPositionsResponse> {
    const tx = new Transaction();
    const vaultInfo = this.getVaultObjectInfo({ collateralCoinType });
    tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::get_positions`,
      typeArguments: [collateralCoinType],
      arguments: [
        tx.sharedObjectRef(vaultInfo.vault),
        tx.sharedObjectRef(this.config.CLOCK_OBJ),
        tx.pure.option('address', cursor),
        tx.pure.u64(pageSize),
      ],
    });
    const res = await this.getSuiClient().devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.sender,
    });
    if (!res.results || !res.results[0]?.returnValues) {
      return {
        collateralCoinType,
        positions: [],
        nextCursor: null,
      };
    }
    const [positionBytes, nextCursorBytes] = res.results[0].returnValues;
    const positions = bcs
      .vector(CDP_POSITION_DATA)
      .parse(Uint8Array.from(positionBytes ? positionBytes[0] : []))
      .map((pos) => {
        return {
          debtor: pos.debtor,
          collateralAmount: Number(pos.coll_amount),
          debtAmount: Number(pos.debt_amount),
        };
      });
    const nextCursor = bcs.option(bcs.Address).parse(Uint8Array.from(nextCursorBytes ? nextCursorBytes[0] : []));
    return {
      collateralCoinType,
      positions,
      nextCursor,
    };
  }

  /* ----- Transaction Utils ----- */

  usdbCoinType(): string {
    return this.usdbType;
  }

  /**
   * @description new zero coin
   */
  zeroCoin({ coinType }: { coinType: string }): TransactionResult {
    return this.tx.moveCall({
      target: '0x2::coin::zero',
      typeArguments: [coinType],
    });
  }

  /**
   * @description destroy zero coin
   */
  destroyZeroCoin({ coinType, coin }: { coinType: string; coin: TransactionArgument }) {
    this.tx.moveCall({
      target: '0x2::coin::destroy_zero',
      typeArguments: [coinType],
      arguments: [coin],
    });
  }

  /**
   * @description split the needed coins
   */
  async splitInputCoins({
    coinType,
    amounts,
  }: {
    coinType: string;
    amounts: (number | TransactionArgument)[];
  }): Promise<TransactionResult> {
    if (normalizeStructTag(coinType) === normalizeStructTag(SUI_TYPE_ARG)) {
      return this.tx.splitCoins(this.tx.gas, amounts);
    } else {
      const { data: userCoins } = await this.suiClient.getCoins({
        owner: this.sender,
        coinType,
      });
      if (userCoins.length === 0) {
        return amounts.map((amount) => {
          if (typeof amount === 'number' && amount > 0) {
            throw new Error('Not enough balance');
          }
          const [zeroCoin] = this.zeroCoin({ coinType });
          return zeroCoin;
        }) as TransactionResult;
      }
      const [mainCoin, ...otherCoins] = userCoins.map((coin) =>
        this.tx.objectRef({
          objectId: coin.coinObjectId,
          version: coin.version,
          digest: coin.digest,
        }),
      );
      if (!mainCoin) {
        throw new Error('Not enough balance');
      }

      const ifMerge = otherCoins.length > 0;

      if (ifMerge) {
        this.tx.mergeCoins(mainCoin, otherCoins);
      }

      const out = this.tx.splitCoins(
        mainCoin,
        amounts.map((amount) => (typeof amount === 'string' ? this.tx.pure.u64(amount) : amount)),
      );

      if (ifMerge) {
        this.tx.transferObjects([mainCoin], this.sender);
      }

      return out;
    }
  }

  /* ----- Transaction Methods ----- */

  /**
   * @description Reset this.tx
   */
  resetTransaction() {
    this.tx = new Transaction();
  }

  /**
   * @description return Transaction
   * @returns Transaction
   */
  getTransaction(): Transaction {
    return this.tx;
  }

  async dryrunTransaction(): Promise<DryRunTransactionBlockResponse> {
    this.tx.setSender(this.sender);
    return this.suiClient.dryRunTransactionBlock({
      transactionBlock: await this.tx.build({
        client: this.suiClient,
      }),
    });
  }

  async signAndExecuteTransaction({
    signer,
    options,
  }: {
    signer: Keypair;
    options?: SuiTransactionBlockResponseOptions;
  }): Promise<SuiTransactionBlockResponse> {
    if (signer.toSuiAddress() !== this.sender) {
      throw new Error('Invalid signer');
    }
    return this.suiClient.signAndExecuteTransaction({
      transaction: this.tx,
      signer,
      options,
    });
  }

  treasuryObj(): TransactionArgument {
    return this.tx.sharedObjectRef(this.config.TREASURY_OBJ);
  }

  clockObj(): TransactionArgument {
    return this.tx.sharedObjectRef(this.config.CLOCK_OBJ);
  }

  vaultObj({ collateralCoinType }: { collateralCoinType: string }): TransactionArgument {
    const vaultInfo = this.getVaultObjectInfo({ collateralCoinType });
    return this.tx.sharedObjectRef(vaultInfo.vault);
  }

  /**
   * @description Create a AccountRequest
   * @param accountObj (optional): Account object or EOA if undefined
   * @return AccountRequest
   */
  newAccountRequest(accountObj?: string | TransactionArgument): TransactionArgument {
    return accountObj
      ? this.tx.moveCall({
          target: `${this.config.FRAMEWORK_PACKAGE_ID}::account::request_with_account`,
          arguments: [typeof accountObj === 'string' ? this.tx.object(accountObj) : accountObj],
        })
      : this.tx.moveCall({
          target: `${this.config.FRAMEWORK_PACKAGE_ID}::account::request`,
        });
  }

  /**
   * @description Create a price collector
   * @param collateral coin type, e.g "0x2::sui::SUI"
   * @return PriceCollector
   */
  newPriceCollector({ coinType }: { coinType: string }): TransactionArgument {
    return this.tx.moveCall({
      target: `${this.config.ORACLE_PACKAGE_ID}::collector::new`,
      typeArguments: [coinType],
    });
  }

  /**
   * @description Get a basic (not derivative) price result
   * @param collateral coin type, e.g "0x2::sui::SUI"
   * @return [PriceResult]
   */
  async aggregateBasicPrices({ coinTypes }: { coinTypes: string[] }): Promise<TransactionArgument[]> {
    const aggInfoList = coinTypes.map((coinType) => this.getAggregatorObjectInfo({ coinType }));
    const pythPriceIds = aggInfoList.map((aggInfo) => aggInfo.pythPriceId ?? '');
    const invalidIdx = pythPriceIds.findIndex((id) => id === '');
    if (invalidIdx >= 0) throw new Error(`No price feed for ${coinTypes[invalidIdx]}`);
    const updateData = await this.pythConnection.getPriceFeedsUpdateData(pythPriceIds);
    const priceInfoObjIds = await this.pythClient.updatePriceFeeds(this.tx, updateData, pythPriceIds);
    return Promise.all(
      coinTypes.map(async (coinType, idx) => {
        const collector = this.newPriceCollector({ coinType });
        this.tx.moveCall({
          target: `${this.config.PYTH_RULE_PACKAGE_ID}::pyth_rule::feed`,
          typeArguments: [coinType],
          arguments: [
            collector,
            this.tx.sharedObjectRef(this.config.PYTH_RULE_CONFIG_OBJ),
            this.clockObj(),
            this.tx.object(this.config.PYTH_STATE_ID),
            this.tx.object(priceInfoObjIds[idx]),
          ],
        });
        const [priceResult] = this.tx.moveCall({
          target: `${this.config.ORACLE_PACKAGE_ID}::aggregator::aggregate`,
          typeArguments: [coinType],
          arguments: [this.tx.sharedObjectRef(aggInfoList[idx].priceAggregater), collector],
        });
        return priceResult;
      }),
    );
  }

  async aggregatePrices({ coinTypes }: { coinTypes: string[] }): Promise<TransactionArgument[]> {
    // TODO: impl aggregate prices for derivatives
    return this.aggregateBasicPrices({ coinTypes });
  }

  /**
   * @description Get a request to Mange Position
   * @param collateralCoinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param depositCoin: collateral input coin
   * @param borrowAmount: the amount to borrow
   * @param repaymentCoin: repyment input coin (always USDB)
   * @param withdrawAmount: the amount to withdraw
   * @param accountObj (optional): account object id or transaction argument
   * @returns UpdateRequest
   */
  debtorRequest({
    collateralCoinType,
    depositCoin = this.zeroCoin({ coinType: collateralCoinType }),
    borrowAmount = 0,
    repaymentCoin = this.zeroCoin({ coinType: this.usdbType }),
    withdrawAmount = 0,
    accountObj,
  }: {
    collateralCoinType: string;
    depositCoin?: TransactionArgument;
    borrowAmount?: number | TransactionArgument;
    repaymentCoin?: TransactionArgument;
    withdrawAmount?: number | TransactionArgument;
    accountObj?: string | TransactionArgument;
  }): TransactionArgument {
    const accountReq = this.newAccountRequest(accountObj);
    return this.tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::debtor_request`,
      typeArguments: [collateralCoinType],
      arguments: [
        this.vaultObj({ collateralCoinType }),
        accountReq,
        this.treasuryObj(),
        depositCoin,
        typeof borrowAmount === 'number' ? this.tx.pure.u64(borrowAmount) : borrowAmount,
        repaymentCoin,
        typeof withdrawAmount === 'number' ? this.tx.pure.u64(withdrawAmount) : withdrawAmount,
      ],
    });
  }

  /**
   * @description Manage Position
   * @param collateralCoinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param updateRequest: manager request, ex: see this.debtorRequest
   * @param priceResult: price result, see this.aggregatePrice
   * @returns [Coin<T>, COIN<USDB>, UpdateResponse]
   */
  updatePosition({
    collateralCoinType,
    updateRequest,
    priceResult,
  }: {
    collateralCoinType: string;
    updateRequest: TransactionArgument;
    priceResult?: TransactionArgument;
  }): [TransactionArgument, TransactionArgument, TransactionArgument] {
    const priceResultType = `${this.config.ORIGINAL_ORACLE_PACKAGE_ID}::result::PriceResult<${collateralCoinType}>`;
    const priceResultOpt = priceResult
      ? this.tx.moveCall({
          target: `0x1::option::some`,
          typeArguments: [priceResultType],
          arguments: [priceResult],
        })
      : this.tx.moveCall({
          target: `0x1::option::none`,
          typeArguments: [priceResultType],
        });
    const [collCoin, usdbCoin, response] = this.tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::update_position`,
      typeArguments: [collateralCoinType],
      arguments: [
        this.vaultObj({ collateralCoinType }),
        this.treasuryObj(),
        this.clockObj(),
        priceResultOpt,
        updateRequest,
      ],
    });
    return [collCoin, usdbCoin, response];
  }

  /**
   * @description check and destroy UpdateResponse
   * @param collateralCoinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param response: UpdateResponse generated by update_position
   */
  checkResponse({ collateralCoinType, response }: { collateralCoinType: string; response: TransactionArgument }) {
    const vaultObj = this.vaultObj({ collateralCoinType });
    this.tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::destroy_response`,
      typeArguments: [collateralCoinType],
      arguments: [vaultObj, this.treasuryObj(), response],
    });
  }

  /* ----- Transaction Methods ----- */

  /**
   * @description build and return Transaction of manage position
   * @param collateralCoinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param depositAmount: how much amount to deposit (collateral)
   * @param borrowAmount: how much amout to borrow (USDB)
   * @param repayAmount: how much amount to repay (USDB)
   * @param withdrawAmount: how much amount to withdraw (collateral)
   * @param accountObjId: the Account object to hold position (undefined if just use EOA)
   * @param recipient (optional): the recipient of the output coins
   * @returns Transaction
   */
  async buildManagePositionTransaction({
    collateralCoinType,
    depositAmount = 0,
    borrowAmount = 0,
    repayAmount = 0,
    withdrawAmount = 0,
    accountObjId,
    recipient = this.sender,
    keepTransaction = false,
  }: {
    collateralCoinType: string;
    depositAmount?: number;
    borrowAmount?: number;
    repayAmount?: number;
    withdrawAmount?: number;
    accountObjId?: string;
    recipient?: string;
    keepTransaction?: boolean;
  }): Promise<Transaction> {
    if (!keepTransaction) this.resetTransaction();
    if (!this.sender) throw new Error('Sender is not set');
    this.tx.setSender(this.sender);
    const [depositCoin] = await this.splitInputCoins({ coinType: collateralCoinType, amounts: [depositAmount] });
    const [repaymentCoin] = await this.splitInputCoins({
      coinType: this.usdbType,
      amounts: [repayAmount],
    });
    if (borrowAmount > 0 || withdrawAmount > 0) {
      const [priceResult] = await this.aggregatePrices({ coinTypes: [collateralCoinType] });
      const updateRequest = this.debtorRequest({
        collateralCoinType,
        depositCoin,
        borrowAmount,
        repaymentCoin,
        withdrawAmount,
        accountObj: accountObjId,
      });
      const [collCoin, usdbCoin, response] = this.updatePosition({
        collateralCoinType,
        updateRequest,
        priceResult,
      });

      this.checkResponse({ collateralCoinType, response });
      if (withdrawAmount > 0) {
        this.tx.transferObjects([collCoin], recipient);
      } else {
        this.destroyZeroCoin({ coinType: collateralCoinType, coin: collCoin });
      }
      if (borrowAmount > 0) {
        this.tx.transferObjects([usdbCoin], recipient);
      } else {
        this.destroyZeroCoin({ coinType: this.usdbType, coin: usdbCoin });
      }
      const tx = this.getTransaction();
      this.resetTransaction();
      return tx;
    } else {
      const updateRequest = this.debtorRequest({
        collateralCoinType,
        depositCoin,
        borrowAmount,
        repaymentCoin,
        withdrawAmount,
        accountObj: accountObjId,
      });
      const [collCoin, usdbCoin, response] = this.updatePosition({
        collateralCoinType,
        updateRequest,
      });

      this.checkResponse({ collateralCoinType, response });
      this.destroyZeroCoin({ coinType: collateralCoinType, coin: collCoin });
      this.destroyZeroCoin({ coinType: this.usdbType, coin: usdbCoin });
      const tx = this.getTransaction();
      if (!keepTransaction) this.resetTransaction();
      return tx;
    }
  }

  /**
   * @description build and return Transaction of close position
   * @param collateralCoinType: collateral coin type , e.g "0x2::sui::SUI"
   * @param accountObjId: the Account object to hold position (undefined if just use EOA)
   * @param recipient (optional): the recipient of the output coins
   * @returns Transaction
   */
  async buildClosePositionTransaction({
    collateralCoinType,
    accountObjId,
    recipient = this.sender,
    keepTransaction = false,
  }: {
    collateralCoinType: string;
    accountObjId?: string;
    recipient?: string;
    keepTransaction?: boolean;
  }): Promise<Transaction> {
    if (!keepTransaction) this.resetTransaction();
    if (!this.sender) throw new Error('Sender is not set');
    this.tx.setSender(this.sender);
    const [collAmount, debtAmount] = this.tx.moveCall({
      target: `${this.config.CDP_PACKAGE_ID}::vault::get_position_data`,
      typeArguments: [collateralCoinType],
      arguments: [this.vaultObj({ collateralCoinType }), this.tx.pure.address(this.sender), this.clockObj()],
    });
    const [repaymentCoin] = await this.splitInputCoins({ coinType: this.usdbType, amounts: [debtAmount] });
    const updateRequest = this.debtorRequest({
      collateralCoinType,
      depositCoin: this.zeroCoin({ coinType: collateralCoinType }),
      borrowAmount: 0,
      repaymentCoin,
      withdrawAmount: collAmount,
      accountObj: accountObjId,
    });
    const [collCoin, usdbCoin, response] = this.updatePosition({
      collateralCoinType,
      updateRequest,
    });

    this.checkResponse({ collateralCoinType, response });
    this.destroyZeroCoin({ coinType: this.usdbType, coin: usdbCoin });
    this.tx.transferObjects([collCoin], recipient);

    const tx = this.getTransaction();
    if (!keepTransaction) this.resetTransaction();
    return tx;
  }
}
