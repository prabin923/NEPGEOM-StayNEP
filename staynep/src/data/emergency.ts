export interface EmergencyService {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: "hospital" | "police" | "shelter";
  contact: string;
  district: string;
}

export const emergencyServices: EmergencyService[] = [
  // Hospitals
  {
    id: 1,
    name: "Tribhuvan University Teaching Hospital",
    lat: 27.7361,
    lng: 85.3312,
    type: "hospital",
    contact: "+977-1-4412303",
    district: "Kathmandu",
  },
  {
    id: 2,
    name: "Bir Hospital",
    lat: 27.7047,
    lng: 85.3145,
    type: "hospital",
    contact: "+977-1-4221119",
    district: "Kathmandu",
  },
  {
    id: 3,
    name: "Western Regional Hospital",
    lat: 28.2334,
    lng: 83.9888,
    type: "hospital",
    contact: "+977-61-520066",
    district: "Kaski",
  },
  {
    id: 4,
    name: "Bharatpur Hospital",
    lat: 27.6833,
    lng: 84.4333,
    type: "hospital",
    contact: "+977-56-527012",
    district: "Chitwan",
  },

  // Police
  {
    id: 5,
    name: "Tourist Police Kathmandu",
    lat: 27.7125,
    lng: 85.3119,
    type: "police",
    contact: "+977-1-4247041",
    district: "Kathmandu",
  },
  {
    id: 6,
    name: "Tourist Police Pokhara",
    lat: 28.2096,
    lng: 83.9856,
    type: "police",
    contact: "+977-61-463673",
    district: "Kaski",
  },
  {
    id: 7,
    name: "Tourist Police Chitwan",
    lat: 27.5845,
    lng: 84.4567,
    type: "police",
    contact: "+977-56-580022",
    district: "Chitwan",
  },

  // Shelters
  {
    id: 8,
    name: "Kathmandu Emergency Shelter",
    lat: 27.6985,
    lng: 85.3200,
    type: "shelter",
    contact: "+977-1-4262468",
    district: "Kathmandu",
  },
  {
    id: 9,
    name: "Pokhara Disaster Relief Center",
    lat: 28.2200,
    lng: 83.9750,
    type: "shelter",
    contact: "+977-61-465888",
    district: "Kaski",
  },
  {
    id: 10,
    name: "Lumbini Emergency Aid Station",
    lat: 27.4870,
    lng: 83.2800,
    type: "shelter",
    contact: "+977-71-580140",
    district: "Rupandehi",
  },
];
