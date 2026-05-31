import Link from "next/link";
import { redirect } from "next/navigation";
import { Compass, Building2, Shield, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { auth } from "@/lib/auth";
import { dashboardPathForRole } from "@/lib/auth-helpers";
import { PORTAL_LIST } from "@/lib/roles";

const portalMeta = {
  traveler: {
    icon: Compass,
    description:
      "Plan trips, explore the map, save destinations, and receive safety alerts.",
    cta: "Enter traveler portal",
  },
  hotel: {
    icon: Building2,
    description:
      "Manage rooms, track bookings, monitor occupancy, and grow revenue.",
    cta: "Enter hotel portal",
  },
  authorities: {
    icon: Shield,
    description:
      "National tourism analytics, regional intelligence, incidents, and policy reports.",
    cta: "Enter authority portal",
  },
} as const;

export default async function DashboardHubPage() {
  const session = await auth();

  if (session?.user) {
    redirect(dashboardPathForRole(session.user.role));
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-fog bg-snow/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo href="/" size="md" />
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-steel hover:text-obsidian">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-[36px] bg-obsidian px-4 py-2 font-medium text-snow shadow-button"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-steel">
            SaaS Platform
          </p>
          <h1 className="text-3xl font-bold text-obsidian font-cosmica sm:text-4xl">
            Choose your portal
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-steel">
            Sign up as a traveler, hotel partner, or tourism authority to access
            your dedicated dashboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PORTAL_LIST.map((portal) => {
            const meta = portalMeta[portal.role];
            const Icon = meta.icon;
            return (
              <div
                key={portal.role}
                className="flex flex-col rounded-[28px] border border-fog bg-snow p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-fog">
                  <Icon className="h-6 w-6 text-graphite" />
                </div>
                <h2 className="text-lg font-semibold text-obsidian">{portal.title}</h2>
                <p className="mt-1 text-sm text-steel">{portal.subtitle}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">
                  {meta.description}
                </p>
                <Link
                  href="/signup"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-obsidian hover:gap-2"
                >
                  Sign up as {portal.role === "authorities" ? "authority" : portal.role}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
