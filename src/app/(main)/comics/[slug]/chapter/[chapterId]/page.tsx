import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { ComicReader } from "@/components/comic/ComicReader";

interface ChapterPageProps {
  params: {
    slug: string;
    chapterId: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const session = await getServerSession(authOptions);
  const { slug, chapterId } = await params;

  // Fetch chapter with pages and unlock status
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
      },
      volume: {
        include: {
          comic: {
            select: {
              id: true,
              title: true,
              slug: true,
              freeChapters: true,
            },
          },
        },
      },
      unlocks: session?.user?.id ? {
        where: { userId: session.user.id },
        select: { id: true },
      } : false,
    },
  });

  if (!chapter) {
    notFound();
  }

  // Verify the slug matches the comic
  if (chapter.volume.comic.slug !== slug) {
    notFound();
  }

  // Get all chapters for navigation
  const allChapters = await prisma.chapter.findMany({
    where: {
      volume: {
        comicId: chapter.volume.comic.id,
      },
    },
    include: {
      volume: true,
      unlocks: session?.user?.id ? {
        where: { userId: session.user.id },
        select: { id: true },
      } : false,
    },
    orderBy: [
      { volume: { volumeNumber: "asc" } },
      { chapterNumber: "asc" },
    ],
  });

  // Calculate chapter position for free chapter logic
  const sortedChapters = allChapters.sort((a, b) => {
    if (a.volume.volumeNumber !== b.volume.volumeNumber) {
      return a.volume.volumeNumber - b.volume.volumeNumber;
    }
    return a.chapterNumber - b.chapterNumber;
  });

  const currentChapterIndex = sortedChapters.findIndex(c => c.id === chapterId);
  const chapterPosition = currentChapterIndex + 1;

  // Check if user can read this chapter
  const isUnlocked = Array.isArray(chapter.unlocks) && chapter.unlocks.length > 0;
  const isFree = chapter.isFree || chapterPosition <= chapter.volume.comic.freeChapters;
  const canRead = isUnlocked || isFree;

  // Get reading progress
  const readingProgress = session ? await prisma.readingProgress.findUnique({
    where: {
      userId_chapterId: {
        userId: session.user.id,
        chapterId: chapterId,
      },
    },
  }) : null;

  // Find adjacent chapters for navigation
  const previousChapter = currentChapterIndex > 0 ? sortedChapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < sortedChapters.length - 1 ? sortedChapters[currentChapterIndex + 1] : null;

  return (
    <ComicReader
      chapter={chapter}
      comic={chapter.volume.comic}
      canRead={canRead}
      isUnlocked={isUnlocked}
      isFree={isFree}
      userId={session?.user?.id || null}
      initialPage={readingProgress?.pageNumber || 1}
      previousChapter={previousChapter}
      nextChapter={nextChapter}
    />
  );
}