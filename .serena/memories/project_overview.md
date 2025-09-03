# Web3 Comic Platform - Project Overview

## Project Purpose
A production-ready NextJS comic reading platform with Web3 integration, featuring MetaMask wallet authentication, a credit-based economy for unlocking premium content, hierarchical comic content management, and comprehensive admin tools.

## Key Features
- **Web3 Authentication**: MetaMask wallet integration with SIWE (Sign-In with Ethereum)
- **Comic Content**: Hierarchical structure (Comics → Volumes → Chapters → Pages)
- **Credit Economy**: Credit-based unlocking system with on-chain payment verification
- **Freemium Model**: Configurable free chapters per comic (default: 3)
- **Admin Dashboard**: Role-based access control with analytics and management tools
- **Guest Access**: Anonymous browsing with limitations for unconnected users
- **Smart Contracts**: Hardhat-based smart contract development for payments

## Tech Stack
- **Framework**: Next.js 15.5.2 (App Router)
- **Frontend**: React 19.1.0, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives with shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js + SIWE
- **Web3**: MetaMask SDK, Ethers.js
- **State Management**: Zustand
- **Caching**: Redis (via Upstash)
- **Validation**: Zod
- **Smart Contracts**: Hardhat, OpenZeppelin
- **Icons**: Lucide React
- **Styling**: class-variance-authority, clsx, tailwind-merge

## Architecture
- Server-side rendering with Next.js App Router
- Role-based access control (USER/ADMIN)
- Credit ledger system for transaction integrity
- Server-side paywall enforcement
- Progressive enhancement for Web3 features
- Guest mode fallback for unconnected users