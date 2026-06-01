"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AuthField,
  AuthError,
  AuthSubmitButton,
} from "@/components/auth/AuthField";
import type { AuthResult } from "@/lib/credentials-auth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as AuthResult;

      if (result.error || !response.ok) {
        setError(result.error ?? "Invalid email or password.");
        setPending(false);
        return;
      }

      const target =
        callbackUrl?.startsWith("/dashboard")
          ? callbackUrl
          : result.redirectTo ?? "/dashboard";
      router.push(target);
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <AuthError message={error} />}

      <AuthField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
      />

      <AuthField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />

      <AuthSubmitButton pending={pending} pendingLabel="Signing in…">
        Sign in
      </AuthSubmitButton>

      <p className="text-center text-sm text-steel font-cosmica">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-obsidian hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
