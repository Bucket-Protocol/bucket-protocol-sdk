import { bcs } from '@mysten/sui/bcs';
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions';

import { BaseService } from './base';
import {
  BUCKET_OPERATIONS_PACKAGE_ID,
  CLOCK_OBJECT,
  COINS_TYPE_LIST,
  CORE_PACKAGE_ID,
  ORACLE_OBJECT,
  PROTOCOL_OBJECT,
  PSM_POOL_IDS,
  STRAP_FOUNTAIN_IDS,
  TREASURY_OBJECT,
} from '../constants';
import { COIN } from '../types';
import {
  coinFromBalance,
  coinIntoBalance,
  getCoinSymbol,
  getInputCoins,
  getMainCoin,
} from '../utils';

/**
 * Service for handling transaction building operations
 */
export class TransactionService extends BaseService {
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
  async buildBorrowTx(
    tx: Transaction,
    collateralType: string,
    collateralAmount: string,
    borrowAmount: string,
    recipient: string,
    insertionPlace?: string,
    strapId?: string,
    noSplitFromGas: boolean = false,
  ): Promise<Transaction> {
    const coin = getCoinSymbol(collateralType);
    if (!coin) {
      throw new Error('Collateral not supported');
    }

    const isLST = coin in STRAP_FOUNTAIN_IDS;
    const collateralInput = await getInputCoins({
      client: this.client,
      tx,
      coinType: collateralType,
      amount: collateralAmount,
      owner: this.owner,
      noSplitFromGas,
    });

    if (isLST && strapId) {
      tx.moveCall({
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::borrow_with_strap`,
        typeArguments: [collateralType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.object(strapId),
          tx.sharedObjectRef(CLOCK_OBJECT),
          collateralInput,
          tx.pure.u64(borrowAmount),
          tx.pure(bcs.vector(bcs.Address).serialize([insertionPlace || strapId])),
        ],
      });
    } else {
      tx.moveCall({
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::borrow`,
        typeArguments: [collateralType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          collateralInput,
          tx.pure.u64(borrowAmount),
          tx.pure(bcs.vector(bcs.Address).serialize([insertionPlace || recipient])),
        ],
      });
    }

    return tx;
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
  async buildRepayTx(
    tx: Transaction,
    collateralType: string,
    buckAmount: string,
    withdrawAmount: string,
    walletAddress: string,
    insertionPlace?: string,
    strapId?: string,
  ): Promise<boolean> {
    const buckCoinInput = await getInputCoins({
      client: this.client,
      tx,
      coinType: COINS_TYPE_LIST.BUCK,
      amount: buckAmount,
      owner: this.owner,
    });

    const isFullRepay = withdrawAmount === '0';

    if (isFullRepay) {
      if (strapId) {
        tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::fully_repay_with_strap`,
          typeArguments: [collateralType],
          arguments: [
            tx.sharedObjectRef(PROTOCOL_OBJECT),
            tx.object(strapId),
            buckCoinInput,
            tx.sharedObjectRef(CLOCK_OBJECT),
          ],
        });
      } else {
        tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::fully_repay`,
          typeArguments: [collateralType],
          arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), buckCoinInput, tx.sharedObjectRef(CLOCK_OBJECT)],
        });
      }
    } else {
      if (strapId) {
        tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::repay_and_withdraw_with_strap`,
          typeArguments: [collateralType],
          arguments: [
            tx.sharedObjectRef(PROTOCOL_OBJECT),
            tx.sharedObjectRef(ORACLE_OBJECT),
            tx.object(strapId),
            tx.sharedObjectRef(CLOCK_OBJECT),
            buckCoinInput,
            tx.pure.u64(withdrawAmount),
            tx.pure(bcs.vector(bcs.Address).serialize([insertionPlace || strapId])),
          ],
        });
      } else {
        tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::repay_and_withdraw`,
          typeArguments: [collateralType],
          arguments: [
            tx.sharedObjectRef(PROTOCOL_OBJECT),
            tx.sharedObjectRef(ORACLE_OBJECT),
            tx.sharedObjectRef(CLOCK_OBJECT),
            buckCoinInput,
            tx.pure.u64(withdrawAmount),
            tx.pure(bcs.vector(bcs.Address).serialize([insertionPlace || walletAddress])),
          ],
        });
      }
    }

    return true;
  }

  /**
   * Withdraw surplus collateral
   * @param tx Transaction object
   * @param collateralType Asset type
   * @param strap Optional strap argument
   */
  withdrawSurplus(tx: Transaction, collateralType: string, strap?: TransactionArgument): TransactionResult {
    const token = getCoinSymbol(collateralType);
    if (!token) {
      throw new Error('Collateral type not supported');
    }

    if (strap) {
      const surplusCollateral = tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::withdraw_surplus_with_strap`,
        typeArguments: [collateralType],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), strap],
      });
      tx.moveCall({
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::destroy_empty_strap`,
        typeArguments: [collateralType],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), strap],
      });
      return coinFromBalance(tx, collateralType, surplusCollateral);
    } else {
      const surplusCollateral = tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::withdraw_surplus_collateral`,
        typeArguments: [collateralType],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT)],
      });
      return coinFromBalance(tx, collateralType, surplusCollateral);
    }
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
    const { coinSymbol, amount } = inputs;
    const coinType = COINS_TYPE_LIST[coinSymbol as COIN];
    const isBuck = coinType === COINS_TYPE_LIST.BUCK;
    const target = isBuck ? `${CORE_PACKAGE_ID}::buck::flash_borrow_buck` : `${CORE_PACKAGE_ID}::buck::flash_borrow`;
    const typeArguments = isBuck ? [COINS_TYPE_LIST.SUI] : [coinType];
    
    const [flashLoans, flashReceipt] = tx.moveCall({
      target,
      typeArguments,
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), typeof amount === 'string' ? tx.pure.u64(amount) : amount],
    });
    
    return [flashLoans, flashReceipt];
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
    const { coinSymbol, repayment, flashReceipt } = inputs;
    const coinType = COINS_TYPE_LIST[coinSymbol as COIN];
    const isBuck = coinType === COINS_TYPE_LIST.BUCK;
    const target = isBuck ? `${CORE_PACKAGE_ID}::buck::flash_repay_buck` : `${CORE_PACKAGE_ID}::buck::flash_repay`;
    const typeArguments = isBuck ? [COINS_TYPE_LIST.SUI] : [coinType];
    
    tx.moveCall({
      target,
      typeArguments,
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), repayment, flashReceipt],
    });
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
    const coinSymbol = getCoinSymbol(coinType);
    if (!coinSymbol) {
      throw new Error('Coin type not supported');
    }

    const psmPoolId = PSM_POOL_IDS[coinSymbol as keyof typeof PSM_POOL_IDS];
    if (!psmPoolId) {
      throw new Error('PSM pool not found for coin type');
    }

    const buckOut = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::psm::swap_in`,
      typeArguments: [coinType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.object(psmPoolId),
        coinInput,
        tx.pure.address(referrer),
      ],
    });

    return coinFromBalance(tx, COINS_TYPE_LIST.BUCK, buckOut);
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
    const coinSymbol = getCoinSymbol(coinType);
    if (!coinSymbol) {
      throw new Error('Coin type not supported');
    }

    const psmPoolId = PSM_POOL_IDS[coinSymbol as keyof typeof PSM_POOL_IDS];
    if (!psmPoolId) {
      throw new Error('PSM pool not found for coin type');
    }

    const coinOut = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::psm::swap_out`,
      typeArguments: [coinType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.object(psmPoolId),
        buckInput,
        tx.pure.address(referrer),
      ],
    });

    return coinFromBalance(tx, coinType, coinOut);
  }
}