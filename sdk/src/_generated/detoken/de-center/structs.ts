import * as reified from "../../_framework/reified";
import {Option} from "../../_dependencies/source/0x1/option/structs";
import {TypeName} from "../../_dependencies/source/0x1/type-name/structs";
import {Balance} from "../../_dependencies/source/0x2/balance/structs";
import {ID, UID} from "../../_dependencies/source/0x2/object/structs";
import {Table} from "../../_dependencies/source/0x2/table/structs";
import {VecSet} from "../../_dependencies/source/0x2/vec-set/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, fieldToJSON, phantom, ToTypeStr as ToPhantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {Vector} from "../../_framework/vector";
import {I128} from "../i128/structs";
import {PKG_V1} from "../index";
import {Point} from "../point/structs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== AdminCap =============================== */

export function isAdminCap(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_center::AdminCap` + '<'); }

export interface AdminCapFields<P extends PhantomTypeArgument> { id: ToField<UID> }

export type AdminCapReified<P extends PhantomTypeArgument> = Reified< AdminCap<P>, AdminCapFields<P> >;

export class AdminCap<P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::AdminCap`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = AdminCap.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::AdminCap<${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<P>]; readonly $isPhantom = AdminCap.$isPhantom;

 readonly id: ToField<UID>

 private constructor(typeArgs: [PhantomToTypeStr<P>], fields: AdminCapFields<P>, ) { this.$fullTypeName = composeSuiType( AdminCap.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::AdminCap<${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id; }

 static reified<P extends PhantomReified<PhantomTypeArgument>>( P: P ): AdminCapReified<ToPhantomTypeArgument<P>> { return { typeName: AdminCap.$typeName, fullTypeName: composeSuiType( AdminCap.$typeName, ...[extractType(P)] ) as `${typeof PKG_V1}::de_center::AdminCap<${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: AdminCap.$isPhantom, reifiedTypeArgs: [P], fromFields: (fields: Record<string, any>) => AdminCap.fromFields( P, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => AdminCap.fromFieldsWithTypes( P, item, ), fromBcs: (data: Uint8Array) => AdminCap.fromBcs( P, data, ), bcs: AdminCap.bcs, fromJSONField: (field: any) => AdminCap.fromJSONField( P, field, ), fromJSON: (json: Record<string, any>) => AdminCap.fromJSON( P, json, ), fromSuiParsedData: (content: SuiParsedData) => AdminCap.fromSuiParsedData( P, content, ), fromSuiObjectData: (content: SuiObjectData) => AdminCap.fromSuiObjectData( P, content, ), fetch: async (client: SuiClient, id: string) => AdminCap.fetch( client, P, id, ), new: ( fields: AdminCapFields<ToPhantomTypeArgument<P>>, ) => { return new AdminCap( [extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return AdminCap.reified }

 static phantom<P extends PhantomReified<PhantomTypeArgument>>( P: P ): PhantomReified<ToTypeStr<AdminCap<ToPhantomTypeArgument<P>>>> { return phantom(AdminCap.reified( P )); } static get p() { return AdminCap.phantom }

 static get bcs() { return bcs.struct("AdminCap", {

 id: UID.bcs

}) };

 static fromFields<P extends PhantomReified<PhantomTypeArgument>>( typeArg: P, fields: Record<string, any> ): AdminCap<ToPhantomTypeArgument<P>> { return AdminCap.reified( typeArg, ).new( { id: decodeFromFields(UID.reified(), fields.id) } ) }

 static fromFieldsWithTypes<P extends PhantomReified<PhantomTypeArgument>>( typeArg: P, item: FieldsWithTypes ): AdminCap<ToPhantomTypeArgument<P>> { if (!isAdminCap(item.type)) { throw new Error("not a AdminCap type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return AdminCap.reified( typeArg, ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id) } ) }

 static fromBcs<P extends PhantomReified<PhantomTypeArgument>>( typeArg: P, data: Uint8Array ): AdminCap<ToPhantomTypeArgument<P>> { return AdminCap.fromFields( typeArg, AdminCap.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<P extends PhantomReified<PhantomTypeArgument>>( typeArg: P, field: any ): AdminCap<ToPhantomTypeArgument<P>> { return AdminCap.reified( typeArg, ).new( { id: decodeFromJSONField(UID.reified(), field.id) } ) }

 static fromJSON<P extends PhantomReified<PhantomTypeArgument>>( typeArg: P, json: Record<string, any> ): AdminCap<ToPhantomTypeArgument<P>> { if (json.$typeName !== AdminCap.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(AdminCap.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return AdminCap.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<P extends PhantomReified<PhantomTypeArgument>>( typeArg: P, content: SuiParsedData ): AdminCap<ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isAdminCap(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a AdminCap object`); } return AdminCap.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<P extends PhantomReified<PhantomTypeArgument>>( typeArg: P, data: SuiObjectData ): AdminCap<ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isAdminCap(data.bcs.type)) { throw new Error(`object at is not a AdminCap object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return AdminCap.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return AdminCap.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: P, id: string ): Promise<AdminCap<ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching AdminCap object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isAdminCap(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a AdminCap object`); }

 return AdminCap.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== CreatePoolEvent =============================== */

export function isCreatePoolEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::CreatePoolEvent`; }

export interface CreatePoolEventFields { protocol: ToField<TypeName>; coinType: ToField<TypeName>; id: ToField<ID>; maxTime: ToField<"u64">; offset: ToField<"u64"> }

export type CreatePoolEventReified = Reified< CreatePoolEvent, CreatePoolEventFields >;

export class CreatePoolEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::CreatePoolEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = CreatePoolEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::CreatePoolEvent`; readonly $typeArgs: []; readonly $isPhantom = CreatePoolEvent.$isPhantom;

 readonly protocol: ToField<TypeName>; readonly coinType: ToField<TypeName>; readonly id: ToField<ID>; readonly maxTime: ToField<"u64">; readonly offset: ToField<"u64">

 private constructor(typeArgs: [], fields: CreatePoolEventFields, ) { this.$fullTypeName = composeSuiType( CreatePoolEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::CreatePoolEvent`; this.$typeArgs = typeArgs;

 this.protocol = fields.protocol;; this.coinType = fields.coinType;; this.id = fields.id;; this.maxTime = fields.maxTime;; this.offset = fields.offset; }

 static reified( ): CreatePoolEventReified { return { typeName: CreatePoolEvent.$typeName, fullTypeName: composeSuiType( CreatePoolEvent.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::CreatePoolEvent`, typeArgs: [ ] as [], isPhantom: CreatePoolEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => CreatePoolEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => CreatePoolEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => CreatePoolEvent.fromBcs( data, ), bcs: CreatePoolEvent.bcs, fromJSONField: (field: any) => CreatePoolEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => CreatePoolEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => CreatePoolEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => CreatePoolEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => CreatePoolEvent.fetch( client, id, ), new: ( fields: CreatePoolEventFields, ) => { return new CreatePoolEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return CreatePoolEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<CreatePoolEvent>> { return phantom(CreatePoolEvent.reified( )); } static get p() { return CreatePoolEvent.phantom() }

 static get bcs() { return bcs.struct("CreatePoolEvent", {

 protocol: TypeName.bcs, coin_type: TypeName.bcs, id: ID.bcs, max_time: bcs.u64(), offset: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): CreatePoolEvent { return CreatePoolEvent.reified( ).new( { protocol: decodeFromFields(TypeName.reified(), fields.protocol), coinType: decodeFromFields(TypeName.reified(), fields.coin_type), id: decodeFromFields(ID.reified(), fields.id), maxTime: decodeFromFields("u64", fields.max_time), offset: decodeFromFields("u64", fields.offset) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): CreatePoolEvent { if (!isCreatePoolEvent(item.type)) { throw new Error("not a CreatePoolEvent type");

 }

 return CreatePoolEvent.reified( ).new( { protocol: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.protocol), coinType: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.coin_type), id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id), maxTime: decodeFromFieldsWithTypes("u64", item.fields.max_time), offset: decodeFromFieldsWithTypes("u64", item.fields.offset) } ) }

 static fromBcs( data: Uint8Array ): CreatePoolEvent { return CreatePoolEvent.fromFields( CreatePoolEvent.bcs.parse(data) ) }

 toJSONField() { return {

 protocol: this.protocol.toJSONField(),coinType: this.coinType.toJSONField(),id: this.id,maxTime: this.maxTime.toString(),offset: this.offset.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): CreatePoolEvent { return CreatePoolEvent.reified( ).new( { protocol: decodeFromJSONField(TypeName.reified(), field.protocol), coinType: decodeFromJSONField(TypeName.reified(), field.coinType), id: decodeFromJSONField(ID.reified(), field.id), maxTime: decodeFromJSONField("u64", field.maxTime), offset: decodeFromJSONField("u64", field.offset) } ) }

 static fromJSON( json: Record<string, any> ): CreatePoolEvent { if (json.$typeName !== CreatePoolEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return CreatePoolEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): CreatePoolEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCreatePoolEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a CreatePoolEvent object`); } return CreatePoolEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): CreatePoolEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isCreatePoolEvent(data.bcs.type)) { throw new Error(`object at is not a CreatePoolEvent object`); }

 return CreatePoolEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return CreatePoolEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<CreatePoolEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching CreatePoolEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isCreatePoolEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a CreatePoolEvent object`); }

 return CreatePoolEvent.fromSuiObjectData( res.data ); }

 }

/* ============================== DE_CENTER =============================== */

export function isDE_CENTER(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::DE_CENTER`; }

export interface DE_CENTERFields { dummyField: ToField<"bool"> }

export type DE_CENTERReified = Reified< DE_CENTER, DE_CENTERFields >;

export class DE_CENTER implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::DE_CENTER`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = DE_CENTER.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::DE_CENTER`; readonly $typeArgs: []; readonly $isPhantom = DE_CENTER.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: DE_CENTERFields, ) { this.$fullTypeName = composeSuiType( DE_CENTER.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::DE_CENTER`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): DE_CENTERReified { return { typeName: DE_CENTER.$typeName, fullTypeName: composeSuiType( DE_CENTER.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::DE_CENTER`, typeArgs: [ ] as [], isPhantom: DE_CENTER.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => DE_CENTER.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DE_CENTER.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => DE_CENTER.fromBcs( data, ), bcs: DE_CENTER.bcs, fromJSONField: (field: any) => DE_CENTER.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => DE_CENTER.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => DE_CENTER.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => DE_CENTER.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => DE_CENTER.fetch( client, id, ), new: ( fields: DE_CENTERFields, ) => { return new DE_CENTER( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return DE_CENTER.reified() }

 static phantom( ): PhantomReified<ToTypeStr<DE_CENTER>> { return phantom(DE_CENTER.reified( )); } static get p() { return DE_CENTER.phantom() }

 static get bcs() { return bcs.struct("DE_CENTER", {

 dummy_field: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): DE_CENTER { return DE_CENTER.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): DE_CENTER { if (!isDE_CENTER(item.type)) { throw new Error("not a DE_CENTER type");

 }

 return DE_CENTER.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): DE_CENTER { return DE_CENTER.fromFields( DE_CENTER.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): DE_CENTER { return DE_CENTER.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): DE_CENTER { if (json.$typeName !== DE_CENTER.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return DE_CENTER.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): DE_CENTER { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDE_CENTER(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DE_CENTER object`); } return DE_CENTER.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): DE_CENTER { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDE_CENTER(data.bcs.type)) { throw new Error(`object at is not a DE_CENTER object`); }

 return DE_CENTER.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DE_CENTER.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<DE_CENTER> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DE_CENTER object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDE_CENTER(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DE_CENTER object`); }

 return DE_CENTER.fromSuiObjectData( res.data ); }

 }

/* ============================== DeCenter =============================== */

export function isDeCenter(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_center::DeCenter` + '<'); }

export interface DeCenterFields<Token extends PhantomTypeArgument, P extends PhantomTypeArgument> { id: ToField<UID>; versions: ToField<VecSet<"u64">>; maxTime: ToField<"u64">; offset: ToField<"u64">; mintedEscrow: ToField<"u64">; lockedTotal: ToField<"u64">; penalty: ToField<Vector<PenaltyInfo>>; penaltyFeeBps: ToField<"u64">; penaltyFeeBalance: ToField<Balance<Token>>; penaltyFeeAdmin: ToField<Option<TypeName>>; penaltyReserve: ToField<Balance<Token>>; whitelist: ToField<VecSet<TypeName>>; point: ToField<Point>; slopeChanges: ToField<Table<"u64", ToPhantom<I128>>>; responseChecklists: ToField<VecSet<TypeName>> }

export type DeCenterReified<Token extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< DeCenter<Token, P>, DeCenterFields<Token, P> >;

export class DeCenter<Token extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::DeCenter`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = DeCenter.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::DeCenter<${PhantomToTypeStr<Token>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<Token>, PhantomToTypeStr<P>]; readonly $isPhantom = DeCenter.$isPhantom;

 readonly id: ToField<UID>; readonly versions: ToField<VecSet<"u64">>; readonly maxTime: ToField<"u64">; readonly offset: ToField<"u64">; readonly mintedEscrow: ToField<"u64">; readonly lockedTotal: ToField<"u64">; readonly penalty: ToField<Vector<PenaltyInfo>>; readonly penaltyFeeBps: ToField<"u64">; readonly penaltyFeeBalance: ToField<Balance<Token>>; readonly penaltyFeeAdmin: ToField<Option<TypeName>>; readonly penaltyReserve: ToField<Balance<Token>>; readonly whitelist: ToField<VecSet<TypeName>>; readonly point: ToField<Point>; readonly slopeChanges: ToField<Table<"u64", ToPhantom<I128>>>; readonly responseChecklists: ToField<VecSet<TypeName>>

 private constructor(typeArgs: [PhantomToTypeStr<Token>, PhantomToTypeStr<P>], fields: DeCenterFields<Token, P>, ) { this.$fullTypeName = composeSuiType( DeCenter.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::DeCenter<${PhantomToTypeStr<Token>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.versions = fields.versions;; this.maxTime = fields.maxTime;; this.offset = fields.offset;; this.mintedEscrow = fields.mintedEscrow;; this.lockedTotal = fields.lockedTotal;; this.penalty = fields.penalty;; this.penaltyFeeBps = fields.penaltyFeeBps;; this.penaltyFeeBalance = fields.penaltyFeeBalance;; this.penaltyFeeAdmin = fields.penaltyFeeAdmin;; this.penaltyReserve = fields.penaltyReserve;; this.whitelist = fields.whitelist;; this.point = fields.point;; this.slopeChanges = fields.slopeChanges;; this.responseChecklists = fields.responseChecklists; }

 static reified<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( Token: Token, P: P ): DeCenterReified<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return { typeName: DeCenter.$typeName, fullTypeName: composeSuiType( DeCenter.$typeName, ...[extractType(Token), extractType(P)] ) as `${typeof PKG_V1}::de_center::DeCenter<${PhantomToTypeStr<ToPhantomTypeArgument<Token>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(Token), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<Token>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: DeCenter.$isPhantom, reifiedTypeArgs: [Token, P], fromFields: (fields: Record<string, any>) => DeCenter.fromFields( [Token, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DeCenter.fromFieldsWithTypes( [Token, P], item, ), fromBcs: (data: Uint8Array) => DeCenter.fromBcs( [Token, P], data, ), bcs: DeCenter.bcs, fromJSONField: (field: any) => DeCenter.fromJSONField( [Token, P], field, ), fromJSON: (json: Record<string, any>) => DeCenter.fromJSON( [Token, P], json, ), fromSuiParsedData: (content: SuiParsedData) => DeCenter.fromSuiParsedData( [Token, P], content, ), fromSuiObjectData: (content: SuiObjectData) => DeCenter.fromSuiObjectData( [Token, P], content, ), fetch: async (client: SuiClient, id: string) => DeCenter.fetch( client, [Token, P], id, ), new: ( fields: DeCenterFields<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>>, ) => { return new DeCenter( [extractType(Token), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DeCenter.reified }

 static phantom<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( Token: Token, P: P ): PhantomReified<ToTypeStr<DeCenter<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>>>> { return phantom(DeCenter.reified( Token, P )); } static get p() { return DeCenter.phantom }

 static get bcs() { return bcs.struct("DeCenter", {

 id: UID.bcs, versions: VecSet.bcs(bcs.u64()), max_time: bcs.u64(), offset: bcs.u64(), minted_escrow: bcs.u64(), locked_total: bcs.u64(), penalty: bcs.vector(PenaltyInfo.bcs), penalty_fee_bps: bcs.u64(), penalty_fee_balance: Balance.bcs, penalty_fee_admin: Option.bcs(TypeName.bcs), penalty_reserve: Balance.bcs, whitelist: VecSet.bcs(TypeName.bcs), point: Point.bcs, slope_changes: Table.bcs, response_checklists: VecSet.bcs(TypeName.bcs)

}) };

 static fromFields<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], fields: Record<string, any> ): DeCenter<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return DeCenter.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFields(UID.reified(), fields.id), versions: decodeFromFields(VecSet.reified("u64"), fields.versions), maxTime: decodeFromFields("u64", fields.max_time), offset: decodeFromFields("u64", fields.offset), mintedEscrow: decodeFromFields("u64", fields.minted_escrow), lockedTotal: decodeFromFields("u64", fields.locked_total), penalty: decodeFromFields(reified.vector(PenaltyInfo.reified()), fields.penalty), penaltyFeeBps: decodeFromFields("u64", fields.penalty_fee_bps), penaltyFeeBalance: decodeFromFields(Balance.reified(typeArgs[0]), fields.penalty_fee_balance), penaltyFeeAdmin: decodeFromFields(Option.reified(TypeName.reified()), fields.penalty_fee_admin), penaltyReserve: decodeFromFields(Balance.reified(typeArgs[0]), fields.penalty_reserve), whitelist: decodeFromFields(VecSet.reified(TypeName.reified()), fields.whitelist), point: decodeFromFields(Point.reified(), fields.point), slopeChanges: decodeFromFields(Table.reified(reified.phantom("u64"), reified.phantom(I128.reified())), fields.slope_changes), responseChecklists: decodeFromFields(VecSet.reified(TypeName.reified()), fields.response_checklists) } ) }

 static fromFieldsWithTypes<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], item: FieldsWithTypes ): DeCenter<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (!isDeCenter(item.type)) { throw new Error("not a DeCenter type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return DeCenter.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), versions: decodeFromFieldsWithTypes(VecSet.reified("u64"), item.fields.versions), maxTime: decodeFromFieldsWithTypes("u64", item.fields.max_time), offset: decodeFromFieldsWithTypes("u64", item.fields.offset), mintedEscrow: decodeFromFieldsWithTypes("u64", item.fields.minted_escrow), lockedTotal: decodeFromFieldsWithTypes("u64", item.fields.locked_total), penalty: decodeFromFieldsWithTypes(reified.vector(PenaltyInfo.reified()), item.fields.penalty), penaltyFeeBps: decodeFromFieldsWithTypes("u64", item.fields.penalty_fee_bps), penaltyFeeBalance: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.penalty_fee_balance), penaltyFeeAdmin: decodeFromFieldsWithTypes(Option.reified(TypeName.reified()), item.fields.penalty_fee_admin), penaltyReserve: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.penalty_reserve), whitelist: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.whitelist), point: decodeFromFieldsWithTypes(Point.reified(), item.fields.point), slopeChanges: decodeFromFieldsWithTypes(Table.reified(reified.phantom("u64"), reified.phantom(I128.reified())), item.fields.slope_changes), responseChecklists: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.response_checklists) } ) }

 static fromBcs<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], data: Uint8Array ): DeCenter<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return DeCenter.fromFields( typeArgs, DeCenter.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,versions: this.versions.toJSONField(),maxTime: this.maxTime.toString(),offset: this.offset.toString(),mintedEscrow: this.mintedEscrow.toString(),lockedTotal: this.lockedTotal.toString(),penalty: fieldToJSON<Vector<PenaltyInfo>>(`vector<${PenaltyInfo.$typeName}>`, this.penalty),penaltyFeeBps: this.penaltyFeeBps.toString(),penaltyFeeBalance: this.penaltyFeeBalance.toJSONField(),penaltyFeeAdmin: fieldToJSON<Option<TypeName>>(`${Option.$typeName}<${TypeName.$typeName}>`, this.penaltyFeeAdmin),penaltyReserve: this.penaltyReserve.toJSONField(),whitelist: this.whitelist.toJSONField(),point: this.point.toJSONField(),slopeChanges: this.slopeChanges.toJSONField(),responseChecklists: this.responseChecklists.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], field: any ): DeCenter<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return DeCenter.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromJSONField(UID.reified(), field.id), versions: decodeFromJSONField(VecSet.reified("u64"), field.versions), maxTime: decodeFromJSONField("u64", field.maxTime), offset: decodeFromJSONField("u64", field.offset), mintedEscrow: decodeFromJSONField("u64", field.mintedEscrow), lockedTotal: decodeFromJSONField("u64", field.lockedTotal), penalty: decodeFromJSONField(reified.vector(PenaltyInfo.reified()), field.penalty), penaltyFeeBps: decodeFromJSONField("u64", field.penaltyFeeBps), penaltyFeeBalance: decodeFromJSONField(Balance.reified(typeArgs[0]), field.penaltyFeeBalance), penaltyFeeAdmin: decodeFromJSONField(Option.reified(TypeName.reified()), field.penaltyFeeAdmin), penaltyReserve: decodeFromJSONField(Balance.reified(typeArgs[0]), field.penaltyReserve), whitelist: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.whitelist), point: decodeFromJSONField(Point.reified(), field.point), slopeChanges: decodeFromJSONField(Table.reified(reified.phantom("u64"), reified.phantom(I128.reified())), field.slopeChanges), responseChecklists: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.responseChecklists) } ) }

 static fromJSON<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], json: Record<string, any> ): DeCenter<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (json.$typeName !== DeCenter.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DeCenter.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return DeCenter.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], content: SuiParsedData ): DeCenter<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDeCenter(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DeCenter object`); } return DeCenter.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], data: SuiObjectData ): DeCenter<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDeCenter(data.bcs.type)) { throw new Error(`object at is not a DeCenter object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return DeCenter.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DeCenter.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [Token, P], id: string ): Promise<DeCenter<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DeCenter object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDeCenter(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DeCenter object`); }

 return DeCenter.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== DeTokenUpdateResponse =============================== */

export function isDeTokenUpdateResponse(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_center::DeTokenUpdateResponse` + '<'); }

