import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== StageConfig =============================== */

export function isStageConfig(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::stage::StageConfig`; }

export interface StageConfigFields { whitelistTime: ToField<"u64">; publicTime: ToField<"u64">; endTime: ToField<"u64"> }

export type StageConfigReified = Reified< StageConfig, StageConfigFields >;

export class StageConfig implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::stage::StageConfig`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = StageConfig.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::stage::StageConfig`; readonly $typeArgs: []; readonly $isPhantom = StageConfig.$isPhantom;

 readonly whitelistTime: ToField<"u64">; readonly publicTime: ToField<"u64">; readonly endTime: ToField<"u64">

 private constructor(typeArgs: [], fields: StageConfigFields, ) { this.$fullTypeName = composeSuiType( StageConfig.$typeName, ...typeArgs ) as `${typeof PKG_V1}::stage::StageConfig`; this.$typeArgs = typeArgs;

 this.whitelistTime = fields.whitelistTime;; this.publicTime = fields.publicTime;; this.endTime = fields.endTime; }

 static reified( ): StageConfigReified { return { typeName: StageConfig.$typeName, fullTypeName: composeSuiType( StageConfig.$typeName, ...[] ) as `${typeof PKG_V1}::stage::StageConfig`, typeArgs: [ ] as [], isPhantom: StageConfig.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => StageConfig.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => StageConfig.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => StageConfig.fromBcs( data, ), bcs: StageConfig.bcs, fromJSONField: (field: any) => StageConfig.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => StageConfig.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => StageConfig.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => StageConfig.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => StageConfig.fetch( client, id, ), new: ( fields: StageConfigFields, ) => { return new StageConfig( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return StageConfig.reified() }

 static phantom( ): PhantomReified<ToTypeStr<StageConfig>> { return phantom(StageConfig.reified( )); } static get p() { return StageConfig.phantom() }

 static get bcs() { return bcs.struct("StageConfig", {

 whitelist_time: bcs.u64(), public_time: bcs.u64(), end_time: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): StageConfig { return StageConfig.reified( ).new( { whitelistTime: decodeFromFields("u64", fields.whitelist_time), publicTime: decodeFromFields("u64", fields.public_time), endTime: decodeFromFields("u64", fields.end_time) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): StageConfig { if (!isStageConfig(item.type)) { throw new Error("not a StageConfig type");

 }

 return StageConfig.reified( ).new( { whitelistTime: decodeFromFieldsWithTypes("u64", item.fields.whitelist_time), publicTime: decodeFromFieldsWithTypes("u64", item.fields.public_time), endTime: decodeFromFieldsWithTypes("u64", item.fields.end_time) } ) }

 static fromBcs( data: Uint8Array ): StageConfig { return StageConfig.fromFields( StageConfig.bcs.parse(data) ) }

 toJSONField() { return {

 whitelistTime: this.whitelistTime.toString(),publicTime: this.publicTime.toString(),endTime: this.endTime.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): StageConfig { return StageConfig.reified( ).new( { whitelistTime: decodeFromJSONField("u64", field.whitelistTime), publicTime: decodeFromJSONField("u64", field.publicTime), endTime: decodeFromJSONField("u64", field.endTime) } ) }

 static fromJSON( json: Record<string, any> ): StageConfig { if (json.$typeName !== StageConfig.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return StageConfig.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): StageConfig { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isStageConfig(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a StageConfig object`); } return StageConfig.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): StageConfig { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isStageConfig(data.bcs.type)) { throw new Error(`object at is not a StageConfig object`); }

 return StageConfig.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return StageConfig.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<StageConfig> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching StageConfig object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isStageConfig(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a StageConfig object`); }

 return StageConfig.fromSuiObjectData( res.data ); }

 }
