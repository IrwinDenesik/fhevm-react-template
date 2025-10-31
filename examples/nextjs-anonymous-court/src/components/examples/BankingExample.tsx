'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function BankingExample() {
  const [accountBalance, setAccountBalance] = useState('1000');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const { encrypt, isEncrypting, result } = useEncrypt();
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleTransfer = async () => {
    try {
      const encrypted = await encrypt({
        value: parseInt(transferAmount),
        type: 'uint32',
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      });

      const transaction = {
        id: Date.now(),
        amount: '[ENCRYPTED]',
        recipient: recipientAddress.slice(0, 6) + '...' + recipientAddress.slice(-4),
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      setTransactions([transaction, ...transactions]);
      setTransferAmount('');
      setRecipientAddress('');

      // Simulate transaction processing
      setTimeout(() => {
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === transaction.id ? { ...tx, status: 'completed' } : tx
          )
        );
      }, 2000);
    } catch (error) {
      console.error('Transfer error:', error);
    }
  };

  return (
    <div className="space-y-8">
      <Card title="🏦 Private Banking System" description="Confidential financial transactions using FHE">
        <div className="space-y-6">
          {/* Account Overview */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Balance</p>
                <p className="text-3xl font-bold text-green-700">[ENCRYPTED]</p>
                <p className="text-xs text-gray-500 mt-1">
                  Actual: ${accountBalance} (hidden from network)
                </p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          {/* Transfer Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Send Private Transfer</h3>

            <Input
              label="Amount to Transfer"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={isEncrypting}
            />

            <Input
              label="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              disabled={isEncrypting}
            />

            <Button
              onClick={handleTransfer}
              isLoading={isEncrypting}
              disabled={!transferAmount || !recipientAddress || isEncrypting}
              className="w-full"
            >
              {isEncrypting ? 'Encrypting Transfer...' : '🔐 Send Encrypted Transfer'}
            </Button>
          </div>

          {/* Privacy Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-xs font-medium text-gray-700">Balance Hidden</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">💸</div>
              <p className="text-xs font-medium text-gray-700">Amount Private</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-xs font-medium text-gray-700">Verified Secure</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card title="📜 Transaction History" description="Your recent encrypted transactions">
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-semibold text-gray-900">Transfer to {tx.recipient}</span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          tx.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Amount: {tx.amount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-2xl">🔐</div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Info Panel */}
      <Card>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-semibold text-indigo-900 mb-2">🛡️ Privacy Guarantees</h4>
          <ul className="space-y-1 text-sm text-indigo-800">
            <li>✓ Account balances are fully encrypted on-chain</li>
            <li>✓ Transfer amounts remain private from all observers</li>
            <li>✓ Only authorized parties can decrypt transaction details</li>
            <li>✓ Network validators cannot see sensitive financial data</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
