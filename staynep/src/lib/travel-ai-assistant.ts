import { attractions } from "@/data/attractions";
import { hotels } from "@/data/hotels";
import { distanceKm, formatDistanceKm } from "@/lib/geo";
import { generateGeminiText, type GeminiChatMessage } from "@/lib/gemini";
import { coordsForDistrict } from "@/lib/nepal-districts";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import {
  budgetBenchmarksText,
  detectTravelStyle,
  estimateTripBudget,
  formatBudgetMarkdown,
} from "@/lib/travel-budget";
import {
  formatHotelRecommendationsMarkdown,
  hotelsContextForAi,
  isHotelRecommendIntent,
  recommendHotelsForDistrict,
  recommendHotelsForTrip,
} from "@/lib/travel-hotel-recommendations";

export type TravelChatMessage = { role: "user" | "assistant"; content: string };

export type TravelPlace = {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  kind: "hotel" | "attraction" | "district";
};

type RouteStopTemplate = {
  hub: string;
  minDays: number;
  highlights: string[];
  stayTip: string;
};

const CLASSIC_ITINERARY: RouteStopTemplate[] = [
  {
    hub: "Kathmandu",
    minDays: 2,
    highlights: [
      "Pashupatinath Temple",
      "Boudhanath Stupa",
      "Kathmandu Durbar Square",
      "Patan Durbar Square",
    ],
    stayTip: "Stay in Thamel or Durbar Marg for easy access.",
  },
  {
    hub: "Chitwan",
    minDays: 2,
    highlights: [
      "Chitwan National Park jeep/canoe safari",
      "Tharu village culture",
      "Bird watching",
    ],
    stayTip: "Book a lodge inside or near Sauraha.",
  },
  {
    hub: "Pokhara",
    minDays: 2,
    highlights: [
      "Phewa Lake boating",
      "Sarangkot sunrise (Annapurna views)",
      "World Peace Pagoda",
      "Optional: Annapurna Base Camp trek",
    ],
    stayTip: "Lakeside has most hotels and restaurants.",
  },
];

const EVEREST_ITINERARY: RouteStopTemplate[] = [
  {
    hub: "Kathmandu",
    minDays: 1,
    highlights: ["Trip briefing", "gear check", "Boudhanath"],
    stayTip: "Overnight in Kathmandu before the flight to Lukla.",
  },
  {
    hub: "Namche / Everest region",
    minDays: 5,
    highlights: [
      "Fly to Lukla",
      "Trek via Namche Bazaar",
      "Everest Base Camp or viewpoint stops",
    ],
    stayTip: "Teahouse trek — acclimatize with rest days.",
  },
];

const CULTURAL_ITINERARY: RouteStopTemplate[] = [
  {
    hub: "Kathmandu Valley",
    minDays: 3,
    highlights: ["Pashupatinath", "Boudhanath", "Bhaktapur Durbar Square"],
    stayTip: "Base in Kathmandu with day trips.",
  },
  {
    hub: "Lumbini",
    minDays: 2,
    highlights: ["Mayadevi Temple", "monastery zone", "peace gardens"],
    stayTip: "Quiet stays near the sacred garden.",
  },
  {
    hub: "Pokhara",
    minDays: 2,
    highlights: ["Phewa Lake", "Bindhyabasini Temple", "mountain views"],
    stayTip: "Combine culture with relaxation.",
  },
];

const HUB_ALIASES: Record<string, string> = {
  ktm: "Kathmandu",
  kt: "Kathmandu",
  pkr: "Pokhara",
  chitwan: "Chitwan",
  sauraha: "Chitwan",
  lumbini: "Lumbini",
  everest: "Namche",
  ebc: "Namche",
  annapurna: "Pokhara",
};

