import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { ComicDetail } from "@/components/comic/ComicDetail";
import { getGenreStatistics } from "@/lib/utils/genre-stats";

interface ComicPageProps {
  params: {
    slug: string;
  };
}

export default async function ComicPage({ params }: ComicPageProps) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  // Fetch comic data and genre statistics in parallel
  const [comic, genreStats] = await Promise.all([
    prisma.comic.findUnique({
      where: { slug },
      include: {
        volumes: {
          include: {
            chapters: {
              include: {
                pages: {
                  select: { id: true },
                },
                unlocks: session?.user?.id ? {
                  where: { userId: session.user.id },
                  select: { id: true },
                } : false,
              },
              orderBy: { chapterNumber: "asc" },
            },
          },
          orderBy: { volumeNumber: "asc" },
        },
        tags: {
          select: { name: true },
        },
      },
    }),
    getGenreStatistics(),
  ]);

  if (!comic) {
    notFound();
  }

  // Get user's credit balance if authenticated
  let userCredits = 0;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { creditsBalance: true },
    });
    userCredits = user?.creditsBalance || 0;
  }

  return (
    <ComicDetail 
      comic={comic} 
      userId={session?.user?.id || null} 
      userCredits={userCredits}
      genreStats={genreStats}
    />
  );
}