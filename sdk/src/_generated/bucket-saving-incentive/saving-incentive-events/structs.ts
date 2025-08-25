import {String} from "../../_dependencies/source/0x1/ascii/structs";
import {ID} from "../../_dependencies/source/0x2/object/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== CreateSavingPoolRewardManager =============================== */

export function isCreateSavingPoolRewardManager(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive_events::CreateSavingPoolRewardManager` + '<'); }

export interface CreateSavingPoolRewardManagerFields<T extends PhantomTypeArgument> { rewardManagerId: ToField<ID> }

export type CreateSavingPoolRewardManagerReified<T extends PhantomTypeArgument> = Reified< CreateSavingPoolRewardManager<T>, CreateSavingPoolRewardManagerFields<T> >;

export class CreateSavingPoolRewardManager<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive_events::CreateSavingPoolRewardManager`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = CreateSavingPoolRewardManager.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive_events::CreateSavingPoolRewardManager<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = CreateSavingPoolRewardManager.$isPhantom;

 readonly rewardManagerId: ToField<ID>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: CreateSavingPoolRewardManagerFields<T>, ) { this.$fullTypeName = composeSuiType( CreateSavingPoolRewardManager.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive_events::CreateSavingPoolRewardManager<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.rewardManagerId = fields.rewardManagerId; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): CreateSavingPoolRewardManagerReified<ToPhantomTypeArgument<T>> { const reifiedBcs = CreateSavingPoolRewardManager.bcs; return { typeName: CreateSavingPoolRewardManager.$typeName, fullTypeName: composeSuiType( CreateSavingPoolRewardManager.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::saving_incentive_events::CreateSavingPoolRewardManager<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: CreateSavingPoolRewardManager.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => CreateSavingPoolRewardManager.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => CreateSavingPoolRewardManager.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => CreateSavingPoolRewardManager.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => CreateSavingPoolRewardManager.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => CreateSavingPoolRewardManager.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => CreateSavingPoolRewardManager.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => CreateSavingPoolRewardManager.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => CreateSavingPoolRewardManager.fetch( client, T, id, ), new: ( fields: CreateSavingPoolRewardManagerFields<ToPhantomTypeArgument<T>>, ) => { return new CreateSavingPoolRewardManager( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return CreateSavingPoolRewardManager.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<CreateSavingPoolRewardManager<ToPhantomTypeArgument<T>>>> { return phantom(CreateSavingPoolRewardManager.reified( T )); } static get p() { return CreateSavingPoolRewardManager.phantom }

 private static instantiateBcs() { return bcs.struct("CreateSavingPoolRewardManager", {

 reward_manager_id: ID.bcs

}) };

 private static cachedBcs: ReturnType<typeof CreateSavingPoolRewardManager.instantiateBcs> | null = null;

 static get bcs() { if (!CreateSavingPoolRewardManager.cachedBcs) { CreateSavingPoolRewardManager.cachedBcs = CreateSavingPoolRewardManager.instantiateBcs() } return CreateSavingPoolRewardManager.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): CreateSavingPoolRewardManager<ToPhantomTypeArgument<T>> { return CreateSavingPoolRewardManager.reified( typeArg, ).new( { rewardManagerId: decodeFromFields(ID.reified(), fields.reward_manager_id) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): CreateSavingPoolRewardManager<ToPhantomTypeArgument<T>> { if (!isCreateSavingPoolRewardManager(item.type)) { throw new Error("not a CreateSavingPoolRewardManager type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return CreateSavingPoolRewardManager.reified( typeArg, ).new( { rewardManagerId: decodeFromFieldsWithTypes(ID.reified(), item.fields.reward_manager_id) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): CreateSavingPoolRewardManager<ToPhantomTypeArgument<T>> { return CreateSavingPoolRewardManager.fromFields( typeArg, CreateSavingPoolRewardManager.bcs.parse(data) ) }

 toJSONField() { return {

 rewardManagerId: this.rewardManagerId,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): CreateSavingPoolRewardManager<ToPhantomTypeArgument<T>> { return CreateSavingPoolRewardManager.reified( typeArg, ).new( { rewardManagerId: decodeFromJSONField(ID.reified(), field.rewardManagerId) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): CreateSavingPoolRewardManager<ToPhantomTypeArgument<T>> { if (json.$typeName !== CreateSavingPoolRewardManager.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(CreateSavingPoolRewardManager.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return CreateSavingPoolRewardManager.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): CreateSavingPoolRewardManager<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCreateSavingPoolRewardManager(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a CreateSavingPoolRewardManager object`); } return CreateSavingPoolRewardManager.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): CreateSavingPoolRewardManager<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isCreateSavingPoolRewardManager(data.bcs.type)) { throw new Error(`object at is not a CreateSavingPoolRewardManager object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return CreateSavingPoolRewardManager.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return CreateSavingPoolRewardManager.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<CreateSavingPoolRewardManager<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching CreateSavingPoolRewardManager object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isCreateSavingPoolRewardManager(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a CreateSavingPoolRewardManager object`); }

 return CreateSavingPoolRewardManager.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== AddRewarder =============================== */

export function isAddRewarder(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive_events::AddRewarder` + '<'); }

export interface AddRewarderFields<T extends PhantomTypeArgument, R extends PhantomTypeArgument> { rewardManagerId: ToField<ID>; rewarderId: ToField<ID> }

export type AddRewarderReified<T extends PhantomTypeArgument, R extends PhantomTypeArgument> = Reified< AddRewarder<T, R>, AddRewarderFields<T, R> >;

export class AddRewarder<T extends PhantomTypeArgument, R extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive_events::AddRewarder`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = AddRewarder.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive_events::AddRewarder<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>]; readonly $isPhantom = AddRewarder.$isPhantom;

 readonly rewardManagerId: ToField<ID>; readonly rewarderId: ToField<ID>

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>], fields: AddRewarderFields<T, R>, ) { this.$fullTypeName = composeSuiType( AddRewarder.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive_events::AddRewarder<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; this.$typeArgs = typeArgs;

 this.rewardManagerId = fields.rewardManagerId;; this.rewarderId = fields.rewarderId; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): AddRewarderReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { const reifiedBcs = AddRewarder.bcs; return { typeName: AddRewarder.$typeName, fullTypeName: composeSuiType( AddRewarder.$typeName, ...[extractType(T), extractType(R)] ) as `${typeof PKG_V1}::saving_incentive_events::AddRewarder<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`, typeArgs: [ extractType(T), extractType(R) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<R>>], isPhantom: AddRewarder.$isPhantom, reifiedTypeArgs: [T, R], fromFields: (fields: Record<string, any>) => AddRewarder.fromFields( [T, R], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => AddRewarder.fromFieldsWithTypes( [T, R], item, ), fromBcs: (data: Uint8Array) => AddRewarder.fromFields( [T, R], reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => AddRewarder.fromJSONField( [T, R], field, ), fromJSON: (json: Record<string, any>) => AddRewarder.fromJSON( [T, R], json, ), fromSuiParsedData: (content: SuiParsedData) => AddRewarder.fromSuiParsedData( [T, R], content, ), fromSuiObjectData: (content: SuiObjectData) => AddRewarder.fromSuiObjectData( [T, R], content, ), fetch: async (client: SuiClient, id: string) => AddRewarder.fetch( client, [T, R], id, ), new: ( fields: AddRewarderFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>, ) => { return new AddRewarder( [extractType(T), extractType(R)], fields ) }, kind: "StructClassReified", } }

 static get r() { return AddRewarder.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): PhantomReified<ToTypeStr<AddRewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>>> { return phantom(AddRewarder.reified( T, R )); } static get p() { return AddRewarder.phantom }

 private static instantiateBcs() { return bcs.struct("AddRewarder", {

 reward_manager_id: ID.bcs, rewarder_id: ID.bcs

}) };

 private static cachedBcs: ReturnType<typeof AddRewarder.instantiateBcs> | null = null;

 static get bcs() { if (!AddRewarder.cachedBcs) { AddRewarder.cachedBcs = AddRewarder.instantiateBcs() } return AddRewarder.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], fields: Record<string, any> ): AddRewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return AddRewarder.reified( typeArgs[0], typeArgs[1], ).new( { rewardManagerId: decodeFromFields(ID.reified(), fields.reward_manager_id), rewarderId: decodeFromFields(ID.reified(), fields.rewarder_id) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], item: FieldsWithTypes ): AddRewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (!isAddRewarder(item.type)) { throw new Error("not a AddRewarder type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return AddRewarder.reified( typeArgs[0], typeArgs[1], ).new( { rewardManagerId: decodeFromFieldsWithTypes(ID.reified(), item.fields.reward_manager_id), rewarderId: decodeFromFieldsWithTypes(ID.reified(), item.fields.rewarder_id) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: Uint8Array ): AddRewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return AddRewarder.fromFields( typeArgs, AddRewarder.bcs.parse(data) ) }

 toJSONField() { return {

 rewardManagerId: this.rewardManagerId,rewarderId: this.rewarderId,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], field: any ): AddRewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return AddRewarder.reified( typeArgs[0], typeArgs[1], ).new( { rewardManagerId: decodeFromJSONField(ID.reified(), field.rewardManagerId), rewarderId: decodeFromJSONField(ID.reified(), field.rewarderId) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], json: Record<string, any> ): AddRewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (json.$typeName !== AddRewarder.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(AddRewarder.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return AddRewarder.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], content: SuiParsedData ): AddRewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isAddRewarder(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a AddRewarder object`); } return AddRewarder.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: SuiObjectData ): AddRewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isAddRewarder(data.bcs.type)) { throw new Error(`object at is not a AddRewarder object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return AddRewarder.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return AddRewarder.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, R], id: string ): Promise<AddRewarder<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching AddRewarder object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isAddRewarder(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a AddRewarder object`); }

 return AddRewarder.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== SourceChanged =============================== */

export function isSourceChanged(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive_events::SourceChanged` + '<'); }

export interface SourceChangedFields<T extends PhantomTypeArgument, R extends PhantomTypeArgument> { kind: ToField<String>; rewarderId: ToField<ID>; rewardType: ToField<String>; rewardAmount: ToField<"u64">; isDeposit: ToField<"bool"> }

export type SourceChangedReified<T extends PhantomTypeArgument, R extends PhantomTypeArgument> = Reified< SourceChanged<T, R>, SourceChangedFields<T, R> >;

export class SourceChanged<T extends PhantomTypeArgument, R extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive_events::SourceChanged`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = SourceChanged.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive_events::SourceChanged<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>]; readonly $isPhantom = SourceChanged.$isPhantom;

 readonly kind: ToField<String>; readonly rewarderId: ToField<ID>; readonly rewardType: ToField<String>; readonly rewardAmount: ToField<"u64">; readonly isDeposit: ToField<"bool">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>], fields: SourceChangedFields<T, R>, ) { this.$fullTypeName = composeSuiType( SourceChanged.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive_events::SourceChanged<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; this.$typeArgs = typeArgs;

 this.kind = fields.kind;; this.rewarderId = fields.rewarderId;; this.rewardType = fields.rewardType;; this.rewardAmount = fields.rewardAmount;; this.isDeposit = fields.isDeposit; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): SourceChangedReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { const reifiedBcs = SourceChanged.bcs; return { typeName: SourceChanged.$typeName, fullTypeName: composeSuiType( SourceChanged.$typeName, ...[extractType(T), extractType(R)] ) as `${typeof PKG_V1}::saving_incentive_events::SourceChanged<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`, typeArgs: [ extractType(T), extractType(R) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<R>>], isPhantom: SourceChanged.$isPhantom, reifiedTypeArgs: [T, R], fromFields: (fields: Record<string, any>) => SourceChanged.fromFields( [T, R], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => SourceChanged.fromFieldsWithTypes( [T, R], item, ), fromBcs: (data: Uint8Array) => SourceChanged.fromFields( [T, R], reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => SourceChanged.fromJSONField( [T, R], field, ), fromJSON: (json: Record<string, any>) => SourceChanged.fromJSON( [T, R], json, ), fromSuiParsedData: (content: SuiParsedData) => SourceChanged.fromSuiParsedData( [T, R], content, ), fromSuiObjectData: (content: SuiObjectData) => SourceChanged.fromSuiObjectData( [T, R], content, ), fetch: async (client: SuiClient, id: string) => SourceChanged.fetch( client, [T, R], id, ), new: ( fields: SourceChangedFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>, ) => { return new SourceChanged( [extractType(T), extractType(R)], fields ) }, kind: "StructClassReified", } }

 static get r() { return SourceChanged.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): PhantomReified<ToTypeStr<SourceChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>>> { return phantom(SourceChanged.reified( T, R )); } static get p() { return SourceChanged.phantom }

 private static instantiateBcs() { return bcs.struct("SourceChanged", {

 kind: String.bcs, rewarder_id: ID.bcs, reward_type: String.bcs, reward_amount: bcs.u64(), is_deposit: bcs.bool()

}) };

 private static cachedBcs: ReturnType<typeof SourceChanged.instantiateBcs> | null = null;

 static get bcs() { if (!SourceChanged.cachedBcs) { SourceChanged.cachedBcs = SourceChanged.instantiateBcs() } return SourceChanged.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], fields: Record<string, any> ): SourceChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return SourceChanged.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromFields(String.reified(), fields.kind), rewarderId: decodeFromFields(ID.reified(), fields.rewarder_id), rewardType: decodeFromFields(String.reified(), fields.reward_type), rewardAmount: decodeFromFields("u64", fields.reward_amount), isDeposit: decodeFromFields("bool", fields.is_deposit) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], item: FieldsWithTypes ): SourceChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (!isSourceChanged(item.type)) { throw new Error("not a SourceChanged type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return SourceChanged.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromFieldsWithTypes(String.reified(), item.fields.kind), rewarderId: decodeFromFieldsWithTypes(ID.reified(), item.fields.rewarder_id), rewardType: decodeFromFieldsWithTypes(String.reified(), item.fields.reward_type), rewardAmount: decodeFromFieldsWithTypes("u64", item.fields.reward_amount), isDeposit: decodeFromFieldsWithTypes("bool", item.fields.is_deposit) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: Uint8Array ): SourceChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return SourceChanged.fromFields( typeArgs, SourceChanged.bcs.parse(data) ) }

 toJSONField() { return {

 kind: this.kind,rewarderId: this.rewarderId,rewardType: this.rewardType,rewardAmount: this.rewardAmount.toString(),isDeposit: this.isDeposit,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], field: any ): SourceChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return SourceChanged.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromJSONField(String.reified(), field.kind), rewarderId: decodeFromJSONField(ID.reified(), field.rewarderId), rewardType: decodeFromJSONField(String.reified(), field.rewardType), rewardAmount: decodeFromJSONField("u64", field.rewardAmount), isDeposit: decodeFromJSONField("bool", field.isDeposit) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], json: Record<string, any> ): SourceChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (json.$typeName !== SourceChanged.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(SourceChanged.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return SourceChanged.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], content: SuiParsedData ): SourceChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isSourceChanged(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a SourceChanged object`); } return SourceChanged.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: SuiObjectData ): SourceChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isSourceChanged(data.bcs.type)) { throw new Error(`object at is not a SourceChanged object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return SourceChanged.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return SourceChanged.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, R], id: string ): Promise<SourceChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching SourceChanged object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isSourceChanged(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a SourceChanged object`); }

 return SourceChanged.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== FlowRateChanged =============================== */

export function isFlowRateChanged(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive_events::FlowRateChanged` + '<'); }

export interface FlowRateChangedFields<T extends PhantomTypeArgument, R extends PhantomTypeArgument> { kind: ToField<String>; rewarderId: ToField<ID>; assetType: ToField<String>; rewardType: ToField<String>; flowRate: ToField<"u256"> }

export type FlowRateChangedReified<T extends PhantomTypeArgument, R extends PhantomTypeArgument> = Reified< FlowRateChanged<T, R>, FlowRateChangedFields<T, R> >;

export class FlowRateChanged<T extends PhantomTypeArgument, R extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive_events::FlowRateChanged`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = FlowRateChanged.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive_events::FlowRateChanged<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>]; readonly $isPhantom = FlowRateChanged.$isPhantom;

 readonly kind: ToField<String>; readonly rewarderId: ToField<ID>; readonly assetType: ToField<String>; readonly rewardType: ToField<String>; readonly flowRate: ToField<"u256">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>], fields: FlowRateChangedFields<T, R>, ) { this.$fullTypeName = composeSuiType( FlowRateChanged.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive_events::FlowRateChanged<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; this.$typeArgs = typeArgs;

 this.kind = fields.kind;; this.rewarderId = fields.rewarderId;; this.assetType = fields.assetType;; this.rewardType = fields.rewardType;; this.flowRate = fields.flowRate; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): FlowRateChangedReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { const reifiedBcs = FlowRateChanged.bcs; return { typeName: FlowRateChanged.$typeName, fullTypeName: composeSuiType( FlowRateChanged.$typeName, ...[extractType(T), extractType(R)] ) as `${typeof PKG_V1}::saving_incentive_events::FlowRateChanged<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`, typeArgs: [ extractType(T), extractType(R) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<R>>], isPhantom: FlowRateChanged.$isPhantom, reifiedTypeArgs: [T, R], fromFields: (fields: Record<string, any>) => FlowRateChanged.fromFields( [T, R], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => FlowRateChanged.fromFieldsWithTypes( [T, R], item, ), fromBcs: (data: Uint8Array) => FlowRateChanged.fromFields( [T, R], reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => FlowRateChanged.fromJSONField( [T, R], field, ), fromJSON: (json: Record<string, any>) => FlowRateChanged.fromJSON( [T, R], json, ), fromSuiParsedData: (content: SuiParsedData) => FlowRateChanged.fromSuiParsedData( [T, R], content, ), fromSuiObjectData: (content: SuiObjectData) => FlowRateChanged.fromSuiObjectData( [T, R], content, ), fetch: async (client: SuiClient, id: string) => FlowRateChanged.fetch( client, [T, R], id, ), new: ( fields: FlowRateChangedFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>, ) => { return new FlowRateChanged( [extractType(T), extractType(R)], fields ) }, kind: "StructClassReified", } }

 static get r() { return FlowRateChanged.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): PhantomReified<ToTypeStr<FlowRateChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>>> { return phantom(FlowRateChanged.reified( T, R )); } static get p() { return FlowRateChanged.phantom }

 private static instantiateBcs() { return bcs.struct("FlowRateChanged", {

 kind: String.bcs, rewarder_id: ID.bcs, asset_type: String.bcs, reward_type: String.bcs, flow_rate: bcs.u256()

}) };

 private static cachedBcs: ReturnType<typeof FlowRateChanged.instantiateBcs> | null = null;

 static get bcs() { if (!FlowRateChanged.cachedBcs) { FlowRateChanged.cachedBcs = FlowRateChanged.instantiateBcs() } return FlowRateChanged.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], fields: Record<string, any> ): FlowRateChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return FlowRateChanged.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromFields(String.reified(), fields.kind), rewarderId: decodeFromFields(ID.reified(), fields.rewarder_id), assetType: decodeFromFields(String.reified(), fields.asset_type), rewardType: decodeFromFields(String.reified(), fields.reward_type), flowRate: decodeFromFields("u256", fields.flow_rate) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], item: FieldsWithTypes ): FlowRateChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (!isFlowRateChanged(item.type)) { throw new Error("not a FlowRateChanged type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return FlowRateChanged.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromFieldsWithTypes(String.reified(), item.fields.kind), rewarderId: decodeFromFieldsWithTypes(ID.reified(), item.fields.rewarder_id), assetType: decodeFromFieldsWithTypes(String.reified(), item.fields.asset_type), rewardType: decodeFromFieldsWithTypes(String.reified(), item.fields.reward_type), flowRate: decodeFromFieldsWithTypes("u256", item.fields.flow_rate) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: Uint8Array ): FlowRateChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return FlowRateChanged.fromFields( typeArgs, FlowRateChanged.bcs.parse(data) ) }

 toJSONField() { return {

 kind: this.kind,rewarderId: this.rewarderId,assetType: this.assetType,rewardType: this.rewardType,flowRate: this.flowRate.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], field: any ): FlowRateChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return FlowRateChanged.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromJSONField(String.reified(), field.kind), rewarderId: decodeFromJSONField(ID.reified(), field.rewarderId), assetType: decodeFromJSONField(String.reified(), field.assetType), rewardType: decodeFromJSONField(String.reified(), field.rewardType), flowRate: decodeFromJSONField("u256", field.flowRate) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], json: Record<string, any> ): FlowRateChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (json.$typeName !== FlowRateChanged.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(FlowRateChanged.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return FlowRateChanged.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], content: SuiParsedData ): FlowRateChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isFlowRateChanged(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a FlowRateChanged object`); } return FlowRateChanged.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: SuiObjectData ): FlowRateChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isFlowRateChanged(data.bcs.type)) { throw new Error(`object at is not a FlowRateChanged object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return FlowRateChanged.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return FlowRateChanged.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, R], id: string ): Promise<FlowRateChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching FlowRateChanged object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isFlowRateChanged(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a FlowRateChanged object`); }

 return FlowRateChanged.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== RewarderTimestampChanged =============================== */

export function isRewarderTimestampChanged(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive_events::RewarderTimestampChanged` + '<'); }

export interface RewarderTimestampChangedFields<T extends PhantomTypeArgument, R extends PhantomTypeArgument> { kind: ToField<String>; rewarderId: ToField<ID>; rewardTimestamp: ToField<"u64"> }

export type RewarderTimestampChangedReified<T extends PhantomTypeArgument, R extends PhantomTypeArgument> = Reified< RewarderTimestampChanged<T, R>, RewarderTimestampChangedFields<T, R> >;

export class RewarderTimestampChanged<T extends PhantomTypeArgument, R extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive_events::RewarderTimestampChanged`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = RewarderTimestampChanged.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive_events::RewarderTimestampChanged<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>]; readonly $isPhantom = RewarderTimestampChanged.$isPhantom;

 readonly kind: ToField<String>; readonly rewarderId: ToField<ID>; readonly rewardTimestamp: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>], fields: RewarderTimestampChangedFields<T, R>, ) { this.$fullTypeName = composeSuiType( RewarderTimestampChanged.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive_events::RewarderTimestampChanged<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; this.$typeArgs = typeArgs;

 this.kind = fields.kind;; this.rewarderId = fields.rewarderId;; this.rewardTimestamp = fields.rewardTimestamp; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): RewarderTimestampChangedReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { const reifiedBcs = RewarderTimestampChanged.bcs; return { typeName: RewarderTimestampChanged.$typeName, fullTypeName: composeSuiType( RewarderTimestampChanged.$typeName, ...[extractType(T), extractType(R)] ) as `${typeof PKG_V1}::saving_incentive_events::RewarderTimestampChanged<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`, typeArgs: [ extractType(T), extractType(R) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<R>>], isPhantom: RewarderTimestampChanged.$isPhantom, reifiedTypeArgs: [T, R], fromFields: (fields: Record<string, any>) => RewarderTimestampChanged.fromFields( [T, R], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => RewarderTimestampChanged.fromFieldsWithTypes( [T, R], item, ), fromBcs: (data: Uint8Array) => RewarderTimestampChanged.fromFields( [T, R], reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => RewarderTimestampChanged.fromJSONField( [T, R], field, ), fromJSON: (json: Record<string, any>) => RewarderTimestampChanged.fromJSON( [T, R], json, ), fromSuiParsedData: (content: SuiParsedData) => RewarderTimestampChanged.fromSuiParsedData( [T, R], content, ), fromSuiObjectData: (content: SuiObjectData) => RewarderTimestampChanged.fromSuiObjectData( [T, R], content, ), fetch: async (client: SuiClient, id: string) => RewarderTimestampChanged.fetch( client, [T, R], id, ), new: ( fields: RewarderTimestampChangedFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>, ) => { return new RewarderTimestampChanged( [extractType(T), extractType(R)], fields ) }, kind: "StructClassReified", } }

 static get r() { return RewarderTimestampChanged.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): PhantomReified<ToTypeStr<RewarderTimestampChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>>> { return phantom(RewarderTimestampChanged.reified( T, R )); } static get p() { return RewarderTimestampChanged.phantom }

 private static instantiateBcs() { return bcs.struct("RewarderTimestampChanged", {

 kind: String.bcs, rewarder_id: ID.bcs, reward_timestamp: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof RewarderTimestampChanged.instantiateBcs> | null = null;

 static get bcs() { if (!RewarderTimestampChanged.cachedBcs) { RewarderTimestampChanged.cachedBcs = RewarderTimestampChanged.instantiateBcs() } return RewarderTimestampChanged.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], fields: Record<string, any> ): RewarderTimestampChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return RewarderTimestampChanged.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromFields(String.reified(), fields.kind), rewarderId: decodeFromFields(ID.reified(), fields.rewarder_id), rewardTimestamp: decodeFromFields("u64", fields.reward_timestamp) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], item: FieldsWithTypes ): RewarderTimestampChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (!isRewarderTimestampChanged(item.type)) { throw new Error("not a RewarderTimestampChanged type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return RewarderTimestampChanged.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromFieldsWithTypes(String.reified(), item.fields.kind), rewarderId: decodeFromFieldsWithTypes(ID.reified(), item.fields.rewarder_id), rewardTimestamp: decodeFromFieldsWithTypes("u64", item.fields.reward_timestamp) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: Uint8Array ): RewarderTimestampChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return RewarderTimestampChanged.fromFields( typeArgs, RewarderTimestampChanged.bcs.parse(data) ) }

 toJSONField() { return {

 kind: this.kind,rewarderId: this.rewarderId,rewardTimestamp: this.rewardTimestamp.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], field: any ): RewarderTimestampChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return RewarderTimestampChanged.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromJSONField(String.reified(), field.kind), rewarderId: decodeFromJSONField(ID.reified(), field.rewarderId), rewardTimestamp: decodeFromJSONField("u64", field.rewardTimestamp) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], json: Record<string, any> ): RewarderTimestampChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (json.$typeName !== RewarderTimestampChanged.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(RewarderTimestampChanged.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return RewarderTimestampChanged.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], content: SuiParsedData ): RewarderTimestampChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRewarderTimestampChanged(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a RewarderTimestampChanged object`); } return RewarderTimestampChanged.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: SuiObjectData ): RewarderTimestampChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRewarderTimestampChanged(data.bcs.type)) { throw new Error(`object at is not a RewarderTimestampChanged object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return RewarderTimestampChanged.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return RewarderTimestampChanged.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, R], id: string ): Promise<RewarderTimestampChanged<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching RewarderTimestampChanged object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRewarderTimestampChanged(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a RewarderTimestampChanged object`); }

 return RewarderTimestampChanged.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== ClaimReward =============================== */

export function isClaimReward(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving_incentive_events::ClaimReward` + '<'); }

export interface ClaimRewardFields<T extends PhantomTypeArgument, R extends PhantomTypeArgument> { kind: ToField<String>; rewarderId: ToField<ID>; accountAddress: ToField<"address">; assetType: ToField<String>; rewardType: ToField<String>; rewardAmount: ToField<"u64"> }

export type ClaimRewardReified<T extends PhantomTypeArgument, R extends PhantomTypeArgument> = Reified< ClaimReward<T, R>, ClaimRewardFields<T, R> >;

export class ClaimReward<T extends PhantomTypeArgument, R extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving_incentive_events::ClaimReward`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = ClaimReward.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving_incentive_events::ClaimReward<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>]; readonly $isPhantom = ClaimReward.$isPhantom;

 readonly kind: ToField<String>; readonly rewarderId: ToField<ID>; readonly accountAddress: ToField<"address">; readonly assetType: ToField<String>; readonly rewardType: ToField<String>; readonly rewardAmount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<R>], fields: ClaimRewardFields<T, R>, ) { this.$fullTypeName = composeSuiType( ClaimReward.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving_incentive_events::ClaimReward<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<R>}>`; this.$typeArgs = typeArgs;

 this.kind = fields.kind;; this.rewarderId = fields.rewarderId;; this.accountAddress = fields.accountAddress;; this.assetType = fields.assetType;; this.rewardType = fields.rewardType;; this.rewardAmount = fields.rewardAmount; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): ClaimRewardReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { const reifiedBcs = ClaimReward.bcs; return { typeName: ClaimReward.$typeName, fullTypeName: composeSuiType( ClaimReward.$typeName, ...[extractType(T), extractType(R)] ) as `${typeof PKG_V1}::saving_incentive_events::ClaimReward<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`, typeArgs: [ extractType(T), extractType(R) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<R>>], isPhantom: ClaimReward.$isPhantom, reifiedTypeArgs: [T, R], fromFields: (fields: Record<string, any>) => ClaimReward.fromFields( [T, R], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ClaimReward.fromFieldsWithTypes( [T, R], item, ), fromBcs: (data: Uint8Array) => ClaimReward.fromFields( [T, R], reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => ClaimReward.fromJSONField( [T, R], field, ), fromJSON: (json: Record<string, any>) => ClaimReward.fromJSON( [T, R], json, ), fromSuiParsedData: (content: SuiParsedData) => ClaimReward.fromSuiParsedData( [T, R], content, ), fromSuiObjectData: (content: SuiObjectData) => ClaimReward.fromSuiObjectData( [T, R], content, ), fetch: async (client: SuiClient, id: string) => ClaimReward.fetch( client, [T, R], id, ), new: ( fields: ClaimRewardFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>, ) => { return new ClaimReward( [extractType(T), extractType(R)], fields ) }, kind: "StructClassReified", } }

 static get r() { return ClaimReward.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( T: T, R: R ): PhantomReified<ToTypeStr<ClaimReward<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>>> { return phantom(ClaimReward.reified( T, R )); } static get p() { return ClaimReward.phantom }

 private static instantiateBcs() { return bcs.struct("ClaimReward", {

 kind: String.bcs, rewarder_id: ID.bcs, account_address: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), asset_type: String.bcs, reward_type: String.bcs, reward_amount: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof ClaimReward.instantiateBcs> | null = null;

 static get bcs() { if (!ClaimReward.cachedBcs) { ClaimReward.cachedBcs = ClaimReward.instantiateBcs() } return ClaimReward.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], fields: Record<string, any> ): ClaimReward<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return ClaimReward.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromFields(String.reified(), fields.kind), rewarderId: decodeFromFields(ID.reified(), fields.rewarder_id), accountAddress: decodeFromFields("address", fields.account_address), assetType: decodeFromFields(String.reified(), fields.asset_type), rewardType: decodeFromFields(String.reified(), fields.reward_type), rewardAmount: decodeFromFields("u64", fields.reward_amount) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], item: FieldsWithTypes ): ClaimReward<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (!isClaimReward(item.type)) { throw new Error("not a ClaimReward type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return ClaimReward.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromFieldsWithTypes(String.reified(), item.fields.kind), rewarderId: decodeFromFieldsWithTypes(ID.reified(), item.fields.rewarder_id), accountAddress: decodeFromFieldsWithTypes("address", item.fields.account_address), assetType: decodeFromFieldsWithTypes(String.reified(), item.fields.asset_type), rewardType: decodeFromFieldsWithTypes(String.reified(), item.fields.reward_type), rewardAmount: decodeFromFieldsWithTypes("u64", item.fields.reward_amount) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: Uint8Array ): ClaimReward<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return ClaimReward.fromFields( typeArgs, ClaimReward.bcs.parse(data) ) }

 toJSONField() { return {

 kind: this.kind,rewarderId: this.rewarderId,accountAddress: this.accountAddress,assetType: this.assetType,rewardType: this.rewardType,rewardAmount: this.rewardAmount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], field: any ): ClaimReward<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { return ClaimReward.reified( typeArgs[0], typeArgs[1], ).new( { kind: decodeFromJSONField(String.reified(), field.kind), rewarderId: decodeFromJSONField(ID.reified(), field.rewarderId), accountAddress: decodeFromJSONField("address", field.accountAddress), assetType: decodeFromJSONField(String.reified(), field.assetType), rewardType: decodeFromJSONField(String.reified(), field.rewardType), rewardAmount: decodeFromJSONField("u64", field.rewardAmount) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], json: Record<string, any> ): ClaimReward<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (json.$typeName !== ClaimReward.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(ClaimReward.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return ClaimReward.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], content: SuiParsedData ): ClaimReward<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isClaimReward(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ClaimReward object`); } return ClaimReward.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, R], data: SuiObjectData ): ClaimReward<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isClaimReward(data.bcs.type)) { throw new Error(`object at is not a ClaimReward object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return ClaimReward.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ClaimReward.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, R extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, R], id: string ): Promise<ClaimReward<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<R>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ClaimReward object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isClaimReward(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ClaimReward object`); }

 return ClaimReward.fromSuiObjectData( typeArgs, res.data ); }

 }
