import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {I128} from "../i128/structs";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== Point =============================== */

export function isPoint(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::point::Point`; }

export interface PointFields { slope: ToField<I128>; bias: ToField<I128>; timestamp: ToField<"u64"> }

export type PointReified = Reified< Point, PointFields >;

export class Point implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::point::Point`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Point.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::point::Point`; readonly $typeArgs: []; readonly $isPhantom = Point.$isPhantom;

 readonly slope: ToField<I128>; readonly bias: ToField<I128>; readonly timestamp: ToField<"u64">

 private constructor(typeArgs: [], fields: PointFields, ) { this.$fullTypeName = composeSuiType( Point.$typeName, ...typeArgs ) as `${typeof PKG_V1}::point::Point`; this.$typeArgs = typeArgs;

 this.slope = fields.slope;; this.bias = fields.bias;; this.timestamp = fields.timestamp; }

 static reified( ): PointReified { return { typeName: Point.$typeName, fullTypeName: composeSuiType( Point.$typeName, ...[] ) as `${typeof PKG_V1}::point::Point`, typeArgs: [ ] as [], isPhantom: Point.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Point.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Point.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Point.fromBcs( data, ), bcs: Point.bcs, fromJSONField: (field: any) => Point.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Point.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Point.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Point.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Point.fetch( client, id, ), new: ( fields: PointFields, ) => { return new Point( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Point.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Point>> { return phantom(Point.reified( )); } static get p() { return Point.phantom() }

 static get bcs() { return bcs.struct("Point", {

 slope: I128.bcs, bias: I128.bcs, timestamp: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): Point { return Point.reified( ).new( { slope: decodeFromFields(I128.reified(), fields.slope), bias: decodeFromFields(I128.reified(), fields.bias), timestamp: decodeFromFields("u64", fields.timestamp) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Point { if (!isPoint(item.type)) { throw new Error("not a Point type");

 }

 return Point.reified( ).new( { slope: decodeFromFieldsWithTypes(I128.reified(), item.fields.slope), bias: decodeFromFieldsWithTypes(I128.reified(), item.fields.bias), timestamp: decodeFromFieldsWithTypes("u64", item.fields.timestamp) } ) }

 static fromBcs( data: Uint8Array ): Point { return Point.fromFields( Point.bcs.parse(data) ) }

 toJSONField() { return {

 slope: this.slope.toJSONField(),bias: this.bias.toJSONField(),timestamp: this.timestamp.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Point { return Point.reified( ).new( { slope: decodeFromJSONField(I128.reified(), field.slope), bias: decodeFromJSONField(I128.reified(), field.bias), timestamp: decodeFromJSONField("u64", field.timestamp) } ) }

 static fromJSON( json: Record<string, any> ): Point { if (json.$typeName !== Point.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Point.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Point { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPoint(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Point object`); } return Point.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Point { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPoint(data.bcs.type)) { throw new Error(`object at is not a Point object`); }

 return Point.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Point.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Point> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Point object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPoint(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Point object`); }

 return Point.fromSuiObjectData( res.data ); }

 }