export interface DeTokenUpdateResponseFields<Token extends PhantomTypeArgument, P extends PhantomTypeArgument> { id: ToField<ID>; poolId: ToField<ID>; checklists: ToField<VecSet<TypeName>>; maxTime: ToField<"u64">; balance: ToField<"u64">; end: ToField<"u64">; earlyUnlock: ToField<"bool">; rawVotingWeight: ToField<"u64">; votingWeight: ToField<"u64"> }

export type DeTokenUpdateResponseReified<Token extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< DeTokenUpdateResponse<Token, P>, DeTokenUpdateResponseFields<Token, P> >;

export class DeTokenUpdateResponse<Token extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::DeTokenUpdateResponse`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = DeTokenUpdateResponse.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::DeTokenUpdateResponse<${PhantomToTypeStr<Token>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<Token>, PhantomToTypeStr<P>]; readonly $isPhantom = DeTokenUpdateResponse.$isPhantom;

 readonly id: ToField<ID>; readonly poolId: ToField<ID>; readonly checklists: ToField<VecSet<TypeName>>; readonly maxTime: ToField<"u64">; readonly balance: ToField<"u64">; readonly end: ToField<"u64">; readonly earlyUnlock: ToField<"bool">; readonly rawVotingWeight: ToField<"u64">; readonly votingWeight: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<Token>, PhantomToTypeStr<P>], fields: DeTokenUpdateResponseFields<Token, P>, ) { this.$fullTypeName = composeSuiType( DeTokenUpdateResponse.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::DeTokenUpdateResponse<${PhantomToTypeStr<Token>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.poolId = fields.poolId;; this.checklists = fields.checklists;; this.maxTime = fields.maxTime;; this.balance = fields.balance;; this.end = fields.end;; this.earlyUnlock = fields.earlyUnlock;; this.rawVotingWeight = fields.rawVotingWeight;; this.votingWeight = fields.votingWeight; }

 static reified<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( Token: Token, P: P ): DeTokenUpdateResponseReified<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return { typeName: DeTokenUpdateResponse.$typeName, fullTypeName: composeSuiType( DeTokenUpdateResponse.$typeName, ...[extractType(Token), extractType(P)] ) as `${typeof PKG_V1}::de_center::DeTokenUpdateResponse<${PhantomToTypeStr<ToPhantomTypeArgument<Token>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(Token), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<Token>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: DeTokenUpdateResponse.$isPhantom, reifiedTypeArgs: [Token, P], fromFields: (fields: Record<string, any>) => DeTokenUpdateResponse.fromFields( [Token, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DeTokenUpdateResponse.fromFieldsWithTypes( [Token, P], item, ), fromBcs: (data: Uint8Array) => DeTokenUpdateResponse.fromBcs( [Token, P], data, ), bcs: DeTokenUpdateResponse.bcs, fromJSONField: (field: any) => DeTokenUpdateResponse.fromJSONField( [Token, P], field, ), fromJSON: (json: Record<string, any>) => DeTokenUpdateResponse.fromJSON( [Token, P], json, ), fromSuiParsedData: (content: SuiParsedData) => DeTokenUpdateResponse.fromSuiParsedData( [Token, P], content, ), fromSuiObjectData: (content: SuiObjectData) => DeTokenUpdateResponse.fromSuiObjectData( [Token, P], content, ), fetch: async (client: SuiClient, id: string) => DeTokenUpdateResponse.fetch( client, [Token, P], id, ), new: ( fields: DeTokenUpdateResponseFields<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>>, ) => { return new DeTokenUpdateResponse( [extractType(Token), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DeTokenUpdateResponse.reified }

 static phantom<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( Token: Token, P: P ): PhantomReified<ToTypeStr<DeTokenUpdateResponse<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>>>> { return phantom(DeTokenUpdateResponse.reified( Token, P )); } static get p() { return DeTokenUpdateResponse.phantom }

 static get bcs() { return bcs.struct("DeTokenUpdateResponse", {

 id: ID.bcs, pool_id: ID.bcs, checklists: VecSet.bcs(TypeName.bcs), max_time: bcs.u64(), balance: bcs.u64(), end: bcs.u64(), early_unlock: bcs.bool(), raw_voting_weight: bcs.u64(), voting_weight: bcs.u64()

}) };

 static fromFields<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], fields: Record<string, any> ): DeTokenUpdateResponse<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return DeTokenUpdateResponse.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFields(ID.reified(), fields.id), poolId: decodeFromFields(ID.reified(), fields.pool_id), checklists: decodeFromFields(VecSet.reified(TypeName.reified()), fields.checklists), maxTime: decodeFromFields("u64", fields.max_time), balance: decodeFromFields("u64", fields.balance), end: decodeFromFields("u64", fields.end), earlyUnlock: decodeFromFields("bool", fields.early_unlock), rawVotingWeight: decodeFromFields("u64", fields.raw_voting_weight), votingWeight: decodeFromFields("u64", fields.voting_weight) } ) }

 static fromFieldsWithTypes<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], item: FieldsWithTypes ): DeTokenUpdateResponse<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (!isDeTokenUpdateResponse(item.type)) { throw new Error("not a DeTokenUpdateResponse type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return DeTokenUpdateResponse.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), checklists: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.checklists), maxTime: decodeFromFieldsWithTypes("u64", item.fields.max_time), balance: decodeFromFieldsWithTypes("u64", item.fields.balance), end: decodeFromFieldsWithTypes("u64", item.fields.end), earlyUnlock: decodeFromFieldsWithTypes("bool", item.fields.early_unlock), rawVotingWeight: decodeFromFieldsWithTypes("u64", item.fields.raw_voting_weight), votingWeight: decodeFromFieldsWithTypes("u64", item.fields.voting_weight) } ) }

 static fromBcs<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], data: Uint8Array ): DeTokenUpdateResponse<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return DeTokenUpdateResponse.fromFields( typeArgs, DeTokenUpdateResponse.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,poolId: this.poolId,checklists: this.checklists.toJSONField(),maxTime: this.maxTime.toString(),balance: this.balance.toString(),end: this.end.toString(),earlyUnlock: this.earlyUnlock,rawVotingWeight: this.rawVotingWeight.toString(),votingWeight: this.votingWeight.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], field: any ): DeTokenUpdateResponse<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return DeTokenUpdateResponse.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromJSONField(ID.reified(), field.id), poolId: decodeFromJSONField(ID.reified(), field.poolId), checklists: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.checklists), maxTime: decodeFromJSONField("u64", field.maxTime), balance: decodeFromJSONField("u64", field.balance), end: decodeFromJSONField("u64", field.end), earlyUnlock: decodeFromJSONField("bool", field.earlyUnlock), rawVotingWeight: decodeFromJSONField("u64", field.rawVotingWeight), votingWeight: decodeFromJSONField("u64", field.votingWeight) } ) }

 static fromJSON<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], json: Record<string, any> ): DeTokenUpdateResponse<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (json.$typeName !== DeTokenUpdateResponse.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DeTokenUpdateResponse.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return DeTokenUpdateResponse.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], content: SuiParsedData ): DeTokenUpdateResponse<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDeTokenUpdateResponse(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DeTokenUpdateResponse object`); } return DeTokenUpdateResponse.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], data: SuiObjectData ): DeTokenUpdateResponse<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDeTokenUpdateResponse(data.bcs.type)) { throw new Error(`object at is not a DeTokenUpdateResponse object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return DeTokenUpdateResponse.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DeTokenUpdateResponse.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [Token, P], id: string ): Promise<DeTokenUpdateResponse<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DeTokenUpdateResponse object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDeTokenUpdateResponse(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DeTokenUpdateResponse object`); }

 return DeTokenUpdateResponse.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== IncreaseUnlockAmountEvent =============================== */

export function isIncreaseUnlockAmountEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::IncreaseUnlockAmountEvent`; }

