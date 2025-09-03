import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { debitUser } from "@/lib/db/credit-ledger";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userId = session.user.id;
  const { chapterId } = params;

  try {
    // Get chapter details
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        volume: {
          include: {
            comic: {
              select: {
                id: true,
                title: true,
                freeChapters: true,
              }
            }
          }
        }
      }
    });
    
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Check if chapter is free
    if (chapter.isFree) {
      return NextResponse.json({ ok: true, free: true });
    }

    // Check if it's within free chapters limit
    const chapterPosition = await prisma.chapter.count({
      where: {
        volume: {
          comicId: chapter.volume.comic.id,
        },
        publishedAt: {
          lte: chapter.publishedAt,
        }
      }
    });

    if (chapterPosition <= chapter.volume.comic.freeChapters) {
      return NextResponse.json({ ok: true, free: true });
    }

    // Use atomic transaction to handle unlock
    const result = await prisma.$transaction(async (tx) => {
      // Check if already unlocked
      const existingUnlock = await tx.userChapterUnlock.findUnique({
        where: { 
          userId_chapterId: { 
            userId, 
            chapterId 
          } 
        },
      });
      
      if (existingUnlock) {
        return { ok: true, already: true };
      }

      // Check user balance
      const user = await tx.user.findUnique({ 
        where: { id: userId }, 
        select: { creditsBalance: true } 
      });
      
      if (!user || user.creditsBalance < chapter.unlockCost) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      // Deduct credits
      await debitUser(
        userId, 
        chapter.unlockCost, 
        `Unlock chapter: ${chapter.title}`,
        tx
      );
      
      // Create unlock record
      await tx.userChapterUnlock.create({ 
        data: { 
          userId, 
          chapterId, 
          creditsSpent: chapter.unlockCost 
        } 
      });

      return { ok: true, creditsSpent: chapter.unlockCost };
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Chapter unlock failed:", error);
    
    if (error?.message === "INSUFFICIENT_CREDITS") {
      return NextResponse.json(
        { error: "Insufficient credits" }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Unlock failed" }, 
      { status: 500 }
    );
  }
}