/**
 * FHE Type Definitions
 * TypeScript types for FHE operations
 */

export type EncryptionType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export interface EncryptionRequest {
  value: number | boolean | string | bigint;
  type: EncryptionType;
  contractAddress: string;
}

export interface EncryptionResponse {
  success: boolean;
  encrypted?: number[];
  type?: EncryptionType;
  length?: number;
  error?: string;
  details?: string;
}

export interface DecryptionRequest {
  handle: string;
  contractAddress: string;
  isPublic?: boolean;
}

export interface DecryptionResponse {
  success: boolean;
  value?: any;
  type?: string;
  error?: string;
  details?: string;
}

export interface ComputationRequest {
  operation: 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
  operands: string[];
}

export interface KeyInfo {
  network: string;
  chainId: number;
  fhePublicKey: string;
  keyGenerationTime: string;
  keyType: string;
  securityLevel: number;
  supportedTypes: EncryptionType[];
}
