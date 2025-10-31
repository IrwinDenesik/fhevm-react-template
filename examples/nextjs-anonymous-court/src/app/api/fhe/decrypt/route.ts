import { NextRequest, NextResponse } from 'next/server';
import { userDecrypt, publicDecrypt } from '@fhevm/sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handle, contractAddress, isPublic, provider } = body;

    if (!handle || !contractAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters: handle, contractAddress' },
        { status: 400 }
      );
    }

    // Note: In a real application, you would need to handle signer/provider
    // This is a simplified example for demonstration purposes

    if (isPublic) {
      const result = await publicDecrypt({
        handle,
        contractAddress,
        provider, // This should be an ethers provider instance
      });

      return NextResponse.json({
        success: true,
        value: result.value,
        type: result.type,
      });
    } else {
      return NextResponse.json(
        { error: 'User decryption requires client-side signing with wallet' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: 'Decryption failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
