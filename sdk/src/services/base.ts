import { SuiClient } from '@mysten/sui/client';

/**
 * Base service class that provides common functionality for all services
 */
export abstract class BaseService {
  protected client: SuiClient;
  protected network: string;
  protected owner: string;

  constructor(client: SuiClient, network: string, owner: string) {
    this.client = client;
    this.network = network;
    this.owner = owner;
  }

  protected getSuiClient(): SuiClient {
    return this.client;
  }

  protected getNetwork(): string {
    return this.network;
  }

  protected getOwner(): string {
    return this.owner;
  }
}