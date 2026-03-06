/**
 * Collects output from all public query APIs for manual review with stakeholders.
 * Run: pnpm vitest run test/e2e/all-query-outputs.test.ts --testTimeout=60000
 * Output: test-results/query-outputs.json + query-outputs.md
 */
import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

import type { VaultObjectInfo } from '../../src/types/config.js';
import { queryAllConfig, toJson } from '../../src/utils/bucketConfig.js';
import { convertOnchainConfig, enrichSharedObjectRefs } from '../../src/utils/configAdapter.js';
import { coinWithBalance } from '../../src/utils/transaction.js';
import {
  afterFileEnd,
  bucketClient,
  depositAmountForBorrowUsd,
  getUsdbCoinType,
  MAINNET_TIMEOUT_MS,
  network,
  setupE2E,
  suiClient,
  susdbLpType,
  testAccount,
  txWithSender,
  usdcCoinType,
} from './helpers/setup.js';

type QueryResult = {
  api: string;
  success: boolean;
  durationMs?: number;
  output?: unknown;
  error?: string;
};

function serializeForJson(value: unknown): unknown {
  if (value === undefined) return undefined;
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return value.map(serializeForJson);
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = serializeForJson(v);
    }
    return out;
  }
  return value;
}

const results: QueryResult[] = [];

