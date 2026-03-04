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
