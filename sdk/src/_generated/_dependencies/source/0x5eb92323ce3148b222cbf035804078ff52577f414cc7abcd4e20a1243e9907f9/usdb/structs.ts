import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {TypeName} from "../../0x1/type-name/structs";
import {UID} from "../../0x2/object/structs";
import {VecMap} from "../../0x2/vec-map/structs";
import {VecSet} from "../../0x2/vec-set/structs";
import {PKG_V1} from "../index";
import {LimitedSupply} from "../limited-supply/structs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== Mint =============================== */

export function isMint(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::usdb::Mint` + '<'); }

export interface MintFields<Module extends PhantomTypeArgument> { amount: ToField<"u64">; moduleSupply: ToField<"u64">; totalSupply: ToField<"u64"> }

export type MintReified<Module extends PhantomTypeArgument> = Reified< Mint<Module>, MintFields<Module> >;

export class Mint<Module extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::usdb::Mint`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Mint.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::usdb::Mint<${PhantomToTypeStr<Module>}>`; readonly $typeArgs: [PhantomToTypeStr<Module>]; readonly $isPhantom = Mint.$isPhantom;

 readonly amount: ToField<"u64">; readonly moduleSupply: ToField<"u64">; readonly totalSupply: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<Module>], fields: MintFields<Module>, ) { this.$fullTypeName = composeSuiType( Mint.$typeName, ...typeArgs ) as `${typeof PKG_V1}::usdb::Mint<${PhantomToTypeStr<Module>}>`; this.$typeArgs = typeArgs;

 this.amount = fields.amount;; this.moduleSupply = fields.moduleSupply;; this.totalSupply = fields.totalSupply; }

 static reified<Module extends PhantomReified<PhantomTypeArgument>>( Module: Module ): MintReified<ToPhantomTypeArgument<Module>> { const reifiedBcs = Mint.bcs; return { typeName: Mint.$typeName, fullTypeName: composeSuiType( Mint.$typeName, ...[extractType(Module)] ) as `${typeof PKG_V1}::usdb::Mint<${PhantomToTypeStr<ToPhantomTypeArgument<Module>>}>`, typeArgs: [ extractType(Module) ] as [PhantomToTypeStr<ToPhantomTypeArgument<Module>>], isPhantom: Mint.$isPhantom, reifiedTypeArgs: [Module], fromFields: (fields: Record<string, any>) => Mint.fromFields( Module, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Mint.fromFieldsWithTypes( Module, item, ), fromBcs: (data: Uint8Array) => Mint.fromFields( Module, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Mint.fromJSONField( Module, field, ), fromJSON: (json: Record<string, any>) => Mint.fromJSON( Module, json, ), fromSuiParsedData: (content: SuiParsedData) => Mint.fromSuiParsedData( Module, content, ), fromSuiObjectData: (content: SuiObjectData) => Mint.fromSuiObjectData( Module, content, ), fetch: async (client: SuiClient, id: string) => Mint.fetch( client, Module, id, ), new: ( fields: MintFields<ToPhantomTypeArgument<Module>>, ) => { return new Mint( [extractType(Module)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Mint.reified }

 static phantom<Module extends PhantomReified<PhantomTypeArgument>>( Module: Module ): PhantomReified<ToTypeStr<Mint<ToPhantomTypeArgument<Module>>>> { return phantom(Mint.reified( Module )); } static get p() { return Mint.phantom }

 private static instantiateBcs() { return bcs.struct("Mint", {

 amount: bcs.u64(), module_supply: bcs.u64(), total_supply: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof Mint.instantiateBcs> | null = null;

 static get bcs() { if (!Mint.cachedBcs) { Mint.cachedBcs = Mint.instantiateBcs() } return Mint.cachedBcs };

 static fromFields<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, fields: Record<string, any> ): Mint<ToPhantomTypeArgument<Module>> { return Mint.reified( typeArg, ).new( { amount: decodeFromFields("u64", fields.amount), moduleSupply: decodeFromFields("u64", fields.module_supply), totalSupply: decodeFromFields("u64", fields.total_supply) } ) }

 static fromFieldsWithTypes<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, item: FieldsWithTypes ): Mint<ToPhantomTypeArgument<Module>> { if (!isMint(item.type)) { throw new Error("not a Mint type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Mint.reified( typeArg, ).new( { amount: decodeFromFieldsWithTypes("u64", item.fields.amount), moduleSupply: decodeFromFieldsWithTypes("u64", item.fields.module_supply), totalSupply: decodeFromFieldsWithTypes("u64", item.fields.total_supply) } ) }

 static fromBcs<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, data: Uint8Array ): Mint<ToPhantomTypeArgument<Module>> { return Mint.fromFields( typeArg, Mint.bcs.parse(data) ) }

 toJSONField() { return {

 amount: this.amount.toString(),moduleSupply: this.moduleSupply.toString(),totalSupply: this.totalSupply.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, field: any ): Mint<ToPhantomTypeArgument<Module>> { return Mint.reified( typeArg, ).new( { amount: decodeFromJSONField("u64", field.amount), moduleSupply: decodeFromJSONField("u64", field.moduleSupply), totalSupply: decodeFromJSONField("u64", field.totalSupply) } ) }

 static fromJSON<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, json: Record<string, any> ): Mint<ToPhantomTypeArgument<Module>> { if (json.$typeName !== Mint.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Mint.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Mint.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, content: SuiParsedData ): Mint<ToPhantomTypeArgument<Module>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isMint(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Mint object`); } return Mint.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, data: SuiObjectData ): Mint<ToPhantomTypeArgument<Module>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isMint(data.bcs.type)) { throw new Error(`object at is not a Mint object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Mint.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Mint.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<Module extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: Module, id: string ): Promise<Mint<ToPhantomTypeArgument<Module>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Mint object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isMint(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Mint object`); }

 return Mint.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== Burn =============================== */

