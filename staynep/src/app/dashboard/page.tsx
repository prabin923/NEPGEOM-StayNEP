import Link from "next/link";
import { MapPin, Compass, Building2, Shield, ArrowRight } from "lucide-react";
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

export default function DashboardHubPage() {
  return (
    <div className="min-h-screen bg-[#0D1B3E]">
      <header className="border-b border-white/10 bg-[#0D1B3E]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A24A]/15 ring-1 ring-[#C9A24A]/30">
              <MapPin className="h-5 w-5 text-[#C9A24A]" />
            </span>
            <span className="text-xl font-bold">
              <span className="text-white">Stay</span>
              <span className="text-[#C9A24A]">NEP</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#C9A24A]">
            SaaS Platform
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Choose your portal
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            StayNEP serves travelers, hotel partners, and tourism authorities
            with dedicated dashboards and tools.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PORTAL_LIST.map((portal) => {
            const meta = portalMeta[portal.role];
            const Icon = meta.icon;
            return (
              <Link
                key={portal.role}
                href={portal.basePath}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl ring-1"
                  style={{
                    backgroundColor: portal.accentMuted,
                    borderColor: `${portal.accent}40`,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: portal.accent }} />
                </div>
                <h2 className="text-lg font-semibold text-white">{portal.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{portal.subtitle}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">
                  {meta.description}
                </p>
                <span
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold transition group-hover:gap-2"
                  style={{ color: portal.accent }}
                >
                  {meta.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-gray-600">
          Demo mode — select a portal to explore role-specific dashboards.
        </p>
      </main>
    </div>
  );
}
