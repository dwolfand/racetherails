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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentStatus } = body;
    const adminName = request.headers.get("X-Admin-Name") || "Unknown";
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "Unknown IP";

    if (
      !paymentStatus ||
      !["PENDING", "COMPLETED", "CANCELLED"].includes(paymentStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid payment status" },
        { status: 400 }
      );
    }

    // Get the current participant data before update
    const currentParticipant = await prisma.participant.findUnique({
      where: { id: params.id },
      select: { paymentStatus: true },
    });

    if (!currentParticipant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    // Update participant in a transaction with logging
    const updatedParticipant = await prisma.$transaction(async (tx) => {
      // Update the participant
      const participant = await tx.participant.update({
        where: { id: params.id },
        data: { paymentStatus },
        include: {
          registration: {
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
          },
        },
      });

      // Create system log entry
      await tx.systemLog.create({
        data: {
          adminName,
          ipAddress: ip,
          action: "UPDATE_PAYMENT_STATUS",
          entityType: "Participant",
          entityId: params.id,
          details: {
            oldStatus: currentParticipant.paymentStatus,
            newStatus: paymentStatus,
          },
        },
      });

      return participant;
    });

    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error("Failed to update payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
