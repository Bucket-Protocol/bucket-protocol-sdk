import {PUBLISHED_AT} from "..";
import {GenericArg, generic, obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function new_( tx: Transaction, typeArgs: [string, string], e: GenericArg ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::new`, typeArguments: typeArgs, arguments: [ generic(tx, `${typeArgs[0]}`, e) ], }) }

export interface ReceiveArgs { sheet: TransactionObjectInput; loan: TransactionObjectInput; stamp: GenericArg }

export function receive( tx: Transaction, typeArgs: [string, string, string], args: ReceiveArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::receive`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), obj(tx, args.loan), generic(tx, `${typeArgs[1]}`, args.stamp) ], }) }

export interface AddCreditArgs { self: TransactionObjectInput; credit: TransactionObjectInput }

export function addCredit( tx: Transaction, typeArg: string, args: AddCreditArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::add_credit`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.credit) ], }) }

export interface AddCreditorArgs { sheet: TransactionObjectInput; stamp: GenericArg }

export function addCreditor( tx: Transaction, typeArgs: [string, string, string], args: AddCreditorArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::add_creditor`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), generic(tx, `${typeArgs[0]}`, args.stamp) ], }) }

export interface AddDebtArgs { self: TransactionObjectInput; debt: TransactionObjectInput }

export function addDebt( tx: Transaction, typeArg: string, args: AddDebtArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::add_debt`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.debt) ], }) }

export interface AddDebtorArgs { sheet: TransactionObjectInput; stamp: GenericArg }

export function addDebtor( tx: Transaction, typeArgs: [string, string, string], args: AddDebtorArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::add_debtor`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), generic(tx, `${typeArgs[0]}`, args.stamp) ], }) }

export interface CollectArgs { sheet: TransactionObjectInput; collector: TransactionObjectInput; stamp: GenericArg }

export function collect( tx: Transaction, typeArgs: [string, string, string], args: CollectArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::collect`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), obj(tx, args.collector), generic(tx, `${typeArgs[0]}`, args.stamp) ], }) }

export function creditValue( tx: Transaction, typeArg: string, credit: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::credit_value`, typeArguments: [typeArg], arguments: [ obj(tx, credit) ], }) }

export function creditor( tx: Transaction, typeArg: string, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::creditor`, typeArguments: [typeArg], arguments: [ ], }) }

export function credits( tx: Transaction, typeArgs: [string, string], sheet: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::credits`, typeArguments: typeArgs, arguments: [ obj(tx, sheet) ], }) }

export function debtValue( tx: Transaction, typeArg: string, debt: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::debt_value`, typeArguments: [typeArg], arguments: [ obj(tx, debt) ], }) }

export function debtor( tx: Transaction, typeArg: string, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::debtor`, typeArguments: [typeArg], arguments: [ ], }) }

export function debts( tx: Transaction, typeArgs: [string, string], sheet: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::debts`, typeArguments: typeArgs, arguments: [ obj(tx, sheet) ], }) }

export function destroyCredit( tx: Transaction, typeArg: string, credit: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::destroy_credit`, typeArguments: [typeArg], arguments: [ obj(tx, credit) ], }) }

export function destroyDebt( tx: Transaction, typeArg: string, credit: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::destroy_debt`, typeArguments: [typeArg], arguments: [ obj(tx, credit) ], }) }

export interface DunArgs { requirement: bigint | TransactionArgument; stamp: GenericArg }

export function dun( tx: Transaction, typeArgs: [string, string, string], args: DunArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::dun`, typeArguments: typeArgs, arguments: [ pure(tx, args.requirement, `u64`), generic(tx, `${typeArgs[0]}`, args.stamp) ], }) }

export function requirement( tx: Transaction, typeArgs: [string, string, string], collector: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::requirement`, typeArguments: typeArgs, arguments: [ obj(tx, collector) ], }) }

export function errAlreadyRepaid( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::err_already_repaid`, arguments: [ ], }) }

export function errCreditorNotFound( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::err_creditor_not_found`, arguments: [ ], }) }

export function errDebtorNotFound( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::err_debtor_not_found`, arguments: [ ], }) }

