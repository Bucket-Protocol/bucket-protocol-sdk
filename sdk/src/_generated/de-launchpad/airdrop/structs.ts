import {Balance} from "../../_dependencies/source/0x2/balance/structs";
import {ID, UID} from "../../_dependencies/source/0x2/object/structs";
import {VecSet} from "../../_dependencies/source/0x2/vec-set/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== AirdropPool =============================== */

export function isAirdropPool(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::airdrop::AirdropPool` + '<'); }

export interface AirdropPoolFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { id: ToField<UID>; totalSupply: ToField<"u64">; totalAllocated: ToField<"u64">; balance: ToField<Balance<T>>; startTime: ToField<"u64">; endTime: ToField<"u64">; managers: ToField<VecSet<"address">> }

export type AirdropPoolReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< AirdropPool<T, P>, AirdropPoolFields<T, P> >;

export class AirdropPool<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::airdrop::AirdropPool`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = AirdropPool.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::airdrop::AirdropPool<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = AirdropPool.$isPhantom;

 readonly id: ToField<UID>; readonly totalSupply: ToField<"u64">; readonly totalAllocated: ToField<"u64">; readonly balance: ToField<Balance<T>>; readonly startTime: ToField<"u64">; readonly endTime: ToField<"u64">; readonly managers: ToField<VecSet<"address">>

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: AirdropPoolFields<T, P>, ) { this.$fullTypeName = composeSuiType( AirdropPool.$typeName, ...typeArgs ) as `${typeof PKG_V1}::airdrop::AirdropPool<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.totalSupply = fields.totalSupply;; this.totalAllocated = fields.totalAllocated;; this.balance = fields.balance;; this.startTime = fields.startTime;; this.endTime = fields.endTime;; this.managers = fields.managers; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): AirdropPoolReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: AirdropPool.$typeName, fullTypeName: composeSuiType( AirdropPool.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::airdrop::AirdropPool<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: AirdropPool.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => AirdropPool.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => AirdropPool.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => AirdropPool.fromBcs( [T, P], data, ), bcs: AirdropPool.bcs, fromJSONField: (field: any) => AirdropPool.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => AirdropPool.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => AirdropPool.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => AirdropPool.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => AirdropPool.fetch( client, [T, P], id, ), new: ( fields: AirdropPoolFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new AirdropPool( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return AirdropPool.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<AirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(AirdropPool.reified( T, P )); } static get p() { return AirdropPool.phantom }

 static get bcs() { return bcs.struct("AirdropPool", {

 id: UID.bcs, total_supply: bcs.u64(), total_allocated: bcs.u64(), balance: Balance.bcs, start_time: bcs.u64(), end_time: bcs.u64(), managers: VecSet.bcs(bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }))

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): AirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return AirdropPool.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFields(UID.reified(), fields.id), totalSupply: decodeFromFields("u64", fields.total_supply), totalAllocated: decodeFromFields("u64", fields.total_allocated), balance: decodeFromFields(Balance.reified(typeArgs[0]), fields.balance), startTime: decodeFromFields("u64", fields.start_time), endTime: decodeFromFields("u64", fields.end_time), managers: decodeFromFields(VecSet.reified("address"), fields.managers) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): AirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isAirdropPool(item.type)) { throw new Error("not a AirdropPool type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return AirdropPool.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), totalSupply: decodeFromFieldsWithTypes("u64", item.fields.total_supply), totalAllocated: decodeFromFieldsWithTypes("u64", item.fields.total_allocated), balance: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.balance), startTime: decodeFromFieldsWithTypes("u64", item.fields.start_time), endTime: decodeFromFieldsWithTypes("u64", item.fields.end_time), managers: decodeFromFieldsWithTypes(VecSet.reified("address"), item.fields.managers) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): AirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return AirdropPool.fromFields( typeArgs, AirdropPool.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,totalSupply: this.totalSupply.toString(),totalAllocated: this.totalAllocated.toString(),balance: this.balance.toJSONField(),startTime: this.startTime.toString(),endTime: this.endTime.toString(),managers: this.managers.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): AirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return AirdropPool.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromJSONField(UID.reified(), field.id), totalSupply: decodeFromJSONField("u64", field.totalSupply), totalAllocated: decodeFromJSONField("u64", field.totalAllocated), balance: decodeFromJSONField(Balance.reified(typeArgs[0]), field.balance), startTime: decodeFromJSONField("u64", field.startTime), endTime: decodeFromJSONField("u64", field.endTime), managers: decodeFromJSONField(VecSet.reified("address"), field.managers) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): AirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== AirdropPool.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(AirdropPool.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return AirdropPool.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): AirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isAirdropPool(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a AirdropPool object`); } return AirdropPool.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): AirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isAirdropPool(data.bcs.type)) { throw new Error(`object at is not a AirdropPool object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return AirdropPool.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return AirdropPool.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<AirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching AirdropPool object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isAirdropPool(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a AirdropPool object`); }

 return AirdropPool.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Claim =============================== */

