/**
 * Constants for FHEVM SDK
 */

import type { NetworkConfig, FhevmClientConfig } from './types';

/**
 * Supported networks for FHEVM
 */
export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3',
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
  },
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
  },
};

/**
 * Default FHEVM client configuration
 */
export const DEFAULT_FHEVM_CONFIG: Partial<FhevmClientConfig> = {
  network: SUPPORTED_NETWORKS.sepolia,
};

/**
 * Encryption types with their bit sizes
 */
export const ENCRYPTION_TYPES = {
  uint8: { bits: 8, max: 255 },
  uint16: { bits: 16, max: 65535 },
  uint32: { bits: 32, max: 4294967295 },
  uint64: { bits: 64, max: BigInt('18446744073709551615') },
  uint128: { bits: 128, max: BigInt('340282366920938463463374607431768211455') },
  uint256: { bits: 256, max: BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935') },
  bool: { bits: 1, max: 1 },
  address: { bits: 160, max: BigInt('1461501637330902918203684832716283019655932542975') },
} as const;

/**
 * EIP-712 domain separator for decryption
 */
export const EIP712_DOMAIN = {
  name: 'FHEVM',
  version: '1',
} as const;

/**
 * EIP-712 types for decryption
 */
export const EIP712_TYPES = {
  Decryption: [
    { name: 'handle', type: 'bytes32' },
    { name: 'contractAddress', type: 'address' },
    { name: 'userAddress', type: 'address' },
  ],
} as const;

/**
 * Default timeout for operations (ms)
 */
export const DEFAULT_TIMEOUT = 30000;

/**
 * Maximum retry attempts for failed operations
 */
export const MAX_RETRY_ATTEMPTS = 3;

/**
 * Delay between retry attempts (ms)
 */
export const RETRY_DELAY = 1000;
