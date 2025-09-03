"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  BookOpen,
  Clock,
  CheckCircle,
  Calendar
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

export function LibraryGrid({ comics }: LibraryGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("recent");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
        default: // recent
          return new Date(b.lastUnlockedAt).getTime() - new Date(a.lastUnlockedAt).getTime();
      }
    });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search your library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "recent", label: "Recent" },
              { key: "reading", label: "Reading" },
              { key: "completed", label: "Completed" },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key as FilterType)}
                className={`${
                  filter === key
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-white/20 hover:bg-white/30 border-white/30"
                } text-white`}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="bg-white/20 border border-white/30 rounded-md px-3 py-2 text-white text-sm"
          >
            <option value="recent" className="bg-gray-900">Recently Unlocked</option>
            <option value="alphabetical" className="bg-gray-900">Alphabetical</option>
            <option value="chapters" className="bg-gray-900">Most Chapters</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-white/70 text-sm">
        Showing {filteredAndSortedComics.length} of {comics.length} comics
      </div>

      {/* Comics Grid */}
      {filteredAndSortedComics.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 mx-auto text-white/30 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No comics found</h3>
          <p className="text-white/70">
            Try adjusting your search terms or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedComics.map((comic) => (
            <Card
              key={comic.id}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="p-0">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-xl">
                  <Image
                    src={comic.coverImage}
                    alt={`${comic.title} cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-black/70 text-white border-white/30"
                    >
                      {comic.unlockedChapters.length} Chapters
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <CardTitle className="text-white text-lg mb-2 line-clamp-2">
                  {comic.title}
                </CardTitle>
                
                <p className="text-white/70 text-sm mb-3">
                  by {comic.author}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {parseGenres(comic.genre).slice(0, 2).map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="text-xs border-white/30 text-white/80"
                    >
                      {genre}
                    </Badge>
                  ))}
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      comic.status === "ONGOING"
                        ? "border-green-400/30 text-green-400"
                        : comic.status === "COMPLETED"
                        ? "border-blue-400/30 text-blue-400"
                        : "border-red-400/30 text-red-400"
                    }`}
                  >
                    {comic.status.toLowerCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-white/50 text-xs mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Last unlocked {formatDistanceToNow(new Date(comic.lastUnlockedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link href={`/comics/${comic.slug}`}>
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white"
                      size="sm"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Comic
                    </Button>
                  </Link>
                  
                  {comic.unlockedChapters.length > 0 && (
                    <Link href={`/comics/${comic.slug}/chapter/${comic.unlockedChapters[0].id}`}>
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        size="sm"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Continue Reading
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}