export function isClaim(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::airdrop::Claim` + '<'); }

export interface ClaimFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { id: ToField<ID>; poolId: ToField<ID>; amount: ToField<"u64"> }

export type ClaimReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< Claim<T, P>, ClaimFields<T, P> >;

export class Claim<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::airdrop::Claim`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = Claim.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::airdrop::Claim<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = Claim.$isPhantom;

 readonly id: ToField<ID>; readonly poolId: ToField<ID>; readonly amount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: ClaimFields<T, P>, ) { this.$fullTypeName = composeSuiType( Claim.$typeName, ...typeArgs ) as `${typeof PKG_V1}::airdrop::Claim<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.poolId = fields.poolId;; this.amount = fields.amount; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): ClaimReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: Claim.$typeName, fullTypeName: composeSuiType( Claim.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::airdrop::Claim<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: Claim.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => Claim.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Claim.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => Claim.fromBcs( [T, P], data, ), bcs: Claim.bcs, fromJSONField: (field: any) => Claim.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => Claim.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => Claim.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => Claim.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => Claim.fetch( client, [T, P], id, ), new: ( fields: ClaimFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new Claim( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Claim.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<Claim<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(Claim.reified( T, P )); } static get p() { return Claim.phantom }

 static get bcs() { return bcs.struct("Claim", {

 id: ID.bcs, pool_id: ID.bcs, amount: bcs.u64()

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): Claim<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return Claim.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFields(ID.reified(), fields.id), poolId: decodeFromFields(ID.reified(), fields.pool_id), amount: decodeFromFields("u64", fields.amount) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): Claim<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isClaim(item.type)) { throw new Error("not a Claim type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Claim.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), amount: decodeFromFieldsWithTypes("u64", item.fields.amount) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): Claim<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return Claim.fromFields( typeArgs, Claim.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,poolId: this.poolId,amount: this.amount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): Claim<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return Claim.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromJSONField(ID.reified(), field.id), poolId: decodeFromJSONField(ID.reified(), field.poolId), amount: decodeFromJSONField("u64", field.amount) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): Claim<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== Claim.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Claim.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Claim.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): Claim<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isClaim(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Claim object`); } return Claim.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): Claim<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isClaim(data.bcs.type)) { throw new Error(`object at is not a Claim object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Claim.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Claim.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<Claim<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Claim object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isClaim(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Claim object`); }

 return Claim.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== DestroyAirdropPool =============================== */

