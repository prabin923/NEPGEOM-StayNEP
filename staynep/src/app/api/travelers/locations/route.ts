import { NextResponse } from "next/server";
import { fetchTouristMapMarkers } from "@/lib/traveler-locations";

export async function GET() {
  try {
    const tourists = await fetchTouristMapMarkers();
    return NextResponse.json({ tourists, count: tourists.length });
  } catch (e) {
    console.error("[travelers/locations]", e);
    return NextResponse.json(
      { error: "Failed to load tourist locations" },
      { status: 500 }
    );
  }
}
