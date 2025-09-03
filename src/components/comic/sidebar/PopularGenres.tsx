"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  Zap, 
  TrendingUp, 
  Flame,
  Heart,
  Sword,
  Sparkles,
  Clock,
  Users,
  Eye,
  ChevronRight
} from "lucide-react";
import { GenreStatistic, getGenreIcon } from "@/lib/utils/genre-stats";

interface PopularGenresProps {
  genres?: GenreStatistic[];
  loading?: boolean;
}

// Icon mapping helper
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Sword,
    Heart,
    Sparkles,
    Zap,
    Users,
    Clock,
    Eye,
    TrendingUp,
    Flame,
  };
  return icons[iconName] || TrendingUp;
};

export function PopularGenres({ genres = [], loading = false }: PopularGenresProps) {
  if (loading) {
    return (
      <Card className="bg-white backdrop-blur-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-100 backdrop-blur-sm border-gray-200 hover:bg-white/15 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-800 flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold">Popular Genres</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Top Trending Genres */}
        <div className="space-y-2">
          {genres.filter(g => g.trending).slice(0, 2).map((genre) => {
            const iconName = getGenreIcon(genre.name);
            const IconComponent = getIconComponent(iconName);
            return (
              <Link 
                key={genre.name}
                href={`/genres/${encodeURIComponent(genre.name.toLowerCase().replace(/\s+/g, '-'))}`}
                className="block group"
              >
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30 hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/40 transition-colors">
                      <IconComponent className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 group-hover:text-orange-800 transition-colors">
                        {genre.name}
                      </div>
                      <div className="text-xs text-orange-600">
                        {genre.count} comics
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <AnimatedBadge
                      variant="warning" 
                      size="sm"
                      icon={<Flame className="h-3 w-3" />}
                      animation="glow"
                    >
                      Hot
                    </AnimatedBadge>
                    <ChevronRight className="h-4 w-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Other Popular Genres */}
        <div className="space-y-2">
          <div className="text-gray-700 text-sm font-medium mb-3">
            Other Popular
          </div>
          <div className="grid grid-cols-2 gap-2">
            {genres.filter(g => !g.trending).slice(0, 6).map((genre) => {
              const iconName = getGenreIcon(genre.name);
              const IconComponent = getIconComponent(iconName);
              return (
                <Link 
                  key={genre.name}
                  href={`/genres/${encodeURIComponent(genre.name.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="group"
                >
                  <div className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                    <IconComponent className="h-3 w-3 text-gray-700 group-hover:text-gray-800 transition-colors" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-800 group-hover:text-gray-800 transition-colors truncate">
                        {genre.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {genre.count}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* View All Button */}
        <div className="pt-2 border-t border-gray-100">
          <Link href="/comics" className="block">
            <GradientButton
              variant="outline"
              size="sm"
              className="w-full border-gray-300 text-gray-800 hover:bg-gray-100"
              icon={<Eye className="h-4 w-4" />}
            >
              View All Genres
            </GradientButton>
          </Link>
        </div>

        {/* Genre Stats */}
        {genres.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient mb-1">
                {genres.reduce((total, genre) => total + genre.count, 0)}
              </div>
              <div className="text-xs text-gray-600">
                Total Comics Available
              </div>
            </div>
          </div>
        )}

        {/* No Genres Fallback */}
        {!loading && genres.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <Flame className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No genres available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}