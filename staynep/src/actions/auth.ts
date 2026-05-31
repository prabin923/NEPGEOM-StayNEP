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

export async function registerUser(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
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
    return { error: "Please select who you are: Traveler, Hotel, or Tourism Authority." };
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
}

export async function loginUser(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
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
}
