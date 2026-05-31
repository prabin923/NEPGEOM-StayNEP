/**
 * Demo seed — Nepal hotel rooms for StayNEP hotel portal.
 *
 * Run: npm run db:seed
 *
 * Demo login:
 *   Email:    hotel@staynep.demo
 *   Password: StayNep123!
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_EMAIL = "hotel@staynep.demo";
const DEMO_PASSWORD = "StayNep123!";

/** Room types typical of Pokhara / Kathmandu lodges (rates in NPR). */
const NEPAL_ROOM_CATEGORIES = [
  {
    name: "Standard Trekker Room",
    totalUnits: 6,
    ratePerNight: 3200,
  },
  {
    name: "Deluxe Himalayan View",
    totalUnits: 4,
    ratePerNight: 6800,
  },
  {
    name: "Heritage Newari Suite",
    totalUnits: 2,
    ratePerNight: 9800,
  },
  {
    name: "Family Chalet Room",
    totalUnits: 3,
    ratePerNight: 7500,
  },
  {
    name: "Premium Annapurna Suite",
    totalUnits: 1,
    ratePerNight: 14500,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      name: "Demo Hotel Manager",
      role: "HOTEL",
      organization: "Himalayan Heritage Lodge",
      passwordHash,
    },
    create: {
      name: "Demo Hotel Manager",
      email: DEMO_EMAIL,
      passwordHash,
      role: "HOTEL",
      organization: "Himalayan Heritage Lodge",
    },
  });

  const property = await prisma.property.upsert({
    where: { ownerId: user.id },
    update: {
      name: "Himalayan Heritage Lodge",
      district: "Kaski",
      address: "Lakeside Road, Ward 6, Pokhara 33700, Nepal",
      phone: "+977 61-520123",
    },
    create: {
      ownerId: user.id,
      name: "Himalayan Heritage Lodge",
      district: "Kaski",
      address: "Lakeside Road, Ward 6, Pokhara 33700, Nepal",
      phone: "+977 61-520123",
    },
  });

  await prisma.room.deleteMany({ where: { propertyId: property.id } });

  await prisma.room.createMany({
    data: NEPAL_ROOM_CATEGORIES.map((room) => ({
      propertyId: property.id,
      ...room,
    })),
  });

  console.log("\n✓ StayNEP demo seed complete\n");
  console.log("  Property: Himalayan Heritage Lodge (Pokhara, Kaski)");
  console.log(`  Rooms:    ${NEPAL_ROOM_CATEGORIES.length} categories seeded\n`);
  NEPAL_ROOM_CATEGORIES.forEach((r) => {
    console.log(
      `    · ${r.name} — ${r.totalUnits} unit(s) @ NPR ${r.ratePerNight.toLocaleString("en-NP")}/night`
    );
  });
  console.log("\n  Hotel portal login:");
  console.log(`    Email:    ${DEMO_EMAIL}`);
  console.log(`    Password: ${DEMO_PASSWORD}`);
  console.log("    URL:      /dashboard/hotel\n");

  const travelerPassword = await bcrypt.hash(DEMO_PASSWORD, 12);
  const demoTravelers = [
    {
      email: "traveler1@staynep.demo",
      name: "Sita Gurung",
      lat: 28.2096,
      lng: 83.9856,
      label: "Lakeside, Pokhara",
    },
    {
      email: "traveler2@staynep.demo",
      name: "James Mitchell",
      lat: 27.7172,
      lng: 85.324,
      label: "Thamel, Kathmandu",
    },
    {
      email: "traveler3@staynep.demo",
      name: "Priya Sharma",
      lat: 27.5291,
      lng: 84.3542,
      label: "Sauraha, Chitwan",
    },
    {
      email: "traveler4@staynep.demo",
      name: "Chen Wei",
      lat: 28.035,
      lng: 86.857,
      label: "Namche Bazaar, Solukhumbu",
    },
  ];

  for (const t of demoTravelers) {
    const traveler = await prisma.user.upsert({
      where: { email: t.email },
      update: { name: t.name, role: "TRAVELER", passwordHash: travelerPassword },
      create: {
        name: t.name,
        email: t.email,
        passwordHash: travelerPassword,
        role: "TRAVELER",
      },
    });
    await prisma.travelerLocation.upsert({
      where: { userId: traveler.id },
      create: {
        userId: traveler.id,
        latitude: t.lat,
        longitude: t.lng,
        label: t.label,
      },
      update: {
        latitude: t.lat,
        longitude: t.lng,
        label: t.label,
      },
    });
  }

  console.log(`  Travelers: ${demoTravelers.length} demo tourists with map locations`);
  console.log("    (same password as hotel demo)\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
