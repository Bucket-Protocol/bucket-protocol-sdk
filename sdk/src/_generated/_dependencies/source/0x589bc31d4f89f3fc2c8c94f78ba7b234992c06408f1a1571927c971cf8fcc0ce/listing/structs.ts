import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {TypeName} from "../../0x1/type-name/structs";
import {ID, UID} from "../../0x2/object/structs";
import {VecMap} from "../../0x2/vec-map/structs";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== ListingCap =============================== */

export function isListingCap(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::listing::ListingCap`; }

export interface ListingCapFields { id: ToField<UID>; aggregatorMap: ToField<VecMap<TypeName, ID>> }

export type ListingCapReified = Reified< ListingCap, ListingCapFields >;

export class ListingCap implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::listing::ListingCap`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = ListingCap.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::listing::ListingCap`; readonly $typeArgs: []; readonly $isPhantom = ListingCap.$isPhantom;

 readonly id: ToField<UID>; readonly aggregatorMap: ToField<VecMap<TypeName, ID>>

 private constructor(typeArgs: [], fields: ListingCapFields, ) { this.$fullTypeName = composeSuiType( ListingCap.$typeName, ...typeArgs ) as `${typeof PKG_V1}::listing::ListingCap`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.aggregatorMap = fields.aggregatorMap; }

 static reified( ): ListingCapReified { const reifiedBcs = ListingCap.bcs; return { typeName: ListingCap.$typeName, fullTypeName: composeSuiType( ListingCap.$typeName, ...[] ) as `${typeof PKG_V1}::listing::ListingCap`, typeArgs: [ ] as [], isPhantom: ListingCap.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => ListingCap.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ListingCap.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => ListingCap.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => ListingCap.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => ListingCap.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => ListingCap.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => ListingCap.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => ListingCap.fetch( client, id, ), new: ( fields: ListingCapFields, ) => { return new ListingCap( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return ListingCap.reified() }

 static phantom( ): PhantomReified<ToTypeStr<ListingCap>> { return phantom(ListingCap.reified( )); } static get p() { return ListingCap.phantom() }

 private static instantiateBcs() { return bcs.struct("ListingCap", {

 id: UID.bcs, aggregator_map: VecMap.bcs(TypeName.bcs, ID.bcs)

}) };

 private static cachedBcs: ReturnType<typeof ListingCap.instantiateBcs> | null = null;

 static get bcs() { if (!ListingCap.cachedBcs) { ListingCap.cachedBcs = ListingCap.instantiateBcs() } return ListingCap.cachedBcs };

 static fromFields( fields: Record<string, any> ): ListingCap { return ListingCap.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), aggregatorMap: decodeFromFields(VecMap.reified(TypeName.reified(), ID.reified()), fields.aggregator_map) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): ListingCap { if (!isListingCap(item.type)) { throw new Error("not a ListingCap type");

 }

 return ListingCap.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), aggregatorMap: decodeFromFieldsWithTypes(VecMap.reified(TypeName.reified(), ID.reified()), item.fields.aggregator_map) } ) }

 static fromBcs( data: Uint8Array ): ListingCap { return ListingCap.fromFields( ListingCap.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,aggregatorMap: this.aggregatorMap.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): ListingCap { return ListingCap.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), aggregatorMap: decodeFromJSONField(VecMap.reified(TypeName.reified(), ID.reified()), field.aggregatorMap) } ) }

 static fromJSON( json: Record<string, any> ): ListingCap { if (json.$typeName !== ListingCap.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return ListingCap.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): ListingCap { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isListingCap(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ListingCap object`); } return ListingCap.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): ListingCap { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isListingCap(data.bcs.type)) { throw new Error(`object at is not a ListingCap object`); }

 return ListingCap.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ListingCap.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<ListingCap> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ListingCap object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isListingCap(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ListingCap object`); }

 return ListingCap.fromSuiObjectData( res.data ); }

 }
