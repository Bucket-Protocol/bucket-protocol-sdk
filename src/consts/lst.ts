import { normalizeStructTag } from '@mysten/sui/utils';

import type { Network, SharedObjectRef } from '@/types/index.js';

/**
 * Liquid-staking-token price rules (`hasui_rule`, `vsui_rule`, `afsui_rule`).
 *
 * Each prices its LST as `LST/USD = SUI/USD × (SUI per LST)`, reading the rate
 * live out of the staking protocol's own shared state. Like Supra, these are not
 * in the on-chain `bucket_onchain_config`: `AggregatorObjectInfo` is a fixed Move
 * enum whose `DerivativeInfo` variant means "priced *only* by a derivative rule",
 * and these coin types are not that — they keep their Pyth feed and add a second
 * source alongside it. Representing that on-chain would need a new enum variant.
 *
 * ## Why these coin types are not simply `DerivativeInfo`
 *
 * An sCoin or gCoin aggregator carries one rule. An LST aggregator carries Pyth
 * *and* its LST rule, so its collector needs both `pyth_rule::feed` and
 * `<lst>_rule::feed` before `aggregate`. That is a PTB shape neither
 * `aggregateBasicPrices` nor `getDerivativePrice` had.
 *
 * ## Ordering constraint
 *
 * `feed` takes the aggregated `PriceResult<SUI>`, so `aggregate<SUI>` must appear
 * *earlier in the same PTB*. Any request touching an LST therefore pulls SUI in
 * as a basic coin type even when the caller did not ask for it, and the LST
 * collectors are built after every non-LST one.
 *
 * ## Safe to ship before weights
 *
 * None of these rules carries aggregator weight yet. Feeding an unweighted rule
 * is a no-op: `remove_outliers` drops any collected rule absent from `weights`
 * before the weighted mean is taken. So this can land ahead of
 * `set_rule_weight`, which is the required order — the reverse aborts
 * `EMissingPriceSource` on every PTB that has not been updated.
 *
 * Testnet is empty: the rules are mainnet-only.
 */
export type LstRule = {
  /** Package id of the rule. */
  packageId: string;
  /** Module name, which is also the `feed` target's module. */
  module: string;
  /** The coin type whose aggregated price the rule multiplies — always SUI. */
  underlyingCoinType: string;
  /**
   * Protocol state objects passed after the SUI price result, in `feed`'s
   * declared parameter order. All immutable: the rules only ever read a rate.
   */
  stateObjects: SharedObjectRef[];
};

const SUI_COIN_TYPE = '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI';

const MAINNET_LST_RULES: Record<string, LstRule> = {
  // haSUI — Haedal. feed(collector, sui_price, staking)
  '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI': {
    packageId: '0xdd00028a858d4d235647c408cbd8711003a422d39d3609f4f3bf8e7ee8f8b737',
    module: 'hasui_rule',
    underlyingCoinType: SUI_COIN_TYPE,
    stateObjects: [
      {
        // haedal::staking::Staking
        objectId: '0x47b224762220393057ebf4f70501b6e657c3e56684737568439a04f80849b2ca',
        initialSharedVersion: '24060192',
        mutable: false,
      },
    ],
  },
  // vSUI — Volo. feed(collector, sui_price, stake_pool, metadata)
  //
  // `stake_pool`, NOT the `native_pool` in the same Volo package: that one is
  // deprecated (paused, state frozen since 2026-06-24) and its views still answer
  // with a rate ~7% high. See price_rules/vsui_rule/README.md.
  '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT': {
    // Republished (not upgraded) to fix that binding, so this is a *new* package
    // id — the superseded `0xaa9ae71a…` still exists on chain and still reads the
    // dead pool. Its `VSuiRule` is therefore a different witness type; weight
    // granted against the old one would not be this rule.
    packageId: '0xe88c49531df679ff5a8ae9ce54882a4acb2360a212749a828badbd086541665e',
    module: 'vsui_rule',
    underlyingCoinType: SUI_COIN_TYPE,
    stateObjects: [
      {
        // volo::stake_pool::StakePool — the live pool
        objectId: '0x2d914e23d82fedef1b5f56a32d5c64bdcc3087ccfea2b4d6ea51a71f587840e5',
        initialSharedVersion: '552477718',
        mutable: false,
      },
      {
        // volo::cert::Metadata<CERT>
        objectId: '0x680cd26af32b2bde8d3361e804c53ec1d1cfe24c7f039eb7f549e8dfde389a60',
        initialSharedVersion: '34377055',
        mutable: false,
      },
    ],
  },
  // afSUI — Aftermath. feed(collector, sui_price, vault, safe)
  '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI': {
    packageId: '0xb9a8e84be5ffb7871302bdebacc9386a2d3b870de4570f519928bbdcaf51c656',
    module: 'afsui_rule',
    underlyingCoinType: SUI_COIN_TYPE,
    stateObjects: [
      {
        // lsd::staked_sui_vault::StakedSuiVault
        objectId: '0x2f8f6d5da7f13ea37daa397724280483ed062769813b6f31e9788e59cc88994d',
        initialSharedVersion: '32696040',
        mutable: false,
      },
      {
        // safe::safe::Safe<TreasuryCap<AFSUI>>
        objectId: '0xeb685899830dd5837b47007809c76d91a098d52aabbf61e8ac467c59e5cc4610',
        initialSharedVersion: '32347695',
        mutable: false,
      },
    ],
  },
};

const LST_RULES: Record<Network, Record<string, LstRule>> = {
  mainnet: Object.fromEntries(
    Object.entries(MAINNET_LST_RULES).map(([coinType, rule]) => [normalizeStructTag(coinType), rule]),
  ),
  testnet: {},
};

/** The LST rule for `coinType`, or `undefined` when it is not an LST. */
export function getLstRule(network: Network, coinType: string): LstRule | undefined {
  return LST_RULES[network][normalizeStructTag(coinType)];
}
