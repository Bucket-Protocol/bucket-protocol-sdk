import * as reified from "../../_framework/reified";
import { String } from "../../_dependencies/source/0x1/ascii/structs";
import { Balance } from "../../_dependencies/source/0x2/balance/structs";
import { ID, UID } from "../../_dependencies/source/0x2/object/structs";
import { Table } from "../../_dependencies/source/0x2/table/structs";
import { VecSet } from "../../_dependencies/source/0x2/vec-set/structs";
import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
  ToTypeStr as ToPhantom,
} from "../../_framework/reified";
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from "../../_framework/util";
import { PKG_V1 } from "../index";
import { bcs } from "@mysten/sui/bcs";
import { SuiClient, SuiObjectData, SuiParsedData } from "@mysten/sui/client";
import { fromB64 } from "@mysten/sui/utils";

/* ============================== Supply =============================== */

export function isSupply(type: string): boolean {
  type = compressSuiType(type);
  return type.startsWith(`${PKG_V1}::reward_center::Supply` + "<");
}

export interface SupplyFields<P extends PhantomTypeArgument> {
  centerId: ToField<ID>;
  tokenType: ToField<String>;
  rewardType: ToField<String>;
  amount: ToField<"u64">;
}

export type SupplyReified<P extends PhantomTypeArgument> = Reified<
  Supply<P>,
  SupplyFields<P>
>;

