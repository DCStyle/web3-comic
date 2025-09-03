"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  BookOpen,
  Clock,
  CheckCircle,
  Calendar,
  Grid3X3,
  List,
  Star,
  TrendingUp,
  Award,
  Eye,
  Heart,
  Bookmark,
  MoreHorizontal,
  Zap,
  Crown,
  Flame,
  Play
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { parseGenres } from "@/lib/utils/genre";

interface UnlockedComic {
  id: string;
  title: string;
  slug: string;
  author: string;
  coverImage: string;
  genre: string[];
  status: "ONGOING" | "COMPLETED" | "HIATUS";
  tags: Array<{ name: string }>;
  unlockedChapters: Array<{
    id: string;
    chapterNumber: number;
    title: string;
    unlockedAt: Date;
  }>;
  lastUnlockedAt: Date;
}

interface LibraryGridProps {
  comics: UnlockedComic[];
}

type FilterType = "all" | "reading" | "completed" | "recent" | "favorites" | "new";
type SortType = "recent" | "alphabetical" | "chapters" | "progress" | "rating";
type ViewType = "grid" | "masonry" | "list";

export function LibraryGridEnhanced({ comics }: LibraryGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("recent");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Helper function to get collection badge info
  const getCollectionBadge = (comic: UnlockedComic) => {
    const chapterCount = comic.unlockedChapters.length;
    if (chapterCount >= 20) return { label: "Master", variant: "gradient", icon: Crown };
    if (chapterCount >= 10) return { label: "Collector", variant: "neon", icon: Award };
    if (chapterCount >= 5) return { label: "Explorer", variant: "success", icon: Star };
    return { label: "Starter", variant: "glass", icon: BookOpen };
  };

  const filteredAndSortedComics = comics
    .filter(comic => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          comic.title.toLowerCase().includes(searchLower) ||
          comic.author.toLowerCase().includes(searchLower) ||
          comic.genre.some(g => g.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      switch (filter) {
        case "reading":
          return comic.status === "ONGOING";
        case "completed":
          return comic.status === "COMPLETED";
        case "recent":
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(comic.lastUnlockedAt) > weekAgo;
        case "favorites":
          // Mock favorite logic - in production, check user favorites
          return comic.unlockedChapters.length > 10;
        case "new":
          const monthAgo = new Date();
          monthAgo.setDate(monthAgo.getDate() - 30);
          return new Date(comic.lastUnlockedAt) > monthAgo;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "chapters":
          return b.unlockedChapters.length - a.unlockedChapters.length;
        case "progress":
          // Sort by reading progress (mock data)
          return Math.random() - 0.5;
        case "rating":
          // Sort by rating (mock data)
          return Math.random() - 0.5;
        default: // recent
          return new Date(b.lastUnlockedAt).getTime() - new Date(a.lastUnlockedAt).getTime();
      }
    });

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        {/* Main Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Enhanced Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
            <Input
              placeholder="Search your library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/20 border-white/30 text-white placeholder:text-white/50 rounded-xl text-base focus:ring-2 focus:ring-blue-400/50"
            />
            {searchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* View Type Selector */}
          <div className="flex gap-1 bg-white/10 rounded-xl p-1">
            {[
              { key: "grid", icon: Grid3X3 },
              { key: "masonry", icon: Filter },
              { key: "list", icon: List }
            ].map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewType(key as ViewType)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewType === key
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Animated Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: "all", label: "All Comics", icon: BookOpen },
            { key: "recent", label: "Recent", icon: Clock },
            { key: "reading", label: "Reading", icon: Eye },
            { key: "completed", label: "Completed", icon: CheckCircle },
            { key: "favorites", label: "Favorites", icon: Heart },
            { key: "new", label: "New", icon: Zap },
          ].map(({ key, label, icon: Icon }) => (
            <GradientButton
              key={key}
              variant={filter === key ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilter(key as FilterType)}
              icon={<Icon className="h-4 w-4" />}
              className={`transition-all duration-300 ${
                filter === key
                  ? "scale-105 shadow-glow"
                  : "hover:scale-105"
              }`}
            >
              {label}
            </GradientButton>
          ))}
        </div>

        {/* Sort and Advanced Options */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
            >
              <option value="recent" className="bg-gray-900">Recently Unlocked</option>
              <option value="alphabetical" className="bg-gray-900">Alphabetical</option>
              <option value="chapters" className="bg-gray-900">Most Chapters</option>
              <option value="progress" className="bg-gray-900">Reading Progress</option>
              <option value="rating" className="bg-gray-900">Highest Rated</option>
            </select>
          </div>
          
          <GradientButton
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            icon={<Filter className="h-4 w-4" />}
            className="border-white/30 text-white hover:bg-white/10"
          >
            {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
          </GradientButton>
        </div>

        {/* Advanced Filters (collapsible) */}
        {showAdvancedFilters && (
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Genre</label>
                <select className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm">
                  <option className="bg-gray-900">All Genres</option>
                  <option className="bg-gray-900">Action</option>
                  <option className="bg-gray-900">Adventure</option>
                  <option className="bg-gray-900">Fantasy</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Status</label>
                <select className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm">
                  <option className="bg-gray-900">Any Status</option>
                  <option className="bg-gray-900">Ongoing</option>
                  <option className="bg-gray-900">Completed</option>
                  <option className="bg-gray-900">Hiatus</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Progress</label>
                <select className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm">
                  <option className="bg-gray-900">Any Progress</option>
                  <option className="bg-gray-900">Not Started</option>
                  <option className="bg-gray-900">In Progress</option>
                  <option className="bg-gray-900">Completed</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Collection</label>
                <select className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm">
                  <option className="bg-gray-900">Any Size</option>
                  <option className="bg-gray-900">Starter (1-4)</option>
                  <option className="bg-gray-900">Explorer (5-9)</option>
                  <option className="bg-gray-900">Collector (10-19)</option>
                  <option className="bg-gray-900">Master (20+)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Results Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AnimatedBadge
            variant="info"
            icon={<BookOpen className="h-4 w-4" />}
            size="lg"
          >
            {filteredAndSortedComics.length} comics
          </AnimatedBadge>
          
          {searchTerm && (
            <AnimatedBadge
              variant="warning"
              icon={<Search className="h-4 w-4" />}
              animation="pulse"
            >
              Filtered by "{searchTerm}"
            </AnimatedBadge>
          )}
          
          {filter !== "all" && (
            <AnimatedBadge
              variant="gradient"
              icon={<Filter className="h-4 w-4" />}
            >
              {filter} view
            </AnimatedBadge>
          )}
        </div>
        
        <div className="text-white/60 text-sm">
          {comics.length} total in library
        </div>
      </div>

      {/* Dynamic Layout Comics Display */}
      {filteredAndSortedComics.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 max-w-md mx-auto">
            <Filter className="h-16 w-16 mx-auto text-white/30 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No comics found</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Try adjusting your search terms or filters to find what you're looking for
            </p>
            <div className="flex gap-3 justify-center">
              <GradientButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Clear Filters
              </GradientButton>
              <GradientButton
                variant="primary"
                size="sm"
                icon={<BookOpen className="h-4 w-4" />}
              >
                Browse All
              </GradientButton>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${
          viewType === "list"
            ? "space-y-4"
            : viewType === "masonry"
            ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        }`}>
          {filteredAndSortedComics.map((comic) => {
            const collectionBadge = getCollectionBadge(comic);
            const IconComponent = collectionBadge.icon;
            
            return (
            <Card
              key={comic.id}
              className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-glow-lg group overflow-hidden relative ${
                viewType === "masonry" ? "break-inside-avoid mb-6" : ""
              } ${
                viewType === "list" ? "flex flex-row" : ""
              }`}
            >
              {/* Enhanced Cover Image */}
              <CardHeader className="p-0">
                <div className={`relative overflow-hidden ${
                  viewType === "list" ? "w-24 h-32 flex-shrink-0" : "aspect-[3/4] w-full"
                } ${
                  viewType !== "list" ? "rounded-t-xl" : "rounded-l-xl"
                }`}>
                  <Image
                    src={comic.coverImage}
                    alt={`${comic.title} cover`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Collection Badge */}
                  <div className="absolute top-2 left-2">
                    <AnimatedBadge 
                      variant={collectionBadge.variant as any}
                      size="sm"
                      icon={<IconComponent className="h-3 w-3" />}
                      className="backdrop-blur-sm"
                      animation={collectionBadge.variant === "gradient" ? "glow" : undefined}
                    >
                      {collectionBadge.label}
                    </AnimatedBadge>
                  </div>
                  
                  {/* Chapter Count */}
                  <div className="absolute top-2 right-2">
                    <AnimatedBadge 
                      variant="glass"
                      size="sm"
                      className="backdrop-blur-sm border-white/30"
                    >
                      {comic.unlockedChapters.length}
                    </AnimatedBadge>
                  </div>
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <GradientButton
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                        className="backdrop-blur-sm bg-black/20 text-white"
                      />
                      <GradientButton
                        variant="ghost"
                        size="sm"
                        icon={<Bookmark className="h-4 w-4" />}
                        className="backdrop-blur-sm bg-black/20 text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {/* Enhanced Content */}
              <CardContent className={`p-4 ${viewType === "list" ? "flex-1" : ""}`}>
                <div className="space-y-3">
                  {/* Title and Author */}
                  <div>
                    <CardTitle className={`text-white font-bold mb-1 group-hover:text-gradient transition-colors ${
                      viewType === "list" ? "text-base line-clamp-1" : "text-lg line-clamp-2"
                    }`}>
                      {comic.title}
                    </CardTitle>
                    <p className="text-white/70 text-sm font-medium">
                      by {comic.author}
                    </p>
                  </div>

                  {/* Genres and Status with enhanced styling */}
                  <div className="flex flex-wrap gap-1">
                    {parseGenres(comic.genre).slice(0, 2).map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="text-xs border-white/30 text-white/80 hover:border-white/50 hover:text-white transition-colors capitalize"
                      >
                        {genre}
                      </Badge>
                    ))}
                    <AnimatedBadge
                      variant={comic.status === "ONGOING" ? "success" : comic.status === "COMPLETED" ? "info" : "warning"}
                      size="sm"
                      className="text-xs capitalize"
                    >
                      {comic.status.toLowerCase()}
                    </AnimatedBadge>
                  </div>

                  {/* Reading Progress Indicator */}
                  <div className="bg-white/5 rounded-lg p-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Reading Progress</span>
                      <span className="text-white/80 font-medium">
                        {Math.round((Math.random() * 100))}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.round((Math.random() * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Last read {formatDistanceToNow(new Date(comic.lastUnlockedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Link href={`/comics/${comic.slug}`} className="flex-1">
                        <GradientButton 
                          variant="outline"
                          size="sm"
                          icon={<Eye className="h-4 w-4" />}
                          className="w-full border-white/30 text-white hover:bg-white/10"
                        >
                          View
                        </GradientButton>
                      </Link>
                      
                      {comic.unlockedChapters.length > 0 && (
                        <Link href={`/comics/${comic.slug}/chapter/${comic.unlockedChapters[0].id}`} className="flex-1">
                          <GradientButton 
                            variant="primary"
                            size="sm"
                            icon={<Play className="h-4 w-4" />}
                            className="w-full"
                          >
                            Continue
                          </GradientButton>
                        </Link>
                      )}
                    </div>
                    
                    {/* Additional stats for expanded view */}
                    {viewType !== "list" && (
                      <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            4.{Math.floor(Math.random() * 9) + 1}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {Math.floor(Math.random() * 1000)}k
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-400" />
                          Hot
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}