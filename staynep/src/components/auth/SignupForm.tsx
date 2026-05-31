"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { registerUser, type AuthFormState } from "@/actions/auth";
import RoleSelector from "@/components/auth/RoleSelector";
import type { PortalRole } from "@/lib/roles";

const initialState: AuthFormState = {};

export default function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<PortalRole>("traveler");
  const [state, formAction, pending] = useActionState(registerUser, initialState);

  useEffect(() => {
    if (!state.success) return;
    router.push(state.redirectTo ?? "/dashboard");
    router.refresh();
  }, [state.success, state.redirectTo, router]);

  const showOrganization = role === "hotel" || role === "authorities";

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <RoleSelector value={role} onChange={setRole} />

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-obsidian">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-[12px] border border-fog bg-snow px-4 py-3 text-sm text-ink outline-none transition focus:border-obsidian"
          placeholder="Your name"
        />
      </div>

      {showOrganization && (
        <div className="space-y-1.5">
          <label htmlFor="organization" className="text-sm font-medium text-obsidian">
            {role === "hotel" ? "Hotel / property name" : "Organization name"}
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            required={showOrganization}
            className="w-full rounded-[12px] border border-fog bg-snow px-4 py-3 text-sm text-ink outline-none transition focus:border-obsidian"
            placeholder={
              role === "hotel" ? "e.g. Fishtail Lodge" : "e.g. Ministry of Tourism"
            }
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-obsidian">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-[12px] border border-fog bg-snow px-4 py-3 text-sm text-ink outline-none transition focus:border-obsidian"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-obsidian">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-[12px] border border-fog bg-snow px-4 py-3 text-sm text-ink outline-none transition focus:border-obsidian"
            placeholder="Min. 8 characters"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-obsidian"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-[12px] border border-fog bg-snow px-4 py-3 text-sm text-ink outline-none transition focus:border-obsidian"
            placeholder="Repeat password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[36px] bg-obsidian py-3 text-sm font-medium text-snow shadow-button transition active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-steel">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-obsidian hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
