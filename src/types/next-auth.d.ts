import { UserRole } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      address: string;
      username: string;
      role: UserRole;
      creditsBalance: number;
    };
  }

  interface User {
    id: string;
    address: string;
    username: string;
    role: UserRole;
    creditsBalance: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    address: string;
    username: string;
    role: UserRole;
    creditsBalance: number;
  }
}