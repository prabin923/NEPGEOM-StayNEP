"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export type ReviewActionState = {
  error?: string;
  success?: boolean;
};

async function requireTraveler() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TRAVELER") {
    return { error: "Unauthorized" as const, userId: null };
  }
  return { error: null, userId: session.user.id };
}

export async function createReview(
  _prev: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const ctx = await requireTraveler();
  if (ctx.error || !ctx.userId) return { error: ctx.error ?? "Unauthorized" };

  const propertyId = String(formData.get("propertyId") ?? "");
  const bookingId = formData.get("bookingId") ? String(formData.get("bookingId")) : null;
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!propertyId) return { error: "Property ID is required." };
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5." };
  }

  try {
    // If bookingId is provided, check that it's checked out, belongs to this traveler, and has no review yet.
    if (bookingId) {
      const user = await prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { email: true }
      });
      if (!user?.email) return { error: "User email not found." };

      const booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          guestEmail: user.email,
          propertyId,
          status: BookingStatus.CHECKED_OUT,
        },
        include: {
          review: true
        }
      });

      if (!booking) {
        return { error: "Valid booking not found for this review." };
      }
      if (booking.review) {
        return { error: "You have already reviewed this booking." };
      }
    }

    await prisma.review.create({
      data: {
        propertyId,
        bookingId: bookingId || null,
        userId: ctx.userId,
        rating,
        comment: comment || null
      }
    });

    revalidatePath("/dashboard/hotel");
    revalidatePath("/dashboard/hotel/reviews");
    revalidatePath("/dashboard/traveler");

    return { success: true };
  } catch (err: any) {
    console.error("Failed to create review:", err);
    return { error: err.message ?? "An unexpected error occurred." };
  }
}

export async function fetchPropertyReviews(propertyId: string) {
  return prisma.review.findMany({
    where: { propertyId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true }
      }
    }
  });
}
