import { SharedObjectRef } from '@mysten/sui/dist/cjs/bcs/types';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { ConfigType } from '@/types/config';

export type Network = 'mainnet' | 'testnet';

export const PRICE_SERVICE_ENDPOINT = 'https://hermes.pyth.network';
// TODO: to be merged
export const PRICE_SERVICE_TESTNET_ENDPOINT = 'https://hermes-beta.pyth.network';

export const CONFIG: Record<Network, ConfigType> = {
  mainnet: {
    ORIGINAL_FRAMEWORK_PACKAGE_ID: '0x89495ef31f30a6edbd08f8a28f4e5419401d2c133c34a617a7983928d5697797',
    ORIGINAL_USDB_PACKAGE_ID: '0x94c1beb34be4677052e1989cc16c4cddf8b97c706532d2136c33df6c2f5656fa',
    ORIGINAL_ORACLE_PACKAGE_ID: '0x28edd31a17aca307ac6a5a83955caab4a65ef4eac9c05dad01515e31a18af6ed',
    ORIGINAL_CDP_PACKAGE_ID: '0xa82cb0dcfa2ac2ccd635e628209775eef382e652f7ee5abd42d00f3de8828053',
    ORIGINAL_PSM_PACKAGE_ID: '0xa563ace20f247f966b1819909d6cf24a52cc18c2ba14a72890c88d44be066545',
    ORIGINAL_FLASH_PACKAGE_ID: '0x4f3ae969f16389f668debcdc84105025e046d90f4f5b79e5e639b0a47f2c43e4',
    ORIGINAL_SAVING_PACKAGE_ID: '',
    ORIGINAL_SAVING_INCENTIVE_PACKAGE_ID: '',

    FRAMEWORK_PACKAGE_ID: '0x89495ef31f30a6edbd08f8a28f4e5419401d2c133c34a617a7983928d5697797',
    USDB_PACKAGE_ID: '0x94c1beb34be4677052e1989cc16c4cddf8b97c706532d2136c33df6c2f5656fa',
    ORACLE_PACKAGE_ID: '0x28edd31a17aca307ac6a5a83955caab4a65ef4eac9c05dad01515e31a18af6ed',
    CDP_PACKAGE_ID: '0xa82cb0dcfa2ac2ccd635e628209775eef382e652f7ee5abd42d00f3de8828053',
    PSM_PACKAGE_ID: '0xa563ace20f247f966b1819909d6cf24a52cc18c2ba14a72890c88d44be066545',
    FLASH_PACKAGE_ID: '0x4f3ae969f16389f668debcdc84105025e046d90f4f5b79e5e639b0a47f2c43e4',
    SAVING_PACKAGE_ID: '',
    SAVING_INCENTIVE_PACKAGE_ID: '',

    TREASURY_OBJ: {
      objectId: '0xc30d8b29ddca177f3ea934ec885cff4cfa46ae2390c8df3eca6513731e5d8ddd',
      initialSharedVersion: 18178365,
      mutable: true,
    },

    FLASH_GLOBAL_CONFIG_OBJ: {
      objectId: '0x82520bf42d8806bb7adcd3410d6287f5ca34bf2b5c05c57ef8a7ab3092b52e78',
      initialSharedVersion: 610893675,
      mutable: true,
    },

    SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: {
      objectId: '',
      initialSharedVersion: 0,
      mutable: false,
    },

    PYTH_STATE_ID: '0x1f9310238ee9298fb703c3419030b35b22bb1cc37113e3bb5007c99aec79e5b8',
    WORMHOLE_STATE_ID: '0xaeab97f96cf9877fee2883315d459552b2b921edc16d7ceac6eab944dd88919c',
    PYTH_RULE_PACKAGE_ID: '0x855e2f7810fd7acbd470def555c3909ecd72e8dd3bf2989e4c223a455dd1bb33',
    PYTH_RULE_CONFIG_OBJ: {
      objectId: '0xeb3083af696c6c9b104f459ded2060dd6cdb35367d936255cc9e7d4885e0171c',
      initialSharedVersion: 18178367,
      mutable: false,
    },

    VAULT_OBJS: {
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI': {
        vault: {
          objectId: '0x52aed4daa610b787cf2291f1e8e4c96aa46cbfdd90c7f2733d07048041a0730c',
          initialSharedVersion: 18178374,
          mutable: true,
        },
      },
      '0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC': {
        vault: {
          objectId: '0x669949a9dd88e5251bdcb3f94e207ba86fcb708bdc7d187816da5e130783eb07',
          initialSharedVersion: 18178375,
          mutable: true,
        },
      },
      '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL': {
        vault: {
          objectId: '0x290bded45388d998a0ec8feb4cf4e3309f69de5ad13a92acfe0d9d03a7f091d9',
          initialSharedVersion: 18178376,
          mutable: true,
        },
      },
    },

    AGGREGATOR_OBJS: {
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI': {
        priceAggregator: {
          objectId: '0x3f7f16277d5fb7c3075b5237985cf91c2fbd6421c64daf780229b811e2e7058f',
          initialSharedVersion: 18178368,
          mutable: false,
        },
        pythPriceId: '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744',
      },
      '0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC': {
        priceAggregator: {
          objectId: '0xc5b95126d891b1c05ae31754822d88e3976870ea655b8ff081b173c69ac2293e',
          initialSharedVersion: 18178369,
          mutable: false,
        },
        pythPriceId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
      },
      '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL': {
        priceAggregator: {
          objectId: '0x05905d3be7208b59f6b43382ef1dcc509f91d1bfd63fc7078b43e82951455c94',
          initialSharedVersion: 18178370,
          mutable: false,
        },
        pythPriceId: '0xeba0732395fae9dec4bae12e52760b35fc1c5671e2da8b449c9af4efe5d54341',
      },
      '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC': {
        priceAggregator: {
          objectId: '0x13c1f7b9fe0fca2092ab3b4c59aa404dc8b2b277858e9b7a3fb89be9a7723a21',
          initialSharedVersion: 610893664,
          mutable: false,
        },
        pythPriceId: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
      },
      '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT': {
        priceAggregator: {
          objectId: '0x5e5aa6a03a13d28c6ea37157bcc05f073a375eaab233bc1c13df39ffe20c7561',
          initialSharedVersion: 610893672,
          mutable: false,
        },
        pythPriceId: '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
      },
    },
    PSM_POOL_OBJS: {
      '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC': {
        pool: {
          objectId: '0x56671d5a4e69f1b847786ba32b5bcb3a611728f9dd06f992cf9f5f849e81a667',
          initialSharedVersion: '610893670',
          mutable: true,
        },
      },
      '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT': {
        pool: {
          objectId: '0x254f2f21979928b4a14f43804a295dbd858f538084082c4ee68fedceb426b580',
          initialSharedVersion: '610893671',
          mutable: true,
        },
      },
    },
  },
  testnet: {
    ORIGINAL_FRAMEWORK_PACKAGE_ID: '0x070e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63',
    ORIGINAL_USDB_PACKAGE_ID: '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9',
    ORIGINAL_ORACLE_PACKAGE_ID: '0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce',
    ORIGINAL_CDP_PACKAGE_ID: '0x801a162330af18f018022faf93d781e5f2777886cac46c269ba3cc09b808c59a',
    ORIGINAL_PSM_PACKAGE_ID: '0xb818b22a88d614c266c5f4436fb4447dee1c4fba8071c456f864851eb6dd194d',
    ORIGINAL_FLASH_PACKAGE_ID: '0x68d88be9921bd6730a0f1cdfc200a7e9dda6b3e862c0245cd3891511671bcb8c',
    ORIGINAL_SAVING_PACKAGE_ID: '0xf59c363a3af10f51e69c612c5fa01f6500701254043f057e132cdbd27b67d14f',
    ORIGINAL_SAVING_INCENTIVE_PACKAGE_ID: '0x11e03be85d2b5f1ddef785fe1dfa129551f69913c41324ac0cad116031579588',

    FRAMEWORK_PACKAGE_ID: '0x070e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63',
    USDB_PACKAGE_ID: '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9',
    ORACLE_PACKAGE_ID: '0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce',
    CDP_PACKAGE_ID: '0x801a162330af18f018022faf93d781e5f2777886cac46c269ba3cc09b808c59a',
    PSM_PACKAGE_ID: '0xb818b22a88d614c266c5f4436fb4447dee1c4fba8071c456f864851eb6dd194d',
    FLASH_PACKAGE_ID: '0x68d88be9921bd6730a0f1cdfc200a7e9dda6b3e862c0245cd3891511671bcb8c',
    SAVING_PACKAGE_ID: '0xf59c363a3af10f51e69c612c5fa01f6500701254043f057e132cdbd27b67d14f',
    SAVING_INCENTIVE_PACKAGE_ID: '0x11e03be85d2b5f1ddef785fe1dfa129551f69913c41324ac0cad116031579588',

    TREASURY_OBJ: {
      objectId: '0xb1bf430d03abcceed4f64b31ddf71b03bd503bea91ca64e80adaff35b22c7230',
      initialSharedVersion: 349180351,
      mutable: true,
    },

    FLASH_GLOBAL_CONFIG_OBJ: {
      objectId: '0x66c8c42e1ccf2a8eaa50f2584b990418c54349f53470004545e12333ccf1f0fc',
      initialSharedVersion: '349180354',
      mutable: true,
    },

    SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: {
      objectId: '0xdfdfe9c7bdd63113a5c57f3d1c7c425d2b85b73c7ef7d974b98db8584837c5b6',
      initialSharedVersion: 349180418,
      mutable: false,
    },

    PYTH_STATE_ID: '0x2d82612a354f0b7e52809fc2845642911c7190404620cec8688f68808f8800d8',
    WORMHOLE_STATE_ID: '0xebba4cc4d614f7a7cdbe883acc76d1cc767922bc96778e7b68be0d15fce27c02',
    PYTH_RULE_PACKAGE_ID: '0x69f13c07f8cbd9511437448f3bdc91d515465e5a8bf0ea5f94a2eb6ebbecb883',
    PYTH_RULE_CONFIG_OBJ: {
      objectId: '0xd8cc7827b9efc35c4093078b89e726a9d4a2fd56da69f29b3ba8d69e750c72fd',
      initialSharedVersion: '442159460',
      mutable: false,
    },

    AGGREGATOR_OBJS: {
      '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC': {
        priceAggregator: {
          objectId: '0x50bfd18d36bf7a9a24c83d2a16e13eb88b824fd181e71e76acb649fae3143b8a',
          initialSharedVersion: '442159459',
          mutable: true,
        },
        // beta price id
        pythPriceId: '0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722',
      },
    },

    VAULT_OBJS: {},

    PSM_POOL_OBJS: {
      '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC': {
        pool: {
          objectId: '0xdb15a165364d41257412b560487ba2325269e904a29c045ca8f3a8de97d3c6df',
          initialSharedVersion: '442159458',
          mutable: true,
        },
      },
    },
  },
};

// To be refactored
export type SupportedSavingPoolType = 'Allen';
export const TESTNET_SAVING_POOL: Record<
  SupportedSavingPoolType,
  {
    pool: SharedObjectRef;
    coinType: string;
    reward?: {
      rewardManager: SharedObjectRef;
      rewardTypes: string[];
    };
  }
> = {
  Allen: {
    pool: {
      objectId: '0x8a2b3f7e26050c9ed4b9a60d25dfc205e2541b6c05509295769511b0e13b7b25',
      initialSharedVersion: '546822516',
      mutable: true,
    },
    coinType: '0x784660d93d9f013f1c77c4bcb2e04a374fdb4038abf2637c75ca27828b2ac18c::allen_susdb::ALLEN_SUSDB',
    reward: {
      rewardManager: {
        objectId: '0x70d52865febce4e0b5f6c0a53f772f735e178eb03a80d3b764dd3e365a7bf3f1',
        initialSharedVersion: '546934688',
        mutable: true,
      },
      rewardTypes: [SUI_TYPE_ARG],
    },
  },
};
