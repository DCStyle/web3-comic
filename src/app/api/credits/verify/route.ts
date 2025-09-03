import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { ethers } from "ethers";
import contractABI from "@/contracts/abi/ComicPlatformPayment.json";
import { creditUser } from "@/lib/db/credit-ledger";
import { purchaseInput } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userId = session.user.id;
  const body = await req.json();
  const parsed = purchaseInput.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { transactionHash, chainId } = parsed.data;
  if (!transactionHash) {
    return NextResponse.json({ error: "transactionHash required" }, { status: 400 });
  }

  try {
    // Check for idempotency
    const exists = await prisma.transaction.findUnique({ 
      where: { transactionHash } 
    });
    if (exists) {
      return NextResponse.json({ ok: true, idempotent: true });
    }

    // Get RPC provider
    const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      : process.env.NEXT_PUBLIC_INFURA_API_KEY 
      ? `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
      : null;

    if (!rpcUrl) {
      return NextResponse.json({ error: "No RPC provider configured" }, { status: 500 });
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const receipt = await provider.getTransactionReceipt(transactionHash);
    
    if (!receipt || receipt.status !== 1) {
      return NextResponse.json({ error: "Transaction not confirmed" }, { status: 400 });
    }

    // Verify the transaction was sent to our contract
    if (receipt.to?.toLowerCase() !== process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.toLowerCase()) {
      return NextResponse.json({ error: "Invalid contract address" }, { status: 400 });
    }

    // Parse contract events
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      contractABI.abi,
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

    // Verify the buyer matches the authenticated user
    const buyer = (event as any).args.buyer?.toLowerCase();
    if (buyer !== session.user.address.toLowerCase()) {
      return NextResponse.json({ error: "Transaction buyer mismatch" }, { status: 400 });
    }

    const credits: number = (event as any).args.credits.toNumber();
    const amountWei = (event as any).args.amountWei;

    // Atomic transaction to update balance
    await prisma.$transaction(async (tx) => {
      await creditUser(userId, credits, {
        tx,
        description: "On-chain credit purchase",
        txHash: transactionHash,
        chainId: chainId,
      });
    });

    return NextResponse.json({ 
      ok: true, 
      credits,
      amountPaid: ethers.utils.formatEther(amountWei)
    });
  } catch (error: any) {
    console.error("Transaction verification failed:", error);
    return NextResponse.json(
      { error: error?.message ?? "Verification failed" }, 
      { status: 500 }
    );
  }
}