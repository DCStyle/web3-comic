"use client";

import { GlowCard } from "@/components/ui/glow-card";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  Target,
  Clock,
  Flame,
  Award,
  Zap
} from "lucide-react";

interface ProfileStatsProps {
  stats: {
    totalCreditsEarned: number;
    totalCreditsSpent: number;
    chaptersUnlocked: number;
    comicsInLibrary: number;
    readingStreak: number;
    totalReadingTime: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const spendingRatio = stats.totalCreditsEarned > 0 
    ? (stats.totalCreditsSpent / stats.totalCreditsEarned) * 100 
    : 0;

  // Calculate reading level based on chapters unlocked
  const getReadingLevel = (chapters: number) => {
    if (chapters < 10) return { level: 1, title: "Newcomer", color: "text-gray-400", bg: "bg-gray-400/20" };
    if (chapters < 25) return { level: 2, title: "Reader", color: "text-green-400", bg: "bg-green-400/20" };
    if (chapters < 50) return { level: 3, title: "Enthusiast", color: "text-blue-400", bg: "bg-blue-400/20" };
    if (chapters < 100) return { level: 4, title: "Collector", color: "text-purple-400", bg: "bg-purple-400/20" };
    if (chapters < 200) return { level: 5, title: "Expert", color: "text-orange-400", bg: "bg-orange-400/20" };
    return { level: 6, title: "Master", color: "text-yellow-400", bg: "bg-yellow-400/20" };
  };

  const readingLevel = getReadingLevel(stats.chaptersUnlocked);
  const nextLevelThreshold = [0, 10, 25, 50, 100, 200, 500][readingLevel.level] || 500;
  const currentLevelProgress = readingLevel.level === 6 ? 100 : 
    ((stats.chaptersUnlocked - (nextLevelThreshold / 2)) / (nextLevelThreshold / 2)) * 100;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Reading Level Card */}
      <GlowCard variant="neon" shimmer className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
        <div className="relative p-8">
          <div className="flex items-center gap-3 mb-6">
            <AnimatedBadge
              variant="gradient"
              size="lg"
              animation="glow"
              icon={<Award className="h-5 w-5" />}
            >
              Reading Mastery
            </AnimatedBadge>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-display font-bold text-gradient bg-gradient-hero mb-2">
                  Level {readingLevel.level} - {readingLevel.title}
                </div>
                <div className="text-white/70 text-lg">
                  {stats.chaptersUnlocked} chapters unlocked
                </div>
              </div>
              <div className={`p-4 rounded-2xl ${readingLevel.bg} glow-pulse shadow-2xl`}>
                <Award className={`h-10 w-10 ${readingLevel.color}`} />
              </div>
            </div>
            
