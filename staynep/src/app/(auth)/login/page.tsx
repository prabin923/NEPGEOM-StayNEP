import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in — StayNEP",
};

export default function LoginPage() {
  return (
    <div className="rounded-[28px] border border-fog bg-snow p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-obsidian font-cosmica">Welcome back</h1>
      <p className="mt-1 text-sm text-steel">
        Sign in to your traveler, hotel, or authority portal.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-steel">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
