import * as reified from "../../_framework/reified";
import {Balance} from "../../_dependencies/source/0x2/balance/structs";
import {UID} from "../../_dependencies/source/0x2/object/structs";
import {VecMap} from "../../_dependencies/source/0x2/vec-map/structs";
import {Float} from "../../_dependencies/source/0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/float/structs";
import {Sheet} from "../../_dependencies/source/0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/sheet/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom, ToTypeStr as ToPhantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {PKG_V1} from "../index";
import {BucketV2PSM} from "../witness/structs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== FeeConfig =============================== */

export function isFeeConfig(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::pool::FeeConfig`; }

export interface FeeConfigFields { swapInFeeRate: ToField<Float>; swapOutFeeRate: ToField<Float> }

export type FeeConfigReified = Reified< FeeConfig, FeeConfigFields >;

export class FeeConfig implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::pool::FeeConfig`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = FeeConfig.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::pool::FeeConfig`; readonly $typeArgs: []; readonly $isPhantom = FeeConfig.$isPhantom;

 readonly swapInFeeRate: ToField<Float>; readonly swapOutFeeRate: ToField<Float>

 private constructor(typeArgs: [], fields: FeeConfigFields, ) { this.$fullTypeName = composeSuiType( FeeConfig.$typeName, ...typeArgs ) as `${typeof PKG_V1}::pool::FeeConfig`; this.$typeArgs = typeArgs;

 this.swapInFeeRate = fields.swapInFeeRate;; this.swapOutFeeRate = fields.swapOutFeeRate; }

 static reified( ): FeeConfigReified { const reifiedBcs = FeeConfig.bcs; return { typeName: FeeConfig.$typeName, fullTypeName: composeSuiType( FeeConfig.$typeName, ...[] ) as `${typeof PKG_V1}::pool::FeeConfig`, typeArgs: [ ] as [], isPhantom: FeeConfig.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => FeeConfig.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => FeeConfig.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => FeeConfig.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => FeeConfig.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => FeeConfig.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => FeeConfig.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => FeeConfig.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => FeeConfig.fetch( client, id, ), new: ( fields: FeeConfigFields, ) => { return new FeeConfig( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return FeeConfig.reified() }

 static phantom( ): PhantomReified<ToTypeStr<FeeConfig>> { return phantom(FeeConfig.reified( )); } static get p() { return FeeConfig.phantom() }

 private static instantiateBcs() { return bcs.struct("FeeConfig", {

 swap_in_fee_rate: Float.bcs, swap_out_fee_rate: Float.bcs

}) };

 private static cachedBcs: ReturnType<typeof FeeConfig.instantiateBcs> | null = null;

 static get bcs() { if (!FeeConfig.cachedBcs) { FeeConfig.cachedBcs = FeeConfig.instantiateBcs() } return FeeConfig.cachedBcs };

 static fromFields( fields: Record<string, any> ): FeeConfig { return FeeConfig.reified( ).new( { swapInFeeRate: decodeFromFields(Float.reified(), fields.swap_in_fee_rate), swapOutFeeRate: decodeFromFields(Float.reified(), fields.swap_out_fee_rate) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): FeeConfig { if (!isFeeConfig(item.type)) { throw new Error("not a FeeConfig type");

 }

 return FeeConfig.reified( ).new( { swapInFeeRate: decodeFromFieldsWithTypes(Float.reified(), item.fields.swap_in_fee_rate), swapOutFeeRate: decodeFromFieldsWithTypes(Float.reified(), item.fields.swap_out_fee_rate) } ) }

 static fromBcs( data: Uint8Array ): FeeConfig { return FeeConfig.fromFields( FeeConfig.bcs.parse(data) ) }

 toJSONField() { return {

 swapInFeeRate: this.swapInFeeRate.toJSONField(),swapOutFeeRate: this.swapOutFeeRate.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): FeeConfig { return FeeConfig.reified( ).new( { swapInFeeRate: decodeFromJSONField(Float.reified(), field.swapInFeeRate), swapOutFeeRate: decodeFromJSONField(Float.reified(), field.swapOutFeeRate) } ) }

 static fromJSON( json: Record<string, any> ): FeeConfig { if (json.$typeName !== FeeConfig.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return FeeConfig.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): FeeConfig { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isFeeConfig(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a FeeConfig object`); } return FeeConfig.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): FeeConfig { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isFeeConfig(data.bcs.type)) { throw new Error(`object at is not a FeeConfig object`); }

 return FeeConfig.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return FeeConfig.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<FeeConfig> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching FeeConfig object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isFeeConfig(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a FeeConfig object`); }

 return FeeConfig.fromSuiObjectData( res.data ); }

 }

/* ============================== Pool =============================== */

export function isPool(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::pool::Pool` + '<'); }

export interface PoolFields<T extends PhantomTypeArgument> { id: ToField<UID>; decimal: ToField<"u8">; defaultFeeConfig: ToField<FeeConfig>; partnerFeeConfigs: ToField<VecMap<"address", FeeConfig>>; priceTolerance: ToField<Float>; balance: ToField<Balance<T>>; balanceAmount: ToField<"u64">; usdbSupply: ToField<"u64">; sheet: ToField<Sheet<T, ToPhantom<BucketV2PSM>>> }

export type PoolReified<T extends PhantomTypeArgument> = Reified< Pool<T>, PoolFields<T> >;

