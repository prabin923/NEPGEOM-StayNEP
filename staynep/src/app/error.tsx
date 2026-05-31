"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D1B3E] px-4 text-center">
      <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-[#C9A24A] px-6 py-2.5 text-sm font-semibold text-[#0D1B3E] hover:bg-[#d4af5a]"
      >
        Try again
      </button>
    </div>
  );
}