export function errDestroyNotEmptySheet( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::err_destroy_not_empty_sheet`, arguments: [ ], }) }

export function errNoRepayment( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::err_no_repayment`, arguments: [ ], }) }

export function errNotEnoughRepayment( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::err_not_enough_repayment`, arguments: [ ], }) }

export function errRepayTooMuch( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::err_repay_too_much`, arguments: [ ], }) }

export interface LoanArgs { sheet: TransactionObjectInput; balance: TransactionObjectInput; stamp: GenericArg }

export function loan( tx: Transaction, typeArgs: [string, string, string], args: LoanArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::loan`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), obj(tx, args.balance), generic(tx, `${typeArgs[0]}`, args.stamp) ], }) }

export function loanBalance( tx: Transaction, typeArgs: [string, string, string], loan: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::loan_balance`, typeArguments: typeArgs, arguments: [ obj(tx, loan) ], }) }

export interface RecordCollectArgs { sheet: TransactionObjectInput; collector: TransactionObjectInput }

export function recordCollect( tx: Transaction, typeArgs: [string, string, string], args: RecordCollectArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::record_collect`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), obj(tx, args.collector) ], }) }

export interface RecordLoanArgs { sheet: TransactionObjectInput; loan: TransactionObjectInput }

export function recordLoan( tx: Transaction, typeArgs: [string, string, string], args: RecordLoanArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::record_loan`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), obj(tx, args.loan) ], }) }

export interface RecordReceiveArgs { sheet: TransactionObjectInput; loan: TransactionObjectInput }

export function recordReceive( tx: Transaction, typeArgs: [string, string, string], args: RecordReceiveArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::record_receive`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), obj(tx, args.loan) ], }) }

export interface RecordRepayArgs { sheet: TransactionObjectInput; collector: TransactionObjectInput }

export function recordRepay( tx: Transaction, typeArgs: [string, string, string], args: RecordRepayArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::record_repay`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), obj(tx, args.collector) ], }) }

export interface RemoveCreditorArgs { sheet: TransactionObjectInput; stamp: GenericArg }

export function removeCreditor( tx: Transaction, typeArgs: [string, string, string], args: RemoveCreditorArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::remove_creditor`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), generic(tx, `${typeArgs[0]}`, args.stamp) ], }) }

export interface RemoveDebtorArgs { sheet: TransactionObjectInput; stamp: GenericArg }

export function removeDebtor( tx: Transaction, typeArgs: [string, string, string], args: RemoveDebtorArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::remove_debtor`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), generic(tx, `${typeArgs[0]}`, args.stamp) ], }) }

export interface RepayArgs { sheet: TransactionObjectInput; collector: TransactionObjectInput; balance: TransactionObjectInput; stamp: GenericArg }

export function repay( tx: Transaction, typeArgs: [string, string, string], args: RepayArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::repay`, typeArguments: typeArgs, arguments: [ obj(tx, args.sheet), obj(tx, args.collector), obj(tx, args.balance), generic(tx, `${typeArgs[1]}`, args.stamp) ], }) }

export function repayment( tx: Transaction, typeArgs: [string, string, string], collector: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::repayment`, typeArguments: typeArgs, arguments: [ obj(tx, collector) ], }) }

export function repaymentBalance( tx: Transaction, typeArgs: [string, string, string], repayment: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::repayment_balance`, typeArguments: typeArgs, arguments: [ obj(tx, repayment) ], }) }

export interface SubCreditArgs { self: TransactionObjectInput; credit: TransactionObjectInput }

export function subCredit( tx: Transaction, typeArg: string, args: SubCreditArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::sub_credit`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.credit) ], }) }

export interface SubDebtArgs { self: TransactionObjectInput; debt: TransactionObjectInput }

export function subDebt( tx: Transaction, typeArg: string, args: SubDebtArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::sheet::sub_debt`, typeArguments: [typeArg], arguments: [ obj(tx, args.self), obj(tx, args.debt) ], }) }
