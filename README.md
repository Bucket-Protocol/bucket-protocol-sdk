# Bucket Protocol SDK

The Bucket Protocol TypeScript SDK is a comprehensive development toolkit for interacting with the Bucket Protocol, supporting CDP (Collateralized Debt Position) operations and enabling developers to easily integrate lending functionality.

## Installation

```bash
npm install @bucket-protocol/sdk
```

## Quick Start

### Initialize Client

```typescript
import { BucketClient } from '@bucket-protocol/sdk';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

// Use default mainnet configuration
const client = new BucketClient({ network: 'mainnet' });

// Or with custom SuiClient configuration
const customSuiClient = new SuiClient({ url: 'your-custom-rpc-url' });
const client = new BucketClient({
  suiClient: customSuiClient,
  network: 'mainnet',
});
```

### Basic Queries

```typescript
// Get all supported collateral types
const collateralTypes = client.getAllCollateralTypes();
console.log('Supported collaterals:', collateralTypes);
// Example: ['0x2::sui::SUI', '0x...::btc::BTC', ...]

// Get all vault information (CDP vaults)
const vaults = await client.getAllVaultObjects();
console.log('Vault info:', vaults);
// Returns: { [coinType]: VaultInfo, ... }

// Get user positions (collateral and debt)
const positions = await client.getUserPositions({
  address: '0x...user-address'
});
console.log('User positions:', positions);
// Returns: PositionInfo[]

// Get all PSM pools
const psmPools = await client.getAllPsmPoolObjects();
console.log('PSM Pools:', psmPools);
// Returns: { [coinType]: PsmPoolInfo, ... }

// Get all saving pools
const savingPools = await client.getAllSavingPoolObjects();
console.log('Saving Pools:', savingPools);
// Returns: { [lpType]: SavingPoolInfo, ... }

// Get user's savings
const userSavings = await client.getUserSavings({
  address: '0x...user-address'
});
console.log('User Savings:', userSavings);
// Returns: SavingInfo[]
```

## Core Features

### 1. Manage Position

**Deposit collateral and borrow USDB:**

```typescript
import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Create transaction
const tx = new Transaction();

// Build transaction: deposit 1 SUI, borrow 1 USDB
await client.buildManagePositionTransaction(tx, {
  coinType: SUI_TYPE_ARG, // SUI as collateral
  depositCoinOrAmount: 1 * 10 ** 9, // 1 SUI (9 decimals)
  borrowAmount: 1 * 10 ** 6, // 1 USDB (6 decimals)
});

// Sign and execute transaction
const keypair = Ed25519Keypair.fromSecretKey('your-private-key');
tx.setSender(keypair.getPublicKey().toSuiAddress());
const result = await client.getSuiClient().signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
});
```

**Repay debt and withdraw collateral:**

```typescript
const tx = new Transaction();
await client.buildManagePositionTransaction(tx, {
  coinType: SUI_TYPE_ARG,
  repayCoinOrAmount: 1 * 10 ** 6, // Repay 1 USDB
  withdrawAmount: 0.5 * 10 ** 9, // Withdraw 0.5 SUI
});
```

### 2. Close Position

```typescript
// Close entire position (repay all debt, withdraw all collateral)
const tx = new Transaction();
const address = keypair.getPublicKey().toSuiAddress();
client.buildClosePositionTransaction(tx, {
  coinType: SUI_TYPE_ARG,
  address,
});

tx.setSender(address);
const result = await client.getSuiClient().signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
});
```

### 3. Paginated Position Queries

```typescript
// Query all positions for specific collateral (paginated)
const positions = await client.getAllPositions({
  coinType: SUI_TYPE_ARG,
  pageSize: 50,
  cursor: null, // null for first query
});

console.log('Position list:', positions.positions);
console.log('Next cursor:', positions.nextCursor);

// Query next page
if (positions.nextCursor) {
  const nextPage = await client.getAllPositions({
    coinType: SUI_TYPE_ARG,
    pageSize: 50,
    cursor: positions.nextCursor,
  });
}
```