export class Supply<P extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const;

  static readonly $typeName = `${PKG_V1}::reward_center::Supply`;
  static readonly $numTypeParams = 1;
  static readonly $isPhantom = [true] as const;

  readonly $typeName = Supply.$typeName;
  readonly $fullTypeName: `${typeof PKG_V1}::reward_center::Supply<${PhantomToTypeStr<P>}>`;
  readonly $typeArgs: [PhantomToTypeStr<P>];
  readonly $isPhantom = Supply.$isPhantom;

  readonly centerId: ToField<ID>;
  readonly tokenType: ToField<String>;
  readonly rewardType: ToField<String>;
  readonly amount: ToField<"u64">;

  private constructor(
    typeArgs: [PhantomToTypeStr<P>],
    fields: SupplyFields<P>,
  ) {
    this.$fullTypeName = composeSuiType(
      Supply.$typeName,
      ...typeArgs,
    ) as `${typeof PKG_V1}::reward_center::Supply<${PhantomToTypeStr<P>}>`;
    this.$typeArgs = typeArgs;

    this.centerId = fields.centerId;
    this.tokenType = fields.tokenType;
    this.rewardType = fields.rewardType;
    this.amount = fields.amount;
  }

  static reified<P extends PhantomReified<PhantomTypeArgument>>(
    P: P,
  ): SupplyReified<ToPhantomTypeArgument<P>> {
    return {
      typeName: Supply.$typeName,
      fullTypeName: composeSuiType(
        Supply.$typeName,
        ...[extractType(P)],
      ) as `${typeof PKG_V1}::reward_center::Supply<${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`,
      typeArgs: [extractType(P)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<P>>,
      ],
      isPhantom: Supply.$isPhantom,
      reifiedTypeArgs: [P],
      fromFields: (fields: Record<string, any>) => Supply.fromFields(P, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        Supply.fromFieldsWithTypes(P, item),
      fromBcs: (data: Uint8Array) => Supply.fromBcs(P, data),
      bcs: Supply.bcs,
      fromJSONField: (field: any) => Supply.fromJSONField(P, field),
      fromJSON: (json: Record<string, any>) => Supply.fromJSON(P, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        Supply.fromSuiParsedData(P, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        Supply.fromSuiObjectData(P, content),
      fetch: async (client: SuiClient, id: string) =>
        Supply.fetch(client, P, id),
      new: (fields: SupplyFields<ToPhantomTypeArgument<P>>) => {
        return new Supply([extractType(P)], fields);
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return Supply.reified;
  }

  static phantom<P extends PhantomReified<PhantomTypeArgument>>(
    P: P,
  ): PhantomReified<ToTypeStr<Supply<ToPhantomTypeArgument<P>>>> {
    return phantom(Supply.reified(P));
  }
  static get p() {
    return Supply.phantom;
  }

  static get bcs() {
    return bcs.struct("Supply", {
      center_id: ID.bcs,
      token_type: String.bcs,
      reward_type: String.bcs,
      amount: bcs.u64(),
    });
  }

  static fromFields<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    fields: Record<string, any>,
  ): Supply<ToPhantomTypeArgument<P>> {
    return Supply.reified(typeArg).new({
      centerId: decodeFromFields(ID.reified(), fields.center_id),
      tokenType: decodeFromFields(String.reified(), fields.token_type),
      rewardType: decodeFromFields(String.reified(), fields.reward_type),
      amount: decodeFromFields("u64", fields.amount),
    });
  }

  static fromFieldsWithTypes<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    item: FieldsWithTypes,
  ): Supply<ToPhantomTypeArgument<P>> {
    if (!isSupply(item.type)) {
      throw new Error("not a Supply type");
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg]);

    return Supply.reified(typeArg).new({
      centerId: decodeFromFieldsWithTypes(ID.reified(), item.fields.center_id),
      tokenType: decodeFromFieldsWithTypes(
        String.reified(),
        item.fields.token_type,
      ),
      rewardType: decodeFromFieldsWithTypes(
        String.reified(),
        item.fields.reward_type,
      ),
      amount: decodeFromFieldsWithTypes("u64", item.fields.amount),
    });
  }

  static fromBcs<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    data: Uint8Array,
  ): Supply<ToPhantomTypeArgument<P>> {
    return Supply.fromFields(typeArg, Supply.bcs.parse(data));
  }

  toJSONField() {
    return {
      centerId: this.centerId,
      tokenType: this.tokenType,
      rewardType: this.rewardType,
      amount: this.amount.toString(),
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    field: any,
  ): Supply<ToPhantomTypeArgument<P>> {
    return Supply.reified(typeArg).new({
      centerId: decodeFromJSONField(ID.reified(), field.centerId),
      tokenType: decodeFromJSONField(String.reified(), field.tokenType),
      rewardType: decodeFromJSONField(String.reified(), field.rewardType),
      amount: decodeFromJSONField("u64", field.amount),
    });
  }

  static fromJSON<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    json: Record<string, any>,
  ): Supply<ToPhantomTypeArgument<P>> {
    if (json.$typeName !== Supply.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Supply.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg],
    );

    return Supply.fromJSONField(typeArg, json);
  }

  static fromSuiParsedData<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    content: SuiParsedData,
  ): Supply<ToPhantomTypeArgument<P>> {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isSupply(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a Supply object`,
      );
    }
    return Supply.fromFieldsWithTypes(typeArg, content);
  }

  static fromSuiObjectData<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    data: SuiObjectData,
  ): Supply<ToPhantomTypeArgument<P>> {
    if (data.bcs) {
      if (data.bcs.dataType !== "moveObject" || !isSupply(data.bcs.type)) {
        throw new Error(`object at is not a Supply object`);
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs;
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`,
        );
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0]);
      const expectedTypeArg = compressSuiType(extractType(typeArg));
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        );
      }

      return Supply.fromBcs(typeArg, fromB64(data.bcs.bcsBytes));
    }
    if (data.content) {
      return Supply.fromSuiParsedData(typeArg, data.content);
    }
    throw new Error(
      "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.",
    );
  }

  static async fetch<P extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: P,
    id: string,
  ): Promise<Supply<ToPhantomTypeArgument<P>>> {
    const res = await client.getObject({ id, options: { showBcs: true } });
    if (res.error) {
      throw new Error(
        `error fetching Supply object at id ${id}: ${res.error.code}`,
      );
    }
    if (
      res.data?.bcs?.dataType !== "moveObject" ||
      !isSupply(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a Supply object`);
    }

    return Supply.fromSuiObjectData(typeArg, res.data);
  }
}

/* ============================== CheckIn =============================== */

export function isCheckIn(type: string): boolean {
  type = compressSuiType(type);
  return type.startsWith(`${PKG_V1}::reward_center::CheckIn` + "<");
}

export interface CheckInFields<P extends PhantomTypeArgument> {
  centerId: ToField<ID>;
  proofId: ToField<ID>;
  tokenType: ToField<String>;
  rewardType: ToField<String>;
  votingWeight: ToField<"u64">;
}

export type CheckInReified<P extends PhantomTypeArgument> = Reified<
  CheckIn<P>,
  CheckInFields<P>
>;

export class CheckIn<P extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const;

  static readonly $typeName = `${PKG_V1}::reward_center::CheckIn`;
  static readonly $numTypeParams = 1;
  static readonly $isPhantom = [true] as const;

  readonly $typeName = CheckIn.$typeName;
  readonly $fullTypeName: `${typeof PKG_V1}::reward_center::CheckIn<${PhantomToTypeStr<P>}>`;
  readonly $typeArgs: [PhantomToTypeStr<P>];
  readonly $isPhantom = CheckIn.$isPhantom;

  readonly centerId: ToField<ID>;
  readonly proofId: ToField<ID>;
  readonly tokenType: ToField<String>;
  readonly rewardType: ToField<String>;
  readonly votingWeight: ToField<"u64">;

  private constructor(
    typeArgs: [PhantomToTypeStr<P>],
    fields: CheckInFields<P>,
  ) {
    this.$fullTypeName = composeSuiType(
      CheckIn.$typeName,
      ...typeArgs,
    ) as `${typeof PKG_V1}::reward_center::CheckIn<${PhantomToTypeStr<P>}>`;
    this.$typeArgs = typeArgs;

    this.centerId = fields.centerId;
    this.proofId = fields.proofId;
    this.tokenType = fields.tokenType;
    this.rewardType = fields.rewardType;
    this.votingWeight = fields.votingWeight;
  }

  static reified<P extends PhantomReified<PhantomTypeArgument>>(
    P: P,
  ): CheckInReified<ToPhantomTypeArgument<P>> {
    return {
      typeName: CheckIn.$typeName,
      fullTypeName: composeSuiType(
        CheckIn.$typeName,
        ...[extractType(P)],
      ) as `${typeof PKG_V1}::reward_center::CheckIn<${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`,
      typeArgs: [extractType(P)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<P>>,
      ],
      isPhantom: CheckIn.$isPhantom,
      reifiedTypeArgs: [P],
      fromFields: (fields: Record<string, any>) =>
        CheckIn.fromFields(P, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        CheckIn.fromFieldsWithTypes(P, item),
      fromBcs: (data: Uint8Array) => CheckIn.fromBcs(P, data),
      bcs: CheckIn.bcs,
      fromJSONField: (field: any) => CheckIn.fromJSONField(P, field),
      fromJSON: (json: Record<string, any>) => CheckIn.fromJSON(P, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        CheckIn.fromSuiParsedData(P, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        CheckIn.fromSuiObjectData(P, content),
      fetch: async (client: SuiClient, id: string) =>
        CheckIn.fetch(client, P, id),
      new: (fields: CheckInFields<ToPhantomTypeArgument<P>>) => {
        return new CheckIn([extractType(P)], fields);
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return CheckIn.reified;
  }

  static phantom<P extends PhantomReified<PhantomTypeArgument>>(
    P: P,
  ): PhantomReified<ToTypeStr<CheckIn<ToPhantomTypeArgument<P>>>> {
    return phantom(CheckIn.reified(P));
  }
  static get p() {
    return CheckIn.phantom;
  }

  static get bcs() {
    return bcs.struct("CheckIn", {
      center_id: ID.bcs,
      proof_id: ID.bcs,
      token_type: String.bcs,
      reward_type: String.bcs,
      voting_weight: bcs.u64(),
    });
  }

  static fromFields<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    fields: Record<string, any>,
  ): CheckIn<ToPhantomTypeArgument<P>> {
    return CheckIn.reified(typeArg).new({
      centerId: decodeFromFields(ID.reified(), fields.center_id),
      proofId: decodeFromFields(ID.reified(), fields.proof_id),
      tokenType: decodeFromFields(String.reified(), fields.token_type),
      rewardType: decodeFromFields(String.reified(), fields.reward_type),
      votingWeight: decodeFromFields("u64", fields.voting_weight),
    });
  }

  static fromFieldsWithTypes<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    item: FieldsWithTypes,
  ): CheckIn<ToPhantomTypeArgument<P>> {
    if (!isCheckIn(item.type)) {
      throw new Error("not a CheckIn type");
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg]);

    return CheckIn.reified(typeArg).new({
      centerId: decodeFromFieldsWithTypes(ID.reified(), item.fields.center_id),
      proofId: decodeFromFieldsWithTypes(ID.reified(), item.fields.proof_id),
      tokenType: decodeFromFieldsWithTypes(
        String.reified(),
        item.fields.token_type,
      ),
      rewardType: decodeFromFieldsWithTypes(
        String.reified(),
        item.fields.reward_type,
      ),
      votingWeight: decodeFromFieldsWithTypes("u64", item.fields.voting_weight),
    });
  }

  static fromBcs<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    data: Uint8Array,
  ): CheckIn<ToPhantomTypeArgument<P>> {
    return CheckIn.fromFields(typeArg, CheckIn.bcs.parse(data));
  }

  toJSONField() {
    return {
      centerId: this.centerId,
      proofId: this.proofId,
      tokenType: this.tokenType,
      rewardType: this.rewardType,
      votingWeight: this.votingWeight.toString(),
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    field: any,
  ): CheckIn<ToPhantomTypeArgument<P>> {
    return CheckIn.reified(typeArg).new({
      centerId: decodeFromJSONField(ID.reified(), field.centerId),
      proofId: decodeFromJSONField(ID.reified(), field.proofId),
      tokenType: decodeFromJSONField(String.reified(), field.tokenType),
      rewardType: decodeFromJSONField(String.reified(), field.rewardType),
      votingWeight: decodeFromJSONField("u64", field.votingWeight),
    });
  }

  static fromJSON<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    json: Record<string, any>,
  ): CheckIn<ToPhantomTypeArgument<P>> {
    if (json.$typeName !== CheckIn.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(CheckIn.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg],
    );

    return CheckIn.fromJSONField(typeArg, json);
  }

  static fromSuiParsedData<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    content: SuiParsedData,
  ): CheckIn<ToPhantomTypeArgument<P>> {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isCheckIn(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a CheckIn object`,
      );
    }
    return CheckIn.fromFieldsWithTypes(typeArg, content);
  }

  static fromSuiObjectData<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    data: SuiObjectData,
  ): CheckIn<ToPhantomTypeArgument<P>> {
    if (data.bcs) {
      if (data.bcs.dataType !== "moveObject" || !isCheckIn(data.bcs.type)) {
        throw new Error(`object at is not a CheckIn object`);
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs;
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`,
        );
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0]);
      const expectedTypeArg = compressSuiType(extractType(typeArg));
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        );
      }

      return CheckIn.fromBcs(typeArg, fromB64(data.bcs.bcsBytes));
    }
    if (data.content) {
      return CheckIn.fromSuiParsedData(typeArg, data.content);
    }
    throw new Error(
      "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.",
    );
  }

  static async fetch<P extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: P,
    id: string,
  ): Promise<CheckIn<ToPhantomTypeArgument<P>>> {
    const res = await client.getObject({ id, options: { showBcs: true } });
    if (res.error) {
      throw new Error(
        `error fetching CheckIn object at id ${id}: ${res.error.code}`,
      );
    }
    if (
      res.data?.bcs?.dataType !== "moveObject" ||
      !isCheckIn(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a CheckIn object`);
    }

    return CheckIn.fromSuiObjectData(typeArg, res.data);
  }
}

