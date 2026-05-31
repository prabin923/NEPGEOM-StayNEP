"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, RefreshCw } from "lucide-react";

type Status = "idle" | "loading" | "shared" | "denied" | "error";

export default function TravelerLocationReporter() {
  const [status, setStatus] = useState<Status>("idle");
  const [label, setLabel] = useState<string | null>(null);
  const reported = useRef(false);

  function shareLocation() {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch("/api/travelers/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lng }),
          });
          const data = await res.json();
          if (!res.ok) {
            setStatus("error");
            return;
          }
          setLabel(data.label ?? null);
          setStatus("shared");
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 }
    );
  }

  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    shareLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex shrink-0 items-center gap-2 rounded-full border border-fog bg-snow px-4 py-2 text-xs text-steel shadow-sm">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Syncing GPS…
      </div>
    );
  }

  if (status === "shared") {
    return (
      <div className="flex max-w-xs shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-900 shadow-sm">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          On map{label ? ` · ${label}` : ""}
        </span>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <button
        type="button"
        onClick={() => {
          reported.current = false;
          shareLocation();
        }}
        className="flex shrink-0 items-center gap-2 rounded-full border border-fog bg-snow px-4 py-2 text-xs font-medium text-graphite shadow-sm hover:bg-mist"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Enable location
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={shareLocation}
      className="flex shrink-0 items-center gap-2 rounded-full border border-fog bg-snow px-4 py-2 text-xs font-medium text-graphite shadow-sm hover:bg-mist"
    >
      <RefreshCw className="h-3.5 w-3.5" />
      Retry GPS
    </button>
  );
}
