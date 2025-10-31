/**
 * Security Utilities
 * Helper functions for security and validation
 */

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>'"]/g, '');
}

/**
 * Validate numeric range for encryption types
 */
export function validateValueRange(value: number, type: string): boolean {
  switch (type) {
    case 'uint8':
      return value >= 0 && value <= 255;
    case 'uint16':
      return value >= 0 && value <= 65535;
    case 'uint32':
      return value >= 0 && value <= 4294967295;
    default:
      return false;
  }
}

/**
 * Generate random nonce
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Hash data for integrity verification
 */
export async function hashData(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return data; // Fallback for server-side
}
