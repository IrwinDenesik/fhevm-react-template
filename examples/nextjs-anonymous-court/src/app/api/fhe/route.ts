import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient, encryptUint32 } from '@fhevm/sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type, contractAddress } = body;

    if (!value || !type || !contractAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters: value, type, contractAddress' },
        { status: 400 }
      );
    }

    // Create FHEVM client
    const client = await createFhevmClient({
      network: {
        chainId: 11155111,
        name: 'Sepolia',
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
      },
    });

    // Encrypt based on type
    let encrypted;
    switch (type) {
      case 'uint32':
        encrypted = await encryptUint32(client, { value, contractAddress });
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      encrypted: Array.from(encrypted.data),
    });
  } catch (error) {
    console.error('FHE encryption error:', error);
    return NextResponse.json(
      { error: 'Encryption failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE API endpoint',
    methods: ['POST'],
    endpoints: {
      encrypt: '/api/fhe/encrypt',
      decrypt: '/api/fhe/decrypt',
      compute: '/api/fhe/compute',
    },
  });
}
