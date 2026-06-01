"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  MapPin,
  User,
  Building2,
  Download,
} from "lucide-react";
import {
  updateTouristReport,
  type ReportActionState,
} from "@/actions/tourist-reports";
import { AuthError } from "@/components/auth/AuthField";
import {
  REPORT_CATEGORY_LABELS,
  REPORT_SEVERITY_LABELS,
  REPORT_STATUS_LABELS,
  type TouristReportWithReporter,
} from "@/lib/tourist-reports";
import { StatusBadge } from "@/components/portal/PortalUI";
import { hotelInputClass } from "@/components/hotel/hotel-form-styles";
import type { ReportSeverity, ReportStatus } from "@prisma/client";
import { generateCSV, downloadCSV } from "@/lib/csv-export";

const initial: ReportActionState = {};

const statuses: ReportStatus[] = [
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "DISMISSED",
];
const severities: ReportSeverity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

type FilterTab = "open" | "critical" | "all";

function severityTone(sev: ReportSeverity) {
  if (sev === "CRITICAL" || sev === "HIGH") return "warning" as const;
  if (sev === "MEDIUM") return "info" as const;
  return "neutral" as const;
}

function severityBorder(sev: ReportSeverity, emergency: boolean) {
  if (emergency || sev === "CRITICAL") return "border-l-red-600";
  if (sev === "HIGH") return "border-l-orange-500";
  if (sev === "MEDIUM") return "border-l-amber-400";
  return "border-l-fog";
}

function statusStep(status: ReportStatus) {
  const order: ReportStatus[] = [
    "OPEN",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "DISMISSED",
  ];
  const idx = order.indexOf(status);
  return { idx, order };
}

