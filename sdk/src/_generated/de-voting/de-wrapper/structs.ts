import * as reified from "../../_framework/reified";
import {String} from "../../_dependencies/source/0x1/ascii/structs";
import {ID, UID} from "../../_dependencies/source/0x2/object/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, fieldToJSON, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {Vector} from "../../_framework/vector";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";
import { DeToken } from "@/_generated/detoken/de-token/structs";

/* ============================== DE_WRAPPER =============================== */

export function isDE_WRAPPER(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_wrapper::DE_WRAPPER`; }

export interface DE_WRAPPERFields { dummyField: ToField<"bool"> }

export type DE_WRAPPERReified = Reified< DE_WRAPPER, DE_WRAPPERFields >;

export class DE_WRAPPER implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_wrapper::DE_WRAPPER`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = DE_WRAPPER.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_wrapper::DE_WRAPPER`; readonly $typeArgs: []; readonly $isPhantom = DE_WRAPPER.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: DE_WRAPPERFields, ) { this.$fullTypeName = composeSuiType( DE_WRAPPER.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_wrapper::DE_WRAPPER`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): DE_WRAPPERReified { return { typeName: DE_WRAPPER.$typeName, fullTypeName: composeSuiType( DE_WRAPPER.$typeName, ...[] ) as `${typeof PKG_V1}::de_wrapper::DE_WRAPPER`, typeArgs: [ ] as [], isPhantom: DE_WRAPPER.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => DE_WRAPPER.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DE_WRAPPER.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => DE_WRAPPER.fromBcs( data, ), bcs: DE_WRAPPER.bcs, fromJSONField: (field: any) => DE_WRAPPER.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => DE_WRAPPER.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => DE_WRAPPER.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => DE_WRAPPER.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => DE_WRAPPER.fetch( client, id, ), new: ( fields: DE_WRAPPERFields, ) => { return new DE_WRAPPER( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return DE_WRAPPER.reified() }

 static phantom( ): PhantomReified<ToTypeStr<DE_WRAPPER>> { return phantom(DE_WRAPPER.reified( )); } static get p() { return DE_WRAPPER.phantom() }

