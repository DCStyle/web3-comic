import { randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { SiweMessage } from "siwe";
import { getAddress } from "ethers";

export async function generateSiweMessage(address: string, domain: string, uri: string): Promise<string> {
  try {
    console.log("Generating nonce for address:", address);
    
    // Ensure proper EIP-55 checksum format
    const checksummedAddress = getAddress(address);
    console.log("Checksummed address:", checksummedAddress);
    
    const nonce = randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    console.log("Cleaning up expired nonces...");
    // Clean up expired nonces
    await prisma.siweNonce.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    console.log("Storing new nonce in database...");
    // Store new nonce (store lowercase for consistency)
    await prisma.siweNonce.create({
      data: { 
        address: checksummedAddress.toLowerCase(), 
        nonce, 
        expiresAt 
      },
    });
    
    console.log("Creating SIWE message...");
    const siweMessage = new SiweMessage({
      domain,
      address: checksummedAddress, // Use checksummed address for SIWE
      statement: "Sign in to Web3 Comic Platform with your wallet.",
      uri,
      version: "1",
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1"),
      nonce,
      issuedAt: new Date().toISOString(),
      expirationTime: expiresAt.toISOString(),
    });

    const message = siweMessage.prepareMessage();
    console.log("SIWE message created successfully");
    return message;
  } catch (error) {
    console.error("Error in generateSiweMessage:", error);
    throw error;
  }
}

export async function verifySiwe({ 
  message, 
  signature 
}: { 
  message: string; 
  signature: string 
}): Promise<string> {
  const siwe = new SiweMessage(message);
  
  try {
    const { data } = await siwe.verify({ signature });
    
    if (!data?.address || !data?.nonce) {
      throw new Error("Invalid SIWE message");
    }

    // Normalize address for comparison
    const normalizedAddress = data.address.toLowerCase();

    // Verify nonce exists and hasn't expired
    const record = await prisma.siweNonce.findUnique({ 
      where: { nonce: data.nonce } 
    });
    
    if (!record || 
        record.address !== normalizedAddress || 
        record.expiresAt < new Date()) {
      throw new Error("Nonce invalid or expired");
    }
    
    // Delete used nonce to prevent replay attacks
    await prisma.siweNonce.delete({ 
      where: { nonce: data.nonce } 
    });
    
    return normalizedAddress;
  } catch (error) {
    console.error("SIWE verification failed:", error);
    throw new Error("Invalid signature or expired nonce");
  }
}