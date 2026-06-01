"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import {
  PortalInnerCard,
  StatusBadge,
} from "@/components/portal/PortalUI";
import { createReview, type ReviewActionState } from "@/actions/reviews";
import type { ReviewableBooking } from "@/lib/reviews";
import { formatBookingDates } from "@/lib/traveler-bookings";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

interface TravelerReviewSectionProps {
  initialBookings: ReviewableBooking[];
}

export default function TravelerReviewSection({ initialBookings }: TravelerReviewSectionProps) {
  const [bookings, setBookings] = useState<ReviewableBooking[]>(initialBookings);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLeaveReviewClick = (bookingId: string) => {
    setActiveBookingId(bookingId === activeBookingId ? null : bookingId);
    setRating(5);
    setComment("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, booking: ReviewableBooking) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("propertyId", booking.propertyId);
    formData.append("bookingId", booking.id);
    formData.append("rating", String(rating));
    formData.append("comment", comment);

    startTransition(async () => {
      const res: ReviewActionState = await createReview({}, formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setBookings((prev) => prev.filter((b) => b.id !== booking.id));
        setActiveBookingId(null);
      }
    });
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-[16px] border border-dashed border-fog bg-snow/60 px-4 py-8 text-center">
        <p className="text-sm font-medium text-graphite">No reviewable bookings</p>
        <p className="mt-1 text-xs text-steel">When you check out from a hotel stay, you can leave reviews here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <PortalInnerCard key={booking.id}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-semibold text-ink">{booking.propertyName}</h4>
              <p className="text-xs text-steel mt-0.5">
                {booking.roomName} · {formatBookingDates(new Date(booking.checkIn), new Date(booking.checkOut))}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge tone="success">Checked Out</StatusBadge>
              <button
                type="button"
                onClick={() => handleLeaveReviewClick(booking.id)}
                className="rounded-full border border-fog bg-snow px-3 py-1.5 text-xs font-semibold text-graphite hover:border-obsidian/20 hover:bg-mist transition cursor-pointer"
              >
                {activeBookingId === booking.id ? "Cancel" : "Leave Review"}
              </button>
            </div>
          </div>

          {activeBookingId === booking.id && (
            <form onSubmit={(e) => handleSubmit(e, booking)} className="mt-4 border-t border-fog/50 pt-4 space-y-4">
              {error && (
                <div className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-obsidian">Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-amber-400 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className="h-6 w-6"
                        fill={star <= rating ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-medium text-steel">({rating} / 5 stars)</span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-obsidian">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your stay experience, what you liked, and areas for improvement..."
                  rows={3}
                  className={`${hotelInputClass} resize-none`}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className={hotelSubmitClass}
                >
                  {isPending ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </PortalInnerCard>
      ))}
    </div>
  );
}
