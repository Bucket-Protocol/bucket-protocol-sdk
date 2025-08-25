import {ID} from "../../_dependencies/source/0x2/object/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== NewSavingPoolEvent =============================== */

export function isNewSavingPoolEvent(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::events::NewSavingPoolEvent` + '<'); }

export interface NewSavingPoolEventFields<T extends PhantomTypeArgument> { savingPoolId: ToField<ID> }

export type NewSavingPoolEventReified<T extends PhantomTypeArgument> = Reified< NewSavingPoolEvent<T>, NewSavingPoolEventFields<T> >;

export class NewSavingPoolEvent<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::events::NewSavingPoolEvent`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = NewSavingPoolEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::events::NewSavingPoolEvent<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = NewSavingPoolEvent.$isPhantom;

 readonly savingPoolId: ToField<ID>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: NewSavingPoolEventFields<T>, ) { this.$fullTypeName = composeSuiType( NewSavingPoolEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::events::NewSavingPoolEvent<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.savingPoolId = fields.savingPoolId; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): NewSavingPoolEventReified<ToPhantomTypeArgument<T>> { const reifiedBcs = NewSavingPoolEvent.bcs; return { typeName: NewSavingPoolEvent.$typeName, fullTypeName: composeSuiType( NewSavingPoolEvent.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::events::NewSavingPoolEvent<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: NewSavingPoolEvent.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => NewSavingPoolEvent.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => NewSavingPoolEvent.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => NewSavingPoolEvent.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => NewSavingPoolEvent.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => NewSavingPoolEvent.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => NewSavingPoolEvent.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => NewSavingPoolEvent.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => NewSavingPoolEvent.fetch( client, T, id, ), new: ( fields: NewSavingPoolEventFields<ToPhantomTypeArgument<T>>, ) => { return new NewSavingPoolEvent( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return NewSavingPoolEvent.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<NewSavingPoolEvent<ToPhantomTypeArgument<T>>>> { return phantom(NewSavingPoolEvent.reified( T )); } static get p() { return NewSavingPoolEvent.phantom }

 private static instantiateBcs() { return bcs.struct("NewSavingPoolEvent", {

 saving_pool_id: ID.bcs

}) };

 private static cachedBcs: ReturnType<typeof NewSavingPoolEvent.instantiateBcs> | null = null;

 static get bcs() { if (!NewSavingPoolEvent.cachedBcs) { NewSavingPoolEvent.cachedBcs = NewSavingPoolEvent.instantiateBcs() } return NewSavingPoolEvent.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): NewSavingPoolEvent<ToPhantomTypeArgument<T>> { return NewSavingPoolEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFields(ID.reified(), fields.saving_pool_id) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): NewSavingPoolEvent<ToPhantomTypeArgument<T>> { if (!isNewSavingPoolEvent(item.type)) { throw new Error("not a NewSavingPoolEvent type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return NewSavingPoolEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.saving_pool_id) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): NewSavingPoolEvent<ToPhantomTypeArgument<T>> { return NewSavingPoolEvent.fromFields( typeArg, NewSavingPoolEvent.bcs.parse(data) ) }

 toJSONField() { return {

 savingPoolId: this.savingPoolId,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): NewSavingPoolEvent<ToPhantomTypeArgument<T>> { return NewSavingPoolEvent.reified( typeArg, ).new( { savingPoolId: decodeFromJSONField(ID.reified(), field.savingPoolId) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): NewSavingPoolEvent<ToPhantomTypeArgument<T>> { if (json.$typeName !== NewSavingPoolEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(NewSavingPoolEvent.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return NewSavingPoolEvent.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): NewSavingPoolEvent<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isNewSavingPoolEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a NewSavingPoolEvent object`); } return NewSavingPoolEvent.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): NewSavingPoolEvent<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isNewSavingPoolEvent(data.bcs.type)) { throw new Error(`object at is not a NewSavingPoolEvent object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return NewSavingPoolEvent.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return NewSavingPoolEvent.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<NewSavingPoolEvent<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching NewSavingPoolEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isNewSavingPoolEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a NewSavingPoolEvent object`); }

 return NewSavingPoolEvent.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== UpdateSavingRateEvent =============================== */

export function isUpdateSavingRateEvent(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::events::UpdateSavingRateEvent` + '<'); }

export interface UpdateSavingRateEventFields<T extends PhantomTypeArgument> { savingPoolId: ToField<ID>; savingRateBps: ToField<"u64"> }

export type UpdateSavingRateEventReified<T extends PhantomTypeArgument> = Reified< UpdateSavingRateEvent<T>, UpdateSavingRateEventFields<T> >;

export class UpdateSavingRateEvent<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::events::UpdateSavingRateEvent`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = UpdateSavingRateEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::events::UpdateSavingRateEvent<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = UpdateSavingRateEvent.$isPhantom;

 readonly savingPoolId: ToField<ID>; readonly savingRateBps: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: UpdateSavingRateEventFields<T>, ) { this.$fullTypeName = composeSuiType( UpdateSavingRateEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::events::UpdateSavingRateEvent<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.savingPoolId = fields.savingPoolId;; this.savingRateBps = fields.savingRateBps; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): UpdateSavingRateEventReified<ToPhantomTypeArgument<T>> { const reifiedBcs = UpdateSavingRateEvent.bcs; return { typeName: UpdateSavingRateEvent.$typeName, fullTypeName: composeSuiType( UpdateSavingRateEvent.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::events::UpdateSavingRateEvent<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: UpdateSavingRateEvent.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => UpdateSavingRateEvent.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => UpdateSavingRateEvent.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => UpdateSavingRateEvent.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => UpdateSavingRateEvent.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => UpdateSavingRateEvent.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => UpdateSavingRateEvent.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => UpdateSavingRateEvent.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => UpdateSavingRateEvent.fetch( client, T, id, ), new: ( fields: UpdateSavingRateEventFields<ToPhantomTypeArgument<T>>, ) => { return new UpdateSavingRateEvent( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return UpdateSavingRateEvent.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<UpdateSavingRateEvent<ToPhantomTypeArgument<T>>>> { return phantom(UpdateSavingRateEvent.reified( T )); } static get p() { return UpdateSavingRateEvent.phantom }

 private static instantiateBcs() { return bcs.struct("UpdateSavingRateEvent", {

 saving_pool_id: ID.bcs, saving_rate_bps: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof UpdateSavingRateEvent.instantiateBcs> | null = null;

 static get bcs() { if (!UpdateSavingRateEvent.cachedBcs) { UpdateSavingRateEvent.cachedBcs = UpdateSavingRateEvent.instantiateBcs() } return UpdateSavingRateEvent.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): UpdateSavingRateEvent<ToPhantomTypeArgument<T>> { return UpdateSavingRateEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFields(ID.reified(), fields.saving_pool_id), savingRateBps: decodeFromFields("u64", fields.saving_rate_bps) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): UpdateSavingRateEvent<ToPhantomTypeArgument<T>> { if (!isUpdateSavingRateEvent(item.type)) { throw new Error("not a UpdateSavingRateEvent type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return UpdateSavingRateEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.saving_pool_id), savingRateBps: decodeFromFieldsWithTypes("u64", item.fields.saving_rate_bps) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): UpdateSavingRateEvent<ToPhantomTypeArgument<T>> { return UpdateSavingRateEvent.fromFields( typeArg, UpdateSavingRateEvent.bcs.parse(data) ) }

 toJSONField() { return {

 savingPoolId: this.savingPoolId,savingRateBps: this.savingRateBps.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): UpdateSavingRateEvent<ToPhantomTypeArgument<T>> { return UpdateSavingRateEvent.reified( typeArg, ).new( { savingPoolId: decodeFromJSONField(ID.reified(), field.savingPoolId), savingRateBps: decodeFromJSONField("u64", field.savingRateBps) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): UpdateSavingRateEvent<ToPhantomTypeArgument<T>> { if (json.$typeName !== UpdateSavingRateEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(UpdateSavingRateEvent.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return UpdateSavingRateEvent.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): UpdateSavingRateEvent<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isUpdateSavingRateEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a UpdateSavingRateEvent object`); } return UpdateSavingRateEvent.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): UpdateSavingRateEvent<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isUpdateSavingRateEvent(data.bcs.type)) { throw new Error(`object at is not a UpdateSavingRateEvent object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return UpdateSavingRateEvent.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return UpdateSavingRateEvent.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<UpdateSavingRateEvent<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching UpdateSavingRateEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isUpdateSavingRateEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a UpdateSavingRateEvent object`); }

 return UpdateSavingRateEvent.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== DepositEvent =============================== */

export function isDepositEvent(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::events::DepositEvent` + '<'); }

export interface DepositEventFields<T extends PhantomTypeArgument> { savingPoolId: ToField<ID>; accountAddress: ToField<"address">; depositedUsdbAmount: ToField<"u64">; mintedLpAmount: ToField<"u64"> }

export type DepositEventReified<T extends PhantomTypeArgument> = Reified< DepositEvent<T>, DepositEventFields<T> >;

export class DepositEvent<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::events::DepositEvent`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = DepositEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::events::DepositEvent<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = DepositEvent.$isPhantom;

 readonly savingPoolId: ToField<ID>; readonly accountAddress: ToField<"address">; readonly depositedUsdbAmount: ToField<"u64">; readonly mintedLpAmount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: DepositEventFields<T>, ) { this.$fullTypeName = composeSuiType( DepositEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::events::DepositEvent<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.savingPoolId = fields.savingPoolId;; this.accountAddress = fields.accountAddress;; this.depositedUsdbAmount = fields.depositedUsdbAmount;; this.mintedLpAmount = fields.mintedLpAmount; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): DepositEventReified<ToPhantomTypeArgument<T>> { const reifiedBcs = DepositEvent.bcs; return { typeName: DepositEvent.$typeName, fullTypeName: composeSuiType( DepositEvent.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::events::DepositEvent<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: DepositEvent.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => DepositEvent.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DepositEvent.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => DepositEvent.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => DepositEvent.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => DepositEvent.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => DepositEvent.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => DepositEvent.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => DepositEvent.fetch( client, T, id, ), new: ( fields: DepositEventFields<ToPhantomTypeArgument<T>>, ) => { return new DepositEvent( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DepositEvent.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<DepositEvent<ToPhantomTypeArgument<T>>>> { return phantom(DepositEvent.reified( T )); } static get p() { return DepositEvent.phantom }

 private static instantiateBcs() { return bcs.struct("DepositEvent", {

 saving_pool_id: ID.bcs, account_address: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), deposited_usdb_amount: bcs.u64(), minted_lp_amount: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof DepositEvent.instantiateBcs> | null = null;

 static get bcs() { if (!DepositEvent.cachedBcs) { DepositEvent.cachedBcs = DepositEvent.instantiateBcs() } return DepositEvent.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): DepositEvent<ToPhantomTypeArgument<T>> { return DepositEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFields(ID.reified(), fields.saving_pool_id), accountAddress: decodeFromFields("address", fields.account_address), depositedUsdbAmount: decodeFromFields("u64", fields.deposited_usdb_amount), mintedLpAmount: decodeFromFields("u64", fields.minted_lp_amount) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): DepositEvent<ToPhantomTypeArgument<T>> { if (!isDepositEvent(item.type)) { throw new Error("not a DepositEvent type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return DepositEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.saving_pool_id), accountAddress: decodeFromFieldsWithTypes("address", item.fields.account_address), depositedUsdbAmount: decodeFromFieldsWithTypes("u64", item.fields.deposited_usdb_amount), mintedLpAmount: decodeFromFieldsWithTypes("u64", item.fields.minted_lp_amount) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): DepositEvent<ToPhantomTypeArgument<T>> { return DepositEvent.fromFields( typeArg, DepositEvent.bcs.parse(data) ) }

 toJSONField() { return {

 savingPoolId: this.savingPoolId,accountAddress: this.accountAddress,depositedUsdbAmount: this.depositedUsdbAmount.toString(),mintedLpAmount: this.mintedLpAmount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): DepositEvent<ToPhantomTypeArgument<T>> { return DepositEvent.reified( typeArg, ).new( { savingPoolId: decodeFromJSONField(ID.reified(), field.savingPoolId), accountAddress: decodeFromJSONField("address", field.accountAddress), depositedUsdbAmount: decodeFromJSONField("u64", field.depositedUsdbAmount), mintedLpAmount: decodeFromJSONField("u64", field.mintedLpAmount) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): DepositEvent<ToPhantomTypeArgument<T>> { if (json.$typeName !== DepositEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DepositEvent.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return DepositEvent.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): DepositEvent<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDepositEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DepositEvent object`); } return DepositEvent.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): DepositEvent<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDepositEvent(data.bcs.type)) { throw new Error(`object at is not a DepositEvent object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return DepositEvent.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DepositEvent.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<DepositEvent<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DepositEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDepositEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DepositEvent object`); }

 return DepositEvent.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== WithdrawEvent =============================== */

export function isWithdrawEvent(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::events::WithdrawEvent` + '<'); }

export interface WithdrawEventFields<T extends PhantomTypeArgument> { savingPoolId: ToField<ID>; accountAddress: ToField<"address">; burnedLpAmount: ToField<"u64">; withdrawalUsdbAmount: ToField<"u64"> }

export type WithdrawEventReified<T extends PhantomTypeArgument> = Reified< WithdrawEvent<T>, WithdrawEventFields<T> >;

export class WithdrawEvent<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::events::WithdrawEvent`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = WithdrawEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::events::WithdrawEvent<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = WithdrawEvent.$isPhantom;

 readonly savingPoolId: ToField<ID>; readonly accountAddress: ToField<"address">; readonly burnedLpAmount: ToField<"u64">; readonly withdrawalUsdbAmount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: WithdrawEventFields<T>, ) { this.$fullTypeName = composeSuiType( WithdrawEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::events::WithdrawEvent<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.savingPoolId = fields.savingPoolId;; this.accountAddress = fields.accountAddress;; this.burnedLpAmount = fields.burnedLpAmount;; this.withdrawalUsdbAmount = fields.withdrawalUsdbAmount; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): WithdrawEventReified<ToPhantomTypeArgument<T>> { const reifiedBcs = WithdrawEvent.bcs; return { typeName: WithdrawEvent.$typeName, fullTypeName: composeSuiType( WithdrawEvent.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::events::WithdrawEvent<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: WithdrawEvent.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => WithdrawEvent.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => WithdrawEvent.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => WithdrawEvent.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => WithdrawEvent.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => WithdrawEvent.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => WithdrawEvent.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => WithdrawEvent.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => WithdrawEvent.fetch( client, T, id, ), new: ( fields: WithdrawEventFields<ToPhantomTypeArgument<T>>, ) => { return new WithdrawEvent( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return WithdrawEvent.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<WithdrawEvent<ToPhantomTypeArgument<T>>>> { return phantom(WithdrawEvent.reified( T )); } static get p() { return WithdrawEvent.phantom }

 private static instantiateBcs() { return bcs.struct("WithdrawEvent", {

 saving_pool_id: ID.bcs, account_address: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), burned_lp_amount: bcs.u64(), withdrawal_usdb_amount: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof WithdrawEvent.instantiateBcs> | null = null;

 static get bcs() { if (!WithdrawEvent.cachedBcs) { WithdrawEvent.cachedBcs = WithdrawEvent.instantiateBcs() } return WithdrawEvent.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): WithdrawEvent<ToPhantomTypeArgument<T>> { return WithdrawEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFields(ID.reified(), fields.saving_pool_id), accountAddress: decodeFromFields("address", fields.account_address), burnedLpAmount: decodeFromFields("u64", fields.burned_lp_amount), withdrawalUsdbAmount: decodeFromFields("u64", fields.withdrawal_usdb_amount) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): WithdrawEvent<ToPhantomTypeArgument<T>> { if (!isWithdrawEvent(item.type)) { throw new Error("not a WithdrawEvent type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return WithdrawEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.saving_pool_id), accountAddress: decodeFromFieldsWithTypes("address", item.fields.account_address), burnedLpAmount: decodeFromFieldsWithTypes("u64", item.fields.burned_lp_amount), withdrawalUsdbAmount: decodeFromFieldsWithTypes("u64", item.fields.withdrawal_usdb_amount) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): WithdrawEvent<ToPhantomTypeArgument<T>> { return WithdrawEvent.fromFields( typeArg, WithdrawEvent.bcs.parse(data) ) }

 toJSONField() { return {

 savingPoolId: this.savingPoolId,accountAddress: this.accountAddress,burnedLpAmount: this.burnedLpAmount.toString(),withdrawalUsdbAmount: this.withdrawalUsdbAmount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): WithdrawEvent<ToPhantomTypeArgument<T>> { return WithdrawEvent.reified( typeArg, ).new( { savingPoolId: decodeFromJSONField(ID.reified(), field.savingPoolId), accountAddress: decodeFromJSONField("address", field.accountAddress), burnedLpAmount: decodeFromJSONField("u64", field.burnedLpAmount), withdrawalUsdbAmount: decodeFromJSONField("u64", field.withdrawalUsdbAmount) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): WithdrawEvent<ToPhantomTypeArgument<T>> { if (json.$typeName !== WithdrawEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(WithdrawEvent.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return WithdrawEvent.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): WithdrawEvent<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isWithdrawEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a WithdrawEvent object`); } return WithdrawEvent.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): WithdrawEvent<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isWithdrawEvent(data.bcs.type)) { throw new Error(`object at is not a WithdrawEvent object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return WithdrawEvent.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return WithdrawEvent.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<WithdrawEvent<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching WithdrawEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isWithdrawEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a WithdrawEvent object`); }

 return WithdrawEvent.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== InterestEmittedEvent =============================== */

export function isInterestEmittedEvent(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::events::InterestEmittedEvent` + '<'); }

export interface InterestEmittedEventFields<T extends PhantomTypeArgument> { savingPoolId: ToField<ID>; interestAmount: ToField<"u64"> }

export type InterestEmittedEventReified<T extends PhantomTypeArgument> = Reified< InterestEmittedEvent<T>, InterestEmittedEventFields<T> >;

export class InterestEmittedEvent<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::events::InterestEmittedEvent`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = InterestEmittedEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::events::InterestEmittedEvent<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = InterestEmittedEvent.$isPhantom;

 readonly savingPoolId: ToField<ID>; readonly interestAmount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: InterestEmittedEventFields<T>, ) { this.$fullTypeName = composeSuiType( InterestEmittedEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::events::InterestEmittedEvent<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.savingPoolId = fields.savingPoolId;; this.interestAmount = fields.interestAmount; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): InterestEmittedEventReified<ToPhantomTypeArgument<T>> { const reifiedBcs = InterestEmittedEvent.bcs; return { typeName: InterestEmittedEvent.$typeName, fullTypeName: composeSuiType( InterestEmittedEvent.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::events::InterestEmittedEvent<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: InterestEmittedEvent.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => InterestEmittedEvent.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => InterestEmittedEvent.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => InterestEmittedEvent.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => InterestEmittedEvent.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => InterestEmittedEvent.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => InterestEmittedEvent.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => InterestEmittedEvent.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => InterestEmittedEvent.fetch( client, T, id, ), new: ( fields: InterestEmittedEventFields<ToPhantomTypeArgument<T>>, ) => { return new InterestEmittedEvent( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return InterestEmittedEvent.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<InterestEmittedEvent<ToPhantomTypeArgument<T>>>> { return phantom(InterestEmittedEvent.reified( T )); } static get p() { return InterestEmittedEvent.phantom }

 private static instantiateBcs() { return bcs.struct("InterestEmittedEvent", {

 saving_pool_id: ID.bcs, interest_amount: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof InterestEmittedEvent.instantiateBcs> | null = null;

 static get bcs() { if (!InterestEmittedEvent.cachedBcs) { InterestEmittedEvent.cachedBcs = InterestEmittedEvent.instantiateBcs() } return InterestEmittedEvent.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): InterestEmittedEvent<ToPhantomTypeArgument<T>> { return InterestEmittedEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFields(ID.reified(), fields.saving_pool_id), interestAmount: decodeFromFields("u64", fields.interest_amount) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): InterestEmittedEvent<ToPhantomTypeArgument<T>> { if (!isInterestEmittedEvent(item.type)) { throw new Error("not a InterestEmittedEvent type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return InterestEmittedEvent.reified( typeArg, ).new( { savingPoolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.saving_pool_id), interestAmount: decodeFromFieldsWithTypes("u64", item.fields.interest_amount) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): InterestEmittedEvent<ToPhantomTypeArgument<T>> { return InterestEmittedEvent.fromFields( typeArg, InterestEmittedEvent.bcs.parse(data) ) }

 toJSONField() { return {

 savingPoolId: this.savingPoolId,interestAmount: this.interestAmount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): InterestEmittedEvent<ToPhantomTypeArgument<T>> { return InterestEmittedEvent.reified( typeArg, ).new( { savingPoolId: decodeFromJSONField(ID.reified(), field.savingPoolId), interestAmount: decodeFromJSONField("u64", field.interestAmount) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): InterestEmittedEvent<ToPhantomTypeArgument<T>> { if (json.$typeName !== InterestEmittedEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(InterestEmittedEvent.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return InterestEmittedEvent.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): InterestEmittedEvent<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isInterestEmittedEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a InterestEmittedEvent object`); } return InterestEmittedEvent.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): InterestEmittedEvent<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isInterestEmittedEvent(data.bcs.type)) { throw new Error(`object at is not a InterestEmittedEvent object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return InterestEmittedEvent.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return InterestEmittedEvent.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<InterestEmittedEvent<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching InterestEmittedEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isInterestEmittedEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a InterestEmittedEvent object`); }

 return InterestEmittedEvent.fromSuiObjectData( typeArg, res.data ); }

 }
