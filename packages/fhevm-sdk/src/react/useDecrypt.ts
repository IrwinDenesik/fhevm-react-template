/**
 * useDecrypt Hook - React hook for decrypting FHEVM values
 * Provides decryption functionality with loading and error states
 */

import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';
import { userDecrypt, publicDecrypt, batchDecrypt } from '../core/decryption';
import { DecryptionResult, DecryptionParams } from '../core/types';

export interface UseDecryptOptions {
  onSuccess?: (result: DecryptionResult) => void;
  onError?: (error: Error) => void;
}

export interface UseDecryptReturn {
  decrypt: (params: DecryptionParams) => Promise<DecryptionResult>;
  decryptPublic: (params: Omit<DecryptionParams, 'signer' | 'userAddress'>) => Promise<DecryptionResult>;
  decryptBatch: (params: DecryptionParams & { handles: string[] }) => Promise<DecryptionResult[]>;
  isDecrypting: boolean;
  error: Error | null;
  result: DecryptionResult | null;
}

/**
 * useDecrypt - Hook for decrypting FHEVM values
 *
 * @param {UseDecryptOptions} options - Optional callbacks for success/error
 * @returns {UseDecryptReturn} Decryption functions and state
 *
 * @example
 * ```tsx
 * function DecryptionComponent() {
 *   const { decrypt, isDecrypting, result } = useDecrypt({
 *     onSuccess: (result) => console.log('Decrypted value:', result.value),
 *   });
 *
 *   const handleDecrypt = async () => {
 *     await decrypt({
 *       handle: '0x...',
 *       contractAddress: '0x...',
 *       signer: ethers.signer,
 *       userAddress: '0x...',
 *     });
 *   };
 * }
 * ```
 */
export function useDecrypt(options: UseDecryptOptions = {}): UseDecryptReturn {
  const { client, isInitialized } = useFhevm();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<DecryptionResult | null>(null);

  const decrypt = useCallback(
    async (params: DecryptionParams): Promise<DecryptionResult> => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const decrypted = await userDecrypt(params);

        setResult(decrypted);
        options.onSuccess?.(decrypted);

        return decrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized, options]
  );

  const decryptPublic = useCallback(
    async (params: Omit<DecryptionParams, 'signer' | 'userAddress'>): Promise<DecryptionResult> => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const decrypted = await publicDecrypt(params);

        setResult(decrypted);
        options.onSuccess?.(decrypted);

        return decrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Public decryption failed');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized, options]
  );

  const decryptBatchFunc = useCallback(
    async (params: DecryptionParams & { handles: string[] }): Promise<DecryptionResult[]> => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const decrypted = await batchDecrypt(params);

        return decrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Batch decryption failed');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized, options]
  );

  return {
    decrypt,
    decryptPublic,
    decryptBatch: decryptBatchFunc,
    isDecrypting,
    error,
    result,
  };
}
