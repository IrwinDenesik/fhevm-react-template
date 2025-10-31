/**
 * useFhevm Hook - Main hook for accessing FHEVM client
 * Provides access to the FHEVM client instance and initialization state
 */

import { useFhevmContext, FhevmContextValue } from './Provider';

/**
 * useFhevm - Access FHEVM client and state
 *
 * @returns {FhevmContextValue} FHEVM client, initialization state, and error
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, isInitialized, error } = useFhevm();
 *
 *   if (!isInitialized) {
 *     return <div>Initializing FHEVM...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>Error: {error.message}</div>;
 *   }
 *
 *   // Use client for encryption/decryption
 *   const instance = client.getInstance();
 * }
 * ```
 */
export function useFhevm(): FhevmContextValue {
  return useFhevmContext();
}
