# Bucket Protocol — Concepts & Decision Guide

This document explains the core protocol concepts an agent needs to understand to make correct integration decisions.

**Official docs**: <https://docs.bucketprotocol.io/>

## What is Bucket Protocol?

Bucket Protocol is a **CDP-based stablecoin protocol on Sui, purpose-built for capital efficiency**. Users deposit supported on-chain assets as collateral to borrow **USDB**, a decentralized, over-collateralized stablecoin pegged to $1 USD.

USDB serves two user needs:

- **Volatile-asset holders** borrow USDB against collateral for long-term leverage or liquidity without selling core positions.
- **Stablecoin allocators** hold USDB and deposit into the sUSDB Savings Pool for competitive, flexible yield.

### Key Advantages

- **Fixed per-asset interest rates** — funding costs known upfront, no variable rate anxiety
- **High LTV** — per-asset CDP isolation enables more usable capital
- **Explicit risk boundaries** — simple CR/MCR rule with live liquidation price; no Recovery Mode
- **No one-time borrow fee** — only fixed interest rates apply
- **Derivative collateral support** — LSTs, sCoins, gCoins can be used as collateral

## CDP (Collateralized Debt Positions)

### How It Works

1. User deposits collateral (e.g. SUI, BTC, ETH) into a vault
2. User borrows USDB against that collateral
3. The position must maintain a **minimum collateral ratio** (MCR) — typically 110%
4. Interest accrues on the debt over time
5. User can repay debt and/or withdraw collateral at any time (within CR constraints)

### Collateral Ratio (CR) & Liquidation Price

```
CR = (Collateral Price × Collateral Amount) / (initial Borrow Amount + Accrued Interest)
```

Each collateral has a fixed **Minimum Collateral Ratio (MCR)** (e.g. 110%). If CR < MCR, the position is liquidatable.

```
Liquidation Price = (MCR × Debt) / Collateral Amount
```

**Example**: 1,000 SUI at $5/SUI ($5,000 collateral), borrow 4,000 USDB, MCR = 110%

- Entry CR = 5,000 / 4,000 = 125%
- Liquidation Price = (1.10 × 4,000) / 1,000 = $4.40/SUI

> After every action, the position must satisfy CR ≥ MCR.

### When to Use Which CDP Method

| Goal                       | Method                                                                  | Needs Price? |
| -------------------------- | ----------------------------------------------------------------------- | :----------: |
| Deposit collateral only    | `buildManagePositionTransaction({ depositCoinOrAmount })`               |      No      |
| Borrow USDB                | `buildManagePositionTransaction({ borrowAmount })`                      |  Yes (auto)  |
| Repay debt                 | `buildManagePositionTransaction({ repayCoinOrAmount })`                 |      No      |
| Withdraw collateral        | `buildManagePositionTransaction({ withdrawAmount })`                    |  Yes (auto)  |
| Deposit + borrow in one tx | `buildManagePositionTransaction({ depositCoinOrAmount, borrowAmount })` |  Yes (auto)  |
| Close entire position      | `buildClosePositionTransaction()`                                       |      No      |
| Claim borrow incentives    | `buildClaimBorrowRewardsTransaction()`                                  |      No      |

`buildManagePositionTransaction` is the all-in-one method. You can combine any of deposit/borrow/repay/withdraw in a single call. It handles zero-coin cleanup automatically.

### Fees & Interest

- **No one-time borrow fee** (removed in the v2 upgrade)
- **Fixed borrow interest rate** per collateral type (visible in `VaultInfo.interestRate`)
- Interest accrues in real time and is added to debt continuously
- Rates are protocol-set and not user-adjustable

### Mint Caps

Each vault has a maximum USDB supply (`VaultInfo.maxUsdbSupply`). Borrowing beyond this cap will fail on-chain. Mint caps help manage market depth during liquidations and reduce slippage risk in extreme conditions.

### Liquidation

- **Trigger**: CR < MCR → position becomes liquidatable
- **Scope**: **Full seizure** — ALL collateral in that CDP is taken
- **Executor**: Liquidations are protocol-run (not by users)

**How liquidation is executed on-chain:**

1. Flash-mint USDB to immediately repay the CDP's outstanding debt
2. Seize all collateral from the liquidated CDP
3. Sell the seized collateral for USDB using on-chain venues
4. Repay the flash-minted USDB from step 1

**User loss**: At liquidation threshold, `User loss ≈ (MCR - 1) × Debt`. The user keeps the USDB previously borrowed.

**Bad-debt backstop**: If collateral proceeds < debt, the protocol's Insurance Fund (funded from protocol revenue) covers the gap.

**Avoiding liquidation**: Deposit more collateral or repay part of the debt to raise CR.

> The SDK does **not** execute liquidations — it only builds position management transactions.

## USDB Peg Mechanism

USDB targets $1 USD via two mechanisms:

### Peg Stability Module (PSM)

