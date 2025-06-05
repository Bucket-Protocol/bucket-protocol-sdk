import {Option} from "../../_dependencies/source/0x1/option/structs";
import {TypeName} from "../../_dependencies/source/0x1/type-name/structs";
import {Balance} from "../../_dependencies/source/0x2/balance/structs";
import {VecMap} from "../../_dependencies/source/0x2/vec-map/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, fieldToJSON, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== Collector =============================== */

export function isCollector(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::sheet::Collector` + '<'); }

export interface CollectorFields<Creditor extends PhantomTypeArgument, Debtor extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> { requirement: ToField<"u64">; repayment: ToField<Option<Repayment<Creditor, Debtor, CoinType>>> }

export type CollectorReified<Creditor extends PhantomTypeArgument, Debtor extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> = Reified< Collector<Creditor, Debtor, CoinType>, CollectorFields<Creditor, Debtor, CoinType> >;

export class Collector<Creditor extends PhantomTypeArgument, Debtor extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Collector`; static readonly $numTypeParams = 3; static readonly $isPhantom = [true,true,true,] as const;

 readonly $typeName = Collector.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Collector<${PhantomToTypeStr<Creditor>}, ${PhantomToTypeStr<Debtor>}, ${PhantomToTypeStr<CoinType>}>`; readonly $typeArgs: [PhantomToTypeStr<Creditor>, PhantomToTypeStr<Debtor>, PhantomToTypeStr<CoinType>]; readonly $isPhantom = Collector.$isPhantom;

 readonly requirement: ToField<"u64">; readonly repayment: ToField<Option<Repayment<Creditor, Debtor, CoinType>>>

 private constructor(typeArgs: [PhantomToTypeStr<Creditor>, PhantomToTypeStr<Debtor>, PhantomToTypeStr<CoinType>], fields: CollectorFields<Creditor, Debtor, CoinType>, ) { this.$fullTypeName = composeSuiType( Collector.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Collector<${PhantomToTypeStr<Creditor>}, ${PhantomToTypeStr<Debtor>}, ${PhantomToTypeStr<CoinType>}>`; this.$typeArgs = typeArgs;

 this.requirement = fields.requirement;; this.repayment = fields.repayment; }

 static reified<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( Creditor: Creditor, Debtor: Debtor, CoinType: CoinType ): CollectorReified<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return { typeName: Collector.$typeName, fullTypeName: composeSuiType( Collector.$typeName, ...[extractType(Creditor), extractType(Debtor), extractType(CoinType)] ) as `${typeof PKG_V1}::sheet::Collector<${PhantomToTypeStr<ToPhantomTypeArgument<Creditor>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<Debtor>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>}>`, typeArgs: [ extractType(Creditor), extractType(Debtor), extractType(CoinType) ] as [PhantomToTypeStr<ToPhantomTypeArgument<Creditor>>, PhantomToTypeStr<ToPhantomTypeArgument<Debtor>>, PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>], isPhantom: Collector.$isPhantom, reifiedTypeArgs: [Creditor, Debtor, CoinType], fromFields: (fields: Record<string, any>) => Collector.fromFields( [Creditor, Debtor, CoinType], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Collector.fromFieldsWithTypes( [Creditor, Debtor, CoinType], item, ), fromBcs: (data: Uint8Array) => Collector.fromBcs( [Creditor, Debtor, CoinType], data, ), bcs: Collector.bcs, fromJSONField: (field: any) => Collector.fromJSONField( [Creditor, Debtor, CoinType], field, ), fromJSON: (json: Record<string, any>) => Collector.fromJSON( [Creditor, Debtor, CoinType], json, ), fromSuiParsedData: (content: SuiParsedData) => Collector.fromSuiParsedData( [Creditor, Debtor, CoinType], content, ), fromSuiObjectData: (content: SuiObjectData) => Collector.fromSuiObjectData( [Creditor, Debtor, CoinType], content, ), fetch: async (client: SuiClient, id: string) => Collector.fetch( client, [Creditor, Debtor, CoinType], id, ), new: ( fields: CollectorFields<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>>, ) => { return new Collector( [extractType(Creditor), extractType(Debtor), extractType(CoinType)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Collector.reified }

 static phantom<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( Creditor: Creditor, Debtor: Debtor, CoinType: CoinType ): PhantomReified<ToTypeStr<Collector<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>>>> { return phantom(Collector.reified( Creditor, Debtor, CoinType )); } static get p() { return Collector.phantom }

 static get bcs() { return bcs.struct("Collector", {

 requirement: bcs.u64(), repayment: Option.bcs(Repayment.bcs)

}) };

 static fromFields<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], fields: Record<string, any> ): Collector<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return Collector.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { requirement: decodeFromFields("u64", fields.requirement), repayment: decodeFromFields(Option.reified(Repayment.reified(typeArgs[0], typeArgs[1], typeArgs[2])), fields.repayment) } ) }

 static fromFieldsWithTypes<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], item: FieldsWithTypes ): Collector<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (!isCollector(item.type)) { throw new Error("not a Collector type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Collector.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { requirement: decodeFromFieldsWithTypes("u64", item.fields.requirement), repayment: decodeFromFieldsWithTypes(Option.reified(Repayment.reified(typeArgs[0], typeArgs[1], typeArgs[2])), item.fields.repayment) } ) }

 static fromBcs<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], data: Uint8Array ): Collector<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return Collector.fromFields( typeArgs, Collector.bcs.parse(data) ) }

 toJSONField() { return {

 requirement: this.requirement.toString(),repayment: fieldToJSON<Option<Repayment<Creditor, Debtor, CoinType>>>(`${Option.$typeName}<${Repayment.$typeName}<${this.$typeArgs[0]}, ${this.$typeArgs[1]}, ${this.$typeArgs[2]}>>`, this.repayment),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], field: any ): Collector<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return Collector.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { requirement: decodeFromJSONField("u64", field.requirement), repayment: decodeFromJSONField(Option.reified(Repayment.reified(typeArgs[0], typeArgs[1], typeArgs[2])), field.repayment) } ) }

 static fromJSON<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], json: Record<string, any> ): Collector<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (json.$typeName !== Collector.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Collector.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Collector.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], content: SuiParsedData ): Collector<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCollector(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Collector object`); } return Collector.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], data: SuiObjectData ): Collector<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isCollector(data.bcs.type)) { throw new Error(`object at is not a Collector object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 3) { throw new Error(`type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 3; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Collector.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Collector.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [Creditor, Debtor, CoinType], id: string ): Promise<Collector<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Collector object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isCollector(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Collector object`); }

 return Collector.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Creditor =============================== */

