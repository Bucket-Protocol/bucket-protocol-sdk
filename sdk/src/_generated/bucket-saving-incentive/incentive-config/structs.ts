import {UID} from "../../_dependencies/source/0x2/object/structs";
import {VecSet} from "../../_dependencies/source/0x2/vec-set/structs";
import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== GlobalConfig =============================== */

export function isGlobalConfig(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::incentive_config::GlobalConfig`; }

export interface GlobalConfigFields { id: ToField<UID>; versions: ToField<VecSet<"u16">>; managers: ToField<VecSet<"address">> }

export type GlobalConfigReified = Reified< GlobalConfig, GlobalConfigFields >;

export class GlobalConfig implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::incentive_config::GlobalConfig`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = GlobalConfig.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::incentive_config::GlobalConfig`; readonly $typeArgs: []; readonly $isPhantom = GlobalConfig.$isPhantom;

 readonly id: ToField<UID>; readonly versions: ToField<VecSet<"u16">>; readonly managers: ToField<VecSet<"address">>

 private constructor(typeArgs: [], fields: GlobalConfigFields, ) { this.$fullTypeName = composeSuiType( GlobalConfig.$typeName, ...typeArgs ) as `${typeof PKG_V1}::incentive_config::GlobalConfig`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.versions = fields.versions;; this.managers = fields.managers; }

 static reified( ): GlobalConfigReified { const reifiedBcs = GlobalConfig.bcs; return { typeName: GlobalConfig.$typeName, fullTypeName: composeSuiType( GlobalConfig.$typeName, ...[] ) as `${typeof PKG_V1}::incentive_config::GlobalConfig`, typeArgs: [ ] as [], isPhantom: GlobalConfig.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => GlobalConfig.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => GlobalConfig.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => GlobalConfig.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => GlobalConfig.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => GlobalConfig.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => GlobalConfig.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => GlobalConfig.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => GlobalConfig.fetch( client, id, ), new: ( fields: GlobalConfigFields, ) => { return new GlobalConfig( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return GlobalConfig.reified() }

 static phantom( ): PhantomReified<ToTypeStr<GlobalConfig>> { return phantom(GlobalConfig.reified( )); } static get p() { return GlobalConfig.phantom() }

 private static instantiateBcs() { return bcs.struct("GlobalConfig", {

 id: UID.bcs, versions: VecSet.bcs(bcs.u16()), managers: VecSet.bcs(bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }))

}) };

 private static cachedBcs: ReturnType<typeof GlobalConfig.instantiateBcs> | null = null;

 static get bcs() { if (!GlobalConfig.cachedBcs) { GlobalConfig.cachedBcs = GlobalConfig.instantiateBcs() } return GlobalConfig.cachedBcs };

 static fromFields( fields: Record<string, any> ): GlobalConfig { return GlobalConfig.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), versions: decodeFromFields(VecSet.reified("u16"), fields.versions), managers: decodeFromFields(VecSet.reified("address"), fields.managers) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): GlobalConfig { if (!isGlobalConfig(item.type)) { throw new Error("not a GlobalConfig type");

 }

 return GlobalConfig.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), versions: decodeFromFieldsWithTypes(VecSet.reified("u16"), item.fields.versions), managers: decodeFromFieldsWithTypes(VecSet.reified("address"), item.fields.managers) } ) }

 static fromBcs( data: Uint8Array ): GlobalConfig { return GlobalConfig.fromFields( GlobalConfig.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,versions: this.versions.toJSONField(),managers: this.managers.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): GlobalConfig { return GlobalConfig.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), versions: decodeFromJSONField(VecSet.reified("u16"), field.versions), managers: decodeFromJSONField(VecSet.reified("address"), field.managers) } ) }

 static fromJSON( json: Record<string, any> ): GlobalConfig { if (json.$typeName !== GlobalConfig.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return GlobalConfig.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): GlobalConfig { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isGlobalConfig(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a GlobalConfig object`); } return GlobalConfig.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): GlobalConfig { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isGlobalConfig(data.bcs.type)) { throw new Error(`object at is not a GlobalConfig object`); }

 return GlobalConfig.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return GlobalConfig.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<GlobalConfig> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching GlobalConfig object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isGlobalConfig(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a GlobalConfig object`); }

 return GlobalConfig.fromSuiObjectData( res.data ); }

 }
