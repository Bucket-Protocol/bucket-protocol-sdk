import { normalizeStructTag } from '@mysten/sui/utils';

import type { Network, SharedObjectRef } from '@/types/index.js';

/**
 * Supra push oracle (`supra_rule`) wiring.
 *
 * Unlike Pyth, these are **not** read from the on-chain `bucket_onchain_config`:
 * `OracleConfig` is a fixed Move struct and `AggregatorObjectInfo` a fixed enum,
 * so adding Supra there would mean upgrading and migrating that package. This is
 * a second price source for coin types that already have an aggregator, not a new
 * kind of aggregator, so it is carried here instead.
 *
 * ## The coin type list is a safety boundary, not a preference
 *
 * `supra_rule::feed<T>` **aborts `EUnsupportedCoinType`** when `T` has no pair id
 * in `supra_rule::Config`. So `SUPRA_COIN_TYPES` must stay a *subset* of what is
 * actually configured on-chain — listing a coin type here before the pair id
 * lands reverts every PTB that prices it.
 *
 * The reverse direction is safe: a coin type configured on-chain but absent here
 * is simply never fed, and a rule that is fed but carries no aggregator weight is
 * dropped by `remove_outliers` without affecting the result. That asymmetry is
 * what lets this ship between the pair-id transaction and the weight
 * transaction — see `v2-move-contracts/scripts/supra_rule/README.md`.
 *
 * Ordering: land `pnpm supra:apply` (pair ids) → ship this → `pnpm supra:weights`.
 *
 * Testnet is empty on purpose. `supra_rule` is not deployed there: the
 * testnet-published `bucket_v2_oracle` predates the abstain mechanism, so nothing
 * built from current source links against it.
 */
export type SupraConfig = {
  packageId: string;
  /** Shared `supra_rule::Config`, passed immutably. */
  configObj: SharedObjectRef;
  /** Supra's shared `OracleHolder`, passed immutably — Supra alone writes it. */
  oracleHolder: SharedObjectRef;
  /** Coin types with a live pair id in `supra_rule::Config`. Normalized tags. */
  coinTypes: Set<string>;
};

const MAINNET_SUPRA_COIN_TYPES = [
  '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
  '0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC',
  '0xd0e89b2af5e4910726fbcd8b8dd37bb79b29e5f83f7491bca830e94f7f226d29::eth::ETH',
  '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
  '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT',
  '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL',
  '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
  '0x0041f9f9344cac094454cd574e333c4fdb132d7bcc9379bcd4aab485b2a63942::wbtc::WBTC',
];

export const SUPRA_CONFIG: Record<Network, SupraConfig | undefined> = {
  mainnet: {
    packageId: '0x050a859ff33f5d82bc131f21b8a544a1e48cd61c88652f65c5ce7c6a6b091f98',
    configObj: {
      objectId: '0x9fbe2bc0f7018cb9af7449b5da9215390328cbe844a80a1c84b8de282a514901',
      initialSharedVersion: '923306508',
      mutable: false,
    },
    oracleHolder: {
      objectId: '0xaa0315f0748c1f24ddb2b45f7939cff40f7a8104af5ccbc4a1d32f870c0b4105',
      initialSharedVersion: '5963053',
      mutable: false,
    },
    coinTypes: new Set(MAINNET_SUPRA_COIN_TYPES.map(normalizeStructTag)),
  },
  testnet: undefined,
};

/** The Supra wiring for `network`, or `undefined` where the rule is not deployed. */
export function getSupraConfig(network: Network): SupraConfig | undefined {
  return SUPRA_CONFIG[network];
}

/** Whether `supra_rule::feed<T>` is safe to append for this coin type. */
export function hasSupraFeed(network: Network, coinType: string): boolean {
  return getSupraConfig(network)?.coinTypes.has(normalizeStructTag(coinType)) ?? false;
}
