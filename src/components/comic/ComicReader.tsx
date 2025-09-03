"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { GlowCard } from "@/components/ui/glow-card";
import { FloatingElements } from "@/components/ui/floating-elements";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Menu,
  Lock,
  CreditCard,
  Eye,
  EyeOff,
  BookOpen,
  Zap,
  Settings,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UnlockModal } from "@/components/comic/UnlockModal";

interface Page {
  id: string;
  pageNumber: number;
  imageUrl: string;
}

interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  unlockCost: number;
  pages: Page[];
  volume: {
    volumeNumber: number;
    title: string;
    comic: {
      id: string;
      title: string;
      slug: string;
      freeChapters: number;
    };
  };
}

interface ComicReaderProps {
  chapter: Chapter;
  comic: {
    id: string;
    title: string;
    slug: string;
    freeChapters: number;
  };
  canRead: boolean;
  isUnlocked: boolean;
  isFree: boolean;
  userId: string;
  initialPage: number;
  previousChapter?: {
    id: string;
    chapterNumber: number;
    title: string;
    volume: { volumeNumber: number };
  } | null;
  nextChapter?: {
    id: string;
    chapterNumber: number;
    title: string;
    volume: { volumeNumber: number };
  } | null;
}

export function ComicReader({
  chapter,
  comic,
  canRead,
  isUnlocked,
  isFree,
  userId,
  initialPage,
  previousChapter,
  nextChapter,
}: ComicReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showUI, setShowUI] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPages = chapter.pages.length;
  const currentPageData = chapter.pages.find(p => p.pageNumber === currentPage);

  // Auto-hide UI after 3 seconds of inactivity
  useEffect(() => {
    if (!showUI) return;
    
    const timer = setTimeout(() => {
      setShowUI(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showUI, currentPage]);

  // Save reading progress
  useEffect(() => {
    if (!canRead) return;

    const saveProgress = async () => {
      try {
        await fetch(`/api/comics/${comic.id}/chapters/${chapter.id}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPage }),
        });
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    };

    const debounce = setTimeout(saveProgress, 1000);
    return () => clearTimeout(debounce);
  }, [currentPage, canRead, comic.id, chapter.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setShowUI(true);
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
        setShowUI(true);
      } else if (e.key === " ") {
        e.preventDefault();
        setShowUI(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, totalPages]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setShowUI(true);
    }
  }, [totalPages]);

  const handleUnlock = () => {
    setShowUnlockModal(true);
  };

  if (!canRead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
        <FloatingElements count={20} variant="subtle" />
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        
        <GlowCard variant="gradient" className="max-w-lg mx-auto text-center relative z-10">
          <div className="p-12">
            {/* Lock Icon with Animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center glow-pulse">
                <Lock className="h-12 w-12 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-4xl font-display font-bold mb-4 text-gradient">
              Chapter Locked
            </h2>
            
            {/* Chapter Info */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Chapter {chapter.chapterNumber}: {chapter.title}
              </h3>
              <p className="text-muted-foreground">
                From {comic.title} - Volume {chapter.volume.volumeNumber}
              </p>
            </div>

            {/* Unlock Cost */}
            <div className="mb-8">
              <AnimatedBadge
                variant="warning"
                size="xl"
                animation="pulse"
                icon={<Zap className="h-5 w-5" />}
              >
                {chapter.unlockCost} Credits Required
              </AnimatedBadge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <GradientButton 
                onClick={handleUnlock} 
                variant="primary"
                size="xl"
                icon={<CreditCard className="h-5 w-5" />}
                className="w-full"
              >
                Unlock Chapter ({chapter.unlockCost} Credits)
              </GradientButton>
              
              <Link href={`/comics/${comic.slug}`}>
                <GradientButton 
                  variant="outline" 
                  size="lg"
                  icon={<ArrowLeft className="h-5 w-5" />}
                  className="w-full"
                >
                  Back to Comic Details
                </GradientButton>
              </Link>
              
              <Link href="/">
                <GradientButton 
                  variant="ghost" 
                  size="lg"
                  icon={<Home className="h-5 w-5" />}
                  className="w-full"
                >
                  Home
                </GradientButton>
              </Link>
            </div>
          </div>
        </GlowCard>
        
        <UnlockModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          chapterId={chapter.id}
          chapterTitle={`Chapter ${chapter.chapterNumber}: ${chapter.title}`}
          unlockCost={chapter.unlockCost}
          userId={userId}
          comicId={comic.id}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Main Image */}
      <div 
        className="relative w-full h-screen flex items-center justify-center cursor-pointer"
        onClick={() => setShowUI(prev => !prev)}
      >
        {currentPageData && (
          <div className="relative max-w-full max-h-full">
            <Image
              src={currentPageData.imageUrl}
              alt={`Page ${currentPage} of ${chapter.title}`}
              width={800}
              height={1200}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>
        )}

        {/* Navigation Zones */}
        {currentPage > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPage(currentPage - 1);
            }}
            className="absolute left-0 top-0 w-1/4 h-full z-10 hover:bg-white/5 transition-colors"
            aria-label="Previous page"
          />
        )}
        {currentPage < totalPages && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPage(currentPage + 1);
            }}
            className="absolute right-0 top-0 w-1/4 h-full z-10 hover:bg-white/5 transition-colors"
            aria-label="Next page"
          />
        )}
      </div>

      {/* Top UI Bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 transition-all duration-500 z-20",
          showUI ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        <div className="glass-dark m-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Link href={`/comics/${comic.slug}`}>
                <GradientButton variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
                  <span className="hidden sm:inline">Back</span>
                </GradientButton>
              </Link>
              <div>
                <h1 className="text-white font-display font-bold text-lg">{comic.title}</h1>
                <p className="text-white/70 text-sm">
                  Vol {chapter.volume.volumeNumber}, Ch {chapter.chapterNumber}: {chapter.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isFree && (
                <AnimatedBadge variant="success" icon={<BookOpen className="h-3 w-3" />}>
                  Free
                </AnimatedBadge>
              )}
              {isUnlocked && !isFree && (
                <AnimatedBadge variant="info" icon={<Zap className="h-3 w-3" />}>
                  Unlocked
                </AnimatedBadge>
              )}
              <GradientButton
                variant="glass"
                size="sm"
                onClick={() => setShowUI(prev => !prev)}
                icon={showUI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              >
                <span className="hidden sm:inline">
                  {showUI ? 'Hide UI' : 'Show UI'}
                </span>
              </GradientButton>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom UI Bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 transition-all duration-500 z-20",
          showUI ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        <div className="glass-dark m-4 rounded-2xl border border-white/10">
          <div className="p-4 space-y-4">
            {/* Chapter Navigation */}
            <div className="flex items-center justify-between">
              {previousChapter ? (
                <Link href={`/comics/${comic.slug}/chapter/${previousChapter.id}`}>
                  <GradientButton 
                    variant="glass" 
                    size="sm" 
                    icon={<ChevronLeft className="h-4 w-4" />}
                  >
                    <span className="hidden sm:inline">Previous</span>
                  </GradientButton>
                </Link>
              ) : <div />}
              
              {nextChapter && (
                <Link href={`/comics/${comic.slug}/chapter/${nextChapter.id}`}>
                  <GradientButton 
                    variant="primary" 
                    size="sm"
                    icon={<ChevronRight className="h-4 w-4" />}
                  >
                    <span className="hidden sm:inline">Next Chapter</span>
                  </GradientButton>
                </Link>
              )}
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-center gap-4">
              <GradientButton
                variant="glass"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                icon={<ChevronLeft className="h-4 w-4" />}
              />
              
              <AnimatedBadge variant="neon" size="lg" animation="glow">
                Page {currentPage} of {totalPages}
              </AnimatedBadge>

              <GradientButton
                variant="glass"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                icon={<ChevronRight className="h-4 w-4" />}
              />
            </div>

            {/* Enhanced Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500 glow-pulse"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                />
              </div>
              <div className="text-center text-white/60 text-xs">
                {Math.round((currentPage / totalPages) * 100)}% Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Page Selector Overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-28 transition-all duration-500 z-10",
          showUI ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex justify-center">
          <div className="glass-dark rounded-2xl border border-white/10 p-4 max-w-sm">
            <div className="text-center mb-3">
              <AnimatedBadge variant="glass" size="sm">
                Quick Jump
              </AnimatedBadge>
            </div>
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={cn(
                    "w-10 h-10 text-xs rounded-lg font-semibold transition-all duration-300 hover:scale-105",
                    page === currentPage
                      ? "bg-gradient-primary text-white shadow-glow"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}