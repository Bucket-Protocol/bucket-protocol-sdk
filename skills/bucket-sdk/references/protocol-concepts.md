# Bucket Protocol — Concepts & Decision Guide

This document explains the core protocol concepts an agent needs to understand to make correct integration decisions.

## What is Bucket Protocol?

Bucket Protocol is a **CDP (Collateralized Debt Position) lending protocol** on Sui. Users deposit crypto collateral and borrow **USDB**, a stablecoin pegged to 1 USD. The protocol also includes a PSM (Peg Stability Module) for stablecoin swaps and saving pools for USDB yield.

## CDP (Collateralized Debt Positions)

### How It Works

1. User deposits collateral (e.g. SUI, BTC, ETH) into a vault
2. User borrows USDB against that collateral
3. The position must maintain a **minimum collateral ratio** (MCR) — typically 110%
4. Interest accrues on the debt over time
5. User can repay debt and/or withdraw collateral at any time (within CR constraints)

### Collateral Ratio

```
Collateral Ratio = (Collateral Value in USD) / (USDB Debt)
```

- If CR drops below MCR, the position becomes eligible for liquidation
- The SDK does **not** perform liquidations — it only builds the transaction
- When borrowing or withdrawing, the SDK automatically fetches Pyth oracle prices to validate the CR on-chain

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

### Interest Rate

Each vault has a fixed interest rate (visible in `VaultInfo.interestRate`). Interest accrues on the USDB debt continuously. The rate is protocol-set and not user-adjustable.

## PSM (Peg Stability Module)

### How It Works

The PSM allows 1:1 swaps between USDB and supported stablecoins (USDC, USDT, BUCK) with a small fee.

- **Swap In**: Stablecoin → USDB (e.g. deposit 1 USDC, receive ~1 USDB minus fee)
- **Swap Out**: USDB → Stablecoin (e.g. deposit 1 USDB, receive ~1 USDC minus fee)

### When to Use PSM vs CDP

| Scenario                        | Use PSM | Use CDP |
| ------------------------------- | :-----: | :-----: |
| Quickly get USDB from USDC/USDT |    ✓    |         |
| Convert USDB back to USDC/USDT  |    ✓    |         |
| Leverage crypto exposure        |         |    ✓    |
| Earn borrow incentive rewards   |         |    ✓    |
| Long-term USDB generation       |         |    ✓    |

### Fee Rates

Each PSM pool has `swapIn` and `swapOut` fee rates (visible in `PsmPoolInfo.feeRate`). Partner accounts may get lower fees via `partnerFeeRate`.

## Saving Pools

### How It Works

1. User deposits USDB into a saving pool
2. Receives LP tokens (e.g. sUSDB) representing their share
3. USDB accrues yield via the `savingRate`
4. Additional reward tokens (e.g. SUI) may be distributed to depositors
5. User can withdraw at any time, receiving USDB proportional to their LP share

### Key Parameters

- `savingRate`: Base USDB yield rate
- `rewardRate`: Additional token incentive rates (per reward type)
- `usdbDepositCap`: Maximum total USDB the pool accepts (null = no cap)
- `lpSupply`: Total LP tokens outstanding

### When to Use

| Goal                           | Method                                     |
| ------------------------------ | ------------------------------------------ |
| Deposit USDB to earn yield     | `buildDepositToSavingPoolTransaction()`    |
| Withdraw USDB from pool        | `buildWithdrawFromSavingPoolTransaction()` |
| Claim reward tokens (e.g. SUI) | `buildClaimSavingRewardsTransaction()`     |

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
