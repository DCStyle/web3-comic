"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditPurchase } from "@/components/web3/CreditPurchase";
import { Lock, CreditCard, Zap } from "lucide-react";
import toast from "react-hot-toast";

interface UnlockPromptProps {
  chapterId: string;
  unlockCost: number;
  chapterTitle: string;
  onUnlocked?: () => void;
}

export function UnlockPrompt({ 
  chapterId, 
  unlockCost, 
  chapterTitle, 
  onUnlocked 
}: UnlockPromptProps) {
  const { data: session, update: updateSession } = useSession();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  const userBalance = session?.user?.creditsBalance ?? 0;
  const hasEnoughCredits = userBalance >= unlockCost;

  const handleUnlock = async () => {
    if (!hasEnoughCredits) {
      setShowPurchase(true);
      return;
    }

    try {
      setIsUnlocking(true);
      
      const response = await fetch(`/api/comics/${chapterId}/chapters/${chapterId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Unlock failed");
      }

      const result = await response.json();
      
      if (result.already) {
        toast.success("Chapter already unlocked!");
      } else if (result.free) {
        toast.success("Free chapter unlocked!");
      } else {
        toast.success(`Chapter unlocked for ${result.creditsSpent} credits!`);
        // Update session to reflect new balance
        await updateSession();
      }
      
      onUnlocked?.();
    } catch (error: any) {
      console.error("Unlock failed:", error);
      toast.error(error?.message ?? "Failed to unlock chapter");
    } finally {
      setIsUnlocking(false);
    }
  };

  if (showPurchase) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowPurchase(false)}
            className="mb-4"
          >
            ← Back to Chapter
          </Button>
          <h2 className="text-2xl font-bold">Purchase Credits</h2>
          <p className="text-muted-foreground">
            You need {unlockCost - userBalance} more credits to unlock "{chapterTitle}"
          </p>
        </div>
        
        <CreditPurchase 
          onSuccess={() => {
            setShowPurchase(false);
            updateSession();
          }} 
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Premium Chapter</CardTitle>
          <CardDescription>
            "{chapterTitle}" requires credits to unlock
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{unlockCost}</div>
            <div className="text-sm text-muted-foreground">Credits Required</div>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm font-medium">Your Balance</span>
            <Badge variant={hasEnoughCredits ? "default" : "destructive"}>
              {userBalance} credits
            </Badge>
          </div>

          {hasEnoughCredits ? (
            <Button 
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="w-full"
              size="lg"
            >
              {isUnlocking ? (
                "Unlocking..."
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Unlock Chapter ({unlockCost} credits)
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-center text-muted-foreground">
                You need {unlockCost - userBalance} more credits
              </p>
              <Button 
                onClick={() => setShowPurchase(true)}
                className="w-full"
                size="lg"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Purchase Credits
              </Button>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            Once unlocked, this chapter will be available forever in your library
          </p>
        </CardContent>
      </Card>
    </div>
  );
}