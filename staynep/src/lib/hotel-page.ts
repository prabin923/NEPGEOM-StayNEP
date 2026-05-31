import { redirect } from "next/navigation";
import { loadHotelPropertyForUser } from "@/lib/load-hotel-property";
import { requireRole } from "@/lib/require-role";

export async function loadHotelPageData() {
  const session = await requireRole("HOTEL");
  const data = await loadHotelPropertyForUser(session.user.id);
  if (!data) redirect("/login");
  return data;
}
