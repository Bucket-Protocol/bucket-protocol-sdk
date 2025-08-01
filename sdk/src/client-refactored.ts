import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions';

import { DUMMY_ADDRESS } from './constants';
import { PriceService, ProtocolService, UserService, TransactionService } from './services';
import {
  BucketConstants,
  BucketProtocolResponse,
  COIN,
  FountainList,
  PsmList,
  StrapFountainList,
  TankList,
  UserBottleInfo,
  UserDeButInfo,
  UserLpList,
  UserTankList,
} from './types';

/**
 * Refactored BucketClient with service-based architecture
 * @param network connection to fullnode: 'mainnet' | 'testnet' | 'devnet' | 'localnet' | string
 * @param owner (optional) address of the current user (default: DUMMY_ADDRESS)
 */
export class BucketClient {
  private rpcEndpoint: string;
  private client: SuiClient;
  
  // Services
  private priceService: PriceService;
  private protocolService: ProtocolService;
  private userService: UserService;
  private transactionService: TransactionService;

  constructor(
    public network: string = 'mainnet',
    public owner: string = DUMMY_ADDRESS,
  ) {
    if (network === 'mainnet' || network === 'testnet' || network === 'devnet' || network === 'localnet') {
      this.rpcEndpoint = getFullnodeUrl(network);
    } else {
      this.rpcEndpoint = network as string;
    }

    this.client = new SuiClient({ url: this.rpcEndpoint });
    
    // Initialize services
    this.priceService = new PriceService(this.client, this.network, this.owner);
    this.protocolService = new ProtocolService(this.client, this.network, this.owner);
    this.userService = new UserService(this.client, this.network, this.owner);
    this.transactionService = new TransactionService(this.client, this.network, this.owner);
  }

  /**
   * Get the underlying SuiClient instance
   */
  getSuiClient(): SuiClient {
    return this.client;
  }

  /**
   * Update the owner address for all services
   */
  setOwner(owner: string): void {
    this.owner = owner;
    // Recreate services with new owner
    this.priceService = new PriceService(this.client, this.network, owner);
    this.protocolService = new ProtocolService(this.client, this.network, owner);
    this.userService = new UserService(this.client, this.network, owner);
    this.transactionService = new TransactionService(this.client, this.network, owner);
  }

  /******************************************************
   ** Price Operations                                 **
   ******************************************************/

  /**
   * Get all token prices
   */
  async getPrices(): Promise<Partial<Record<COIN, number>>> {
    return this.priceService.getPrices();
  }

  /**
   * Update token price using supra oracle
   * @param tx Transaction object
   * @param token Asset type, e.g "0x2::sui::SUI"
   */
  updateSupraOracle(tx: Transaction, token: string): void {
    return this.priceService.updateSupraOracle(tx, token);
  }

  /******************************************************
   ** Protocol Operations                              **
   ******************************************************/

  /**
   * Get bucket constants
   */
  async getBucketConstants(): Promise<BucketConstants | undefined> {
    return this.protocolService.getBucketConstants();
  }

  /**
   * Get protocol information
   */
  async getProtocol(): Promise<BucketProtocolResponse | undefined> {
    return this.protocolService.getProtocol();
  }

  /**
   * Get all tanks
   */
  async getAllTanks(): Promise<TankList> {
    return this.protocolService.getAllTanks();
  }

  /**
   * Get all PSMs (Price Stability Modules)
   */
  async getAllPsms(): Promise<PsmList> {
    return this.protocolService.getAllPsms();
  }

  /**
   * Get all fountains
   */
  async getAllFountains(): Promise<FountainList> {
    return this.protocolService.getAllFountains();
  }

  /**
   * Get all strap fountains
   */
  async getAllStrapFountains(): Promise<StrapFountainList> {
    return this.protocolService.getAllStrapFountains();
  }

  /******************************************************
   ** User Operations                                  **
   ******************************************************/

  /**
   * Get user bottles
   * @param address User address (defaults to current owner)
   */
  async getUserBottles(address?: string): Promise<UserBottleInfo[]> {
    return this.userService.getUserBottles(address || this.owner);
  }

  /**
   * Get user tanks
   * @param address User address (defaults to current owner)
   */
  async getUserTanks(address?: string): Promise<UserTankList> {
    return this.userService.getUserTanks(address || this.owner);
  }

  /**
   * Get user LP proofs
   * @param address User address (defaults to current owner)
   */
  async getUserLpProofs(address?: string): Promise<UserLpList> {
    return this.userService.getUserLpProofs(address || this.owner);
  }

  /**
   * Get user strap fountain positions
   * @param address User address (defaults to current owner)
   */
  async getUserStrapPositions(address?: string) {
    return this.userService.getUserStrapPositions(address || this.owner);
  }

  /**
   * Get user DeBut information
   * @param address User address (defaults to current owner)
   */
  async getUserDeButInfo(address?: string): Promise<UserDeButInfo> {
    return this.userService.getUserDeButInfo(address || this.owner);
  }