/* ============================== Claim =============================== */

export function isClaim(type: string): boolean {
  type = compressSuiType(type);
  return type.startsWith(`${PKG_V1}::reward_center::Claim` + "<");
}

export interface ClaimFields<P extends PhantomTypeArgument> {
  centerId: ToField<ID>;
  proofId: ToField<ID>;
  tokenType: ToField<String>;
  rewardType: ToField<String>;
  amount: ToField<"u64">;
}

export type ClaimReified<P extends PhantomTypeArgument> = Reified<
  Claim<P>,
  ClaimFields<P>
>;

export class Claim<P extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const;

  static readonly $typeName = `${PKG_V1}::reward_center::Claim`;
  static readonly $numTypeParams = 1;
  static readonly $isPhantom = [true] as const;

  readonly $typeName = Claim.$typeName;
  readonly $fullTypeName: `${typeof PKG_V1}::reward_center::Claim<${PhantomToTypeStr<P>}>`;
  readonly $typeArgs: [PhantomToTypeStr<P>];
  readonly $isPhantom = Claim.$isPhantom;

  readonly centerId: ToField<ID>;
  readonly proofId: ToField<ID>;
  readonly tokenType: ToField<String>;
  readonly rewardType: ToField<String>;
  readonly amount: ToField<"u64">;

  private constructor(typeArgs: [PhantomToTypeStr<P>], fields: ClaimFields<P>) {
    this.$fullTypeName = composeSuiType(
      Claim.$typeName,
      ...typeArgs,
    ) as `${typeof PKG_V1}::reward_center::Claim<${PhantomToTypeStr<P>}>`;
    this.$typeArgs = typeArgs;

    this.centerId = fields.centerId;
    this.proofId = fields.proofId;
    this.tokenType = fields.tokenType;
    this.rewardType = fields.rewardType;
    this.amount = fields.amount;
  }

  static reified<P extends PhantomReified<PhantomTypeArgument>>(
    P: P,
  ): ClaimReified<ToPhantomTypeArgument<P>> {
    return {
      typeName: Claim.$typeName,
      fullTypeName: composeSuiType(
        Claim.$typeName,
        ...[extractType(P)],
      ) as `${typeof PKG_V1}::reward_center::Claim<${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`,
      typeArgs: [extractType(P)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<P>>,
      ],
      isPhantom: Claim.$isPhantom,
      reifiedTypeArgs: [P],
      fromFields: (fields: Record<string, any>) => Claim.fromFields(P, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        Claim.fromFieldsWithTypes(P, item),
      fromBcs: (data: Uint8Array) => Claim.fromBcs(P, data),
      bcs: Claim.bcs,
      fromJSONField: (field: any) => Claim.fromJSONField(P, field),
      fromJSON: (json: Record<string, any>) => Claim.fromJSON(P, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        Claim.fromSuiParsedData(P, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        Claim.fromSuiObjectData(P, content),
      fetch: async (client: SuiClient, id: string) =>
        Claim.fetch(client, P, id),
      new: (fields: ClaimFields<ToPhantomTypeArgument<P>>) => {
        return new Claim([extractType(P)], fields);
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return Claim.reified;
  }

  static phantom<P extends PhantomReified<PhantomTypeArgument>>(
    P: P,
  ): PhantomReified<ToTypeStr<Claim<ToPhantomTypeArgument<P>>>> {
    return phantom(Claim.reified(P));
  }
  static get p() {
    return Claim.phantom;
  }

  static get bcs() {
    return bcs.struct("Claim", {
      center_id: ID.bcs,
      proof_id: ID.bcs,
      token_type: String.bcs,
      reward_type: String.bcs,
      amount: bcs.u64(),
    });
  }

  static fromFields<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    fields: Record<string, any>,
  ): Claim<ToPhantomTypeArgument<P>> {
    return Claim.reified(typeArg).new({
      centerId: decodeFromFields(ID.reified(), fields.center_id),
      proofId: decodeFromFields(ID.reified(), fields.proof_id),
      tokenType: decodeFromFields(String.reified(), fields.token_type),
      rewardType: decodeFromFields(String.reified(), fields.reward_type),
      amount: decodeFromFields("u64", fields.amount),
    });
  }

  static fromFieldsWithTypes<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    item: FieldsWithTypes,
  ): Claim<ToPhantomTypeArgument<P>> {
    if (!isClaim(item.type)) {
      throw new Error("not a Claim type");
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg]);

    return Claim.reified(typeArg).new({
      centerId: decodeFromFieldsWithTypes(ID.reified(), item.fields.center_id),
      proofId: decodeFromFieldsWithTypes(ID.reified(), item.fields.proof_id),
      tokenType: decodeFromFieldsWithTypes(
        String.reified(),
        item.fields.token_type,
      ),
      rewardType: decodeFromFieldsWithTypes(
        String.reified(),
        item.fields.reward_type,
      ),
      amount: decodeFromFieldsWithTypes("u64", item.fields.amount),
    });
  }

  static fromBcs<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    data: Uint8Array,
  ): Claim<ToPhantomTypeArgument<P>> {
    return Claim.fromFields(typeArg, Claim.bcs.parse(data));
  }

  toJSONField() {
    return {
      centerId: this.centerId,
      proofId: this.proofId,
      tokenType: this.tokenType,
      rewardType: this.rewardType,
      amount: this.amount.toString(),
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    field: any,
  ): Claim<ToPhantomTypeArgument<P>> {
    return Claim.reified(typeArg).new({
      centerId: decodeFromJSONField(ID.reified(), field.centerId),
      proofId: decodeFromJSONField(ID.reified(), field.proofId),
      tokenType: decodeFromJSONField(String.reified(), field.tokenType),
      rewardType: decodeFromJSONField(String.reified(), field.rewardType),
      amount: decodeFromJSONField("u64", field.amount),
    });
  }

  static fromJSON<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    json: Record<string, any>,
  ): Claim<ToPhantomTypeArgument<P>> {
    if (json.$typeName !== Claim.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Claim.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg],
    );

    return Claim.fromJSONField(typeArg, json);
  }

  static fromSuiParsedData<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    content: SuiParsedData,
  ): Claim<ToPhantomTypeArgument<P>> {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isClaim(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a Claim object`,
      );
    }
    return Claim.fromFieldsWithTypes(typeArg, content);
  }

  static fromSuiObjectData<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    data: SuiObjectData,
  ): Claim<ToPhantomTypeArgument<P>> {
    if (data.bcs) {
      if (data.bcs.dataType !== "moveObject" || !isClaim(data.bcs.type)) {
        throw new Error(`object at is not a Claim object`);
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs;
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`,
        );
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0]);
      const expectedTypeArg = compressSuiType(extractType(typeArg));
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        );
      }

      return Claim.fromBcs(typeArg, fromB64(data.bcs.bcsBytes));
    }
    if (data.content) {
      return Claim.fromSuiParsedData(typeArg, data.content);
    }
    throw new Error(
      "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.",
    );
  }

  static async fetch<P extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: P,
    id: string,
  ): Promise<Claim<ToPhantomTypeArgument<P>>> {
    const res = await client.getObject({ id, options: { showBcs: true } });
    if (res.error) {
      throw new Error(
        `error fetching Claim object at id ${id}: ${res.error.code}`,
      );
    }
    if (
      res.data?.bcs?.dataType !== "moveObject" ||
      !isClaim(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a Claim object`);
    }

    return Claim.fromSuiObjectData(typeArg, res.data);
  }
}

/* ============================== NewCenter =============================== */

export function isNewCenter(type: string): boolean {
  type = compressSuiType(type);
  return type.startsWith(`${PKG_V1}::reward_center::NewCenter` + "<");
}

export interface NewCenterFields<P extends PhantomTypeArgument> {
  centerId: ToField<ID>;
  tokenType: ToField<String>;
  rewardType: ToField<String>;
  claimable: ToField<"bool">;
  offset: ToField<"u64">;
}

export type NewCenterReified<P extends PhantomTypeArgument> = Reified<
  NewCenter<P>,
  NewCenterFields<P>
>;

export class NewCenter<P extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const;

  static readonly $typeName = `${PKG_V1}::reward_center::NewCenter`;
  static readonly $numTypeParams = 1;
  static readonly $isPhantom = [true] as const;

  readonly $typeName = NewCenter.$typeName;
  readonly $fullTypeName: `${typeof PKG_V1}::reward_center::NewCenter<${PhantomToTypeStr<P>}>`;
  readonly $typeArgs: [PhantomToTypeStr<P>];
  readonly $isPhantom = NewCenter.$isPhantom;

  readonly centerId: ToField<ID>;
  readonly tokenType: ToField<String>;
  readonly rewardType: ToField<String>;
  readonly claimable: ToField<"bool">;
  readonly offset: ToField<"u64">;

  private constructor(
    typeArgs: [PhantomToTypeStr<P>],
    fields: NewCenterFields<P>,
  ) {
    this.$fullTypeName = composeSuiType(
      NewCenter.$typeName,
      ...typeArgs,
    ) as `${typeof PKG_V1}::reward_center::NewCenter<${PhantomToTypeStr<P>}>`;
    this.$typeArgs = typeArgs;

    this.centerId = fields.centerId;
    this.tokenType = fields.tokenType;
    this.rewardType = fields.rewardType;
    this.claimable = fields.claimable;
    this.offset = fields.offset;
  }

  static reified<P extends PhantomReified<PhantomTypeArgument>>(
    P: P,
  ): NewCenterReified<ToPhantomTypeArgument<P>> {
    return {
      typeName: NewCenter.$typeName,
      fullTypeName: composeSuiType(
        NewCenter.$typeName,
        ...[extractType(P)],
      ) as `${typeof PKG_V1}::reward_center::NewCenter<${PhantomToTypeStr<ToPhantomTypeArgument<P>>}>`,
      typeArgs: [extractType(P)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<P>>,
      ],
      isPhantom: NewCenter.$isPhantom,
      reifiedTypeArgs: [P],
      fromFields: (fields: Record<string, any>) =>
        NewCenter.fromFields(P, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        NewCenter.fromFieldsWithTypes(P, item),
      fromBcs: (data: Uint8Array) => NewCenter.fromBcs(P, data),
      bcs: NewCenter.bcs,
      fromJSONField: (field: any) => NewCenter.fromJSONField(P, field),
      fromJSON: (json: Record<string, any>) => NewCenter.fromJSON(P, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        NewCenter.fromSuiParsedData(P, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        NewCenter.fromSuiObjectData(P, content),
      fetch: async (client: SuiClient, id: string) =>
        NewCenter.fetch(client, P, id),
      new: (fields: NewCenterFields<ToPhantomTypeArgument<P>>) => {
        return new NewCenter([extractType(P)], fields);
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return NewCenter.reified;
  }

  static phantom<P extends PhantomReified<PhantomTypeArgument>>(
    P: P,
  ): PhantomReified<ToTypeStr<NewCenter<ToPhantomTypeArgument<P>>>> {
    return phantom(NewCenter.reified(P));
  }
  static get p() {
    return NewCenter.phantom;
  }

  static get bcs() {
    return bcs.struct("NewCenter", {
      center_id: ID.bcs,
      token_type: String.bcs,
      reward_type: String.bcs,
      claimable: bcs.bool(),
      offset: bcs.u64(),
    });
  }

  static fromFields<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    fields: Record<string, any>,
  ): NewCenter<ToPhantomTypeArgument<P>> {
    return NewCenter.reified(typeArg).new({
      centerId: decodeFromFields(ID.reified(), fields.center_id),
      tokenType: decodeFromFields(String.reified(), fields.token_type),
      rewardType: decodeFromFields(String.reified(), fields.reward_type),
      claimable: decodeFromFields("bool", fields.claimable),
      offset: decodeFromFields("u64", fields.offset),
    });
  }

  static fromFieldsWithTypes<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    item: FieldsWithTypes,
  ): NewCenter<ToPhantomTypeArgument<P>> {
    if (!isNewCenter(item.type)) {
      throw new Error("not a NewCenter type");
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg]);

    return NewCenter.reified(typeArg).new({
      centerId: decodeFromFieldsWithTypes(ID.reified(), item.fields.center_id),
      tokenType: decodeFromFieldsWithTypes(
        String.reified(),
        item.fields.token_type,
      ),
      rewardType: decodeFromFieldsWithTypes(
        String.reified(),
        item.fields.reward_type,
      ),
      claimable: decodeFromFieldsWithTypes("bool", item.fields.claimable),
      offset: decodeFromFieldsWithTypes("u64", item.fields.offset),
    });
  }

  static fromBcs<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    data: Uint8Array,
  ): NewCenter<ToPhantomTypeArgument<P>> {
    return NewCenter.fromFields(typeArg, NewCenter.bcs.parse(data));
  }

  toJSONField() {
    return {
      centerId: this.centerId,
      tokenType: this.tokenType,
      rewardType: this.rewardType,
      claimable: this.claimable,
      offset: this.offset.toString(),
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    field: any,
  ): NewCenter<ToPhantomTypeArgument<P>> {
    return NewCenter.reified(typeArg).new({
      centerId: decodeFromJSONField(ID.reified(), field.centerId),
      tokenType: decodeFromJSONField(String.reified(), field.tokenType),
      rewardType: decodeFromJSONField(String.reified(), field.rewardType),
      claimable: decodeFromJSONField("bool", field.claimable),
      offset: decodeFromJSONField("u64", field.offset),
    });
  }

  static fromJSON<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    json: Record<string, any>,
  ): NewCenter<ToPhantomTypeArgument<P>> {
    if (json.$typeName !== NewCenter.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(NewCenter.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg],
    );

    return NewCenter.fromJSONField(typeArg, json);
  }

  static fromSuiParsedData<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    content: SuiParsedData,
  ): NewCenter<ToPhantomTypeArgument<P>> {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isNewCenter(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a NewCenter object`,
      );
    }
    return NewCenter.fromFieldsWithTypes(typeArg, content);
  }

  static fromSuiObjectData<P extends PhantomReified<PhantomTypeArgument>>(
    typeArg: P,
    data: SuiObjectData,
  ): NewCenter<ToPhantomTypeArgument<P>> {
    if (data.bcs) {
      if (data.bcs.dataType !== "moveObject" || !isNewCenter(data.bcs.type)) {
        throw new Error(`object at is not a NewCenter object`);
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs;
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`,
        );
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0]);
      const expectedTypeArg = compressSuiType(extractType(typeArg));
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        );
      }

      return NewCenter.fromBcs(typeArg, fromB64(data.bcs.bcsBytes));
    }
    if (data.content) {
      return NewCenter.fromSuiParsedData(typeArg, data.content);
    }
    throw new Error(
      "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.",
    );
  }

  static async fetch<P extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: P,
    id: string,
  ): Promise<NewCenter<ToPhantomTypeArgument<P>>> {
    const res = await client.getObject({ id, options: { showBcs: true } });
    if (res.error) {
      throw new Error(
        `error fetching NewCenter object at id ${id}: ${res.error.code}`,
      );
    }
    if (
      res.data?.bcs?.dataType !== "moveObject" ||
      !isNewCenter(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a NewCenter object`);
    }

    return NewCenter.fromSuiObjectData(typeArg, res.data);
  }
}

