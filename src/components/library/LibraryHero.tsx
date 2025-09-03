"use client";

import { useState, useEffect } from "react";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { FloatingElements, GeometricPattern } from "@/components/ui/floating-elements";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Star, 
  TrendingUp,
  Calendar,
  Zap,
  Users
} from "lucide-react";

interface LibraryHeroProps {
  user: {
    username: string;
    address: string;
  };
  stats: {
    totalComics: number;
    totalChapters: number;
    readingProgress: number;
    completedComics: number;
    readingStreak: number;
    minutesRead: number;
  };
}

export function LibraryHero({ user, stats }: LibraryHeroProps) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <section className="relative min-h-[60vh] py-24 flex items-center justify-center overflow-hidden mb-8 lg:mb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 animated-gradient opacity-20" />
      <FloatingElements count={15} variant="subtle" animated />
      <GeometricPattern />
      
      {/* Main Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Badge */}
          <div className="flex justify-center mb-8">
            <AnimatedBadge
              variant="gradient"
              size="lg"
              animation="float"
              icon={<BookOpen className="h-4 w-4" />}
            >
              My Digital Library
            </AnimatedBadge>
          </div>

          {/* Personalized Greeting */}
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            <span className="text-muted-foreground text-2xl md:text-3xl block mb-4">
              {greeting},
            </span>
            <span className="text-gradient bg-gradient-hero">
              {user.username}
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Continue your reading journey and discover amazing stories in your personal collection
          </p>

          {/* Reading Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Comics */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stats.totalComics}
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Comics in Library
              </div>
            </div>

            {/* Total Chapters */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-secondary rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stats.totalChapters}
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Chapters Unlocked
              </div>
            </div>

            {/* Reading Progress */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-accent rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stats.readingProgress}
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                In Progress
              </div>
            </div>

            {/* Reading Streak */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-warm rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stats.readingStreak}
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Day Streak
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {stats.completedComics > 0 && (
              <AnimatedBadge
                variant="success"
                size="lg"
                icon={<Star className="h-4 w-4" />}
                animation="glow"
              >
                {stats.completedComics} Comics Completed
              </AnimatedBadge>
            )}
            
            {stats.readingStreak >= 7 && (
              <AnimatedBadge
                variant="neon"
                size="lg"
                icon={<Calendar className="h-4 w-4" />}
                animation="pulse"
              >
                Week Streak!
              </AnimatedBadge>
            )}
            
            {stats.minutesRead > 60 && (
              <AnimatedBadge
                variant="info"
                size="lg"
                icon={<Clock className="h-4 w-4" />}
              >
                {Math.round(stats.minutesRead / 60)}h Read This Week
              </AnimatedBadge>
            )}
          </div>

          {/* Quick Stats Summary */}
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Your reading level: 
              <span className="text-gradient font-semibold ml-2">
                {stats.totalComics < 5 ? "Explorer" : 
                 stats.totalComics < 15 ? "Enthusiast" : 
                 stats.totalComics < 30 ? "Collector" : "Master Reader"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}