export function isDestroyAirdropPool(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::airdrop::DestroyAirdropPool` + '<'); }

export interface DestroyAirdropPoolFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { poolId: ToField<ID>; surplus: ToField<"u64"> }

export type DestroyAirdropPoolReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< DestroyAirdropPool<T, P>, DestroyAirdropPoolFields<T, P> >;

export class DestroyAirdropPool<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::airdrop::DestroyAirdropPool`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = DestroyAirdropPool.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::airdrop::DestroyAirdropPool<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = DestroyAirdropPool.$isPhantom;

 readonly poolId: ToField<ID>; readonly surplus: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: DestroyAirdropPoolFields<T, P>, ) { this.$fullTypeName = composeSuiType( DestroyAirdropPool.$typeName, ...typeArgs ) as `${typeof PKG_V1}::airdrop::DestroyAirdropPool<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.poolId = fields.poolId;; this.surplus = fields.surplus; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): DestroyAirdropPoolReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: DestroyAirdropPool.$typeName, fullTypeName: composeSuiType( DestroyAirdropPool.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::airdrop::DestroyAirdropPool<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: DestroyAirdropPool.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => DestroyAirdropPool.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DestroyAirdropPool.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => DestroyAirdropPool.fromBcs( [T, P], data, ), bcs: DestroyAirdropPool.bcs, fromJSONField: (field: any) => DestroyAirdropPool.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => DestroyAirdropPool.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => DestroyAirdropPool.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => DestroyAirdropPool.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => DestroyAirdropPool.fetch( client, [T, P], id, ), new: ( fields: DestroyAirdropPoolFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new DestroyAirdropPool( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DestroyAirdropPool.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<DestroyAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(DestroyAirdropPool.reified( T, P )); } static get p() { return DestroyAirdropPool.phantom }

 static get bcs() { return bcs.struct("DestroyAirdropPool", {

 pool_id: ID.bcs, surplus: bcs.u64()

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): DestroyAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return DestroyAirdropPool.reified( typeArgs[0], typeArgs[1], ).new( { poolId: decodeFromFields(ID.reified(), fields.pool_id), surplus: decodeFromFields("u64", fields.surplus) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): DestroyAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isDestroyAirdropPool(item.type)) { throw new Error("not a DestroyAirdropPool type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return DestroyAirdropPool.reified( typeArgs[0], typeArgs[1], ).new( { poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), surplus: decodeFromFieldsWithTypes("u64", item.fields.surplus) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): DestroyAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return DestroyAirdropPool.fromFields( typeArgs, DestroyAirdropPool.bcs.parse(data) ) }

 toJSONField() { return {

 poolId: this.poolId,surplus: this.surplus.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): DestroyAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return DestroyAirdropPool.reified( typeArgs[0], typeArgs[1], ).new( { poolId: decodeFromJSONField(ID.reified(), field.poolId), surplus: decodeFromJSONField("u64", field.surplus) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): DestroyAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== DestroyAirdropPool.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DestroyAirdropPool.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return DestroyAirdropPool.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): DestroyAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDestroyAirdropPool(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DestroyAirdropPool object`); } return DestroyAirdropPool.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): DestroyAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDestroyAirdropPool(data.bcs.type)) { throw new Error(`object at is not a DestroyAirdropPool object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return DestroyAirdropPool.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DestroyAirdropPool.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<DestroyAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DestroyAirdropPool object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDestroyAirdropPool(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DestroyAirdropPool object`); }

 return DestroyAirdropPool.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Eligibility =============================== */

export function isEligibility(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::airdrop::Eligibility`; }

export interface EligibilityFields { id: ToField<UID>; amount: ToField<"u64">; poolId: ToField<ID> }

export type EligibilityReified = Reified< Eligibility, EligibilityFields >;

export class Eligibility implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::airdrop::Eligibility`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Eligibility.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::airdrop::Eligibility`; readonly $typeArgs: []; readonly $isPhantom = Eligibility.$isPhantom;

 readonly id: ToField<UID>; readonly amount: ToField<"u64">; readonly poolId: ToField<ID>

 private constructor(typeArgs: [], fields: EligibilityFields, ) { this.$fullTypeName = composeSuiType( Eligibility.$typeName, ...typeArgs ) as `${typeof PKG_V1}::airdrop::Eligibility`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.amount = fields.amount;; this.poolId = fields.poolId; }

 static reified( ): EligibilityReified { return { typeName: Eligibility.$typeName, fullTypeName: composeSuiType( Eligibility.$typeName, ...[] ) as `${typeof PKG_V1}::airdrop::Eligibility`, typeArgs: [ ] as [], isPhantom: Eligibility.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Eligibility.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Eligibility.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Eligibility.fromBcs( data, ), bcs: Eligibility.bcs, fromJSONField: (field: any) => Eligibility.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Eligibility.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Eligibility.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Eligibility.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Eligibility.fetch( client, id, ), new: ( fields: EligibilityFields, ) => { return new Eligibility( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Eligibility.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Eligibility>> { return phantom(Eligibility.reified( )); } static get p() { return Eligibility.phantom() }

 static get bcs() { return bcs.struct("Eligibility", {

 id: UID.bcs, amount: bcs.u64(), pool_id: ID.bcs

}) };

 static fromFields( fields: Record<string, any> ): Eligibility { return Eligibility.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), amount: decodeFromFields("u64", fields.amount), poolId: decodeFromFields(ID.reified(), fields.pool_id) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Eligibility { if (!isEligibility(item.type)) { throw new Error("not a Eligibility type");

 }

 return Eligibility.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), amount: decodeFromFieldsWithTypes("u64", item.fields.amount), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id) } ) }

 static fromBcs( data: Uint8Array ): Eligibility { return Eligibility.fromFields( Eligibility.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,amount: this.amount.toString(),poolId: this.poolId,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Eligibility { return Eligibility.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), amount: decodeFromJSONField("u64", field.amount), poolId: decodeFromJSONField(ID.reified(), field.poolId) } ) }

 static fromJSON( json: Record<string, any> ): Eligibility { if (json.$typeName !== Eligibility.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Eligibility.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Eligibility { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isEligibility(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Eligibility object`); } return Eligibility.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Eligibility { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isEligibility(data.bcs.type)) { throw new Error(`object at is not a Eligibility object`); }

 return Eligibility.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Eligibility.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Eligibility> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Eligibility object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isEligibility(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Eligibility object`); }

 return Eligibility.fromSuiObjectData( res.data ); }

 }

/* ============================== NewAirdropPool =============================== */

export function isNewAirdropPool(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::airdrop::NewAirdropPool` + '<'); }

