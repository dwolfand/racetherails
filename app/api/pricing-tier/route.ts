import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get registration type from query parameter
    const { searchParams } = new URL(request.url);
    const registrationType = searchParams.get("type");

    if (!registrationType) {
      return NextResponse.json(
        { error: "Registration type is required" },
        { status: 400 }
      );
    }

    // Get the current active race
    const currentRace = await prisma.race.findFirst({
      where: {
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!currentRace) {
      console.error("No active race found");
      return NextResponse.json(
        { error: "No active race found" },
        { status: 404 }
      );
    }

    // Get the current pricing tier based on the current date and registration type
    const currentDate = new Date();
    console.log("Searching for pricing tier with params:", {
      raceId: currentRace.id,
      registrationType,
      currentDate: currentDate.toISOString(),
    });

    const currentPricingTier = await prisma.pricingTier.findFirst({
      where: {
        raceId: currentRace.id,
        registrationType: registrationType as any,
        isActive: true,
        startDate: {
          lte: currentDate,
        },
        endDate: {
          gte: currentDate,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    if (!currentPricingTier) {
      console.error("No active pricing tier found for:", {
        raceId: currentRace.id,
        registrationType,
        currentDate: currentDate.toISOString(),
      });
      return NextResponse.json(
        { error: "No active pricing tier found" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentPricingTier);
  } catch (error) {
    console.error("Error fetching pricing tier:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing tier" },
      { status: 500 }
    );
  }
}
