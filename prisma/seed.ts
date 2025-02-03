import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create the main Race the Rails 2025 event
  const raceTheRails2025 = await prisma.race.upsert({
    where: { slug: "race-the-rails-2025" },
    update: {},
    create: {
      year: 2025,
      name: "Race the Rails",
      slug: "race-the-rails-2025",
      description:
        "Race against the Metro along the entire Red Line from Glenmont to Shady Grove! Challenge yourself to beat the train across its longest route.",
      location: "Glenmont Metro Station",
      date: new Date("2025-05-17T08:00:00-04:00"), // May 17, 2025, 8:00 AM EDT
      maxParticipants: 200,
      isActive: true,
      pricingTiers: {
        create: [
          // Early Bird Individual
          {
            name: "Early Bird",
            registrationType: "INDIVIDUAL",
            startDate: new Date("2025-02-01T00:00:00-05:00"), // Yesterday (Feb 2, 2025)
            endDate: new Date("2025-02-24T23:59:59-05:00"),
            price: 40.0,
            isActive: true,
          },
          // Regular Individual
          {
            name: "Regular",
            registrationType: "INDIVIDUAL",
            startDate: new Date("2025-02-25T00:00:00-05:00"),
            endDate: new Date("2025-03-10T23:59:59-04:00"),
            price: 50.0,
            isActive: true,
          },
          // Early Bird Team (per person)
          {
            name: "Early Bird Team",
            registrationType: "TEAM",
            startDate: new Date("2025-02-01T00:00:00-05:00"), // Yesterday (Feb 2, 2025)
            endDate: new Date("2025-02-24T23:59:59-05:00"),
            price: 35.0, // Discounted team price per person
            isActive: true,
          },
          // Regular Team (per person)
          {
            name: "Regular Team",
            registrationType: "TEAM",
            startDate: new Date("2025-02-25T00:00:00-05:00"),
            endDate: new Date("2025-03-10T23:59:59-04:00"),
            price: 45.0, // Discounted team price per person
            isActive: true,
          },
        ],
      },
      addOns: {
        create: [
          {
            name: "Limited Edition T-Shirt",
            description: "Commemorative Race the Rails 2025 t-shirt",
            price: 25.0,
            isActive: true,
            requiresSize: true,
          },
        ],
      },
    },
  });

  console.log({ raceTheRails2025 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
