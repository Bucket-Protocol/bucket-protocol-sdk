# AGENTS.md

Guidance for coding agents working in this repository.
Both Claude Code (v2.1.281+) and Codex read this file. Do not add a CLAUDE.md anywhere in the repo: Claude Code ignores every AGENTS.md at or below a directory that has one.

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
  - `supra.ts`, `lst.ts` — second price sources (`supra_rule`, the LST rules) that the on-chain config cannot describe, so the SDK carries them; each file's header states its safety rules (below)
- **`src/types/`** — TypeScript types; `config.ts` defines `ConfigType`, `AggregatorObjectInfo`, `VaultObjectInfo`, etc.
- **`src/utils/`**
  - `bucketConfig.ts` — `queryAllConfig()` fetches on-chain Config and sub-objects (aggregator, vault, saving pool, PSM)
  - `configAdapter.ts` — `convertOnchainConfig()` maps raw on-chain JSON to `ConfigType`
  - `transaction.ts` — helpers: `coinWithBalance` (lazy coin resolver intent), `getZeroCoin`, `destroyZeroCoin`, `getCoinsOfType`
  - `resolvers.ts` — `resolveCoinBalance` intent resolver; handles merging/splitting user coins when a transaction is built
  - `pyth.ts` — Pyth price feed helpers; `buildPythPriceUpdateCalls`, `fetchPriceFeedsUpdateDataFromHermes`
- **`src/_generated/`** — Move struct deserializers for: `bucket_v2_borrow_incentive`, `bucket_v2_cdp`, `bucket_v2_flash`, `bucket_v2_framework`, `bucket_v2_psm`, `bucket_v2_saving`, `bucket_v2_saving_incentive`, `bucket_onchain_config`. Generated code (each file carries a do-not-edit banner); regenerate rather than edit by hand.

### Key Design Patterns

**Programmable Transaction Blocks (PTBs):** All write operations build PTBs rather than executing them. Methods prefixed `build*` (e.g., `buildManagePositionTransaction`, `buildPSMSwapInTransaction`) take a `Transaction` object and append Move calls to it. The caller signs and executes.

**`coinWithBalance` lazy resolver:** Instead of requiring callers to pass coin objects, `coinWithBalance({ type, balance })` returns a factory `(tx) => TransactionResult`. When `tx.build()` is called, `resolveCoinBalance` fetches the user's coins on-chain, merges them, and splices in a `SplitCoins` command automatically. This is the standard way to pass input coins throughout the SDK.

**Price aggregation:** `aggregatePrices(tx, { coinTypes })` fetches Pyth VAAs and adds price update calls to the PTB, plus the Supra and LST feeds for coin types that have them. Derivative coin types (`DerivativeKind` in `src/types/config.ts`) take their price from an underlying asset rather than a direct feed, with the rule objects read from the on-chain price config.

**Price-source lists are a safety boundary.** `supra_rule::feed` aborts `EUnsupportedCoinType` for a coin type with no pair id on chain, so the coin types in `src/consts/supra.ts` must stay a subset of what is configured on chain; adding one early reverts every PTB that prices it. An LST rule's `feed` needs the aggregated SUI price earlier in the same PTB, which `aggregatePrices` arranges for every caller. Read the header of `supra.ts` / `lst.ts` before changing either list.

**On-chain config:** Config (package IDs, vault/aggregator/PSM refs) is fetched from chain via `queryAllConfig()` and converted to `ConfigType` by `convertOnchainConfig()`. Use `BucketClient.initialize({ network })` for the default flow.

**Dual package IDs:** `ORIGINAL_*_PACKAGE_ID` is the initial deployment ID (used for type-checking); `*_PACKAGE_ID` is the latest upgrade ID (used for Move calls). Both are required because Sui upgradeable packages change the call target but not the type origin.

### Path Alias

`@/` maps to `./src/` (configured in `tsconfig.json` and `vitest.config.ts`). Use `@/client.js`, `@/types/index.js`, etc. in imports within `src/`.

### Build Output

Dual CJS (`dist/cjs/`) and ESM (`dist/esm/`) outputs, each with a `package.json` `type` marker. `tsc-alias` rewrites path aliases post-compilation. Types are emitted alongside JS.

### Tests

E2E tests in `test/e2e/` run against mainnet RPC (`MAINNET_TIMEOUT_MS` = 20 s in `test/e2e/helpers/setup.ts`; `test:e2e` passes `--testTimeout=25000`). They need a live network connection and do not sign or submit transactions — they dry-run or only build PTBs. Set `SUI_GRPC_URL` to a private fullnode to avoid public rate limits. Use `test:unit` for fast local runs; use `test:e2e` or a single file to reduce RPC rate-limit hits.

CI on pull requests runs `pnpm lint` and `pnpm test` (unit and e2e together, so a public-RPC rate limit can fail it); pushing a `v*.*.*` tag builds and publishes to npm. Done means lint, build and the affected tests pass.

### Integrator skill

`skill/bucket-sdk/` is a skill for people integrating this SDK (it is not in the npm package; integrators take it from this repository), not instructions for working in this repo. When you rename or change a public method, update its `SKILL.md` and `references/` in the same change, or integrators' agents call methods that no longer exist.

## Working here

The request sets the scope. When asked to assess, review or explain, report findings and stop; do not apply a fix until asked. Keep changes to what the task needs; anything else worth doing goes in the summary as a suggestion. Before reporting, audit each claim against a tool result from this session, and say plainly what is unverified or was not run.

Memory: `knowledge-hub/` holds one lesson per file (frontmatter shape in its README; it sits at the root because `/docs` is git-ignored here). Read it before starting work in an unfamiliar area, and add a lesson when something cost real time or corrected a belief — not what the source already says.

`.codex/config.toml` raises Codex's project-doc cap. `scripts/agent-hooks/check-harness.sh` checks the layout and blocks in the `harness-lint` workflow (run it with `--hub knowledge-hub`, since the hub sits at the root).

`.claude/settings.json` enables waterx-commons' `waterx-harness` plugin: `/waterx-harness:adopt-harness-standard`, `/waterx-harness:harness-transform`, `/waterx-harness:knowledge-hub-lesson`. They load after the workspace-trust prompt via your GitHub access to waterx-commons, not in cloud sessions; Codex users link them into `~/.agents/skills` ([how](https://github.com/Bucket-Protocol/waterx-commons/tree/main/plugins#codex)). This file and local skills win over them. Known conflict: `/waterx-harness:knowledge-hub-lesson` writes lessons to `docs/knowledge-hub/`; here they go in the root `knowledge-hub/` (above).
