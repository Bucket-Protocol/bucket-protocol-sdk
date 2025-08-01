import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

import { PriceService } from '../../src/services/price';
import { PRICE_MAP } from '../../src/constants';

// Mock SuiClient
const mockSuiClient = {
  multiGetObjects: vi.fn(),
  devInspectTransactionBlock: vi.fn(),
} as unknown as SuiClient;

describe('PriceService', () => {
  let priceService: PriceService;

  beforeEach(() => {
    priceService = new PriceService(mockSuiClient, 'testnet', 'test-address');
    vi.clearAllMocks();
  });

  describe('getPrices', () => {
    it('should return prices for all tokens', async () => {
      // Mock the response
      vi.mocked(mockSuiClient.multiGetObjects).mockResolvedValue([]);

      const prices = await priceService.getPrices();

      expect(prices).toBeDefined();
      expect(typeof prices).toBe('object');
    });

    it('should handle errors gracefully', async () => {
      // Mock error
      vi.mocked(mockSuiClient.multiGetObjects).mockRejectedValue(new Error('Network error'));

      const prices = await priceService.getPrices();

      expect(prices).toBeDefined();
    });
  });

  describe('updateSupraOracle', () => {
    it('should add oracle update calls to transaction', () => {
      const tx = new Transaction();
      const moveCallSpy = vi.spyOn(tx, 'moveCall');

      priceService.updateSupraOracle(tx, 'SUI');

      expect(moveCallSpy).toHaveBeenCalled();
    });

    it('should handle special tokens correctly', () => {
      const tx = new Transaction();
      const moveCallSpy = vi.spyOn(tx, 'moveCall');

      priceService.updateSupraOracle(tx, 'afSUI');

      expect(moveCallSpy).toHaveBeenCalledTimes(2); // Should call twice for afSUI
    });
  });
});