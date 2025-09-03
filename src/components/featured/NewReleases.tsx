"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Book, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { parseGenres } from "@/lib/utils/genre";

interface NewComic {
  id: string;
  title: string;
  slug: string;
  author: string;
  coverImage: string;
  genre: string[];
  status: "ONGOING" | "COMPLETED" | "HIATUS";
  freeChapters: number;
  createdAt: Date;
  volumes: Array<{
    chapters: Array<{ id: string }>;
  }>;
  tags: Array<{ name: string }>;
}

interface NewReleasesProps {
  comics: NewComic[];
}

export function NewReleases({ comics }: NewReleasesProps) {
  return (
    <div className="space-y-6">
      {/* Featured New Release (Large Card) */}
      {comics[0] && (
        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 backdrop-blur-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="relative aspect-[3/4] md:aspect-[2/3] overflow-hidden rounded-xl">
              <Image
                src={comics[0].coverImage}
                alt={`${comics[0].title} cover`}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 text-white font-bold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Latest Release
                </Badge>
              </div>
              {comics[0].freeChapters > 0 && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-500 text-white">
                    {comics[0].freeChapters} Free Chapters
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {comics[0].title}
                </h3>
                <p className="text-white/70 mb-3">by {comics[0].author}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {parseGenres(comics[0].genre).slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-white/20 text-white">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Added {formatDistanceToNow(new Date(comics[0].createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Book className="h-4 w-4" />
                  <span>{comics[0].volumes.reduce((total, vol) => total + vol.chapters.length, 0)} chapters</span>
                </div>
              </div>
              
              <Link href={`/comics/${comics[0].slug}`}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Read New Release
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Other New Releases */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {comics.slice(1).map((comic) => {
          const totalChapters = comic.volumes.reduce(
            (total, volume) => total + volume.chapters.length,
            0
          );
          
          const daysAgo = Math.floor(
            (Date.now() - new Date(comic.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          return (
            <Card
              key={comic.id}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 overflow-hidden group"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={comic.coverImage}
                  alt={`${comic.title} cover`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* New Badge */}
                <div className="absolute top-2 left-2">
                  <Badge 
                    className={`font-bold text-xs ${
                      daysAgo <= 7 
                        ? "bg-green-500 text-white"
                        : daysAgo <= 14
                        ? "bg-blue-500 text-white"
                        : "bg-purple-500 text-white"
                    }`}
                  >
                    {daysAgo <= 7 ? "NEW" : daysAgo <= 14 ? "RECENT" : "FRESH"}
                  </Badge>
                </div>

                {/* Free Chapters Badge */}
                {comic.freeChapters > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-blue-500/80 text-white text-xs">
                      {comic.freeChapters} Free
                    </Badge>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Link href={`/comics/${comic.slug}`}>
                    <Button
                      size="sm"
                      className="bg-green-500/90 hover:bg-green-600 text-white font-semibold backdrop-blur-sm text-xs"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Read
                    </Button>
                  </Link>
                </div>
              </div>

              <CardContent className="p-3">
                <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                  {comic.title}
                </h4>
                <p className="text-white/60 text-xs mb-2">by {comic.author}</p>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-white/50 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>{daysAgo}d ago</span>
                  </div>
                  <div className="flex items-center justify-between text-white/50 text-xs">
                    <span>{totalChapters} ch</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        comic.status === "ONGOING"
                          ? "border-green-400/30 text-green-400"
                          : "border-blue-400/30 text-blue-400"
                      }`}
                    >
                      {comic.status === "ONGOING" ? "New" : "Complete"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Link href="/comics?sort=newest">
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/20 hover:bg-white/30 border-white/30 text-white font-semibold px-8"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            View All New Releases
          </Button>
        </Link>
      </div>
    </div>
  );
}