# 🚀 Deployment Guide

Complete guide for deploying FHEVM SDK examples and applications.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Deploy to Sepolia](#deploy-to-sepolia)
- [Deploy to Production](#deploy-to-production)
- [Video Demo](#video-demo)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
MetaMask or compatible wallet
Sepolia ETH (for testnet deployment)
```

### Environment Variables

Create `.env` file in project root:

```bash
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Deployment Account
PRIVATE_KEY=your_private_key_here
DEPLOYER_ADDRESS=0xYourAddress

# Contract Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Frontend Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xDeployedContractAddress
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_CHAIN_ID=11155111

# FHE Configuration (optional)
FHE_GATEWAY_URL=https://gateway.sepolia.zama.ai
FHE_PUBLIC_KEY=0x...
```

---

## Local Development

### 1. Install Dependencies

```bash
# Install all packages from root
npm run install:all

# Or install individually
cd packages/fhevm-sdk && npm install
cd examples/nextjs-anonymous-court && npm install
cd examples/anonymous-court-investigation && npm install
```

### 2. Build SDK

```bash
# Build from root
npm run build:sdk

# Or build from package directory
cd packages/fhevm-sdk
npm run build
```

### 3. Start Local Development

```bash
# Terminal 1: Start local Hardhat node
cd examples/anonymous-court-investigation
npx hardhat node

# Terminal 2: Deploy contracts locally
npm run deploy:localhost

# Terminal 3: Start Next.js frontend
cd examples/nextjs-anonymous-court
npm run dev
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Hardhat Node**: http://localhost:8545
- **Network**: Localhost (Chain ID: 31337)

---

## Deploy to Sepolia

### 1. Get Sepolia ETH

Get testnet ETH from faucets:

- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [PoW Sepolia Faucet](https://sepolia-faucet.pk910.de/)

### 2. Deploy Contracts

```bash
cd examples/anonymous-court-investigation

# Deploy to Sepolia
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia
```

**Expected Output:**
```
🚀 Starting deployment to Sepolia...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Deployment Configuration:
   Network: Sepolia (11155111)
   Deployer: 0xYourAddress
   Balance: 0.5 SepoliaETH

🔨 Deploying AnonymousCourtInvestigation...
   ⏳ Waiting for confirmation...
   ✅ Contract deployed!

📋 Deployment Summary:
   Contract Address: 0x1234567890abcdef...
   Transaction Hash: 0xabcdef...
   Gas Used: 2,500,000
   Deployment Cost: 0.025 ETH

🔗 Etherscan: https://sepolia.etherscan.io/address/0x1234...

Deployment info saved to: deployments/sepolia/deployment-info.json
```

### 3. Update Frontend Configuration

Update `.env` in Next.js example:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef...  # From deployment
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_CHAIN_ID=11155111
```

### 4. Deploy Frontend to Vercel

```bash
cd examples/nextjs-anonymous-court

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy

# Production deployment
vercel --prod
```

**Vercel Configuration:**

Create `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_CONTRACT_ADDRESS": "@contract-address",
    "NEXT_PUBLIC_RPC_URL": "@rpc-url",
    "NEXT_PUBLIC_CHAIN_ID": "11155111"
  }
}
```

### 5. Verify Deployment

✅ **Contract Verification:**
- Visit: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
- Check: Contract code verified
- Test: Read/write functions working

✅ **Frontend Verification:**
- Visit: https://your-app.vercel.app
- Check: Connects to MetaMask
- Test: Encryption/decryption working
- Verify: Contract interactions successful

---

## Deploy to Production

### 1. Mainnet Deployment

⚠️ **WARNING**: Mainnet deployment requires real ETH. Test thoroughly on Sepolia first!

```bash
# Deploy to Ethereum Mainnet
NETWORK=mainnet npm run deploy:mainnet

# Verify on Etherscan
npm run verify:mainnet
```

### 2. Security Checklist

Before mainnet deployment:

- [ ] Smart contract audited by professional firm
- [ ] All tests passing (100% coverage)
- [ ] Gas optimization complete
- [ ] Access control verified
- [ ] Emergency pause mechanism tested
- [ ] Admin keys secured (hardware wallet)
- [ ] Rate limiting configured
- [ ] DoS protection enabled
- [ ] Frontend security review complete
- [ ] API keys rotated

### 3. Monitoring

Set up monitoring:

```bash
# Tenderly
tenderly monitoring add --address YOUR_CONTRACT_ADDRESS

# Defender
defender-admin create-monitor --address YOUR_CONTRACT_ADDRESS
```

### 4. Incident Response

Prepare incident response plan:

1. **Detection** - Monitor for unusual activity
2. **Pause** - Emergency pause contract if needed
3. **Assess** - Analyze issue
4. **Fix** - Deploy patch if required
5. **Resume** - Unpause after verification

---

## Video Demo

### demo.mp4 Contents

The video demonstration includes:

**Part 1: Setup (0:00 - 2:00)**
- Clone repository
- Install dependencies
- Configure environment variables
- Build SDK

**Part 2: SDK Usage (2:00 - 5:00)**
- Initialize FHEVM client
- Encrypt values (uint8, uint32, bool)
- Decrypt with EIP-712 signature
- Batch operations

**Part 3: Next.js Application (5:00 - 8:00)**
- Start development server
- Connect MetaMask
- Submit encrypted evidence
- Decrypt investigation data
- View real-time updates

**Part 4: Smart Contract Deployment (8:00 - 10:00)**
- Deploy to Sepolia
- Verify on Etherscan
- Interact with deployed contract
- Frontend integration

**Part 5: Architecture & Design (10:00 - 12:00)**
- Framework-agnostic approach
- Wagmi-style API design
- TypeScript integration
- Future roadmap

### Creating Your Own Demo

```bash
# Record screen
# Mac: QuickTime Player > File > New Screen Recording
# Windows: Xbox Game Bar (Win + G)
# Linux: OBS Studio

# Recommended structure:
1. Show repository structure
2. Run `npm run install:all`
3. Build SDK: `npm run build:sdk`
4. Start local development
5. Deploy to Sepolia
6. Show frontend interaction
7. Explain design decisions
```

---

## Deployment URLs

### Live Deployments

**Smart Contracts (Sepolia):**
- Anonymous Court Investigation: https://sepolia.etherscan.io/address/0x...
- Deployment Transaction: https://sepolia.etherscan.io/tx/0x...

**Frontend Applications:**
- Next.js Demo: https://fhevm-nextjs-demo.vercel.app
- Documentation Site: https://fhevm-sdk-docs.vercel.app

**NPM Package:**
- Package: https://www.npmjs.com/package/@fhevm/sdk
- Downloads: https://npm-stat.com/charts.html?package=@fhevm/sdk

### Repository Links

- **GitHub**: https://github.com/your-username/fhevm-react-template
- **Issues**: https://github.com/your-username/fhevm-react-template/issues
- **Discussions**: https://github.com/your-username/fhevm-react-template/discussions

---

## Troubleshooting

### Common Issues

#### Issue: Deployment fails with "insufficient funds"

```bash
# Solution: Check balance
npm run interact:sepolia
# Select: View Account Balance

# Get more Sepolia ETH from faucets
```

#### Issue: Contract verification fails

```bash
# Solution: Manually verify
npx hardhat verify --network sepolia DEPLOYED_ADDRESS "CONSTRUCTOR_ARGS"

# Example:
npx hardhat verify --network sepolia 0x1234... "0xAdminAddress"
```

#### Issue: Frontend can't connect to contract

```bash
# Solution: Check environment variables
cat .env | grep CONTRACT_ADDRESS

# Verify contract address
curl https://sepolia.etherscan.io/api?module=contract&action=getabi&address=YOUR_ADDRESS

# Check network
# MetaMask should be on Sepolia (Chain ID: 11155111)
```

#### Issue: Encryption fails

```bash
# Solution: Verify client initialization
const { client, isInitialized } = useFhevm();
console.log('Initialized:', isInitialized);

# Check public key
console.log('Public Key:', client.getPublicKey());

# Verify contract address
console.log('Contract:', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
```

#### Issue: Decryption requires signature but MetaMask doesn't prompt

```bash
# Solution: Check signer connection
const signer = await provider.getSigner();
console.log('Signer address:', await signer.getAddress());

# Verify EIP-712 support
if (typeof window.ethereum.request === 'function') {
  console.log('EIP-712 supported');
}

# Try manual signature request
await signer.signTypedData(domain, types, message);
```

---

## Performance Optimization

### Gas Optimization

```bash
# Run gas reporter
REPORT_GAS=true npm test

# Review gas-report.txt
cat gas-report.txt

# Optimize contract
# - Pack storage variables
# - Use events for historical data
# - Batch operations when possible
```

### Frontend Optimization

```bash
# Build optimized production bundle
npm run build

# Analyze bundle size
npm run analyze

# Enable Next.js optimizations
# - Static site generation (SSG)
# - Incremental static regeneration (ISR)
# - Image optimization
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - run: npm ci
      - run: npm run deploy:sepolia
        env:
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
          SEPOLIA_RPC_URL: ${{ secrets.SEPOLIA_RPC_URL }}

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-contracts
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Next Steps

1. ✅ Test locally
2. ✅ Deploy to Sepolia
3. ✅ Verify contracts
4. ✅ Deploy frontend
5. ✅ Monitor deployment
6. ✅ Record demo video
7. ✅ Share with community

---

**Need Help?**

- 📖 Documentation: [docs/](./docs/)
- 💬 Discord: https://discord.gg/zama
- 🐛 Issues: https://github.com/your-repo/issues
- 📧 Email: support@your-domain.com

---

**Deployment Checklist:**

- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] SDK built successfully
- [ ] Contracts compiled
- [ ] Tests passing
- [ ] Deployed to Sepolia
- [ ] Contracts verified on Etherscan
- [ ] Frontend deployed to Vercel
- [ ] Demo video recorded
- [ ] Documentation updated
- [ ] Monitoring configured
- [ ] Team notified

---

**Version**: 2.0.0
**Last Updated**: 2025-10-26
**Status**: Production Ready

