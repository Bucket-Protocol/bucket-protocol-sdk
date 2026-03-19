---
name: bucket-sdk
description: Use when integrating Bucket Protocol on Sui with @bucket-protocol/sdk: CDP position updates, USDB mint and repay, PSM swaps, saving pools, flash mint, oracle prices, and protocol state queries.
---

# Bucket SDK

Use this skill whenever the task touches `@bucket-protocol/sdk`.

Official docs:
- https://docs.bucketprotocol.io/
- https://github.com/Bucket-Protocol/bucket-protocol-sdk

## Trigger Scope

Use for:
- Building PTBs with `buildManagePositionTransaction`, `buildPSMSwapInTransaction`, saving pool builders, or flash mint.
- Querying collateral, pool, oracle, position, account, or reward data.
- Debugging Bucket integration issues (`Unsupported collateral type`, price feed issues, pool balance checks).

Do not use for:
- Generic Sui SDK tasks that do not involve Bucket Protocol.

## Fast Workflow

1. Initialize client:

```ts
import { BucketClient } from '@bucket-protocol/sdk';
const client = await BucketClient.initialize({ network: 'mainnet' });
```

2. Resolve live types (never assume static lists):

```ts
const usdbType = await client.getUsdbCoinType();
const collateralTypes = await client.getAllCollateralTypes();
const oracleTypes = await client.getAllOracleCoinTypes();
const psmTypes = Object.keys(await client.getAllPsmPoolObjects());
const savingLpTypes = Object.keys(await client.getAllSavingPoolObjects());
```

3. Build PTB commands on `Transaction`, then sign and execute separately.
4. For unsupported user input, validate against live lists/maps first and return a clear error.
5. If config may be stale (protocol upgrade), call `await client.refreshConfig()`.

## Coin Type Policy

Keep context small. Do not paste long coin-type tables unless explicitly requested.

Rules:
1. CDP `coinType` must come from `getAllCollateralTypes()`.
2. PSM `coinType` must come from keys of `getAllPsmPoolObjects()`.
3. Saving `lpType` must come from keys of `getAllSavingPoolObjects()`.
4. Oracle price queries should use `getAllOracleCoinTypes()` when possible.
5. Use `references/coin-types.md` only when the user asks for static literals.

## Core Behavior Notes

- All write methods are PTB builders (`build*`): they append Move calls, not execute transactions.
- Amounts are raw integers (smallest unit). No auto decimal scaling.
- Most config-dependent methods are async; always `await`.
- `buildManagePositionTransaction` auto-aggregates prices when borrow or withdraw is requested.
- `accountObjectOrId` switches from EOA mode to Bucket Account mode.

## Default Implementation Skeleton

Use this shape unless the user asks for another architecture:

```ts
import { BucketClient } from '@bucket-protocol/sdk';
import { Transaction } from '@mysten/sui/transactions';

const client = await BucketClient.initialize({ network: 'mainnet' });
const tx = new Transaction();

// validate types from live config here
// append build* commands here

tx.setSender(address);
await client.getSuiClient().signAndExecuteTransaction({ signer, transaction: tx });
```

If user asks for simulation only, use `simulateTransaction` after setting sender.

## Method Map

Query methods:
- `getUsdbSupply`, `getAllVaultObjects`, `getAllPsmPoolObjects`, `getAllSavingPoolObjects`
- `getUserPositions`, `getUserSavings`, `getUserAccounts`
- `getOraclePrices`, `getAllOraclePrices`

Build methods:
- CDP: `buildManagePositionTransaction`, `buildClosePositionTransaction`, `buildClaimBorrowRewardsTransaction`
- PSM: `buildPSMSwapInTransaction`, `buildPSMSwapOutTransaction`
- Saving: `buildDepositToSavingPoolTransaction`, `buildWithdrawFromSavingPoolTransaction`, `buildClaimSavingRewardsTransaction`
- Flash: `flashMint`, `flashBurn`

## What To Open Next (Modular References)

Read only what you need:
- `references/api-workflows.md`
  - End-to-end PTB examples for CDP, PSM, saving, flash, and composition.
- `references/query-cheatsheet.md`
  - Query API quick reference, return-shape expectations, and troubleshooting checks.
- `references/protocol-concepts.md`
  - CDP mechanics, CR/MCR, liquidation model, PSM peg behavior, and yield layers.
- `references/coin-types.md`
  - Dynamic type resolution patterns and a small literal snapshot.

## Runtime Diagnostics

Use the bundled script when you need a quick live state snapshot:

```bash
npx tsx skill/bucket-sdk/scripts/query-state.ts
```

It prints supply, prices, vault stats, PSM pools, saving pools, and supported collateral types.

## Response Expectations

- Return code that is copy-paste runnable in TypeScript.
- Mention which live type source was used (`getAllCollateralTypes`, PSM keys, or saving LP keys).
- When rejecting input, include the checked list source and a short fix suggestion.
- Prefer small, composable PTBs over unrelated helper abstractions.

## Quality Gates Before Finalizing

1. Type validation done against live config (not hardcoded memory).
2. Amount units are raw integer units.
3. Transaction path is complete: build -> set sender -> sign+execute (or simulate).
4. Failure handling includes useful checks:
   - Unsupported collateral or PSM or lp type
   - Missing price feed
   - Insufficient pool balance
   - Insufficient user balance
