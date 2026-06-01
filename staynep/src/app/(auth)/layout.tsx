import Link from "next/link";
import Logo from "@/components/Logo";

/** Avoid static HTML caching stale Server Action IDs after deploys. */
export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mist font-cosmica">
      <header className="sticky top-0 z-50 border-b border-fog bg-snow/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Logo href="/" size="md" />
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/login"
              className="hidden text-steel transition hover:text-obsidian sm:inline"
            >
              Sign in
            </Link>
            <Link
              href="/"
              className="rounded-[36px] border border-fog bg-snow px-4 py-2 font-medium text-graphite transition hover:border-graphite hover:text-obsidian"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl items-start justify-center px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
