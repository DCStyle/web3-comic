# Task Completion Guidelines

## After Completing Code Changes

### 1. Code Quality Checks
```bash
# Always run linting after code changes
npm run lint

# Check TypeScript compilation
npx tsc --noEmit

# Ensure build succeeds
npm run build
```

### 2. Database Updates
```bash
# If schema.prisma was modified
npm run db:generate
npm run db:push

# Verify changes in Prisma Studio
npm run db:studio
```

### 3. Smart Contract Changes
```bash
# If contracts were modified
npm run contracts:build

# Run contract tests
npm run hardhat:test
```

### 4. Testing & Verification
- Test core functionality manually in browser
- Verify Web3 connections work with MetaMask
- Check admin dashboard functionality for admin users
- Validate API endpoints with proper authentication
- Ensure guest mode still works without wallet connection

### 5. Security Validation
- Confirm server-side authorization is enforced
- Verify input validation with Zod schemas
- Test role-based access control
- Ensure sensitive operations require proper authentication

### 6. Performance Considerations
- Check for unnecessary re-renders in React components
- Validate database queries are efficient
- Ensure proper error boundaries exist
- Verify caching strategies are working

## Before Committing
1. Review all changed files
2. Ensure no secrets or API keys are committed
3. Verify import statements are clean
4. Check that TypeScript types are properly defined
5. Confirm error handling is comprehensive

## Deployment Readiness
- All builds succeed without warnings
- Database migrations are ready
- Environment variables are documented
- Smart contracts are properly deployed and verified