"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Book, User, Play } from "lucide-react";
import { parseGenres } from "@/lib/utils/genre";

interface FeaturedComic {
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

interface FeaturedGridProps {
  comics: FeaturedComic[];
}

export function FeaturedGrid({ comics }: FeaturedGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {comics.map((comic) => {
        const totalChapters = comic.volumes.reduce(
          (total, volume) => total + volume.chapters.length,
          0
        );

        return (
          <Card
            key={comic.id}
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 overflow-hidden group"
          >
            <CardHeader className="p-0 relative">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={comic.coverImage}
                  alt={`${comic.title} cover`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Featured Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-500/90 text-black">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>

                {/* Free Chapters Badge */}
                {comic.freeChapters > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-green-500/90 text-white">
                      {comic.freeChapters} Free
                    </Badge>
                  </div>
                )}

                {/* Hover Overlay with Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Link href={`/comics/${comic.slug}`}>
                    <Button
                      size="lg"
                      className="bg-blue-500/90 hover:bg-blue-600 text-white font-bold backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform duration-300"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Read Now
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {/* Title */}
              <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                {comic.title}
              </h3>

              {/* Author */}
              <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <User className="h-3 w-3" />
                <span>by {comic.author}</span>
              </div>

              {/* Description */}
              <p className="text-white/80 text-sm mb-4 line-clamp-3">
                {comic.description}
              </p>

              {/* Genres */}
              <div className="flex flex-wrap gap-1 mb-3">
                {parseGenres(comic.genre).slice(0, 3).map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="text-xs border-white/30 text-white/80 hover:bg-white/20 transition-colors"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-white/60 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Book className="h-3 w-3" />
                  <span>{totalChapters} chapters</span>
                </div>
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

              {/* Action Button */}
              <Link href={`/comics/${comic.slug}`}>
                <Button
                  variant="outline"
                  className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white font-semibold transition-all"
                  size="sm"
                >
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}