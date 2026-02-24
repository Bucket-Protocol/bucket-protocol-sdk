# Bucket Protocol SDK — @mysten/sui 升級至 v2.0 計畫

本文件說明如何將本 SDK 的 `@mysten/sui` 依賴從目前版本（1.38.x）升級到 v2.0，並依 [sui-dev-skills](https://github.com/MystenLabs/sui-dev-skills/tree/main/sui-ts-sdk) 與 [官方遷移指南](https://sdk.mystenlabs.com/sui/migrations/sui-2.0/llms.txt) 整理變更要點。

---

## 一、現況摘要

| 項目 | 目前 |
|------|------|
| 分支 | `upgrade/mysten-sui-v2`（已建立） |
| peerDependencies | `@mysten/sui`: ">=1.38.0", `@mysten/bcs`: ">=1.8.0" |
| devDependencies | `@mysten/sui`: "1.38.0", `@mysten/bcs`: "1.8.0" |
| 主要使用處 | `src/client.ts`, `src/utils/resolvers.ts`, `src/utils/transaction.ts`, `test/e2e/client.test.ts` |
| 其餘 | `src/_generated/**`、`src/types/`、`src/consts/` — 多為 `bcs`、`Transaction`、utils，多數可沿用 |

---

## 二、v2 重點變更（依 sui-dev-skills + 官方遷移）

### 2.1 套件與 ESM

- **套件名稱**：維持 `@mysten/sui`（勿用已棄用的 `@mysten/sui.js`）。
- **ESM**：v2 僅支援 ESM；本專案已為 `"type": "module"`，無須改。
- **依賴版本**：
  - `package.json` 的 `peerDependencies` / `devDependencies` 改為 `@mysten/sui` >= 2.0.0（及 v2 相容的 `@mysten/bcs`，依官方建議）。

### 2.2 Client：SuiClient 移除，改用 SuiJsonRpcClient 或 SuiGrpcClient

**目前（v1）：**

```ts
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
```

**v2 選項一（建議長期）：gRPC**

```ts
import { SuiGrpcClient } from '@mysten/sui/grpc';
const client = new SuiGrpcClient({
  network: 'mainnet',
  baseUrl: 'https://fullnode.mainnet.sui.io:443',
});
```

**v2 選項二（相容既有 RPC URL）：JSON-RPC**

```ts
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
const client = new SuiJsonRpcClient({
  url: getJsonRpcFullnodeUrl('mainnet'),
  network: 'mainnet',  // v2 必填
});
```

- 本 SDK 對外暴露 `getSuiClient()`，型別需改為 v2 的 client 型別（或 `ClientWithCoreApi`），以利呼叫端用 gRPC 或 JSON-RPC。
- 建構子若仍接受「自訂 client」，需改為接受 v2 client（例如 `SuiJsonRpcClient` 或 `SuiGrpcClient`），並在無傳入時用上述其一建立預設連線。

### 2.3 查詢與執行 API：改為 Core API（client.core.*）

所有下列呼叫皆改為透過 `client.core.*`，且參數/回傳格式依 v2 調整：

| 目前 (v1) | v2 |
|-----------|-----|
| `client.getObject({ id, options })` | `client.core.getObject({ objectId, include })` |
| `client.multiGetObjects({ ids, options })` | `client.core.getObjects({ objectIds, include })` |
| `client.getCoins({ owner, coinType, cursor })` | `client.core.listCoins({ owner, coinType, cursor })` |
| `client.devInspectTransactionBlock(...)` | `client.core.simulateTransaction(...)` |
| `client.dryRunTransactionBlock(...)` | `client.core.simulateTransaction(...)` |

- **options → include**：例如 `showBcs: true`、`showContent: true` 改為 `include: { bcs: true }`、`include: { content: true }` 等（以官方文件為準）。
- **回傳結構**：v2 回傳的物件形狀可能不同（例如 `getObjects` 回傳陣列或包一層），需依新型別改寫取值邏輯。

### 2.4 交易執行與結果

- **簽名並執行**：`client.signAndExecuteTransactionBlock` → `client.signAndExecuteTransaction`（本專案若已用後者則不變）；結果改為辨識 `result.$kind === 'FailedTransaction'` 等。
- **執行結果**：不再用 `result.effects?.status?.status`，改為從 `result.Transaction` / `result.FailedTransaction` 取 `effects.status.success` 等。

### 2.5 型別與命名

- **Transaction**：已使用 `Transaction`（非 `TransactionBlock`），可保留。
- **Commands**：若程式碼中有 `Commands`，改為 `TransactionCommands`（from `@mysten/sui/transactions`）。
- **CoinStruct**：若 v2 將 `CoinStruct` 移動路徑或重新匯出，需更新 `resolvers.ts`、`transaction.ts` 的 import 與型別。
- **BuildTransactionOptions / TransactionDataBuilder**：若有使用，需對照 v2 是否仍存在或改名（例如 resolver 的 `buildOptions.client` 等）。

### 2.6 其他

- **waitForTransactionBlock** → **waitForTransaction**（若有用到）。
- **tx.build({ client })**：v2 仍支援，但傳入的 `client` 需為 v2 client（實作 Core API）。

---

## 三、本專案需修改的檔案與順序

### 階段 1：依賴與型別基底

1. **package.json**
   - `peerDependencies["@mysten/sui"]` 改為 `">=2.0.0"`（或 `^2.0.0`）。
   - `peerDependencies["@mysten/bcs"]` 依 v2 說明調整（若 v2 仍單獨 bcs 套件則保留或改版號）。
   - `devDependencies` 的 `@mysten/sui`、`@mysten/bcs` 升到 2.x。
   - 執行 `pnpm install`，確認無衝突（含 `@pythnetwork/pyth-sui-js` 是否相容 v2）。

### 階段 2：Client 與建構

2. **src/client.ts**
   - 將 `SuiClient`、`getFullnodeUrl` 改為 v2 的 client（建議先用 `SuiJsonRpcClient` + `getJsonRpcFullnodeUrl` 以最小改動，或直接改用 `SuiGrpcClient`）。
   - 建構子參數：`suiClient` 型別改為 v2 client；預設建立方式改為上述其一，並帶入 `network`。
   - 所有 `this.suiClient.*` 改為 v2 對應呼叫（見下方清單）。

3. **src/client.ts — 方法替換清單**
   - `devInspectTransactionBlock` → `client.core.simulateTransaction`（參數名可能改為 `transaction`、`sender` 等，依 v2 API）。
   - `dryRunTransactionBlock` → `client.core.simulateTransaction`。
   - `multiGetObjects({ ids, options })` → `client.core.getObjects({ objectIds, include })`，並改寫回傳使用處（如 `vaultRewardersRes`、`getAllVaultObjects` 等）。
   - `getObject({ id, ... })` → `client.core.getObject({ objectId, ... })`，並調整回傳結構的讀取。

### 階段 3：工具與 Resolver

4. **src/utils/transaction.ts**
   - `CoinStruct`、`SuiClient` 的 import 改為 v2 路徑/型別（若 v2 改動）。
   - `client.getCoins` → `client.core.listCoins`；回傳可能改為 `{ data, nextCursor }` 等，需改寫 `getCoinsOfType` 的迴圈與分頁。

5. **src/utils/resolvers.ts**
   - `SuiClient`、`CoinStruct`、`Commands`（若有）改為 v2 型別與 import。
   - `buildOptions.client` 型別改為 v2 client；內部若呼叫 client 方法，改為 `client.core.*`。

6. **src/types/index.ts**
   - `Argument` 等 from `@mysten/sui/transactions` 確認 v2 是否仍存在或改名，必要時更新。

### 階段 4：測試與文件

7. **test/e2e/client.test.ts**
   - 建立 client 改為 v2（`SuiJsonRpcClient` / `SuiGrpcClient`）。
   - `dryRunTransactionBlock` → `client.core.simulateTransaction`。
   - 所有 client 方法改為 v2 對應 API 與回傳格式。

8. **README.md**
   - 安裝說明與範例中的 `@mysten/sui` 改為 >= 2.0.0。
   - 範例程式碼中的 `SuiClient`、`getFullnodeUrl` 改為 v2 寫法（如 `SuiJsonRpcClient` + `getJsonRpcFullnodeUrl` 或 `SuiGrpcClient`）。

### 階段 5：Generated 與 Lint

9. **src/_generated/**  
   - 多數為 `bcs`、`Transaction`、utils，通常不需改；若編譯或型別報錯，再針對單一檔案對照 v2 的 `@mysten/sui/bcs`、`@mysten/sui/transactions` 做小範圍修正。

10. **整體**
    - 執行 `pnpm build`、`pnpm test`、lint，修正所有錯誤。
    - 若有 CHANGELOG，新增一筆「升級 @mysten/sui 至 v2」並簡述 breaking changes 與遷移建議。

---

## 四、參考連結

- [sui-dev-skills / sui-ts-sdk](https://github.com/MystenLabs/sui-dev-skills/tree/main/sui-ts-sdk) — PTB、client、v2 慣例。
- [官方 v2 遷移指南（LLM 用）](https://sdk.mystenlabs.com/sui/migrations/sui-2.0/llms.txt) — 完整方法對照與範例。
- [Sui TypeScript SDK 文件](https://sdk.mystenlabs.com/sui) — 查詢最新 API 簽名與回傳型別。

---

## 五、建議執行順序

1. 建立分支（已完成：`upgrade/mysten-sui-v2`）。
2. 更新 `package.json` 並 `pnpm install`。
3. 先改 `src/client.ts`（import、建構子、所有 client 呼叫），使型別通過。
4. 改 `src/utils/transaction.ts`、`src/utils/resolvers.ts`。
5. 改 `src/types/index.ts`（若有影響）。
6. 執行 build，再依錯誤逐檔修正 `_generated` 或其它。
7. 改 `test/e2e/client.test.ts` 與 README。
8. 全量測試與 lint，更新 CHANGELOG，完成 PR。

若你希望，下一步可以直接從「階段 1：package.json + 階段 2：client.ts」開始具體 diff 級別的修改建議或貼上片段我幫你改。
