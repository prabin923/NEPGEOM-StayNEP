import { revalidatePath } from "next/cache";

export function revalidateTourismPortals() {
  revalidatePath("/dashboard/traveler", "layout");
  revalidatePath("/dashboard/authorities", "layout");
  revalidatePath("/transparency");
}
