/**
 * Rate-limit helpers for e2e tests: inter-file delays and RPC retry.
 * Use when running against public RPC (fullnode.mainnet.sui.io) without SUI_GRPC_URL.
 */

const INTER_FILE_DELAY_MS = 2000;
const AFTER_EACH_DELAY_MS = 2000;

let lastFileFinishedAt = 0;

/** Call before each e2e file's beforeAll. Waits if previous file ended recently. */
export async function beforeFileStart(): Promise<void> {
  if (lastFileFinishedAt > 0) {
    const elapsed = Date.now() - lastFileFinishedAt;
    if (elapsed < INTER_FILE_DELAY_MS) {
      await sleep(INTER_FILE_DELAY_MS - elapsed);
    }
  }
}

/** Call in each e2e file's afterAll. Records finish time for next file. */
export function afterFileEnd(): void {
  lastFileFinishedAt = Date.now();
}

export function getAfterEachDelayMs(): number {
  return AFTER_EACH_DELAY_MS;
}

/** Delay to use in afterEach between tests. */
export async function afterTestDelay(): Promise<void> {
  await sleep(AFTER_EACH_DELAY_MS);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function isRateLimitError(e: unknown): boolean {
  const err = e as { code?: string; message?: string };
  return err?.code === 'RESOURCE_EXHAUSTED' || String(err?.message ?? '').includes('Too Many Requests');
}

const RPC_RETRY_DELAY_MS = 2500;
const RPC_MAX_RETRIES = 4;

/**
 * Execute async fn; on RESOURCE_EXHAUSTED / Too Many Requests, retry after delay.
 * Use for RPC-heavy test bodies that may hit rate limits.
 */
export async function runWithRpcRetry<T>(fn: () => Promise<T>, maxRetries = RPC_MAX_RETRIES): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (isRateLimitError(e) && i < maxRetries - 1) {
        await sleep(RPC_RETRY_DELAY_MS);
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}
