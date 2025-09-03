"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ExternalLink
} from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface CompanyLink {
  name: string;
  url: string;
}

interface FooterData {
  companyName: string;
  companyTagline: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterEnabled: boolean;
  socialLinks: SocialLink[];
  companyLinks: CompanyLink[];
  socialsTitle: string;
  copyrightText: string;
  showBuiltWith: boolean;
  builtWithText: string;
  isActive: boolean;
}

const iconMap: Record<string, any> = {
  twitter: ExternalLink,
  dribbble: ExternalLink,
  behance: ExternalLink,
  facebook: ExternalLink,
  instagram: ExternalLink,
  linkedin: ExternalLink,
  youtube: ExternalLink,
  github: ExternalLink,
};

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch("/api/footer");
      if (response.ok) {
        const data = await response.json();
        setFooterData(data);
      }
    } catch (error) {
      console.error("Failed to fetch footer data:", error);
      // Use default data if API fails
      setFooterData({
        companyName: "Web3Comic",
        companyTagline: "The most Powerful Web3 Comic Platform for creators and readers.",
        newsletterTitle: "Newsletter",
        newsletterSubtitle: "Receive product updates news, exclusive discounts and early access.",
        newsletterEnabled: true,
        socialLinks: [
          { name: "Behance", url: "#", icon: "behance" },
          { name: "Dribbble", url: "#", icon: "dribbble" },
          { name: "Twitter/X", url: "#", icon: "twitter" },
        ],
        companyLinks: [
          { name: "Pricing", url: "/pricing" },
          { name: "Contact Us", url: "/contact" },
          { name: "Become an Affiliate", url: "/affiliate" },
          { name: "Projects", url: "/projects" },
        ],
        socialsTitle: "Socials",
        copyrightText: "© 2025 Web3Comic • All rights reserved • Made with Web3Comic",
        showBuiltWith: true,
        builtWithText: "Built in Framer",
        isActive: true,
      });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitMessage("Successfully subscribed!");
        setEmail("");
      } else {
        setSubmitMessage("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setSubmitMessage("Failed to subscribe. Please try again.");
    }
    
    setIsSubmitting(false);
    setTimeout(() => setSubmitMessage(""), 3000);
  };

  if (!footerData || !footerData.isActive) {
    return null;
  }

  const getSocialIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName.toLowerCase()];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />;
  };

  return (
    <footer className="bg-bwhite">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Company Information */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl font-display font-bold text-gray-800">
                {footerData.companyName}
              </span>
            </div>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8 max-w-md">
              {footerData.companyTagline}
            </p>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              {footerData.companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-foreground/70 hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-6">{footerData.socialsTitle}</h3>
            <ul className="space-y-4">
              {footerData.socialLinks.map((social, index) => (
                <li key={index}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    {getSocialIcon(social.icon)}
                    {social.name}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          {footerData.newsletterEnabled && (
            <div className="lg:col-span-3">
              <h3 className="text-white font-semibold mb-2">{footerData.newsletterTitle}</h3>
              <p className="text-foreground/70 text-sm mb-6 leading-relaxed">
                {footerData.newsletterSubtitle}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-foreground/50 pr-12"
                    required
                  />
                </div>
                <GradientButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                  className="w-full"
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </GradientButton>
                {submitMessage && (
                  <p className={`text-xs ${submitMessage.includes("Success") ? "text-green-400" : "text-red-400"}`}>
                    {submitMessage}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-12 border-t border-white/10">
          <p className="text-foreground/60 text-sm">
            {footerData.copyrightText}
          </p>
          {footerData.showBuiltWith && (
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <span className="text-foreground/60 text-sm">{footerData.builtWithText}</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}