"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Clock, 
  BookOpen,
  CheckCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  TrendingUp,
  Star,
  Zap
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContinueReadingItem {
  chapter: {
    id: string;
    chapterNumber: number;
    title: string;
    volume: {
      volumeNumber: number;
      comic: {
        id: string;
        title: string;
        slug: string;
        coverImage: string;
      };
    };
  };
  currentPage: number;
  totalPages: number;
  lastReadAt: Date;
  isComplete: boolean;
}

interface ContinueReadingProps {
  items: ContinueReadingItem[];
}

export function ContinueReading({ items }: ContinueReadingProps) {
  // Helper function to create circular progress SVG
  const CircularProgress = ({ progress, size = 60 }: { progress: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-secondary rounded-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Continue Reading</h2>
            <p className="text-muted-foreground text-sm">
              Pick up where you left off
            </p>
          </div>
        </div>
        
        <AnimatedBadge
          variant="info"
          icon={<TrendingUp className="h-4 w-4" />}
          animation="glow"
        >
          {items.length} In Progress
        </AnimatedBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const progressPercent = Math.round((item.currentPage / item.totalPages) * 100);
          
          return (
            <Card
              key={item.chapter.id}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-500 overflow-hidden group hover:scale-105 hover:shadow-glow-lg relative"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="flex p-4">
                  {/* Cover Image with enhanced styling */}
                  <div className="relative w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={item.chapter.volume.comic.coverImage}
                      alt={`${item.chapter.volume.comic.title} cover`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Progress ring overlay */}
                    <div className="absolute -bottom-2 -right-2">
                      <CircularProgress progress={progressPercent} size={40} />
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <CardContent className="flex-1 p-0 pl-4">
                    <div className="space-y-3">
                      {/* Comic Title with better typography */}
                      <div>
                        <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-gradient transition-colors">
                          {item.chapter.volume.comic.title}
                        </h3>
                        <p className="text-white/70 text-sm font-medium">
                          Vol {item.chapter.volume.volumeNumber} • Ch {item.chapter.chapterNumber}
                        </p>
                      </div>
                      
                      {/* Enhanced Progress Display */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-sm font-medium">
                            Page {item.currentPage} of {item.totalPages}
                          </span>
                          <AnimatedBadge
                            variant={item.isComplete ? "success" : "info"}
                            size="sm"
                            className="text-xs"
                          >
                            {progressPercent}%
                          </AnimatedBadge>
                        </div>
                        
                        <div className="relative">
                          <Progress 
                            value={progressPercent} 
                            className="h-2 bg-white/20 rounded-full overflow-hidden"
                          />
                          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                               style={{ width: `${progressPercent}%` }} />
                        </div>
                      </div>

                      {/* Status and Time with better styling */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.isComplete ? (
                            <AnimatedBadge
                              variant="success"
                              size="sm"
                              icon={<CheckCircle className="h-3 w-3" />}
                              className="text-xs"
                            >
                              Complete
                            </AnimatedBadge>
                          ) : (
                            <AnimatedBadge
                              variant="gradient"
                              size="sm"
                              icon={<Zap className="h-3 w-3" />}
                              className="text-xs"
                              animation="glow"
                            >
                              Reading
                            </AnimatedBadge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-white/60 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(item.lastReadAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="px-4 pb-4">
                  <div className="flex gap-2">
                    <Link 
                      href={`/comics/${item.chapter.volume.comic.slug}/chapter/${item.chapter.id}`}
                      className="flex-1"
                    >
                      <GradientButton
                        variant="primary"
                        size="sm"
                        className="w-full group-hover:scale-105 transition-transform"
                        icon={item.isComplete ? <BookOpen className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      >
                        {item.isComplete ? 'Re-read' : 'Continue'}
                      </GradientButton>
                    </Link>
                    
                    {/* Quick action buttons (visible on hover) */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <GradientButton
                        variant="ghost"
                        size="sm"
                        icon={<Bookmark className="h-4 w-4" />}
                        className="w-10 h-8 p-0"
                      />
                      <GradientButton
                        variant="ghost"
                        size="sm"
                        icon={<Share2 className="h-4 w-4" />}
                        className="w-10 h-8 p-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Star rating indicator (top-right) */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-white text-xs font-medium">4.8</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Enhanced View All Button */}
      <div className="text-center">
        <Link href="/history">
          <GradientButton
            variant="outline"
            size="lg"
            icon={<Clock className="h-5 w-5" />}
            className="border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            View Full Reading History
          </GradientButton>
        </Link>
      </div>
    </div>
  );
}