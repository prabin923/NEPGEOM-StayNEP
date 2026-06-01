import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export interface PropertyReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string;
  };
}

export interface ReviewableBooking {
  id: string;
  propertyId: string;
  propertyName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
}

export async function fetchReviewsForProperty(propertyId: string): Promise<PropertyReview[]> {
  return prisma.review.findMany({
    where: { propertyId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function fetchPropertyAvgRating(propertyId: string): Promise<{ avg: number; count: number }> {
  const result = await prisma.review.aggregate({
    where: { propertyId },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    avg: result._avg.rating ? Math.round(result._avg.rating * 10) / 10 : 0,
    count: result._count.rating ?? 0,
  };
}

export async function fetchReviewableBookings(userId: string): Promise<ReviewableBooking[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user?.email) {
    return [];
  }

  const bookings = await prisma.booking.findMany({
    where: {
      guestEmail: user.email,
      status: BookingStatus.CHECKED_OUT,
      checkOut: {
        lt: new Date(),
      },
      review: null, // No review exists yet
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
        },
      },
      room: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      checkOut: "desc",
    },
  });

  return bookings.map((b) => ({
    id: b.id,
    propertyId: b.propertyId,
    propertyName: b.property.name,
    roomName: b.room.name,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
  }));
}
