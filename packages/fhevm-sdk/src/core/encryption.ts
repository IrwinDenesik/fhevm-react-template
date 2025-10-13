/**
 * Encryption utilities for FHEVM
 */

import type { FhevmClient } from './FhevmClient';
import type { EncryptionParams, EncryptedInput } from './types';
import { ENCRYPTION_TYPES } from './constants';

/**
 * Base encryption function
 */
async function encryptValue(
  client: FhevmClient,
  params: EncryptionParams,
  type: keyof typeof ENCRYPTION_TYPES
): Promise<EncryptedInput> {
  if (!client.isInitialized()) {
    throw new Error('FHEVM client not initialized');
  }

  const instance = client.getInstance();
  const { value, contractAddress } = params;

  try {
    // Create input for encryption
    const input = instance.createEncryptedInput(contractAddress, params.signer?.address || '');

    // Add value based on type
    switch (type) {
      case 'uint8':
        input.add8(Number(value));
        break;
      case 'uint16':
        input.add16(Number(value));
        break;
      case 'uint32':
        input.add32(Number(value));
        break;
      case 'uint64':
        input.add64(BigInt(value));
        break;
      case 'uint128':
        input.add128(BigInt(value));
        break;
      case 'uint256':
        input.add256(BigInt(value));
        break;
      case 'bool':
        input.addBool(Boolean(value));
        break;
      case 'address':
        input.addAddress(String(value));
        break;
      default:
        throw new Error(`Unsupported encryption type: ${type}`);
    }

    // Encrypt the input
    const encrypted = input.encrypt();

    return {
      data: encrypted.data,
      type,
      signature: encrypted.signature,
    };
  } catch (error) {
    throw new Error(`Encryption failed for ${type}: ${error}`);
  }
}

/**
 * Encrypt a uint8 value
 *
 * @example
 * ```typescript
 * const encrypted = await encryptUint8(client, {
 *   value: 42,
 *   contractAddress: '0x...',
 * });
 * ```
 */
export async function encryptUint8(
  client: FhevmClient,
  params: EncryptionParams
): Promise<EncryptedInput> {
  const value = Number(params.value);
  if (value < 0 || value > ENCRYPTION_TYPES.uint8.max) {
    throw new Error(`Value ${value} out of range for uint8 (0-${ENCRYPTION_TYPES.uint8.max})`);
  }
  return encryptValue(client, params, 'uint8');
}

/**
 * Encrypt a uint16 value
 */
export async function encryptUint16(
  client: FhevmClient,
  params: EncryptionParams
): Promise<EncryptedInput> {
  const value = Number(params.value);
  if (value < 0 || value > ENCRYPTION_TYPES.uint16.max) {
    throw new Error(`Value ${value} out of range for uint16 (0-${ENCRYPTION_TYPES.uint16.max})`);
  }
  return encryptValue(client, params, 'uint16');
}

/**
 * Encrypt a uint32 value
 */
export async function encryptUint32(
  client: FhevmClient,
  params: EncryptionParams
): Promise<EncryptedInput> {
  const value = Number(params.value);
  if (value < 0 || value > ENCRYPTION_TYPES.uint32.max) {
    throw new Error(`Value ${value} out of range for uint32 (0-${ENCRYPTION_TYPES.uint32.max})`);
  }
  return encryptValue(client, params, 'uint32');
}

/**
 * Encrypt a uint64 value
 */
export async function encryptUint64(
  client: FhevmClient,
  params: EncryptionParams
): Promise<EncryptedInput> {
  const value = BigInt(params.value);
  if (value < BigInt(0) || value > ENCRYPTION_TYPES.uint64.max) {
    throw new Error(`Value ${value} out of range for uint64`);
  }
  return encryptValue(client, params, 'uint64');
}

/**
 * Encrypt a boolean value
 *
 * @example
 * ```typescript
 * const encrypted = await encryptBool(client, {
 *   value: true,
 *   contractAddress: '0x...',
 * });
 * ```
 */
export async function encryptBool(
  client: FhevmClient,
  params: EncryptionParams
): Promise<EncryptedInput> {
  return encryptValue(client, params, 'bool');
}

/**
 * Encrypt an address value
 */
export async function encryptAddress(
  client: FhevmClient,
  params: EncryptionParams
): Promise<EncryptedInput> {
  const address = String(params.value);
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error(`Invalid Ethereum address: ${address}`);
  }
  return encryptValue(client, params, 'address');
}

/**
 * Helper to encrypt based on dynamic type
 */
export async function encrypt(
  client: FhevmClient,
  params: EncryptionParams & { type: keyof typeof ENCRYPTION_TYPES }
): Promise<EncryptedInput> {
  switch (params.type) {
    case 'uint8':
      return encryptUint8(client, params);
    case 'uint16':
      return encryptUint16(client, params);
    case 'uint32':
      return encryptUint32(client, params);
    case 'uint64':
      return encryptUint64(client, params);
    case 'bool':
      return encryptBool(client, params);
    case 'address':
      return encryptAddress(client, params);
    default:
      throw new Error(`Unsupported encryption type: ${params.type}`);
  }
}
