"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseGenres } from "@/lib/utils/genre";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { FloatingElements } from "@/components/ui/floating-elements";
import { Book, Clock, User, Star, Lock, CheckCircle, Wallet, Calendar, Eye, Unlock, BookOpen, Zap } from "lucide-react";
import { AuthPromptModal } from "@/components/guest/AuthPromptModal";
import { PopularGenres } from "@/components/comic/sidebar/PopularGenres";
import { RelatedComics } from "@/components/comic/sidebar/RelatedComics";
import { RecommendedSection } from "@/components/comic/sidebar/RecommendedSection";
import { SidebarSkeleton } from "@/components/comic/sidebar/SidebarSkeleton";
import { CommentsSection } from "@/components/comic/CommentsSection";
import type { GenreStatistic } from "@/lib/utils/genre-stats";

interface ComicDetailProps {
    comic: {
        id: string;
        title: string;
        slug: string;
        description: string;
        author: string;
        coverImage: string;
        genre: string[];
        status: "ONGOING" | "COMPLETED" | "HIATUS";
        freeChapters: number;
        featured: boolean;
        createdAt: Date;
        updatedAt: Date;
        volumes: Array<{
            id: string;
            volumeNumber: number;
            title: string;
            chapters: Array<{
                id: string;
                chapterNumber: number;
                title: string;
                unlockCost: number;
                isFree: boolean;
                publishedAt: Date;
                pages: Array<{ id: string }>;
                unlocks: Array<{ id: string }>;
            }>;
        }>;
        tags: Array<{ name: string }>;
    };
    userId: string | null;
    userCredits?: number;
    sidebarLoading?: boolean;
    genreStats?: GenreStatistic[];
}

