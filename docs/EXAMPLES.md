# 📚 FHEVM SDK Examples

Complete usage examples for the Universal FHEVM SDK across different frameworks.

## Table of Contents

- [Quick Start](#quick-start)
- [Core SDK Usage](#core-sdk-usage)
- [React Integration](#react-integration)
- [Next.js Application](#nextjs-application)
- [Node.js Scripts](#nodejs-scripts)
- [Contract Integration](#contract-integration)
- [Advanced Patterns](#advanced-patterns)

---

## Quick Start

### Installation

```bash
npm install @fhevm/sdk ethers
```

### Basic Example (< 10 Lines)

```typescript
import { createFhevmClient, encryptUint32 } from '@fhevm/sdk';

const client = await createFhevmClient({
  network: { chainId: 11155111, name: 'Sepolia', rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY' }
});

const encrypted = await encryptUint32(client, {
  value: 42,
  contractAddress: '0x...'
});

console.log('Encrypted data:', encrypted.data);
```

---

## Core SDK Usage

### 1. Client Initialization

```typescript
import { createFhevmClient, SUPPORTED_NETWORKS } from '@fhevm/sdk';

// Option 1: Use predefined network
const client1 = await createFhevmClient({
  network: SUPPORTED_NETWORKS.sepolia
});

// Option 2: Custom network
const client2 = await createFhevmClient({
  network: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
  },
  publicKey: '0x...', // Optional, will be fetched if not provided
});

// Check initialization
if (client.isInitialized()) {
  console.log('Client ready!');
  console.log('Public Key:', client.getPublicKey());
}
```

### 2. Encryption Examples

```typescript
import {
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptBool,
  encryptAddress,
} from '@fhevm/sdk';

const contractAddress = '0x1234...';

// Encrypt uint8 (0-255)
const enc8 = await encryptUint8(client, {
  value: 42,
  contractAddress,
});

// Encrypt uint16 (0-65535)
const enc16 = await encryptUint16(client, {
  value: 1000,
  contractAddress,
});

// Encrypt uint32 (0-4294967295)
const enc32 = await encryptUint32(client, {
  value: 1000000,
  contractAddress,
});

// Encrypt uint64 (big numbers)
const enc64 = await encryptUint64(client, {
  value: BigInt('9999999999'),
  contractAddress,
});

// Encrypt boolean
const encBool = await encryptBool(client, {
  value: true,
  contractAddress,
});

// Encrypt address
const encAddr = await encryptAddress(client, {
  value: '0xabcd...',
  contractAddress,
});
```

### 3. Decryption Examples

```typescript
import { userDecrypt, publicDecrypt, batchDecrypt } from '@fhevm/sdk';
import { ethers } from 'ethers';

// Get signer
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const userAddress = await signer.getAddress();

// User decryption (requires EIP-712 signature)
const result = await userDecrypt({
  handle: '0x...',
  contractAddress: '0x...',
  signer,
  userAddress,
});

if (result.success) {
  console.log('Decrypted value:', result.value);
} else {
  console.error('Decryption failed:', result.error);
}

// Public decryption (no signature needed)
const publicResult = await publicDecrypt({
  handle: '0x...',
  contractAddress: '0x...',
  provider,
});

// Batch decryption (more efficient)
const batchResult = await batchDecrypt({
  handles: ['0x...', '0x...', '0x...'],
  contractAddress: '0x...',
  signer,
  userAddress,
});

batchResult.value.forEach((val, i) => {
  console.log(`Value ${i}:`, val);
});
```

---

## React Integration

### Setup Provider

```typescript
// app/layout.tsx or _app.tsx
import { FhevmProvider } from '@fhevm/sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider
          config={{
            network: {
              chainId: 11155111,
              name: 'Sepolia',
              rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
            },
          }}
        >
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

### Use Hooks

```typescript
// components/EncryptInput.tsx
'use client';

import { useState } from 'react';
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';

export function EncryptInput() {
  const { client, isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();
  const [value, setValue] = useState('');
  const [encryptedData, setEncryptedData] = useState('');

  const handleEncrypt = async () => {
    if (!isInitialized) return;

    const result = await encrypt({
      value: parseInt(value),
      type: 'uint32',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    });

    setEncryptedData(result.data);
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
      />
      <button onClick={handleEncrypt} disabled={isEncrypting || !isInitialized}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>
      {encryptedData && (
        <div>
          <p>Encrypted: {encryptedData.slice(0, 20)}...</p>
        </div>
      )}
    </div>
  );
}
```

```typescript
// components/DecryptValue.tsx
'use client';

import { useState } from 'react';
import { useDecrypt } from '@fhevm/sdk/react';
import { useSigner } from './useSigner'; // Your signer hook

export function DecryptValue({ handle }: { handle: string }) {
  const { decrypt, isDecrypting, result } = useDecrypt();
  const signer = useSigner();

  const handleDecrypt = async () => {
    await decrypt({
      handle,
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      signer,
      userAddress: await signer.getAddress(),
    });
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
      </button>
      {result && result.success && (
        <div>
          <p>Decrypted Value: {result.value}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Next.js Application

### Complete Example: Anonymous Voting

```typescript
// app/page.tsx
'use client';

import { useState } from 'react';
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';
import { useContract } from './hooks/useContract';

export default function VotingPage() {
  const { client, isInitialized } = useFhevm();
  const { encrypt } = useEncrypt();
  const { decrypt } = useDecrypt();
  const contract = useContract();

  const [vote, setVote] = useState<number>(0);
  const [totalVotes, setTotalVotes] = useState<number | null>(null);

  // Submit encrypted vote
  const handleVote = async () => {
    const encrypted = await encrypt({
      value: vote,
      type: 'uint8',
      contractAddress: contract.address,
    });

    // Send to contract
    const tx = await contract.castVote(encrypted.data);
    await tx.wait();

    console.log('Vote submitted!');
  };

  // Decrypt total votes (admin only)
  const handleGetResults = async () => {
    const handle = await contract.getTotalVotesHandle();

    const result = await decrypt({
      handle,
      contractAddress: contract.address,
    });

    if (result.success) {
      setTotalVotes(result.value);
    }
  };

  return (
    <div>
      <h1>Anonymous Voting</h1>

      {/* Vote Selection */}
      <div>
        <label>Your Vote (0-10):</label>
        <input
          type="number"
          min="0"
          max="10"
          value={vote}
          onChange={(e) => setVote(parseInt(e.target.value))}
        />
        <button onClick={handleVote} disabled={!isInitialized}>
          Submit Vote
        </button>
      </div>

      {/* Results */}
      <div>
        <button onClick={handleGetResults}>Get Results</button>
        {totalVotes !== null && <p>Total Votes: {totalVotes}</p>}
      </div>
    </div>
  );
}
```

---

## Node.js Scripts

### Standalone Script Example

```typescript
// scripts/encrypt-data.ts
import { createFhevmClient, encryptUint32 } from '@fhevm/sdk';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Initialize client
  const client = await createFhevmClient({
    network: {
      chainId: 11155111,
      name: 'Sepolia',
      rpcUrl: process.env.RPC_URL!,
    },
  });

  console.log('Client initialized');
  console.log('Public Key:', client.getPublicKey());

  // Encrypt value
  const encrypted = await encryptUint32(client, {
    value: 12345,
    contractAddress: process.env.CONTRACT_ADDRESS!,
  });

  console.log('Encrypted data:', encrypted.data);
  console.log('Type:', encrypted.type);

  // Use in contract interaction
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    ['function submitData(bytes calldata encryptedData)'],
    wallet
  );

  const tx = await contract.submitData(encrypted.data);
  console.log('Transaction hash:', tx.hash);

  await tx.wait();
  console.log('Transaction confirmed!');
}

main().catch(console.error);
```

---

## Contract Integration

### Smart Contract Example

```solidity
// contracts/PrivateVoting.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PrivateVoting is Ownable {
    // Encrypted votes
    euint8[] private votes;
    mapping(address => bool) public hasVoted;

    event VoteCast(address indexed voter);

    function castVote(bytes calldata encryptedVote) external {
        require(!hasVoted[msg.sender], "Already voted");

        // Decrypt and store vote
        euint8 vote = TFHE.asEuint8(encryptedVote);
        votes.push(vote);
        hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender);
    }

    function getTotalVotes() external view onlyOwner returns (euint32) {
        euint32 total = TFHE.asEuint32(0);
        for (uint i = 0; i < votes.length; i++) {
            total = TFHE.add(total, TFHE.asEuint32(votes[i]));
        }
        return total;
    }
}
```

### Frontend Integration

```typescript
// hooks/useVotingContract.ts
import { useContract, useSigner } from 'wagmi';
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';
import VotingABI from '../contracts/PrivateVoting.json';

export function useVotingContract() {
  const { client } = useFhevm();
  const { encrypt } = useEncrypt();
  const signer = useSigner();

  const contract = useContract({
    address: process.env.NEXT_PUBLIC_VOTING_CONTRACT,
    abi: VotingABI,
    signerOrProvider: signer,
  });

  const castVote = async (vote: number) => {
    // Encrypt vote
    const encrypted = await encrypt({
      value: vote,
      type: 'uint8',
      contractAddress: contract.address,
    });

    // Submit to contract
    const tx = await contract.castVote(encrypted.data);
    return tx.wait();
  };

  return { contract, castVote };
}
```

---

## Advanced Patterns

### 1. Batch Processing

```typescript
import { batchDecrypt } from '@fhevm/sdk';

async function decryptAll(handles: string[]) {
  const result = await batchDecrypt({
    handles,
    contractAddress: '0x...',
    signer,
    userAddress: await signer.getAddress(),
  });

  if (result.success) {
    return result.value;
  } else {
    throw new Error(result.error);
  }
}
```

### 2. Error Handling

```typescript
import { encryptUint32, parseError } from '@fhevm/sdk';

try {
  const encrypted = await encryptUint32(client, {
    value: 42,
    contractAddress: '0x...',
  });
} catch (error) {
  const message = parseError(error);
  console.error('Encryption failed:', message);
}
```

### 3. Validation

```typescript
import { validateEncryptionParams, assertValid } from '@fhevm/sdk';

const validation = validateEncryptionParams(42, 'uint8', '0x...');

if (!validation.valid) {
  console.error('Invalid parameters:', validation.error);
}

// Or throw if invalid
assertValid(validation);
```

### 4. Custom Network

```typescript
import { createFhevmClient } from '@fhevm/sdk';

const client = await createFhevmClient({
  network: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545',
  },
  publicKey: '0x...', // Provide your own public key
});
```

---

## Best Practices

### 1. Client Initialization

✅ **Do:**
- Initialize client once and reuse
- Use global client for simple apps
- Provide configuration via environment variables

❌ **Don't:**
- Create new client for every operation
- Hard-code RPC URLs or contract addresses
- Initialize without error handling

### 2. Encryption

✅ **Do:**
- Validate values before encryption
- Use appropriate types (uint8 for 0-255, etc.)
- Cache encrypted values when possible

❌ **Don't:**
- Encrypt values outside valid range
- Re-encrypt the same value repeatedly
- Ignore encryption errors

### 3. Decryption

✅ **Do:**
- Always check `result.success` before using value
- Handle user signature rejection gracefully
- Use batch decryption for multiple values

❌ **Don't:**
- Assume decryption always succeeds
- Ignore error messages
- Decrypt same value multiple times

### 4. React Hooks

✅ **Do:**
- Wrap app in `FhevmProvider`
- Check `isInitialized` before operations
- Handle loading states

❌ **Don't:**
- Use hooks outside provider
- Ignore initialization errors
- Block UI during operations

---

## Troubleshooting

### Common Issues

**Issue: Client not initialized**
```typescript
// ❌ Wrong
const encrypted = await encryptUint32(client, ...);

// ✅ Correct
if (client.isInitialized()) {
  const encrypted = await encryptUint32(client, ...);
}
```

**Issue: Value out of range**
```typescript
// ❌ Wrong
await encryptUint8(client, { value: 300, ... }); // > 255

// ✅ Correct
await encryptUint16(client, { value: 300, ... });
```

**Issue: Invalid contract address**
```typescript
// ❌ Wrong
await encryptUint32(client, { value: 42, contractAddress: '0x123' });

// ✅ Correct
await encryptUint32(client, { value: 42, contractAddress: '0x1234...' });
```

---

## Next Steps

1. **Explore Examples**: Check `/examples` directory
2. **Read API Docs**: See `docs/API.md`
3. **Join Discord**: https://discord.gg/zama
4. **Report Issues**: GitHub Issues

---

**Need Help?** Check our [GitHub Discussions](https://github.com/your-repo/discussions) or [Zama Discord](https://discord.gg/zama).