/* ============================== RewardCenter =============================== */

export function isRewardCenter(type: string): boolean {
  type = compressSuiType(type);
  return type.startsWith(`${PKG_V1}::reward_center::RewardCenter` + "<");
}

export interface RewardCenterFields<
  T extends PhantomTypeArgument,
  P extends PhantomTypeArgument,
  R extends PhantomTypeArgument,
> {
  id: ToField<UID>;
  versions: ToField<VecSet<"u64">>;
  claimable: ToField<"bool">;
  votingStates: ToField<Table<"u64", ToPhantom<RewardState<R>>>>;
  lastClaimed: ToField<Table<ToPhantom<ID>, "u64">>;
  offset: ToField<"u64">;
  startEpoch: ToField<"u64">;
}

export type RewardCenterReified<
  T extends PhantomTypeArgument,
  P extends PhantomTypeArgument,
  R extends PhantomTypeArgument,
> = Reified<RewardCenter<T, P, R>, RewardCenterFields<T, P, R>>;

export class RewardCenter<
  T extends PhantomTypeArgument,
  P extends PhantomTypeArgument,
  R extends PhantomTypeArgument,
> implements StructClass
{
  __StructClass = true as const;

  static readonly $typeName = `${PKG_V1}::reward_center::RewardCenter`;
  static readonly $numTypeParams = 3;
  static readonly $isPhantom = [true, true, true] as const;

  readonly $typeName = RewardCenter.$typeName;
  readonly $fullTypeName: `${typeof PKG_V1}::reward_center::RewardCenter<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}, ${PhantomToTypeStr<R>}>`;
  readonly $typeArgs: [
    PhantomToTypeStr<T>,
    PhantomToTypeStr<P>,
    PhantomToTypeStr<R>,
  ];
  readonly $isPhantom = RewardCenter.$isPhantom;

  readonly id: ToField<UID>;
  readonly versions: ToField<VecSet<"u64">>;
  readonly claimable: ToField<"bool">;
  readonly votingStates: ToField<Table<"u64", ToPhantom<RewardState<R>>>>;
  readonly lastClaimed: ToField<Table<ToPhantom<ID>, "u64">>;
  readonly offset: ToField<"u64">;
  readonly startEpoch: ToField<"u64">;

  private constructor(
    typeArgs: [PhantomToTypeStr<T>, PhantomToTypeStr<P>, PhantomToTypeStr<R>],
    fields: RewardCenterFields<T, P, R>,
  ) {
    this.$fullTypeName = composeSuiType(
      RewardCenter.$typeName,
      ...typeArgs,
    ) as `${typeof PKG_V1}::reward_center::RewardCenter<${PhantomToTypeStr<T>}, ${PhantomToTypeStr<P>}, ${PhantomToTypeStr<R>}>`;
    this.$typeArgs = typeArgs;

    this.id = fields.id;
    this.versions = fields.versions;
    this.claimable = fields.claimable;
    this.votingStates = fields.votingStates;
    this.lastClaimed = fields.lastClaimed;
    this.offset = fields.offset;
    this.startEpoch = fields.startEpoch;
  }

  static reified<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    T: T,
    P: P,
    R: R,
  ): RewardCenterReified<
    ToPhantomTypeArgument<T>,
    ToPhantomTypeArgument<P>,
    ToPhantomTypeArgument<R>
  > {
    return {
      typeName: RewardCenter.$typeName,
      fullTypeName: composeSuiType(
        RewardCenter.$typeName,
        ...[extractType(T), extractType(P), extractType(R)],
      ) as `${typeof PKG_V1}::reward_center::RewardCenter<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<P>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`,
      typeArgs: [extractType(T), extractType(P), extractType(R)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<T>>,
        PhantomToTypeStr<ToPhantomTypeArgument<P>>,
        PhantomToTypeStr<ToPhantomTypeArgument<R>>,
      ],
      isPhantom: RewardCenter.$isPhantom,
      reifiedTypeArgs: [T, P, R],
      fromFields: (fields: Record<string, any>) =>
        RewardCenter.fromFields([T, P, R], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        RewardCenter.fromFieldsWithTypes([T, P, R], item),
      fromBcs: (data: Uint8Array) => RewardCenter.fromBcs([T, P, R], data),
      bcs: RewardCenter.bcs,
      fromJSONField: (field: any) =>
        RewardCenter.fromJSONField([T, P, R], field),
      fromJSON: (json: Record<string, any>) =>
        RewardCenter.fromJSON([T, P, R], json),
      fromSuiParsedData: (content: SuiParsedData) =>
        RewardCenter.fromSuiParsedData([T, P, R], content),
      fromSuiObjectData: (content: SuiObjectData) =>
        RewardCenter.fromSuiObjectData([T, P, R], content),
      fetch: async (client: SuiClient, id: string) =>
        RewardCenter.fetch(client, [T, P, R], id),
      new: (
        fields: RewardCenterFields<
          ToPhantomTypeArgument<T>,
          ToPhantomTypeArgument<P>,
          ToPhantomTypeArgument<R>
        >,
      ) => {
        return new RewardCenter(
          [extractType(T), extractType(P), extractType(R)],
          fields,
        );
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return RewardCenter.reified;
  }

  static phantom<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    T: T,
    P: P,
    R: R,
  ): PhantomReified<
    ToTypeStr<
      RewardCenter<
        ToPhantomTypeArgument<T>,
        ToPhantomTypeArgument<P>,
        ToPhantomTypeArgument<R>
      >
    >
  > {
    return phantom(RewardCenter.reified(T, P, R));
  }
  static get p() {
    return RewardCenter.phantom;
  }

  static get bcs() {
    return bcs.struct("RewardCenter", {
      id: UID.bcs,
      versions: VecSet.bcs(bcs.u64()),
      claimable: bcs.bool(),
      voting_states: Table.bcs,
      last_claimed: Table.bcs,
      offset: bcs.u64(),
      start_epoch: bcs.u64(),
    });
  }

  static fromFields<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, P, R],
    fields: Record<string, any>,
  ): RewardCenter<
    ToPhantomTypeArgument<T>,
    ToPhantomTypeArgument<P>,
    ToPhantomTypeArgument<R>
  > {
    return RewardCenter.reified(typeArgs[0], typeArgs[1], typeArgs[2]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      versions: decodeFromFields(VecSet.reified("u64"), fields.versions),
      claimable: decodeFromFields("bool", fields.claimable),
      votingStates: decodeFromFields(
        Table.reified(
          reified.phantom("u64"),
          reified.phantom(RewardState.reified(typeArgs[2])),
        ),
        fields.voting_states,
      ),
      lastClaimed: decodeFromFields(
        Table.reified(reified.phantom(ID.reified()), reified.phantom("u64")),
        fields.last_claimed,
      ),
      offset: decodeFromFields("u64", fields.offset),
      startEpoch: decodeFromFields("u64", fields.start_epoch),
    });
  }

  static fromFieldsWithTypes<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, P, R],
    item: FieldsWithTypes,
  ): RewardCenter<
    ToPhantomTypeArgument<T>,
    ToPhantomTypeArgument<P>,
    ToPhantomTypeArgument<R>
  > {
    if (!isRewardCenter(item.type)) {
      throw new Error("not a RewardCenter type");
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs);

    return RewardCenter.reified(typeArgs[0], typeArgs[1], typeArgs[2]).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      versions: decodeFromFieldsWithTypes(
        VecSet.reified("u64"),
        item.fields.versions,
      ),
      claimable: decodeFromFieldsWithTypes("bool", item.fields.claimable),
      votingStates: decodeFromFieldsWithTypes(
        Table.reified(
          reified.phantom("u64"),
          reified.phantom(RewardState.reified(typeArgs[2])),
        ),
        item.fields.voting_states,
      ),
      lastClaimed: decodeFromFieldsWithTypes(
        Table.reified(reified.phantom(ID.reified()), reified.phantom("u64")),
        item.fields.last_claimed,
      ),
      offset: decodeFromFieldsWithTypes("u64", item.fields.offset),
      startEpoch: decodeFromFieldsWithTypes("u64", item.fields.start_epoch),
    });
  }

  static fromBcs<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, P, R],
    data: Uint8Array,
  ): RewardCenter<
    ToPhantomTypeArgument<T>,
    ToPhantomTypeArgument<P>,
    ToPhantomTypeArgument<R>
  > {
    return RewardCenter.fromFields(typeArgs, RewardCenter.bcs.parse(data));
  }

  toJSONField() {
    return {
      id: this.id,
      versions: this.versions.toJSONField(),
      claimable: this.claimable,
      votingStates: this.votingStates.toJSONField(),
      lastClaimed: this.lastClaimed.toJSONField(),
      offset: this.offset.toString(),
      startEpoch: this.startEpoch.toString(),
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, P, R],
    field: any,
  ): RewardCenter<
    ToPhantomTypeArgument<T>,
    ToPhantomTypeArgument<P>,
    ToPhantomTypeArgument<R>
  > {
    return RewardCenter.reified(typeArgs[0], typeArgs[1], typeArgs[2]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      versions: decodeFromJSONField(VecSet.reified("u64"), field.versions),
      claimable: decodeFromJSONField("bool", field.claimable),
      votingStates: decodeFromJSONField(
        Table.reified(
          reified.phantom("u64"),
          reified.phantom(RewardState.reified(typeArgs[2])),
        ),
        field.votingStates,
      ),
      lastClaimed: decodeFromJSONField(
        Table.reified(reified.phantom(ID.reified()), reified.phantom("u64")),
        field.lastClaimed,
      ),
      offset: decodeFromJSONField("u64", field.offset),
      startEpoch: decodeFromJSONField("u64", field.startEpoch),
    });
  }

  static fromJSON<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, P, R],
    json: Record<string, any>,
  ): RewardCenter<
    ToPhantomTypeArgument<T>,
    ToPhantomTypeArgument<P>,
    ToPhantomTypeArgument<R>
  > {
    if (json.$typeName !== RewardCenter.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(RewardCenter.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs,
    );

    return RewardCenter.fromJSONField(typeArgs, json);
  }

  static fromSuiParsedData<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, P, R],
    content: SuiParsedData,
  ): RewardCenter<
    ToPhantomTypeArgument<T>,
    ToPhantomTypeArgument<P>,
    ToPhantomTypeArgument<R>
  > {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isRewardCenter(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a RewardCenter object`,
      );
    }
    return RewardCenter.fromFieldsWithTypes(typeArgs, content);
  }

  static fromSuiObjectData<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, P, R],
    data: SuiObjectData,
  ): RewardCenter<
    ToPhantomTypeArgument<T>,
    ToPhantomTypeArgument<P>,
    ToPhantomTypeArgument<R>
  > {
    if (data.bcs) {
      if (
        data.bcs.dataType !== "moveObject" ||
        !isRewardCenter(data.bcs.type)
      ) {
        throw new Error(`object at is not a RewardCenter object`);
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs;
      if (gotTypeArgs.length !== 3) {
        throw new Error(
          `type argument mismatch: expected 3 type arguments but got ${gotTypeArgs.length}`,
        );
      }
      for (let i = 0; i < 3; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i]);
        const expectedTypeArg = compressSuiType(extractType(typeArgs[i]));
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
          );
        }
      }

      return RewardCenter.fromBcs(typeArgs, fromB64(data.bcs.bcsBytes));
    }
    if (data.content) {
      return RewardCenter.fromSuiParsedData(typeArgs, data.content);
    }
    throw new Error(
      "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.",
    );
  }

  static async fetch<
    T extends PhantomReified<PhantomTypeArgument>,
    P extends PhantomReified<PhantomTypeArgument>,
    R extends PhantomReified<PhantomTypeArgument>,
  >(
    client: SuiClient,
    typeArgs: [T, P, R],
    id: string,
  ): Promise<
    RewardCenter<
      ToPhantomTypeArgument<T>,
      ToPhantomTypeArgument<P>,
      ToPhantomTypeArgument<R>
    >
  > {
    const res = await client.getObject({ id, options: { showBcs: true } });
    if (res.error) {
      throw new Error(
        `error fetching RewardCenter object at id ${id}: ${res.error.code}`,
      );
    }
    if (
      res.data?.bcs?.dataType !== "moveObject" ||
      !isRewardCenter(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a RewardCenter object`);
    }

    return RewardCenter.fromSuiObjectData(typeArgs, res.data);
  }
}

