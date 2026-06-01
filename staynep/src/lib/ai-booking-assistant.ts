import {
  describePropertyForAi,
  executeBookingDraft,
  fetchPropertyBookingContext,
  toDateInput,
  type BookingDraft,
  type PropertyBookingContext,
} from "@/lib/hotel-ai-booking";
import { formatNpr } from "@/lib/hotel";
import { generateGeminiText } from "@/lib/gemini";
import {
  fetchAllPartnerNames,
  resolvePropertyIdForCatalogHotel,
} from "@/lib/map-hotel-selection";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type BookingChatState = {
  mapHotelKey: string;
  mapHotelName: string;
  mapHotelDistrict: string;
  mapHotelLat: number;
  mapHotelLng: number;
  propertyId?: string;
  /** When catalog hotel maps to a different StayNEP partner */
  partnerName?: string;
  checkIn?: string;
  checkOut?: string;
  roomId?: string;
  units?: number;
  guestPhone?: string;
  bookingId?: string;
};

export type BookingChatResult = {
  reply: string;
  state: BookingChatState;
  booked?: {
    bookingId: string;
    roomName: string;
    totalNpr: number;
    checkIn: string;
    checkOut: string;
  };
};

function parseDatesFromMessage(text: string): { checkIn?: string; checkOut?: string } {
  const isoDates = text.match(/\b20\d{2}-\d{2}-\d{2}\b/g) ?? [];
  if (isoDates.length >= 2) {
    return { checkIn: isoDates[0], checkOut: isoDates[1] };
  }
  if (isoDates.length === 1) {
    return { checkIn: isoDates[0] };
  }

  const lower = text.toLowerCase();
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  if (lower.includes("tomorrow")) {
    const checkIn = new Date(today);
    checkIn.setDate(checkIn.getDate() + 1);
    const checkOut = new Date(checkIn);
    const nightsMatch = lower.match(/(\d+)\s*night/);
    const nights = nightsMatch ? Number(nightsMatch[1]) : 3;
    checkOut.setDate(checkOut.getDate() + nights);
    return { checkIn: toDateInput(checkIn), checkOut: toDateInput(checkOut) };
  }

  const nightsMatch = lower.match(/(\d+)\s*night/);
  if (nightsMatch) {
    const nights = Number(nightsMatch[1]);
    const checkIn = new Date(today);
    checkIn.setDate(checkIn.getDate() + 1);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + nights);
    return { checkIn: toDateInput(checkIn), checkOut: toDateInput(checkOut) };
  }

  return {};
}

function matchRoom(
  text: string,
  ctx: PropertyBookingContext
): (typeof ctx.rooms)[0] | null {
  const lower = text.toLowerCase();
  for (const room of ctx.rooms) {
    if (lower.includes(room.name.toLowerCase())) return room;
  }
  const keywords: Record<string, string[]> = {
    standard: ["standard", "trekker"],
    deluxe: ["deluxe", "himalayan"],
    suite: ["suite", "premium", "heritage", "annapurna", "family", "chalet"],
  };
  for (const room of ctx.rooms) {
    const name = room.name.toLowerCase();
    for (const [, words] of Object.entries(keywords)) {
      if (words.some((w) => lower.includes(w) && name.includes(w))) return room;
    }
  }
  if (ctx.rooms.length === 1) return ctx.rooms[0];
  return null;
}

function matchPartnerProperty(
  text: string,
  partners: { id: string; name: string }[]
): string | null {
  const lower = text.toLowerCase();
  for (const p of partners) {
    if (lower.includes(p.name.toLowerCase())) return p.id;
  }
  return null;
}

function parseUnits(text: string): number | undefined {
  const m = text.match(/(\d+)\s*(room|unit|bed)/i);
  if (m) return Math.max(1, Number(m[1]));
  return undefined;
}

function wantsConfirm(text: string) {
  const lower = text.toLowerCase().trim();
  return (
    /^(yes|confirm|book it|please book|go ahead|ok|okay)\b/.test(lower) ||
    lower.includes("confirm booking")
  );
}

