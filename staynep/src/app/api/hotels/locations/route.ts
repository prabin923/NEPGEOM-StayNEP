import { NextResponse } from "next/server";
import { fetchRegisteredHotelMarkers } from "@/lib/registered-hotels";

export async function GET() {
  try {
    const hotels = await fetchRegisteredHotelMarkers();
    return NextResponse.json({ hotels, count: hotels.length });
  } catch (e) {
    console.error("[hotels/locations]", e);
    return NextResponse.json(
      { error: "Failed to load registered hotels" },
      { status: 500 }
    );
  }
}
