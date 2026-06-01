"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { loginUser, type AuthFormState } from "@/actions/auth";
import {
  AuthField,
  AuthError,
  AuthSubmitButton,
} from "@/components/auth/AuthField";
import AuthDivider from "@/components/auth/AuthDivider";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

const initialState: AuthFormState = {};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [state, formAction, pending] = useActionState(loginUser, initialState);

  useEffect(() => {
    if (!state.success) return;
    const target =
      callbackUrl?.startsWith("/dashboard")
        ? callbackUrl
        : state.redirectTo ?? "/dashboard";
    router.push(target);
    router.refresh();
  }, [state.success, state.redirectTo, callbackUrl, router]);

  const oauthCallback =
    callbackUrl?.startsWith("/") ? callbackUrl : "/dashboard";

  return (
    <div className="space-y-5">
      <GoogleSignInButton mode="login" callbackUrl={oauthCallback} />

      <AuthDivider />

      <form action={formAction} className="space-y-5">
      {state.error && <AuthError message={state.error} />}

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
    </div>
  );
}
