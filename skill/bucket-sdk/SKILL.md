---
name: bucket-sdk
description: Use when integrating with Bucket Protocol on Sui blockchain — building CDP transactions, PSM swaps, saving pool deposits/withdrawals, oracle price queries, flash mints, or querying vault and position data. Also use when the user wants to mint/repay USDB stablecoin, manage collateralized debt positions, swap stablecoins via PSM, or earn yield in Bucket saving pools. Trigger whenever someone needs to use @bucket-protocol/sdk as a dependency.
---

# Bucket Protocol SDK — Integration Guide

`@bucket-protocol/sdk` is a TypeScript SDK for [Bucket Protocol](https://bucketprotocol.io), a CDP-based stablecoin protocol on Sui purpose-built for capital efficiency. Users deposit supported on-chain assets as collateral to borrow **USDB** (a decentralized, over-collateralized stablecoin pegged to $1 USD). The SDK lets you query on-chain state and build Programmable Transaction Blocks (PTBs) for CDPs, saving pools (sUSDB + BSR yield), PSM stablecoin swaps, flash mints, oracle price feeds, and one-click leverage.

**Official docs**: <https://docs.bucketprotocol.io/>

## Installation

```bash
npm install @bucket-protocol/sdk @mysten/sui @mysten/bcs
# or
pnpm add @bucket-protocol/sdk @mysten/sui @mysten/bcs
```

Peer dependencies: `@mysten/sui >=2.0.0`, `@mysten/bcs >=2.0.0`.

## Quick Start

```typescript
import { BucketClient, coinWithBalance } from '@bucket-protocol/sdk';
import { Transaction } from '@mysten/sui/transactions';

// 1. Initialize (fetches config from chain automatically)
const client = await BucketClient.initialize({ network: 'mainnet' });

// 2. Build a transaction
const tx = new Transaction();
const [, usdbCoin] = await client.buildManagePositionTransaction(tx, {
  coinType: '0x2::sui::SUI',
  depositCoinOrAmount: 1_000_000_000, // 1 SUI (9 decimals)
  borrowAmount: 800_000, // 0.8 USDB (6 decimals)
});
tx.transferObjects([usdbCoin], myAddress);

// 3. Sign and execute (with your own signer)
await suiClient.signAndExecuteTransaction({ transaction: tx, signer });
```

## Initialization

```typescript
import { BucketClient } from '@bucket-protocol/sdk';
// Custom RPC endpoint
import { SuiGrpcClient } from '@mysten/sui/grpc';

// Recommended: initialize() waits for config to be ready
const client = await BucketClient.initialize({ network: 'mainnet' });

const suiClient = new SuiGrpcClient({ network: 'mainnet', baseUrl: 'https://my-rpc.example.com' });
const client = await BucketClient.initialize({ suiClient, network: 'mainnet' });

// Override specific config (e.g. Pyth Hermes endpoint)
const client = await BucketClient.initialize({
  network: 'mainnet',
  configOverrides: { PRICE_SERVICE_ENDPOINT: 'https://custom-hermes.example.com' },
});

// Alternative: sync constructor (config loads in background)
const client = new BucketClient({ network: 'mainnet' });
await client.getConfig(); // wait before config-dependent methods
```

`initialize()` reads on-chain config objects to resolve all package IDs, vault/pool/aggregator shared object refs, and Pyth settings. If using `new BucketClient(...)`, treat config-dependent methods as async and call them with `await`. Call `client.refreshConfig()` later to pick up protocol upgrades without re-creating the client.

## Key Concepts

### PTB Builders — Build, Don't Execute

All write operations return PTB commands, not executed transactions. Methods prefixed `build*` take a `Transaction` object and append Move calls. You sign and execute separately. This lets you compose multiple SDK calls into a single atomic transaction.

### `coinWithBalance` — Automatic Coin Merging

Pass raw amounts instead of coin objects. The SDK auto-fetches user coins, merges them, and splits the needed amount at `tx.build()` time:

```typescript
import { coinWithBalance } from '@bucket-protocol/sdk';

// These are equivalent:
await client.buildPSMSwapInTransaction(tx, {
  coinType: usdcType,
  inputCoinOrAmount: 1_000_000, // pass number directly
});
await client.buildPSMSwapInTransaction(tx, {
  coinType: usdcType,
  inputCoinOrAmount: coinWithBalance({ type: usdcType, balance: 1_000_000 }), // explicit factory
});
```

### Decimals

| Token | Decimals | 1 unit in raw   |
| ----- | -------- | --------------- |
| SUI   | 9        | `1_000_000_000` |
| USDB  | 6        | `1_000_000`     |
| USDC  | 6        | `1_000_000`     |
| BTC   | 8        | `100_000_000`   |

Always pass amounts in raw (smallest unit). The SDK does not auto-scale.

### Account vs EOA

Bucket supports `Account` objects that hold positions on behalf of a wallet. Most builder methods accept an optional `accountObjectOrId` parameter:

- **Omit** → operates on the wallet address directly (EOA mode)
- **Pass Account object ID** → operates on that Account's positions

## API Reference

### Querying On-Chain Data

All query methods are `async` and read-only — no transaction needed.

```typescript
// Protocol-level data
const supply = await client.getUsdbSupply(); // bigint
const prices = await client.getOraclePrices({ coinTypes: [SUI_TYPE_ARG] }); // Record<coinType, number>
const allPrices = await client.getAllOraclePrices(); // all supported coins

// Vault data
const vaults = await client.getAllVaultObjects(); // Record<coinType, VaultInfo>
const collateralTypes = await client.getAllCollateralTypes(); // string[]

// Saving pool data
const pools = await client.getAllSavingPoolObjects(); // Record<lpType, SavingPoolInfo>

// PSM pool data
const psmPools = await client.getAllPsmPoolObjects(); // Record<coinType, PsmPoolInfo>

// Flash mint info
const flash = await client.getFlashMintInfo(); // { feeRate, partner }

// User-specific data
const positions = await client.getUserPositions({ address }); // PositionInfo[]
const savings = await client.getUserSavings({ address }); // SavingInfo[]
const accounts = await client.getUserAccounts({ address }); // Account[]

// Paginated position listing by collateral
const { positions, nextCursor } = await client.getAllPositions({
  coinType: SUI_TYPE_ARG,
  pageSize: 50,
  cursor: null,
});

// Reward queries
const borrowRewards = await client.getAccountBorrowRewards({
  address,
  coinTypes: [SUI_TYPE_ARG],
}); // Record<coinType, Record<rewardType, bigint>>

const savingRewards = await client.getAccountSavingPoolRewards({
  address,
  lpTypes: [susdbLpType],
}); // Record<lpType, Record<rewardType, bigint>>
```

### Building Transactions

#### CDP — Manage Collateralized Debt Positions

```typescript
const tx = new Transaction();

// Deposit collateral + borrow USDB
const [collateralCoin, usdbCoin] = await client.buildManagePositionTransaction(tx, {
  coinType: '0x2::sui::SUI',
  depositCoinOrAmount: 2_000_000_000, // 2 SUI
  borrowAmount: 1_000_000, // 1 USDB
});
tx.transferObjects([usdbCoin], myAddress);

// Repay debt (partial or full)
await client.buildManagePositionTransaction(tx, {
  coinType: '0x2::sui::SUI',
  repayCoinOrAmount: 500_000, // 0.5 USDB
});

// Withdraw collateral (requires sufficient CR)
const [withdrawnCoin] = await client.buildManagePositionTransaction(tx, {
  coinType: '0x2::sui::SUI',
  withdrawAmount: 500_000_000, // 0.5 SUI
});
tx.transferObjects([withdrawnCoin], myAddress);

// Close position entirely — repays all debt, returns all collateral
const [allCollateral] = await client.buildClosePositionTransaction(tx, {
  address: myAddress,
  coinType: '0x2::sui::SUI',
});
tx.transferObjects([allCollateral], myAddress);

// Claim borrow incentive rewards
const rewards = await client.buildClaimBorrowRewardsTransaction(tx, {
  coinType: '0x2::sui::SUI',
});
// rewards: Record<rewardCoinType, TransactionResult>
Object.values(rewards).forEach((coin) => tx.transferObjects([coin], myAddress));
```

**Price is auto-fetched**: `buildManagePositionTransaction` calls `aggregatePrices` internally when `borrowAmount > 0` or `withdrawAmount > 0`. Deposit-only or repay-only operations skip the oracle call.

#### Saving Pools — Two Layers of USDB Yield

Bucket's saving system has **two layers**:

- **Layer 1 — sUSDB (BSR)**: Stake USDB → receive sUSDB. Value appreciates via the Base Savings Rate (BSR) through an increasing exchange rate. `minted_sUSDB = staked_USDB / exchange_rate`.
- **Layer 2 — sUSDB Savings Pool**: Deposit sUSDB → earn additional SUI rewards on top of BSR. Total APR = BSR + SUI rewards APR.

No stake/unstake fee. No lockup.

```typescript
const tx = new Transaction();

// Deposit USDB
await client.buildDepositToSavingPoolTransaction(tx, {
  address: myAddress,
  lpType: susdbLpType, // saving pool LP type
  depositCoinOrAmount: 1_000_000, // 1 USDB
});

// Withdraw USDB
const usdbCoin = await client.buildWithdrawFromSavingPoolTransaction(tx, {
  lpType: susdbLpType,
  amount: 500_000,
});
tx.transferObjects([usdbCoin], myAddress);

// Claim saving pool rewards
const rewards = await client.buildClaimSavingRewardsTransaction(tx, {
  lpType: susdbLpType,
});
Object.values(rewards).forEach((coin) => tx.transferObjects([coin], myAddress));
```

#### PSM — Peg Stability Module Swaps

```typescript
const tx = new Transaction();

// Swap USDC → USDB
const usdbCoin = await client.buildPSMSwapInTransaction(tx, {
  coinType: usdcType,
  inputCoinOrAmount: 1_000_000, // 1 USDC
});
tx.transferObjects([usdbCoin], myAddress);

// Swap USDB → USDC
const usdcCoin = await client.buildPSMSwapOutTransaction(tx, {
  coinType: usdcType,
  usdbCoinOrAmount: 1_000_000, // 1 USDB
});
tx.transferObjects([usdcCoin], myAddress);
```

#### Flash Mint — Borrow USDB Within a Single Transaction

```typescript
const tx = new Transaction();

// Mint USDB (must be burned in the same tx)
const [usdbCoin, receipt] = await client.flashMint(tx, { amount: 10_000_000 });

// ... use usdbCoin for arbitrage, liquidation, etc. ...

// Burn (repay) — must include the fee
await client.flashBurn(tx, { usdbCoin: remainingUsdb, flashMintReceipt: receipt });
```

### Composing Multiple Operations

A key strength of PTBs is atomic composition. You can chain SDK calls in one transaction:

```typescript
const tx = new Transaction();

// 1. Swap USDC to USDB
const usdbCoin = await client.buildPSMSwapInTransaction(tx, {
  coinType: usdcType,
  inputCoinOrAmount: 1_000_000,
});

// 2. Deposit the USDB into a saving pool
await client.buildDepositToSavingPoolTransaction(tx, {
  address: myAddress,
  lpType: susdbLpType,
  depositCoinOrAmount: usdbCoin, // pass TransactionResult directly
});
```

#### Leverage via Flash Mint (One-Click Leverage Pattern)

Bucket supports leveraged positions using flash mints. The one-click flow:

1. Flash-mint USDB
2. Swap flash-minted USDB → target collateral (via DEX)
3. Deposit all collateral → borrow USDB
4. Repay flash mint with borrowed USDB

```typescript
const tx = new Transaction();

// 1. Flash mint USDB for the leverage amount
const [flashUsdb, receipt] = await client.flashMint(tx, { amount: leverageUsdbAmount });

// 2. Swap USDB → SUI via external DEX aggregator (e.g. Cetus)
// ... (DEX swap calls — not part of Bucket SDK) ...

// 3. Deposit all SUI as collateral, borrow USDB to repay flash
const [, borrowedUsdb] = await client.buildManagePositionTransaction(tx, {
  coinType: '0x2::sui::SUI',
  depositCoinOrAmount: totalSuiCoin,
  borrowAmount: leverageUsdbAmount + flashFee,
});

// 4. Repay flash mint
await client.flashBurn(tx, { usdbCoin: borrowedUsdb, flashMintReceipt: receipt });
```

### Low-Level PTB Helpers

For advanced use cases, the building blocks behind `build*` methods are also public. These helpers are async in the latest SDK, so call them with `await`:

- **Price**: `aggregateBasicPrices(tx, { coinTypes })` (Pyth-only feeds), `aggregatePrices(tx, { coinTypes })` (all feeds incl. derivatives) → `TransactionResult[]`
- **CDP internals**: `debtorRequest()` → `checkUpdatePositionRequest()` → `updatePosition()` → `checkUpdatePositionResponse()`
- **Saving pool calls**: `savingPoolDeposit()`, `savingPoolWithdraw()`, `checkDepositResponse()`, `checkWithdrawResponse()`, `claimPoolIncentive()`
- **PSM calls**: `psmSwapIn()`, `psmSwapOut()`
- **Object refs**: `treasury(tx)`, `vault(tx, { coinType })`, `aggregator(tx, { coinType })`, `savingPoolObj(tx, { lpType })`, `psmPoolObj(tx, { coinType })`, `vaultRewarderRegistry(tx)`, `savingPoolGlobalConfig(tx)`, `flashGlobalConfig(tx)`
- **Account helpers**: `accountAddress(tx, { address, accountObjectOrId })`, `newAccountRequest(tx, { address, accountObjectOrId })`, `newPriceCollector(tx, { coinType })`

## Key Types

```typescript
// Vault info — returned by getAllVaultObjects()
type VaultInfo = {
  collateralType: string;
  collateralDecimal: number;
  collateralBalance: bigint;
  usdbSupply: bigint;
  maxUsdbSupply: bigint;
  minCollateralRatio: number; // e.g. 1.1 = 110%
  interestRate: number;
  positionTableSize: number;
  rewardRate: Record<string, number>;
};

// User position — returned by getUserPositions()
type PositionInfo = {
  collateralType: string;
  collateralAmount: bigint;
  debtAmount: bigint;
  debtor: string;
  accountId?: string;
  rewards?: Record<string, bigint>;
};

// Saving pool info — returned by getAllSavingPoolObjects()
type SavingPoolInfo = {
  lpType: string;
  lpSupply: bigint;
  usdbBalance: bigint;
  usdbDepositCap: bigint | null;
  savingRate: number;
  rewardRate: Record<string, number>;
};

// PSM pool info — returned by getAllPsmPoolObjects()
type PsmPoolInfo = {
  coinType: string;
  decimal: number;
  balance: bigint;
  usdbSupply: bigint;
  feeRate: { swapIn: number; swapOut: number };
  partnerFeeRate: Record<string, { swapIn: number; swapOut: number }>;
};

// User saving — returned by getUserSavings()
type SavingInfo = {
  lpType: string;
  address: string;
  accountId?: string;
  usdbBalance: bigint;
  lpBalance: bigint;
  rewards: Record<string, bigint>;
};

// Flash mint info — returned by getFlashMintInfo()
type FlashMintInfo = {
  feeRate: number;
  partner: Record<string, number>;
};
```

## Common Gotchas

1. **Async migration**: many methods that were previously synchronous are now async in v2.1.0+ (`getConfig`, `getAllCollateralTypes`, `getUsdbCoinType`, object info getters, `buildClosePositionTransaction`, `buildClaimBorrowRewardsTransaction`, saving builders, flash methods, and low-level helpers like `debtorRequest` / `updatePosition`). Always use `await` for these calls.

2. **Zero coin auto-cleanup**: When `borrowAmount` is 0, the returned USDB coin is a zero coin that gets auto-destroyed. Same for collateral when `withdrawAmount` is 0. You don't need to handle this.

3. **Dry-run / simulation**: Use `suiClient.simulateTransaction({ transaction: tx })` to test without signing. Set `tx.setSender(address)` first.

4. **Config refresh**: If the protocol upgrades, call `client.refreshConfig()` to re-fetch on-chain config. Overrides from `initialize()` are preserved automatically.

5. **No borrow fee**: The protocol has **no** one-time borrow fee (removed in the v2 upgrade). Only fixed per-asset interest rates apply. Interest accrues in real time and is added to debt continuously.

6. **Mint caps**: Each vault has a max USDB supply (`VaultInfo.maxUsdbSupply`). Borrowing beyond this cap will fail on-chain.

7. **Full liquidation**: When a position's CR drops below MCR, **all collateral is seized** (not partial). Liquidations are protocol-run. User loss ≈ `(MCR - 1) × Debt`. The SDK does not execute liquidations.

8. **Repay with collateral**: The "repay with collateral" feature (selling collateral to repay debt) is a UI-level feature that routes through on-chain DEXes. The base SDK provides `buildManagePositionTransaction` with `repayCoinOrAmount` for repaying with USDB you already hold.

9. **sUSDB exchange rate**: sUSDB appreciates vs USDB over time via BSR. When withdrawing, users receive more USDB per sUSDB than they deposited. The exchange rate only increases.

## Bundled Resources

This skill includes additional reference files. Consult them when you need detailed data:

| Resource               | Path                              | When to use                                                                                                                           |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Coin Types**         | `references/coin-types.md`        | Need the full `0x...` type string for a specific token (collateral, PSM, LP, reward)                                                  |
| **Protocol Concepts**  | `references/protocol-concepts.md` | Need to understand CDP mechanics, PSM vs CDP decision, saving pool yield, flash mints, Account vs EOA, or oracle pricing              |
| **Query State Script** | `scripts/query-state.ts`          | Need to inspect live on-chain state (vault stats, prices, pool balances). Run with `npx tsx skills/bucket-sdk/scripts/query-state.ts` |


