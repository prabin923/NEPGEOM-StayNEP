import Link from "next/link";
import Logo from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-fog bg-snow/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
          <Logo href="/" size="sm" />
          <Link href="/" className="text-sm text-steel hover:text-obsidian">
            Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-10">{children}</main>
    </div>
  );
}
