"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CreditCard, Shield, UserX, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";

interface UserActionsProps {
  userId: string;
  currentRole: string;
}

export function UserActions({ userId, currentRole }: UserActionsProps) {
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditReason, setCreditReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreditAdjustment = async (isDebit: boolean) => {
    if (!creditAmount || creditAmount <= 0 || !creditReason.trim()) {
      toast.error("Please enter a valid amount and reason");
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: isDebit ? -creditAmount : creditAmount,
          reason: creditReason.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to adjust credits");
      }

      toast.success(`Successfully ${isDebit ? 'debited' : 'credited'} ${creditAmount} credits`);
      setShowCreditDialog(false);
      setCreditAmount(0);
      setCreditReason("");
      window.location.reload();
    } catch (error) {
      console.error("Credit adjustment failed:", error);
      toast.error("Failed to adjust credits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      toast.success(`Role updated to ${newRole}`);
      window.location.reload();
    } catch (error) {
      console.error("Role update failed:", error);
      toast.error("Failed to update role");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowCreditDialog(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Adjust Credits
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {currentRole === "USER" ? (
            <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")}>
              <Shield className="mr-2 h-4 w-4" />
              Make Admin
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleRoleChange("USER")}>
              <UserX className="mr-2 h-4 w-4" />
              Remove Admin
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust User Credits</DialogTitle>
            <DialogDescription>
              Add or remove credits from this user's account. This will create an admin adjustment transaction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Credit Amount</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                max="10000"
                value={creditAmount || ""}
                onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                placeholder="Enter credit amount..."
              />
            </div>
            
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
                placeholder="Reason for adjustment..."
                maxLength={200}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline"
              onClick={() => handleCreditAdjustment(true)}
              disabled={isLoading || !creditAmount || !creditReason.trim()}
            >
              <Minus className="mr-2 h-4 w-4" />
              Debit Credits
            </Button>
            <Button 
              onClick={() => handleCreditAdjustment(false)}
              disabled={isLoading || !creditAmount || !creditReason.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Credit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}