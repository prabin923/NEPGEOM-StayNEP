import { redirect } from "next/navigation";
import HotelAdminShell from "@/components/hotel/HotelAdminShell";
import { buildHotelSearchIndex } from "@/lib/hotel-search";
import { loadHotelPropertyForUser } from "@/lib/load-hotel-property";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";

export default async function HotelDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("HOTEL");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, organization: true },
  });

  if (!user) {
    redirect("/login");
  }

  const hotelData = await loadHotelPropertyForUser(session.user.id);
  const searchItems = hotelData
    ? buildHotelSearchIndex(hotelData.propertyName, hotelData.bookings)
    : [];
  const unreadNotifications = hotelData
    ? hotelData.notifications.filter((n) => !n.read).length
    : 0;

  return (
    <HotelAdminShell
      userName={user.organization ?? user.name ?? "Hotel Admin"}
      userEmail={user.email}
      searchItems={searchItems}
      unreadNotifications={unreadNotifications}
    >
      {children}
    </HotelAdminShell>
  );
}
