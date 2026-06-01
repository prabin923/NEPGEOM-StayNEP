import { redirect } from "next/navigation";
import { loadHotelPropertyForUser } from "@/lib/load-hotel-property";
import { requireRole } from "@/lib/require-role";
import { fetchReviewsForProperty, fetchPropertyAvgRating } from "@/lib/reviews";
import HotelReviewsSection from "@/components/hotel/HotelReviewsSection";

export const metadata = {
  title: "Guest Reviews — StayNEP",
};

export default async function HotelReviewsPage() {
  const session = await requireRole("HOTEL");
  const data = await loadHotelPropertyForUser(session.user.id);
  if (!data?.property) redirect("/login");

  const [reviews, avgRating] = await Promise.all([
    fetchReviewsForProperty(data.property.id),
    fetchPropertyAvgRating(data.property.id),
  ]);

  return (
    <div className="space-y-6">
      <HotelReviewsSection reviews={reviews} avgRating={avgRating} />
    </div>
  );
}
