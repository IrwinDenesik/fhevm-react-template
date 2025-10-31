# Architecture

Complete architectural overview of the Universal FHEVM SDK.

## Table of Contents

- [Overview](#overview)
- [Design Principles](#design-principles)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Framework Integration](#framework-integration)
- [Security Model](#security-model)

---

## Overview

The Universal FHEVM SDK is designed as a **framework-agnostic** toolkit for building privacy-preserving decentralized applications using Fully Homomorphic Encryption (FHE). The architecture follows these key principles:

1. **Separation of Concerns** - Core FHE logic is independent of any framework
2. **Optional Bindings** - Framework-specific integrations are opt-in
3. **Tree-Shakeable** - Import only what you need
4. **Type-Safe** - Full TypeScript support throughout
5. **Developer-Friendly** - Intuitive, wagmi-style API

---

## Design Principles

### 1. Framework Agnostic Core

The core SDK (`src/core/`) has **zero framework dependencies**:

```
@fhevm/sdk/core
├── No React
├── No Vue
├── No Angular
└── Pure TypeScript + fhevmjs
```

This allows usage in:
- Node.js scripts
- React applications
- Vue applications
- Next.js (SSR/SSG)
- Express.js backends
- CLI tools
- Any JavaScript environment

### 2. Optional Framework Bindings

Framework-specific features are separate packages:

```typescript
// Core only (works anywhere)
import { createFhevmClient, encryptUint32 } from '@fhevm/sdk';

// React bindings (optional)
import { FhevmProvider, useFhevm } from '@fhevm/sdk/react';

// Vue bindings (future)
import { useFhevm } from '@fhevm/sdk/vue';
```

### 3. Wagmi-Style API

Inspired by wagmi's excellent developer experience:

```typescript
// Familiar patterns
const { client, isInitialized, error } = useFhevm();
const { encrypt, isEncrypting } = useEncrypt();
const { decrypt, isDecrypting, result } = useDecrypt();
```

### 4. Layered Architecture

```
┌─────────────────────────────────────┐
│   Application Layer                 │  Your dApp
├─────────────────────────────────────┤
│   Framework Bindings (Optional)     │  React/Vue hooks
├─────────────────────────────────────┤
│   Core SDK (Framework-Agnostic)     │  FhevmClient, encrypt, decrypt
├─────────────────────────────────────┤
│   fhevmjs (Zama's Library)          │  Low-level FHE operations
├─────────────────────────────────────┤
│   FHEVM Network                     │  Blockchain layer
└─────────────────────────────────────┘
```

---

## Project Structure

### Monorepo Organization

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Universal SDK package
│       ├── src/
│       │   ├── core/           # Framework-agnostic core
│       │   ├── react/          # React bindings (optional)
│       │   └── utils/          # Shared utilities
│       └── package.json
│
├── examples/
│   ├── nextjs-anonymous-court/ # Next.js example
│   └── anonymous-court-investigation/ # React + Vite example
│
├── docs/                       # Documentation
└── package.json                # Workspace root
```

### SDK Internal Structure

```
packages/fhevm-sdk/src/
├── core/                       # Framework-agnostic core
│   ├── FhevmClient.ts          # Main client class
│   ├── encryption.ts           # Encryption utilities
│   ├── decryption.ts           # Decryption utilities
│   ├── types.ts                # TypeScript types
│   └── constants.ts            # Constants & config
│
├── react/                      # React bindings (optional)
│   ├── Provider.tsx            # Context provider
│   ├── useFhevm.ts             # Main hook
│   ├── useEncrypt.ts           # Encryption hook
│   └── useDecrypt.ts           # Decryption hook
│
├── utils/                      # Utilities
│   ├── helpers.ts              # Helper functions
│   └── validation.ts           # Input validation
│
└── index.ts                    # Main export
```

---

## Core Components

### 1. FhevmClient

The main client class that manages FHE operations.

**Responsibilities:**
- Initialize fhevmjs instance
- Fetch and store public key
- Manage client state
- Provide access to FHE operations

**Key Design Decisions:**
- Singleton pattern per configuration
- Lazy initialization (call `init()` when needed)
- Immutable configuration
- Thread-safe state management

```typescript
export class FhevmClient {
  private config: FhevmClientConfig;
  private instance: FhevmjsInstance | null = null;
  private publicKey: string | null = null;

  constructor(config: FhevmClientConfig);
  async init(): Promise<void>;
  getInstance(): FhevmjsInstance;
  getPublicKey(): string;
  isInitialized(): boolean;
}
```

### 2. Encryption Module

Provides type-safe encryption for different data types.

**Key Features:**
- Type-specific functions (`encryptUint8`, `encryptUint32`, etc.)
- Automatic range validation
- Support for all FHEVM types
- Batch operations (future)

**Design Pattern:**
- Each function is a thin wrapper around a base `encryptValue()` function
- Validation before encryption
- Consistent error messages
- Return type: `EncryptedInput`

```typescript
async function encryptValue(
  client: FhevmClient,
  params: EncryptionParams,
  type: EncryptionType
): Promise<EncryptedInput>
```

### 3. Decryption Module

Handles three types of decryption:

1. **User Decryption** (EIP-712 signed)
2. **Public Decryption** (no signature)
3. **Batch Decryption** (multiple values)

**Key Features:**
- EIP-712 signature integration
- Gateway communication
- Type-safe results
- Comprehensive error handling

**Design Pattern:**
- Consistent return type: `DecryptionResult<T>`
- Success/failure indication
- Optional error messages

### 4. React Bindings

Optional React-specific features.

**Components:**
- `FhevmProvider` - Context provider for client state
- `useFhevm` - Access client and state
- `useEncrypt` - Encryption with state management
- `useDecrypt` - Decryption with callbacks

**Key Features:**
- Context-based state sharing
- Automatic initialization
- Loading states
- Error boundaries support

---

## Data Flow

### Encryption Flow

```
User Input
    ↓
Validation (SDK)
    ↓
Create Encrypted Input (fhevmjs)
    ↓
Add Typed Value (fhevmjs)
    ↓
Encrypt (fhevmjs)
    ↓
Return EncryptedInput
    ↓
Use in Contract Call (Application)
    ↓
Submit to FHEVM Network
```

### Decryption Flow

```
Get Encrypted Handle (from contract)
    ↓
Create EIP-712 Signature (SDK)
    ↓
User Signs (ethers/wallet)
    ↓
Send to Gateway (SDK)
    ↓
Gateway Decrypts (FHEVM Network)
    ↓
Return DecryptionResult
    ↓
Display to User (Application)
```

### React Hook Flow

```
Component Mount
    ↓
FhevmProvider Initializes Client
    ↓
Context Available
    ↓
Hooks Access Context
    ↓
User Action (encrypt/decrypt)
    ↓
Hook Updates State
    ↓
Component Re-renders
    ↓
UI Updates
```

---

## Framework Integration

### React Integration

```typescript
// 1. Wrap app with provider
<FhevmProvider config={...}>
  <App />
</FhevmProvider>

// 2. Use hooks in components
function MyComponent() {
  const { client } = useFhevm();
  const { encrypt } = useEncrypt();

  // Use in event handlers
}
```

### Next.js Integration

```typescript
// app/layout.tsx - App Router
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider config={...}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

### Node.js Integration

```typescript
// Direct client usage
import { createFhevmClient, encryptUint32 } from '@fhevm/sdk';

const client = await createFhevmClient(config);
const encrypted = await encryptUint32(client, params);
```

### Vue Integration (Future)

```typescript
// Planned architecture
import { createFhevm } from '@fhevm/sdk/vue';

const fhevm = createFhevm(config);
app.use(fhevm);

// In components
const { client } = useFhevm();
```

---

## Security Model

### Client-Side Security

1. **Public Key Verification**
   - Fetch from trusted gateway
   - Verify against known networks
   - Cache for performance

2. **Input Validation**
   - Range checks before encryption
   - Type validation
   - Address validation

3. **Error Handling**
   - No sensitive data in errors
   - Generic error messages
   - Detailed logs (dev mode only)

### Encryption Security

1. **Homomorphic Encryption**
   - Uses fhevmjs (Zama's library)
   - TFHE scheme
   - Quantum-resistant

2. **Key Management**
   - Public key from network
   - No private keys in SDK
   - Keys handled by FHEVM

3. **Data Privacy**
   - All sensitive data encrypted
   - No plaintext transmission
   - Encrypted state on-chain

### Decryption Security

1. **User Decryption**
   - Requires EIP-712 signature
   - User must authorize
   - Non-repudiation

2. **Access Control**
   - Smart contract enforces permissions
   - Gateway validates signatures
   - Time-locked access

3. **Gateway Security**
   - Trusted gateway only
   - HTTPS required
   - Rate limiting

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - Initialize client only when needed
   - Delay fhevmjs import
   - Code splitting for React bindings

2. **Caching**
   - Cache public key
   - Reuse client instances
   - Memoize hook results

3. **Batch Operations**
   - Batch multiple encryptions
   - Batch decryptions
   - Reduce network calls

4. **Tree Shaking**
   - ESM exports
   - Separate entry points
   - No side effects

### Bundle Size

```
Core SDK:        ~50KB (gzipped)
React Bindings:  ~5KB (gzipped)
fhevmjs:         ~500KB (external)
Total:           ~55KB (excluding fhevmjs)
```

---

## Extensibility

### Adding New Encryption Types

```typescript
// 1. Add type to constants
export const ENCRYPTION_TYPES = {
  // existing types...
  bytes: { /* validation */ },
};

// 2. Add encryption function
export async function encryptBytes(
  client: FhevmClient,
  params: EncryptionParams
): Promise<EncryptedInput> {
  // implementation
}
```

### Adding Framework Bindings

```typescript
// 1. Create new directory
packages/fhevm-sdk/src/vue/

// 2. Implement framework-specific code
export function useFhevm() {
  // Vue composition API
}

// 3. Export from separate entry point
// packages/fhevm-sdk/vue.ts
export * from './src/vue';
```

### Adding Custom Hooks

```typescript
// Build on top of existing hooks
export function useEncryptedStorage() {
  const { encrypt } = useEncrypt();
  const { decrypt } = useDecrypt();

  // Custom logic combining both
}
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('FhevmClient', () => {
  it('should initialize correctly', async () => {
    const client = await createFhevmClient(config);
    expect(client.isInitialized()).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('Encryption flow', () => {
  it('should encrypt and use in contract', async () => {
    const encrypted = await encryptUint32(client, params);
    await contract.submitValue(encrypted.data);
    // Verify on-chain
  });
});
```

### E2E Tests

```typescript
describe('Full workflow', () => {
  it('should encrypt, submit, and decrypt', async () => {
    // Complete user flow
  });
});
```

---

## Future Architecture

### Planned Enhancements

1. **Multi-Framework Support**
   - Vue bindings
   - Svelte bindings
   - Angular bindings

2. **Advanced Features**
   - Batch operations
   - Transaction builders
   - Contract ABI integration
   - Automatic type inference

3. **Developer Tools**
   - CLI scaffolding
   - Debug utilities
   - Browser extensions
   - VS Code extension

4. **Performance**
   - WebAssembly optimization
   - Worker thread support
   - Streaming encryption
   - Progressive loading

---

## Architectural Decisions

### Why Framework-Agnostic Core?

**Decision:** Keep core SDK framework-independent

**Rationale:**
- Maximum flexibility
- Smaller bundle size
- Easier testing
- Wider adoption
- Future-proof

### Why Optional React Bindings?

**Decision:** Separate React code into `/react` export

**Rationale:**
- Don't force React dependency
- Better tree-shaking
- Clear separation
- Multiple entry points

### Why Wagmi-Style API?

**Decision:** Use hooks similar to wagmi

**Rationale:**
- Familiar to Web3 developers
- Proven patterns
- Great DX
- Easy migration

### Why TypeScript First?

**Decision:** Write everything in TypeScript

**Rationale:**
- Type safety
- Better IDE support
- Self-documenting
- Catch errors early

---

## Contributing

When contributing to the architecture:

1. **Maintain framework agnosticism** in core
2. **Add framework bindings separately**
3. **Follow existing patterns**
4. **Update documentation**
5. **Add tests**

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

---

## References

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [fhevmjs Library](https://github.com/zama-ai/fhevmjs)
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)
- [Wagmi Documentation](https://wagmi.sh/)
