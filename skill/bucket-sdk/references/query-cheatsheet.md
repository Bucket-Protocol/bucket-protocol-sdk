# Query Cheatsheet

Use this file for read-path tasks and debugging checks.

## Protocol and Config

```ts
const config = await client.getConfig();
const usdbType = await client.getUsdbCoinType();
```

## Supported Types

```ts
const collateralTypes = await client.getAllCollateralTypes();
const oracleTypes = await client.getAllOracleCoinTypes();
const psmTypes = Object.keys(await client.getAllPsmPoolObjects());
const savingLpTypes = Object.keys(await client.getAllSavingPoolObjects());
```

## Market State

```ts
const usdbSupply = await client.getUsdbSupply();
const allPrices = await client.getAllOraclePrices();
const vaults = await client.getAllVaultObjects();
const psmPools = await client.getAllPsmPoolObjects();
const savingPools = await client.getAllSavingPoolObjects();
const flashInfo = await client.getFlashMintInfo();
```

## User State

```ts
const positions = await client.getUserPositions({ address });
const savings = await client.getUserSavings({ address });
const accounts = await client.getUserAccounts({ address });
```

## Rewards

```ts
const borrowRewards = await client.getAccountBorrowRewards({
  address,
  coinTypes: collateralTypes,
});

const savingRewards = await client.getAccountSavingPoolRewards({
  address,
  lpTypes: savingLpTypes,
});
```

## Position Pagination

```ts
const page1 = await client.getAllPositions({ coinType, pageSize: 50, cursor: null });
const page2 = page1.nextCursor
  ? await client.getAllPositions({ coinType, pageSize: 50, cursor: page1.nextCursor })
  : null;
```

## Error Checks

If `Unsupported collateral type`:
- compare input with `getAllCollateralTypes()`

If `Unsupported PSM coin type`:
- compare input with `Object.keys(await client.getAllPsmPoolObjects())`

If missing price:
- ensure type appears in `getAllOracleCoinTypes()`

If pool balance issue:
- inspect `getAllPsmPoolObjects()` or `getAllSavingPoolObjects()`

## Refresh Strategy

After protocol upgrade or stale data suspicion:

```ts
await client.refreshConfig();
```

Then re-read supported types and retry.
