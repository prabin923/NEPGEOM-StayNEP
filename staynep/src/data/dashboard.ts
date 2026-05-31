export const dashboardStats = {
  totalHotels: 1247,
  availableRooms: 8934,
  touristHotspots: 156,
  activeDestinations: 89,
  occupancyRate: 72.4,
};

export const monthlyTouristData = [
  { month: "Jan", tourists: 62400, revenue: 18.2, occupancy: 58 },
  { month: "Feb", tourists: 71500, revenue: 21.4, occupancy: 63 },
  { month: "Mar", tourists: 98700, revenue: 32.1, occupancy: 78 },
  { month: "Apr", tourists: 105200, revenue: 35.8, occupancy: 82 },
  { month: "May", tourists: 54300, revenue: 15.6, occupancy: 48 },
  { month: "Jun", tourists: 38900, revenue: 10.2, occupancy: 35 },
  { month: "Jul", tourists: 42100, revenue: 11.8, occupancy: 38 },
  { month: "Aug", tourists: 45600, revenue: 12.4, occupancy: 41 },
  { month: "Sep", tourists: 78200, revenue: 24.6, occupancy: 65 },
  { month: "Oct", tourists: 118400, revenue: 42.3, occupancy: 89 },
  { month: "Nov", tourists: 112800, revenue: 39.7, occupancy: 86 },
  { month: "Dec", tourists: 85300, revenue: 28.9, occupancy: 72 },
];

export const categoryDistribution = [
  { name: "Hotels", value: 487, color: "#C9A24A" },
  { name: "Homestays", value: 312, color: "#3B82F6" },
  { name: "Resorts", value: 156, color: "#10B981" },
  { name: "Lodges", value: 198, color: "#F59E0B" },
  { name: "Guesthouses", value: 94, color: "#8B5CF6" },
];

export const regionalData = [
  {
    region: "Kathmandu",
    hotels: 412,
    tourists: 345000,
    revenue: 128.5,
    occupancy: 76,
  },
  {
    region: "Pokhara",
    hotels: 287,
    tourists: 218000,
    revenue: 89.2,
    occupancy: 71,
  },
  {
    region: "Chitwan",
    hotels: 156,
    tourists: 124000,
    revenue: 52.8,
    occupancy: 68,
  },
  {
    region: "Lumbini",
    hotels: 98,
    tourists: 87000,
    revenue: 31.4,
    occupancy: 62,
  },
  {
    region: "Everest Region",
    hotels: 134,
    tourists: 52000,
    revenue: 45.6,
    occupancy: 58,
  },
  {
    region: "Annapurna Region",
    hotels: 160,
    tourists: 67000,
    revenue: 38.9,
    occupancy: 55,
  },
];

export const recentActivity = [
  {
    id: 1,
    type: "booking" as const,
    message: "New group booking at Hotel Yak & Yeti — 12 rooms",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "alert" as const,
    message: "High occupancy alert in Pokhara Lakeside area",
    time: "15 min ago",
  },
  {
    id: 3,
    type: "update" as const,
    message: "Chitwan National Park seasonal tariff updated",
    time: "1 hr ago",
  },
  {
    id: 4,
    type: "booking" as const,
    message: "Fishtail Lodge fully booked for weekend",
    time: "2 hr ago",
  },
  {
    id: 5,
    type: "alert" as const,
    message: "Weather advisory issued for Everest Region treks",
    time: "3 hr ago",
  },
  {
    id: 6,
    type: "update" as const,
    message: "New homestay registered in Bandipur — approved",
    time: "5 hr ago",
  },
];
