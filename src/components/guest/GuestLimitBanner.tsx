"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  Wallet, 
  BookOpen, 
  AlertTriangle,
  Gift
} from "lucide-react";
import { getGuestStats, markWarningShown, canGuestReadChapter } from "@/lib/utils/guestTracking";

export function GuestLimitBanner() {
  const [stats, setStats] = useState(getGuestStats());
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const { needsWarning } = canGuestReadChapter();
    if (needsWarning && !isDismissed) {
      setIsVisible(true);
    }

    // Update stats periodically
    const interval = setInterval(() => {
      setStats(getGuestStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    markWarningShown();
  };

  if (!isVisible || stats.chaptersRead < 3) {
    return null;
  }

  const isNearLimit = stats.remaining <= 2;
  const isAtLimit = stats.isAtLimit;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 p-4">
      <Card className={`mx-auto max-w-2xl ${
        isAtLimit ? "bg-red-500/20 border-red-400/30" : 
        isNearLimit ? "bg-orange-500/20 border-orange-400/30" : 
        "bg-blue-500/20 border-blue-400/30"
      } backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${
              isAtLimit ? "bg-red-400/20" :
              isNearLimit ? "bg-orange-400/20" :
              "bg-blue-400/20"
            }`}>
              {isAtLimit ? (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              ) : (
                <Gift className="h-5 w-5 text-blue-400" />
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className={`font-semibold ${
                  isAtLimit ? "text-red-300" :
                  isNearLimit ? "text-orange-300" :
                  "text-blue-300"
                }`}>
                  {isAtLimit ? "Reading Limit Reached" :
                   isNearLimit ? "Almost at Reading Limit" :
                   "Enjoying the Comics?"}
                </h3>
                <p className="text-white/80 text-sm">
                  {isAtLimit ? 
                    "You've read all 5 free chapters for today. Connect your wallet to continue reading!" :
                    isNearLimit ?
                    `Only ${stats.remaining} free chapters remaining today. Connect your wallet for unlimited access!` :
                    `You've read ${stats.chaptersRead} chapters. Connect your wallet to unlock unlimited reading and exclusive content!`
                  }
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Free chapters used</span>
                  <span>{stats.chaptersRead} / {stats.limit}</span>
                </div>
                <Progress 
                  value={stats.percentageUsed} 
                  className={`h-2 ${
                    isAtLimit ? "bg-red-400/20" :
                    isNearLimit ? "bg-orange-400/20" :
                    "bg-blue-400/20"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <Link href="/connect-wallet">
                  <Button 
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  asChild
                >
                  <Link href="/comics">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse More
                  </Link>
                </Button>
              </div>

              <div className="text-xs text-white/60">
                💡 With a connected wallet you get unlimited reading, progress tracking, and exclusive content!
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-white/70 hover:text-white hover:bg-white/20 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}