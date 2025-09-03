import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const progressSchema = z.object({
  currentPage: z.number().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPage } = progressSchema.parse(body);

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
      include: {
        volume: {
          include: {
            comic: true,
          },
        },
        pages: true,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Verify user can read this chapter
    const isUnlocked = await prisma.userChapterUnlock.findUnique({
      where: {
        userId_chapterId: {
          userId: session.user.id,
          chapterId: params.chapterId,
        },
      },
    });

    // Calculate if chapter is free
    const allChapters = await prisma.chapter.findMany({
      where: {
        volume: {
          comicId: chapter.volume.comic.id,
        },
      },
      include: {
        volume: true,
      },
      orderBy: [
        { volume: { volumeNumber: "asc" } },
        { chapterNumber: "asc" },
      ],
    });

    const currentChapterIndex = allChapters.findIndex(c => c.id === params.chapterId);
    const chapterPosition = currentChapterIndex + 1;
    const isFree = chapter.isFree || chapterPosition <= chapter.volume.comic.freeChapters;

    if (!isUnlocked && !isFree) {
      return NextResponse.json({ error: "Chapter not unlocked" }, { status: 403 });
    }

    // Validate page number
    if (currentPage > chapter.pages.length) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }

    // Update or create reading progress
    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_chapterId: {
          userId: session.user.id,
          chapterId: params.chapterId,
        },
      },
      update: {
        pageNumber: currentPage,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        chapterId: params.chapterId,
        pageNumber: currentPage,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    console.error("Progress update error:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}