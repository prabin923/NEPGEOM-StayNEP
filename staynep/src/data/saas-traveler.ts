export const travelerStats = {
  upcomingTrips: 2,
  savedPlaces: 14,
  completedTrips: 8,
  safetyScore: 98,
};

export const upcomingTrips = [
  {
    id: 1,
    destination: "Pokhara Lakeside",
    dates: "Jun 12 – Jun 18, 2026",
    hotel: "Fishtail Lodge",
    status: "confirmed" as const,
  },
  {
    id: 2,
    destination: "Chitwan National Park",
    dates: "Jul 3 – Jul 7, 2026",
    hotel: "Jungle Villa Resort",
    status: "pending" as const,
  },
];

export const savedPlaces = [
  { id: 1, name: "Pashupatinath Temple", district: "Kathmandu", type: "Heritage" },
  { id: 2, name: "Phewa Lake", district: "Pokhara", type: "Nature" },
  { id: 3, name: "Everest Base Camp Trail", district: "Solukhumbu", type: "Adventure" },
];

export const travelerAlerts = [
  { id: 1, type: "weather", message: "Light rain expected in Pokhara — pack layers", time: "2h ago" },
  { id: 2, type: "safety", message: "Road maintenance on Prithvi Hwy — allow extra travel time", time: "5h ago" },
];

export const exploreActivity = [
  { month: "Jan", visits: 2 },
  { month: "Feb", visits: 1 },
  { month: "Mar", visits: 4 },
  { month: "Apr", visits: 3 },
  { month: "May", visits: 5 },
  { month: "Jun", visits: 2 },
];
