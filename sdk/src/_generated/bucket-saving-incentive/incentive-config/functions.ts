import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function packageVersion( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::package_version`, arguments: [ ], }) }

export function errInvalidPackageVersion( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::err_invalid_package_version`, arguments: [ ], }) }

export function errSenderIsNotManager( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::err_sender_is_not_manager`, arguments: [ ], }) }

export function init( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::init`, arguments: [ ], }) }

export interface AddVersionArgs { cap: TransactionObjectInput; config: TransactionObjectInput; version: number | TransactionArgument }

export function addVersion( tx: Transaction, args: AddVersionArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::add_version`, arguments: [ obj(tx, args.cap), obj(tx, args.config), pure(tx, args.version, `u16`) ], }) }

export interface RemoveVersionArgs { cap: TransactionObjectInput; config: TransactionObjectInput; version: number | TransactionArgument }

export function removeVersion( tx: Transaction, args: RemoveVersionArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::remove_version`, arguments: [ obj(tx, args.cap), obj(tx, args.config), pure(tx, args.version, `u16`) ], }) }

export interface AddManagerArgs { cap: TransactionObjectInput; config: TransactionObjectInput; manager: string | TransactionArgument }

export function addManager( tx: Transaction, args: AddManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::add_manager`, arguments: [ obj(tx, args.cap), obj(tx, args.config), pure(tx, args.manager, `address`) ], }) }

export interface RemoveManagerArgs { cap: TransactionObjectInput; config: TransactionObjectInput; manager: string | TransactionArgument }

export function removeManager( tx: Transaction, args: RemoveManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::remove_manager`, arguments: [ obj(tx, args.cap), obj(tx, args.config), pure(tx, args.manager, `address`) ], }) }

export function assertValidPackageVersion( tx: Transaction, config: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::assert_valid_package_version`, arguments: [ obj(tx, config) ], }) }

export interface AssertSenderIsManagerArgs { config: TransactionObjectInput; request: TransactionObjectInput }

export function assertSenderIsManager( tx: Transaction, args: AssertSenderIsManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::incentive_config::assert_sender_is_manager`, arguments: [ obj(tx, args.config), obj(tx, args.request) ], }) }
