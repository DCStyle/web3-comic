import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { LibraryHero } from "@/components/library/LibraryHero";
import { CreditBalance } from "@/components/library/CreditBalance";
import { ReadingInsights } from "@/components/library/ReadingInsights";
import { RecommendedComics } from "@/components/library/RecommendedComics";
import { ReadingStreak } from "@/components/library/ReadingStreak";
import { LibraryGridEnhanced } from "@/components/library/LibraryGridEnhanced";
import { ContinueReading } from "@/components/library/ContinueReading";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/connect-wallet");
  }

  // Get all unlocked chapters grouped by comic
  const unlockedChapters = await prisma.userChapterUnlock.findMany({
    where: { userId: session.user.id },
    include: {
      chapter: {
        include: {
          volume: {
            include: {
              comic: {
                include: {
                  tags: {
                    select: { name: true },
                  },
                },
              },
            },
          },
          pages: {
            select: { id: true },
          },
        },
      },
    },
    orderBy: { unlockedAt: "desc" },
  });

  // Get user's credit balance
  const userCredits = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      creditsBalance: true,
      createdAt: true
    }
  });



  const streakData = {
    currentStreak: 7,
    longestStreak: 14,
    todayRead: true,
    streakHistory: [true, true, false, true, true, true, true],
    achievements: [
      {
        id: '1',
        title: 'First Steps',
        description: 'Read your first chapter',
        icon: 'star',
        unlocked: true
      },
      {
        id: '2',
        title: 'Week Warrior',
        description: 'Maintain a 7-day reading streak',
        icon: 'flame',
        unlocked: true
      },
      {
        id: '3',
        title: 'Collector',
        description: 'Unlock 50 chapters',
        icon: 'trophy',
        unlocked: false,
        progress: unlockedChapters.length,
        target: 50
      }
    ],
    nextMilestone: {
      days: 14,
      reward: '100 bonus credits'
    }
  };

  // Mock recommended comics data
  const recommendedComics = [
    {
      id: '1',
      title: 'Epic Adventure Tales',
      slug: 'epic-adventure',
      author: 'John Creator',
      coverImage: '/placeholder-comic.jpg',
      genre: ['Adventure', 'Fantasy'],
      status: 'ONGOING' as const,
      rating: 4.8,
      totalChapters: 45,
      freeChapters: 3,
      popularity: 92,
      reason: 'Because you love adventure comics',
      tags: ['Popular', 'New'],
      description: 'An epic tale of heroes and magic',
      estimatedReadTime: 25,
      isNew: true,
      isTrending: true
    }
  ];

  const userGenres = ['Adventure', 'Fantasy', 'Action'];

  // Get reading progress for all chapters
  const readingProgress = await prisma.readingProgress.findMany({
    where: { userId: session.user.id },
    include: {
      chapter: {
        include: {
          volume: {
            include: {
              comic: true,
            },
          },
          pages: {
            select: { id: true },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Group unlocked chapters by comic
  const comicsMap = new Map();
  
  unlockedChapters.forEach(unlock => {
    const comic = unlock.chapter.volume.comic;
    if (!comicsMap.has(comic.id)) {
      comicsMap.set(comic.id, {
        ...comic,
        unlockedChapters: [],
        lastUnlockedAt: unlock.unlockedAt,
      });
    }
    comicsMap.get(comic.id).unlockedChapters.push({
      ...unlock.chapter,
      unlockedAt: unlock.unlockedAt,
    });
  });

  const unlockedComics = Array.from(comicsMap.values()).sort(
    (a, b) => new Date(b.lastUnlockedAt).getTime() - new Date(a.lastUnlockedAt).getTime()
  );

  // Calculate reading statistics
  const readingStats = {
    totalComics: unlockedComics.length,
    totalChapters: unlockedChapters.length,
    readingProgress: readingProgress.filter(p => p.pageNumber < p.chapter.pages.length).length,
    completedComics: unlockedComics.filter(comic => 
      readingProgress.some(p => 
        p.chapter.volume.comic.id === comic.id && 
        p.pageNumber >= p.chapter.pages.length
      )
    ).length,
    readingStreak: 7, // This should be calculated from actual reading history
    minutesRead: readingProgress.length * 15 // Estimate based on chapters read
  };

  // Mock data for new components (in production, fetch from database)
  const weeklyData = [
    { day: 'Mon', chaptersRead: 2, minutesRead: 45 },
    { day: 'Tue', chaptersRead: 1, minutesRead: 20 },
    { day: 'Wed', chaptersRead: 3, minutesRead: 60 },
    { day: 'Thu', chaptersRead: 0, minutesRead: 0 },
    { day: 'Fri', chaptersRead: 2, minutesRead: 40 },
    { day: 'Sat', chaptersRead: 4, minutesRead: 80 },
    { day: 'Sun', chaptersRead: 1, minutesRead: 25 },
  ];

  const monthlyStats = {
    totalChapters: readingProgress.length,
    totalMinutes: readingProgress.length * 15,
    averageDaily: readingProgress.length / 30,
    goalProgress: 75,
    longestStreak: 14,
    favoriteGenres: ['Action', 'Adventure', 'Fantasy']
  };

  const goals = {
    daily: { target: 2, current: 1 },
    weekly: { target: 10, current: 7 },
    monthly: { target: 40, current: 28 }
  };

  // Get continue reading suggestions (last 5 chapters with progress)
  const continueReadingItems = readingProgress
    .slice(0, 5)
    .map(progress => ({
      chapter: progress.chapter,
      currentPage: progress.pageNumber,
      totalPages: progress.chapter.pages.length,
      lastReadAt: progress.updatedAt,
      isComplete: progress.pageNumber >= progress.chapter.pages.length,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Hero Section */}
      <LibraryHero 
        user={{
          username: session.user.username || 'Reader',
          address: session.user.address
        }}
        stats={readingStats}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 space-y-16">
        {/* Credit Balance */}
        <section>
          <CreditBalance
            balance={userCredits?.creditsBalance || 0}
            recentSpending={25}
            totalEarned={150}
            weeklySpent={15}
            nextUnlock={continueReadingItems.length > 0 ? {
              comicTitle: continueReadingItems[0].chapter.volume.comic.title,
              chapterTitle: continueReadingItems[0].chapter.title,
              cost: 5
            } : undefined}
            specialOffer={{
              title: "Weekend Bonus Pack",
              discount: 25,
              originalPrice: 19.99,
              discountedPrice: 14.99,
              expires: "2 days"
            }}
          />
        </section>

        {/* Reading Streak */}
        <section>
          <ReadingStreak
            currentStreak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
            todayRead={streakData.todayRead}
            streakHistory={streakData.streakHistory}
            achievements={streakData.achievements}
            nextMilestone={streakData.nextMilestone}
          />
        </section>

        {/* Continue Reading Section */}
        {continueReadingItems.length > 0 && (
          <section>
            <ContinueReading items={continueReadingItems} />
          </section>
        )}

        {/* Reading Insights */}
        <section>
          <ReadingInsights
            weeklyData={weeklyData}
            monthlyStats={monthlyStats}
            goals={goals}
          />
        </section>

        {/* Recommended Comics */}
        <section>
          <RecommendedComics
            recommendations={recommendedComics}
            userGenres={userGenres}
            loading={false}
          />
        </section>

        {/* Library Grid */}
        <section>
          {unlockedComics.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">My Collection</h2>
                  <p className="text-muted-foreground text-sm">
                    Your unlocked comics and reading progress
                  </p>
                </div>
              </div>
              <LibraryGridEnhanced comics={unlockedComics} />
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-100 backdrop-blur-sm rounded-2xl p-12 border border-gray-200 w-full mx-auto">
                <div className="text-6xl mb-6">📚</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Build Your Library
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Start unlocking premium chapters to build your personal comic collection and track your reading journey.
                </p>
                <div className="space-y-4">
                  <a
                    href="/comics"
                    className="block max-w-md mx-auto bg-gradient-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-glow"
                  >
                    Discover Comics
                  </a>
                  <a
                    href="/featured"
                    className="block max-w-md mx-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors backdrop-blur-sm border border-gray-300"
                  >
                    View Featured
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}