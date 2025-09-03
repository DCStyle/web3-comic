"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, Star, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseGenres } from "@/lib/utils/genre";

interface HeroComic {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  coverImage: string;
  genre: string[];
  status: "ONGOING" | "COMPLETED" | "HIATUS";
  freeChapters: number;
  volumes: Array<{
    chapters: Array<{ id: string }>;
  }>;
  tags: Array<{ name: string }>;
}

interface HeroCarouselProps {
  comics: HeroComic[];
}

export function HeroCarousel({ comics }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || comics.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % comics.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, comics.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % comics.length);
  };

  const prevSlide = () => {
    goToSlide(currentSlide === 0 ? comics.length - 1 : currentSlide - 1);
  };

  if (comics.length === 0) return null;

  const currentComic = comics[currentSlide];
  const totalChapters = currentComic.volumes.reduce(
    (total, volume) => total + volume.chapters.length,
    0
  );

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Images */}
      {comics.map((comic, index) => (
        <div
          key={comic.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={comic.coverImage}
            alt={`${comic.title} background`}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2">
                {parseGenres(currentComic.genre).slice(0, 3).map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                  >
                    {genre}
                  </Badge>
                ))}
                <Badge className="bg-yellow-500/90 text-black">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {currentComic.title}
              </h1>

              {/* Author & Stats */}
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-sm">by</span>
                  <span className="font-semibold">{currentComic.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span className="text-sm">{totalChapters} chapters</span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-white/30 text-xs",
                    currentComic.status === "ONGOING"
                      ? "text-green-400 border-green-400/30"
                      : currentComic.status === "COMPLETED"
                      ? "text-blue-400 border-blue-400/30"
                      : "text-red-400 border-red-400/30"
                  )}
                >
                  {currentComic.status.toLowerCase()}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
                {currentComic.description}
              </p>

              {/* Free Chapters Notice */}
              {currentComic.freeChapters > 0 && (
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-green-300 font-medium">
                    🎉 First {currentComic.freeChapters} chapters are FREE!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/comics/${currentComic.slug}`}>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-3 text-lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Reading
                  </Button>
                </Link>
                <Link href={`/comics/${currentComic.slug}`}>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 border-white/30 text-white font-semibold px-8 backdrop-blur-sm"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>

            {/* Cover Image */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-80 h-96 group">
                <Image
                  src={currentComic.coverImage}
                  alt={`${currentComic.title} cover`}
                  fill
                  className="object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {comics.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {comics.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex gap-2">
            {comics.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {comics.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-[6000ms] ease-linear"
            style={{
              width: isAutoPlaying ? "100%" : "0%",
              animation: isAutoPlaying ? "progress 6s linear infinite" : "none",
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}