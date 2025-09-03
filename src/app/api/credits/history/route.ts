import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { getUserTransactionHistory } from "@/lib/db/credit-ledger";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");
    
    const userId = session.user.id;
    const transactions = await getUserTransactionHistory(userId, limit, offset);

    return NextResponse.json({ 
      transactions,
      hasMore: transactions.length === limit
    });
  } catch (error) {
    console.error("Failed to get transaction history:", error);
    return NextResponse.json(
      { error: "Failed to get transaction history" }, 
      { status: 500 }
    );
  }
}