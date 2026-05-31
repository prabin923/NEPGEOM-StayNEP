import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StayNEP — Tourism Intelligence Network for Nepal",
  description:
    "A GIS-powered tourism intelligence platform connecting travelers, hotels, and destinations across Nepal. Discover accommodations, tourist destinations, safety information, and tourism insights through location intelligence.",
  keywords: [
    "Nepal tourism",
    "GIS platform",
    "hotel booking Nepal",
    "tourism intelligence",
    "travel Nepal",
    "accommodation Nepal",
    "tourist attractions Nepal",
  ],
  authors: [{ name: "StayNEP" }],
  openGraph: {
    title: "StayNEP — Tourism Intelligence Network",
    description:
      "When Location Becomes the Solution. A GIS-powered tourism intelligence platform for Nepal.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#f4f4f5" />
      </head>
      <body className="min-h-screen bg-mist text-ink font-cosmica antialiased">
        {children}
      </body>
    </html>
  );
}
