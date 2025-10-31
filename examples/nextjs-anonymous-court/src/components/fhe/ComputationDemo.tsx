'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ComputationDemo() {
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul' | 'eq' | 'lt' | 'gt'>('add');
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCompute = async () => {
    setIsComputing(true);
    setResult(null);

    try {
      // Simulate FHE computation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const operations = {
        add: '+',
        sub: '-',
        mul: '×',
        eq: '==',
        lt: '<',
        gt: '>',
      };

      setResult(
        `Encrypted computation: ${operand1} ${operations[operation]} ${operand2} = [Encrypted Result]`
      );
    } catch (error) {
      console.error('Computation error:', error);
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <Card
      title="⚡ Homomorphic Computation"
      description="Perform computations on encrypted data without decryption"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation Type
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isComputing}
          >
            <option value="add">Addition (+)</option>
            <option value="sub">Subtraction (-)</option>
            <option value="mul">Multiplication (×)</option>
            <option value="eq">Equal (==)</option>
            <option value="lt">Less Than (&lt;)</option>
            <option value="gt">Greater Than (&gt;)</option>
          </select>
        </div>

        <Input
          label="First Operand (Encrypted Handle)"
          value={operand1}
          onChange={(e) => setOperand1(e.target.value)}
          placeholder="0x... or encrypted value"
          disabled={isComputing}
        />

        <Input
          label="Second Operand (Encrypted Handle)"
          value={operand2}
          onChange={(e) => setOperand2(e.target.value)}
          placeholder="0x... or encrypted value"
          disabled={isComputing}
        />

        <Button
          onClick={handleCompute}
          isLoading={isComputing}
          disabled={!operand1 || !operand2 || isComputing}
          className="w-full"
        >
          {isComputing ? 'Computing...' : 'Compute on Encrypted Data'}
        </Button>

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">✅ Computation Complete!</p>
            <p className="text-sm text-gray-700">{result}</p>
          </div>
        )}

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs text-purple-800">
            <strong>🔬 How it works:</strong> FHE allows mathematical operations on encrypted data.
            The result remains encrypted and can only be decrypted by authorized parties.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">100%</div>
            <div className="text-xs text-gray-600 mt-1">Privacy Preserved</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs text-gray-600 mt-1">Data Leakage</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
