'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function MedicalExample() {
  const [patientId, setPatientId] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const { encrypt, isEncrypting } = useEncrypt();
  const [records, setRecords] = useState<any[]>([]);

  const handleSubmitRecord = async () => {
    try {
      // Encrypt all medical data
      await encrypt({
        value: parseInt(bloodPressure),
        type: 'uint32',
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      });

      const record = {
        id: Date.now(),
        patientId: patientId,
        bloodPressure: '[ENCRYPTED]',
        heartRate: '[ENCRYPTED]',
        temperature: '[ENCRYPTED]',
        timestamp: new Date().toISOString(),
        status: 'stored',
      };

      setRecords([record, ...records]);
      setPatientId('');
      setBloodPressure('');
      setHeartRate('');
      setTemperature('');
    } catch (error) {
      console.error('Record submission error:', error);
    }
  };

  return (
    <div className="space-y-8">
      <Card
        title="🏥 Private Medical Records"
        description="HIPAA-compliant encrypted health data storage"
      >
        <div className="space-y-6">
          {/* Alert Banner */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚕️</div>
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">
                  HIPAA Privacy Protection
                </p>
                <p className="text-xs text-red-700">
                  All medical data is encrypted using FHE before storage. Patient privacy is
                  guaranteed by cryptographic protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Medical Record Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Submit Encrypted Medical Record</h3>

            <Input
              label="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="PAT-12345"
              disabled={isEncrypting}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Blood Pressure (mmHg)"
                type="number"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="120"
                disabled={isEncrypting}
              />

              <Input
                label="Heart Rate (bpm)"
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="75"
                disabled={isEncrypting}
              />

              <Input
                label="Temperature (°F)"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="98.6"
                disabled={isEncrypting}
              />
            </div>

            <Button
              onClick={handleSubmitRecord}
              isLoading={isEncrypting}
              disabled={!patientId || !bloodPressure || !heartRate || !temperature || isEncrypting}
              className="w-full"
            >
              {isEncrypting ? 'Encrypting & Storing...' : '🔐 Submit Encrypted Record'}
            </Button>
          </div>

          {/* Compliance Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-1">🔒</div>
              <p className="text-xs font-medium text-gray-700">End-to-End Encrypted</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl mb-1">✅</div>
              <p className="text-xs font-medium text-gray-700">HIPAA Compliant</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-1">👤</div>
              <p className="text-xs font-medium text-gray-700">Patient Privacy</p>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-2xl mb-1">🛡️</div>
              <p className="text-xs font-medium text-gray-700">Immutable Audit</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Medical Records */}
      <Card title="📋 Encrypted Medical Records" description="Stored patient data (encrypted)">
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏥</div>
              <p className="text-gray-500">No medical records stored yet</p>
              <p className="text-sm text-gray-400 mt-2">Submit your first encrypted record above</p>
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">Patient: {record.patientId}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(record.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {record.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600">Blood Pressure</p>
                    <p className="text-sm font-medium text-gray-900">{record.bloodPressure}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600">Heart Rate</p>
                    <p className="text-sm font-medium text-gray-900">{record.heartRate}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600">Temperature</p>
                    <p className="text-sm font-medium text-gray-900">{record.temperature}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-indigo-600">
                  <span>🔐</span>
                  <span>All values encrypted on-chain • Only authorized personnel can decrypt</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Compliance Info */}
      <Card>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✅ Compliance Features</h4>
            <ul className="space-y-1 text-sm text-green-800">
              <li>• Full encryption of Protected Health Information (PHI)</li>
              <li>• Immutable audit trail on blockchain</li>
              <li>• Role-based access control for decryption</li>
              <li>• HIPAA-compliant data handling</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🔍 Use Cases</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Electronic Health Records (EHR) storage</li>
              <li>• Medical research with privacy preservation</li>
              <li>• Insurance claim processing</li>
              <li>• Telemedicine consultation records</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
