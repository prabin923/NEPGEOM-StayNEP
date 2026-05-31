import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  runBookingChatTurn,
  type BookingChatState,
  type ChatMessage,
} from "@/lib/ai-booking-assistant";
import { revalidateHotelDashboard } from "@/lib/hotel-revalidate";
import { revalidateTourismPortals } from "@/lib/revalidate-app";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TRAVELER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    messages?: ChatMessage[];
    state?: BookingChatState;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  const state = body.state;

  if (!state?.mapHotelName || !state?.mapHotelKey) {
    return NextResponse.json({ error: "Invalid chat state" }, { status: 400 });
  }

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
  }

  try {
    const result = await runBookingChatTurn(messages, state, {
      name: session.user.name ?? "Traveler",
      email: session.user.email ?? "",
    });

    if (result.booked) {
      revalidateHotelDashboard();
      revalidateTourismPortals();
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("[ai/booking-chat]", e);
    return NextResponse.json(
      { error: "Failed to process booking chat" },
      { status: 500 }
    );
  }
}
