/**
 * Helper utilities for FHEVM SDK
 */

import type { EncryptionType } from '../core/types';
import { ENCRYPTION_TYPES } from '../core/constants';

/**
 * Format encrypted data for display
 */
export function formatEncryptedData(data: string, length: number = 10): string {
  if (!data || data.length <= length * 2) {
    return data;
  }
  return `${data.slice(0, length)}...${data.slice(-length)}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate handle format
 */
export function isValidHandle(handle: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(handle);
}

/**
 * Get encryption type info
 */
export function getEncryptionTypeInfo(type: EncryptionType) {
  return ENCRYPTION_TYPES[type];
}

/**
 * Convert value to appropriate type
 */
export function convertValue(value: unknown, type: EncryptionType): number | boolean | string {
  switch (type) {
    case 'bool':
      return Boolean(value);
    case 'address':
      return String(value);
    case 'uint8':
    case 'uint16':
    case 'uint32':
      return Number(value);
    case 'uint64':
    case 'uint128':
    case 'uint256':
      return BigInt(value as string | number).toString();
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delay * attempt); // Exponential backoff
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Generate random encrypted handle (for testing)
 */
export function generateMockHandle(): string {
  const randomHex = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return `0x${randomHex}`;
}

/**
 * Parse error message
 */
export function parseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

/**
 * Format gas estimate
 */
export function formatGas(gas: bigint | number): string {
  const gasNumber = typeof gas === 'bigint' ? Number(gas) : gas;
  if (gasNumber >= 1_000_000) {
    return `${(gasNumber / 1_000_000).toFixed(2)}M`;
  }
  if (gasNumber >= 1_000) {
    return `${(gasNumber / 1_000).toFixed(2)}K`;
  }
  return gasNumber.toString();
}

/**
 * Truncate text for display
 */
export function truncate(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) {
    return text;
  }
  const half = Math.floor((maxLength - 3) / 2);
  return `${text.slice(0, half)}...${text.slice(-half)}`;
}
