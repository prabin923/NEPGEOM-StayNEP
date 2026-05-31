import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create account — StayNEP",
};

export default function SignupPage() {
  return (
    <div className="rounded-[28px] border border-fog bg-snow p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-obsidian font-cosmica">Join StayNEP</h1>
      <p className="mt-1 text-sm text-steel">
        Tell us who you are — we&apos;ll set up the right dashboard for you.
      </p>
      <div className="mt-8">
        <SignupForm />
      </div>
    </div>
  );
}
