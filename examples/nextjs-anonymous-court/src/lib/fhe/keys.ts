/**
 * FHE Key Management
 * Utilities for managing FHE public keys
 */

/**
 * Fetch FHE public key for a network
 */
export async function fetchPublicKey(network: string = 'sepolia'): Promise<string> {
  try {
    const response = await fetch(`/api/keys?network=${network}`);
    const data = await response.json();
    return data.fhePublicKey;
  } catch (error) {
    console.error('Failed to fetch public key:', error);
    throw new Error('Unable to fetch FHE public key');
  }
}

/**
 * Refresh FHE public key cache
 */
export async function refreshPublicKey(): Promise<boolean> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'refresh' }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to refresh public key:', error);
    return false;
  }
}

/**
 * Get key information
 */
export async function getKeyInfo(network: string = 'sepolia') {
  try {
    const response = await fetch(`/api/keys?network=${network}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to get key info:', error);
    throw new Error('Unable to retrieve key information');
  }
}
