import { ConfigType } from '@/types/config.js';

export type Network = 'mainnet' | 'testnet';

export const CONFIG: Record<Network, ConfigType> = {
  mainnet: {
    PRICE_SERVICE_ENDPOINT: 'https://hermes.pyth.network',
    PYTH_STATE_ID: '0x1f9310238ee9298fb703c3419030b35b22bb1cc37113e3bb5007c99aec79e5b8',
    WORMHOLE_STATE_ID: '0xaeab97f96cf9877fee2883315d459552b2b921edc16d7ceac6eab944dd88919c',
    PYTH_RULE_PACKAGE_ID: '0x5bc4f912b59c5cfcc86dfc90419837b9c3f9d3a3a94cef7a198838fa196bac4a',
    PYTH_RULE_CONFIG_OBJ: {
      objectId: '0x00aea60b799575ae4203bcc80c16844c4d514d5af661200c4565f6d5a6deac1f',
      initialSharedVersion: 610893693,
      mutable: false,
    },

    ORIGINAL_FRAMEWORK_PACKAGE_ID: '0x665188033384920a5bb5dcfb2ef21f54b4568d08b431718b97e02e5c184b92cc',
    ORIGINAL_USDB_PACKAGE_ID: '0xe14726c336e81b32328e92afc37345d159f5b550b09fa92bd43640cfdd0a0cfd',
    ORIGINAL_ORACLE_PACKAGE_ID: '0xf2ab9aa60c5e879675351a1a89f47131de9dea7cc927327dd0e7282e295c7f5e',
    ORIGINAL_CDP_PACKAGE_ID: '0x9f835c21d21f8ce519fec17d679cd38243ef2643ad879e7048ba77374be4036e',
    ORIGINAL_PSM_PACKAGE_ID: '0xc2ae6693383e4a81285136effc8190c7baaf0e75aafa36d1c69cd2170cfc3803',
    ORIGINAL_FLASH_PACKAGE_ID: '0x0f51f9eb63574a1d12b62295599ac4f8231197f95b3cce9a516daba64f419d06',
    ORIGINAL_SAVING_PACKAGE_ID: '0x872d08a70db3db498aa7853276acea8091fdd9871b2d86bc8dcb8524526df622',
    ORIGINAL_SAVING_INCENTIVE_PACKAGE_ID: '0x39692320d6fc01c27315a7972ed4717e4fd32eed43531ad6f55fd7f24b74e207',
    ORIGINAL_BORROW_INCENTIVE_PACKAGE_ID: '0x8cc2eed1b1012881a623e9bafd58ff0f17a8c5f807662631e623acf7779a78ee',

    FRAMEWORK_PACKAGE_ID: '0x665188033384920a5bb5dcfb2ef21f54b4568d08b431718b97e02e5c184b92cc',
    USDB_PACKAGE_ID: '0xe14726c336e81b32328e92afc37345d159f5b550b09fa92bd43640cfdd0a0cfd',
    ORACLE_PACKAGE_ID: '0xf2ab9aa60c5e879675351a1a89f47131de9dea7cc927327dd0e7282e295c7f5e',
    CDP_PACKAGE_ID: '0x9f835c21d21f8ce519fec17d679cd38243ef2643ad879e7048ba77374be4036e',
    PSM_PACKAGE_ID: '0xc2ae6693383e4a81285136effc8190c7baaf0e75aafa36d1c69cd2170cfc3803',
    FLASH_PACKAGE_ID: '0x0f51f9eb63574a1d12b62295599ac4f8231197f95b3cce9a516daba64f419d06',
    SAVING_PACKAGE_ID: '0x5b60c3cdbb9ee31b856f7f8a6d4d6c8b91e3c0036a138fb9927529b05fd00373',
    SAVING_INCENTIVE_PACKAGE_ID: '0x39692320d6fc01c27315a7972ed4717e4fd32eed43531ad6f55fd7f24b74e207',
    BORROW_INCENTIVE_PACKAGE_ID: '0xef9719a3392d3742ae09c42ebf01030d88b1a75651430932be1eb017b79fb372',

    TREASURY_OBJ: {
      objectId: '0x4de1c29a89d6888ebf8f7ae20364571dce4e1e42b9c9221f7df924ad6f9e617d',
      initialSharedVersion: 610893687,
      mutable: true,
    },
    VAULT_REWARDER_REGISTRY: {
      objectId: '0x14c57bf1085babf6e408c0488f2b68443f887e67a43436cadf1b84e5d41f54ba',
      initialSharedVersion: 610893725,
      mutable: false,
    },
    SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: {
      objectId: '0x50ffe3535b157841e9ff0470fff722192c90b86b4dee521de0b27b03b44b20f5',
      initialSharedVersion: 606028576,
      mutable: false,
    },
    FLASH_GLOBAL_CONFIG_OBJ: {
      objectId: '0x4cbc26a7ec49d4bec975768af386cc6ab987a1c29d524566f99d5aa018a99546',
      initialSharedVersion: 610893688,
      mutable: true,
    },

    AGGREGATOR_OBJS: {
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI': {
        priceAggregator: {
          objectId: '0x795e888b88d2cfd5aa5174cba71418e87878c7dd7d1980e5b0b2e51cc499aa53',
          initialSharedVersion: 610893705,
          mutable: false,
        },
        pythPriceId: '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744',
      },
      '0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC': {
        priceAggregator: {
          objectId: '0xe2d05d53e45d47c7e4dc3756eb598afd61dd115d453b2d404f26ed3837883491',
          initialSharedVersion: 610893707,
          mutable: false,
        },
        pythPriceId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
      },
      '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL': {
        priceAggregator: {
          objectId: '0x88ba34137dae007a3b951847aa5ce8be3bdfefcff4b3675aab276b8e0672d68e',
          initialSharedVersion: 610893707,
          mutable: false,
        },
        pythPriceId: '0xeba0732395fae9dec4bae12e52760b35fc1c5671e2da8b449c9af4efe5d54341',
      },
      '0x876a4b7bce8aeaef60464c11f4026903e9afacab79b9b142686158aa86560b50::xbtc::XBTC': {
        priceAggregator: {
          objectId: '0x678e7a51bd5004d9d2dcdcc4d28840a7a3bd713b7f7479b435f4e2802704dfce',
          initialSharedVersion: 610893707,
          mutable: false,
        },
        pythPriceId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
      },
      '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC': {
        priceAggregator: {
          objectId: '0x4b612d4d2039d90f596a362f15346a95149728613ca9d2e2c7e471b72b86c105',
          initialSharedVersion: 610893707,
          mutable: false,
        },
        pythPriceId: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
      },
      '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT': {
        priceAggregator: {
          objectId: '0x75f29f24d1b5839ec9ac95920e54b640980c56468e71dd0eeb65c67e299b7d25',
          initialSharedVersion: 610893707,
          mutable: false,
        },
        pythPriceId: '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
      },
      '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI': {
        priceAggregator: {
          objectId: '0x8201e8138ada9945499db1e74cb86f92d102238b35f7d46f9cfe266426564edc',
          initialSharedVersion: 610893707,
          mutable: false,
        },
        pythPriceId: '0x6120ffcf96395c70aa77e72dcb900bf9d40dccab228efca59a17b90ce423d5e8',
      },
      '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT': {
        priceAggregator: {
          objectId: '0x16b7c7e5aed8dd0f3051655283812d17dec35be30f54cfcb52e72e956dfd9918',
          initialSharedVersion: 610893707,
          mutable: false,
        },
        pythPriceId: '0x57ff7100a282e4af0c91154679c5dae2e5dcacb93fd467ea9cb7e58afdcfde27',
      },
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI': {
        priceAggregator: {
          objectId: '0xd97687812f73f390c762a02abe2d43f7dbc0f725a8f38bfbfeeb29421c7bfa78',
          initialSharedVersion: 610893707,
          mutable: false,
        },
        pythPriceId: '0x17cd845b16e874485b2684f8b8d1517d744105dbb904eec30222717f4bc9ee0d',
      },
      '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA': {
        priceAggregator: {
          objectId: '0x28672bb8232fe610c35d133f5ddf1d343447771a7297951db468b5af5ae83be2',
          initialSharedVersion: 610893707,
          mutable: false,
        },
        pythPriceId: '0x7e17f0ac105abe9214deb9944c30264f5986bf292869c6bd8e8da3ccd92d79bc',
      },
      '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK': {
        priceAggregator: {
          objectId: '0xe7683cdd76af3f80da4f022afa2c31b554a45d23dcd1f418d11eff8cd5c9bf82',
          initialSharedVersion: 610893716,
          mutable: false,
        },
        pythPriceId: '0xfdf28a46570252b25fd31cb257973f865afc5ca2f320439e45d95e0394bc7382',
      },
      '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP': {
        priceAggregator: {
          objectId: '0x64585d0abf487a75bf69bc729586e5190bce585a0eb99d066457d48ee43e4922',
          initialSharedVersion: 610893719,
          mutable: false,
        },
        pythPriceId: '0x29bdd5248234e33bd93d3b81100b5fa32eaa5997843847e2c2cb16d7c6d9f7ff',
      },
      '0xd0e89b2af5e4910726fbcd8b8dd37bb79b29e5f83f7491bca830e94f7f226d29::eth::ETH': {
        priceAggregator: {
          objectId: '0x635141bf9c026fb7e0ce714c5b071ebc2e7059a90a2ffc4dd2e2190897ba02e8',
          initialSharedVersion: 610893719,
          mutable: false,
        },
        pythPriceId: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
      },
      '0xaafc4f740de0dd0dde642a31148fb94517087052f19afb0f7bed1dc41a50c77b::scallop_sui::SCALLOP_SUI': {
        priceAggregator: {
          objectId: '0xd248f5adeeb6e1761bb911a08cbfbdd4f5a74416dcba4c2230a5376af41945c5',
          initialSharedVersion: 610893720,
          mutable: false,
        },
        derivativeInfo: {
          underlyingCoinType: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
          derivativeKind: 'sCoin',
        },
      },
      '0x854950aa624b1df59fe64e630b2ba7c550642e9342267a33061d59fb31582da5::scallop_usdc::SCALLOP_USDC': {
        priceAggregator: {
          objectId: '0x0b43266f77f8b2832c353e9ffd195ead5d9bc40a5c8874520dd1a4e3e45ec2c2',
          initialSharedVersion: 610893720,
          mutable: false,
        },
        derivativeInfo: {
          underlyingCoinType: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
          derivativeKind: 'sCoin',
        },
      },
      '0xb1d7df34829d1513b73ba17cb7ad90c88d1e104bb65ab8f62f13e0cc103783d3::scallop_sb_usdt::SCALLOP_SB_USDT': {
        priceAggregator: {
          objectId: '0xf64553ec0b83f0f502fe8d547819cad73323c8fac499c7ab2e7b05d87972cadb',
          initialSharedVersion: 610893720,
          mutable: false,
        },
        derivativeInfo: {
          underlyingCoinType: '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT',
          derivativeKind: 'sCoin',
        },
      },
      '0x622345b3f80ea5947567760eec7b9639d0582adcfd6ab9fccb85437aeda7c0d0::scallop_wal::SCALLOP_WAL': {
        priceAggregator: {
          objectId: '0x95e56c1c6ba163c2edd727151c55841f384ff01f69477e950d70d1f70b759146',
          initialSharedVersion: 610893720,
          mutable: false,
        },
        derivativeInfo: {
          underlyingCoinType: '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL',
          derivativeKind: 'sCoin',
        },
      },
      '0xeb7a05a3224837c5e5503575aed0be73c091d1ce5e43aa3c3e716e0ae614608f::scallop_deep::SCALLOP_DEEP': {
        priceAggregator: {
          objectId: '0x138d33eabd014c1178d2392f3e6ef3087129116609aa5786ca180d1d21f91a81',
          initialSharedVersion: 610893720,
          mutable: false,
        },
        derivativeInfo: {
          underlyingCoinType: '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP',
          derivativeKind: 'sCoin',
        },
      },
      '0xb14f82d8506d139eacef109688d1b71e7236bcce9b2c0ad526abcd6aa5be7de0::scallop_sb_eth::SCALLOP_SB_ETH': {
        priceAggregator: {
          objectId: '0xc846dc6b4257d689e7b9af6b7aaf741c11e63653be0f8bd7ddb627dfb701b785',
          initialSharedVersion: 610893720,
          mutable: false,
        },
        derivativeInfo: {
          underlyingCoinType: '0xd0e89b2af5e4910726fbcd8b8dd37bb79b29e5f83f7491bca830e94f7f226d29::eth::ETH',
          derivativeKind: 'sCoin',
        },
      },
      '0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::SCALLOP_SCA': {
        priceAggregator: {
          objectId: '0xc16c6913b53a70ea6f1547d8e4a54c14ad86959bd0a6de6d79efbe3bd92d1134',
          initialSharedVersion: 610893720,
          mutable: false,
        },
        derivativeInfo: {
          underlyingCoinType: '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
          derivativeKind: 'sCoin',
        },
      },
      '0x5de877a152233bdd59c7269e2b710376ca271671e9dd11076b1ff261b2fd113c::up_usd::UP_USD': {
        priceAggregator: {
          objectId: '0x5e869f79f00861d069adf8a5da716397984cc5d2eccb0637bed43b69ff4eb7c3',
          initialSharedVersion: 610893722,
          mutable: false,
        },
        pythPriceId: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
      },
      '0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::StakedHouseCoin<0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>':
        {
          priceAggregator: {
            objectId: '0xd1ae834ec25b834489e2c7e5716c8c382b7ee657b028b00cfa44d1e88e0eccf2',
            initialSharedVersion: 610893723,
            mutable: false,
          },
          derivativeInfo: {
            underlyingCoinType: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
            derivativeKind: 'gCoin',
          },
        },
      '0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::StakedHouseCoin<0x5de877a152233bdd59c7269e2b710376ca271671e9dd11076b1ff261b2fd113c::up_usd::UP_USD>':
        {
          priceAggregator: {
            objectId: '0x10de87b3c47628d3377f4f4f03cd3fff8c42747c811034325ae699456d3f171f',
            initialSharedVersion: 610893723,
            mutable: false,
          },
          derivativeInfo: {
            underlyingCoinType: '0x5de877a152233bdd59c7269e2b710376ca271671e9dd11076b1ff261b2fd113c::up_usd::UP_USD',
            derivativeKind: 'gCoin',
          },
        },
      '0x7438e8caf5c345fbd3772517380bf0ca432f53892dee65ee0dda3eb127993cd9::bfbtc::BFBTC': {
        priceAggregator: {
          objectId: '0xe93f95caf1b9cbb2309dd973524ec3ca3f17c9af1d33354f057f9824e97e5089',
          initialSharedVersion: 639842266,
          mutable: false,
        },
        derivativeInfo: {
          underlyingCoinType: '0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC',
          derivativeKind: 'BFBTC',
        },
      },
    },
    VAULT_OBJS: {
      '0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::StakedHouseCoin<0x5de877a152233bdd59c7269e2b710376ca271671e9dd11076b1ff261b2fd113c::up_usd::UP_USD>':
        {
          vault: {
            objectId: '0xdb3b2f1ce99c935a5c5e14ce8321e0c252a8b16c50861407d2253d392d5fb836',
            initialSharedVersion: 610893709,
            mutable: true,
          },
        },
      '0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::StakedHouseCoin<0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>':
        {
          vault: {
            objectId: '0x1e90eb4184e3303ee69d1728630c872b214f8699982b00dc39aabde8b4ff5ce3',
            initialSharedVersion: 610893709,
            mutable: true,
          },
        },
      '0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::SCALLOP_SCA': {
        vault: {
          objectId: '0x38057191f48cf748d3b018e83ec0dda9f769f3f2d98010561002d6d2378f8ec3',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
            rewarderId: '0x3aeab227a25667c8536c7babc89bd2d1dc78c60e99e1f429b61348ace5c50f57',
          },
        ],
      },
      '0xb14f82d8506d139eacef109688d1b71e7236bcce9b2c0ad526abcd6aa5be7de0::scallop_sb_eth::SCALLOP_SB_ETH': {
        vault: {
          objectId: '0x13ca385797229d6ad23a3ff0981fc30971735b0efd307d02920b58730d923a14',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
            rewarderId: '0x8e6406c238867af1984b384ef3c4190abc7147c7693456c652955a1854acdc91',
          },
        ],
      },
      '0xeb7a05a3224837c5e5503575aed0be73c091d1ce5e43aa3c3e716e0ae614608f::scallop_deep::SCALLOP_DEEP': {
        vault: {
          objectId: '0x6677cdcc3186900914823fc8e5de7a2d1e874bbc0682cbcf7637ddf9342b1cbd',
          initialSharedVersion: 610893709,
          mutable: true,
        },
      },
      '0x622345b3f80ea5947567760eec7b9639d0582adcfd6ab9fccb85437aeda7c0d0::scallop_wal::SCALLOP_WAL': {
        vault: {
          objectId: '0xe1c7630ef33094491ab291bed669fcc64a48a88fcc99ddc200bcc38deb00400e',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
            rewarderId: '0x6e57350209ebde403919de25798fffe8dce9687dcc7ecaa2a0409d944538e5f0',
          },
        ],
      },
      '0xb1d7df34829d1513b73ba17cb7ad90c88d1e104bb65ab8f62f13e0cc103783d3::scallop_sb_usdt::SCALLOP_SB_USDT': {
        vault: {
          objectId: '0xf985037e218946d20344810be7c07e42e7fae1666cdce60e7f028706768daed0',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
            rewarderId: '0x74e776d237331b59d2f0008f75bccd47869fd0f91a0f10f24dab4ae50746f6ce',
          },
        ],
      },
      '0x854950aa624b1df59fe64e630b2ba7c550642e9342267a33061d59fb31582da5::scallop_usdc::SCALLOP_USDC': {
        vault: {
          objectId: '0xbd0079fb337dc5c79ae8f522aab72fcda38b6f10e38f2477c075777d8b1ac263',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
            rewarderId: '0x05d72b703593a9e669622f453e0478954ba2fbff0339a8d0afb9f3f9f252c5f0',
          },
        ],
      },
      '0xaafc4f740de0dd0dde642a31148fb94517087052f19afb0f7bed1dc41a50c77b::scallop_sui::SCALLOP_SUI': {
        vault: {
          objectId: '0x5d76ee14fc4b1f501653c65eb3dc2ba0cd42f7d0d11480a840322e77d4b56362',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
            rewarderId: '0x513b6d294ee8622ad16b6821c82010c011630a0e4a4aeadbbde4846e39793b3b',
          },
        ],
      },
      '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA': {
        vault: {
          objectId: '0xd3ef65a1dec4b5c5f0e0bb7caf29f4a425bd04ad43bce942ec6e1c70385b79de',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
            rewarderId: '0x9258dcb2fb97eede62e07aa1e963ee105e6444a187b98cc02761b78ccdffef76',
          },
        ],
      },
      '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL': {
        vault: {
          objectId: '0x9cd535e14d25767387e29798cfd61cf8c780d4836798cd64a5ce0d6fdc4659b2',
          initialSharedVersion: 610893709,
          mutable: true,
        },
      },
      '0x876a4b7bce8aeaef60464c11f4026903e9afacab79b9b142686158aa86560b50::xbtc::XBTC': {
        vault: {
          objectId: '0xee2d62b04abd9064a5526043395e09b0481e89fa3309d428fcb271ac53ce3103',
          initialSharedVersion: 610893709,
          mutable: true,
        },
      },
      '0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC': {
        vault: {
          objectId: '0x755c54dd718d350afd03314fe6ccc71e0ab36a974caf6721f1e03b7675dfaba1',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP',
            rewarderId: '0x60b041b9ce72b17ccf7ef6a33770e6618519e3a5eca967836cd271e497a307a8',
          },
        ],
      },
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI': {
        vault: {
          objectId: '0xb36fea26a681f44b9a075297ddb9ebb9d4f35210c48d133e767bb294ac6427c6',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
            rewarderId: '0xd939a0725b930b69351705d6e3b95194417fb627d25407fb74be2cb2ca52088e',
          },
        ],
      },
      '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT': {
        vault: {
          objectId: '0x2169f7a9f7c693265dad755bd7e75382e88cc4432595a22950432cb512bc6cd7',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
            rewarderId: '0xa4837abbfb50d1a98bc17a3a6b9840e0f1661494597fffa3ad6f223a4745e749',
          },
        ],
      },
      '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI': {
        vault: {
          objectId: '0x83367e510389536e2041d50b3faabc2d1b1c8194ca5570a2a3a3e460d6113e86',
          initialSharedVersion: 610893709,
          mutable: true,
        },
        rewarders: [
          {
            rewardType: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
            rewarderId: '0x6568cdbc2810d7fa01a4d9ab11c01dc1a4f7cc76ab024f1dd4fb37d658eea047',
          },
        ],
      },
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI': {
        vault: {
          objectId: '0x542eff36534bc5d7d07808953ebb8c580c23f047b41c094601d40a0fc7e99238',
          initialSharedVersion: 610893709,
          mutable: true,
        },
      },
      '0x7438e8caf5c345fbd3772517380bf0ca432f53892dee65ee0dda3eb127993cd9::bfbtc::BFBTC': {
        vault: {
          objectId: '0x1f32b8b587b69a97cb779b2df1e2aa90f6fbb43edcc887f11a8f4a6de0944937',
          initialSharedVersion: 639842264,
          mutable: true,
        },
      },
    },
    SAVING_POOL_OBJS: {
      '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB': {
        pool: {
          objectId: '0xa0bfd8f31cc869c5f91cc23cb24414f3e225f015d269803279dc8a2179ce964f',
          initialSharedVersion: 610893718,
          mutable: true,
        },
        reward: {
          rewardManager: {
            objectId: '0x79c753c1512a0eaeae0aedc623e620c599915e5855e27ee5d292d5bf95192578',
            initialSharedVersion: '610893721',
            mutable: true,
          },
          rewardTypes: ['0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'],
        },
      },
    },
    PSM_POOL_OBJS: {
      '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC': {
        pool: {
          objectId: '0x37721762186721fb6eaf053f249aaf594503a6ad98dbcc998916be78d20a2df4',
          initialSharedVersion: 610893712,
          mutable: true,
        },
      },
      '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT': {
        pool: {
          objectId: '0x12a3dacb20ecfe8fe9fc281140196348722b9b3775bec57a09c6c66243076c40',
          initialSharedVersion: 610893712,
          mutable: true,
        },
      },
      '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK': {
        pool: {
          objectId: '0x4fef507f41f5b141625f0f193283820fbee26e883f24212d149e4220320ae321',
          initialSharedVersion: 610893716,
          mutable: true,
        },
      },
    },
  },
  testnet: {
    PRICE_SERVICE_ENDPOINT: 'https://hermes-beta.pyth.network',
    PYTH_STATE_ID: '0x2d82612a354f0b7e52809fc2845642911c7190404620cec8688f68808f8800d8',
    WORMHOLE_STATE_ID: '0xebba4cc4d614f7a7cdbe883acc76d1cc767922bc96778e7b68be0d15fce27c02',
    PYTH_RULE_PACKAGE_ID: '0x69f13c07f8cbd9511437448f3bdc91d515465e5a8bf0ea5f94a2eb6ebbecb883',
    PYTH_RULE_CONFIG_OBJ: {
      objectId: '0xd8cc7827b9efc35c4093078b89e726a9d4a2fd56da69f29b3ba8d69e750c72fd',
      initialSharedVersion: '442159460',
      mutable: false,
    },

    ORIGINAL_FRAMEWORK_PACKAGE_ID: '0x070e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63',
    ORIGINAL_USDB_PACKAGE_ID: '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9',
    ORIGINAL_ORACLE_PACKAGE_ID: '0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce',
    ORIGINAL_CDP_PACKAGE_ID: '0x801a162330af18f018022faf93d781e5f2777886cac46c269ba3cc09b808c59a',
    ORIGINAL_PSM_PACKAGE_ID: '0xb818b22a88d614c266c5f4436fb4447dee1c4fba8071c456f864851eb6dd194d',
    ORIGINAL_FLASH_PACKAGE_ID: '0x68d88be9921bd6730a0f1cdfc200a7e9dda6b3e862c0245cd3891511671bcb8c',
    ORIGINAL_SAVING_PACKAGE_ID: '0xf59c363a3af10f51e69c612c5fa01f6500701254043f057e132cdbd27b67d14f',
    ORIGINAL_SAVING_INCENTIVE_PACKAGE_ID: '0x11e03be85d2b5f1ddef785fe1dfa129551f69913c41324ac0cad116031579588',
    ORIGINAL_BORROW_INCENTIVE_PACKAGE_ID: '',

    FRAMEWORK_PACKAGE_ID: '0x070e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63',
    USDB_PACKAGE_ID: '0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9',
    ORACLE_PACKAGE_ID: '0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce',
    CDP_PACKAGE_ID: '0x801a162330af18f018022faf93d781e5f2777886cac46c269ba3cc09b808c59a',
    PSM_PACKAGE_ID: '0xb818b22a88d614c266c5f4436fb4447dee1c4fba8071c456f864851eb6dd194d',
    FLASH_PACKAGE_ID: '0x68d88be9921bd6730a0f1cdfc200a7e9dda6b3e862c0245cd3891511671bcb8c',
    SAVING_PACKAGE_ID: '0xf59c363a3af10f51e69c612c5fa01f6500701254043f057e132cdbd27b67d14f',
    SAVING_INCENTIVE_PACKAGE_ID: '0x11e03be85d2b5f1ddef785fe1dfa129551f69913c41324ac0cad116031579588',
    BORROW_INCENTIVE_PACKAGE_ID: '',

    TREASURY_OBJ: {
      objectId: '0xb1bf430d03abcceed4f64b31ddf71b03bd503bea91ca64e80adaff35b22c7230',
      initialSharedVersion: 349180351,
      mutable: true,
    },
    VAULT_REWARDER_REGISTRY: {
      objectId: '',
      initialSharedVersion: 0,
      mutable: false,
    },
    SAVING_POOL_INCENTIVE_GLOBAL_CONFIG_OBJ: {
      objectId: '0xdfdfe9c7bdd63113a5c57f3d1c7c425d2b85b73c7ef7d974b98db8584837c5b6',
      initialSharedVersion: 349180418,
      mutable: false,
    },
    FLASH_GLOBAL_CONFIG_OBJ: {
      objectId: '0x66c8c42e1ccf2a8eaa50f2584b990418c54349f53470004545e12333ccf1f0fc',
      initialSharedVersion: '349180354',
      mutable: true,
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
    SAVING_POOL_OBJS: {
      '0x784660d93d9f013f1c77c4bcb2e04a374fdb4038abf2637c75ca27828b2ac18c::allen_susdb::ALLEN_SUSDB': {
        pool: {
          objectId: '0x8a2b3f7e26050c9ed4b9a60d25dfc205e2541b6c05509295769511b0e13b7b25',
          initialSharedVersion: '546822516',
          mutable: true,
        },
        reward: {
          rewardManager: {
            objectId: '0x70d52865febce4e0b5f6c0a53f772f735e178eb03a80d3b764dd3e365a7bf3f1',
            initialSharedVersion: '546934688',
            mutable: true,
          },
          rewardTypes: ['0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'],
        },
      },
    },
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