export function isCreditor(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::sheet::Creditor`; }

export interface CreditorFields { pos0: ToField<TypeName> }

export type CreditorReified = Reified< Creditor, CreditorFields >;

export class Creditor implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Creditor`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Creditor.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Creditor`; readonly $typeArgs: []; readonly $isPhantom = Creditor.$isPhantom;

 readonly pos0: ToField<TypeName>

 private constructor(typeArgs: [], fields: CreditorFields, ) { this.$fullTypeName = composeSuiType( Creditor.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Creditor`; this.$typeArgs = typeArgs;

 this.pos0 = fields.pos0; }

 static reified( ): CreditorReified { return { typeName: Creditor.$typeName, fullTypeName: composeSuiType( Creditor.$typeName, ...[] ) as `${typeof PKG_V1}::sheet::Creditor`, typeArgs: [ ] as [], isPhantom: Creditor.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Creditor.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Creditor.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Creditor.fromBcs( data, ), bcs: Creditor.bcs, fromJSONField: (field: any) => Creditor.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Creditor.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Creditor.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Creditor.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Creditor.fetch( client, id, ), new: ( fields: CreditorFields, ) => { return new Creditor( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Creditor.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Creditor>> { return phantom(Creditor.reified( )); } static get p() { return Creditor.phantom() }

 static get bcs() { return bcs.struct("Creditor", {

 pos0: TypeName.bcs

}) };

 static fromFields( fields: Record<string, any> ): Creditor { return Creditor.reified( ).new( { pos0: decodeFromFields(TypeName.reified(), fields.pos0) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Creditor { if (!isCreditor(item.type)) { throw new Error("not a Creditor type");

 }

 return Creditor.reified( ).new( { pos0: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.pos0) } ) }

 static fromBcs( data: Uint8Array ): Creditor { return Creditor.fromFields( Creditor.bcs.parse(data) ) }

 toJSONField() { return {

 pos0: this.pos0.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Creditor { return Creditor.reified( ).new( { pos0: decodeFromJSONField(TypeName.reified(), field.pos0) } ) }

 static fromJSON( json: Record<string, any> ): Creditor { if (json.$typeName !== Creditor.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Creditor.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Creditor { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCreditor(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Creditor object`); } return Creditor.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Creditor { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isCreditor(data.bcs.type)) { throw new Error(`object at is not a Creditor object`); }

 return Creditor.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Creditor.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Creditor> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Creditor object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isCreditor(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Creditor object`); }

 return Creditor.fromSuiObjectData( res.data ); }

 }

/* ============================== Debtor =============================== */

export function isDebtor(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::sheet::Debtor`; }

export interface DebtorFields { pos0: ToField<TypeName> }

export type DebtorReified = Reified< Debtor, DebtorFields >;

export class Debtor implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Debtor`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Debtor.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Debtor`; readonly $typeArgs: []; readonly $isPhantom = Debtor.$isPhantom;

 readonly pos0: ToField<TypeName>

 private constructor(typeArgs: [], fields: DebtorFields, ) { this.$fullTypeName = composeSuiType( Debtor.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Debtor`; this.$typeArgs = typeArgs;

 this.pos0 = fields.pos0; }

 static reified( ): DebtorReified { return { typeName: Debtor.$typeName, fullTypeName: composeSuiType( Debtor.$typeName, ...[] ) as `${typeof PKG_V1}::sheet::Debtor`, typeArgs: [ ] as [], isPhantom: Debtor.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Debtor.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Debtor.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Debtor.fromBcs( data, ), bcs: Debtor.bcs, fromJSONField: (field: any) => Debtor.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Debtor.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Debtor.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Debtor.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Debtor.fetch( client, id, ), new: ( fields: DebtorFields, ) => { return new Debtor( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Debtor.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Debtor>> { return phantom(Debtor.reified( )); } static get p() { return Debtor.phantom() }

 static get bcs() { return bcs.struct("Debtor", {

 pos0: TypeName.bcs

}) };

 static fromFields( fields: Record<string, any> ): Debtor { return Debtor.reified( ).new( { pos0: decodeFromFields(TypeName.reified(), fields.pos0) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Debtor { if (!isDebtor(item.type)) { throw new Error("not a Debtor type");

 }

 return Debtor.reified( ).new( { pos0: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.pos0) } ) }

 static fromBcs( data: Uint8Array ): Debtor { return Debtor.fromFields( Debtor.bcs.parse(data) ) }

 toJSONField() { return {

 pos0: this.pos0.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Debtor { return Debtor.reified( ).new( { pos0: decodeFromJSONField(TypeName.reified(), field.pos0) } ) }

 static fromJSON( json: Record<string, any> ): Debtor { if (json.$typeName !== Debtor.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Debtor.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Debtor { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDebtor(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Debtor object`); } return Debtor.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Debtor { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDebtor(data.bcs.type)) { throw new Error(`object at is not a Debtor object`); }

 return Debtor.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Debtor.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Debtor> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Debtor object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDebtor(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Debtor object`); }

 return Debtor.fromSuiObjectData( res.data ); }

 }

/* ============================== Credit =============================== */

export function isCredit(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::sheet::Credit` + '<'); }

export interface CreditFields<CoinType extends PhantomTypeArgument> { pos0: ToField<"u64"> }

export type CreditReified<CoinType extends PhantomTypeArgument> = Reified< Credit<CoinType>, CreditFields<CoinType> >;

export class Credit<CoinType extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Credit`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Credit.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Credit<${PhantomToTypeStr<CoinType>}>`; readonly $typeArgs: [PhantomToTypeStr<CoinType>]; readonly $isPhantom = Credit.$isPhantom;

 readonly pos0: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<CoinType>], fields: CreditFields<CoinType>, ) { this.$fullTypeName = composeSuiType( Credit.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Credit<${PhantomToTypeStr<CoinType>}>`; this.$typeArgs = typeArgs;

 this.pos0 = fields.pos0; }

 static reified<CoinType extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType ): CreditReified<ToPhantomTypeArgument<CoinType>> { return { typeName: Credit.$typeName, fullTypeName: composeSuiType( Credit.$typeName, ...[extractType(CoinType)] ) as `${typeof PKG_V1}::sheet::Credit<${PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>}>`, typeArgs: [ extractType(CoinType) ] as [PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>], isPhantom: Credit.$isPhantom, reifiedTypeArgs: [CoinType], fromFields: (fields: Record<string, any>) => Credit.fromFields( CoinType, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Credit.fromFieldsWithTypes( CoinType, item, ), fromBcs: (data: Uint8Array) => Credit.fromBcs( CoinType, data, ), bcs: Credit.bcs, fromJSONField: (field: any) => Credit.fromJSONField( CoinType, field, ), fromJSON: (json: Record<string, any>) => Credit.fromJSON( CoinType, json, ), fromSuiParsedData: (content: SuiParsedData) => Credit.fromSuiParsedData( CoinType, content, ), fromSuiObjectData: (content: SuiObjectData) => Credit.fromSuiObjectData( CoinType, content, ), fetch: async (client: SuiClient, id: string) => Credit.fetch( client, CoinType, id, ), new: ( fields: CreditFields<ToPhantomTypeArgument<CoinType>>, ) => { return new Credit( [extractType(CoinType)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Credit.reified }

 static phantom<CoinType extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType ): PhantomReified<ToTypeStr<Credit<ToPhantomTypeArgument<CoinType>>>> { return phantom(Credit.reified( CoinType )); } static get p() { return Credit.phantom }

 static get bcs() { return bcs.struct("Credit", {

 pos0: bcs.u64()

}) };

 static fromFields<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, fields: Record<string, any> ): Credit<ToPhantomTypeArgument<CoinType>> { return Credit.reified( typeArg, ).new( { pos0: decodeFromFields("u64", fields.pos0) } ) }

 static fromFieldsWithTypes<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, item: FieldsWithTypes ): Credit<ToPhantomTypeArgument<CoinType>> { if (!isCredit(item.type)) { throw new Error("not a Credit type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Credit.reified( typeArg, ).new( { pos0: decodeFromFieldsWithTypes("u64", item.fields.pos0) } ) }

 static fromBcs<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, data: Uint8Array ): Credit<ToPhantomTypeArgument<CoinType>> { return Credit.fromFields( typeArg, Credit.bcs.parse(data) ) }

 toJSONField() { return {

 pos0: this.pos0.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, field: any ): Credit<ToPhantomTypeArgument<CoinType>> { return Credit.reified( typeArg, ).new( { pos0: decodeFromJSONField("u64", field.pos0) } ) }

 static fromJSON<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, json: Record<string, any> ): Credit<ToPhantomTypeArgument<CoinType>> { if (json.$typeName !== Credit.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Credit.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Credit.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, content: SuiParsedData ): Credit<ToPhantomTypeArgument<CoinType>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCredit(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Credit object`); } return Credit.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, data: SuiObjectData ): Credit<ToPhantomTypeArgument<CoinType>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isCredit(data.bcs.type)) { throw new Error(`object at is not a Credit object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Credit.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Credit.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<CoinType extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: CoinType, id: string ): Promise<Credit<ToPhantomTypeArgument<CoinType>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Credit object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isCredit(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Credit object`); }

 return Credit.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== Debt =============================== */

export function isDebt(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::sheet::Debt` + '<'); }

export interface DebtFields<CoinType extends PhantomTypeArgument> { pos0: ToField<"u64"> }

export type DebtReified<CoinType extends PhantomTypeArgument> = Reified< Debt<CoinType>, DebtFields<CoinType> >;

export class Debt<CoinType extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Debt`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Debt.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Debt<${PhantomToTypeStr<CoinType>}>`; readonly $typeArgs: [PhantomToTypeStr<CoinType>]; readonly $isPhantom = Debt.$isPhantom;

 readonly pos0: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<CoinType>], fields: DebtFields<CoinType>, ) { this.$fullTypeName = composeSuiType( Debt.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Debt<${PhantomToTypeStr<CoinType>}>`; this.$typeArgs = typeArgs;

 this.pos0 = fields.pos0; }

 static reified<CoinType extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType ): DebtReified<ToPhantomTypeArgument<CoinType>> { return { typeName: Debt.$typeName, fullTypeName: composeSuiType( Debt.$typeName, ...[extractType(CoinType)] ) as `${typeof PKG_V1}::sheet::Debt<${PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>}>`, typeArgs: [ extractType(CoinType) ] as [PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>], isPhantom: Debt.$isPhantom, reifiedTypeArgs: [CoinType], fromFields: (fields: Record<string, any>) => Debt.fromFields( CoinType, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Debt.fromFieldsWithTypes( CoinType, item, ), fromBcs: (data: Uint8Array) => Debt.fromBcs( CoinType, data, ), bcs: Debt.bcs, fromJSONField: (field: any) => Debt.fromJSONField( CoinType, field, ), fromJSON: (json: Record<string, any>) => Debt.fromJSON( CoinType, json, ), fromSuiParsedData: (content: SuiParsedData) => Debt.fromSuiParsedData( CoinType, content, ), fromSuiObjectData: (content: SuiObjectData) => Debt.fromSuiObjectData( CoinType, content, ), fetch: async (client: SuiClient, id: string) => Debt.fetch( client, CoinType, id, ), new: ( fields: DebtFields<ToPhantomTypeArgument<CoinType>>, ) => { return new Debt( [extractType(CoinType)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Debt.reified }

 static phantom<CoinType extends PhantomReified<PhantomTypeArgument>>( CoinType: CoinType ): PhantomReified<ToTypeStr<Debt<ToPhantomTypeArgument<CoinType>>>> { return phantom(Debt.reified( CoinType )); } static get p() { return Debt.phantom }

 static get bcs() { return bcs.struct("Debt", {

 pos0: bcs.u64()

}) };

 static fromFields<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, fields: Record<string, any> ): Debt<ToPhantomTypeArgument<CoinType>> { return Debt.reified( typeArg, ).new( { pos0: decodeFromFields("u64", fields.pos0) } ) }

 static fromFieldsWithTypes<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, item: FieldsWithTypes ): Debt<ToPhantomTypeArgument<CoinType>> { if (!isDebt(item.type)) { throw new Error("not a Debt type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Debt.reified( typeArg, ).new( { pos0: decodeFromFieldsWithTypes("u64", item.fields.pos0) } ) }

 static fromBcs<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, data: Uint8Array ): Debt<ToPhantomTypeArgument<CoinType>> { return Debt.fromFields( typeArg, Debt.bcs.parse(data) ) }

 toJSONField() { return {

 pos0: this.pos0.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, field: any ): Debt<ToPhantomTypeArgument<CoinType>> { return Debt.reified( typeArg, ).new( { pos0: decodeFromJSONField("u64", field.pos0) } ) }

 static fromJSON<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, json: Record<string, any> ): Debt<ToPhantomTypeArgument<CoinType>> { if (json.$typeName !== Debt.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Debt.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Debt.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, content: SuiParsedData ): Debt<ToPhantomTypeArgument<CoinType>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDebt(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Debt object`); } return Debt.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<CoinType extends PhantomReified<PhantomTypeArgument>>( typeArg: CoinType, data: SuiObjectData ): Debt<ToPhantomTypeArgument<CoinType>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDebt(data.bcs.type)) { throw new Error(`object at is not a Debt object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Debt.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Debt.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<CoinType extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: CoinType, id: string ): Promise<Debt<ToPhantomTypeArgument<CoinType>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Debt object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDebt(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Debt object`); }

 return Debt.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== Loan =============================== */

export function isLoan(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::sheet::Loan` + '<'); }

export interface LoanFields<Creditor extends PhantomTypeArgument, Debtor extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> { balance: ToField<Balance<CoinType>>; credit: ToField<Option<Credit<CoinType>>>; debt: ToField<Option<Debt<CoinType>>> }

export type LoanReified<Creditor extends PhantomTypeArgument, Debtor extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> = Reified< Loan<Creditor, Debtor, CoinType>, LoanFields<Creditor, Debtor, CoinType> >;

export class Loan<Creditor extends PhantomTypeArgument, Debtor extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Loan`; static readonly $numTypeParams = 3; static readonly $isPhantom = [true,true,true,] as const;

 readonly $typeName = Loan.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Loan<${PhantomToTypeStr<Creditor>}, ${PhantomToTypeStr<Debtor>}, ${PhantomToTypeStr<CoinType>}>`; readonly $typeArgs: [PhantomToTypeStr<Creditor>, PhantomToTypeStr<Debtor>, PhantomToTypeStr<CoinType>]; readonly $isPhantom = Loan.$isPhantom;

 readonly balance: ToField<Balance<CoinType>>; readonly credit: ToField<Option<Credit<CoinType>>>; readonly debt: ToField<Option<Debt<CoinType>>>

 private constructor(typeArgs: [PhantomToTypeStr<Creditor>, PhantomToTypeStr<Debtor>, PhantomToTypeStr<CoinType>], fields: LoanFields<Creditor, Debtor, CoinType>, ) { this.$fullTypeName = composeSuiType( Loan.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Loan<${PhantomToTypeStr<Creditor>}, ${PhantomToTypeStr<Debtor>}, ${PhantomToTypeStr<CoinType>}>`; this.$typeArgs = typeArgs;

 this.balance = fields.balance;; this.credit = fields.credit;; this.debt = fields.debt; }

 static reified<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( Creditor: Creditor, Debtor: Debtor, CoinType: CoinType ): LoanReified<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return { typeName: Loan.$typeName, fullTypeName: composeSuiType( Loan.$typeName, ...[extractType(Creditor), extractType(Debtor), extractType(CoinType)] ) as `${typeof PKG_V1}::sheet::Loan<${PhantomToTypeStr<ToPhantomTypeArgument<Creditor>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<Debtor>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>}>`, typeArgs: [ extractType(Creditor), extractType(Debtor), extractType(CoinType) ] as [PhantomToTypeStr<ToPhantomTypeArgument<Creditor>>, PhantomToTypeStr<ToPhantomTypeArgument<Debtor>>, PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>], isPhantom: Loan.$isPhantom, reifiedTypeArgs: [Creditor, Debtor, CoinType], fromFields: (fields: Record<string, any>) => Loan.fromFields( [Creditor, Debtor, CoinType], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Loan.fromFieldsWithTypes( [Creditor, Debtor, CoinType], item, ), fromBcs: (data: Uint8Array) => Loan.fromBcs( [Creditor, Debtor, CoinType], data, ), bcs: Loan.bcs, fromJSONField: (field: any) => Loan.fromJSONField( [Creditor, Debtor, CoinType], field, ), fromJSON: (json: Record<string, any>) => Loan.fromJSON( [Creditor, Debtor, CoinType], json, ), fromSuiParsedData: (content: SuiParsedData) => Loan.fromSuiParsedData( [Creditor, Debtor, CoinType], content, ), fromSuiObjectData: (content: SuiObjectData) => Loan.fromSuiObjectData( [Creditor, Debtor, CoinType], content, ), fetch: async (client: SuiClient, id: string) => Loan.fetch( client, [Creditor, Debtor, CoinType], id, ), new: ( fields: LoanFields<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>>, ) => { return new Loan( [extractType(Creditor), extractType(Debtor), extractType(CoinType)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Loan.reified }

 static phantom<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( Creditor: Creditor, Debtor: Debtor, CoinType: CoinType ): PhantomReified<ToTypeStr<Loan<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>>>> { return phantom(Loan.reified( Creditor, Debtor, CoinType )); } static get p() { return Loan.phantom }

 static get bcs() { return bcs.struct("Loan", {

 balance: Balance.bcs, credit: Option.bcs(Credit.bcs), debt: Option.bcs(Debt.bcs)

}) };

 static fromFields<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], fields: Record<string, any> ): Loan<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return Loan.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { balance: decodeFromFields(Balance.reified(typeArgs[2]), fields.balance), credit: decodeFromFields(Option.reified(Credit.reified(typeArgs[2])), fields.credit), debt: decodeFromFields(Option.reified(Debt.reified(typeArgs[2])), fields.debt) } ) }

 static fromFieldsWithTypes<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], item: FieldsWithTypes ): Loan<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (!isLoan(item.type)) { throw new Error("not a Loan type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Loan.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { balance: decodeFromFieldsWithTypes(Balance.reified(typeArgs[2]), item.fields.balance), credit: decodeFromFieldsWithTypes(Option.reified(Credit.reified(typeArgs[2])), item.fields.credit), debt: decodeFromFieldsWithTypes(Option.reified(Debt.reified(typeArgs[2])), item.fields.debt) } ) }

 static fromBcs<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], data: Uint8Array ): Loan<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return Loan.fromFields( typeArgs, Loan.bcs.parse(data) ) }

 toJSONField() { return {

 balance: this.balance.toJSONField(),credit: fieldToJSON<Option<Credit<CoinType>>>(`${Option.$typeName}<${Credit.$typeName}<${this.$typeArgs[2]}>>`, this.credit),debt: fieldToJSON<Option<Debt<CoinType>>>(`${Option.$typeName}<${Debt.$typeName}<${this.$typeArgs[2]}>>`, this.debt),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], field: any ): Loan<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return Loan.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { balance: decodeFromJSONField(Balance.reified(typeArgs[2]), field.balance), credit: decodeFromJSONField(Option.reified(Credit.reified(typeArgs[2])), field.credit), debt: decodeFromJSONField(Option.reified(Debt.reified(typeArgs[2])), field.debt) } ) }

 static fromJSON<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], json: Record<string, any> ): Loan<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (json.$typeName !== Loan.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Loan.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Loan.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], content: SuiParsedData ): Loan<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isLoan(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Loan object`); } return Loan.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], data: SuiObjectData ): Loan<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isLoan(data.bcs.type)) { throw new Error(`object at is not a Loan object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 3) { throw new Error(`type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 3; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Loan.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Loan.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [Creditor, Debtor, CoinType], id: string ): Promise<Loan<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Loan object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isLoan(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Loan object`); }

 return Loan.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Repayment =============================== */

export function isRepayment(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::sheet::Repayment` + '<'); }

export interface RepaymentFields<Creditor extends PhantomTypeArgument, Debtor extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> { balance: ToField<Balance<CoinType>>; credit: ToField<Option<Credit<CoinType>>>; debt: ToField<Option<Debt<CoinType>>> }

export type RepaymentReified<Creditor extends PhantomTypeArgument, Debtor extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> = Reified< Repayment<Creditor, Debtor, CoinType>, RepaymentFields<Creditor, Debtor, CoinType> >;

export class Repayment<Creditor extends PhantomTypeArgument, Debtor extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Repayment`; static readonly $numTypeParams = 3; static readonly $isPhantom = [true,true,true,] as const;

 readonly $typeName = Repayment.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Repayment<${PhantomToTypeStr<Creditor>}, ${PhantomToTypeStr<Debtor>}, ${PhantomToTypeStr<CoinType>}>`; readonly $typeArgs: [PhantomToTypeStr<Creditor>, PhantomToTypeStr<Debtor>, PhantomToTypeStr<CoinType>]; readonly $isPhantom = Repayment.$isPhantom;

 readonly balance: ToField<Balance<CoinType>>; readonly credit: ToField<Option<Credit<CoinType>>>; readonly debt: ToField<Option<Debt<CoinType>>>

 private constructor(typeArgs: [PhantomToTypeStr<Creditor>, PhantomToTypeStr<Debtor>, PhantomToTypeStr<CoinType>], fields: RepaymentFields<Creditor, Debtor, CoinType>, ) { this.$fullTypeName = composeSuiType( Repayment.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Repayment<${PhantomToTypeStr<Creditor>}, ${PhantomToTypeStr<Debtor>}, ${PhantomToTypeStr<CoinType>}>`; this.$typeArgs = typeArgs;

 this.balance = fields.balance;; this.credit = fields.credit;; this.debt = fields.debt; }

 static reified<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( Creditor: Creditor, Debtor: Debtor, CoinType: CoinType ): RepaymentReified<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return { typeName: Repayment.$typeName, fullTypeName: composeSuiType( Repayment.$typeName, ...[extractType(Creditor), extractType(Debtor), extractType(CoinType)] ) as `${typeof PKG_V1}::sheet::Repayment<${PhantomToTypeStr<ToPhantomTypeArgument<Creditor>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<Debtor>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>}>`, typeArgs: [ extractType(Creditor), extractType(Debtor), extractType(CoinType) ] as [PhantomToTypeStr<ToPhantomTypeArgument<Creditor>>, PhantomToTypeStr<ToPhantomTypeArgument<Debtor>>, PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>], isPhantom: Repayment.$isPhantom, reifiedTypeArgs: [Creditor, Debtor, CoinType], fromFields: (fields: Record<string, any>) => Repayment.fromFields( [Creditor, Debtor, CoinType], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Repayment.fromFieldsWithTypes( [Creditor, Debtor, CoinType], item, ), fromBcs: (data: Uint8Array) => Repayment.fromBcs( [Creditor, Debtor, CoinType], data, ), bcs: Repayment.bcs, fromJSONField: (field: any) => Repayment.fromJSONField( [Creditor, Debtor, CoinType], field, ), fromJSON: (json: Record<string, any>) => Repayment.fromJSON( [Creditor, Debtor, CoinType], json, ), fromSuiParsedData: (content: SuiParsedData) => Repayment.fromSuiParsedData( [Creditor, Debtor, CoinType], content, ), fromSuiObjectData: (content: SuiObjectData) => Repayment.fromSuiObjectData( [Creditor, Debtor, CoinType], content, ), fetch: async (client: SuiClient, id: string) => Repayment.fetch( client, [Creditor, Debtor, CoinType], id, ), new: ( fields: RepaymentFields<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>>, ) => { return new Repayment( [extractType(Creditor), extractType(Debtor), extractType(CoinType)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Repayment.reified }

 static phantom<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( Creditor: Creditor, Debtor: Debtor, CoinType: CoinType ): PhantomReified<ToTypeStr<Repayment<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>>>> { return phantom(Repayment.reified( Creditor, Debtor, CoinType )); } static get p() { return Repayment.phantom }

 static get bcs() { return bcs.struct("Repayment", {

 balance: Balance.bcs, credit: Option.bcs(Credit.bcs), debt: Option.bcs(Debt.bcs)

}) };

 static fromFields<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], fields: Record<string, any> ): Repayment<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return Repayment.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { balance: decodeFromFields(Balance.reified(typeArgs[2]), fields.balance), credit: decodeFromFields(Option.reified(Credit.reified(typeArgs[2])), fields.credit), debt: decodeFromFields(Option.reified(Debt.reified(typeArgs[2])), fields.debt) } ) }

 static fromFieldsWithTypes<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], item: FieldsWithTypes ): Repayment<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (!isRepayment(item.type)) { throw new Error("not a Repayment type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Repayment.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { balance: decodeFromFieldsWithTypes(Balance.reified(typeArgs[2]), item.fields.balance), credit: decodeFromFieldsWithTypes(Option.reified(Credit.reified(typeArgs[2])), item.fields.credit), debt: decodeFromFieldsWithTypes(Option.reified(Debt.reified(typeArgs[2])), item.fields.debt) } ) }

 static fromBcs<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], data: Uint8Array ): Repayment<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return Repayment.fromFields( typeArgs, Repayment.bcs.parse(data) ) }

 toJSONField() { return {

 balance: this.balance.toJSONField(),credit: fieldToJSON<Option<Credit<CoinType>>>(`${Option.$typeName}<${Credit.$typeName}<${this.$typeArgs[2]}>>`, this.credit),debt: fieldToJSON<Option<Debt<CoinType>>>(`${Option.$typeName}<${Debt.$typeName}<${this.$typeArgs[2]}>>`, this.debt),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], field: any ): Repayment<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { return Repayment.reified( typeArgs[0], typeArgs[1], typeArgs[2], ).new( { balance: decodeFromJSONField(Balance.reified(typeArgs[2]), field.balance), credit: decodeFromJSONField(Option.reified(Credit.reified(typeArgs[2])), field.credit), debt: decodeFromJSONField(Option.reified(Debt.reified(typeArgs[2])), field.debt) } ) }

 static fromJSON<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], json: Record<string, any> ): Repayment<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (json.$typeName !== Repayment.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Repayment.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Repayment.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], content: SuiParsedData ): Repayment<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRepayment(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Repayment object`); } return Repayment.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Creditor, Debtor, CoinType], data: SuiObjectData ): Repayment<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRepayment(data.bcs.type)) { throw new Error(`object at is not a Repayment object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 3) { throw new Error(`type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 3; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Repayment.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Repayment.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<Creditor extends PhantomReified<PhantomTypeArgument>, Debtor extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [Creditor, Debtor, CoinType], id: string ): Promise<Repayment<ToPhantomTypeArgument<Creditor>, ToPhantomTypeArgument<Debtor>, ToPhantomTypeArgument<CoinType>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Repayment object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRepayment(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Repayment object`); }

 return Repayment.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Sheet =============================== */

export function isSheet(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::sheet::Sheet` + '<'); }

export interface SheetFields<Entity extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> { credits: ToField<VecMap<Debtor, Credit<CoinType>>>; debts: ToField<VecMap<Creditor, Debt<CoinType>>> }

export type SheetReified<Entity extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> = Reified< Sheet<Entity, CoinType>, SheetFields<Entity, CoinType> >;

export class Sheet<Entity extends PhantomTypeArgument, CoinType extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::sheet::Sheet`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = Sheet.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::sheet::Sheet<${PhantomToTypeStr<Entity>}, ${PhantomToTypeStr<CoinType>}>`; readonly $typeArgs: [PhantomToTypeStr<Entity>, PhantomToTypeStr<CoinType>]; readonly $isPhantom = Sheet.$isPhantom;

 readonly credits: ToField<VecMap<Debtor, Credit<CoinType>>>; readonly debts: ToField<VecMap<Creditor, Debt<CoinType>>>

 private constructor(typeArgs: [PhantomToTypeStr<Entity>, PhantomToTypeStr<CoinType>], fields: SheetFields<Entity, CoinType>, ) { this.$fullTypeName = composeSuiType( Sheet.$typeName, ...typeArgs ) as `${typeof PKG_V1}::sheet::Sheet<${PhantomToTypeStr<Entity>}, ${PhantomToTypeStr<CoinType>}>`; this.$typeArgs = typeArgs;

 this.credits = fields.credits;; this.debts = fields.debts; }

 static reified<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( Entity: Entity, CoinType: CoinType ): SheetReified<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>> { return { typeName: Sheet.$typeName, fullTypeName: composeSuiType( Sheet.$typeName, ...[extractType(Entity), extractType(CoinType)] ) as `${typeof PKG_V1}::sheet::Sheet<${PhantomToTypeStr<ToPhantomTypeArgument<Entity>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>}>`, typeArgs: [ extractType(Entity), extractType(CoinType) ] as [PhantomToTypeStr<ToPhantomTypeArgument<Entity>>, PhantomToTypeStr<ToPhantomTypeArgument<CoinType>>], isPhantom: Sheet.$isPhantom, reifiedTypeArgs: [Entity, CoinType], fromFields: (fields: Record<string, any>) => Sheet.fromFields( [Entity, CoinType], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Sheet.fromFieldsWithTypes( [Entity, CoinType], item, ), fromBcs: (data: Uint8Array) => Sheet.fromBcs( [Entity, CoinType], data, ), bcs: Sheet.bcs, fromJSONField: (field: any) => Sheet.fromJSONField( [Entity, CoinType], field, ), fromJSON: (json: Record<string, any>) => Sheet.fromJSON( [Entity, CoinType], json, ), fromSuiParsedData: (content: SuiParsedData) => Sheet.fromSuiParsedData( [Entity, CoinType], content, ), fromSuiObjectData: (content: SuiObjectData) => Sheet.fromSuiObjectData( [Entity, CoinType], content, ), fetch: async (client: SuiClient, id: string) => Sheet.fetch( client, [Entity, CoinType], id, ), new: ( fields: SheetFields<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>>, ) => { return new Sheet( [extractType(Entity), extractType(CoinType)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Sheet.reified }

 static phantom<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( Entity: Entity, CoinType: CoinType ): PhantomReified<ToTypeStr<Sheet<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>>>> { return phantom(Sheet.reified( Entity, CoinType )); } static get p() { return Sheet.phantom }

 static get bcs() { return bcs.struct("Sheet", {

 credits: VecMap.bcs(Debtor.bcs, Credit.bcs), debts: VecMap.bcs(Creditor.bcs, Debt.bcs)

}) };

 static fromFields<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Entity, CoinType], fields: Record<string, any> ): Sheet<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>> { return Sheet.reified( typeArgs[0], typeArgs[1], ).new( { credits: decodeFromFields(VecMap.reified(Debtor.reified(), Credit.reified(typeArgs[1])), fields.credits), debts: decodeFromFields(VecMap.reified(Creditor.reified(), Debt.reified(typeArgs[1])), fields.debts) } ) }

 static fromFieldsWithTypes<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Entity, CoinType], item: FieldsWithTypes ): Sheet<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>> { if (!isSheet(item.type)) { throw new Error("not a Sheet type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Sheet.reified( typeArgs[0], typeArgs[1], ).new( { credits: decodeFromFieldsWithTypes(VecMap.reified(Debtor.reified(), Credit.reified(typeArgs[1])), item.fields.credits), debts: decodeFromFieldsWithTypes(VecMap.reified(Creditor.reified(), Debt.reified(typeArgs[1])), item.fields.debts) } ) }

 static fromBcs<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Entity, CoinType], data: Uint8Array ): Sheet<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>> { return Sheet.fromFields( typeArgs, Sheet.bcs.parse(data) ) }

 toJSONField() { return {

 credits: this.credits.toJSONField(),debts: this.debts.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Entity, CoinType], field: any ): Sheet<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>> { return Sheet.reified( typeArgs[0], typeArgs[1], ).new( { credits: decodeFromJSONField(VecMap.reified(Debtor.reified(), Credit.reified(typeArgs[1])), field.credits), debts: decodeFromJSONField(VecMap.reified(Creditor.reified(), Debt.reified(typeArgs[1])), field.debts) } ) }

 static fromJSON<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Entity, CoinType], json: Record<string, any> ): Sheet<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>> { if (json.$typeName !== Sheet.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Sheet.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Sheet.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Entity, CoinType], content: SuiParsedData ): Sheet<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isSheet(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Sheet object`); } return Sheet.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Entity, CoinType], data: SuiObjectData ): Sheet<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isSheet(data.bcs.type)) { throw new Error(`object at is not a Sheet object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Sheet.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Sheet.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<Entity extends PhantomReified<PhantomTypeArgument>, CoinType extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [Entity, CoinType], id: string ): Promise<Sheet<ToPhantomTypeArgument<Entity>, ToPhantomTypeArgument<CoinType>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Sheet object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isSheet(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Sheet object`); }

 return Sheet.fromSuiObjectData( typeArgs, res.data ); }

 }
