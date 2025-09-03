import { prisma } from "./prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";

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
      type: TransactionType.PURCHASE,
      amount: credits,
      description: opts?.description ?? "On-chain credit purchase",
      transactionHash: opts?.txHash,
      networkChainId: opts?.chainId,
      status: TransactionStatus.CONFIRMED,
    },
  });
  
  await db.user.update({ 
    where: { id: userId }, 
    data: { creditsBalance: { increment: credits } } 
  });
  
  return credits;
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
      type: TransactionType.SPEND,
      amount: -credits,
      description,
      status: TransactionStatus.CONFIRMED,
    },
  });
  
  await db.user.update({
    where: { id: userId },
    data: { creditsBalance: { decrement: credits } }
  });
  
  return user.creditsBalance - credits;
}

export async function getUserBalance(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsBalance: true }
  });
  
  return user?.creditsBalance ?? 0;
}

export async function getUserTransactionHistory(
  userId: string,
  limit = 50,
  offset = 0
) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
    select: {
      id: true,
      type: true,
      amount: true,
      description: true,
      transactionHash: true,
      networkChainId: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function adjustUserCredits(
  userId: string,
  amount: number,
  reason: string,
  adminUserId: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsBalance: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (amount < 0 && user.creditsBalance < Math.abs(amount)) {
    throw new Error("INSUFFICIENT_CREDITS_FOR_ADJUSTMENT");
  }

  await prisma.transaction.create({
    data: {
      userId,
      type: TransactionType.ADMIN_ADJUSTMENT,
      amount,
      description: `Admin adjustment by ${adminUserId}: ${reason}`,
      status: TransactionStatus.CONFIRMED,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { creditsBalance: { increment: amount } }
  });
}

export async function reconcileUserBalance(userId: string): Promise<number> {
  // Calculate balance from transaction ledger
  const result = await prisma.transaction.aggregate({
    where: { 
      userId,
      status: TransactionStatus.CONFIRMED
    },
    _sum: { amount: true }
  });
  
  const actualBalance = result._sum.amount ?? 0;
  
  // Update user's cached balance
  await prisma.user.update({
    where: { id: userId },
    data: { creditsBalance: actualBalance }
  });
  
  return actualBalance;
}