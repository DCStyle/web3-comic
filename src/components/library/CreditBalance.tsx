"use client";

import { useState } from "react";
import Link from "next/link";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, 
  Coins, 
  TrendingUp, 
  ShoppingCart,
  Gift,
  Zap,
  Clock,
  Star,
  AlertCircle
} from "lucide-react";

interface CreditBalanceProps {
  balance: number;
  recentSpending?: number;
  totalEarned?: number;
  weeklySpent?: number;
  nextUnlock?: {
    comicTitle: string;
    chapterTitle: string;
    cost: number;
  };
  specialOffer?: {
    title: string;
    discount: number;
    originalPrice: number;
    discountedPrice: number;
    expires: string;
  };
}

export function CreditBalance({ 
  balance, 
  recentSpending = 0,
  totalEarned = 0,
  weeklySpent = 0,
  nextUnlock,
  specialOffer 
}: CreditBalanceProps) {
  const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);
  const isLowBalance = balance < 20;

  const creditPackages = [
    { credits: 50, price: 4.99, bonus: 0, popular: false },
    { credits: 100, price: 9.99, bonus: 10, popular: true },
    { credits: 250, price: 19.99, bonus: 50, popular: false },
    { credits: 500, price: 39.99, bonus: 150, popular: false },
  ];

  return (
    <div className="space-y-6">
      {/* Main Credit Balance Card */}
      <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-white/20 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-500 overflow-hidden">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Balance Display */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-xl">
                  <Coins className="h-7 w-7 text-white" />
                </div>
                <div>
                  <AnimatedBadge
                    variant={isLowBalance ? "warning" : "success"}
                    icon={isLowBalance ? <AlertCircle className="h-3 w-3" /> : <Wallet className="h-3 w-3" />}
                  >
                    {isLowBalance ? "Low Balance" : "Active"}
                  </AnimatedBadge>
                </div>
              </div>
              
              <div className="text-5xl md:text-6xl font-display font-bold text-gradient mb-2">
                {balance.toLocaleString()}
              </div>
              <p className="text-xl text-muted-foreground font-medium">
                Credits Available
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {totalEarned.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Earned</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {weeklySpent}
                </div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <GradientButton
                variant="primary"
                size="lg"
                icon={<ShoppingCart className="h-5 w-5" />}
                onClick={() => setShowPurchaseOptions(!showPurchaseOptions)}
                className="w-full"
              >
                Buy Credits
              </GradientButton>
              
              <Link href="/earn-credits" className="block">
                <GradientButton
                  variant="outline"
                  size="lg"
                  icon={<Gift className="h-5 w-5" />}
                  className="w-full"
                >
                  Earn Free Credits
                </GradientButton>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Offer Banner */}
      {specialOffer && (
        <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border-orange-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-xl">
                  <Star className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {specialOffer.title}
                  </h3>
                  <p className="text-orange-800 text-sm">
                    Save {specialOffer.discount}% • Expires {specialOffer.expires}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${specialOffer.discountedPrice}
                </div>
                <div className="text-sm text-orange-800 line-through">
                  ${specialOffer.originalPrice}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Unlock Preview */}
      {nextUnlock && balance >= nextUnlock.cost && (
        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-green-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Ready to Unlock
                  </h3>
                  <p className="text-green-200 text-sm">
                    {nextUnlock.comicTitle} - {nextUnlock.chapterTitle}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <AnimatedBadge
                  variant="success"
                  size="lg"
                  icon={<Coins className="h-4 w-4" />}
                >
                  {nextUnlock.cost} Credits
                </AnimatedBadge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Purchase Options */}
      {showPurchaseOptions && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {creditPackages.map((pkg, index) => (
            <Card 
              key={index}
              className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group ${
                pkg.popular ? 'ring-2 ring-blue-400/50' : ''
              }`}
            >
              <CardContent className="p-6 text-center">
                {pkg.popular && (
                  <AnimatedBadge
                    variant="neon"
                    size="sm"
                    className="mb-4"
                    animation="glow"
                  >
                    Most Popular
                  </AnimatedBadge>
                )}
                
                <div className="text-3xl font-bold text-gradient mb-2">
                  {pkg.credits + pkg.bonus}
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {pkg.credits} + {pkg.bonus} bonus
                </div>
                <div className="text-xl font-bold text-white mb-4">
                  ${pkg.price}
                </div>
                
                <GradientButton
                  variant={pkg.popular ? "primary" : "outline"}
                  size="sm"
                  className="w-full group-hover:scale-105 transition-transform"
                  icon={<Wallet className="h-4 w-4" />}
                >
                  Purchase
                </GradientButton>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Low Balance Warning */}
      {isLowBalance && (
        <Card className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border-red-400/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-red-800 text-sm">
                Your credit balance is running low. Consider purchasing more credits to continue unlocking premium content.
              </p>
              <GradientButton
                variant="outline"
                size="sm"
                className="ml-auto border-red-400/50 text-red-800 hover:bg-red-400/20"
              >
                Top Up
              </GradientButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}