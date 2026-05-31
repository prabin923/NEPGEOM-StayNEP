"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "shared" | "denied" | "error";

/**
 * Shares the signed-in traveler's GPS position with StayNEP for map display.
 */
export default function TravelerLocationReporter() {
  const [status, setStatus] = useState<Status>("idle");
  const [label, setLabel] = useState<string | null>(null);
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current) return;
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    reported.current = true;
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
  }, []);

  if (status === "idle" || status === "loading") {
    return (
      <p className="flex items-center gap-2 rounded-[12px] border border-fog bg-mist/50 px-3 py-2 text-xs text-steel">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Sharing your location on the Nepal map…
      </p>
    );
  }

  if (status === "shared") {
    return (
      <p className="flex items-center gap-2 rounded-[12px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        Your location is visible on StayNEP maps
        {label ? ` · ${label}` : ""}
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="rounded-[12px] border border-fog bg-mist/50 px-3 py-2 text-xs text-steel">
        Location permission denied. Enable location in your browser to appear on
        the tourism map.
      </p>
    );
  }

  return null;
}