### 4. PSM (Peg Stability Module)

The PSM allows users to swap stablecoins to/from USDB at fair prices with low fees.

**Swap stablecoin to USDB (Swap In):**

```typescript
import { Transaction } from '@mysten/sui/transactions';

const tx = new Transaction();

// Example: Swap 10 USDC to USDB
const usdcAmount = 10 * 10 ** 6; // 10 USDC (6 decimals)
const USDC_TYPE = '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';

const usdbCoin = await client.buildPSMSwapInTransaction(tx, {
  coinType: USDC_TYPE,
  inputCoinOrAmount: usdcAmount, // Can also pass a coin object
});

// Transfer or use the USDB coin
tx.transferObjects([usdbCoin], keypair.getPublicKey().toSuiAddress());

// Sign and execute
tx.setSender(keypair.getPublicKey().toSuiAddress());
const result = await client.getSuiClient().signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
});
```

**Swap USDB to stablecoin (Swap Out):**

```typescript
const tx = new Transaction();

// Example: Swap 10 USDB to USDC
const usdbAmount = 10 * 10 ** 6; // 10 USDB (6 decimals)

const usdcCoin = await client.buildPSMSwapOutTransaction(tx, {
  coinType: USDC_TYPE,
  usdbCoinOrAmount: usdbAmount, // Can also pass a coin object
});

// Transfer USDC to user
tx.transferObjects([usdcCoin], keypair.getPublicKey().toSuiAddress());

tx.setSender(keypair.getPublicKey().toSuiAddress());
const result = await client.getSuiClient().signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
});
```

**Query PSM pool information:**

```typescript
// Get all PSM pools
const psmPools = await client.getAllPsmPoolObjects();
console.log('PSM Pools:', psmPools);

// Example output:
// {
//   'USDC': {
//     coinType: '0x...::usdc::USDC',
//     decimal: 6,
//     balance: 1000000n,
//     usdbSupply: 1000000n,
//     feeRate: { swapIn: 0.001, swapOut: 0.001 },
//     partnerFeeRate: {}
//   }
// }
```

### 5. Saving Pool

Deposit USDB into saving pools to earn interest and rewards over time.

**Deposit USDB to saving pool:**

```typescript
const tx = new Transaction();

const usdbAmount = 100 * 10 ** 6; // 100 USDB
const SUSDB_TYPE = '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB';
const userAddress = keypair.getPublicKey().toSuiAddress();

client.buildDepositToSavingPoolTransaction(tx, {
  lpType: SUSDB_TYPE,
  address: userAddress,
  depositCoinOrAmount: usdbAmount, // Can also pass a coin object
});

tx.setSender(userAddress);
const result = await client.getSuiClient().signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
});
```

**Withdraw USDB from saving pool:**

```typescript
const tx = new Transaction();

// Withdraw 50 LP tokens worth of USDB
const lpAmount = 50 * 10 ** 6; // 50 SUSDB (LP tokens)

const usdbCoin = client.buildWithdrawFromSavingPoolTransaction(tx, {
  lpType: SUSDB_TYPE,
  amount: lpAmount,
});

// Transfer withdrawn USDB to user
tx.transferObjects([usdbCoin], userAddress);

tx.setSender(userAddress);
const result = await client.getSuiClient().signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
});
```

**Claim rewards from saving pool:**

```typescript
const tx = new Transaction();

// Claim all available rewards
const rewardsRecord = client.buildClaimSavingRewardsTransaction(tx, {
  lpType: SUSDB_TYPE,
});

// Transfer all reward coins to user
tx.transferObjects(Object.values(rewardsRecord), userAddress);

tx.setSender(userAddress);
const result = await client.getSuiClient().signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
});
```

**Query saving pool information:**

