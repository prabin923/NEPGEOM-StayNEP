import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  runTravelChatTurn,
  type TravelChatMessage,
} from "@/lib/travel-ai-assistant";
import { fetchRegisteredHotelMarkers } from "@/lib/registered-hotels";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TRAVELER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { messages?: TravelChatMessage[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "Last message must be from user" },
      { status: 400 }
    );
  }

  let registered: Awaited<ReturnType<typeof fetchRegisteredHotelMarkers>> = [];
  try {
    registered = await fetchRegisteredHotelMarkers();
  } catch (e) {
    console.warn("[ai/travel-chat] hotels load skipped:", e);
  }

  try {
    const result = await runTravelChatTurn(messages, {
      travelerName: session.user.name ?? "Traveler",
      registeredHotels: registered,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[ai/travel-chat]", e);
    const message =
      e instanceof Error ? e.message : "Failed to process message";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