export function isBurn(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::usdb::Burn` + '<'); }

export interface BurnFields<Module extends PhantomTypeArgument> { amount: ToField<"u64">; moduleSupply: ToField<"u64">; totalSupply: ToField<"u64"> }

export type BurnReified<Module extends PhantomTypeArgument> = Reified< Burn<Module>, BurnFields<Module> >;

export class Burn<Module extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::usdb::Burn`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Burn.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::usdb::Burn<${PhantomToTypeStr<Module>}>`; readonly $typeArgs: [PhantomToTypeStr<Module>]; readonly $isPhantom = Burn.$isPhantom;

 readonly amount: ToField<"u64">; readonly moduleSupply: ToField<"u64">; readonly totalSupply: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<Module>], fields: BurnFields<Module>, ) { this.$fullTypeName = composeSuiType( Burn.$typeName, ...typeArgs ) as `${typeof PKG_V1}::usdb::Burn<${PhantomToTypeStr<Module>}>`; this.$typeArgs = typeArgs;

 this.amount = fields.amount;; this.moduleSupply = fields.moduleSupply;; this.totalSupply = fields.totalSupply; }

 static reified<Module extends PhantomReified<PhantomTypeArgument>>( Module: Module ): BurnReified<ToPhantomTypeArgument<Module>> { const reifiedBcs = Burn.bcs; return { typeName: Burn.$typeName, fullTypeName: composeSuiType( Burn.$typeName, ...[extractType(Module)] ) as `${typeof PKG_V1}::usdb::Burn<${PhantomToTypeStr<ToPhantomTypeArgument<Module>>}>`, typeArgs: [ extractType(Module) ] as [PhantomToTypeStr<ToPhantomTypeArgument<Module>>], isPhantom: Burn.$isPhantom, reifiedTypeArgs: [Module], fromFields: (fields: Record<string, any>) => Burn.fromFields( Module, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Burn.fromFieldsWithTypes( Module, item, ), fromBcs: (data: Uint8Array) => Burn.fromFields( Module, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Burn.fromJSONField( Module, field, ), fromJSON: (json: Record<string, any>) => Burn.fromJSON( Module, json, ), fromSuiParsedData: (content: SuiParsedData) => Burn.fromSuiParsedData( Module, content, ), fromSuiObjectData: (content: SuiObjectData) => Burn.fromSuiObjectData( Module, content, ), fetch: async (client: SuiClient, id: string) => Burn.fetch( client, Module, id, ), new: ( fields: BurnFields<ToPhantomTypeArgument<Module>>, ) => { return new Burn( [extractType(Module)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Burn.reified }

 static phantom<Module extends PhantomReified<PhantomTypeArgument>>( Module: Module ): PhantomReified<ToTypeStr<Burn<ToPhantomTypeArgument<Module>>>> { return phantom(Burn.reified( Module )); } static get p() { return Burn.phantom }

 private static instantiateBcs() { return bcs.struct("Burn", {

 amount: bcs.u64(), module_supply: bcs.u64(), total_supply: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof Burn.instantiateBcs> | null = null;

 static get bcs() { if (!Burn.cachedBcs) { Burn.cachedBcs = Burn.instantiateBcs() } return Burn.cachedBcs };

 static fromFields<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, fields: Record<string, any> ): Burn<ToPhantomTypeArgument<Module>> { return Burn.reified( typeArg, ).new( { amount: decodeFromFields("u64", fields.amount), moduleSupply: decodeFromFields("u64", fields.module_supply), totalSupply: decodeFromFields("u64", fields.total_supply) } ) }

 static fromFieldsWithTypes<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, item: FieldsWithTypes ): Burn<ToPhantomTypeArgument<Module>> { if (!isBurn(item.type)) { throw new Error("not a Burn type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Burn.reified( typeArg, ).new( { amount: decodeFromFieldsWithTypes("u64", item.fields.amount), moduleSupply: decodeFromFieldsWithTypes("u64", item.fields.module_supply), totalSupply: decodeFromFieldsWithTypes("u64", item.fields.total_supply) } ) }

 static fromBcs<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, data: Uint8Array ): Burn<ToPhantomTypeArgument<Module>> { return Burn.fromFields( typeArg, Burn.bcs.parse(data) ) }

 toJSONField() { return {

 amount: this.amount.toString(),moduleSupply: this.moduleSupply.toString(),totalSupply: this.totalSupply.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, field: any ): Burn<ToPhantomTypeArgument<Module>> { return Burn.reified( typeArg, ).new( { amount: decodeFromJSONField("u64", field.amount), moduleSupply: decodeFromJSONField("u64", field.moduleSupply), totalSupply: decodeFromJSONField("u64", field.totalSupply) } ) }

 static fromJSON<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, json: Record<string, any> ): Burn<ToPhantomTypeArgument<Module>> { if (json.$typeName !== Burn.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Burn.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Burn.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, content: SuiParsedData ): Burn<ToPhantomTypeArgument<Module>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isBurn(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Burn object`); } return Burn.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<Module extends PhantomReified<PhantomTypeArgument>>( typeArg: Module, data: SuiObjectData ): Burn<ToPhantomTypeArgument<Module>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isBurn(data.bcs.type)) { throw new Error(`object at is not a Burn object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Burn.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Burn.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<Module extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: Module, id: string ): Promise<Burn<ToPhantomTypeArgument<Module>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Burn object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isBurn(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Burn object`); }

 return Burn.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== USDB =============================== */

