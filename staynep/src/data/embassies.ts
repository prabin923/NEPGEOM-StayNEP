export interface Embassy {
  id: string;
  country: string;
  name: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  website: string;
  lat: number;
  lng: number;
}

export const embassies: Embassy[] = [
  {
    id: "us",
    country: "United States",
    name: "Embassy of the United States",
    address: "Maharajgunj, Kathmandu",
    phone: "+977-1-423-4000",
    emergencyPhone: "+977-1-423-4437",
    email: "consularkatm@state.gov",
    website: "https://np.usembassy.gov",
    lat: 27.7380,
    lng: 85.3360,
  },
  {
    id: "in",
    country: "India",
    name: "Embassy of India",
    address: "Lainchaur, Kathmandu",
    phone: "+977-1-441-0900",
    emergencyPhone: "+977-1-441-1658",
    email: "cons.kathmandu@mea.gov.in",
    website: "https://www.indembkathmandu.gov.np",
    lat: 27.7195,
    lng: 85.3185,
  },
  {
    id: "uk",
    country: "United Kingdom",
    name: "British Embassy",
    address: "Lainchaur, Kathmandu",
    phone: "+977-1-441-0583",
    emergencyPhone: "+977-1-441-0583",
    email: "beconsular@fcdo.gov.uk",
    website: "https://www.gov.uk/world/nepal",
    lat: 27.7212,
    lng: 85.3210,
  },
  {
    id: "cn",
    country: "China",
    name: "Embassy of the People's Republic of China",
    address: "Baluwatar, Kathmandu",
    phone: "+977-1-441-1740",
    emergencyPhone: "+977-980-103-1658",
    email: "consular_npl@mfa.gov.cn",
    website: "http://np.china-embassy.gov.cn/eng/",
    lat: 27.7290,
    lng: 85.3280,
  },
  {
    id: "au",
    country: "Australia",
    name: "Australian Embassy",
    address: "Bansbari, Kathmandu",
    phone: "+977-1-462-2111",
    emergencyPhone: "+61-2-6261-3305",
    email: "austemb.kathmandu@dfat.gov.au",
    website: "https://nepal.embassy.gov.au",
    lat: 27.7420,
    lng: 85.3390,
  },
  {
    id: "de",
    country: "Germany",
    name: "Embassy of the Federal Republic of Germany",
    address: "Gyaneshwor, Kathmandu",
    phone: "+977-1-441-2786",
    emergencyPhone: "+977-985-102-2342",
    email: "info@kathmandu.diplo.de",
    website: "https://kathmandu.diplo.de",
    lat: 27.7120,
    lng: 85.3340,
  },
  {
    id: "fr",
    country: "France",
    name: "Embassy of France",
    address: "Lazimpat, Kathmandu",
    phone: "+977-1-441-2332",
    emergencyPhone: "+977-985-101-7022",
    email: "ambassade@ambafrance-np.org",
    website: "https://np.ambafrance.org",
    lat: 27.7235,
    lng: 85.3235,
  },
  {
    id: "jp",
    country: "Japan",
    name: "Embassy of Japan",
    address: "Panipokhari, Kathmandu",
    phone: "+977-1-442-6680",
    emergencyPhone: "+977-1-442-6680",
    email: "consular-emb@km.mofa.go.jp",
    website: "https://www.np.emb-japan.go.jp",
    lat: 27.7275,
    lng: 85.3230,
  },
];
