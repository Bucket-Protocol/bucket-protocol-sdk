import {String} from "../../_dependencies/source/0x1/ascii/structs";
import {Balance} from "../../_dependencies/source/0x2/balance/structs";
import {ID, UID} from "../../_dependencies/source/0x2/object/structs";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {PKG_V1} from "../index";
import {Point} from "../point/structs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== DE_TOKEN =============================== */

export function isDE_TOKEN(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_token::DE_TOKEN`; }

export interface DE_TOKENFields { dummyField: ToField<"bool"> }

export type DE_TOKENReified = Reified< DE_TOKEN, DE_TOKENFields >;

export class DE_TOKEN implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_token::DE_TOKEN`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = DE_TOKEN.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_token::DE_TOKEN`; readonly $typeArgs: []; readonly $isPhantom = DE_TOKEN.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: DE_TOKENFields, ) { this.$fullTypeName = composeSuiType( DE_TOKEN.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_token::DE_TOKEN`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): DE_TOKENReified { return { typeName: DE_TOKEN.$typeName, fullTypeName: composeSuiType( DE_TOKEN.$typeName, ...[] ) as `${typeof PKG_V1}::de_token::DE_TOKEN`, typeArgs: [ ] as [], isPhantom: DE_TOKEN.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => DE_TOKEN.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DE_TOKEN.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => DE_TOKEN.fromBcs( data, ), bcs: DE_TOKEN.bcs, fromJSONField: (field: any) => DE_TOKEN.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => DE_TOKEN.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => DE_TOKEN.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => DE_TOKEN.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => DE_TOKEN.fetch( client, id, ), new: ( fields: DE_TOKENFields, ) => { return new DE_TOKEN( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return DE_TOKEN.reified() }

 static phantom( ): PhantomReified<ToTypeStr<DE_TOKEN>> { return phantom(DE_TOKEN.reified( )); } static get p() { return DE_TOKEN.phantom() }

