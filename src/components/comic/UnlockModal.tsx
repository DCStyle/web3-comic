"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Wallet, Lock, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  chapterTitle: string;
  unlockCost: number;
  userId: string;
  comicId: string;
}

export function UnlockModal({
  isOpen,
  onClose,
  chapterId,
  chapterTitle,
  unlockCost,
  userId,
  comicId,
}: UnlockModalProps) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const router = useRouter();

  // Fetch user's current credit balance when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      setLoadingCredits(true);
      fetch('/api/credits/balance')
        .then(res => res.json())
        .then(data => {
          setUserCredits(data.balance || 0);
        })
        .catch(() => {
          setUserCredits(0);
        })
        .finally(() => {
          setLoadingCredits(false);
        });
    }
  }, [isOpen, userId]);

  const handleUnlock = async () => {
    // Check if user has enough credits before attempting unlock
    if (userCredits !== null && userCredits < unlockCost) {
      toast.error(
        `Insufficient credits! You have ${userCredits} credits but need ${unlockCost} credits to unlock this chapter.`,
        {
          duration: 5000,
        }
      );
      router.push("/credits");
      return;
    }

    setIsUnlocking(true);
    
    try {
      const response = await fetch(`/api/comics/${comicId}/chapters/${chapterId}/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Insufficient credits") {
          const currentCredits = userCredits || 0;
          toast.error(
            `Insufficient credits! You have ${currentCredits} credits but need ${unlockCost} credits to unlock this chapter.`,
            {
              duration: 6000,
            }
          );
          router.push("/credits");
          return;
        }
        throw new Error(data.error || "Failed to unlock chapter");
      }

      toast.success("Chapter unlocked successfully! 🎉 You now have permanent access to this chapter.", {
        duration: 3000,
      });
      
      // Update the user's credit balance
      setUserCredits(prev => prev !== null ? prev - unlockCost : null);
      
      router.refresh();
      onClose();
    } catch (error: any) {
      console.error("Unlock error:", error);
      toast.error(error.message || "Failed to unlock chapter", {
        duration: 4000
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Unlock Chapter
          </DialogTitle>
          <DialogDescription>
            Unlock this chapter to continue reading
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">{chapterTitle}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unlock Cost:</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  {unlockCost} Credits
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your Balance:</span>
                {loadingCredits ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : (
                  <Badge 
                    variant={userCredits !== null && userCredits >= unlockCost ? "outline" : "destructive"} 
                    className="flex items-center gap-1"
                  >
                    <Wallet className="h-3 w-3" />
                    {userCredits !== null ? userCredits : 0} Credits
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Insufficient Credits Warning */}
          {userCredits !== null && userCredits < unlockCost && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Insufficient Credits
                </span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                You need {unlockCost - userCredits} more credits to unlock this chapter.
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                What happens after unlock?
              </span>
            </div>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Chapter becomes permanently accessible</li>
              <li>• Credits are deducted from your balance</li>
              <li>• Reading progress is automatically saved</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isUnlocking}
            >
              Cancel
            </Button>
            
            {userCredits !== null && userCredits < unlockCost ? (
              <Button
                onClick={() => router.push("/credits")}
                className="flex-1"
                disabled={isUnlocking}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
            ) : (
              <Button
                onClick={handleUnlock}
                className="flex-1"
                disabled={isUnlocking || loadingCredits}
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Unlock Now
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}