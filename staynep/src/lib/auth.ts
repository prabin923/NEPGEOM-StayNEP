import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  findUserByEmail,
  parseSignupRoleCookie,
  upsertUserFromGoogle,
} from "@/lib/oauth-users";

const googleClientId =
  process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID;
const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email?.trim().toLowerCase();
      if (!email) {
        return false;
      }

      const cookieStore = await cookies();
      const role = parseSignupRoleCookie(
        cookieStore.get("staynep_signup_role")?.value
      );
      const organization =
        cookieStore.get("staynep_signup_org")?.value?.trim() || undefined;

      if (role === "hotel" && !organization) {
        return "/signup?error=hotel_name_required";
      }
      if (role === "authorities" && !organization) {
        return "/signup?error=org_name_required";
      }

      await upsertUserFromGoogle(
        {
          email,
          name: user.name,
          image: user.image,
        },
        { role, organization }
      );

      cookieStore.delete("staynep_signup_role");
      cookieStore.delete("staynep_signup_org");

      return true;
    },
    async jwt({ token, user, account }) {
      const email =
        (user?.email ?? token.email)?.trim().toLowerCase() ?? "";

      if (email && (user || account?.provider === "google")) {
        const dbUser = await findUserByEmail(email);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role as Role;
          token.name = dbUser.name;
          token.picture = dbUser.image ?? user?.image ?? token.picture;
        }
      } else if (user) {
        token.id = user.id!;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.id && token.role) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});

export function isGoogleAuthConfigured(): boolean {
  return Boolean(googleClientId && googleClientSecret);
}