export function isUSDB(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::usdb::USDB`; }

export interface USDBFields { dummyField: ToField<"bool"> }

export type USDBReified = Reified< USDB, USDBFields >;

export class USDB implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::usdb::USDB`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = USDB.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::usdb::USDB`; readonly $typeArgs: []; readonly $isPhantom = USDB.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: USDBFields, ) { this.$fullTypeName = composeSuiType( USDB.$typeName, ...typeArgs ) as `${typeof PKG_V1}::usdb::USDB`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): USDBReified { const reifiedBcs = USDB.bcs; return { typeName: USDB.$typeName, fullTypeName: composeSuiType( USDB.$typeName, ...[] ) as `${typeof PKG_V1}::usdb::USDB`, typeArgs: [ ] as [], isPhantom: USDB.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => USDB.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => USDB.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => USDB.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => USDB.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => USDB.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => USDB.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => USDB.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => USDB.fetch( client, id, ), new: ( fields: USDBFields, ) => { return new USDB( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return USDB.reified() }

 static phantom( ): PhantomReified<ToTypeStr<USDB>> { return phantom(USDB.reified( )); } static get p() { return USDB.phantom() }

 private static instantiateBcs() { return bcs.struct("USDB", {

 dummy_field: bcs.bool()

}) };

 private static cachedBcs: ReturnType<typeof USDB.instantiateBcs> | null = null;

 static get bcs() { if (!USDB.cachedBcs) { USDB.cachedBcs = USDB.instantiateBcs() } return USDB.cachedBcs };

 static fromFields( fields: Record<string, any> ): USDB { return USDB.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): USDB { if (!isUSDB(item.type)) { throw new Error("not a USDB type");

 }

 return USDB.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): USDB { return USDB.fromFields( USDB.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): USDB { return USDB.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): USDB { if (json.$typeName !== USDB.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return USDB.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): USDB { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isUSDB(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a USDB object`); } return USDB.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): USDB { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isUSDB(data.bcs.type)) { throw new Error(`object at is not a USDB object`); }

 return USDB.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return USDB.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<USDB> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching USDB object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isUSDB(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a USDB object`); }

 return USDB.fromSuiObjectData( res.data ); }

 }

/* ============================== CapKey =============================== */

export function isCapKey(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::usdb::CapKey`; }

