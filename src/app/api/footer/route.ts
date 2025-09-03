import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get the first (and should be only) footer settings record
    let footerSettings = await prisma.footerSettings.findFirst();

    // If no settings exist, create default ones
    if (!footerSettings) {
      footerSettings = await prisma.footerSettings.create({
        data: {
          companyName: "Web3Comic",
          companyTagline: "The most Powerful Web3 Comic Platform for creators and readers.",
          newsletterTitle: "Newsletter",
          newsletterSubtitle: "Receive product updates news, exclusive discounts and early access.",
          newsletterEnabled: true,
          socialLinks: [
            { name: "Behance", url: "https://behance.net", icon: "behance" },
            { name: "Dribbble", url: "https://dribbble.com", icon: "dribbble" },
            { name: "Twitter/X", url: "https://twitter.com", icon: "twitter" },
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
        },
      });
    }

    // Return only the settings if active
    if (!footerSettings.isActive) {
      return NextResponse.json({ isActive: false });
    }

    return NextResponse.json({
      companyName: footerSettings.companyName,
      companyTagline: footerSettings.companyTagline,
      newsletterTitle: footerSettings.newsletterTitle,
      newsletterSubtitle: footerSettings.newsletterSubtitle,
      newsletterEnabled: footerSettings.newsletterEnabled,
      socialLinks: footerSettings.socialLinks as any[],
      companyLinks: footerSettings.companyLinks as any[],
      socialsTitle: footerSettings.socialsTitle,
      copyrightText: footerSettings.copyrightText,
      showBuiltWith: footerSettings.showBuiltWith,
      builtWithText: footerSettings.builtWithText,
      isActive: footerSettings.isActive,
    });
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch footer settings" },
      { status: 500 }
    );
  }
}