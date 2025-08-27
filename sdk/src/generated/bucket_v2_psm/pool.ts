/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import * as float from './deps/bucket_v2_framework/float.js';
import * as sheet from './deps/bucket_v2_framework/sheet.js';
import * as balance_1 from './deps/sui/balance.js';
import * as object from './deps/sui/object.js';
import * as vec_map from './deps/sui/vec_map.js';

const $moduleName = '@local-pkg/bucket_v2_psm::pool';

export const FeeConfig = new MoveStruct({
  name: `${$moduleName}::FeeConfig`,
  fields: {
    swap_in_fee_rate: float.Float,
    swap_out_fee_rate: float.Float,
  },
});
export const Pool = new MoveStruct({
  name: `${$moduleName}::Pool`,
  fields: {
    id: object.UID,
    decimal: bcs.u8(),
    default_fee_config: FeeConfig,
    partner_fee_configs: vec_map.VecMap(bcs.Address, FeeConfig),
    price_tolerance: float.Float,
    balance: balance_1.Balance,
    balance_amount: bcs.u64(),
    usdb_supply: bcs.u64(),
    sheet: sheet.Sheet,
  },
});
export interface NewArguments {
  treasury: RawTransactionArgument<string>;
  Cap: RawTransactionArgument<string>;
  decimal: RawTransactionArgument<number>;
  swapInFeeRateBps: RawTransactionArgument<number | bigint>;
  swapOutFeeRateBps: RawTransactionArgument<number | bigint>;
  priceToleranceBps: RawTransactionArgument<number | bigint>;
}
export interface NewOptions {
  package?: string;
  arguments:
    | NewArguments
    | [
        treasury: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        decimal: RawTransactionArgument<number>,
        swapInFeeRateBps: RawTransactionArgument<number | bigint>,
        swapOutFeeRateBps: RawTransactionArgument<number | bigint>,
        priceToleranceBps: RawTransactionArgument<number | bigint>,
      ];
  typeArguments: [string];
}
/** Admin Funs */
export function _new(options: NewOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [
    '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
    '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
    'u8',
    'u64',
    'u64',
    'u64',
  ] satisfies string[];
  const parameterNames = ['treasury', 'Cap', 'decimal', 'swapInFeeRateBps', 'swapOutFeeRateBps', 'priceToleranceBps'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'new',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface CreateArguments {
  treasury: RawTransactionArgument<string>;
  Cap: RawTransactionArgument<string>;
  decimal: RawTransactionArgument<number>;
  swapInFeeRateBps: RawTransactionArgument<number | bigint>;
  swapOutFeeRateBps: RawTransactionArgument<number | bigint>;
  priceToleranceBps: RawTransactionArgument<number | bigint>;
}
export interface CreateOptions {
  package?: string;
  arguments:
    | CreateArguments
    | [
        treasury: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        decimal: RawTransactionArgument<number>,
        swapInFeeRateBps: RawTransactionArgument<number | bigint>,
        swapOutFeeRateBps: RawTransactionArgument<number | bigint>,
        priceToleranceBps: RawTransactionArgument<number | bigint>,
      ];
  typeArguments: [string];
}
export function create(options: CreateOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [
    '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
    '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
    'u8',
    'u64',
    'u64',
    'u64',
  ] satisfies string[];
  const parameterNames = ['treasury', 'Cap', 'decimal', 'swapInFeeRateBps', 'swapOutFeeRateBps', 'priceToleranceBps'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'create',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface SetFeeConfigArguments {
  pool: RawTransactionArgument<string>;
  Cap: RawTransactionArgument<string>;
  partner: RawTransactionArgument<string | null>;
  swapInFeeRateBps: RawTransactionArgument<number | bigint>;
  swapOutFeeRateBps: RawTransactionArgument<number | bigint>;
}
export interface SetFeeConfigOptions {
  package?: string;
  arguments:
    | SetFeeConfigArguments
    | [
        pool: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        partner: RawTransactionArgument<string | null>,
        swapInFeeRateBps: RawTransactionArgument<number | bigint>,
        swapOutFeeRateBps: RawTransactionArgument<number | bigint>,
      ];
  typeArguments: [string];
}
export function setFeeConfig(options: SetFeeConfigOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [
    `${packageAddress}::pool::Pool<${options.typeArguments[0]}>`,
    '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
    '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>',
    'u64',
    'u64',
  ] satisfies string[];
  const parameterNames = ['pool', 'Cap', 'partner', 'swapInFeeRateBps', 'swapOutFeeRateBps'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'set_fee_config',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface SetPriceToleranceArguments {
  pool: RawTransactionArgument<string>;
  Cap: RawTransactionArgument<string>;
  toleranceBps: RawTransactionArgument<number | bigint>;
}
export interface SetPriceToleranceOptions {
  package?: string;
  arguments:
    | SetPriceToleranceArguments
    | [
        pool: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        toleranceBps: RawTransactionArgument<number | bigint>,
      ];
  typeArguments: [string];
}
export function setPriceTolerance(options: SetPriceToleranceOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [
    `${packageAddress}::pool::Pool<${options.typeArguments[0]}>`,
    '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::admin::AdminCap',
    'u64',
  ] satisfies string[];
  const parameterNames = ['pool', 'Cap', 'toleranceBps'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'set_price_tolerance',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface SwapInArguments {
  pool: RawTransactionArgument<string>;
  treasury: RawTransactionArgument<string>;
  price: RawTransactionArgument<string>;
  assetCoin: RawTransactionArgument<string>;
  partner: RawTransactionArgument<string | null>;
}
export interface SwapInOptions {
  package?: string;
  arguments:
    | SwapInArguments
    | [
        pool: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        price: RawTransactionArgument<string>,
        assetCoin: RawTransactionArgument<string>,
        partner: RawTransactionArgument<string | null>,
      ];
  typeArguments: [string];
}
/** Public Funs */
export function swapIn(options: SwapInOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [
    `${packageAddress}::pool::Pool<${options.typeArguments[0]}>`,
    '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
    `0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce::result::PriceResult<${options.typeArguments[0]}>`,
    `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`,
    '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<0x070e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63::account::AccountRequest>',
  ] satisfies string[];
  const parameterNames = ['pool', 'treasury', 'price', 'assetCoin', 'partner'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'swap_in',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface SwapOutArguments {
  pool: RawTransactionArgument<string>;
  treasury: RawTransactionArgument<string>;
  price: RawTransactionArgument<string>;
  usdbCoin: RawTransactionArgument<string>;
  partner: RawTransactionArgument<string | null>;
}
export interface SwapOutOptions {
  package?: string;
  arguments:
    | SwapOutArguments
    | [
        pool: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        price: RawTransactionArgument<string>,
        usdbCoin: RawTransactionArgument<string>,
        partner: RawTransactionArgument<string | null>,
      ];
  typeArguments: [string];
}
export function swapOut(options: SwapOutOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [
    `${packageAddress}::pool::Pool<${options.typeArguments[0]}>`,
    '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::Treasury',
    `0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce::result::PriceResult<${options.typeArguments[0]}>`,
    '0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9::usdb::USDB>',
    '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<0x070e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63::account::AccountRequest>',
  ] satisfies string[];
  const parameterNames = ['pool', 'treasury', 'price', 'usdbCoin', 'partner'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'swap_out',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface DecimalArguments {
  pool: RawTransactionArgument<string>;
}
export interface DecimalOptions {
  package?: string;
  arguments: DecimalArguments | [pool: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function decimal(options: DecimalOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [`${packageAddress}::pool::Pool<${options.typeArguments[0]}>`] satisfies string[];
  const parameterNames = ['pool'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'decimal',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface ConversionRateArguments {
  pool: RawTransactionArgument<string>;
}
export interface ConversionRateOptions {
  package?: string;
  arguments: ConversionRateArguments | [pool: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function conversionRate(options: ConversionRateOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [`${packageAddress}::pool::Pool<${options.typeArguments[0]}>`] satisfies string[];
  const parameterNames = ['pool'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'conversion_rate',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface SwapInFeeRateArguments {
  pool: RawTransactionArgument<string>;
  partner: RawTransactionArgument<string | null>;
}
export interface SwapInFeeRateOptions {
  package?: string;
  arguments:
    | SwapInFeeRateArguments
    | [pool: RawTransactionArgument<string>, partner: RawTransactionArgument<string | null>];
  typeArguments: [string];
}
export function swapInFeeRate(options: SwapInFeeRateOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [
    `${packageAddress}::pool::Pool<${options.typeArguments[0]}>`,
    '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>',
  ] satisfies string[];
  const parameterNames = ['pool', 'partner'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'swap_in_fee_rate',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface SwapOutFeeRateArguments {
  pool: RawTransactionArgument<string>;
  partner: RawTransactionArgument<string | null>;
}
export interface SwapOutFeeRateOptions {
  package?: string;
  arguments:
    | SwapOutFeeRateArguments
    | [pool: RawTransactionArgument<string>, partner: RawTransactionArgument<string | null>];
  typeArguments: [string];
}
export function swapOutFeeRate(options: SwapOutFeeRateOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [
    `${packageAddress}::pool::Pool<${options.typeArguments[0]}>`,
    '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>',
  ] satisfies string[];
  const parameterNames = ['pool', 'partner'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'swap_out_fee_rate',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface BalanceArguments {
  pool: RawTransactionArgument<string>;
}
export interface BalanceOptions {
  package?: string;
  arguments: BalanceArguments | [pool: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function balance(options: BalanceOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [`${packageAddress}::pool::Pool<${options.typeArguments[0]}>`] satisfies string[];
  const parameterNames = ['pool'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'balance',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface BalanceAmountArguments {
  pool: RawTransactionArgument<string>;
}
export interface BalanceAmountOptions {
  package?: string;
  arguments: BalanceAmountArguments | [pool: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function balanceAmount(options: BalanceAmountOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [`${packageAddress}::pool::Pool<${options.typeArguments[0]}>`] satisfies string[];
  const parameterNames = ['pool'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'balance_amount',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface UsdbSupplyArguments {
  pool: RawTransactionArgument<string>;
}
export interface UsdbSupplyOptions {
  package?: string;
  arguments: UsdbSupplyArguments | [pool: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function usdbSupply(options: UsdbSupplyOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [`${packageAddress}::pool::Pool<${options.typeArguments[0]}>`] satisfies string[];
  const parameterNames = ['pool'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'usdb_supply',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface PriceToleranceArguments {
  pool: RawTransactionArgument<string>;
}
export interface PriceToleranceOptions {
  package?: string;
  arguments: PriceToleranceArguments | [pool: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function priceTolerance(options: PriceToleranceOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
  const argumentsTypes = [`${packageAddress}::pool::Pool<${options.typeArguments[0]}>`] satisfies string[];
  const parameterNames = ['pool'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'pool',
      function: 'price_tolerance',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}

