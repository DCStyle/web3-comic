"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  Award, 
  Copy, 
  CheckCircle,
  Sparkles,
  Crown,
  Gift,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  creditsBalance: number;
  walletAddress: string;
}

interface CreditBalanceProps {
  user: User;
}

// VIP tier thresholds
const VIP_TIERS = [
  { name: "Bronze Reader", minCredits: 0, color: "text-orange-600", bgColor: "bg-orange-100", icon: Award },
  { name: "Silver Explorer", minCredits: 500, color: "text-gray-600", bgColor: "bg-gray-100", icon: TrendingUp },
  { name: "Gold Collector", minCredits: 2000, color: "text-yellow-600", bgColor: "bg-yellow-100", icon: Crown },
  { name: "Platinum Elite", minCredits: 5000, color: "text-purple-600", bgColor: "bg-purple-100", icon: Sparkles },
];

export function CreditBalance({ user }: CreditBalanceProps) {
  const [copied, setCopied] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  // Get current VIP tier
  const currentTier = VIP_TIERS.reduce((prev, current) => 
    user.creditsBalance >= current.minCredits ? current : prev
  );
  
  // Get next tier
  const nextTier = VIP_TIERS.find(tier => tier.minCredits > user.creditsBalance);
  const progressToNextTier = nextTier 
    ? ((user.creditsBalance - currentTier.minCredits) / (nextTier.minCredits - currentTier.minCredits)) * 100
    : 100;

  // Animate balance counter on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = user.creditsBalance / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= user.creditsBalance) {
        setAnimatedBalance(user.creditsBalance);
        clearInterval(timer);
      } else {
        setAnimatedBalance(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [user.creditsBalance]);

  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      toast.success("Wallet address copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy wallet address");
    }
  };

  const IconComponent = currentTier.icon;

  return (
    <div className="flex justify-center">
      <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-border/50 shadow-2xl max-w-2xl w-full">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full" />
        
        {/* Animated Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-4 right-4 h-4 w-4 text-primary/30 animate-pulse" />
          <Sparkles className="absolute bottom-6 left-6 h-3 w-3 text-secondary/30 animate-pulse" style={{animationDelay: '1s'}} />
          <Sparkles className="absolute top-1/2 left-1/4 h-2 w-2 text-primary/20 animate-pulse" style={{animationDelay: '0.5s'}} />
        </div>

        <CardContent className="relative p-8 text-center">
          {/* VIP Tier Badge */}
          <div className="flex justify-center mb-6">
            <Badge 
              className={`${currentTier.bgColor} ${currentTier.color} px-4 py-2 text-sm font-semibold flex items-center gap-2 border-0`}
            >
              <IconComponent className="h-4 w-4" />
              {currentTier.name}
            </Badge>
          </div>

          {/* Main Balance Display */}
          <div className="mb-6">
            <div className="text-muted-foreground text-sm mb-2 uppercase tracking-wider font-medium">
              Available Credits
            </div>
            <div className="text-6xl font-bold font-display mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {animatedBalance.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-sm">
              ≈ {Math.floor(animatedBalance / 5)} premium chapters
            </div>
          </div>

          {/* VIP Progress Bar */}
          {nextTier && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Progress to {nextTier.name}
                </span>
                <span className="text-sm font-semibold">
                  {Math.floor(progressToNextTier)}%
                </span>
              </div>
              <Progress value={progressToNextTier} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {(nextTier.minCredits - user.creditsBalance).toLocaleString()} credits to unlock
              </div>
            </div>
          )}

          {/* Wallet Address */}
          <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border/30">
            <div className="flex items-center justify-center gap-3">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm">
                {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-8)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyWalletAddress}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-sm text-muted-foreground mb-1">This Month</div>
              <div className="text-lg font-semibold">12 Unlocked</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
              <Gift className="h-6 w-6 text-secondary mx-auto mb-2" />
              <div className="text-sm text-muted-foreground mb-1">Loyalty Points</div>
              <div className="text-lg font-semibold">
                {Math.floor(user.creditsBalance * 0.1).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Tier Benefits Preview */}
          {nextTier && (
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-border/30">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                🎉 Unlock {nextTier.name} Benefits:
              </div>
              <div className="text-xs text-muted-foreground">
                • Exclusive early access • Special badge • Priority support • Bonus rewards
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}