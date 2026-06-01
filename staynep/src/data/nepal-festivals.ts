export interface NepalFestival {
  id: string;
  name: string;
  nepaliName: string;
  month: number; // 1-12
  dayRange: string; // e.g. "Oct 15-19"
  category: "national" | "cultural" | "religious" | "seasonal";
  description: string;
  travelImpact: "high" | "medium" | "low";
  travelTip: string;
  region: string;
  emoji: string;
}

export const nepalFestivals: NepalFestival[] = [
  {
    id: "dashain",
    name: "Dashain",
    nepaliName: "दशैं",
    month: 10,
    dayRange: "Oct 2-11",
    category: "national",
    description: "Nepal's biggest festival — 10-day celebration honoring goddess Durga. Families reunite, kites fill the sky, and bamboo swings dot the landscape.",
    travelImpact: "high",
    travelTip: "Book 2-3 weeks early. Many businesses close. Buses are extremely crowded. Great for cultural immersion if planned.",
    region: "Nationwide",
    emoji: "🪁",
  },
  {
    id: "tihar",
    name: "Tihar (Deepawali)",
    nepaliName: "तिहार",
    month: 11,
    dayRange: "Nov 1-5",
    category: "national",
    description: "Festival of lights — 5 days honoring animals (crows, dogs, cows) and the goddess Lakshmi. Houses glow with oil lamps and marigold garlands.",
    travelImpact: "high",
    travelTip: "Stunning photo opportunities. Hotels fill fast in Kathmandu. Don't miss Newari celebrations in Bhaktapur.",
    region: "Nationwide",
    emoji: "🪔",
  },
  {
    id: "holi",
    name: "Holi",
    nepaliName: "होली",
    month: 3,
    dayRange: "Mar 14",
    category: "cultural",
    description: "Festival of colors — people throw colored powder and water balloons. Celebrated more intensely in the Terai region.",
    travelImpact: "medium",
    travelTip: "Wear clothes you don't mind staining. Keep electronics in waterproof bags. Join the fun in Kathmandu Durbar Square.",
    region: "Nationwide",
    emoji: "🎨",
  },
  {
    id: "indrajatra",
    name: "Indra Jatra",
    nepaliName: "इन्द्रजात्रा",
    month: 9,
    dayRange: "Sep 10-18",
    category: "cultural",
    description: "Kathmandu's grandest street festival — masked dances, chariot processions, and the Living Goddess (Kumari) is paraded through the old city.",
    travelImpact: "medium",
    travelTip: "Best viewed from Kathmandu Durbar Square. Arrive early for good spots. Photography-friendly event.",
    region: "Kathmandu Valley",
    emoji: "🎭",
  },
  {
    id: "buddha-jayanti",
    name: "Buddha Jayanti",
    nepaliName: "बुद्ध जयन्ती",
    month: 5,
    dayRange: "May 12",
    category: "religious",
    description: "Birthday of Siddhartha Gautama. Pilgrimages to Lumbini (birthplace of Buddha) and Boudhanath/Swayambhunath in Kathmandu.",
    travelImpact: "medium",
    travelTip: "Visit Lumbini for the full experience. Expect crowds at Buddhist sites. Hotels in Lumbini fill up.",
    region: "Lumbini, Kathmandu",
    emoji: "🙏",
  },
  {
    id: "everest-season",
    name: "Everest Spring Season",
    nepaliName: "एभरेस्ट सिजन",
    month: 4,
    dayRange: "Apr-May",
    category: "seasonal",
    description: "Peak mountaineering season. Hundreds of climbers attempt Everest and other 8000m peaks. Lukla flights are busy.",
    travelImpact: "high",
    travelTip: "Book Lukla flights months in advance. Namche Bazaar hotels fill quickly. Great time for the EBC trek.",
    region: "Everest Region",
    emoji: "🏔️",
  },
  {
    id: "monsoon",
    name: "Monsoon Season",
    nepaliName: "बर्षात",
    month: 7,
    dayRange: "Jun-Sep",
    category: "seasonal",
    description: "Heavy rainfall across Nepal. Lush green landscapes but risk of landslides and flooding. Off-season for trekking.",
    travelImpact: "high",
    travelTip: "Avoid high-altitude treks. Upper Mustang and Dolpo are rain-shadow areas that stay dry. Hotel prices drop 30-50%.",
    region: "Nationwide",
    emoji: "🌧️",
  },
  {
    id: "chhath",
    name: "Chhath Puja",
    nepaliName: "छठ पर्व",
    month: 11,
    dayRange: "Nov 7-8",
    category: "religious",
    description: "Devotees worship the Sun God by standing in rivers and ponds. Spectacular at sunrise and sunset. Primarily Terai region.",
    travelImpact: "low",
    travelTip: "Visit Janakpur for the most authentic experience. Beautiful sunrise photography by the riverbanks.",
    region: "Terai",
    emoji: "☀️",
  },
  {
    id: "autumn-trek",
    name: "Peak Trekking Season",
    nepaliName: "पदयात्रा सिजन",
    month: 10,
    dayRange: "Oct-Nov",
    category: "seasonal",
    description: "Best weather for trekking — clear skies, mild temperatures, and stunning mountain views. Annapurna and Everest trails are busiest.",
    travelImpact: "high",
    travelTip: "Book teahouses early on popular routes. Permits required. Consider less-popular trails like Manaslu or Langtang.",
    region: "Mountain regions",
    emoji: "🥾",
  },
  {
    id: "shivaratri",
    name: "Maha Shivaratri",
    nepaliName: "महाशिवरात्रि",
    month: 2,
    dayRange: "Feb 26",
    category: "religious",
    description: "Night of Lord Shiva — tens of thousands of sadhus gather at Pashupatinath Temple. Bonfires, chanting, and sacred rituals through the night.",
    travelImpact: "medium",
    travelTip: "Pashupatinath is incredibly crowded. Go in the evening for the best atmosphere. Non-Hindus can observe from outside the main temple.",
    region: "Kathmandu",
    emoji: "🔱",
  },
  {
    id: "new-year",
    name: "Nepali New Year (Naya Barsha)",
    nepaliName: "नयाँ वर्ष",
    month: 4,
    dayRange: "Apr 14",
    category: "national",
    description: "Bikram Sambat new year — parades, cultural shows, and family celebrations. Marks the start of the Nepali calendar year.",
    travelImpact: "medium",
    travelTip: "Enjoy Bhaktapur's Bisket Jatra chariot festival. Public holidays mean some services close.",
    region: "Nationwide",
    emoji: "🎊",
  },
  {
    id: "teej",
    name: "Teej",
    nepaliName: "तीज",
    month: 9,
    dayRange: "Sep 6",
    category: "cultural",
    description: "Women's festival — fasting, singing, and dancing in red saris. Women gather at Pashupatinath and temples across the country.",
    travelImpact: "low",
    travelTip: "Wonderful cultural spectacle. Durbar Square and Pashupatinath are the best places to witness the celebrations.",
    region: "Nationwide",
    emoji: "💃",
  },
];

/** Get festivals happening in a given month (1-indexed). */
export function getFestivalsForMonth(month: number): NepalFestival[] {
  return nepalFestivals.filter((f) => f.month === month);
}

/** Get upcoming festivals from current date (next 3 months). */
export function getUpcomingFestivals(limit = 4): NepalFestival[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-indexed
  const sorted = [...nepalFestivals].sort((a, b) => {
    const aDist = (a.month - currentMonth + 12) % 12;
    const bDist = (b.month - currentMonth + 12) % 12;
    return aDist - bDist;
  });
  return sorted.slice(0, limit);
}
