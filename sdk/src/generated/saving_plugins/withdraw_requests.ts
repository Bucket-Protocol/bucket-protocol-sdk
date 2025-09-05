/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/

/** Module: saving_plugins */

import {
  MoveStruct,
  normalizeMoveArguments,
  type RawTransactionArgument,
} from "../utils/index.js";
import { bcs } from "@mysten/sui/bcs";
import { type Transaction } from "@mysten/sui/transactions";
import * as balance from "./deps/sui/balance.js";
import * as object from "./deps/sui/object.js";
import * as vec_set from "./deps/sui/vec_set.js";
import * as account from "./deps/bucket_v2_framework/account.js";
import * as linked_table from "./deps/sui/linked_table.js";
const $moduleName = "@local-pkg/saving_plugins.move::withdraw_requests";
export const SavingPoolWithdrawWithRequest = new MoveStruct({
  name: `${$moduleName}::SavingPoolWithdrawWithRequest`,
  fields: {
    dummy_field: bcs.bool(),
  },
});
export const Request = new MoveStruct({
  name: `${$moduleName}::Request`,
  fields: {
    owner: bcs.Address,
    withdrawal: balance.Balance,
  },
});
export const WithdrawRequestPlugin = new MoveStruct({
  name: `${$moduleName}::WithdrawRequestPlugin`,
  fields: {
    id: object.UID,
    version: vec_set.VecSet(bcs.u64()),
    account: account.Account,
    managers: vec_set.VecSet(bcs.Address),
    pending_requests: linked_table.LinkedTable(bcs.u64()),
    counter: bcs.u64(),
  },
});
export const DepositEvent = new MoveStruct({
  name: `${$moduleName}::DepositEvent`,
  fields: {
    user_id: bcs.string(),
    sender: bcs.Address,
    amount: bcs.u64(),
    timestamp: bcs.u64(),
  },
});
export const RequestWithdraEvent = new MoveStruct({
  name: `${$moduleName}::RequestWithdraEvent`,
  fields: {
    owner: bcs.Address,
    amount: bcs.u64(),
    timestamp: bcs.u64(),
  },
});
export const FulfillWithdraEvent = new MoveStruct({
  name: `${$moduleName}::FulfillWithdraEvent`,
  fields: {
    user_id: bcs.string(),
    owner: bcs.Address,
    amount: bcs.u64(),
    timestamp: bcs.u64(),
  },
});
export const RequestData = new MoveStruct({
  name: `${$moduleName}::RequestData`,
  fields: {
    request_id: bcs.u64(),
    owner: bcs.Address,
    withdrawal: bcs.u64(),
  },
});
export interface VersionOptions {
  package?: string;
  arguments?: [];
}
export function version(options: VersionOptions = {}) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "version",
    });
}
export interface AccountAddressArguments {
  self: RawTransactionArgument<string>;
}
export interface AccountAddressOptions {
  package?: string;
  arguments: AccountAddressArguments | [self: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function accountAddress(options: AccountAddressOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "account_address",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface ManagersArguments {
  self: RawTransactionArgument<string>;
}
export interface ManagersOptions {
  package?: string;
  arguments: ManagersArguments | [self: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function managers(options: ManagersOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "managers",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface NewArguments {
  Cap: RawTransactionArgument<string>;
}
export interface NewOptions {
  package?: string;
  arguments: NewArguments | [Cap: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function _new(options: NewOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::admin::AdminCap`,
  ] satisfies string[];
  const parameterNames = ["Cap"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "new",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface DefaultArguments {
  Cap: RawTransactionArgument<string>;
}
export interface DefaultOptions {
  package?: string;
  arguments: DefaultArguments | [Cap: RawTransactionArgument<string>];
  typeArguments: [string];
}
export function _default(options: DefaultOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::admin::AdminCap`,
  ] satisfies string[];
  const parameterNames = ["Cap"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "default",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface AddVersionArguments {
  self: RawTransactionArgument<string>;
  Cap: RawTransactionArgument<string>;
  version: RawTransactionArgument<number | bigint>;
}
export interface AddVersionOptions {
  package?: string;
  arguments:
    | AddVersionArguments
    | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        version: RawTransactionArgument<number | bigint>,
      ];
  typeArguments: [string];
}
export function addVersion(options: AddVersionOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
    `${packageAddress}::admin::AdminCap`,
    "u64",
  ] satisfies string[];
  const parameterNames = ["self", "Cap", "version"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "add_version",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface RemoveVersionArguments {
  self: RawTransactionArgument<string>;
  Cap: RawTransactionArgument<string>;
  version: RawTransactionArgument<number | bigint>;
}
export interface RemoveVersionOptions {
  package?: string;
  arguments:
    | RemoveVersionArguments
    | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        version: RawTransactionArgument<number | bigint>,
      ];
  typeArguments: [string];
}
export function removeVersion(options: RemoveVersionOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
    `${packageAddress}::admin::AdminCap`,
    "u64",
  ] satisfies string[];
  const parameterNames = ["self", "Cap", "version"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "remove_version",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface AddManagerArguments {
  self: RawTransactionArgument<string>;
  Cap: RawTransactionArgument<string>;
  manager: RawTransactionArgument<string>;
}
export interface AddManagerOptions {
  package?: string;
  arguments:
    | AddManagerArguments
    | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>,
      ];
  typeArguments: [string];
}
export function addManager(options: AddManagerOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
    `${packageAddress}::admin::AdminCap`,
    "address",
  ] satisfies string[];
  const parameterNames = ["self", "Cap", "manager"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "add_manager",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface RemoveManagerArguments {
  self: RawTransactionArgument<string>;
  Cap: RawTransactionArgument<string>;
  manager: RawTransactionArgument<string>;
}
export interface RemoveManagerOptions {
  package?: string;
  arguments:
    | RemoveManagerArguments
    | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>,
      ];
  typeArguments: [string];
}
export function removeManager(options: RemoveManagerOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
    `${packageAddress}::admin::AdminCap`,
    "address",
  ] satisfies string[];
  const parameterNames = ["self", "Cap", "manager"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "remove_manager",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface RequestIndexArguments {
  data: RawTransactionArgument<string>;
}
export interface RequestIndexOptions {
  package?: string;
  arguments: RequestIndexArguments | [data: RawTransactionArgument<string>];
}
export function requestIndex(options: RequestIndexOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::RequestData`,
  ] satisfies string[];
  const parameterNames = ["data"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "request_index",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface RequestOwnerArguments {
  data: RawTransactionArgument<string>;
}
export interface RequestOwnerOptions {
  package?: string;
  arguments: RequestOwnerArguments | [data: RawTransactionArgument<string>];
}
export function requestOwner(options: RequestOwnerOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::RequestData`,
  ] satisfies string[];
  const parameterNames = ["data"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "request_owner",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface RequestWithdrawalArguments {
  data: RawTransactionArgument<string>;
}
export interface RequestWithdrawalOptions {
  package?: string;
  arguments:
    | RequestWithdrawalArguments
    | [data: RawTransactionArgument<string>];
}
export function requestWithdrawal(options: RequestWithdrawalOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::RequestData`,
  ] satisfies string[];
  const parameterNames = ["data"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "request_withdrawal",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface GetRequestsArguments {
  self: RawTransactionArgument<string>;
  cursor: RawTransactionArgument<number | bigint | null>;
  size: RawTransactionArgument<number | bigint>;
}
export interface GetRequestsOptions {
  package?: string;
  arguments:
    | GetRequestsArguments
    | [
        self: RawTransactionArgument<string>,
        cursor: RawTransactionArgument<number | bigint | null>,
        size: RawTransactionArgument<number | bigint>,
      ];
  typeArguments: [string];
}
export function getRequests(options: GetRequestsOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
    "0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<u64>",
    "u64",
  ] satisfies string[];
  const parameterNames = ["self", "cursor", "size"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "get_requests",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface DepositArguments {
  self: RawTransactionArgument<string>;
  userId: RawTransactionArgument<string>;
  pool: RawTransactionArgument<string>;
  treasury: RawTransactionArgument<string>;
  price: RawTransactionArgument<string>;
  savingPool: RawTransactionArgument<string>;
  stable: RawTransactionArgument<string>;
}
export interface DepositOptions {
  package?: string;
  arguments:
    | DepositArguments
    | [
        self: RawTransactionArgument<string>,
        userId: RawTransactionArgument<string>,
        pool: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        price: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        stable: RawTransactionArgument<string>,
      ];
  typeArguments: [string, string];
}
export function deposit(options: DepositOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
    "0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String",
    `${packageAddress}::pool::Pool<${options.typeArguments[1]}>`,
    `${packageAddress}::usdb::Treasury`,
    `${packageAddress}::result::PriceResult<${options.typeArguments[1]}>`,
    `${packageAddress}::saving::SavingPool<${options.typeArguments[0]}>`,
    `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[1]}>`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock",
  ] satisfies string[];
  const parameterNames = [
    "self",
    "userId",
    "pool",
    "treasury",
    "price",
    "savingPool",
    "stable",
    "clock",
  ];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "deposit",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface RequestWithdrawArguments {
  self: RawTransactionArgument<string>;
  withdrawResponse: RawTransactionArgument<string>;
  usdb: RawTransactionArgument<string>;
}
export interface RequestWithdrawOptions {
  package?: string;
  arguments:
    | RequestWithdrawArguments
    | [
        self: RawTransactionArgument<string>,
        withdrawResponse: RawTransactionArgument<string>,
        usdb: RawTransactionArgument<string>,
      ];
  typeArguments: [string];
}
export function requestWithdraw(options: RequestWithdrawOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
    `${packageAddress}::saving::WithdrawResponse<${options.typeArguments[0]}>`,
    `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${packageAddress}::usdb::USDB>`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock",
  ] satisfies string[];
  const parameterNames = ["self", "withdrawResponse", "usdb", "clock"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "request_withdraw",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface ApproveWithdrawArguments {
  self: RawTransactionArgument<string>;
  requestId: RawTransactionArgument<number | bigint>;
  userId: RawTransactionArgument<string>;
  pool: RawTransactionArgument<string>;
  treasury: RawTransactionArgument<string>;
  price: RawTransactionArgument<string>;
}
export interface ApproveWithdrawOptions {
  package?: string;
  arguments:
    | ApproveWithdrawArguments
    | [
        self: RawTransactionArgument<string>,
        requestId: RawTransactionArgument<number | bigint>,
        userId: RawTransactionArgument<string>,
        pool: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        price: RawTransactionArgument<string>,
      ];
  typeArguments: [string, string];
}
export function approveWithdraw(options: ApproveWithdrawOptions) {
  const packageAddress = options.package ?? "@local-pkg/saving_plugins.move";
  const argumentsTypes = [
    `${packageAddress}::withdraw_requests::WithdrawRequestPlugin<${options.typeArguments[0]}>`,
    "u64",
    "0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String",
    `${packageAddress}::pool::Pool<${options.typeArguments[1]}>`,
    `${packageAddress}::usdb::Treasury`,
    `${packageAddress}::result::PriceResult<${options.typeArguments[1]}>`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock",
  ] satisfies string[];
  const parameterNames = [
    "self",
    "requestId",
    "userId",
    "pool",
    "treasury",
    "price",
    "clock",
  ];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "withdraw_requests",
      function: "approve_withdraw",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}

