'use client';

/**
 * FHEProvider Component
 * This is a wrapper that re-exports the SDK's FhevmProvider
 * Provides access to FHEVM client throughout the application
 */

export { FhevmProvider as FHEProvider, useFhevmContext as useFHE } from '@fhevm/sdk/react';