export class Pool<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::pool::Pool`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Pool.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::pool::Pool<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = Pool.$isPhantom;

 readonly id: ToField<UID>; readonly decimal: ToField<"u8">; readonly defaultFeeConfig: ToField<FeeConfig>; readonly partnerFeeConfigs: ToField<VecMap<"address", FeeConfig>>; readonly priceTolerance: ToField<Float>; readonly balance: ToField<Balance<T>>; readonly balanceAmount: ToField<"u64">; readonly usdbSupply: ToField<"u64">; readonly sheet: ToField<Sheet<T, ToPhantom<BucketV2PSM>>>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: PoolFields<T>, ) { this.$fullTypeName = composeSuiType( Pool.$typeName, ...typeArgs ) as `${typeof PKG_V1}::pool::Pool<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.decimal = fields.decimal;; this.defaultFeeConfig = fields.defaultFeeConfig;; this.partnerFeeConfigs = fields.partnerFeeConfigs;; this.priceTolerance = fields.priceTolerance;; this.balance = fields.balance;; this.balanceAmount = fields.balanceAmount;; this.usdbSupply = fields.usdbSupply;; this.sheet = fields.sheet; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PoolReified<ToPhantomTypeArgument<T>> { const reifiedBcs = Pool.bcs; return { typeName: Pool.$typeName, fullTypeName: composeSuiType( Pool.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::pool::Pool<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: Pool.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => Pool.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Pool.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => Pool.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Pool.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => Pool.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => Pool.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => Pool.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => Pool.fetch( client, T, id, ), new: ( fields: PoolFields<ToPhantomTypeArgument<T>>, ) => { return new Pool( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Pool.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<Pool<ToPhantomTypeArgument<T>>>> { return phantom(Pool.reified( T )); } static get p() { return Pool.phantom }

 private static instantiateBcs() { return bcs.struct("Pool", {

 id: UID.bcs, decimal: bcs.u8(), default_fee_config: FeeConfig.bcs, partner_fee_configs: VecMap.bcs(bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), FeeConfig.bcs), price_tolerance: Float.bcs, balance: Balance.bcs, balance_amount: bcs.u64(), usdb_supply: bcs.u64(), sheet: Sheet.bcs

}) };

 private static cachedBcs: ReturnType<typeof Pool.instantiateBcs> | null = null;

 static get bcs() { if (!Pool.cachedBcs) { Pool.cachedBcs = Pool.instantiateBcs() } return Pool.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): Pool<ToPhantomTypeArgument<T>> { return Pool.reified( typeArg, ).new( { id: decodeFromFields(UID.reified(), fields.id), decimal: decodeFromFields("u8", fields.decimal), defaultFeeConfig: decodeFromFields(FeeConfig.reified(), fields.default_fee_config), partnerFeeConfigs: decodeFromFields(VecMap.reified("address", FeeConfig.reified()), fields.partner_fee_configs), priceTolerance: decodeFromFields(Float.reified(), fields.price_tolerance), balance: decodeFromFields(Balance.reified(typeArg), fields.balance), balanceAmount: decodeFromFields("u64", fields.balance_amount), usdbSupply: decodeFromFields("u64", fields.usdb_supply), sheet: decodeFromFields(Sheet.reified(typeArg, reified.phantom(BucketV2PSM.reified())), fields.sheet) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): Pool<ToPhantomTypeArgument<T>> { if (!isPool(item.type)) { throw new Error("not a Pool type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Pool.reified( typeArg, ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), decimal: decodeFromFieldsWithTypes("u8", item.fields.decimal), defaultFeeConfig: decodeFromFieldsWithTypes(FeeConfig.reified(), item.fields.default_fee_config), partnerFeeConfigs: decodeFromFieldsWithTypes(VecMap.reified("address", FeeConfig.reified()), item.fields.partner_fee_configs), priceTolerance: decodeFromFieldsWithTypes(Float.reified(), item.fields.price_tolerance), balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance), balanceAmount: decodeFromFieldsWithTypes("u64", item.fields.balance_amount), usdbSupply: decodeFromFieldsWithTypes("u64", item.fields.usdb_supply), sheet: decodeFromFieldsWithTypes(Sheet.reified(typeArg, reified.phantom(BucketV2PSM.reified())), item.fields.sheet) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): Pool<ToPhantomTypeArgument<T>> { return Pool.fromFields( typeArg, Pool.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,decimal: this.decimal,defaultFeeConfig: this.defaultFeeConfig.toJSONField(),partnerFeeConfigs: this.partnerFeeConfigs.toJSONField(),priceTolerance: this.priceTolerance.toJSONField(),balance: this.balance.toJSONField(),balanceAmount: this.balanceAmount.toString(),usdbSupply: this.usdbSupply.toString(),sheet: this.sheet.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): Pool<ToPhantomTypeArgument<T>> { return Pool.reified( typeArg, ).new( { id: decodeFromJSONField(UID.reified(), field.id), decimal: decodeFromJSONField("u8", field.decimal), defaultFeeConfig: decodeFromJSONField(FeeConfig.reified(), field.defaultFeeConfig), partnerFeeConfigs: decodeFromJSONField(VecMap.reified("address", FeeConfig.reified()), field.partnerFeeConfigs), priceTolerance: decodeFromJSONField(Float.reified(), field.priceTolerance), balance: decodeFromJSONField(Balance.reified(typeArg), field.balance), balanceAmount: decodeFromJSONField("u64", field.balanceAmount), usdbSupply: decodeFromJSONField("u64", field.usdbSupply), sheet: decodeFromJSONField(Sheet.reified(typeArg, reified.phantom(BucketV2PSM.reified())), field.sheet) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): Pool<ToPhantomTypeArgument<T>> { if (json.$typeName !== Pool.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Pool.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Pool.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): Pool<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPool(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Pool object`); } return Pool.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): Pool<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPool(data.bcs.type)) { throw new Error(`object at is not a Pool object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Pool.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Pool.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<Pool<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Pool object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPool(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Pool object`); }

 return Pool.fromSuiObjectData( typeArg, res.data ); }

 }
