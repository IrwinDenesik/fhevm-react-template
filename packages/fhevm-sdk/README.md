# @fhevm/sdk

[![NPM Version](https://img.shields.io/npm/v/@fhevm/sdk.svg)](https://www.npmjs.com/package/@fhevm/sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

> **Universal FHEVM SDK** - Framework-agnostic toolkit for building privacy-preserving dApps with Fully Homomorphic Encryption (FHE).

Build confidential smart contracts with an intuitive, wagmi-style API that works with React, Next.js, Vue, Node.js, or vanilla JavaScript.

## Features

- **🎯 Framework Agnostic** - Works with any JavaScript framework or vanilla JS
- **⚡ Zero Config** - Sensible defaults, works out of the box
- **🔐 Complete FHE Workflow** - Encryption, decryption, contract interaction
- **🪝 React Hooks** - Optional React bindings with `useFhevm()`, `useEncrypt()`, `useDecrypt()`
- **📘 TypeScript First** - Full type safety and IntelliSense support
- **🌳 Tree Shakeable** - Import only what you need
- **🎨 Wagmi-Style API** - Familiar, composable, developer-friendly

## Installation

```bash
npm install @fhevm/sdk
# or
yarn add @fhevm/sdk
# or
pnpm add @fhevm/sdk
```

## Quick Start

### Basic Usage (< 10 Lines)

```typescript
import { createFhevmClient, encryptUint32 } from '@fhevm/sdk';

// 1. Create FHEVM client
const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
  },
});

// 2. Encrypt a value
const encrypted = await encryptUint32(client, {
  value: 42,
  contractAddress: '0x...',
});

// 3. Use in contract call
await contract.submitValue(encrypted.data);
```

### React Usage

```tsx
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/sdk/react';

// Wrap your app with FhevmProvider
function App() {
  return (
    <FhevmProvider config={{
      network: {
        chainId: 11155111,
        name: 'Sepolia',
        rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
      }
    }}>
      <YourApp />
    </FhevmProvider>
  );
}

// Use hooks in components
function EncryptionComponent() {
  const { client, isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();

  const handleSubmit = async () => {
    const encrypted = await encrypt({
      value: 100,
      type: 'uint32',
      contractAddress: '0x...',
    });
    // Use encrypted.data in contract call
  };

  return (
    <button onClick={handleSubmit} disabled={isEncrypting || !isInitialized}>
      {isEncrypting ? 'Encrypting...' : 'Submit Encrypted Value'}
    </button>
  );
}
```

## API Reference

### Core Client

#### `createFhevmClient(config)`

Creates and initializes an FHEVM client.

```typescript
const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    publicKey?: '0x...',  // Optional: custom FHE public key
  },
});
```

#### Client Methods

- `client.init()` - Initialize the client
- `client.getInstance()` - Get the FHEVM instance
- `client.isInitialized()` - Check initialization status

### Encryption Functions

All encryption functions return `Promise<EncryptedInput>` with `{ data: Uint8Array }`.

#### `encryptUint8(client, params)`

```typescript
const encrypted = await encryptUint8(client, {
  value: 42,              // 0-255
  contractAddress: '0x...',
});
```

#### `encryptUint16(client, params)`

```typescript
const encrypted = await encryptUint16(client, {
  value: 1000,            // 0-65535
  contractAddress: '0x...',
});
```

#### `encryptUint32(client, params)`

```typescript
const encrypted = await encryptUint32(client, {
  value: 1000000,         // 0-4294967295
  contractAddress: '0x...',
});
```

#### `encryptUint64(client, params)`

```typescript
const encrypted = await encryptUint64(client, {
  value: BigInt('9999999999'),
  contractAddress: '0x...',
});
```

#### `encryptBool(client, params)`

```typescript
const encrypted = await encryptBool(client, {
  value: true,
  contractAddress: '0x...',
});
```

#### `encryptAddress(client, params)`

```typescript
const encrypted = await encryptAddress(client, {
  value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  contractAddress: '0x...',
});
```

### Decryption Functions

#### `userDecrypt(params)`

User-initiated decryption (requires EIP-712 signature).

```typescript
const result = await userDecrypt({
  handle: '0x...',           // Encrypted handle from contract
  contractAddress: '0x...',
  signer: ethers.signer,     // Ethers v6 signer
  userAddress: '0x...',
});

console.log(result.value); // Decrypted value
```

#### `publicDecrypt(params)`

Public decryption (no signature required, if allowed by contract).

```typescript
const result = await publicDecrypt({
  handle: '0x...',
  contractAddress: '0x...',
  provider: ethers.provider,
});
```

#### `batchDecrypt(params)`

Decrypt multiple values at once.

```typescript
const results = await batchDecrypt({
  handles: ['0x...', '0x...', '0x...'],
  contractAddress: '0x...',
  signer: ethers.signer,
  userAddress: '0x...',
});

results.forEach((result, index) => {
  console.log(`Value ${index}:`, result.value);
});
```

### React Hooks

#### `useFhevm()`

Access FHEVM client and initialization state.

```tsx
const { client, isInitialized, isInitializing, error } = useFhevm();
```

#### `useEncrypt(options?)`

Hook for encrypting values.

```tsx
const { encrypt, isEncrypting, error, result } = useEncrypt({
  onSuccess: (result) => console.log('Encrypted:', result),
  onError: (error) => console.error('Error:', error),
});

// Use it
const encrypted = await encrypt({
  value: 42,
  type: 'uint32',
  contractAddress: '0x...',
});
```

#### `useDecrypt(options?)`

Hook for decrypting values.

```tsx
const { decrypt, decryptPublic, decryptBatch, isDecrypting, result } = useDecrypt({
  onSuccess: (result) => console.log('Decrypted:', result.value),
});

// User decryption
await decrypt({
  handle: '0x...',
  contractAddress: '0x...',
  signer,
  userAddress: '0x...',
});

// Public decryption
await decryptPublic({
  handle: '0x...',
  contractAddress: '0x...',
  provider,
});
```

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type {
  FhevmClient,
  FhevmClientConfig,
  EncryptedInput,
  DecryptionResult,
  EncryptionParams,
  DecryptionParams,
  FhevmInstance,
} from '@fhevm/sdk';
```

## Examples

### Node.js Script

```typescript
import { createFhevmClient, encryptUint32, userDecrypt } from '@fhevm/sdk';
import { ethers } from 'ethers';

async function main() {
  // Initialize
  const client = await createFhevmClient({
    network: {
      chainId: 11155111,
      rpcUrl: process.env.RPC_URL!,
    },
  });

  // Encrypt
  const encrypted = await encryptUint32(client, {
    value: 12345,
    contractAddress: process.env.CONTRACT_ADDRESS!,
  });

  // Send to contract
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(address, abi, signer);

  const tx = await contract.submitValue(encrypted.data);
  await tx.wait();

  // Decrypt result
  const handle = await contract.getValue();
  const result = await userDecrypt({
    handle,
    contractAddress: process.env.CONTRACT_ADDRESS!,
    signer,
    userAddress: await signer.getAddress(),
  });

  console.log('Decrypted value:', result.value);
}

main();
```

### Next.js App Router

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

// app/page.tsx
'use client';
import { useEncrypt, useDecrypt } from '@fhevm/sdk/react';

export default function HomePage() {
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, result } = useDecrypt();

  // Use hooks...
}
```

## Architecture

The SDK is built with a clean, modular architecture:

```
@fhevm/sdk
├── Core (Framework-Agnostic)
│   ├── FhevmClient      - Main client class
│   ├── Encryption       - Encryption utilities
│   ├── Decryption       - Decryption utilities
│   ├── Types            - TypeScript definitions
│   └── Constants        - Network configs
│
├── React (Optional)
│   ├── Provider         - Context provider
│   ├── useFhevm()       - Client hook
│   ├── useEncrypt()     - Encryption hook
│   └── useDecrypt()     - Decryption hook
│
└── Utils
    ├── Helpers          - Helper functions
    └── Validation       - Input validation
```

## Supported Networks

- Sepolia Testnet (ChainID: 11155111)
- Custom FHEVM networks (configurable)

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions

## Requirements

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

## License

MIT © FHEVM SDK Contributors

## Resources

- [Documentation](../../docs/)
- [Examples](../../examples/)
- [GitHub](https://github.com/IrwinDenesik/fhevm-react-template)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

## Support

- Issues: [GitHub Issues](https://github.com/IrwinDenesik/fhevm-react-template/issues)
- Discord: [Zama Discord](https://discord.gg/zama)

---

**Built for Zama Bounty Challenge** - Making FHE accessible to every developer.
