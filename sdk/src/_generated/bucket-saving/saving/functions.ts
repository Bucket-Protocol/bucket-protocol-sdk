import {PUBLISHED_AT} from "..";
import {Option} from "../../_dependencies/source/0x1/option/structs";
import {GenericArg, generic, obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function errMissingDepositResponseWitness( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::err_missing_deposit_response_witness`, arguments: [ ], }) }

export function errMissingWithdrawResponseWitness( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::err_missing_withdraw_response_witness`, arguments: [ ], }) }

export function errWitnessAlreadyExists( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::err_witness_already_exists`, arguments: [ ], }) }

export function errInsufficientDeposit( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::err_insufficient_deposit`, arguments: [ ], }) }

export function errAccountNotFound( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::err_account_not_found`, arguments: [ ], }) }

export function errExceedDepositCap( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::err_exceed_deposit_cap`, arguments: [ ], }) }

export function errLockedAccount( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::err_locked_account`, arguments: [ ], }) }

export function msInYear( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::ms_in_year`, arguments: [ ], }) }

export function lpSupply( tx: Transaction, typeArg: string, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::lp_supply`, typeArguments: [typeArg], arguments: [ obj(tx, self) ], }) }

export function usdbReserve( tx: Transaction, typeArg: string, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::usdb_reserve`, typeArguments: [typeArg], arguments: [ obj(tx, self) ], }) }

export function depositCapAmount( tx: Transaction, typeArg: string, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::deposit_cap_amount`, typeArguments: [typeArg], arguments: [ obj(tx, self) ], }) }

export interface LpBalanceOfArgs { self: TransactionObjectInput; accountAddress: string | TransactionArgument }

export function lpBalanceOf( tx: Transaction, typeArg: string, args: LpBalanceOfArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::lp_balance_of`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), pure(tx, args.accountAddress, `address`) ], }) }

export interface LastUpdateArgs { self: TransactionObjectInput; accountAddress: string | TransactionArgument }

export function lastUpdate( tx: Transaction, typeArg: string, args: LastUpdateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::last_update`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), pure(tx, args.accountAddress, `address`) ], }) }

export function savingRate( tx: Transaction, typeArg: string, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::saving_rate`, typeArguments: [typeArg], arguments: [ obj(tx, self) ], }) }

export function lastEmitted( tx: Transaction, typeArg: string, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::last_emitted`, typeArguments: [typeArg], arguments: [ obj(tx, self) ], }) }

export function depositResponseChecklist( tx: Transaction, typeArg: string, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::deposit_response_checklist`, typeArguments: [typeArg], arguments: [ obj(tx, self) ], }) }

export function withdrawResponseChecklist( tx: Transaction, typeArg: string, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::withdraw_response_checklist`, typeArguments: [typeArg], arguments: [ obj(tx, self) ], }) }

export function positionLocker( tx: Transaction, typeArg: string, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::position_locker`, typeArguments: [typeArg], arguments: [ obj(tx, self) ], }) }

export function depositResponseAccount( tx: Transaction, typeArg: string, depositRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::deposit_response_account`, typeArguments: [typeArg], arguments: [ obj(tx, depositRes) ], }) }

export function depositResponseDepositedUsdbAmount( tx: Transaction, typeArg: string, depositRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::deposit_response_deposited_usdb_amount`, typeArguments: [typeArg], arguments: [ obj(tx, depositRes) ], }) }

export function depositResponseMintedLpAmount( tx: Transaction, typeArg: string, depositRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::deposit_response_minted_lp_amount`, typeArguments: [typeArg], arguments: [ obj(tx, depositRes) ], }) }

export function depositResponsePrevLpBalance( tx: Transaction, typeArg: string, depositRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::deposit_response_prev_lp_balance`, typeArguments: [typeArg], arguments: [ obj(tx, depositRes) ], }) }

export function depositResponsePrevLastUpdateTimestamp( tx: Transaction, typeArg: string, depositRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::deposit_response_prev_last_update_timestamp`, typeArguments: [typeArg], arguments: [ obj(tx, depositRes) ], }) }

export function withdrawResponseAccount( tx: Transaction, typeArg: string, withdrawRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::withdraw_response_account`, typeArguments: [typeArg], arguments: [ obj(tx, withdrawRes) ], }) }

