/**
 * FHEVM Provider - React Context Provider for FHEVM Client
 * Manages FHEVM client initialization and provides context to child components
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FhevmClient, createFhevmClient, FhevmClientConfig } from '../core/FhevmClient';

export interface FhevmContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

export interface FhevmProviderProps {
  config: FhevmClientConfig;
  children: ReactNode;
}

/**
 * FhevmProvider - Provides FHEVM client to React component tree
 *
 * @example
 * ```tsx
 * <FhevmProvider config={{ network: { chainId: 11155111, ... } }}>
 *   <App />
 * </FhevmProvider>
 * ```
 */
export function FhevmProvider({ config, children }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeClient() {
      try {
        setIsInitializing(true);
        setError(null);

        const newClient = await createFhevmClient(config);

        if (mounted) {
          setClient(newClient);
          setIsInitialized(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize FHEVM client'));
          setIsInitialized(false);
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    }

    initializeClient();

    return () => {
      mounted = false;
    };
  }, [config]);

  const value: FhevmContextValue = {
    client,
    isInitialized,
    isInitializing,
    error,
  };

  return (
    <FhevmContext.Provider value={value}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * useFhevmContext - Internal hook to access FHEVM context
 * Use `useFhevm()` hook instead for public API
 */
export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);

  if (context === undefined) {
    throw new Error('useFhevmContext must be used within a FhevmProvider');
  }

  return context;
}
