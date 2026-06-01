"use client";

import { Marker } from "react-map-gl/maplibre";

export default function MapDotMarker({
  longitude,
  latitude,
  color,
  size = 22,
  onClick,
  title,
}: {
  longitude: number;
  latitude: number;
  color: string;
  size?: number;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick?.();
      }}
    >
      <div
        title={title}
        className="cursor-pointer rounded-full border-2 border-white shadow-md"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `0 0 0 1px ${color}55, 0 4px 10px rgba(9,9,11,0.15)`,
        }}
      />
    </Marker>
  );
}
