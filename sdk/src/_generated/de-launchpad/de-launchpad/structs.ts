import * as reified from "../../_framework/reified";
import {Balance} from "../../_dependencies/source/0x2/balance/structs";
import {ID, UID} from "../../_dependencies/source/0x2/object/structs";
import {Table} from "../../_dependencies/source/0x2/table/structs";
import {VecSet} from "../../_dependencies/source/0x2/vec-set/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom, ToTypeStr as ToPhantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {Float} from "../../liquidlogic-framework/float/structs";
import {PKG_V1} from "../index";
import {StageConfig} from "../stage/structs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== Allocation =============================== */

export function isAllocation(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_launchpad::Allocation`; }

export interface AllocationFields { quota: ToField<"u64">; allocated: ToField<"u64"> }

export type AllocationReified = Reified< Allocation, AllocationFields >;

export class Allocation implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_launchpad::Allocation`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Allocation.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_launchpad::Allocation`; readonly $typeArgs: []; readonly $isPhantom = Allocation.$isPhantom;

 readonly quota: ToField<"u64">; readonly allocated: ToField<"u64">

 private constructor(typeArgs: [], fields: AllocationFields, ) { this.$fullTypeName = composeSuiType( Allocation.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_launchpad::Allocation`; this.$typeArgs = typeArgs;

 this.quota = fields.quota;; this.allocated = fields.allocated; }

 static reified( ): AllocationReified { return { typeName: Allocation.$typeName, fullTypeName: composeSuiType( Allocation.$typeName, ...[] ) as `${typeof PKG_V1}::de_launchpad::Allocation`, typeArgs: [ ] as [], isPhantom: Allocation.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Allocation.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Allocation.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Allocation.fromBcs( data, ), bcs: Allocation.bcs, fromJSONField: (field: any) => Allocation.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Allocation.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Allocation.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Allocation.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Allocation.fetch( client, id, ), new: ( fields: AllocationFields, ) => { return new Allocation( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Allocation.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Allocation>> { return phantom(Allocation.reified( )); } static get p() { return Allocation.phantom() }

 static get bcs() { return bcs.struct("Allocation", {

 quota: bcs.u64(), allocated: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): Allocation { return Allocation.reified( ).new( { quota: decodeFromFields("u64", fields.quota), allocated: decodeFromFields("u64", fields.allocated) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Allocation { if (!isAllocation(item.type)) { throw new Error("not a Allocation type");

 }

 return Allocation.reified( ).new( { quota: decodeFromFieldsWithTypes("u64", item.fields.quota), allocated: decodeFromFieldsWithTypes("u64", item.fields.allocated) } ) }

 static fromBcs( data: Uint8Array ): Allocation { return Allocation.fromFields( Allocation.bcs.parse(data) ) }

 toJSONField() { return {

 quota: this.quota.toString(),allocated: this.allocated.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Allocation { return Allocation.reified( ).new( { quota: decodeFromJSONField("u64", field.quota), allocated: decodeFromJSONField("u64", field.allocated) } ) }

 static fromJSON( json: Record<string, any> ): Allocation { if (json.$typeName !== Allocation.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Allocation.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Allocation { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isAllocation(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Allocation object`); } return Allocation.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Allocation { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isAllocation(data.bcs.type)) { throw new Error(`object at is not a Allocation object`); }

 return Allocation.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Allocation.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Allocation> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Allocation object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isAllocation(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Allocation object`); }

 return Allocation.fromSuiObjectData( res.data ); }

 }

/* ============================== DeLaunchpad =============================== */

export function isDeLaunchpad(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_launchpad::DeLaunchpad` + '<'); }

export interface DeLaunchpadFields<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> { id: ToField<UID>; poolIn: ToField<Balance<IN>>; poolOut: ToField<Balance<OUT>>; whitelistAllocations: ToField<Table<"address", ToPhantom<Allocation>>>; publicAllocations: ToField<Table<"address", ToPhantom<Allocation>>>; whitelistTotalSale: ToField<"u64">; publicTotalSale: ToField<"u64">; maxPublicQuota: ToField<"u64">; price: ToField<Float>; stageConfig: ToField<StageConfig>; managers: ToField<VecSet<"address">> }

export type DeLaunchpadReified<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< DeLaunchpad<IN, OUT, P>, DeLaunchpadFields<IN, OUT, P> >;

export class DeLaunchpad<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_launchpad::DeLaunchpad`; static readonly $numTypeParams = 3; static readonly $isPhantom = [true,true,true,] as const;

 readonly $typeName = DeLaunchpad.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_launchpad::DeLaunchpad<${PhantomToTypeStr<IN>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<IN>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>]; readonly $isPhantom = DeLaunchpad.$isPhantom;

 readonly id: ToField<UID>; readonly poolIn: ToField<Balance<IN>>; readonly poolOut: ToField<Balance<OUT>>; readonly whitelistAllocations: ToField<Table<"address", ToPhantom<Allocation>>>; readonly publicAllocations: ToField<Table<"address", ToPhantom<Allocation>>>; readonly whitelistTotalSale: ToField<"u64">; readonly publicTotalSale: ToField<"u64">; readonly maxPublicQuota: ToField<"u64">; readonly price: ToField<Float>; readonly stageConfig: ToField<StageConfig>; readonly managers: ToField<VecSet<"address">>

 private constructor(typeArgs: [PhantomToTypeStr<IN>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>], fields: DeLaunchpadFields<IN, OUT, P>, ) { this.$fullTypeName = composeSuiType( DeLaunchpad.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_launchpad::DeLaunchpad<${PhantomToTypeStr<IN>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.poolIn = fields.poolIn;; this.poolOut = fields.poolOut;; this.whitelistAllocations = fields.whitelistAllocations;; this.publicAllocations = fields.publicAllocations;; this.whitelistTotalSale = fields.whitelistTotalSale;; this.publicTotalSale = fields.publicTotalSale;; this.maxPublicQuota = fields.maxPublicQuota;; this.price = fields.price;; this.stageConfig = fields.stageConfig;; this.managers = fields.managers; }

 static reified<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( IN: IN, OUT: OUT, P: P ): DeLaunchpadReified<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return { typeName: DeLaunchpad.$typeName, fullTypeName: composeSuiType( DeLaunchpad.$typeName, ...[extractType(IN), extractType(OUT), extractType(P)] ) as `${typeof PKG_V1}::de_launchpad::DeLaunchpad<${PhantomToTypeStr<ToPhantomTypeArgument<IN>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<OUT>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(IN), extractType(OUT), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<IN>>, PhantomToTypeStr<ToPhantomTypeArgument<OUT>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: DeLaunchpad.$isPhantom, reifiedTypeArgs: [IN, OUT, P], fromFields: (fields: Record<string, any>) => DeLaunchpad.fromFields( [IN, OUT, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DeLaunchpad.fromFieldsWithTypes( [IN, OUT, P], item, ), fromBcs: (data: Uint8Array) => DeLaunchpad.fromBcs( [IN, OUT, P], data, ), bcs: DeLaunchpad.bcs, fromJSONField: (field: any) => DeLaunchpad.fromJSONField( [IN, OUT, P], field, ), fromJSON: (json: Record<string, any>) => DeLaunchpad.fromJSON( [IN, OUT, P], json, ), fromSuiParsedData: (content: SuiParsedData) => DeLaunchpad.fromSuiParsedData( [IN, OUT, P], content, ), fromSuiObjectData: (content: SuiObjectData) => DeLaunchpad.fromSuiObjectData( [IN, OUT, P], content, ), fetch: async (client: SuiClient, id: string) => DeLaunchpad.fetch( client, [IN, OUT, P], id, ), new: ( fields: DeLaunchpadFields<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>, ) => { return new DeLaunchpad( [extractType(IN), extractType(OUT), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DeLaunchpad.reified }

 static phantom<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( IN: IN, OUT: OUT, P: P ): PhantomReified<ToTypeStr<DeLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>>> { return phantom(DeLaunchpad.reified( IN, OUT, P )); } static get p() { return DeLaunchpad.phantom }

 static get bcs() { return bcs.struct("DeLaunchpad", {

 id: UID.bcs, pool_in: Balance.bcs, pool_out: Balance.bcs, whitelist_allocations: Table.bcs, public_allocations: Table.bcs, whitelist_total_sale: bcs.u64(), public_total_sale: bcs.u64(), max_public_quota: bcs.u64(), price: Float.bcs, stage_config: StageConfig.bcs, managers: VecSet.bcs(bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }))

}) };

 static fromFields<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], fields: Record<string, any> ): DeLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return DeLaunchpad.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { id: decodeFromFields(UID.reified(), fields.id), poolIn: decodeFromFields(Balance.reified(typeArgs[0]), fields.pool_in), poolOut: decodeFromFields(Balance.reified(typeArgs[1]), fields.pool_out), whitelistAllocations: decodeFromFields(Table.reified(reified.phantom("address"), reified.phantom(Allocation.reified())), fields.whitelist_allocations), publicAllocations: decodeFromFields(Table.reified(reified.phantom("address"), reified.phantom(Allocation.reified())), fields.public_allocations), whitelistTotalSale: decodeFromFields("u64", fields.whitelist_total_sale), publicTotalSale: decodeFromFields("u64", fields.public_total_sale), maxPublicQuota: decodeFromFields("u64", fields.max_public_quota), price: decodeFromFields(Float.reified(), fields.price), stageConfig: decodeFromFields(StageConfig.reified(), fields.stage_config), managers: decodeFromFields(VecSet.reified("address"), fields.managers) } ) }

 static fromFieldsWithTypes<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], item: FieldsWithTypes ): DeLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (!isDeLaunchpad(item.type)) { throw new Error("not a DeLaunchpad type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return DeLaunchpad.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), poolIn: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.pool_in), poolOut: decodeFromFieldsWithTypes(Balance.reified(typeArgs[1]), item.fields.pool_out), whitelistAllocations: decodeFromFieldsWithTypes(Table.reified(reified.phantom("address"), reified.phantom(Allocation.reified())), item.fields.whitelist_allocations), publicAllocations: decodeFromFieldsWithTypes(Table.reified(reified.phantom("address"), reified.phantom(Allocation.reified())), item.fields.public_allocations), whitelistTotalSale: decodeFromFieldsWithTypes("u64", item.fields.whitelist_total_sale), publicTotalSale: decodeFromFieldsWithTypes("u64", item.fields.public_total_sale), maxPublicQuota: decodeFromFieldsWithTypes("u64", item.fields.max_public_quota), price: decodeFromFieldsWithTypes(Float.reified(), item.fields.price), stageConfig: decodeFromFieldsWithTypes(StageConfig.reified(), item.fields.stage_config), managers: decodeFromFieldsWithTypes(VecSet.reified("address"), item.fields.managers) } ) }

 static fromBcs<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], data: Uint8Array ): DeLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return DeLaunchpad.fromFields( typeArgs, DeLaunchpad.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,poolIn: this.poolIn.toJSONField(),poolOut: this.poolOut.toJSONField(),whitelistAllocations: this.whitelistAllocations.toJSONField(),publicAllocations: this.publicAllocations.toJSONField(),whitelistTotalSale: this.whitelistTotalSale.toString(),publicTotalSale: this.publicTotalSale.toString(),maxPublicQuota: this.maxPublicQuota.toString(),price: this.price.toJSONField(),stageConfig: this.stageConfig.toJSONField(),managers: this.managers.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], field: any ): DeLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return DeLaunchpad.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { id: decodeFromJSONField(UID.reified(), field.id), poolIn: decodeFromJSONField(Balance.reified(typeArgs[0]), field.poolIn), poolOut: decodeFromJSONField(Balance.reified(typeArgs[1]), field.poolOut), whitelistAllocations: decodeFromJSONField(Table.reified(reified.phantom("address"), reified.phantom(Allocation.reified())), field.whitelistAllocations), publicAllocations: decodeFromJSONField(Table.reified(reified.phantom("address"), reified.phantom(Allocation.reified())), field.publicAllocations), whitelistTotalSale: decodeFromJSONField("u64", field.whitelistTotalSale), publicTotalSale: decodeFromJSONField("u64", field.publicTotalSale), maxPublicQuota: decodeFromJSONField("u64", field.maxPublicQuota), price: decodeFromJSONField(Float.reified(), field.price), stageConfig: decodeFromJSONField(StageConfig.reified(), field.stageConfig), managers: decodeFromJSONField(VecSet.reified("address"), field.managers) } ) }

 static fromJSON<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], json: Record<string, any> ): DeLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (json.$typeName !== DeLaunchpad.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DeLaunchpad.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return DeLaunchpad.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], content: SuiParsedData ): DeLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDeLaunchpad(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DeLaunchpad object`); } return DeLaunchpad.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], data: SuiObjectData ): DeLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDeLaunchpad(data.bcs.type)) { throw new Error(`object at is not a DeLaunchpad object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 3) { throw new Error(`type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 3; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return DeLaunchpad.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DeLaunchpad.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [IN, OUT, P], id: string ): Promise<DeLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DeLaunchpad object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDeLaunchpad(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DeLaunchpad object`); }

 return DeLaunchpad.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== NewLaunchpad =============================== */

export function isNewLaunchpad(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_launchpad::NewLaunchpad` + '<'); }

export interface NewLaunchpadFields<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> { padId: ToField<ID>; totalSale: ToField<"u64">; maxPublicQuota: ToField<"u64">; price: ToField<Float>; stageConfig: ToField<StageConfig> }

export type NewLaunchpadReified<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< NewLaunchpad<IN, OUT, P>, NewLaunchpadFields<IN, OUT, P> >;

export class NewLaunchpad<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_launchpad::NewLaunchpad`; static readonly $numTypeParams = 3; static readonly $isPhantom = [true,true,true,] as const;

 readonly $typeName = NewLaunchpad.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_launchpad::NewLaunchpad<${PhantomToTypeStr<IN>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<IN>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>]; readonly $isPhantom = NewLaunchpad.$isPhantom;

 readonly padId: ToField<ID>; readonly totalSale: ToField<"u64">; readonly maxPublicQuota: ToField<"u64">; readonly price: ToField<Float>; readonly stageConfig: ToField<StageConfig>

 private constructor(typeArgs: [PhantomToTypeStr<IN>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>], fields: NewLaunchpadFields<IN, OUT, P>, ) { this.$fullTypeName = composeSuiType( NewLaunchpad.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_launchpad::NewLaunchpad<${PhantomToTypeStr<IN>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.padId = fields.padId;; this.totalSale = fields.totalSale;; this.maxPublicQuota = fields.maxPublicQuota;; this.price = fields.price;; this.stageConfig = fields.stageConfig; }

 static reified<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( IN: IN, OUT: OUT, P: P ): NewLaunchpadReified<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return { typeName: NewLaunchpad.$typeName, fullTypeName: composeSuiType( NewLaunchpad.$typeName, ...[extractType(IN), extractType(OUT), extractType(P)] ) as `${typeof PKG_V1}::de_launchpad::NewLaunchpad<${PhantomToTypeStr<ToPhantomTypeArgument<IN>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<OUT>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(IN), extractType(OUT), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<IN>>, PhantomToTypeStr<ToPhantomTypeArgument<OUT>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: NewLaunchpad.$isPhantom, reifiedTypeArgs: [IN, OUT, P], fromFields: (fields: Record<string, any>) => NewLaunchpad.fromFields( [IN, OUT, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => NewLaunchpad.fromFieldsWithTypes( [IN, OUT, P], item, ), fromBcs: (data: Uint8Array) => NewLaunchpad.fromBcs( [IN, OUT, P], data, ), bcs: NewLaunchpad.bcs, fromJSONField: (field: any) => NewLaunchpad.fromJSONField( [IN, OUT, P], field, ), fromJSON: (json: Record<string, any>) => NewLaunchpad.fromJSON( [IN, OUT, P], json, ), fromSuiParsedData: (content: SuiParsedData) => NewLaunchpad.fromSuiParsedData( [IN, OUT, P], content, ), fromSuiObjectData: (content: SuiObjectData) => NewLaunchpad.fromSuiObjectData( [IN, OUT, P], content, ), fetch: async (client: SuiClient, id: string) => NewLaunchpad.fetch( client, [IN, OUT, P], id, ), new: ( fields: NewLaunchpadFields<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>, ) => { return new NewLaunchpad( [extractType(IN), extractType(OUT), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return NewLaunchpad.reified }

 static phantom<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( IN: IN, OUT: OUT, P: P ): PhantomReified<ToTypeStr<NewLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>>> { return phantom(NewLaunchpad.reified( IN, OUT, P )); } static get p() { return NewLaunchpad.phantom }

 static get bcs() { return bcs.struct("NewLaunchpad", {

 pad_id: ID.bcs, total_sale: bcs.u64(), max_public_quota: bcs.u64(), price: Float.bcs, stage_config: StageConfig.bcs

}) };

 static fromFields<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], fields: Record<string, any> ): NewLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return NewLaunchpad.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromFields(ID.reified(), fields.pad_id), totalSale: decodeFromFields("u64", fields.total_sale), maxPublicQuota: decodeFromFields("u64", fields.max_public_quota), price: decodeFromFields(Float.reified(), fields.price), stageConfig: decodeFromFields(StageConfig.reified(), fields.stage_config) } ) }

 static fromFieldsWithTypes<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], item: FieldsWithTypes ): NewLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (!isNewLaunchpad(item.type)) { throw new Error("not a NewLaunchpad type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return NewLaunchpad.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pad_id), totalSale: decodeFromFieldsWithTypes("u64", item.fields.total_sale), maxPublicQuota: decodeFromFieldsWithTypes("u64", item.fields.max_public_quota), price: decodeFromFieldsWithTypes(Float.reified(), item.fields.price), stageConfig: decodeFromFieldsWithTypes(StageConfig.reified(), item.fields.stage_config) } ) }

 static fromBcs<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], data: Uint8Array ): NewLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return NewLaunchpad.fromFields( typeArgs, NewLaunchpad.bcs.parse(data) ) }

 toJSONField() { return {

 padId: this.padId,totalSale: this.totalSale.toString(),maxPublicQuota: this.maxPublicQuota.toString(),price: this.price.toJSONField(),stageConfig: this.stageConfig.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], field: any ): NewLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return NewLaunchpad.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromJSONField(ID.reified(), field.padId), totalSale: decodeFromJSONField("u64", field.totalSale), maxPublicQuota: decodeFromJSONField("u64", field.maxPublicQuota), price: decodeFromJSONField(Float.reified(), field.price), stageConfig: decodeFromJSONField(StageConfig.reified(), field.stageConfig) } ) }

 static fromJSON<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], json: Record<string, any> ): NewLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (json.$typeName !== NewLaunchpad.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(NewLaunchpad.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return NewLaunchpad.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], content: SuiParsedData ): NewLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isNewLaunchpad(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a NewLaunchpad object`); } return NewLaunchpad.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], data: SuiObjectData ): NewLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isNewLaunchpad(data.bcs.type)) { throw new Error(`object at is not a NewLaunchpad object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 3) { throw new Error(`type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 3; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return NewLaunchpad.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return NewLaunchpad.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [IN, OUT, P], id: string ): Promise<NewLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching NewLaunchpad object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isNewLaunchpad(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a NewLaunchpad object`); }

 return NewLaunchpad.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== PublicPurchase =============================== */

export function isPublicPurchase(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_launchpad::PublicPurchase` + '<'); }

export interface PublicPurchaseFields<In extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> { padId: ToField<ID>; account: ToField<"address">; amount: ToField<"u64"> }

export type PublicPurchaseReified<In extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< PublicPurchase<In, OUT, P>, PublicPurchaseFields<In, OUT, P> >;

export class PublicPurchase<In extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_launchpad::PublicPurchase`; static readonly $numTypeParams = 3; static readonly $isPhantom = [true,true,true,] as const;

 readonly $typeName = PublicPurchase.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_launchpad::PublicPurchase<${PhantomToTypeStr<In>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<In>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>]; readonly $isPhantom = PublicPurchase.$isPhantom;

 readonly padId: ToField<ID>; readonly account: ToField<"address">; readonly amount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<In>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>], fields: PublicPurchaseFields<In, OUT, P>, ) { this.$fullTypeName = composeSuiType( PublicPurchase.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_launchpad::PublicPurchase<${PhantomToTypeStr<In>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.padId = fields.padId;; this.account = fields.account;; this.amount = fields.amount; }

 static reified<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( In: In, OUT: OUT, P: P ): PublicPurchaseReified<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return { typeName: PublicPurchase.$typeName, fullTypeName: composeSuiType( PublicPurchase.$typeName, ...[extractType(In), extractType(OUT), extractType(P)] ) as `${typeof PKG_V1}::de_launchpad::PublicPurchase<${PhantomToTypeStr<ToPhantomTypeArgument<In>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<OUT>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(In), extractType(OUT), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<In>>, PhantomToTypeStr<ToPhantomTypeArgument<OUT>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: PublicPurchase.$isPhantom, reifiedTypeArgs: [In, OUT, P], fromFields: (fields: Record<string, any>) => PublicPurchase.fromFields( [In, OUT, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PublicPurchase.fromFieldsWithTypes( [In, OUT, P], item, ), fromBcs: (data: Uint8Array) => PublicPurchase.fromBcs( [In, OUT, P], data, ), bcs: PublicPurchase.bcs, fromJSONField: (field: any) => PublicPurchase.fromJSONField( [In, OUT, P], field, ), fromJSON: (json: Record<string, any>) => PublicPurchase.fromJSON( [In, OUT, P], json, ), fromSuiParsedData: (content: SuiParsedData) => PublicPurchase.fromSuiParsedData( [In, OUT, P], content, ), fromSuiObjectData: (content: SuiObjectData) => PublicPurchase.fromSuiObjectData( [In, OUT, P], content, ), fetch: async (client: SuiClient, id: string) => PublicPurchase.fetch( client, [In, OUT, P], id, ), new: ( fields: PublicPurchaseFields<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>, ) => { return new PublicPurchase( [extractType(In), extractType(OUT), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return PublicPurchase.reified }

 static phantom<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( In: In, OUT: OUT, P: P ): PhantomReified<ToTypeStr<PublicPurchase<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>>> { return phantom(PublicPurchase.reified( In, OUT, P )); } static get p() { return PublicPurchase.phantom }

 static get bcs() { return bcs.struct("PublicPurchase", {

 pad_id: ID.bcs, account: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), amount: bcs.u64()

}) };

 static fromFields<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [In, OUT, P], fields: Record<string, any> ): PublicPurchase<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return PublicPurchase.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromFields(ID.reified(), fields.pad_id), account: decodeFromFields("address", fields.account), amount: decodeFromFields("u64", fields.amount) } ) }

 static fromFieldsWithTypes<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [In, OUT, P], item: FieldsWithTypes ): PublicPurchase<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (!isPublicPurchase(item.type)) { throw new Error("not a PublicPurchase type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return PublicPurchase.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pad_id), account: decodeFromFieldsWithTypes("address", item.fields.account), amount: decodeFromFieldsWithTypes("u64", item.fields.amount) } ) }

 static fromBcs<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [In, OUT, P], data: Uint8Array ): PublicPurchase<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return PublicPurchase.fromFields( typeArgs, PublicPurchase.bcs.parse(data) ) }

 toJSONField() { return {

 padId: this.padId,account: this.account,amount: this.amount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [In, OUT, P], field: any ): PublicPurchase<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return PublicPurchase.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromJSONField(ID.reified(), field.padId), account: decodeFromJSONField("address", field.account), amount: decodeFromJSONField("u64", field.amount) } ) }

 static fromJSON<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [In, OUT, P], json: Record<string, any> ): PublicPurchase<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (json.$typeName !== PublicPurchase.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(PublicPurchase.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return PublicPurchase.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [In, OUT, P], content: SuiParsedData ): PublicPurchase<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPublicPurchase(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PublicPurchase object`); } return PublicPurchase.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [In, OUT, P], data: SuiObjectData ): PublicPurchase<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPublicPurchase(data.bcs.type)) { throw new Error(`object at is not a PublicPurchase object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 3) { throw new Error(`type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 3; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return PublicPurchase.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PublicPurchase.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<In extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [In, OUT, P], id: string ): Promise<PublicPurchase<ToPhantomTypeArgument<In>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PublicPurchase object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPublicPurchase(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PublicPurchase object`); }

 return PublicPurchase.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== WhitelistPurchase =============================== */

export function isWhitelistPurchase(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_launchpad::WhitelistPurchase` + '<'); }

