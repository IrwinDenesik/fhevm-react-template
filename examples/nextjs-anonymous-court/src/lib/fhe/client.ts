/**
 * Client-side FHE operations
 * Utilities for encryption and decryption in browser environment
 */

import { createFhevmClient, encryptUint32, encryptUint16, encryptBool } from '@fhevm/sdk';

/**
 * Initialize FHEVM client for browser
 */
export async function initFhevmClient() {
  return await createFhevmClient({
    network: {
      chainId: 11155111,
      name: 'Sepolia',
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
    },
  });
}

/**
 * Encrypt a value for smart contract input
 */
export async function encryptValue(
  client: any,
  value: number | boolean | string,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address',
  contractAddress: string
) {
  switch (type) {
    case 'uint16':
      return await encryptUint16(client, { value: value as number, contractAddress });
    case 'uint32':
      return await encryptUint32(client, { value: value as number, contractAddress });
    case 'bool':
      return await encryptBool(client, { value: value as boolean, contractAddress });
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}
