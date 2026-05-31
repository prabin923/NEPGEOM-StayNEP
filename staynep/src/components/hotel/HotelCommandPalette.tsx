"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { HotelSearchItem } from "@/lib/hotel-search";

interface HotelCommandPaletteProps {
  items: HotelSearchItem[];
}

export default function HotelCommandPalette({ items }: HotelCommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 12);
    return items
      .filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          i.sublabel?.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [items, query]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex flex-1 max-w-xl items-center gap-2 rounded-[10px] border border-fog bg-mist/50 py-2 pl-9 pr-16 text-left text-sm text-steel hover:bg-mist"
      >
        <Search className="pointer-events-none absolute left-3 h-4 w-4" />
        <span>Search bookings, rooms, pages…</span>
        <kbd className="pointer-events-none absolute right-2 hidden rounded border border-fog bg-snow px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘ K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-obsidian/30 p-4 pt-[12vh]">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setOpen(false)}
            aria-label="Close search"
          />
          <div className="relative w-full max-w-lg rounded-[16px] border border-fog bg-snow shadow-xl">
            <div className="flex items-center gap-2 border-b border-fog px-4 py-3">
              <Search className="h-4 w-4 text-steel" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[8px] p-1 text-steel hover:bg-fog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-[320px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-steel">No results</li>
              ) : (
                filtered.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.href)}
                      className="flex w-full flex-col rounded-[10px] px-3 py-2.5 text-left hover:bg-[#ebe6dc]/60"
                    >
                      <span className="text-sm font-medium text-obsidian">{item.label}</span>
                      <span className="text-xs text-steel">
                        {item.category}
                        {item.sublabel ? ` · ${item.sublabel}` : ""}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
