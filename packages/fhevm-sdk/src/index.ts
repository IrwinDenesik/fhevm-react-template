/**
 * @fhevm/sdk - Universal FHEVM SDK
 * Framework-agnostic toolkit for building privacy-preserving dApps
 * with Fully Homomorphic Encryption (FHE)
 *
 * @module @fhevm/sdk
 */

export * from './core/FhevmClient';
export * from './core/encryption';
export * from './core/decryption';
export * from './core/types';
export * from './core/constants';
export * from './utils/helpers';
export * from './utils/validation';

// Core client
export { createFhevmClient, type FhevmClientConfig } from './core/FhevmClient';

// Encryption utilities
export {
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptBool,
  encryptAddress,
} from './core/encryption';

// Decryption utilities
export {
  userDecrypt,
  publicDecrypt,
  batchDecrypt,
} from './core/decryption';

// Type exports
export type {
  EncryptedInput,
  DecryptionResult,
  FhevmInstance,
  EncryptionParams,
  DecryptionParams,
} from './core/types';

// Constants
export {
  SUPPORTED_NETWORKS,
  DEFAULT_FHEVM_CONFIG,
  ENCRYPTION_TYPES,
} from './core/constants';