```typescript
// Get all saving pools
const savingPools = await client.getAllSavingPoolObjects();
console.log('Saving Pools:', savingPools);

// Get user's savings positions
const userSavings = await client.getUserSavings({ address: userAddress });
console.log('User Savings:', userSavings);

// Get user's rewards for specific pools
const rewards = await client.getAccountSavingPoolRewards({
  address: userAddress,
  lpTypes: [SUSDB_TYPE],
});
console.log('Claimable Rewards:', rewards);
```

**Claim accrued interest (zero deposit/withdraw):**

```typescript
const tx = new Transaction();

// Deposit zero to distribute interest
const zeroUsdb = tx.splitCoins(tx.gas, [0]); // Zero coin
client.buildDepositToSavingPoolTransaction(tx, {
  lpType: SUSDB_TYPE,
  address: userAddress,
  depositCoinOrAmount: zeroUsdb,
});

// Withdraw zero to claim accumulated interest
const accruedUsdb = client.buildWithdrawFromSavingPoolTransaction(tx, {
  lpType: SUSDB_TYPE,
  amount: 0,
});

tx.transferObjects([accruedUsdb], userAddress);
```

### 6. Flash Mint

Flash mint allows borrowing USDB within a single transaction without collateral, useful for arbitrage and liquidations.

**Basic flash mint:**

```typescript
const tx = new Transaction();

// Flash mint 1000 USDB
const amount = 1000 * 10 ** 6; // 1000 USDB
const [usdbCoin, flashReceipt] = client.flashMint(tx, { amount });

// Use USDB for operations...
// (e.g., arbitrage, liquidation, swaps)

// Repay with 0.05% fee
const feeAmount = Math.ceil(amount * 0.0005);
const totalRepayment = amount + feeAmount;

// Get USDB to repay (from operations or swap)
// ...

// Burn to repay flash loan
client.flashBurn(tx, { usdbCoin, flashMintReceipt: flashReceipt });
```

### 7. Integration Patterns

**Pattern 1: Swap stablecoin and deposit to saving pool**

```typescript
const tx = new Transaction();

// Step 1: Swap USDC to USDB via PSM
const usdcAmount = 100 * 10 ** 6; // 100 USDC
const usdbCoin = await client.buildPSMSwapInTransaction(tx, {
  coinType: USDC_TYPE,
  inputCoinOrAmount: usdcAmount,
});

// Step 2: Deposit USDB to saving pool
client.buildDepositToSavingPoolTransaction(tx, {
  lpType: SUSDB_TYPE,
  address: userAddress,
  depositCoinOrAmount: usdbCoin,
});

tx.setSender(userAddress);
const result = await client.getSuiClient().signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
});
```

**Pattern 2: Flash mint with PSM repayment**

```typescript
const tx = new Transaction();

// Step 1: Flash mint USDB
const amount = 1000 * 10 ** 6; // 1000 USDB
const [usdbCoin, flashReceipt] = client.flashMint(tx, { amount });

// Step 2: Use USDB for operations...
// (e.g., arbitrage, liquidation, etc.)

// Step 3: Get fee in stablecoin (0.05% fee)
const feeAmount = Math.ceil(amount * 0.0005);
const feeUsdbCoin = await client.buildPSMSwapInTransaction(tx, {
  coinType: USDC_TYPE,
  inputCoinOrAmount: feeAmount,
});

// Step 4: Repay flash loan
tx.mergeCoins(usdbCoin, [feeUsdbCoin]);
client.flashBurn(tx, { usdbCoin, flashReceipt });

tx.setSender(userAddress);
const result = await client.getSuiClient().signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
});
```

**Pattern 3: Partner account integration**

```typescript
const tx = new Transaction();

// Use partner account for fee sharing
const partnerAccountId = '0x...partner-account-id';

// PSM swap with partner account
const usdbCoin = await client.buildPSMSwapInTransaction(tx, {
  accountObjectOrId: partnerAccountId,
  coinType: USDC_TYPE,
  inputCoinOrAmount: usdcAmount,
});

// Deposit to saving pool with partner account
client.buildDepositToSavingPoolTransaction(tx, {
  accountObjectOrId: partnerAccountId,
  lpType: SUSDB_TYPE,
  address: userAddress,
  depositCoinOrAmount: usdbCoin,
});
```

