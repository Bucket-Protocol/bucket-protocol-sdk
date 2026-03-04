# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Build (both CJS and ESM outputs)
pnpm build

# Run all tests
pnpm test

# Run tests in segments (reduces RPC rate limit hits)
pnpm test:unit          # unit tests only (no network, fast)
pnpm test:e2e           # e2e tests only (mainnet RPC, 25s timeout)

# Run a single test file
pnpm vitest run test/e2e/psm.test.ts
pnpm vitest run test/unit/utils/pyth.test.ts

# Run multiple specific files
pnpm vitest run test/e2e/psm.test.ts test/e2e/supply-pools.test.ts

# Run a specific test by name
pnpm vitest run -t "getAllOraclePrices"

# Coverage
pnpm test:coverage       # all tests + coverage
pnpm test:coverage:unit  # unit only + coverage (no RPC, avoids rate limits)

# Lint
pnpm lint

# Clean build artifacts
pnpm clean
```

## Architecture

This is a TypeScript SDK for [Bucket Protocol](https://bucketprotocol.io), a CDP (Collateralized Debt Position) lending protocol on the Sui blockchain. The single public entry point is `BucketClient` (`src/client.ts`), exported from `src/index.ts` along with all types and utils.

### Source Layout

- **`src/client.ts`** — `BucketClient` class; all public SDK methods live here (queries + PTB builders). Use `BucketClient.initialize()` to fetch config from chain; or pass `config` to the constructor for custom/config-override usage.
- **`src/consts/`** — static constants:
  - `entry.ts` — `ENTRY_CONFIG_ID` per network (mainnet/testnet); entry point to fetch on-chain config
  - `price.ts` — auxiliary shared object refs for derivative price feeds (Scallop, gCoin, Unihouse)
- **`src/types/`** — TypeScript types; `config.ts` defines `ConfigType`, `AggregatorObjectInfo`, `VaultObjectInfo`, etc.
- **`src/utils/`**
  - `bucketConfig.ts` — `queryAllConfig()` fetches on-chain Config and sub-objects (aggregator, vault, saving pool, PSM)
  - `configAdapter.ts` — `convertOnchainConfig()` maps raw on-chain JSON to `ConfigType`
  - `transaction.ts` — helpers: `coinWithBalance` (lazy coin resolver intent), `getZeroCoin`, `destroyZeroCoin`, `getCoinsOfType`
  - `resolvers.ts` — `resolveCoinBalance` intent resolver; handles merging/splitting user coins when a transaction is built
  - `pyth.ts` — Pyth price feed helpers; `buildPythPriceUpdateCalls`, `fetchPriceFeedsUpdateDataFromHermes`
- **`src/_generated/`** — auto-generated Move struct deserializers (via `@mysten/sui` codegen) for: `bucket_v2_borrow_incentive`, `bucket_v2_cdp`, `bucket_v2_flash`, `bucket_v2_framework`, `bucket_v2_psm`, `bucket_v2_saving`, `bucket_v2_saving_incentive`

### Key Design Patterns

**Programmable Transaction Blocks (PTBs):** All write operations build PTBs rather than executing them. Methods prefixed `build*` (e.g., `buildManagePositionTransaction`, `buildPSMSwapInTransaction`) take a `Transaction` object and append Move calls to it. The caller signs and executes.

**`coinWithBalance` lazy resolver:** Instead of requiring callers to pass coin objects, `coinWithBalance({ type, balance })` returns a factory `(tx) => TransactionResult`. When `tx.build()` is called, `resolveCoinBalance` fetches the user's coins on-chain, merges them, and splices in a `SplitCoins` command automatically. This is the standard way to pass input coins throughout the SDK.

**Price aggregation via Pyth:** `aggregatePrices(tx, { coinTypes })` fetches Pyth VAAs and adds price update calls to the PTB. Derivative assets (sCoin, gCoin, BFBTC) have their price derived from an underlying asset rather than a direct Pyth feed.

**On-chain config:** Config (package IDs, vault/aggregator/PSM refs) is fetched from chain via `queryAllConfig()` and converted to `ConfigType` by `convertOnchainConfig()`. Use `BucketClient.initialize({ network })` for the default flow.

**Dual package IDs:** `ORIGINAL_*_PACKAGE_ID` is the initial deployment ID (used for type-checking); `*_PACKAGE_ID` is the latest upgrade ID (used for Move calls). Both are required because Sui upgradeable packages change the call target but not the type origin.

### Path Alias

`@/` maps to `./src/` (configured in `tsconfig.json` and `vitest.config.ts`). Use `@/client.js`, `@/types/index.js`, etc. in imports within `src/`.

### Build Output

Dual CJS (`dist/cjs/`) and ESM (`dist/esm/`) outputs, each with a `package.json` `type` marker. `tsc-alias` rewrites path aliases post-compilation. Types are emitted alongside JS.

### Tests

E2E tests in `test/e2e/` run against mainnet RPC and have 20–25 s timeouts. They require a live network connection and do **not** sign/submit transactions — they dry-run or only build PTBs. Use `test:unit` for fast local runs; use `test:e2e` or single-file `vitest run test/e2e/<file>` to reduce RPC rate limit hits.
