"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import RoleSelector from "@/components/auth/RoleSelector";
import {
  AuthField,
  AuthError,
  AuthSubmitButton,
} from "@/components/auth/AuthField";
import type { PortalRole } from "@/lib/roles";
import type { AuthResult } from "@/lib/credentials-auth";

export default function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<PortalRole>("traveler");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const showOrganization = role === "hotel" || role === "authorities";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("role", role);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as AuthResult;

      if (result.error || !response.ok) {
        setError(result.error ?? "Could not create account. Please try again.");
        setPending(false);
        return;
      }

      router.push(result.redirectTo ?? "/dashboard");
      router.refresh();
    } catch {
      setError("Could not create account. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <AuthError message={error} />}

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
  );
}