  /**
   * Get user's total collateral value
   * @param address User address (defaults to current owner)
   */
  async getUserTotalCollateral(address?: string): Promise<number> {
    return this.userService.getUserTotalCollateral(address || this.owner);
  }

  /**
   * Get user's total debt
   * @param address User address (defaults to current owner)
   */
  async getUserTotalDebt(address?: string): Promise<number> {
    return this.userService.getUserTotalDebt(address || this.owner);
  }

  /******************************************************
   ** Transaction Operations                           **
   ******************************************************/

  /**
   * Build borrow transaction
   * @param tx Transaction object
   * @param collateralType Asset type, e.g "0x2::sui::SUI"
   * @param collateralAmount Collateral amount in raw units
   * @param borrowAmount Borrow amount in raw units
   * @param recipient Recipient address
   * @param insertionPlace Optional insertion place
   * @param strapId Optional strap ID
   * @param noSplitFromGas Whether to split from gas
   */
  async getBorrowTx(
    tx: Transaction,
    collateralType: string,
    collateralAmount: string,
    borrowAmount: string,
    recipient: string,
    insertionPlace?: string,
    strapId?: string,
    noSplitFromGas: boolean = false,
  ): Promise<Transaction> {
    return this.transactionService.buildBorrowTx(
      tx,
      collateralType,
      collateralAmount,
      borrowAmount,
      recipient,
      insertionPlace,
      strapId,
      noSplitFromGas,
    );
  }

  /**
   * Build repay transaction
   * @param tx Transaction object
   * @param collateralType Asset type
   * @param buckAmount BUCK amount to repay
   * @param withdrawAmount Amount to withdraw (0 for full repay)
   * @param walletAddress Wallet address
   * @param insertionPlace Optional insertion place
   * @param strapId Optional strap ID
   */
  async getRepayTx(
    tx: Transaction,
    collateralType: string,
    buckAmount: string,
    withdrawAmount: string,
    walletAddress: string,
    insertionPlace?: string,
    strapId?: string,
  ): Promise<boolean> {
    return this.transactionService.buildRepayTx(
      tx,
      collateralType,
      buckAmount,
      withdrawAmount,
      walletAddress,
      insertionPlace,
      strapId,
    );
  }

  /**
   * Withdraw surplus collateral
   * @param tx Transaction object
   * @param collateralType Asset type
   * @param strap Optional strap argument
   */
  withdrawSurplus(tx: Transaction, collateralType: string, strap?: TransactionArgument): TransactionResult {
    return this.transactionService.withdrawSurplus(tx, collateralType, strap);
  }

  /**
   * Flash borrow transaction
   * @param tx Transaction object
   * @param inputs Coin symbol and amount
   */
  flashBorrow(
    tx: Transaction,
    inputs: {
      coinSymbol: string;
      amount: string | TransactionArgument;
    },
  ): [TransactionArgument | undefined, TransactionArgument | undefined] {
    return this.transactionService.flashBorrow(tx, inputs);
  }

  /**
   * Flash repay transaction
   * @param tx Transaction object
   * @param inputs Coin symbol, repayment and flash receipt
   */
  flashRepay(
    tx: Transaction,
    inputs: {
      coinSymbol: string;
      repayment: TransactionArgument;
      flashReceipt: TransactionArgument;
    },
  ): void {
    return this.transactionService.flashRepay(tx, inputs);
  }

  /**
   * PSM swap in transaction
   * @param tx Transaction object
   * @param coinType Input coin type
   * @param coinInput Input coin
   * @param referrer Referrer address
   */
  async psmSwapIn(
    tx: Transaction,
    coinType: string,
    coinInput: TransactionArgument,
    referrer: string,
  ): Promise<TransactionResult> {
    return this.transactionService.psmSwapIn(tx, coinType, coinInput, referrer);
  }

  /**
   * PSM swap out transaction
   * @param tx Transaction object
   * @param coinType Output coin type
   * @param buckInput BUCK coin input
   * @param referrer Referrer address
   */
  async psmSwapOut(
    tx: Transaction,
    coinType: string,
    buckInput: TransactionArgument,
    referrer: string,
  ): Promise<TransactionResult> {
    return this.transactionService.psmSwapOut(tx, coinType, buckInput, referrer);
  }

  /******************************************************
   ** Service Access (for advanced usage)             **
   ******************************************************/

  /**
   * Get direct access to price service
   */
  get prices(): PriceService {
    return this.priceService;
  }

  /**
   * Get direct access to protocol service
   */
  get protocol(): ProtocolService {
    return this.protocolService;
  }

  /**
   * Get direct access to user service
   */
  get user(): UserService {
    return this.userService;
  }

  /**
   * Get direct access to transaction service
   */
  get transactions(): TransactionService {
    return this.transactionService;
  }
}