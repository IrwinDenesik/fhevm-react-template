# Next.js FHEVM Example - Anonymous Court

Privacy-preserving court investigation system demonstrating [@fhevm/sdk](../../packages/fhevm-sdk) integration with Next.js 15.

## Features

- **🔐 Full Encryption Workflow** - Client-side encryption with FHEVM
- **⚡ Next.js 15 App Router** - Modern React Server Components
- **🎨 Beautiful UI** - Tailwind CSS with responsive design
- **🪝 React Hooks** - Clean integration using SDK hooks
- **📱 Multiple Examples** - Banking, Medical, and FHE demos
- **🔑 Key Management** - FHE public key handling

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your RPC URL
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
nextjs-anonymous-court/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx          # Root layout with FhevmProvider
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── api/                # API Routes
│   │       ├── fhe/            # FHE operations
│   │       │   ├── route.ts
│   │       │   ├── encrypt/route.ts
│   │       │   ├── decrypt/route.ts
│   │       │   └── compute/route.ts
│   │       └── keys/route.ts   # Key management
│   │
│   ├── components/             # React Components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── fhe/                # FHE components
│   │   │   ├── FHEProvider.tsx
│   │   │   ├── EncryptionDemo.tsx
│   │   │   ├── ComputationDemo.tsx
│   │   │   └── KeyManager.tsx
│   │   └── examples/           # Use case examples
│   │       ├── BankingExample.tsx
│   │       └── MedicalExample.tsx
│   │
│   ├── lib/                    # Libraries
│   │   ├── fhe/                # FHE utilities
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── keys.ts
│   │   │   └── types.ts
│   │   └── utils/              # Helper utilities
│   │       ├── security.ts
│   │       └── validation.ts
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useFHE.ts
│   │   ├── useEncryption.ts
│   │   └── useComputation.ts
│   │
│   └── types/                  # TypeScript types
│       ├── fhe.ts
│       └── api.ts
│
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.ts
```

## SDK Integration

### 1. Provider Setup

```tsx
// app/layout.tsx
import { FhevmProvider } from '@fhevm/sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider config={{ network: { chainId: 11155111, ... } }}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

### 2. Using Hooks

```tsx
// components/MyComponent.tsx
'use client';
import { useEncrypt } from '@fhevm/sdk/react';

export default function MyComponent() {
  const { encrypt, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt({
      value: 42,
      type: 'uint32',
      contractAddress: '0x...',
    });
    // Use encrypted.data
  };
}
```

### 3. API Routes

```typescript
// app/api/fhe/encrypt/route.ts
import { createFhevmClient, encryptUint32 } from '@fhevm/sdk';

export async function POST(request: NextRequest) {
  const client = await createFhevmClient({ ... });
  const encrypted = await encryptUint32(client, { value, contractAddress });
  return NextResponse.json({ encrypted: Array.from(encrypted.data) });
}
```

## Examples

### Encryption Demo
- Encrypt various data types (uint8, uint16, uint32, uint64, bool, address)
- Real-time encryption with visual feedback
- Contract address configuration

### Computation Demo
- Homomorphic operations on encrypted data
- Addition, subtraction, multiplication, comparison
- No decryption required

### Banking Example
- Private financial transactions
- Encrypted account balances
- Confidential transfer amounts

### Medical Records
- HIPAA-compliant health data storage
- Encrypted patient information
- Privacy-preserving medical records

## Environment Variables

```env
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
```

## Technologies

- **Next.js 15** - React framework
- **@fhevm/sdk** - FHEVM SDK
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - UI library

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
