import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { upsertTravelerLocation } from "@/lib/traveler-locations";
import { reverseGeoapifyLocation } from "@/lib/geoapify";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TRAVELER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { lat?: number; lng?: number; label?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const lat = Number(body.lat);
  const lng = Number(body.lng);
  let label =
    typeof body.label === "string" ? body.label.trim().slice(0, 120) : null;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "lat and lng are required numbers" },
      { status: 400 }
    );
  }

  try {
    if (!label) {
      label = await reverseGeoapifyLocation(lat, lng);
    }
    const row = await upsertTravelerLocation(
      session.user.id,
      lat,
      lng,
      label
    );
    return NextResponse.json({
      ok: true,
      lat: row.latitude,
      lng: row.longitude,
      label: row.label,
      updatedAt: row.updatedAt,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save location";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