export function buildTravelPlacesIndex(
  registered: RegisteredHotelMarker[] = []
): TravelPlace[] {
  const places: TravelPlace[] = [];

  for (const h of hotels) {
    places.push({
      id: `hotel-${h.id}`,
      name: h.name,
      district: h.district,
      lat: h.lat,
      lng: h.lng,
      kind: "hotel",
    });
  }

  for (const r of registered) {
    if (!places.some((p) => p.name.toLowerCase() === r.name.toLowerCase())) {
      places.push({
        id: `partner-${r.id}`,
        name: r.name,
        district: r.district,
        lat: r.lat,
        lng: r.lng,
        kind: "hotel",
      });
    }
  }

  for (const a of attractions) {
    places.push({
      id: `attr-${a.id}`,
      name: a.name,
      district: a.district,
      lat: a.lat,
      lng: a.lng,
      kind: "attraction",
    });
  }

  const districts = new Set([
    ...hotels.map((h) => h.district),
    ...attractions.map((a) => a.district),
    "Pokhara",
    "Kathmandu",
    "Chitwan",
    "Lumbini",
    "Namche",
    "Everest",
    "Bhaktapur",
    "Lalitpur",
  ]);

  for (const d of districts) {
    const c = coordsForDistrict(d);
    places.push({
      id: `dist-${d}`,
      name: d,
      district: d,
      lat: c.lat,
      lng: c.lng,
      kind: "district",
    });
  }

  return places;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function findPlace(
  query: string,
  places: TravelPlace[]
): TravelPlace | null {
  const q = normalize(query);
  if (!q) return null;

  const aliasKey = HUB_ALIASES[q];
  if (aliasKey && normalize(aliasKey) !== q) {
    return findPlace(aliasKey, places);
  }

  const exact = places.find((p) => normalize(p.name) === q);
  if (exact) return exact;

  const contains = places.filter(
    (p) => normalize(p.name).includes(q) || q.includes(normalize(p.name))
  );
  if (contains.length === 1) return contains[0];
  if (contains.length > 1) {
    return contains.sort((a, b) => a.name.length - b.name.length)[0];
  }

  const district = places.find(
    (p) => p.kind === "district" && normalize(p.name).includes(q)
  );
  return district ?? null;
}

export function distanceBetween(
  a: TravelPlace,
  b: TravelPlace
): { km: number; roadKm: number; label: string; roadLabel: string } {
  const km = distanceKm(a.lat, a.lng, b.lat, b.lng);
  const roadKm = km * 1.28;
  return {
    km,
    roadKm,
    label: formatDistanceKm(km),
    roadLabel: formatDistanceKm(roadKm),
  };
}

function roadLegLine(from: TravelPlace, to: TravelPlace): string {
  const d = distanceBetween(from, to);
  return `**${from.name}** → **${to.name}**: ~${d.roadLabel} by road (${d.km.toFixed(0)} km GIS)`;
}

function extractDays(text: string): number {
  const m = text.match(/(\d+)\s*(?:day|days|night|nights)/i);
  if (m) return Math.min(21, Math.max(1, Number(m[1])));
  if (/week/i.test(text)) {
    const w = text.match(/(\d+)\s*week/i);
    return w ? Number(w[1]) * 7 : 7;
  }
  return 7;
}

function isItineraryIntent(text: string): boolean {
  return /\b(itinerary|itineraries|travel plan|trip plan|schedule|road trip|multi.?stop|stops?\b|plan my|plan a|suggest a|what to do|things to do|visit order|route for|days in|week in|golden triangle|trek plan|with budget|including cost)\b/i.test(
    text
  );
}

function isBudgetIntent(text: string): boolean {
  return /\b(budget|cost|spend|expenditure|expense|expensive|how much|price|money|afford|total cost|daily cost|average spend|per day|usd|npr|rupees)\b/i.test(
    text
  );
}

function isTrekTemplate(text: string): boolean {
  return /\b(everest|ebc|namche|lukla|trek)\b/i.test(text.toLowerCase());
}

function appendBudgetSection(
  lines: string[],
  userMessage: string,
  totalDays: number,
  stops: { hub: string; nights: number }[]
): void {
  if (stops.length === 0) return;
  const style = detectTravelStyle(userMessage);
  const estimate = estimateTripBudget({
    totalDays,
    stops,
    style,
    includeTrekExtras: isTrekTemplate(userMessage),
  });
  lines.push("");
  lines.push(formatBudgetMarkdown(estimate));
}

function isPureDistanceIntent(text: string): boolean {
  if (isItineraryIntent(text)) return false;
  return /\b(distance|how far|km|kilometer|miles|between)\b/i.test(text);
}

function pickItineraryTemplate(text: string): RouteStopTemplate[] {
  const lower = text.toLowerCase();
  if (/\b(everest|ebc|namche|lukla|trek)\b/.test(lower)) return EVEREST_ITINERARY;
  if (/\b(lumbini|buddha|cultural|heritage|pilgrimage)\b/.test(lower))
    return CULTURAL_ITINERARY;
  return CLASSIC_ITINERARY;
}

function hubPlace(hub: string, places: TravelPlace[]): TravelPlace {
  return (
    findPlace(hub, places) ?? {
      id: `hub-${hub}`,
      name: hub,
      district: hub,
      ...coordsForDistrict(hub),
      kind: "district" as const,
    }
  );
}

function topHotelsInDistrict(
  district: string,
  registered: RegisteredHotelMarker[],
  userMessage: string,
  limit = 2
): string {
  const recs = recommendHotelsForDistrict(
    district,
    registered,
    detectTravelStyle(userMessage),
    limit
  );
  if (recs.length === 0) return "";
  return recs
    .map(
      (r) =>
        `${r.name} (★${r.rating.toFixed(1)}${r.source === "partner" ? ", StayNEP" : ""})`
    )
    .join(", ");
}

function appendHotelRecommendations(
  lines: string[],
  districts: string[],
  registered: RegisteredHotelMarker[],
  userMessage: string
): void {
  const recs = recommendHotelsForTrip(districts, registered, userMessage);
  if (recs.length === 0) return;
  lines.push("");
  lines.push(formatHotelRecommendationsMarkdown(recs));
}

function buildItineraryReply(
  userMessage: string,
  places: TravelPlace[],
  registered: RegisteredHotelMarker[]
): string {
  const totalDays = extractDays(userMessage);
  const template = pickItineraryTemplate(userMessage);
  const hubs = template.map((t) => hubPlace(t.hub, places));

  const lines: string[] = [
    `### ${totalDays}-day Nepal travel plan`,
    `_Tailored from StayNEP’s destination data — adjust pace to your fitness and season._`,
    "",
  ];

  let day = 1;
  const daysPerHub = Math.max(
    1,
    Math.floor(totalDays / template.length)
  );
  const budgetStops: { hub: string; nights: number }[] = [];

  for (let i = 0; i < template.length; i++) {
    const stop = template[i];
    const nights = Math.max(stop.minDays, daysPerHub);
    const hub = hubs[i];
    budgetStops.push({ hub: stop.hub, nights });

    lines.push(`#### Days ${day}–${day + nights - 1}: **${stop.hub}**`);
    lines.push(`**Highlights**`);
    for (const h of stop.highlights) {
      lines.push(`- ${h}`);
    }
    const hotelTip = topHotelsInDistrict(stop.hub, registered, userMessage);
    if (hotelTip) lines.push(`**Stay ideas:** ${hotelTip}`);
    lines.push(`**Tip:** ${stop.stayTip}`);
    lines.push("");

    day += nights;

    if (i < template.length - 1) {
      lines.push(roadLegLine(hub, hubs[i + 1]));
      lines.push("");
    }
  }

  lines.push("#### Practical notes");
  lines.push("- Domestic flights: Kathmandu ↔ Pokhara save time vs long bus rides.");
  lines.push("- Spring (Mar–May) and autumn (Oct–Nov) are peak trekking/view seasons.");
  lines.push("- Book Chitwan safaris and popular lodges early in peak season.");
  lines.push("- Use **Search hotels** on this portal for StayNEP partners with live availability.");

  appendBudgetSection(lines, userMessage, totalDays, budgetStops);
  appendHotelRecommendations(
    lines,
    template.map((t) => t.hub),
    registered,
    userMessage
  );

  lines.push("");
  lines.push(
    "_Want different hotels? Say “recommend luxury hotels in Pokhara” or use **Search hotels** on the portal._"
  );

  return lines.join("\n");
}

function extractOrderedStops(
  text: string,
  places: TravelPlace[]
): TravelPlace[] {
  const lower = text.toLowerCase();
  const candidates: { index: number; place: TravelPlace }[] = [];

  const hubNames = [
    "Kathmandu",
    "Pokhara",
    "Chitwan",
    "Lumbini",
    "Bhaktapur",
    "Nagarkot",
    "Bandipur",
    "Namche",
    "Everest",
    "Pashupatinath",
    "Boudhanath",
    ...attractions.map((a) => a.name),
    ...hotels.map((h) => h.district),
  ];

  for (const name of hubNames) {
    const idx = lower.indexOf(name.toLowerCase());
    if (idx >= 0) {
      const place = findPlace(name, places);
      if (place && !candidates.some((c) => c.place.id === place.id)) {
        candidates.push({ index: idx, place });
      }
    }
  }

  return candidates.sort((a, b) => a.index - b.index).map((c) => c.place);
}

function buildMultiStopReply(
  userMessage: string,
  places: TravelPlace[],
  registered: RegisteredHotelMarker[]
): string | null {
  const stops = extractOrderedStops(userMessage, places);
  if (stops.length < 2) return null;

  const lines: string[] = [
    "### Your multi-stop route",
    "",
  ];

  let totalRoad = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    const leg = distanceBetween(stops[i], stops[i + 1]);
    totalRoad += leg.roadKm;
    lines.push(
      `${i + 1}. **${stops[i].name}** → **${stops[i + 1].name}** — ~${leg.roadLabel} road (${leg.km.toFixed(0)} km GIS)`
    );
  }

  lines.push("");
  lines.push(
    `**Total leg distance (estimate):** ~${formatDistanceKm(totalRoad)} driving/trekking mix`
  );
  lines.push("");
  lines.push("**Suggested pacing**");
  const budgetStops: { hub: string; nights: number }[] = [];
  for (let i = 0; i < stops.length; i++) {
    const nights = 2;
    budgetStops.push({
      hub: stops[i].district || stops[i].name,
      nights,
    });
    const attr = attractions.find((a) =>
      normalize(a.name).includes(normalize(stops[i].name))
    );
    const districtHotels = topHotelsInDistrict(
      stops[i].district || stops[i].name,
      registered,
      userMessage
    );
    lines.push(
      `- **Stop ${i + 1}: ${stops[i].name}** — allow ${nights} nights` +
        (attr ? ` · see ${attr.name}` : "") +
        (districtHotels ? ` · hotels: ${districtHotels}` : "")
    );
  }

  const totalDays = Math.max(
    extractDays(userMessage),
    budgetStops.reduce((s, x) => s + x.nights, 0)
  );
  appendBudgetSection(lines, userMessage, totalDays, budgetStops);
  appendHotelRecommendations(
    lines,
    stops.map((s) => s.district || s.name),
    registered,
    userMessage
  );

  return lines.join("\n");
}

