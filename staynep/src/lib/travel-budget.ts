/** Tourist expenditure estimates for Nepal (NPR; demo planning benchmarks). */

export type TravelStyle = "budget" | "mid" | "comfort";

export type BudgetLine = {
  label: string;
  amountNpr: number;
  note?: string;
};

export type TripBudgetEstimate = {
  style: TravelStyle;
  totalDays: number;
  lines: BudgetLine[];
  totalNpr: number;
  perPersonPerDayNpr: number;
  totalUsd: number;
  perPersonPerDayUsd: number;
};

const NPR_PER_USD = 135;

const STYLE_LABEL: Record<TravelStyle, string> = {
  budget: "Budget (hostels, local buses, simple meals)",
  mid: "Mid-range (3★ hotels, mix of bus & flights)",
  comfort: "Comfort (4★+ hotels, private transfers, tours)",
};

/** Average daily spend per person by hub (NPR). */
const HUB_DAILY_NPR: Record<
  string,
  Record<TravelStyle, number>
> = {
  Kathmandu: { budget: 4200, mid: 9500, comfort: 19000 },
  "Kathmandu Valley": { budget: 4200, mid: 9500, comfort: 19000 },
  Chitwan: { budget: 5500, mid: 13000, comfort: 24000 },
  Pokhara: { budget: 4800, mid: 11000, comfort: 21000 },
  Lumbini: { budget: 4000, mid: 8500, comfort: 16000 },
  Namche: { budget: 5500, mid: 7500, comfort: 12000 },
  "Namche / Everest region": { budget: 5500, mid: 7500, comfort: 12000 },
  Bhaktapur: { budget: 3800, mid: 8000, comfort: 15000 },
  Bandipur: { budget: 3500, mid: 7500, comfort: 14000 },
  Nagarkot: { budget: 4000, mid: 9000, comfort: 17000 },
};

const DEFAULT_DAILY: Record<TravelStyle, number> = {
  budget: 4500,
  mid: 10000,
  comfort: 20000,
};

/** One-off extras per hub (safari, permits) — mid style NPR. */
const HUB_ACTIVITY_NPR: Record<string, number> = {
  Chitwan: 9000,
  "Namche / Everest region": 15000,
  Namche: 15000,
};

/** Inter-city transport per leg, per person (mid). */
const LEG_TRANSPORT_NPR: Record<string, number> = {
  "Kathmandu|Chitwan": 2800,
  "Chitwan|Kathmandu": 2800,
  "Kathmandu|Pokhara": 10000,
  "Pokhara|Kathmandu": 10000,
  "Chitwan|Pokhara": 2400,
  "Pokhara|Chitwan": 2400,
  "Kathmandu|Lumbini": 3500,
  "Lumbini|Kathmandu": 3500,
  "Pokhara|Lumbini": 3200,
};

const TREK_FIXED_NPR = {
  luklaFlightsMid: 42000,
  permitsMid: 5000,
  gearBufferMid: 8000,
};

export function detectTravelStyle(text: string): TravelStyle {
  const lower = text.toLowerCase();
  if (/\b(luxury|premium|comfort|5\s*star|high\s*end|splurge)\b/.test(lower))
    return "comfort";
  if (/\b(budget|cheap|backpack|low\s*cost|affordable)\b/.test(lower))
    return "budget";
  return "mid";
}

function hubDailyNpr(hub: string, style: TravelStyle): number {
  const key = Object.keys(HUB_DAILY_NPR).find(
    (k) =>
      hub.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(hub.toLowerCase())
  );
  if (key) return HUB_DAILY_NPR[key][style];
  return DEFAULT_DAILY[style];
}

function legTransportNpr(from: string, to: string, style: TravelStyle): number {
  const key1 = `${from}|${to}`;
  const key2 = `${to}|${from}`;
  const base = LEG_TRANSPORT_NPR[key1] ?? LEG_TRANSPORT_NPR[key2];
  if (!base) return style === "budget" ? 2000 : style === "comfort" ? 14000 : 6000;
  if (style === "budget") return Math.round(base * 0.55);
  if (style === "comfort") return Math.round(base * 1.6);
  return base;
}

function formatNpr(n: number): string {
  return `NPR ${n.toLocaleString("en-NP")}`;
}

function formatUsd(n: number): string {
  return `~$${Math.round(n).toLocaleString("en-US")}`;
}

