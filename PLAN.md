# Web3 Comic Platform - Detailed Implementation Plan

## Table of Contents
1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication System](#5-authentication-system)
6. [Credit & Payment System](#6-credit--payment-system)
7. [Component Specifications](#7-component-specifications)
8. [API Endpoints](#8-api-endpoints)
9. [Smart Contract](#9-smart-contract)
10. [Storage & CDN](#10-storage--cdn)
11. [Security Implementation](#11-security-implementation)
12. [Deployment Guide](#12-deployment-guide)

---

## 1. System Architecture

### Overview
A production-ready comic reading platform combining Web3 payments with traditional web architecture:
- **Frontend**: Next.js 14 App Router with RSC and Client Components
- **Authentication**: MetaMask SDK + SIWE for wallet-based auth
- **Payments**: On-chain credit purchases with server verification
- **Storage**: PostgreSQL + Prisma ORM with Redis caching
- **Content Delivery**: S3/R2 with signed URLs and CDN
- **Security**: Server-side paywall, rate limiting, input validation

### Key Design Decisions
- Prefer Polygon/Base networks for lower gas costs
- Keep creditsBalance as cache; ledger is source of truth
- Enforce all paywalls server-side
- Use atomic transactions for race condition safety
- Implement idempotency for payment verification

---

## 2. Technology Stack

### Core Framework
- **Next.js 14** - App Router, RSC, Server Actions
- **TypeScript** - Type safety across the stack
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built UI components

### Blockchain & Web3
- **MetaMask SDK** - Wallet connectivity
- **ethers v5** - Ethereum interactions
- **SIWE** - Sign-In with Ethereum
- **Solidity** - Smart contracts
- **Hardhat** - Contract development

### Database & Storage
- **PostgreSQL 14+** - Primary database
- **Prisma ORM** - Database abstraction
- **Upstash Redis** - Caching and rate limiting
- **AWS S3 / Cloudflare R2** - Image storage

### State & Data Management
- **Zustand** - Client state management
- **immer** - Immutable state updates
- **SWR** - Data fetching and caching
- **Zod** - Schema validation

### Infrastructure
- **Vercel** - Web hosting
- **Railway/Fly** - Worker hosting
- **Alchemy/Infura** - RPC providers
- **Sentry** - Error monitoring
- **Vercel Analytics** - Usage analytics

### Required Dependencies
```json
{
  "dependencies": {
    "@metamask/sdk": "latest",
    "@metamask/onboarding": "latest",
    "@prisma/client": "latest",
    "next": "14.x",
    "next-auth": "latest",
    "ethers": "5.7.2",
    "siwe": "latest",
    "zustand": "latest",
    "immer": "latest",
    "zod": "latest",
    "@upstash/redis": "latest",
    "@upstash/ratelimit": "latest",
    "react-hot-toast": "latest",
    "@vercel/analytics": "latest"
  },
  "devDependencies": {
    "hardhat": "latest",
    "@nomicfoundation/hardhat-toolbox": "latest",
    "@openzeppelin/contracts": "latest",
    "prisma": "latest"
  }
}
```

---

## 3. Project Structure

```
web3-comic-platform/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Auth routes group
│   │   └── connect-wallet/       # Wallet connection page
│   ├── (main)/                   # Main app routes
│   │   ├── page.tsx             # Homepage
│   │   ├── comics/              # Comics listing
│   │   │   ├── [slug]/          # Comic detail
│   │   │   │   └── chapter/     
│   │   │   │       └── [chapterId]/ # Chapter reader
│   ├── admin/                    # Admin dashboard
│   │   ├── layout.tsx           # Admin layout with auth
│   │   ├── comics/              # Comic management
│   │   ├── users/               # User management
│   │   └── analytics/           # Platform analytics
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   └── nonce/           # SIWE nonce generation
│   │   ├── credits/             # Credit system
│   │   │   ├── balance/         # Get balance
│   │   │   ├── purchase/        # Initiate purchase
│   │   │   └── verify/          # Verify on-chain tx
│   │   ├── comics/              # Comic CRUD
│   │   │   └── [id]/
│   │   │       └── chapters/
│   │   │           └── [chapterId]/
│   │   │               └── unlock/ # Unlock chapter
│   │   ├── reading-progress/    # Track reading
│   │   ├── upload/              # File uploads
│   │   └── webhooks/            # External webhooks
│   ├── layout.tsx               # Root layout
│   └── providers.tsx            # Context providers
├── components/
│   ├── ui/                      # shadcn components
│   ├── web3/                    # Web3 components
│   │   ├── WalletConnect.tsx
│   │   ├── NetworkSwitch.tsx
│   │   ├── CreditPurchase.tsx
│   │   └── TransactionStatus.tsx
│   └── comic/                   # Comic components
│       ├── ComicReader.tsx
│       ├── ChapterList.tsx
│       ├── PageViewer.tsx
│       └── UnlockPrompt.tsx
├── contracts/                    # Smart contracts
│   ├── ComicPlatformPayment.sol
│   └── abi/                     # Contract ABIs
├── lib/                         # Utility libraries
│   ├── auth/                   # Auth utilities
│   ├── db/                     # Database helpers
│   ├── storage/                # Storage utilities
│   ├── validation/             # Zod schemas
│   └── web3/                   # Web3 helpers
├── prisma/
│   └── schema.prisma           # Database schema
├── store/                      # Zustand stores
│   ├── useAuthStore.ts
│   ├── useWeb3Store.ts
│   └── useComicStore.ts
├── public/                     # Static assets
├── scripts/                    # Build/deploy scripts
└── config files...             # Various configs
```

---

## 4. Database Schema

### Complete Prisma Schema

```prisma
generator client { 
  provider = "prisma-client-js" 
}

datasource db { 
  provider = "postgresql"
  url = env("DATABASE_URL") 
}

// User Management
model User {
  id               String   @id @default(cuid())
  walletAddress    String   @unique
  username         String?  @unique
  email            String?  @unique
  creditsBalance   Int      @default(0) // Cached balance
  role             UserRole @default(USER)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  transactions     Transaction[]
  unlockedChapters UserChapterUnlock[]
  readingProgress  ReadingProgress[]
}

enum UserRole { 
  USER 
  ADMIN 
}

// Authentication
model SiweNonce {
  id        String   @id @default(cuid())
  address   String
  nonce     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([address])
}

// Comic Content Structure
model Comic {
  id           String      @id @default(cuid())
  title        String
  slug         String      @unique
  description  String
  author       String
  coverImage   String
  genre        String[]
  status       ComicStatus @default(ONGOING)
  freeChapters Int         @default(3)
  featured     Boolean     @default(false)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  volumes      Volume[]
  tags         Tag[]
}

enum ComicStatus { 
  ONGOING 
  COMPLETED 
  HIATUS 
}

model Volume {
  id           String  @id @default(cuid())
  comicId      String
  volumeNumber Int
  title        String
  createdAt    DateTime @default(now())

  comic     Comic   @relation(fields: [comicId], references: [id], onDelete: Cascade)
  chapters  Chapter[]

  @@unique([comicId, volumeNumber])
}

model Chapter {
  id             String   @id @default(cuid())
  volumeId       String
  chapterNumber  Float
  title          String
  unlockCost     Int      @default(5)
  isFree         Boolean  @default(false)
  publishedAt    DateTime @default(now())
  createdAt      DateTime @default(now())

  volume        Volume    @relation(fields: [volumeId], references: [id], onDelete: Cascade)
  pages         Page[]
  unlocks       UserChapterUnlock[]
  readProgress  ReadingProgress[]

  @@unique([volumeId, chapterNumber])
  @@index([publishedAt])
}

model Page {
  id         String  @id @default(cuid())
  chapterId  String
  pageNumber Int
  imageUrl   String
  width      Int?
  height     Int?
  createdAt  DateTime @default(now())

  chapter Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)

  @@unique([chapterId, pageNumber])
}

// User Progress & Unlocks
model UserChapterUnlock {
  id           String   @id @default(cuid())
  userId       String
  chapterId    String
  creditsSpent Int
  unlockedAt   DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  chapter Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)

  @@unique([userId, chapterId])
  @@index([userId])
}

model ReadingProgress {
  id         String   @id @default(cuid())
  userId     String
  chapterId  String
  pageNumber Int
  updatedAt  DateTime @updatedAt

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  chapter Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)

  @@unique([userId, chapterId])
}

// Financial System
model Transaction {
  id              String            @id @default(cuid())
  userId          String
  type            TransactionType
  amount          Int               // Credits (+ = credit, - = debit)
  description     String
  transactionHash String?           @unique
  networkChainId  Int?
  status          TransactionStatus @default(PENDING)
  createdAt       DateTime          @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@index([transactionHash])
}

enum TransactionType { 
  PURCHASE 
  SPEND 
  REFUND 
  ADMIN_ADJUSTMENT 
}

enum TransactionStatus { 
  PENDING 
  CONFIRMED 
  FAILED 
}

model CreditPackage {
  id              String  @id @default(cuid())
  name            String
  credits         Int
  priceUSD        Float
  bonusPercentage Int     @default(0)
  active          Boolean @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Metadata
model Tag {
  id     String  @id @default(cuid())
  name   String  @unique
  comics Comic[]
}
```

---

## 5. Authentication System

### SIWE Implementation

#### Nonce Generation (`lib/auth/siwe.ts`)
```typescript
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { SiweMessage } from "siwe";

export async function issueNonce(address: string) {
  const nonce = randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  await prisma.siweNonce.create({
    data: { 
      address: address.toLowerCase(), 
      nonce, 
      expiresAt 
    },
  });
  
  return nonce;
}

export async function verifySiwe({ 
  message, 
  signature 
}: { 
  message: string; 
  signature: string 
}) {
  const siwe = new SiweMessage(message);
  const { data } = await siwe.verify({ signature });
  
  if (!data?.address || !data?.nonce) {
    throw new Error("Invalid SIWE message");
  }

  const record = await prisma.siweNonce.findUnique({ 
    where: { nonce: data.nonce } 
  });
  
  if (!record || 
      record.address !== data.address.toLowerCase() || 
      record.expiresAt < new Date()) {
    throw new Error("Nonce invalid or expired");
  }
  
  // Delete used nonce
  await prisma.siweNonce.delete({ 
    where: { nonce: data.nonce } 
  });
  
  return data.address.toLowerCase();
}
```

#### NextAuth Configuration (`lib/auth/session.ts`)
```typescript
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "SIWE",
      credentials: {
        message: { label: "message", type: "text" },
        signature: { label: "signature", type: "text" },
      },
      async authorize(creds) {
        if (!creds?.message || !creds?.signature) return null;
        
        const { verifySiwe } = await import("./siwe");
        const address = await verifySiwe({ 
          message: creds.message, 
          signature: creds.signature 
        });
        
        let user = await prisma.user.findUnique({ 
          where: { walletAddress: address } 
        });
        
        if (!user) {
          user = await prisma.user.create({
            data: { 
              walletAddress: address, 
              username: `User_${address.slice(2, 8)}` 
            },
          });
        }
        
        return { 
          id: user.id, 
          address: user.walletAddress, 
          role: user.role, 
          creditsBalance: user.creditsBalance 
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.address = (user as any).address;
        token.role = (user as any).role;
        token.creditsBalance = (user as any).creditsBalance;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user = {
        id: token.id,
        address: token.address,
        role: token.role,
        creditsBalance: token.creditsBalance,
      };
      return session;
    },
  },
  pages: { 
    signIn: "/connect-wallet" 
  },
};
```

---

## 6. Credit & Payment System

### Credit Ledger (`lib/db/credit-ledger.ts`)
```typescript
import { prisma } from "./prisma";

export async function creditUser(
  userId: string, 
  credits: number, 
  opts?: { 
    tx?: any; 
    description?: string; 
    txHash?: string; 
    chainId?: number 
  }
) {
  const db = opts?.tx ?? prisma;
  
  await db.transaction.create({
    data: {
      userId,
      type: "PURCHASE",
      amount: credits,
      description: opts?.description ?? "On-chain credit purchase",
      transactionHash: opts?.txHash,
      networkChainId: opts?.chainId,
      status: "CONFIRMED",
    },
  });
  
  await db.user.update({ 
    where: { id: userId }, 
    data: { creditsBalance: { increment: credits } } 
  });
}

export async function debitUser(
  userId: string,
  credits: number,
  description: string,
  tx?: any
) {
  const db = tx ?? prisma;
  
  const user = await db.user.findUnique({ 
    where: { id: userId },
    select: { creditsBalance: true }
  });
  
  if (!user || user.creditsBalance < credits) {
    throw new Error("INSUFFICIENT_CREDITS");
  }
  
  await db.transaction.create({
    data: {
      userId,
      type: "SPEND",
      amount: -credits,
      description,
      status: "CONFIRMED",
    },
  });
  
  await db.user.update({
    where: { id: userId },
    data: { creditsBalance: { decrement: credits } }
  });
}
```

### Transaction Verification (`app/api/credits/verify/route.ts`)
```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ethers } from "ethers";
import abi from "@/contracts/abi/ComicPlatformPayment.json";
import { creditUser } from "@/lib/db/credit-ledger";
import { purchaseInput } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userId = (session as any).user.id as string;
  const body = await req.json();
  const parsed = purchaseInput.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { transactionHash, chainId } = parsed.data;
  if (!transactionHash) {
    return NextResponse.json({ error: "transactionHash required" }, { status: 400 });
  }

  // Check for idempotency
  const exists = await prisma.transaction.findUnique({ 
    where: { transactionHash } 
  });
  if (exists) {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  // Get RPC provider
  const rpc = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    : `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`;

  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const receipt = await provider.getTransactionReceipt(transactionHash);
  
  if (!receipt || receipt.status !== 1) {
    return NextResponse.json({ error: "TX not confirmed" }, { status: 400 });
  }

  // Parse contract events
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, 
    (abi as any).abi ?? abi, 
    provider
  );
  
  const event = receipt.logs
    .map((log) => { 
      try { 
        return contract.interface.parseLog(log); 
      } catch { 
        return null; 
      } 
    })
    .filter(Boolean)
    .find((ev: any) => ev.name === "CreditsPurchased");

  if (!event) {
    return NextResponse.json({ error: "No purchase event found" }, { status: 400 });
  }

  const credits: number = (event as any).args.credits.toNumber();

  // Atomic transaction to update balance
  await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: {
        userId,
        type: "PURCHASE",
        amount: credits,
        description: "On-chain credit purchase",
        transactionHash,
        networkChainId: chainId,
        status: "CONFIRMED",
      },
    });
    
    await tx.user.update({ 
      where: { id: userId }, 
      data: { creditsBalance: { increment: credits } } 
    });
  });

  return NextResponse.json({ ok: true, credits });
}
```

### Atomic Chapter Unlock (`app/api/comics/[id]/chapters/[chapterId]/unlock/route.ts`)
```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  _: Request, 
  { params }: { params: { id: string; chapterId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userId = (session as any).user.id as string;

  const chapter = await prisma.chapter.findUnique({
    where: { id: params.chapterId },
    select: { id: true, unlockCost: true, isFree: true },
  });
  
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }
  
  if (chapter.isFree) {
    return NextResponse.json({ ok: true, free: true });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Check if already unlocked
      const exists = await tx.userChapterUnlock.findUnique({
        where: { 
          userId_chapterId: { 
            userId, 
            chapterId: chapter.id 
          } 
        },
      });
      
      if (exists) {
        return { ok: true, already: true };
      }

      // Check balance
      const user = await tx.user.findUnique({ 
        where: { id: userId }, 
        select: { creditsBalance: true } 
      });
      
      if (!user || user.creditsBalance < chapter.unlockCost) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      // Deduct credits
      await tx.user.update({ 
        where: { id: userId }, 
        data: { creditsBalance: { decrement: chapter.unlockCost } } 
      });
      
      // Create transaction record
      await tx.transaction.create({
        data: { 
          userId, 
          type: "SPEND", 
          amount: -chapter.unlockCost, 
          description: `Unlock chapter ${chapter.id}`, 
          status: "CONFIRMED" 
        },
      });
      
      // Create unlock record
      await tx.userChapterUnlock.create({ 
        data: { 
          userId, 
          chapterId: chapter.id, 
          creditsSpent: chapter.unlockCost 
        } 
      });

      return { ok: true };
    });
    
    return NextResponse.json(result);
  } catch (e: any) {
    const code = e?.message === "INSUFFICIENT_CREDITS" ? 400 : 500;
    return NextResponse.json({ error: e?.message ?? "Unlock failed" }, { status: code });
  }
}
```

---

## 7. Component Specifications

### Wallet Connection (`components/web3/WalletConnect.tsx`)
```tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useMetamask } from "@/lib/web3/useMetamask";
import toast from "react-hot-toast";

export function WalletConnect() {
  const { provider } = useMetamask();
  const [loading, setLoading] = useState(false);

  const onConnect = async () => {
    try {
      setLoading(true);
      const eth = provider();
      if (!eth) return toast.error("Please install MetaMask");
      
      const accounts = await eth.request({ method: "eth_requestAccounts" }) as string[];
      const address = accounts[0];
      const chainId = await eth.request({ method: "eth_chainId" }) as string;

      // Get nonce from server
      const nonceRes = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const { message } = await nonceRes.json();

      // Sign message
      const signature = await eth.request({
        method: "personal_sign",
        params: [message, address],
      }) as string;

      // Authenticate
      const res = await signIn("credentials", { 
        message, 
        signature, 
        redirect: false 
      });
      
      if (res?.error) return toast.error(res.error);
      toast.success("Connected successfully!");
      window.location.href = "/";
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={onConnect} 
      disabled={loading} 
      className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
    >
      {loading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
```

### Comic Reader (`components/comic/ComicReader.tsx`)
```tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { UnlockPrompt } from "./UnlockPrompt";
import { PageControls } from "./PageControls";

interface ComicReaderProps {
  chapterId: string;
  isUnlocked: boolean;
  pages: Array<{
    imageUrl: string;
    width?: number;
    height?: number;
  }>;
  unlockCost: number;
  nextChapter?: { id: string; title: string };
  prevChapter?: { id: string; title: string };
}

export function ComicReader({ 
  chapterId, 
  isUnlocked, 
  pages, 
  unlockCost,
  nextChapter,
  prevChapter 
}: ComicReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isUnlocked) {
      // Track reading progress
      fetch("/api/reading-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, pageNumber: currentPage }),
      });
    }
  }, [currentPage, isUnlocked, chapterId]);

  if (!isUnlocked) {
    return <UnlockPrompt chapterId={chapterId} unlockCost={unlockCost} />;
  }

  const currentPageData = pages[currentPage - 1];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900">
      {/* Page Display */}
      <div className="w-full max-w-4xl relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        )}
        
        <Image 
          src={currentPageData.imageUrl} 
          alt={`Page ${currentPage}`} 
          width={currentPageData.width ?? 800} 
          height={currentPageData.height ?? 1200} 
          className="w-full h-auto"
          onLoadingComplete={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
          priority
        />
      </div>

      {/* Page Controls */}
      <PageControls
        currentPage={currentPage}
        totalPages={pages.length}
        onPageChange={setCurrentPage}
        nextChapter={nextChapter}
        prevChapter={prevChapter}
      />
    </div>
  );
}
```

### Credit Purchase Modal (`components/web3/CreditPurchase.tsx`)
```tsx
"use client";
import { useState } from "react";
import { useMetamask } from "@/lib/web3/useMetamask";
import { PaymentHandler } from "@/lib/web3/payment-handler";
import toast from "react-hot-toast";

interface Package {
  id: number;
  name: string;
  credits: number;
  priceETH: string;
  bonus: number;
}

const packages: Package[] = [
  { id: 0, name: "Starter", credits: 100, priceETH: "0.09", bonus: 10 },
  { id: 1, name: "Popular", credits: 500, priceETH: "0.4", bonus: 25 },
  { id: 2, name: "Premium", credits: 1000, priceETH: "0.7", bonus: 40 },
];

export function CreditPurchase({ onSuccess }: { onSuccess?: () => void }) {
  const { provider } = useMetamask();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    try {
      setLoading(true);
      const eth = provider();
      if (!eth) throw new Error("No provider");
      
      const chainId = await eth.request({ method: "eth_chainId" }) as string;
      const handler = new PaymentHandler(eth);
      
      // Execute on-chain purchase
      const receipt = await handler.purchasePackage(
        selectedPackage.id, 
        chainId
      );
      
      toast.success(`Purchase successful! TX: ${receipt.transactionHash}`);
      onSuccess?.();
    } catch (e: any) {
      toast.error(e?.message ?? "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Purchase Credits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
              selectedPackage?.id === pkg.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <h3 className="font-semibold text-lg">{pkg.name}</h3>
            <p className="text-2xl font-bold">{pkg.credits} Credits</p>
            {pkg.bonus > 0 && (
              <p className="text-green-600">+{pkg.bonus}% Bonus!</p>
            )}
            <p className="text-gray-600 mt-2">{pkg.priceETH} ETH</p>
          </div>
        ))}
      </div>

      <button
        onClick={handlePurchase}
        disabled={!selectedPackage || loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : "Purchase Now"}
      </button>
    </div>
  );
}
```

---

## 8. API Endpoints

### Rate Limiting Middleware (`middleware.ts`)
```typescript
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function middleware(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown")
    .split(",")[0]
    .trim();
    
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }
  
  return NextResponse.next();
}

export const config = { 
  matcher: "/api/:path*" 
};
```

### API Route Examples

#### Get Comics List (`app/api/comics/route.ts`)
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  genre: z.string().optional(),
  status: z.enum(["ONGOING", "COMPLETED", "HIATUS"]).optional(),
  featured: z.coerce.boolean().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = querySchema.parse(Object.fromEntries(searchParams));
  
  const where = {
    ...(query.genre && { genre: { has: query.genre } }),
    ...(query.status && { status: query.status }),
    ...(query.featured !== undefined && { featured: query.featured }),
  };
  
  const [comics, total] = await Promise.all([
    prisma.comic.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        volumes: {
          include: {
            chapters: {
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.comic.count({ where }),
  ]);
  
  return NextResponse.json({
    comics,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.ceil(total / query.limit),
    },
  });
}
```

#### Upload Comic Pages (`app/api/upload/route.ts`)
```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/session";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const chapterId = formData.get("chapterId") as string;
  const pageNumber = formData.get("pageNumber") as string;

  if (!file || !chapterId || !pageNumber) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `comics/${chapterId}/${pageNumber}-${randomUUID()}.webp`;

  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: "image/webp",
  }));

  const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return NextResponse.json({ imageUrl });
}
```

---

## 9. Smart Contract

### Solidity Contract (`contracts/ComicPlatformPayment.sol`)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ComicPlatformPayment is Ownable, ReentrancyGuard, Pausable {
    event CreditsPurchased(
        address indexed buyer, 
        uint256 amountWei, 
        uint256 credits, 
        uint256 timestamp
    );
    event CreditPriceUpdated(uint256 priceWei);
    event PackageUpdated(
        uint256 id, 
        uint256 credits, 
        uint256 priceWei, 
        uint256 bonus, 
        bool active
    );

    uint256 public creditPriceWei = 0.001 ether;

    struct Package { 
        uint256 credits; 
        uint256 priceWei; 
        uint256 bonus; 
        bool active; 
    }
    
    mapping(uint256 => Package) public packages;
    uint256 public packageCount;

    constructor() {
        _createOrUpdatePackage(0, 100, 0.09 ether, 10, true);
        _createOrUpdatePackage(1, 500, 0.4 ether, 25, true);
        _createOrUpdatePackage(2, 1000, 0.7 ether, 40, true);
    }

    function setCreditPriceWei(uint256 newPrice) external onlyOwner { 
        creditPriceWei = newPrice; 
        emit CreditPriceUpdated(newPrice); 
    }

    function purchaseCredits(uint256 creditAmount) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(creditAmount > 0 && creditAmount <= 10000, "Invalid amount");
        uint256 cost = creditAmount * creditPriceWei;
        require(msg.value >= cost, "Insufficient payment");
        
        if (msg.value > cost) {
            (bool refund, ) = payable(msg.sender).call{value: msg.value - cost}("");
            require(refund, "Refund failed");
        }
        
        emit CreditsPurchased(msg.sender, cost, creditAmount, block.timestamp);
    }

    function purchasePackage(uint256 packageId) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Package memory p = packages[packageId];
        require(p.active, "Invalid package");
        require(msg.value >= p.priceWei, "Insufficient payment");
        
        uint256 totalCredits = p.credits + (p.credits * p.bonus / 100);
        
        if (msg.value > p.priceWei) {
            (bool refund, ) = payable(msg.sender).call{value: msg.value - p.priceWei}("");
            require(refund, "Refund failed");
        }
        
        emit CreditsPurchased(msg.sender, p.priceWei, totalCredits, block.timestamp);
    }

    function createOrUpdatePackage(
        uint256 id, 
        uint256 credits, 
        uint256 priceWei, 
        uint256 bonus, 
        bool active
    ) external onlyOwner {
        _createOrUpdatePackage(id, credits, priceWei, bonus, active);
    }

    function _createOrUpdatePackage(
        uint256 id, 
        uint256 credits, 
        uint256 priceWei, 
        uint256 bonus, 
        bool active
    ) internal {
        packages[id] = Package(credits, priceWei, bonus, active);
        if (id >= packageCount) packageCount = id + 1;
        emit PackageUpdated(id, credits, priceWei, bonus, active);
    }

    function withdraw(address to) external onlyOwner {
        (bool ok,) = payable(to).call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    receive() external payable {}
}
```

### Hardhat Configuration (`hardhat.config.ts`)
```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_URL || process.env.INFURA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;
```

### Deployment Script (`scripts/deploy.ts`)
```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ComicPlatformPayment...");
  
  const Factory = await ethers.getContractFactory("ComicPlatformPayment");
  const contract = await Factory.deploy();
  await contract.deployed();
  
  console.log("ComicPlatformPayment deployed to:", contract.address);
  console.log("Network:", await ethers.provider.getNetwork());
  
  // Wait for confirmations
  await contract.deployTransaction.wait(5);
  
  // Verify on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract...");
    await run("verify:verify", {
      address: contract.address,
      constructorArguments: [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## 10. Storage & CDN

### Signed URL Generation (`lib/storage/signed-url.ts`)
```typescript
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedImageUrl(
  key: string, 
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  });
  
  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function getChapterPages(chapterId: string) {
  const pages = await prisma.page.findMany({
    where: { chapterId },
    orderBy: { pageNumber: "asc" },
  });
  
  // Generate signed URLs for all pages
  const pagesWithSignedUrls = await Promise.all(
    pages.map(async (page) => {
      const signedUrl = await getSignedImageUrl(page.imageUrl);
      return { ...page, imageUrl: signedUrl };
    })
  );
  
  return pagesWithSignedUrls;
}
```

### CloudFlare R2 Alternative
```typescript
import { S3Client } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Use same S3 commands with R2 client
```

---

## 11. Security Implementation

### Input Validation Schemas (`lib/validation/schemas.ts`)
```typescript
import { z } from "zod";

export const walletAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/);

export const purchaseInput = z.object({
  amount: z.number().int().min(1).max(10000).optional(),
  packageId: z.number().int().min(0).optional(),
  chainId: z.number().int().positive(),
  transactionHash: z.string().optional(),
}).refine(
  data => data.amount || data.packageId !== undefined, 
  { message: "Provide amount or packageId" }
);

export const comicUpload = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  author: z.string().min(1).max(100),
  genre: z.string().transform(s => 
    s.split(",").map(x => x.trim()).filter(Boolean)
  ),
  freeChapters: z.coerce.number().int().min(0).max(10).default(3),
});

export const chapterUnlock = z.object({
  chapterId: z.string().cuid(),
});

export const readingProgress = z.object({
  chapterId: z.string().cuid(),
  pageNumber: z.number().int().positive(),
});
```

### Environment Variables (`lib/utils/env.ts`)
```typescript
import { z } from "zod";

const envSchema = z.object({
  // App
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // Web3
  NEXT_PUBLIC_CHAIN_ID: z.string(),
  NEXT_PUBLIC_CONTRACT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  NEXT_PUBLIC_INFURA_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
  
  // Redis
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  
  // Storage
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  S3_BUCKET_NAME: z.string(),
  
  // Monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

---

## 12. Deployment Guide

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis instance (Upstash)
- S3 bucket or R2 storage
- RPC provider (Alchemy/Infura)
- Domain with SSL

### Local Development
```bash
# Clone repository
git clone <repository>
cd web3-comic-platform

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npx prisma migrate dev
npx prisma generate

# Compile contracts
npx hardhat compile
npm run abi:copy

# Run development server
npm run dev
```

### Production Deployment

#### 1. Database Setup
```bash
# Production database
npx prisma migrate deploy
npx prisma generate
```

#### 2. Contract Deployment
```bash
# Deploy to testnet first
npx hardhat run scripts/deploy.ts --network sepolia

# After testing, deploy to mainnet
npx hardhat run scripts/deploy.ts --network polygon
```

#### 3. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

#### 4. Configuration Checklist
- [ ] Set all environment variables
- [ ] Configure custom domain
- [ ] Enable SSL certificate
- [ ] Set up monitoring (Sentry)
- [ ] Configure analytics
- [ ] Set up backup strategy
- [ ] Configure CDN
- [ ] Test payment flow
- [ ] Verify rate limiting
- [ ] Check security headers

### Monitoring & Maintenance

#### Weekly Tasks
- Review error logs
- Check transaction success rates
- Monitor credit balance discrepancies
- Update dependencies

#### Monthly Tasks
- Security audit
- Performance review
- Database optimization
- Contract balance check

#### Emergency Procedures
- Contract pause mechanism
- Database rollback plan
- User communication channels
- Support ticket system

### Scaling Considerations

#### Phase 1 (0-1000 users)
- Single server deployment
- Basic CDN setup
- Manual monitoring

#### Phase 2 (1000-10000 users)
- Load balancing
- Read replicas
- Queue system for uploads
- Advanced caching

#### Phase 3 (10000+ users)
- Microservices architecture
- Multi-region deployment
- IPFS for content storage
- Layer 2 scaling solutions

---

## Appendix

### Testing Strategy
- Unit tests for critical functions
- Integration tests for payment flows
- E2E tests for user journeys
- Load testing for scalability
- Security testing for vulnerabilities

### Performance Metrics
- Page load time < 2s
- Transaction confirmation < 30s
- Image loading < 1s
- API response time < 200ms
- 99.9% uptime target

### Support Resources
- Documentation site
- Discord community
- Email support
- FAQ section
- Video tutorials