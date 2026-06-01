"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { dashboardPathForRole, portalRoleToPrisma } from "@/lib/auth-helpers";
import { signIn } from "@/lib/auth";
import type { PortalRole } from "@/lib/roles";
import { AuthError } from "next-auth";

export type AuthFormState = {
  error?: string;
  success?: boolean;
  redirectTo?: string;
};

function friendlyAuthErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (
    message.includes("environment variable not found") &&
    message.includes("database_url")
  ) {
    return "Sign up is temporarily unavailable: deployment database is not configured (DATABASE_URL missing).";
  }

  if (
    message.includes("can't reach database server") ||
    message.includes("connection") ||
    message.includes("timeout")
  ) {
    return "Sign up is temporarily unavailable: cannot reach the database. Please try again shortly.";
  }

  return "We couldn't complete that request right now. Please try again.";
}

export async function registerUser(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  try {
    if (!process.env.DATABASE_URL) {
      return {
        error:
          "Sign up is unavailable in this deployment: DATABASE_URL is not configured.",
      };
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const roleRaw = String(formData.get("role") ?? "");
    const organization = String(formData.get("organization") ?? "").trim();

    const validRoles: PortalRole[] = ["traveler", "hotel", "authorities"];
    if (!validRoles.includes(roleRaw as PortalRole)) {
      return {
        error: "Please select who you are: Traveler, Hotel, or Tourism Authority.",
      };
    }
    const role = roleRaw as PortalRole;

    if (!name || !email || !password) {
      return { error: "All fields are required." };
    }
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters." };
    }
    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }
    if (role === "hotel" && !organization) {
      return { error: "Hotel name is required for hotel partners." };
    }
    if (role === "authorities" && !organization) {
      return { error: "Organization name is required for tourism authorities." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "An account with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: portalRoleToPrisma(role),
        organization: organization || null,
        ...(role === "hotel" && organization
          ? {
              property: {
                create: {
                  name: organization,
                  district: "Nepal",
                },
              },
            }
          : {}),
      },
    });

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: "Account created but sign-in failed. Please log in." };
      }
      throw error;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    return {
      success: true,
      redirectTo: user ? dashboardPathForRole(user.role) : "/dashboard",
    };
  } catch (error) {
    return { error: friendlyAuthErrorMessage(error) };
  }
}

export async function loginUser(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  try {
    if (!process.env.DATABASE_URL) {
      return {
        error:
          "Login is unavailable in this deployment: DATABASE_URL is not configured.",
      };
    }

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Invalid email or password." };
    }
    if (!user.passwordHash) {
      return {
        error:
          "This account uses Google sign-in. Please click Continue with Google below.",
      };
    }

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return {
        success: true,
        redirectTo: dashboardPathForRole(user.role),
      };
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: "Invalid email or password." };
      }
      throw error;
    }
  } catch (error) {
    return { error: friendlyAuthErrorMessage(error) };
  }
}