export function withdrawResponseBurnedLpAmount( tx: Transaction, typeArg: string, withdrawRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::withdraw_response_burned_lp_amount`, typeArguments: [typeArg], arguments: [ obj(tx, withdrawRes) ], }) }

export function withdrawResponseWithdrawalUsdbAmount( tx: Transaction, typeArg: string, withdrawRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::withdraw_response_withdrawal_usdb_amount`, typeArguments: [typeArg], arguments: [ obj(tx, withdrawRes) ], }) }

export function withdrawResponsePrevLpBalance( tx: Transaction, typeArg: string, withdrawRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::withdraw_response_prev_lp_balance`, typeArguments: [typeArg], arguments: [ obj(tx, withdrawRes) ], }) }

export function withdrawResponsePrevLastUpdateTimestamp( tx: Transaction, typeArg: string, withdrawRes: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::withdraw_response_prev_last_update_timestamp`, typeArguments: [typeArg], arguments: [ obj(tx, withdrawRes) ], }) }

export interface PendingInterestArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function pendingInterest( tx: Transaction, typeArg: string, args: PendingInterestArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::pending_interest`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export interface TotalReserveArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function totalReserve( tx: Transaction, typeArg: string, args: TotalReserveArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::total_reserve`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export interface LpTokenRatioArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function lpTokenRatio( tx: Transaction, typeArg: string, args: LpTokenRatioArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::lp_token_ratio`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export interface LpTokenValueArgs { self: TransactionObjectInput; shares: bigint | TransactionArgument; clock: TransactionObjectInput }

export function lpTokenValue( tx: Transaction, typeArg: string, args: LpTokenValueArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::lp_token_value`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), pure(tx, args.shares, `u64`), obj(tx, args.clock) ], }) }

export interface LpTokenValueOfArgs { self: TransactionObjectInput; accountAddress: string | TransactionArgument; clock: TransactionObjectInput }

export function lpTokenValueOf( tx: Transaction, typeArg: string, args: LpTokenValueOfArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::lp_token_value_of`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), pure(tx, args.accountAddress, `address`), obj(tx, args.clock) ], }) }

export interface CalculateLpMintAmountArgs { self: TransactionObjectInput; value: bigint | TransactionArgument; clock: TransactionObjectInput }

export function calculateLpMintAmount( tx: Transaction, typeArg: string, args: CalculateLpMintAmountArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::calculate_lp_mint_amount`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), pure(tx, args.value, `u64`), obj(tx, args.clock) ], }) }

export interface PositionExistsArgs { self: TransactionObjectInput; accountAddress: string | TransactionArgument }

export function positionExists( tx: Transaction, typeArg: string, args: PositionExistsArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::position_exists`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), pure(tx, args.accountAddress, `address`) ], }) }

export interface NewArgs { cap: TransactionObjectInput; treasuryCap: TransactionObjectInput }

export function new_( tx: Transaction, typeArg: string, args: NewArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::new`, typeArguments: [typeArg], arguments: [ obj(tx, args.cap), obj(tx, args.treasuryCap) ], }) }

export interface UpdateSavingRateArgs { self: TransactionObjectInput; cap: TransactionObjectInput; treasury: TransactionObjectInput; savingRateBps: bigint | TransactionArgument; clock: TransactionObjectInput }

export function updateSavingRate( tx: Transaction, typeArg: string, args: UpdateSavingRateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::update_saving_rate`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.cap), obj(tx, args.treasury), pure(tx, args.savingRateBps, `u64`), obj(tx, args.clock) ], }) }

export interface UpdateDepositCapArgs { self: TransactionObjectInput; cap: TransactionObjectInput; depositCapAmount: (bigint | TransactionArgument | TransactionArgument | null) }

export function updateDepositCap( tx: Transaction, typeArg: string, args: UpdateDepositCapArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::update_deposit_cap`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.cap), pure(tx, args.depositCapAmount, `${Option.$typeName}<u64>`) ], }) }

export interface AddDepositResponseCheckArgs { self: TransactionObjectInput; cap: TransactionObjectInput }

export function addDepositResponseCheck( tx: Transaction, typeArgs: [string, string], args: AddDepositResponseCheckArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::add_deposit_response_check`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.cap) ], }) }

export interface RemoveDepositResponseCheckArgs { self: TransactionObjectInput; cap: TransactionObjectInput }

export function removeDepositResponseCheck( tx: Transaction, typeArgs: [string, string], args: RemoveDepositResponseCheckArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::remove_deposit_response_check`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.cap) ], }) }

