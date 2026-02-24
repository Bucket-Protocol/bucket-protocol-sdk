# 站會決策清單 — @mysten/sui v2 升級

明天站會可一次性提出、需要團隊決策的項目，方便後續執行升級與發布。

---

## 一、技術選型

### 1. Client 類型：預設用 gRPC 還是 JSON-RPC？

- **SuiGrpcClient（gRPC）**：官方建議、效能較好；部分環境或託管 RPC 可能尚未支援 gRPC。
- **SuiJsonRpcClient（JSON-RPC）**：與現有 RPC URL 相容性高，遷移改動較小。

**需決策**：SDK 預設建構的 client 要用哪一種？  
（呼叫端仍可自傳 client，所以主要是「無參數時的預設」與文件範例的建議。）

---

### 2. 是否要同時支援 v1 / v2 的 peer？

- **選項 A**：只支援 v2（`peerDependencies: "@mysten/sui": ">=2.0.0"`）  
  - 優點：程式單純、只維護一條路徑。  
  - 缺點：使用舊版 @mysten/sui 的專案必須先升級才能用新 SDK。

- **選項 B**：維持雙版本相容（例如 `"@mysten/sui": ">=1.38.0 || >=2.0.0"` 或發兩個 major）  
  - 優點：既有使用者可延後升級。  
  - 缺點：實作與測試成本高，可能需型別/條件分支。

**需決策**：我們要「只支援 v2」還是「想辦法相容 v1」？若只支援 v2，是否接受以 major 版本號（例如 2.0.0）發布並在 CHANGELOG 註明 breaking change？

---

## 二、相容性與影響範圍

### 3. 使用此 SDK 的產品 / 專案有哪些？誰需要一起改？

- 前端、後端、腳本若都依賴此 SDK，升級後他們也要改用 `@mysten/sui` v2 並調整 `getSuiClient()` 的型別與用法。
- **需決策**：請列出會受影響的 repo/產品，並確認誰負責在我們 SDK 發布 v2 後做升級、時間點是否要對齊。

---

### 4. @pythnetwork/pyth-sui-js 與 v2 的相容性

- 目前依賴 `@pythnetwork/pyth-sui-js: ^2.2.0`，其內部可能仍用舊版 Sui client。
- **需決策**：是否要先查證/測試 pyth-sui-js 在 @mysten/sui v2 下是否正常？若不相容，我們是等他們支援 v2，還是暫時用其他方式接 Oracle（若有備案）？

---

## 三、排程與優先級

### 5. 升級上線的目標時間

- 目前已有分支 `upgrade/mysten-sui-v2` 與升級計畫（`docs/UPGRADE_MYSTEN_SUI_V2.md`），實作與測試預估需要一定人天。
- **需決策**：是否有外部時程壓力（例如 Mysten 棄用 v1、合約或產品需求）？希望 v2 升級版何時合併 / 發布？

---

### 6. 是否分階段發布（例如 beta）

- **選項 A**：直接發布正式版（例如 2.0.0）。
- **選項 B**：先發 beta（例如 2.0.0-beta.1），給內部或少數整合方試用，再發正式版。

**需決策**：是否需要 beta 階段？若需要，誰來試用、驗收標準是什麼？

---

## 四、文件與溝通

### 7. CHANGELOG 與遷移說明

- 升級為 breaking change，應在 CHANGELOG 寫明「最低需 @mysten/sui >= 2.0.0」與主要變更（client 型別、API 名稱等）。
- **需決策**：遷移說明要放在 README、單獨 MIGRATION.md，還是只寫 CHANGELOG？是否需要對外公告（例如 Discord / 文件站）？

---

### 8. 範例與文件中的預設寫法

- README 與範例會改為 v2 寫法（例如 SuiJsonRpcClient / SuiGrpcClient + network）。
- **需決策**：文件是否要同時寫「建議用 gRPC」或「建議用 JSON-RPC」？有無對外文件/教學需要一併更新？

---

## 五、快速清單（站會可直接照念）

1. **Client 預設**：預設用 gRPC 還是 JSON-RPC？
2. **版本策略**：只支援 @mysten/sui v2，還是要相容 v1？若只支援 v2，是否以 major（如 2.0.0）發布？
3. **影響範圍**：哪些產品/repo 會用到此 SDK？誰負責在我們發布後做升級、時間是否對齊？
4. **Pyth**：是否先確認 @pythnetwork/pyth-sui-js 在 v2 下可用？若不行要怎麼處理？
5. **時程**：v2 升級希望何時合併/發布？有無外部 deadline？
6. **發布方式**：直接正式版還是先發 beta？若 beta，誰試用、驗收標準？
7. **文件**：遷移說明放 README、MIGRATION.md 還是 CHANGELOG？要不要對外公告？
8. **範例**：文件與範例要明確建議 gRPC 還是 JSON-RPC？

---

*可將本文件列印或開在第二螢幕，站會時逐項問，記下結論後可回填到 `UPGRADE_MYSTEN_SUI_V2.md` 或專案 wiki。*
