/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import * as object from './deps/sui/object.js';
import * as vec_set from './deps/sui/vec_set.js';

const $moduleName = '@local-pkg/bucket_saving_incentive::incentive_config';
export const GlobalConfig = new MoveStruct({
  name: `${$moduleName}::GlobalConfig`,
  fields: {
    id: object.UID,
    versions: vec_set.VecSet(bcs.u16()),
    managers: vec_set.VecSet(bcs.Address),
  },
});
export interface PackageVersionOptions {
  package?: string;
  arguments?: [];
}
export function packageVersion(options: PackageVersionOptions = {}) {
  const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'incentive_config',
      function: 'package_version',
    });
}
export interface AddVersionArguments {
  Cap: RawTransactionArgument<string>;
  config: RawTransactionArgument<string>;
  version: RawTransactionArgument<number>;
}
export interface AddVersionOptions {
  package?: string;
  arguments:
    | AddVersionArguments
    | [
        Cap: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        version: RawTransactionArgument<number>,
      ];
}
/** Admin Funs */
export function addVersion(options: AddVersionOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
  const argumentsTypes = [
    `${packageAddress}::admin::AdminCap`,
    `${packageAddress}::incentive_config::GlobalConfig`,
    'u16',
  ] satisfies string[];
  const parameterNames = ['Cap', 'config', 'version'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'incentive_config',
      function: 'add_version',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemoveVersionArguments {
  Cap: RawTransactionArgument<string>;
  config: RawTransactionArgument<string>;
  version: RawTransactionArgument<number>;
}
export interface RemoveVersionOptions {
  package?: string;
  arguments:
    | RemoveVersionArguments
    | [
        Cap: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        version: RawTransactionArgument<number>,
      ];
}
export function removeVersion(options: RemoveVersionOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
  const argumentsTypes = [
    `${packageAddress}::admin::AdminCap`,
    `${packageAddress}::incentive_config::GlobalConfig`,
    'u16',
  ] satisfies string[];
  const parameterNames = ['Cap', 'config', 'version'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'incentive_config',
      function: 'remove_version',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddManagerArguments {
  Cap: RawTransactionArgument<string>;
  config: RawTransactionArgument<string>;
  manager: RawTransactionArgument<string>;
}
export interface AddManagerOptions {
  package?: string;
  arguments:
    | AddManagerArguments
    | [
        Cap: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>,
      ];
}
export function addManager(options: AddManagerOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
  const argumentsTypes = [
    `${packageAddress}::admin::AdminCap`,
    `${packageAddress}::incentive_config::GlobalConfig`,
    'address',
  ] satisfies string[];
  const parameterNames = ['Cap', 'config', 'manager'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'incentive_config',
      function: 'add_manager',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemoveManagerArguments {
  Cap: RawTransactionArgument<string>;
  config: RawTransactionArgument<string>;
  manager: RawTransactionArgument<string>;
}
export interface RemoveManagerOptions {
  package?: string;
  arguments:
    | RemoveManagerArguments
    | [
        Cap: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>,
      ];
}
export function removeManager(options: RemoveManagerOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
  const argumentsTypes = [
    `${packageAddress}::admin::AdminCap`,
    `${packageAddress}::incentive_config::GlobalConfig`,
    'address',
  ] satisfies string[];
  const parameterNames = ['Cap', 'config', 'manager'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'incentive_config',
      function: 'remove_manager',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AssertValidPackageVersionArguments {
  config: RawTransactionArgument<string>;
}
export interface AssertValidPackageVersionOptions {
  package?: string;
  arguments: AssertValidPackageVersionArguments | [config: RawTransactionArgument<string>];
}
/** Public Funs */
export function assertValidPackageVersion(options: AssertValidPackageVersionOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
  const argumentsTypes = [`${packageAddress}::incentive_config::GlobalConfig`] satisfies string[];
  const parameterNames = ['config'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'incentive_config',
      function: 'assert_valid_package_version',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AssertSenderIsManagerArguments {
  config: RawTransactionArgument<string>;
  request: RawTransactionArgument<string>;
}
export interface AssertSenderIsManagerOptions {
  package?: string;
  arguments:
    | AssertSenderIsManagerArguments
    | [config: RawTransactionArgument<string>, request: RawTransactionArgument<string>];
}
export function assertSenderIsManager(options: AssertSenderIsManagerOptions) {
  const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
  const argumentsTypes = [
    `${packageAddress}::incentive_config::GlobalConfig`,
    `${packageAddress}::account::AccountRequest`,
  ] satisfies string[];
  const parameterNames = ['config', 'request'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'incentive_config',
      function: 'assert_sender_is_manager',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