export interface CapKeyFields { dummyField: ToField<"bool"> }

export type CapKeyReified = Reified< CapKey, CapKeyFields >;

export class CapKey implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::usdb::CapKey`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = CapKey.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::usdb::CapKey`; readonly $typeArgs: []; readonly $isPhantom = CapKey.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: CapKeyFields, ) { this.$fullTypeName = composeSuiType( CapKey.$typeName, ...typeArgs ) as `${typeof PKG_V1}::usdb::CapKey`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): CapKeyReified { const reifiedBcs = CapKey.bcs; return { typeName: CapKey.$typeName, fullTypeName: composeSuiType( CapKey.$typeName, ...[] ) as `${typeof PKG_V1}::usdb::CapKey`, typeArgs: [ ] as [], isPhantom: CapKey.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => CapKey.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => CapKey.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => CapKey.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => CapKey.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => CapKey.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => CapKey.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => CapKey.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => CapKey.fetch( client, id, ), new: ( fields: CapKeyFields, ) => { return new CapKey( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return CapKey.reified() }

 static phantom( ): PhantomReified<ToTypeStr<CapKey>> { return phantom(CapKey.reified( )); } static get p() { return CapKey.phantom() }

 private static instantiateBcs() { return bcs.struct("CapKey", {

 dummy_field: bcs.bool()

}) };

 private static cachedBcs: ReturnType<typeof CapKey.instantiateBcs> | null = null;

 static get bcs() { if (!CapKey.cachedBcs) { CapKey.cachedBcs = CapKey.instantiateBcs() } return CapKey.cachedBcs };

