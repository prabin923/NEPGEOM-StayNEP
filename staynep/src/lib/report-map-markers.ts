import type { ReportCategory, ReportSeverity } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { coordsForDistrict } from "@/lib/nepal-districts";

export interface ReportMapMarker {
  id: string;
  title: string;
  category: ReportCategory;
  severity: ReportSeverity;
  isEmergency: boolean;
  status: string;
  district: string | null;
  lat: number;
  lng: number;
}

function coordsForReport(report: {
  latitude: number | null;
  longitude: number | null;
  district: string | null;
}): { lat: number; lng: number } | null {
  if (
    report.latitude != null &&
    report.longitude != null &&
    Number.isFinite(report.latitude) &&
    Number.isFinite(report.longitude)
  ) {
    return { lat: report.latitude, lng: report.longitude };
  }
  if (report.district?.trim()) {
    return coordsForDistrict(report.district);
  }
  return null;
}

export async function fetchOpenReportMarkers(): Promise<ReportMapMarker[]> {
  const reports = await prisma.touristReport.findMany({
    where: { status: { notIn: ["RESOLVED", "DISMISSED"] } },
    select: {
      id: true,
      title: true,
      category: true,
      severity: true,
      isEmergency: true,
      status: true,
      district: true,
      latitude: true,
      longitude: true,
    },
    orderBy: [{ isEmergency: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  const markers: ReportMapMarker[] = [];
  for (const r of reports) {
    const coords = coordsForReport(r);
    if (!coords) continue;
    markers.push({
      id: r.id,
      title: r.title,
      category: r.category,
      severity: r.severity,
      isEmergency: r.isEmergency,
      status: r.status,
      district: r.district,
      lat: coords.lat,
      lng: coords.lng,
    });
  }
  return markers;
}