export interface IncreaseUnlockAmountEventFields { escrowId: ToField<ID>; poolId: ToField<ID>; coinType: ToField<TypeName>; lockedAmount: ToField<"u64">; timestamp: ToField<"u64"> }

export type IncreaseUnlockAmountEventReified = Reified< IncreaseUnlockAmountEvent, IncreaseUnlockAmountEventFields >;

export class IncreaseUnlockAmountEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::IncreaseUnlockAmountEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = IncreaseUnlockAmountEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::IncreaseUnlockAmountEvent`; readonly $typeArgs: []; readonly $isPhantom = IncreaseUnlockAmountEvent.$isPhantom;

 readonly escrowId: ToField<ID>; readonly poolId: ToField<ID>; readonly coinType: ToField<TypeName>; readonly lockedAmount: ToField<"u64">; readonly timestamp: ToField<"u64">

 private constructor(typeArgs: [], fields: IncreaseUnlockAmountEventFields, ) { this.$fullTypeName = composeSuiType( IncreaseUnlockAmountEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::IncreaseUnlockAmountEvent`; this.$typeArgs = typeArgs;

 this.escrowId = fields.escrowId;; this.poolId = fields.poolId;; this.coinType = fields.coinType;; this.lockedAmount = fields.lockedAmount;; this.timestamp = fields.timestamp; }

 static reified( ): IncreaseUnlockAmountEventReified { return { typeName: IncreaseUnlockAmountEvent.$typeName, fullTypeName: composeSuiType( IncreaseUnlockAmountEvent.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::IncreaseUnlockAmountEvent`, typeArgs: [ ] as [], isPhantom: IncreaseUnlockAmountEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => IncreaseUnlockAmountEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => IncreaseUnlockAmountEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => IncreaseUnlockAmountEvent.fromBcs( data, ), bcs: IncreaseUnlockAmountEvent.bcs, fromJSONField: (field: any) => IncreaseUnlockAmountEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => IncreaseUnlockAmountEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => IncreaseUnlockAmountEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => IncreaseUnlockAmountEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => IncreaseUnlockAmountEvent.fetch( client, id, ), new: ( fields: IncreaseUnlockAmountEventFields, ) => { return new IncreaseUnlockAmountEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return IncreaseUnlockAmountEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<IncreaseUnlockAmountEvent>> { return phantom(IncreaseUnlockAmountEvent.reified( )); } static get p() { return IncreaseUnlockAmountEvent.phantom() }

 static get bcs() { return bcs.struct("IncreaseUnlockAmountEvent", {

 escrow_id: ID.bcs, pool_id: ID.bcs, coin_type: TypeName.bcs, locked_amount: bcs.u64(), timestamp: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): IncreaseUnlockAmountEvent { return IncreaseUnlockAmountEvent.reified( ).new( { escrowId: decodeFromFields(ID.reified(), fields.escrow_id), poolId: decodeFromFields(ID.reified(), fields.pool_id), coinType: decodeFromFields(TypeName.reified(), fields.coin_type), lockedAmount: decodeFromFields("u64", fields.locked_amount), timestamp: decodeFromFields("u64", fields.timestamp) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): IncreaseUnlockAmountEvent { if (!isIncreaseUnlockAmountEvent(item.type)) { throw new Error("not a IncreaseUnlockAmountEvent type");

 }

 return IncreaseUnlockAmountEvent.reified( ).new( { escrowId: decodeFromFieldsWithTypes(ID.reified(), item.fields.escrow_id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), coinType: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.coin_type), lockedAmount: decodeFromFieldsWithTypes("u64", item.fields.locked_amount), timestamp: decodeFromFieldsWithTypes("u64", item.fields.timestamp) } ) }

 static fromBcs( data: Uint8Array ): IncreaseUnlockAmountEvent { return IncreaseUnlockAmountEvent.fromFields( IncreaseUnlockAmountEvent.bcs.parse(data) ) }

 toJSONField() { return {

 escrowId: this.escrowId,poolId: this.poolId,coinType: this.coinType.toJSONField(),lockedAmount: this.lockedAmount.toString(),timestamp: this.timestamp.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): IncreaseUnlockAmountEvent { return IncreaseUnlockAmountEvent.reified( ).new( { escrowId: decodeFromJSONField(ID.reified(), field.escrowId), poolId: decodeFromJSONField(ID.reified(), field.poolId), coinType: decodeFromJSONField(TypeName.reified(), field.coinType), lockedAmount: decodeFromJSONField("u64", field.lockedAmount), timestamp: decodeFromJSONField("u64", field.timestamp) } ) }

 static fromJSON( json: Record<string, any> ): IncreaseUnlockAmountEvent { if (json.$typeName !== IncreaseUnlockAmountEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return IncreaseUnlockAmountEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): IncreaseUnlockAmountEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isIncreaseUnlockAmountEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a IncreaseUnlockAmountEvent object`); } return IncreaseUnlockAmountEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): IncreaseUnlockAmountEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isIncreaseUnlockAmountEvent(data.bcs.type)) { throw new Error(`object at is not a IncreaseUnlockAmountEvent object`); }

 return IncreaseUnlockAmountEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return IncreaseUnlockAmountEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<IncreaseUnlockAmountEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching IncreaseUnlockAmountEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isIncreaseUnlockAmountEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a IncreaseUnlockAmountEvent object`); }

 return IncreaseUnlockAmountEvent.fromSuiObjectData( res.data ); }

 }

/* ============================== IncreaseUnlockTimeEvent =============================== */

export function isIncreaseUnlockTimeEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::IncreaseUnlockTimeEvent`; }

