import * as reified from "../../_framework/reified";
import {TypeName} from "../../_dependencies/source/0x1/type-name/structs";
import {Balance} from "../../_dependencies/source/0x2/balance/structs";
import {ID, UID} from "../../_dependencies/source/0x2/object/structs";
import {Table} from "../../_dependencies/source/0x2/table/structs";
import {VecMap} from "../../_dependencies/source/0x2/vec-map/structs";
import {VecSet} from "../../_dependencies/source/0x2/vec-set/structs";
import {Double} from "../../_dependencies/source/0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/double/structs";
import {DepositResponse, WithdrawResponse} from "../../_dependencies/source/0xf59c363a3af10f51e69c612c5fa01f6500701254043f057e132cdbd27b67d14f/saving/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom, ToTypeStr as ToPhantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== SavingPoolIncentives =============================== */

export function isSavingPoolIncentives(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::saving_incentive::SavingPoolIncentives`; }

export interface SavingPoolIncentivesFields { dummyField: ToField<"bool"> }

export type SavingPoolIncentivesReified = Reified< SavingPoolIncentives, SavingPoolIncentivesFields >;

export class SavingPoolIncentives implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive::SavingPoolIncentives`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = SavingPoolIncentives.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive::SavingPoolIncentives`; readonly $typeArgs: []; readonly $isPhantom = SavingPoolIncentives.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: SavingPoolIncentivesFields, ) { this.$fullTypeName = composeSuiType( SavingPoolIncentives.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive::SavingPoolIncentives`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): SavingPoolIncentivesReified { const reifiedBcs = SavingPoolIncentives.bcs; return { typeName: SavingPoolIncentives.$typeName, fullTypeName: composeSuiType( SavingPoolIncentives.$typeName, ...[] ) as `${typeof PKG_V1}::saving_incentive::SavingPoolIncentives`, typeArgs: [ ] as [], isPhantom: SavingPoolIncentives.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => SavingPoolIncentives.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => SavingPoolIncentives.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => SavingPoolIncentives.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => SavingPoolIncentives.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => SavingPoolIncentives.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => SavingPoolIncentives.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => SavingPoolIncentives.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => SavingPoolIncentives.fetch( client, id, ), new: ( fields: SavingPoolIncentivesFields, ) => { return new SavingPoolIncentives( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return SavingPoolIncentives.reified() }

 static phantom( ): PhantomReified<ToTypeStr<SavingPoolIncentives>> { return phantom(SavingPoolIncentives.reified( )); } static get p() { return SavingPoolIncentives.phantom() }

 private static instantiateBcs() { return bcs.struct("SavingPoolIncentives", {

 dummy_field: bcs.bool()

}) };

 private static cachedBcs: ReturnType<typeof SavingPoolIncentives.instantiateBcs> | null = null;

 static get bcs() { if (!SavingPoolIncentives.cachedBcs) { SavingPoolIncentives.cachedBcs = SavingPoolIncentives.instantiateBcs() } return SavingPoolIncentives.cachedBcs };

 static fromFields( fields: Record<string, any> ): SavingPoolIncentives { return SavingPoolIncentives.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): SavingPoolIncentives { if (!isSavingPoolIncentives(item.type)) { throw new Error("not a SavingPoolIncentives type");

 }

 return SavingPoolIncentives.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): SavingPoolIncentives { return SavingPoolIncentives.fromFields( SavingPoolIncentives.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): SavingPoolIncentives { return SavingPoolIncentives.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): SavingPoolIncentives { if (json.$typeName !== SavingPoolIncentives.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return SavingPoolIncentives.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): SavingPoolIncentives { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isSavingPoolIncentives(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a SavingPoolIncentives object`); } return SavingPoolIncentives.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): SavingPoolIncentives { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isSavingPoolIncentives(data.bcs.type)) { throw new Error(`object at is not a SavingPoolIncentives object`); }

 return SavingPoolIncentives.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return SavingPoolIncentives.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<SavingPoolIncentives> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching SavingPoolIncentives object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isSavingPoolIncentives(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a SavingPoolIncentives object`); }

 return SavingPoolIncentives.fromSuiObjectData( res.data ); }

 }

/* ============================== Registry =============================== */

export function isRegistry(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::saving_incentive::Registry`; }

export interface RegistryFields { id: ToField<UID>; rewardManagerIds: ToField<VecMap<TypeName, ID>> }

export type RegistryReified = Reified< Registry, RegistryFields >;

export class Registry implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive::Registry`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Registry.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive::Registry`; readonly $typeArgs: []; readonly $isPhantom = Registry.$isPhantom;

 readonly id: ToField<UID>; readonly rewardManagerIds: ToField<VecMap<TypeName, ID>>

 private constructor(typeArgs: [], fields: RegistryFields, ) { this.$fullTypeName = composeSuiType( Registry.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive::Registry`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.rewardManagerIds = fields.rewardManagerIds; }

