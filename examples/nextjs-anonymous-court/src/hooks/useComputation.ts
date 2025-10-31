/**
 * useComputation Hook
 * Custom hook for FHE computations
 */

import { useState, useCallback } from 'react';
import { useFhevm } from '@fhevm/sdk/react';

export function useComputation() {
  const { isInitialized } = useFhevm();
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const compute = useCallback(
    async (operation: string, operands: string[]) => {
      if (!isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsComputing(true);
        setError(null);

        const response = await fetch('/api/fhe/compute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation, operands }),
        });

        const data = await response.json();
        setResult(data);

        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Computation failed');
        setError(error);
        throw error;
      } finally {
        setIsComputing(false);
      }
    },
    [isInitialized]
  );

  return {
    compute,
    isComputing,
    error,
    result,
  };
}