async function ensurePropertyId(state: BookingChatState): Promise<BookingChatState> {
  if (state.propertyId) return state;

  const resolved = await resolvePropertyIdForCatalogHotel({
    name: state.mapHotelName,
    district: state.mapHotelDistrict,
    lat: state.mapHotelLat,
    lng: state.mapHotelLng,
  });

  if (resolved.propertyId) {
    return {
      ...state,
      propertyId: resolved.propertyId,
      partnerName: resolved.partnerName ?? undefined,
    };
  }
  return state;
}

async function callGeminiAssistant(
  ctx: PropertyBookingContext,
  messages: ChatMessage[],
  state: BookingChatState,
  guest: { name: string },
  partners: { id: string; name: string; district: string }[]
): Promise<string | null> {
  const partnerList = partners
    .map((p) => `- ${p.name} (${p.district}) [id:${p.id}]`)
    .join("\n");

  const viewingNote =
    state.mapHotelName !== ctx.name
      ? `The traveler selected "${state.mapHotelName}" on the map. You are completing the booking at StayNEP partner "${ctx.name}"${state.partnerName ? ` (matched partner)` : ""}. Mention this once if helpful.`
      : `The traveler selected "${state.mapHotelName}" on the map.`;

  const system = `You are StayNEP AI, Nepal tourism hotel booking assistant powered by Gemini.
Be warm, concise (2-4 short paragraphs max). Use plain text, no markdown bold.

Traveler: ${guest.name}
${viewingNote}
Current booking state JSON: ${JSON.stringify(state)}

${describePropertyForAi(ctx)}

All StayNEP partner hotels:
${partnerList}

Rules:
- Only book rooms listed above with real prices.
- Collect check-in, check-out, room type, then ask user to say "confirm".
- When ready, tell them to reply confirm to sync to the hotel management system.
- Prices in NPR.`;

  return generateGeminiText(
    system,
    messages.slice(-14).map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
}

function ruleBasedReply(
  ctx: PropertyBookingContext,
  state: BookingChatState,
  lastUser: string,
  travelerName: string
): string {
  if (state.bookingId) {
    return "Your booking is already confirmed. Check My trips or contact the hotel.";
  }

  const draft = buildDraft(state);
  if (wantsConfirm(lastUser) && draft) {
    return "__CONFIRM__";
  }

  const hotelLabel =
    state.mapHotelName !== ctx.name
      ? `${state.mapHotelName} (booking via partner ${ctx.name})`
      : ctx.name;

  if (!state.checkIn || !state.checkOut) {
    return `Hi ${travelerName}! I can arrange your stay near ${hotelLabel} in ${state.mapHotelDistrict}.\n\nShare dates — e.g. "tomorrow for 3 nights" or "2026-06-05 to 2026-06-08".\n\nSuggested window: ${ctx.defaultCheckIn} → ${ctx.defaultCheckOut}.`;
  }

  if (!state.roomId) {
    const list = ctx.rooms
      .map(
        (r) =>
          `• ${r.name} — ${formatNpr(r.ratePerNight)}/night (${r.availableUnits} available)`
      )
      .join("\n");
    return `Dates: ${state.checkIn} → ${state.checkOut} at ${ctx.name}.\n\nChoose a room:\n${list || "No rooms free — try other dates."}\n\nReply with the room name.`;
  }

  const room = ctx.rooms.find((r) => r.id === state.roomId);
  if (!room) return "That room is unavailable. Pick another room type.";

  const nights =
    Math.ceil(
      (parseDate(state.checkOut!).getTime() - parseDate(state.checkIn!).getTime()) /
        86400000
    ) || 1;
  const total = room.ratePerNight * nights * (state.units ?? 1);

  return `Summary for ${ctx.name}:\n• ${room.name} × ${state.units ?? 1}\n• ${state.checkIn} → ${state.checkOut} (${nights} nights)\n• ${formatNpr(total)} estimated\n\nReply confirm to book — updates the hotel dashboard instantly.`;
}

function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function buildDraft(state: BookingChatState): BookingDraft | null {
  if (!state.propertyId || !state.checkIn || !state.checkOut || !state.roomId) {
    return null;
  }
  return {
    propertyId: state.propertyId,
    roomId: state.roomId,
    checkIn: state.checkIn,
    checkOut: state.checkOut,
    units: state.units ?? 1,
    guestPhone: state.guestPhone,
  };
}

async function completeBooking(
  state: BookingChatState,
  guest: { name: string; email: string }
): Promise<BookingChatResult | null> {
  const draft = buildDraft(state);
  if (!draft) return null;

  const result = await executeBookingDraft(draft, {
    name: guest.name,
    email: guest.email,
    phone: state.guestPhone,
  });

  if ("error" in result) {
    return {
      reply: `Could not complete booking: ${result.error}`,
      state,
    };
  }

  state.bookingId = result.bookingId;
  return {
    reply: `Done! Booking confirmed.\n\n• ${result.propertyName} — ${result.roomName}\n• ${result.checkIn} → ${result.checkOut}\n• ${formatNpr(result.totalNpr)}\n\nSynced to the hotel management system. Ref: ${result.bookingId.slice(0, 8)}…`,
    state,
    booked: {
      bookingId: result.bookingId,
      roomName: result.roomName,
      totalNpr: result.totalNpr,
      checkIn: result.checkIn,
      checkOut: result.checkOut,
    },
  };
}

export async function runBookingChatTurn(
  messages: ChatMessage[],
  state: BookingChatState,
  guest: { name: string; email: string }
): Promise<BookingChatResult> {
  const lastUser =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  const partners = await fetchAllPartnerNames();

  if (!state.propertyId) {
    const partnerPick = matchPartnerProperty(lastUser, partners);
    if (partnerPick) {
      const p = partners.find((x) => x.id === partnerPick);
      state.propertyId = partnerPick;
      state.partnerName = p?.name;
    } else {
      state = await ensurePropertyId(state);
    }
  }

  if (!state.propertyId) {
    const list = partners.map((p) => `• ${p.name} (${p.district})`).join("\n");
    return {
      reply: `I can book StayNEP partner hotels for you. Partners:\n${list}\n\nReply with a partner name, or share dates to continue.`,
      state,
    };
  }

  const dates = parseDatesFromMessage(lastUser);
  if (dates.checkIn) state.checkIn = dates.checkIn;
  if (dates.checkOut) state.checkOut = dates.checkOut;
  if (dates.checkIn && !dates.checkOut && state.checkIn) {
    const co = new Date(parseDate(state.checkIn));
    co.setDate(co.getDate() + 3);
    state.checkOut = toDateInput(co);
  }

  const units = parseUnits(lastUser);
  if (units) state.units = units;

  let ctx = await fetchPropertyBookingContext(
    state.propertyId,
    state.checkIn,
    state.checkOut
  );
  if (!ctx) {
    return { reply: "This hotel is not available on StayNEP right now.", state };
  }

  const matchedRoom = matchRoom(lastUser, ctx);
  if (matchedRoom) state.roomId = matchedRoom.id;

  const phoneMatch = lastUser.match(/\+?\d[\d\s-]{8,}/);
  if (phoneMatch) state.guestPhone = phoneMatch[0].trim();

  if (wantsConfirm(lastUser)) {
    const done = await completeBooking(state, guest);
    if (done) return done;
  }

  let reply =
    (await callGeminiAssistant(ctx, messages, state, guest, partners)) ??
    ruleBasedReply(ctx, state, lastUser, guest.name);

  if (reply === "__CONFIRM__") {
    const done = await completeBooking(state, guest);
    if (done) return done;
    reply =
      "I still need check-in, check-out, and a room before I can confirm.";
  }

  return { reply: reply.replace(/\*\*/g, ""), state };
}

export function initialAssistantMessage(
  hotel: { name: string; isStayNepPartner: boolean; partnerName?: string | null }
) {
  if (hotel.isStayNepPartner) {
    return `Namaste! I'm StayNEP AI. I'll help you book ${hotel.name} — confirmed bookings sync to the hotel instantly. When are you checking in?`;
  }
  if (hotel.partnerName && hotel.partnerName !== hotel.name) {
    return `Namaste! You selected ${hotel.name}. I'll book your stay through our StayNEP partner ${hotel.partnerName} with live availability. What dates work for you?`;
  }
  return `Namaste! I'm StayNEP AI. You picked ${hotel.name} — tell me your dates and I'll find the best partner room nearby.`;
}
