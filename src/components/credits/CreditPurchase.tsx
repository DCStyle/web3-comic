"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { 
  CreditCard, 
  Zap, 
  Star, 
  CheckCircle, 
  Loader2,
  Wallet,
  Crown,
  Gift,
  Timer,
  Sparkles,
  Coins,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  price: string; // in ETH
  bonus: number;
  popular?: boolean;
  limitedTime?: boolean;
  vip?: boolean;
  tier: "bronze" | "silver" | "gold" | "diamond";
  description: string;
  features: string[];
  originalPrice?: string;
  savingsAmount?: number;
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 1,
    name: "Bronze Starter",
    credits: 100,
    price: "0.01",
    bonus: 0,
    tier: "bronze",
    description: "Perfect for trying out premium content",
    features: [
      "100 Credits",
      "Unlock ~20 chapters",
      "Never expires",
      "Instant delivery",
      "Basic support"
    ]
  },
  {
    id: 2,
    name: "Silver Explorer",
    credits: 500,
    price: "0.04",
    originalPrice: "0.05",
    bonus: 25,
    popular: true,
    limitedTime: true,
    tier: "silver",
    savingsAmount: 20,
    description: "Best value for regular readers",
    features: [
      "500 Credits + 25% Bonus",
      "625 Total Credits",
      "Unlock ~125 chapters",
      "Never expires",
      "Priority support",
      "Early access to new chapters"
    ]
  },
  {
    id: 3,
    name: "Gold Collector",
    credits: 1000,
    price: "0.07",
    originalPrice: "0.10",
    bonus: 50,
    tier: "gold",
    savingsAmount: 30,
    description: "For serious comic enthusiasts",
    features: [
      "1000 Credits + 50% Bonus",
      "1500 Total Credits",
      "Unlock ~300 chapters",
      "Never expires",
      "VIP support",
      "Exclusive content access",
      "Custom profile badge"
    ]
  },
  {
    id: 4,
    name: "Diamond Elite",
    credits: 2500,
    price: "0.15",
    originalPrice: "0.25",
    bonus: 100,
    vip: true,
    tier: "diamond",
    savingsAmount: 40,
    description: "Ultimate package for true collectors",
    features: [
      "2500 Credits + 100% Bonus",
      "5000 Total Credits",
      "Unlock ~1000 chapters",
      "Never expires",
      "White-glove support",
      "Creator meet & greets",
      "Diamond VIP badge",
      "Exclusive merchandise"
    ]
  }
];

interface CreditPurchaseProps {
  userId: string;
}

