import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Transaction } from '@mysten/sui/transactions';
import { expect } from 'vitest';

import { BucketClient } from '../../../src/client.js';
import { afterFileEnd, afterTestDelay, beforeFileStart, isRateLimitError, runWithRpcRetry } from './rateLimit.js';

export const MAINNET_TIMEOUT_MS = 20_000;
export const network = 'mainnet';
export const testAccount = '0x7a718956581fbe4a568d135fef5161024e74af87a073a1489e57ebef53744652';

// Use SUI_GRPC_URL env var for a custom RPC (avoids public mainnet rate limits)
const rpcUrl = process.env.SUI_GRPC_URL ?? 'https://fullnode.mainnet.sui.io:443';
const suiClient = new SuiGrpcClient({ network, baseUrl: rpcUrl });

export let bucketClient: BucketClient;

// Slower retry/cooldown to reduce RPC rate limit hits when not using custom RPC
const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 3000;
const COOLDOWN_AFTER_CREATE_MS = 1500;

export { afterFileEnd, afterTestDelay, beforeFileStart, runWithRpcRetry };

export async function setupE2E(): Promise<void> {
  await beforeFileStart();
  await ensureBucketClient();
}

export async function ensureBucketClient(): Promise<BucketClient> {
  if (!bucketClient) {
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        bucketClient = await BucketClient.initialize({ suiClient, network });
        await new Promise((r) => setTimeout(r, COOLDOWN_AFTER_CREATE_MS));
        return bucketClient;
      } catch (e) {
        if (isRateLimitError(e) && i < MAX_RETRIES - 1) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          continue;
        }
        throw e;
      }
    }
  }
  return bucketClient;
}
/**
 * Oracle coin types with no price on mainnet today: their aggregator aborts, so any
 * PTB that prices one fails, and a batch that includes one fails as a whole.
 */
export const UNPRICED_COIN_TYPES = new Set([
  '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
  '0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::SCALLOP_SCA',
  '0x9d297676e7a4b771ab023291377b2adfaa4938fb9080b8d12430e4b108b836a9::xaum::XAUM',
  '0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::StakedHouseCoin<0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>',
]);

/** Every oracle coin type except `UNPRICED_COIN_TYPES`. Use after ensureBucketClient() has run. */
export async function getPricedOracleCoinTypes(): Promise<string[]> {
  const coinTypes = await bucketClient.getAllOracleCoinTypes();
  return coinTypes.filter((coinType) => !UNPRICED_COIN_TYPES.has(coinType));
}

/** Use after ensureBucketClient() has run. */
export async function getUsdbCoinType(): Promise<string> {
  return bucketClient.getUsdbCoinType();
}

export { suiClient };

/** Creates a Transaction with sender set to testAccount. */
export function txWithSender(): Transaction {
  const tx = new Transaction();
  tx.setSender(testAccount);
  return tx;
}

/** Dry-runs tx, asserts success, returns result for further assertions. */
export async function assertDryRunSucceeds(
  tx: Transaction,
  options?: { include?: { events?: boolean; balanceChanges?: boolean } },
) {
  const res = await suiClient.simulateTransaction({ transaction: tx, ...options });
  expect(res.$kind).toBe('Transaction');
  return res;
}

/** Deposit amount (SUI 9 decimals) for borrowAmount USDB at ~115% CR using live SUI price. */
export async function depositAmountForBorrowUsd(borrowAmountUsd: number): Promise<number> {
  const { SUI_TYPE_ARG } = await import('@mysten/sui/utils');
  const prices = await bucketClient.getOraclePrices({ coinTypes: [SUI_TYPE_ARG] });
  const suiPrice = prices[SUI_TYPE_ARG];
  expect(suiPrice).toBeDefined();
  expect(suiPrice).toBeGreaterThan(0);
  return Math.ceil((1.15 / suiPrice) * borrowAmountUsd * 10 ** 9);
}

export const usdcCoinType = '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';
export const susdbLpType = '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB';
