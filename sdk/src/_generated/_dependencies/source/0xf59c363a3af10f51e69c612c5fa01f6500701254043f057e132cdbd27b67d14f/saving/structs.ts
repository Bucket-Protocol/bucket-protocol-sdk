import * as reified from "../../../../_framework/reified";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, fieldToJSON, phantom, ToTypeStr as ToPhantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {Option} from "../../0x1/option/structs";
import {TypeName} from "../../0x1/type-name/structs";
import {Balance, Supply} from "../../0x2/balance/structs";
import {UID} from "../../0x2/object/structs";
import {Table} from "../../0x2/table/structs";
import {VecSet} from "../../0x2/vec-set/structs";
import {USDB} from "../../0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9/usdb/structs";
import {Double} from "../../0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/double/structs";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== InterestConfig =============================== */

export function isInterestConfig(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::saving::InterestConfig`; }

export interface InterestConfigFields { savingRate: ToField<Double>; lastEmitted: ToField<"u64"> }

export type InterestConfigReified = Reified< InterestConfig, InterestConfigFields >;

export class InterestConfig implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving::InterestConfig`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = InterestConfig.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving::InterestConfig`; readonly $typeArgs: []; readonly $isPhantom = InterestConfig.$isPhantom;

 readonly savingRate: ToField<Double>; readonly lastEmitted: ToField<"u64">

 private constructor(typeArgs: [], fields: InterestConfigFields, ) { this.$fullTypeName = composeSuiType( InterestConfig.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving::InterestConfig`; this.$typeArgs = typeArgs;

 this.savingRate = fields.savingRate;; this.lastEmitted = fields.lastEmitted; }

 static reified( ): InterestConfigReified { const reifiedBcs = InterestConfig.bcs; return { typeName: InterestConfig.$typeName, fullTypeName: composeSuiType( InterestConfig.$typeName, ...[] ) as `${typeof PKG_V1}::saving::InterestConfig`, typeArgs: [ ] as [], isPhantom: InterestConfig.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => InterestConfig.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => InterestConfig.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => InterestConfig.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => InterestConfig.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => InterestConfig.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => InterestConfig.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => InterestConfig.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => InterestConfig.fetch( client, id, ), new: ( fields: InterestConfigFields, ) => { return new InterestConfig( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return InterestConfig.reified() }

 static phantom( ): PhantomReified<ToTypeStr<InterestConfig>> { return phantom(InterestConfig.reified( )); } static get p() { return InterestConfig.phantom() }

 private static instantiateBcs() { return bcs.struct("InterestConfig", {

 saving_rate: Double.bcs, last_emitted: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof InterestConfig.instantiateBcs> | null = null;

 static get bcs() { if (!InterestConfig.cachedBcs) { InterestConfig.cachedBcs = InterestConfig.instantiateBcs() } return InterestConfig.cachedBcs };

 static fromFields( fields: Record<string, any> ): InterestConfig { return InterestConfig.reified( ).new( { savingRate: decodeFromFields(Double.reified(), fields.saving_rate), lastEmitted: decodeFromFields("u64", fields.last_emitted) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): InterestConfig { if (!isInterestConfig(item.type)) { throw new Error("not a InterestConfig type");

 }

 return InterestConfig.reified( ).new( { savingRate: decodeFromFieldsWithTypes(Double.reified(), item.fields.saving_rate), lastEmitted: decodeFromFieldsWithTypes("u64", item.fields.last_emitted) } ) }

 static fromBcs( data: Uint8Array ): InterestConfig { return InterestConfig.fromFields( InterestConfig.bcs.parse(data) ) }

 toJSONField() { return {

 savingRate: this.savingRate.toJSONField(),lastEmitted: this.lastEmitted.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): InterestConfig { return InterestConfig.reified( ).new( { savingRate: decodeFromJSONField(Double.reified(), field.savingRate), lastEmitted: decodeFromJSONField("u64", field.lastEmitted) } ) }

 static fromJSON( json: Record<string, any> ): InterestConfig { if (json.$typeName !== InterestConfig.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return InterestConfig.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): InterestConfig { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isInterestConfig(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a InterestConfig object`); } return InterestConfig.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): InterestConfig { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isInterestConfig(data.bcs.type)) { throw new Error(`object at is not a InterestConfig object`); }

 return InterestConfig.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return InterestConfig.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<InterestConfig> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching InterestConfig object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isInterestConfig(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a InterestConfig object`); }

 return InterestConfig.fromSuiObjectData( res.data ); }

 }

/* ============================== Position =============================== */

export function isPosition(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving::Position` + '<'); }

export interface PositionFields<T extends PhantomTypeArgument> { balance: ToField<Balance<T>>; lastUpdateTimestamp: ToField<"u64"> }

export type PositionReified<T extends PhantomTypeArgument> = Reified< Position<T>, PositionFields<T> >;

export class Position<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving::Position`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Position.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving::Position<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = Position.$isPhantom;

 readonly balance: ToField<Balance<T>>; readonly lastUpdateTimestamp: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: PositionFields<T>, ) { this.$fullTypeName = composeSuiType( Position.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving::Position<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.balance = fields.balance;; this.lastUpdateTimestamp = fields.lastUpdateTimestamp; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PositionReified<ToPhantomTypeArgument<T>> { const reifiedBcs = Position.bcs; return { typeName: Position.$typeName, fullTypeName: composeSuiType( Position.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::saving::Position<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: Position.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => Position.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Position.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => Position.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Position.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => Position.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => Position.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => Position.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => Position.fetch( client, T, id, ), new: ( fields: PositionFields<ToPhantomTypeArgument<T>>, ) => { return new Position( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Position.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<Position<ToPhantomTypeArgument<T>>>> { return phantom(Position.reified( T )); } static get p() { return Position.phantom }

 private static instantiateBcs() { return bcs.struct("Position", {

 balance: Balance.bcs, last_update_timestamp: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof Position.instantiateBcs> | null = null;

 static get bcs() { if (!Position.cachedBcs) { Position.cachedBcs = Position.instantiateBcs() } return Position.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): Position<ToPhantomTypeArgument<T>> { return Position.reified( typeArg, ).new( { balance: decodeFromFields(Balance.reified(typeArg), fields.balance), lastUpdateTimestamp: decodeFromFields("u64", fields.last_update_timestamp) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): Position<ToPhantomTypeArgument<T>> { if (!isPosition(item.type)) { throw new Error("not a Position type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Position.reified( typeArg, ).new( { balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance), lastUpdateTimestamp: decodeFromFieldsWithTypes("u64", item.fields.last_update_timestamp) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): Position<ToPhantomTypeArgument<T>> { return Position.fromFields( typeArg, Position.bcs.parse(data) ) }

 toJSONField() { return {

 balance: this.balance.toJSONField(),lastUpdateTimestamp: this.lastUpdateTimestamp.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): Position<ToPhantomTypeArgument<T>> { return Position.reified( typeArg, ).new( { balance: decodeFromJSONField(Balance.reified(typeArg), field.balance), lastUpdateTimestamp: decodeFromJSONField("u64", field.lastUpdateTimestamp) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): Position<ToPhantomTypeArgument<T>> { if (json.$typeName !== Position.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Position.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Position.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): Position<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPosition(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Position object`); } return Position.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): Position<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPosition(data.bcs.type)) { throw new Error(`object at is not a Position object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Position.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Position.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<Position<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Position object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPosition(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Position object`); }

 return Position.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== SavingPool =============================== */

export function isSavingPool(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving::SavingPool` + '<'); }

export interface SavingPoolFields<T extends PhantomTypeArgument> { id: ToField<UID>; lpSupply: ToField<Supply<T>>; depositCapAmount: ToField<Option<"u64">>; usdbReserveBalance: ToField<Balance<ToPhantom<USDB>>>; positions: ToField<Table<"address", ToPhantom<Position<T>>>>; savingConfig: ToField<InterestConfig>; depositResponseChecklist: ToField<VecSet<TypeName>>; withdrawResponseChecklist: ToField<VecSet<TypeName>>; positionLocker: ToField<VecSet<"address">> }

export type SavingPoolReified<T extends PhantomTypeArgument> = Reified< SavingPool<T>, SavingPoolFields<T> >;

export class SavingPool<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving::SavingPool`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = SavingPool.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving::SavingPool<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = SavingPool.$isPhantom;

 readonly id: ToField<UID>; readonly lpSupply: ToField<Supply<T>>; readonly depositCapAmount: ToField<Option<"u64">>; readonly usdbReserveBalance: ToField<Balance<ToPhantom<USDB>>>; readonly positions: ToField<Table<"address", ToPhantom<Position<T>>>>; readonly savingConfig: ToField<InterestConfig>; readonly depositResponseChecklist: ToField<VecSet<TypeName>>; readonly withdrawResponseChecklist: ToField<VecSet<TypeName>>; readonly positionLocker: ToField<VecSet<"address">>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: SavingPoolFields<T>, ) { this.$fullTypeName = composeSuiType( SavingPool.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving::SavingPool<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.lpSupply = fields.lpSupply;; this.depositCapAmount = fields.depositCapAmount;; this.usdbReserveBalance = fields.usdbReserveBalance;; this.positions = fields.positions;; this.savingConfig = fields.savingConfig;; this.depositResponseChecklist = fields.depositResponseChecklist;; this.withdrawResponseChecklist = fields.withdrawResponseChecklist;; this.positionLocker = fields.positionLocker; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): SavingPoolReified<ToPhantomTypeArgument<T>> { const reifiedBcs = SavingPool.bcs; return { typeName: SavingPool.$typeName, fullTypeName: composeSuiType( SavingPool.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::saving::SavingPool<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: SavingPool.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => SavingPool.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => SavingPool.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => SavingPool.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => SavingPool.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => SavingPool.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => SavingPool.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => SavingPool.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => SavingPool.fetch( client, T, id, ), new: ( fields: SavingPoolFields<ToPhantomTypeArgument<T>>, ) => { return new SavingPool( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return SavingPool.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<SavingPool<ToPhantomTypeArgument<T>>>> { return phantom(SavingPool.reified( T )); } static get p() { return SavingPool.phantom }

 private static instantiateBcs() { return bcs.struct("SavingPool", {

 id: UID.bcs, lp_supply: Supply.bcs, deposit_cap_amount: Option.bcs(bcs.u64()), usdb_reserve_balance: Balance.bcs, positions: Table.bcs, saving_config: InterestConfig.bcs, deposit_response_checklist: VecSet.bcs(TypeName.bcs), withdraw_response_checklist: VecSet.bcs(TypeName.bcs), position_locker: VecSet.bcs(bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }))

}) };

 private static cachedBcs: ReturnType<typeof SavingPool.instantiateBcs> | null = null;

 static get bcs() { if (!SavingPool.cachedBcs) { SavingPool.cachedBcs = SavingPool.instantiateBcs() } return SavingPool.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): SavingPool<ToPhantomTypeArgument<T>> { return SavingPool.reified( typeArg, ).new( { id: decodeFromFields(UID.reified(), fields.id), lpSupply: decodeFromFields(Supply.reified(typeArg), fields.lp_supply), depositCapAmount: decodeFromFields(Option.reified("u64"), fields.deposit_cap_amount), usdbReserveBalance: decodeFromFields(Balance.reified(reified.phantom(USDB.reified())), fields.usdb_reserve_balance), positions: decodeFromFields(Table.reified(reified.phantom("address"), reified.phantom(Position.reified(typeArg))), fields.positions), savingConfig: decodeFromFields(InterestConfig.reified(), fields.saving_config), depositResponseChecklist: decodeFromFields(VecSet.reified(TypeName.reified()), fields.deposit_response_checklist), withdrawResponseChecklist: decodeFromFields(VecSet.reified(TypeName.reified()), fields.withdraw_response_checklist), positionLocker: decodeFromFields(VecSet.reified("address"), fields.position_locker) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): SavingPool<ToPhantomTypeArgument<T>> { if (!isSavingPool(item.type)) { throw new Error("not a SavingPool type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return SavingPool.reified( typeArg, ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), lpSupply: decodeFromFieldsWithTypes(Supply.reified(typeArg), item.fields.lp_supply), depositCapAmount: decodeFromFieldsWithTypes(Option.reified("u64"), item.fields.deposit_cap_amount), usdbReserveBalance: decodeFromFieldsWithTypes(Balance.reified(reified.phantom(USDB.reified())), item.fields.usdb_reserve_balance), positions: decodeFromFieldsWithTypes(Table.reified(reified.phantom("address"), reified.phantom(Position.reified(typeArg))), item.fields.positions), savingConfig: decodeFromFieldsWithTypes(InterestConfig.reified(), item.fields.saving_config), depositResponseChecklist: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.deposit_response_checklist), withdrawResponseChecklist: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.withdraw_response_checklist), positionLocker: decodeFromFieldsWithTypes(VecSet.reified("address"), item.fields.position_locker) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): SavingPool<ToPhantomTypeArgument<T>> { return SavingPool.fromFields( typeArg, SavingPool.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,lpSupply: this.lpSupply.toJSONField(),depositCapAmount: fieldToJSON<Option<"u64">>(`${Option.$typeName}<u64>`, this.depositCapAmount),usdbReserveBalance: this.usdbReserveBalance.toJSONField(),positions: this.positions.toJSONField(),savingConfig: this.savingConfig.toJSONField(),depositResponseChecklist: this.depositResponseChecklist.toJSONField(),withdrawResponseChecklist: this.withdrawResponseChecklist.toJSONField(),positionLocker: this.positionLocker.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): SavingPool<ToPhantomTypeArgument<T>> { return SavingPool.reified( typeArg, ).new( { id: decodeFromJSONField(UID.reified(), field.id), lpSupply: decodeFromJSONField(Supply.reified(typeArg), field.lpSupply), depositCapAmount: decodeFromJSONField(Option.reified("u64"), field.depositCapAmount), usdbReserveBalance: decodeFromJSONField(Balance.reified(reified.phantom(USDB.reified())), field.usdbReserveBalance), positions: decodeFromJSONField(Table.reified(reified.phantom("address"), reified.phantom(Position.reified(typeArg))), field.positions), savingConfig: decodeFromJSONField(InterestConfig.reified(), field.savingConfig), depositResponseChecklist: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.depositResponseChecklist), withdrawResponseChecklist: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.withdrawResponseChecklist), positionLocker: decodeFromJSONField(VecSet.reified("address"), field.positionLocker) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): SavingPool<ToPhantomTypeArgument<T>> { if (json.$typeName !== SavingPool.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(SavingPool.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return SavingPool.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): SavingPool<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isSavingPool(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a SavingPool object`); } return SavingPool.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): SavingPool<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isSavingPool(data.bcs.type)) { throw new Error(`object at is not a SavingPool object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return SavingPool.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return SavingPool.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<SavingPool<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching SavingPool object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isSavingPool(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a SavingPool object`); }

 return SavingPool.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== DepositResponse =============================== */

export function isDepositResponse(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving::DepositResponse` + '<'); }

export interface DepositResponseFields<T extends PhantomTypeArgument> { accountAddress: ToField<"address">; depositedUsdbAmount: ToField<"u64">; mintedLpAmount: ToField<"u64">; prevLpBalance: ToField<"u64">; prevLastUpdateTimestamp: ToField<"u64">; witnesses: ToField<VecSet<TypeName>> }

export type DepositResponseReified<T extends PhantomTypeArgument> = Reified< DepositResponse<T>, DepositResponseFields<T> >;

export class DepositResponse<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving::DepositResponse`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = DepositResponse.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving::DepositResponse<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = DepositResponse.$isPhantom;

 readonly accountAddress: ToField<"address">; readonly depositedUsdbAmount: ToField<"u64">; readonly mintedLpAmount: ToField<"u64">; readonly prevLpBalance: ToField<"u64">; readonly prevLastUpdateTimestamp: ToField<"u64">; readonly witnesses: ToField<VecSet<TypeName>>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: DepositResponseFields<T>, ) { this.$fullTypeName = composeSuiType( DepositResponse.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving::DepositResponse<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.accountAddress = fields.accountAddress;; this.depositedUsdbAmount = fields.depositedUsdbAmount;; this.mintedLpAmount = fields.mintedLpAmount;; this.prevLpBalance = fields.prevLpBalance;; this.prevLastUpdateTimestamp = fields.prevLastUpdateTimestamp;; this.witnesses = fields.witnesses; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): DepositResponseReified<ToPhantomTypeArgument<T>> { const reifiedBcs = DepositResponse.bcs; return { typeName: DepositResponse.$typeName, fullTypeName: composeSuiType( DepositResponse.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::saving::DepositResponse<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: DepositResponse.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => DepositResponse.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DepositResponse.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => DepositResponse.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => DepositResponse.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => DepositResponse.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => DepositResponse.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => DepositResponse.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => DepositResponse.fetch( client, T, id, ), new: ( fields: DepositResponseFields<ToPhantomTypeArgument<T>>, ) => { return new DepositResponse( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DepositResponse.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<DepositResponse<ToPhantomTypeArgument<T>>>> { return phantom(DepositResponse.reified( T )); } static get p() { return DepositResponse.phantom }

 private static instantiateBcs() { return bcs.struct("DepositResponse", {

 account_address: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), deposited_usdb_amount: bcs.u64(), minted_lp_amount: bcs.u64(), prev_lp_balance: bcs.u64(), prev_last_update_timestamp: bcs.u64(), witnesses: VecSet.bcs(TypeName.bcs)

}) };

 private static cachedBcs: ReturnType<typeof DepositResponse.instantiateBcs> | null = null;

 static get bcs() { if (!DepositResponse.cachedBcs) { DepositResponse.cachedBcs = DepositResponse.instantiateBcs() } return DepositResponse.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): DepositResponse<ToPhantomTypeArgument<T>> { return DepositResponse.reified( typeArg, ).new( { accountAddress: decodeFromFields("address", fields.account_address), depositedUsdbAmount: decodeFromFields("u64", fields.deposited_usdb_amount), mintedLpAmount: decodeFromFields("u64", fields.minted_lp_amount), prevLpBalance: decodeFromFields("u64", fields.prev_lp_balance), prevLastUpdateTimestamp: decodeFromFields("u64", fields.prev_last_update_timestamp), witnesses: decodeFromFields(VecSet.reified(TypeName.reified()), fields.witnesses) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): DepositResponse<ToPhantomTypeArgument<T>> { if (!isDepositResponse(item.type)) { throw new Error("not a DepositResponse type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return DepositResponse.reified( typeArg, ).new( { accountAddress: decodeFromFieldsWithTypes("address", item.fields.account_address), depositedUsdbAmount: decodeFromFieldsWithTypes("u64", item.fields.deposited_usdb_amount), mintedLpAmount: decodeFromFieldsWithTypes("u64", item.fields.minted_lp_amount), prevLpBalance: decodeFromFieldsWithTypes("u64", item.fields.prev_lp_balance), prevLastUpdateTimestamp: decodeFromFieldsWithTypes("u64", item.fields.prev_last_update_timestamp), witnesses: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.witnesses) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): DepositResponse<ToPhantomTypeArgument<T>> { return DepositResponse.fromFields( typeArg, DepositResponse.bcs.parse(data) ) }

 toJSONField() { return {

 accountAddress: this.accountAddress,depositedUsdbAmount: this.depositedUsdbAmount.toString(),mintedLpAmount: this.mintedLpAmount.toString(),prevLpBalance: this.prevLpBalance.toString(),prevLastUpdateTimestamp: this.prevLastUpdateTimestamp.toString(),witnesses: this.witnesses.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): DepositResponse<ToPhantomTypeArgument<T>> { return DepositResponse.reified( typeArg, ).new( { accountAddress: decodeFromJSONField("address", field.accountAddress), depositedUsdbAmount: decodeFromJSONField("u64", field.depositedUsdbAmount), mintedLpAmount: decodeFromJSONField("u64", field.mintedLpAmount), prevLpBalance: decodeFromJSONField("u64", field.prevLpBalance), prevLastUpdateTimestamp: decodeFromJSONField("u64", field.prevLastUpdateTimestamp), witnesses: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.witnesses) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): DepositResponse<ToPhantomTypeArgument<T>> { if (json.$typeName !== DepositResponse.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DepositResponse.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return DepositResponse.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): DepositResponse<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDepositResponse(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DepositResponse object`); } return DepositResponse.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): DepositResponse<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDepositResponse(data.bcs.type)) { throw new Error(`object at is not a DepositResponse object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return DepositResponse.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DepositResponse.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<DepositResponse<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DepositResponse object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDepositResponse(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DepositResponse object`); }

 return DepositResponse.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== WithdrawResponse =============================== */

export function isWithdrawResponse(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::saving::WithdrawResponse` + '<'); }

export interface WithdrawResponseFields<T extends PhantomTypeArgument> { accountAddress: ToField<"address">; burnedLpAmount: ToField<"u64">; prevLpBalance: ToField<"u64">; prevLastUpdateTimestamp: ToField<"u64">; withdrawalUsdbAmount: ToField<"u64">; witnesses: ToField<VecSet<TypeName>> }

export type WithdrawResponseReified<T extends PhantomTypeArgument> = Reified< WithdrawResponse<T>, WithdrawResponseFields<T> >;

export class WithdrawResponse<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::saving::WithdrawResponse`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = WithdrawResponse.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::saving::WithdrawResponse<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = WithdrawResponse.$isPhantom;

 readonly accountAddress: ToField<"address">; readonly burnedLpAmount: ToField<"u64">; readonly prevLpBalance: ToField<"u64">; readonly prevLastUpdateTimestamp: ToField<"u64">; readonly withdrawalUsdbAmount: ToField<"u64">; readonly witnesses: ToField<VecSet<TypeName>>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: WithdrawResponseFields<T>, ) { this.$fullTypeName = composeSuiType( WithdrawResponse.$typeName, ...typeArgs ) as `${typeof PKG_V1}::saving::WithdrawResponse<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.accountAddress = fields.accountAddress;; this.burnedLpAmount = fields.burnedLpAmount;; this.prevLpBalance = fields.prevLpBalance;; this.prevLastUpdateTimestamp = fields.prevLastUpdateTimestamp;; this.withdrawalUsdbAmount = fields.withdrawalUsdbAmount;; this.witnesses = fields.witnesses; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): WithdrawResponseReified<ToPhantomTypeArgument<T>> { const reifiedBcs = WithdrawResponse.bcs; return { typeName: WithdrawResponse.$typeName, fullTypeName: composeSuiType( WithdrawResponse.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::saving::WithdrawResponse<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: WithdrawResponse.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => WithdrawResponse.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => WithdrawResponse.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => WithdrawResponse.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => WithdrawResponse.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => WithdrawResponse.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => WithdrawResponse.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => WithdrawResponse.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => WithdrawResponse.fetch( client, T, id, ), new: ( fields: WithdrawResponseFields<ToPhantomTypeArgument<T>>, ) => { return new WithdrawResponse( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return WithdrawResponse.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<WithdrawResponse<ToPhantomTypeArgument<T>>>> { return phantom(WithdrawResponse.reified( T )); } static get p() { return WithdrawResponse.phantom }

 private static instantiateBcs() { return bcs.struct("WithdrawResponse", {

 account_address: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), burned_lp_amount: bcs.u64(), prev_lp_balance: bcs.u64(), prev_last_update_timestamp: bcs.u64(), withdrawal_usdb_amount: bcs.u64(), witnesses: VecSet.bcs(TypeName.bcs)

}) };

 private static cachedBcs: ReturnType<typeof WithdrawResponse.instantiateBcs> | null = null;

 static get bcs() { if (!WithdrawResponse.cachedBcs) { WithdrawResponse.cachedBcs = WithdrawResponse.instantiateBcs() } return WithdrawResponse.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): WithdrawResponse<ToPhantomTypeArgument<T>> { return WithdrawResponse.reified( typeArg, ).new( { accountAddress: decodeFromFields("address", fields.account_address), burnedLpAmount: decodeFromFields("u64", fields.burned_lp_amount), prevLpBalance: decodeFromFields("u64", fields.prev_lp_balance), prevLastUpdateTimestamp: decodeFromFields("u64", fields.prev_last_update_timestamp), withdrawalUsdbAmount: decodeFromFields("u64", fields.withdrawal_usdb_amount), witnesses: decodeFromFields(VecSet.reified(TypeName.reified()), fields.witnesses) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): WithdrawResponse<ToPhantomTypeArgument<T>> { if (!isWithdrawResponse(item.type)) { throw new Error("not a WithdrawResponse type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return WithdrawResponse.reified( typeArg, ).new( { accountAddress: decodeFromFieldsWithTypes("address", item.fields.account_address), burnedLpAmount: decodeFromFieldsWithTypes("u64", item.fields.burned_lp_amount), prevLpBalance: decodeFromFieldsWithTypes("u64", item.fields.prev_lp_balance), prevLastUpdateTimestamp: decodeFromFieldsWithTypes("u64", item.fields.prev_last_update_timestamp), withdrawalUsdbAmount: decodeFromFieldsWithTypes("u64", item.fields.withdrawal_usdb_amount), witnesses: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.witnesses) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): WithdrawResponse<ToPhantomTypeArgument<T>> { return WithdrawResponse.fromFields( typeArg, WithdrawResponse.bcs.parse(data) ) }

 toJSONField() { return {

 accountAddress: this.accountAddress,burnedLpAmount: this.burnedLpAmount.toString(),prevLpBalance: this.prevLpBalance.toString(),prevLastUpdateTimestamp: this.prevLastUpdateTimestamp.toString(),withdrawalUsdbAmount: this.withdrawalUsdbAmount.toString(),witnesses: this.witnesses.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): WithdrawResponse<ToPhantomTypeArgument<T>> { return WithdrawResponse.reified( typeArg, ).new( { accountAddress: decodeFromJSONField("address", field.accountAddress), burnedLpAmount: decodeFromJSONField("u64", field.burnedLpAmount), prevLpBalance: decodeFromJSONField("u64", field.prevLpBalance), prevLastUpdateTimestamp: decodeFromJSONField("u64", field.prevLastUpdateTimestamp), withdrawalUsdbAmount: decodeFromJSONField("u64", field.withdrawalUsdbAmount), witnesses: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.witnesses) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): WithdrawResponse<ToPhantomTypeArgument<T>> { if (json.$typeName !== WithdrawResponse.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(WithdrawResponse.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return WithdrawResponse.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): WithdrawResponse<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isWithdrawResponse(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a WithdrawResponse object`); } return WithdrawResponse.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): WithdrawResponse<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isWithdrawResponse(data.bcs.type)) { throw new Error(`object at is not a WithdrawResponse object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return WithdrawResponse.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return WithdrawResponse.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<WithdrawResponse<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching WithdrawResponse object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isWithdrawResponse(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a WithdrawResponse object`); }

 return WithdrawResponse.fromSuiObjectData( typeArg, res.data ); }

 }
