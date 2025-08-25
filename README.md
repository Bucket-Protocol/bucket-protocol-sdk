# Bucket Protocol SDK

The Bucket Protocol TypeScript SDK is a comprehensive development toolkit for interacting with the Bucket Protocol, supporting CDP (Collateralized Debt Position) operations and enabling developers to easily integrate lending functionality.

## Installation

```bash
npm install bucket-protocol-sdk
```

## Quick Start

### Initialize Client

```typescript
import { BucketV2Client } from 'bucket-protocol-sdk';

// Use default mainnet configuration
const client = new BucketV2Client();

// Or with custom configuration
const client = new BucketV2Client({
  network: 'mainnet',
  rpcUrl: 'your-custom-rpc-url', // Optional
  sender: '0x...your-address', // Optional
});
```

### Basic Queries

```typescript
// Get all supported collateral types
const collateralTypes = client.getCDPCollateralTypes();
console.log('Supported collaterals:', collateralTypes);

// Get all vault information
const vaults = await client.getAllVaults();
console.log('Vault info:', vaults);

// Get user positions
const positions = await client.getDebtorPositions('0x...user-address');
console.log('User positions:', positions);
```

## Core Features

### 1. Manage Position

**Deposit collateral and borrow USDB:**

```typescript
import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Set user address
client.sender = '0x...your-address';

// Build transaction: deposit 1 SUI, borrow 1 USDB
const tx = await client.buildManagePositionTransaction({
  collateralCoinType: SUI_TYPE_ARG, // SUI as collateral
  depositAmount: 1 * 10 ** 9, // 1 SUI (9 decimals)
  borrowAmount: 1 * 10 ** 6, // 1 USDB (6 decimals)
});

// Sign and execute transaction
const keypair = Ed25519Keypair.fromSecretKey('your-private-key');
const result = await client.signAndExecuteTransaction({
  signer: keypair,
});
```

**Repay debt and withdraw collateral:**

```typescript
const tx = await client.buildManagePositionTransaction({
  collateralCoinType: SUI_TYPE_ARG,
  repayAmount: 1 * 10 ** 6, // Repay 1 USDB
  withdrawAmount: 0.5 * 10 ** 9, // Withdraw 0.5 SUI
});
```

### 2. Close Position

```typescript
// Close entire position (repay all debt, withdraw all collateral)
const tx = await client.buildClosePositionTransaction({
  collateralCoinType: SUI_TYPE_ARG,
  recipient: '0x...recipient-address', // Optional, defaults to sender
});

const result = await client.signAndExecuteTransaction({
  signer: keypair,
});
```

### 3. Paginated Position Queries

```typescript
// Query all positions for specific collateral (paginated)
const positions = await client.getCdpPositions({
  collateralCoinType: SUI_TYPE_ARG,
  pageSize: 50,
  cursor: null, // null for first query
});

console.log('Position list:', positions.positions);
console.log('Next cursor:', positions.nextCursor);

// Query next page
if (positions.nextCursor) {
  const nextPage = await client.getCdpPositions({
    collateralCoinType: SUI_TYPE_ARG,
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

// WAL
const WAL_TYPE = '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL';
```

## Price Aggregation Features

The SDK now supports enhanced price aggregation capabilities:

### Batch Price Aggregation

```typescript
// Aggregate prices for multiple coin types at once
const coinTypes = [SUI_TYPE_ARG, BTC_TYPE, WAL_TYPE];
const priceResults = await client.aggregatePrices({ coinTypes });

// Aggregate only basic (non-derivative) prices
const basicPrices = await client.aggregateBasicPrices({ coinTypes });
```

### Individual Price Collector Creation

```typescript
// Create a price collector
const collector = client.newPriceCollector({ coinType: SUI_TYPE_ARG });
```

## Advanced Usage

### Custom Transaction Building

```typescript
// Reset transaction object
client.resetTransaction();

// Aggregate prices for multiple coin types
const coinTypes = [SUI_TYPE_ARG];
const [priceResult] = await client.aggregatePrices({ coinTypes });

// Create debtor request
const updateRequest = client.debtorRequest({
  collateralCoinType: SUI_TYPE_ARG,
  borrowAmount: 1 * 10 ** 6,
});

// Update position
const [collCoin, usdbCoin, response] = client.updatePosition({
  collateralCoinType: SUI_TYPE_ARG,
  updateRequest,
  priceResult,
});

// Check response
client.checkResponse({
  collateralCoinType: SUI_TYPE_ARG,
  response,
});

// Get built transaction
const transaction = client.getTransaction();
```

