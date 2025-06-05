export const INITIAL_SUPPLY = 385_000_000;

export const PROTOCOL_OBJECT = '0x959a7135a3e96868aac57bb2ae493db76714815797349384671a62d256b1f6d';

export const BUCKET_PROTOCOL_TYPE =
  '0x3a4b399e18cec6129723c71605378bd554f53eb63afc1039f9af9a067a8847fa::bucket::BUCKET';

export const DETOKEN_CONFIG = {
  dfParentId: {
    whitelistAllocationId: '0xb5100bbea3c46572535d321d5184b9e20937c31254d32b78357e7b3a9ce8f62e',
    publicAllocationId: '0xcc32a1ccea4acc7352a6b3f8a5e40a644bdc7f642e3cb85d91cd5a52a27cb2c1',
  },
  objects: {
    shared: {
      suiButLaunchPad: {
        objectId: '0xc18b789cef41064eef3b87cab5ac1b963f11afd3e5f35125c83511dd692eb52e',
        mutable: true,
        initialSharedVersion: 469686337,
      },
      butDeCenter: {
        objectId: '0xaa5eaa8381b1efb7ccc5f60848a165ef9c3d206de9b7e9dd9313ef6b1ff6b464',
        mutable: true,
        initialSharedVersion: 469686337,
      },
      airdropPool: {
        objectId: '0xd1353e96992475f29da988fec46084d6950e078c0058cae6d434e9f7d2666915',
        mutable: true,
        initialSharedVersion: 469686337,
      },
      rewardCenter: {
        objectId: '0xddb2a941c41fff1cd02ec30c2fb9b5a672f89e3110753fae62572f8f8d7fa0a1',
        mutable: true,
        initialSharedVersion: 482980069,
      },
    },
  },
} as const;

export const VESTING_LOCK_IDS = [
  '0x54eeb012a2414cd3f72bb48af701e40f8219ae120cd33dac633fdf70a4df8171',
  '0x50392f6389a11bdeab06e12f6c1dbe147143d29470b746fbd74df867d36da218',
  '0x9d30eb31ae937f498ae3663f28e4484efded76c89105ae598c7758d3846c4a7f',
  '0xfbf80a562841ecf0f38eec71d00c5e714f931b12ffbd786173c7071e104a5df9',
] as const;