 static reified( ): RegistryReified { const reifiedBcs = Registry.bcs; return { typeName: Registry.$typeName, fullTypeName: composeSuiType( Registry.$typeName, ...[] ) as `${typeof PKG_V1}::saving_incentive::Registry`, typeArgs: [ ] as [], isPhantom: Registry.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Registry.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Registry.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Registry.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Registry.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Registry.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Registry.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Registry.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Registry.fetch( client, id, ), new: ( fields: RegistryFields, ) => { return new Registry( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Registry.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Registry>> { return phantom(Registry.reified( )); } static get p() { return Registry.phantom() }

 private static instantiateBcs() { return bcs.struct("Registry", {

 id: UID.bcs, reward_manager_ids: VecMap.bcs(TypeName.bcs, ID.bcs)

}) };

 private static cachedBcs: ReturnType<typeof Registry.instantiateBcs> | null = null;

 static get bcs() { if (!Registry.cachedBcs) { Registry.cachedBcs = Registry.instantiateBcs() } return Registry.cachedBcs };

 static fromFields( fields: Record<string, any> ): Registry { return Registry.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), rewardManagerIds: decodeFromFields(VecMap.reified(TypeName.reified(), ID.reified()), fields.reward_manager_ids) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Registry { if (!isRegistry(item.type)) { throw new Error("not a Registry type");

 }

 return Registry.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), rewardManagerIds: decodeFromFieldsWithTypes(VecMap.reified(TypeName.reified(), ID.reified()), item.fields.reward_manager_ids) } ) }

 static fromBcs( data: Uint8Array ): Registry { return Registry.fromFields( Registry.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,rewardManagerIds: this.rewardManagerIds.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Registry { return Registry.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), rewardManagerIds: decodeFromJSONField(VecMap.reified(TypeName.reified(), ID.reified()), field.rewardManagerIds) } ) }

