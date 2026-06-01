export type AdvisorySeverity = "info" | "warning" | "critical";
export type AdvisoryCategory = "road" | "weather" | "health" | "safety" | "seasonal" | "event";

export interface TravelAdvisory {
  id: string;
  title: string;
  description: string;
  category: AdvisoryCategory;
  severity: AdvisorySeverity;
  region: string;
  validFrom: string; // ISO date
  validUntil: string | null; // ISO date or null for ongoing
  source: string;
  actionRequired: string;
}

export const travelAdvisories: TravelAdvisory[] = [
  {
    id: "monsoon-2026",
    title: "Monsoon Season Active",
    description: "Heavy rainfall expected across Nepal from June through September. Increased risk of landslides on mountain roads, especially Prithvi Highway and Arniko Highway.",
    category: "weather",
    severity: "warning",
    region: "Nationwide",
    validFrom: "2026-06-01",
    validUntil: "2026-09-30",
    source: "Dept. of Hydrology and Meteorology",
    actionRequired: "Avoid night travel on mountain roads. Check road conditions before departure.",
  },
  {
    id: "prithvi-hwy",
    title: "Prithvi Highway Maintenance",
    description: "Road widening project between Mugling and Narayanghat. Expect delays of 1-2 hours during daytime.",
    category: "road",
    severity: "info",
    region: "Chitwan – Pokhara corridor",
    validFrom: "2026-05-15",
    validUntil: "2026-08-30",
    source: "Dept. of Roads",
    actionRequired: "Plan for extra 1-2 hours travel time. Night buses recommended.",
  },
  {
    id: "altitude-warning",
    title: "Altitude Sickness Advisory",
    description: "Travelers trekking above 3,000m should acclimatize properly. Multiple cases of AMS reported on Annapurna Circuit this season.",
    category: "health",
    severity: "warning",
    region: "Mountain regions (above 3000m)",
    validFrom: "2026-01-01",
    validUntil: null,
    source: "CIWEC Hospital Travel Medicine",
    actionRequired: "Gain no more than 500m elevation per day above 3000m. Carry Diamox as prescribed.",
  },
  {
    id: "kathmandu-air",
    title: "Air Quality Alert — Kathmandu Valley",
    description: "PM2.5 levels frequently exceed safe limits in Kathmandu during dry season. Vulnerable groups should take precautions.",
    category: "health",
    severity: "info",
    region: "Kathmandu Valley",
    validFrom: "2026-01-01",
    validUntil: "2026-04-30",
    source: "US Embassy Air Quality Monitor",
    actionRequired: "Wear N95 masks in heavy traffic areas. Stay in Thamel side streets.",
  },
  {
    id: "dashain-travel",
    title: "Dashain Festival Travel Rush",
    description: "Massive domestic travel surge during Dashain (Oct 2-11). All long-distance buses sell out. Internal flights at peak capacity.",
    category: "event",
    severity: "warning",
    region: "Nationwide",
    validFrom: "2026-09-25",
    validUntil: "2026-10-15",
    source: "Nepal Tourism Board",
    actionRequired: "Book all transport 2-3 weeks early. Many tourist services close during this period.",
  },
  {
    id: "glacier-lake",
    title: "GLOF Risk — Imja Lake",
    description: "Glacial Lake Outburst Flood risk remains elevated for Imja Tsho. Communities downstream have early warning systems in place.",
    category: "safety",
    severity: "critical",
    region: "Everest Region",
    validFrom: "2026-06-01",
    validUntil: "2026-09-30",
    source: "ICIMOD",
    actionRequired: "Stay informed of local alerts if trekking near Dingboche. Follow ranger instructions.",
  },
  {
    id: "sim-registration",
    title: "Tourist SIM Card Registration",
    description: "Nepal requires fingerprint registration for SIM cards. Available at Tribhuvan International Airport and Ncell/NTC outlets.",
    category: "safety",
    severity: "info",
    region: "Nationwide",
    validFrom: "2026-01-01",
    validUntil: null,
    source: "Nepal Telecom Authority",
    actionRequired: "Bring passport + 1 photo. Airport counter is fastest. Takes ~15 minutes.",
  },
  {
    id: "annapurna-permits",
    title: "TIMS Permit Required for Annapurna",
    description: "Solo trekking in Annapurna Conservation Area now requires mandatory guide. TIMS cards available in Pokhara and Kathmandu.",
    category: "safety",
    severity: "info",
    region: "Annapurna Region",
    validFrom: "2026-04-01",
    validUntil: null,
    source: "Nepal Tourism Board",
    actionRequired: "Hire a registered guide. Get TIMS and ACAP permits before starting the trek.",
  },
];

/** Get advisories relevant right now (valid date range includes today). */
export function getActiveAdvisories(): TravelAdvisory[] {
  const today = new Date().toISOString().slice(0, 10);
  return travelAdvisories.filter((a) => {
    if (a.validFrom > today) return false;
    if (a.validUntil && a.validUntil < today) return false;
    return true;
  });
}

/** Get advisories by severity. */
export function getAdvisoriesBySeverity(severity: AdvisorySeverity): TravelAdvisory[] {
  return getActiveAdvisories().filter((a) => a.severity === severity);
}
