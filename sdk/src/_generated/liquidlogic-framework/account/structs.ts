import {String} from "../../_dependencies/source/0x1/string/structs";
import {UID} from "../../_dependencies/source/0x2/object/structs";
import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== ACCOUNT =============================== */

export function isACCOUNT(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::account::ACCOUNT`; }

export interface ACCOUNTFields { dummyField: ToField<"bool"> }

export type ACCOUNTReified = Reified< ACCOUNT, ACCOUNTFields >;

export class ACCOUNT implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::account::ACCOUNT`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = ACCOUNT.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::account::ACCOUNT`; readonly $typeArgs: []; readonly $isPhantom = ACCOUNT.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: ACCOUNTFields, ) { this.$fullTypeName = composeSuiType( ACCOUNT.$typeName, ...typeArgs ) as `${typeof PKG_V1}::account::ACCOUNT`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): ACCOUNTReified { return { typeName: ACCOUNT.$typeName, fullTypeName: composeSuiType( ACCOUNT.$typeName, ...[] ) as `${typeof PKG_V1}::account::ACCOUNT`, typeArgs: [ ] as [], isPhantom: ACCOUNT.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => ACCOUNT.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ACCOUNT.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => ACCOUNT.fromBcs( data, ), bcs: ACCOUNT.bcs, fromJSONField: (field: any) => ACCOUNT.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => ACCOUNT.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => ACCOUNT.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => ACCOUNT.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => ACCOUNT.fetch( client, id, ), new: ( fields: ACCOUNTFields, ) => { return new ACCOUNT( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return ACCOUNT.reified() }

 static phantom( ): PhantomReified<ToTypeStr<ACCOUNT>> { return phantom(ACCOUNT.reified( )); } static get p() { return ACCOUNT.phantom() }

 static get bcs() { return bcs.struct("ACCOUNT", {

 dummy_field: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): ACCOUNT { return ACCOUNT.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): ACCOUNT { if (!isACCOUNT(item.type)) { throw new Error("not a ACCOUNT type");

 }

 return ACCOUNT.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): ACCOUNT { return ACCOUNT.fromFields( ACCOUNT.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): ACCOUNT { return ACCOUNT.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): ACCOUNT { if (json.$typeName !== ACCOUNT.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return ACCOUNT.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): ACCOUNT { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isACCOUNT(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ACCOUNT object`); } return ACCOUNT.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): ACCOUNT { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isACCOUNT(data.bcs.type)) { throw new Error(`object at is not a ACCOUNT object`); }

 return ACCOUNT.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ACCOUNT.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<ACCOUNT> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ACCOUNT object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isACCOUNT(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ACCOUNT object`); }

 return ACCOUNT.fromSuiObjectData( res.data ); }

 }

/* ============================== Account =============================== */

export function isAccount(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::account::Account`; }

export interface AccountFields { id: ToField<UID>; alias: ToField<String> }

export type AccountReified = Reified< Account, AccountFields >;

export class Account implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::account::Account`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Account.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::account::Account`; readonly $typeArgs: []; readonly $isPhantom = Account.$isPhantom;

 readonly id: ToField<UID>; readonly alias: ToField<String>

 private constructor(typeArgs: [], fields: AccountFields, ) { this.$fullTypeName = composeSuiType( Account.$typeName, ...typeArgs ) as `${typeof PKG_V1}::account::Account`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.alias = fields.alias; }

 static reified( ): AccountReified { return { typeName: Account.$typeName, fullTypeName: composeSuiType( Account.$typeName, ...[] ) as `${typeof PKG_V1}::account::Account`, typeArgs: [ ] as [], isPhantom: Account.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Account.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Account.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Account.fromBcs( data, ), bcs: Account.bcs, fromJSONField: (field: any) => Account.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Account.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Account.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Account.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Account.fetch( client, id, ), new: ( fields: AccountFields, ) => { return new Account( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Account.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Account>> { return phantom(Account.reified( )); } static get p() { return Account.phantom() }

 static get bcs() { return bcs.struct("Account", {

 id: UID.bcs, alias: String.bcs

}) };

 static fromFields( fields: Record<string, any> ): Account { return Account.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), alias: decodeFromFields(String.reified(), fields.alias) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Account { if (!isAccount(item.type)) { throw new Error("not a Account type");

 }

 return Account.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), alias: decodeFromFieldsWithTypes(String.reified(), item.fields.alias) } ) }

 static fromBcs( data: Uint8Array ): Account { return Account.fromFields( Account.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,alias: this.alias,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Account { return Account.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), alias: decodeFromJSONField(String.reified(), field.alias) } ) }

 static fromJSON( json: Record<string, any> ): Account { if (json.$typeName !== Account.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Account.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Account { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isAccount(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Account object`); } return Account.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Account { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isAccount(data.bcs.type)) { throw new Error(`object at is not a Account object`); }

 return Account.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Account.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Account> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Account object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isAccount(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Account object`); }

 return Account.fromSuiObjectData( res.data ); }

 }

