'use client';

import { useState } from 'react';
import { useFhevm } from '@fhevm/sdk/react';
import EncryptionDemo from '@/components/fhe/EncryptionDemo';
import ComputationDemo from '@/components/fhe/ComputationDemo';
import KeyManager from '@/components/fhe/KeyManager';
import BankingExample from '@/components/examples/BankingExample';
import MedicalExample from '@/components/examples/MedicalExample';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const { isInitialized, isInitializing, error } = useFhevm();
  const [activeTab, setActiveTab] = useState<'demo' | 'banking' | 'medical'>('demo');

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-lg font-medium text-gray-700">Initializing FHEVM Client...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <Card className="p-8 border-red-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-red-500 text-4xl">⚠️</div>
            <h2 className="text-xl font-bold text-red-700">Initialization Error</h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            FHEVM SDK Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Privacy-Preserving Applications with Fully Homomorphic Encryption
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">FHEVM Connected</span>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'demo'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔐 FHE Demo
            </button>
            <button
              onClick={() => setActiveTab('banking')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'banking'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏦 Banking Example
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'medical'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏥 Medical Example
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'demo' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EncryptionDemo />
                <ComputationDemo />
              </div>
              <KeyManager />
            </div>
          )}

          {activeTab === 'banking' && <BankingExample />}

          {activeTab === 'medical' && <MedicalExample />}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="mb-2">
            Built with <span className="text-red-500">❤</span> using{' '}
            <a
              href="https://github.com/IrwinDenesik/fhevm-react-template"
              className="text-indigo-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              @fhevm/sdk
            </a>
          </p>
          <p className="text-sm">
            Powered by{' '}
            <a
              href="https://zama.ai"
              className="text-purple-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zama FHEVM
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
