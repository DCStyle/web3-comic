"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  Sparkles, 
  Heart,
  Zap, 
  Star, 
  Eye,
  Clock,
  Crown,
  Coins,
  ChevronRight,
  Wallet,
  BookOpen
} from "lucide-react";

interface RecommendedComic {
  id: string;
  title: string;
  slug: string;
  author: string;
  coverImage: string;
  genre: string[];
  rating: number;
  unlockCost: number;
  freeChapters: number;
  reason: string;
  isNew?: boolean;
  isHot?: boolean;
  estimatedReadTime: number;
}

interface RecommendedSectionProps {
  recommendations?: RecommendedComic[];
  userId?: string | null;
  userCredits?: number;
  loading?: boolean;
}

const defaultRecommendations: RecommendedComic[] = [
  {
    id: "1",
    title: "Dragon's Legacy",
    slug: "dragons-legacy",
    author: "Sarah Fantasy",
    coverImage: "/api/placeholder/300/400",
    genre: ["Fantasy", "Adventure"],
    rating: 4.9,
    unlockCost: 5,
    freeChapters: 3,
    reason: "Because you love fantasy adventures",
    isNew: true,
    isHot: false,
    estimatedReadTime: 25
  },
  {
    id: "2", 
    title: "Neon Samurai",
    slug: "neon-samurai",
    author: "Takeshi Cyber",
    coverImage: "/api/placeholder/300/400", 
    genre: ["Sci-Fi", "Action"],
    rating: 4.7,
    unlockCost: 8,
    freeChapters: 2,
    reason: "Trending in your favorite genres",
    isNew: false,
    isHot: true,
    estimatedReadTime: 30
  }
];

export function RecommendedSection({ 
  recommendations = defaultRecommendations, 
  userId,
  userCredits = 0,
  loading = false 
}: RecommendedSectionProps) {
  const isAuthenticated = userId !== null;

  if (loading) {
    return (
      <Card className="bg-gray-100 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex gap-3">
                  <div className="w-12 h-16 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-100 backdrop-blur-sm border-gray-200 hover:bg-gray-150 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">Recommended</span>
          </div>
          
          {isAuthenticated && (
            <AnimatedBadge
              variant="info"
              size="sm"
              icon={<Coins className="h-3 w-3" />}
            >
              {userCredits} credits
            </AnimatedBadge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isAuthenticated && (
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30 mb-4">
            <div className="text-center">
              <Wallet className="h-8 w-8 mx-auto text-blue-400 mb-2" />
              <p className="text-gray-800 text-sm font-medium mb-2">
                Connect to see personalized recommendations
              </p>
              <Link href="/connect-wallet">
                <GradientButton
                  variant="primary"
                  size="sm"
                  icon={<Wallet className="h-4 w-4" />}
                  className="w-full"
                >
                  Connect Wallet
                </GradientButton>
              </Link>
            </div>
          </div>
        )}

        {recommendations.slice(0, 2).map((comic, index) => {
          const canAfford = userCredits >= comic.unlockCost;
          
          return (
            <div
              key={comic.id}
              className="relative group"
            >
              <Link href={`/comics/${comic.slug}`} className="block">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:scale-105">
                  {/* Recommendation Badges */}
                  <div className="absolute -top-2 -right-2 z-10">
                    {comic.isNew && (
                      <AnimatedBadge
                        variant="success"
                        size="sm"
                        animation="glow"
                        icon={<Zap className="h-3 w-3" />}
                      >
                        New
                      </AnimatedBadge>
                    )}
                    {comic.isHot && (
                      <AnimatedBadge
                        variant="warning"
                        size="sm"
                        animation="pulse"
                        icon={<Heart className="h-3 w-3" />}
                      >
                        Hot
                      </AnimatedBadge>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {/* Comic Cover */}
                    <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={comic.coverImage}
                        alt={`${comic.title} cover`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="48px"
                      />
                    </div>

                    {/* Comic Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Title and Rating */}
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-purple-800 transition-colors">
                          {comic.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-600 fill-current" />
                            <span className="text-xs text-gray-800">{comic.rating}</span>
                          </div>
                          <span className="text-xs text-gray-600">by {comic.author}</span>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-purple-600" />
                        <span className="text-xs text-purple-800 line-clamp-1">
                          {comic.reason}
                        </span>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{comic.freeChapters} free</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{comic.estimatedReadTime}m</span>
                          </div>
                        </div>
                        <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Unlock CTA */}
              {isAuthenticated && comic.unlockCost > 0 && (
                <div className="mt-2 p-2 bg-gray-800 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-200">
                        {comic.unlockCost} credits to unlock
                      </span>
                    </div>
                    
                    {canAfford ? (
                      <GradientButton
                        variant="accent"
                        size="sm"
                        icon={<Zap className="h-3 w-3" />}
                        className="text-xs"
                      >
                        Unlock Now
                      </GradientButton>
                    ) : (
                      <Link href="/buy-credits">
                        <GradientButton
                          variant="outline"
                          size="sm"
                          icon={<Wallet className="h-3 w-3" />}
                          className="text-xs border-gray-300 text-white hover:bg-gray-100"
                        >
                          Buy Credits
                        </GradientButton>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Personalization Note */}
        {isAuthenticated && (
          <div className="pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-800">
                  Personalized for you
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Based on your reading history and preferences
              </p>
            </div>
          </div>
        )}

        {/* View All Recommendations */}
        <div className="pt-2 border-t border-gray-100">
          <Link href="/recommendations" className="block">
            <GradientButton
              variant="outline"
              size="sm"
              className="w-full border-white/30 text-gray-800 hover:bg-gray-100"
              icon={<Eye className="h-4 w-4" />}
            >
              View All Recommendations
            </GradientButton>
          </Link>
        </div>

        {/* Credit Purchase Prompt */}
        {isAuthenticated && userCredits < 20 && (
          <div className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30">
            <div className="text-center">
              <Coins className="h-6 w-6 mx-auto text-orange-600 mb-2" />
              <p className="text-orange-800 text-sm font-medium mb-2">
                Low on credits?
              </p>
              <p className="text-orange-800 text-xs mb-3">
                Get more to unlock premium content
              </p>
              <Link href="/buy-credits">
                <GradientButton
                  variant="accent"
                  size="sm"
                  icon={<Zap className="h-4 w-4" />}
                  className="w-full"
                >
                  Buy Credits
                </GradientButton>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}