/* ============================== RewardState =============================== */

export function isRewardState(type: string): boolean {
  type = compressSuiType(type);
  return type.startsWith(`${PKG_V1}::reward_center::RewardState` + "<");
}

export interface RewardStateFields<R extends PhantomTypeArgument> {
  totalWeights: ToField<"u64">;
  reward: ToField<Balance<R>>;
  totalRewards: ToField<"u64">;
  votes: ToField<Table<ToPhantom<ID>, "u64">>;
}

export type RewardStateReified<R extends PhantomTypeArgument> = Reified<
  RewardState<R>,
  RewardStateFields<R>
>;

export class RewardState<R extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const;

  static readonly $typeName = `${PKG_V1}::reward_center::RewardState`;
  static readonly $numTypeParams = 1;
  static readonly $isPhantom = [true] as const;

  readonly $typeName = RewardState.$typeName;
  readonly $fullTypeName: `${typeof PKG_V1}::reward_center::RewardState<${PhantomToTypeStr<R>}>`;
  readonly $typeArgs: [PhantomToTypeStr<R>];
  readonly $isPhantom = RewardState.$isPhantom;

  readonly totalWeights: ToField<"u64">;
  readonly reward: ToField<Balance<R>>;
  readonly totalRewards: ToField<"u64">;
  readonly votes: ToField<Table<ToPhantom<ID>, "u64">>;

  private constructor(
    typeArgs: [PhantomToTypeStr<R>],
    fields: RewardStateFields<R>,
  ) {
    this.$fullTypeName = composeSuiType(
      RewardState.$typeName,
      ...typeArgs,
    ) as `${typeof PKG_V1}::reward_center::RewardState<${PhantomToTypeStr<R>}>`;
    this.$typeArgs = typeArgs;

    this.totalWeights = fields.totalWeights;
    this.reward = fields.reward;
    this.totalRewards = fields.totalRewards;
    this.votes = fields.votes;
  }

  static reified<R extends PhantomReified<PhantomTypeArgument>>(
    R: R,
  ): RewardStateReified<ToPhantomTypeArgument<R>> {
    return {
      typeName: RewardState.$typeName,
      fullTypeName: composeSuiType(
        RewardState.$typeName,
        ...[extractType(R)],
      ) as `${typeof PKG_V1}::reward_center::RewardState<${PhantomToTypeStr<ToPhantomTypeArgument<R>>}>`,
      typeArgs: [extractType(R)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<R>>,
      ],
      isPhantom: RewardState.$isPhantom,
      reifiedTypeArgs: [R],
      fromFields: (fields: Record<string, any>) =>
        RewardState.fromFields(R, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        RewardState.fromFieldsWithTypes(R, item),
      fromBcs: (data: Uint8Array) => RewardState.fromBcs(R, data),
      bcs: RewardState.bcs,
      fromJSONField: (field: any) => RewardState.fromJSONField(R, field),
      fromJSON: (json: Record<string, any>) => RewardState.fromJSON(R, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        RewardState.fromSuiParsedData(R, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        RewardState.fromSuiObjectData(R, content),
      fetch: async (client: SuiClient, id: string) =>
        RewardState.fetch(client, R, id),
      new: (fields: RewardStateFields<ToPhantomTypeArgument<R>>) => {
        return new RewardState([extractType(R)], fields);
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return RewardState.reified;
  }

  static phantom<R extends PhantomReified<PhantomTypeArgument>>(
    R: R,
  ): PhantomReified<ToTypeStr<RewardState<ToPhantomTypeArgument<R>>>> {
    return phantom(RewardState.reified(R));
  }
  static get p() {
    return RewardState.phantom;
  }

  static get bcs() {
    return bcs.struct("RewardState", {
      total_weights: bcs.u64(),
      reward: Balance.bcs,
      total_rewards: bcs.u64(),
      votes: Table.bcs,
    });
  }

  static fromFields<R extends PhantomReified<PhantomTypeArgument>>(
    typeArg: R,
    fields: Record<string, any>,
  ): RewardState<ToPhantomTypeArgument<R>> {
    return RewardState.reified(typeArg).new({
      totalWeights: decodeFromFields("u64", fields.total_weights),
      reward: decodeFromFields(Balance.reified(typeArg), fields.reward),
      totalRewards: decodeFromFields("u64", fields.total_rewards),
      votes: decodeFromFields(
        Table.reified(reified.phantom(ID.reified()), reified.phantom("u64")),
        fields.votes,
      ),
    });
  }

  static fromFieldsWithTypes<R extends PhantomReified<PhantomTypeArgument>>(
    typeArg: R,
    item: FieldsWithTypes,
  ): RewardState<ToPhantomTypeArgument<R>> {
    if (!isRewardState(item.type)) {
      throw new Error("not a RewardState type");
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg]);

    return RewardState.reified(typeArg).new({
      totalWeights: decodeFromFieldsWithTypes("u64", item.fields.total_weights),
      reward: decodeFromFieldsWithTypes(
        Balance.reified(typeArg),
        item.fields.reward,
      ),
      totalRewards: decodeFromFieldsWithTypes("u64", item.fields.total_rewards),
      votes: decodeFromFieldsWithTypes(
        Table.reified(reified.phantom(ID.reified()), reified.phantom("u64")),
        item.fields.votes,
      ),
    });
  }

  static fromBcs<R extends PhantomReified<PhantomTypeArgument>>(
    typeArg: R,
    data: Uint8Array,
  ): RewardState<ToPhantomTypeArgument<R>> {
    return RewardState.fromFields(typeArg, RewardState.bcs.parse(data));
  }

  toJSONField() {
    return {
      totalWeights: this.totalWeights.toString(),
      reward: this.reward.toJSONField(),
      totalRewards: this.totalRewards.toString(),
      votes: this.votes.toJSONField(),
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField<R extends PhantomReified<PhantomTypeArgument>>(
    typeArg: R,
    field: any,
  ): RewardState<ToPhantomTypeArgument<R>> {
    return RewardState.reified(typeArg).new({
      totalWeights: decodeFromJSONField("u64", field.totalWeights),
      reward: decodeFromJSONField(Balance.reified(typeArg), field.reward),
      totalRewards: decodeFromJSONField("u64", field.totalRewards),
      votes: decodeFromJSONField(
        Table.reified(reified.phantom(ID.reified()), reified.phantom("u64")),
        field.votes,
      ),
    });
  }

  static fromJSON<R extends PhantomReified<PhantomTypeArgument>>(
    typeArg: R,
    json: Record<string, any>,
  ): RewardState<ToPhantomTypeArgument<R>> {
    if (json.$typeName !== RewardState.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(RewardState.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg],
    );

    return RewardState.fromJSONField(typeArg, json);
  }

  static fromSuiParsedData<R extends PhantomReified<PhantomTypeArgument>>(
    typeArg: R,
    content: SuiParsedData,
  ): RewardState<ToPhantomTypeArgument<R>> {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isRewardState(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a RewardState object`,
      );
    }
    return RewardState.fromFieldsWithTypes(typeArg, content);
  }

  static fromSuiObjectData<R extends PhantomReified<PhantomTypeArgument>>(
    typeArg: R,
    data: SuiObjectData,
  ): RewardState<ToPhantomTypeArgument<R>> {
    if (data.bcs) {
      if (data.bcs.dataType !== "moveObject" || !isRewardState(data.bcs.type)) {
        throw new Error(`object at is not a RewardState object`);
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs;
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`,
        );
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0]);
      const expectedTypeArg = compressSuiType(extractType(typeArg));
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        );
      }

      return RewardState.fromBcs(typeArg, fromB64(data.bcs.bcsBytes));
    }
    if (data.content) {
      return RewardState.fromSuiParsedData(typeArg, data.content);
    }
    throw new Error(
      "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.",
    );
  }

  static async fetch<R extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: R,
    id: string,
  ): Promise<RewardState<ToPhantomTypeArgument<R>>> {
    const res = await client.getObject({ id, options: { showBcs: true } });
    if (res.error) {
      throw new Error(
        `error fetching RewardState object at id ${id}: ${res.error.code}`,
      );
    }
    if (
      res.data?.bcs?.dataType !== "moveObject" ||
      !isRewardState(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a RewardState object`);
    }

    return RewardState.fromSuiObjectData(typeArg, res.data);
  }
}
