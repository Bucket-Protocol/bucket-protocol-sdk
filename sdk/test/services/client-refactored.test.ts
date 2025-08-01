import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BucketClient } from '../../src/client-refactored';

// Mock the services
vi.mock('../../src/services/price');
vi.mock('../../src/services/protocol');
vi.mock('../../src/services/user');
vi.mock('../../src/services/transaction');

describe('BucketClient (Refactored)', () => {
  let bucketClient: BucketClient;

  beforeEach(() => {
    bucketClient = new BucketClient('testnet', 'test-owner');
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const client = new BucketClient();
      expect(client.network).toBe('mainnet');
      expect(client.owner).toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
    });

    it('should initialize with custom values', () => {
      const client = new BucketClient('testnet', 'custom-owner');
      expect(client.network).toBe('testnet');
      expect(client.owner).toBe('custom-owner');
    });

    it('should handle custom RPC endpoint', () => {
      const customEndpoint = 'https://custom-rpc.example.com';
      const client = new BucketClient(customEndpoint, 'test-owner');
      expect(client.network).toBe(customEndpoint);
    });
  });

  describe('getSuiClient', () => {
    it('should return SuiClient instance', () => {
      const suiClient = bucketClient.getSuiClient();
      expect(suiClient).toBeDefined();
    });
  });

  describe('setOwner', () => {
    it('should update owner and recreate services', () => {
      const newOwner = 'new-owner-address';
      bucketClient.setOwner(newOwner);
      expect(bucketClient.owner).toBe(newOwner);
    });
  });

  describe('service access', () => {
    it('should provide access to price service', () => {
      expect(bucketClient.prices).toBeDefined();
    });

    it('should provide access to protocol service', () => {
      expect(bucketClient.protocol).toBeDefined();
    });

    it('should provide access to user service', () => {
      expect(bucketClient.user).toBeDefined();
    });

    it('should provide access to transaction service', () => {
      expect(bucketClient.transactions).toBeDefined();
    });
  });

  describe('backward compatibility methods', () => {
    it('should have getPrices method', () => {
      expect(typeof bucketClient.getPrices).toBe('function');
    });

    it('should have getUserBottles method', () => {
      expect(typeof bucketClient.getUserBottles).toBe('function');
    });

    it('should have getProtocol method', () => {
      expect(typeof bucketClient.getProtocol).toBe('function');
    });
  });
});