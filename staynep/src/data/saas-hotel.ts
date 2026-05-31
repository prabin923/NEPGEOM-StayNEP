export const hotelStats = {
  occupancyRate: 78,
  availableRooms: 24,
  totalRooms: 110,
  todayBookings: 7,
  monthlyRevenue: "NPR 2.4M",
};

export const recentBookings = [
  { id: "BK-2841", guest: "Sarah Mitchell", room: "Deluxe Lake View", checkIn: "May 31", nights: 3, status: "checked-in" as const },
  { id: "BK-2840", guest: "Rajesh Karki", room: "Standard Twin", checkIn: "Jun 1", nights: 2, status: "confirmed" as const },
  { id: "BK-2839", guest: "Emma Chen", room: "Suite Premium", checkIn: "Jun 2", nights: 5, status: "confirmed" as const },
  { id: "BK-2838", guest: "Group: Trek Nepal", room: "Block (8 rooms)", checkIn: "Jun 5", nights: 4, status: "pending" as const },
];

export const roomInventory = [
  { type: "Standard", total: 40, available: 12, rate: "NPR 4,500" },
  { type: "Deluxe", total: 35, available: 8, rate: "NPR 7,200" },
  { type: "Suite", total: 20, available: 3, rate: "NPR 12,500" },
  { type: "Family", total: 15, available: 1, rate: "NPR 9,800" },
];

export const occupancyTrend = [
  { week: "W1", occupancy: 62 },
  { week: "W2", occupancy: 71 },
  { week: "W3", occupancy: 68 },
  { week: "W4", occupancy: 78 },
  { week: "W5", occupancy: 82 },
  { week: "W6", occupancy: 75 },
];

export const revenueBySource = [
  { source: "Direct", value: 42 },
  { source: "StayNEP", value: 35 },
  { source: "OTA", value: 23 },
];
