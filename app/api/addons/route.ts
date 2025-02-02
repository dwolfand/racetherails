import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
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
      return NextResponse.json(
        { error: "No active race found" },
        { status: 404 }
      );
    }

    // Get all active add-ons for the current race
    const addOns = await prisma.addOn.findMany({
      where: {
        raceId: currentRace.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        requiresSize: true,
      },
    });

    return NextResponse.json(addOns);
  } catch (error) {
    console.error("Error fetching add-ons:", error);
    return NextResponse.json(
      { error: "Failed to fetch add-ons" },
      { status: 500 }
    );
  }
}
