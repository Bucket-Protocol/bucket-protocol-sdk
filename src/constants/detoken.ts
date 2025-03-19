export const INIT_BUT_PRICE = 0.005;

export const FIRST_CHECK_IN_TIME = new Date("2025-01-27T20:00:00+0800");

export const CHECK_IN_WINDOW_HOURS = 24;

export const MAX_STAKING_WEEKS = 52;

export const BUCKET_PROTOCOL_TYPE =
  "0x3a4b399e18cec6129723c71605378bd554f53eb63afc1039f9af9a067a8847fa::bucket::BUCKET";

export const DROPS_COIN_TYPE =
  "0x1d627cecd34128bd6fe5a067a3a590d0f62fa514fe19d2a20a31205e3d51ea55::drop::DROP";
export const DROPS_COIN_DECIMALS = 9;

export const DETOKEN_CENTER =
  "0x959a7135a3e96868aac57bb2ae493db76714815797349384671a62d256b1f6d";

export const DETOKEN_CONFIG = {
  dfParentId: {
    whitelistAllocationId:
      "0xb5100bbea3c46572535d321d5184b9e20937c31254d32b78357e7b3a9ce8f62e",
    publicAllocationId:
      "0xcc32a1ccea4acc7352a6b3f8a5e40a644bdc7f642e3cb85d91cd5a52a27cb2c1",
  },
  objects: {
    shared: {
      suiButLaunchPad: {
        objectId:
          "0xc18b789cef41064eef3b87cab5ac1b963f11afd3e5f35125c83511dd692eb52e",
        mutable: true,
        initialSharedVersion: 469686337,
      },
      butDeCenter: {
        objectId:
          "0xaa5eaa8381b1efb7ccc5f60848a165ef9c3d206de9b7e9dd9313ef6b1ff6b464",
        mutable: true,
        initialSharedVersion: 469686337,
      },
      airdropPool: {
        objectId:
          "0xd1353e96992475f29da988fec46084d6950e078c0058cae6d434e9f7d2666915",
        mutable: true,
        initialSharedVersion: 469686337,
      },
      rewardCenter: {
        objectId:
          "0xddb2a941c41fff1cd02ec30c2fb9b5a672f89e3110753fae62572f8f8d7fa0a1",
        mutable: true,
        initialSharedVersion: 482980069,
      },
    },
  },
};
