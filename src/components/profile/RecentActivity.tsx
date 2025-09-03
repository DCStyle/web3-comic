"use client";

import Image from "next/image";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  Activity, 
  Book, 
  CreditCard, 
  Clock,
  ArrowUp,
  ArrowDown,
  Unlock,
  Eye
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  createdAt: Date;
}

interface ReadingProgress {
  id: string;
  pageNumber: number;
  updatedAt: Date;
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
}

interface ChapterUnlock {
  id: string;
  creditsSpent: number;
  unlockedAt: Date;
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
}

interface RecentActivityProps {
  transactions: Transaction[];
  readingProgress: ReadingProgress[];
  recentUnlocks: ChapterUnlock[];
}

export function RecentActivity({ 
  transactions, 
  readingProgress, 
  recentUnlocks 
}: RecentActivityProps) {
  // Combine and sort all activities
  const allActivities = [
    ...transactions.map(t => ({
      type: 'transaction' as const,
      data: t,
      timestamp: new Date(t.createdAt),
    })),
    ...readingProgress.slice(0, 5).map(r => ({
      type: 'reading' as const,
      data: r,
      timestamp: new Date(r.updatedAt),
    })),
    ...recentUnlocks.map(u => ({
      type: 'unlock' as const,
      data: u,
      timestamp: new Date(u.unlockedAt),
    })),
  ]
  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  .slice(0, 15);

  const getActivityIcon = (activity: typeof allActivities[0]) => {
    switch (activity.type) {
      case 'transaction':
        return activity.data.type === 'CREDIT' ? 
          <ArrowUp className="h-4 w-4 text-green-400" /> :
          <ArrowDown className="h-4 w-4 text-red-400" />;
      case 'reading':
        return <Eye className="h-4 w-4 text-blue-400" />;
      case 'unlock':
        return <Unlock className="h-4 w-4 text-purple-400" />;
    }
  };

  const getActivityContent = (activity: typeof allActivities[0]) => {
    switch (activity.type) {
      case 'transaction':
        const transaction = activity.data;
        return (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">
                {transaction.description}
              </p>
              <p className="text-white/60 text-xs">
                {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className={`text-sm font-medium ${
              transaction.type === 'CREDIT' ? 'text-green-400' : 'text-red-400'
            }`}>
              {transaction.type === 'CREDIT' ? '+' : '-'}{transaction.amount}
            </div>
          </div>
        );

      case 'reading':
        const progress = activity.data;
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded overflow-hidden">
              <Image
                src={progress.chapter.volume.comic.coverImage}
                alt={progress.chapter.volume.comic.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium line-clamp-1">
                {progress.chapter.volume.comic.title}
              </p>
              <p className="text-white/60 text-xs">
                Vol {progress.chapter.volume.volumeNumber}, Ch {progress.chapter.chapterNumber} • Page {progress.pageNumber}
              </p>
              <p className="text-white/50 text-xs">
                {formatDistanceToNow(new Date(progress.updatedAt), { addSuffix: true })}
              </p>
            </div>
            <Link href={`/comics/${progress.chapter.volume.comic.slug}/chapter/${progress.chapter.id}`}>
              <GradientButton size="sm" variant="primary" className="shrink-0">
                Continue
              </GradientButton>
            </Link>
          </div>
        );

      case 'unlock':
        const unlock = activity.data;
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded overflow-hidden">
              <Image
                src={unlock.chapter.volume.comic.coverImage}
                alt={unlock.chapter.volume.comic.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium line-clamp-1">
                Unlocked: {unlock.chapter.volume.comic.title}
              </p>
              <p className="text-white/60 text-xs">
                Vol {unlock.chapter.volume.volumeNumber}, Ch {unlock.chapter.chapterNumber} • {unlock.creditsSpent} credits
              </p>
              <p className="text-white/50 text-xs">
                {formatDistanceToNow(new Date(unlock.unlockedAt), { addSuffix: true })}
              </p>
            </div>
            <Link href={`/comics/${unlock.chapter.volume.comic.slug}/chapter/${unlock.chapter.id}`}>
              <GradientButton size="sm" variant="accent" className="shrink-0">
                Read
              </GradientButton>
            </Link>
          </div>
        );
    }
  };

  return (
    <GlowCard variant="gradient_basic" shimmer className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
      
      <div className="relative p-8">
        <div className="flex items-center gap-3 mb-8">
          <AnimatedBadge
            variant="gradient"
            size="xl"
            icon={<Activity className="h-5 w-5" />}
          >
            Recent Activity
          </AnimatedBadge>
        </div>
        {allActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                <Activity className="h-10 w-10 text-gray-800" />
              </div>
            </div>
            <AnimatedBadge variant="glass" size="lg" className="mb-4">
              No recent activity
            </AnimatedBadge>
            <p className="text-gray-600 text-sm">
              Start reading comics to see your activity timeline here
            </p>
          </div>
        ) : (
          <div className="space-y-6 relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-30"></div>
            
            {allActivities.map((activity, index) => (
              <div 
                key={`${activity.type}-${index}`}
                className="relative flex items-start gap-6 group"
              >
                {/* Timeline Node */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-all duration-300 glow-pulse">
                    {getActivityIcon(activity)}
                  </div>
                </div>
                
                {/* Activity Card */}
                <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-glow/20 group-hover:scale-[1.02]">
                  {getActivityContent(activity)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <GradientButton 
            variant="accent" 
            size="lg" 
            icon={<Clock className="h-5 w-5" />}
          >
            View Full History
          </GradientButton>
        </div>
      </div>
    </GlowCard>
  );
}