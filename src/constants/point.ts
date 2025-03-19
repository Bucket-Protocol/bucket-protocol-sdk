import { LockupCoin, SharedObjectRef } from "../types";

export const LOCK_COINS: LockupCoin[] = ["afSUI", "haSUI", "vSUI"];

export const BUCKET_POINT_PACKAGE_ID =
  "0x9c7289341e07dbeb09bbf805ade663a529ea12d4826a63d467f6326b8fd0c13e";

export const BUCKET_POINT_CONFIG_OBJ = {
  objectId:
    "0x89d71e7c0dbd2ce47e0c44df0c1cd65858bbc57304d0392cd0b9389f53ceb5f1",
  initialSharedVersion: "337351213",
  mutable: false,
};

export const LOCKER_MAP: Record<LockupCoin, SharedObjectRef> = {
  afSUI: {
    objectId:
      "0x69550d2439ae19da902c1fa430fe7e3251cf0ddea8af76121f61d705bb95673b",
    initialSharedVersion: "337351217",
    mutable: true,
  },
  haSUI: {
    objectId:
      "0xcae53a48cf09957be981498d1a2bf549f1a548b3c5e85fe9a2c9564207e7b2f0",
    initialSharedVersion: "337351218",
    mutable: true,
  },
  vSUI: {
    objectId:
      "0x0cdc2b47abf0914991a7bac115788c5ace6c2936c7135736e9df87c3e6bb80c3",
    initialSharedVersion: "337351219",
    mutable: true,
  },
  sBUCK: {
    objectId:
      "0xf0ac007f3532c0612a99183160f4bc0d2a41ee9a98013eba1949d753c2d7f6b5",
    initialSharedVersion: "337351220",
    mutable: true,
  },
};

export const LOCKER_TABLE: Partial<Record<LockupCoin, string>> = {
  afSUI: "0x95d0d20ab42f78f75a7d63513ed60415b9dcb41c58ef493a7a69b531b212e713",
  haSUI: "0x3674f3183780166553d42174d02229c679e431b9a5911d02a28271a8fd9abd88",
  vSUI: "0x502760cac10dd4fae78672c1e27bc0e5cdbae449aa2b15dbfb72434af33cb8f6",
};
