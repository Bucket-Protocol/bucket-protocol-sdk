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
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

// Use default mainnet configuration
const client = new BucketClient({});

// Or with custom configuration
const network = "mainnet";
const suiClient = new SuiClient({
    url: getFullnodeUrl(network)
});
const client = new BucketClient({
    suiClient, // Optional
    network // Optional
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
const positions = await client.getUserPositions({
    address: '0x...user-address'
});
console.log('User positions:', positions);
```

## Core Features

### 1. Manage Position

**Deposit collateral and borrow USDB:**

```typescript
import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Set user address
const tx = new Transaction();
tx.setSender('0x...your-address');

// Build transaction: deposit 1 SUI, borrow 1 USDB
const [, usdbCoin] = await client.buildManagePositionTransaction(tx, {
    coinType: SUI_TYPE_ARG, // SUI as collateral
    depositCoinOrAmount: 1 * 10 ** 9, // 1 SUI (9 decimals)
    borrowAmount: 1 * 10 ** 6 // 1 USDB (6 decimals)
});

// Transfer USDB to your address
tx.transferObjects([usdbCoin], '0x...your-address');

// Sign and execute transaction
const keypair = Ed25519Keypair.fromSecretKey('your-private-key');
const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair
});
```

**Repay debt and withdraw collateral:**

```typescript
const [, sui] = await client.buildManagePositionTransaction(tx, {
    coinType: SUI_TYPE_ARG,
    repayCoinOrAmount: 1 * 10 ** 6, // Repay 1 USDB
    withdrawAmount: 0.5 * 10 ** 9 // Withdraw 0.5 SUI
});
```

### 2. Close Position

```typescript
// Close entire position (repay all debt, withdraw all collateral)
client.buildClosePositionTransaction(tx, {
    coinType: SUI_TYPE_ARG,
    address: '0x...recipient-address'
});
```

### 3. Paginated Position Queries

```typescript
// Query all positions for specific collateral (paginated)
const positions = await client.getAllPositions({
    coinType: SUI_TYPE_ARG,
    pageSize: 50,
    cursor: null // null for first query
});

console.log('Position list:', positions.positions);
console.log('Next cursor:', positions.nextCursor);

// Query next page
if (positions.nextCursor) {
    const nextPage = await client.getAllPositions({
        coinType: SUI_TYPE_ARG,
        pageSize: 50,
        cursor: positions.nextCursor
    });
}
```

## Supported Collateral Types

Currently, the SDK supports the following collaterals:

```typescript
// SUI
const SUI_TYPE = '0x2::sui::SUI';

// haSUI
const HASUI_TYPE = '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI';

// vSUI
const VSUI_TYPE = '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT';

// afSUI
const AFSUI_TYPE = '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI';

// BTC
const BTC_TYPE = '0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC';

// xBTC
const XBTC_TYPE = '0x876a4b7bce8aeaef60464c11f4026903e9afacab79b9b142686158aa86560b50::xbtc::XBTC';

// WAL
const WAL_TYPE = '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL';

// SCA
const SCA_TYPE = '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA';

// sSUI
const SSUI_TYPE = '0xaafc4f740de0dd0dde642a31148fb94517087052f19afb0f7bed1dc41a50c77b::scallop_sui::SCALLOP_SUI';

// sUSDC
const SUSDC_TYPE = '0x854950aa624b1df59fe64e630b2ba7c550642e9342267a33061d59fb31582da5::scallop_usdc::SCALLOP_USDC';

// sSBUSDT
const SSBUSDT_TYPE = '0xb1d7df34829d1513b73ba17cb7ad90c88d1e104bb65ab8f62f13e0cc103783d3::scallop_sb_usdt::SCALLOP_SB_USDT';

// sWAL
const SWAL_TYPE = '0x622345b3f80ea5947567760eec7b9639d0582adcfd6ab9fccb85437aeda7c0d0::scallop_wal::SCALLOP_WAL';

// sDEEP
const SDEEP_TYPE = '0xeb7a05a3224837c5e5503575aed0be73c091d1ce5e43aa3c3e716e0ae614608f::scallop_deep::SCALLOP_DEEP';

// sSBETH
const SSBETH_TYPE = '0xb14f82d8506d139eacef109688d1b71e7236bcce9b2c0ad526abcd6aa5be7de0::scallop_sb_eth::SCALLOP_SB_ETH';

// sSCA
const SSCA_TYPE = '0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::SCALLOP_SCA';

// gSUI
const GSUI_TYPE = '0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::StakedHouseCoin<0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>';

// gUPUSD
const GUPUSD_TYPE = '0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::StakedHouseCoin<0x5de877a152233bdd59c7269e2b710376ca271671e9dd11076b1ff261b2fd113c::up_usd::UP_USD>';

// TLP
const TLP_TYPE = '0xe27969a70f93034de9ce16e6ad661b480324574e68d15a64b513fd90eb2423e5::tlp::TLP';
```

## Price Aggregation Features

The SDK now supports enhanced price aggregation capabilities:

### Batch Price Aggregation

```typescript
// Aggregate prices for multiple coin types at once
const coinTypes = [SUI_TYPE_ARG, BTC_TYPE, WAL_TYPE];
const priceResults = await client.aggregatePrices(tx, { coinTypes });

