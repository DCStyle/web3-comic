import { NextResponse } from "next/server";
import { getGenreStatistics, GENRE_STATS_CACHE_DURATION } from "@/lib/utils/genre-stats";

// Simple in-memory cache for genre statistics
let genreStatsCache: {
  data: any;
  timestamp: number;
} | null = null;

export async function GET() {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (genreStatsCache && (now - genreStatsCache.timestamp) < GENRE_STATS_CACHE_DURATION) {
      return NextResponse.json({
        genres: genreStatsCache.data,
        cached: true,
      });
    }

    // Fetch fresh data
    const genreStats = await getGenreStatistics();

    // Update cache
    genreStatsCache = {
      data: genreStats,
      timestamp: now,
    };

    return NextResponse.json({
      genres: genreStats,
      cached: false,
    });

  } catch (error) {
    console.error("API Error - Failed to fetch genre statistics:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch genre statistics",
        genres: [] 
      },
      { status: 500 }
    );
  }
}

// Optional: Add a POST route to manually refresh the cache (for admin use)
export async function POST() {
  try {
    const genreStats = await getGenreStatistics();
    
    // Force cache refresh
    genreStatsCache = {
      data: genreStats,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      message: "Genre statistics cache refreshed",
      genres: genreStats,
    });

  } catch (error) {
    console.error("API Error - Failed to refresh genre statistics cache:", error);
    return NextResponse.json(
      { error: "Failed to refresh cache" },
      { status: 500 }
    );
  }
}