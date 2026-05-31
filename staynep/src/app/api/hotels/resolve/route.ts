import { NextResponse } from "next/server";
import { resolvePropertyIdForCatalogHotel } from "@/lib/map-hotel-selection";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const district = searchParams.get("district");
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!name || !district || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Missing hotel parameters" }, { status: 400 });
  }

  try {
    const resolved = await resolvePropertyIdForCatalogHotel({
      name,
      district,
      lat,
      lng,
    });
    return NextResponse.json(resolved);
  } catch (e) {
    console.error("[hotels/resolve]", e);
    return NextResponse.json({ error: "Resolve failed" }, { status: 500 });
  }
}