export function ComicDetail({ comic, userId, userCredits = 0, sidebarLoading = false, genreStats = [] }: ComicDetailProps) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const isAuthenticated = userId !== null;

    // Calculate chapter positions for free chapter logic
    const allChapters = comic.volumes
        .flatMap(volume => volume.chapters.map(chapter => ({ ...chapter, volumeId: volume.id })))
        .sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime())
        .map((chapter, index) => ({ ...chapter, position: index + 1 }));

    const totalChapters = allChapters.length;
    const totalPages = allChapters.reduce((total, chapter) => total + chapter.pages.length, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                    <Image
                        src={comic.coverImage}
                        alt={`${comic.title} background`}
                        fill
                        className="object-cover blur-xl scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
                    <div className="absolute inset-0 bg-gradient-hero opacity-20" />
                </div>

                <FloatingElements count={20} variant="geometric" animated />

                {/* Hero Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        {/* Cover Image */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="aspect-[3/4] w-80 relative overflow-hidden rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 glow-pulse">
                                    <Image
                                        src={comic.coverImage}
                                        alt={`${comic.title} cover`}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                {comic.featured && (
                                    <div className="absolute -top-4 -right-4">
                                        <AnimatedBadge
                                            variant="gradient"
                                            size="xl"
                                            animation="glow"
                                            icon={<Star className="h-5 w-5" />}
                                        >
                                            Featured
                                        </AnimatedBadge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comic Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
                                  <span className="text-gradient bg-gradient-hero">
                                    {comic.title}
                                  </span>
                                </h1>

                                <div className="flex items-center gap-4 text-xl">
                                    <User className="h-6 w-6 text-primary" />
                                    <span className="font-semibold">by {comic.author}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-4">
                                <AnimatedBadge
                                    variant="neon"
                                    size="xl"
                                    icon={<Book className="h-5 w-5" />}
                                >
                                    {totalChapters} Chapters
                                </AnimatedBadge>
                                <AnimatedBadge
                                    variant="glass"
                                    size="xl"
                                    icon={<Eye className="h-5 w-5" />}
                                >
                                    {totalPages} Pages
                                </AnimatedBadge>
                                <AnimatedBadge
                                    variant="gradient"
                                    size="xl"
                                    icon={<Calendar className="h-5 w-5" />}
                                >
                                    Updated {new Date(comic.updatedAt).toLocaleDateString()}
                                </AnimatedBadge>
                            </div>

                            {/* Genres & Status */}
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-3">
                                    {parseGenres(comic.genre).map((genre) => (
                                        <AnimatedBadge
                                            key={genre}
                                            variant="secondary"
                                            size="lg"
                                        >
                                            {genre}
                                        </AnimatedBadge>
                                    ))}
                                </div>

                                <AnimatedBadge
                                    variant={
                                        comic.status === "ONGOING"
                                            ? "info"
                                            : comic.status === "COMPLETED"
                                                ? "success"
                                                : "warning"
                                    }
                                    size="lg"
                                    icon={
                                        comic.status === "ONGOING" ? <Clock className="h-4 w-4" /> :
                                            comic.status === "COMPLETED" ? <CheckCircle className="h-4 w-4" /> :
                                                <Clock className="h-4 w-4" />
                                    }
                                    animation={comic.status === "ONGOING" ? "pulse" : "none"}
                                >
                                    {comic.status.toLowerCase()}
                                </AnimatedBadge>
                            </div>

                            {/* Description */}
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {comic.description}
                            </p>

                            {/* Free Chapters Notice */}
                            {comic.freeChapters > 0 && (
                                <div className="p-6 bg-white rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-green-400" />
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800">
                                                First {comic.freeChapters} chapters are free!
                                            </p>
                                            <p className="text-gray-600">
                                                Start reading without any cost
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Chapters Section with Sidebar */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <AnimatedBadge
                            variant="gradient"
                            size="xl"
                            icon={<BookOpen className="h-5 w-5" />}
                            className="mb-6"
                        >
                            Chapter List
                        </AnimatedBadge>
                        <h2 className="text-4xl font-display font-bold mb-4">
                            <span className="text-gradient">Start Reading</span>
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Choose a chapter to begin your adventure
                        </p>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
                        {/* Main Content - 70% */}
                        <div className="xl:col-span-7">
                            <div className="space-y-8">
                                {comic.volumes.map((volume, volumeIndex) => (
                                    <GlowCard key={volume.id} variant="comic" shimmer>
                                        <div className="space-y-6">
                                            {/* Volume Header */}
                                            <div className="border-b border-primary/20 pb-4">
                                                <h3 className="text-2xl font-display font-bold text-gradient">
                                                    Volume {volume.volumeNumber}: {volume.title}
                                                </h3>
                                            </div>

                                            {/* Chapters Grid */}
                                            <div className="grid gap-4">
                                                {volume.chapters.map((chapter) => {
                                                    const chapterData = allChapters.find(c => c.id === chapter.id);
                                                    const isUnlocked = isAuthenticated && chapter.unlocks.length > 0;
                                                    const isFree = chapter.isFree || (chapterData?.position || 0) <= comic.freeChapters;
                                                    const canRead = isUnlocked || isFree;

                                                    return (
                                                        <div
                                                            key={chapter.id}
                                                            className="flex items-center justify-between p-4 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow/20 group"
                                                        >
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex items-center gap-3">
                                                                    <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                                                        Chapter {chapter.chapterNumber}: {chapter.title}
                                                                    </h4>

                                                                    <div className="flex gap-2">
                                                                        {isFree && (
                                                                            <AnimatedBadge
                                                                                variant="success"
                                                                                icon={<CheckCircle className="h-3 w-3" />}
                                                                            >
                                                                                Free
                                                                            </AnimatedBadge>
                                                                        )}
                                                                        {isUnlocked && !isFree && (
                                                                            <AnimatedBadge
                                                                                variant="info"
                                                                                icon={<Unlock className="h-3 w-3" />}
                                                                            >
                                                                                Unlocked
                                                                            </AnimatedBadge>
                                                                        )}
                                                                        {!canRead && (
                                                                            <AnimatedBadge
                                                                                variant="warning"
                                                                                icon={<Lock className="h-3 w-3" />}
                                                                            >
                                                                                {chapter.unlockCost} Credits
                                                                            </AnimatedBadge>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                    <span className="flex items-center gap-1">
                                                                    <Eye className="h-4 w-4" />
                                                                      {chapter.pages.length} pages
                                                                    </span>
                                                                    <span>Published {new Date(chapter.publishedAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                {canRead ? (
                                                                    <Link href={`/comics/${comic.slug}/chapter/${chapter.id}`}>
                                                                        <GradientButton
                                                                            variant="primary"
                                                                            size="lg"
                                                                            icon={<BookOpen className="h-5 w-5" />}
                                                                        >
                                                                            Read Now
                                                                        </GradientButton>
                                                                    </Link>
                                                                ) : isAuthenticated ? (
                                                                    <Link href={`/comics/${comic.slug}/chapter/${chapter.id}`}>
                                                                        <GradientButton
                                                                            variant="accent"
                                                                            size="lg"
                                                                            icon={<Zap className="h-5 w-5" />}
                                                                        >
                                                                            Unlock ({chapter.unlockCost} Credits)
                                                                        </GradientButton>
                                                                    </Link>
                                                                ) : (
                                                                    <GradientButton
                                                                        variant="neon"
                                                                        size="lg"
                                                                        onClick={() => setShowAuthModal(true)}
                                                                        icon={<Wallet className="h-5 w-5" />}
                                                                    >
                                                                        Connect to Unlock
                                                                    </GradientButton>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </GlowCard>
                                ))}
                                
                                {/* Comments Section */}
                                <CommentsSection
                                    comicSlug={comic.slug}
                                    comicTitle={comic.title}
                                    loading={false}
                                />
                                
                                <AuthPromptModal
                                    isOpen={showAuthModal}
                                    onClose={() => setShowAuthModal(false)}
                                    trigger="premium_content"
                                />
                            </div>
                        </div>

                        {/* Sidebar - 30% */}
                        <div className="xl:col-span-3">
                            <div className="sticky top-24">
                                {sidebarLoading ? (
                                    <SidebarSkeleton />
                                ) : (
                                    <div className="space-y-6">
                                        {/* Popular Genres */}
                                        <PopularGenres 
                                            genres={genreStats}
                                            loading={sidebarLoading} 
                                        />
                                        
                                        {/* Related Comics */}
                                        <RelatedComics 
                                            currentComicId={comic.id}
                                            loading={sidebarLoading} 
                                        />
                                        
                                        {/* Recommended Section */}
                                        <RecommendedSection 
                                            userId={userId}
                                            userCredits={userCredits}
                                            loading={sidebarLoading}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}