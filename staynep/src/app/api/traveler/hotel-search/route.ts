import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  buildSearchableHotels,
  searchHotels,
  type TravelerHotelSearchParams,
} from "@/lib/traveler-hotel-search";
import { fetchRegisteredHotelMarkers } from "@/lib/registered-hotels";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TRAVELER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const params: TravelerHotelSearchParams = {
    query: searchParams.get("q") ?? undefined,
    district:
      searchParams.get("district") && searchParams.get("district") !== "all"
        ? searchParams.get("district")!
        : undefined,
    minRating: searchParams.get("minRating")
      ? Number(searchParams.get("minRating"))
      : undefined,
    sort: (searchParams.get("sort") as TravelerHotelSearchParams["sort"]) ?? "rating",
  };

  try {
    const registered = await fetchRegisteredHotelMarkers();
    const all = buildSearchableHotels(registered);
    const results = searchHotels(all, params);
    return NextResponse.json({
      results,
      total: results.length,
      catalogCount: all.length,
    });
  } catch (e) {
    console.error("[traveler/hotel-search]", e);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
