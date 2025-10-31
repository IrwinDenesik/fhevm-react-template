/**
 * @fhevm/sdk/react - React bindings for FHEVM SDK
 *
 * Optional React-specific hooks and providers
 * Can be imported separately: import { useFhevm } from '@fhevm/sdk/react'
 */

export { FhevmProvider, useFhevmContext } from './Provider';
export type { FhevmProviderProps, FhevmContextValue } from './Provider';

export { useFhevm } from './useFhevm';

export { useEncrypt } from './useEncrypt';
export type { UseEncryptOptions, UseEncryptReturn } from './useEncrypt';

export { useDecrypt } from './useDecrypt';
export type { UseDecryptOptions, UseDecryptReturn } from './useDecrypt';