export interface IncreaseUnlockTimeEventFields { escrowId: ToField<ID>; poolId: ToField<ID>; coinType: ToField<TypeName>; timestamp: ToField<"u64">; extendedDuration: ToField<"u64"> }

export type IncreaseUnlockTimeEventReified = Reified< IncreaseUnlockTimeEvent, IncreaseUnlockTimeEventFields >;

export class IncreaseUnlockTimeEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::IncreaseUnlockTimeEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = IncreaseUnlockTimeEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::IncreaseUnlockTimeEvent`; readonly $typeArgs: []; readonly $isPhantom = IncreaseUnlockTimeEvent.$isPhantom;

 readonly escrowId: ToField<ID>; readonly poolId: ToField<ID>; readonly coinType: ToField<TypeName>; readonly timestamp: ToField<"u64">; readonly extendedDuration: ToField<"u64">

 private constructor(typeArgs: [], fields: IncreaseUnlockTimeEventFields, ) { this.$fullTypeName = composeSuiType( IncreaseUnlockTimeEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::IncreaseUnlockTimeEvent`; this.$typeArgs = typeArgs;

 this.escrowId = fields.escrowId;; this.poolId = fields.poolId;; this.coinType = fields.coinType;; this.timestamp = fields.timestamp;; this.extendedDuration = fields.extendedDuration; }

 static reified( ): IncreaseUnlockTimeEventReified { return { typeName: IncreaseUnlockTimeEvent.$typeName, fullTypeName: composeSuiType( IncreaseUnlockTimeEvent.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::IncreaseUnlockTimeEvent`, typeArgs: [ ] as [], isPhantom: IncreaseUnlockTimeEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => IncreaseUnlockTimeEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => IncreaseUnlockTimeEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => IncreaseUnlockTimeEvent.fromBcs( data, ), bcs: IncreaseUnlockTimeEvent.bcs, fromJSONField: (field: any) => IncreaseUnlockTimeEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => IncreaseUnlockTimeEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => IncreaseUnlockTimeEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => IncreaseUnlockTimeEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => IncreaseUnlockTimeEvent.fetch( client, id, ), new: ( fields: IncreaseUnlockTimeEventFields, ) => { return new IncreaseUnlockTimeEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return IncreaseUnlockTimeEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<IncreaseUnlockTimeEvent>> { return phantom(IncreaseUnlockTimeEvent.reified( )); } static get p() { return IncreaseUnlockTimeEvent.phantom() }

 static get bcs() { return bcs.struct("IncreaseUnlockTimeEvent", {

 escrow_id: ID.bcs, pool_id: ID.bcs, coin_type: TypeName.bcs, timestamp: bcs.u64(), extended_duration: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): IncreaseUnlockTimeEvent { return IncreaseUnlockTimeEvent.reified( ).new( { escrowId: decodeFromFields(ID.reified(), fields.escrow_id), poolId: decodeFromFields(ID.reified(), fields.pool_id), coinType: decodeFromFields(TypeName.reified(), fields.coin_type), timestamp: decodeFromFields("u64", fields.timestamp), extendedDuration: decodeFromFields("u64", fields.extended_duration) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): IncreaseUnlockTimeEvent { if (!isIncreaseUnlockTimeEvent(item.type)) { throw new Error("not a IncreaseUnlockTimeEvent type");

 }

 return IncreaseUnlockTimeEvent.reified( ).new( { escrowId: decodeFromFieldsWithTypes(ID.reified(), item.fields.escrow_id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), coinType: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.coin_type), timestamp: decodeFromFieldsWithTypes("u64", item.fields.timestamp), extendedDuration: decodeFromFieldsWithTypes("u64", item.fields.extended_duration) } ) }

 static fromBcs( data: Uint8Array ): IncreaseUnlockTimeEvent { return IncreaseUnlockTimeEvent.fromFields( IncreaseUnlockTimeEvent.bcs.parse(data) ) }

 toJSONField() { return {

 escrowId: this.escrowId,poolId: this.poolId,coinType: this.coinType.toJSONField(),timestamp: this.timestamp.toString(),extendedDuration: this.extendedDuration.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): IncreaseUnlockTimeEvent { return IncreaseUnlockTimeEvent.reified( ).new( { escrowId: decodeFromJSONField(ID.reified(), field.escrowId), poolId: decodeFromJSONField(ID.reified(), field.poolId), coinType: decodeFromJSONField(TypeName.reified(), field.coinType), timestamp: decodeFromJSONField("u64", field.timestamp), extendedDuration: decodeFromJSONField("u64", field.extendedDuration) } ) }

 static fromJSON( json: Record<string, any> ): IncreaseUnlockTimeEvent { if (json.$typeName !== IncreaseUnlockTimeEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return IncreaseUnlockTimeEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): IncreaseUnlockTimeEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isIncreaseUnlockTimeEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a IncreaseUnlockTimeEvent object`); } return IncreaseUnlockTimeEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): IncreaseUnlockTimeEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isIncreaseUnlockTimeEvent(data.bcs.type)) { throw new Error(`object at is not a IncreaseUnlockTimeEvent object`); }

 return IncreaseUnlockTimeEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return IncreaseUnlockTimeEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<IncreaseUnlockTimeEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching IncreaseUnlockTimeEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isIncreaseUnlockTimeEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a IncreaseUnlockTimeEvent object`); }

 return IncreaseUnlockTimeEvent.fromSuiObjectData( res.data ); }

 }

/* ============================== LockEvent =============================== */

export function isLockEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::LockEvent`; }

