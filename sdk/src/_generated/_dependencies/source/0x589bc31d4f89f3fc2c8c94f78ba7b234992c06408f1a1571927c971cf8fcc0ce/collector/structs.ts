import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {TypeName} from "../../0x1/type-name/structs";
import {VecMap} from "../../0x2/vec-map/structs";
import {Float} from "../../0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/float/structs";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== PriceCollector =============================== */

export function isPriceCollector(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::collector::PriceCollector` + '<'); }

export interface PriceCollectorFields<T extends PhantomTypeArgument> { contents: ToField<VecMap<TypeName, Float>> }

export type PriceCollectorReified<T extends PhantomTypeArgument> = Reified< PriceCollector<T>, PriceCollectorFields<T> >;

export class PriceCollector<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::collector::PriceCollector`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = PriceCollector.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::collector::PriceCollector<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = PriceCollector.$isPhantom;

 readonly contents: ToField<VecMap<TypeName, Float>>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: PriceCollectorFields<T>, ) { this.$fullTypeName = composeSuiType( PriceCollector.$typeName, ...typeArgs ) as `${typeof PKG_V1}::collector::PriceCollector<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.contents = fields.contents; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PriceCollectorReified<ToPhantomTypeArgument<T>> { const reifiedBcs = PriceCollector.bcs; return { typeName: PriceCollector.$typeName, fullTypeName: composeSuiType( PriceCollector.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::collector::PriceCollector<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: PriceCollector.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => PriceCollector.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PriceCollector.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => PriceCollector.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => PriceCollector.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => PriceCollector.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => PriceCollector.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => PriceCollector.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => PriceCollector.fetch( client, T, id, ), new: ( fields: PriceCollectorFields<ToPhantomTypeArgument<T>>, ) => { return new PriceCollector( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return PriceCollector.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<PriceCollector<ToPhantomTypeArgument<T>>>> { return phantom(PriceCollector.reified( T )); } static get p() { return PriceCollector.phantom }

 private static instantiateBcs() { return bcs.struct("PriceCollector", {

 contents: VecMap.bcs(TypeName.bcs, Float.bcs)

}) };

 private static cachedBcs: ReturnType<typeof PriceCollector.instantiateBcs> | null = null;

 static get bcs() { if (!PriceCollector.cachedBcs) { PriceCollector.cachedBcs = PriceCollector.instantiateBcs() } return PriceCollector.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): PriceCollector<ToPhantomTypeArgument<T>> { return PriceCollector.reified( typeArg, ).new( { contents: decodeFromFields(VecMap.reified(TypeName.reified(), Float.reified()), fields.contents) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): PriceCollector<ToPhantomTypeArgument<T>> { if (!isPriceCollector(item.type)) { throw new Error("not a PriceCollector type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return PriceCollector.reified( typeArg, ).new( { contents: decodeFromFieldsWithTypes(VecMap.reified(TypeName.reified(), Float.reified()), item.fields.contents) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): PriceCollector<ToPhantomTypeArgument<T>> { return PriceCollector.fromFields( typeArg, PriceCollector.bcs.parse(data) ) }

 toJSONField() { return {

 contents: this.contents.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): PriceCollector<ToPhantomTypeArgument<T>> { return PriceCollector.reified( typeArg, ).new( { contents: decodeFromJSONField(VecMap.reified(TypeName.reified(), Float.reified()), field.contents) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): PriceCollector<ToPhantomTypeArgument<T>> { if (json.$typeName !== PriceCollector.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(PriceCollector.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return PriceCollector.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): PriceCollector<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPriceCollector(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PriceCollector object`); } return PriceCollector.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): PriceCollector<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPriceCollector(data.bcs.type)) { throw new Error(`object at is not a PriceCollector object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return PriceCollector.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PriceCollector.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<PriceCollector<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PriceCollector object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPriceCollector(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PriceCollector object`); }

 return PriceCollector.fromSuiObjectData( typeArg, res.data ); }

 }