## Supported Collateral Types

Currently, the SDK supports the following collaterals:

```typescript
// SUI
const SUI_TYPE = '0x2::sui::SUI';

// BTC
const BTC_TYPE = '0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC';

// BFBTC
const BFBTC_TYPE = '0x7438e8caf5c345fbd3772517380bf0ca432f53892dee65ee0dda3eb127993cd9::bfbtc::BFBTC';

// WAL
const WAL_TYPE = '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL';

// LayerZero WBTC
const LZ_WBTC_TYPE = '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN';
```

## Supported PSM Stablecoins

```typescript
// USDC
const USDC_TYPE = '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';

// USDT
const USDT_TYPE = '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT';

// BUCK
const BUCK_TYPE = '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK';
```

## Supported Saving Pools

```typescript
// SUSDB (Mainnet)
const SUSDB_TYPE = '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB';
// Rewards: SUI
```

## Price Aggregation Features

The SDK now supports enhanced price aggregation capabilities:

### Batch Price Aggregation

```typescript
// Get oracle prices for multiple coin types
const coinTypes = [SUI_TYPE_ARG, BTC_TYPE, WAL_TYPE];
const prices = await client.getOraclePrices({ coinTypes });
console.log('Prices:', prices);

// Get all oracle prices
const allPrices = await client.getAllOraclePrices();
```

### Individual Price Collector Creation

```typescript
// Create a price collector (within a transaction)
const tx = new Transaction();
const collector = client.newPriceCollector(tx, { coinType: SUI_TYPE_ARG });
```

## Advanced Usage

### Custom Transaction Building

```typescript
// Create a new transaction
const tx = new Transaction();

// Aggregate prices for multiple coin types
const coinTypes = [SUI_TYPE_ARG];
const [priceResult] = await client.aggregatePrices(tx, { coinTypes });

// Create debtor request
const debtorReq = client.debtorRequest(tx, {
  coinType: SUI_TYPE_ARG,
  borrowAmount: 1 * 10 ** 6,
});

// Check update position request
const updateRequest = client.checkUpdatePositionRequest(tx, {
  coinType: SUI_TYPE_ARG,
  request: debtorReq,
});

// Update position
const [collCoin, usdbCoin, response] = client.updatePosition(tx, {
  coinType: SUI_TYPE_ARG,
  updateRequest,
  priceResult,
});

// Check response
client.checkUpdatePositionResponse(tx, {
  coinType: SUI_TYPE_ARG,
  response,
});
```

### Dry Run Transaction

```typescript
// Build transaction
const tx = new Transaction();
await client.buildManagePositionTransaction(tx, {
  coinType: SUI_TYPE_ARG,
  depositCoinOrAmount: 1 * 10 ** 9,
  borrowAmount: 1 * 10 ** 6,
});

// Simulate execution (won't actually execute on-chain)
tx.setSender('0x...your-address');
const dryRunResult = await client.getSuiClient().dryRunTransactionBlock({
  transactionBlock: await tx.build({ client: client.getSuiClient() }),
});
console.log('Simulation result:', dryRunResult.effects.status);
```

## Error Handling

```typescript
try {
  const tx = new Transaction();
  await client.buildManagePositionTransaction(tx, {
    coinType: SUI_TYPE_ARG,
    depositCoinOrAmount: 1 * 10 ** 9,
    borrowAmount: 1 * 10 ** 6,
  });

  const address = keypair.getPublicKey().toSuiAddress();
  tx.setSender(address);
  const result = await client.getSuiClient().signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log('Transaction successful:', result.digest);
} catch (error) {
  if (error.message.includes('Not enough balance')) {
    console.error('Insufficient balance');
  } else if (error.message.includes('Invalid signer')) {
    console.error('Invalid signer');
  } else if (error.message.includes('Unsupported collateral type')) {
    console.error('Unsupported collateral type');
  } else if (error.message.includes('No price feed')) {
    console.error('No price feed available');
  } else {
    console.error('Unknown error:', error.message);
  }
}
```

