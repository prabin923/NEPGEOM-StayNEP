import type {
  ReportCategory,
  ReportSeverity,
  ReportStatus,
  TouristReport,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  SAFETY: "Safety & security",
  SCAM: "Scam / fraud",
  HOTEL: "Hotel / accommodation",
  TRANSPORT: "Transport",
  HEALTH: "Health / medical",
  OTHER: "Other",
};

export const REPORT_SEVERITY_LABELS: Record<ReportSeverity, string> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: "open",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in progress",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
};

export type TouristReportWithReporter = TouristReport & {
  reporter: { name: string; email: string };
  property: { name: string } | null;
};

export function isOpenStatus(status: ReportStatus) {
  return status !== "RESOLVED" && status !== "DISMISSED";
}

export async function fetchTouristReports(options?: {
  openOnly?: boolean;
  limit?: number;
}) {
  return prisma.touristReport.findMany({
    where: options?.openOnly
      ? { status: { notIn: ["RESOLVED", "DISMISSED"] } }
      : undefined,
    include: {
      reporter: { select: { name: true, email: true } },
      property: { select: { name: true } },
    },
    orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
    take: options?.limit,
  });
}

export async function fetchReportsForReporter(userId: string) {
  return prisma.touristReport.findMany({
    where: { reporterId: userId },
    include: { property: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export interface AuthorityLiveStats {
  travelersOnMap: number;
  registeredHotels: number;
  openReports: number;
  criticalOpen: number;
  resolvedThisMonth: number;
  avgResolutionHours: number | null;
}

export async function fetchAuthorityLiveStats(
  travelersOnMap: number,
  registeredHotels: number
): Promise<AuthorityLiveStats> {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [openReports, criticalOpen, resolvedThisMonth] = await Promise.all([
    prisma.touristReport.count({
      where: { status: { notIn: ["RESOLVED", "DISMISSED"] } },
    }),
    prisma.touristReport.count({
      where: {
        status: { notIn: ["RESOLVED", "DISMISSED"] },
        severity: { in: ["HIGH", "CRITICAL"] },
      },
    }),
    prisma.touristReport.findMany({
      where: {
        status: "RESOLVED",
        resolvedAt: { gte: monthStart },
      },
      select: { createdAt: true, resolvedAt: true },
    }),
  ]);

  let avgResolutionHours: number | null = null;
  if (resolvedThisMonth.length > 0) {
    const totalMs = resolvedThisMonth.reduce((sum, r) => {
      if (!r.resolvedAt) return sum;
      return sum + (r.resolvedAt.getTime() - r.createdAt.getTime());
    }, 0);
    avgResolutionHours = Math.round(
      totalMs / resolvedThisMonth.length / (1000 * 60 * 60)
    );
  }

  return {
    travelersOnMap,
    registeredHotels,
    openReports,
    criticalOpen,
    resolvedThisMonth: resolvedThisMonth.length,
    avgResolutionHours,
  };
}

export interface TransparencySnapshot {
  openCount: number;
  resolvedCount: number;
  byCategory: { category: ReportCategory; count: number }[];
  byDistrict: { district: string; count: number }[];
  avgResolutionHours: number | null;
}

function emptyTransparencySnapshot(): TransparencySnapshot {
  return {
    openCount: 0,
    resolvedCount: 0,
    byCategory: [],
    byDistrict: [],
    avgResolutionHours: null,
  };
}

export async function fetchTransparencySnapshot(): Promise<TransparencySnapshot> {
  if (!process.env.DATABASE_URL) {
    return emptyTransparencySnapshot();
  }

  try {
    return await loadTransparencySnapshot();
  } catch (e) {
    console.error("[fetchTransparencySnapshot]", e);
    return emptyTransparencySnapshot();
  }
}

async function loadTransparencySnapshot(): Promise<TransparencySnapshot> {
  const [openCount, resolvedCount, allResolved, openByCategory, openReports] =
    await Promise.all([
      prisma.touristReport.count({
        where: { status: { notIn: ["RESOLVED", "DISMISSED"] } },
      }),
      prisma.touristReport.count({ where: { status: "RESOLVED" } }),
      prisma.touristReport.findMany({
        where: { status: "RESOLVED", resolvedAt: { not: null } },
        select: { createdAt: true, resolvedAt: true },
      }),
      prisma.touristReport.groupBy({
        by: ["category"],
        where: { status: { notIn: ["RESOLVED", "DISMISSED"] } },
        _count: true,
      }),
      prisma.touristReport.findMany({
        where: { status: { notIn: ["RESOLVED", "DISMISSED"] } },
        select: { district: true },
      }),
    ]);

  const districtMap = new Map<string, number>();
  for (const r of openReports) {
    const d = r.district?.trim() || "Unspecified";
    districtMap.set(d, (districtMap.get(d) ?? 0) + 1);
  }

  let avgResolutionHours: number | null = null;
  if (allResolved.length > 0) {
    const totalMs = allResolved.reduce((sum, r) => {
      if (!r.resolvedAt) return sum;
      return sum + (r.resolvedAt.getTime() - r.createdAt.getTime());
    }, 0);
    avgResolutionHours = Math.round(
      totalMs / allResolved.length / (1000 * 60 * 60)
    );
  }

  return {
    openCount,
    resolvedCount,
    byCategory: openByCategory.map((row) => ({
      category: row.category,
      count: row._count,
    })),
    byDistrict: Array.from(districtMap.entries())
      .map(([district, count]) => ({ district, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    avgResolutionHours,
  };
}

export function inferDistrictFromCoords(
  lat: number | null,
  lng: number | null,
  label: string | null
): string {
  if (label) {
    const parts = label.split(",");
    if (parts.length > 0) return parts[parts.length - 1].trim();
  }
  if (lat != null && lng != null) {
    if (lat > 28 && lng < 84.5) return "Gandaki";
    if (lat > 27.4 && lat < 27.9 && lng > 85 && lng < 85.5) return "Bagmati";
    if (lat < 27.6 && lng > 84 && lng < 84.6) return "Chitwan";
  }
  return "Nepal";
}
