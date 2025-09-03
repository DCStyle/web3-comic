"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { 
  Sparkles,
  TrendingUp,
  Users,
  Star,
  BookOpen,
  Plus,
  Eye,
  Heart,
  Clock,
  Zap,
  ChevronRight,
  RefreshCw
} from "lucide-react";

interface RecommendedComic {
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
  popularity: number;
  reason: string;
  tags: string[];
  description: string;
  estimatedReadTime: number;
  isNew?: boolean;
  isTrending?: boolean;
}

interface RecommendedComicsProps {
  recommendations: RecommendedComic[];
  userGenres: string[];
  onRefresh?: () => void;
  loading?: boolean;
}

type CategoryType = "all" | "similar" | "trending" | "new" | "quick";

export function RecommendedComics({ 
  recommendations, 
  userGenres, 
  onRefresh,
  loading = false 
}: RecommendedComicsProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");

  const categories = [
    { key: "all", label: "All", icon: Sparkles },
    { key: "similar", label: "Similar", icon: Heart },
    { key: "trending", label: "Trending", icon: TrendingUp },
    { key: "new", label: "New", icon: Plus },
    { key: "quick", label: "Quick Read", icon: Clock }
  ];

  const filteredRecommendations = recommendations.filter(comic => {
    switch (activeCategory) {
      case "similar":
        return comic.genre.some(g => userGenres.includes(g));
      case "trending":
        return comic.isTrending || comic.popularity > 80;
      case "new":
        return comic.isNew;
      case "quick":
        return comic.estimatedReadTime <= 30;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
              <div className="h-4 w-64 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-white/20 rounded-xl mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded w-3/4" />
                <div className="h-3 bg-white/20 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-6 bg-white/20 rounded-full w-16" />
                  <div className="h-6 bg-white/20 rounded-full w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-accent rounded-lg">
            <Sparkles className="h-5 w-5 text-gray-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
            <p className="text-muted-foreground text-sm">
              Discover new comics based on your reading preferences
            </p>
          </div>
        </div>
        
        {onRefresh && (
          <GradientButton
            variant="outline"
            size="sm"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={onRefresh}
            className="border-gray-300 text-gray-800 hover:bg-gray-100"
          >
            Refresh
          </GradientButton>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(({ key, label, icon: Icon }) => (
          <GradientButton
            key={key}
            variant={activeCategory === key ? "primary" : "ghost"}
            size="sm"
            icon={<Icon className="h-4 w-4" />}
            onClick={() => setActiveCategory(key as CategoryType)}
            className="whitespace-nowrap"
          >
            {label}
          </GradientButton>
        ))}
      </div>

      {/* User Preferences Indicator */}
      {userGenres.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-400/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg">
                <Eye className="h-4 w-4 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium mb-1">
                  Based on your reading history
                </p>
                <div className="flex flex-wrap gap-1">
                  {userGenres.slice(0, 3).map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="text-xs border-purple-400/30 text-purple-800 capitalize"
                    >
                      {genre}
                    </Badge>
                  ))}
                  {userGenres.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs border-purple-400/30 text-purple-800"
                    >
                      +{userGenres.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Grid */}
      {filteredRecommendations.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No recommendations found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your category filter or refresh for new suggestions
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecommendations.map((comic) => (
            <Card
              key={comic.id}
              className="bg-gray-100 backdrop-blur-sm border-gray-200 hover:bg-gray-150 transition-all duration-300 hover:scale-105 group overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={comic.coverImage}
                  alt={`${comic.title} cover`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                
                {/* Overlay badges */}
                <div className="absolute top-2 left-2 space-y-1">
                  {comic.isNew && (
                    <AnimatedBadge
                      variant="success"
                      size="sm"
                      animation="glow"
                      className="backdrop-blur-sm"
                    >
                      New
                    </AnimatedBadge>
                  )}
                  {comic.isTrending && (
                    <AnimatedBadge
                      variant="warning"
                      size="sm"
                      animation="pulse"
                      className="backdrop-blur-sm"
                    >
                      Trending
                    </AnimatedBadge>
                  )}
                </div>
                
                <div className="absolute top-2 right-2">
                  <AnimatedBadge
                    variant="glass"
                    size="sm"
                    icon={<Star className="h-3 w-3" />}
                    className="backdrop-blur-sm"
                  >
                    {comic.rating.toFixed(1)}
                  </AnimatedBadge>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-600 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick actions */}
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <GradientButton
                      variant="ghost"
                      size="sm"
                      icon={<Eye className="h-4 w-4" />}
                      className="flex-1 backdrop-blur-sm bg-gray-800 text-white"
                    >
                      Preview
                    </GradientButton>
                    <GradientButton
                      variant="primary"
                      size="sm"
                      icon={<Plus className="h-4 w-4" />}
                      className="backdrop-blur-sm"
                    >
                      Add
                    </GradientButton>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title and Author */}
                  <div>
                    <h3 className="text-gray-800 font-semibold text-sm line-clamp-2 mb-1">
                      {comic.title}
                    </h3>
                    <p className="text-gray-700 text-xs">
                      by {comic.author}
                    </p>
                  </div>

                  {/* Recommendation reason */}
                  <div className="flex items-center gap-2 text-xs">
                    <Sparkles className="h-3 w-3 text-yellow-600" />
                    <span className="text-yellow-800 line-clamp-1">
                      {comic.reason}
                    </span>
                  </div>

                  {/* Genres and Status */}
                  <div className="flex flex-wrap gap-1">
                    {comic.genre.slice(0, 2).map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-800 capitalize"
                      >
                        {genre}
                      </Badge>
                    ))}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        comic.status === "ONGOING"
                          ? "border-green-400/30 text-green-600"
                          : comic.status === "COMPLETED"
                          ? "border-blue-400/30 text-blue-600"
                          : "border-red-400/30 text-red-600"
                      }`}
                    >
                      {comic.status.toLowerCase()}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {comic.totalChapters}ch
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {comic.estimatedReadTime}m
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{comic.popularity}%</span>
                    </div>
                  </div>

                  {/* Free chapters indicator */}
                  <div className="flex items-center justify-between">
                    <AnimatedBadge
                      variant="info"
                      size="sm"
                      icon={<Zap className="h-3 w-3" />}
                    >
                      {comic.freeChapters} Free
                    </AnimatedBadge>
                    
                    <Link href={`/comics/${comic.slug}`}>
                      <GradientButton
                        variant="outline"
                        size="sm"
                        icon={<ChevronRight className="h-3 w-3" />}
                        className="border-gray-300 text-gray-800 hover:bg-gray-100"
                      >
                        View
                      </GradientButton>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View More */}
      {filteredRecommendations.length > 0 && (
        <div className="text-center">
          <Link href="/comics">
            <GradientButton
              variant="outline"
              size="lg"
              icon={<BookOpen className="h-5 w-5" />}
              className="border-gray-300 text-gray-800 hover:bg-gray-100"
            >
              Explore All Comics
            </GradientButton>
          </Link>
        </div>
      )}
    </div>
  );
}