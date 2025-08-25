import {String} from "../../_dependencies/source/0x1/ascii/structs";
import {ID} from "../../_dependencies/source/0x2/object/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== NewPsmPool =============================== */

export function isNewPsmPool(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::events::NewPsmPool`; }

export interface NewPsmPoolFields { poolId: ToField<ID>; coinType: ToField<String>; decimal: ToField<"u8">; swapInFeeBps: ToField<"u64">; swapOutFeeBps: ToField<"u64"> }

export type NewPsmPoolReified = Reified< NewPsmPool, NewPsmPoolFields >;

export class NewPsmPool implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::events::NewPsmPool`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = NewPsmPool.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::events::NewPsmPool`; readonly $typeArgs: []; readonly $isPhantom = NewPsmPool.$isPhantom;

 readonly poolId: ToField<ID>; readonly coinType: ToField<String>; readonly decimal: ToField<"u8">; readonly swapInFeeBps: ToField<"u64">; readonly swapOutFeeBps: ToField<"u64">

 private constructor(typeArgs: [], fields: NewPsmPoolFields, ) { this.$fullTypeName = composeSuiType( NewPsmPool.$typeName, ...typeArgs ) as `${typeof PKG_V1}::events::NewPsmPool`; this.$typeArgs = typeArgs;

 this.poolId = fields.poolId;; this.coinType = fields.coinType;; this.decimal = fields.decimal;; this.swapInFeeBps = fields.swapInFeeBps;; this.swapOutFeeBps = fields.swapOutFeeBps; }

 static reified( ): NewPsmPoolReified { const reifiedBcs = NewPsmPool.bcs; return { typeName: NewPsmPool.$typeName, fullTypeName: composeSuiType( NewPsmPool.$typeName, ...[] ) as `${typeof PKG_V1}::events::NewPsmPool`, typeArgs: [ ] as [], isPhantom: NewPsmPool.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => NewPsmPool.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => NewPsmPool.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => NewPsmPool.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => NewPsmPool.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => NewPsmPool.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => NewPsmPool.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => NewPsmPool.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => NewPsmPool.fetch( client, id, ), new: ( fields: NewPsmPoolFields, ) => { return new NewPsmPool( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return NewPsmPool.reified() }

 static phantom( ): PhantomReified<ToTypeStr<NewPsmPool>> { return phantom(NewPsmPool.reified( )); } static get p() { return NewPsmPool.phantom() }

 private static instantiateBcs() { return bcs.struct("NewPsmPool", {

 pool_id: ID.bcs, coin_type: String.bcs, decimal: bcs.u8(), swap_in_fee_bps: bcs.u64(), swap_out_fee_bps: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof NewPsmPool.instantiateBcs> | null = null;

 static get bcs() { if (!NewPsmPool.cachedBcs) { NewPsmPool.cachedBcs = NewPsmPool.instantiateBcs() } return NewPsmPool.cachedBcs };

 static fromFields( fields: Record<string, any> ): NewPsmPool { return NewPsmPool.reified( ).new( { poolId: decodeFromFields(ID.reified(), fields.pool_id), coinType: decodeFromFields(String.reified(), fields.coin_type), decimal: decodeFromFields("u8", fields.decimal), swapInFeeBps: decodeFromFields("u64", fields.swap_in_fee_bps), swapOutFeeBps: decodeFromFields("u64", fields.swap_out_fee_bps) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): NewPsmPool { if (!isNewPsmPool(item.type)) { throw new Error("not a NewPsmPool type");

 }

 return NewPsmPool.reified( ).new( { poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), coinType: decodeFromFieldsWithTypes(String.reified(), item.fields.coin_type), decimal: decodeFromFieldsWithTypes("u8", item.fields.decimal), swapInFeeBps: decodeFromFieldsWithTypes("u64", item.fields.swap_in_fee_bps), swapOutFeeBps: decodeFromFieldsWithTypes("u64", item.fields.swap_out_fee_bps) } ) }

 static fromBcs( data: Uint8Array ): NewPsmPool { return NewPsmPool.fromFields( NewPsmPool.bcs.parse(data) ) }

 toJSONField() { return {

 poolId: this.poolId,coinType: this.coinType,decimal: this.decimal,swapInFeeBps: this.swapInFeeBps.toString(),swapOutFeeBps: this.swapOutFeeBps.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): NewPsmPool { return NewPsmPool.reified( ).new( { poolId: decodeFromJSONField(ID.reified(), field.poolId), coinType: decodeFromJSONField(String.reified(), field.coinType), decimal: decodeFromJSONField("u8", field.decimal), swapInFeeBps: decodeFromJSONField("u64", field.swapInFeeBps), swapOutFeeBps: decodeFromJSONField("u64", field.swapOutFeeBps) } ) }

 static fromJSON( json: Record<string, any> ): NewPsmPool { if (json.$typeName !== NewPsmPool.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return NewPsmPool.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): NewPsmPool { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isNewPsmPool(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a NewPsmPool object`); } return NewPsmPool.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): NewPsmPool { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isNewPsmPool(data.bcs.type)) { throw new Error(`object at is not a NewPsmPool object`); }

 return NewPsmPool.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return NewPsmPool.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<NewPsmPool> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching NewPsmPool object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isNewPsmPool(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a NewPsmPool object`); }

 return NewPsmPool.fromSuiObjectData( res.data ); }

 }

/* ============================== PsmSwapIn =============================== */

export function isPsmSwapIn(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::events::PsmSwapIn` + '<'); }

