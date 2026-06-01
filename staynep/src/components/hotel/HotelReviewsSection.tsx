"use client";

import { Star } from "lucide-react";
import {
  PortalInnerCard,
  PortalSectionTitle,
} from "@/components/portal/PortalUI";
import type { PropertyReview } from "@/lib/reviews";

interface HotelReviewsSectionProps {
  reviews: PropertyReview[];
  avgRating: { avg: number; count: number };
}

export default function HotelReviewsSection({ reviews, avgRating }: HotelReviewsSectionProps) {
  const { avg, count } = avgRating;

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Guest Reviews"
        subtitle="Feedback and ratings shared by travelers who stayed at your property."
        icon={Star}
      />

      {/* Overview Card */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[20px] border border-fog bg-snow p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-steel">Average Rating</p>
          <h3 className="mt-2 text-[48px] font-bold leading-none tracking-tight text-obsidian font-cosmica">{avg}</h3>
          <div className="flex items-center gap-0.5 mt-2 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-4.5 w-4.5"
                fill={star <= Math.round(avg) ? "currentColor" : "none"}
                stroke="currentColor"
              />
            ))}
          </div>
          <p className="text-xs text-steel mt-2">Based on {count} reviews</p>
        </div>

        {/* Rating Breakdown */}
        <div className="rounded-[20px] border border-fog bg-snow p-6 sm:col-span-2 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-steel mb-4">Rating Breakdown</p>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((ratingVal) => {
              const occurrences = reviews.filter((r) => r.rating === ratingVal).length;
              const percentage = count > 0 ? (occurrences / count) * 100 : 0;
              return (
                <div key={ratingVal} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-xs font-medium text-graphite flex items-center gap-1">
                    {ratingVal} <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                  </span>
                  <div className="h-2 w-full rounded-full bg-mist overflow-hidden">
                    <div
                      className="h-full bg-obsidian rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-steel">
                    {occurrences}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-fog bg-snow/60 px-4 py-8 text-center">
            <p className="text-sm font-medium text-graphite">No reviews yet</p>
            <p className="mt-1 text-xs text-steel">Reviews from completed bookings will show up here.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <PortalInnerCard key={review.id}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-ink text-sm">{review.user.name}</h5>
                    <p className="text-[11px] text-steel mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4"
                        fill={star <= review.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-graphite leading-relaxed mt-1 italic">
                    "{review.comment}"
                  </p>
                )}
              </div>
            </PortalInnerCard>
          ))
        )}
      </div>
    </div>
  );
}
