"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useWeb3Store } from "@/store/useWeb3Store";
import { signMessage } from "@/lib/web3/metamask";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { GlowCard } from "@/components/ui/glow-card";
import { 
  Wallet, 
  Loader2, 
  BookOpen, 
  Lock, 
  Shield, 
  CheckCircle, 
  Star,
  Zap,
  Eye,
  Crown,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

export function WalletConnect() {
  const { connect, isConnecting, address, error, clearError } = useWeb3Store();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConnect = async () => {
    try {
      clearError();
      
      // Connect to wallet and get connection result
      const connectionResult = await connect();
      
      // After connecting, authenticate with SIWE using the connection result
      await authenticateWithSIWE();
    } catch (error) {
      console.error("Connection failed:", error);
      toast.error(error instanceof Error ? error.message : "Connection failed");
    }
  };

  const authenticateWithSIWE = async () => {
    // Get the current address from the store
    const currentAddress = useWeb3Store.getState().address;
    
    if (!currentAddress) {
      console.error("No address found after connection");
      toast.error("Failed to get wallet address");
      return;
    }

    try {
      setIsAuthenticating(true);

      console.log("Requesting nonce for address:", currentAddress);
      
      // Get nonce from server
      const nonceRes = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: currentAddress }),
      });

      if (!nonceRes.ok) {
        const errorData = await nonceRes.json().catch(() => ({}));
        console.error("Nonce request failed:", errorData);
        throw new Error(errorData.error || "Failed to get nonce");
      }

      const { message } = await nonceRes.json();
      console.log("Received message to sign:", message);

      // Sign message with wallet
      const signature = await signMessage(message, currentAddress);
      console.log("Message signed successfully");

      // Authenticate with NextAuth
      const result = await signIn("credentials", {
        message,
        signature,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setIsSuccess(true);
      toast.success("Connected successfully! Welcome to Web3 Comics!", {
        duration: 4000,
        icon: "🎉",
      });
      
      // Delay redirect to show success state
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Authentication failed:", error);
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const isLoading = isConnecting || isAuthenticating;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* Hero Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-hero flex items-center justify-center glow-pulse shadow-2xl">
              <Wallet className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
            <div className="absolute -top-4 -right-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center floating">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                  <path d="M20.95 6.25c.35-.35.35-.95 0-1.3L19.3 3.3c-.35-.35-.95-.35-1.3 0L12 9.3 6 3.3c-.35-.35-.95-.35-1.3 0L3.05 4.95c-.35.35-.35.95 0 1.3L9.05 12 3.05 17.75c-.35.35-.35.95 0 1.3l1.65 1.65c.35.35.95.35 1.3 0L12 14.7l6 6c.35.35.95.35 1.3 0l1.65-1.65c.35-.35.35-.95 0-1.3L14.95 12l6-5.75z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <AnimatedBadge
            variant="gradient"
            size="xl"
            animation="float"
            icon={<Sparkles className="h-5 w-5" />}
            className="mb-6"
          >
            Web3 Comic Platform
          </AnimatedBadge>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            <span className="text-gradient bg-gradient-hero">
              Connect Your
            </span>
            <br />
            <span className="text-foreground">
              Digital Wallet
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Unlock a world of premium comics, exclusive content, and digital collectibles with your MetaMask wallet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start lg:items-center">
          {/* Benefits Section */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold mb-6 text-gradient">
                Why Connect Your Wallet?
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Read 3 Free Chapters</h3>
                  <p className="text-muted-foreground">Start your journey with complimentary content</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Unlock Premium Content</h3>
                  <p className="text-muted-foreground">Access exclusive chapters and bonus materials</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Track Your Collection</h3>
                  <p className="text-muted-foreground">Monitor progress and build your library</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Earn Rewards</h3>
                  <p className="text-muted-foreground">Get bonus credits and exclusive perks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Card */}
          <div className="order-1 lg:order-2">
            <GlowCard variant="gradient" shimmer className="p-8">
              <div className="text-center space-y-6">
                {/* Security Badges */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <AnimatedBadge
                    variant="success"
                    icon={<Shield className="h-4 w-4" />}
                    animation="pulse"
                  >
                    Secure Connection
                  </AnimatedBadge>
                  <AnimatedBadge
                    variant="info"
                    icon={<Lock className="h-4 w-4" />}
                  >
                    Privacy Protected
                  </AnimatedBadge>
                  <AnimatedBadge
                    variant="neon"
                    icon={<Zap className="h-4 w-4" />}
                  >
                    No Gas Fees
                  </AnimatedBadge>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6">
                    <div className="flex items-center gap-3 text-destructive">
                      <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">!</span>
                      </div>
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Main Connect Button */}
                <div className="space-y-4">
                  <GradientButton 
                    onClick={handleConnect} 
                    disabled={isLoading || isSuccess} 
                    variant={isSuccess ? "accent" : "primary"}
                    size="xl"
                    className="w-full"
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircle className="mr-3 h-6 w-6" />
                        Connected Successfully!
                      </>
                    ) : isLoading ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        {isConnecting ? "Connecting..." : "Signing Message..."}
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-3 h-6 w-6" />
                        Connect MetaMask
                      </>
                    )}
                  </GradientButton>

                  {/* Install MetaMask Link */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Don't have MetaMask installed?
                    </p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300 font-medium"
                    >
                      <span>Download MetaMask</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
}