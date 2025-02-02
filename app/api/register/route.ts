import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClient, Prisma } from "@prisma/client";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

type RegistrationType = "INDIVIDUAL" | "TEAM";

interface ParticipantAddOn {
  addOnId: string;
  size: string | null;
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
  dateOfBirth: string;
  venmoUsername: string;
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

export async function POST(request: Request) {
  try {
    const body: RegistrationRequest = await request.json();

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
        currentParticipantCount + body.participants.length >
        currentRace.maxParticipants
      ) {
        return NextResponse.json({ error: "Race is full" }, { status: 400 });
      }
    }

    // Create the registration and all related records in a transaction
    const registration = await prisma.$transaction(
      async (tx: TransactionClient) => {
        // Create the registration
        const registration = await tx.registration.create({
          data: {
            raceId: currentRace.id,
            type: body.type,
            teamName: body.teamName,
            pricePerPerson: body.pricePerPerson,
            totalAmount: body.totalAmount,
          },
        });

        // Create participants and their related records
        for (const participantData of body.participants) {
          // Create the participant
          const participant = await tx.participant.create({
            data: {
              registrationId: registration.id,
              firstName: participantData.firstName,
              lastName: participantData.lastName,
              email: participantData.email,
              phoneNumber: participantData.phoneNumber,
              dateOfBirth: new Date(participantData.dateOfBirth),
              venmoUsername: participantData.venmoUsername,
              // Create emergency contact
              emergencyContact: {
                create: {
                  name: participantData.emergencyContact.name,
                  relationship: participantData.emergencyContact.relationship,
                  phoneNumber: participantData.emergencyContact.phoneNumber,
                },
              },
            },
          });

          // Create participant add-ons
          if (participantData.addOns.length > 0) {
            await tx.participantAddOn.createMany({
              data: participantData.addOns.map((addOn) => ({
                participantId: participant.id,
                addOnId: addOn.addOnId,
                size: addOn.size,
              })),
            });
          }
        }

        return registration;
      }
    );

    return NextResponse.json({ id: registration.id }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create registration" },
      { status: 500 }
    );
  }
}
