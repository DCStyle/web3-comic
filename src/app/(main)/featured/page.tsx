import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { HeroCarousel } from "@/components/featured/HeroCarousel";
import { FeaturedGrid } from "@/components/featured/FeaturedGrid";
import { TrendingComics } from "@/components/featured/TrendingComics";
import { NewReleases } from "@/components/featured/NewReleases";
import Link from "next/link";

export default async function FeaturedPage() {
  const session = await getServerSession(authOptions);

  // Fetch top featured comics for hero carousel
  const heroComics = await prisma.comic.findMany({
    where: { featured: true },
    include: {
      volumes: {
        include: {
          chapters: {
            select: { id: true },
          },
        },
        orderBy: { volumeNumber: "asc" },
      },
      tags: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Fetch all featured comics
  const featuredComics = await prisma.comic.findMany({
    where: { featured: true },
    include: {
      volumes: {
        include: {
          chapters: {
            select: { id: true },
          },
        },
      },
      tags: {
        select: { name: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 12,
  });

  // Fetch trending comics (based on recent chapter unlocks)
  const trendingComics = await prisma.comic.findMany({
    include: {
      volumes: {
        include: {
          chapters: {
            include: {
              unlocks: {
                where: {
                  unlockedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                  },
                },
                select: { id: true },
              },
            },
          },
        },
      },
      tags: {
        select: { name: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 8,
  });

  // Calculate trending score and sort
  const trendingWithScore = trendingComics
    .map(comic => ({
      ...comic,
      trendingScore: comic.volumes.reduce((total, volume) => 
        total + volume.chapters.reduce((chapterTotal, chapter) => 
          chapterTotal + chapter.unlocks.length, 0), 0),
    }))
    .filter(comic => comic.trendingScore > 0)
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 6);

  // Fetch new releases (comics created in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newReleases = await prisma.comic.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    include: {
      volumes: {
        include: {
          chapters: {
            select: { id: true },
          },
        },
      },
      tags: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Carousel */}
      {heroComics.length > 0 && (
        <HeroCarousel comics={heroComics} />
      )}

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Featured Comics Section */}
        {featuredComics.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                ⭐ Editor's Choice
              </h2>
              <p className="text-white/70">
                Hand-picked premium comics recommended by our editorial team
              </p>
            </div>
            <FeaturedGrid comics={featuredComics} />
          </section>
        )}

        {/* Trending Section */}
        {trendingWithScore.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                🔥 Trending Now
              </h2>
              <p className="text-white/70">
                Most popular comics this week based on reader activity
              </p>
            </div>
            <TrendingComics comics={trendingWithScore} />
          </section>
        )}

        {/* New Releases Section */}
        {newReleases.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                ✨ New Releases
              </h2>
              <p className="text-white/70">
                Fresh content added in the last 30 days
              </p>
            </div>
            <NewReleases comics={newReleases} />
          </section>
        )}

        {/* Special Offers Section */}
        <section>
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              🎁 Special Launch Offer
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Get 50% bonus credits on your first purchase! 
              Perfect time to start building your comic library.
            </p>
            <div className="space-y-3">
              <Link
                href="/credits"
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Claim Offer
              </Link>
              <div className="text-yellow-200/80 text-sm">
                ⏰ Limited time offer • New users only
              </div>
            </div>
          </div>
        </section>

        {/* Browse All Section */}
        <section className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Explore More Comics
            </h2>
            <p className="text-white/70 mb-6 max-w-xl mx-auto">
              Discover thousands of comics across all genres. 
              From action-packed adventures to heartwarming romances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/comics"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Browse All Comics
              </Link>
              <Link
                href="/genres/action"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-lg border border-white/30 transition-colors"
              >
                Browse by Genre
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}