export interface PsmSwapInFields<T extends PhantomTypeArgument> { assetInAmount: ToField<"u64">; assetBalance: ToField<"u64">; usdbOutAmount: ToField<"u64">; usdbSupply: ToField<"u64"> }

export type PsmSwapInReified<T extends PhantomTypeArgument> = Reified< PsmSwapIn<T>, PsmSwapInFields<T> >;

export class PsmSwapIn<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::events::PsmSwapIn`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = PsmSwapIn.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::events::PsmSwapIn<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = PsmSwapIn.$isPhantom;

 readonly assetInAmount: ToField<"u64">; readonly assetBalance: ToField<"u64">; readonly usdbOutAmount: ToField<"u64">; readonly usdbSupply: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: PsmSwapInFields<T>, ) { this.$fullTypeName = composeSuiType( PsmSwapIn.$typeName, ...typeArgs ) as `${typeof PKG_V1}::events::PsmSwapIn<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.assetInAmount = fields.assetInAmount;; this.assetBalance = fields.assetBalance;; this.usdbOutAmount = fields.usdbOutAmount;; this.usdbSupply = fields.usdbSupply; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PsmSwapInReified<ToPhantomTypeArgument<T>> { const reifiedBcs = PsmSwapIn.bcs; return { typeName: PsmSwapIn.$typeName, fullTypeName: composeSuiType( PsmSwapIn.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::events::PsmSwapIn<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: PsmSwapIn.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => PsmSwapIn.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PsmSwapIn.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => PsmSwapIn.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => PsmSwapIn.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => PsmSwapIn.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => PsmSwapIn.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => PsmSwapIn.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => PsmSwapIn.fetch( client, T, id, ), new: ( fields: PsmSwapInFields<ToPhantomTypeArgument<T>>, ) => { return new PsmSwapIn( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return PsmSwapIn.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<PsmSwapIn<ToPhantomTypeArgument<T>>>> { return phantom(PsmSwapIn.reified( T )); } static get p() { return PsmSwapIn.phantom }

 private static instantiateBcs() { return bcs.struct("PsmSwapIn", {

 asset_in_amount: bcs.u64(), asset_balance: bcs.u64(), usdb_out_amount: bcs.u64(), usdb_supply: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof PsmSwapIn.instantiateBcs> | null = null;

 static get bcs() { if (!PsmSwapIn.cachedBcs) { PsmSwapIn.cachedBcs = PsmSwapIn.instantiateBcs() } return PsmSwapIn.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): PsmSwapIn<ToPhantomTypeArgument<T>> { return PsmSwapIn.reified( typeArg, ).new( { assetInAmount: decodeFromFields("u64", fields.asset_in_amount), assetBalance: decodeFromFields("u64", fields.asset_balance), usdbOutAmount: decodeFromFields("u64", fields.usdb_out_amount), usdbSupply: decodeFromFields("u64", fields.usdb_supply) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): PsmSwapIn<ToPhantomTypeArgument<T>> { if (!isPsmSwapIn(item.type)) { throw new Error("not a PsmSwapIn type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return PsmSwapIn.reified( typeArg, ).new( { assetInAmount: decodeFromFieldsWithTypes("u64", item.fields.asset_in_amount), assetBalance: decodeFromFieldsWithTypes("u64", item.fields.asset_balance), usdbOutAmount: decodeFromFieldsWithTypes("u64", item.fields.usdb_out_amount), usdbSupply: decodeFromFieldsWithTypes("u64", item.fields.usdb_supply) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): PsmSwapIn<ToPhantomTypeArgument<T>> { return PsmSwapIn.fromFields( typeArg, PsmSwapIn.bcs.parse(data) ) }

 toJSONField() { return {

 assetInAmount: this.assetInAmount.toString(),assetBalance: this.assetBalance.toString(),usdbOutAmount: this.usdbOutAmount.toString(),usdbSupply: this.usdbSupply.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): PsmSwapIn<ToPhantomTypeArgument<T>> { return PsmSwapIn.reified( typeArg, ).new( { assetInAmount: decodeFromJSONField("u64", field.assetInAmount), assetBalance: decodeFromJSONField("u64", field.assetBalance), usdbOutAmount: decodeFromJSONField("u64", field.usdbOutAmount), usdbSupply: decodeFromJSONField("u64", field.usdbSupply) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): PsmSwapIn<ToPhantomTypeArgument<T>> { if (json.$typeName !== PsmSwapIn.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(PsmSwapIn.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return PsmSwapIn.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): PsmSwapIn<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPsmSwapIn(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PsmSwapIn object`); } return PsmSwapIn.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): PsmSwapIn<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPsmSwapIn(data.bcs.type)) { throw new Error(`object at is not a PsmSwapIn object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return PsmSwapIn.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PsmSwapIn.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<PsmSwapIn<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PsmSwapIn object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPsmSwapIn(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PsmSwapIn object`); }

 return PsmSwapIn.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== PsmSwapOut =============================== */

export function isPsmSwapOut(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::events::PsmSwapOut` + '<'); }

export interface PsmSwapOutFields<T extends PhantomTypeArgument> { usdbInAmount: ToField<"u64">; usdbSupply: ToField<"u64">; assetOutAmount: ToField<"u64">; assetBalance: ToField<"u64"> }

export type PsmSwapOutReified<T extends PhantomTypeArgument> = Reified< PsmSwapOut<T>, PsmSwapOutFields<T> >;

export class PsmSwapOut<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::events::PsmSwapOut`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = PsmSwapOut.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::events::PsmSwapOut<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = PsmSwapOut.$isPhantom;

 readonly usdbInAmount: ToField<"u64">; readonly usdbSupply: ToField<"u64">; readonly assetOutAmount: ToField<"u64">; readonly assetBalance: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: PsmSwapOutFields<T>, ) { this.$fullTypeName = composeSuiType( PsmSwapOut.$typeName, ...typeArgs ) as `${typeof PKG_V1}::events::PsmSwapOut<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.usdbInAmount = fields.usdbInAmount;; this.usdbSupply = fields.usdbSupply;; this.assetOutAmount = fields.assetOutAmount;; this.assetBalance = fields.assetBalance; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PsmSwapOutReified<ToPhantomTypeArgument<T>> { const reifiedBcs = PsmSwapOut.bcs; return { typeName: PsmSwapOut.$typeName, fullTypeName: composeSuiType( PsmSwapOut.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::events::PsmSwapOut<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: PsmSwapOut.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => PsmSwapOut.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PsmSwapOut.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => PsmSwapOut.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => PsmSwapOut.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => PsmSwapOut.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => PsmSwapOut.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => PsmSwapOut.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => PsmSwapOut.fetch( client, T, id, ), new: ( fields: PsmSwapOutFields<ToPhantomTypeArgument<T>>, ) => { return new PsmSwapOut( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return PsmSwapOut.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<PsmSwapOut<ToPhantomTypeArgument<T>>>> { return phantom(PsmSwapOut.reified( T )); } static get p() { return PsmSwapOut.phantom }

 private static instantiateBcs() { return bcs.struct("PsmSwapOut", {

 usdb_in_amount: bcs.u64(), usdb_supply: bcs.u64(), asset_out_amount: bcs.u64(), asset_balance: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof PsmSwapOut.instantiateBcs> | null = null;

 static get bcs() { if (!PsmSwapOut.cachedBcs) { PsmSwapOut.cachedBcs = PsmSwapOut.instantiateBcs() } return PsmSwapOut.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): PsmSwapOut<ToPhantomTypeArgument<T>> { return PsmSwapOut.reified( typeArg, ).new( { usdbInAmount: decodeFromFields("u64", fields.usdb_in_amount), usdbSupply: decodeFromFields("u64", fields.usdb_supply), assetOutAmount: decodeFromFields("u64", fields.asset_out_amount), assetBalance: decodeFromFields("u64", fields.asset_balance) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): PsmSwapOut<ToPhantomTypeArgument<T>> { if (!isPsmSwapOut(item.type)) { throw new Error("not a PsmSwapOut type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return PsmSwapOut.reified( typeArg, ).new( { usdbInAmount: decodeFromFieldsWithTypes("u64", item.fields.usdb_in_amount), usdbSupply: decodeFromFieldsWithTypes("u64", item.fields.usdb_supply), assetOutAmount: decodeFromFieldsWithTypes("u64", item.fields.asset_out_amount), assetBalance: decodeFromFieldsWithTypes("u64", item.fields.asset_balance) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): PsmSwapOut<ToPhantomTypeArgument<T>> { return PsmSwapOut.fromFields( typeArg, PsmSwapOut.bcs.parse(data) ) }

 toJSONField() { return {

 usdbInAmount: this.usdbInAmount.toString(),usdbSupply: this.usdbSupply.toString(),assetOutAmount: this.assetOutAmount.toString(),assetBalance: this.assetBalance.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): PsmSwapOut<ToPhantomTypeArgument<T>> { return PsmSwapOut.reified( typeArg, ).new( { usdbInAmount: decodeFromJSONField("u64", field.usdbInAmount), usdbSupply: decodeFromJSONField("u64", field.usdbSupply), assetOutAmount: decodeFromJSONField("u64", field.assetOutAmount), assetBalance: decodeFromJSONField("u64", field.assetBalance) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): PsmSwapOut<ToPhantomTypeArgument<T>> { if (json.$typeName !== PsmSwapOut.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(PsmSwapOut.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return PsmSwapOut.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): PsmSwapOut<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPsmSwapOut(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PsmSwapOut object`); } return PsmSwapOut.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): PsmSwapOut<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPsmSwapOut(data.bcs.type)) { throw new Error(`object at is not a PsmSwapOut object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return PsmSwapOut.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PsmSwapOut.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<PsmSwapOut<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PsmSwapOut object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPsmSwapOut(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PsmSwapOut object`); }

 return PsmSwapOut.fromSuiObjectData( typeArg, res.data ); }

 }