export function estimateTripBudget(params: {
  totalDays: number;
  stops: { hub: string; nights: number }[];
  style: TravelStyle;
  includeTrekExtras?: boolean;
}): TripBudgetEstimate {
  const { totalDays, stops, style, includeTrekExtras } = params;
  const lines: BudgetLine[] = [];

  for (const stop of stops) {
    const daily = hubDailyNpr(stop.hub, style);
    const subtotal = daily * stop.nights;
    lines.push({
      label: `${stop.hub} (${stop.nights} night${stop.nights > 1 ? "s" : ""})`,
      amountNpr: subtotal,
      note: `${formatNpr(daily)}/day · lodging, food, local transport`,
    });
    const activity = HUB_ACTIVITY_NPR[stop.hub];
    if (activity) {
      const actAmt =
        style === "budget"
          ? Math.round(activity * 0.7)
          : style === "comfort"
            ? Math.round(activity * 1.4)
            : activity;
      lines.push({
        label: `${stop.hub} activities`,
        amountNpr: actAmt,
        note: "e.g. safari, park fees, guides",
      });
    }
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i].hub;
    const to = stops[i + 1].hub;
    const amt = legTransportNpr(from, to, style);
    lines.push({
      label: `Transport: ${from} → ${to}`,
      amountNpr: amt,
      note: style === "mid" ? "bus or short flight mix" : undefined,
    });
  }

  if (includeTrekExtras) {
    const mult = style === "budget" ? 0.85 : style === "comfort" ? 1.25 : 1;
    lines.push({
      label: "Everest region trek extras",
      amountNpr: Math.round(
        (TREK_FIXED_NPR.luklaFlightsMid +
          TREK_FIXED_NPR.permitsMid +
          TREK_FIXED_NPR.gearBufferMid) *
          mult
      ),
      note: "Lukla flights, permits, gear",
    });
  }

  lines.push({
    label: "Miscellaneous buffer (10%)",
    amountNpr: 0,
    note: "calculated below",
  });

  const subtotal = lines
    .filter((l) => !l.label.includes("Miscellaneous"))
    .reduce((s, l) => s + l.amountNpr, 0);
  const buffer = Math.round(subtotal * 0.1);
  const bufferLine = lines.find((l) => l.label.includes("Miscellaneous"));
  if (bufferLine) bufferLine.amountNpr = buffer;

  const totalNpr = subtotal + buffer;
  const perPersonPerDayNpr = Math.round(totalNpr / Math.max(1, totalDays));
  const totalUsd = totalNpr / NPR_PER_USD;
  const perPersonPerDayUsd = perPersonPerDayNpr / NPR_PER_USD;

  return {
    style,
    totalDays,
    lines,
    totalNpr,
    perPersonPerDayNpr,
    totalUsd,
    perPersonPerDayUsd,
  };
}

export function formatBudgetMarkdown(estimate: TripBudgetEstimate): string {
  const lines: string[] = [
    "### Estimated tourist expenditure (per person)",
    `**Style:** ${STYLE_LABEL[estimate.style]}`,
    "",
    "| Item | Amount |",
    "|------|--------|",
  ];

  for (const line of estimate.lines) {
    const note = line.note ? ` _(${line.note})_` : "";
    lines.push(`| ${line.label} | **${formatNpr(line.amountNpr)}** |${note}`);
  }

  lines.push(
    `| **Trip total** | **${formatNpr(estimate.totalNpr)}** (${formatUsd(estimate.totalUsd)}) |`,
    `| **Average per day** | **${formatNpr(estimate.perPersonPerDayNpr)}/day** (${formatUsd(estimate.perPersonPerDayUsd)}/day) |`,
    "",
    "_Indicative averages for international tourists; flights to/from Nepal, visas, and travel insurance are extra. Peak season (Oct–Nov) can run 15–25% higher._"
  );

  return lines.join("\n");
}

export function budgetBenchmarksText(): string {
  return `**Nepal tourist daily averages (per person, 2025 benchmarks):**
- Budget: ${formatNpr(DEFAULT_DAILY.budget)}/day (${formatUsd(DEFAULT_DAILY.budget / NPR_PER_USD)}/day)
- Mid-range: ${formatNpr(DEFAULT_DAILY.mid)}/day (${formatUsd(DEFAULT_DAILY.mid / NPR_PER_USD)}/day)
- Comfort: ${formatNpr(DEFAULT_DAILY.comfort)}/day (${formatUsd(DEFAULT_DAILY.comfort / NPR_PER_USD)}/day)
Chitwan safaris add ~${formatNpr(9000)}–${formatNpr(15000)}. Everest trek: Lukla flights ~${formatNpr(42000)} + permits ~${formatNpr(5000)} mid-range.`;
}
