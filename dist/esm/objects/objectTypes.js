// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { any, array, assign, bigint, boolean, is, literal, nullable, number, object, optional, record, string, tuple, union, unknown, } from "superstruct";
import { ObjectOwner } from "./common";
export const ObjectType = union([string(), literal("package")]);
export const SuiObjectRef = object({
    /** Base64 string representing the object digest */
    digest: string(),
    /** Hex code as string representing the object id */
    objectId: string(),
    /** Object version */
    version: union([number(), string(), bigint()]),
});
export const OwnedObjectRef = object({
    owner: ObjectOwner,
    reference: SuiObjectRef,
});
export const TransactionEffectsModifiedAtVersions = object({
    objectId: string(),
    sequenceNumber: string(),
});
export const SuiGasData = object({
    payment: array(SuiObjectRef),
    /** Gas Object's owner */
    owner: string(),
    price: string(),
    budget: string(),
});
export const SuiObjectInfo = assign(SuiObjectRef, object({
    type: string(),
    owner: ObjectOwner,
    previousTransaction: string(),
}));
export const ObjectContentFields = record(string(), any());
export const MovePackageContent = record(string(), unknown());
export const SuiMoveObject = object({
    /** Move type (e.g., "0x2::coin::Coin<0x2::sui::SUI>") */
    type: string(),
    /** Fields and values stored inside the Move object */
    fields: ObjectContentFields,
    hasPublicTransfer: boolean(),
});
export const SuiMovePackage = object({
    /** A mapping from module name to disassembled Move bytecode */
    disassembled: MovePackageContent,
});
export const SuiParsedData = union([
    assign(SuiMoveObject, object({ dataType: literal("moveObject") })),
    assign(SuiMovePackage, object({ dataType: literal("package") })),
]);
export const SuiRawMoveObject = object({
    /** Move type (e.g., "0x2::coin::Coin<0x2::sui::SUI>") */
    type: string(),
    hasPublicTransfer: boolean(),
    version: string(),
    bcsBytes: string(),
});
export const SuiRawMovePackage = object({
    id: string(),
    /** A mapping from module name to Move bytecode enocded in base64*/
    moduleMap: record(string(), string()),
});
// TODO(chris): consolidate SuiRawParsedData and SuiRawObject using generics
export const SuiRawData = union([
    assign(SuiRawMoveObject, object({ dataType: literal("moveObject") })),
    assign(SuiRawMovePackage, object({ dataType: literal("package") })),
]);
export const SUI_DECIMALS = 9;
export const MIST_PER_SUI = BigInt(1000000000);
export const SuiObjectResponseError = object({
    code: string(),
    error: optional(string()),
    object_id: optional(string()),
    parent_object_id: optional(string()),
    version: optional(string()),
    digest: optional(string()),
});
export const DisplayFieldsResponse = object({
    data: nullable(optional(record(string(), string()))),
    error: nullable(optional(SuiObjectResponseError)),
});
// TODO: remove after all envs support the new DisplayFieldsResponse;
export const DisplayFieldsBackwardCompatibleResponse = union([
    DisplayFieldsResponse,
    optional(record(string(), string())),
]);
export const SuiObjectData = object({
    objectId: string(),
    version: string(),
    digest: string(),
    /**
     * Type of the object, default to be undefined unless SuiObjectDataOptions.showType is set to true
     */
    type: nullable(optional(string())),
    /**
     * Move object content or package content, default to be undefined unless SuiObjectDataOptions.showContent is set to true
     */
    content: nullable(optional(SuiParsedData)),
    /**
     * Move object content or package content in BCS bytes, default to be undefined unless SuiObjectDataOptions.showBcs is set to true
     */
    bcs: nullable(optional(SuiRawData)),
    /**
     * The owner of this object. Default to be undefined unless SuiObjectDataOptions.showOwner is set to true
     */
    owner: nullable(optional(ObjectOwner)),
    /**
     * The digest of the transaction that created or last mutated this object.
     * Default to be undefined unless SuiObjectDataOptions.showPreviousTransaction is set to true
     */
    previousTransaction: nullable(optional(string())),
    /**
     * The amount of SUI we would rebate if this object gets deleted.
     * This number is re-calculated each time the object is mutated based on
     * the present storage gas price.
     * Default to be undefined unless SuiObjectDataOptions.showStorageRebate is set to true
     */
    storageRebate: nullable(optional(string())),
    /**
     * Display metadata for this object, default to be undefined unless SuiObjectDataOptions.showDisplay is set to true
     * This can also be None if the struct type does not have Display defined
     * See more details in https://forums.sui.io/t/nft-object-display-proposal/4872
     */
    display: nullable(optional(DisplayFieldsBackwardCompatibleResponse)),
});
/**
 * Config for fetching object data
 */
