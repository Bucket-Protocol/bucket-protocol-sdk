# Bucket Protocol SDK

The Bucket Protocol TypeScript SDK is a comprehensive development toolkit for interacting with the Bucket Protocol, supporting CDP (Collateralized Debt Position) operations and enabling developers to easily integrate lending functionality.

## Installation

```bash
npm install bucket-protocol-sdk
```

## Quick Start

### Initialize Client

```typescript
import { BucketClient } from 'bucket-protocol-sdk';
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

// Get all vault information
const vaults = await client.getAllVaultObjects();
console.log('Vault info:', vaults);

// Get user positions
const positions = await client.getUserPositions({ address: '0x...user-address' });
console.log('User positions:', positions);
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

### New Data Types

#### AggregatorObjectInfo

```typescript
type AggregatorObjectInfo = {
  coinType: string; // Coin type
  priceAggregator: SharedObjectRef; // Price aggregator object
  pythPriceId?: string; // Pyth price ID
};
```

#### VaultObjectInfo

```typescript
type VaultObjectInfo = {
  collateralCoinType: string; // Collateral type
  vault: SharedObjectRef; // Vault object
  rewarders?: SharedObjectRef[]; // Rewarder objects (optional)
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
