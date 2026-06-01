"use client";

import { Star } from "lucide-react";

export default function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const iconClass = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  const full = Math.floor(rating);
  const partial = rating - full >= 0.5;

  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${iconClass} ${
            i < full
              ? "fill-amber-400 text-amber-400"
              : i === full && partial
                ? "fill-amber-200 text-amber-400"
                : "fill-fog text-pebble"
          }`}
        />
      ))}
      <span
        className={`ml-1 font-semibold text-obsidian ${size === "md" ? "text-sm" : "text-xs"}`}
      >
        {rating.toFixed(1)}
      </span>
    </span>
  );
}