export const SuiObjectDataOptions = object({
    /* Whether to fetch the object type, default to be true */
    showType: nullable(optional(boolean())),
    /* Whether to fetch the object content, default to be false */
    showContent: nullable(optional(boolean())),
    /* Whether to fetch the object content in BCS bytes, default to be false */
    showBcs: nullable(optional(boolean())),
    /* Whether to fetch the object owner, default to be false */
    showOwner: nullable(optional(boolean())),
    /* Whether to fetch the previous transaction digest, default to be false */
    showPreviousTransaction: nullable(optional(boolean())),
    /* Whether to fetch the storage rebate, default to be false */
    showStorageRebate: nullable(optional(boolean())),
    /* Whether to fetch the display metadata, default to be false */
    showDisplay: nullable(optional(boolean())),
});
export const ObjectStatus = union([
    literal("Exists"),
    literal("notExists"),
    literal("Deleted"),
]);
export const GetOwnedObjectsResponse = array(SuiObjectInfo);
export const SuiObjectResponse = object({
    data: nullable(optional(SuiObjectData)),
    error: nullable(optional(SuiObjectResponseError)),
});
/* -------------------------------------------------------------------------- */
/*                              Helper functions                              */
/* -------------------------------------------------------------------------- */
/* -------------------------- SuiObjectResponse ------------------------- */
export function getSuiObjectData(resp) {
    return resp.data;
}
export function getObjectDeletedResponse(resp) {
    if (resp.error &&
        "object_id" in resp.error &&
        "version" in resp.error &&
        "digest" in resp.error) {
        const error = resp.error;
        return {
            objectId: error.object_id,
            version: error.version,
            digest: error.digest,
        };
    }
    return undefined;
}
export function getObjectNotExistsResponse(resp) {
    if (resp.error &&
        "object_id" in resp.error &&
        !("version" in resp.error) &&
        !("digest" in resp.error)) {
        return resp.error.object_id;
    }
    return undefined;
}
export function getObjectReference(resp) {
    if ("reference" in resp) {
        return resp.reference;
    }
    const exists = getSuiObjectData(resp);
    if (exists) {
        return {
            objectId: exists.objectId,
            version: exists.version,
            digest: exists.digest,
        };
    }
    return getObjectDeletedResponse(resp);
}
/* ------------------------------ SuiObjectRef ------------------------------ */
export function getObjectId(data) {
    if ("objectId" in data) {
        return data.objectId;
    }
    return (getObjectReference(data)?.objectId ??
        getObjectNotExistsResponse(data));
}
export function getObjectVersion(data) {
    if ("version" in data) {
        return data.version;
    }
    return getObjectReference(data)?.version;
}
/* -------------------------------- SuiObject ------------------------------- */
export function isSuiObjectResponse(resp) {
    return resp.data !== undefined;
}
/**
 * Deriving the object type from the object response
 * @returns 'package' if the object is a package, move object type(e.g., 0x2::coin::Coin<0x2::sui::SUI>)
 * if the object is a move object
 */
export function getObjectType(resp) {
    const data = isSuiObjectResponse(resp) ? resp.data : resp;
    if (!data?.type && "data" in resp) {
        if (data?.content?.dataType === "package") {
            return "package";
        }
        return getMoveObjectType(resp);
    }
    return data?.type;
}
export function getObjectPreviousTransactionDigest(resp) {
    return getSuiObjectData(resp)?.previousTransaction;
}
export function getObjectOwner(resp) {
    if (is(resp, ObjectOwner)) {
        return resp;
    }
    return getSuiObjectData(resp)?.owner;
}
export function getObjectDisplay(resp) {
    const display = getSuiObjectData(resp)?.display;
    if (!display) {
        return { data: null, error: null };
    }
    if (is(display, DisplayFieldsResponse)) {
        return display;
    }
    return {
        data: display,
        error: null,
    };
}
export function getSharedObjectInitialVersion(resp) {
    const owner = getObjectOwner(resp);
    if (owner && typeof owner === "object" && "Shared" in owner) {
        return owner.Shared.initial_shared_version;
    }
    else {
        return undefined;
    }
}
export function isSharedObject(resp) {
    const owner = getObjectOwner(resp);
    return !!owner && typeof owner === "object" && "Shared" in owner;
}
export function isImmutableObject(resp) {
    const owner = getObjectOwner(resp);
    return owner === "Immutable";
}
export function getMoveObjectType(resp) {
    return getMoveObject(resp)?.type;
}
export function getObjectFields(resp) {
    if ("fields" in resp) {
        return resp.fields;
    }
    return getMoveObject(resp)?.fields;
}
function isSuiObjectDataWithContent(data) {
    return data.content !== undefined;
}
export function getMoveObject(data) {
    const suiObject = "data" in data ? getSuiObjectData(data) : data;
    if (!suiObject ||
        !isSuiObjectDataWithContent(suiObject) ||
        suiObject.content.dataType !== "moveObject") {
        return undefined;
    }
    return suiObject.content;
}
export function hasPublicTransfer(data) {
    return getMoveObject(data)?.hasPublicTransfer ?? false;
}
export function getMovePackageContent(data) {
    if ("disassembled" in data) {
        return data.disassembled;
    }
    const suiObject = getSuiObjectData(data);
    if (suiObject?.content?.dataType !== "package") {
        return undefined;
    }
    return suiObject.content.disassembled;
}
export const CheckpointedObjectId = object({
    objectId: string(),
    atCheckpoint: optional(number()),
});
export const PaginatedObjectsResponse = object({
    data: array(SuiObjectResponse),
    nextCursor: optional(nullable(string())),
    hasNextPage: boolean(),
});
export const ObjectRead = union([
    object({
        details: SuiObjectData,
        status: literal("VersionFound"),
    }),
    object({
        details: string(),
        status: literal("ObjectNotExists"),
    }),
    object({
        details: SuiObjectRef,
        status: literal("ObjectDeleted"),
    }),
    object({
        details: tuple([string(), number()]),
        status: literal("VersionNotFound"),
    }),
    object({
        details: object({
            asked_version: number(),
            latest_version: number(),
            object_id: string(),
        }),
        status: literal("VersionTooHigh"),
    }),
]);
//# sourceMappingURL=objectTypes.js.map