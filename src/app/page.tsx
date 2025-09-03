import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { ComicGrid } from "@/components/comic/ComicGrid";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { FloatingElements, GeometricPattern } from "@/components/ui/floating-elements";
import Link from "next/link";
import { Sparkles, BookOpen, Users, TrendingUp, Zap, Wallet } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Fetch platform statistics
  const [
    featuredComics,
    recentComics,
    totalComics,
    totalUsers,
    totalChapters,
  ] = await Promise.all([
    prisma.comic.findMany({
      where: { featured: true },
      include: {
        volumes: {
          include: {
            chapters: {
              select: { id: true },
            },
          },
        },
      },
      take: 6,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.comic.findMany({
      include: {
        volumes: {
          include: {
            chapters: {
              select: { id: true },
            },
          },
        },
      },
      take: 8,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.comic.count(),
    prisma.user.count(),
    prisma.chapter.count(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 animated-gradient opacity-20" />
        <FloatingElements count={20} variant="geometric" animated />
        <GeometricPattern />
        
        {/* Main Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Hero Badge */}
            <div className="flex justify-center mb-8">
              <AnimatedBadge
                variant="gradient"
                size="lg"
                animation="float"
                icon={<Sparkles className="h-4 w-4" />}
              >
                Welcome to the Future of Comics
              </AnimatedBadge>
            </div>

            {/* Hero Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-6 leading-tight">
              <span className="text-gradient bg-gradient-hero">
                Web3 Comic
              </span>
              <br />
              <span className="text-foreground">
                Universe
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover extraordinary comics, unlock premium content with blockchain technology, 
              and join a community of digital comic enthusiasts.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/comics">
                <GradientButton
                  variant="primary"
                  size="xl"
                  icon={<BookOpen className="h-5 w-5" />}
                >
                  Explore Comics
                </GradientButton>
              </Link>
              
              {session ? (
                <Link href="/profile">
                  <GradientButton
                    variant="outline"
                    size="xl"
                    icon={<Users className="h-5 w-5" />}
                  >
                    My Library
                  </GradientButton>
                </Link>
              ) : (
                <Link href="/connect-wallet">
                  <GradientButton
                    variant="neon"
                    size="xl"
                    icon={<Wallet className="h-5 w-5" />}
                  >
                    Connect Wallet
                  </GradientButton>
                </Link>
              )}
            </div>

            {/* Platform Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {totalComics.toLocaleString()}+
                </div>
                <div className="text-muted-foreground uppercase tracking-wider text-sm font-semibold">
                  Comics Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {totalUsers.toLocaleString()}+
                </div>
                <div className="text-muted-foreground uppercase tracking-wider text-sm font-semibold">
                  Active Readers
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {totalChapters.toLocaleString()}+
                </div>
                <div className="text-muted-foreground uppercase tracking-wider text-sm font-semibold">
                  Chapters Published
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Comics Section */}
      {featuredComics.length > 0 && (
        <section className="py-24 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <AnimatedBadge
                variant="secondary"
                size="lg"
                icon={<TrendingUp className="h-4 w-4" />}
                className="mb-6"
              >
                Featured Content
              </AnimatedBadge>
              <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient">
                Trending Comics
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover the most popular and critically acclaimed comics in our collection
              </p>
            </div>
            <ComicGrid comics={featuredComics} />
          </div>
        </section>
      )}

      {/* Latest Updates Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedBadge
              variant="success"
              size="lg"
              icon={<Zap className="h-4 w-4" />}
              className="mb-6"
            >
              Fresh Content
            </AnimatedBadge>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient">
              Latest Updates
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay up-to-date with the newest chapters and comic releases
            </p>
          </div>
          <ComicGrid comics={recentComics} />
          
          <div className="text-center mt-12">
            <Link href="/comics">
              <GradientButton
                variant="outline"
                size="lg"
                icon={<BookOpen className="h-5 w-5" />}
              >
                View All Comics
              </GradientButton>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <FloatingElements count={15} variant="subtle" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Ready to Start Reading?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who have discovered their next favorite comic
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!session && (
              <Link href="/connect-wallet">
                <GradientButton
                  variant="outline"
                  size="xl"
                  className="bg-white text-primary hover:bg-white/90"
                  icon={<Wallet className="h-5 w-5" />}
                >
                  Get Started
                </GradientButton>
              </Link>
            )}
            <Link href="/comics">
              <GradientButton
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white hover:text-primary"
                icon={<BookOpen className="h-5 w-5" />}
              >
                Browse Library
              </GradientButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}