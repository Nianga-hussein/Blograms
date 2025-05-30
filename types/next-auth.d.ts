import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Étend le type User de next-auth
   */
  interface User {
    id: string;
    role: string;
  }

  /**
   * Étend le type Session de next-auth
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Étend le type JWT de next-auth
   */
  interface JWT {
    id: string;
    role: string;
  }
}  
