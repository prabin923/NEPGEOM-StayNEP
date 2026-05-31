import Link from "next/link";
import { fetchTransparencySnapshot } from "@/lib/tourist-reports";
import { REPORT_CATEGORY_LABELS } from "@/lib/tourist-reports";
import type { ReportCategory } from "@prisma/client";

export const metadata = {
  title: "Tourism Transparency — StayNEP",
  description: "Public summary of tourist issues reported through StayNEP",
};

export default async function TransparencyPage() {
  const snapshot = await fetchTransparencySnapshot();

  return (
    <main className="min-h-screen bg-mist font-cosmica">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-steel">StayNEP · Ministry of Tourism</p>
        <h1 className="mt-2 text-3xl font-bold text-obsidian">Tourism transparency</h1>
        <p className="mt-3 text-steel">
          Aggregated statistics from tourist reports submitted on StayNEP. Personal
          details are not published.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
            <p className="text-sm text-steel">Open issues</p>
            <p className="mt-2 text-3xl font-bold text-obsidian">{snapshot.openCount}</p>
          </div>
          <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
            <p className="text-sm text-steel">Resolved</p>
            <p className="mt-2 text-3xl font-bold text-obsidian">{snapshot.resolvedCount}</p>
          </div>
          <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
            <p className="text-sm text-steel">Avg. resolution</p>
            <p className="mt-2 text-3xl font-bold text-obsidian">
              {snapshot.avgResolutionHours != null
                ? `${snapshot.avgResolutionHours} hours`
                : "—"}
            </p>
          </div>
        </div>

        {snapshot.byDistrict.length > 0 && (
          <section className="mt-10 rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-obsidian">Open issues by region</h2>
            <ul className="mt-4 space-y-2">
              {snapshot.byDistrict.map((row) => (
                <li
                  key={row.district}
                  className="flex justify-between text-sm border-b border-fog/80 pb-2 last:border-0"
                >
                  <span className="text-graphite">{row.district}</span>
                  <span className="font-medium text-obsidian">{row.count}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {snapshot.byCategory.length > 0 && (
          <section className="mt-6 rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-obsidian">Open issues by category</h2>
            <ul className="mt-4 space-y-2">
              {snapshot.byCategory.map((row) => (
                <li
                  key={row.category}
                  className="flex justify-between text-sm border-b border-fog/80 pb-2 last:border-0"
                >
                  <span className="text-graphite">
                    {REPORT_CATEGORY_LABELS[row.category as ReportCategory]}
                  </span>
                  <span className="font-medium text-obsidian">{row.count}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-sm text-steel">
          <Link href="/" className="font-medium text-obsidian hover:underline">
            ← Back to StayNEP
          </Link>
          {" · "}
          <Link href="/login" className="font-medium text-obsidian hover:underline">
            Report an issue (sign in)
          </Link>
        </p>
      </div>
    </main>
  );
}