 static get bcs() { return bcs.struct("DE_TOKEN", {

 dummy_field: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): DE_TOKEN { return DE_TOKEN.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): DE_TOKEN { if (!isDE_TOKEN(item.type)) { throw new Error("not a DE_TOKEN type");

 }

 return DE_TOKEN.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): DE_TOKEN { return DE_TOKEN.fromFields( DE_TOKEN.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): DE_TOKEN { return DE_TOKEN.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): DE_TOKEN { if (json.$typeName !== DE_TOKEN.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return DE_TOKEN.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): DE_TOKEN { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDE_TOKEN(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DE_TOKEN object`); } return DE_TOKEN.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): DE_TOKEN { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDE_TOKEN(data.bcs.type)) { throw new Error(`object at is not a DE_TOKEN object`); }

 return DE_TOKEN.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DE_TOKEN.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<DE_TOKEN> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DE_TOKEN object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDE_TOKEN(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DE_TOKEN object`); }

 return DE_TOKEN.fromSuiObjectData( res.data ); }

 }

/* ============================== DeToken =============================== */

export function isDeToken(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::de_token::DeToken` + '<'); }

export interface DeTokenFields<Token extends PhantomTypeArgument, P extends PhantomTypeArgument> { id: ToField<UID>; pool: ToField<ID>; maxTime: ToField<"u64">; imgUrl: ToField<String>; name: ToField<String>; balance: ToField<Balance<Token>>; end: ToField<"u64">; escrowEpoch: ToField<"u64">; point: ToField<Point>; earlyUnlock: ToField<"bool"> }

export type DeTokenReified<Token extends PhantomTypeArgument, P extends PhantomTypeArgument> = Reified< DeToken<Token, P>, DeTokenFields<Token, P> >;

export class DeToken<Token extends PhantomTypeArgument, P extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_token::DeToken`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = DeToken.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_token::DeToken<${PhantomToTypeStr<Token>}, ${PhantomToTypeStr<P>}>`; readonly $typeArgs: [PhantomToTypeStr<Token>, PhantomToTypeStr<P>]; readonly $isPhantom = DeToken.$isPhantom;

 readonly id: ToField<UID>; readonly pool: ToField<ID>; readonly maxTime: ToField<"u64">; readonly imgUrl: ToField<String>; readonly name: ToField<String>; readonly balance: ToField<Balance<Token>>; readonly end: ToField<"u64">; readonly escrowEpoch: ToField<"u64">; readonly point: ToField<Point>; readonly earlyUnlock: ToField<"bool">

 private constructor(typeArgs: [PhantomToTypeStr<Token>, PhantomToTypeStr<P>], fields: DeTokenFields<Token, P>, ) { this.$fullTypeName = composeSuiType( DeToken.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_token::DeToken<${PhantomToTypeStr<Token>}, ${PhantomToTypeStr<P>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.pool = fields.pool;; this.maxTime = fields.maxTime;; this.imgUrl = fields.imgUrl;; this.name = fields.name;; this.balance = fields.balance;; this.end = fields.end;; this.escrowEpoch = fields.escrowEpoch;; this.point = fields.point;; this.earlyUnlock = fields.earlyUnlock; }

 static reified<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( Token: Token, P: P ): DeTokenReified<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return { typeName: DeToken.$typeName, fullTypeName: composeSuiType( DeToken.$typeName, ...[extractType(Token), extractType(P)] ) as `${typeof PKG_V1}::de_token::DeToken<${PhantomToTypeStr<ToPhantomTypeArgument<Token>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`, typeArgs: [ extractType(Token), extractType(P) ] as [PhantomToTypeStr<ToPhantomTypeArgument<Token>>, PhantomToTypeStr<ToPhantomTypeArgument<P>>], isPhantom: DeToken.$isPhantom, reifiedTypeArgs: [Token, P], fromFields: (fields: Record<string, any>) => DeToken.fromFields( [Token, P], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DeToken.fromFieldsWithTypes( [Token, P], item, ), fromBcs: (data: Uint8Array) => DeToken.fromBcs( [Token, P], data, ), bcs: DeToken.bcs, fromJSONField: (field: any) => DeToken.fromJSONField( [Token, P], field, ), fromJSON: (json: Record<string, any>) => DeToken.fromJSON( [Token, P], json, ), fromSuiParsedData: (content: SuiParsedData) => DeToken.fromSuiParsedData( [Token, P], content, ), fromSuiObjectData: (content: SuiObjectData) => DeToken.fromSuiObjectData( [Token, P], content, ), fetch: async (client: SuiClient, id: string) => DeToken.fetch( client, [Token, P], id, ), new: ( fields: DeTokenFields<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>>, ) => { return new DeToken( [extractType(Token), extractType(P)], fields ) }, kind: "StructClassReified", } }

 static get r() { return DeToken.reified }

 static phantom<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( Token: Token, P: P ): PhantomReified<ToTypeStr<DeToken<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>>>> { return phantom(DeToken.reified( Token, P )); } static get p() { return DeToken.phantom }

 static get bcs() { return bcs.struct("DeToken", {

 id: UID.bcs, pool: ID.bcs, max_time: bcs.u64(), img_url: String.bcs, name: String.bcs, balance: Balance.bcs, end: bcs.u64(), escrow_epoch: bcs.u64(), point: Point.bcs, early_unlock: bcs.bool()

}) };

 static fromFields<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], fields: Record<string, any> ): DeToken<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return DeToken.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFields(UID.reified(), fields.id), pool: decodeFromFields(ID.reified(), fields.pool), maxTime: decodeFromFields("u64", fields.max_time), imgUrl: decodeFromFields(String.reified(), fields.img_url), name: decodeFromFields(String.reified(), fields.name), balance: decodeFromFields(Balance.reified(typeArgs[0]), fields.balance), end: decodeFromFields("u64", fields.end), escrowEpoch: decodeFromFields("u64", fields.escrow_epoch), point: decodeFromFields(Point.reified(), fields.point), earlyUnlock: decodeFromFields("bool", fields.early_unlock) } ) }

 static fromFieldsWithTypes<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], item: FieldsWithTypes ): DeToken<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (!isDeToken(item.type)) { throw new Error("not a DeToken type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return DeToken.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), pool: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool), maxTime: decodeFromFieldsWithTypes("u64", item.fields.max_time), imgUrl: decodeFromFieldsWithTypes(String.reified(), item.fields.img_url), name: decodeFromFieldsWithTypes(String.reified(), item.fields.name), balance: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.balance), end: decodeFromFieldsWithTypes("u64", item.fields.end), escrowEpoch: decodeFromFieldsWithTypes("u64", item.fields.escrow_epoch), point: decodeFromFieldsWithTypes(Point.reified(), item.fields.point), earlyUnlock: decodeFromFieldsWithTypes("bool", item.fields.early_unlock) } ) }

 static fromBcs<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], data: Uint8Array ): DeToken<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return DeToken.fromFields( typeArgs, DeToken.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,pool: this.pool,maxTime: this.maxTime.toString(),imgUrl: this.imgUrl,name: this.name,balance: this.balance.toJSONField(),end: this.end.toString(),escrowEpoch: this.escrowEpoch.toString(),point: this.point.toJSONField(),earlyUnlock: this.earlyUnlock,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], field: any ): DeToken<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { return DeToken.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromJSONField(UID.reified(), field.id), pool: decodeFromJSONField(ID.reified(), field.pool), maxTime: decodeFromJSONField("u64", field.maxTime), imgUrl: decodeFromJSONField(String.reified(), field.imgUrl), name: decodeFromJSONField(String.reified(), field.name), balance: decodeFromJSONField(Balance.reified(typeArgs[0]), field.balance), end: decodeFromJSONField("u64", field.end), escrowEpoch: decodeFromJSONField("u64", field.escrowEpoch), point: decodeFromJSONField(Point.reified(), field.point), earlyUnlock: decodeFromJSONField("bool", field.earlyUnlock) } ) }

 static fromJSON<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], json: Record<string, any> ): DeToken<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (json.$typeName !== DeToken.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(DeToken.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return DeToken.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], content: SuiParsedData ): DeToken<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDeToken(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DeToken object`); } return DeToken.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( typeArgs: [Token, P], data: SuiObjectData ): DeToken<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDeToken(data.bcs.type)) { throw new Error(`object at is not a DeToken object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return DeToken.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DeToken.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<Token extends PhantomReified<PhantomTypeArgument>, P extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [Token, P], id: string ): Promise<DeToken<ToPhantomTypeArgument<Token>, ToPhantomTypeArgument<P>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DeToken object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDeToken(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DeToken object`); }

 return DeToken.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== DeTokenUpdateEvent =============================== */

export function isDeTokenUpdateEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::de_token::DeTokenUpdateEvent`; }

export interface DeTokenUpdateEventFields { escrowId: ToField<ID>; prevBal: ToField<"u64">; currentBal: ToField<"u64">; prevDuration: ToField<"u64">; currentDuration: ToField<"u64">; prevEnd: ToField<"u64">; currentEnd: ToField<"u64">; currentVotingWeight: ToField<"u64">; prevRawVotingWeight: ToField<"u64">; currentRawVotingWeight: ToField<"u64">; timestamp: ToField<"u64"> }

export type DeTokenUpdateEventReified = Reified< DeTokenUpdateEvent, DeTokenUpdateEventFields >;

export class DeTokenUpdateEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::de_token::DeTokenUpdateEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = DeTokenUpdateEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::de_token::DeTokenUpdateEvent`; readonly $typeArgs: []; readonly $isPhantom = DeTokenUpdateEvent.$isPhantom;

 readonly escrowId: ToField<ID>; readonly prevBal: ToField<"u64">; readonly currentBal: ToField<"u64">; readonly prevDuration: ToField<"u64">; readonly currentDuration: ToField<"u64">; readonly prevEnd: ToField<"u64">; readonly currentEnd: ToField<"u64">; readonly currentVotingWeight: ToField<"u64">; readonly prevRawVotingWeight: ToField<"u64">; readonly currentRawVotingWeight: ToField<"u64">; readonly timestamp: ToField<"u64">

 private constructor(typeArgs: [], fields: DeTokenUpdateEventFields, ) { this.$fullTypeName = composeSuiType( DeTokenUpdateEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::de_token::DeTokenUpdateEvent`; this.$typeArgs = typeArgs;

 this.escrowId = fields.escrowId;; this.prevBal = fields.prevBal;; this.currentBal = fields.currentBal;; this.prevDuration = fields.prevDuration;; this.currentDuration = fields.currentDuration;; this.prevEnd = fields.prevEnd;; this.currentEnd = fields.currentEnd;; this.currentVotingWeight = fields.currentVotingWeight;; this.prevRawVotingWeight = fields.prevRawVotingWeight;; this.currentRawVotingWeight = fields.currentRawVotingWeight;; this.timestamp = fields.timestamp; }

 static reified( ): DeTokenUpdateEventReified { return { typeName: DeTokenUpdateEvent.$typeName, fullTypeName: composeSuiType( DeTokenUpdateEvent.$typeName, ...[] ) as `${typeof PKG_V1}::de_token::DeTokenUpdateEvent`, typeArgs: [ ] as [], isPhantom: DeTokenUpdateEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => DeTokenUpdateEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => DeTokenUpdateEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => DeTokenUpdateEvent.fromBcs( data, ), bcs: DeTokenUpdateEvent.bcs, fromJSONField: (field: any) => DeTokenUpdateEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => DeTokenUpdateEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => DeTokenUpdateEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => DeTokenUpdateEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => DeTokenUpdateEvent.fetch( client, id, ), new: ( fields: DeTokenUpdateEventFields, ) => { return new DeTokenUpdateEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return DeTokenUpdateEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<DeTokenUpdateEvent>> { return phantom(DeTokenUpdateEvent.reified( )); } static get p() { return DeTokenUpdateEvent.phantom() }

 static get bcs() { return bcs.struct("DeTokenUpdateEvent", {

 escrow_id: ID.bcs, prev_bal: bcs.u64(), current_bal: bcs.u64(), prev_duration: bcs.u64(), current_duration: bcs.u64(), prev_end: bcs.u64(), current_end: bcs.u64(), current_voting_weight: bcs.u64(), prev_raw_voting_weight: bcs.u64(), current_raw_voting_weight: bcs.u64(), timestamp: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): DeTokenUpdateEvent { return DeTokenUpdateEvent.reified( ).new( { escrowId: decodeFromFields(ID.reified(), fields.escrow_id), prevBal: decodeFromFields("u64", fields.prev_bal), currentBal: decodeFromFields("u64", fields.current_bal), prevDuration: decodeFromFields("u64", fields.prev_duration), currentDuration: decodeFromFields("u64", fields.current_duration), prevEnd: decodeFromFields("u64", fields.prev_end), currentEnd: decodeFromFields("u64", fields.current_end), currentVotingWeight: decodeFromFields("u64", fields.current_voting_weight), prevRawVotingWeight: decodeFromFields("u64", fields.prev_raw_voting_weight), currentRawVotingWeight: decodeFromFields("u64", fields.current_raw_voting_weight), timestamp: decodeFromFields("u64", fields.timestamp) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): DeTokenUpdateEvent { if (!isDeTokenUpdateEvent(item.type)) { throw new Error("not a DeTokenUpdateEvent type");

 }

 return DeTokenUpdateEvent.reified( ).new( { escrowId: decodeFromFieldsWithTypes(ID.reified(), item.fields.escrow_id), prevBal: decodeFromFieldsWithTypes("u64", item.fields.prev_bal), currentBal: decodeFromFieldsWithTypes("u64", item.fields.current_bal), prevDuration: decodeFromFieldsWithTypes("u64", item.fields.prev_duration), currentDuration: decodeFromFieldsWithTypes("u64", item.fields.current_duration), prevEnd: decodeFromFieldsWithTypes("u64", item.fields.prev_end), currentEnd: decodeFromFieldsWithTypes("u64", item.fields.current_end), currentVotingWeight: decodeFromFieldsWithTypes("u64", item.fields.current_voting_weight), prevRawVotingWeight: decodeFromFieldsWithTypes("u64", item.fields.prev_raw_voting_weight), currentRawVotingWeight: decodeFromFieldsWithTypes("u64", item.fields.current_raw_voting_weight), timestamp: decodeFromFieldsWithTypes("u64", item.fields.timestamp) } ) }

 static fromBcs( data: Uint8Array ): DeTokenUpdateEvent { return DeTokenUpdateEvent.fromFields( DeTokenUpdateEvent.bcs.parse(data) ) }

 toJSONField() { return {

 escrowId: this.escrowId,prevBal: this.prevBal.toString(),currentBal: this.currentBal.toString(),prevDuration: this.prevDuration.toString(),currentDuration: this.currentDuration.toString(),prevEnd: this.prevEnd.toString(),currentEnd: this.currentEnd.toString(),currentVotingWeight: this.currentVotingWeight.toString(),prevRawVotingWeight: this.prevRawVotingWeight.toString(),currentRawVotingWeight: this.currentRawVotingWeight.toString(),timestamp: this.timestamp.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): DeTokenUpdateEvent { return DeTokenUpdateEvent.reified( ).new( { escrowId: decodeFromJSONField(ID.reified(), field.escrowId), prevBal: decodeFromJSONField("u64", field.prevBal), currentBal: decodeFromJSONField("u64", field.currentBal), prevDuration: decodeFromJSONField("u64", field.prevDuration), currentDuration: decodeFromJSONField("u64", field.currentDuration), prevEnd: decodeFromJSONField("u64", field.prevEnd), currentEnd: decodeFromJSONField("u64", field.currentEnd), currentVotingWeight: decodeFromJSONField("u64", field.currentVotingWeight), prevRawVotingWeight: decodeFromJSONField("u64", field.prevRawVotingWeight), currentRawVotingWeight: decodeFromJSONField("u64", field.currentRawVotingWeight), timestamp: decodeFromJSONField("u64", field.timestamp) } ) }

 static fromJSON( json: Record<string, any> ): DeTokenUpdateEvent { if (json.$typeName !== DeTokenUpdateEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return DeTokenUpdateEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): DeTokenUpdateEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isDeTokenUpdateEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a DeTokenUpdateEvent object`); } return DeTokenUpdateEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): DeTokenUpdateEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isDeTokenUpdateEvent(data.bcs.type)) { throw new Error(`object at is not a DeTokenUpdateEvent object`); }

 return DeTokenUpdateEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return DeTokenUpdateEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<DeTokenUpdateEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching DeTokenUpdateEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isDeTokenUpdateEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a DeTokenUpdateEvent object`); }

 return DeTokenUpdateEvent.fromSuiObjectData( res.data ); }

 }