function buildHotelRecommendReply(
  userMessage: string,
  registered: RegisteredHotelMarker[]
): string | null {
  const districts = [
    "Kathmandu",
    "Pokhara",
    "Chitwan",
    "Lumbini",
    "Bhaktapur",
    "Namche",
  ];
  const mentioned = districts.filter((d) =>
    userMessage.toLowerCase().includes(d.toLowerCase())
  );
  const targets = mentioned.length > 0 ? mentioned : ["Kathmandu", "Pokhara"];
  const recs = recommendHotelsForTrip(targets, registered, userMessage);

  if (recs.length === 0) return null;

  const style = detectTravelStyle(userMessage);
  return (
    `### Hotel recommendations (${style})\n\n` +
    formatHotelRecommendationsMarkdown(recs) +
    "\n\n_Ask for a full itinerary with these areas, or say **book [hotel name]** to reserve a StayNEP partner._"
  );
}

function buildBudgetOnlyReply(userMessage: string): string {
  const totalDays = extractDays(userMessage);
  const template = pickItineraryTemplate(userMessage);
  const style = detectTravelStyle(userMessage);
  const daysPerHub = Math.max(1, Math.floor(totalDays / template.length));
  const stops = template.map((t) => ({
    hub: t.hub,
    nights: Math.max(t.minDays, daysPerHub),
  }));

  const estimate = estimateTripBudget({
    totalDays,
    stops,
    style,
    includeTrekExtras: isTrekTemplate(userMessage),
  });

  return (
    `### ${totalDays}-day Nepal trip — cost overview\n\n` +
    formatBudgetMarkdown(estimate) +
    "\n\n_Ask for a full day-by-day itinerary with activities and distances._"
  );
}