## Data Types

### VaultInfo

```typescript
type VaultInfo = {
  collateralType: string; // Collateral type
  collateralDecimal: number; // Collateral decimals
  collateralBalance: bigint; // Total collateral amount
  minCollateralRatio: number; // Minimum collateralization ratio
  interestRate: number; // Interest rate
  usdbSupply: bigint; // Current USDB supply
  maxUsdbSupply: bigint; // Maximum supply
  positionTableSize: number; // Number of positions
  rewardRate: Record<string, number>; // Reward rates by reward type
};
```

### PositionInfo

```typescript
type PositionInfo = {
  collateralType: string; // Collateral type
  collateralAmount: bigint; // Collateral amount
  debtAmount: bigint; // Debt amount
  debtor: string; // Debtor address
  accountId?: string; // Account object ID (if using Account)
  rewards: Record<string, bigint>; // Borrow rewards by reward type
};
```

### PaginatedPositionsResult

```typescript
type PaginatedPositionsResult = {
  positions: {
    collateralType: string;
    collateralAmount: bigint;
    debtAmount: bigint;
    debtor: string;
  }[];
  nextCursor: string | null; // Pagination cursor
};
```

### PsmPoolInfo

```typescript
type PsmPoolInfo = {
  coinType: string; // The stable coin type
  decimal: number; // Token decimals
  balance: bigint; // Pool balance amount
  usdbSupply: bigint; // USDB supply from this pool
  feeRate: {
    swapIn: number; // Fee rate for swapping in (e.g., 0.001 = 0.1%)
    swapOut: number; // Fee rate for swapping out
  };
  partnerFeeRate: Record<
    string,
    {
      swapIn: number;
      swapOut: number;
    }
  >; // Partner-specific fee rates
};
```

### SavingPoolInfo

```typescript
type SavingPoolInfo = {
  lpType: string; // LP token type
  lpSupply: bigint; // Total LP supply
  usdbBalance: bigint; // USDB reserves in pool
  usdbDepositCap: bigint | null; // Optional deposit cap
  savingRate: number; // Annual saving rate (e.g., 0.05 = 5%)
  rewardRate: Record<string, number>; // APR by reward type
};
```

### SavingInfo

```typescript
type SavingInfo = {
  lpType: string; // LP token type
  address: string; // User address
  accountId?: string; // Account object ID (optional)
  usdbBalance: bigint; // User's USDB value in pool
  lpBalance: bigint; // User's LP token balance
  rewards: Record<string, bigint>; // Claimable rewards by type
};
```

### AggregatorObjectInfo

```typescript
type AggregatorObjectInfo = {
  coinType: string; // Coin type
  priceAggregator: SharedObjectRef; // Price aggregator object
  pythPriceId?: string; // Pyth price ID
};
```

### VaultObjectInfo

```typescript
type VaultObjectInfo = {
  collateralCoinType: string; // Collateral type
  vault: SharedObjectRef; // Vault object
  rewarders?: SharedObjectRef[]; // Rewarder objects (optional)
};
```

### PsmPoolObjectInfo

```typescript
type PsmPoolObjectInfo = {
  pool: SharedObjectRef; // Shared object reference to PSM pool
};
```

### SavingPoolObjectInfo

```typescript
type SavingPoolObjectInfo = {
  pool: SharedObjectRef; // Shared object reference
  reward?: {
    rewardManager: SharedObjectRef; // Reward manager object
    rewardTypes: string[]; // List of reward token types
  };
};
```

## Architecture Improvements

### Separated Aggregator Configuration

The new version separates price aggregator configuration from vault configuration, providing better modularity:

