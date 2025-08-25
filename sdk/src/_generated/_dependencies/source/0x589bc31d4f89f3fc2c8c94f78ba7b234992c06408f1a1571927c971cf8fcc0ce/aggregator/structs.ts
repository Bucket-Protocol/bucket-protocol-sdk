import * as reified from "../../../../_framework/reified";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, fieldToJSON, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {Vector} from "../../../../_framework/vector";
import {String} from "../../0x1/ascii/structs";
import {TypeName} from "../../0x1/type-name/structs";
import {ID, UID} from "../../0x2/object/structs";
import {VecMap} from "../../0x2/vec-map/structs";
import {Float} from "../../0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/float/structs";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== NewPriceAggregator =============================== */

export function isNewPriceAggregator(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::aggregator::NewPriceAggregator`; }

export interface NewPriceAggregatorFields { aggregatorId: ToField<ID>; coinType: ToField<String>; weightThreshold: ToField<"u64">; outlierToleranceBps: ToField<"u64"> }

export type NewPriceAggregatorReified = Reified< NewPriceAggregator, NewPriceAggregatorFields >;

export class NewPriceAggregator implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::aggregator::NewPriceAggregator`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = NewPriceAggregator.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::aggregator::NewPriceAggregator`; readonly $typeArgs: []; readonly $isPhantom = NewPriceAggregator.$isPhantom;

 readonly aggregatorId: ToField<ID>; readonly coinType: ToField<String>; readonly weightThreshold: ToField<"u64">; readonly outlierToleranceBps: ToField<"u64">

 private constructor(typeArgs: [], fields: NewPriceAggregatorFields, ) { this.$fullTypeName = composeSuiType( NewPriceAggregator.$typeName, ...typeArgs ) as `${typeof PKG_V1}::aggregator::NewPriceAggregator`; this.$typeArgs = typeArgs;

 this.aggregatorId = fields.aggregatorId;; this.coinType = fields.coinType;; this.weightThreshold = fields.weightThreshold;; this.outlierToleranceBps = fields.outlierToleranceBps; }

 static reified( ): NewPriceAggregatorReified { const reifiedBcs = NewPriceAggregator.bcs; return { typeName: NewPriceAggregator.$typeName, fullTypeName: composeSuiType( NewPriceAggregator.$typeName, ...[] ) as `${typeof PKG_V1}::aggregator::NewPriceAggregator`, typeArgs: [ ] as [], isPhantom: NewPriceAggregator.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => NewPriceAggregator.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => NewPriceAggregator.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => NewPriceAggregator.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => NewPriceAggregator.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => NewPriceAggregator.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => NewPriceAggregator.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => NewPriceAggregator.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => NewPriceAggregator.fetch( client, id, ), new: ( fields: NewPriceAggregatorFields, ) => { return new NewPriceAggregator( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return NewPriceAggregator.reified() }

 static phantom( ): PhantomReified<ToTypeStr<NewPriceAggregator>> { return phantom(NewPriceAggregator.reified( )); } static get p() { return NewPriceAggregator.phantom() }

 private static instantiateBcs() { return bcs.struct("NewPriceAggregator", {

 aggregator_id: ID.bcs, coin_type: String.bcs, weight_threshold: bcs.u64(), outlier_tolerance_bps: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof NewPriceAggregator.instantiateBcs> | null = null;

 static get bcs() { if (!NewPriceAggregator.cachedBcs) { NewPriceAggregator.cachedBcs = NewPriceAggregator.instantiateBcs() } return NewPriceAggregator.cachedBcs };

 static fromFields( fields: Record<string, any> ): NewPriceAggregator { return NewPriceAggregator.reified( ).new( { aggregatorId: decodeFromFields(ID.reified(), fields.aggregator_id), coinType: decodeFromFields(String.reified(), fields.coin_type), weightThreshold: decodeFromFields("u64", fields.weight_threshold), outlierToleranceBps: decodeFromFields("u64", fields.outlier_tolerance_bps) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): NewPriceAggregator { if (!isNewPriceAggregator(item.type)) { throw new Error("not a NewPriceAggregator type");

 }

 return NewPriceAggregator.reified( ).new( { aggregatorId: decodeFromFieldsWithTypes(ID.reified(), item.fields.aggregator_id), coinType: decodeFromFieldsWithTypes(String.reified(), item.fields.coin_type), weightThreshold: decodeFromFieldsWithTypes("u64", item.fields.weight_threshold), outlierToleranceBps: decodeFromFieldsWithTypes("u64", item.fields.outlier_tolerance_bps) } ) }

 static fromBcs( data: Uint8Array ): NewPriceAggregator { return NewPriceAggregator.fromFields( NewPriceAggregator.bcs.parse(data) ) }

 toJSONField() { return {

 aggregatorId: this.aggregatorId,coinType: this.coinType,weightThreshold: this.weightThreshold.toString(),outlierToleranceBps: this.outlierToleranceBps.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): NewPriceAggregator { return NewPriceAggregator.reified( ).new( { aggregatorId: decodeFromJSONField(ID.reified(), field.aggregatorId), coinType: decodeFromJSONField(String.reified(), field.coinType), weightThreshold: decodeFromJSONField("u64", field.weightThreshold), outlierToleranceBps: decodeFromJSONField("u64", field.outlierToleranceBps) } ) }

 static fromJSON( json: Record<string, any> ): NewPriceAggregator { if (json.$typeName !== NewPriceAggregator.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return NewPriceAggregator.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): NewPriceAggregator { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isNewPriceAggregator(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a NewPriceAggregator object`); } return NewPriceAggregator.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): NewPriceAggregator { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isNewPriceAggregator(data.bcs.type)) { throw new Error(`object at is not a NewPriceAggregator object`); }

 return NewPriceAggregator.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return NewPriceAggregator.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<NewPriceAggregator> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching NewPriceAggregator object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isNewPriceAggregator(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a NewPriceAggregator object`); }

 return NewPriceAggregator.fromSuiObjectData( res.data ); }

 }

/* ============================== WeightUpdated =============================== */

export function isWeightUpdated(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::aggregator::WeightUpdated` + '<'); }

