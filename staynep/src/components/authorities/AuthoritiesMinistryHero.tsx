"use client";

import { useEffect, useState } from "react";

interface AuthoritiesMinistryHeroProps {
  openReports: number;
  criticalOpen: number;
  travelersOnMap: number;
}

export default function AuthoritiesMinistryHero({
  openReports,
  criticalOpen,
  travelersOnMap,
}: AuthoritiesMinistryHeroProps) {
  const [now, setNow] = useState("");

  useEffect(() => {
    setNow(
      new Date().toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
    );
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h1 className="text-[22px] font-bold tracking-tight text-ink font-cosmica">
          Tourism Authority
        </h1>
        {now && (
          <span className="text-sm text-steel font-cosmica">{now}</span>
        )}
      </div>
      <div className="flex items-center gap-5 text-sm text-graphite">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-500" />
          </span>
          Reports
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-500" />
          </span>
          Travelers right now
        </span>
      </div>
    </div>
  );
}
