# Web3 Comic Platform - Build Directives

Build a production-ready NextJS comic reading platform with Web3 integration.

## Core Features to Build

### 1. Authentication System
- Implement MetaMask wallet authentication using SIWE (Sign-In with Ethereum)
- Create user accounts automatically on first wallet connection
- Generate secure nonces for authentication with expiry
- Support wallet switching and disconnection

### 2. Comic Content Management
- Build a hierarchical structure: Comics → Volumes → Chapters → Pages
- Implement free chapter system (configurable per comic, default 3 chapters)
- Create chapter unlocking mechanism with credit requirements
- Track reading progress per user per chapter
- Support comic status states: ongoing, completed, hiatus

### 3. Credit System
- Build a credit-based economy for unlocking premium chapters
- Implement on-chain credit purchases via smart contract
- Create server-side transaction verification system
- Maintain credit ledger with full transaction history
- Cache balance for performance, use ledger as source of truth

### 4. Payment Processing
- Deploy smart contract for ETH/credit exchanges
- Support direct credit purchases and package deals
- Implement transaction verification with idempotency
- Handle multiple blockchain networks (start with Sepolia for testing)
- Create atomic unlock operations to prevent race conditions

### 5. Admin Dashboard
- Build role-based access control (USER/ADMIN roles)
- Create comic management interface (CRUD operations)
- Implement user management system
- Add analytics and reporting features
- Support bulk operations and content uploads

### 6. Reader Experience
- Build responsive comic reader with page navigation
- Implement server-side paywall enforcement
- Create unlock prompts for premium content
- Support multiple image formats and resolutions
- Add reading progress tracking and bookmarks

### 7. Security Requirements
- Enforce all paywalls server-side (client UI is convenience only)
- Implement rate limiting on all API endpoints
- Use signed URLs for image delivery
- Validate all inputs with Zod schemas
- Handle wallet signature verification properly

### 8. Performance Optimizations
- Use Redis for caching and rate limiting
- Implement signed URL generation for CDN delivery
- Support image optimization and lazy loading
- Use database transactions for atomic operations
- Implement proper error boundaries

## User Flows to Implement

### New User Flow
1. User connects MetaMask wallet
2. System creates account with default username
3. User reads free chapters
4. User purchases credits when hitting paywall
5. User unlocks chapters with credits

### Returning User Flow
1. User connects wallet (auto-recognized)
2. System restores session and balance
3. User continues from last reading position
4. System tracks progress automatically

### Admin Flow
1. Admin connects with authorized wallet
2. Access admin dashboard
3. Manage comics, users, and credit packages
4. Monitor platform analytics
5. Handle user support issues

## Business Rules

- Free chapters are always accessible without credits
- Each chapter has configurable unlock cost (default: 5 credits)
- Purchased chapters remain unlocked forever
- Credit purchases are non-refundable
- All transactions require on-chain verification
- Failed unlocks must not deduct credits
- Support multiple credit packages with bonus percentages

## Required Integrations
- MetaMask SDK for wallet connectivity
- Ethereum blockchain for payments
- PostgreSQL for data persistence
- Redis for caching and rate limiting
- S3/R2 for image storage
- CDN for content delivery
- Monitoring service for error tracking
- Always look for the right documentation when developing `MetaMask` related features in `/MetaMask-SDK-docs` folder

Generate all components following these directives with production-ready, secure, and scalable implementations. Follow the implementation guide in PLAN.md