"use client";

import { useMemo, useState } from "react";
import { Search, MapPin } from "lucide-react";
import {
  buildSearchableHotels,
  NEPAL_HOTEL_DISTRICTS,
  searchHotels,
  type SearchableHotel,
} from "@/lib/traveler-hotel-search";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import StarRating from "@/components/traveler/StarRating";
import { PortalSectionTitle } from "@/components/portal/PortalUI";

interface HotelSearchPanelProps {
  registeredHotels: RegisteredHotelMarker[];
  onSelectHotel?: (hotel: SearchableHotel) => void;
}

function reviewBadge(source: SearchableHotel["reviewSource"]) {
  if (source === "Google") return "Google reviews";
  if (source === "StayNEP") return "StayNEP verified";
  return "Google + StayNEP";
}

export default function HotelSearchPanel({
  registeredHotels,
  onSelectHotel,
}: HotelSearchPanelProps) {
  const allHotels = useMemo(
    () => buildSearchableHotels(registeredHotels),
    [registeredHotels]
  );

  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("All districts");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<"rating" | "reviews" | "name">("rating");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched && !query.trim()) return [];
    return searchHotels(allHotels, {
      query: query.trim() || undefined,
      district: district === "All districts" ? undefined : district,
      minRating: minRating > 0 ? minRating : undefined,
      sort,
    });
  }, [allHotels, query, district, minRating, sort, searched]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
  }

  return (
    <div>
      <PortalSectionTitle
        title="Find the best hotels"
        subtitle="Search by name or district — ranked like Google reviews (★ rating & review count)"
        icon={Search}
      />

      <form
        onSubmit={handleSearch}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
      >
        <div className="min-w-0 flex-1 sm:min-w-[200px]">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-steel">
            Search
          </label>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hotel name, district, or type…"
            className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm text-ink outline-none focus:border-graphite"
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-steel">
            District
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm text-ink"
          >
            {NEPAL_HOTEL_DISTRICTS.map((d) => (
              <option key={d} value={d === "All districts" ? "All districts" : d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-32">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-steel">
            Min rating
          </label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm text-ink"
          >
            <option value={0}>Any</option>
            <option value={4}>4.0+ ★</option>
            <option value={4.5}>4.5+ ★</option>
          </select>
        </div>
        <div className="w-full sm:w-36">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-steel">
            Sort by
          </label>
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "rating" | "reviews" | "name")
            }
            className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm text-ink"
          >
            <option value="rating">Best rated</option>
            <option value="reviews">Most reviews</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-[36px] bg-obsidian px-5 py-2.5 text-sm font-medium text-snow shadow-button transition active:scale-[0.98] sm:w-auto"
        >
          <Search className="h-4 w-4" />
          Search hotels
        </button>
      </form>

      {searched && (
        <p className="mt-3 text-xs text-steel">
          {results.length} hotel{results.length !== 1 ? "s" : ""} found
          {query ? ` for “${query}”` : ""}
          {district !== "All districts" ? ` in ${district}` : ""}
        </p>
      )}

      <ul className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">
        {searched && results.length === 0 && (
          <li className="rounded-[16px] border border-fog bg-mist/50 px-4 py-8 text-center text-sm text-steel">
            No hotels match. Try a lower minimum rating or another district.
          </li>
        )}
        {results.slice(0, 20).map((hotel) => (
          <li
            key={hotel.key}
            className="rounded-[16px] border border-fog bg-mist/30 p-4 transition hover:border-graphite hover:bg-snow"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-obsidian">{hotel.name}</h3>
                  {hotel.isStayNepPartner && (
                    <span className="rounded-full bg-obsidian px-2 py-0.5 text-[10px] font-medium text-snow">
                      StayNEP partner
                    </span>
                  )}
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-steel">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {hotel.district} · {hotel.type} · {hotel.priceRange}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <StarRating rating={hotel.rating} />
                  <span className="text-xs text-steel">
                    {hotel.reviewCount.toLocaleString()} reviews
                  </span>
                  <span className="rounded-full border border-fog bg-snow px-2 py-0.5 text-[10px] font-medium text-graphite">
                    {reviewBadge(hotel.reviewSource)}
                  </span>
                </div>
                {hotel.availableUnits != null && (
                  <p className="mt-1.5 text-[11px] text-steel">
                    {hotel.availableUnits} rooms available
                    {hotel.totalUnits != null ? ` / ${hotel.totalUnits} total` : ""}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onSelectHotel?.(hotel)}
                className="inline-flex shrink-0 items-center gap-1 rounded-[36px] border border-fog bg-snow px-3 py-1.5 text-xs font-medium text-obsidian hover:bg-fog"
              >
                <MapPin className="h-3.5 w-3.5" />
                View on map
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!searched && (
        <p className="mt-4 text-center text-xs text-steel">
          Tip: search “Pokhara” or “heritage” — partners show combined Google + StayNEP
          scores.
        </p>
      )}
    </div>
  );
}
