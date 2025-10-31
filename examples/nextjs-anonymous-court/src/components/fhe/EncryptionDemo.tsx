'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function EncryptionDemo() {
  const [value, setValue] = useState('');
  const [type, setType] = useState<'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address'>('uint32');
  const [contractAddress, setContractAddress] = useState('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  const { encrypt, isEncrypting, error, result } = useEncrypt();

  const handleEncrypt = async () => {
    try {
      let parsedValue: any = value;

      // Parse value based on type
      if (type === 'bool') {
        parsedValue = value.toLowerCase() === 'true';
      } else if (type === 'uint64') {
        parsedValue = BigInt(value);
      } else if (type !== 'address') {
        parsedValue = parseInt(value);
      }

      await encrypt({
        value: parsedValue,
        type,
        contractAddress,
      });
    } catch (err) {
      console.error('Encryption error:', err);
    }
  };

  return (
    <Card
      title="🔐 Encrypt Data"
      description="Encrypt values using FHEVM before sending to smart contracts"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encryption Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="uint8">uint8 (0-255)</option>
            <option value="uint16">uint16 (0-65535)</option>
            <option value="uint32">uint32 (0-4294967295)</option>
            <option value="uint64">uint64 (BigInt)</option>
            <option value="bool">bool (true/false)</option>
            <option value="address">address (0x...)</option>
          </select>
        </div>

        <Input
          label="Value to Encrypt"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            type === 'bool'
              ? 'true or false'
              : type === 'address'
              ? '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
              : 'Enter a number'
          }
          disabled={isEncrypting}
        />

        <Input
          label="Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="0x..."
          disabled={isEncrypting}
        />

        <Button
          onClick={handleEncrypt}
          isLoading={isEncrypting}
          disabled={!value || !contractAddress || isEncrypting}
          className="w-full"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              <strong>Error:</strong> {error.message}
            </p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">✅ Encryption Successful!</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600 mb-1">Encrypted Data (first 64 bytes):</p>
                <code className="block p-2 bg-white rounded text-xs break-all">
                  {Array.from(result.data.slice(0, 64))
                    .map((b) => b.toString(16).padStart(2, '0'))
                    .join('')}
                  {result.data.length > 64 && '...'}
                </code>
              </div>
              <p className="text-xs text-gray-600">
                Length: {result.data.length} bytes
              </p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>💡 Info:</strong> Encrypted data can be safely sent to smart contracts.
            The values remain private and can only be decrypted by authorized parties.
          </p>
        </div>
      </div>
    </Card>
  );
}
