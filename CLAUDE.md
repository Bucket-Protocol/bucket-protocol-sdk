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

# Run a single test file
pnpm vitest run test/e2e/client.test.ts

# Run a specific test by name
pnpm vitest run -t "test getAllOraclePrices()"

# Lint
pnpm lint

# Clean build artifacts
pnpm clean
```

## Architecture

This is a TypeScript SDK for [Bucket Protocol](https://bucketprotocol.io), a CDP (Collateralized Debt Position) lending protocol on the Sui blockchain. The single public entry point is `BucketClient` (`src/client.ts`), exported from `src/index.ts` along with all types and utils.

### Source Layout

- **`src/client.ts`** — `BucketClient` class; all public SDK methods live here (queries + PTB builders)
- **`src/consts/`** — static configuration keyed by network (`mainnet`/`testnet`):
  - `config.ts` — `CONFIG` record containing all on-chain object IDs, package IDs, and per-coin aggregator/vault/PSM/saving pool refs
  - `price.ts` — auxiliary shared object refs for derivative price feeds (Scallop, gCoin, Unihouse)
- **`src/types/`** — TypeScript types; `config.ts` defines `ConfigType`, `AggregatorObjectInfo`, `VaultObjectInfo`, etc.
- **`src/utils/`**
  - `transaction.ts` — helpers: `coinWithBalance` (lazy coin resolver intent), `getZeroCoin`, `destroyZeroCoin`, `getCoinsOfType`
  - `resolvers.ts` — `resolveCoinBalance` intent resolver; handles merging/splitting user coins when a transaction is built
- **`src/_generated/`** — auto-generated Move struct deserializers (via `@mysten/sui` codegen) for: `bucket_v2_borrow_incentive`, `bucket_v2_cdp`, `bucket_v2_flash`, `bucket_v2_framework`, `bucket_v2_psm`, `bucket_v2_saving`, `bucket_v2_saving_incentive`

### Key Design Patterns

**Programmable Transaction Blocks (PTBs):** All write operations build PTBs rather than executing them. Methods prefixed `build*` (e.g., `buildManagePositionTransaction`, `buildPSMSwapInTransaction`) take a `Transaction` object and append Move calls to it. The caller signs and executes.

**`coinWithBalance` lazy resolver:** Instead of requiring callers to pass coin objects, `coinWithBalance({ type, balance })` returns a factory `(tx) => TransactionResult`. When `tx.build()` is called, `resolveCoinBalance` fetches the user's coins on-chain, merges them, and splices in a `SplitCoins` command automatically. This is the standard way to pass input coins throughout the SDK.

**Price aggregation via Pyth:** `aggregatePrices(tx, { coinTypes })` fetches Pyth VAAs and adds price update calls to the PTB. Derivative assets (sCoin, gCoin, BFBTC) have their price derived from an underlying asset rather than a direct Pyth feed.

**Dual package IDs:** `ORIGINAL_*_PACKAGE_ID` is the initial deployment ID (used for type-checking); `*_PACKAGE_ID` is the latest upgrade ID (used for Move calls). Both are required because Sui upgradeable packages change the call target but not the type origin.

### Path Alias

`@/` maps to `./src/` (configured in `tsconfig.json` and `vitest.config.ts`). Use `@/client.js`, `@/types/index.js`, etc. in imports within `src/`.

### Build Output

Dual CJS (`dist/cjs/`) and ESM (`dist/esm/`) outputs, each with a `package.json` `type` marker. `tsc-alias` rewrites path aliases post-compilation. Types are emitted alongside JS.

### Tests

E2E tests in `test/e2e/client.test.ts` run against mainnet RPC and have 20 s timeouts. They require a live network connection and do **not** sign/submit transactions — they dry-run or only build PTBs.
