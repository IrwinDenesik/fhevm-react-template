/**
 * Validation Utilities
 * Input validation helpers
 */

import { EncryptionType } from '../fhe/types';

/**
 * Validate encryption type
 */
export function isValidEncryptionType(type: string): type is EncryptionType {
  const validTypes: EncryptionType[] = ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'];
  return validTypes.includes(type as EncryptionType);
}

/**
 * Validate value for encryption type
 */
export function validateValueForType(value: any, type: EncryptionType): boolean {
  switch (type) {
    case 'uint8':
    case 'uint16':
    case 'uint32':
      const num = Number(value);
      return !isNaN(num) && Number.isInteger(num) && num >= 0;
    case 'uint64':
      try {
        BigInt(value);
        return true;
      } catch {
        return false;
      }
    case 'bool':
      return typeof value === 'boolean' || value === 'true' || value === 'false';
    case 'address':
      return /^0x[a-fA-F0-9]{40}$/.test(value);
    default:
      return false;
  }
}

/**
 * Validate contract address
 */
export function isValidContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate handle format
 */
export function isValidHandle(handle: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(handle);
}

/**
 * Validate operation type
 */
export function isValidOperation(operation: string): boolean {
  const validOps = ['add', 'sub', 'mul', 'div', 'eq', 'ne', 'lt', 'lte', 'gt', 'gte'];
  return validOps.includes(operation);
}

/**
 * Parse and validate encryption request
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEncryptionRequest(
  value: any,
  type: string,
  contractAddress: string
): ValidationResult {
  const errors: string[] = [];

  if (!isValidEncryptionType(type)) {
    errors.push(`Invalid encryption type: ${type}`);
  }

  if (!isValidContractAddress(contractAddress)) {
    errors.push('Invalid contract address format');
  }

  if (isValidEncryptionType(type) && !validateValueForType(value, type)) {
    errors.push(`Invalid value for type ${type}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
