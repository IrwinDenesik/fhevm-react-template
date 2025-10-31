import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient, encryptUint8, encryptUint16, encryptUint32, encryptUint64, encryptBool, encryptAddress } from '@fhevm/sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type, contractAddress } = body;

    if (value === undefined || !type || !contractAddress) {
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
      case 'uint8':
        encrypted = await encryptUint8(client, { value, contractAddress });
        break;
      case 'uint16':
        encrypted = await encryptUint16(client, { value, contractAddress });
        break;
      case 'uint32':
        encrypted = await encryptUint32(client, { value, contractAddress });
        break;
      case 'uint64':
        encrypted = await encryptUint64(client, { value: BigInt(value), contractAddress });
        break;
      case 'bool':
        encrypted = await encryptBool(client, { value, contractAddress });
        break;
      case 'address':
        encrypted = await encryptAddress(client, { value, contractAddress });
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      type,
      encrypted: Array.from(encrypted.data),
      length: encrypted.data.length,
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: 'Encryption failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
