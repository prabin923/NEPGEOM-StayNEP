import type { ReportMapMarker } from "@/lib/report-map-markers";
import { distanceKm } from "@/lib/geo";

export type TrafficStatus = "clear" | "moderate" | "slow" | "congested";

export interface TrafficCorridor {
  id: string;
  name: string;
  routeLabel: string;
  /** [lat, lng] */
  path: [number, number][];
  status: TrafficStatus;
  delayMin: number;
  distanceKm: number;
  avgSpeedKmh: number;
  updatedAt: string;
  note?: string;
}

const STATUS_COLOR: Record<TrafficStatus, string> = {
  clear: "#22c55e",
  moderate: "#eab308",
  slow: "#f97316",
  congested: "#ef4444",
};

export function trafficStatusColor(status: TrafficStatus): string {
  return STATUS_COLOR[status];
}

/** Major tourist road corridors (approximate waypoints). */
const BASE_CORRIDORS: Omit<
  TrafficCorridor,
  "status" | "delayMin" | "avgSpeedKmh" | "updatedAt" | "note"
>[] = [
  {
    id: "ktm-pokhara",
    name: "Prithvi Highway",
    routeLabel: "Kathmandu → Pokhara",
    distanceKm: 200,
    path: [
      [27.7172, 85.324],
      [27.65, 85.2],
      [27.55, 85.05],
      [27.45, 84.95],
      [27.35, 84.75],
      [28.0, 84.1],
      [28.15, 84.0],
      [28.2096, 83.9856],
    ],
  },
  {
    id: "ktm-chitwan",
    name: "East-West (Naubise–Bharatpur)",
    routeLabel: "Kathmandu → Chitwan",
    distanceKm: 155,
    path: [
      [27.7172, 85.324],
      [27.55, 85.05],
      [27.35, 84.75],
      [27.2, 84.55],
      [27.103, 84.864],
      [27.5291, 84.3542],
    ],
  },
  {
    id: "pokhara-chitwan",
    name: "Prithvi / East-West link",
    routeLabel: "Pokhara → Chitwan",
    distanceKm: 145,
    path: [
      [28.2096, 83.9856],
      [28.0, 84.1],
      [27.55, 84.35],
      [27.5291, 84.3542],
    ],
  },
  {
    id: "ktm-lumbini",
    name: "Mahendra Highway",
    routeLabel: "Kathmandu → Lumbini",
    distanceKm: 280,
    path: [
      [27.7172, 85.324],
      [27.35, 84.75],
      [27.2, 84.55],
      [27.103, 84.864],
      [27.0, 84.2],
      [26.9, 83.9],
      [27.4833, 83.2833],
    ],
  },
  {
    id: "ktm-ring",
    name: "Kathmandu Ring Road",
    routeLabel: "Valley ring circuit",
    distanceKm: 52,
    path: [
      [27.75, 85.28],
      [27.72, 85.38],
      [27.68, 85.35],
      [27.66, 85.28],
      [27.7, 85.22],
      [27.75, 85.28],
    ],
  },
  {
    id: "pokhara-lakeside",
    name: "Lakeside corridor",
    routeLabel: "Pokhara airport → Lakeside",
    distanceKm: 8,
    path: [
      [28.175, 84.0],
      [28.19, 83.98],
      [28.2044, 83.9616],
    ],
  },
];

function minDistanceToPathKm(
  lat: number,
  lng: number,
  path: [number, number][]
): number {
  let min = Infinity;
  for (const [plat, plng] of path) {
    const d = distanceKm(lat, lng, plat, plng);
    if (d < min) min = d;
  }
  return min;
}

function baseStatusFromTime(): TrafficStatus {
  const hour = new Date().getUTCHours() + 5.75; // Nepal UTC+5:45
  const h = ((hour % 24) + 24) % 24;
  if ((h >= 7 && h <= 9) || (h >= 17 && h <= 19)) return "moderate";
  if (h >= 10 && h <= 16) return "clear";
  return "clear";
}

function statusRank(s: TrafficStatus): number {
  return { clear: 0, moderate: 1, slow: 2, congested: 3 }[s];
}

function maxStatus(a: TrafficStatus, b: TrafficStatus): TrafficStatus {
  return statusRank(a) >= statusRank(b) ? a : b;
}

function statusFromReports(
  corridor: (typeof BASE_CORRIDORS)[0],
  reports: ReportMapMarker[]
): { status: TrafficStatus; note?: string } {
  let status: TrafficStatus = "clear";
  let note: string | undefined;
  const nearby = reports.filter((r) => {
    const d = minDistanceToPathKm(r.lat, r.lng, corridor.path);
    return d <= 35;
  });

  for (const r of nearby) {
    if (r.category === "TRANSPORT" || r.isEmergency) {
      const bump: TrafficStatus =
        r.severity === "CRITICAL" || r.isEmergency
          ? "congested"
          : r.severity === "HIGH"
            ? "slow"
            : "moderate";
      status = maxStatus(status, bump);
      if (!note) note = `Affected by open report: ${r.title}`;
    }
  }

  return { status, note };
}

function delayForStatus(status: TrafficStatus, distanceKm: number): number {
  const baseMin = (distanceKm / 45) * 60;
  const factor =
    status === "clear"
      ? 1
      : status === "moderate"
        ? 1.15
        : status === "slow"
          ? 1.35
          : 1.6;
  return Math.round(baseMin * factor - baseMin);
}

function speedForStatus(status: TrafficStatus, distanceKm: number): number {
  const hours =
    (distanceKm / 45) *
    (status === "clear"
      ? 1
      : status === "moderate"
        ? 1.15
        : status === "slow"
          ? 1.35
          : 1.6);
  return Math.round(distanceKm / Math.max(hours, 0.1));
}

export function computeTrafficCorridors(
  reports: ReportMapMarker[] = []
): TrafficCorridor[] {
  const timeBase = baseStatusFromTime();
  const month = new Date().getMonth();
  const monsoon = month >= 5 && month <= 8;

  return BASE_CORRIDORS.map((c) => {
    const fromReports = statusFromReports(c, reports);
    let status = maxStatus(timeBase, fromReports.status);
    if (monsoon && (c.id === "ktm-pokhara" || c.id === "ktm-chitwan")) {
      status = maxStatus(status, "slow");
    }

    const delayMin = delayForStatus(status, c.distanceKm);
    const avgSpeedKmh = speedForStatus(status, c.distanceKm);

    let note = fromReports.note;
    if (!note && status === timeBase && timeBase === "moderate") {
      note = "Typical peak-hour flow on this corridor";
    }
    if (!note && monsoon && status !== "clear") {
      note = "Monsoon season — allow extra time for landslide checks";
    }

    return {
      ...c,
      status,
      delayMin,
      avgSpeedKmh,
      updatedAt: new Date().toISOString(),
      note,
    };
  });
}
