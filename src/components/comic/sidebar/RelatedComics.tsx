"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  BookOpen, 
  Eye, 
  Star, 
  Users, 
  Clock,
  TrendingUp,
  ChevronRight,
  Zap
} from "lucide-react";

interface RelatedComic {
  id: string;
  title: string;
  slug: string;
  author: string;
  coverImage: string;
  genre: string[];
  status: "ONGOING" | "COMPLETED" | "HIATUS";
  rating: number;
  totalChapters: number;
  freeChapters: number;
  readers: number;
  updatedAt: Date;
}

interface RelatedComicsProps {
  comics?: RelatedComic[];
  currentComicId: string;
  loading?: boolean;
}

const defaultRelatedComics: RelatedComic[] = [
  {
    id: "1",
    title: "Epic Fantasy Adventure",
    slug: "epic-fantasy-adventure",
    author: "John Creator",
    coverImage: "/api/placeholder/300/400",
    genre: ["Fantasy", "Adventure"],
    status: "ONGOING",
    rating: 4.8,
    totalChapters: 45,
    freeChapters: 3,
    readers: 15000,
    updatedAt: new Date()
  },
  {
    id: "2", 
    title: "Mystical Realms",
    slug: "mystical-realms",
    author: "Jane Artist",
    coverImage: "/api/placeholder/300/400",
    genre: ["Fantasy", "Magic"],
    status: "COMPLETED",
    rating: 4.6,
    totalChapters: 67,
    freeChapters: 5,
    readers: 28000,
    updatedAt: new Date()
  },
  {
    id: "3",
    title: "Warriors of Light",
    slug: "warriors-of-light", 
    author: "Mike Writer",
    coverImage: "/api/placeholder/300/400",
    genre: ["Action", "Fantasy"],
    status: "ONGOING",
    rating: 4.7,
    totalChapters: 32,
    freeChapters: 3,
    readers: 12500,
    updatedAt: new Date()
  }
];

export function RelatedComics({ 
  comics = defaultRelatedComics, 
  currentComicId,
  loading = false 
}: RelatedComicsProps) {
  const filteredComics = comics.filter(comic => comic.id !== currentComicId).slice(0, 3);

  if (loading) {
    return (
      <Card className="bg-gray-100 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-16 h-20 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-100 backdrop-blur-sm border-gray-200 hover:bg-gray-150 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-800 flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold">Related Comics</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {filteredComics.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No related comics found</p>
          </div>
        ) : (
          <>
            {filteredComics.map((comic, index) => (
              <Link
                key={comic.id}
                href={`/comics/${comic.slug}`}
                className="block group"
              >
                <div className="flex gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:scale-105">
                  {/* Comic Cover */}
                  <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={comic.coverImage}
                      alt={`${comic.title} cover`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="64px"
                    />
                    
                    {/* Quick Stats Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-600 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-between text-[10px] text-gray-800">
                        <span>{comic.totalChapters}ch</span>
                        <span>⭐ {comic.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comic Info */}
                  <div className="flex-1 min-w-0">
                    <div className="space-y-2">
                      {/* Title */}
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-blue-800 transition-colors">
                        {comic.title}
                      </h4>
                      
                      {/* Author */}
                      <p className="text-xs text-gray-700">
                        by {comic.author}
                      </p>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1">
                        {comic.genre.slice(0, 2).map((genre) => (
                          <Badge
                            key={genre}
                            variant="outline"
                            className="text-[10px] border-gray-300 text-gray-800 px-1 py-0"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{(comic.readers / 1000).toFixed(0)}k</span>
                          </div>
                          
                          <AnimatedBadge
                            variant={comic.status === "ONGOING" ? "info" : "success"}
                            size="sm"
                            className="text-[10px] px-1 py-0"
                          >
                            {comic.status === "ONGOING" ? "Ongoing" : "Complete"}
                          </AnimatedBadge>
                        </div>

                        <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* Free Chapters Notice */}
                      {comic.freeChapters > 0 && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            {comic.freeChapters} free chapters
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* View More Button */}
            <div className="pt-2 border-t border-gray-100">
              <Link href="/comics" className="block">
                <GradientButton
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-300 text-gray-800 hover:bg-gray-100"
                  icon={<TrendingUp className="h-4 w-4" />}
                >
                  Discover More Comics
                </GradientButton>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="pt-2 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-gradient">
                    {Math.max(...filteredComics.map(c => c.rating)).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600">Top Rated</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gradient">
                    {Math.max(...filteredComics.map(c => c.totalChapters))}
                  </div>
                  <div className="text-xs text-gray-600">Most Chapters</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gradient">
                    {Math.max(...filteredComics.map(c => Math.floor(c.readers / 1000)))}k
                  </div>
                  <div className="text-xs text-gray-600">Most Popular</div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}