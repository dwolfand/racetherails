import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Admin authentication middleware
const authenticateAdmin = (request: Request) => {
  const adminKey = process.env.ADMIN_ACCESS_KEY;
  if (!adminKey) {
    throw new Error("ADMIN_ACCESS_KEY not configured");
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];
  return token === adminKey;
};

export async function GET(request: Request) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.registration.findMany({
      include: {
        race: true,
        participants: {
          include: {
            emergencyContact: true,
            addOns: {
              include: {
                addOn: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

// Update registration notes
export async function PATCH(request: Request) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, notes } = body;
    const adminName = request.headers.get("X-Admin-Name") || "Unknown";
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "Unknown IP";

    if (!id) {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400 }
      );
    }

    // Get current registration data
    const currentRegistration = await prisma.registration.findUnique({
      where: { id },
      select: { notes: true },
    });

    if (!currentRegistration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Update registration in a transaction with logging
    const updatedRegistration = await prisma.$transaction(async (tx) => {
      // Update the registration
      const registration = await tx.registration.update({
        where: { id },
        data: { notes },
        include: {
          race: true,
          participants: {
            include: {
              emergencyContact: true,
              addOns: {
                include: {
                  addOn: true,
                },
              },
            },
          },
        },
      });

      // Create system log entry
      await tx.systemLog.create({
        data: {
          adminName,
          ipAddress: ip,
          action: "UPDATE_NOTES",
          entityType: "Registration",
          entityId: id,
          details: {
            oldNotes: currentRegistration.notes,
            newNotes: notes,
          },
        },
      });

      return registration;
    });

    return NextResponse.json(updatedRegistration);
  } catch (error) {
    console.error("Failed to update registration:", error);
    return NextResponse.json(
      { error: "Failed to update registration" },
      { status: 500 }
    );
  }
}