function extractTwoPlaces(
  text: string,
  places: TravelPlace[]
): { from: TravelPlace; to: TravelPlace } | null {
  const patterns = [
    /(?:distance|far|km|kilometer[s]?)\s+(?:from|between)\s+(.+?)\s+(?:to|and|→)\s+(.+?)(?:\?|$)/i,
    /how far\s+(?:is\s+)?(.+?)\s+from\s+(.+?)(?:\?|$)/i,
    /(.+?)\s+to\s+(.+?)\s+distance/i,
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1] && m?.[2]) {
      const from = findPlace(m[1].trim(), places);
      const to = findPlace(m[2].trim(), places);
      if (from && to) return { from, to };
    }
  }

  return null;
}

export function tryAnswerDistance(
  userMessage: string,
  places: TravelPlace[]
): string | null {
  const pair = extractTwoPlaces(userMessage, places);
  if (!pair) return null;

  const d = distanceBetween(pair.from, pair.to);

  return (
    `**${pair.from.name}** → **${pair.to.name}**\n\n` +
    `• Straight-line (GIS): **${d.label}** (${d.km.toFixed(1)} km)\n` +
    `• Estimated road: **~${d.roadLabel}** (${d.roadKm.toFixed(1)} km)\n\n` +
    `_Mountain roads are often 1.2–1.4× longer than straight-line._`
  );
}

