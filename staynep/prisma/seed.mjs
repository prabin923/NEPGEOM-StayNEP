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
      latitude: 28.2096,
      longitude: 83.9856,
    },
    create: {
      ownerId: user.id,
      name: "Himalayan Heritage Lodge",
      district: "Kaski",
      address: "Lakeside Road, Ward 6, Pokhara 33700, Nepal",
      phone: "+977 61-520123",
      latitude: 28.2096,
      longitude: 83.9856,
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

  await prisma.user.upsert({
    where: { email: "authorities@staynep.demo" },
    update: {
      name: "Nepal Tourism Board",
      role: "AUTHORITIES",
      organization: "Ministry of Culture, Tourism & Civil Aviation",
      passwordHash,
    },
    create: {
      name: "Nepal Tourism Board",
      email: "authorities@staynep.demo",
      passwordHash,
      role: "AUTHORITIES",
      organization: "Ministry of Culture, Tourism & Civil Aviation",
    },
  });

  console.log("  Authorities portal login:");
  console.log("    Email:    authorities@staynep.demo");
  console.log("    Password: StayNep123!");
  console.log("    URL:      /dashboard/authorities\n");

  const james = await prisma.user.findUnique({
    where: { email: "traveler2@staynep.demo" },
  });
  const priya = await prisma.user.findUnique({
    where: { email: "traveler3@staynep.demo" },
  });
  if (james) {
    await prisma.touristReport.upsert({
      where: { id: "demo-report-scam-thamel" },
      update: {},
      create: {
        id: "demo-report-scam-thamel",
        reporterId: james.id,
        category: "SCAM",
        severity: "HIGH",
        status: "ASSIGNED",
        isEmergency: false,
        title: "Overpriced taxi from airport",
        description:
          "Driver quoted 5000 NPR for Thamel trip; meter was disabled. Request guidance on official taxi rates and reporting.",
        latitude: 27.7172,
        longitude: 85.324,
        locationLabel: "Thamel, Kathmandu",
        district: "Kathmandu",
        assignedAgency: "Tourism Police — Kathmandu",
        propertyId: null,
      },
    });
  }

  if (priya) {
    await prisma.touristReport.upsert({
      where: { id: "demo-report-hotel-chitwan" },
      update: {},
      create: {
        id: "demo-report-hotel-chitwan",
        reporterId: priya.id,
        propertyId: property.id,
        category: "HOTEL",
        severity: "MEDIUM",
        status: "OPEN",
        isEmergency: false,
        title: "Room not matching booking description",
        description:
          "Booked deluxe room with AC; assigned room had no AC and different view. Hotel staff asked to wait until next day.",
        latitude: 27.5291,
        longitude: 84.3542,
        locationLabel: "Sauraha, Chitwan",
        district: "Chitwan",
      },
    });

    await prisma.touristReport.upsert({
      where: { id: "demo-report-safety-resolved" },
      update: {},
      create: {
        id: "demo-report-safety-resolved",
        reporterId: priya.id,
        category: "SAFETY",
        severity: "CRITICAL",
        status: "RESOLVED",
        isEmergency: true,
        title: "SOS — lost on jungle trail (resolved)",
        description:
          "Demo resolved emergency: traveler reported disorientation near buffer zone; rangers escorted back to lodge.",
        latitude: 27.55,
        longitude: 84.38,
        locationLabel: "Chitwan buffer zone",
        district: "Chitwan",
        assignedAgency: "Chitwan National Park — Ranger Unit",
        resolutionNote: "Escorted to lodge; no injuries. Advised guided tours only.",
        resolvedAt: new Date(),
      },
    });
  }

  const reportCount = await prisma.touristReport.count();
  console.log(`  Tourist reports: ${reportCount} demo issue(s) for authorities triage\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
