export interface Attraction {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: "temple" | "nature" | "heritage" | "adventure" | "cultural";
  description: string;
  district: string;
}

export const attractions: Attraction[] = [
  {
    id: 1,
    name: "Pashupatinath Temple",
    lat: 27.7104,
    lng: 85.3487,
    category: "temple",
    description:
      "Sacred Hindu temple complex on the banks of the Bagmati River, a UNESCO World Heritage Site and one of the holiest Shiva temples in the world.",
    district: "Kathmandu",
  },
  {
    id: 2,
    name: "Boudhanath Stupa",
    lat: 27.7215,
    lng: 85.3620,
    category: "heritage",
    description:
      "One of the largest spherical stupas in Nepal and a UNESCO World Heritage Site, a center of Tibetan Buddhism and pilgrimage.",
    district: "Kathmandu",
  },
  {
    id: 3,
    name: "Swayambhunath (Monkey Temple)",
    lat: 27.7149,
    lng: 85.2904,
    category: "temple",
    description:
      "Ancient religious hilltop complex with a stunning Buddhist stupa, offering panoramic views of the Kathmandu Valley.",
    district: "Kathmandu",
  },
  {
    id: 4,
    name: "Kathmandu Durbar Square",
    lat: 27.7043,
    lng: 85.3075,
    category: "heritage",
    description:
      "Historic royal palace square featuring stunning Newari architecture, ancient temples, and the residence of the Kumari (living goddess).",
    district: "Kathmandu",
  },
  {
    id: 5,
    name: "Patan Durbar Square",
    lat: 27.6726,
    lng: 85.3252,
    category: "heritage",
    description:
      "A marvel of Newari architecture in Lalitpur, featuring the ancient Royal Palace, Krishna Mandir, and exquisite stone and bronze craftsmanship.",
    district: "Lalitpur",
  },
  {
    id: 6,
    name: "Changu Narayan Temple",
    lat: 27.7098,
    lng: 85.4275,
    category: "temple",
    description:
      "The oldest Hindu temple in the Kathmandu Valley, perched on a hilltop and renowned for its exquisite early Licchavi-era stone sculptures.",
    district: "Bhaktapur",
  },
  {
    id: 7,
    name: "Phewa Lake",
    lat: 28.2096,
    lng: 83.9556,
    category: "nature",
    description:
      "The second largest lake in Nepal, located in Pokhara, offering stunning reflections of the Annapurna range and boating experiences.",
    district: "Kaski",
  },
  {
    id: 8,
    name: "Chitwan National Park",
    lat: 27.5291,
    lng: 84.3542,
    category: "nature",
    description:
      "Nepal's first national park and a UNESCO World Heritage Site, home to one-horned rhinos, Bengal tigers, and over 500 bird species.",
    district: "Chitwan",
  },
  {
    id: 9,
    name: "Lumbini - Birthplace of Buddha",
    lat: 27.4833,
    lng: 83.2767,
    category: "cultural",
    description:
      "The birthplace of Lord Siddhartha Gautama (Buddha), a UNESCO World Heritage Site featuring the sacred Mayadevi Temple and peace gardens.",
    district: "Rupandehi",
  },
  {
    id: 10,
    name: "Everest Base Camp Trek",
    lat: 28.0025,
    lng: 86.8528,
    category: "adventure",
    description:
      "The iconic trek to the base of the world's tallest mountain, passing through Sherpa villages, monasteries, and breathtaking Himalayan scenery.",
    district: "Solukhumbu",
  },
  {
    id: 11,
    name: "Annapurna Base Camp Trek",
    lat: 28.5305,
    lng: 83.8781,
    category: "adventure",
    description:
      "A stunning trek into the heart of the Annapurna Sanctuary, surrounded by a 360-degree panorama of towering Himalayan peaks.",
    district: "Kaski",
  },
  {
    id: 12,
    name: "Bhaktapur Durbar Square",
    lat: 27.6720,
    lng: 85.4298,
    category: "heritage",
    description:
      "A beautifully preserved medieval square showcasing the finest Newari art and architecture, including the 55-Window Palace and Nyatapola Temple.",
    district: "Bhaktapur",
  },
  {
    id: 13,
    name: "Rara Lake",
    lat: 29.5260,
    lng: 82.0840,
    category: "nature",
    description:
      "The largest lake in Nepal, nestled in the remote northwest at 2,990m altitude, surrounded by pristine forests and snow-capped peaks.",
    district: "Mugu",
  },
  {
    id: 14,
    name: "Bandipur Village",
    lat: 27.9356,
    lng: 84.4078,
    category: "cultural",
    description:
      "A hilltop Newari settlement frozen in time, offering stunning Himalayan views, ancient temples, and a glimpse into traditional Nepali life.",
    district: "Tanahun",
  },
];