export interface WhitelistPurchaseFields<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> { padId: ToField<ID>; account: ToField<"address">; amount: ToField<"u64"> }

export type WhitelistPurchaseReified<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< WhitelistPurchase<IN, OUT, P>, WhitelistPurchaseFields<IN, OUT, P> >;

export class WhitelistPurchase<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_launchpad::WhitelistPurchase`; static readonly $numTypeParams = 3; static readonly $isPhantom = [true,true,true,] as const;

 readonly $typeName = WhitelistPurchase.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_launchpad::WhitelistPurchase<${PhantomToTypeStr<IN>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<IN>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>]; readonly $isPhantom = WhitelistPurchase.$isPhantom;

 readonly padId: ToField<ID>; readonly account: ToField<"address">; readonly amount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<IN>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>], fields: WhitelistPurchaseFields<IN, OUT, P>, ) { this.$fullTypeName = composeSuiType( WhitelistPurchase.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_launchpad::WhitelistPurchase<${PhantomToTypeStr<IN>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.padId = fields.padId;; this.account = fields.account;; this.amount = fields.amount; }

 static reified<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( IN: IN, OUT: OUT, P: P ): WhitelistPurchaseReified<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return { typeName: WhitelistPurchase.$typeName, fullTypeName: composeSuiType( WhitelistPurchase.$typeName, ...[extractType(IN), extractType(OUT), extractType(P)] ) as `${typeof PKG_V1}::de_launchpad::WhitelistPurchase<${PhantomToTypeStr<ToPhantomTypeArgument<IN>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<OUT>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(IN), extractType(OUT), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<IN>>, PhantomToTypeStr<ToPhantomTypeArgument<OUT>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: WhitelistPurchase.$isPhantom, reifiedTypeArgs: [IN, OUT, P], fromFields: (fields: Record<string, any>) => WhitelistPurchase.fromFields( [IN, OUT, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => WhitelistPurchase.fromFieldsWithTypes( [IN, OUT, P], item, ), fromBcs: (data: Uint8Array) => WhitelistPurchase.fromBcs( [IN, OUT, P], data, ), bcs: WhitelistPurchase.bcs, fromJSONField: (field: any) => WhitelistPurchase.fromJSONField( [IN, OUT, P], field, ), fromJSON: (json: Record<string, any>) => WhitelistPurchase.fromJSON( [IN, OUT, P], json, ), fromSuiParsedData: (content: SuiParsedData) => WhitelistPurchase.fromSuiParsedData( [IN, OUT, P], content, ), fromSuiObjectData: (content: SuiObjectData) => WhitelistPurchase.fromSuiObjectData( [IN, OUT, P], content, ), fetch: async (client: SuiClient, id: string) => WhitelistPurchase.fetch( client, [IN, OUT, P], id, ), new: ( fields: WhitelistPurchaseFields<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>, ) => { return new WhitelistPurchase( [extractType(IN), extractType(OUT), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return WhitelistPurchase.reified }

 static phantom<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( IN: IN, OUT: OUT, P: P ): PhantomReified<ToTypeStr<WhitelistPurchase<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>>> { return phantom(WhitelistPurchase.reified( IN, OUT, P )); } static get p() { return WhitelistPurchase.phantom }

 static get bcs() { return bcs.struct("WhitelistPurchase", {

 pad_id: ID.bcs, account: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), amount: bcs.u64()

}) };

 static fromFields<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], fields: Record<string, any> ): WhitelistPurchase<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return WhitelistPurchase.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromFields(ID.reified(), fields.pad_id), account: decodeFromFields("address", fields.account), amount: decodeFromFields("u64", fields.amount) } ) }

 static fromFieldsWithTypes<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], item: FieldsWithTypes ): WhitelistPurchase<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (!isWhitelistPurchase(item.type)) { throw new Error("not a WhitelistPurchase type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return WhitelistPurchase.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pad_id), account: decodeFromFieldsWithTypes("address", item.fields.account), amount: decodeFromFieldsWithTypes("u64", item.fields.amount) } ) }

 static fromBcs<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], data: Uint8Array ): WhitelistPurchase<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return WhitelistPurchase.fromFields( typeArgs, WhitelistPurchase.bcs.parse(data) ) }

 toJSONField() { return {

 padId: this.padId,account: this.account,amount: this.amount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], field: any ): WhitelistPurchase<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return WhitelistPurchase.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromJSONField(ID.reified(), field.padId), account: decodeFromJSONField("address", field.account), amount: decodeFromJSONField("u64", field.amount) } ) }

 static fromJSON<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], json: Record<string, any> ): WhitelistPurchase<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (json.$typeName !== WhitelistPurchase.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(WhitelistPurchase.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return WhitelistPurchase.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], content: SuiParsedData ): WhitelistPurchase<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isWhitelistPurchase(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a WhitelistPurchase object`); } return WhitelistPurchase.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], data: SuiObjectData ): WhitelistPurchase<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isWhitelistPurchase(data.bcs.type)) { throw new Error(`object at is not a WhitelistPurchase object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 3) { throw new Error(`type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 3; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return WhitelistPurchase.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return WhitelistPurchase.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [IN, OUT, P], id: string ): Promise<WhitelistPurchase<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching WhitelistPurchase object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isWhitelistPurchase(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a WhitelistPurchase object`); }

 return WhitelistPurchase.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== WithdrawLaunchpad =============================== */

