/**
 * useEncrypt Hook - React hook for encrypting values with FHEVM
 * Provides encryption functionality with loading and error states
 */

import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';
import {
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptBool,
  encryptAddress,
} from '../core/encryption';
import { EncryptedInput, EncryptionParams } from '../core/types';

export interface UseEncryptOptions {
  onSuccess?: (result: EncryptedInput) => void;
  onError?: (error: Error) => void;
}

export interface UseEncryptReturn {
  encrypt: (params: EncryptionParams) => Promise<EncryptedInput>;
  isEncrypting: boolean;
  error: Error | null;
  result: EncryptedInput | null;
}

/**
 * useEncrypt - Hook for encrypting values
 *
 * @param {UseEncryptOptions} options - Optional callbacks for success/error
 * @returns {UseEncryptReturn} Encryption function and state
 *
 * @example
 * ```tsx
 * function EncryptionForm() {
 *   const { encrypt, isEncrypting, error } = useEncrypt({
 *     onSuccess: (result) => console.log('Encrypted:', result),
 *   });
 *
 *   const handleSubmit = async () => {
 *     const encrypted = await encrypt({
 *       value: 42,
 *       type: 'uint32',
 *       contractAddress: '0x...',
 *     });
 *     // Use encrypted.data in contract call
 *   };
 * }
 * ```
 */
export function useEncrypt(options: UseEncryptOptions = {}): UseEncryptReturn {
  const { client, isInitialized } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<EncryptedInput | null>(null);

  const encrypt = useCallback(
    async (params: EncryptionParams): Promise<EncryptedInput> => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsEncrypting(true);
        setError(null);

        let encrypted: EncryptedInput;

        // Select appropriate encryption function based on type
        switch (params.type) {
          case 'uint8':
            encrypted = await encryptUint8(client, {
              value: params.value as number,
              contractAddress: params.contractAddress,
            });
            break;
          case 'uint16':
            encrypted = await encryptUint16(client, {
              value: params.value as number,
              contractAddress: params.contractAddress,
            });
            break;
          case 'uint32':
            encrypted = await encryptUint32(client, {
              value: params.value as number,
              contractAddress: params.contractAddress,
            });
            break;
          case 'uint64':
            encrypted = await encryptUint64(client, {
              value: params.value as bigint,
              contractAddress: params.contractAddress,
            });
            break;
          case 'bool':
            encrypted = await encryptBool(client, {
              value: params.value as boolean,
              contractAddress: params.contractAddress,
            });
            break;
          case 'address':
            encrypted = await encryptAddress(client, {
              value: params.value as string,
              contractAddress: params.contractAddress,
            });
            break;
          default:
            throw new Error(`Unsupported encryption type: ${params.type}`);
        }

        setResult(encrypted);
        options.onSuccess?.(encrypted);

        return encrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized, options]
  );

  return {
    encrypt,
    isEncrypting,
    error,
    result,
  };
}
