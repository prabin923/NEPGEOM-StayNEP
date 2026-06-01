import { NextResponse } from "next/server";
import { fetchMapOverview } from "@/lib/map-overview";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const overview = await fetchMapOverview();
    return NextResponse.json(overview);
  } catch (e) {
    console.error("[map/overview]", e);
    return NextResponse.json(
      { error: "Failed to load map overview" },
      { status: 500 }
    );
  }
}