```typescript
// Get aggregator information
const aggInfo = client.getAggregatorObjectInfo({ coinType: SUI_TYPE_ARG });

// Get vault information
const vaultInfo = client.getVaultObjectInfo({ coinType: SUI_TYPE_ARG });
```

### Enhanced Price Aggregation

```typescript
// Get oracle prices (supports both basic and derivative prices)
const prices = await client.getOraclePrices({
  coinTypes: [SUI_TYPE_ARG, BTC_TYPE],
});

// Within a transaction, aggregate prices for use in PTBs
const tx = new Transaction();
const priceResults = await client.aggregatePrices(tx, {
  coinTypes: [SUI_TYPE_ARG, BTC_TYPE],
});
```

## Utility Functions

### USDB Token Type

```typescript
// Get USDB token type
const usdbType = client.getUsdbCoinType();
console.log('USDB Type:', usdbType);
```

### Account Management

```typescript
const tx = new Transaction();

// Create account request for EOA (Externally Owned Account)
const accountRequest = client.newAccountRequest(tx, {});

// Create account request with account object
const accountRequest = client.newAccountRequest(tx, {
  accountObjectOrId: '0x...account-object-id',
});
```

## Integration with Pyth Oracle

The SDK integrates with Pyth Network for real-time price feeds:

```typescript
// Get Pyth connection
const pythConnection = client.getPythConnection();

// Get Pyth client
const pythClient = client.getPythClient();

// Price updates are automatically handled in aggregatePrices()
```

## Best Practices

1. **Set Appropriate Slippage Protection**: Lending operations may be affected by price volatility
2. **Monitor Collateralization Ratio**: Ensure the ratio stays above minimum requirements to avoid liquidation
3. **Error Handling**: Properly handle network errors and transaction failures
4. **Testing Environment**: Test on testnet before deploying to production
5. **Gas Management**: Consider gas costs for complex transactions
6. **Position Monitoring**: Regularly check position health and market conditions
7. **Batch Operations**: Use batch price aggregation features for efficiency
8. **Transaction Management**: Always create a new `Transaction` object for building transactions
9. **PSM Usage**: Check fee rates before swapping; consider using PSM for large stablecoin swaps to minimize slippage
10. **Saving Pool Strategy**: Claim accrued interest periodically using zero deposit/withdraw for gas efficiency
11. **Reward Claiming**: Regularly claim rewards from saving pools to maximize earnings
12. **Account Objects**: Use account objects for partner integrations to enable fee sharing

## Example Project

For complete usage examples, refer to [test/e2e/client.test.ts](./test/e2e/client.test.ts).

## API Reference

### Constructor Options

```typescript
interface BucketClientOptions {
  suiClient?: SuiClient; // Custom SuiClient instance
  network?: Network; // Network selection: 'mainnet' | 'testnet'
}
```

### Transaction Options

**CDP (Manage Position):**

```typescript
interface ManagePositionOptions {
  coinType: string; // Collateral token type
  depositCoinOrAmount?: number | TransactionArgument; // Amount or coin to deposit
  borrowAmount?: number | TransactionArgument; // Amount to borrow
  repayCoinOrAmount?: number | TransactionArgument; // Amount or coin to repay
  withdrawAmount?: number | TransactionArgument; // Amount to withdraw
  accountObjectOrId?: string | TransactionArgument; // Account object ID (optional)
}
```

**PSM (Peg Stability Module):**

```typescript
interface PSMSwapInOptions {
  coinType: string; // Stablecoin type (USDC, USDT, BUCK)
  inputCoinOrAmount: number | TransactionArgument; // Stablecoin amount or coin object
  accountObjectOrId?: string | TransactionArgument; // Account object ID (optional)
}

interface PSMSwapOutOptions {
  coinType: string; // Stablecoin type to receive
  usdbCoinOrAmount: number | TransactionArgument; // USDB amount or coin object
  accountObjectOrId?: string | TransactionArgument; // Account object ID (optional)
}
```

