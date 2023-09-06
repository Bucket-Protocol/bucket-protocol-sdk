# Bucket Protocol TypeScript SDK

Bucket Protocol aims to be a DeFi Engine on Sui network. It allow users to draw 0% interest loans against $SUI $BTC $ETH and LST used as collateral.

Loans are paid out in $BUCK - a USD pegged stablecoin backed by multiple types of crypto, and need to maintain a minimum collateral ratio of 110%.

In addition to the collateral, the loans are secured by TANK containing $BUCK and by fellow borrowers collectively acting as guarantors of last resort. 

## Install Bucket Protocol

Install Bucket Protocol using npm : `npm i -D bucket-protocol-sdk`

Install Bucket Protocol using npm and git : `npm install https://github.com/andreidev1/bucket-protocol-sdk.git`

## Quick start

```ts
import { BucketClient } from "bucket-protocol-sdk/src/";
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

// Instantiate SuiClient connected to testnet
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Instantiate BucketClient
const buck = new BucketClient(client);
```

## Query Bucket Protocol
```ts

// Return all available bottles
await buck.getAllBottes()

// Return all destroyed bottles
await buck.getDestroyedBottles()
```