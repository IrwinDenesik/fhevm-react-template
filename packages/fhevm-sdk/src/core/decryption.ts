/**
 * Decryption utilities for FHEVM
 */

import type {
  UserDecryptionParams,
  PublicDecryptionParams,
  BatchDecryptionParams,
  DecryptionResult,
  EIP712TypedData,
} from './types';
import { EIP712_DOMAIN, EIP712_TYPES } from './constants';

/**
 * User decryption using EIP-712 signature
 * Requires user to sign the decryption request
 *
 * @example
 * ```typescript
 * const result = await userDecrypt({
 *   handle: '0x...',
 *   contractAddress: '0x...',
 *   signer: ethers.signer,
 *   userAddress: '0x...',
 * });
 * ```
 */
export async function userDecrypt<T = number>(
  params: UserDecryptionParams
): Promise<DecryptionResult<T>> {
  const { handle, contractAddress, signer, userAddress } = params;

  try {
    // Create EIP-712 typed data
    const chainId = await signer.provider?.getNetwork().then((n) => Number(n.chainId));

    if (!chainId) {
      throw new Error('Unable to get chain ID from signer');
    }

    const typedData: EIP712TypedData = {
      domain: {
        ...EIP712_DOMAIN,
        chainId,
        verifyingContract: contractAddress,
      },
      types: EIP712_TYPES,
      message: {
        handle,
        contractAddress,
        userAddress,
      },
    };

    // Request user signature
    const signature = await signer.signTypedData(
      typedData.domain,
      typedData.types,
      typedData.message
    );

    // In a real implementation, send to gateway for decryption
    // For now, we'll simulate the decryption
    const decryptedValue = await simulateDecryption(handle, signature);

    return {
      value: decryptedValue as T,
      success: true,
    };
  } catch (error) {
    return {
      value: null as T,
      success: false,
      error: `Decryption failed: ${error}`,
    };
  }
}

/**
 * Public decryption (no signature required)
 * For publicly readable encrypted data
 *
 * @example
 * ```typescript
 * const result = await publicDecrypt({
 *   handle: '0x...',
 *   contractAddress: '0x...',
 *   provider: ethers.provider,
 * });
 * ```
 */
export async function publicDecrypt<T = number>(
  params: PublicDecryptionParams
): Promise<DecryptionResult<T>> {
  const { handle, contractAddress, provider } = params;

  try {
    // In a real implementation, call the contract's public decrypt method
    // For now, we'll simulate the decryption
    const decryptedValue = await simulatePublicDecryption(handle, contractAddress, provider);

    return {
      value: decryptedValue as T,
      success: true,
    };
  } catch (error) {
    return {
      value: null as T,
      success: false,
      error: `Public decryption failed: ${error}`,
    };
  }
}

/**
 * Batch decrypt multiple handles
 * More efficient than decrypting individually
 *
 * @example
 * ```typescript
 * const results = await batchDecrypt({
 *   handles: ['0x...', '0x...', '0x...'],
 *   contractAddress: '0x...',
 *   signer: ethers.signer,
 *   userAddress: '0x...',
 * });
 * ```
 */
export async function batchDecrypt<T = number>(
  params: BatchDecryptionParams
): Promise<DecryptionResult<T[]>> {
  const { handles, contractAddress, signer, userAddress } = params;

  try {
    // Decrypt all handles
    const decryptPromises = handles.map((handle) =>
      userDecrypt<T>({ handle, contractAddress, signer, userAddress })
    );

    const results = await Promise.all(decryptPromises);

    // Check if all succeeded
    const allSucceeded = results.every((r) => r.success);
    const values = results.map((r) => r.value);
    const errors = results.filter((r) => !r.success).map((r) => r.error);

    return {
      value: values,
      success: allSucceeded,
      error: errors.length > 0 ? errors.join('; ') : undefined,
    };
  } catch (error) {
    return {
      value: [] as T[],
      success: false,
      error: `Batch decryption failed: ${error}`,
    };
  }
}

/**
 * Simulate decryption (for development)
 * In production, this would interact with the FHE gateway
 */
async function simulateDecryption(handle: string, signature: string): Promise<number> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In real implementation:
  // 1. Send handle + signature to FHE gateway
  // 2. Gateway verifies signature
  // 3. Gateway decrypts using private key
  // 4. Return decrypted value

  // For now, return a mock value based on handle
  const mockValue = parseInt(handle.slice(-4), 16) % 1000;
  return mockValue;
}

/**
 * Simulate public decryption (for development)
 */
async function simulatePublicDecryption(
  handle: string,
  contractAddress: string,
  provider: any
): Promise<number> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In real implementation:
  // 1. Call contract's public decrypt method
  // 2. Contract verifies access permissions
  // 3. Return decrypted value

  // For now, return a mock value
  const mockValue = parseInt(handle.slice(-4), 16) % 1000;
  return mockValue;
}

/**
 * Helper to check if a value is encrypted
 */
export function isEncrypted(value: string): boolean {
  // Check if value looks like an encrypted handle
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

/**
 * Helper to parse decryption result
 */
export function parseDecryptionResult<T>(result: DecryptionResult<T>): T {
  if (!result.success) {
    throw new Error(result.error || 'Decryption failed');
  }
  return result.value;
}
