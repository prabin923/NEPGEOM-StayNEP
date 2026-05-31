import { Eye } from "lucide-react";
import Link from "next/link";
import { PortalCard, PortalSectionTitle } from "@/components/portal/PortalUI";
import {
  REPORT_CATEGORY_LABELS,
  type TransparencySnapshot,
} from "@/lib/tourist-reports";
import type { ReportCategory } from "@prisma/client";

interface TransparencyPanelProps {
  snapshot: TransparencySnapshot;
}

export default function TransparencyPanel({ snapshot }: TransparencyPanelProps) {
  return (
    <PortalCard variant="mist">
      <PortalSectionTitle
        title="Public transparency"
        subtitle="Aggregated tourist issue data (no personal details)"
        icon={Eye}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[14px] border border-fog bg-snow p-4">
          <p className="text-xs text-steel">Open issues</p>
          <p className="mt-1 text-2xl font-bold text-obsidian">{snapshot.openCount}</p>
        </div>
        <div className="rounded-[14px] border border-fog bg-snow p-4">
          <p className="text-xs text-steel">Resolved (all time)</p>
          <p className="mt-1 text-2xl font-bold text-obsidian">{snapshot.resolvedCount}</p>
        </div>
        <div className="rounded-[14px] border border-fog bg-snow p-4">
          <p className="text-xs text-steel">Avg. resolution time</p>
          <p className="mt-1 text-2xl font-bold text-obsidian">
            {snapshot.avgResolutionHours != null
              ? `${snapshot.avgResolutionHours}h`
              : "—"}
          </p>
        </div>
        <div className="rounded-[14px] border border-fog bg-snow p-4 flex flex-col justify-center">
          <Link
            href="/transparency"
            className="text-sm font-semibold text-obsidian hover:underline"
          >
            Public transparency page →
          </Link>
        </div>
      </div>
      {snapshot.byCategory.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-steel">
            Open by category
          </p>
          <ul className="flex flex-wrap gap-2">
            {snapshot.byCategory.map((row) => (
              <li
                key={row.category}
                className="rounded-full border border-fog bg-snow px-3 py-1 text-xs text-graphite"
              >
                {REPORT_CATEGORY_LABELS[row.category as ReportCategory]}: {row.count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </PortalCard>
  );
}
