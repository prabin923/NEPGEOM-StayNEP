import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in — StayNEP",
};

export default function LoginPage() {
  return (
    <div className="w-full overflow-hidden rounded-[36px] border border-fog bg-snow shadow-sm">
      <div className="border-b border-fog bg-mist/50 px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-steel font-cosmica">
          Welcome back
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-obsidian font-cosmica sm:text-[32px]">
          Sign in to StayNEP
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-steel font-cosmica">
          Access your traveler, hotel, or tourism authority portal.
        </p>
      </div>
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <Suspense
          fallback={
            <p className="text-sm text-steel font-cosmica">Loading…</p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
