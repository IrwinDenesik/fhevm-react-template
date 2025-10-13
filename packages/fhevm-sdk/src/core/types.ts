/**
 * Core type definitions for FHEVM SDK
 */

import type { BrowserProvider, Signer } from 'ethers';

/**
 * Supported encryption types
 */
export type EncryptionType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'bool'
  | 'address';

/**
 * Encrypted input structure
 */
export interface EncryptedInput {
  /** Encrypted data as hex string */
  data: string;
  /** Type of encrypted data */
  type: EncryptionType;
  /** Signature for verification */
  signature?: string;
}

/**
 * Decryption result
 */
export interface DecryptionResult<T = unknown> {
  /** Decrypted value */
  value: T;
  /** Whether decryption was successful */
  success: boolean;
  /** Error message if decryption failed */
  error?: string;
}

/**
 * FHEVM instance configuration
 */
export interface FhevmInstance {
  /** Network chain ID */
  chainId: number;
  /** Contract address for FHE operations */
  contractAddress: string;
  /** Public key for encryption */
  publicKey: string;
  /** Instance initialized */
  initialized: boolean;
}

/**
 * Encryption parameters
 */
export interface EncryptionParams {
  /** Value to encrypt */
  value: number | boolean | string;
  /** Contract address */
  contractAddress: string;
  /** User's signer */
  signer?: Signer;
}

/**
 * Decryption parameters for user decryption (EIP-712 signed)
 */
export interface UserDecryptionParams {
  /** Encrypted handle */
  handle: string;
  /** Contract address */
  contractAddress: string;
  /** User's signer for EIP-712 signature */
  signer: Signer;
  /** User's address */
  userAddress: string;
}

/**
 * Decryption parameters for public decryption
 */
export interface PublicDecryptionParams {
  /** Encrypted handle */
  handle: string;
  /** Contract address */
  contractAddress: string;
  /** Provider */
  provider: BrowserProvider;
}

/**
 * Batch decryption parameters
 */
export interface BatchDecryptionParams {
  /** Array of encrypted handles */
  handles: string[];
  /** Contract address */
  contractAddress: string;
  /** User's signer */
  signer: Signer;
  /** User's address */
  userAddress: string;
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  /** Network chain ID */
  chainId: number;
  /** Network name */
  name: string;
  /** RPC URL */
  rpcUrl: string;
  /** FHE gateway URL */
  gatewayUrl?: string;
  /** ACL contract address */
  aclAddress?: string;
}

/**
 * FHEVM client configuration
 */
export interface FhevmClientConfig {
  /** Network configuration */
  network: NetworkConfig;
  /** Ethers provider */
  provider?: BrowserProvider;
  /** Public key for encryption (optional, will be fetched if not provided) */
  publicKey?: string;
}

/**
 * Contract ABI type for encryption
 */
export interface FhevmContractABI {
  /** Contract methods */
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

/**
 * EIP-712 Domain for decryption signatures
 */
export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

/**
 * EIP-712 Typed data for decryption
 */
export interface EIP712TypedData {
  domain: EIP712Domain;
  types: {
    [key: string]: Array<{ name: string; type: string }>;
  };
  message: {
    [key: string]: unknown;
  };
}