/* ============================== AccountRequest =============================== */

export function isAccountRequest(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::account::AccountRequest`; }

export interface AccountRequestFields { account: ToField<"address"> }

export type AccountRequestReified = Reified< AccountRequest, AccountRequestFields >;

export class AccountRequest implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::account::AccountRequest`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = AccountRequest.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::account::AccountRequest`; readonly $typeArgs: []; readonly $isPhantom = AccountRequest.$isPhantom;

 readonly account: ToField<"address">

 private constructor(typeArgs: [], fields: AccountRequestFields, ) { this.$fullTypeName = composeSuiType( AccountRequest.$typeName, ...typeArgs ) as `${typeof PKG_V1}::account::AccountRequest`; this.$typeArgs = typeArgs;

 this.account = fields.account; }

 static reified( ): AccountRequestReified { return { typeName: AccountRequest.$typeName, fullTypeName: composeSuiType( AccountRequest.$typeName, ...[] ) as `${typeof PKG_V1}::account::AccountRequest`, typeArgs: [ ] as [], isPhantom: AccountRequest.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => AccountRequest.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => AccountRequest.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => AccountRequest.fromBcs( data, ), bcs: AccountRequest.bcs, fromJSONField: (field: any) => AccountRequest.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => AccountRequest.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => AccountRequest.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => AccountRequest.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => AccountRequest.fetch( client, id, ), new: ( fields: AccountRequestFields, ) => { return new AccountRequest( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return AccountRequest.reified() }

 static phantom( ): PhantomReified<ToTypeStr<AccountRequest>> { return phantom(AccountRequest.reified( )); } static get p() { return AccountRequest.phantom() }

 static get bcs() { return bcs.struct("AccountRequest", {

 account: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), })

}) };

 static fromFields( fields: Record<string, any> ): AccountRequest { return AccountRequest.reified( ).new( { account: decodeFromFields("address", fields.account) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): AccountRequest { if (!isAccountRequest(item.type)) { throw new Error("not a AccountRequest type");

 }

 return AccountRequest.reified( ).new( { account: decodeFromFieldsWithTypes("address", item.fields.account) } ) }

 static fromBcs( data: Uint8Array ): AccountRequest { return AccountRequest.fromFields( AccountRequest.bcs.parse(data) ) }

 toJSONField() { return {

 account: this.account,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): AccountRequest { return AccountRequest.reified( ).new( { account: decodeFromJSONField("address", field.account) } ) }

 static fromJSON( json: Record<string, any> ): AccountRequest { if (json.$typeName !== AccountRequest.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return AccountRequest.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): AccountRequest { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isAccountRequest(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a AccountRequest object`); } return AccountRequest.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): AccountRequest { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isAccountRequest(data.bcs.type)) { throw new Error(`object at is not a AccountRequest object`); }

 return AccountRequest.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return AccountRequest.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<AccountRequest> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching AccountRequest object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isAccountRequest(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a AccountRequest object`); }

 return AccountRequest.fromSuiObjectData( res.data ); }

 }