            {readingLevel.level < 6 && (
              <div className="space-y-3">
                <div className="flex justify-between text-white/80 font-medium">
                  <span>Progress to Level {readingLevel.level + 1}</span>
                  <span>{stats.chaptersUnlocked} / {nextLevelThreshold}</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={Math.min(currentLevelProgress, 100)} 
                    className="h-3 bg-white/20 rounded-full overflow-hidden"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full opacity-50"></div>
                </div>
                <div className="text-center">
                  <AnimatedBadge variant="info" size="sm">
                    {nextLevelThreshold - stats.chaptersUnlocked} more to level up!
                  </AnimatedBadge>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlowCard>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Credits Earned - Green Gradient */}
        <GlowCard variant="gradient" className="bg-gradient-to-br from-green-500/10 via-green-600/5 to-emerald-500/10 border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <AnimatedBadge variant="outline" size="sm" className="mb-3">
                  Credits Earned
                </AnimatedBadge>
                <p className="text-3xl font-bold text-green-400 font-display">
                  +{stats.totalCreditsEarned.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-green-400/20 rounded-2xl glow-pulse">
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Credits Spent - Red Gradient */}
        <GlowCard variant="gradient" className="bg-gradient-to-br from-red-500/10 via-red-600/5 to-rose-500/10 border-red-400/20 hover:border-red-400/40 transition-all duration-300">
          <div className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-400/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <AnimatedBadge variant="outline" size="sm" className="mb-3">
                  Credits Spent
                </AnimatedBadge>
                <p className="text-3xl font-bold text-red-400 font-display">
                  -{stats.totalCreditsSpent.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-red-400/20 rounded-2xl glow-pulse">
                <TrendingDown className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Comics in Library - Blue Gradient */}
        <GlowCard variant="gradient" className="bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-cyan-500/10 border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
          <div className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <AnimatedBadge variant="outline" size="sm" className="mb-3">
                  Comics Library
                </AnimatedBadge>
                <p className="text-3xl font-bold text-blue-400 font-display">
                  {stats.comicsInLibrary}
                </p>
              </div>
              <div className="p-4 bg-blue-400/20 rounded-2xl glow-pulse">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Reading Streak - Orange Gradient */}
        <GlowCard variant="gradient" className="bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-amber-500/10 border-orange-400/20 hover:border-orange-400/40 transition-all duration-300">
          <div className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <AnimatedBadge variant="outline" size="sm" className="mb-3" animation="pulse">
                  Reading Streak
                </AnimatedBadge>
                <p className="text-3xl font-bold text-orange-400 font-display">
                  {stats.readingStreak} days
                </p>
              </div>
              <div className="p-4 bg-orange-400/20 rounded-2xl glow-pulse">
                <Flame className="h-8 w-8 text-orange-400" />
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Reading Time - Purple Gradient */}
        <GlowCard variant="gradient" className="bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-violet-500/10 border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
          <div className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <AnimatedBadge variant="outline" size="sm" className="mb-3">
                  Reading Time
                </AnimatedBadge>
                <p className="text-3xl font-bold text-purple-400 font-display">
                  {formatTime(stats.totalReadingTime)}
                </p>
              </div>
              <div className="p-4 bg-purple-400/20 rounded-2xl glow-pulse">
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Chapters Unlocked - Yellow Gradient */}
        <GlowCard variant="gradient" className="bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-amber-500/10 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
          <div className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <AnimatedBadge variant="outline" size="sm" className="mb-3">
                  Chapters Unlocked
                </AnimatedBadge>
                <p className="text-3xl font-bold text-yellow-400 font-display">
                  {stats.chaptersUnlocked}
                </p>
              </div>
              <div className="p-4 bg-yellow-400/20 rounded-2xl glow-pulse">
                <Target className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Enhanced Spending Analysis */}
      <GlowCard variant="gradient_basic" shimmer className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
        <div className="relative p-8">
          <div className="flex items-center gap-3 mb-6">
            <AnimatedBadge
              variant="gradient"
              size="lg"
              icon={<Zap className="h-5 w-5" />}
            >
              Spending Analytics
            </AnimatedBadge>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center text-lg font-medium text-gray-800">
              <span>Credits Utilized</span>
              <AnimatedBadge 
                variant={spendingRatio < 25 ? "info" : spendingRatio < 75 ? "success" : "warning"}
                size="lg"
                animation="pulse"
              >
                {spendingRatio.toFixed(1)}%
              </AnimatedBadge>
            </div>
            
            <div className="relative">
              <Progress 
                value={spendingRatio} 
                className="h-4 bg-white/20 rounded-full overflow-hidden"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-full opacity-60"></div>
            </div>
            
            <div className="text-center">
              <AnimatedBadge
                variant={spendingRatio < 25 ? "info" : spendingRatio < 75 ? "success" : "accent"}
                size="lg"
              >
                {spendingRatio < 25 ? "📈 Explore more premium content!" :
                 spendingRatio < 75 ? "🎯 Great balance of earning and spending!" :
                 "🔥 Active reader! Making great use of credits!"}
              </AnimatedBadge>
            </div>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}