function attractionsContext(): string {
  return attractions
    .map(
      (a) =>
        `- ${a.name} (${a.category}, ${a.district}): ${a.description.slice(0, 120)}…`
    )
    .join("\n");
}

function hotelsContext(registered: RegisteredHotelMarker[]): string {
  const top = [...hotels]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12)
    .map((h) => `- ${h.name}, ${h.district} (★${h.rating} Google-style)`);
  const partners = registered
    .slice(0, 8)
    .map(
      (r) =>
        `- ${r.name}, ${r.district} (StayNEP partner${r.avgRating ? `, ★${r.avgRating}` : ""})`
    );
  return [...top, ...partners].join("\n");
}

function buildSystemPrompt(
  places: TravelPlace[],
  travelerName: string,
  registered: RegisteredHotelMarker[]
): string {
  const placeLines = places
    .slice(0, 100)
    .map(
      (p) =>
        `- ${p.name} (${p.kind}, ${p.district}): ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`
    )
    .join("\n");

  return `You are **StayNEP Travel AI**, a full Nepal travel planner for tourists. Traveler: ${travelerName}.

You answer EVERYTHING related to Nepal travel, including:
- **Itineraries** (1–21 days): day-by-day plans with morning/afternoon/evening ideas
- **Multi-stop routes**: order of cities, nights per stop, transport between stops
- **Distances & transport**: km (GIS straight-line), road estimates (~1.25–1.35× in hills), flights vs bus
- **Hotels & stays**: ALWAYS recommend specific hotels from the database below when planning trips or when asked where to stay. Prefer **PARTNER** (StayNEP) properties when the traveler may book. Include star rating, district, price band, and availability when known.
- **Trekking** (EBC, ABC, Langtang): acclimatization, typical days, packing tips
- **Budget & expenditure**: ALWAYS include a cost section for itineraries — daily average and trip total in **NPR and USD**, broken down by lodging, food, transport, activities (use benchmarks below; adjust for budget/mid/comfort if user specifies)
- **Food, culture, safety**, visas, insurance, seasons (Mar–May, Oct–Nov)

**Format rules:**
- Use markdown: ### headings, **bold**, bullet lists, tables for budgets
- Be specific to Nepal; use real place names from the data below
- For itineraries: Day N, location, activities, transport, stays, then **### Recommended hotels** (3–6 picks), then **### Estimated tourist expenditure**
- For distances: GIS km + estimated road km
- Answer general travel questions (weather, what to pack, SIM cards, tipping) like a knowledgeable local guide
- End with 1–2 follow-up questions
- Be thorough (300–700 words for full trip plans)

${budgetBenchmarksText()}

**Classic routes you know well:**
1. Kathmandu (2–3d) → Chitwan (2d) → Pokhara (2–3d) — golden triangle
2. Kathmandu → Lukla → Namche → EBC trek
3. Kathmandu Valley heritage → Lumbini → Pokhara
4. Pokhara + Annapurna side trips

**Attractions database:**
${attractionsContext()}

**Hotels database (PARTNER = bookable on StayNEP, CATALOG = reference listing):**
${hotelsContextForAi(registered)}

**Places index (coordinates for distance math):**
${placeLines}`;
}

