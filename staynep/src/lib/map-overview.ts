import { attractions } from "@/data/attractions";
import { emergencyServices } from "@/data/emergency";
import { hotels } from "@/data/hotels";
import {
  mergeHotelLayers,
  type CatalogMapHotel,
  type MapHotelReview,
} from "@/lib/map-hotels";
import { fetchOpenReportMarkers } from "@/lib/report-map-markers";
import { fetchRegisteredHotelMarkers } from "@/lib/registered-hotels";
import { fetchTouristMapMarkers } from "@/lib/traveler-locations";
import { prisma } from "@/lib/prisma";
import {
  computeTrafficCorridors,
  type TrafficCorridor,
} from "@/lib/map-traffic";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import type { ReportMapMarker } from "@/lib/report-map-markers";
import type { TouristMapMarker } from "@/lib/traveler-locations";

export interface MapOverviewSummary {
  catalogHotels: number;
  registeredHotels: number;
  totalHotels: number;
  topRatedCount: number;
  stayNepReviewCount: number;
  attractions: number;
  emergency: number;
  tourists: number;
  openReports: number;
  trafficCorridors: number;
  slowOrCongestedRoutes: number;
  trafficUpdatedAt: string;
  updatedAt: string;
}

export interface MapOverview {
  tourists: TouristMapMarker[];
  catalogHotels: CatalogMapHotel[];
  registeredHotels: RegisteredHotelMarker[];
  recentReviews: MapHotelReview[];
  reports: ReportMapMarker[];
  traffic: TrafficCorridor[];
  summary: MapOverviewSummary;
}

async function fetchRecentReviewsForMap(): Promise<MapHotelReview[]> {
  if (typeof prisma.review?.findMany !== "function") return [];

  try {
    const rows = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 24,
      select: {
        id: true,
        propertyId: true,
        rating: true,
        comment: true,
        createdAt: true,
        property: { select: { name: true, district: true } },
        user: { select: { name: true } },
      },
    });

    return rows.map((r) => ({
      id: r.id,
      propertyId: r.propertyId,
      propertyName: r.property.name,
      district: r.property.district,
      rating: r.rating,
      comment: r.comment,
      authorName: r.user.name ?? "Traveler",
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (e) {
    console.warn("[fetchRecentReviewsForMap]", e);
    return [];
  }
}

const MIN_TOP_RATING = 4;

export function countTopRatedHotels(
  registered: RegisteredHotelMarker[]
): number {
  const catalogTop = hotels.filter((h) => h.rating >= MIN_TOP_RATING).length;
  const regTop = registered.filter(
    (h) => h.avgRating !== undefined && h.avgRating >= MIN_TOP_RATING
  ).length;
  return catalogTop + regTop;
}

export async function fetchMapOverview(): Promise<MapOverview> {
  const [tourists, registeredHotels, reports, recentReviews] = await Promise.all([
    fetchTouristMapMarkers(),
    fetchRegisteredHotelMarkers(),
    fetchOpenReportMarkers(),
    fetchRecentReviewsForMap(),
  ]);

  const traffic = computeTrafficCorridors(reports);
  const slowOrCongested = traffic.filter(
    (t) => t.status === "slow" || t.status === "congested"
  ).length;
  const merged = mergeHotelLayers(registeredHotels);
  const trafficUpdatedAt =
    traffic[0]?.updatedAt ?? new Date().toISOString();

  return {
    tourists,
    catalogHotels: merged.catalog,
    registeredHotels: merged.registered,
    recentReviews,
    reports,
    traffic,
    summary: {
      catalogHotels: merged.catalog.length,
      registeredHotels: merged.registered.length,
      totalHotels: merged.totalHotels,
      topRatedCount: countTopRatedHotels(registeredHotels),
      stayNepReviewCount: registeredHotels.reduce(
        (s, h) => s + (h.reviewCount ?? 0),
        0
      ),
      attractions: attractions.length,
      emergency: emergencyServices.length,
      tourists: tourists.length,
      openReports: reports.length,
      trafficCorridors: traffic.length,
      slowOrCongestedRoutes: slowOrCongested,
      trafficUpdatedAt,
      updatedAt: new Date().toISOString(),
    },
  };
}

