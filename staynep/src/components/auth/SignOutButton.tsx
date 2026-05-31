"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  /** Full-width row with "Sign out" label (sidebar footer). */
  showLabel?: boolean;
  className?: string;
}

export default function SignOutButton({
  showLabel = false,
  className = "",
}: SignOutButtonProps) {
  if (showLabel) {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className={`flex w-full items-center justify-center gap-2 rounded-[12px] border border-fog bg-snow px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-steel hover:bg-fog hover:text-obsidian ${className}`}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={`flex items-center gap-2 rounded-[10px] border border-fog px-3 py-2 text-sm font-medium text-graphite transition hover:bg-fog hover:text-obsidian ${className}`}
      title="Sign out"
      aria-label="Sign out"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      <span className="hidden sm:inline">Sign out</span>
    </button>
  );
}
