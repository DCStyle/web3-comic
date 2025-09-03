"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Book, 
  Play,
  Calendar,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { parseGenres } from "@/lib/utils/genre";

interface ReadingProgress {
  id: string;
  pageNumber: number;
  updatedAt: Date;
  chapter: {
    id: string;
    chapterNumber: number;
    title: string;
    pages: Array<{ id: string }>;
    volume: {
      volumeNumber: number;
      comic: {
        id: string;
        title: string;
        slug: string;
        coverImage: string;
        author: string;
        genre: string[];
      };
    };
  };
}

interface ReadingHistoryTimelineProps {
  groupedHistory: Record<string, ReadingProgress[]>;
}

export function ReadingHistoryTimeline({ groupedHistory }: ReadingHistoryTimelineProps) {
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "text-green-400 bg-green-400/20 border-green-400/30";
    if (percentage >= 75) return "text-blue-400 bg-blue-400/20 border-blue-400/30";
    if (percentage >= 50) return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
    return "text-gray-400 bg-gray-400/20 border-gray-400/30";
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedHistory)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([dateString, historyItems]) => {
          const totalSessions = historyItems.length;
          const uniqueComics = new Set(historyItems.map(item => item.chapter.volume.comic.id)).size;

          return (
            <div key={dateString} className="relative">
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">{formatDateLabel(dateString)}</span>
                  </div>
                </div>
                <div className="flex-1 h-px bg-white/20" />
                <div className="text-white/60 text-sm">
                  {totalSessions} session{totalSessions !== 1 ? 's' : ''} • {uniqueComics} comic{uniqueComics !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4 ml-6 border-l-2 border-white/20 pl-6">
                {historyItems.map((item, index) => {
                  const progressPercentage = Math.round(
                    (item.pageNumber / item.chapter.pages.length) * 100
                  );
                  const isCompleted = progressPercentage >= 100;

                  return (
                    <div key={item.id} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-9 w-4 h-4 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                        {isCompleted ? (
                          <CheckCircle className="h-2 w-2 text-green-400" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}
                      </div>

                      <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Cover Image */}
                            <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.chapter.volume.comic.coverImage}
                                alt={item.chapter.volume.comic.title}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-white font-semibold line-clamp-1">
                                    {item.chapter.volume.comic.title}
                                  </h3>
                                  <p className="text-white/70 text-sm">
                                    by {item.chapter.volume.comic.author}
                                  </p>
                                </div>
                                <div className="text-white/50 text-xs text-right">
                                  {format(new Date(item.updatedAt), "h:mm a")}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <Book className="h-3 w-3" />
                                <span>
                                  Vol {item.chapter.volume.volumeNumber}, Ch {item.chapter.chapterNumber}
                                </span>
                                <span>•</span>
                                <span>Page {item.pageNumber} of {item.chapter.pages.length}</span>
                              </div>

                              {/* Progress Bar */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-white/60">Reading Progress</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getProgressColor(progressPercentage)}`}
                                  >
                                    {progressPercentage}%
                                  </Badge>
                                </div>
                                <Progress 
                                  value={progressPercentage} 
                                  className="h-1.5 bg-white/20"
                                />
                              </div>

                              {/* Genres */}
                              <div className="flex flex-wrap gap-1">
                                {parseGenres(item.chapter.volume.comic.genre).slice(0, 3).map((genre) => (
                                  <Badge
                                    key={genre}
                                    variant="secondary"
                                    className="text-xs bg-white/10 text-white/70 border-white/20"
                                  >
                                    {genre}
                                  </Badge>
                                ))}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 pt-2">
                                <Link href={`/comics/${item.chapter.volume.comic.slug}/chapter/${item.chapter.id}`}>
                                  <Button 
                                    size="sm" 
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    {isCompleted ? "Re-read" : "Continue"}
                                  </Button>
                                </Link>
                                <Link href={`/comics/${item.chapter.volume.comic.slug}`}>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                                  >
                                    <ArrowRight className="h-3 w-3 mr-1" />
                                    View Comic
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* Load More Button */}
      <div className="text-center pt-8">
        <Button 
          variant="outline"
          size="lg"
          className="bg-white/20 hover:bg-white/30 border-white/30 text-white px-8"
          disabled
        >
          <Clock className="h-4 w-4 mr-2" />
          Load More History
        </Button>
        <p className="text-white/50 text-sm mt-2">
          Showing recent 100 sessions
        </p>
      </div>
    </div>
  );
}