// Aggregate only basic (non-derivative) prices
const basicPrices = await client.aggregateBasicPrices(tx, { coinTypes });
```

### Individual Price Collector Creation

```typescript
// Create a price collector
const collector = client.newPriceCollector(tx, { coinType: SUI_TYPE_ARG });
```

## Advanced Usage

### Custom Transaction Building

```typescript
const tx = new Transaction();
tx.setSender('0x...your-address');

// Aggregate prices for multiple coin types
const coinTypes = [SUI_TYPE_ARG];
const priceResults = await client.aggregatePrices(tx, { coinTypes });

// Create debtor request
const updateRequest = client.debtorRequest(tx, {
    collateralCoinType: SUI_TYPE_ARG,
    borrowAmount: 1 * 10 ** 6,
});

// Update position
const [collCoin, usdbCoin, response] = client.updatePosition(tx, {
    collateralCoinType: SUI_TYPE_ARG,
    updateRequest,
    priceResults,
});

// Check response
client.checkUpdatePositionResponse(tx, {
    coinType: SUI_TYPE_ARG,
    response
});
```

### Dry Run Transaction

```typescript
// Build transaction
const tx = new Transaction();
tx.setSender('0x...your-address');

const [, usdbCoin] = await client.buildManagePositionTransaction(tx, {
    coinType: SUI_TYPE_ARG,
    depositCoinOrAmount: 1 * 10 ** 9,
    borrowAmount: 1 * 10 ** 6
});
tx.transferObjects([usdbCoin], '0x...your-address');

// Simulate execution (won't actually execute on-chain)
const dryRunResult = await suiClient.dryRunTransactionBlock({
    transactionBlock: await tx.build({ client: suiClient })
});
console.log('Simulation result:', dryRunResult.effects.status);
```

## Error Handling

```typescript
try {
    const [, usdbCoin] = await client.buildManagePositionTransaction(tx, {
        coinType: SUI_TYPE_ARG,
        depositCoinOrAmount: 1 * 10 ** 9,
        borrowAmount: 1 * 10 ** 6
    });
    tx.transferObjects([usdbCoin], '0x...your-address');

    const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair
    });
    await suiClient.waitForTransaction({
        digest: result.digest
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
    collateralType: string;
    collateralDecimal: number;
    collateralBalance: bigint;
    usdbSupply: bigint;
    maxUsdbSupply: bigint;
    minCollateralRatio: number;
    interestRate: number;
    positionTableSize: number;
    rewardRate: Record<string, number>;
};
```

### PositionInfo

```typescript
type PositionInfo = {
    collateralType: string;
    collateralAmount: bigint;
    debtAmount: bigint;
    debtor: string;
    accountId?: string;
    rewards?: Record<string, bigint>;
};
```

### PaginatedPositionsResult

```typescript
type PaginatedPositionsResult = {
    positions: PositionInfo[];
    nextCursor: string | null;
};
```

### New Data Types

#### AggregatorObjectInfo

```typescript
type AggregatorObjectInfo = {
    priceAggregator: SharedObjectRef;
    pythPriceId?: string;
    derivativeInfo?: {
        underlyingCoinType: string;
        derivativeKind: DerivativeKind;
    };
};
```

#### VaultObjectInfo

```typescript
type VaultObjectInfo = {
    vault: SharedObjectRef;
    rewarders?: RewarderInfo[];
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
// Batch price aggregation (will support derivative prices in the future)
const priceResults = await client.aggregatePrices(tx, {
    coinTypes: [SUI_TYPE_ARG, BTC_TYPE],
});

// Currently equivalent to aggregateBasicPrices
const basicPrices = await client.aggregateBasicPrices(tx, {
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
// Create account request for EOA (Externally Owned Account)
const accountRequest = client.newAccountRequest(tx, {});

// Create account request with account object
const accountRequest = client.newAccountRequest(tx, {
    accountObjectOrId: '0x...account-object-id'
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
7. **Batch Operations**: Use new batch price aggregation features for efficiency
8. **Resource Management**: Properly use `keepTransaction` parameter to manage transaction objects

## Example Project

For complete usage examples, refer to [sdk/test/e2e/client.test.ts](./sdk/test/e2e/client.test.ts).

## API Reference

### Constructor Options

```typescript
type Network = 'mainnet' | 'testnet';
interface BucketClientOptions {
    suiClient?: SuiClient; // SuiClient in '@mysten/sui/client'
    network?: Network;
}
```

### Transaction Options

```typescript
interface ManagePositionOptions {
    coinType: string; // Collateral token type
    depositCoinOrAmount?: number | TransactionArgument; // Deposit coin or amount to deposit
    borrowAmount?: number | TransactionArgument; // Amount to borrow
    repayCoinOrAmount?: number | TransactionArgument; // Repay Coin or amount to repay
    withdrawAmount?: number | TransactionArgument; // Amount to withdraw
    accountObjectOrId?: string | TransactionArgument; // Account object ID (optional)
}
```

## Troubleshooting

### Common Issues

**"Invalid debtor address" Error:**

```typescript
// Ensure address is correct before querying positions
const positions = await client.getUserPositions({
    address: '0x...your-address'
});
```

**"Not enough balance" Error:**

```typescript
// Check balance before attempting transactions
const { data: coins } = await suiClient.getCoins({
    owner: '0x...your-address',
    coinType: SUI_TYPE_ARG
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

**Current Version**: 1.0.3
**Node.js Requirement**: >= 20.18.0
**Dependencies**:

- @mysten/sui: 1.37.5
- @pythnetwork/pyth-sui-js: ^2.2.0
