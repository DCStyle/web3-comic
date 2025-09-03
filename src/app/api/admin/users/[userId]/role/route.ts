import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const roleUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
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
    const parsed = roleUpdateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { role } = parsed.data;

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, role: true, walletAddress: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent self-demotion from admin
    if (params.userId === session.user.id && role === "USER") {
      return NextResponse.json(
        { error: "Cannot demote yourself from admin role" }, 
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: { role },
      select: {
        id: true,
        role: true,
        walletAddress: true,
        username: true,
      }
    });

    console.log(`Admin ${session.user.address} changed role of user ${targetUser.walletAddress} to ${role}`);

    return NextResponse.json({ 
      ok: true, 
      user: updatedUser,
      message: `Role updated to ${role}` 
    });
  } catch (error) {
    console.error("Role update failed:", error);
    return NextResponse.json(
      { error: "Failed to update role" }, 
      { status: 500 }
    );
  }
}