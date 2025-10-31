/**
 * FHE Type Definitions
 * Application-specific types for FHE operations
 */

export type * from '../lib/fhe/types';

export interface FHEConfig {
  network: {
    chainId: number;
    name: string;
    rpcUrl: string;
    publicKey?: string;
  };
}

export interface EncryptedData {
  data: Uint8Array;
  type: string;
  contractAddress: string;
  timestamp: string;
}

export interface DecryptedData {
  value: any;
  type: string;
  handle: string;
  timestamp: string;
}
