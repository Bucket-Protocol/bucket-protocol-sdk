import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {String} from "../../0x1/string/structs";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== CollectFee =============================== */

export function isCollectFee(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::treasury::CollectFee` + '<'); }

export interface CollectFeeFields<M extends PhantomTypeArgument> { memo: ToField<String>; coinType: ToField<String>; amount: ToField<"u64"> }

export type CollectFeeReified<M extends PhantomTypeArgument> = Reified< CollectFee<M>, CollectFeeFields<M> >;

export class CollectFee<M extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::treasury::CollectFee`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = CollectFee.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::treasury::CollectFee<${PhantomToTypeStr<M>}>`; readonly $typeArgs: [PhantomToTypeStr<M>]; readonly $isPhantom = CollectFee.$isPhantom;

 readonly memo: ToField<String>; readonly coinType: ToField<String>; readonly amount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<M>], fields: CollectFeeFields<M>, ) { this.$fullTypeName = composeSuiType( CollectFee.$typeName, ...typeArgs ) as `${typeof PKG_V1}::treasury::CollectFee<${PhantomToTypeStr<M>}>`; this.$typeArgs = typeArgs;

 this.memo = fields.memo;; this.coinType = fields.coinType;; this.amount = fields.amount; }

 static reified<M extends PhantomReified<PhantomTypeArgument>>( M: M ): CollectFeeReified<ToPhantomTypeArgument<M>> { const reifiedBcs = CollectFee.bcs; return { typeName: CollectFee.$typeName, fullTypeName: composeSuiType( CollectFee.$typeName, ...[extractType(M)] ) as `${typeof PKG_V1}::treasury::CollectFee<${PhantomToTypeStr<ToPhantomTypeArgument<M>>}>`, typeArgs: [ extractType(M) ] as [PhantomToTypeStr<ToPhantomTypeArgument<M>>], isPhantom: CollectFee.$isPhantom, reifiedTypeArgs: [M], fromFields: (fields: Record<string, any>) => CollectFee.fromFields( M, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => CollectFee.fromFieldsWithTypes( M, item, ), fromBcs: (data: Uint8Array) => CollectFee.fromFields( M, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => CollectFee.fromJSONField( M, field, ), fromJSON: (json: Record<string, any>) => CollectFee.fromJSON( M, json, ), fromSuiParsedData: (content: SuiParsedData) => CollectFee.fromSuiParsedData( M, content, ), fromSuiObjectData: (content: SuiObjectData) => CollectFee.fromSuiObjectData( M, content, ), fetch: async (client: SuiClient, id: string) => CollectFee.fetch( client, M, id, ), new: ( fields: CollectFeeFields<ToPhantomTypeArgument<M>>, ) => { return new CollectFee( [extractType(M)], fields ) }, kind: "StructClassReified", } }

 static get r() { return CollectFee.reified }

 static phantom<M extends PhantomReified<PhantomTypeArgument>>( M: M ): PhantomReified<ToTypeStr<CollectFee<ToPhantomTypeArgument<M>>>> { return phantom(CollectFee.reified( M )); } static get p() { return CollectFee.phantom }

 private static instantiateBcs() { return bcs.struct("CollectFee", {

 memo: String.bcs, coin_type: String.bcs, amount: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof CollectFee.instantiateBcs> | null = null;

 static get bcs() { if (!CollectFee.cachedBcs) { CollectFee.cachedBcs = CollectFee.instantiateBcs() } return CollectFee.cachedBcs };

 static fromFields<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, fields: Record<string, any> ): CollectFee<ToPhantomTypeArgument<M>> { return CollectFee.reified( typeArg, ).new( { memo: decodeFromFields(String.reified(), fields.memo), coinType: decodeFromFields(String.reified(), fields.coin_type), amount: decodeFromFields("u64", fields.amount) } ) }

 static fromFieldsWithTypes<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, item: FieldsWithTypes ): CollectFee<ToPhantomTypeArgument<M>> { if (!isCollectFee(item.type)) { throw new Error("not a CollectFee type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return CollectFee.reified( typeArg, ).new( { memo: decodeFromFieldsWithTypes(String.reified(), item.fields.memo), coinType: decodeFromFieldsWithTypes(String.reified(), item.fields.coin_type), amount: decodeFromFieldsWithTypes("u64", item.fields.amount) } ) }

 static fromBcs<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, data: Uint8Array ): CollectFee<ToPhantomTypeArgument<M>> { return CollectFee.fromFields( typeArg, CollectFee.bcs.parse(data) ) }

 toJSONField() { return {

 memo: this.memo,coinType: this.coinType,amount: this.amount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, field: any ): CollectFee<ToPhantomTypeArgument<M>> { return CollectFee.reified( typeArg, ).new( { memo: decodeFromJSONField(String.reified(), field.memo), coinType: decodeFromJSONField(String.reified(), field.coinType), amount: decodeFromJSONField("u64", field.amount) } ) }

 static fromJSON<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, json: Record<string, any> ): CollectFee<ToPhantomTypeArgument<M>> { if (json.$typeName !== CollectFee.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(CollectFee.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return CollectFee.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, content: SuiParsedData ): CollectFee<ToPhantomTypeArgument<M>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCollectFee(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a CollectFee object`); } return CollectFee.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, data: SuiObjectData ): CollectFee<ToPhantomTypeArgument<M>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isCollectFee(data.bcs.type)) { throw new Error(`object at is not a CollectFee object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return CollectFee.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return CollectFee.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<M extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: M, id: string ): Promise<CollectFee<ToPhantomTypeArgument<M>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching CollectFee object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isCollectFee(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a CollectFee object`); }

 return CollectFee.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== ClaimFee =============================== */

