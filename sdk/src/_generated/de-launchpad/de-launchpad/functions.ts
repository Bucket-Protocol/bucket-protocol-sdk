import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export interface DestroyEmptyArgs { pad: TransactionObjectInput; cap: TransactionObjectInput }

export function destroyEmpty( tx: Transaction, typeArgs: [string, string, string], args: DestroyEmptyArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::destroy_empty`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), obj(tx, args.cap) ], }) }

export interface DefaultArgs { cap: TransactionObjectInput; clock: TransactionObjectInput; maxPublicQuota: bigint | TransactionArgument; whitelistStart: bigint | TransactionArgument; publicStart: bigint | TransactionArgument; publicEnd: bigint | TransactionArgument; fund: TransactionObjectInput; expectedInAmount: bigint | TransactionArgument }

export function default_( tx: Transaction, typeArgs: [string, string, string], args: DefaultArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::default`, typeArguments: typeArgs, arguments: [ obj(tx, args.cap), obj(tx, args.clock), pure(tx, args.maxPublicQuota, `u64`), pure(tx, args.whitelistStart, `u64`), pure(tx, args.publicStart, `u64`), pure(tx, args.publicEnd, `u64`), obj(tx, args.fund), pure(tx, args.expectedInAmount, `u64`) ], }) }

export interface NewArgs { cap: TransactionObjectInput; clock: TransactionObjectInput; price: TransactionObjectInput; maxPublicQuota: bigint | TransactionArgument; stageConfig: TransactionObjectInput; fund: TransactionObjectInput }

export function new_( tx: Transaction, typeArgs: [string, string, string], args: NewArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::new`, typeArguments: typeArgs, arguments: [ obj(tx, args.cap), obj(tx, args.clock), obj(tx, args.price), pure(tx, args.maxPublicQuota, `u64`), obj(tx, args.stageConfig), obj(tx, args.fund) ], }) }

export interface WithdrawArgs { pad: TransactionObjectInput; cap: TransactionObjectInput; clock: TransactionObjectInput }

export function withdraw( tx: Transaction, typeArgs: [string, string, string], args: WithdrawArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::withdraw`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), obj(tx, args.cap), obj(tx, args.clock) ], }) }

export interface PurchaseArgs { pad: TransactionObjectInput; center: TransactionObjectInput; clock: TransactionObjectInput; amount: bigint | TransactionArgument; payment: TransactionObjectInput; req: TransactionObjectInput }

export function purchase( tx: Transaction, typeArgs: [string, string, string], args: PurchaseArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::purchase`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), obj(tx, args.center), obj(tx, args.clock), pure(tx, args.amount, `u64`), obj(tx, args.payment), obj(tx, args.req) ], }) }

export interface AddManagerArgs { pad: TransactionObjectInput; cap: TransactionObjectInput; manager: string | TransactionArgument }

export function addManager( tx: Transaction, typeArgs: [string, string, string], args: AddManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::add_manager`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), obj(tx, args.cap), pure(tx, args.manager, `address`) ], }) }

export interface AllocateArgs { pad: TransactionObjectInput; account: string | TransactionArgument; quota: bigint | TransactionArgument }

export function allocate( tx: Transaction, typeArgs: [string, string, string], args: AllocateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::allocate`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), pure(tx, args.account, `address`), pure(tx, args.quota, `u64`) ], }) }

export function assertSenderIsManager( tx: Transaction, typeArgs: [string, string, string], pad: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::assert_sender_is_manager`, typeArguments: typeArgs, arguments: [ obj(tx, pad) ], }) }

export function errSenderIsNotManager( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_sender_is_not_manager`, arguments: [ ], }) }

export interface IsManagerArgs { pad: TransactionObjectInput; account: string | TransactionArgument }

export function isManager( tx: Transaction, typeArgs: [string, string, string], args: IsManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::is_manager`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), pure(tx, args.account, `address`) ], }) }

export interface RemoveManagerArgs { pad: TransactionObjectInput; cap: TransactionObjectInput; manager: string | TransactionArgument }

export function removeManager( tx: Transaction, typeArgs: [string, string, string], args: RemoveManagerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::remove_manager`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), obj(tx, args.cap), pure(tx, args.manager, `address`) ], }) }

export function quota( tx: Transaction, allocation: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::quota`, arguments: [ obj(tx, allocation) ], }) }

