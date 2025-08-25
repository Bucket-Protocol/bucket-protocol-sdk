import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== BucketV2Saving =============================== */

export function isBucketV2Saving(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::witness::BucketV2Saving`; }

export interface BucketV2SavingFields { dummyField: ToField<"bool"> }

export type BucketV2SavingReified = Reified< BucketV2Saving, BucketV2SavingFields >;

export class BucketV2Saving implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::witness::BucketV2Saving`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = BucketV2Saving.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::witness::BucketV2Saving`; readonly $typeArgs: []; readonly $isPhantom = BucketV2Saving.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: BucketV2SavingFields, ) { this.$fullTypeName = composeSuiType( BucketV2Saving.$typeName, ...typeArgs ) as `${typeof PKG_V1}::witness::BucketV2Saving`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): BucketV2SavingReified { const reifiedBcs = BucketV2Saving.bcs; return { typeName: BucketV2Saving.$typeName, fullTypeName: composeSuiType( BucketV2Saving.$typeName, ...[] ) as `${typeof PKG_V1}::witness::BucketV2Saving`, typeArgs: [ ] as [], isPhantom: BucketV2Saving.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => BucketV2Saving.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => BucketV2Saving.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => BucketV2Saving.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => BucketV2Saving.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => BucketV2Saving.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => BucketV2Saving.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => BucketV2Saving.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => BucketV2Saving.fetch( client, id, ), new: ( fields: BucketV2SavingFields, ) => { return new BucketV2Saving( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return BucketV2Saving.reified() }

 static phantom( ): PhantomReified<ToTypeStr<BucketV2Saving>> { return phantom(BucketV2Saving.reified( )); } static get p() { return BucketV2Saving.phantom() }

 private static instantiateBcs() { return bcs.struct("BucketV2Saving", {

 dummy_field: bcs.bool()

}) };

 private static cachedBcs: ReturnType<typeof BucketV2Saving.instantiateBcs> | null = null;

 static get bcs() { if (!BucketV2Saving.cachedBcs) { BucketV2Saving.cachedBcs = BucketV2Saving.instantiateBcs() } return BucketV2Saving.cachedBcs };

 static fromFields( fields: Record<string, any> ): BucketV2Saving { return BucketV2Saving.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): BucketV2Saving { if (!isBucketV2Saving(item.type)) { throw new Error("not a BucketV2Saving type");

 }

 return BucketV2Saving.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): BucketV2Saving { return BucketV2Saving.fromFields( BucketV2Saving.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): BucketV2Saving { return BucketV2Saving.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): BucketV2Saving { if (json.$typeName !== BucketV2Saving.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return BucketV2Saving.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): BucketV2Saving { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isBucketV2Saving(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a BucketV2Saving object`); } return BucketV2Saving.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): BucketV2Saving { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isBucketV2Saving(data.bcs.type)) { throw new Error(`object at is not a BucketV2Saving object`); }

 return BucketV2Saving.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return BucketV2Saving.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<BucketV2Saving> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching BucketV2Saving object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isBucketV2Saving(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a BucketV2Saving object`); }

 return BucketV2Saving.fromSuiObjectData( res.data ); }

 }
