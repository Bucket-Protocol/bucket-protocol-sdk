import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== LimitedSupply =============================== */

export function isLimitedSupply(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::limited_supply::LimitedSupply`; }

export interface LimitedSupplyFields { limit: ToField<"u64">; supply: ToField<"u64"> }

export type LimitedSupplyReified = Reified< LimitedSupply, LimitedSupplyFields >;

export class LimitedSupply implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::limited_supply::LimitedSupply`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = LimitedSupply.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::limited_supply::LimitedSupply`; readonly $typeArgs: []; readonly $isPhantom = LimitedSupply.$isPhantom;

 readonly limit: ToField<"u64">; readonly supply: ToField<"u64">

 private constructor(typeArgs: [], fields: LimitedSupplyFields, ) { this.$fullTypeName = composeSuiType( LimitedSupply.$typeName, ...typeArgs ) as `${typeof PKG_V1}::limited_supply::LimitedSupply`; this.$typeArgs = typeArgs;

 this.limit = fields.limit;; this.supply = fields.supply; }

 static reified( ): LimitedSupplyReified { const reifiedBcs = LimitedSupply.bcs; return { typeName: LimitedSupply.$typeName, fullTypeName: composeSuiType( LimitedSupply.$typeName, ...[] ) as `${typeof PKG_V1}::limited_supply::LimitedSupply`, typeArgs: [ ] as [], isPhantom: LimitedSupply.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => LimitedSupply.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => LimitedSupply.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => LimitedSupply.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => LimitedSupply.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => LimitedSupply.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => LimitedSupply.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => LimitedSupply.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => LimitedSupply.fetch( client, id, ), new: ( fields: LimitedSupplyFields, ) => { return new LimitedSupply( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return LimitedSupply.reified() }

 static phantom( ): PhantomReified<ToTypeStr<LimitedSupply>> { return phantom(LimitedSupply.reified( )); } static get p() { return LimitedSupply.phantom() }

 private static instantiateBcs() { return bcs.struct("LimitedSupply", {

 limit: bcs.u64(), supply: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof LimitedSupply.instantiateBcs> | null = null;

 static get bcs() { if (!LimitedSupply.cachedBcs) { LimitedSupply.cachedBcs = LimitedSupply.instantiateBcs() } return LimitedSupply.cachedBcs };

 static fromFields( fields: Record<string, any> ): LimitedSupply { return LimitedSupply.reified( ).new( { limit: decodeFromFields("u64", fields.limit), supply: decodeFromFields("u64", fields.supply) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): LimitedSupply { if (!isLimitedSupply(item.type)) { throw new Error("not a LimitedSupply type");

 }

 return LimitedSupply.reified( ).new( { limit: decodeFromFieldsWithTypes("u64", item.fields.limit), supply: decodeFromFieldsWithTypes("u64", item.fields.supply) } ) }

 static fromBcs( data: Uint8Array ): LimitedSupply { return LimitedSupply.fromFields( LimitedSupply.bcs.parse(data) ) }

 toJSONField() { return {

 limit: this.limit.toString(),supply: this.supply.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): LimitedSupply { return LimitedSupply.reified( ).new( { limit: decodeFromJSONField("u64", field.limit), supply: decodeFromJSONField("u64", field.supply) } ) }

 static fromJSON( json: Record<string, any> ): LimitedSupply { if (json.$typeName !== LimitedSupply.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return LimitedSupply.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): LimitedSupply { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isLimitedSupply(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a LimitedSupply object`); } return LimitedSupply.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): LimitedSupply { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isLimitedSupply(data.bcs.type)) { throw new Error(`object at is not a LimitedSupply object`); }

 return LimitedSupply.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return LimitedSupply.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<LimitedSupply> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching LimitedSupply object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isLimitedSupply(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a LimitedSupply object`); }

 return LimitedSupply.fromSuiObjectData( res.data ); }

 }