function tryStructuredReply(
  userMessage: string,
  places: TravelPlace[],
  registered: RegisteredHotelMarker[]
): string | null {
  if (isHotelRecommendIntent(userMessage) && !isItineraryIntent(userMessage)) {
    const hotelReply = buildHotelRecommendReply(userMessage, registered);
    if (hotelReply) return hotelReply;
  }

  if (
    isBudgetIntent(userMessage) &&
    !isPureDistanceIntent(userMessage) &&
    !isItineraryIntent(userMessage) &&
    (/\b(\d+)\s*day|\bweek\b/i.test(userMessage) || /\bhow much\b/i.test(userMessage))
  ) {
    return buildBudgetOnlyReply(userMessage);
  }

  if (isItineraryIntent(userMessage)) {
    const multi = buildMultiStopReply(userMessage, places, registered);
    if (multi && extractOrderedStops(userMessage, places).length >= 3) {
      return multi;
    }
    return buildItineraryReply(userMessage, places, registered);
  }

  if (/\b(stops?|route|via|then|after that)\b/i.test(userMessage)) {
    const multi = buildMultiStopReply(userMessage, places, registered);
    if (multi) return multi;
  }

  if (isPureDistanceIntent(userMessage)) {
    return tryAnswerDistance(userMessage, places);
  }

  return null;
}

export async function runTravelChatTurn(
  messages: TravelChatMessage[],
  options: {
    travelerName: string;
    registeredHotels?: RegisteredHotelMarker[];
  }
): Promise<{ reply: string }> {
  try {
    const places = buildTravelPlacesIndex(options.registeredHotels ?? []);
    const registered = options.registeredHotels ?? [];
    const lastUser = [...messages].reverse().find((m) => m.role === "user");

    const geminiMessages: GeminiChatMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const system = buildSystemPrompt(places, options.travelerName, registered);

    const gemini = await generateGeminiText(system, geminiMessages, {
      maxOutputTokens: 2048,
      temperature: 0.55,
    });

    if (gemini) {
      return { reply: gemini };
    }

    if (lastUser) {
      const fallback = tryStructuredReply(
        lastUser.content,
        places,
        registered
      );
      if (fallback) return { reply: fallback };
    }

    return {
      reply:
        "**StayNEP Travel AI** — itineraries, **hotel picks**, budgets & distances.\n\nTry:\n" +
        '- *"Recommend hotels in Pokhara for 3 nights mid-range"*\n' +
        '- *"7-day itinerary Kathmandu Chitwan Pokhara with hotels and budget"*\n' +
        '- *"Best StayNEP partner hotels in Kathmandu"*',
    };
  } catch (e) {
    console.error("[travel-ai]", e);
    return {
      reply:
        "Something went wrong while planning. Please try again, or ask: " +
        '*"7-day itinerary with average expenditure"*',
    };
  }
}

export const TRAVEL_AI_SUGGESTIONS = [
  "Recommend hotels in Pokhara mid-range",
  "7-day itinerary with hotels and budget",
  "Best StayNEP hotels in Kathmandu",
  "Plan stops: Kathmandu → Pokhara → Chitwan",
  "Luxury hotels near Chitwan safari",
];
