"use server";

import type { ReportCategory, ReportSeverity, ReportStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isWithinNepal } from "@/lib/traveler-locations";
import {
  inferDistrictFromCoords,
  REPORT_CATEGORY_LABELS,
} from "@/lib/tourist-reports";
import { revalidateTourismPortals } from "@/lib/revalidate-app";

export type ReportActionState = {
  error?: string;
  success?: boolean;
  reportId?: string;
};

async function requireTraveler() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TRAVELER") {
    return { error: "Unauthorized" as const, userId: null };
  }
  return { error: null, userId: session.user.id };
}

async function requireAuthority() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "AUTHORITIES") {
    return { error: "Unauthorized" as const, userId: null };
  }
  return { error: null, userId: session.user.id };
}

export async function createTouristReport(
  _prev: ReportActionState,
  formData: FormData
): Promise<ReportActionState> {
  const ctx = await requireTraveler();
  if (ctx.error || !ctx.userId) return { error: ctx.error ?? "Unauthorized" };

  const category = String(formData.get("category") ?? "") as ReportCategory;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isEmergency = formData.get("isEmergency") === "on";
  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const latRaw = String(formData.get("latitude") ?? "").trim();
  const lngRaw = String(formData.get("longitude") ?? "").trim();
  const locationLabel = String(formData.get("locationLabel") ?? "").trim();

  const validCategories = Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[];
  if (!validCategories.includes(category)) {
    return { error: "Select a valid category." };
  }
  if (!title || title.length < 5) {
    return { error: "Title must be at least 5 characters." };
  }
  if (!description || description.length < 20) {
    return { error: "Please describe the issue (at least 20 characters)." };
  }

  let latitude: number | null = null;
  let longitude: number | null = null;
  if (latRaw && lngRaw) {
    latitude = Number(latRaw);
    longitude = Number(lngRaw);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return { error: "Invalid location coordinates." };
    }
    if (!isWithinNepal(latitude, longitude)) {
      return { error: "Location must be within Nepal." };
    }
  }

  if (propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });
    if (!property) return { error: "Selected hotel not found." };
  }

  const severity: ReportSeverity = isEmergency
    ? "CRITICAL"
    : category === "SAFETY" || category === "HEALTH"
      ? "HIGH"
      : "MEDIUM";

  const district = inferDistrictFromCoords(latitude, longitude, locationLabel || null);

  const report = await prisma.touristReport.create({
    data: {
      reporterId: ctx.userId,
      propertyId: propertyId || null,
      category,
      severity,
      isEmergency,
      title,
      description,
      latitude,
      longitude,
      locationLabel: locationLabel || null,
      district,
    },
  });

  if (isEmergency && propertyId) {
    await prisma.notification.upsert({
      where: { sourceKey: `emergency-report:${report.id}` },
      create: {
        propertyId,
        sourceKey: `emergency-report:${report.id}`,
        title: "Emergency tourist report",
        message: `${title} — authorities and your team have been alerted via StayNEP.`,
      },
      update: {
        title: "Emergency tourist report",
        message: `${title} — authorities and your team have been alerted via StayNEP.`,
        read: false,
      },
    });
  }

  revalidateTourismPortals();
  return { success: true, reportId: report.id };
}

export async function updateTouristReport(
  _prev: ReportActionState,
  formData: FormData
): Promise<ReportActionState> {
  const ctx = await requireAuthority();
  if (ctx.error) return { error: ctx.error };

  const reportId = String(formData.get("reportId") ?? "");
  const status = String(formData.get("status") ?? "") as ReportStatus;
  const severity = String(formData.get("severity") ?? "") as ReportSeverity;
  const assignedAgency = String(formData.get("assignedAgency") ?? "").trim();
  const resolutionNote = String(formData.get("resolutionNote") ?? "").trim();

  const report = await prisma.touristReport.findUnique({ where: { id: reportId } });
  if (!report) return { error: "Report not found." };

  const validStatuses: ReportStatus[] = [
    "OPEN",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "DISMISSED",
  ];
  const validSeverities: ReportSeverity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  if (!validStatuses.includes(status)) return { error: "Invalid status." };
  if (!validSeverities.includes(severity)) return { error: "Invalid severity." };

  const resolvedAt =
    status === "RESOLVED" ? new Date() : status === "OPEN" ? null : report.resolvedAt;

  await prisma.touristReport.update({
    where: { id: reportId },
    data: {
      status,
      severity,
      assignedAgency: assignedAgency || null,
      resolutionNote: resolutionNote || null,
      resolvedAt,
    },
  });

  revalidateTourismPortals();
  return { success: true };
}

export async function updateTouristReportForm(formData: FormData) {
  await updateTouristReport({}, formData);
}
