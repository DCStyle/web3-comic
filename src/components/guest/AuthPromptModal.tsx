"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, 
  BookOpen, 
  Star,
  Shield,
  History,
  TrendingUp,
  X,
  Check
} from "lucide-react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "chapter_limit" | "premium_content" | "feature_access";
  chapterTitle?: string;
}

export function AuthPromptModal({ 
  isOpen, 
  onClose, 
  trigger = "premium_content",
  chapterTitle 
}: AuthPromptModalProps) {
  const getModalContent = () => {
    switch (trigger) {
      case "chapter_limit":
        return {
          title: "Reading Limit Reached",
          description: "You've read all your free chapters for today. Connect your wallet to continue reading unlimited chapters!",
          icon: BookOpen,
          color: "text-orange-400",
          bgColor: "bg-orange-400/20",
        };
      case "premium_content":
        return {
          title: "Premium Content",
          description: chapterTitle ? 
            `"${chapterTitle}" is premium content. Connect your wallet and purchase credits to unlock this chapter!` :
            "This content requires credits to unlock. Connect your wallet to access premium chapters!",
          icon: Star,
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/20",
        };
      default:
        return {
          title: "Connect Your Wallet",
          description: "Connect your wallet to access all platform features and track your reading progress.",
          icon: Wallet,
          color: "text-blue-400",
          bgColor: "bg-blue-400/20",
        };
    }
  };

  const { title, description, icon: Icon, color, bgColor } = getModalContent();

  const benefits = [
    {
      icon: BookOpen,
      title: "Unlimited Reading",
      description: "Access all free chapters without daily limits"
    },
    {
      icon: Star,
      title: "Premium Content",
      description: "Purchase credits to unlock exclusive chapters"
    },
    {
      icon: History,
      title: "Progress Tracking",
      description: "Automatic bookmarks and reading history"
    },
    {
      icon: TrendingUp,
      title: "Personalized Library",
      description: "Build your collection and get recommendations"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and blockchain-secured"
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 border border-white/20 backdrop-blur-sm text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className={`text-xl font-bold flex items-center gap-2 ${color}`}>
              <div className={`p-2 rounded-full ${bgColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-white/80">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">What you get with a connected wallet:</h3>
            <div className="grid gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <div className="p-1.5 rounded bg-blue-400/20">
                    <benefit.icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-white">{benefit.title}</div>
                    <div className="text-xs text-white/70">{benefit.description}</div>
                  </div>
                  <Check className="h-4 w-4 text-green-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Special Offer */}
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30">
            <CardContent className="p-4 text-center">
              <h4 className="font-semibold text-green-300 mb-2">🎁 New User Bonus</h4>
              <p className="text-sm text-white/90">
                Get 50% bonus credits on your first purchase! 
                Perfect for trying out premium chapters.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/connect-wallet" onClick={onClose}>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet & Start Reading
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <Link href="/comics" onClick={onClose} className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  Browse More Comics
                </Button>
              </Link>
              <Button 
                variant="ghost"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/20"
              >
                Maybe Later
              </Button>
            </div>
          </div>

          {/* Security Note */}
          <div className="text-center text-xs text-white/60 border-t border-white/10 pt-4">
            <Shield className="h-3 w-3 inline mr-1" />
            Your wallet connection is secure and we never access your funds without permission.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}