"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { loginUser, type AuthFormState } from "@/actions/auth";
const initialState: AuthFormState = {};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [state, formAction, pending] = useActionState(loginUser, initialState);

  useEffect(() => {
    if (!state.success) return;
    const target =
      callbackUrl?.startsWith("/dashboard") ? callbackUrl : state.redirectTo ?? "/dashboard";
    router.push(target);
    router.refresh();
  }, [state.success, state.redirectTo, callbackUrl, router]);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
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

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-obsidian">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-[12px] border border-fog bg-snow px-4 py-3 text-sm text-ink outline-none transition focus:border-obsidian"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[36px] bg-obsidian py-3 text-sm font-medium text-snow shadow-button transition active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-steel">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-obsidian hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
