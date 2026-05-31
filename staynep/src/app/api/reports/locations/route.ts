import { NextResponse } from "next/server";
import { fetchOpenReportMarkers } from "@/lib/report-map-markers";

export async function GET() {
  try {
    const reports = await fetchOpenReportMarkers();
    return NextResponse.json({ reports });
  } catch (e) {
    console.error("[reports/locations]", e);
    return NextResponse.json(
      { error: "Failed to load report locations" },
      { status: 500 }
    );
  }
}
