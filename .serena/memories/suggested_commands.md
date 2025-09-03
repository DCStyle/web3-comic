# Essential Commands for Web3 Comic Platform

## Development Commands
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Code linting
npm run lint
```

## Database Operations
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio for database inspection
npm run db:studio
```

## Smart Contract Development
```bash
# Compile smart contracts
npm run hardhat:compile

# Run smart contract tests
npm run hardhat:test

# Deploy to local Hardhat network
npm run hardhat:deploy:local

# Deploy to Sepolia testnet
npm run hardhat:deploy:sepolia

# Copy ABI files after compilation
npm run abi:copy

# Full contract build process
npm run contracts:build
```

## System Commands (macOS)
```bash
# File operations
ls -la                    # List files with details
find . -name "*.ts"       # Find TypeScript files
grep -r "searchterm" src/ # Search in source files

# Git operations
git status
git add .
git commit -m "message"
git push origin main

# Process management
lsof -ti:3000            # Find process on port 3000
kill -9 <PID>            # Force kill process
```

## Useful Development Shortcuts
```bash
# Install dependencies
npm install

# Update dependencies
npm update

# Clean node_modules and reinstall
rm -rf node_modules package-lock.json && npm install

# View build output
npm run build 2>&1 | less

# Check TypeScript compilation
npx tsc --noEmit
```

## Environment Setup
- Ensure Node.js 18+ is installed
- PostgreSQL database running
- Redis instance for caching (optional in development)
- MetaMask extension for testing Web3 features
- Hardhat local node for smart contract development