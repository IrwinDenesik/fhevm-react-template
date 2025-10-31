/**
 * useEncryption Hook
 * Custom hook for encryption operations with additional utilities
 */

import { useEncrypt } from '@fhevm/sdk/react';
import { useState } from 'react';

export function useEncryption() {
  const { encrypt, isEncrypting, error, result } = useEncrypt();
  const [history, setHistory] = useState<any[]>([]);

  const encryptWithHistory = async (params: any) => {
    const encrypted = await encrypt(params);

    setHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        params,
        result: encrypted,
        timestamp: new Date().toISOString(),
      },
    ]);

    return encrypted;
  };

  const clearHistory = () => setHistory([]);

  return {
    encrypt: encryptWithHistory,
    isEncrypting,
    error,
    result,
    history,
    clearHistory,
  };
}