**Saving Pool:**

```typescript
interface DepositToSavingPoolOptions {
  lpType: string; // LP token type (e.g., SUSDB)
  address: string; // User address
  depositCoinOrAmount: number | TransactionArgument; // USDB amount or coin object
  accountObjectOrId?: string | TransactionArgument; // Account object ID (optional)
}

interface WithdrawFromSavingPoolOptions {
  lpType: string; // LP token type
  amount: number; // LP token amount to withdraw
  accountObjectOrId?: string | TransactionArgument; // Account object ID (optional)
}

interface ClaimSavingRewardsOptions {
  lpType: string; // LP token type
  accountObjectOrId?: string | TransactionArgument; // Account object ID (optional)
}
```

**Flash Mint:**

```typescript
interface FlashMintOptions {
  amount: number; // USDB amount to flash mint
}

interface FlashBurnOptions {
  usdbCoin: TransactionArgument; // USDB coin to burn (must include fee)
  flashMintReceipt: TransactionArgument; // Receipt from flashMint()
}
```

## Troubleshooting

### Common Issues

**"Invalid debtor address" Error:**

```typescript
// Ensure address is provided when querying positions
const positions = await client.getUserPositions({ address: '0x...your-address' });
```

**"Not enough balance" Error:**

```typescript
// Check balance before attempting transactions
const address = '0x...your-address';
const { data: coins } = await client.getSuiClient().getCoins({
  owner: address,
  coinType: SUI_TYPE_ARG,
});
console.log('Available balance:', coins);
```

**"Unsupported collateral type" Error:**

```typescript
// Use supported collateral types
const supportedTypes = client.getAllCollateralTypes();
console.log('Supported types:', supportedTypes);
```

**"No price feed" Error:**

```typescript
// Ensure the coin type has a valid price feed
const aggInfo = client.getAggregatorObjectInfo({ coinType: SUI_TYPE_ARG });
console.log('Pyth Price ID:', aggInfo.pythPriceId);
```

**"Unsupported PSM coin type" Error:**

```typescript
// Use supported PSM stablecoins
const supportedPsmCoins = await client.getAllPsmPoolObjects();
console.log('Supported PSM coins:', Object.keys(supportedPsmCoins));
```

**"Insufficient pool balance" Error (PSM):**

```typescript
// Check PSM pool balance before swapping
const psmPools = await client.getAllPsmPoolObjects();
const poolInfo = psmPools[USDC_TYPE];
console.log('Available balance:', poolInfo.balance);
console.log('USDB supply:', poolInfo.usdbSupply);
```

**"Deposit cap reached" Error (Saving Pool):**

```typescript
// Check saving pool deposit cap
const savingPools = await client.getAllSavingPoolObjects();
const poolInfo = savingPools[SUSDB_TYPE];
if (poolInfo.usdbDepositCap) {
  const remaining = poolInfo.usdbDepositCap - poolInfo.usdbBalance;
  console.log('Remaining deposit capacity:', remaining);
}
```

**"Insufficient LP balance" Error (Saving Pool):**

```typescript
// Check user's LP balance before withdrawing
const userSavings = await client.getUserSavings({ address: userAddress });
const saving = userSavings.find(s => s.lpType === SUSDB_TYPE);
if (saving) {
  console.log('Available LP balance:', saving.lpBalance);
  console.log('Equivalent USDB value:', saving.usdbBalance);
}
```

## Support & Contributing

- **GitHub**: [bucket-protocol-sdk](https://github.com/Bucket-Protocol/bucket-protocol-sdk)
- **Issues**: Please submit issues on GitHub for bug reports or feature requests
- **License**: Apache-2.0
- **Maintainer**: Justa Liang <justa@bucketprotocol.io>

## Version Information

**Current Version**: 0.15.7
**Node.js Requirement**: >= 20.18.0
**Dependencies**:

- @mysten/sui: 1.28.2
- @pythnetwork/pyth-sui-js: ^2.1.0
