import { auth } from "@/lib/auth";
import { fetchSearchableHotels } from "@/lib/search-hotels";
import HotelSearchPage from "@/components/search/HotelSearchPage";

export const metadata = {
  title: "Browse Hotels — StayNEP",
  description: "Find verified hotels, heritage homestays, and boutique resorts across Nepal using GIS location intelligence.",
};

export default async function HotelsPage() {
  const session = await auth();
  const hotels = await fetchSearchableHotels();
  const isLoggedIn = !!session?.user;

  return <HotelSearchPage hotels={hotels} isLoggedIn={isLoggedIn} />;
}
