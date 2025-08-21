import { ConfigType, Network } from '@/types/config';

export const PRICE_SERVICE_ENDPOINT = 'https://hermes.pyth.network';

export const CONFIG: Record<Network, ConfigType> = {
  mainnet: {
    ORIGINAL_FRAMEWORK_PACKAGE_ID: '0x89495ef31f30a6edbd08f8a28f4e5419401d2c133c34a617a7983928d5697797',
    ORIGINAL_USDB_PACKAGE_ID: '0x94c1beb34be4677052e1989cc16c4cddf8b97c706532d2136c33df6c2f5656fa',
    ORIGINAL_ORACLE_PACKAGE_ID: '0x28edd31a17aca307ac6a5a83955caab4a65ef4eac9c05dad01515e31a18af6ed',
    ORIGINAL_CDP_PACKAGE_ID: '0xa82cb0dcfa2ac2ccd635e628209775eef382e652f7ee5abd42d00f3de8828053',

    FRAMEWORK_PACKAGE_ID: '0x89495ef31f30a6edbd08f8a28f4e5419401d2c133c34a617a7983928d5697797',
    VUSD_PACKAGE_ID: '0x94c1beb34be4677052e1989cc16c4cddf8b97c706532d2136c33df6c2f5656fa',
    ORACLE_PACKAGE_ID: '0x28edd31a17aca307ac6a5a83955caab4a65ef4eac9c05dad01515e31a18af6ed',
    CDP_PACKAGE_ID: '0xa82cb0dcfa2ac2ccd635e628209775eef382e652f7ee5abd42d00f3de8828053',

    TREASURY_OBJ: {
      objectId: '0xc30d8b29ddca177f3ea934ec885cff4cfa46ae2390c8df3eca6513731e5d8ddd',
      initialSharedVersion: 18178365,
      mutable: true,
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
    },
  },
};
