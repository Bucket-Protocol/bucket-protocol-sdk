/**
 * Diagnostic script: query Bucket Protocol on-chain state.
 *
 * Usage (from a project that has @bucket-protocol/sdk installed):
 *   node <skill-root>/scripts/query-state.mjs
 *
 * Examples of <skill-root>:
 *   .github/skills/bucket-sdk
 *   .agents/skills/bucket-sdk
 *   .claude/skills/bucket-sdk
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

import { createRequire } from 'node:module';

// Resolve SDK from the caller project (cwd), not from the skill folder location.
const requireFromCwd = createRequire(`${process.cwd()}/package.json`);
const { BucketClient } = requireFromCwd('@bucket-protocol/sdk');

function printLine(message = '') {
  process.stdout.write(`${message}\n`);
}

function isDefined(value) {
  return value !== null && value !== undefined;
}

async function main() {
  printLine('Initializing BucketClient (mainnet)...');
  printLine();
  const client = await BucketClient.initialize({ network: 'mainnet' });

  // --- USDB Supply ---
  const supply = await client.getUsdbSupply();
  printLine(`USDB Total Supply: ${(Number(supply) / 1e6).toLocaleString()} USDB`);
  printLine();

  // --- Oracle Prices ---
  printLine('=== Oracle Prices ===');
  const prices = await client.getAllOraclePrices();
  const sortedPrices = Object.entries(prices).sort(([, a], [, b]) => b - a);
  for (const [coinType, price] of sortedPrices) {
    const shortName = coinType.split('::').pop() ?? coinType;
    printLine(`  ${shortName.padEnd(20)} $${price}`);
  }
  printLine();

  // --- Vaults ---
  printLine('=== Vaults ===');
  const vaults = await client.getAllVaultObjects();
  for (const [coinType, vault] of Object.entries(vaults)) {
    const shortName = coinType.split('::').pop() ?? coinType;
    printLine(`  [${shortName}]`);
    printLine(`    Min CR:        ${vault.minCollateralRatio}`);
    printLine(`    Interest Rate: ${vault.interestRate}`);
    printLine(
      `    Max USDB:      ${isDefined(vault.maxUsdbSupply) ? (Number(vault.maxUsdbSupply) / 1e6).toLocaleString() : 'unlimited'}`,
    );
    printLine(`    USDB Minted:   ${(Number(vault.usdbSupply) / 1e6).toLocaleString()}`);
    printLine(`    Collateral:    ${vault.collateralBalance}`);
    printLine(`    Positions:     ${vault.positionTableSize}`);
  }
  printLine();

  // --- PSM Pools ---
  printLine('=== PSM Pools ===');
  const psmPools = await client.getAllPsmPoolObjects();
  for (const [coinType, pool] of Object.entries(psmPools)) {
    const shortName = coinType.split('::').pop() ?? coinType;
    printLine(`  [${shortName}]`);
    printLine(`    Balance:     ${pool.balance}`);
    printLine(`    Swap-In Fee: ${pool.feeRate.swapIn}`);
    printLine(`    Swap-Out Fee:${pool.feeRate.swapOut}`);
  }
  printLine();

  // --- Saving Pools ---
  printLine('=== Saving Pools ===');
  const savingPools = await client.getAllSavingPoolObjects();
  for (const [lpType, pool] of Object.entries(savingPools)) {
    const shortName = lpType.split('::').pop() ?? lpType;
    printLine(`  [${shortName}]`);
    printLine(`    Saving Rate:  ${pool.savingRate}`);
    printLine(`    LP Supply:    ${pool.lpSupply}`);
    printLine(
      `    Deposit Cap:  ${isDefined(pool.usdbDepositCap) ? (Number(pool.usdbDepositCap) / 1e6).toLocaleString() : 'none'}`,
    );
  }
  printLine();

  // --- Flash Mint ---
  printLine('=== Flash Mint ===');
  const flashMint = await client.getFlashMintInfo();
  printLine(`  Fee Rate: ${flashMint.feeRate}`);
  printLine();

  // --- Supported Coin Types ---
  printLine('=== Supported Collateral Types ===');
  const collTypes = await client.getAllCollateralTypes();
  for (const ct of collTypes) {
    const shortName = ct.split('::').pop() ?? ct;
    printLine(`  ${shortName}`);
  }
  printLine();

  printLine('Done.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
