"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Star, Building2, Filter, ArrowLeft } from "lucide-react";
import type { SearchableHotel } from "@/lib/search-hotels";
import { formatNpr } from "@/lib/traveler-bookings";

interface HotelSearchPageProps {
  hotels: SearchableHotel[];
  isLoggedIn: boolean;
}

type SortOption = "rating" | "price-low" | "price-high" | "name";
type PriceFilter = "all" | "under-2000" | "2000-5000" | "above-5000";

export default function HotelSearchPage({ hotels, isLoggedIn }: HotelSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  // Extract unique districts
  const districts = useMemo(() => {
    const list = hotels.map((h) => h.district);
    return ["all", ...Array.from(new Set(list))].sort();
  }, [hotels]);

  // Filter and sort hotels
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((h) => {
        // Search query filter
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (h.address && h.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
          h.district.toLowerCase().includes(searchQuery.toLowerCase());

        // District filter
        const matchesDistrict = selectedDistrict === "all" || h.district === selectedDistrict;

        // Price filter
        let matchesPrice = true;
        if (priceFilter === "under-2000") {
          matchesPrice = h.minPrice < 2000;
        } else if (priceFilter === "2000-5000") {
          matchesPrice = (h.minPrice >= 2000 && h.minPrice <= 5000) || (h.maxPrice >= 2000 && h.maxPrice <= 5000);
        } else if (priceFilter === "above-5000") {
          matchesPrice = h.maxPrice > 5000;
        }

        return matchesSearch && matchesDistrict && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return b.avgRating - a.avgRating;
        }
        if (sortBy === "price-low") {
          return a.minPrice - b.minPrice;
        }
        if (sortBy === "price-high") {
          return b.maxPrice - a.maxPrice;
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [hotels, searchQuery, selectedDistrict, priceFilter, sortBy]);

  return (
    <div className="min-h-screen bg-mist text-ink">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-fog bg-snow/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-semibold text-graphite hover:text-obsidian"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-fog mx-2" />
            <h1 className="text-xl font-bold leading-none tracking-tight text-obsidian font-cosmica">
              Stay<span className="text-[#C9A24A]">NEP</span> Hotels
            </h1>
          </div>
          <div>
            {isLoggedIn ? (
              <Link
                href="/dashboard/traveler"
                className="rounded-full border border-fog bg-snow px-4 py-2 text-xs font-semibold text-graphite hover:border-obsidian/20 hover:bg-mist transition shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-obsidian px-4 py-2 text-xs font-semibold text-snow hover:opacity-90 transition shadow-button"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-3xl font-extrabold text-obsidian font-cosmica tracking-tight">
            Browse Accommodations in Nepal
          </h2>
          <p className="text-sm text-steel max-w-2xl font-cosmica">
            Discover verified hotels, heritage homestays, and boutique resorts across all 7 provinces. Built with location intelligence for secure and comfortable journeys.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="rounded-[24px] border border-fog bg-snow p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" />
              <input
                type="text"
                placeholder="Search by hotel name, address, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[16px] border border-fog bg-mist/30 pl-10 pr-4 py-3 text-sm outline-none focus:border-obsidian focus:bg-snow focus:ring-2 focus:ring-obsidian/10 transition"
              />
            </div>
            
            {/* District Dropdown */}
            <div className="w-full md:w-64">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full rounded-[16px] border border-fog bg-mist/30 px-4 py-3 text-sm outline-none focus:border-obsidian focus:bg-snow focus:ring-2 focus:ring-obsidian/10 transition capitalize"
              >
                <option value="all">All Districts</option>
                {districts.filter(d => d !== "all").map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-fog/50">
            {/* Price Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-steel uppercase tracking-wider mr-2">Price</span>
              {(
                [
                  { label: "Any", value: "all" },
                  { label: "Under NPR 2,000", value: "under-2000" },
                  { label: "NPR 2,000 - 5,000", value: "2000-5000" },
                  { label: "Above NPR 5,000", value: "above-5000" },
                ] as const
              ).map((btn) => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => setPriceFilter(btn.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    priceFilter === btn.value
                      ? "bg-obsidian text-snow"
                      : "bg-mist text-graphite hover:bg-fog"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-steel uppercase tracking-wider flex items-center gap-1">
                <Filter className="h-3 w-3" /> Sort By
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-full border border-fog bg-snow px-3.5 py-1.5 text-xs font-semibold text-graphite outline-none focus:border-obsidian cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-steel font-medium">
          <p>Showing {filteredHotels.length} hotels</p>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-fog bg-snow/80 px-4 py-16 text-center shadow-sm">
            <Building2 className="mx-auto h-10 w-10 text-ash mb-3" />
            <h4 className="text-base font-semibold text-ink">No accommodations found</h4>
            <p className="mt-1 text-sm text-steel max-w-md mx-auto">
              We couldn't find any hotels matching your current filters. Try searching for a different area or relaxing your price criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDistrict("all");
                setPriceFilter("all");
              }}
              className="mt-4 rounded-full bg-obsidian px-4 py-2 text-xs font-semibold text-snow hover:opacity-90 shadow-button"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-fog bg-snow p-5 transition hover:shadow-md hover:-translate-y-0.5 duration-200"
              >
                <div>
                  {/* Partner Badge & Name */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-ink group-hover:text-obsidian transition leading-snug">
                      {hotel.name}
                    </h3>
                    {hotel.isPartner && (
                      <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                        Partner
                      </span>
                    )}
                  </div>

                  {/* District and Location */}
                  <div className="mt-2 flex items-center gap-1 text-xs text-steel">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{hotel.district}{hotel.address ? `, ${hotel.address}` : ""}</span>
                  </div>

                  {/* Rating display */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="h-4 w-4 fill-currentColor" />
                    </div>
                    {hotel.reviewCount > 0 ? (
                      <span className="text-xs font-bold text-ink">
                        {hotel.avgRating}{" "}
                        <span className="font-normal text-steel">
                          ({hotel.reviewCount} {hotel.reviewCount === 1 ? "review" : "reviews"})
                        </span>
                      </span>
                    ) : (
                      <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-medium text-steel">
                        New
                      </span>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {hotel.amenities.slice(0, 4).map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-mist/60 px-2.5 py-0.5 text-[10px] font-semibold text-graphite"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className="rounded-full bg-mist/60 px-2 py-0.5 text-[10px] font-semibold text-steel">
                        +{hotel.amenities.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Room types */}
                  <div className="mt-4 border-t border-fog/50 pt-3">
                    <p className="text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Available Options
                    </p>
                    <p className="mt-1 text-xs text-graphite font-medium truncate">
                      {hotel.roomTypes.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-fog/50 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-medium text-steel block">Price from</span>
                    <span className="text-base font-extrabold text-obsidian font-cosmica leading-none">
                      {formatNpr(hotel.minPrice)}
                      {hotel.maxPrice > hotel.minPrice && (
                        <span className="text-xs font-normal text-steel">
                          {" "}- {formatNpr(hotel.maxPrice)}
                        </span>
                      )}
                      <span className="text-[10px] font-normal text-steel">/night</span>
                    </span>
                  </div>

                  <Link
                    href={isLoggedIn ? "/dashboard/traveler" : "/login"}
                    className="rounded-full bg-obsidian px-4 py-2 text-xs font-bold text-snow hover:opacity-90 transition shadow-button shrink-0"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