 static fromJSON( json: Record<string, any> ): Registry { if (json.$typeName !== Registry.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Registry.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Registry { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRegistry(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Registry object`); } return Registry.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Registry { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRegistry(data.bcs.type)) { throw new Error(`object at is not a Registry object`); }

 return Registry.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Registry.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Registry> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Registry object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRegistry(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Registry object`); }

 return Registry.fromSuiObjectData( res.data ); }

 }

/* ============================== RewardManager =============================== */

export function isRewardManager(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive::RewardManager` + '<'); }

export interface RewardManagerFields<T extends PhantomTypeArgument> { id: ToField<UID>; rewarderIds: ToField<VecSet<ID>> }

export type RewardManagerReified<T extends PhantomTypeArgument> = Reified< RewardManager<T>, RewardManagerFields<T> >;

export class RewardManager<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive::RewardManager`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = RewardManager.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive::RewardManager<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = RewardManager.$isPhantom;

 readonly id: ToField<UID>; readonly rewarderIds: ToField<VecSet<ID>>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: RewardManagerFields<T>, ) { this.$fullTypeName = composeSuiType( RewardManager.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive::RewardManager<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.rewarderIds = fields.rewarderIds; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): RewardManagerReified<ToPhantomTypeArgument<T>> { const reifiedBcs = RewardManager.bcs; return { typeName: RewardManager.$typeName, fullTypeName: composeSuiType( RewardManager.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::saving_incentive::RewardManager<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: RewardManager.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => RewardManager.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => RewardManager.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => RewardManager.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => RewardManager.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => RewardManager.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => RewardManager.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => RewardManager.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => RewardManager.fetch( client, T, id, ), new: ( fields: RewardManagerFields<ToPhantomTypeArgument<T>>, ) => { return new RewardManager( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return RewardManager.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<RewardManager<ToPhantomTypeArgument<T>>>> { return phantom(RewardManager.reified( T )); } static get p() { return RewardManager.phantom }

 private static instantiateBcs() { return bcs.struct("RewardManager", {

 id: UID.bcs, rewarder_ids: VecSet.bcs(ID.bcs)

}) };

 private static cachedBcs: ReturnType<typeof RewardManager.instantiateBcs> | null = null;

 static get bcs() { if (!RewardManager.cachedBcs) { RewardManager.cachedBcs = RewardManager.instantiateBcs() } return RewardManager.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): RewardManager<ToPhantomTypeArgument<T>> { return RewardManager.reified( typeArg, ).new( { id: decodeFromFields(UID.reified(), fields.id), rewarderIds: decodeFromFields(VecSet.reified(ID.reified()), fields.rewarder_ids) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): RewardManager<ToPhantomTypeArgument<T>> { if (!isRewardManager(item.type)) { throw new Error("not a RewardManager type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return RewardManager.reified( typeArg, ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), rewarderIds: decodeFromFieldsWithTypes(VecSet.reified(ID.reified()), item.fields.rewarder_ids) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): RewardManager<ToPhantomTypeArgument<T>> { return RewardManager.fromFields( typeArg, RewardManager.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,rewarderIds: this.rewarderIds.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): RewardManager<ToPhantomTypeArgument<T>> { return RewardManager.reified( typeArg, ).new( { id: decodeFromJSONField(UID.reified(), field.id), rewarderIds: decodeFromJSONField(VecSet.reified(ID.reified()), field.rewarderIds) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): RewardManager<ToPhantomTypeArgument<T>> { if (json.$typeName !== RewardManager.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(RewardManager.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return RewardManager.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): RewardManager<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRewardManager(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a RewardManager object`); } return RewardManager.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): RewardManager<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRewardManager(data.bcs.type)) { throw new Error(`object at is not a RewardManager object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return RewardManager.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return RewardManager.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<RewardManager<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching RewardManager object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRewardManager(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a RewardManager object`); }

 return RewardManager.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== StakeData =============================== */

export function isStakeData(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive::StakeData` + '<'); }

export interface StakeDataFields<R extends PhantomTypeArgument> { unit: ToField<Double>; reward: ToField<Balance<R>> }

export type StakeDataReified<R extends PhantomTypeArgument> = Reified< StakeData<R>, StakeDataFields<R> >;

export class StakeData<R extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive::StakeData`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = StakeData.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive::StakeData<${PhantomToTypeStr<R>}>`; readonly $typeArgs: [PhantomToTypeStr<R>]; readonly $isPhantom = StakeData.$isPhantom;

 readonly unit: ToField<Double>; readonly reward: ToField<Balance<R>>

 private constructor(typeArgs: [PhantomToTypeStr<R>], fields: StakeDataFields<R>, ) { this.$fullTypeName = composeSuiType( StakeData.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive::StakeData<${PhantomToTypeStr<R>}>`; this.$typeArgs = typeArgs;

 this.unit = fields.unit;; this.reward = fields.reward; }

 static reified<R extends PhantomReified<PhantomTypeArgument>>( R: R ): StakeDataReified<ToPhantomTypeArgument<R>> { const reifiedBcs = StakeData.bcs; return { typeName: StakeData.$typeName, fullTypeName: composeSuiType( StakeData.$typeName, ...[extractType(R)] ) as `${typeof PKG_V1}::saving_incentive::StakeData<${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`, typeArgs: [ extractType(R) ] as [PhantomToTypeStr<ToPhantomTypeArgument<R>>], isPhantom: StakeData.$isPhantom, reifiedTypeArgs: [R], fromFields: (fields: Record<string, any>) => StakeData.fromFields( R, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => StakeData.fromFieldsWithTypes( R, item, ), fromBcs: (data: Uint8Array) => StakeData.fromFields( R, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => StakeData.fromJSONField( R, field, ), fromJSON: (json: Record<string, any>) => StakeData.fromJSON( R, json, ), fromSuiParsedData: (content: SuiParsedData) => StakeData.fromSuiParsedData( R, content, ), fromSuiObjectData: (content: SuiObjectData) => StakeData.fromSuiObjectData( R, content, ), fetch: async (client: SuiClient, id: string) => StakeData.fetch( client, R, id, ), new: ( fields: StakeDataFields<ToPhantomTypeArgument<R>>, ) => { return new StakeData( [extractType(R)], fields ) }, kind: "StructClassReified", } }

 static get r() { return StakeData.reified }

 static phantom<R extends PhantomReified<PhantomTypeArgument>>( R: R ): PhantomReified<ToTypeStr<StakeData<ToPhantomTypeArgument<R>>>> { return phantom(StakeData.reified( R )); } static get p() { return StakeData.phantom }

 private static instantiateBcs() { return bcs.struct("StakeData", {

 unit: Double.bcs, reward: Balance.bcs

}) };

 private static cachedBcs: ReturnType<typeof StakeData.instantiateBcs> | null = null;

 static get bcs() { if (!StakeData.cachedBcs) { StakeData.cachedBcs = StakeData.instantiateBcs() } return StakeData.cachedBcs };

 static fromFields<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, fields: Record<string, any> ): StakeData<ToPhantomTypeArgument<R>> { return StakeData.reified( typeArg, ).new( { unit: decodeFromFields(Double.reified(), fields.unit), reward: decodeFromFields(Balance.reified(typeArg), fields.reward) } ) }

 static fromFieldsWithTypes<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, item: FieldsWithTypes ): StakeData<ToPhantomTypeArgument<R>> { if (!isStakeData(item.type)) { throw new Error("not a StakeData type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return StakeData.reified( typeArg, ).new( { unit: decodeFromFieldsWithTypes(Double.reified(), item.fields.unit), reward: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.reward) } ) }

 static fromBcs<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, data: Uint8Array ): StakeData<ToPhantomTypeArgument<R>> { return StakeData.fromFields( typeArg, StakeData.bcs.parse(data) ) }

 toJSONField() { return {

 unit: this.unit.toJSONField(),reward: this.reward.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, field: any ): StakeData<ToPhantomTypeArgument<R>> { return StakeData.reified( typeArg, ).new( { unit: decodeFromJSONField(Double.reified(), field.unit), reward: decodeFromJSONField(Balance.reified(typeArg), field.reward) } ) }

 static fromJSON<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, json: Record<string, any> ): StakeData<ToPhantomTypeArgument<R>> { if (json.$typeName !== StakeData.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(StakeData.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return StakeData.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, content: SuiParsedData ): StakeData<ToPhantomTypeArgument<R>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isStakeData(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a StakeData object`); } return StakeData.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, data: SuiObjectData ): StakeData<ToPhantomTypeArgument<R>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isStakeData(data.bcs.type)) { throw new Error(`object at is not a StakeData object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return StakeData.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return StakeData.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<R extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: R, id: string ): Promise<StakeData<ToPhantomTypeArgument<R>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching StakeData object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isStakeData(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a StakeData object`); }

 return StakeData.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== RewarderKey =============================== */

export function isRewarderKey(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive::RewarderKey` + '<'); }

export interface RewarderKeyFields<R extends PhantomTypeArgument> { dummyField: ToField<"bool"> }

export type RewarderKeyReified<R extends PhantomTypeArgument> = Reified< RewarderKey<R>, RewarderKeyFields<R> >;

export class RewarderKey<R extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive::RewarderKey`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = RewarderKey.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive::RewarderKey<${PhantomToTypeStr<R>}>`; readonly $typeArgs: [PhantomToTypeStr<R>]; readonly $isPhantom = RewarderKey.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [PhantomToTypeStr<R>], fields: RewarderKeyFields<R>, ) { this.$fullTypeName = composeSuiType( RewarderKey.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive::RewarderKey<${PhantomToTypeStr<R>}>`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified<R extends PhantomReified<PhantomTypeArgument>>( R: R ): RewarderKeyReified<ToPhantomTypeArgument<R>> { const reifiedBcs = RewarderKey.bcs; return { typeName: RewarderKey.$typeName, fullTypeName: composeSuiType( RewarderKey.$typeName, ...[extractType(R)] ) as `${typeof PKG_V1}::saving_incentive::RewarderKey<${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`, typeArgs: [ extractType(R) ] as [PhantomToTypeStr<ToPhantomTypeArgument<R>>], isPhantom: RewarderKey.$isPhantom, reifiedTypeArgs: [R], fromFields: (fields: Record<string, any>) => RewarderKey.fromFields( R, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => RewarderKey.fromFieldsWithTypes( R, item, ), fromBcs: (data: Uint8Array) => RewarderKey.fromFields( R, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => RewarderKey.fromJSONField( R, field, ), fromJSON: (json: Record<string, any>) => RewarderKey.fromJSON( R, json, ), fromSuiParsedData: (content: SuiParsedData) => RewarderKey.fromSuiParsedData( R, content, ), fromSuiObjectData: (content: SuiObjectData) => RewarderKey.fromSuiObjectData( R, content, ), fetch: async (client: SuiClient, id: string) => RewarderKey.fetch( client, R, id, ), new: ( fields: RewarderKeyFields<ToPhantomTypeArgument<R>>, ) => { return new RewarderKey( [extractType(R)], fields ) }, kind: "StructClassReified", } }

 static get r() { return RewarderKey.reified }

 static phantom<R extends PhantomReified<PhantomTypeArgument>>( R: R ): PhantomReified<ToTypeStr<RewarderKey<ToPhantomTypeArgument<R>>>> { return phantom(RewarderKey.reified( R )); } static get p() { return RewarderKey.phantom }

 private static instantiateBcs() { return bcs.struct("RewarderKey", {

 dummy_field: bcs.bool()

}) };

 private static cachedBcs: ReturnType<typeof RewarderKey.instantiateBcs> | null = null;

 static get bcs() { if (!RewarderKey.cachedBcs) { RewarderKey.cachedBcs = RewarderKey.instantiateBcs() } return RewarderKey.cachedBcs };

 static fromFields<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, fields: Record<string, any> ): RewarderKey<ToPhantomTypeArgument<R>> { return RewarderKey.reified( typeArg, ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, item: FieldsWithTypes ): RewarderKey<ToPhantomTypeArgument<R>> { if (!isRewarderKey(item.type)) { throw new Error("not a RewarderKey type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return RewarderKey.reified( typeArg, ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, data: Uint8Array ): RewarderKey<ToPhantomTypeArgument<R>> { return RewarderKey.fromFields( typeArg, RewarderKey.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, field: any ): RewarderKey<ToPhantomTypeArgument<R>> { return RewarderKey.reified( typeArg, ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, json: Record<string, any> ): RewarderKey<ToPhantomTypeArgument<R>> { if (json.$typeName !== RewarderKey.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(RewarderKey.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return RewarderKey.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, content: SuiParsedData ): RewarderKey<ToPhantomTypeArgument<R>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRewarderKey(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a RewarderKey object`); } return RewarderKey.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<R extends PhantomReified<PhantomTypeArgument>>( typeArg: R, data: SuiObjectData ): RewarderKey<ToPhantomTypeArgument<R>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRewarderKey(data.bcs.type)) { throw new Error(`object at is not a RewarderKey object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return RewarderKey.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return RewarderKey.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<R extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: R, id: string ): Promise<RewarderKey<ToPhantomTypeArgument<R>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching RewarderKey object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRewarderKey(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a RewarderKey object`); }

 return RewarderKey.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== Rewarder =============================== */

export function isRewarder(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive::Rewarder` + '<'); }

export interface RewarderFields<T extends PhantomTypeArgument, R extends PhantomTypeArgument> { id: ToField<UID>; source: ToField<Balance<R>>; pool: ToField<Balance<R>>; flowRate: ToField<Double>; totalStake: ToField<"u64">; stakeTable: ToField<Table<"address", ToPhantom<StakeData<R>>>>; unit: ToField<Double>; lastUpdateTimestamp: ToField<"u64"> }

export type RewarderReified<T extends PhantomTypeArgument, R extends PhantomTypeArgument> = Reified< Rewarder<T, R>, RewarderFields<T, R> >;

export class Rewarder<T extends PhantomTypeArgument, R extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive::Rewarder`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = Rewarder.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive::Rewarder<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>]; readonly $isPhantom = Rewarder.$isPhantom;

 readonly id: ToField<UID>; readonly source: ToField<Balance<R>>; readonly pool: ToField<Balance<R>>; readonly flowRate: ToField<Double>; readonly totalStake: ToField<"u64">; readonly stakeTable: ToField<Table<"address", ToPhantom<StakeData<R>>>>; readonly unit: ToField<Double>; readonly lastUpdateTimestamp: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>], fields: RewarderFields<T, R>, ) { this.$fullTypeName = composeSuiType( Rewarder.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive::Rewarder<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.source = fields.source;; this.pool = fields.pool;; this.flowRate = fields.flowRate;; this.totalStake = fields.totalStake;; this.stakeTable = fields.stakeTable;; this.unit = fields.unit;; this.lastUpdateTimestamp = fields.lastUpdateTimestamp; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): RewarderReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { const reifiedBcs = Rewarder.bcs; return { typeName: Rewarder.$typeName, fullTypeName: composeSuiType( Rewarder.$typeName, ...[extractType(T), extractType(R)] ) as `${typeof PKG_V1}::saving_incentive::Rewarder<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`, typeArgs: [ extractType(T), extractType(R) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<R>>], isPhantom: Rewarder.$isPhantom, reifiedTypeArgs: [T, R], fromFields: (fields: Record<string, any>) => Rewarder.fromFields( [T, R], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Rewarder.fromFieldsWithTypes( [T, R], item, ), fromBcs: (data: Uint8Array) => Rewarder.fromFields( [T, R], reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Rewarder.fromJSONField( [T, R], field, ), fromJSON: (json: Record<string, any>) => Rewarder.fromJSON( [T, R], json, ), fromSuiParsedData: (content: SuiParsedData) => Rewarder.fromSuiParsedData( [T, R], content, ), fromSuiObjectData: (content: SuiObjectData) => Rewarder.fromSuiObjectData( [T, R], content, ), fetch: async (client: SuiClient, id: string) => Rewarder.fetch( client, [T, R], id, ), new: ( fields: RewarderFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>, ) => { return new Rewarder( [extractType(T), extractType(R)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Rewarder.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): PhantomReified<ToTypeStr<Rewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>>> { return phantom(Rewarder.reified( T, R )); } static get p() { return Rewarder.phantom }

 private static instantiateBcs() { return bcs.struct("Rewarder", {

 id: UID.bcs, source: Balance.bcs, pool: Balance.bcs, flow_rate: Double.bcs, total_stake: bcs.u64(), stake_table: Table.bcs, unit: Double.bcs, last_update_timestamp: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof Rewarder.instantiateBcs> | null = null;

 static get bcs() { if (!Rewarder.cachedBcs) { Rewarder.cachedBcs = Rewarder.instantiateBcs() } return Rewarder.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], fields: Record<string, any> ): Rewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return Rewarder.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFields(UID.reified(), fields.id), source: decodeFromFields(Balance.reified(typeArgs[1]), fields.source), pool: decodeFromFields(Balance.reified(typeArgs[1]), fields.pool), flowRate: decodeFromFields(Double.reified(), fields.flow_rate), totalStake: decodeFromFields("u64", fields.total_stake), stakeTable: decodeFromFields(Table.reified(reified.phantom("address"), reified.phantom(StakeData.reified(typeArgs[1]))), fields.stake_table), unit: decodeFromFields(Double.reified(), fields.unit), lastUpdateTimestamp: decodeFromFields("u64", fields.last_update_timestamp) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], item: FieldsWithTypes ): Rewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (!isRewarder(item.type)) { throw new Error("not a Rewarder type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Rewarder.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), source: decodeFromFieldsWithTypes(Balance.reified(typeArgs[1]), item.fields.source), pool: decodeFromFieldsWithTypes(Balance.reified(typeArgs[1]), item.fields.pool), flowRate: decodeFromFieldsWithTypes(Double.reified(), item.fields.flow_rate), totalStake: decodeFromFieldsWithTypes("u64", item.fields.total_stake), stakeTable: decodeFromFieldsWithTypes(Table.reified(reified.phantom("address"), reified.phantom(StakeData.reified(typeArgs[1]))), item.fields.stake_table), unit: decodeFromFieldsWithTypes(Double.reified(), item.fields.unit), lastUpdateTimestamp: decodeFromFieldsWithTypes("u64", item.fields.last_update_timestamp) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: Uint8Array ): Rewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return Rewarder.fromFields( typeArgs, Rewarder.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,source: this.source.toJSONField(),pool: this.pool.toJSONField(),flowRate: this.flowRate.toJSONField(),totalStake: this.totalStake.toString(),stakeTable: this.stakeTable.toJSONField(),unit: this.unit.toJSONField(),lastUpdateTimestamp: this.lastUpdateTimestamp.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], field: any ): Rewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return Rewarder.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromJSONField(UID.reified(), field.id), source: decodeFromJSONField(Balance.reified(typeArgs[1]), field.source), pool: decodeFromJSONField(Balance.reified(typeArgs[1]), field.pool), flowRate: decodeFromJSONField(Double.reified(), field.flowRate), totalStake: decodeFromJSONField("u64", field.totalStake), stakeTable: decodeFromJSONField(Table.reified(reified.phantom("address"), reified.phantom(StakeData.reified(typeArgs[1]))), field.stakeTable), unit: decodeFromJSONField(Double.reified(), field.unit), lastUpdateTimestamp: decodeFromJSONField("u64", field.lastUpdateTimestamp) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], json: Record<string, any> ): Rewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (json.$typeName !== Rewarder.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Rewarder.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Rewarder.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], content: SuiParsedData ): Rewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRewarder(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Rewarder object`); } return Rewarder.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: SuiObjectData ): Rewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRewarder(data.bcs.type)) { throw new Error(`object at is not a Rewarder object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Rewarder.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Rewarder.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, R], id: string ): Promise<Rewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Rewarder object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRewarder(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Rewarder object`); }

 return Rewarder.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== DepositResponseChecker =============================== */

export function isDepositResponseChecker(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive::DepositResponseChecker` + '<'); }

export interface DepositResponseCheckerFields<T extends PhantomTypeArgument> { rewarderIds: ToField<VecSet<ID>>; response: ToField<DepositResponse<T>> }

export type DepositResponseCheckerReified<T extends PhantomTypeArgument> = Reified< DepositResponseChecker<T>, DepositResponseCheckerFields<T> >;

export class DepositResponseChecker<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive::DepositResponseChecker`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = DepositResponseChecker.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive::DepositResponseChecker<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = DepositResponseChecker.$isPhantom;

 readonly rewarderIds: ToField<VecSet<ID>>; readonly response: ToField<DepositResponse<T>>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: DepositResponseCheckerFields<T>, ) { this.$fullTypeName = composeSuiType( DepositResponseChecker.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive::DepositResponseChecker<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.rewarderIds = fields.rewarderIds;; this.response = fields.response; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): DepositResponseCheckerReified<ToPhantomTypeArgument<T>> { const reifiedBcs = DepositResponseChecker.bcs; return { typeName: DepositResponseChecker.$typeName, fullTypeName: composeSuiType( DepositResponseChecker.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::saving_incentive::DepositResponseChecker<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: DepositResponseChecker.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => DepositResponseChecker.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DepositResponseChecker.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => DepositResponseChecker.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => DepositResponseChecker.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => DepositResponseChecker.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => DepositResponseChecker.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => DepositResponseChecker.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => DepositResponseChecker.fetch( client, T, id, ), new: ( fields: DepositResponseCheckerFields<ToPhantomTypeArgument<T>>, ) => { return new DepositResponseChecker( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DepositResponseChecker.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<DepositResponseChecker<ToPhantomTypeArgument<T>>>> { return phantom(DepositResponseChecker.reified( T )); } static get p() { return DepositResponseChecker.phantom }

 private static instantiateBcs() { return bcs.struct("DepositResponseChecker", {

 rewarder_ids: VecSet.bcs(ID.bcs), response: DepositResponse.bcs

}) };

 private static cachedBcs: ReturnType<typeof DepositResponseChecker.instantiateBcs> | null = null;

 static get bcs() { if (!DepositResponseChecker.cachedBcs) { DepositResponseChecker.cachedBcs = DepositResponseChecker.instantiateBcs() } return DepositResponseChecker.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): DepositResponseChecker<ToPhantomTypeArgument<T>> { return DepositResponseChecker.reified( typeArg, ).new( { rewarderIds: decodeFromFields(VecSet.reified(ID.reified()), fields.rewarder_ids), response: decodeFromFields(DepositResponse.reified(typeArg), fields.response) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): DepositResponseChecker<ToPhantomTypeArgument<T>> { if (!isDepositResponseChecker(item.type)) { throw new Error("not a DepositResponseChecker type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return DepositResponseChecker.reified( typeArg, ).new( { rewarderIds: decodeFromFieldsWithTypes(VecSet.reified(ID.reified()), item.fields.rewarder_ids), response: decodeFromFieldsWithTypes(DepositResponse.reified(typeArg), item.fields.response) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): DepositResponseChecker<ToPhantomTypeArgument<T>> { return DepositResponseChecker.fromFields( typeArg, DepositResponseChecker.bcs.parse(data) ) }

 toJSONField() { return {

 rewarderIds: this.rewarderIds.toJSONField(),response: this.response.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): DepositResponseChecker<ToPhantomTypeArgument<T>> { return DepositResponseChecker.reified( typeArg, ).new( { rewarderIds: decodeFromJSONField(VecSet.reified(ID.reified()), field.rewarderIds), response: decodeFromJSONField(DepositResponse.reified(typeArg), field.response) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): DepositResponseChecker<ToPhantomTypeArgument<T>> { if (json.$typeName !== DepositResponseChecker.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DepositResponseChecker.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return DepositResponseChecker.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): DepositResponseChecker<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDepositResponseChecker(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DepositResponseChecker object`); } return DepositResponseChecker.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): DepositResponseChecker<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDepositResponseChecker(data.bcs.type)) { throw new Error(`object at is not a DepositResponseChecker object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return DepositResponseChecker.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DepositResponseChecker.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<DepositResponseChecker<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DepositResponseChecker object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDepositResponseChecker(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DepositResponseChecker object`); }

 return DepositResponseChecker.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== WithdrawResponseChecker =============================== */

export function isWithdrawResponseChecker(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive::WithdrawResponseChecker` + '<'); }

export interface WithdrawResponseCheckerFields<T extends PhantomTypeArgument> { rewarderIds: ToField<VecSet<ID>>; response: ToField<WithdrawResponse<T>> }

export type WithdrawResponseCheckerReified<T extends PhantomTypeArgument> = Reified< WithdrawResponseChecker<T>, WithdrawResponseCheckerFields<T> >;

export class WithdrawResponseChecker<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive::WithdrawResponseChecker`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = WithdrawResponseChecker.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive::WithdrawResponseChecker<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = WithdrawResponseChecker.$isPhantom;

 readonly rewarderIds: ToField<VecSet<ID>>; readonly response: ToField<WithdrawResponse<T>>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: WithdrawResponseCheckerFields<T>, ) { this.$fullTypeName = composeSuiType( WithdrawResponseChecker.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive::WithdrawResponseChecker<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.rewarderIds = fields.rewarderIds;; this.response = fields.response; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): WithdrawResponseCheckerReified<ToPhantomTypeArgument<T>> { const reifiedBcs = WithdrawResponseChecker.bcs; return { typeName: WithdrawResponseChecker.$typeName, fullTypeName: composeSuiType( WithdrawResponseChecker.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::saving_incentive::WithdrawResponseChecker<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: WithdrawResponseChecker.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => WithdrawResponseChecker.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => WithdrawResponseChecker.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => WithdrawResponseChecker.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => WithdrawResponseChecker.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => WithdrawResponseChecker.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => WithdrawResponseChecker.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => WithdrawResponseChecker.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => WithdrawResponseChecker.fetch( client, T, id, ), new: ( fields: WithdrawResponseCheckerFields<ToPhantomTypeArgument<T>>, ) => { return new WithdrawResponseChecker( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return WithdrawResponseChecker.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<WithdrawResponseChecker<ToPhantomTypeArgument<T>>>> { return phantom(WithdrawResponseChecker.reified( T )); } static get p() { return WithdrawResponseChecker.phantom }

 private static instantiateBcs() { return bcs.struct("WithdrawResponseChecker", {

 rewarder_ids: VecSet.bcs(ID.bcs), response: WithdrawResponse.bcs

}) };

 private static cachedBcs: ReturnType<typeof WithdrawResponseChecker.instantiateBcs> | null = null;

 static get bcs() { if (!WithdrawResponseChecker.cachedBcs) { WithdrawResponseChecker.cachedBcs = WithdrawResponseChecker.instantiateBcs() } return WithdrawResponseChecker.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): WithdrawResponseChecker<ToPhantomTypeArgument<T>> { return WithdrawResponseChecker.reified( typeArg, ).new( { rewarderIds: decodeFromFields(VecSet.reified(ID.reified()), fields.rewarder_ids), response: decodeFromFields(WithdrawResponse.reified(typeArg), fields.response) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): WithdrawResponseChecker<ToPhantomTypeArgument<T>> { if (!isWithdrawResponseChecker(item.type)) { throw new Error("not a WithdrawResponseChecker type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return WithdrawResponseChecker.reified( typeArg, ).new( { rewarderIds: decodeFromFieldsWithTypes(VecSet.reified(ID.reified()), item.fields.rewarder_ids), response: decodeFromFieldsWithTypes(WithdrawResponse.reified(typeArg), item.fields.response) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): WithdrawResponseChecker<ToPhantomTypeArgument<T>> { return WithdrawResponseChecker.fromFields( typeArg, WithdrawResponseChecker.bcs.parse(data) ) }

 toJSONField() { return {

 rewarderIds: this.rewarderIds.toJSONField(),response: this.response.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): WithdrawResponseChecker<ToPhantomTypeArgument<T>> { return WithdrawResponseChecker.reified( typeArg, ).new( { rewarderIds: decodeFromJSONField(VecSet.reified(ID.reified()), field.rewarderIds), response: decodeFromJSONField(WithdrawResponse.reified(typeArg), field.response) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): WithdrawResponseChecker<ToPhantomTypeArgument<T>> { if (json.$typeName !== WithdrawResponseChecker.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(WithdrawResponseChecker.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return WithdrawResponseChecker.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): WithdrawResponseChecker<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isWithdrawResponseChecker(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a WithdrawResponseChecker object`); } return WithdrawResponseChecker.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): WithdrawResponseChecker<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isWithdrawResponseChecker(data.bcs.type)) { throw new Error(`object at is not a WithdrawResponseChecker object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return WithdrawResponseChecker.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return WithdrawResponseChecker.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<WithdrawResponseChecker<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching WithdrawResponseChecker object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isWithdrawResponseChecker(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a WithdrawResponseChecker object`); }

 return WithdrawResponseChecker.fromSuiObjectData( typeArg, res.data ); }

 }
