/**
 * FHEVM Client - Core client for FHE operations
 */

import { createInstance, type FhevmInstance as FhevmjsInstance } from 'fhevmjs';
import type { BrowserProvider } from 'ethers';
import type { FhevmClientConfig, FhevmInstance } from './types';
import { DEFAULT_FHEVM_CONFIG } from './constants';

/**
 * Main FHEVM client class
 * Provides encryption and decryption utilities for FHE operations
 */
export class FhevmClient {
  private config: FhevmClientConfig;
  private instance: FhevmjsInstance | null = null;
  private publicKey: string | null = null;

  constructor(config: FhevmClientConfig) {
    this.config = { ...DEFAULT_FHEVM_CONFIG, ...config };
  }

  /**
   * Initialize the FHEVM client
   * Fetches the public key and creates the FHE instance
   */
  async init(): Promise<void> {
    if (this.instance) {
      return; // Already initialized
    }

    try {
      // Fetch public key if not provided
      if (!this.publicKey && !this.config.publicKey) {
        this.publicKey = await this.fetchPublicKey();
      } else {
        this.publicKey = this.config.publicKey!;
      }

      // Create fhevmjs instance
      this.instance = await createInstance({
        chainId: this.config.network.chainId,
        publicKey: this.publicKey,
      });
    } catch (error) {
      throw new Error(`Failed to initialize FHEVM client: ${error}`);
    }
  }

  /**
   * Fetch the public key from the network
   */
  private async fetchPublicKey(): Promise<string> {
    // In a real implementation, this would fetch from the ACL contract
    // For now, we'll use a placeholder
    if (this.config.network.gatewayUrl) {
      // Fetch from gateway
      const response = await fetch(`${this.config.network.gatewayUrl}/publicKey`);
      const data = await response.json();
      return data.publicKey;
    }

    throw new Error('Public key not provided and no gateway URL configured');
  }

  /**
   * Get the FHE instance
   */
  getInstance(): FhevmjsInstance {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized. Call init() first.');
    }
    return this.instance;
  }

  /**
   * Get the public key
   */
  getPublicKey(): string {
    if (!this.publicKey) {
      throw new Error('FHEVM client not initialized. Call init() first.');
    }
    return this.publicKey;
  }

  /**
   * Get client configuration
   */
  getConfig(): FhevmClientConfig {
    return this.config;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.instance !== null;
  }
}

/**
 * Factory function to create an FHEVM client
 *
 * @example
 * ```typescript
 * const client = await createFhevmClient({
 *   network: {
 *     chainId: 11155111,
 *     name: 'Sepolia',
 *     rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
 *   },
 * });
 * ```
 */
export async function createFhevmClient(
  config: FhevmClientConfig
): Promise<FhevmClient> {
  const client = new FhevmClient(config);
  await client.init();
  return client;
}

/**
 * Singleton instance holder
 */
let globalClient: FhevmClient | null = null;

/**
 * Get or create a global FHEVM client instance
 */
export function getGlobalClient(): FhevmClient {
  if (!globalClient) {
    throw new Error('Global FHEVM client not initialized. Call initGlobalClient() first.');
  }
  return globalClient;
}

/**
 * Initialize the global FHEVM client
 */
export async function initGlobalClient(config: FhevmClientConfig): Promise<FhevmClient> {
  globalClient = await createFhevmClient(config);
  return globalClient;
}

/**
 * Reset the global client (useful for testing)
 */
export function resetGlobalClient(): void {
  globalClient = null;
}

export type { FhevmClientConfig };
