import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { verifySiwe } from "./siwe";
import { siweVerify } from "@/lib/validation/schemas";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "SIWE",
      credentials: {
        message: { label: "message", type: "text" },
        signature: { label: "signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials?.signature) {
          return null;
        }
        
        try {
          const parsed = siweVerify.safeParse(credentials);
          if (!parsed.success) {
            throw new Error("Invalid credentials format");
          }

          const address = await verifySiwe({
            message: credentials.message,
            signature: credentials.signature,
          });
          
          // Find or create user
          let user = await prisma.user.findUnique({ 
            where: { walletAddress: address } 
          });
          
          if (!user) {
            user = await prisma.user.create({
              data: { 
                walletAddress: address, 
                username: `User_${address.slice(2, 8)}`,
              },
            });
          }
          
          return { 
            id: user.id, 
            address: user.walletAddress, 
            username: user.username,
            role: user.role, 
            creditsBalance: user.creditsBalance,
          };
        } catch (error) {
          console.error("Authorization failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.address = (user as any).address;
        token.username = (user as any).username;
        token.role = (user as any).role;
        token.creditsBalance = (user as any).creditsBalance;
      } else if (token.id) {
        // Refresh user data from database to get latest role and credits
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.creditsBalance = dbUser.creditsBalance;
          token.username = dbUser.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          address: token.address as string,
          username: token.username as string,
          role: token.role as string,
          creditsBalance: token.creditsBalance as number,
        };
      }
      return session;
    },
  },
  pages: { 
    signIn: "/connect-wallet",
    error: "/connect-wallet",
  },
};