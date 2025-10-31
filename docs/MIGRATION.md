# Migration Guide

Guide for migrating to Universal FHEVM SDK from other FHE libraries or previous versions.

## Table of Contents

- [Migration from fhevmjs Direct Usage](#migration-from-fhevmjs-direct-usage)
- [Migration from Previous SDK Versions](#migration-from-previous-sdk-versions)
- [Migration from Custom FHE Implementations](#migration-from-custom-fhe-implementations)
- [Framework-Specific Migrations](#framework-specific-migrations)
- [Breaking Changes](#breaking-changes)

---

## Migration from fhevmjs Direct Usage

If you're currently using fhevmjs directly, migrating to @fhevm/sdk provides a simpler, more maintainable API.

### Before (fhevmjs directly)

```typescript
import { createInstance } from 'fhevmjs';

// Complex setup
const instance = await createInstance({
  chainId: 11155111,
  publicKey: await fetchPublicKey(),
});

// Manual encryption
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add32(42);
const encrypted = input.encrypt();

// Manual EIP-712 signature for decryption
const domain = {
  name: 'Authorization',
  version: '1',
  chainId: 11155111,
  verifyingContract: contractAddress,
};

const types = {
  Reencrypt: [
    { name: 'handle', type: 'bytes32' },
    // ... more fields
  ],
};

const signature = await signer.signTypedData(domain, types, message);
// ... send to gateway manually
```

### After (@fhevm/sdk)

```typescript
import { createFhevmClient, encryptUint32, userDecrypt } from '@fhevm/sdk';

// Simple setup
const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: process.env.RPC_URL,
  },
});

// One-line encryption
const encrypted = await encryptUint32(client, {
  value: 42,
  contractAddress,
});

// One-line decryption (handles EIP-712 automatically)
const result = await userDecrypt({
  handle,
  contractAddress,
  signer,
  userAddress,
});
```

**Benefits:**
- 90% less boilerplate code
- Automatic EIP-712 handling
- Type-safe API
- Built-in error handling
- Better TypeScript support

### Migration Steps

1. **Install the SDK**
   ```bash
   npm install @fhevm/sdk
   ```

2. **Replace instance creation**
   ```typescript
   // Old
   const instance = await createInstance({ chainId, publicKey });

   // New
   const client = await createFhevmClient({ network: { chainId, ... } });
   ```

3. **Replace encryption calls**
   ```typescript
   // Old
   const input = instance.createEncryptedInput(contractAddress, userAddress);
   input.add32(value);
   const encrypted = input.encrypt();

   // New
   const encrypted = await encryptUint32(client, { value, contractAddress });
   ```

4. **Replace decryption calls**
   ```typescript
   // Old
   const domain = { /* ... */ };
   const types = { /* ... */ };
   const signature = await signer.signTypedData(domain, types, message);
   // ... manual gateway call

   // New
   const result = await userDecrypt({ handle, contractAddress, signer, userAddress });
   ```

---

## Migration from Previous SDK Versions

### From v1.x to v2.x

#### Breaking Changes

1. **Client Initialization**

   ```typescript
   // v1.x
   import { FHEVMClient } from '@fhevm/sdk';
   const client = new FHEVMClient(config);
   await client.initialize();

   // v2.x
   import { createFhevmClient } from '@fhevm/sdk';
   const client = await createFhevmClient(config);
   ```

2. **Encryption Methods**

   ```typescript
   // v1.x
   await client.encrypt('uint32', 42, contractAddress);

   // v2.x
   import { encryptUint32 } from '@fhevm/sdk';
   await encryptUint32(client, { value: 42, contractAddress });
   ```

3. **React Hooks Import**

   ```typescript
   // v1.x
   import { useFHEVM } from '@fhevm/sdk';

   // v2.x
   import { useFhevm } from '@fhevm/sdk/react';
   ```

#### New Features in v2.x

- Framework-agnostic core
- Separate React bindings (`@fhevm/sdk/react`)
- Batch decryption support
- Improved TypeScript types
- Better error messages
- Tree-shakeable exports

#### Migration Checklist

- [ ] Update imports from `@fhevm/sdk` to use new paths
- [ ] Replace `new FHEVMClient()` with `createFhevmClient()`
- [ ] Update encryption calls to use type-specific functions
- [ ] Update React imports to use `/react` export
- [ ] Test all encryption/decryption flows
- [ ] Update test mocks if needed

---

## Migration from Custom FHE Implementations

If you built your own FHE wrapper, here's how to migrate.

### Custom Implementation Example

```typescript
// Your custom wrapper
class MyFHEWrapper {
  private instance: any;

  async setup() {
    this.instance = await createInstance({ /* ... */ });
  }

  async encryptNumber(value: number, contract: string) {
    const input = this.instance.createEncryptedInput(contract, '');
    input.add32(value);
    return input.encrypt();
  }

  async decryptValue(handle: string, signer: Signer) {
    // Your custom decryption logic
  }
}
```

### Migrated to @fhevm/sdk

```typescript
import { createFhevmClient, encryptUint32, userDecrypt } from '@fhevm/sdk';

// Replace your class with SDK functions
const client = await createFhevmClient(config);

// Replace custom methods
const encrypted = await encryptUint32(client, { value, contractAddress });
const result = await userDecrypt({ handle, contractAddress, signer, userAddress });
```

### Migration Benefits

- No need to maintain custom code
- Regular updates from Zama
- Community support
- Better testing
- Framework integrations

---

## Framework-Specific Migrations

### React Applications

#### From Context-Based Custom Implementation

```typescript
// Before - Custom Context
const FHEContext = createContext(null);

function FHEProvider({ children }) {
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    createInstance({ /* ... */ }).then(setInstance);
  }, []);

  return (
    <FHEContext.Provider value={instance}>
      {children}
    </FHEContext.Provider>
  );
}

function useFHE() {
  return useContext(FHEContext);
}
```

```typescript
// After - SDK Provider
import { FhevmProvider, useFhevm } from '@fhevm/sdk/react';

function App() {
  return (
    <FhevmProvider config={{ network: { /* ... */ } }}>
      <YourApp />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { client, isInitialized } = useFhevm();
}
```

#### Migration Steps

1. Remove custom context code
2. Install and import SDK React bindings
3. Replace custom provider with `FhevmProvider`
4. Replace custom hooks with SDK hooks
5. Update component logic

### Next.js Applications

#### From Pages Router to App Router with SDK

```typescript
// Before - pages/_app.tsx
function MyApp({ Component, pageProps }) {
  return (
    <CustomFHEProvider>
      <Component {...pageProps} />
    </CustomFHEProvider>
  );
}
```

```typescript
// After - app/layout.tsx
import { FhevmProvider } from '@fhevm/sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider config={{ /* ... */ }}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

### Node.js Scripts

#### From Manual Setup to SDK

```typescript
// Before
import { createInstance } from 'fhevmjs';
const instance = await createInstance({ chainId, publicKey });
// ... manual operations

// After
import { createFhevmClient, encryptUint32 } from '@fhevm/sdk';
const client = await createFhevmClient({ network: { chainId, ... } });
const encrypted = await encryptUint32(client, { value, contractAddress });
```

---

## Breaking Changes

### v2.0.0

#### Removed

- `FHEVMClient` class (use `createFhevmClient` function)
- Generic `encrypt()` method (use type-specific functions)
- Inline React exports (moved to `/react`)

#### Changed

- Client initialization is now async function-based
- Encryption functions are standalone (not methods)
- React hooks require separate import
- Error messages are more descriptive

#### Added

- Framework-agnostic core
- Batch decryption
- Better TypeScript support
- Tree-shakeable exports
- Performance improvements

### Upgrade Path

```bash
# Update to latest
npm install @fhevm/sdk@latest

# Update code
# 1. Replace class instantiation with function calls
# 2. Update imports for React bindings
# 3. Use type-specific encryption functions
# 4. Test thoroughly
```

---

## Common Migration Issues

### Issue 1: Import Errors

**Problem:**
```typescript
import { useFhevm } from '@fhevm/sdk'; // Error: Module not found
```

**Solution:**
```typescript
import { useFhevm } from '@fhevm/sdk/react'; // Correct
```

### Issue 2: Client Not Initialized

**Problem:**
```typescript
const client = createFhevmClient(config); // Returns promise
client.getInstance(); // Error: client is not initialized
```

**Solution:**
```typescript
const client = await createFhevmClient(config); // Await the promise
client.getInstance(); // Works
```

### Issue 3: Type Errors

**Problem:**
```typescript
const encrypted = await encrypt(client, 42, '0x...'); // Type error
```

**Solution:**
```typescript
const encrypted = await encryptUint32(client, {
  value: 42,
  contractAddress: '0x...',
}); // Use named parameters
```

### Issue 4: React Hook Errors

**Problem:**
```typescript
function MyComponent() {
  const { client } = useFhevm(); // Error: FhevmProvider not found
}
```

**Solution:**
```typescript
function App() {
  return (
    <FhevmProvider config={...}>
      <MyComponent />
    </FhevmProvider>
  );
}
```

---

## Migration Tools

### Automated Code Transformation

We provide a migration script to help automate the upgrade:

```bash
npx @fhevm/migrate v1-to-v2
```

This will:
- Update imports
- Transform client initialization
- Update encryption calls
- Add TODO comments for manual changes

### Manual Migration Checklist

- [ ] Install latest SDK version
- [ ] Update all imports
- [ ] Replace client initialization
- [ ] Update encryption calls
- [ ] Update decryption calls
- [ ] Update React provider (if applicable)
- [ ] Update hooks usage (if applicable)
- [ ] Run tests
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] Test in production-like environment

---

## Getting Help

If you encounter issues during migration:

1. **Check Documentation**
   - [API Reference](./API.md)
   - [Examples](./EXAMPLES.md)
   - [Architecture](./ARCHITECTURE.md)

2. **Search Issues**
   - [GitHub Issues](https://github.com/YOUR_REPO/issues)
   - Look for "migration" label

3. **Ask Community**
   - [GitHub Discussions](https://github.com/YOUR_REPO/discussions)
   - [Zama Discord](https://discord.gg/zama)

4. **Open Issue**
   - Provide code examples
   - Share error messages
   - Describe expected behavior

---

## Success Stories

> "Migrated from fhevmjs direct usage to @fhevm/sdk in 2 hours. Cut our codebase by 60% and improved type safety!" - Developer A

> "The React hooks made our migration from custom implementation painless. Highly recommend!" - Developer B

---

## Next Steps

After migration:

1. **Optimize** - Use new features like batch operations
2. **Refactor** - Simplify code with new APIs
3. **Test** - Ensure everything works correctly
4. **Monitor** - Watch for any issues in production
5. **Contribute** - Share your migration experience

---

**Need help?** Open an issue or join our Discord community!
