import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== Credit =============================== */

export function isCredit(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::liability::Credit` + '<'); }

export interface CreditFields<T extends PhantomTypeArgument> { value: ToField<"u64"> }

export type CreditReified<T extends PhantomTypeArgument> = Reified< Credit<T>, CreditFields<T> >;

export class Credit<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::liability::Credit`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Credit.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::liability::Credit<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = Credit.$isPhantom;

 readonly value: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: CreditFields<T>, ) { this.$fullTypeName = composeSuiType( Credit.$typeName, ...typeArgs ) as `${typeof PKG_V1}::liability::Credit<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.value = fields.value; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): CreditReified<ToPhantomTypeArgument<T>> { const reifiedBcs = Credit.bcs; return { typeName: Credit.$typeName, fullTypeName: composeSuiType( Credit.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::liability::Credit<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: Credit.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => Credit.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Credit.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => Credit.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Credit.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => Credit.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => Credit.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => Credit.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => Credit.fetch( client, T, id, ), new: ( fields: CreditFields<ToPhantomTypeArgument<T>>, ) => { return new Credit( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Credit.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<Credit<ToPhantomTypeArgument<T>>>> { return phantom(Credit.reified( T )); } static get p() { return Credit.phantom }

 private static instantiateBcs() { return bcs.struct("Credit", {

 value: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof Credit.instantiateBcs> | null = null;

 static get bcs() { if (!Credit.cachedBcs) { Credit.cachedBcs = Credit.instantiateBcs() } return Credit.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): Credit<ToPhantomTypeArgument<T>> { return Credit.reified( typeArg, ).new( { value: decodeFromFields("u64", fields.value) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): Credit<ToPhantomTypeArgument<T>> { if (!isCredit(item.type)) { throw new Error("not a Credit type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Credit.reified( typeArg, ).new( { value: decodeFromFieldsWithTypes("u64", item.fields.value) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): Credit<ToPhantomTypeArgument<T>> { return Credit.fromFields( typeArg, Credit.bcs.parse(data) ) }

 toJSONField() { return {

 value: this.value.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): Credit<ToPhantomTypeArgument<T>> { return Credit.reified( typeArg, ).new( { value: decodeFromJSONField("u64", field.value) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): Credit<ToPhantomTypeArgument<T>> { if (json.$typeName !== Credit.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Credit.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Credit.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): Credit<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCredit(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Credit object`); } return Credit.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): Credit<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isCredit(data.bcs.type)) { throw new Error(`object at is not a Credit object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Credit.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Credit.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<Credit<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Credit object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isCredit(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Credit object`); }

 return Credit.fromSuiObjectData( typeArg, res.data ); }

 }

/* ============================== Debt =============================== */

export function isDebt(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::liability::Debt` + '<'); }

export interface DebtFields<T extends PhantomTypeArgument> { value: ToField<"u64"> }

export type DebtReified<T extends PhantomTypeArgument> = Reified< Debt<T>, DebtFields<T> >;

export class Debt<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::liability::Debt`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Debt.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::liability::Debt<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = Debt.$isPhantom;

 readonly value: ToField<"u64">

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: DebtFields<T>, ) { this.$fullTypeName = composeSuiType( Debt.$typeName, ...typeArgs ) as `${typeof PKG_V1}::liability::Debt<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.value = fields.value; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): DebtReified<ToPhantomTypeArgument<T>> { const reifiedBcs = Debt.bcs; return { typeName: Debt.$typeName, fullTypeName: composeSuiType( Debt.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::liability::Debt<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: Debt.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => Debt.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Debt.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => Debt.fromFields( T, reifiedBcs.parse(data) ), bcs: reifiedBcs, fromJSONField: (field: any) => Debt.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => Debt.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => Debt.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => Debt.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => Debt.fetch( client, T, id, ), new: ( fields: DebtFields<ToPhantomTypeArgument<T>>, ) => { return new Debt( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Debt.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<Debt<ToPhantomTypeArgument<T>>>> { return phantom(Debt.reified( T )); } static get p() { return Debt.phantom }

 private static instantiateBcs() { return bcs.struct("Debt", {

 value: bcs.u64()

}) };

 private static cachedBcs: ReturnType<typeof Debt.instantiateBcs> | null = null;

 static get bcs() { if (!Debt.cachedBcs) { Debt.cachedBcs = Debt.instantiateBcs() } return Debt.cachedBcs };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): Debt<ToPhantomTypeArgument<T>> { return Debt.reified( typeArg, ).new( { value: decodeFromFields("u64", fields.value) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): Debt<ToPhantomTypeArgument<T>> { if (!isDebt(item.type)) { throw new Error("not a Debt type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Debt.reified( typeArg, ).new( { value: decodeFromFieldsWithTypes("u64", item.fields.value) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): Debt<ToPhantomTypeArgument<T>> { return Debt.fromFields( typeArg, Debt.bcs.parse(data) ) }

 toJSONField() { return {

 value: this.value.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): Debt<ToPhantomTypeArgument<T>> { return Debt.reified( typeArg, ).new( { value: decodeFromJSONField("u64", field.value) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): Debt<ToPhantomTypeArgument<T>> { if (json.$typeName !== Debt.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Debt.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Debt.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): Debt<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDebt(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Debt object`); } return Debt.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): Debt<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDebt(data.bcs.type)) { throw new Error(`object at is not a Debt object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Debt.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Debt.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<Debt<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Debt object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDebt(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Debt object`); }

 return Debt.fromSuiObjectData( typeArg, res.data ); }

 }
