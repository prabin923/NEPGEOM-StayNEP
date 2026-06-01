"use client";

import { useState } from "react";
import { Search, Phone, Mail, Globe, MapPin, ShieldAlert, Check } from "lucide-react";
import { embassies, type Embassy } from "@/data/embassies";

interface ConsularDirectoryProps {
  onShowOnMap?: (lat: number, lng: number) => void;
}

export default function ConsularDirectory({ onShowOnMap }: ConsularDirectoryProps) {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = embassies.filter(
    (e) =>
      e.country.toLowerCase().includes(query.toLowerCase()) ||
      e.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-graphite" />
        <div>
          <h3 className="text-[18px] font-semibold text-ink font-cosmica">
            Diplomatic missions
          </h3>
          <p className="text-[14px] text-steel font-cosmica">
            Contact your home embassy or consulate in Kathmandu
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-steel" />
        </span>
        <input
          type="text"
          placeholder="Search by country or mission name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-[14px] border border-fog bg-snow py-2 pl-9 pr-4 text-sm text-ink outline-none placeholder:text-steel focus:border-obsidian focus:ring-1 focus:ring-obsidian"
        />
      </div>

      {/* Directory Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-fog bg-mist/30 px-4 py-8 text-center">
          <p className="text-sm text-steel">No embassies match your search.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((e) => (
            <li
              key={e.id}
              className="flex flex-col justify-between rounded-[16px] border border-fog bg-snow p-4 transition hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-ink leading-tight font-cosmica">
                      {e.country}
                    </h4>
                    <p className="mt-0.5 text-xs text-steel leading-tight">
                      {e.name}
                    </p>
                  </div>
                  {onShowOnMap && (
                    <button
                      type="button"
                      onClick={() => onShowOnMap(e.lat, e.lng)}
                      className="rounded-[10px] border border-fog bg-mist/40 p-2 text-steel transition hover:bg-fog hover:text-obsidian"
                      title="Show on map"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <p className="mt-2 text-xs text-graphite font-cosmica">{e.address}</p>

                {/* Hotlines */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-steel">
                    <Phone className="h-3 w-3 shrink-0" />
                    <span>Office: {e.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-[10px] bg-red-50/50 border border-red-100/40 px-2 py-1 text-xs text-red-700">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-red-600" />
                    <span className="font-medium font-cosmica">
                      Hotline: {e.emergencyPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-4 flex gap-1.5 border-t border-fog pt-3">
                <button
                  type="button"
                  onClick={() => handleCopyEmail(e.email, e.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-[10px] border border-fog bg-mist/50 py-1.5 text-[11px] font-medium text-graphite transition hover:bg-fog"
                >
                  {copiedId === e.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Mail className="h-3 w-3" />
                      Email
                    </>
                  )}
                </button>
                <a
                  href={e.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-[10px] border border-fog bg-mist/50 py-1.5 text-[11px] font-medium text-graphite text-center transition hover:bg-fog"
                >
                  <Globe className="h-3 w-3" />
                  Website
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
