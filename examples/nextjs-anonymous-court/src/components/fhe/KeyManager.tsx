'use client';

import { useState, useEffect } from 'react';
import { useFhevm } from '@fhevm/sdk/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function KeyManager() {
  const { client, isInitialized } = useFhevm();
  const [keyInfo, setKeyInfo] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isInitialized && client) {
      loadKeyInfo();
    }
  }, [isInitialized, client]);

  const loadKeyInfo = async () => {
    try {
      const response = await fetch('/api/keys?network=sepolia');
      const data = await response.json();
      setKeyInfo(data);
    } catch (error) {
      console.error('Failed to load key info:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' }),
      });
      await loadKeyInfo();
    } catch (error) {
      console.error('Failed to refresh keys:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card title="🔑 Key Management" description="FHE public key and network information">
      <div className="space-y-4">
        {keyInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-1">Network</p>
              <p className="text-sm font-semibold text-gray-900">{keyInfo.network}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-1">Chain ID</p>
              <p className="text-sm font-semibold text-gray-900">{keyInfo.chainId}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-1">Key Type</p>
              <p className="text-sm font-semibold text-gray-900">{keyInfo.keyType}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-1">Security Level</p>
              <p className="text-sm font-semibold text-gray-900">{keyInfo.securityLevel} bits</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-xs font-medium text-indigo-900 mb-2">Supported Types:</p>
          <div className="flex flex-wrap gap-2">
            {keyInfo?.supportedTypes?.map((type: string) => (
              <span
                key={type}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          isLoading={isRefreshing}
          variant="secondary"
          className="w-full"
        >
          {isRefreshing ? 'Refreshing...' : '🔄 Refresh Keys'}
        </Button>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ Note:</strong> FHE public keys are generated per network and cached for
            performance. Refreshing is rarely needed unless the network configuration changes.
          </p>
        </div>
      </div>
    </Card>
  );
}