export function isWithdrawLaunchpad(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_launchpad::WithdrawLaunchpad` + '<'); }

export interface WithdrawLaunchpadFields<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> { padId: ToField<ID>; surplus: ToField<"u64">; earning: ToField<"u64"> }

export type WithdrawLaunchpadReified<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< WithdrawLaunchpad<IN, OUT, P>, WithdrawLaunchpadFields<IN, OUT, P> >;

export class WithdrawLaunchpad<IN extends PhantomTypeArgument, OUT extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_launchpad::WithdrawLaunchpad`; static readonly $numTypeParams = 3; static readonly $isPhantom = [true,true,true,] as const;

 readonly $typeName = WithdrawLaunchpad.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_launchpad::WithdrawLaunchpad<${PhantomToTypeStr<IN>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<IN>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>]; readonly $isPhantom = WithdrawLaunchpad.$isPhantom;

 readonly padId: ToField<ID>; readonly surplus: ToField<"u64">; readonly earning: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<IN>, PhantomToTypeStr<OUT>, PhantomToTypeStr<P>], fields: WithdrawLaunchpadFields<IN, OUT, P>, ) { this.$fullTypeName = composeSuiType( WithdrawLaunchpad.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_launchpad::WithdrawLaunchpad<${PhantomToTypeStr<IN>}, ${PhantomToTypeStr<OUT>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.padId = fields.padId;; this.surplus = fields.surplus;; this.earning = fields.earning; }

 static reified<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( IN: IN, OUT: OUT, P: P ): WithdrawLaunchpadReified<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return { typeName: WithdrawLaunchpad.$typeName, fullTypeName: composeSuiType( WithdrawLaunchpad.$typeName, ...[extractType(IN), extractType(OUT), extractType(P)] ) as `${typeof PKG_V1}::de_launchpad::WithdrawLaunchpad<${PhantomToTypeStr<ToPhantomTypeArgument<IN>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<OUT>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(IN), extractType(OUT), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<IN>>, PhantomToTypeStr<ToPhantomTypeArgument<OUT>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: WithdrawLaunchpad.$isPhantom, reifiedTypeArgs: [IN, OUT, P], fromFields: (fields: Record<string, any>) => WithdrawLaunchpad.fromFields( [IN, OUT, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => WithdrawLaunchpad.fromFieldsWithTypes( [IN, OUT, P], item, ), fromBcs: (data: Uint8Array) => WithdrawLaunchpad.fromBcs( [IN, OUT, P], data, ), bcs: WithdrawLaunchpad.bcs, fromJSONField: (field: any) => WithdrawLaunchpad.fromJSONField( [IN, OUT, P], field, ), fromJSON: (json: Record<string, any>) => WithdrawLaunchpad.fromJSON( [IN, OUT, P], json, ), fromSuiParsedData: (content: SuiParsedData) => WithdrawLaunchpad.fromSuiParsedData( [IN, OUT, P], content, ), fromSuiObjectData: (content: SuiObjectData) => WithdrawLaunchpad.fromSuiObjectData( [IN, OUT, P], content, ), fetch: async (client: SuiClient, id: string) => WithdrawLaunchpad.fetch( client, [IN, OUT, P], id, ), new: ( fields: WithdrawLaunchpadFields<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>, ) => { return new WithdrawLaunchpad( [extractType(IN), extractType(OUT), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return WithdrawLaunchpad.reified }

 static phantom<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( IN: IN, OUT: OUT, P: P ): PhantomReified<ToTypeStr<WithdrawLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>>> { return phantom(WithdrawLaunchpad.reified( IN, OUT, P )); } static get p() { return WithdrawLaunchpad.phantom }

 static get bcs() { return bcs.struct("WithdrawLaunchpad", {

 pad_id: ID.bcs, surplus: bcs.u64(), earning: bcs.u64()

}) };

 static fromFields<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], fields: Record<string, any> ): WithdrawLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return WithdrawLaunchpad.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromFields(ID.reified(), fields.pad_id), surplus: decodeFromFields("u64", fields.surplus), earning: decodeFromFields("u64", fields.earning) } ) }

 static fromFieldsWithTypes<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], item: FieldsWithTypes ): WithdrawLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (!isWithdrawLaunchpad(item.type)) { throw new Error("not a WithdrawLaunchpad type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return WithdrawLaunchpad.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pad_id), surplus: decodeFromFieldsWithTypes("u64", item.fields.surplus), earning: decodeFromFieldsWithTypes("u64", item.fields.earning) } ) }

 static fromBcs<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], data: Uint8Array ): WithdrawLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return WithdrawLaunchpad.fromFields( typeArgs, WithdrawLaunchpad.bcs.parse(data) ) }

 toJSONField() { return {

 padId: this.padId,surplus: this.surplus.toString(),earning: this.earning.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], field: any ): WithdrawLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { return WithdrawLaunchpad.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { padId: decodeFromJSONField(ID.reified(), field.padId), surplus: decodeFromJSONField("u64", field.surplus), earning: decodeFromJSONField("u64", field.earning) } ) }

 static fromJSON<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], json: Record<string, any> ): WithdrawLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (json.$typeName !== WithdrawLaunchpad.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(WithdrawLaunchpad.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return WithdrawLaunchpad.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], content: SuiParsedData ): WithdrawLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isWithdrawLaunchpad(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a WithdrawLaunchpad object`); } return WithdrawLaunchpad.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [IN, OUT, P], data: SuiObjectData ): WithdrawLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isWithdrawLaunchpad(data.bcs.type)) { throw new Error(`object at is not a WithdrawLaunchpad object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 3) { throw new Error(`type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 3; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return WithdrawLaunchpad.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return WithdrawLaunchpad.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<IN extends PhantomReified<PhantomTypeArgument>, OUT extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [IN, OUT, P], id: string ): Promise<WithdrawLaunchpad<ToPhantomTypeArgument<IN>, ToPhantomTypeArgument<OUT>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching WithdrawLaunchpad object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isWithdrawLaunchpad(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a WithdrawLaunchpad object`); }

 return WithdrawLaunchpad.fromSuiObjectData( typeArgs, res.data ); }

 }
