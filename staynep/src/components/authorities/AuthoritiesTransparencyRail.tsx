import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import {
  REPORT_CATEGORY_LABELS,
  type TransparencySnapshot,
} from "@/lib/tourist-reports";
import type { ReportCategory } from "@prisma/client";

export default function AuthoritiesTransparencyRail({
  snapshot,
}: {
  snapshot: TransparencySnapshot;
}) {
  return (
    <div className="flex h-full flex-col rounded-[20px] border border-fog bg-snow p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-steel">
            Transparency
          </p>
          <p className="mt-1 text-sm font-medium text-ink">Public accountability</p>
        </div>
        <Eye className="h-5 w-5 shrink-0 text-steel" />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-[12px] bg-mist px-2 py-3 text-center">
          <dt className="text-[10px] uppercase text-steel">Open</dt>
          <dd className="mt-0.5 text-xl font-bold text-obsidian tabular-nums">
            {snapshot.openCount}
          </dd>
        </div>
        <div className="rounded-[12px] bg-mist px-2 py-3 text-center">
          <dt className="text-[10px] uppercase text-steel">Resolved</dt>
          <dd className="mt-0.5 text-xl font-bold text-obsidian tabular-nums">
            {snapshot.resolvedCount}
          </dd>
        </div>
        <div className="rounded-[12px] bg-mist px-2 py-3 text-center">
          <dt className="text-[10px] uppercase text-steel">Avg.</dt>
          <dd className="mt-0.5 text-lg font-bold text-obsidian tabular-nums">
            {snapshot.avgResolutionHours != null
              ? `${snapshot.avgResolutionHours}h`
              : "—"}
          </dd>
        </div>
      </dl>

      {snapshot.byCategory.length > 0 && (
        <div className="mt-4 flex-1">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-steel">
            By category
          </p>
          <ul className="space-y-2">
            {snapshot.byCategory.map((row) => (
              <li key={row.category}>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate text-graphite">
                    {REPORT_CATEGORY_LABELS[row.category as ReportCategory]}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-obsidian">
                    {row.count}
                  </span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-fog">
                  <div
                    className="h-full rounded-full bg-obsidian"
                    style={{
                      width: `${Math.min(
                        100,
                        (row.count / Math.max(snapshot.openCount, 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {snapshot.byDistrict.length > 0 && (
        <div className="mt-4 border-t border-fog pt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-steel">
            Active districts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {snapshot.byDistrict.slice(0, 4).map((d) => (
              <span
                key={d.district}
                className="rounded-md bg-mist px-2 py-0.5 text-[11px] text-graphite"
              >
                {d.district} ({d.count})
              </span>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/transparency"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-obsidian hover:underline"
      >
        View public page
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
