"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getProvider } from "@/lib/web3/metamask";
import { PaymentHandler } from "@/lib/web3/payment-handler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Zap } from "lucide-react";
import toast from "react-hot-toast";

interface Package {
  id: number;
  credits: number;
  priceETH: string;
  bonus: number;
  active: boolean;
}

export function CreditPurchase({ onSuccess }: { onSuccess?: () => void }) {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [customAmount, setCustomAmount] = useState<number>(100);
  const [creditPrice, setCreditPrice] = useState<string>("0.001");

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const provider = getProvider();
      if (!provider) return;

      const handler = new PaymentHandler(provider);
      const [packageData, priceData] = await Promise.all([
        handler.getPackages(),
        handler.getCreditPrice()
      ]);

      setPackages(packageData);
      setCreditPrice(priceData.priceETH);
    } catch (error) {
      console.error("Failed to load packages:", error);
    }
  };

  const handlePurchasePackage = async (pkg: Package) => {
    if (!session) return;
    
    try {
      setLoading(true);
      const provider = getProvider();
      if (!provider) throw new Error("No provider");
      
      const handler = new PaymentHandler(provider);
      
      // Execute on-chain purchase
      const receipt = await handler.purchasePackage(pkg.id);
      
      // Verify purchase on server
      const response = await fetch("/api/credits/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionHash: receipt.transactionHash,
          chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1"),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Verification failed");
      }

      const result = await response.json();
      
      // Update session with new balance
      await updateSession();
      
      toast.success(`Successfully purchased ${result.credits} credits!`);
      onSuccess?.();
    } catch (error: any) {
      console.error("Purchase failed:", error);
      toast.error(error?.message ?? "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPurchase = async () => {
    if (!session || customAmount < 1) return;
    
    try {
      setLoading(true);
      const provider = getProvider();
      if (!provider) throw new Error("No provider");
      
      const handler = new PaymentHandler(provider);
      
      // Execute on-chain purchase
      const receipt = await handler.purchaseCredits(customAmount);
      
      // Verify purchase on server
      const response = await fetch("/api/credits/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionHash: receipt.transactionHash,
          chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1"),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Verification failed");
      }

      const result = await response.json();
      
      // Update session
      await updateSession();
      
      toast.success(`Successfully purchased ${result.credits} credits!`);
      onSuccess?.();
    } catch (error: any) {
      console.error("Custom purchase failed:", error);
      toast.error(error?.message ?? "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Purchase Credits
          </CardTitle>
          <CardDescription>
            Buy credits to unlock premium comic chapters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Credit Packages */}
          {packages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Credit Packages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((pkg) => {
                  const totalCredits = pkg.credits + Math.floor(pkg.credits * pkg.bonus / 100);
                  return (
                    <Card
                      key={pkg.id}
                      className={`cursor-pointer transition-all ${
                        selectedPackage?.id === pkg.id
                          ? "ring-2 ring-primary"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{pkg.credits}</div>
                          <div className="text-sm text-muted-foreground">Base Credits</div>
                          {pkg.bonus > 0 && (
                            <Badge variant="secondary" className="mt-1">
                              +{pkg.bonus}% Bonus ({Math.floor(pkg.credits * pkg.bonus / 100)} free)
                            </Badge>
                          )}
                          <div className="mt-3 font-semibold">
                            Total: {totalCredits} credits
                          </div>
                          <div className="text-lg font-bold mt-2">
                            {pkg.priceETH} ETH
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {selectedPackage && (
                <Button
                  onClick={() => handlePurchasePackage(selectedPackage)}
                  disabled={loading}
                  className="w-full mt-4"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Purchase {selectedPackage.credits + Math.floor(selectedPackage.credits * selectedPackage.bonus / 100)} Credits
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Custom Amount */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Custom Amount</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(parseInt(e.target.value) || 1)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Cost</div>
                <div className="font-semibold">
                  {(parseFloat(creditPrice) * customAmount).toFixed(6)} ETH
                </div>
              </div>
              <Button
                onClick={handleCustomPurchase}
                disabled={loading || customAmount < 1}
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Purchase"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}