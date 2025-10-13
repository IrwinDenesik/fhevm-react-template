/**
 * Validation utilities for FHEVM SDK
 */

import type { EncryptionType } from '../core/types';
import { ENCRYPTION_TYPES } from '../core/constants';
import { isValidAddress, isValidHandle } from './helpers';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate encryption parameters
 */
export function validateEncryptionParams(
  value: unknown,
  type: EncryptionType,
  contractAddress: string
): ValidationResult {
  // Validate contract address
  if (!isValidAddress(contractAddress)) {
    return {
      valid: false,
      error: `Invalid contract address: ${contractAddress}`,
    };
  }

  // Validate value based on type
  const typeInfo = ENCRYPTION_TYPES[type];
  if (!typeInfo) {
    return {
      valid: false,
      error: `Unknown encryption type: ${type}`,
    };
  }

  try {
    switch (type) {
      case 'bool':
        if (typeof value !== 'boolean' && value !== 0 && value !== 1) {
          return {
            valid: false,
            error: 'Value must be boolean or 0/1',
          };
        }
        break;

      case 'address':
        if (!isValidAddress(String(value))) {
          return {
            valid: false,
            error: `Invalid Ethereum address: ${value}`,
          };
        }
        break;

      case 'uint8':
      case 'uint16':
      case 'uint32': {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0 || numValue > typeInfo.max) {
          return {
            valid: false,
            error: `Value must be between 0 and ${typeInfo.max}`,
          };
        }
        break;
      }

      case 'uint64':
      case 'uint128':
      case 'uint256': {
        try {
          const bigIntValue = BigInt(value as string | number);
          if (bigIntValue < BigInt(0) || bigIntValue > BigInt(typeInfo.max)) {
            return {
              valid: false,
              error: `Value must be between 0 and ${typeInfo.max}`,
            };
          }
        } catch {
          return {
            valid: false,
            error: 'Value must be a valid integer or BigInt',
          };
        }
        break;
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Validation failed: ${error}`,
    };
  }
}

/**
 * Validate decryption parameters
 */
export function validateDecryptionParams(
  handle: string,
  contractAddress: string
): ValidationResult {
  if (!isValidHandle(handle)) {
    return {
      valid: false,
      error: `Invalid handle format: ${handle}`,
    };
  }

  if (!isValidAddress(contractAddress)) {
    return {
      valid: false,
      error: `Invalid contract address: ${contractAddress}`,
    };
  }

  return { valid: true };
}

/**
 * Validate user address
 */
export function validateUserAddress(address: string): ValidationResult {
  if (!isValidAddress(address)) {
    return {
      valid: false,
      error: `Invalid user address: ${address}`,
    };
  }

  return { valid: true };
}

/**
 * Validate batch decryption params
 */
export function validateBatchParams(
  handles: string[],
  contractAddress: string
): ValidationResult {
  if (!Array.isArray(handles) || handles.length === 0) {
    return {
      valid: false,
      error: 'Handles must be a non-empty array',
    };
  }

  for (const handle of handles) {
    const result = validateDecryptionParams(handle, contractAddress);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}

/**
 * Throw if validation fails
 */
export function assertValid(result: ValidationResult): void {
  if (!result.valid) {
    throw new Error(result.error || 'Validation failed');
  }
}
