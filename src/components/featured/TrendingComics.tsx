"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Flame, Book, Users } from "lucide-react";
import { parseGenres } from "@/lib/utils/genre";

interface TrendingComic {
  id: string;
  title: string;
  slug: string;
  author: string;
  coverImage: string;
  genre: string[];
  status: "ONGOING" | "COMPLETED" | "HIATUS";
  volumes: Array<{
    chapters: Array<{ id: string }>;
  }>;
  trendingScore: number;
}

interface TrendingComicsProps {
  comics: TrendingComic[];
}

export function TrendingComics({ comics }: TrendingComicsProps) {
  return (
    <div className="space-y-6">
      {/* Top Trending (Large Card) */}
      {comics[0] && (
        <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/30 backdrop-blur-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="relative aspect-[3/4] md:aspect-[2/3] overflow-hidden rounded-xl">
              <Image
                src={comics[0].coverImage}
                alt={`${comics[0].title} cover`}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 text-white font-bold">
                  <Flame className="h-3 w-3 mr-1" />
                  #1 Trending
                </Badge>
              </div>
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
                  <Book className="h-4 w-4" />
                  <span>{comics[0].volumes.reduce((total, vol) => total + vol.chapters.length, 0)} chapters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{comics[0].trendingScore} recent readers</span>
                </div>
              </div>
              
              <Link href={`/comics/${comics[0].slug}`}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Read Trending Comic
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Other Trending Comics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {comics.slice(1).map((comic, index) => {
          const totalChapters = comic.volumes.reduce(
            (total, volume) => total + volume.chapters.length,
            0
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
                
                {/* Ranking Badge */}
                <div className="absolute top-2 left-2">
                  <Badge 
                    className={`font-bold ${
                      index === 0 ? "bg-yellow-500 text-black" :
                      index === 1 ? "bg-gray-400 text-black" :
                      index === 2 ? "bg-amber-600 text-white" :
                      "bg-blue-500 text-white"
                    }`}
                  >
                    #{index + 2}
                  </Badge>
                </div>

                {/* Trending Score */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-red-500/80 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {comic.trendingScore}
                  </Badge>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Link href={`/comics/${comic.slug}`}>
                    <Button
                      size="sm"
                      className="bg-red-500/90 hover:bg-red-600 text-white font-semibold backdrop-blur-sm"
                    >
                      View Comic
                    </Button>
                  </Link>
                </div>
              </div>

              <CardContent className="p-3">
                <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                  {comic.title}
                </h4>
                <p className="text-white/60 text-xs mb-2">by {comic.author}</p>
                
                <div className="flex items-center justify-between text-white/50 text-xs">
                  <span>{totalChapters} chapters</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      comic.status === "ONGOING"
                        ? "border-green-400/30 text-green-400"
                        : "border-blue-400/30 text-blue-400"
                    }`}
                  >
                    {comic.status.toLowerCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}