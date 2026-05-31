import { revalidatePath } from "next/cache";

export function revalidateHotelDashboard() {
  revalidatePath("/dashboard/hotel", "layout");
}
