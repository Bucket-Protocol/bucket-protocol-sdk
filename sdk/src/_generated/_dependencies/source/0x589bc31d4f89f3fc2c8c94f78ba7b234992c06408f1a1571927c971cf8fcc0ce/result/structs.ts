import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {Float} from "../../0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/float/structs";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== PriceResult =============================== */

export function isPriceResult(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::result::PriceResult` + '<'); }

export interface PriceResultFields<T extends PhantomTypeArgument> { aggregatedPrice: ToField<Float> }

export type PriceResultReified<T extends PhantomTypeArgument> = Reified< PriceResult<T>, PriceResultFields<T> >;

export class PriceResult<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::result::PriceResult`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = PriceResult.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::result::PriceResult<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = PriceResult.$isPhantom;

 readonly aggregatedPrice: ToField<Float>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: PriceResultFields<T>, ) { this.$fullTypeName = composeSuiType( PriceResult.$typeName, ...typeArgs ) as `${typeof PKG_V1}::result::PriceResult<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.aggregatedPrice = fields.aggregatedPrice; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PriceResultReified<ToPhantomTypeArgument<T>> { const reifiedBcs = PriceResult.bcs; return { typeName: PriceResult.$typeName, fullTypeName: composeSuiType( PriceResult.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::result::PriceResult<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: PriceResult.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => PriceResult.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PriceResult.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => PriceResult.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => PriceResult.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => PriceResult.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => PriceResult.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => PriceResult.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => PriceResult.fetch( client, T, id, ), new: ( fields: PriceResultFields<ToPhantomTypeArgument<T>>, ) => { return new PriceResult( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return PriceResult.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<PriceResult<ToPhantomTypeArgument<T>>>> { return phantom(PriceResult.reified( T )); } static get p() { return PriceResult.phantom }

 private static instantiateBcs() { return bcs.struct("PriceResult", {

 aggregated_price: Float.bcs

}) };

 private static cachedBcs: ReturnType<typeof PriceResult.instantiateBcs> | null = null;

 static get bcs() { if (!PriceResult.cachedBcs) { PriceResult.cachedBcs = PriceResult.instantiateBcs() } return PriceResult.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): PriceResult<ToPhantomTypeArgument<T>> { return PriceResult.reified( typeArg, ).new( { aggregatedPrice: decodeFromFields(Float.reified(), fields.aggregated_price) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): PriceResult<ToPhantomTypeArgument<T>> { if (!isPriceResult(item.type)) { throw new Error("not a PriceResult type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return PriceResult.reified( typeArg, ).new( { aggregatedPrice: decodeFromFieldsWithTypes(Float.reified(), item.fields.aggregated_price) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): PriceResult<ToPhantomTypeArgument<T>> { return PriceResult.fromFields( typeArg, PriceResult.bcs.parse(data) ) }

 toJSONField() { return {

 aggregatedPrice: this.aggregatedPrice.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): PriceResult<ToPhantomTypeArgument<T>> { return PriceResult.reified( typeArg, ).new( { aggregatedPrice: decodeFromJSONField(Float.reified(), field.aggregatedPrice) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): PriceResult<ToPhantomTypeArgument<T>> { if (json.$typeName !== PriceResult.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(PriceResult.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return PriceResult.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): PriceResult<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPriceResult(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PriceResult object`); } return PriceResult.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): PriceResult<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPriceResult(data.bcs.type)) { throw new Error(`object at is not a PriceResult object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return PriceResult.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PriceResult.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<PriceResult<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PriceResult object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPriceResult(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PriceResult object`); }

 return PriceResult.fromSuiObjectData( typeArg, res.data ); }

 }