The PSM enables trustless 1:1 conversions between USDB and supported stablecoins (USDC, USDT, BUCK), subject to a PSM fee.

- **Swap In**: Stablecoin → USDB (e.g. deposit 1 USDC, receive ~1 USDB minus fee)
- **Swap Out**: USDB → Stablecoin (e.g. deposit 1 USDB, receive ~1 USDC minus fee)

Each PSM pool has `swapIn` and `swapOut` fee rates (visible in `PsmPoolInfo.feeRate`). Partner accounts may get lower fees via `partnerFeeRate`.

### Price Stability & Arbitrage

Let `price_usdb` = USDB market price on DEX, `fee_in` = PSM IN fee, `fee_out` = PSM OUT fee.

**Upward depeg (USDB > $1)**: Acquire USDB via PSM IN at ~$1, sell on market at `price_usdb > 1`. Profitable when `price_usdb > 1 + fee_in + gas`.

**Downward depeg (USDB < $1)**: Buy USDB on market at `price_usdb < 1`, exit via PSM OUT at ~$1. Profitable when `price_usdb < 1 - fee_out - gas`.

**Flash-mint assisted arbitrage**: For capital efficiency, use flash mint to source/retire USDB within one transaction, pairing the opposite leg through PSM or market liquidity.

### When to Use PSM vs CDP

| Scenario                        | Use PSM | Use CDP |
| ------------------------------- | :-----: | :-----: |
| Quickly get USDB from USDC/USDT |    ✓    |         |
| Convert USDB back to USDC/USDT  |    ✓    |         |
| Leverage crypto exposure        |         |    ✓    |
| Earn borrow incentive rewards   |         |    ✓    |
| Long-term USDB generation       |         |    ✓    |
| Arbitrage USDB peg on DEX       |    ✓    |         |

## Saving System — Two Layers of USDB Yield

Bucket provides two layers of yield for USDB holders. Total APR = BSR + SUI rewards APR.

### Layer 1: sUSDB and BSR (Base Savings Rate)

- **BSR** is Bucket’s fixed savings rate for USDB. It accrues in real time by increasing the exchange rate between sUSDB and USDB.
- **sUSDB** is the yield-bearing stablecoin you receive when you stake USDB. Yield does not change your sUSDB balance; instead, each unit of sUSDB represents more USDB over time.

**Formulas**:

```
minted_sUSDB  = staked_USDB / exchange_rate
unstaked_USDB = sUSDB_balance × exchange_rate
```

- No stake or unstake fee. No lockup.
- Balances and the exchange rate update in real time.

### Layer 2: sUSDB Savings Pool

- Deposit sUSDB into the sUSDB Savings Pool to earn **additional SUI rewards** on top of BSR.
- Savings rewards accrue continuously and are claimable at any time.
- Withdraw whenever — no fees, no lockup.

### Key Parameters

- `savingRate`: BSR yield rate (exchange rate growth)
- `rewardRate`: Additional token incentive rates (per reward type, e.g. SUI)
- `usdbDepositCap`: Maximum total USDB the pool accepts (null = no cap)
- `lpSupply`: Total sUSDB LP tokens outstanding

### SDK Methods

| Goal                                          | Method                                     |
| --------------------------------------------- | ------------------------------------------ |
| Deposit USDB → get sUSDB → earn BSR + rewards | `buildDepositToSavingPoolTransaction()`    |
| Withdraw sUSDB → receive USDB                 | `buildWithdrawFromSavingPoolTransaction()` |
| Claim SUI rewards from savings pool           | `buildClaimSavingRewardsTransaction()`     |

## Flash Mint

### How It Works

Flash minting allows borrowing USDB **without collateral** within a single atomic transaction. The borrowed USDB must be repaid (plus fee) before the transaction completes, or the entire transaction reverts.

### Use Cases

- Arbitrage between USDB price on DEXes
- Self-liquidation or position restructuring
- Leveraged operations composed in a single PTB

### Fee

A small fee rate applies (visible in `FlashMintInfo.feeRate`). The repayment must cover principal + fee.

```typescript
const [usdbCoin, receipt] = client.flashMint(tx, { amount: 10_000_000 });
// ... do things with usdbCoin (arbitrage, etc.) ...
// Must return principal + fee:
client.flashBurn(tx, { usdbCoin, flashMintReceipt: receipt });
```

## Leverage

Bucket supports two ways to build a leveraged long on supported assets:

### One-Click Leverage (SUI/LST, Wrapped BTC)

Uses flash minting to automatically create a leveraged position in one transaction:

1. User deposits initial capital (e.g. 100 USDC)
2. Flash-mints USDB worth the leverage amount
3. Swaps initial capital + flash-minted USDB for target collateral (via Cetus aggregator)
4. Deposits all as collateral → borrows USDB
5. Repays the flash-mint with borrowed USDB