 static get bcs() { return bcs.struct("DE_WRAPPER", {

 dummy_field: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): DE_WRAPPER { return DE_WRAPPER.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): DE_WRAPPER { if (!isDE_WRAPPER(item.type)) { throw new Error("not a DE_WRAPPER type");

 }

 return DE_WRAPPER.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): DE_WRAPPER { return DE_WRAPPER.fromFields( DE_WRAPPER.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): DE_WRAPPER { return DE_WRAPPER.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): DE_WRAPPER { if (json.$typeName !== DE_WRAPPER.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return DE_WRAPPER.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): DE_WRAPPER { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDE_WRAPPER(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DE_WRAPPER object`); } return DE_WRAPPER.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): DE_WRAPPER { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDE_WRAPPER(data.bcs.type)) { throw new Error(`object at is not a DE_WRAPPER object`); }

 return DE_WRAPPER.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DE_WRAPPER.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<DE_WRAPPER> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DE_WRAPPER object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDE_WRAPPER(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DE_WRAPPER object`); }

 return DE_WRAPPER.fromSuiObjectData( res.data ); }

 }

/* ============================== DeWrapper =============================== */

export function isDeWrapper(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_wrapper::DeWrapper` + '<'); }

export interface DeWrapperFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { id: ToField<UID>; tokens: ToField<Vector<DeToken<T, P>>> }

export type DeWrapperReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< DeWrapper<T, P>, DeWrapperFields<T, P> >;

export class DeWrapper<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_wrapper::DeWrapper`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = DeWrapper.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_wrapper::DeWrapper<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = DeWrapper.$isPhantom;

 readonly id: ToField<UID>; readonly tokens: ToField<Vector<DeToken<T, P>>>

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: DeWrapperFields<T, P>, ) { this.$fullTypeName = composeSuiType( DeWrapper.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_wrapper::DeWrapper<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.tokens = fields.tokens; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): DeWrapperReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: DeWrapper.$typeName, fullTypeName: composeSuiType( DeWrapper.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::de_wrapper::DeWrapper<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: DeWrapper.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => DeWrapper.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DeWrapper.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => DeWrapper.fromBcs( [T, P], data, ), bcs: DeWrapper.bcs, fromJSONField: (field: any) => DeWrapper.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => DeWrapper.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => DeWrapper.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => DeWrapper.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => DeWrapper.fetch( client, [T, P], id, ), new: ( fields: DeWrapperFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new DeWrapper( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DeWrapper.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<DeWrapper<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(DeWrapper.reified( T, P )); } static get p() { return DeWrapper.phantom }

 static get bcs() { return bcs.struct("DeWrapper", {

 id: UID.bcs, tokens: bcs.vector(DeToken.bcs)

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): DeWrapper<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return DeWrapper.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFields(UID.reified(), fields.id), tokens: decodeFromFields(reified.vector(DeToken.reified(typeArgs[0], typeArgs[1])), fields.tokens) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): DeWrapper<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isDeWrapper(item.type)) { throw new Error("not a DeWrapper type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return DeWrapper.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), tokens: decodeFromFieldsWithTypes(reified.vector(DeToken.reified(typeArgs[0], typeArgs[1])), item.fields.tokens) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): DeWrapper<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return DeWrapper.fromFields( typeArgs, DeWrapper.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,tokens: fieldToJSON<Vector<DeToken<T, P>>>(`vector<${DeToken.$typeName}<${this.$typeArgs[0]}, ${this.$typeArgs[1]}>>`, this.tokens),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): DeWrapper<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return DeWrapper.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromJSONField(UID.reified(), field.id), tokens: decodeFromJSONField(reified.vector(DeToken.reified(typeArgs[0], typeArgs[1])), field.tokens) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): DeWrapper<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== DeWrapper.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DeWrapper.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return DeWrapper.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): DeWrapper<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDeWrapper(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DeWrapper object`); } return DeWrapper.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): DeWrapper<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDeWrapper(data.bcs.type)) { throw new Error(`object at is not a DeWrapper object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return DeWrapper.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DeWrapper.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<DeWrapper<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DeWrapper object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDeWrapper(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DeWrapper object`); }

 return DeWrapper.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== DeWrapperCreation =============================== */

export function isDeWrapperCreation(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_wrapper::DeWrapperCreation` + '<'); }

export interface DeWrapperCreationFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { wrapperId: ToField<ID>; owner: ToField<"address"> }

export type DeWrapperCreationReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< DeWrapperCreation<T, P>, DeWrapperCreationFields<T, P> >;

export class DeWrapperCreation<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_wrapper::DeWrapperCreation`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = DeWrapperCreation.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_wrapper::DeWrapperCreation<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = DeWrapperCreation.$isPhantom;

 readonly wrapperId: ToField<ID>; readonly owner: ToField<"address">

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: DeWrapperCreationFields<T, P>, ) { this.$fullTypeName = composeSuiType( DeWrapperCreation.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_wrapper::DeWrapperCreation<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.wrapperId = fields.wrapperId;; this.owner = fields.owner; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): DeWrapperCreationReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: DeWrapperCreation.$typeName, fullTypeName: composeSuiType( DeWrapperCreation.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::de_wrapper::DeWrapperCreation<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: DeWrapperCreation.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => DeWrapperCreation.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DeWrapperCreation.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => DeWrapperCreation.fromBcs( [T, P], data, ), bcs: DeWrapperCreation.bcs, fromJSONField: (field: any) => DeWrapperCreation.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => DeWrapperCreation.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => DeWrapperCreation.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => DeWrapperCreation.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => DeWrapperCreation.fetch( client, [T, P], id, ), new: ( fields: DeWrapperCreationFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new DeWrapperCreation( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DeWrapperCreation.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<DeWrapperCreation<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(DeWrapperCreation.reified( T, P )); } static get p() { return DeWrapperCreation.phantom }

 static get bcs() { return bcs.struct("DeWrapperCreation", {

 wrapper_id: ID.bcs, owner: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), })

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): DeWrapperCreation<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return DeWrapperCreation.reified( typeArgs[0], typeArgs[1], ).new( { wrapperId: decodeFromFields(ID.reified(), fields.wrapper_id), owner: decodeFromFields("address", fields.owner) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): DeWrapperCreation<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isDeWrapperCreation(item.type)) { throw new Error("not a DeWrapperCreation type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return DeWrapperCreation.reified( typeArgs[0], typeArgs[1], ).new( { wrapperId: decodeFromFieldsWithTypes(ID.reified(), item.fields.wrapper_id), owner: decodeFromFieldsWithTypes("address", item.fields.owner) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): DeWrapperCreation<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return DeWrapperCreation.fromFields( typeArgs, DeWrapperCreation.bcs.parse(data) ) }

 toJSONField() { return {

 wrapperId: this.wrapperId,owner: this.owner,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): DeWrapperCreation<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return DeWrapperCreation.reified( typeArgs[0], typeArgs[1], ).new( { wrapperId: decodeFromJSONField(ID.reified(), field.wrapperId), owner: decodeFromJSONField("address", field.owner) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): DeWrapperCreation<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== DeWrapperCreation.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DeWrapperCreation.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return DeWrapperCreation.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): DeWrapperCreation<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDeWrapperCreation(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DeWrapperCreation object`); } return DeWrapperCreation.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): DeWrapperCreation<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDeWrapperCreation(data.bcs.type)) { throw new Error(`object at is not a DeWrapperCreation object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return DeWrapperCreation.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DeWrapperCreation.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<DeWrapperCreation<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DeWrapperCreation object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDeWrapperCreation(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DeWrapperCreation object`); }

 return DeWrapperCreation.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== New =============================== */

export function isNew(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_wrapper::New` + '<'); }

export interface NewFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { deWrapperId: ToField<ID> }

export type NewReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< New<T, P>, NewFields<T, P> >;

export class New<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_wrapper::New`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = New.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_wrapper::New<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = New.$isPhantom;

 readonly deWrapperId: ToField<ID>

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: NewFields<T, P>, ) { this.$fullTypeName = composeSuiType( New.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_wrapper::New<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.deWrapperId = fields.deWrapperId; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): NewReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: New.$typeName, fullTypeName: composeSuiType( New.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::de_wrapper::New<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: New.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => New.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => New.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => New.fromBcs( [T, P], data, ), bcs: New.bcs, fromJSONField: (field: any) => New.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => New.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => New.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => New.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => New.fetch( client, [T, P], id, ), new: ( fields: NewFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new New( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return New.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<New<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(New.reified( T, P )); } static get p() { return New.phantom }

 static get bcs() { return bcs.struct("New", {

 de_wrapper_id: ID.bcs

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): New<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return New.reified( typeArgs[0], typeArgs[1], ).new( { deWrapperId: decodeFromFields(ID.reified(), fields.de_wrapper_id) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): New<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isNew(item.type)) { throw new Error("not a New type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return New.reified( typeArgs[0], typeArgs[1], ).new( { deWrapperId: decodeFromFieldsWithTypes(ID.reified(), item.fields.de_wrapper_id) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): New<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return New.fromFields( typeArgs, New.bcs.parse(data) ) }

 toJSONField() { return {

 deWrapperId: this.deWrapperId,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): New<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return New.reified( typeArgs[0], typeArgs[1], ).new( { deWrapperId: decodeFromJSONField(ID.reified(), field.deWrapperId) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): New<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== New.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(New.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return New.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): New<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isNew(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a New object`); } return New.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): New<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isNew(data.bcs.type)) { throw new Error(`object at is not a New object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return New.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return New.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<New<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching New object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isNew(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a New object`); }

 return New.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Receive =============================== */

export function isReceive(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_wrapper::Receive` + '<'); }

export interface ReceiveFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { deWrapperId: ToField<ID>; receivingType: ToField<String>; receivingId: ToField<ID> }

export type ReceiveReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< Receive<T, P>, ReceiveFields<T, P> >;

export class Receive<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_wrapper::Receive`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = Receive.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_wrapper::Receive<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = Receive.$isPhantom;

 readonly deWrapperId: ToField<ID>; readonly receivingType: ToField<String>; readonly receivingId: ToField<ID>

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: ReceiveFields<T, P>, ) { this.$fullTypeName = composeSuiType( Receive.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_wrapper::Receive<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.deWrapperId = fields.deWrapperId;; this.receivingType = fields.receivingType;; this.receivingId = fields.receivingId; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): ReceiveReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: Receive.$typeName, fullTypeName: composeSuiType( Receive.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::de_wrapper::Receive<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: Receive.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => Receive.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Receive.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => Receive.fromBcs( [T, P], data, ), bcs: Receive.bcs, fromJSONField: (field: any) => Receive.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => Receive.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => Receive.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => Receive.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => Receive.fetch( client, [T, P], id, ), new: ( fields: ReceiveFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new Receive( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Receive.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<Receive<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(Receive.reified( T, P )); } static get p() { return Receive.phantom }

 static get bcs() { return bcs.struct("Receive", {

 de_wrapper_id: ID.bcs, receiving_type: String.bcs, receiving_id: ID.bcs

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): Receive<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return Receive.reified( typeArgs[0], typeArgs[1], ).new( { deWrapperId: decodeFromFields(ID.reified(), fields.de_wrapper_id), receivingType: decodeFromFields(String.reified(), fields.receiving_type), receivingId: decodeFromFields(ID.reified(), fields.receiving_id) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): Receive<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isReceive(item.type)) { throw new Error("not a Receive type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Receive.reified( typeArgs[0], typeArgs[1], ).new( { deWrapperId: decodeFromFieldsWithTypes(ID.reified(), item.fields.de_wrapper_id), receivingType: decodeFromFieldsWithTypes(String.reified(), item.fields.receiving_type), receivingId: decodeFromFieldsWithTypes(ID.reified(), item.fields.receiving_id) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): Receive<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return Receive.fromFields( typeArgs, Receive.bcs.parse(data) ) }

 toJSONField() { return {

 deWrapperId: this.deWrapperId,receivingType: this.receivingType,receivingId: this.receivingId,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): Receive<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return Receive.reified( typeArgs[0], typeArgs[1], ).new( { deWrapperId: decodeFromJSONField(ID.reified(), field.deWrapperId), receivingType: decodeFromJSONField(String.reified(), field.receivingType), receivingId: decodeFromJSONField(ID.reified(), field.receivingId) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): Receive<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== Receive.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Receive.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Receive.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): Receive<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isReceive(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Receive object`); } return Receive.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): Receive<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isReceive(data.bcs.type)) { throw new Error(`object at is not a Receive object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Receive.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Receive.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<Receive<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Receive object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isReceive(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Receive object`); }

 return Receive.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Wrap =============================== */

export function isWrap(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_wrapper::Wrap` + '<'); }

export interface WrapFields<T extends PhantomTypeArgument, P extends PhantomTypeArgument> { deWrapperId: ToField<ID>; deTokenId: ToField<ID> }

export type WrapReified<T extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< Wrap<T, P>, WrapFields<T, P> >;

export class Wrap<T extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_wrapper::Wrap`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = Wrap.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_wrapper::Wrap<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>]; readonly $isPhantom = Wrap.$isPhantom;

 readonly deWrapperId: ToField<ID>; readonly deTokenId: ToField<ID>

 private constructor(typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>], fields: WrapFields<T, P>, ) { this.$fullTypeName = composeSuiType( Wrap.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_wrapper::Wrap<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.deWrapperId = fields.deWrapperId;; this.deTokenId = fields.deTokenId; }

 static reified<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): WrapReified<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return { typeName: Wrap.$typeName, fullTypeName: composeSuiType( Wrap.$typeName, ...[extractType(T), extractType(P)] ) as `${typeof PKG_V1}::de_wrapper::Wrap<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(T), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: Wrap.$isPhantom, reifiedTypeArgs: [T, P], fromFields: (fields: Record<string, any>) => Wrap.fromFields( [T, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Wrap.fromFieldsWithTypes( [T, P], item, ), fromBcs: (data: Uint8Array) => Wrap.fromBcs( [T, P], data, ), bcs: Wrap.bcs, fromJSONField: (field: any) => Wrap.fromJSONField( [T, P], field, ), fromJSON: (json: Record<string, any>) => Wrap.fromJSON( [T, P], json, ), fromSuiParsedData: (content: SuiParsedData) => Wrap.fromSuiParsedData( [T, P], content, ), fromSuiObjectData: (content: SuiObjectData) => Wrap.fromSuiObjectData( [T, P], content, ), fetch: async (client: SuiClient, id: string) => Wrap.fetch( client, [T, P], id, ), new: ( fields: WrapFields<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>, ) => { return new Wrap( [extractType(T), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Wrap.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( T: T, P: P ): PhantomReified<ToTypeStr<Wrap<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>>> { return phantom(Wrap.reified( T, P )); } static get p() { return Wrap.phantom }

 static get bcs() { return bcs.struct("Wrap", {

 de_wrapper_id: ID.bcs, de_token_id: ID.bcs

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], fields: Record<string, any> ): Wrap<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return Wrap.reified( typeArgs[0], typeArgs[1], ).new( { deWrapperId: decodeFromFields(ID.reified(), fields.de_wrapper_id), deTokenId: decodeFromFields(ID.reified(), fields.de_token_id) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], item: FieldsWithTypes ): Wrap<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (!isWrap(item.type)) { throw new Error("not a Wrap type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Wrap.reified( typeArgs[0], typeArgs[1], ).new( { deWrapperId: decodeFromFieldsWithTypes(ID.reified(), item.fields.de_wrapper_id), deTokenId: decodeFromFieldsWithTypes(ID.reified(), item.fields.de_token_id) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: Uint8Array ): Wrap<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return Wrap.fromFields( typeArgs, Wrap.bcs.parse(data) ) }

 toJSONField() { return {

 deWrapperId: this.deWrapperId,deTokenId: this.deTokenId,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], field: any ): Wrap<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { return Wrap.reified( typeArgs[0], typeArgs[1], ).new( { deWrapperId: decodeFromJSONField(ID.reified(), field.deWrapperId), deTokenId: decodeFromJSONField(ID.reified(), field.deTokenId) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], json: Record<string, any> ): Wrap<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (json.$typeName !== Wrap.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Wrap.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Wrap.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], content: SuiParsedData ): Wrap<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isWrap(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Wrap object`); } return Wrap.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [T, P], data: SuiObjectData ): Wrap<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isWrap(data.bcs.type)) { throw new Error(`object at is not a Wrap object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Wrap.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Wrap.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [T, P], id: string ): Promise<Wrap<ToPhantomTypeArgument<T>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Wrap object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isWrap(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Wrap object`); }

 return Wrap.fromSuiObjectData( typeArgs, res.data ); }

 }