function StatusPipeline({ status }: { status: ReportStatus }) {
  const steps = ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED"] as const;
  const { idx } = statusStep(status);
  const isClosed = status === "DISMISSED";

  return (
    <div className="flex items-center gap-1" aria-label="Status pipeline">
      {steps.map((step, i) => {
        const done = isClosed ? false : i <= Math.min(idx, 2);
        const current = !isClosed && step === status;
        return (
          <div key={step} className="flex flex-1 items-center gap-1">
            <div
              className={`h-1 flex-1 rounded-full ${
                done || current ? "bg-obsidian" : "bg-fog"
              } ${current ? "ring-1 ring-obsidian/30" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
}

function ReportTriageCard({
  report,
  defaultExpanded,
}: {
  report: TouristReportWithReporter;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const [state, action, pending] = useActionState(updateTouristReport, initial);
  const isClosed =
    report.status === "RESOLVED" || report.status === "DISMISSED";

  return (
    <article
      className={`overflow-hidden rounded-[16px] border border-fog border-l-4 bg-snow shadow-sm ${severityBorder(
        report.severity,
        report.isEmergency
      )}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-mist/40"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-ink">{report.title}</h4>
            {report.isEmergency && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                SOS
              </span>
            )}
            <StatusBadge tone={severityTone(report.severity)}>
              {REPORT_SEVERITY_LABELS[report.severity]}
            </StatusBadge>
            <StatusBadge tone={isClosed ? "neutral" : "info"}>
              {REPORT_STATUS_LABELS[report.status]}
            </StatusBadge>
          </div>
          <p className="mt-1 text-xs text-steel">
            {REPORT_CATEGORY_LABELS[report.category]}
            {report.district ? ` · ${report.district}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-steel">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              {report.reporter.name}
            </span>
            {report.property && (
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {report.property.name}
              </span>
            )}
            {report.locationLabel && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {report.locationLabel}
              </span>
            )}
          </div>
          {!expanded && (
            <p className="mt-2 line-clamp-1 text-sm text-graphite">
              {report.description}
            </p>
          )}
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-steel transition ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-fog px-4 pb-4">
          <div className="mb-4 mt-3">
            <p className="mb-1 text-[10px] font-semibold uppercase text-steel">
              Progress
            </p>
            <StatusPipeline status={report.status} />
          </div>
          <p className="mb-4 text-sm leading-relaxed text-graphite">
            {report.description}
          </p>
          {report.resolutionNote && (
            <p className="mb-4 rounded-[12px] bg-mist px-3 py-2 text-sm text-graphite">
              <span className="font-medium text-ink">Resolution: </span>
              {report.resolutionNote}
            </p>
          )}

          {state.error && <AuthError message={state.error} />}
          {state.success && (
            <p className="mb-3 rounded-[10px] bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
              Report updated successfully.
            </p>
          )}

          <form action={action} className="space-y-3 rounded-[14px] bg-mist/60 p-4">
            <input type="hidden" name="reportId" value={report.id} />
            <p className="text-xs font-semibold uppercase tracking-wide text-steel">
              Triage actions
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-graphite">
                  Status
                </span>
                <select
                  name="status"
                  defaultValue={report.status}
                  className={hotelInputClass}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {REPORT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-graphite">
                  Severity
                </span>
                <select
                  name="severity"
                  defaultValue={report.severity}
                  className={hotelInputClass}
                >
                  {severities.map((s) => (
                    <option key={s} value={s}>
                      {REPORT_SEVERITY_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-graphite">
                Assigned agency
              </span>
              <input
                name="assignedAgency"
                defaultValue={report.assignedAgency ?? ""}
                placeholder="Tourism Police, Ranger unit, local DTO…"
                className={hotelInputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-graphite">
                Resolution note (shared with traveler)
              </span>
              <textarea
                name="resolutionNote"
                rows={3}
                defaultValue={report.resolutionNote ?? ""}
                placeholder="Document actions taken and outcome…"
                className={hotelInputClass}
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-[36px] bg-obsidian py-2.5 text-sm font-semibold text-snow disabled:opacity-55 sm:w-auto sm:px-8"
            >
              {pending ? "Saving…" : "Save triage update"}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

export default function AuthoritiesIncidentBoard({
  reports,
}: {
  reports: TouristReportWithReporter[];
}) {
  const [tab, setTab] = useState<FilterTab>("open");

  const open = useMemo(
    () => reports.filter((r) => r.status !== "RESOLVED" && r.status !== "DISMISSED"),
    [reports]
  );
  const critical = useMemo(
    () =>
      open.filter(
        (r) => r.isEmergency || r.severity === "CRITICAL" || r.severity === "HIGH"
      ),
    [open]
  );

  const filtered = useMemo(() => {
    if (tab === "open") return open;
    if (tab === "critical") return critical;
    return [...reports].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }, [tab, open, critical, reports]);

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "open", label: "Open queue", count: open.length },
    { id: "critical", label: "Priority", count: critical.length },
    { id: "all", label: "All reports", count: reports.length },
  ];

  const handleExportCSV = () => {
    const headers = [
      "Title",
      "Category",
      "Severity",
      "Status",
      "Is Emergency",
      "District",
      "Location Label",
      "Latitude",
      "Longitude",
      "Reporter",
      "Property",
      "Created At",
      "Resolved At",
      "Resolution Note",
    ];

    const rows = filtered.map((r) => [
      r.title,
      r.category,
      r.severity,
      r.status,
      r.isEmergency ? "YES" : "NO",
      r.district ?? "",
      r.locationLabel ?? "",
      r.latitude ? String(r.latitude) : "",
      r.longitude ? String(r.longitude) : "",
      r.reporter.name,
      r.property?.name ?? "",
      new Date(r.createdAt).toLocaleString(),
      r.resolvedAt ? new Date(r.resolvedAt).toLocaleString() : "",
      r.resolutionNote ?? "",
    ]);

    const csvContent = generateCSV(headers, rows);
    downloadCSV(`incidents-export-${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-fog pb-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-obsidian text-snow"
                  : "bg-mist text-graphite hover:bg-fog"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                  tab === t.id ? "bg-white/20" : "bg-snow"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
        {filtered.length > 0 && (
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-full border border-fog bg-snow px-3.5 py-2 text-xs font-semibold text-graphite hover:border-obsidian/20 hover:bg-mist transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-fog bg-mist/30 px-6 py-12 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-steel/50" />
          <p className="mt-3 text-sm font-medium text-graphite">
            {tab === "critical"
              ? "No priority incidents in queue"
              : "No reports in this view"}
          </p>
          <p className="mt-1 text-xs text-steel">
            New traveler submissions appear here and on the live map.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((report, i) => (
            <li key={report.id}>
              <ReportTriageCard
                report={report}
                defaultExpanded={
                  tab === "critical" && i === 0 && !report.resolutionNote
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
