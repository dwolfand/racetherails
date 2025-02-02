import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClient, Prisma, Size } from "@prisma/client";
import { z } from "zod";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

type RegistrationType = "INDIVIDUAL" | "TEAM";

interface ParticipantAddOn {
  addOnId: string;
  size: Size | null;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

interface Participant {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  venmoUsername?: string;
  addOns: ParticipantAddOn[];
  emergencyContact: EmergencyContact;
}

interface RegistrationRequest {
  type: RegistrationType;
  teamName: string | null;
  pricePerPerson: number;
  totalAmount: number;
  participants: Participant[];
}

const validSizes = new Set(Object.values(Size));

const registrationSchema = z.object({
  type: z.enum(["INDIVIDUAL", "TEAM"]),
  teamName: z.string().nullable(),
  pricePerPerson: z.number(),
  totalAmount: z.number(),
  participants: z.array(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phoneNumber: z.string(),
      venmoUsername: z.string().optional(),
      addOns: z.array(
        z.object({
          addOnId: z.string(),
          size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]).nullable(),
        })
      ),
      emergencyContact: z.object({
        name: z.string(),
        relationship: z.string(),
        phoneNumber: z.string(),
      }),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registrationSchema.parse(body);

    // Validate sizes in add-ons
    for (const participant of validatedData.participants) {
      for (const addOn of participant.addOns) {
        if (addOn.size !== null && !validSizes.has(addOn.size as Size)) {
          return NextResponse.json(
            {
              error: `Invalid size: ${addOn.size}. Must be one of: ${Array.from(
                validSizes
              ).join(", ")}`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Get the current active race
    const currentRace = await prisma.race.findFirst({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        maxParticipants: true,
      },
    });

    if (!currentRace) {
      return NextResponse.json(
        { error: "No active race found" },
        { status: 404 }
      );
    }

    // Check if race is full
    if (currentRace.maxParticipants) {
      const currentParticipantCount = await prisma.participant.count({
        where: {
          registration: {
            raceId: currentRace.id,
          },
        },
      });

      if (
        currentParticipantCount + validatedData.participants.length >
        currentRace.maxParticipants
      ) {
        return NextResponse.json({ error: "Race is full" }, { status: 400 });
      }
    }

    // Create the registration and all related records in a transaction
    const registration = await prisma.$transaction(async (tx) => {
      const registration = await tx.registration.create({
        data: {
          raceId: currentRace.id,
          type: validatedData.type,
          teamName: validatedData.teamName,
          pricePerPerson: validatedData.pricePerPerson,
          totalAmount: validatedData.totalAmount,
          participants: {
            create: validatedData.participants.map((participant) => ({
              firstName: participant.firstName,
              lastName: participant.lastName,
              email: participant.email,
              phoneNumber: participant.phoneNumber,
              venmoUsername: participant.venmoUsername || null,
              emergencyContact: {
                create: participant.emergencyContact,
              },
              addOns: {
                create: participant.addOns.map((addon) => ({
                  addOn: { connect: { id: addon.addOnId } },
                  size: addon.size,
                })),
              },
            })),
          },
        },
        include: {
          participants: {
            include: {
              addOns: {
                include: {
                  addOn: true,
                },
              },
              emergencyContact: true,
            },
          },
          race: {
            select: {
              name: true,
              year: true,
            },
          },
        },
      });

      return registration;
    });

    return NextResponse.json({ id: registration.id }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create registration" },
      { status: 500 }
    );
  }
}
