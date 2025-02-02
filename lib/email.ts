import nodemailer from "nodemailer";
import { Registration, Participant, PrismaClient } from "@prisma/client";

type ParticipantWithAddOns = Participant & {
  addOns: {
    addOn: {
      name: string;
      price: number;
    };
    size: string | null;
  }[];
};

type RegistrationWithDetails = Registration & {
  participants: ParticipantWithAddOns[];
  race: {
    name: string;
    year: number;
  };
};

interface SendConfirmationEmailParams {
  registration: RegistrationWithDetails;
  shouldBcc?: boolean;
}

// Create a transporter using Gmail
console.log("Creating email transporter with config:", {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD ? "**present**" : "**missing**",
  },
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  debug: true, // Enable debug output
  logger: true, // Log information into console
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("Transporter verification error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export async function sendConfirmationEmail({
  registration,
  shouldBcc = true,
}: SendConfirmationEmailParams) {
  const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/registration-confirmation/${registration.id}`;

  // Send individual emails to each participant
  for (const participant of registration.participants) {
    const emailSubject =
      registration.type === "TEAM"
        ? `Race The Rails Team Registration Confirmation - ${registration.teamName}`
        : "Race The Rails Registration Confirmation";

    // Calculate individual total (base price + add-ons)
    const addOnsTotal = participant.addOns.reduce(
      (sum, addon) => sum + addon.addOn.price,
      0
    );
    const individualTotal = registration.pricePerPerson + addOnsTotal;

    // Create add-ons list if any
    const addOnsList = participant.addOns.length
      ? participant.addOns
          .map(
            (addon) =>
              `- ${addon.addOn.name}${
                addon.size ? ` (Size: ${addon.size})` : ""
              }: $${addon.addOn.price}`
          )
          .join("\n")
      : "None";

    // Create Venmo payment URL
    const venmoPaymentUrl = `https://venmo.com/jenniferjli?txn=pay&note=${encodeURIComponent(
      `Race The Rails Registration ${registration.id}`
    )}&amount=${individualTotal}`;

    const emailText = `
Hello ${participant.firstName}!

Thank you for registering for Race The Rails ${registration.race.year}!

PAYMENT REQUIRED - Your Total Amount Due: $${individualTotal}
Base Registration: $${registration.pricePerPerson}
Add-ons:
${addOnsList}

Please click here to pay via Venmo: ${venmoPaymentUrl}
${
  registration.type === "TEAM"
    ? `\nTeammates:
${registration.participants
  .filter((p) => p.id !== participant.id)
  .map((p) => `- ${p.firstName} ${p.lastName}`)
  .join("\n")}`
    : ""
}

You can view your full registration details at:
${confirmationUrl}

If you have any questions, please don't hesitate to reach out.

Best regards,
Race The Rails Team
`;

    const emailHtml = `
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
<h2>Hello ${participant.firstName}!</h2>

<p>Thank you for registering for Race The Rails ${registration.race.year}!</p>

<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 style="color: #dc3545; margin-top: 0;">Payment Required</h3>
  <p style="font-size: 18px; margin-bottom: 5px;"><strong>Your Total Amount Due: $${individualTotal}</strong></p>
  <div style="margin: 15px 0; padding-left: 15px; border-left: 3px solid #dee2e6;">
    <p style="margin: 5px 0;">Base Registration: $${
      registration.pricePerPerson
    }</p>
    <p style="margin: 5px 0;"><strong>Your Add-ons:</strong></p>
    ${
      participant.addOns.length
        ? `<ul style="margin: 5px 0;">
      ${participant.addOns
        .map(
          (addon) =>
            `<li>${addon.addOn.name}${
              addon.size ? ` (Size: ${addon.size})` : ""
            }: $${addon.addOn.price}</li>`
        )
        .join("")}
    </ul>`
        : '<p style="margin: 5px 0; font-style: italic;">None</p>'
    }
  </div>
  
  <div style="text-align: center; margin: 20px 0;">
    <a href="${venmoPaymentUrl}" 
       target="_blank"
       rel="noopener noreferrer"
       style="display: inline-block; background-color: #008CFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Pay with Venmo
    </a>
  </div>
</div>

${
  registration.type === "TEAM"
    ? `
<div style="margin: 20px 0;">
  <h3>Your Teammates</h3>
  <ul>
    ${registration.participants
      .filter((p) => p.id !== participant.id)
      .map((p) => `<li>${p.firstName} ${p.lastName}</li>`)
      .join("")}
  </ul>
</div>`
    : ""
}

<hr style="margin: 30px 0; border-top: 1px solid #dee2e6;">

<p style="font-size: 14px; color: #6c757d;">
  You can view your complete registration details at:<br>
  <a href="${confirmationUrl}" style="color: #6c757d;">${confirmationUrl}</a>
</p>

<p>If you have any questions, please don't hesitate to reach out.</p>

<p>Best regards,<br>
Race The Rails Team</p>
</div>
`;

    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: participant.email,
        ...(shouldBcc && { bcc: process.env.GMAIL_USER }),
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
    } catch (error) {
      console.error(
        `Error sending confirmation email to ${participant.email}:`,
        error
      );
    }
  }
}
