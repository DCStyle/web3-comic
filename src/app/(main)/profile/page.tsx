import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { RecentActivity } from "@/components/profile/RecentActivity";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { FloatingElements } from "@/components/ui/floating-elements";
import { AnimatedBadge } from "@/components/ui/animated-badge";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/connect-wallet");
  }

  // Fetch user with complete profile data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      readingProgress: {
        include: {
          chapter: {
            include: {
              volume: {
                include: {
                  comic: {
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                      coverImage: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
      unlockedChapters: {
        include: {
          chapter: {
            include: {
              volume: {
                include: {
                  comic: {
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                      coverImage: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { unlockedAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/connect-wallet");
  }

  // Calculate profile statistics
  const stats = {
    totalCreditsEarned: user.transactions
      .filter(t => t.type === "PURCHASE")
      .reduce((sum, t) => sum + t.amount, 0),
    totalCreditsSpent: user.transactions
      .filter(t => t.type === "SPEND")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0), // SPEND amounts are negative, so take absolute value
    chaptersUnlocked: user.unlockedChapters.length,
    comicsInLibrary: new Set(
      user.unlockedChapters.map(unlock => unlock.chapter.volume.comic.id)
    ).size,
    readingStreak: await calculateReadingStreak(user.id),
    totalReadingTime: user.readingProgress.length * 5, // Estimate 5 mins per chapter
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <FloatingElements count={20} variant="geometric" animated />
      <FloatingElements count={10} variant="subtle" />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Profile Header with Achievement Badges */}
          <ProfileHeader user={user} />
        </div>
      </section>

      {/* Main Content */}
      <section className="relative">
        <div className="container mx-auto px-4 pb-16 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Stats and Activity */}
            <div className="lg:col-span-2 space-y-8">
              <ProfileStats stats={stats} />
              <RecentActivity 
                transactions={user.transactions}
                readingProgress={user.readingProgress}
                recentUnlocks={user.unlockedChapters}
              />
            </div>

            {/* Settings Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSettings user={user} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function to calculate reading streak
async function calculateReadingStreak(userId: string): Promise<number> {
  const progress = await prisma.readingProgress.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 30, // Look at last 30 entries
  });

  if (progress.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Start of today

  // Group progress by date
  const progressByDate = new Map();
  progress.forEach(p => {
    const date = new Date(p.updatedAt);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString();
    progressByDate.set(dateStr, true);
  });

  // Calculate consecutive days
  while (progressByDate.has(currentDate.toISOString())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}