export interface LockEventFields { escrowId: ToField<ID>; poolId: ToField<ID>; coinType: ToField<TypeName>; lockedValue: ToField<"u64">; unlockTime: ToField<"u64">; timestamp: ToField<"u64"> }

export type LockEventReified = Reified< LockEvent, LockEventFields >;

export class LockEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::LockEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = LockEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::LockEvent`; readonly $typeArgs: []; readonly $isPhantom = LockEvent.$isPhantom;

 readonly escrowId: ToField<ID>; readonly poolId: ToField<ID>; readonly coinType: ToField<TypeName>; readonly lockedValue: ToField<"u64">; readonly unlockTime: ToField<"u64">; readonly timestamp: ToField<"u64">

 private constructor(typeArgs: [], fields: LockEventFields, ) { this.$fullTypeName = composeSuiType( LockEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::LockEvent`; this.$typeArgs = typeArgs;

 this.escrowId = fields.escrowId;; this.poolId = fields.poolId;; this.coinType = fields.coinType;; this.lockedValue = fields.lockedValue;; this.unlockTime = fields.unlockTime;; this.timestamp = fields.timestamp; }

 static reified( ): LockEventReified { return { typeName: LockEvent.$typeName, fullTypeName: composeSuiType( LockEvent.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::LockEvent`, typeArgs: [ ] as [], isPhantom: LockEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => LockEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => LockEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => LockEvent.fromBcs( data, ), bcs: LockEvent.bcs, fromJSONField: (field: any) => LockEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => LockEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => LockEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => LockEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => LockEvent.fetch( client, id, ), new: ( fields: LockEventFields, ) => { return new LockEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return LockEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<LockEvent>> { return phantom(LockEvent.reified( )); } static get p() { return LockEvent.phantom() }

 static get bcs() { return bcs.struct("LockEvent", {

 escrow_id: ID.bcs, pool_id: ID.bcs, coin_type: TypeName.bcs, locked_value: bcs.u64(), unlock_time: bcs.u64(), timestamp: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): LockEvent { return LockEvent.reified( ).new( { escrowId: decodeFromFields(ID.reified(), fields.escrow_id), poolId: decodeFromFields(ID.reified(), fields.pool_id), coinType: decodeFromFields(TypeName.reified(), fields.coin_type), lockedValue: decodeFromFields("u64", fields.locked_value), unlockTime: decodeFromFields("u64", fields.unlock_time), timestamp: decodeFromFields("u64", fields.timestamp) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): LockEvent { if (!isLockEvent(item.type)) { throw new Error("not a LockEvent type");

 }

 return LockEvent.reified( ).new( { escrowId: decodeFromFieldsWithTypes(ID.reified(), item.fields.escrow_id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), coinType: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.coin_type), lockedValue: decodeFromFieldsWithTypes("u64", item.fields.locked_value), unlockTime: decodeFromFieldsWithTypes("u64", item.fields.unlock_time), timestamp: decodeFromFieldsWithTypes("u64", item.fields.timestamp) } ) }

 static fromBcs( data: Uint8Array ): LockEvent { return LockEvent.fromFields( LockEvent.bcs.parse(data) ) }

 toJSONField() { return {

 escrowId: this.escrowId,poolId: this.poolId,coinType: this.coinType.toJSONField(),lockedValue: this.lockedValue.toString(),unlockTime: this.unlockTime.toString(),timestamp: this.timestamp.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): LockEvent { return LockEvent.reified( ).new( { escrowId: decodeFromJSONField(ID.reified(), field.escrowId), poolId: decodeFromJSONField(ID.reified(), field.poolId), coinType: decodeFromJSONField(TypeName.reified(), field.coinType), lockedValue: decodeFromJSONField("u64", field.lockedValue), unlockTime: decodeFromJSONField("u64", field.unlockTime), timestamp: decodeFromJSONField("u64", field.timestamp) } ) }

 static fromJSON( json: Record<string, any> ): LockEvent { if (json.$typeName !== LockEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return LockEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): LockEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isLockEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a LockEvent object`); } return LockEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): LockEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isLockEvent(data.bcs.type)) { throw new Error(`object at is not a LockEvent object`); }

 return LockEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return LockEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<LockEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching LockEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isLockEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a LockEvent object`); }

 return LockEvent.fromSuiObjectData( res.data ); }

 }

/* ============================== MergeEvent =============================== */

export function isMergeEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::MergeEvent`; }

