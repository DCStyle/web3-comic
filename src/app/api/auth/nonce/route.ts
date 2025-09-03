import { NextRequest, NextResponse } from "next/server";
import { generateSiweMessage } from "@/lib/auth/siwe";
import { nonceRequest } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    console.log("Nonce request received");
    
    const body = await req.json();
    console.log("Request body:", body);
    
    const parsed = nonceRequest.safeParse(body);
    
    if (!parsed.success) {
      console.error("Validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Invalid address format" }, 
        { status: 400 }
      );
    }

    const { address } = parsed.data;
    const domain = req.headers.get("host") || "localhost:3000";
    const origin = req.headers.get("origin") || `http://${domain}`;

    console.log("Generating SIWE message for:", { address, domain, origin });

    const message = await generateSiweMessage(address, domain, origin);

    console.log("Successfully generated nonce and message");
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Nonce generation failed:", error);
    console.error("Error details:", error instanceof Error ? error.stack : error);
    return NextResponse.json(
      { error: "Failed to generate nonce", details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}