export interface WeightUpdatedFields<T extends PhantomTypeArgument> { aggregatorId: ToField<ID>; ruleType: ToField<String>; weight: ToField<"u8"> }

export type WeightUpdatedReified<T extends PhantomTypeArgument> = Reified< WeightUpdated<T>, WeightUpdatedFields<T> >;

export class WeightUpdated<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::aggregator::WeightUpdated`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = WeightUpdated.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::aggregator::WeightUpdated<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = WeightUpdated.$isPhantom;

 readonly aggregatorId: ToField<ID>; readonly ruleType: ToField<String>; readonly weight: ToField<"u8">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: WeightUpdatedFields<T>, ) { this.$fullTypeName = composeSuiType( WeightUpdated.$typeName, ...typeArgs ) as `${typeof PKG_V1}::aggregator::WeightUpdated<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.aggregatorId = fields.aggregatorId;; this.ruleType = fields.ruleType;; this.weight = fields.weight; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): WeightUpdatedReified<ToPhantomTypeArgument<T>> { const reifiedBcs = WeightUpdated.bcs; return { typeName: WeightUpdated.$typeName, fullTypeName: composeSuiType( WeightUpdated.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::aggregator::WeightUpdated<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: WeightUpdated.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => WeightUpdated.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => WeightUpdated.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => WeightUpdated.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => WeightUpdated.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => WeightUpdated.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => WeightUpdated.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => WeightUpdated.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => WeightUpdated.fetch( client, T, id, ), new: ( fields: WeightUpdatedFields<ToPhantomTypeArgument<T>>, ) => { return new WeightUpdated( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return WeightUpdated.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<WeightUpdated<ToPhantomTypeArgument<T>>>> { return phantom(WeightUpdated.reified( T )); } static get p() { return WeightUpdated.phantom }

 private static instantiateBcs() { return bcs.struct("WeightUpdated", {

 aggregator_id: ID.bcs, rule_type: String.bcs, weight: bcs.u8()

}) };

 private static cachedBcs: ReturnType<typeof WeightUpdated.instantiateBcs> | null = null;

 static get bcs() { if (!WeightUpdated.cachedBcs) { WeightUpdated.cachedBcs = WeightUpdated.instantiateBcs() } return WeightUpdated.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): WeightUpdated<ToPhantomTypeArgument<T>> { return WeightUpdated.reified( typeArg, ).new( { aggregatorId: decodeFromFields(ID.reified(), fields.aggregator_id), ruleType: decodeFromFields(String.reified(), fields.rule_type), weight: decodeFromFields("u8", fields.weight) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): WeightUpdated<ToPhantomTypeArgument<T>> { if (!isWeightUpdated(item.type)) { throw new Error("not a WeightUpdated type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return WeightUpdated.reified( typeArg, ).new( { aggregatorId: decodeFromFieldsWithTypes(ID.reified(), item.fields.aggregator_id), ruleType: decodeFromFieldsWithTypes(String.reified(), item.fields.rule_type), weight: decodeFromFieldsWithTypes("u8", item.fields.weight) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): WeightUpdated<ToPhantomTypeArgument<T>> { return WeightUpdated.fromFields( typeArg, WeightUpdated.bcs.parse(data) ) }

 toJSONField() { return {

 aggregatorId: this.aggregatorId,ruleType: this.ruleType,weight: this.weight,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): WeightUpdated<ToPhantomTypeArgument<T>> { return WeightUpdated.reified( typeArg, ).new( { aggregatorId: decodeFromJSONField(ID.reified(), field.aggregatorId), ruleType: decodeFromJSONField(String.reified(), field.ruleType), weight: decodeFromJSONField("u8", field.weight) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): WeightUpdated<ToPhantomTypeArgument<T>> { if (json.$typeName !== WeightUpdated.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(WeightUpdated.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return WeightUpdated.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): WeightUpdated<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isWeightUpdated(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a WeightUpdated object`); } return WeightUpdated.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): WeightUpdated<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isWeightUpdated(data.bcs.type)) { throw new Error(`object at is not a WeightUpdated object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return WeightUpdated.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return WeightUpdated.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<WeightUpdated<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching WeightUpdated object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isWeightUpdated(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a WeightUpdated object`); }

 return WeightUpdated.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== ThresholdUpdated =============================== */

export function isThresholdUpdated(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::aggregator::ThresholdUpdated` + '<'); }

export interface ThresholdUpdatedFields<T extends PhantomTypeArgument> { aggregatorId: ToField<ID>; weightThreshold: ToField<"u64"> }

export type ThresholdUpdatedReified<T extends PhantomTypeArgument> = Reified< ThresholdUpdated<T>, ThresholdUpdatedFields<T> >;

export class ThresholdUpdated<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::aggregator::ThresholdUpdated`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = ThresholdUpdated.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::aggregator::ThresholdUpdated<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = ThresholdUpdated.$isPhantom;

 readonly aggregatorId: ToField<ID>; readonly weightThreshold: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: ThresholdUpdatedFields<T>, ) { this.$fullTypeName = composeSuiType( ThresholdUpdated.$typeName, ...typeArgs ) as `${typeof PKG_V1}::aggregator::ThresholdUpdated<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.aggregatorId = fields.aggregatorId;; this.weightThreshold = fields.weightThreshold; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): ThresholdUpdatedReified<ToPhantomTypeArgument<T>> { const reifiedBcs = ThresholdUpdated.bcs; return { typeName: ThresholdUpdated.$typeName, fullTypeName: composeSuiType( ThresholdUpdated.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::aggregator::ThresholdUpdated<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: ThresholdUpdated.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => ThresholdUpdated.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ThresholdUpdated.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => ThresholdUpdated.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => ThresholdUpdated.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => ThresholdUpdated.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => ThresholdUpdated.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => ThresholdUpdated.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => ThresholdUpdated.fetch( client, T, id, ), new: ( fields: ThresholdUpdatedFields<ToPhantomTypeArgument<T>>, ) => { return new ThresholdUpdated( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return ThresholdUpdated.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<ThresholdUpdated<ToPhantomTypeArgument<T>>>> { return phantom(ThresholdUpdated.reified( T )); } static get p() { return ThresholdUpdated.phantom }

 private static instantiateBcs() { return bcs.struct("ThresholdUpdated", {

 aggregator_id: ID.bcs, weight_threshold: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof ThresholdUpdated.instantiateBcs> | null = null;

 static get bcs() { if (!ThresholdUpdated.cachedBcs) { ThresholdUpdated.cachedBcs = ThresholdUpdated.instantiateBcs() } return ThresholdUpdated.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): ThresholdUpdated<ToPhantomTypeArgument<T>> { return ThresholdUpdated.reified( typeArg, ).new( { aggregatorId: decodeFromFields(ID.reified(), fields.aggregator_id), weightThreshold: decodeFromFields("u64", fields.weight_threshold) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): ThresholdUpdated<ToPhantomTypeArgument<T>> { if (!isThresholdUpdated(item.type)) { throw new Error("not a ThresholdUpdated type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return ThresholdUpdated.reified( typeArg, ).new( { aggregatorId: decodeFromFieldsWithTypes(ID.reified(), item.fields.aggregator_id), weightThreshold: decodeFromFieldsWithTypes("u64", item.fields.weight_threshold) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): ThresholdUpdated<ToPhantomTypeArgument<T>> { return ThresholdUpdated.fromFields( typeArg, ThresholdUpdated.bcs.parse(data) ) }

 toJSONField() { return {

 aggregatorId: this.aggregatorId,weightThreshold: this.weightThreshold.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): ThresholdUpdated<ToPhantomTypeArgument<T>> { return ThresholdUpdated.reified( typeArg, ).new( { aggregatorId: decodeFromJSONField(ID.reified(), field.aggregatorId), weightThreshold: decodeFromJSONField("u64", field.weightThreshold) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): ThresholdUpdated<ToPhantomTypeArgument<T>> { if (json.$typeName !== ThresholdUpdated.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(ThresholdUpdated.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return ThresholdUpdated.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): ThresholdUpdated<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isThresholdUpdated(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ThresholdUpdated object`); } return ThresholdUpdated.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): ThresholdUpdated<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isThresholdUpdated(data.bcs.type)) { throw new Error(`object at is not a ThresholdUpdated object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return ThresholdUpdated.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ThresholdUpdated.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<ThresholdUpdated<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ThresholdUpdated object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isThresholdUpdated(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ThresholdUpdated object`); }

 return ThresholdUpdated.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== OutlierToleranceUpdated =============================== */

export function isOutlierToleranceUpdated(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::aggregator::OutlierToleranceUpdated` + '<'); }

export interface OutlierToleranceUpdatedFields<T extends PhantomTypeArgument> { aggregatorId: ToField<ID>; outlierToleranceBps: ToField<"u64"> }

export type OutlierToleranceUpdatedReified<T extends PhantomTypeArgument> = Reified< OutlierToleranceUpdated<T>, OutlierToleranceUpdatedFields<T> >;

export class OutlierToleranceUpdated<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::aggregator::OutlierToleranceUpdated`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = OutlierToleranceUpdated.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::aggregator::OutlierToleranceUpdated<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = OutlierToleranceUpdated.$isPhantom;

 readonly aggregatorId: ToField<ID>; readonly outlierToleranceBps: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: OutlierToleranceUpdatedFields<T>, ) { this.$fullTypeName = composeSuiType( OutlierToleranceUpdated.$typeName, ...typeArgs ) as `${typeof PKG_V1}::aggregator::OutlierToleranceUpdated<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.aggregatorId = fields.aggregatorId;; this.outlierToleranceBps = fields.outlierToleranceBps; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): OutlierToleranceUpdatedReified<ToPhantomTypeArgument<T>> { const reifiedBcs = OutlierToleranceUpdated.bcs; return { typeName: OutlierToleranceUpdated.$typeName, fullTypeName: composeSuiType( OutlierToleranceUpdated.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::aggregator::OutlierToleranceUpdated<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: OutlierToleranceUpdated.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => OutlierToleranceUpdated.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => OutlierToleranceUpdated.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => OutlierToleranceUpdated.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => OutlierToleranceUpdated.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => OutlierToleranceUpdated.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => OutlierToleranceUpdated.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => OutlierToleranceUpdated.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => OutlierToleranceUpdated.fetch( client, T, id, ), new: ( fields: OutlierToleranceUpdatedFields<ToPhantomTypeArgument<T>>, ) => { return new OutlierToleranceUpdated( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return OutlierToleranceUpdated.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<OutlierToleranceUpdated<ToPhantomTypeArgument<T>>>> { return phantom(OutlierToleranceUpdated.reified( T )); } static get p() { return OutlierToleranceUpdated.phantom }

 private static instantiateBcs() { return bcs.struct("OutlierToleranceUpdated", {

 aggregator_id: ID.bcs, outlier_tolerance_bps: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof OutlierToleranceUpdated.instantiateBcs> | null = null;

 static get bcs() { if (!OutlierToleranceUpdated.cachedBcs) { OutlierToleranceUpdated.cachedBcs = OutlierToleranceUpdated.instantiateBcs() } return OutlierToleranceUpdated.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): OutlierToleranceUpdated<ToPhantomTypeArgument<T>> { return OutlierToleranceUpdated.reified( typeArg, ).new( { aggregatorId: decodeFromFields(ID.reified(), fields.aggregator_id), outlierToleranceBps: decodeFromFields("u64", fields.outlier_tolerance_bps) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): OutlierToleranceUpdated<ToPhantomTypeArgument<T>> { if (!isOutlierToleranceUpdated(item.type)) { throw new Error("not a OutlierToleranceUpdated type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return OutlierToleranceUpdated.reified( typeArg, ).new( { aggregatorId: decodeFromFieldsWithTypes(ID.reified(), item.fields.aggregator_id), outlierToleranceBps: decodeFromFieldsWithTypes("u64", item.fields.outlier_tolerance_bps) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): OutlierToleranceUpdated<ToPhantomTypeArgument<T>> { return OutlierToleranceUpdated.fromFields( typeArg, OutlierToleranceUpdated.bcs.parse(data) ) }

 toJSONField() { return {

 aggregatorId: this.aggregatorId,outlierToleranceBps: this.outlierToleranceBps.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): OutlierToleranceUpdated<ToPhantomTypeArgument<T>> { return OutlierToleranceUpdated.reified( typeArg, ).new( { aggregatorId: decodeFromJSONField(ID.reified(), field.aggregatorId), outlierToleranceBps: decodeFromJSONField("u64", field.outlierToleranceBps) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): OutlierToleranceUpdated<ToPhantomTypeArgument<T>> { if (json.$typeName !== OutlierToleranceUpdated.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(OutlierToleranceUpdated.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return OutlierToleranceUpdated.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): OutlierToleranceUpdated<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isOutlierToleranceUpdated(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a OutlierToleranceUpdated object`); } return OutlierToleranceUpdated.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): OutlierToleranceUpdated<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isOutlierToleranceUpdated(data.bcs.type)) { throw new Error(`object at is not a OutlierToleranceUpdated object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return OutlierToleranceUpdated.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return OutlierToleranceUpdated.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<OutlierToleranceUpdated<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching OutlierToleranceUpdated object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isOutlierToleranceUpdated(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a OutlierToleranceUpdated object`); }

 return OutlierToleranceUpdated.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== PriceAggregated =============================== */

export function isPriceAggregated(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::aggregator::PriceAggregated` + '<'); }

export interface PriceAggregatedFields<T extends PhantomTypeArgument> { aggregatorId: ToField<ID>; sources: ToField<Vector<String>>; prices: ToField<Vector<"u128">>; weights: ToField<Vector<"u8">>; currentThreshold: ToField<"u64">; result: ToField<"u128"> }

export type PriceAggregatedReified<T extends PhantomTypeArgument> = Reified< PriceAggregated<T>, PriceAggregatedFields<T> >;

export class PriceAggregated<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::aggregator::PriceAggregated`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = PriceAggregated.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::aggregator::PriceAggregated<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = PriceAggregated.$isPhantom;

 readonly aggregatorId: ToField<ID>; readonly sources: ToField<Vector<String>>; readonly prices: ToField<Vector<"u128">>; readonly weights: ToField<Vector<"u8">>; readonly currentThreshold: ToField<"u64">; readonly result: ToField<"u128">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: PriceAggregatedFields<T>, ) { this.$fullTypeName = composeSuiType( PriceAggregated.$typeName, ...typeArgs ) as `${typeof PKG_V1}::aggregator::PriceAggregated<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.aggregatorId = fields.aggregatorId;; this.sources = fields.sources;; this.prices = fields.prices;; this.weights = fields.weights;; this.currentThreshold = fields.currentThreshold;; this.result = fields.result; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PriceAggregatedReified<ToPhantomTypeArgument<T>> { const reifiedBcs = PriceAggregated.bcs; return { typeName: PriceAggregated.$typeName, fullTypeName: composeSuiType( PriceAggregated.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::aggregator::PriceAggregated<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: PriceAggregated.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => PriceAggregated.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PriceAggregated.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => PriceAggregated.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => PriceAggregated.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => PriceAggregated.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => PriceAggregated.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => PriceAggregated.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => PriceAggregated.fetch( client, T, id, ), new: ( fields: PriceAggregatedFields<ToPhantomTypeArgument<T>>, ) => { return new PriceAggregated( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return PriceAggregated.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<PriceAggregated<ToPhantomTypeArgument<T>>>> { return phantom(PriceAggregated.reified( T )); } static get p() { return PriceAggregated.phantom }

 private static instantiateBcs() { return bcs.struct("PriceAggregated", {

 aggregator_id: ID.bcs, sources: bcs.vector(String.bcs), prices: bcs.vector(bcs.u128()), weights: bcs.vector(bcs.u8()), current_threshold: bcs.u64(), result: bcs.u128()

}) };

 private static cachedBcs: ReturnType<typeof PriceAggregated.instantiateBcs> | null = null;

 static get bcs() { if (!PriceAggregated.cachedBcs) { PriceAggregated.cachedBcs = PriceAggregated.instantiateBcs() } return PriceAggregated.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): PriceAggregated<ToPhantomTypeArgument<T>> { return PriceAggregated.reified( typeArg, ).new( { aggregatorId: decodeFromFields(ID.reified(), fields.aggregator_id), sources: decodeFromFields(reified.vector(String.reified()), fields.sources), prices: decodeFromFields(reified.vector("u128"), fields.prices), weights: decodeFromFields(reified.vector("u8"), fields.weights), currentThreshold: decodeFromFields("u64", fields.current_threshold), result: decodeFromFields("u128", fields.result) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): PriceAggregated<ToPhantomTypeArgument<T>> { if (!isPriceAggregated(item.type)) { throw new Error("not a PriceAggregated type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return PriceAggregated.reified( typeArg, ).new( { aggregatorId: decodeFromFieldsWithTypes(ID.reified(), item.fields.aggregator_id), sources: decodeFromFieldsWithTypes(reified.vector(String.reified()), item.fields.sources), prices: decodeFromFieldsWithTypes(reified.vector("u128"), item.fields.prices), weights: decodeFromFieldsWithTypes(reified.vector("u8"), item.fields.weights), currentThreshold: decodeFromFieldsWithTypes("u64", item.fields.current_threshold), result: decodeFromFieldsWithTypes("u128", item.fields.result) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): PriceAggregated<ToPhantomTypeArgument<T>> { return PriceAggregated.fromFields( typeArg, PriceAggregated.bcs.parse(data) ) }

 toJSONField() { return {

 aggregatorId: this.aggregatorId,sources: fieldToJSON<Vector<String>>(`vector<${String.$typeName}>`, this.sources),prices: fieldToJSON<Vector<"u128">>(`vector<u128>`, this.prices),weights: fieldToJSON<Vector<"u8">>(`vector<u8>`, this.weights),currentThreshold: this.currentThreshold.toString(),result: this.result.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): PriceAggregated<ToPhantomTypeArgument<T>> { return PriceAggregated.reified( typeArg, ).new( { aggregatorId: decodeFromJSONField(ID.reified(), field.aggregatorId), sources: decodeFromJSONField(reified.vector(String.reified()), field.sources), prices: decodeFromJSONField(reified.vector("u128"), field.prices), weights: decodeFromJSONField(reified.vector("u8"), field.weights), currentThreshold: decodeFromJSONField("u64", field.currentThreshold), result: decodeFromJSONField("u128", field.result) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): PriceAggregated<ToPhantomTypeArgument<T>> { if (json.$typeName !== PriceAggregated.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(PriceAggregated.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return PriceAggregated.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): PriceAggregated<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPriceAggregated(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PriceAggregated object`); } return PriceAggregated.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): PriceAggregated<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPriceAggregated(data.bcs.type)) { throw new Error(`object at is not a PriceAggregated object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return PriceAggregated.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PriceAggregated.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<PriceAggregated<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PriceAggregated object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPriceAggregated(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PriceAggregated object`); }

 return PriceAggregated.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== PriceAggregator =============================== */

export function isPriceAggregator(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::aggregator::PriceAggregator` + '<'); }

export interface PriceAggregatorFields<T extends PhantomTypeArgument> { id: ToField<UID>; weights: ToField<VecMap<TypeName, "u8">>; weightThreshold: ToField<"u64">; outlierTolerance: ToField<Float> }

export type PriceAggregatorReified<T extends PhantomTypeArgument> = Reified< PriceAggregator<T>, PriceAggregatorFields<T> >;

export class PriceAggregator<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::aggregator::PriceAggregator`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = PriceAggregator.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::aggregator::PriceAggregator<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = PriceAggregator.$isPhantom;

 readonly id: ToField<UID>; readonly weights: ToField<VecMap<TypeName, "u8">>; readonly weightThreshold: ToField<"u64">; readonly outlierTolerance: ToField<Float>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: PriceAggregatorFields<T>, ) { this.$fullTypeName = composeSuiType( PriceAggregator.$typeName, ...typeArgs ) as `${typeof PKG_V1}::aggregator::PriceAggregator<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.weights = fields.weights;; this.weightThreshold = fields.weightThreshold;; this.outlierTolerance = fields.outlierTolerance; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PriceAggregatorReified<ToPhantomTypeArgument<T>> { const reifiedBcs = PriceAggregator.bcs; return { typeName: PriceAggregator.$typeName, fullTypeName: composeSuiType( PriceAggregator.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::aggregator::PriceAggregator<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: PriceAggregator.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => PriceAggregator.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PriceAggregator.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => PriceAggregator.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => PriceAggregator.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => PriceAggregator.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => PriceAggregator.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => PriceAggregator.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => PriceAggregator.fetch( client, T, id, ), new: ( fields: PriceAggregatorFields<ToPhantomTypeArgument<T>>, ) => { return new PriceAggregator( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return PriceAggregator.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<PriceAggregator<ToPhantomTypeArgument<T>>>> { return phantom(PriceAggregator.reified( T )); } static get p() { return PriceAggregator.phantom }

 private static instantiateBcs() { return bcs.struct("PriceAggregator", {

 id: UID.bcs, weights: VecMap.bcs(TypeName.bcs, bcs.u8()), weight_threshold: bcs.u64(), outlier_tolerance: Float.bcs

}) };

 private static cachedBcs: ReturnType<typeof PriceAggregator.instantiateBcs> | null = null;

 static get bcs() { if (!PriceAggregator.cachedBcs) { PriceAggregator.cachedBcs = PriceAggregator.instantiateBcs() } return PriceAggregator.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): PriceAggregator<ToPhantomTypeArgument<T>> { return PriceAggregator.reified( typeArg, ).new( { id: decodeFromFields(UID.reified(), fields.id), weights: decodeFromFields(VecMap.reified(TypeName.reified(), "u8"), fields.weights), weightThreshold: decodeFromFields("u64", fields.weight_threshold), outlierTolerance: decodeFromFields(Float.reified(), fields.outlier_tolerance) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): PriceAggregator<ToPhantomTypeArgument<T>> { if (!isPriceAggregator(item.type)) { throw new Error("not a PriceAggregator type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return PriceAggregator.reified( typeArg, ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), weights: decodeFromFieldsWithTypes(VecMap.reified(TypeName.reified(), "u8"), item.fields.weights), weightThreshold: decodeFromFieldsWithTypes("u64", item.fields.weight_threshold), outlierTolerance: decodeFromFieldsWithTypes(Float.reified(), item.fields.outlier_tolerance) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): PriceAggregator<ToPhantomTypeArgument<T>> { return PriceAggregator.fromFields( typeArg, PriceAggregator.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,weights: this.weights.toJSONField(),weightThreshold: this.weightThreshold.toString(),outlierTolerance: this.outlierTolerance.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): PriceAggregator<ToPhantomTypeArgument<T>> { return PriceAggregator.reified( typeArg, ).new( { id: decodeFromJSONField(UID.reified(), field.id), weights: decodeFromJSONField(VecMap.reified(TypeName.reified(), "u8"), field.weights), weightThreshold: decodeFromJSONField("u64", field.weightThreshold), outlierTolerance: decodeFromJSONField(Float.reified(), field.outlierTolerance) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): PriceAggregator<ToPhantomTypeArgument<T>> { if (json.$typeName !== PriceAggregator.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(PriceAggregator.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return PriceAggregator.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): PriceAggregator<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPriceAggregator(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PriceAggregator object`); } return PriceAggregator.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): PriceAggregator<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPriceAggregator(data.bcs.type)) { throw new Error(`object at is not a PriceAggregator object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return PriceAggregator.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PriceAggregator.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<PriceAggregator<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PriceAggregator object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPriceAggregator(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PriceAggregator object`); }

 return PriceAggregator.fromSuiObjectData( typeArg, res.data ); }

 }
