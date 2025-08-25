import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== BucketV2PSM =============================== */

export function isBucketV2PSM(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::witness::BucketV2PSM`; }

export interface BucketV2PSMFields { dummyField: ToField<"bool"> }

export type BucketV2PSMReified = Reified< BucketV2PSM, BucketV2PSMFields >;

export class BucketV2PSM implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::witness::BucketV2PSM`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = BucketV2PSM.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::witness::BucketV2PSM`; readonly $typeArgs: []; readonly $isPhantom = BucketV2PSM.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: BucketV2PSMFields, ) { this.$fullTypeName = composeSuiType( BucketV2PSM.$typeName, ...typeArgs ) as `${typeof PKG_V1}::witness::BucketV2PSM`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): BucketV2PSMReified { const reifiedBcs = BucketV2PSM.bcs; return { typeName: BucketV2PSM.$typeName, fullTypeName: composeSuiType( BucketV2PSM.$typeName, ...[] ) as `${typeof PKG_V1}::witness::BucketV2PSM`, typeArgs: [ ] as [], isPhantom: BucketV2PSM.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => BucketV2PSM.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => BucketV2PSM.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => BucketV2PSM.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => BucketV2PSM.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => BucketV2PSM.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => BucketV2PSM.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => BucketV2PSM.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => BucketV2PSM.fetch( client, id, ), new: ( fields: BucketV2PSMFields, ) => { return new BucketV2PSM( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return BucketV2PSM.reified() }

 static phantom( ): PhantomReified<ToTypeStr<BucketV2PSM>> { return phantom(BucketV2PSM.reified( )); } static get p() { return BucketV2PSM.phantom() }

 private static instantiateBcs() { return bcs.struct("BucketV2PSM", {

 dummy_field: bcs.bool()

}) };

 private static cachedBcs: ReturnType<typeof BucketV2PSM.instantiateBcs> | null = null;

 static get bcs() { if (!BucketV2PSM.cachedBcs) { BucketV2PSM.cachedBcs = BucketV2PSM.instantiateBcs() } return BucketV2PSM.cachedBcs };

 static fromFields( fields: Record<string, any> ): BucketV2PSM { return BucketV2PSM.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): BucketV2PSM { if (!isBucketV2PSM(item.type)) { throw new Error("not a BucketV2PSM type");

 }

 return BucketV2PSM.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): BucketV2PSM { return BucketV2PSM.fromFields( BucketV2PSM.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): BucketV2PSM { return BucketV2PSM.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): BucketV2PSM { if (json.$typeName !== BucketV2PSM.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return BucketV2PSM.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): BucketV2PSM { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isBucketV2PSM(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a BucketV2PSM object`); } return BucketV2PSM.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): BucketV2PSM { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isBucketV2PSM(data.bcs.type)) { throw new Error(`object at is not a BucketV2PSM object`); }

 return BucketV2PSM.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return BucketV2PSM.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<BucketV2PSM> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching BucketV2PSM object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isBucketV2PSM(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a BucketV2PSM object`); }

 return BucketV2PSM.fromSuiObjectData( res.data ); }

 }