 static fromFields( fields: Record<string, any> ): CapKey { return CapKey.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): CapKey { if (!isCapKey(item.type)) { throw new Error("not a CapKey type");

 }

 return CapKey.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): CapKey { return CapKey.fromFields( CapKey.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): CapKey { return CapKey.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): CapKey { if (json.$typeName !== CapKey.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return CapKey.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): CapKey { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCapKey(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a CapKey object`); } return CapKey.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): CapKey { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isCapKey(data.bcs.type)) { throw new Error(`object at is not a CapKey object`); }

 return CapKey.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return CapKey.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<CapKey> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching CapKey object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isCapKey(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a CapKey object`); }

 return CapKey.fromSuiObjectData( res.data ); }

 }

/* ============================== ModuleConfig =============================== */

export function isModuleConfig(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::usdb::ModuleConfig`; }

export interface ModuleConfigFields { validVersions: ToField<VecSet<"u16">>; limitedSupply: ToField<LimitedSupply> }

export type ModuleConfigReified = Reified< ModuleConfig, ModuleConfigFields >;

export class ModuleConfig implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::usdb::ModuleConfig`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = ModuleConfig.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::usdb::ModuleConfig`; readonly $typeArgs: []; readonly $isPhantom = ModuleConfig.$isPhantom;

 readonly validVersions: ToField<VecSet<"u16">>; readonly limitedSupply: ToField<LimitedSupply>

 private constructor(typeArgs: [], fields: ModuleConfigFields, ) { this.$fullTypeName = composeSuiType( ModuleConfig.$typeName, ...typeArgs ) as `${typeof PKG_V1}::usdb::ModuleConfig`; this.$typeArgs = typeArgs;

 this.validVersions = fields.validVersions;; this.limitedSupply = fields.limitedSupply; }

 static reified( ): ModuleConfigReified { const reifiedBcs = ModuleConfig.bcs; return { typeName: ModuleConfig.$typeName, fullTypeName: composeSuiType( ModuleConfig.$typeName, ...[] ) as `${typeof PKG_V1}::usdb::ModuleConfig`, typeArgs: [ ] as [], isPhantom: ModuleConfig.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => ModuleConfig.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ModuleConfig.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => ModuleConfig.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => ModuleConfig.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => ModuleConfig.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => ModuleConfig.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => ModuleConfig.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => ModuleConfig.fetch( client, id, ), new: ( fields: ModuleConfigFields, ) => { return new ModuleConfig( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return ModuleConfig.reified() }

 static phantom( ): PhantomReified<ToTypeStr<ModuleConfig>> { return phantom(ModuleConfig.reified( )); } static get p() { return ModuleConfig.phantom() }

 private static instantiateBcs() { return bcs.struct("ModuleConfig", {

 valid_versions: VecSet.bcs(bcs.u16()), limited_supply: LimitedSupply.bcs

}) };

 private static cachedBcs: ReturnType<typeof ModuleConfig.instantiateBcs> | null = null;

 static get bcs() { if (!ModuleConfig.cachedBcs) { ModuleConfig.cachedBcs = ModuleConfig.instantiateBcs() } return ModuleConfig.cachedBcs };

 static fromFields( fields: Record<string, any> ): ModuleConfig { return ModuleConfig.reified( ).new( { validVersions: decodeFromFields(VecSet.reified("u16"), fields.valid_versions), limitedSupply: decodeFromFields(LimitedSupply.reified(), fields.limited_supply) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): ModuleConfig { if (!isModuleConfig(item.type)) { throw new Error("not a ModuleConfig type");

 }

 return ModuleConfig.reified( ).new( { validVersions: decodeFromFieldsWithTypes(VecSet.reified("u16"), item.fields.valid_versions), limitedSupply: decodeFromFieldsWithTypes(LimitedSupply.reified(), item.fields.limited_supply) } ) }

 static fromBcs( data: Uint8Array ): ModuleConfig { return ModuleConfig.fromFields( ModuleConfig.bcs.parse(data) ) }

 toJSONField() { return {

 validVersions: this.validVersions.toJSONField(),limitedSupply: this.limitedSupply.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): ModuleConfig { return ModuleConfig.reified( ).new( { validVersions: decodeFromJSONField(VecSet.reified("u16"), field.validVersions), limitedSupply: decodeFromJSONField(LimitedSupply.reified(), field.limitedSupply) } ) }

 static fromJSON( json: Record<string, any> ): ModuleConfig { if (json.$typeName !== ModuleConfig.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return ModuleConfig.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): ModuleConfig { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isModuleConfig(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ModuleConfig object`); } return ModuleConfig.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): ModuleConfig { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isModuleConfig(data.bcs.type)) { throw new Error(`object at is not a ModuleConfig object`); }

