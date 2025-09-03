"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame,
  Trophy,
  Calendar,
  Star,
  Target,
  Zap,
  Clock,
  Award,
  CheckCircle,
  TrendingUp,
  Gift,
  Crown,
  Medal
} from "lucide-react";

interface ReadingStreakProps {
  currentStreak: number;
  longestStreak: number;
  todayRead: boolean;
  streakHistory: boolean[]; // Last 7 days, true = read that day
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress?: number;
    target?: number;
  }[];
  nextMilestone: {
    days: number;
    reward: string;
  };
}

export function ReadingStreak({
  currentStreak,
  longestStreak,
  todayRead,
  streakHistory,
  achievements,
  nextMilestone
}: ReadingStreakProps) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [animateStreak, setAnimateStreak] = useState(false);

  useEffect(() => {
    if (currentStreak > 0) {
      setAnimateStreak(true);
      const timeout = setTimeout(() => setAnimateStreak(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentStreak]);

  const getStreakLevel = (streak: number) => {
    if (streak >= 365) return { level: "Legend", color: "from-yellow-400 to-orange-500" };
    if (streak >= 100) return { level: "Master", color: "from-purple-400 to-pink-500" };
    if (streak >= 30) return { level: "Champion", color: "from-blue-400 to-cyan-500" };
    if (streak >= 7) return { level: "Enthusiast", color: "from-green-400 to-emerald-500" };
    return { level: "Beginner", color: "from-gray-400 to-gray-600" };
  };

  const streakLevel = getStreakLevel(currentStreak);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      flame: Flame,
      trophy: Trophy,
      star: Star,
      target: Target,
      zap: Zap,
      crown: Crown,
      medal: Medal,
      award: Award
    };
    return icons[iconName] || Star;
  };

  return (
    <div className="space-y-6">
      {/* Main Streak Card */}
      <Card className={`bg-gradient-to-br ${streakLevel.color} backdrop-blur-sm border-white/20 overflow-hidden relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <CardContent className="relative p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Streak Display */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className={`flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl ${animateStreak ? 'animate-bounce' : ''}`}>
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <AnimatedBadge
                    variant="glass"
                    size="lg"
                    className="backdrop-blur-sm border-white/30 text-white"
                  >
                    {streakLevel.level}
                  </AnimatedBadge>
                </div>
              </div>
              
              <div className={`text-6xl md:text-7xl font-display font-bold text-white mb-2 ${animateStreak ? 'animate-pulse' : ''}`}>
                {currentStreak}
              </div>
              <p className="text-xl text-white/90 font-medium mb-4">
                Day{currentStreak !== 1 ? 's' : ''} Reading Streak
              </p>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>Best: {longestStreak}</span>
                </div>
                <div className="flex items-center gap-1">
                  {todayRead ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span>Today ✓</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-yellow-300" />
                      <span>Read today?</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-4">This Week</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        streakHistory[index]
                          ? 'bg-white/30 text-white scale-110'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Next Milestone */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Next Milestone</span>
                  <span className="text-white font-medium">{nextMilestone.days} days</span>
                </div>
                <Progress 
                  value={(currentStreak % nextMilestone.days) / nextMilestone.days * 100} 
                  className="h-2 bg-white/20 mb-2"
                />
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-yellow-300" />
                  <span className="text-white/90 text-xs">{nextMilestone.reward}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Achievements */}
        <Card className="lg:col-span-2 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </div>
              <GradientButton
                variant="ghost"
                size="sm"
                onClick={() => setShowAchievements(!showAchievements)}
                className="text-gray-600 hover:bg-white/10"
              >
                {showAchievements ? 'Hide' : 'View All'}
              </GradientButton>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(showAchievements ? achievements : unlockedAchievements.slice(0, 4)).map((achievement) => {
                const IconComponent = getIconComponent(achievement.icon);
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30'
                        : 'bg-gray-100 border-gray-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                        achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-300'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          achievement.unlocked ? 'text-yellow-400' : 'text-gray-800'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-800 font-medium text-sm">
                          {achievement.title}
                        </h4>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    
                    {achievement.progress !== undefined && achievement.target && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-600">
                            {achievement.progress}/{achievement.target}
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.target) * 100} 
                          className="h-1.5 bg-gray-200"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Streak Stats */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-green-400/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {Math.round((currentStreak / longestStreak) * 100) || 0}%
              </div>
              <div className="text-sm text-green-800">
                Of Personal Best
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-blue-400/30">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {streakHistory.filter(day => day).length}
              </div>
              <div className="text-sm text-blue-800">
                Days This Week
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-400/30">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {unlockedAchievements.length}
              </div>
              <div className="text-sm text-purple-800">
                Achievements
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Motivational Message */}
      <Card className={`${!todayRead ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30' : 'bg-gray-100 border-gray-200'} backdrop-blur-sm`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${!todayRead ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                {!todayRead ? (
                  <Clock className="h-6 w-6 text-yellow-800" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-800" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {!todayRead ? "Keep Your Streak Alive!" : "Streak Secured!"}
                </h3>
                <p className={`text-sm ${!todayRead ? 'text-yellow-800' : 'text-green-800'}`}>
                  {!todayRead 
                    ? "Read at least one chapter today to maintain your streak"
                    : "Great job! Your reading streak continues"
                  }
                </p>
              </div>
            </div>
            
            {!todayRead && (
              <GradientButton
                variant="primary"
                size="lg"
                icon={<Flame className="h-5 w-5" />}
              >
                Start Reading
              </GradientButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}