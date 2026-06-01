"use client";

import { useEffect, useMemo, type RefObject } from "react";
import { Layer, Source } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import type { TrafficCorridor } from "@/lib/map-traffic";
import { trafficStatusColor } from "@/lib/map-traffic";
import type { TouristMapMarker } from "@/lib/traveler-locations";
import { circlePolygonGeoJson } from "@/lib/geoapify";

export function TrafficGeoLayer({
  corridors,
  emphasized,
}: {
  corridors: TrafficCorridor[];
  emphasized: boolean;
}) {
  const geojson = useMemo((): GeoJSON.FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: corridors.map((c) => ({
        type: "Feature",
        properties: {
          color: trafficStatusColor(c.status),
          width: emphasized ? 6 : 4,
        },
        geometry: {
          type: "LineString",
          coordinates: c.path.map(([lat, lng]) => [lng, lat]),
        },
      })),
    };
  }, [corridors, emphasized]);

  if (corridors.length === 0) return null;

  return (
    <Source id="traffic-corridors" type="geojson" data={geojson}>
      <Layer
        id="traffic-corridors-line"
        type="line"
        paint={{
          "line-color": ["get", "color"],
          "line-width": ["get", "width"],
          "line-opacity": emphasized ? 0.9 : 0.6,
        }}
      />
    </Source>
  );
}

export function ExploreRadiusLayer({
  lat,
  lng,
  radiusKm,
}: {
  lat: number;
  lng: number;
  radiusKm: number;
}) {
  const data = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: [circlePolygonGeoJson(lat, lng, radiusKm)],
    }),
    [lat, lng, radiusKm]
  );

  return (
    <Source id="explore-radius" type="geojson" data={data}>
      <Layer
        id="explore-radius-fill"
        type="fill"
        paint={{
          "fill-color": "#09090b",
          "fill-opacity": 0.05,
        }}
      />
      <Layer
        id="explore-radius-line"
        type="line"
        paint={{
          "line-color": "#09090b",
          "line-width": 1.5,
          "line-opacity": 0.45,
          "line-dasharray": [2, 2],
        }}
      />
    </Source>
  );
}

export function TouristHeatmapLayer({
  tourists,
}: {
  tourists: TouristMapMarker[];
}) {
  const data = useMemo((): GeoJSON.FeatureCollection => {
    const clusters: { lat: number; lng: number; count: number }[] = [];
    const threshold = 0.15;

    tourists.forEach((t) => {
      const cluster = clusters.find(
        (c) =>
          Math.abs(c.lat - t.lat) < threshold &&
          Math.abs(c.lng - t.lng) < threshold
      );
      if (cluster) {
        const n = cluster.count;
        cluster.lat = (cluster.lat * n + t.lat) / (n + 1);
        cluster.lng = (cluster.lng * n + t.lng) / (n + 1);
        cluster.count += 1;
      } else {
        clusters.push({ lat: t.lat, lng: t.lng, count: 1 });
      }
    });

    return {
      type: "FeatureCollection",
      features: clusters.map((c) => {
        let radiusKm = 10;
        let color = "#eab308";
        if (c.count >= 5) {
          radiusKm = 25;
          color = "#f97316";
        } else if (c.count >= 2) {
          radiusKm = 18;
          color = "#fb923c";
        }
        const poly = circlePolygonGeoJson(c.lat, c.lng, radiusKm);
        return {
          ...poly,
          properties: { color, count: c.count },
        };
      }),
    };
  }, [tourists]);

  if (tourists.length === 0) return null;

  return (
    <Source id="tourist-heat" type="geojson" data={data}>
      <Layer
        id="tourist-heat-fill"
        type="fill"
        paint={{
          "fill-color": ["get", "color"],
          "fill-opacity": 0.35,
        }}
      />
      <Layer
        id="tourist-heat-line"
        type="line"
        paint={{
          "line-color": ["get", "color"],
          "line-width": 1,
          "line-opacity": 0.5,
        }}
      />
    </Source>
  );
}

export function MapFlyController({
  mapRef,
  flyToPosition,
  selectedHotel,
  nearbyAttractions,
}: {
  mapRef: RefObject<MapRef | null>;
  flyToPosition: [number, number] | null;
  selectedHotel: { lat: number; lng: number } | null;
  nearbyAttractions: { lat: number; lng: number }[];
}) {
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (flyToPosition) {
      map.flyTo({
        center: [flyToPosition[1], flyToPosition[0]],
        zoom: 14,
        duration: 900,
      });
      return;
    }

    if (!selectedHotel) return;

    if (nearbyAttractions.length > 0) {
      const lngs = [
        selectedHotel.lng,
        ...nearbyAttractions.map((a) => a.lng),
      ];
      const lats = [
        selectedHotel.lat,
        ...nearbyAttractions.map((a) => a.lat),
      ];
      const west = Math.min(...lngs);
      const east = Math.max(...lngs);
      const south = Math.min(...lats);
      const north = Math.max(...lats);
      map.fitBounds(
        [
          [west, south],
          [east, north],
        ],
        { padding: 56, maxZoom: 14, duration: 1100 }
      );
      return;
    }

    map.flyTo({
      center: [selectedHotel.lng, selectedHotel.lat],
      zoom: 12,
      duration: 1100,
    });
  }, [mapRef, flyToPosition, selectedHotel, nearbyAttractions]);

  return null;
}
