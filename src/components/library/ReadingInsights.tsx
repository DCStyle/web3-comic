"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  BookOpen,
  Award,
  Flame,
  Eye,
  ChevronRight
} from "lucide-react";

interface ReadingInsightsProps {
  weeklyData: {
    day: string;
    chaptersRead: number;
    minutesRead: number;
  }[];
  monthlyStats: {
    totalChapters: number;
    totalMinutes: number;
    averageDaily: number;
    goalProgress: number;
    longestStreak: number;
    favoriteGenres: string[];
  };
  goals: {
    daily: { target: number; current: number };
    weekly: { target: number; current: number };
    monthly: { target: number; current: number };
  };
}

type ViewType = "week" | "month" | "goals";

export function ReadingInsights({ weeklyData, monthlyStats, goals }: ReadingInsightsProps) {
  const [activeView, setActiveView] = useState<ViewType>("week");
  
  const maxChapters = Math.max(...weeklyData.map(d => d.chaptersRead), 1);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-secondary rounded-lg">
            <BarChart className="h-5 w-5 text-gray-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Reading Insights</h2>
            <p className="text-muted-foreground text-sm">Track your reading habits and progress</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {[
            { key: "week", label: "Week", icon: Calendar },
            { key: "month", label: "Month", icon: TrendingUp },
            { key: "goals", label: "Goals", icon: Target }
          ].map(({ key, label, icon: Icon }) => (
            <GradientButton
              key={key}
              variant={activeView === key ? "primary" : "outline"}
              size="sm"
              icon={<Icon className="h-4 w-4" />}
              onClick={() => setActiveView(key as ViewType)}
            >
              {label}
            </GradientButton>
          ))}
        </div>
      </div>

      {/* Weekly View */}
      {activeView === "week" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Chart */}
          <Card className="lg:col-span-2 bg-gray-100 backdrop-blur-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                This Week's Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">
                        {day.day}
                      </span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-blue-400">
                          {day.chaptersRead} chapters
                        </span>
                        <span className="text-purple-400">
                          {day.minutesRead}m
                        </span>
                      </div>
                    </div>
                    
                    {/* Chapters Bar */}
                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
                        style={{ width: `${(day.chaptersRead / maxChapters) * 100}%` }}
                      />
                    </div>
                    
                    {/* Minutes Bar */}
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(day.minutesRead / 60, 1) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Stats */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gradient mb-2">
                  {weeklyData.reduce((sum, day) => sum + day.chaptersRead, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Chapters This Week</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gradient mb-2">
                  {Math.round(weeklyData.reduce((sum, day) => sum + day.minutesRead, 0) / 60)}h
                </div>
                <div className="text-sm text-muted-foreground">Hours This Week</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gradient mb-2">
                  {Math.round(weeklyData.reduce((sum, day) => sum + day.chaptersRead, 0) / 7 * 10) / 10}
                </div>
                <div className="text-sm text-muted-foreground">Daily Average</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Monthly View */}
      {activeView === "month" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gradient mb-2">
                {monthlyStats.totalChapters}
              </div>
              <div className="text-sm text-muted-foreground">Chapters Read</div>
              <AnimatedBadge variant="info" size="sm" className="mt-2">
                This Month
              </AnimatedBadge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Clock className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gradient mb-2">
                {Math.round(monthlyStats.totalMinutes / 60)}h
              </div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
              <AnimatedBadge variant="gradient" size="sm" className="mt-2">
                Reading Time
              </AnimatedBadge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Flame className="h-10 w-10 text-orange-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gradient mb-2">
                {monthlyStats.longestStreak}
              </div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
              <AnimatedBadge variant="warning" size="sm" className="mt-2">
                Days in a Row
              </AnimatedBadge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 text-green-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gradient mb-2">
                {monthlyStats.averageDaily.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Daily Average</div>
              <AnimatedBadge variant="success" size="sm" className="mt-2">
                Chapters/Day
              </AnimatedBadge>
            </CardContent>
          </Card>

          {/* Favorite Genres */}
          <Card className="md:col-span-2 lg:col-span-4 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Favorite Genres This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {monthlyStats.favoriteGenres.map((genre, index) => (
                  <AnimatedBadge
                    key={genre}
                    variant={index === 0 ? "gradient" : index === 1 ? "neon" : "glass"}
                    size="lg"
                    className="capitalize"
                  >
                    {genre}
                  </AnimatedBadge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Goals View */}
      {activeView === "goals" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daily Goal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Daily Goal
                </div>
                <AnimatedBadge
                  variant={goals.daily.current >= goals.daily.target ? "success" : "warning"}
                  size="sm"
                >
                  {Math.round((goals.daily.current / goals.daily.target) * 100)}%
                </AnimatedBadge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">
                  {goals.daily.current} / {goals.daily.target}
                </div>
                <div className="text-sm text-muted-foreground">Chapters today</div>
              </div>
              
              <Progress 
                value={(goals.daily.current / goals.daily.target) * 100} 
                className="h-3 bg-white/20"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.max(0, goals.daily.target - goals.daily.current)} to go</span>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Goal
                </div>
                <AnimatedBadge
                  variant={goals.weekly.current >= goals.weekly.target ? "success" : "info"}
                  size="sm"
                >
                  {Math.round((goals.weekly.current / goals.weekly.target) * 100)}%
                </AnimatedBadge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">
                  {goals.weekly.current} / {goals.weekly.target}
                </div>
                <div className="text-sm text-muted-foreground">Chapters this week</div>
              </div>
              
              <Progress 
                value={(goals.weekly.current / goals.weekly.target) * 100} 
                className="h-3 bg-white/20"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.max(0, goals.weekly.target - goals.weekly.current)} remaining</span>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Goal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Monthly Goal
                </div>
                <AnimatedBadge
                  variant={goals.monthly.current >= goals.monthly.target ? "success" : "gradient"}
                  size="sm"
                >
                  {Math.round((goals.monthly.current / goals.monthly.target) * 100)}%
                </AnimatedBadge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">
                  {goals.monthly.current} / {goals.monthly.target}
                </div>
                <div className="text-sm text-muted-foreground">Chapters this month</div>
              </div>
              
              <Progress 
                value={(goals.monthly.current / goals.monthly.target) * 100} 
                className="h-3 bg-white/20"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.max(0, goals.monthly.target - goals.monthly.current)} to go</span>
              </div>
            </CardContent>
          </Card>

          {/* Goal Achievement */}
          <Card className="md:col-span-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border-yellow-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-xl">
                    <Award className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Reading Champion
                    </h3>
                    <p className="text-yellow-200 text-sm">
                      You're on track to meet all your reading goals this month!
                    </p>
                  </div>
                </div>
                
                <GradientButton
                  variant="outline"
                  size="sm"
                  icon={<ChevronRight className="h-4 w-4" />}
                  className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/20"
                >
                  View Achievements
                </GradientButton>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}