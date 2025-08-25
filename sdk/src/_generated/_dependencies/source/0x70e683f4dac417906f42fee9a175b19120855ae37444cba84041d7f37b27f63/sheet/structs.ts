import * as reified from "../../../../_framework/reified";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, fieldToJSON, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {Vector} from "../../../../_framework/vector";
import {Option} from "../../0x1/option/structs";
import {TypeName} from "../../0x1/type-name/structs";
import {Balance} from "../../0x2/balance/structs";
import {VecMap} from "../../0x2/vec-map/structs";
import {VecSet} from "../../0x2/vec-set/structs";
import {PKG_V1} from "../index";
import {Credit, Debt} from "../liability/structs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== Entity =============================== */

export function isEntity(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::sheet::Entity`; }

export interface EntityFields { pos0: ToField<TypeName> }

export type EntityReified = Reified< Entity, EntityFields >;

export class Entity implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Entity`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Entity.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Entity`; readonly $typeArgs: []; readonly $isPhantom = Entity.$isPhantom;

 readonly pos0: ToField<TypeName>

 private constructor(typeArgs: [], fields: EntityFields, ) { this.$fullTypeName = composeSuiType( Entity.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Entity`; this.$typeArgs = typeArgs;

 this.pos0 = fields.pos0; }

 static reified( ): EntityReified { const reifiedBcs = Entity.bcs; return { typeName: Entity.$typeName, fullTypeName: composeSuiType( Entity.$typeName, ...[] ) as `${typeof PKG_V1}::sheet::Entity`, typeArgs: [ ] as [], isPhantom: Entity.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Entity.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Entity.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Entity.fromFields( reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Entity.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Entity.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Entity.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Entity.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Entity.fetch( client, id, ), new: ( fields: EntityFields, ) => { return new Entity( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Entity.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Entity>> { return phantom(Entity.reified( )); } static get p() { return Entity.phantom() }

 private static instantiateBcs() { return bcs.struct("Entity", {

 pos0: TypeName.bcs

}) };

 private static cachedBcs: ReturnType<typeof Entity.instantiateBcs> | null = null;

 static get bcs() { if (!Entity.cachedBcs) { Entity.cachedBcs = Entity.instantiateBcs() } return Entity.cachedBcs };

 static fromFields( fields: Record<string, any> ): Entity { return Entity.reified( ).new( { pos0: decodeFromFields(TypeName.reified(), fields.pos0) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Entity { if (!isEntity(item.type)) { throw new Error("not a Entity type");

 }

 return Entity.reified( ).new( { pos0: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.pos0) } ) }

 static fromBcs( data: Uint8Array ): Entity { return Entity.fromFields( Entity.bcs.parse(data) ) }

 toJSONField() { return {

 pos0: this.pos0.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Entity { return Entity.reified( ).new( { pos0: decodeFromJSONField(TypeName.reified(), field.pos0) } ) }

 static fromJSON( json: Record<string, any> ): Entity { if (json.$typeName !== Entity.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Entity.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Entity { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isEntity(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Entity object`); } return Entity.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Entity { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isEntity(data.bcs.type)) { throw new Error(`object at is not a Entity object`); }

 return Entity.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Entity.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Entity> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Entity object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isEntity(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Entity object`); }

 return Entity.fromSuiObjectData( res.data ); }

 }

/* ============================== Sheet =============================== */

export function isSheet(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::sheet::Sheet` + '<'); }

export interface SheetFields<CoinType extends PhantomTypeArgument, SelfEntity extends PhantomTypeArgument> { credits: ToField<VecMap<Entity, Credit<CoinType>>>; debts: ToField<VecMap<Entity, Debt<CoinType>>>; blacklist: ToField<VecSet<Entity>> }

export type SheetReified<CoinType extends PhantomTypeArgument, SelfEntity extends PhantomTypeArgument> = Reified< Sheet<CoinType, SelfEntity>, SheetFields<CoinType, SelfEntity> >;

export class Sheet<CoinType extends PhantomTypeArgument, SelfEntity extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Sheet`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = Sheet.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Sheet<${PhantomToTypeStr<CoinType>}, ${PhantomToTypeStr<SelfEntity>}>`; readonly $typeArgs: [PhantomToTypeStr<CoinType>, PhantomToTypeStr<SelfEntity>]; readonly $isPhantom = Sheet.$isPhantom;

 readonly credits: ToField<VecMap<Entity, Credit<CoinType>>>; readonly debts: ToField<VecMap<Entity, Debt<CoinType>>>; readonly blacklist: ToField<VecSet<Entity>>

 private constructor(typeArgs: [PhantomToTypeStr<CoinType>, PhantomToTypeStr<SelfEntity>], fields: SheetFields<CoinType, SelfEntity>, ) { this.$fullTypeName = composeSuiType( Sheet.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Sheet<${PhantomToTypeStr<CoinType>}, ${PhantomToTypeStr<SelfEntity>}>`; this.$typeArgs = typeArgs;

 this.credits = fields.credits;; this.debts = fields.debts;; this.blacklist = fields.blacklist; }

 static reified<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType, SelfEntity: SelfEntity ): SheetReified<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>> { const reifiedBcs = Sheet.bcs; return { typeName: Sheet.$typeName, fullTypeName: composeSuiType( Sheet.$typeName, ...[extractType(CoinType), extractType(SelfEntity)] ) as `${typeof PKG_V1}::sheet::Sheet<${PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<SelfEntity>>}>`, typeArgs: [ extractType(CoinType), extractType(SelfEntity) ] as [PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>, PhantomToTypeStr<ToPhantomTypeArgument<SelfEntity>>], isPhantom: Sheet.$isPhantom, reifiedTypeArgs: [CoinType, SelfEntity], fromFields: (fields: Record<string, any>) => Sheet.fromFields( [CoinType, SelfEntity], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Sheet.fromFieldsWithTypes( [CoinType, SelfEntity], item, ), fromBcs: (data: Uint8Array) => Sheet.fromFields( [CoinType, SelfEntity], reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Sheet.fromJSONField( [CoinType, SelfEntity], field, ), fromJSON: (json: Record<string, any>) => Sheet.fromJSON( [CoinType, SelfEntity], json, ), fromSuiParsedData: (content: SuiParsedData) => Sheet.fromSuiParsedData( [CoinType, SelfEntity], content, ), fromSuiObjectData: (content: SuiObjectData) => Sheet.fromSuiObjectData( [CoinType, SelfEntity], content, ), fetch: async (client: SuiClient, id: string) => Sheet.fetch( client, [CoinType, SelfEntity], id, ), new: ( fields: SheetFields<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>>, ) => { return new Sheet( [extractType(CoinType), extractType(SelfEntity)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Sheet.reified }

 static phantom<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType, SelfEntity: SelfEntity ): PhantomReified<ToTypeStr<Sheet<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>>>> { return phantom(Sheet.reified( CoinType, SelfEntity )); } static get p() { return Sheet.phantom }

 private static instantiateBcs() { return bcs.struct("Sheet", {

 credits: VecMap.bcs(Entity.bcs, Credit.bcs), debts: VecMap.bcs(Entity.bcs, Debt.bcs), blacklist: VecSet.bcs(Entity.bcs)

}) };

 private static cachedBcs: ReturnType<typeof Sheet.instantiateBcs> | null = null;

 static get bcs() { if (!Sheet.cachedBcs) { Sheet.cachedBcs = Sheet.instantiateBcs() } return Sheet.cachedBcs };

 static fromFields<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, SelfEntity], fields: Record<string, any> ): Sheet<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>> { return Sheet.reified( typeArgs[0], typeArgs[1], ).new( { credits: decodeFromFields(VecMap.reified(Entity.reified(), Credit.reified(typeArgs[0])), fields.credits), debts: decodeFromFields(VecMap.reified(Entity.reified(), Debt.reified(typeArgs[0])), fields.debts), blacklist: decodeFromFields(VecSet.reified(Entity.reified()), fields.blacklist) } ) }

 static fromFieldsWithTypes<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, SelfEntity], item: FieldsWithTypes ): Sheet<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>> { if (!isSheet(item.type)) { throw new Error("not a Sheet type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Sheet.reified( typeArgs[0], typeArgs[1], ).new( { credits: decodeFromFieldsWithTypes(VecMap.reified(Entity.reified(), Credit.reified(typeArgs[0])), item.fields.credits), debts: decodeFromFieldsWithTypes(VecMap.reified(Entity.reified(), Debt.reified(typeArgs[0])), item.fields.debts), blacklist: decodeFromFieldsWithTypes(VecSet.reified(Entity.reified()), item.fields.blacklist) } ) }

 static fromBcs<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, SelfEntity], data: Uint8Array ): Sheet<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>> { return Sheet.fromFields( typeArgs, Sheet.bcs.parse(data) ) }

 toJSONField() { return {

 credits: this.credits.toJSONField(),debts: this.debts.toJSONField(),blacklist: this.blacklist.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, SelfEntity], field: any ): Sheet<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>> { return Sheet.reified( typeArgs[0], typeArgs[1], ).new( { credits: decodeFromJSONField(VecMap.reified(Entity.reified(), Credit.reified(typeArgs[0])), field.credits), debts: decodeFromJSONField(VecMap.reified(Entity.reified(), Debt.reified(typeArgs[0])), field.debts), blacklist: decodeFromJSONField(VecSet.reified(Entity.reified()), field.blacklist) } ) }

 static fromJSON<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, SelfEntity], json: Record<string, any> ): Sheet<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>> { if (json.$typeName !== Sheet.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Sheet.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Sheet.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, SelfEntity], content: SuiParsedData ): Sheet<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isSheet(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Sheet object`); } return Sheet.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, SelfEntity], data: SuiObjectData ): Sheet<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isSheet(data.bcs.type)) { throw new Error(`object at is not a Sheet object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Sheet.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Sheet.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<CoinType extends PhantomReified<PhantomTypeArgument>, SelfEntity extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [CoinType, SelfEntity], id: string ): Promise<Sheet<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<SelfEntity>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Sheet object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isSheet(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Sheet object`); }

 return Sheet.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Loan =============================== */

export function isLoan(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::sheet::Loan` + '<'); }

export interface LoanFields<CoinType extends PhantomTypeArgument, Lender extends PhantomTypeArgument, Receiver extends PhantomTypeArgument> { balance: ToField<Balance<CoinType>>; debt: ToField<Debt<CoinType>> }

export type LoanReified<CoinType extends PhantomTypeArgument, Lender extends PhantomTypeArgument, Receiver extends PhantomTypeArgument> = Reified< Loan<CoinType, Lender, Receiver>, LoanFields<CoinType, Lender, Receiver> >;

export class Loan<CoinType extends PhantomTypeArgument, Lender extends PhantomTypeArgument, Receiver extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Loan`; static readonly $numTypeParams = 3; static readonly $isPhantom = [true,true,true,] as const;

 readonly $typeName = Loan.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Loan<${PhantomToTypeStr<CoinType>}, ${PhantomToTypeStr<Lender>}, ${PhantomToTypeStr<Receiver>}>`; readonly $typeArgs: [PhantomToTypeStr<CoinType>, PhantomToTypeStr<Lender>, PhantomToTypeStr<Receiver>]; readonly $isPhantom = Loan.$isPhantom;

 readonly balance: ToField<Balance<CoinType>>; readonly debt: ToField<Debt<CoinType>>

 private constructor(typeArgs: [PhantomToTypeStr<CoinType>, PhantomToTypeStr<Lender>, PhantomToTypeStr<Receiver>], fields: LoanFields<CoinType, Lender, Receiver>, ) { this.$fullTypeName = composeSuiType( Loan.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Loan<${PhantomToTypeStr<CoinType>}, ${PhantomToTypeStr<Lender>}, ${PhantomToTypeStr<Receiver>}>`; this.$typeArgs = typeArgs;

 this.balance = fields.balance;; this.debt = fields.debt; }

 static reified<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType, Lender: Lender, Receiver: Receiver ): LoanReified<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>> { const reifiedBcs = Loan.bcs; return { typeName: Loan.$typeName, fullTypeName: composeSuiType( Loan.$typeName, ...[extractType(CoinType), extractType(Lender), extractType(Receiver)] ) as `${typeof PKG_V1}::sheet::Loan<${PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<Lender>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<Receiver>>}>`, typeArgs: [ extractType(CoinType), extractType(Lender), extractType(Receiver) ] as [PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>, PhantomToTypeStr<ToPhantomTypeArgument<Lender>>, PhantomToTypeStr<ToPhantomTypeArgument<Receiver>>], isPhantom: Loan.$isPhantom, reifiedTypeArgs: [CoinType, Lender, Receiver], fromFields: (fields: Record<string, any>) => Loan.fromFields( [CoinType, Lender, Receiver], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Loan.fromFieldsWithTypes( [CoinType, Lender, Receiver], item, ), fromBcs: (data: Uint8Array) => Loan.fromFields( [CoinType, Lender, Receiver], reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Loan.fromJSONField( [CoinType, Lender, Receiver], field, ), fromJSON: (json: Record<string, any>) => Loan.fromJSON( [CoinType, Lender, Receiver], json, ), fromSuiParsedData: (content: SuiParsedData) => Loan.fromSuiParsedData( [CoinType, Lender, Receiver], content, ), fromSuiObjectData: (content: SuiObjectData) => Loan.fromSuiObjectData( [CoinType, Lender, Receiver], content, ), fetch: async (client: SuiClient, id: string) => Loan.fetch( client, [CoinType, Lender, Receiver], id, ), new: ( fields: LoanFields<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>>, ) => { return new Loan( [extractType(CoinType), extractType(Lender), extractType(Receiver)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Loan.reified }

 static phantom<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType, Lender: Lender, Receiver: Receiver ): PhantomReified<ToTypeStr<Loan<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>>>> { return phantom(Loan.reified( CoinType, Lender, Receiver )); } static get p() { return Loan.phantom }

 private static instantiateBcs() { return bcs.struct("Loan", {

 balance: Balance.bcs, debt: Debt.bcs

}) };

 private static cachedBcs: ReturnType<typeof Loan.instantiateBcs> | null = null;

 static get bcs() { if (!Loan.cachedBcs) { Loan.cachedBcs = Loan.instantiateBcs() } return Loan.cachedBcs };

 static fromFields<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Lender, Receiver], fields: Record<string, any> ): Loan<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>> { return Loan.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { balance: decodeFromFields(Balance.reified(typeArgs[0]), fields.balance), debt: decodeFromFields(Debt.reified(typeArgs[0]), fields.debt) } ) }

 static fromFieldsWithTypes<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Lender, Receiver], item: FieldsWithTypes ): Loan<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>> { if (!isLoan(item.type)) { throw new Error("not a Loan type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Loan.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { balance: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.balance), debt: decodeFromFieldsWithTypes(Debt.reified(typeArgs[0]), item.fields.debt) } ) }

 static fromBcs<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Lender, Receiver], data: Uint8Array ): Loan<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>> { return Loan.fromFields( typeArgs, Loan.bcs.parse(data) ) }

 toJSONField() { return {

 balance: this.balance.toJSONField(),debt: this.debt.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Lender, Receiver], field: any ): Loan<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>> { return Loan.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { balance: decodeFromJSONField(Balance.reified(typeArgs[0]), field.balance), debt: decodeFromJSONField(Debt.reified(typeArgs[0]), field.debt) } ) }

 static fromJSON<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Lender, Receiver], json: Record<string, any> ): Loan<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>> { if (json.$typeName !== Loan.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Loan.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Loan.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Lender, Receiver], content: SuiParsedData ): Loan<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isLoan(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Loan object`); } return Loan.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Lender, Receiver], data: SuiObjectData ): Loan<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isLoan(data.bcs.type)) { throw new Error(`object at is not a Loan object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 3) { throw new Error(`type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 3; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Loan.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Loan.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<CoinType extends PhantomReified<PhantomTypeArgument>, Lender extends PhantomReified<PhantomTypeArgument>, Receiver extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [CoinType, Lender, Receiver], id: string ): Promise<Loan<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Lender>, ToPhantomTypeArgument<Receiver>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Loan object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isLoan(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Loan object`); }

 return Loan.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Request =============================== */

export function isRequest(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::sheet::Request` + '<'); }

export interface RequestFields<CoinType extends PhantomTypeArgument, Collector extends PhantomTypeArgument> { requirement: ToField<"u64">; balance: ToField<Balance<CoinType>>; checklist: ToField<Option<Vector<Entity>>>; payorDebts: ToField<VecMap<Entity, Debt<CoinType>>> }

export type RequestReified<CoinType extends PhantomTypeArgument, Collector extends PhantomTypeArgument> = Reified< Request<CoinType, Collector>, RequestFields<CoinType, Collector> >;

export class Request<CoinType extends PhantomTypeArgument, Collector extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Request`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = Request.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Request<${PhantomToTypeStr<CoinType>}, ${PhantomToTypeStr<Collector>}>`; readonly $typeArgs: [PhantomToTypeStr<CoinType>, PhantomToTypeStr<Collector>]; readonly $isPhantom = Request.$isPhantom;

 readonly requirement: ToField<"u64">; readonly balance: ToField<Balance<CoinType>>; readonly checklist: ToField<Option<Vector<Entity>>>; readonly payorDebts: ToField<VecMap<Entity, Debt<CoinType>>>

 private constructor(typeArgs: [PhantomToTypeStr<CoinType>, PhantomToTypeStr<Collector>], fields: RequestFields<CoinType, Collector>, ) { this.$fullTypeName = composeSuiType( Request.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Request<${PhantomToTypeStr<CoinType>}, ${PhantomToTypeStr<Collector>}>`; this.$typeArgs = typeArgs;

 this.requirement = fields.requirement;; this.balance = fields.balance;; this.checklist = fields.checklist;; this.payorDebts = fields.payorDebts; }

 static reified<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType, Collector: Collector ): RequestReified<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>> { const reifiedBcs = Request.bcs; return { typeName: Request.$typeName, fullTypeName: composeSuiType( Request.$typeName, ...[extractType(CoinType), extractType(Collector)] ) as `${typeof PKG_V1}::sheet::Request<${PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<Collector>>}>`, typeArgs: [ extractType(CoinType), extractType(Collector) ] as [PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>, PhantomToTypeStr<ToPhantomTypeArgument<Collector>>], isPhantom: Request.$isPhantom, reifiedTypeArgs: [CoinType, Collector], fromFields: (fields: Record<string, any>) => Request.fromFields( [CoinType, Collector], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Request.fromFieldsWithTypes( [CoinType, Collector], item, ), fromBcs: (data: Uint8Array) => Request.fromFields( [CoinType, Collector], reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Request.fromJSONField( [CoinType, Collector], field, ), fromJSON: (json: Record<string, any>) => Request.fromJSON( [CoinType, Collector], json, ), fromSuiParsedData: (content: SuiParsedData) => Request.fromSuiParsedData( [CoinType, Collector], content, ), fromSuiObjectData: (content: SuiObjectData) => Request.fromSuiObjectData( [CoinType, Collector], content, ), fetch: async (client: SuiClient, id: string) => Request.fetch( client, [CoinType, Collector], id, ), new: ( fields: RequestFields<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>>, ) => { return new Request( [extractType(CoinType), extractType(Collector)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Request.reified }

 static phantom<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType, Collector: Collector ): PhantomReified<ToTypeStr<Request<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>>>> { return phantom(Request.reified( CoinType, Collector )); } static get p() { return Request.phantom }

 private static instantiateBcs() { return bcs.struct("Request", {

 requirement: bcs.u64(), balance: Balance.bcs, checklist: Option.bcs(bcs.vector(Entity.bcs)), payor_debts: VecMap.bcs(Entity.bcs, Debt.bcs)

}) };

 private static cachedBcs: ReturnType<typeof Request.instantiateBcs> | null = null;

 static get bcs() { if (!Request.cachedBcs) { Request.cachedBcs = Request.instantiateBcs() } return Request.cachedBcs };

 static fromFields<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Collector], fields: Record<string, any> ): Request<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>> { return Request.reified( typeArgs[0], typeArgs[1], ).new( { requirement: decodeFromFields("u64", fields.requirement), balance: decodeFromFields(Balance.reified(typeArgs[0]), fields.balance), checklist: decodeFromFields(Option.reified(reified.vector(Entity.reified())), fields.checklist), payorDebts: decodeFromFields(VecMap.reified(Entity.reified(), Debt.reified(typeArgs[0])), fields.payor_debts) } ) }

 static fromFieldsWithTypes<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Collector], item: FieldsWithTypes ): Request<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>> { if (!isRequest(item.type)) { throw new Error("not a Request type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Request.reified( typeArgs[0], typeArgs[1], ).new( { requirement: decodeFromFieldsWithTypes("u64", item.fields.requirement), balance: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.balance), checklist: decodeFromFieldsWithTypes(Option.reified(reified.vector(Entity.reified())), item.fields.checklist), payorDebts: decodeFromFieldsWithTypes(VecMap.reified(Entity.reified(), Debt.reified(typeArgs[0])), item.fields.payor_debts) } ) }

 static fromBcs<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Collector], data: Uint8Array ): Request<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>> { return Request.fromFields( typeArgs, Request.bcs.parse(data) ) }

 toJSONField() { return {

 requirement: this.requirement.toString(),balance: this.balance.toJSONField(),checklist: fieldToJSON<Option<Vector<Entity>>>(`${Option.$typeName}<vector<${Entity.$typeName}>>`, this.checklist),payorDebts: this.payorDebts.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Collector], field: any ): Request<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>> { return Request.reified( typeArgs[0], typeArgs[1], ).new( { requirement: decodeFromJSONField("u64", field.requirement), balance: decodeFromJSONField(Balance.reified(typeArgs[0]), field.balance), checklist: decodeFromJSONField(Option.reified(reified.vector(Entity.reified())), field.checklist), payorDebts: decodeFromJSONField(VecMap.reified(Entity.reified(), Debt.reified(typeArgs[0])), field.payorDebts) } ) }

 static fromJSON<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Collector], json: Record<string, any> ): Request<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>> { if (json.$typeName !== Request.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Request.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Request.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Collector], content: SuiParsedData ): Request<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRequest(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Request object`); } return Request.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( typeArgs: [CoinType, Collector], data: SuiObjectData ): Request<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRequest(data.bcs.type)) { throw new Error(`object at is not a Request object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Request.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Request.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<CoinType extends PhantomReified<PhantomTypeArgument>, Collector extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [CoinType, Collector], id: string ): Promise<Request<ToPhantomTypeArgument<CoinType>, ToPhantomTypeArgument<Collector>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Request object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRequest(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Request object`); }

 return Request.fromSuiObjectData( typeArgs, res.data ); }

 }