export function CreditPurchase({ userId }: CreditPurchaseProps) {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60); // 12 hours in seconds
  const router = useRouter();

  // Countdown timer for limited-time offers
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTierGradient = (tier: CreditPackage["tier"]) => {
    switch (tier) {
      case "bronze": return "from-orange-600/20 to-orange-800/20 border-orange-500/30";
      case "silver": return "from-gray-400/20 to-gray-600/20 border-gray-400/30";
      case "gold": return "from-yellow-400/20 to-yellow-600/20 border-yellow-400/30";
      case "diamond": return "from-purple-500/20 to-pink-500/20 border-purple-400/30";
    }
  };

  const getTierIcon = (tier: CreditPackage["tier"]) => {
    switch (tier) {
      case "bronze": return <Award className="h-5 w-5" />;
      case "silver": return <Coins className="h-5 w-5" />;
      case "gold": return <Crown className="h-5 w-5" />;
      case "diamond": return <Sparkles className="h-5 w-5" />;
    }
  };

  const handlePurchase = async (packageData: CreditPackage) => {
    setSelectedPackage(packageData);
    setIsPurchasing(true);

    try {
      // Call purchase API
      const response = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: packageData.id,
          credits: packageData.credits,
          bonus: packageData.bonus,
          priceEth: packageData.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Purchase failed");
      }

      toast.success(
        `Successfully purchased ${packageData.credits + Math.floor(packageData.credits * packageData.bonus / 100)} credits!`
      );
      
      // Refresh the page to update balance
      router.refresh();
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast.error(error.message || "Purchase failed. Please try again.");
    } finally {
      setIsPurchasing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <AnimatedBadge
          variant="gradient"
          size="lg"
          animation="glow"
          icon={<Gift className="h-4 w-4" />}
          className="mb-6"
        >
          Choose Your Power Level
        </AnimatedBadge>
        <h2 className="text-4xl font-display font-bold mb-4 text-gradient">
          Unlock Your Reading Adventure
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          All packages include bonus credits, never expire, and unlock instantly via blockchain
        </p>
        
        {/* Limited Time Offer Banner */}
        <div className="mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full px-6 py-3">
          <Timer className="h-4 w-4 text-red-400 animate-pulse" />
          <span className="text-sm font-medium text-red-300">
            Special Discount Ends In: {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {CREDIT_PACKAGES.map((pkg, index) => {
          const totalCredits = pkg.credits + Math.floor(pkg.credits * pkg.bonus / 100);
          const isSelected = selectedPackage?.id === pkg.id;
          const isProcessing = isPurchasing && isSelected;

          return (
            <Card
              key={pkg.id}
              className={`relative group transition-all duration-500 ${
                getTierGradient(pkg.tier)
              } bg-gradient-to-br backdrop-blur-xl shadow-2xl hover:shadow-3xl border-2 ${
                pkg.popular ? 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background' : ''
              } ${pkg.vip ? 'ring-2 ring-purple-500/50 ring-offset-2 ring-offset-background' : ''}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles className="absolute top-4 right-4 h-3 w-3 text-primary/30 animate-pulse" />
                <Sparkles className="absolute bottom-6 left-4 h-2 w-2 text-secondary/30 animate-pulse" style={{animationDelay: '1s'}} />
              </div>

              {/* Tier Badge */}
              <div className="absolute -top-3 -left-3 z-10">
                <AnimatedBadge
                  variant={pkg.tier === 'gold' ? 'warning' : pkg.tier === 'diamond' ? 'neon' : pkg.tier === 'silver' ? 'info' : 'secondary'}
                  animation="glow"
                  icon={getTierIcon(pkg.tier)}
                >
                  {pkg.tier.toUpperCase()}
                </AnimatedBadge>
              </div>

              {/* Popular/VIP/Limited Time Badges */}
              {pkg.popular && (
                <div className="absolute -top-3 -right-3 z-10">
                  <AnimatedBadge
                    variant="gradient"
                    animation="pulse"
                    icon={<Star className="h-3 w-3" />}
                  >
                    MOST POPULAR
                  </AnimatedBadge>
                </div>
              )}

              {pkg.vip && (
                <div className="absolute -top-3 -right-3 z-10">
                  <AnimatedBadge
                    variant="neon"
                    animation="glow"
                    icon={<Crown className="h-3 w-3" />}
                  >
                    VIP EXCLUSIVE
                  </AnimatedBadge>
                </div>
              )}

              {pkg.limitedTime && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-red-500/90 text-white border-0 animate-pulse">
                    <Timer className="h-3 w-3 mr-1" />
                    LIMITED
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 relative z-10">
                <CardTitle className="text-foreground text-2xl mb-4 font-display">
                  {pkg.name}
                </CardTitle>
                
                <div className="space-y-3">
                  {/* Price Display */}
                  <div className="space-y-1">
                    {pkg.originalPrice && (
                      <div className="text-muted-foreground line-through text-sm">
                        {pkg.originalPrice} ETH
                      </div>
                    )}
                    <div className="text-4xl font-bold text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text">
                      {pkg.price} ETH
                    </div>
                    {pkg.savingsAmount && (
                      <div className="text-green-500 text-sm font-semibold">
                        Save {pkg.savingsAmount}%!
                      </div>
                    )}
                  </div>
                  
                  {/* Credits Display */}
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl font-semibold">
                      {pkg.credits} Credits
                    </span>
                    {pkg.bonus > 0 && (
                      <AnimatedBadge
                        variant="success"
                        animation="pulse"
                        icon={<Gift className="h-3 w-3" />}
                      >
                        +{pkg.bonus}%
                      </AnimatedBadge>
                    )}
                  </div>
                  
                  {pkg.bonus > 0 && (
                    <div className="text-lg text-green-500 font-bold">
                      = {totalCredits.toLocaleString()} Total Credits
                    </div>
                  )}
                </div>
                
                <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
                  {pkg.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10">
                {/* Features List */}
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/90 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Purchase Button */}
                <GradientButton
                  onClick={() => handlePurchase(pkg)}
                  disabled={isPurchasing}
                  variant={pkg.vip ? "neon" : pkg.popular ? "primary" : "outline"}
                  size="lg"
                  className="w-full group-hover:scale-105 transition-transform duration-300"
                  icon={isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                >
                  {isProcessing ? 'Processing...' : 'Purchase Now'}
                </GradientButton>

                {/* Instant Delivery Notice */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-full px-3 py-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    Instant blockchain delivery
                  </div>
                </div>

                {/* Value Proposition */}
                <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="text-xs text-muted-foreground">
                    💎 Unlock ~{Math.floor(totalCredits / 5)} premium chapters
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security & Trust Section */}
      <div className="mt-16 grid md:grid-cols-2 gap-8">
        <div className="text-center p-6 bg-card/50 rounded-2xl border border-border/50">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Secure Blockchain Payment</h3>
          <p className="text-muted-foreground text-sm">
            All transactions are verified on-chain with smart contract security and transparency
          </p>
        </div>
        
        <div className="text-center p-6 bg-card/50 rounded-2xl border border-border/50">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
            <Zap className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Instant Access</h3>
          <p className="text-muted-foreground text-sm">
            Credits are delivered immediately after blockchain confirmation - no waiting required
          </p>
        </div>
      </div>
      
      {/* Money Back Guarantee */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full px-6 py-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-green-600">
            30-day satisfaction guarantee • Credits never expire • Instant delivery
          </span>
        </div>
      </div>
    </div>
  );
}