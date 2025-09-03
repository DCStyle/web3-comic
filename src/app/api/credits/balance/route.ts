import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { getUserBalance } from "@/lib/db/credit-ledger";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    const balance = await getUserBalance(userId);

    return NextResponse.json({ 
      balance,
      address: session.user.address 
    });
  } catch (error) {
    console.error("Failed to get balance:", error);
    return NextResponse.json(
      { error: "Failed to get balance" }, 
      { status: 500 }
    );
  }
}