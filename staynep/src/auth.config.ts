import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

/**
 * Edge-safe Auth.js config for middleware only.
 * Do not import Prisma, bcrypt, or providers here — that blows the 1MB Edge limit.
 */
export default {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.id && token.role) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
