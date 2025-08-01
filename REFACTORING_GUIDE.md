# Bucket Protocol SDK 重構指南

## 概述

這次重構將原本龐大的 `BucketClient` 類（3000+ 行）拆分為多個專門的服務類，提高了代碼的可維護性、可測試性和模組化程度。

## 架構改進

### 舊架構問題
- 單一巨大的 `BucketClient` 類包含所有功能
- 違反單一責任原則
- 難以測試和維護
- 缺乏清晰的功能邊界

### 新架構優勢
- **服務導向架構**：按功能域分離服務
- **單一責任原則**：每個服務專注於特定功能
- **依賴注入**：清晰的依賴關係
- **可測試性**：每個服務可獨立測試
- **可擴展性**：易於添加新功能

## 服務架構

### 1. BaseService
所有服務的基礎類，提供共同功能：
- SuiClient 實例管理
- 網絡配置
- 用戶地址管理

### 2. PriceService
處理價格相關操作：
- 獲取所有代幣價格
- 更新 Oracle 價格
- Supra Oracle 集成

### 3. ProtocolService
處理協議相關查詢：
- 獲取協議信息
- 管理 Tanks、PSMs、Fountains
- 協議常數查詢

### 4. UserService
處理用戶狀態查詢：
- 用戶 Bottles 管理
- 用戶 Tanks 查詢
- LP 證明管理
- DeBut 位置查詢

### 5. TransactionService
處理交易構建：
- 借貸交易
- 還款交易
- PSM 交換
- Flash Loan 操作

## 使用方式

### 基本使用（向後兼容）

```typescript
import { BucketClient } from 'bucket-protocol-sdk';

// 原有的使用方式仍然有效
const buck = new BucketClient();
await buck.getPrices();
await buck.getUserBottles('0x...');
```

### 新的服務導向使用方式

```typescript
import { BucketClient } from 'bucket-protocol-sdk';

const buck = new BucketClient();

// 直接訪問特定服務
const prices = await buck.prices.getPrices();
const protocol = await buck.protocol.getProtocol();
const userBottles = await buck.user.getUserBottles('0x...');

// 構建交易
const tx = new Transaction();
await buck.transactions.buildBorrowTx(
  tx,
  '0x2::sui::SUI',
  '1000000000',
  '500000000',
  '0x...'
);
```

### 獨立服務使用

```typescript
import { SuiClient } from '@mysten/sui/client';
import { PriceService, UserService } from 'bucket-protocol-sdk';

const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });
const priceService = new PriceService(client, 'mainnet', '0x...');
const userService = new UserService(client, 'mainnet', '0x...');

// 獨立使用服務
const prices = await priceService.getPrices();
const bottles = await userService.getUserBottles('0x...');
```

## 遷移步驟

### 1. 無需更改（推薦）
如果您目前的代碼運行正常，無需立即更改。重構後的 `BucketClient` 保持了完全的向後兼容性。

### 2. 逐步遷移（可選）
您可以逐步將代碼遷移到新的服務導向架構：

```typescript
// 舊方式
const buck = new BucketClient();
const prices = await buck.getPrices();

// 新方式
const buck = new BucketClient();
const prices = await buck.prices.getPrices();
```

### 3. 高級用法
對於需要更細粒度控制的場景，可以直接使用服務類：

```typescript
import { PriceService } from 'bucket-protocol-sdk';

class MyCustomService {
  private priceService: PriceService;
  
  constructor(client: SuiClient) {
    this.priceService = new PriceService(client, 'mainnet', '0x...');
  }
  
  async getCustomPriceData() {
    const prices = await this.priceService.getPrices();
    // 自定義處理邏輯
    return processedPrices;
  }
}
```

## 測試改進

新架構使測試變得更加容易：

```typescript
import { PriceService } from 'bucket-protocol-sdk';

describe('PriceService', () => {
  let priceService: PriceService;
  let mockClient: jest.Mocked<SuiClient>;

  beforeEach(() => {
    mockClient = createMockSuiClient();
    priceService = new PriceService(mockClient, 'testnet', 'test-address');
  });

  it('should fetch prices correctly', async () => {
    // 測試特定服務功能
    const prices = await priceService.getPrices();
    expect(prices).toBeDefined();
  });
});
```

## 性能優化

### 1. 服務重用
服務實例可以被重用，避免重複初始化：

```typescript
const buck = new BucketClient();

// 重用服務實例
const priceService = buck.prices;
const prices1 = await priceService.getPrices();
const prices2 = await priceService.getPrices(); // 重用同一實例
```

### 2. 並行查詢
不同服務可以並行執行：

```typescript
const buck = new BucketClient();

const [prices, protocol, userBottles] = await Promise.all([
  buck.prices.getPrices(),
  buck.protocol.getProtocol(),
  buck.user.getUserBottles('0x...')
]);
```

## 擴展性

新架構使添加新功能變得更容易：

```typescript
// 添加新服務
export class AnalyticsService extends BaseService {
  async getPortfolioAnalytics(address: string) {
    // 分析邏輯
  }
}

// 擴展 BucketClient
export class ExtendedBucketClient extends BucketClient {
  private analyticsService: AnalyticsService;
  
  constructor(network: string, owner: string) {
    super(network, owner);
    this.analyticsService = new AnalyticsService(this.getSuiClient(), network, owner);
  }
  
  get analytics(): AnalyticsService {
    return this.analyticsService;
  }
}
```

## 總結

這次重構帶來了以下好處：

1. **更好的代碼組織**：功能按域分離
2. **提高可維護性**：每個服務職責單一
3. **增強可測試性**：服務可獨立測試
4. **保持向後兼容**：現有代碼無需更改
5. **提供靈活性**：支持多種使用方式
6. **便於擴展**：易於添加新功能

重構後的 SDK 既保持了易用性，又提供了更好的架構基礎，為未來的發展奠定了堅實的基礎。