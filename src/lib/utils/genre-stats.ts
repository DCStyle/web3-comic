import { prisma } from "@/lib/db/prisma";
import { parseGenres } from "./genre";

export interface GenreStatistic {
  name: string;
  count: number;
  trending?: boolean;
  icon?: any;
}

export async function getGenreStatistics(): Promise<GenreStatistic[]> {
  try {
    // Fetch all comics with their genres and update dates
    const comics = await prisma.comic.findMany({
      select: {
        genre: true,
        updatedAt: true,
      },
    });

    if (comics.length === 0) {
      return [];
    }

    // Aggregate genre counts
    const genreCountMap = new Map<string, { count: number; recentUpdates: number }>();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    comics.forEach((comic) => {
      try {
        const genres = parseGenres(comic.genre);
        const isRecentlyUpdated = new Date(comic.updatedAt) > sevenDaysAgo;

        genres.forEach((genre) => {
          const existing = genreCountMap.get(genre) || { count: 0, recentUpdates: 0 };
          genreCountMap.set(genre, {
            count: existing.count + 1,
            recentUpdates: existing.recentUpdates + (isRecentlyUpdated ? 1 : 0),
          });
        });
      } catch (error) {
        console.warn(`Failed to parse genre for comic: ${comic.genre}`, error);
      }
    });

    // Convert to array and sort by count
    const genreStats: GenreStatistic[] = Array.from(genreCountMap.entries())
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        // Mark as trending if more than 30% of comics with this genre were updated recently
        // and the genre has at least 2 comics
        trending: stats.count >= 2 && (stats.recentUpdates / stats.count) > 0.3,
      }))
      .sort((a, b) => b.count - a.count);

    return genreStats;
  } catch (error) {
    console.error("Failed to fetch genre statistics:", error);
    return [];
  }
}

// Icon mapping for genres (can be extended)
export const GENRE_ICONS = {
  Action: "Sword",
  Romance: "Heart", 
  Fantasy: "Sparkles",
  Adventure: "Zap",
  Comedy: "Users",
  Drama: "Clock",
  "Sci-Fi": "Eye",
  Mystery: "TrendingUp",
  Horror: "Flame",
  Thriller: "Clock",
  Slice: "Users",
  Sports: "TrendingUp",
  Historical: "Clock",
  Supernatural: "Sparkles",
} as const;

export function getGenreIcon(genreName: string): string {
  return GENRE_ICONS[genreName as keyof typeof GENRE_ICONS] || "TrendingUp";
}

// Cache duration for genre statistics (5 minutes)
export const GENRE_STATS_CACHE_DURATION = 5 * 60 * 1000;