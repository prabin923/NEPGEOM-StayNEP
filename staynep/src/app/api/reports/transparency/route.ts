import { NextResponse } from "next/server";
import { fetchTransparencySnapshot } from "@/lib/tourist-reports";

export async function GET() {
  try {
    const snapshot = await fetchTransparencySnapshot();
    return NextResponse.json(snapshot);
  } catch (e) {
    console.error("[reports/transparency]", e);
    return NextResponse.json(
      { error: "Failed to load transparency data" },
      { status: 500 }
    );
  }
}
