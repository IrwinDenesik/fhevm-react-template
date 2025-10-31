import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Computation API
 * Demonstrates how FHE operations can be performed on encrypted data
 * without decryption
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, operands } = body;

    if (!operation || !operands) {
      return NextResponse.json(
        { error: 'Missing required parameters: operation, operands' },
        { status: 400 }
      );
    }

    // Note: Actual FHE computation happens on-chain via smart contracts
    // This endpoint simulates the concept for demonstration

    const supportedOperations = ['add', 'sub', 'mul', 'div', 'eq', 'ne', 'lt', 'lte', 'gt', 'gte'];

    if (!supportedOperations.includes(operation)) {
      return NextResponse.json(
        { error: `Unsupported operation: ${operation}. Supported: ${supportedOperations.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `FHE ${operation} operation queued. Computation happens on-chain.`,
      operation,
      operandCount: operands.length,
      info: 'FHE computations are performed by smart contracts on encrypted data without revealing values.',
    });
  } catch (error) {
    console.error('Computation error:', error);
    return NextResponse.json(
      { error: 'Computation request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE Computation API',
    supportedOperations: {
      arithmetic: ['add', 'sub', 'mul', 'div'],
      comparison: ['eq', 'ne', 'lt', 'lte', 'gt', 'gte'],
    },
    usage: {
      method: 'POST',
      body: {
        operation: 'add',
        operands: ['encrypted_handle_1', 'encrypted_handle_2'],
      },
    },
  });
}
