"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertTriangle, MapPin, Loader2 } from "lucide-react";
import { createTouristReport, type ReportActionState } from "@/actions/tourist-reports";
import { AuthError } from "@/components/auth/AuthField";
import { REPORT_CATEGORY_LABELS, REPORT_STATUS_LABELS } from "@/lib/tourist-reports";
import { PortalSectionTitle, PortalInnerCard, StatusBadge } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";
import type { ReportCategory, ReportStatus } from "@prisma/client";

const initial: ReportActionState = {};

const categories = Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[];

type MyReport = {
  id: string;
  title: string;
  category: ReportCategory;
  status: ReportStatus;
  severity: string;
  isEmergency: boolean;
  createdAt: Date;
  resolutionNote: string | null;
  property: { name: string } | null;
};

interface TravelerReportSectionProps {
  myReports: MyReport[];
  properties: { id: string; name: string; district: string }[];
}

export default function TravelerReportSection({
  myReports,
  properties,
}: TravelerReportSectionProps) {
  const [state, action, pending] = useActionState(createTouristReport, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [locStatus, setLocStatus] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const latRef = useRef<HTMLInputElement>(null);
  const lngRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setLocStatus("idle");
    }
  }, [state.success]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (latRef.current) latRef.current.value = String(pos.coords.latitude);
        if (lngRef.current) lngRef.current.value = String(pos.coords.longitude);
        setLocStatus("ok");
      },
      () => setLocStatus("fail"),
      { timeout: 10000 }
    );
  }, []);

  return (
    <div id="report-problem" className="space-y-6">
      <PortalSectionTitle
        title="Safety & reports"
        subtitle="Issues are triaged by tourism authorities. Emergencies: also call 100 (police) or 102 (ambulance)."
        icon={AlertTriangle}
      />

      {state.error && <AuthError message={state.error} />}
      {state.success && (
        <p className="rounded-[12px] border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          Report submitted. Authorities will review it. Reference: {state.reportId?.slice(0, 8)}…
        </p>
      )}

      <form ref={formRef} action={action} className="space-y-4 rounded-[20px] border border-fog bg-mist/50 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-obsidian">Category</label>
            <select name="category" required className={hotelInputClass} defaultValue="SAFETY">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {REPORT_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-graphite">
              <input type="checkbox" name="isEmergency" className="rounded border-fog" />
              Emergency / SOS
            </label>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Title</label>
          <input
            name="title"
            required
            minLength={5}
            placeholder="Short summary of the issue"
            className={hotelInputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">Description</label>
          <textarea
            name="description"
            required
            minLength={20}
            rows={4}
            placeholder="What happened, when, and who was involved…"
            className={hotelInputClass}
          />
        </div>
        {properties.length > 0 && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-obsidian">
              Related hotel (optional)
            </label>
            <select name="propertyId" className={hotelInputClass} defaultValue="">
              <option value="">— None —</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.district})
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="rounded-[12px] border border-fog bg-snow p-3">
          <p className="mb-2 flex items-center gap-2 text-xs font-medium text-obsidian">
            <MapPin className="h-3.5 w-3.5" />
            Location
            {locStatus === "loading" && (
              <Loader2 className="h-3 w-3 animate-spin text-steel" />
            )}
            {locStatus === "ok" && (
              <span className="text-emerald-600">Attached</span>
            )}
            {locStatus === "fail" && (
              <span className="text-steel">Enter manually</span>
            )}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <input ref={latRef} type="hidden" name="latitude" />
            <input ref={lngRef} type="hidden" name="longitude" />
            <input
              ref={labelRef}
              name="locationLabel"
              placeholder="e.g. Lakeside, Pokhara"
              className={`sm:col-span-3 ${hotelInputClass}`}
            />
          </div>
        </div>
        <button type="submit" disabled={pending} className={hotelSubmitClass}>
          {pending ? "Submitting…" : "Submit report"}
        </button>
      </form>

      {myReports.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-obsidian">Your reports</h3>
          <ul className="space-y-2">
            {myReports.map((r) => (
              <PortalInnerCard key={r.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{r.title}</p>
                    <p className="text-xs text-steel">
                      {REPORT_CATEGORY_LABELS[r.category]} ·{" "}
                      {r.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge
                    tone={
                      r.status === "RESOLVED"
                        ? "success"
                        : r.isEmergency
                          ? "warning"
                          : "info"
                    }
                  >
                    {REPORT_STATUS_LABELS[r.status]}
                  </StatusBadge>
                </div>
                {r.resolutionNote && (
                  <p className="mt-2 text-xs text-steel">
                    <span className="font-medium text-graphite">Update: </span>
                    {r.resolutionNote}
                  </p>
                )}
              </PortalInnerCard>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