describe('E2E All query outputs (report)', () => {
  beforeAll(setupE2E);
  afterAll(afterFileEnd);

  afterAll(() => {
    const outDir = join(process.cwd(), 'test-results');
    mkdirSync(outDir, { recursive: true });

    const jsonPath = join(outDir, 'query-outputs.json');
    writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8');

    const mdLines: string[] = [
      '# Bucket SDK Query API Outputs',
      '',
      `Generated: ${new Date().toISOString()}`,
      `Test account: ${testAccount}`,
      '',
      '| API | Success | Duration (ms) | Notes |',
      '|-----|---------|---------------|-------|',
    ];
    for (const r of results) {
      const notes = r.success
        ? (typeof r.output === 'object' && r.output !== null
            ? `${Object.keys(r.output as object).length} keys/items`
            : String(r.output))
        : (r.error ?? 'unknown');
      mdLines.push(`| ${r.api} | ${r.success ? '✓' : '✗'} | ${r.durationMs ?? '-'} | ${notes} |`);
    }
    mdLines.push('');
    mdLines.push('## Full output (JSON)');
    mdLines.push('');
    mdLines.push('See `test-results/query-outputs.json` for full serialized output.');
    const mdPath = join(outDir, 'query-outputs.md');
    writeFileSync(mdPath, mdLines.join('\n'), 'utf-8');

    // eslint-disable-next-line no-console
    console.log(`\n[all-query-outputs] Report written to ${jsonPath} and ${mdPath}`);
  });

  it(
    'collects all query API outputs',
    async () => {
      const run = async (api: string, fn: () => Promise<unknown>): Promise<void> => {
        const start = Date.now();
        try {
          const output = await fn();
          results.push({
            api,
            success: true,
            durationMs: Date.now() - start,
            output: serializeForJson(output),
          });
        } catch (e) {
          results.push({
            api,
            success: false,
            durationMs: Date.now() - start,
            error: e instanceof Error ? e.message : String(e),
          });
        }
      };

      const coinTypes = bucketClient.getAllOracleCoinTypes().slice(0, 2);
      const collateralTypes = bucketClient.getAllCollateralTypes().slice(0, 2);
      const lpTypes = Object.keys(bucketClient.getConfig().SAVING_POOL_OBJS ?? {}).slice(0, 2);
      const firstCoinType = collateralTypes[0] ?? SUI_TYPE_ARG;
      // getBorrowRewardFlowRate 需要 vault 有 rewarders，否則回傳 {}；選第一個有 rewarders 的 vault
      const coinTypeWithRewarders =
        (
          Object.entries(bucketClient.getConfig().VAULT_OBJS ?? {}) as [string, VaultObjectInfo][]
        ).find(([, v]) => v.rewarders && v.rewarders.length > 0)?.[0] ?? firstCoinType;
      const firstLpType = lpTypes[0] ?? susdbLpType;
      const config = bucketClient.getConfig();
      const firstPsmCoinType = Object.keys(config.PSM_OBJS ?? {})[0] ?? usdcCoinType;

      // Sync config-derived
      await run('getUsdbCoinType', () => Promise.resolve(getUsdbCoinType()));
      await run('getAllOracleCoinTypes', () =>
        Promise.resolve(bucketClient.getAllOracleCoinTypes()),
      );
      await run('getAllCollateralTypes', () =>
        Promise.resolve(bucketClient.getAllCollateralTypes()),
      );
      await run('getAggregatorObjectInfo', () =>
        Promise.resolve(bucketClient.getAggregatorObjectInfo({ coinType: firstCoinType })),
      );
      await run('getVaultObjectInfo', () =>
        Promise.resolve(bucketClient.getVaultObjectInfo({ coinType: firstCoinType })),
      );
      await run('getSavingPoolObjectInfo', () =>
        Promise.resolve(bucketClient.getSavingPoolObjectInfo({ lpType: firstLpType })),
      );
      await run('getPsmPoolObjectInfo', () =>
        Promise.resolve(bucketClient.getPsmPoolObjectInfo({ coinType: firstPsmCoinType })),
      );

      // Client / config
      await run('getSuiClient', () =>
        Promise.resolve({ type: 'SuiGrpcClient', hasClient: !!bucketClient.getSuiClient() }),
      );
      await run('refreshConfig', () => bucketClient.refreshConfig());

      await run('getConfig', () => Promise.resolve(bucketClient.getConfig()));

      // Utils (exported from @bucket-protocol/sdk)
      await run('queryAllConfig', () => queryAllConfig(suiClient, network));
      await run('toJson', async () => {
        const raw = await queryAllConfig(suiClient, network);
        return toJson(raw);
      });
      await run('convertOnchainConfig', async () => {
        const raw = await queryAllConfig(suiClient, network);
        return convertOnchainConfig(raw);
      });
      await run('enrichSharedObjectRefs', async () => {
        const raw = await queryAllConfig(suiClient, network);
        const config = convertOnchainConfig(raw);
        return enrichSharedObjectRefs(config, suiClient);
      });
      await run('coinWithBalance', async () => {
        const tx = txWithSender();
        const fn = coinWithBalance({ type: getUsdbCoinType(), balance: 1n * 10n ** 6n });
        const result = fn(tx);
        return { type: 'TransactionResult', built: true };
      });
      await run('getUsdbSupply', () => bucketClient.getUsdbSupply());
      await run('getOraclePrices', () => bucketClient.getOraclePrices({ coinTypes }));
      await run('getAllOraclePrices', () => bucketClient.getAllOraclePrices());
      await run('getBorrowRewardFlowRate', () =>
        bucketClient.getBorrowRewardFlowRate({ coinType: coinTypeWithRewarders }),
      );
      await run('getAllVaultObjects', () => bucketClient.getAllVaultObjects());
      await run('getSavingPoolRewardFlowRate', () =>
        bucketClient.getSavingPoolRewardFlowRate({ lpType: susdbLpType }),
      );
      await run('getAllSavingPoolObjects', () => bucketClient.getAllSavingPoolObjects());
      await run('getAllPsmPoolObjects', () => bucketClient.getAllPsmPoolObjects());
      await run('getFlashMintInfo', () => bucketClient.getFlashMintInfo());
      await run('getAllPositions', () =>
        bucketClient.getAllPositions({ coinType: firstCoinType, pageSize: 5 }),
      );
      // getAllPositions with cursor (pagination)
      const firstPage = await bucketClient.getAllPositions({
        coinType: firstCoinType,
        pageSize: 2,
        cursor: null,
      });
      if (firstPage.nextCursor) {
        await run('getAllPositions (with cursor)', () =>
          bucketClient.getAllPositions({
            coinType: firstCoinType,
            pageSize: 2,
            cursor: firstPage.nextCursor!,
          }),
        );
      }
      await run('getUserAccounts', () => bucketClient.getUserAccounts({ address: testAccount }));
      // getAccountBorrowRewards returns {} when vaults have no rewarders; use coinTypes with rewarders
      const coinTypesWithRewarders = (
        Object.entries(bucketClient.getConfig().VAULT_OBJS ?? {}) as [string, VaultObjectInfo][]
      )
        .filter(([, v]) => v.rewarders && v.rewarders.length > 0)
        .map(([k]) => k)
        .slice(0, 3);
      await run('getAccountBorrowRewards', () =>
        bucketClient.getAccountBorrowRewards({
          address: testAccount,
          coinTypes: coinTypesWithRewarders.length > 0 ? coinTypesWithRewarders : collateralTypes,
        }),
      );
      await run('getAccountPositions', () =>
        bucketClient.getAccountPositions({ address: testAccount }),
      );
      await run('getUserPositions', () => bucketClient.getUserPositions({ address: testAccount }));
      await run('getAccountSavingPoolRewards', () =>
        bucketClient.getAccountSavingPoolRewards({
          address: testAccount,
          lpTypes: [susdbLpType],
        }),
      );
      await run('getAccountSavings', () =>
        bucketClient.getAccountSavings({ address: testAccount }),
      );
      await run('getUserSavings', () => bucketClient.getUserSavings({ address: testAccount }));

      // build* APIs (PTB builders) — capture summary since TransactionResult doesn't serialize well
      const captureBuild = async <T>(
        api: string,
        fn: () => Promise<T>,
      ): Promise<void> => {
        const start = Date.now();
        try {
          const output = await fn();
          if (output === undefined || output === null) {
            results.push({
              api,
              success: true,
              durationMs: Date.now() - start,
              output: { built: true, resultType: 'void' },
            });
            return;
          }
          const isArr = Array.isArray(output);
          const summary: Record<string, unknown> = {
            built: true,
            resultType: isArr ? 'array' : 'record',
            length: isArr ? (output as unknown[]).length : Object.keys(output as object).length,
          };
          if (!isArr && output && typeof output === 'object') {
            summary.keys = Object.keys(output as object);
          }
          results.push({
            api,
            success: true,
            durationMs: Date.now() - start,
            output: summary,
          });
        } catch (e) {
          results.push({
            api,
            success: false,
            durationMs: Date.now() - start,
            error: e instanceof Error ? e.message : String(e),
          });
        }
      };

      const depositAmount = await depositAmountForBorrowUsd(1);
      const usdbType = getUsdbCoinType();

      await captureBuild('buildManagePositionTransaction', async () => {
        const tx = txWithSender();
        return bucketClient.buildManagePositionTransaction(tx, {
          coinType: SUI_TYPE_ARG,
          depositCoinOrAmount: depositAmount,
          borrowAmount: 1 * 10 ** 6,
        });
      });
      await captureBuild('buildClosePositionTransaction', async () => {
        const tx = txWithSender();
        return bucketClient.buildClosePositionTransaction(tx, {
          address: testAccount,
          coinType: SUI_TYPE_ARG,
        });
      });
      await captureBuild('buildClaimBorrowRewardsTransaction', async () => {
        const tx = txWithSender();
        return bucketClient.buildClaimBorrowRewardsTransaction(tx, {
          accountObjectOrId: testAccount,
          coinType: coinTypeWithRewarders,
        });
      });
      await captureBuild('buildDepositToSavingPoolTransaction', async () => {
        const tx = txWithSender();
        const amt = 1n * 10n ** 6n;
        const coin = coinWithBalance({ type: usdbType, balance: amt });
        bucketClient.buildDepositToSavingPoolTransaction(tx, {
          lpType: susdbLpType,
          address: testAccount,
          depositCoinOrAmount: coin,
        });
        return undefined as void;
      });
      await captureBuild('buildWithdrawFromSavingPoolTransaction', async () => {
        const tx = txWithSender();
        return bucketClient.buildWithdrawFromSavingPoolTransaction(tx, {
          lpType: susdbLpType,
          accountObjectOrId: testAccount,
          amount: 1 * 10 ** 6,
        });
      });
      await captureBuild('buildClaimSavingRewardsTransaction', async () => {
        const tx = txWithSender();
        return bucketClient.buildClaimSavingRewardsTransaction(tx, {
          accountObjectOrId: testAccount,
          lpType: susdbLpType,
        });
      });
      await captureBuild('buildPSMSwapInTransaction', async () => {
        const tx = txWithSender();
        const coin = coinWithBalance({ type: usdcCoinType, balance: 1n * 10n ** 6n });
        return bucketClient.buildPSMSwapInTransaction(tx, {
          coinType: usdcCoinType,
          inputCoinOrAmount: coin,
        });
      });
      await captureBuild('buildPSMSwapOutTransaction', async () => {
        const tx = txWithSender();
        const coin = coinWithBalance({ type: usdbType, balance: 1n * 10n ** 6n });
        return bucketClient.buildPSMSwapOutTransaction(tx, {
          coinType: usdcCoinType,
          usdbCoinOrAmount: coin,
        });
      });

      // aggregatePrices — fetches Pyth from Hermes, adds price update calls to PTB
      await captureBuild('aggregatePrices', async () => {
        const tx = txWithSender();
        return bucketClient.aggregatePrices(tx, { coinTypes: [firstCoinType] });
      });

      // flashMint — returns [usdbCoin, flashMintReceipt]
      await captureBuild('flashMint', async () => {
        const tx = txWithSender();
        return bucketClient.flashMint(tx, { amount: 1_000 * 10 ** 6 });
      });

      // flashBurn — requires flashMint receipt; full flow: mint → PSM swap fee → merge → burn
      await captureBuild('flashBurn', async () => {
        const tx = txWithSender();
        const amount = 1_000 * 10 ** 6;
        const feeAmount = Math.ceil(amount * 0.0005);
        const [usdbCoin, flashMintReceipt] = bucketClient.flashMint(tx, { amount });
        const feeCollateralCoin = coinWithBalance({
          type: usdcCoinType,
          balance: feeAmount,
        });
        const feeUsdbCoin = await bucketClient.buildPSMSwapInTransaction(tx, {
          coinType: usdcCoinType,
          inputCoinOrAmount: feeCollateralCoin,
        });
        tx.mergeCoins(usdbCoin, [feeUsdbCoin]);
        bucketClient.flashBurn(tx, { usdbCoin, flashMintReceipt });
        return undefined as void;
      });

      // newPriceCollector — creates price collector for custom tx building
      await captureBuild('newPriceCollector', async () => {
        const tx = txWithSender();
        return bucketClient.newPriceCollector(tx, { coinType: firstCoinType });
      });

      // newAccountRequest — EOA (no accountObjectOrId)
      await captureBuild('newAccountRequest', async () => {
        const tx = txWithSender();
        return bucketClient.newAccountRequest(tx, {});
      });

      // debtorRequest — minimal CDP request (borrow only)
      await captureBuild('debtorRequest', async () => {
        const tx = txWithSender();
        return bucketClient.debtorRequest(tx, {
          coinType: firstCoinType,
          borrowAmount: 1 * 10 ** 6,
        });
      });

      // Custom CDP flow: checkUpdatePositionRequest → updatePosition → checkUpdatePositionResponse
      await captureBuild('customCdpFlow (checkRequest+updatePosition+checkResponse)', async () => {
        const tx = txWithSender();
        const [priceResult] = await bucketClient.aggregatePrices(tx, {
          coinTypes: [firstCoinType],
        });
        const debtorReq = bucketClient.debtorRequest(tx, {
          coinType: firstCoinType,
          borrowAmount: 1 * 10 ** 6,
        });
        const updateRequest = bucketClient.checkUpdatePositionRequest(tx, {
          coinType: firstCoinType,
          request: debtorReq,
        });
        const [, , response] = bucketClient.updatePosition(tx, {
          coinType: firstCoinType,
          updateRequest,
          priceResult,
        });
        bucketClient.checkUpdatePositionResponse(tx, {
          coinType: firstCoinType,
          response,
        });
        return { built: true, apis: ['checkUpdatePositionRequest', 'updatePosition', 'checkUpdatePositionResponse'] };
      });

      expect(results.length).toBeGreaterThan(0);
    },
    MAINNET_TIMEOUT_MS * 3,
  );
});
