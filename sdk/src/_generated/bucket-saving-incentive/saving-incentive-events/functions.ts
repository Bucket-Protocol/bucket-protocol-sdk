import {PUBLISHED_AT} from "..";
import {String} from "../../_dependencies/source/0x1/ascii/structs";
import {ID} from "../../_dependencies/source/0x2/object/structs";
import {pure} from "../../_framework/util";
import {Transaction, TransactionArgument} from "@mysten/sui/transactions";

export function emitCreateSavingPoolRewardManager( tx: Transaction, typeArg: string, rewardManagerId: string | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive_events::emit_create_saving_pool_reward_manager`, typeArguments: [typeArg], arguments: [ pure(tx, rewardManagerId, `${ID.$typeName}`) ], }) }

export interface EmitAddRewarderArgs { rewardManagerId: string | TransactionArgument; rewarderId: string | TransactionArgument }

export function emitAddRewarder( tx: Transaction, typeArgs: [string, string], args: EmitAddRewarderArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive_events::emit_add_rewarder`, typeArguments: typeArgs, arguments: [ pure(tx, args.rewardManagerId, `${ID.$typeName}`), pure(tx, args.rewarderId, `${ID.$typeName}`) ], }) }

export interface EmitSourceChangedArgs { rewarderId: string | TransactionArgument; kind: string | TransactionArgument; amount: bigint | TransactionArgument; isDeposit: boolean | TransactionArgument }

export function emitSourceChanged( tx: Transaction, typeArgs: [string, string], args: EmitSourceChangedArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive_events::emit_source_changed`, typeArguments: typeArgs, arguments: [ pure(tx, args.rewarderId, `${ID.$typeName}`), pure(tx, args.kind, `${String.$typeName}`), pure(tx, args.amount, `u64`), pure(tx, args.isDeposit, `bool`) ], }) }

export interface EmitFlowRateChangedArgs { kind: string | TransactionArgument; rewarderId: string | TransactionArgument; flowRate: bigint | TransactionArgument }

export function emitFlowRateChanged( tx: Transaction, typeArgs: [string, string], args: EmitFlowRateChangedArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive_events::emit_flow_rate_changed`, typeArguments: typeArgs, arguments: [ pure(tx, args.kind, `${String.$typeName}`), pure(tx, args.rewarderId, `${ID.$typeName}`), pure(tx, args.flowRate, `u256`) ], }) }

export interface EmitRewardTimestampChangedArgs { rewarderId: string | TransactionArgument; kind: string | TransactionArgument; timestamp: bigint | TransactionArgument }

export function emitRewardTimestampChanged( tx: Transaction, typeArgs: [string, string], args: EmitRewardTimestampChangedArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive_events::emit_reward_timestamp_changed`, typeArguments: typeArgs, arguments: [ pure(tx, args.rewarderId, `${ID.$typeName}`), pure(tx, args.kind, `${String.$typeName}`), pure(tx, args.timestamp, `u64`) ], }) }

export interface EmitClaimRewardArgs { kind: string | TransactionArgument; rewarderId: string | TransactionArgument; account: string | TransactionArgument; amount: bigint | TransactionArgument }

export function emitClaimReward( tx: Transaction, typeArgs: [string, string], args: EmitClaimRewardArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::saving_incentive_events::emit_claim_reward`, typeArguments: typeArgs, arguments: [ pure(tx, args.kind, `${String.$typeName}`), pure(tx, args.rewarderId, `${ID.$typeName}`), pure(tx, args.account, `address`), pure(tx, args.amount, `u64`) ], }) }
