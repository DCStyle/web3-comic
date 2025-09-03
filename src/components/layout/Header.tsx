"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { formatAddress, formatCredits } from "@/lib/utils";
import { getGuestStats } from "@/lib/utils/guestTracking";
import { 
  Wallet, 
  User, 
  LogOut, 
  Settings, 
  Eye, 
  BookOpen, 
  Star, 
  Menu, 
  X,
  Sparkles 
} from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [guestStats, setGuestStats] = useState({ chaptersRead: 0, remaining: 5 });
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!session) {
      setGuestStats(getGuestStats());
    }
  }, [session]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/comics", label: "Browse Comics", icon: BookOpen },
    { href: "/featured", label: "Featured", icon: Star },
  ];

  return (
    <header className={`border-b border-white/10 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-dark' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-display font-bold text-gradient bg-gradient-hero hover:scale-105 transition-transform duration-300"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Web3 Comic
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-foreground/80 hover:text-primary font-medium transition-colors duration-300 hover:scale-105"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* User Info - Desktop */}
                <div className="hidden xl:flex items-center space-x-3">
                  <AnimatedBadge
                    variant="neon"
                    size="lg"
                    animation="glow"
                    icon={<Wallet className="h-4 w-4" />}
                  >
                    {formatCredits(session.user.creditsBalance)}
                  </AnimatedBadge>
                  <AnimatedBadge
                    variant="glass"
                    size="lg"
                    icon={<User className="h-4 w-4" />}
                  >
                    {formatAddress(session.user.address)}
                  </AnimatedBadge>
                </div>
                
                {/* User Actions */}
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <GradientButton
                      variant="outline"
                      size="sm"
                      icon={<Settings className="h-4 w-4" />}
                    >
                      <span className="hidden sm:inline">Profile</span>
                    </GradientButton>
                  </Link>
                  <GradientButton
                    variant="ghost"
                    size="sm"
                    icon={<LogOut className="h-4 w-4" />}
                    onClick={() => signOut()}
                  >
                    <span className="hidden sm:inline">Disconnect</span>
                  </GradientButton>
                </div>
              </>
            ) : (
              <>
                {/* Guest Stats */}
                {isClient && guestStats.chaptersRead > 0 && (
                  <div className="hidden md:flex">
                    <AnimatedBadge
                      variant={
                        guestStats.remaining <= 1 
                          ? "destructive" 
                          : guestStats.remaining <= 2 
                          ? "warning" 
                          : "info"
                      }
                      size="lg"
                      animation={guestStats.remaining <= 1 ? "pulse" : "none"}
                      icon={<Eye className="h-4 w-4" />}
                    >
                      {guestStats.remaining} free left
                    </AnimatedBadge>
                  </div>
                )}
                
                {/* Connect Wallet Button */}
                <Link href="/connect-wallet">
                  <GradientButton
                    variant="primary"
                    size="lg"
                    icon={<Wallet className="h-5 w-5" />}
                  >
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                  </GradientButton>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-white/10 animate-fade-in">
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 text-foreground hover:text-primary font-medium transition-colors duration-300 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile User Info */}
              {session && (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <AnimatedBadge
                    variant="neon"
                    size="lg"
                    icon={<Wallet className="h-4 w-4" />}
                    className="w-full justify-center"
                  >
                    {formatCredits(session.user.creditsBalance)} Credits
                  </AnimatedBadge>
                  <AnimatedBadge
                    variant="glass"
                    size="lg"
                    icon={<User className="h-4 w-4" />}
                    className="w-full justify-center"
                  >
                    {formatAddress(session.user.address)}
                  </AnimatedBadge>
                </div>
              )}

              {/* Mobile Guest Stats */}
              {!session && isClient && guestStats.chaptersRead > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <AnimatedBadge
                    variant={
                      guestStats.remaining <= 1 
                        ? "destructive" 
                        : guestStats.remaining <= 2 
                        ? "warning" 
                        : "info"
                    }
                    size="lg"
                    animation={guestStats.remaining <= 1 ? "pulse" : "none"}
                    icon={<Eye className="h-4 w-4" />}
                    className="w-full justify-center"
                  >
                    {guestStats.remaining} Free Chapters Remaining
                  </AnimatedBadge>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}