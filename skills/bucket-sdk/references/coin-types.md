# Bucket Protocol — Supported Coin Types (Mainnet)

This file lists all coin types supported by Bucket Protocol on Sui mainnet. Use these exact strings when calling SDK methods like `buildManagePositionTransaction`, `buildPSMSwapInTransaction`, etc.

> **Note**: Coin types may change as the protocol adds or removes support. Call `client.getAllCollateralTypes()`, `client.getAllOracleCoinTypes()`, or inspect `client.getConfig()` for the live list.

## USDB (Bucket's Stablecoin)

| Token | Coin Type                                                                        | Decimals |
| ----- | -------------------------------------------------------------------------------- | -------- |
| USDB  | `0xe14726c336e81b32328e92afc37345d159f5b550b09fa92bd43640cfdd0a0cfd::usdb::USDB` | 6        |

Get it programmatically with `client.getUsdbCoinType()`.

## Basic Collateral (Direct Pyth Price Feed)

These tokens have a direct Pyth oracle price. They can be used as CDP collateral and are supported by `aggregateBasicPrices()`.

| Token  | Coin Type                                                                            | Decimals | Notes                |
| ------ | ------------------------------------------------------------------------------------ | -------- | -------------------- |
| SUI    | `0x2::sui::SUI`                                                                      | 9        | Native gas token     |
| BTC    | `0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC`       | 8        |                      |
| ETH    | `0xd0e89b2af5e4910726fbcd8b8dd37bb79b29e5f83f7491bca830e94f7f226d29::eth::ETH`       | 8        |                      |
| WAL    | `0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL`       | 9        | Walrus token         |
| USDC   | `0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC`     | 6        |                      |
| USDT   | `0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT`     | 6        |                      |
| haSUI  | `0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI`   | 9        | Haedal staked SUI    |
| CERT   | `0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT`     | 9        | Volo staked SUI      |
| afSUI  | `0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI`   | 9        | Aftermath staked SUI |
| SCA    | `0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA`       | 9        | Scallop token        |
| BUCK   | `0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK`     | 9        | Bucket V1 stablecoin |
| DEEP   | `0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP`     | 6        | DeepBook token       |
| XBTC   | `0x876a4b7bce8aeaef60464c11f4026903e9afacab79b9b142686158aa86560b50::xbtc::XBTC`     | 8        |                      |
| WBTC   | `0x0041f9f9344cac094454cd574e333c4fdb132d7bcc9379bcd4aab485b2a63942::wbtc::WBTC`     | 8        |                      |
| UP_USD | `0x5de877a152233bdd59c7269e2b710376ca271671e9dd11076b1ff261b2fd113c::up_usd::UP_USD` | 6        | Unihouse USD         |
| XAUM   | `0x9d297676e7a4b771ab023291377b2adfaa4938fb9080b8d12430e4b108b836a9::xaum::XAUM`     | 6        | Tokenized gold       |

## Derivative Collateral (Price from Underlying)

These tokens derive their price from a basic token via an exchange rate (Scallop sCoin, Unihouse gCoin, or BFBTC). The SDK handles this automatically in `aggregatePrices()` — you don't need to treat them differently from basic collateral when using `build*` methods.

### sCoin (Scallop Lending Receipts) — derivative_kind: `sCoin`

| Token | Coin Type                                                                                              | Underlying |
| ----- | ------------------------------------------------------------------------------------------------------ | ---------- |
| sSUI  | `0xaafc4f740de0dd0dde642a31148fb94517087052f19afb0f7bed1dc41a50c77b::scallop_sui::SCALLOP_SUI`         | SUI        |
| sUSDC | `0x854950aa624b1df59fe64e630b2ba7c550642e9342267a33061d59fb31582da5::scallop_usdc::SCALLOP_USDC`       | USDC       |
| sUSDT | `0xb1d7df34829d1513b73ba17cb7ad90c88d1e104bb65ab8f62f13e0cc103783d3::scallop_sb_usdt::SCALLOP_SB_USDT` | USDT       |
| sWAL  | `0x622345b3f80ea5947567760eec7b9639d0582adcfd6ab9fccb85437aeda7c0d0::scallop_wal::SCALLOP_WAL`         | WAL        |
| sDEEP | `0xeb7a05a3224837c5e5503575aed0be73c091d1ce5e43aa3c3e716e0ae614608f::scallop_deep::SCALLOP_DEEP`       | DEEP       |
| sETH  | `0xb14f82d8506d139eacef109688d1b71e7236bcce9b2c0ad526abcd6aa5be7de0::scallop_sb_eth::SCALLOP_SB_ETH`   | ETH        |
| sSCA  | `0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::SCALLOP_SCA`         | SCA        |

### gCoin (Unihouse Staked House Coins) — derivative_kind: `gCoin`

| Token   | Coin Type                                                                                                                                                                        | Underlying |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| gSUI    | `0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::StakedHouseCoin<0x2::sui::SUI>`                                                                      | SUI        |
| gUP_USD | `0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::StakedHouseCoin<0x5de877a152233bdd59c7269e2b710376ca271671e9dd11076b1ff261b2fd113c::up_usd::UP_USD>` | UP_USD     |

### BFBTC — derivative_kind: `BFBTC`

| Token | Coin Type                                                                          | Underlying |
| ----- | ---------------------------------------------------------------------------------- | ---------- |
| BFBTC | `0x7438e8caf5c345fbd3772517380bf0ca432f53892dee65ee0dda3eb127993cd9::bfbtc::BFBTC` | BTC        |

## PSM Pool Coins

These coins can be swapped 1:1 with USDB via `buildPSMSwapInTransaction` / `buildPSMSwapOutTransaction`:

| Token | Coin Type                                                                        | Decimals |
| ----- | -------------------------------------------------------------------------------- | -------- |
| USDC  | `0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC` | 6        |
| USDT  | `0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT` | 6        |
| BUCK  | `0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK` | 9        |

## Saving Pool LP Types

Pass these as the `lpType` parameter to saving pool methods (`buildDepositToSavingPoolTransaction`, etc.):

| Token | LP Type                                                                            |
| ----- | ---------------------------------------------------------------------------------- |
| sUSDB | `0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB` |

## Common Reward Types

These appear as keys in borrow/saving reward records:

| Token | Coin Type                                                                        |
| ----- | -------------------------------------------------------------------------------- |
| SUI   | `0x2::sui::SUI`                                                                  |
| SCA   | `0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA`   |
| DEEP  | `0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP` |
| XAUM  | `0x9d297676e7a4b771ab023291377b2adfaa4938fb9080b8d12430e4b108b836a9::xaum::XAUM` |
