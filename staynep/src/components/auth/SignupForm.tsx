"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { registerUser, type AuthFormState } from "@/actions/auth";
import RoleSelector from "@/components/auth/RoleSelector";
import {
  AuthField,
  AuthError,
  AuthSubmitButton,
} from "@/components/auth/AuthField";
import type { PortalRole } from "@/lib/roles";
import AuthDivider from "@/components/auth/AuthDivider";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useSearchParams } from "next/navigation";

const initialState: AuthFormState = {};

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<PortalRole>("traveler");
  const [organization, setOrganization] = useState("");
  const [state, formAction, pending] = useActionState(registerUser, initialState);

  const oauthError = searchParams.get("error");
  const oauthErrorMessage =
    oauthError === "hotel_name_required"
      ? "Enter your hotel name below, then use Sign up with Google."
      : oauthError === "org_name_required"
        ? "Enter your organization name below, then use Sign up with Google."
        : null;

  useEffect(() => {
    if (!state.success) return;
    router.push(state.redirectTo ?? "/dashboard");
    router.refresh();
  }, [state.success, state.redirectTo, router]);

  const showOrganization = role === "hotel" || role === "authorities";

  const googleDisabled =
    (role === "hotel" || role === "authorities") && !organization.trim();

  return (
    <div className="space-y-8">
      {(state.error || oauthErrorMessage) && (
        <AuthError message={state.error ?? oauthErrorMessage ?? ""} />
      )}

      <GoogleSignInButton
        mode="signup"
        signupRole={role}
        signupOrganization={organization}
        disabled={googleDisabled}
      />
      {googleDisabled && (
        <p className="text-center text-xs text-steel font-cosmica">
          Enter your {role === "hotel" ? "hotel" : "organization"} name first to
          sign up with Google.
        </p>
      )}

      <AuthDivider />

    <form action={formAction} className="space-y-8">
      <section aria-labelledby="role-heading">
        <h2 id="role-heading" className="sr-only">
          Choose your role
        </h2>
        <RoleSelector value={role} onChange={setRole} />
      </section>

      <section
        aria-labelledby="account-heading"
        className="space-y-5 border-t border-fog pt-8"
      >
        <div>
          <h2
            id="account-heading"
            className="text-sm font-semibold text-obsidian font-cosmica"
          >
            Account details
          </h2>
          <p className="mt-1 text-xs text-steel font-cosmica">
            {role === "traveler" &&
              "Free traveler dashboard with maps, weather, and trip tools."}
            {role === "hotel" &&
              "Partner portal for property management and bookings."}
            {role === "authorities" &&
              "Government analytics and national tourism intelligence."}
          </p>
        </div>

        <AuthField
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Your name"
        />

        <div
          className={`grid transition-all duration-300 ease-out ${
            showOrganization
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <AuthField
              label={
                role === "hotel" ? "Hotel / property name" : "Organization name"
              }
              name="organization"
              type="text"
              required={showOrganization}
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder={
                role === "hotel"
                  ? "e.g. Fishtail Lodge"
                  : "e.g. Ministry of Tourism"
              }
            />
          </div>
        </div>

        <AuthField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Min. 8 characters"
            hint="At least 8 characters"
          />
          <AuthField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Repeat password"
          />
        </div>

        <AuthSubmitButton pending={pending} pendingLabel="Creating account…">
          Create account
        </AuthSubmitButton>
      </section>

      <p className="text-center text-sm text-steel font-cosmica">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-obsidian hover:underline">
          Sign in
        </Link>
      </p>
    </form>
    </div>
  );
}