 return ModuleConfig.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ModuleConfig.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<ModuleConfig> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ModuleConfig object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isModuleConfig(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ModuleConfig object`); }

 return ModuleConfig.fromSuiObjectData( res.data ); }

 }

/* ============================== Treasury =============================== */

export function isTreasury(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::usdb::Treasury`; }

export interface TreasuryFields { id: ToField<UID>; moduleConfigMap: ToField<VecMap<TypeName, ModuleConfig>>; beneficiaryAddress: ToField<"address"> }

export type TreasuryReified = Reified< Treasury, TreasuryFields >;

export class Treasury implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::usdb::Treasury`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Treasury.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::usdb::Treasury`; readonly $typeArgs: []; readonly $isPhantom = Treasury.$isPhantom;

 readonly id: ToField<UID>; readonly moduleConfigMap: ToField<VecMap<TypeName, ModuleConfig>>; readonly beneficiaryAddress: ToField<"address">

 private constructor(typeArgs: [], fields: TreasuryFields, ) { this.$fullTypeName = composeSuiType( Treasury.$typeName, ...typeArgs ) as `${typeof PKG_V1}::usdb::Treasury`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.moduleConfigMap = fields.moduleConfigMap;; this.beneficiaryAddress = fields.beneficiaryAddress; }

 static reified( ): TreasuryReified { const reifiedBcs = Treasury.bcs; return { typeName: Treasury.$typeName, fullTypeName: composeSuiType( Treasury.$typeName, ...[] ) as `${typeof PKG_V1}::usdb::Treasury`, typeArgs: [ ] as [], isPhantom: Treasury.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Treasury.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Treasury.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Treasury.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Treasury.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Treasury.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Treasury.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Treasury.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Treasury.fetch( client, id, ), new: ( fields: TreasuryFields, ) => { return new Treasury( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Treasury.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Treasury>> { return phantom(Treasury.reified( )); } static get p() { return Treasury.phantom() }

 private static instantiateBcs() { return bcs.struct("Treasury", {

 id: UID.bcs, module_config_map: VecMap.bcs(TypeName.bcs, ModuleConfig.bcs), beneficiary_address: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), })

}) };

 private static cachedBcs: ReturnType<typeof Treasury.instantiateBcs> | null = null;

 static get bcs() { if (!Treasury.cachedBcs) { Treasury.cachedBcs = Treasury.instantiateBcs() } return Treasury.cachedBcs };

 static fromFields( fields: Record<string, any> ): Treasury { return Treasury.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), moduleConfigMap: decodeFromFields(VecMap.reified(TypeName.reified(), ModuleConfig.reified()), fields.module_config_map), beneficiaryAddress: decodeFromFields("address", fields.beneficiary_address) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Treasury { if (!isTreasury(item.type)) { throw new Error("not a Treasury type");

 }

 return Treasury.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), moduleConfigMap: decodeFromFieldsWithTypes(VecMap.reified(TypeName.reified(), ModuleConfig.reified()), item.fields.module_config_map), beneficiaryAddress: decodeFromFieldsWithTypes("address", item.fields.beneficiary_address) } ) }

 static fromBcs( data: Uint8Array ): Treasury { return Treasury.fromFields( Treasury.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,moduleConfigMap: this.moduleConfigMap.toJSONField(),beneficiaryAddress: this.beneficiaryAddress,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Treasury { return Treasury.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), moduleConfigMap: decodeFromJSONField(VecMap.reified(TypeName.reified(), ModuleConfig.reified()), field.moduleConfigMap), beneficiaryAddress: decodeFromJSONField("address", field.beneficiaryAddress) } ) }

 static fromJSON( json: Record<string, any> ): Treasury { if (json.$typeName !== Treasury.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Treasury.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Treasury { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isTreasury(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Treasury object`); } return Treasury.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Treasury { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isTreasury(data.bcs.type)) { throw new Error(`object at is not a Treasury object`); }

 return Treasury.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Treasury.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Treasury> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Treasury object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isTreasury(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Treasury object`); }

 return Treasury.fromSuiObjectData( res.data ); }

 }
