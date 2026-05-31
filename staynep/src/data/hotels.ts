export interface Hotel {
  id: number;
  name: string;
  lat: number;
  lng: number;
  availableRooms: number;
  totalRooms: number;
  rating: number;
  priceRange: string;
  district: string;
  type: string;
}

export const hotels: Hotel[] = [
  // Kathmandu Valley
  {
    id: 1,
    name: "Hotel Yak & Yeti",
    lat: 27.7125,
    lng: 85.3167,
    availableRooms: 42,
    totalRooms: 150,
    rating: 4.7,
    priceRange: "$$$",
    district: "Kathmandu",
    type: "Luxury Hotel",
  },
  {
    id: 2,
    name: "Dwarika's Hotel",
    lat: 27.6892,
    lng: 85.3445,
    availableRooms: 18,
    totalRooms: 83,
    rating: 4.9,
    priceRange: "$$$$",
    district: "Kathmandu",
    type: "Heritage Hotel",
  },
  {
    id: 3,
    name: "Kathmandu Marriott Hotel",
    lat: 27.7244,
    lng: 85.3096,
    availableRooms: 55,
    totalRooms: 126,
    rating: 4.5,
    priceRange: "$$$",
    district: "Kathmandu",
    type: "Luxury Hotel",
  },

  // Pokhara
  {
    id: 4,
    name: "Temple Tree Resort & Spa",
    lat: 28.2044,
    lng: 83.9616,
    availableRooms: 30,
    totalRooms: 68,
    rating: 4.6,
    priceRange: "$$$",
    district: "Kaski",
    type: "Resort",
  },
  {
    id: 5,
    name: "Fishtail Lodge",
    lat: 28.2037,
    lng: 83.9492,
    availableRooms: 12,
    totalRooms: 45,
    rating: 4.8,
    priceRange: "$$$",
    district: "Kaski",
    type: "Lodge",
  },
  {
    id: 6,
    name: "Lakeside Retreat Pokhara",
    lat: 28.2118,
    lng: 83.9586,
    availableRooms: 24,
    totalRooms: 52,
    rating: 4.2,
    priceRange: "$$",
    district: "Kaski",
    type: "Guesthouse",
  },

  // Chitwan
  {
    id: 7,
    name: "Barahi Jungle Lodge",
    lat: 27.5834,
    lng: 84.4915,
    availableRooms: 15,
    totalRooms: 32,
    rating: 4.5,
    priceRange: "$$$",
    district: "Chitwan",
    type: "Lodge",
  },
  {
    id: 8,
    name: "Kasara Resort Chitwan",
    lat: 27.5312,
    lng: 84.3610,
    availableRooms: 22,
    totalRooms: 40,
    rating: 4.7,
    priceRange: "$$$$",
    district: "Chitwan",
    type: "Resort",
  },

  // Lumbini
  {
    id: 9,
    name: "Lumbini Buddha Garden Resort",
    lat: 27.4850,
    lng: 83.2790,
    availableRooms: 18,
    totalRooms: 36,
    rating: 4.1,
    priceRange: "$$",
    district: "Rupandehi",
    type: "Resort",
  },

  // Nagarkot
  {
    id: 10,
    name: "Club Himalaya Nagarkot",
    lat: 27.7150,
    lng: 85.5180,
    availableRooms: 28,
    totalRooms: 60,
    rating: 4.3,
    priceRange: "$$",
    district: "Bhaktapur",
    type: "Resort",
  },

  // Bhaktapur
  {
    id: 11,
    name: "The Peacock Guest House",
    lat: 27.6720,
    lng: 85.4285,
    availableRooms: 8,
    totalRooms: 20,
    rating: 4.4,
    priceRange: "$$",
    district: "Bhaktapur",
    type: "Homestay",
  },

  // Namche Bazaar / Everest Region
  {
    id: 12,
    name: "Everest Summit Lodge Namche",
    lat: 27.8065,
    lng: 86.7142,
    availableRooms: 10,
    totalRooms: 24,
    rating: 4.3,
    priceRange: "$$",
    district: "Solukhumbu",
    type: "Lodge",
  },

  // Bandipur
  {
    id: 13,
    name: "The Old Inn Bandipur",
    lat: 27.9356,
    lng: 84.4078,
    availableRooms: 6,
    totalRooms: 22,
    rating: 4.6,
    priceRange: "$$",
    district: "Tanahun",
    type: "Heritage Hotel",
  },

  // Ilam
  {
    id: 14,
    name: "Ilam Tea Garden Homestay",
    lat: 26.9100,
    lng: 87.9270,
    availableRooms: 5,
    totalRooms: 12,
    rating: 3.9,
    priceRange: "$",
    district: "Ilam",
    type: "Homestay",
  },
];