export interface MergeEventFields { escrowId: ToField<ID>; mergedEscrowId: ToField<ID>; poolId: ToField<ID>; coinType: ToField<TypeName>; lockedValue: ToField<"u64">; newUnlockTime: ToField<"u64">; mergedValue: ToField<"u64">; mergedUnlockTime: ToField<"u64">; timestamp: ToField<"u64"> }

export type MergeEventReified = Reified< MergeEvent, MergeEventFields >;

export class MergeEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::MergeEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = MergeEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::MergeEvent`; readonly $typeArgs: []; readonly $isPhantom = MergeEvent.$isPhantom;

 readonly escrowId: ToField<ID>; readonly mergedEscrowId: ToField<ID>; readonly poolId: ToField<ID>; readonly coinType: ToField<TypeName>; readonly lockedValue: ToField<"u64">; readonly newUnlockTime: ToField<"u64">; readonly mergedValue: ToField<"u64">; readonly mergedUnlockTime: ToField<"u64">; readonly timestamp: ToField<"u64">

 private constructor(typeArgs: [], fields: MergeEventFields, ) { this.$fullTypeName = composeSuiType( MergeEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::MergeEvent`; this.$typeArgs = typeArgs;

 this.escrowId = fields.escrowId;; this.mergedEscrowId = fields.mergedEscrowId;; this.poolId = fields.poolId;; this.coinType = fields.coinType;; this.lockedValue = fields.lockedValue;; this.newUnlockTime = fields.newUnlockTime;; this.mergedValue = fields.mergedValue;; this.mergedUnlockTime = fields.mergedUnlockTime;; this.timestamp = fields.timestamp; }

 static reified( ): MergeEventReified { return { typeName: MergeEvent.$typeName, fullTypeName: composeSuiType( MergeEvent.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::MergeEvent`, typeArgs: [ ] as [], isPhantom: MergeEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => MergeEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => MergeEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => MergeEvent.fromBcs( data, ), bcs: MergeEvent.bcs, fromJSONField: (field: any) => MergeEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => MergeEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => MergeEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => MergeEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => MergeEvent.fetch( client, id, ), new: ( fields: MergeEventFields, ) => { return new MergeEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return MergeEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<MergeEvent>> { return phantom(MergeEvent.reified( )); } static get p() { return MergeEvent.phantom() }

 static get bcs() { return bcs.struct("MergeEvent", {

 escrow_id: ID.bcs, merged_escrow_id: ID.bcs, pool_id: ID.bcs, coin_type: TypeName.bcs, locked_value: bcs.u64(), new_unlock_time: bcs.u64(), merged_value: bcs.u64(), merged_unlock_time: bcs.u64(), timestamp: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): MergeEvent { return MergeEvent.reified( ).new( { escrowId: decodeFromFields(ID.reified(), fields.escrow_id), mergedEscrowId: decodeFromFields(ID.reified(), fields.merged_escrow_id), poolId: decodeFromFields(ID.reified(), fields.pool_id), coinType: decodeFromFields(TypeName.reified(), fields.coin_type), lockedValue: decodeFromFields("u64", fields.locked_value), newUnlockTime: decodeFromFields("u64", fields.new_unlock_time), mergedValue: decodeFromFields("u64", fields.merged_value), mergedUnlockTime: decodeFromFields("u64", fields.merged_unlock_time), timestamp: decodeFromFields("u64", fields.timestamp) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): MergeEvent { if (!isMergeEvent(item.type)) { throw new Error("not a MergeEvent type");

 }

 return MergeEvent.reified( ).new( { escrowId: decodeFromFieldsWithTypes(ID.reified(), item.fields.escrow_id), mergedEscrowId: decodeFromFieldsWithTypes(ID.reified(), item.fields.merged_escrow_id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), coinType: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.coin_type), lockedValue: decodeFromFieldsWithTypes("u64", item.fields.locked_value), newUnlockTime: decodeFromFieldsWithTypes("u64", item.fields.new_unlock_time), mergedValue: decodeFromFieldsWithTypes("u64", item.fields.merged_value), mergedUnlockTime: decodeFromFieldsWithTypes("u64", item.fields.merged_unlock_time), timestamp: decodeFromFieldsWithTypes("u64", item.fields.timestamp) } ) }

 static fromBcs( data: Uint8Array ): MergeEvent { return MergeEvent.fromFields( MergeEvent.bcs.parse(data) ) }

 toJSONField() { return {

 escrowId: this.escrowId,mergedEscrowId: this.mergedEscrowId,poolId: this.poolId,coinType: this.coinType.toJSONField(),lockedValue: this.lockedValue.toString(),newUnlockTime: this.newUnlockTime.toString(),mergedValue: this.mergedValue.toString(),mergedUnlockTime: this.mergedUnlockTime.toString(),timestamp: this.timestamp.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): MergeEvent { return MergeEvent.reified( ).new( { escrowId: decodeFromJSONField(ID.reified(), field.escrowId), mergedEscrowId: decodeFromJSONField(ID.reified(), field.mergedEscrowId), poolId: decodeFromJSONField(ID.reified(), field.poolId), coinType: decodeFromJSONField(TypeName.reified(), field.coinType), lockedValue: decodeFromJSONField("u64", field.lockedValue), newUnlockTime: decodeFromJSONField("u64", field.newUnlockTime), mergedValue: decodeFromJSONField("u64", field.mergedValue), mergedUnlockTime: decodeFromJSONField("u64", field.mergedUnlockTime), timestamp: decodeFromJSONField("u64", field.timestamp) } ) }

 static fromJSON( json: Record<string, any> ): MergeEvent { if (json.$typeName !== MergeEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return MergeEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): MergeEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isMergeEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a MergeEvent object`); } return MergeEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): MergeEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isMergeEvent(data.bcs.type)) { throw new Error(`object at is not a MergeEvent object`); }

 return MergeEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return MergeEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<MergeEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching MergeEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isMergeEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a MergeEvent object`); }

 return MergeEvent.fromSuiObjectData( res.data ); }

 }

/* ============================== PenaltyEvent =============================== */

export function isPenaltyEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::PenaltyEvent`; }

export interface PenaltyEventFields { escrowId: ToField<ID>; poolId: ToField<ID>; penaltyAmount: ToField<"u64">; penaltyFee: ToField<"u64">; penaltyReserve: ToField<"u64"> }

export type PenaltyEventReified = Reified< PenaltyEvent, PenaltyEventFields >;

