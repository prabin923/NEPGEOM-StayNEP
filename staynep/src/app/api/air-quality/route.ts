import { NextResponse } from "next/server";
import { fetchAirQuality } from "@/lib/air-quality";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const label = searchParams.get("label")?.trim() || "Your location";

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "lat and lng query parameters are required" },
      { status: 400 }
    );
  }

  if (lat < 26 || lat > 31 || lng < 80 || lng > 89) {
    return NextResponse.json(
      { error: "Coordinates must be within Nepal bounds" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchAirQuality(lat, lng, label);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch air quality data" },
      { status: 502 }
    );
  }
}
