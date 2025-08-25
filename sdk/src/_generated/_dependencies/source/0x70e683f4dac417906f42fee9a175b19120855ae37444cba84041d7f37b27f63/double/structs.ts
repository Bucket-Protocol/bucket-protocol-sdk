import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== Double =============================== */

export function isDouble(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::double::Double`; }

export interface DoubleFields { value: ToField<"u256"> }

export type DoubleReified = Reified< Double, DoubleFields >;

export class Double implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::double::Double`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Double.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::double::Double`; readonly $typeArgs: []; readonly $isPhantom = Double.$isPhantom;

 readonly value: ToField<"u256">

 private constructor(typeArgs: [], fields: DoubleFields, ) { this.$fullTypeName = composeSuiType( Double.$typeName, ...typeArgs ) as `${typeof PKG_V1}::double::Double`; this.$typeArgs = typeArgs;

 this.value = fields.value; }

 static reified( ): DoubleReified { const reifiedBcs = Double.bcs; return { typeName: Double.$typeName, fullTypeName: composeSuiType( Double.$typeName, ...[] ) as `${typeof PKG_V1}::double::Double`, typeArgs: [ ] as [], isPhantom: Double.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Double.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Double.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Double.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Double.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Double.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Double.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Double.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Double.fetch( client, id, ), new: ( fields: DoubleFields, ) => { return new Double( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Double.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Double>> { return phantom(Double.reified( )); } static get p() { return Double.phantom() }

 private static instantiateBcs() { return bcs.struct("Double", {

 value: bcs.u256()

}) };

 private static cachedBcs: ReturnType<typeof Double.instantiateBcs> | null = null;

 static get bcs() { if (!Double.cachedBcs) { Double.cachedBcs = Double.instantiateBcs() } return Double.cachedBcs };

 static fromFields( fields: Record<string, any> ): Double { return Double.reified( ).new( { value: decodeFromFields("u256", fields.value) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Double { if (!isDouble(item.type)) { throw new Error("not a Double type");

 }

 return Double.reified( ).new( { value: decodeFromFieldsWithTypes("u256", item.fields.value) } ) }

 static fromBcs( data: Uint8Array ): Double { return Double.fromFields( Double.bcs.parse(data) ) }

 toJSONField() { return {

 value: this.value.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Double { return Double.reified( ).new( { value: decodeFromJSONField("u256", field.value) } ) }

 static fromJSON( json: Record<string, any> ): Double { if (json.$typeName !== Double.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Double.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Double { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDouble(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Double object`); } return Double.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Double { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDouble(data.bcs.type)) { throw new Error(`object at is not a Double object`); }

 return Double.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Double.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Double> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Double object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDouble(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Double object`); }

 return Double.fromSuiObjectData( res.data ); }

 }
