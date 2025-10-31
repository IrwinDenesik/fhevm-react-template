# API Reference

Complete API documentation for @fhevm/sdk - Universal FHEVM SDK

## Table of Contents

- [Core Client](#core-client)
- [Encryption Functions](#encryption-functions)
- [Decryption Functions](#decryption-functions)
- [React Hooks](#react-hooks)
- [Types](#types)
- [Constants](#constants)

---

## Core Client

### `createFhevmClient(config)`

Creates and initializes an FHEVM client instance.

**Parameters:**
- `config: FhevmClientConfig` - Configuration object

**Returns:** `Promise<FhevmClient>`

**Example:**
```typescript
import { createFhevmClient } from '@fhevm/sdk';

const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    gatewayUrl: 'https://gateway.fhevm.io',
  },
  publicKey: 'optional-pre-fetched-key',
});
```

### `FhevmClient`

Main client class for FHE operations.

#### Methods

##### `init()`

Initializes the client and fetches the public key.

```typescript
await client.init();
```

##### `getInstance()`

Returns the underlying fhevmjs instance.

```typescript
const instance = client.getInstance();
```

##### `getPublicKey()`

Returns the network's public key.

```typescript
const publicKey = client.getPublicKey();
```

##### `getConfig()`

Returns the client configuration.

```typescript
const config = client.getConfig();
```

##### `isInitialized()`

Checks if the client is initialized.

```typescript
if (client.isInitialized()) {
  // Client ready
}
```

---

## Encryption Functions

All encryption functions follow the same pattern and return an `EncryptedInput` object.

### `encryptUint8(client, params)`

Encrypts an 8-bit unsigned integer (0-255).

**Parameters:**
- `client: FhevmClient` - Initialized FHEVM client
- `params: EncryptionParams` - Encryption parameters

**Returns:** `Promise<EncryptedInput>`

**Example:**
```typescript
const encrypted = await encryptUint8(client, {
  value: 42,
  contractAddress: '0x1234...',
  signer: ethers.signer, // Optional
});

// Use in contract call
await contract.submitValue(encrypted.data);
```

### `encryptUint16(client, params)`

Encrypts a 16-bit unsigned integer (0-65535).

```typescript
const encrypted = await encryptUint16(client, {
  value: 1000,
  contractAddress: '0x...',
});
```

### `encryptUint32(client, params)`

Encrypts a 32-bit unsigned integer (0-4294967295).

```typescript
const encrypted = await encryptUint32(client, {
  value: 1000000,
  contractAddress: '0x...',
});
```

### `encryptUint64(client, params)`

Encrypts a 64-bit unsigned integer.

```typescript
const encrypted = await encryptUint64(client, {
  value: BigInt('9999999999'),
  contractAddress: '0x...',
});
```

### `encryptBool(client, params)`

Encrypts a boolean value.

```typescript
const encrypted = await encryptBool(client, {
  value: true,
  contractAddress: '0x...',
});
```

### `encryptAddress(client, params)`

Encrypts an Ethereum address.

```typescript
const encrypted = await encryptAddress(client, {
  value: '0x1234567890123456789012345678901234567890',
  contractAddress: '0x...',
});
```

---

## Decryption Functions

### `userDecrypt(params)`

Decrypts an encrypted value using EIP-712 user signature.

**Parameters:**
- `params: UserDecryptionParams` - Decryption parameters including handle, contract address, signer, and user address

**Returns:** `Promise<DecryptionResult<T>>`

**Example:**
```typescript
import { userDecrypt } from '@fhevm/sdk';
import { ethers } from 'ethers';

const result = await userDecrypt({
  handle: '0xabcdef...', // Encrypted handle from contract
  contractAddress: '0x1234...',
  signer: ethers.signer,
  userAddress: '0x5678...',
});

if (result.success) {
  console.log('Decrypted value:', result.value);
} else {
  console.error('Decryption failed:', result.error);
}
```

### `publicDecrypt(params)`

Decrypts an encrypted value without signature (for public data).

**Parameters:**
- `params: PublicDecryptionParams` - Decryption parameters

**Returns:** `Promise<DecryptionResult<T>>`

**Example:**
```typescript
const result = await publicDecrypt({
  handle: '0xabcdef...',
  contractAddress: '0x1234...',
  provider: ethers.provider,
});
```

### `batchDecrypt(params)`

Decrypts multiple values in a single operation.

**Parameters:**
- `params: BatchDecryptionParams` - Batch decryption parameters

**Returns:** `Promise<DecryptionResult<T[]>>`

**Example:**
```typescript
const result = await batchDecrypt({
  handles: ['0xabc...', '0xdef...', '0x123...'],
  contractAddress: '0x1234...',
  signer: ethers.signer,
  userAddress: '0x5678...',
});

if (result.success) {
  result.value.forEach((val, idx) => {
    console.log(`Value ${idx}:`, val);
  });
}
```

---

## React Hooks

### `FhevmProvider`

Context provider for FHEVM client in React applications.

**Props:**
- `config: FhevmClientConfig` - Client configuration
- `children: ReactNode` - Child components

**Example:**
```typescript
import { FhevmProvider } from '@fhevm/sdk/react';

function App() {
  return (
    <FhevmProvider
      config={{
        network: {
          chainId: 11155111,
          name: 'Sepolia',
          rpcUrl: process.env.RPC_URL,
        },
      }}
    >
      <YourApp />
    </FhevmProvider>
  );
}
```

### `useFhevm()`

Main hook for accessing FHEVM client and state.

**Returns:** `FhevmContextValue`

**Example:**
```typescript
import { useFhevm } from '@fhevm/sdk/react';

function MyComponent() {
  const { client, isInitialized, error } = useFhevm();

  if (!isInitialized) {
    return <div>Initializing FHEVM...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Use client
  const instance = client.getInstance();
}
```

### `useEncrypt()`

Hook for encryption operations with state management.

**Options:**
- `onSuccess?: (result: EncryptedInput) => void` - Success callback
- `onError?: (error: Error) => void` - Error callback

**Returns:** `UseEncryptReturn`

**Example:**
```typescript
import { useEncrypt } from '@fhevm/sdk/react';

function EncryptForm() {
  const { encrypt, isEncrypting, error } = useEncrypt({
    onSuccess: (result) => console.log('Encrypted:', result),
    onError: (err) => console.error('Failed:', err),
  });

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt({
      value,
      type: 'uint32',
      contractAddress: '0x...',
    });

    // Use encrypted.data in contract call
    await contract.submitValue(encrypted.data);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(42); }}>
      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit'}
      </button>
      {error && <div>Error: {error}</div>}
    </form>
  );
}
```

### `useDecrypt()`

Hook for decryption operations with state management.

**Options:**
- `onSuccess?: (result: DecryptionResult) => void` - Success callback
- `onError?: (error: Error) => void` - Error callback

**Returns:** `UseDecryptReturn`

**Example:**
```typescript
import { useDecrypt } from '@fhevm/sdk/react';

function DecryptButton({ handle }: { handle: string }) {
  const { decrypt, isDecrypting, result, error } = useDecrypt({
    onSuccess: (res) => console.log('Decrypted:', res.value),
  });

  const handleDecrypt = async () => {
    await decrypt({
      handle,
      contractAddress: '0x...',
      signer: ethers.signer,
      userAddress: '0x...',
    });
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
      {result && <div>Result: {result.value}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

---

## Types

### `FhevmClientConfig`

```typescript
interface FhevmClientConfig {
  network: {
    chainId: number;
    name: string;
    rpcUrl: string;
    gatewayUrl?: string;
  };
  publicKey?: string;
}
```

### `EncryptionParams`

```typescript
interface EncryptionParams {
  value: number | bigint | boolean | string;
  contractAddress: string;
  signer?: Signer;
}
```

### `EncryptedInput`

```typescript
interface EncryptedInput {
  data: Uint8Array;
  type: string;
  signature?: string;
}
```

### `UserDecryptionParams`

```typescript
interface UserDecryptionParams {
  handle: string;
  contractAddress: string;
  signer: Signer;
  userAddress: string;
}
```

### `PublicDecryptionParams`

```typescript
interface PublicDecryptionParams {
  handle: string;
  contractAddress: string;
  provider: Provider;
}
```

### `BatchDecryptionParams`

```typescript
interface BatchDecryptionParams {
  handles: string[];
  contractAddress: string;
  signer: Signer;
  userAddress: string;
}
```

### `DecryptionResult<T>`

```typescript
interface DecryptionResult<T> {
  value: T | null;
  success: boolean;
  error?: string;
}
```

---

## Constants

### `SUPPORTED_NETWORKS`

List of supported networks with their configurations.

```typescript
const SUPPORTED_NETWORKS = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/',
  },
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
  },
};
```

### `ENCRYPTION_TYPES`

Supported encryption types and their ranges.

```typescript
const ENCRYPTION_TYPES = {
  uint8: { min: 0, max: 255 },
  uint16: { min: 0, max: 65535 },
  uint32: { min: 0, max: 4294967295 },
  uint64: { min: 0n, max: 18446744073709551615n },
  bool: {},
  address: {},
};
```

### `DEFAULT_FHEVM_CONFIG`

Default configuration values.

```typescript
const DEFAULT_FHEVM_CONFIG = {
  network: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: '',
  },
};
```

---

## Error Handling

All functions throw descriptive errors that can be caught:

```typescript
try {
  const encrypted = await encryptUint32(client, {
    value: 999999999999, // Out of range
    contractAddress: '0x...',
  });
} catch (error) {
  if (error.message.includes('out of range')) {
    console.error('Value too large for uint32');
  }
}
```

For React hooks, errors are captured in the hook's state:

```typescript
const { encrypt, error } = useEncrypt();

// Error is automatically captured in state
if (error) {
  console.error('Encryption error:', error);
}
```

---

## Best Practices

### 1. Initialize Once

Create the client once and reuse it:

```typescript
// Good
const client = await createFhevmClient(config);
// Reuse client for all operations

// Bad
for (let i = 0; i < 10; i++) {
  const client = await createFhevmClient(config); // Don't recreate
}
```

### 2. Use React Hooks in React Apps

```typescript
// Good - Use hooks
function MyComponent() {
  const { client } = useFhevm();
  const { encrypt } = useEncrypt();
}

// Avoid - Direct client creation in components
function MyComponent() {
  const [client, setClient] = useState(null);
  useEffect(() => {
    createFhevmClient(config).then(setClient);
  }, []);
}
```

### 3. Type Safety

Always use TypeScript for better type safety:

```typescript
const result = await userDecrypt<number>({
  handle,
  contractAddress,
  signer,
  userAddress,
});

// result.value is typed as number | null
```

### 4. Error Handling

Always handle errors:

```typescript
const result = await userDecrypt(params);

if (!result.success) {
  console.error('Decryption failed:', result.error);
  return;
}

// Safe to use result.value
console.log('Decrypted:', result.value);
```

---

## Support

- **Documentation**: [docs/](./docs/)
- **Examples**: [examples/](../examples/)
- **Issues**: [GitHub Issues](https://github.com/YOUR_REPO/issues)