export class PenaltyEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::PenaltyEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = PenaltyEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::PenaltyEvent`; readonly $typeArgs: []; readonly $isPhantom = PenaltyEvent.$isPhantom;

 readonly escrowId: ToField<ID>; readonly poolId: ToField<ID>; readonly penaltyAmount: ToField<"u64">; readonly penaltyFee: ToField<"u64">; readonly penaltyReserve: ToField<"u64">

 private constructor(typeArgs: [], fields: PenaltyEventFields, ) { this.$fullTypeName = composeSuiType( PenaltyEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::PenaltyEvent`; this.$typeArgs = typeArgs;

 this.escrowId = fields.escrowId;; this.poolId = fields.poolId;; this.penaltyAmount = fields.penaltyAmount;; this.penaltyFee = fields.penaltyFee;; this.penaltyReserve = fields.penaltyReserve; }

 static reified( ): PenaltyEventReified { return { typeName: PenaltyEvent.$typeName, fullTypeName: composeSuiType( PenaltyEvent.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::PenaltyEvent`, typeArgs: [ ] as [], isPhantom: PenaltyEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => PenaltyEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PenaltyEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => PenaltyEvent.fromBcs( data, ), bcs: PenaltyEvent.bcs, fromJSONField: (field: any) => PenaltyEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => PenaltyEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => PenaltyEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => PenaltyEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => PenaltyEvent.fetch( client, id, ), new: ( fields: PenaltyEventFields, ) => { return new PenaltyEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return PenaltyEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<PenaltyEvent>> { return phantom(PenaltyEvent.reified( )); } static get p() { return PenaltyEvent.phantom() }

 static get bcs() { return bcs.struct("PenaltyEvent", {

 escrow_id: ID.bcs, pool_id: ID.bcs, penalty_amount: bcs.u64(), penalty_fee: bcs.u64(), penalty_reserve: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): PenaltyEvent { return PenaltyEvent.reified( ).new( { escrowId: decodeFromFields(ID.reified(), fields.escrow_id), poolId: decodeFromFields(ID.reified(), fields.pool_id), penaltyAmount: decodeFromFields("u64", fields.penalty_amount), penaltyFee: decodeFromFields("u64", fields.penalty_fee), penaltyReserve: decodeFromFields("u64", fields.penalty_reserve) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): PenaltyEvent { if (!isPenaltyEvent(item.type)) { throw new Error("not a PenaltyEvent type");

 }

 return PenaltyEvent.reified( ).new( { escrowId: decodeFromFieldsWithTypes(ID.reified(), item.fields.escrow_id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), penaltyAmount: decodeFromFieldsWithTypes("u64", item.fields.penalty_amount), penaltyFee: decodeFromFieldsWithTypes("u64", item.fields.penalty_fee), penaltyReserve: decodeFromFieldsWithTypes("u64", item.fields.penalty_reserve) } ) }

 static fromBcs( data: Uint8Array ): PenaltyEvent { return PenaltyEvent.fromFields( PenaltyEvent.bcs.parse(data) ) }

 toJSONField() { return {

 escrowId: this.escrowId,poolId: this.poolId,penaltyAmount: this.penaltyAmount.toString(),penaltyFee: this.penaltyFee.toString(),penaltyReserve: this.penaltyReserve.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): PenaltyEvent { return PenaltyEvent.reified( ).new( { escrowId: decodeFromJSONField(ID.reified(), field.escrowId), poolId: decodeFromJSONField(ID.reified(), field.poolId), penaltyAmount: decodeFromJSONField("u64", field.penaltyAmount), penaltyFee: decodeFromJSONField("u64", field.penaltyFee), penaltyReserve: decodeFromJSONField("u64", field.penaltyReserve) } ) }

 static fromJSON( json: Record<string, any> ): PenaltyEvent { if (json.$typeName !== PenaltyEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return PenaltyEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): PenaltyEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPenaltyEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PenaltyEvent object`); } return PenaltyEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): PenaltyEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPenaltyEvent(data.bcs.type)) { throw new Error(`object at is not a PenaltyEvent object`); }

 return PenaltyEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PenaltyEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<PenaltyEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PenaltyEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPenaltyEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PenaltyEvent object`); }

 return PenaltyEvent.fromSuiObjectData( res.data ); }

 }

/* ============================== PenaltyInfo =============================== */

export function isPenaltyInfo(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::PenaltyInfo`; }

export interface PenaltyInfoFields { elapsedPercentage: ToField<"u32">; penaltyPercentage: ToField<"u32"> }

export type PenaltyInfoReified = Reified< PenaltyInfo, PenaltyInfoFields >;

