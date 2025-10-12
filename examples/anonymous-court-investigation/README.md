# Anonymous Court Investigation System

Example demonstrating @fhevm/sdk integration with a complete Hardhat project.

## Features

- Smart contract with FHE encryption
- Deployment scripts using @fhevm/sdk
- Test suite with SDK integration
- Interactive CLI
- Complete workflow simulation

## Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Sepolia
npm run deploy:sepolia

# Interact with contract
npm run interact:sepolia
```

## SDK Integration

This example shows how to use @fhevm/sdk in a Hardhat environment:

```typescript
import { createFhevmClient, encryptUint32 } from '@fhevm/sdk';

// Initialize client
const client = await createFhevmClient({
  network: hre.network.config,
});

// Encrypt investigation ID
const encrypted = await encryptUint32(client, {
  value: caseId,
  contractAddress: contract.address,
});

// Submit to contract
await contract.startInvestigation(encrypted.data);
```

## Contract

The `AnonymousCourtInvestigation.sol` contract demonstrates:
- Encrypted case IDs
- Anonymous witness testimonies
- Confidential evidence submission
- Role-based access control with FHE

## Documentation

See main README for complete SDK documentation.
