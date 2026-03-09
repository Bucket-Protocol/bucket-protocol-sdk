/**
 * Diagnostic script: query Bucket Protocol on-chain state.
 *
 * Usage (from project root, or any project that has @bucket-protocol/sdk installed):
 *   npx tsx skills/bucket-sdk/scripts/query-state.ts
 *
 * Requires: @bucket-protocol/sdk, @mysten/sui
 *
 * Prints a summary of:
 *   - USDB total supply
 *   - Oracle prices for all supported collateral
 *   - Vault stats (TVL, collateral ratio, interest rate, max supply)
 *   - PSM pool balances and fee rates
 *   - Saving pool stats (rate, deposit cap, LP supply)
 *   - Flash mint info (fee rate)
 */

import { BucketClient } from '@bucket-protocol/sdk';

async function main() {
  console.log('Initializing BucketClient (mainnet)...\n');
  const client = await BucketClient.initialize({ network: 'mainnet' });

  // --- USDB Supply ---
  const supply = await client.getUsdbSupply();
  console.log(`USDB Total Supply: ${(Number(supply) / 1e6).toLocaleString()} USDB`);
  console.log();

  // --- Oracle Prices ---
  console.log('=== Oracle Prices ===');
  const prices = await client.getAllOraclePrices();
  const sortedPrices = Object.entries(prices).sort(([, a], [, b]) => b - a);
  for (const [coinType, price] of sortedPrices) {
    const shortName = coinType.split('::').pop() ?? coinType;
    console.log(`  ${shortName.padEnd(20)} $${price}`);
  }
  console.log();

  // --- Vaults ---
  console.log('=== Vaults ===');
  const vaults = await client.getAllVaultObjects();
  for (const [coinType, vault] of Object.entries(vaults)) {
    const shortName = coinType.split('::').pop() ?? coinType;
    console.log(`  [${shortName}]`);
    console.log(`    Min CR:        ${vault.minCollateralRatio}`);
    console.log(`    Interest Rate: ${vault.interestRate}`);
    console.log(
      `    Max USDB:      ${vault.maxUsdbSupply != null ? (Number(vault.maxUsdbSupply) / 1e6).toLocaleString() : 'unlimited'}`,
    );
    console.log(`    USDB Minted:   ${(Number(vault.usdbSupply) / 1e6).toLocaleString()}`);
    console.log(`    Collateral:    ${vault.collateralBalance}`);
    console.log(`    Positions:     ${vault.positionTableSize}`);
  }
  console.log();

  // --- PSM Pools ---
  console.log('=== PSM Pools ===');
  const psmPools = await client.getAllPsmPoolObjects();
  for (const [coinType, pool] of Object.entries(psmPools)) {
    const shortName = coinType.split('::').pop() ?? coinType;
    console.log(`  [${shortName}]`);
    console.log(`    Balance:     ${pool.balance}`);
    console.log(`    Swap-In Fee: ${pool.feeRate.swapIn}`);
    console.log(`    Swap-Out Fee:${pool.feeRate.swapOut}`);
  }
  console.log();

  // --- Saving Pools ---
  console.log('=== Saving Pools ===');
  const savingPools = await client.getAllSavingPoolObjects();
  for (const [lpType, pool] of Object.entries(savingPools)) {
    const shortName = lpType.split('::').pop() ?? lpType;
    console.log(`  [${shortName}]`);
    console.log(`    Saving Rate:  ${pool.savingRate}`);
    console.log(`    LP Supply:    ${pool.lpSupply}`);
    console.log(
      `    Deposit Cap:  ${pool.usdbDepositCap != null ? (Number(pool.usdbDepositCap) / 1e6).toLocaleString() : 'none'}`,
    );
  }
  console.log();

  // --- Flash Mint ---
  console.log('=== Flash Mint ===');
  const flashMint = await client.getFlashMintInfo();
  console.log(`  Fee Rate: ${flashMint.feeRate}`);
  console.log();

  // --- Supported Coin Types ---
  console.log('=== Supported Collateral Types ===');
  const collTypes = client.getAllCollateralTypes();
  for (const ct of collTypes) {
    const shortName = ct.split('::').pop() ?? ct;
    console.log(`  ${shortName}`);
  }
  console.log();

  console.log('Done.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
