import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { adjustUserCredits } from "@/lib/db/credit-ledger";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const creditAdjustmentSchema = z.object({
  amount: z.number().int().min(-10000).max(10000).refine(n => n !== 0, "Amount cannot be zero"),
  reason: z.string().min(1).max(200),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = creditAdjustmentSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { amount, reason } = parsed.data;
    const adminUserId = session.user.id;

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, creditsBalance: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Perform credit adjustment
    await adjustUserCredits(
      params.userId,
      amount,
      reason,
      adminUserId
    );

    const action = amount > 0 ? "credited" : "debited";
    return NextResponse.json({ 
      ok: true, 
      message: `Successfully ${action} ${Math.abs(amount)} credits`,
      newBalance: targetUser.creditsBalance + amount
    });
  } catch (error: any) {
    console.error("Credit adjustment failed:", error);
    
    if (error?.message === "INSUFFICIENT_CREDITS_FOR_ADJUSTMENT") {
      return NextResponse.json(
        { error: "User has insufficient credits for this adjustment" }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to adjust credits" }, 
      { status: 500 }
    );
  }
}