**Result**: Leveraged position established atomically. Costs shown: flash-loan fee + price impact.

### Manual Looping (All Collaterals)

For assets without one-click support:

1. Deposit collateral → Borrow USDB
2. Swap USDB → more collateral (via DEX)
3. Deposit the new collateral
4. Repeat until desired leverage

### De-Leveraging

To reduce leverage or raise CR:

- **Repay with collateral**: sell portion of collateral into USDB to repay debt (atomically via DEX routing)
- **Repay with USDB**: repay from USDB in wallet
- After repayment, CR rises and liquidation price moves lower (safer)

## Account System

### EOA vs Account Objects

Bucket supports two modes for holding positions:

- **EOA (Externally Owned Account)**: Positions are tied directly to the wallet address. This is the default when `accountObjectOrId` is omitted.
- **Account Object**: A Sui on-chain object (`Account`) that holds positions on behalf of the owner. Useful for managing multiple independent positions from one wallet, or for protocol-level integrations.

### When to Use Account Objects

- Most integrations should **omit** `accountObjectOrId` and operate in EOA mode
- Use Account objects when: the user has existing Account-based positions (check with `getUserAccounts()`), or the integration needs separate position management

### Checking for Existing Accounts

```typescript
const accounts = await client.getUserAccounts({ address: walletAddress });
// accounts is an array of Account objects
// If empty, the user only has EOA positions
```

## Oracle Price System

### How Prices Work

Bucket uses **Pyth Network** as its oracle. The SDK handles price feeds automatically:

1. Fetches latest price data (VAA) from Pyth's Hermes REST API
2. Builds on-chain Wormhole verification + Pyth update calls
3. Passes the verified price to CDP/PSM operations

### Basic vs Derivative Prices

- **Basic**: Direct Pyth feed (SUI, BTC, ETH, USDC, etc.)
- **Derivative**: Price derived from basic price × exchange rate
  - **sCoin** (Scallop): sSUI price = SUI price × Scallop exchange rate
  - **gCoin** (Unihouse): gSUI price = SUI price × Unihouse exchange rate
  - **BFBTC**: BFBTC price = BTC price × BFBTC exchange rate

`aggregatePrices()` handles both basic and derivative prices transparently. The `build*` methods that need prices (borrow, withdraw, PSM swap) call it internally.

### Querying Prices Without a Transaction

```typescript
// Get live prices (simulates a PTB internally)
const prices = await client.getOraclePrices({ coinTypes: ['0x2::sui::SUI'] });
console.log(prices['0x2::sui::SUI']); // e.g. 3.45 (USD)

// Get all supported prices
const allPrices = await client.getAllOraclePrices();
```

## Composing Operations in a Transaction

Sui's PTB model allows combining multiple operations atomically. Common patterns:

### Pattern 1: PSM → Saving (get USDB then earn yield)

```typescript
const tx = new Transaction();
const usdb = await client.buildPSMSwapInTransaction(tx, {
  coinType: usdcType,
  inputCoinOrAmount: 1_000_000,
});
client.buildDepositToSavingPoolTransaction(tx, {
  address: myAddress,
  lpType: susdbLpType,
  depositCoinOrAmount: usdb,
});
```

### Pattern 2: Borrow → PSM out (borrow USDB then convert to USDC)

```typescript
const tx = new Transaction();
const [, usdb] = await client.buildManagePositionTransaction(tx, {
  coinType: '0x2::sui::SUI',
  depositCoinOrAmount: 2_000_000_000,
  borrowAmount: 1_000_000,
});
const usdc = await client.buildPSMSwapOutTransaction(tx, {
  coinType: usdcType,
  usdbCoinOrAmount: usdb,
});
tx.transferObjects([usdc], myAddress);
```

### Pattern 3: Flash mint → Arbitrage → Repay

```typescript
const tx = new Transaction();
const [usdb, receipt] = client.flashMint(tx, { amount: 10_000_000 });
// ... use usdb for arbitrage on a DEX ...
client.flashBurn(tx, { usdbCoin: usdbAfterArb, flashMintReceipt: receipt });
```

### Pattern 4: One-Click Leverage (Flash Mint → Swap → Deposit → Borrow → Repay)

```typescript
const tx = new Transaction();
// 1. Flash mint USDB for leverage
const [flashUsdb, receipt] = client.flashMint(tx, { amount: leverageAmount });
// 2. Swap USDB → target collateral via DEX (not part of Bucket SDK)
// ... DEX swap calls ...
// 3. Deposit all collateral, borrow USDB to cover flash mint
const [, borrowedUsdb] = await client.buildManagePositionTransaction(tx, {
  coinType: '0x2::sui::SUI',
  depositCoinOrAmount: totalCollateralCoin,
  borrowAmount: leverageAmount + flashFee,
});
// 4. Repay flash mint
client.flashBurn(tx, { usdbCoin: borrowedUsdb, flashMintReceipt: receipt });
```
