import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== Float =============================== */

export function isFloat(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::float::Float`; }

export interface FloatFields { value: ToField<"u128"> }

export type FloatReified = Reified< Float, FloatFields >;

export class Float implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::float::Float`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Float.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::float::Float`; readonly $typeArgs: []; readonly $isPhantom = Float.$isPhantom;

 readonly value: ToField<"u128">

 private constructor(typeArgs: [], fields: FloatFields, ) { this.$fullTypeName = composeSuiType( Float.$typeName, ...typeArgs ) as `${typeof PKG_V1}::float::Float`; this.$typeArgs = typeArgs;

 this.value = fields.value; }

 static reified( ): FloatReified { const reifiedBcs = Float.bcs; return { typeName: Float.$typeName, fullTypeName: composeSuiType( Float.$typeName, ...[] ) as `${typeof PKG_V1}::float::Float`, typeArgs: [ ] as [], isPhantom: Float.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Float.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Float.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Float.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Float.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Float.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Float.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Float.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Float.fetch( client, id, ), new: ( fields: FloatFields, ) => { return new Float( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Float.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Float>> { return phantom(Float.reified( )); } static get p() { return Float.phantom() }

 private static instantiateBcs() { return bcs.struct("Float", {

 value: bcs.u128()

}) };

 private static cachedBcs: ReturnType<typeof Float.instantiateBcs> | null = null;

 static get bcs() { if (!Float.cachedBcs) { Float.cachedBcs = Float.instantiateBcs() } return Float.cachedBcs };

 static fromFields( fields: Record<string, any> ): Float { return Float.reified( ).new( { value: decodeFromFields("u128", fields.value) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Float { if (!isFloat(item.type)) { throw new Error("not a Float type");

 }

 return Float.reified( ).new( { value: decodeFromFieldsWithTypes("u128", item.fields.value) } ) }

 static fromBcs( data: Uint8Array ): Float { return Float.fromFields( Float.bcs.parse(data) ) }

 toJSONField() { return {

 value: this.value.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Float { return Float.reified( ).new( { value: decodeFromJSONField("u128", field.value) } ) }

 static fromJSON( json: Record<string, any> ): Float { if (json.$typeName !== Float.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Float.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Float { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isFloat(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Float object`); } return Float.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Float { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isFloat(data.bcs.type)) { throw new Error(`object at is not a Float object`); }

 return Float.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Float.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Float> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Float object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isFloat(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Float object`); }

 return Float.fromSuiObjectData( res.data ); }

 }
