/**
 * Server-side FHE operations
 * Utilities for FHE operations in Next.js API routes
 */

import { createFhevmClient } from '@fhevm/sdk';

/**
 * Initialize FHEVM client for server-side operations
 */
export async function initServerFhevmClient() {
  return await createFhevmClient({
    network: {
      chainId: 11155111,
      name: 'Sepolia',
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
    },
  });
}

/**
 * Validate contract address format
 */
export function isValidContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate encryption type
 */
export function isValidEncryptionType(type: string): boolean {
  const validTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'];
  return validTypes.includes(type);
}
