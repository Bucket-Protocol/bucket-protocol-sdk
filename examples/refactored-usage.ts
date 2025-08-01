/**
 * 重構後 Bucket Protocol SDK 使用示例
 */

import { Transaction } from '@mysten/sui/transactions';
import { BucketClient, PriceService, UserService } from '../sdk/src';

async function main() {
  // 1. 基本使用（向後兼容）
  console.log('=== 基本使用 ===');
  const buck = new BucketClient('mainnet');
  
  // 原有的 API 仍然可用
  const prices = await buck.getPrices();
  console.log('Token prices:', Object.keys(prices).length);
  
  const protocol = await buck.getProtocol();
  console.log('Protocol info:', protocol?.id);

  // 2. 新的服務導向使用方式
  console.log('\n=== 服務導向使用 ===');
  
  // 直接訪問特定服務
  const priceData = await buck.prices.getPrices();
  console.log('Price service result:', Object.keys(priceData).length);
  
  const protocolData = await buck.protocol.getProtocol();
  console.log('Protocol service result:', protocolData?.id);
  
  // 用戶相關查詢
  const userAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const userBottles = await buck.user.getUserBottles(userAddress);
  console.log('User bottles:', userBottles.length);
  
  const userTanks = await buck.user.getUserTanks(userAddress);
  console.log('User tanks:', userTanks.length);

  // 3. 並行查詢示例
  console.log('\n=== 並行查詢 ===');
  const [allPrices, allTanks, allFountains] = await Promise.all([
    buck.prices.getPrices(),
    buck.protocol.getAllTanks(),
    buck.protocol.getAllFountains(),
  ]);
  
  console.log('Parallel results:', {
    prices: Object.keys(allPrices).length,
    tanks: allTanks.length,
    fountains: Object.keys(allFountains).length,
  });

  // 4. 交易構建示例
  console.log('\n=== 交易構建 ===');
  const tx = new Transaction();
  
  // 構建借貸交易
  await buck.transactions.buildBorrowTx(
    tx,
    '0x2::sui::SUI',      // collateral type
    '1000000000',         // collateral amount (1 SUI)
    '500000000',          // borrow amount (0.5 BUCK)
    userAddress,          // recipient
  );
  
  console.log('Borrow transaction built successfully');

  // 5. 獨立服務使用示例
  console.log('\n=== 獨立服務使用 ===');
  const suiClient = buck.getSuiClient();
  
  // 創建獨立的價格服務
  const independentPriceService = new PriceService(suiClient, 'mainnet', userAddress);
  const independentPrices = await independentPriceService.getPrices();
  console.log('Independent price service:', Object.keys(independentPrices).length);
  
  // 創建獨立的用戶服務
  const independentUserService = new UserService(suiClient, 'mainnet', userAddress);
  const independentUserBottles = await independentUserService.getUserBottles(userAddress);
  console.log('Independent user service:', independentUserBottles.length);

  // 6. 高級用法：自定義服務組合
  console.log('\n=== 自定義服務組合 ===');
  
  class CustomAnalyticsService {
    constructor(
      private priceService: PriceService,
      private userService: UserService,
    ) {}
    
    async getUserPortfolioValue(address: string): Promise<number> {
      const [prices, bottles] = await Promise.all([
        this.priceService.getPrices(),
        this.userService.getUserBottles(address),
      ]);
      
      // 計算用戶投資組合價值的邏輯
      let totalValue = 0;
      for (const bottle of bottles) {
        // 這裡應該有實際的計算邏輯
        totalValue += 100; // 示例值
      }
      
      return totalValue;
    }
  }
  
  const analytics = new CustomAnalyticsService(buck.prices, buck.user);
  const portfolioValue = await analytics.getUserPortfolioValue(userAddress);
  console.log('Portfolio value:', portfolioValue);

  // 7. 錯誤處理示例
  console.log('\n=== 錯誤處理 ===');
  try {
    const invalidUserBottles = await buck.user.getUserBottles('invalid-address');
    console.log('Invalid user bottles:', invalidUserBottles.length);
  } catch (error) {
    console.log('Error handled gracefully:', error instanceof Error ? error.message : 'Unknown error');
  }

  // 8. 動態所有者更新
  console.log('\n=== 動態所有者更新 ===');
  const newOwner = '0xabcdef1234567890abcdef1234567890abcdef12';
  buck.setOwner(newOwner);
  console.log('Owner updated to:', buck.owner);
  
  // 現在所有服務都會使用新的所有者地址
  const newOwnerBottles = await buck.user.getUserBottles(); // 使用新的所有者地址
  console.log('New owner bottles:', newOwnerBottles.length);
}

// 執行示例
if (require.main === module) {
  main().catch(console.error);
}

export { main };