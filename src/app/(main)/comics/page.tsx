import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { ComicGrid } from "@/components/comic/ComicGrid";
import { ComicFilters } from "@/components/comic/ComicFilters";
import { ComicsPagination } from "@/components/comic/ComicsPagination";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { FloatingElements } from "@/components/ui/floating-elements";
import { BookOpen, Library, TrendingUp, Users, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

interface ComicsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ComicsPage({ searchParams }: ComicsPageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const limit = 24;
  const offset = (page - 1) * limit;

  // Build where clause for filtering
  const where: {
    status?: string;
    OR?: Array<{
      title?: { contains: string };
      author?: { contains: string };
      description?: { contains: string };
    }>;
  } = {};
  
  if (params.status) {
    where.status = params.status;
  }
  
  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { author: { contains: params.search } },
      { description: { contains: params.search } },
    ];
  }

  // Fetch data
  const [comics, totalCount, totalGenres, totalAuthors] = await Promise.all([
    prisma.comic.findMany({
      where,
      include: {
        volumes: {
          include: {
            chapters: {
              select: { id: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.comic.count({ where }),
    prisma.comic.groupBy({
      by: ['genre'],
    }).then(results => new Set(results.flatMap(r => Array.isArray(r.genre) ? r.genre : [r.genre])).size),
    prisma.comic.groupBy({
      by: ['author'],
    }).then(results => results.length),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  const hasFilters = params.status || params.search;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <FloatingElements count={15} variant="subtle" animated />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Hero Badge */}
            <AnimatedBadge
              variant="gradient"
              size="lg"
              animation="float"
              icon={<Library className="h-4 w-4" />}
              className="mb-8"
            >
              Comic Library
            </AnimatedBadge>

            {/* Hero Title */}
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="text-gradient bg-gradient-hero">
                Discover
              </span>
              <br />
              <span className="text-foreground">
                Amazing Stories
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Browse our extensive collection of comics, from thrilling adventures to heartwarming tales
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <AnimatedBadge
                  variant="neon"
                  size="xl"
                  animation="glow"
                  icon={<BookOpen className="h-5 w-5" />}
                >
                  {totalCount.toLocaleString()} Comics
                </AnimatedBadge>
              </div>
              <div className="text-center">
                <AnimatedBadge
                  variant="gradient"
                  size="xl"
                  icon={<TrendingUp className="h-5 w-5" />}
                >
                  {totalGenres} Genres
                </AnimatedBadge>
              </div>
              <div className="text-center">
                <AnimatedBadge
                  variant="glass"
                  size="xl"
                  icon={<Users className="h-5 w-5" />}
                >
                  {totalAuthors} Authors
                </AnimatedBadge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative">
        <div className="container mx-auto px-4 pb-16">
          {/* Filters Section */}
          <div className="mb-12">
            <ComicFilters />
          </div>

          <Suspense fallback={<ComicsLoading />}>
            {comics.length === 0 ? (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  {hasFilters ? (
                    <>
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                      <h2 className="text-3xl font-display font-bold mb-4">No Comics Found</h2>
                      <p className="text-lg text-muted-foreground mb-8">
                        Try adjusting your filters or search terms to find what you&apos;re looking for
                      </p>
                      <Link href="/comics">
                        <GradientButton
                          variant="primary"
                          size="lg"
                          icon={<Sparkles className="h-5 w-5" />}
                        >
                          Clear All Filters
                        </GradientButton>
                      </Link>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                      <h2 className="text-3xl font-display font-bold mb-4">Library Coming Soon</h2>
                      <p className="text-lg text-muted-foreground">
                        We&apos;re working hard to bring you amazing comics!
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AnimatedBadge
                        variant="info"
                        icon={<BookOpen className="h-4 w-4" />}
                      >
                        {totalCount.toLocaleString()} total comics
                      </AnimatedBadge>
                      <span className="text-sm text-muted-foreground">
                        Showing {offset + 1}-{Math.min(offset + limit, totalCount)}
                      </span>
                    </div>
                    
                    {hasFilters && (
                      <AnimatedBadge
                        variant="warning"
                        animation="pulse"
                        icon={<TrendingUp className="h-4 w-4" />}
                      >
                        Filtered Results
                      </AnimatedBadge>
                    )}
                  </div>
                </div>
                
                {/* Comics Grid */}
                <ComicGrid comics={comics} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16">
                    <ComicsPagination 
                      currentPage={page}
                      totalPages={totalPages}
                    />
                  </div>
                )}
              </>
            )}
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function ComicsLoading() {
  return (
    <div className="py-20">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Loading Comics</h3>
        <p className="text-muted-foreground">
          Preparing your reading experience...
        </p>
      </div>
      
      {/* Loading skeleton */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse"
          >
            <div className="aspect-[3/4] bg-muted rounded-xl mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded-full w-16" />
                <div className="h-6 bg-muted rounded-full w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}