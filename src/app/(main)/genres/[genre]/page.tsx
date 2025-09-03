import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { ComicGrid } from "@/components/comic/ComicGrid";
import { ComicsPagination } from "@/components/comic/ComicsPagination";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { FloatingElements } from "@/components/ui/floating-elements";
import { BookOpen, Library, TrendingUp, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface GenrePageProps {
	params: Promise<{
		genre: string;
	}>;
	searchParams: Promise<{
		page?: string;
	}>;
}

// Helper function to convert URL-friendly genre to display format
function formatGenreForDisplay(urlGenre: string): string {
	return urlGenre
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

// Helper function to convert URL-friendly genre to database search format
function formatGenreForSearch(urlGenre: string): string {
	return urlGenre
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
	const session = await getServerSession(authOptions);
	const { genre: urlGenre } = await params;
	const { page: pageParam } = await searchParams;
	
	const page = parseInt(pageParam || "1");
	const limit = 24;
	const offset = (page - 1) * limit;
	
	// Convert URL genre to search format
	const genreToSearch = formatGenreForSearch(urlGenre);
	const displayGenre = formatGenreForDisplay(urlGenre);
	
	// Build where clause for genre filtering
	const where = {
		genre: { contains: genreToSearch },
	};
	
	// Fetch data
	const [comics, totalCount] = await Promise.all([
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
	]);
	
	// If no comics found for this genre, show 404
	if (totalCount === 0) {
		notFound();
	}
	
	const totalPages = Math.ceil(totalCount / limit);
	
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
			{/* Hero Section */}
			<section className="relative py-24 overflow-hidden">
				{/* Background Elements */}
				<div className="absolute inset-0 bg-gradient-hero opacity-10" />
				<FloatingElements count={15} variant="subtle" animated />
				
				<div className="container mx-auto px-4 text-center relative z-10">
					<div className="max-w-4xl mx-auto">
						{/* Back Navigation */}
						<div className="mb-8 flex justify-center">
							<Link href="/comics">
								<GradientButton
									variant="ghost"
									size="lg"
									icon={<ArrowLeft className="h-5 w-5" />}
								>
									Back to All Comics
								</GradientButton>
							</Link>
						</div>
						
						{/* Hero Badge */}
						<AnimatedBadge
							variant="gradient"
							size="xl"
							animation="float"
							icon={<Library className="h-5 w-5" />}
							className="mb-8"
						>
							{displayGenre} Comics
						</AnimatedBadge>
						
						{/* Hero Title */}
						<h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="text-gradient bg-gradient-hero">
                {displayGenre}
              </span>
							<br />
							<span className="text-foreground">
                Collection
              </span>
						</h1>
						
						{/* Hero Subtitle */}
						<p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
							Discover amazing {displayGenre.toLowerCase()} comics from our extensive collection
						</p>
						
						{/* Stats */}
						<div className="flex justify-center mb-12">
							<AnimatedBadge
								variant="neon"
								size="xl"
								animation="glow"
								icon={<BookOpen className="h-5 w-5" />}
							>
								{totalCount.toLocaleString()} {displayGenre} Comics
							</AnimatedBadge>
						</div>
					</div>
				</div>
			</section>
			
			{/* Main Content */}
			<section className="relative mt-8 lg:mt-12">
				<div className="container mx-auto px-4 pb-16">
					<Suspense fallback={<ComicsLoading />}>
						{/* Results Info */}
						<div className="mb-8">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div className="flex items-center gap-3">
									<AnimatedBadge
										variant="info"
										icon={<BookOpen className="h-4 w-4" />}
									>
										{totalCount.toLocaleString()} comics found
									</AnimatedBadge>
									<span className="text-sm text-muted-foreground">
                    Showing {offset + 1}-{Math.min(offset + limit, totalCount)}
                  </span>
								</div>
								
								<AnimatedBadge
									variant="warning"
									animation="pulse"
									icon={<TrendingUp className="h-4 w-4" />}
								>
									{displayGenre} Genre
								</AnimatedBadge>
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
									baseUrl={`/genres/${urlGenre}`}
								/>
							</div>
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

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ genre: string }> }) {
	const { genre } = await params;
	const displayGenre = formatGenreForDisplay(genre);
	
	return {
		title: `${displayGenre} Comics - Web3 Comic Platform`,
		description: `Discover amazing ${displayGenre.toLowerCase()} comics. Read the best ${displayGenre.toLowerCase()} stories from our extensive collection.`,
	};
}