export class PenaltyInfo implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::PenaltyInfo`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = PenaltyInfo.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::PenaltyInfo`; readonly $typeArgs: []; readonly $isPhantom = PenaltyInfo.$isPhantom;

 readonly elapsedPercentage: ToField<"u32">; readonly penaltyPercentage: ToField<"u32">

 private constructor(typeArgs: [], fields: PenaltyInfoFields, ) { this.$fullTypeName = composeSuiType( PenaltyInfo.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::PenaltyInfo`; this.$typeArgs = typeArgs;

 this.elapsedPercentage = fields.elapsedPercentage;; this.penaltyPercentage = fields.penaltyPercentage; }

 static reified( ): PenaltyInfoReified { return { typeName: PenaltyInfo.$typeName, fullTypeName: composeSuiType( PenaltyInfo.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::PenaltyInfo`, typeArgs: [ ] as [], isPhantom: PenaltyInfo.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => PenaltyInfo.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PenaltyInfo.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => PenaltyInfo.fromBcs( data, ), bcs: PenaltyInfo.bcs, fromJSONField: (field: any) => PenaltyInfo.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => PenaltyInfo.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => PenaltyInfo.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => PenaltyInfo.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => PenaltyInfo.fetch( client, id, ), new: ( fields: PenaltyInfoFields, ) => { return new PenaltyInfo( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return PenaltyInfo.reified() }

 static phantom( ): PhantomReified<ToTypeStr<PenaltyInfo>> { return phantom(PenaltyInfo.reified( )); } static get p() { return PenaltyInfo.phantom() }

 static get bcs() { return bcs.struct("PenaltyInfo", {

 elapsed_percentage: bcs.u32(), penalty_percentage: bcs.u32()

}) };

 static fromFields( fields: Record<string, any> ): PenaltyInfo { return PenaltyInfo.reified( ).new( { elapsedPercentage: decodeFromFields("u32", fields.elapsed_percentage), penaltyPercentage: decodeFromFields("u32", fields.penalty_percentage) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): PenaltyInfo { if (!isPenaltyInfo(item.type)) { throw new Error("not a PenaltyInfo type");

 }

 return PenaltyInfo.reified( ).new( { elapsedPercentage: decodeFromFieldsWithTypes("u32", item.fields.elapsed_percentage), penaltyPercentage: decodeFromFieldsWithTypes("u32", item.fields.penalty_percentage) } ) }

 static fromBcs( data: Uint8Array ): PenaltyInfo { return PenaltyInfo.fromFields( PenaltyInfo.bcs.parse(data) ) }

 toJSONField() { return {

 elapsedPercentage: this.elapsedPercentage,penaltyPercentage: this.penaltyPercentage,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): PenaltyInfo { return PenaltyInfo.reified( ).new( { elapsedPercentage: decodeFromJSONField("u32", field.elapsedPercentage), penaltyPercentage: decodeFromJSONField("u32", field.penaltyPercentage) } ) }

 static fromJSON( json: Record<string, any> ): PenaltyInfo { if (json.$typeName !== PenaltyInfo.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return PenaltyInfo.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): PenaltyInfo { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPenaltyInfo(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PenaltyInfo object`); } return PenaltyInfo.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): PenaltyInfo { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPenaltyInfo(data.bcs.type)) { throw new Error(`object at is not a PenaltyInfo object`); }

 return PenaltyInfo.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PenaltyInfo.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<PenaltyInfo> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PenaltyInfo object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPenaltyInfo(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PenaltyInfo object`); }

 return PenaltyInfo.fromSuiObjectData( res.data ); }

 }

/* ============================== UnlockEvent =============================== */

export function isUnlockEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::UnlockEvent`; }

export interface UnlockEventFields { escrowId: ToField<ID>; poolId: ToField<ID>; coinType: ToField<TypeName>; unlockedValue: ToField<"u64">; lockedEnd: ToField<"u64">; timestamp: ToField<"u64"> }

export type UnlockEventReified = Reified< UnlockEvent, UnlockEventFields >;

export class UnlockEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::UnlockEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = UnlockEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::UnlockEvent`; readonly $typeArgs: []; readonly $isPhantom = UnlockEvent.$isPhantom;

 readonly escrowId: ToField<ID>; readonly poolId: ToField<ID>; readonly coinType: ToField<TypeName>; readonly unlockedValue: ToField<"u64">; readonly lockedEnd: ToField<"u64">; readonly timestamp: ToField<"u64">

 private constructor(typeArgs: [], fields: UnlockEventFields, ) { this.$fullTypeName = composeSuiType( UnlockEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::UnlockEvent`; this.$typeArgs = typeArgs;

 this.escrowId = fields.escrowId;; this.poolId = fields.poolId;; this.coinType = fields.coinType;; this.unlockedValue = fields.unlockedValue;; this.lockedEnd = fields.lockedEnd;; this.timestamp = fields.timestamp; }

 static reified( ): UnlockEventReified { return { typeName: UnlockEvent.$typeName, fullTypeName: composeSuiType( UnlockEvent.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::UnlockEvent`, typeArgs: [ ] as [], isPhantom: UnlockEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => UnlockEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => UnlockEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => UnlockEvent.fromBcs( data, ), bcs: UnlockEvent.bcs, fromJSONField: (field: any) => UnlockEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => UnlockEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => UnlockEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => UnlockEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => UnlockEvent.fetch( client, id, ), new: ( fields: UnlockEventFields, ) => { return new UnlockEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return UnlockEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<UnlockEvent>> { return phantom(UnlockEvent.reified( )); } static get p() { return UnlockEvent.phantom() }

 static get bcs() { return bcs.struct("UnlockEvent", {

 escrow_id: ID.bcs, pool_id: ID.bcs, coin_type: TypeName.bcs, unlocked_value: bcs.u64(), locked_end: bcs.u64(), timestamp: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): UnlockEvent { return UnlockEvent.reified( ).new( { escrowId: decodeFromFields(ID.reified(), fields.escrow_id), poolId: decodeFromFields(ID.reified(), fields.pool_id), coinType: decodeFromFields(TypeName.reified(), fields.coin_type), unlockedValue: decodeFromFields("u64", fields.unlocked_value), lockedEnd: decodeFromFields("u64", fields.locked_end), timestamp: decodeFromFields("u64", fields.timestamp) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): UnlockEvent { if (!isUnlockEvent(item.type)) { throw new Error("not a UnlockEvent type");

 }

 return UnlockEvent.reified( ).new( { escrowId: decodeFromFieldsWithTypes(ID.reified(), item.fields.escrow_id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), coinType: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.coin_type), unlockedValue: decodeFromFieldsWithTypes("u64", item.fields.unlocked_value), lockedEnd: decodeFromFieldsWithTypes("u64", item.fields.locked_end), timestamp: decodeFromFieldsWithTypes("u64", item.fields.timestamp) } ) }

 static fromBcs( data: Uint8Array ): UnlockEvent { return UnlockEvent.fromFields( UnlockEvent.bcs.parse(data) ) }

 toJSONField() { return {

 escrowId: this.escrowId,poolId: this.poolId,coinType: this.coinType.toJSONField(),unlockedValue: this.unlockedValue.toString(),lockedEnd: this.lockedEnd.toString(),timestamp: this.timestamp.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): UnlockEvent { return UnlockEvent.reified( ).new( { escrowId: decodeFromJSONField(ID.reified(), field.escrowId), poolId: decodeFromJSONField(ID.reified(), field.poolId), coinType: decodeFromJSONField(TypeName.reified(), field.coinType), unlockedValue: decodeFromJSONField("u64", field.unlockedValue), lockedEnd: decodeFromJSONField("u64", field.lockedEnd), timestamp: decodeFromJSONField("u64", field.timestamp) } ) }

 static fromJSON( json: Record<string, any> ): UnlockEvent { if (json.$typeName !== UnlockEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return UnlockEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): UnlockEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isUnlockEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a UnlockEvent object`); } return UnlockEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): UnlockEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isUnlockEvent(data.bcs.type)) { throw new Error(`object at is not a UnlockEvent object`); }

 return UnlockEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return UnlockEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<UnlockEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching UnlockEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isUnlockEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a UnlockEvent object`); }

 return UnlockEvent.fromSuiObjectData( res.data ); }

 }

/* ============================== WithdrawEvent =============================== */

export function isWithdrawEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_center::WithdrawEvent`; }

export interface WithdrawEventFields { escrowId: ToField<ID>; poolId: ToField<ID>; coinType: ToField<TypeName>; withdrawl: ToField<"u64">; lockedEnd: ToField<"u64">; timestamp: ToField<"u64">; whitelist: ToField<Option<TypeName>> }

export type WithdrawEventReified = Reified< WithdrawEvent, WithdrawEventFields >;

export class WithdrawEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_center::WithdrawEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = WithdrawEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_center::WithdrawEvent`; readonly $typeArgs: []; readonly $isPhantom = WithdrawEvent.$isPhantom;

 readonly escrowId: ToField<ID>; readonly poolId: ToField<ID>; readonly coinType: ToField<TypeName>; readonly withdrawl: ToField<"u64">; readonly lockedEnd: ToField<"u64">; readonly timestamp: ToField<"u64">; readonly whitelist: ToField<Option<TypeName>>

 private constructor(typeArgs: [], fields: WithdrawEventFields, ) { this.$fullTypeName = composeSuiType( WithdrawEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_center::WithdrawEvent`; this.$typeArgs = typeArgs;

 this.escrowId = fields.escrowId;; this.poolId = fields.poolId;; this.coinType = fields.coinType;; this.withdrawl = fields.withdrawl;; this.lockedEnd = fields.lockedEnd;; this.timestamp = fields.timestamp;; this.whitelist = fields.whitelist; }

 static reified( ): WithdrawEventReified { return { typeName: WithdrawEvent.$typeName, fullTypeName: composeSuiType( WithdrawEvent.$typeName, ...[] ) as `${typeof PKG_V1}::de_center::WithdrawEvent`, typeArgs: [ ] as [], isPhantom: WithdrawEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => WithdrawEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => WithdrawEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => WithdrawEvent.fromBcs( data, ), bcs: WithdrawEvent.bcs, fromJSONField: (field: any) => WithdrawEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => WithdrawEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => WithdrawEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => WithdrawEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => WithdrawEvent.fetch( client, id, ), new: ( fields: WithdrawEventFields, ) => { return new WithdrawEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return WithdrawEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<WithdrawEvent>> { return phantom(WithdrawEvent.reified( )); } static get p() { return WithdrawEvent.phantom() }

 static get bcs() { return bcs.struct("WithdrawEvent", {

 escrow_id: ID.bcs, pool_id: ID.bcs, coin_type: TypeName.bcs, withdrawl: bcs.u64(), locked_end: bcs.u64(), timestamp: bcs.u64(), whitelist: Option.bcs(TypeName.bcs)

}) };

 static fromFields( fields: Record<string, any> ): WithdrawEvent { return WithdrawEvent.reified( ).new( { escrowId: decodeFromFields(ID.reified(), fields.escrow_id), poolId: decodeFromFields(ID.reified(), fields.pool_id), coinType: decodeFromFields(TypeName.reified(), fields.coin_type), withdrawl: decodeFromFields("u64", fields.withdrawl), lockedEnd: decodeFromFields("u64", fields.locked_end), timestamp: decodeFromFields("u64", fields.timestamp), whitelist: decodeFromFields(Option.reified(TypeName.reified()), fields.whitelist) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): WithdrawEvent { if (!isWithdrawEvent(item.type)) { throw new Error("not a WithdrawEvent type");

 }

 return WithdrawEvent.reified( ).new( { escrowId: decodeFromFieldsWithTypes(ID.reified(), item.fields.escrow_id), poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id), coinType: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.coin_type), withdrawl: decodeFromFieldsWithTypes("u64", item.fields.withdrawl), lockedEnd: decodeFromFieldsWithTypes("u64", item.fields.locked_end), timestamp: decodeFromFieldsWithTypes("u64", item.fields.timestamp), whitelist: decodeFromFieldsWithTypes(Option.reified(TypeName.reified()), item.fields.whitelist) } ) }

 static fromBcs( data: Uint8Array ): WithdrawEvent { return WithdrawEvent.fromFields( WithdrawEvent.bcs.parse(data) ) }

 toJSONField() { return {

 escrowId: this.escrowId,poolId: this.poolId,coinType: this.coinType.toJSONField(),withdrawl: this.withdrawl.toString(),lockedEnd: this.lockedEnd.toString(),timestamp: this.timestamp.toString(),whitelist: fieldToJSON<Option<TypeName>>(`${Option.$typeName}<${TypeName.$typeName}>`, this.whitelist),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): WithdrawEvent { return WithdrawEvent.reified( ).new( { escrowId: decodeFromJSONField(ID.reified(), field.escrowId), poolId: decodeFromJSONField(ID.reified(), field.poolId), coinType: decodeFromJSONField(TypeName.reified(), field.coinType), withdrawl: decodeFromJSONField("u64", field.withdrawl), lockedEnd: decodeFromJSONField("u64", field.lockedEnd), timestamp: decodeFromJSONField("u64", field.timestamp), whitelist: decodeFromJSONField(Option.reified(TypeName.reified()), field.whitelist) } ) }

 static fromJSON( json: Record<string, any> ): WithdrawEvent { if (json.$typeName !== WithdrawEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return WithdrawEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): WithdrawEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isWithdrawEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a WithdrawEvent object`); } return WithdrawEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): WithdrawEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isWithdrawEvent(data.bcs.type)) { throw new Error(`object at is not a WithdrawEvent object`); }

 return WithdrawEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return WithdrawEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<WithdrawEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching WithdrawEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isWithdrawEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a WithdrawEvent object`); }

 return WithdrawEvent.fromSuiObjectData( res.data ); }

 }
