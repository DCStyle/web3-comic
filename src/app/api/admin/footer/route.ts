import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const socialLinkSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  icon: z.string().min(1),
});

const companyLinkSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
});

const footerUpdateSchema = z.object({
  companyName: z.string().min(1),
  companyTagline: z.string().min(1),
  newsletterTitle: z.string().min(1),
  newsletterSubtitle: z.string().min(1),
  newsletterEnabled: z.boolean(),
  socialLinks: z.array(socialLinkSchema),
  companyLinks: z.array(companyLinkSchema),
  socialsTitle: z.string().min(1),
  copyrightText: z.string().min(1),
  showBuiltWith: z.boolean(),
  builtWithText: z.string().min(1),
  isActive: z.boolean(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const footerSettings = await prisma.footerSettings.findFirst();

    if (!footerSettings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.footerSettings.create({
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
          updatedBy: session.user.id,
        },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(footerSettings);
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch footer settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = footerUpdateSchema.parse(body);

    // Check if footer settings exist
    let footerSettings = await prisma.footerSettings.findFirst();

    if (footerSettings) {
      // Update existing settings
      footerSettings = await prisma.footerSettings.update({
        where: { id: footerSettings.id },
        data: {
          ...validatedData,
          updatedBy: session.user.id,
        },
      });
    } else {
      // Create new settings
      footerSettings = await prisma.footerSettings.create({
        data: {
          ...validatedData,
          updatedBy: session.user.id,
        },
      });
    }

    return NextResponse.json(footerSettings);
  } catch (error) {
    console.error("Error updating footer settings:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update footer settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return PUT(request); // Use the same logic as PUT for creating/updating
}