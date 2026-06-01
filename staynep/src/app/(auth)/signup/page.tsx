import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create account — StayNEP",
};

export default function SignupPage() {
  return (
    <div className="w-full overflow-hidden rounded-[36px] border border-fog bg-snow shadow-sm">
      <div className="border-b border-fog bg-mist/50 px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-steel font-cosmica">
          Get started
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-obsidian font-cosmica sm:text-[32px]">
          Join StayNEP
        </h1>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-steel font-cosmica">
          Tell us who you are — we&apos;ll set up the right dashboard for you.
        </p>
      </div>
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <Suspense
          fallback={
            <p className="text-sm text-steel font-cosmica">Loading…</p>
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