export function allocated( tx: Transaction, allocation: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::allocated`, arguments: [ obj(tx, allocation) ], }) }

export interface DeallocateArgs { pad: TransactionObjectInput; account: string | TransactionArgument; amount: bigint | TransactionArgument }

export function deallocate( tx: Transaction, typeArgs: [string, string, string], args: DeallocateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::deallocate`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), pure(tx, args.account, `address`), pure(tx, args.amount, `u64`) ], }) }

export function maxPublicQuota( tx: Transaction, typeArgs: [string, string, string], pad: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::max_public_quota`, typeArguments: typeArgs, arguments: [ obj(tx, pad) ], }) }

export function errCannotDestroyNonEmpty( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_cannot_destroy_non_empty`, arguments: [ ], }) }

export function errCannotSetPriceAfterStarted( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_cannot_set_price_after_started`, arguments: [ ], }) }

export function errCannotWithdrawPoolWhenSaling( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_cannot_withdraw_pool_when_saling`, arguments: [ ], }) }

export function errInvalidStageConfig( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_invalid_stage_config`, arguments: [ ], }) }

export function errNoAllocation( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_no_allocation`, arguments: [ ], }) }

export function errPaymentNotEnough( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_payment_not_enough`, arguments: [ ], }) }

export function errSalesEnded( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_sales_ended`, arguments: [ ], }) }

export function errSalesNotStarted( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_sales_not_started`, arguments: [ ], }) }

export function errSoldOut( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::err_sold_out`, arguments: [ ], }) }

export function poolIn( tx: Transaction, typeArgs: [string, string, string], pad: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::pool_in`, typeArguments: typeArgs, arguments: [ obj(tx, pad) ], }) }

export function poolOut( tx: Transaction, typeArgs: [string, string, string], pad: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::pool_out`, typeArguments: typeArgs, arguments: [ obj(tx, pad) ], }) }

export interface PublicAllocationOfArgs { pad: TransactionObjectInput; account: string | TransactionArgument }

export function publicAllocationOf( tx: Transaction, typeArgs: [string, string, string], args: PublicAllocationOfArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::public_allocation_of`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), pure(tx, args.account, `address`) ], }) }

export function publicTotalSale( tx: Transaction, typeArgs: [string, string, string], pad: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::public_total_sale`, typeArguments: typeArgs, arguments: [ obj(tx, pad) ], }) }

export function remainingAmount( tx: Transaction, allocation: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::remaining_amount`, arguments: [ obj(tx, allocation) ], }) }

export interface RequiredPaymentAmountArgs { pad: TransactionObjectInput; outAmount: bigint | TransactionArgument }

export function requiredPaymentAmount( tx: Transaction, typeArgs: [string, string, string], args: RequiredPaymentAmountArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::required_payment_amount`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), pure(tx, args.outAmount, `u64`) ], }) }

export interface SetPriceArgs { pad: TransactionObjectInput; clock: TransactionObjectInput; priceN: bigint | TransactionArgument; priceM: bigint | TransactionArgument }

export function setPrice( tx: Transaction, typeArgs: [string, string, string], args: SetPriceArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::set_price`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), obj(tx, args.clock), pure(tx, args.priceN, `u64`), pure(tx, args.priceM, `u64`) ], }) }

export interface UpdateTimeSettingsArgs { pad: TransactionObjectInput; whitelistStart: bigint | TransactionArgument; publicStart: bigint | TransactionArgument; publicEnd: bigint | TransactionArgument }

export function updateTimeSettings( tx: Transaction, typeArgs: [string, string, string], args: UpdateTimeSettingsArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::update_time_settings`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), pure(tx, args.whitelistStart, `u64`), pure(tx, args.publicStart, `u64`), pure(tx, args.publicEnd, `u64`) ], }) }

export interface WhitelistAllocationOfArgs { pad: TransactionObjectInput; account: string | TransactionArgument }

export function whitelistAllocationOf( tx: Transaction, typeArgs: [string, string, string], args: WhitelistAllocationOfArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::whitelist_allocation_of`, typeArguments: typeArgs, arguments: [ obj(tx, args.pad), pure(tx, args.account, `address`) ], }) }

export function whitelistTotalSale( tx: Transaction, typeArgs: [string, string, string], pad: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::de_launchpad::whitelist_total_sale`, typeArguments: typeArgs, arguments: [ obj(tx, pad) ], }) }