export interface NewAirdropPoolFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { poolId: ToField<ID>; startTime: ToField<"u64">; endTime: ToField<"u64">; totalSupply: ToField<"u64"> }

export type NewAirdropPoolReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< NewAirdropPool<T, P>, NewAirdropPoolFields<T, P> >;

export class NewAirdropPool<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::airdrop::NewAirdropPool`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = NewAirdropPool.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::airdrop::NewAirdropPool<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = NewAirdropPool.$isPhantom;

 readonly poolId: ToField<ID>; readonly startTime: ToField<"u64">; readonly endTime: ToField<"u64">; readonly totalSupply: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: NewAirdropPoolFields<T, P>, ) { this.$fullTypeName = composeSuiType( NewAirdropPool.$typeName, ...typeArgs ) as `${typeof PKG_V1}::airdrop::NewAirdropPool<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.poolId = fields.poolId;; this.startTime = fields.startTime;; this.endTime = fields.endTime;; this.totalSupply = fields.totalSupply; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): NewAirdropPoolReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: NewAirdropPool.$typeName, fullTypeName: composeSuiType( NewAirdropPool.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::airdrop::NewAirdropPool<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: NewAirdropPool.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => NewAirdropPool.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => NewAirdropPool.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => NewAirdropPool.fromBcs( [T, P], data, ), bcs: NewAirdropPool.bcs, fromJSONField: (field: any) => NewAirdropPool.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => NewAirdropPool.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => NewAirdropPool.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => NewAirdropPool.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => NewAirdropPool.fetch( client, [T, P], id, ), new: ( fields: NewAirdropPoolFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new NewAirdropPool( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return NewAirdropPool.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<NewAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(NewAirdropPool.reified( T, P )); } static get p() { return NewAirdropPool.phantom }

 static get bcs() { return bcs.struct("NewAirdropPool", {

 pool_id: ID.bcs, start_time: bcs.u64(), end_time: bcs.u64(), total_supply: bcs.u64()

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): NewAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return NewAirdropPool.reified( typeArgs[0], typeArgs[1], ).new( { poolId: decodeFromFields(ID.reified(), fields.pool_id), startTime: decodeFromFields("u64", fields.start_time), endTime: decodeFromFields("u64", fields.end_time), totalSupply: decodeFromFields("u64", fields.total_supply) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): NewAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isNewAirdropPool(item.type)) { throw new Error("not a NewAirdropPool type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return NewAirdropPool.reified( typeArgs[0], typeArgs[1], ).new( { poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), startTime: decodeFromFieldsWithTypes("u64", item.fields.start_time), endTime: decodeFromFieldsWithTypes("u64", item.fields.end_time), totalSupply: decodeFromFieldsWithTypes("u64", item.fields.total_supply) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): NewAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return NewAirdropPool.fromFields( typeArgs, NewAirdropPool.bcs.parse(data) ) }

 toJSONField() { return {

 poolId: this.poolId,startTime: this.startTime.toString(),endTime: this.endTime.toString(),totalSupply: this.totalSupply.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): NewAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return NewAirdropPool.reified( typeArgs[0], typeArgs[1], ).new( { poolId: decodeFromJSONField(ID.reified(), field.poolId), startTime: decodeFromJSONField("u64", field.startTime), endTime: decodeFromJSONField("u64", field.endTime), totalSupply: decodeFromJSONField("u64", field.totalSupply) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): NewAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== NewAirdropPool.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(NewAirdropPool.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return NewAirdropPool.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): NewAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isNewAirdropPool(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a NewAirdropPool object`); } return NewAirdropPool.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): NewAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isNewAirdropPool(data.bcs.type)) { throw new Error(`object at is not a NewAirdropPool object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return NewAirdropPool.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return NewAirdropPool.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<NewAirdropPool<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching NewAirdropPool object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isNewAirdropPool(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a NewAirdropPool object`); }

 return NewAirdropPool.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== NewEligibility =============================== */

export function isNewEligibility(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::airdrop::NewEligibility` + '<'); }

export interface NewEligibilityFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { id: ToField<ID>; poolId: ToField<ID>; amount: ToField<"u64"> }

export type NewEligibilityReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< NewEligibility<T, P>, NewEligibilityFields<T, P> >;

export class NewEligibility<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::airdrop::NewEligibility`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = NewEligibility.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::airdrop::NewEligibility<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = NewEligibility.$isPhantom;

 readonly id: ToField<ID>; readonly poolId: ToField<ID>; readonly amount: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: NewEligibilityFields<T, P>, ) { this.$fullTypeName = composeSuiType( NewEligibility.$typeName, ...typeArgs ) as `${typeof PKG_V1}::airdrop::NewEligibility<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.poolId = fields.poolId;; this.amount = fields.amount; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): NewEligibilityReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: NewEligibility.$typeName, fullTypeName: composeSuiType( NewEligibility.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::airdrop::NewEligibility<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: NewEligibility.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => NewEligibility.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => NewEligibility.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => NewEligibility.fromBcs( [T, P], data, ), bcs: NewEligibility.bcs, fromJSONField: (field: any) => NewEligibility.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => NewEligibility.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => NewEligibility.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => NewEligibility.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => NewEligibility.fetch( client, [T, P], id, ), new: ( fields: NewEligibilityFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new NewEligibility( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return NewEligibility.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<NewEligibility<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(NewEligibility.reified( T, P )); } static get p() { return NewEligibility.phantom }

 static get bcs() { return bcs.struct("NewEligibility", {

 id: ID.bcs, pool_id: ID.bcs, amount: bcs.u64()

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): NewEligibility<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return NewEligibility.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFields(ID.reified(), fields.id), poolId: decodeFromFields(ID.reified(), fields.pool_id), amount: decodeFromFields("u64", fields.amount) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): NewEligibility<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isNewEligibility(item.type)) { throw new Error("not a NewEligibility type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return NewEligibility.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), amount: decodeFromFieldsWithTypes("u64", item.fields.amount) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): NewEligibility<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return NewEligibility.fromFields( typeArgs, NewEligibility.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,poolId: this.poolId,amount: this.amount.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): NewEligibility<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return NewEligibility.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromJSONField(ID.reified(), field.id), poolId: decodeFromJSONField(ID.reified(), field.poolId), amount: decodeFromJSONField("u64", field.amount) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): NewEligibility<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== NewEligibility.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(NewEligibility.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return NewEligibility.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): NewEligibility<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isNewEligibility(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a NewEligibility object`); } return NewEligibility.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): NewEligibility<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isNewEligibility(data.bcs.type)) { throw new Error(`object at is not a NewEligibility object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return NewEligibility.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return NewEligibility.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<NewEligibility<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching NewEligibility object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isNewEligibility(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a NewEligibility object`); }

 return NewEligibility.fromSuiObjectData( typeArgs, res.data ); }

 }
