import { type BcsType } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../../../utils/index.js';
import * as object from './object.js';

const $moduleName = '@local-pkg/suiii::dynamic_field';
/** Internal object used for storing the field and value */
export function Field<Name extends BcsType<any>, Value extends BcsType<any>>(...typeParameters: [Name, Value]) {
  return new MoveStruct({
    name: `${$moduleName}::Field<${typeParameters[0].name as Name['name']}, ${typeParameters[1].name as Value['name']}>`,
    fields: {
      /**
       * Determined by the hash of the object ID, the field name value and it's type,
       * i.e. hash(parent.id || name || Name)
       */
      id: object.UID,
      /** The value for the name of this field */
      name: typeParameters[0],
      /** The value bound to this field */
      value: typeParameters[1],
    },
  });
}
export interface BorrowArguments<Name extends BcsType<any>> {
  object: RawTransactionArgument<string>;
  name: RawTransactionArgument<Name>;
}
export interface BorrowOptions<Name extends BcsType<any>> {
  package?: string;
  arguments: BorrowArguments<Name> | [object: RawTransactionArgument<string>, name: RawTransactionArgument<Name>];
  typeArguments: [string, string];
}
/**
 * Immutably borrows the `object`s dynamic field with the name specified by
 * `name: Name`. Aborts with `EFieldDoesNotExist` if the object does not have a
 * field with that name. Aborts with `EFieldTypeMismatch` if the field exists, but
 * the value does not have the specified type.
 */
export function borrow<Name extends BcsType<any>>(options: BorrowOptions<Name>) {
  const packageAddress = options.package ?? '@local-pkg/suiii';
  const argumentsTypes = [
    '0x0000000000000000000000000000000000000000000000000000000000000002::object::UID',
    `${options.typeArguments[0]}`,
  ] satisfies string[];
  const parameterNames = ['object', 'name'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'dynamic_field',
      function: 'borrow',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface BorrowMutArguments<Name extends BcsType<any>> {
  object: RawTransactionArgument<string>;
  name: RawTransactionArgument<Name>;
}
export interface BorrowMutOptions<Name extends BcsType<any>> {
  package?: string;
  arguments: BorrowMutArguments<Name> | [object: RawTransactionArgument<string>, name: RawTransactionArgument<Name>];
  typeArguments: [string, string];
}
/**
 * Mutably borrows the `object`s dynamic field with the name specified by
 * `name: Name`. Aborts with `EFieldDoesNotExist` if the object does not have a
 * field with that name. Aborts with `EFieldTypeMismatch` if the field exists, but
 * the value does not have the specified type.
 */
export function borrowMut<Name extends BcsType<any>>(options: BorrowMutOptions<Name>) {
  const packageAddress = options.package ?? '@local-pkg/suiii';
  const argumentsTypes = [
    '0x0000000000000000000000000000000000000000000000000000000000000002::object::UID',
    `${options.typeArguments[0]}`,
  ] satisfies string[];
  const parameterNames = ['object', 'name'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'dynamic_field',
      function: 'borrow_mut',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface RemoveArguments<Name extends BcsType<any>> {
  object: RawTransactionArgument<string>;
  name: RawTransactionArgument<Name>;
}
export interface RemoveOptions<Name extends BcsType<any>> {
  package?: string;
  arguments: RemoveArguments<Name> | [object: RawTransactionArgument<string>, name: RawTransactionArgument<Name>];
  typeArguments: [string, string];
}
/**
 * Removes the `object`s dynamic field with the name specified by `name: Name` and
 * returns the bound value. Aborts with `EFieldDoesNotExist` if the object does not
 * have a field with that name. Aborts with `EFieldTypeMismatch` if the field
 * exists, but the value does not have the specified type.
 */
export function remove<Name extends BcsType<any>>(options: RemoveOptions<Name>) {
  const packageAddress = options.package ?? '@local-pkg/suiii';
  const argumentsTypes = [
    '0x0000000000000000000000000000000000000000000000000000000000000002::object::UID',
    `${options.typeArguments[0]}`,
  ] satisfies string[];
  const parameterNames = ['object', 'name'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'dynamic_field',
      function: 'remove',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface Exists_Arguments<Name extends BcsType<any>> {
  object: RawTransactionArgument<string>;
  name: RawTransactionArgument<Name>;
}
export interface Exists_Options<Name extends BcsType<any>> {
  package?: string;
  arguments: Exists_Arguments<Name> | [object: RawTransactionArgument<string>, name: RawTransactionArgument<Name>];
  typeArguments: [string];
}
/**
 * Returns true if and only if the `object` has a dynamic field with the name
 * specified by `name: Name` but without specifying the `Value` type
 */
export function exists_<Name extends BcsType<any>>(options: Exists_Options<Name>) {
  const packageAddress = options.package ?? '@local-pkg/suiii';
  const argumentsTypes = [
    '0x0000000000000000000000000000000000000000000000000000000000000002::object::UID',
    `${options.typeArguments[0]}`,
  ] satisfies string[];
  const parameterNames = ['object', 'name'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'dynamic_field',
      function: 'exists_',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface RemoveIfExistsArguments<Name extends BcsType<any>> {
  object: RawTransactionArgument<string>;
  name: RawTransactionArgument<Name>;
}
export interface RemoveIfExistsOptions<Name extends BcsType<any>> {
  package?: string;
  arguments:
    | RemoveIfExistsArguments<Name>
    | [object: RawTransactionArgument<string>, name: RawTransactionArgument<Name>];
  typeArguments: [string, string];
}
/**
 * Removes the dynamic field if it exists. Returns the `some(Value)` if it exists
 * or none otherwise.
 */
export function removeIfExists<Name extends BcsType<any>>(options: RemoveIfExistsOptions<Name>) {
  const packageAddress = options.package ?? '@local-pkg/suiii';
  const argumentsTypes = [
    '0x0000000000000000000000000000000000000000000000000000000000000002::object::UID',
    `${options.typeArguments[0]}`,
  ] satisfies string[];
  const parameterNames = ['object', 'name'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'dynamic_field',
      function: 'remove_if_exists',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
export interface ExistsWithTypeArguments<Name extends BcsType<any>> {
  object: RawTransactionArgument<string>;
  name: RawTransactionArgument<Name>;
}
export interface ExistsWithTypeOptions<Name extends BcsType<any>> {
  package?: string;
  arguments:
    | ExistsWithTypeArguments<Name>
    | [object: RawTransactionArgument<string>, name: RawTransactionArgument<Name>];
  typeArguments: [string, string];
}
/**
 * Returns true if and only if the `object` has a dynamic field with the name
 * specified by `name: Name` with an assigned value of type `Value`.
 */
export function existsWithType<Name extends BcsType<any>>(options: ExistsWithTypeOptions<Name>) {
  const packageAddress = options.package ?? '@local-pkg/suiii';
  const argumentsTypes = [
    '0x0000000000000000000000000000000000000000000000000000000000000002::object::UID',
    `${options.typeArguments[0]}`,
  ] satisfies string[];
  const parameterNames = ['object', 'name'];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'dynamic_field',
      function: 'exists_with_type',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
      typeArguments: options.typeArguments,
    });
}