### Dry Run Transaction

```typescript
// Build transaction
const tx = await client.buildManagePositionTransaction({
  collateralCoinType: SUI_TYPE_ARG,
  depositAmount: 1 * 10 ** 9,
  borrowAmount: 1 * 10 ** 6,
});

// Simulate execution (won't actually execute on-chain)
const dryRunResult = await client.dryrunTransaction();
console.log('Simulation result:', dryRunResult.effects.status);
```

## Error Handling

```typescript
try {
  const tx = await client.buildManagePositionTransaction({
    collateralCoinType: SUI_TYPE_ARG,
    depositAmount: 1 * 10 ** 9,
    borrowAmount: 1 * 10 ** 6,
  });

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
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
  collateralCoinType: string; // Collateral type
  collateralDecimal: number; // Collateral decimals
  collateralBalance: string; // Total collateral amount
  minCollateralRatio: number; // Minimum collateralization ratio
  interestRate: number; // Interest rate
  usdbSupply: string; // Current USDB supply
  maxSupply: string; // Maximum supply
  positionTableSize: string; // Number of positions
};
```

### PositionInfo

```typescript
type PositionInfo = {
  collateralCoinType: string; // Collateral type
  collateralAmount: string; // Collateral amount
  debtAmount: string; // Debt amount
};
```

### CdpPositionsResponse

```typescript
type CdpPositionsResponse = {
  collateralCoinType: string;
  positions: {
    debtor: string; // Debtor address
    collateralAmount: number; // Collateral amount
    debtAmount: number; // Debt amount
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
const vaultInfo = client.getVaultObjectInfo({ collateralCoinType: SUI_TYPE_ARG });
```

### Enhanced Price Aggregation

```typescript
// Batch price aggregation (will support derivative prices in the future)
const priceResults = await client.aggregatePrices({
  coinTypes: [SUI_TYPE_ARG, BTC_TYPE],
});

// Currently equivalent to aggregateBasicPrices
const basicPrices = await client.aggregateBasicPrices({
  coinTypes: [SUI_TYPE_ARG, BTC_TYPE],
});
```

## Utility Functions

### USDB Token Type

```typescript
// Get USDB token type
const usdbType = client.usdbCoinType();
console.log('USDB Type:', usdbType);
```

### Account Management

```typescript
// Create account request for EOA (Externally Owned Account)
const accountRequest = client.newAccountRequest();

// Create account request with account object
const accountRequest = client.newAccountRequest('0x...account-object-id');
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
7. **Batch Operations**: Use new batch price aggregation features for efficiency
8. **Resource Management**: Properly use `keepTransaction` parameter to manage transaction objects

## Example Project

For complete usage examples, refer to [test/e2e/client.test.ts](./test/e2e/client.test.ts).

## API Reference

### Constructor Options

```typescript
interface BucketV2ClientOptions {
  network?: 'mainnet'; // Network selection
  rpcUrl?: string; // Custom RPC URL
  sender?: string; // Default sender address
}
```

### Transaction Options

```typescript
interface ManagePositionOptions {
  collateralCoinType: string; // Collateral token type
  depositAmount?: number; // Amount to deposit
  borrowAmount?: number; // Amount to borrow
  repayAmount?: number; // Amount to repay
  withdrawAmount?: number; // Amount to withdraw
  accountObjId?: string; // Account object ID (optional)
  recipient?: string; // Recipient address
  keepTransaction?: boolean; // Keep transaction object
}
```

## Troubleshooting

### Common Issues

**"Invalid debtor address" Error:**

```typescript
// Ensure sender is set before querying positions
client.sender = '0x...your-address';
const positions = await client.getDebtorPositions();
```

**"Not enough balance" Error:**

```typescript
// Check balance before attempting transactions
const { data: coins } = await client.getSuiClient().getCoins({
  owner: client.sender,
  coinType: SUI_TYPE_ARG,
});
console.log('Available balance:', coins);
```

**"Unsupported collateral type" Error:**

```typescript
// Use supported collateral types
const supportedTypes = client.getCDPCollateralTypes();
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
