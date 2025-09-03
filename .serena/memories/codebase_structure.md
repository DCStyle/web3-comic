# Codebase Structure

## Directory Organization

### `/src/app/` - Next.js App Router
- **`(main)/`**: Main application routes (comics, library, profile, etc.)
- **`(auth)/`**: Authentication-related routes
- **`admin/`**: Admin dashboard with analytics, comic management, user management
- **`api/`**: API routes for backend functionality
  - `auth/`: NextAuth configuration and nonce generation
  - `comics/`: Comic data and chapter unlocking
  - `credits/`: Credit balance, history, and purchasing
  - `admin/`: Admin-only endpoints for management

### `/src/components/` - React Components
- **`ui/`**: Reusable UI components (buttons, cards, dialogs, etc.)
- **`layout/`**: Layout components (Header, navigation)
- **`admin/`**: Admin-specific components
- **`web3/`**: Web3 wallet connection and payment components
- **`comic/`**: Comic reading and display components
- **`profile/`**: User profile and settings
- **`guest/`**: Guest user experience components

### `/src/lib/` - Utility Libraries
- **`auth/`**: SIWE authentication and NextAuth configuration
- **`web3/`**: MetaMask integration and payment handling
- **`db/`**: Prisma client and credit ledger logic
- **`utils/`**: General utilities and environment handling
- **`validation/`**: Zod schemas for input validation

### `/src/store/` - State Management
- Zustand stores for Web3 connection state

### `/src/types/` - TypeScript Types
- Global type definitions and NextAuth extensions

### Root Configuration Files
- **`prisma/schema.prisma`**: Database schema definition
- **`contracts/`**: Hardhat smart contract development
- **`hardhat.config.js`**: Smart contract configuration
- **`tailwind.config.js`**: Styling configuration
- **`CLAUDE.md`**: Build directives and requirements
- **`PLAN.md`**: Implementation roadmap

## Database Schema
- **Users**: Wallet-based authentication with credit balances
- **Comics**: Hierarchical content structure
- **Transactions**: Full audit trail for credit operations
- **Progress Tracking**: Reading progress and chapter unlocks
- **Admin Tools**: Role-based permissions and analytics