export interface AddWithdrawResponseCheckArgs { self: TransactionObjectInput; cap: TransactionObjectInput }

export function addWithdrawResponseCheck( tx: Transaction, typeArgs: [string, string], args: AddWithdrawResponseCheckArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::add_withdraw_response_check`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.cap) ], }) }

export interface RemoveWithdrawResponseCheckArgs { self: TransactionObjectInput; cap: TransactionObjectInput }

export function removeWithdrawResponseCheck( tx: Transaction, typeArgs: [string, string], args: RemoveWithdrawResponseCheckArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::remove_withdraw_response_check`, typeArguments: typeArgs, arguments: [ obj(tx, args.self), obj(tx, args.cap) ], }) }

export interface CheckDepositResponseArgs { res: TransactionObjectInput; self: TransactionObjectInput; treasury: TransactionObjectInput }

export function checkDepositResponse( tx: Transaction, typeArg: string, args: CheckDepositResponseArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::check_deposit_response`, typeArguments: [typeArg], arguments: [ obj(tx, args.res), obj(tx, args.self), obj(tx, args.treasury) ], }) }

export interface CheckWithdrawResponseArgs { res: TransactionObjectInput; self: TransactionObjectInput; treasury: TransactionObjectInput }

export function checkWithdrawResponse( tx: Transaction, typeArg: string, args: CheckWithdrawResponseArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::check_withdraw_response`, typeArguments: [typeArg], arguments: [ obj(tx, args.res), obj(tx, args.self), obj(tx, args.treasury) ], }) }

export interface AddDepositWitnessArgs { response: TransactionObjectInput; witness: GenericArg }

export function addDepositWitness( tx: Transaction, typeArgs: [string, string], args: AddDepositWitnessArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::add_deposit_witness`, typeArguments: typeArgs, arguments: [ obj(tx, args.response), generic(tx, `${typeArgs[1]}`, args.witness) ], }) }

export interface AddWithdrawWitnessArgs { response: TransactionObjectInput; witness: GenericArg }

export function addWithdrawWitness( tx: Transaction, typeArgs: [string, string], args: AddWithdrawWitnessArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::add_withdraw_witness`, typeArguments: typeArgs, arguments: [ obj(tx, args.response), generic(tx, `${typeArgs[1]}`, args.witness) ], }) }

export interface DepositArgs { self: TransactionObjectInput; treasury: TransactionObjectInput; account: string | TransactionArgument; usdb: TransactionObjectInput; clock: TransactionObjectInput }

export function deposit( tx: Transaction, typeArg: string, args: DepositArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::deposit`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.treasury), pure(tx, args.account, `address`), obj(tx, args.usdb), obj(tx, args.clock) ], }) }

export interface WithdrawArgs { self: TransactionObjectInput; treasury: TransactionObjectInput; accountReq: TransactionObjectInput; burnedLp: bigint | TransactionArgument; clock: TransactionObjectInput }

export function withdraw( tx: Transaction, typeArg: string, args: WithdrawArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::withdraw`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.treasury), obj(tx, args.accountReq), pure(tx, args.burnedLp, `u64`), obj(tx, args.clock) ], }) }

export interface AssertDepositCapArgs { self: TransactionObjectInput; clock: TransactionObjectInput }

export function assertDepositCap( tx: Transaction, typeArg: string, args: AssertDepositCapArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::assert_deposit_cap`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.clock) ], }) }

export interface DistributeInterestArgs { self: TransactionObjectInput; treasury: TransactionObjectInput; clock: TransactionObjectInput }

export function distributeInterest( tx: Transaction, typeArg: string, args: DistributeInterestArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::distribute_interest`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.treasury), obj(tx, args.clock) ], }) }

export interface Deposit_Args { self: TransactionObjectInput; usdb: TransactionObjectInput }

export function deposit_( tx: Transaction, typeArg: string, args: Deposit_Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::deposit_`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.usdb) ], }) }

export interface Withdraw_Args { self: TransactionObjectInput; lpBalance: TransactionObjectInput }

export function withdraw_( tx: Transaction, typeArg: string, args: Withdraw_Args ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving::withdraw_`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.lpBalance) ], }) }