export function isClaimFee(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::treasury::ClaimFee` + '<'); }

export interface ClaimFeeFields<M extends PhantomTypeArgument> { coinType: ToField<String>; amount: ToField<"u64"> }

export type ClaimFeeReified<M extends PhantomTypeArgument> = Reified< ClaimFee<M>, ClaimFeeFields<M> >;

export class ClaimFee<M extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::treasury::ClaimFee`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = ClaimFee.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::treasury::ClaimFee<${PhantomToTypeStr<M>}>`; readonly $typeArgs: [PhantomToTypeStr<M>]; readonly $isPhantom = ClaimFee.$isPhantom;

 readonly coinType: ToField<String>; readonly amount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<M>], fields: ClaimFeeFields<M>, ) { this.$fullTypeName = composeSuiType( ClaimFee.$typeName, ...typeArgs ) as `${typeof PKG_V1}::treasury::ClaimFee<${PhantomToTypeStr<M>}>`; this.$typeArgs = typeArgs;

 this.coinType = fields.coinType;; this.amount = fields.amount; }

 static reified<M extends PhantomReified<PhantomTypeArgument>>( M: M ): ClaimFeeReified<ToPhantomTypeArgument<M>> { const reifiedBcs = ClaimFee.bcs; return { typeName: ClaimFee.$typeName, fullTypeName: composeSuiType( ClaimFee.$typeName, ...[extractType(M)] ) as `${typeof PKG_V1}::treasury::ClaimFee<${PhantomToTypeStr<ToPhantomTypeArgument<M>>}>`, typeArgs: [ extractType(M) ] as [PhantomToTypeStr<ToPhantomTypeArgument<M>>], isPhantom: ClaimFee.$isPhantom, reifiedTypeArgs: [M], fromFields: (fields: Record<string, any>) => ClaimFee.fromFields( M, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ClaimFee.fromFieldsWithTypes( M, item, ), fromBcs: (data: Uint8Array) => ClaimFee.fromFields( M, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => ClaimFee.fromJSONField( M, field, ), fromJSON: (json: Record<string, any>) => ClaimFee.fromJSON( M, json, ), fromSuiParsedData: (content: SuiParsedData) => ClaimFee.fromSuiParsedData( M, content, ), fromSuiObjectData: (content: SuiObjectData) => ClaimFee.fromSuiObjectData( M, content, ), fetch: async (client: SuiClient, id: string) => ClaimFee.fetch( client, M, id, ), new: ( fields: ClaimFeeFields<ToPhantomTypeArgument<M>>, ) => { return new ClaimFee( [extractType(M)], fields ) }, kind: "StructClassReified", } }

 static get r() { return ClaimFee.reified }

 static phantom<M extends PhantomReified<PhantomTypeArgument>>( M: M ): PhantomReified<ToTypeStr<ClaimFee<ToPhantomTypeArgument<M>>>> { return phantom(ClaimFee.reified( M )); } static get p() { return ClaimFee.phantom }

 private static instantiateBcs() { return bcs.struct("ClaimFee", {

 coin_type: String.bcs, amount: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof ClaimFee.instantiateBcs> | null = null;

 static get bcs() { if (!ClaimFee.cachedBcs) { ClaimFee.cachedBcs = ClaimFee.instantiateBcs() } return ClaimFee.cachedBcs };

 static fromFields<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, fields: Record<string, any> ): ClaimFee<ToPhantomTypeArgument<M>> { return ClaimFee.reified( typeArg, ).new( { coinType: decodeFromFields(String.reified(), fields.coin_type), amount: decodeFromFields("u64", fields.amount) } ) }

 static fromFieldsWithTypes<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, item: FieldsWithTypes ): ClaimFee<ToPhantomTypeArgument<M>> { if (!isClaimFee(item.type)) { throw new Error("not a ClaimFee type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return ClaimFee.reified( typeArg, ).new( { coinType: decodeFromFieldsWithTypes(String.reified(), item.fields.coin_type), amount: decodeFromFieldsWithTypes("u64", item.fields.amount) } ) }

 static fromBcs<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, data: Uint8Array ): ClaimFee<ToPhantomTypeArgument<M>> { return ClaimFee.fromFields( typeArg, ClaimFee.bcs.parse(data) ) }

 toJSONField() { return {

 coinType: this.coinType,amount: this.amount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, field: any ): ClaimFee<ToPhantomTypeArgument<M>> { return ClaimFee.reified( typeArg, ).new( { coinType: decodeFromJSONField(String.reified(), field.coinType), amount: decodeFromJSONField("u64", field.amount) } ) }

 static fromJSON<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, json: Record<string, any> ): ClaimFee<ToPhantomTypeArgument<M>> { if (json.$typeName !== ClaimFee.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(ClaimFee.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return ClaimFee.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, content: SuiParsedData ): ClaimFee<ToPhantomTypeArgument<M>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isClaimFee(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ClaimFee object`); } return ClaimFee.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<M extends PhantomReified<PhantomTypeArgument>>( typeArg: M, data: SuiObjectData ): ClaimFee<ToPhantomTypeArgument<M>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isClaimFee(data.bcs.type)) { throw new Error(`object at is not a ClaimFee object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return ClaimFee.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ClaimFee.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<M extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: M, id: string ): Promise<ClaimFee<ToPhantomTypeArgument<M>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ClaimFee object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isClaimFee(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ClaimFee object`); }

 return ClaimFee.fromSuiObjectData( typeArg, res.data ); }

 }
