"use client";

import { MapPin } from "lucide-react";

export default function MapUnavailable({
  fillContainer,
  sectionLayout,
}: {
  fillContainer?: boolean;
  sectionLayout?: boolean;
}) {
  const rootClass = [
    "staynep-map-root",
    fillContainer && "staynep-map-root--fill",
    sectionLayout && "staynep-map-root--section",
    "flex flex-col items-center justify-center gap-3 bg-mist p-8 text-center",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <MapPin className="h-10 w-10 text-steel" />
      <p className="max-w-md text-sm font-medium text-obsidian font-cosmica">
        Geoapify API key required
      </p>
      <p className="max-w-md text-xs leading-relaxed text-steel font-cosmica">
        Get a free key at{" "}
        <a
          href="https://myprojects.geoapify.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-obsidian underline"
        >
          myprojects.geoapify.com
        </a>
        , then add{" "}
        <code className="rounded bg-fog px-1.5 py-0.5 text-graphite">
          NEXT_PUBLIC_GEOAPIFY_API_KEY
        </code>{" "}
        to your <code className="rounded bg-fog px-1.5 py-0.5">.env</code> file.
      </p>
    </div>
  );
}
