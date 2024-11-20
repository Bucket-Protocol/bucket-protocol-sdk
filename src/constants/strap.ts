import { COIN, SharedObjectRef } from "../types";
import { COINS_TYPE_LIST } from "./coin";

export const STRAP_ID = `0xd9162764da404339384fe40487499dc867c3f1fa3eb870381c41a8b41458b0e5::strap::BottleStrap`;

export const STRAP_TYPE_ID =
  "0x5d019c033bb8051fe9631cf910d0f4d077364d64ed4bb1940e98e6dc419a8d59";

export const STAKE_PROOF_ID = `${STRAP_TYPE_ID}::fountain::StakeProof`;

export const STRAP_FOUNTAIN_IDS: Partial<
  Record<COIN, SharedObjectRef & { rewardType: string }>
> = {
  afSUI: {
    objectId:
      "0xcfc2678c5ba0d8f57dc4984b6875988a92d34c55a3bdc47c593710931d128e68",
    initialSharedVersion: "77035444",
    mutable: true,
    rewardType: COINS_TYPE_LIST.SUI,
  },
  vSUI: {
    objectId:
      "0x1f7cc70940fa415fb1af862642ff9791d4376453496d28b95eea01604dc5291f",
    initialSharedVersion: "77035445",
    mutable: true,
    rewardType: COINS_TYPE_LIST.SUI,
  },
  haSUI: {
    objectId:
      "0x07df6066e0a92bfb61f54f0a65f765030c8624849916eed9afbd634840082f5e",
    initialSharedVersion: "77035446",
    mutable: true,
    rewardType: COINS_TYPE_LIST.SUI,
  },
  SCA: {
    objectId:
      "0xde8df1bed9afa9cbdc3ed6f868e5d8bb8819354c181288919692e2d072d71954",
    initialSharedVersion: "406217067",
    mutable: true,
    rewardType: COINS_TYPE_LIST.SCA,
  },
  sUSDC: {
    objectId:
      "0xec596ccd29fee021f22c69147d75836d07d97823d0c9bf95ef40de9eccef4b55",
    initialSharedVersion: "406217068",
    mutable: true,
    rewardType: COINS_TYPE_LIST.SCA,
  },
  sSUI: {
    objectId:
      "0xb818acbf6f2d2c5f18e2c30d3d0ca477dbdfb4d5f5a54e44dd1ac88b9b33a66a",
    initialSharedVersion: "411503873",
    mutable: true,
    rewardType: COINS_TYPE_LIST.SCA,
  },
  sSCA: {
    objectId:
      "0x209a9ef3b719895329eb9ae9311c39e35e89c278593cc3068a7862b48b9f2517",
    initialSharedVersion: "421697128",
    mutable: true,
    rewardType: COINS_TYPE_LIST.SCA,
  },
  swUSDT: {
    objectId:
      "0x77299d4b0ae5b44c6a300721db6fb989b9ac53008cb71fab932f1b6b6ea923c7",
    initialSharedVersion: "421697129",
    mutable: true,
    rewardType: COINS_TYPE_LIST.SCA,
  },
  sSBETH: {
    objectId:
      "0x4ef5c215794459c8a230fb754ed7b58c4ecdb94ec04abe10d819fa5c5ddd7c14",
    initialSharedVersion: "421697130",
    mutable: true,
    rewardType: COINS_TYPE_LIST.SCA,
  },
};
