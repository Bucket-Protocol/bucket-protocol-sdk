# API Workflows

Use this file for write-path examples. Keep `SKILL.md` minimal and read this only when implementing flows.

## Setup

```ts
import { BucketClient } from '@bucket-protocol/sdk';
import { Transaction } from '@mysten/sui/transactions';

const client = await BucketClient.initialize({ network: 'mainnet' });
const tx = new Transaction();
```

## CDP: Deposit and Borrow

```ts
const [collateralCoin, usdbCoin] = await client.buildManagePositionTransaction(tx, {
  coinType,
  depositCoinOrAmount: 1_000_000_000,
  borrowAmount: 800_000,
});
```

## CDP: Repay and Withdraw

```ts
await client.buildManagePositionTransaction(tx, {
  coinType,
  repayCoinOrAmount: 500_000,
  withdrawAmount: 200_000_000,
});
```

## CDP: Close Position

```ts
const [allCollateral] = await client.buildClosePositionTransaction(tx, {
  address,
  coinType,
});
```

## PSM: Stablecoin -> USDB

```ts
const usdbCoin = await client.buildPSMSwapInTransaction(tx, {
  coinType: psmCoinType,
  inputCoinOrAmount: 1_000_000,
});
```

## PSM: USDB -> Stablecoin

```ts
const stableCoin = await client.buildPSMSwapOutTransaction(tx, {
  coinType: psmCoinType,
  usdbCoinOrAmount: 1_000_000,
});
```

## Saving Pool: Deposit and Withdraw

```ts
await client.buildDepositToSavingPoolTransaction(tx, {
  address,
  lpType,
  depositCoinOrAmount: 1_000_000,
});

const usdbOut = await client.buildWithdrawFromSavingPoolTransaction(tx, {
  lpType,
  amount: 500_000,
});
```

## Saving Pool: Claim Rewards

```ts
const rewards = await client.buildClaimSavingRewardsTransaction(tx, { lpType });
for (const coin of Object.values(rewards)) {
  tx.transferObjects([coin], address);
}
```

## Flash Mint

```ts
const [flashUsdb, receipt] = await client.flashMint(tx, { amount: 10_000_000 });
// use flashUsdb in the same PTB
await client.flashBurn(tx, { usdbCoin: flashUsdb, flashMintReceipt: receipt });
```

## Compose Operations Atomically

Example: swap to USDB then deposit to saving pool in one PTB.

```ts
const usdbCoin = await client.buildPSMSwapInTransaction(tx, {
  coinType: psmCoinType,
  inputCoinOrAmount: 1_000_000,
});

await client.buildDepositToSavingPoolTransaction(tx, {
  address,
  lpType,
  depositCoinOrAmount: usdbCoin,
});
```

## Execution

```ts
tx.setSender(address);
await client.getSuiClient().signAndExecuteTransaction({ signer, transaction: tx });
```

## Notes

- Build methods append commands only; they do not execute on chain.
- Use raw integer units, not decimal strings.
- For dry run, set sender and call `simulateTransaction`.
