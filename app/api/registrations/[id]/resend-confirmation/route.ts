import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: params.id },
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

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    await sendConfirmationEmail({ registration });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to resend confirmation email:", error);
    return NextResponse.json(
      { error: "Failed to resend confirmation email" },
      { status: 500 }
    );
  }
}
