import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type PaymentStatus = "PENDING" | "COMPLETED" | "CANCELLED";

interface ParticipantAddOn {
  id: string;
  addOn: {
    name: string;
    description: string | null;
    price: number;
    requiresSize: boolean;
  };
  size: string | null;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  venmoUsername: string | null;
  paymentStatus: PaymentStatus;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  } | null;
  addOns: ParticipantAddOn[];
}

interface Registration {
  id: string;
  type: "INDIVIDUAL" | "TEAM";
  teamName: string | null;
  totalAmount: number;
  pricePerPerson: number;
  participants: Participant[];
  race: {
    name: string;
    year: number;
  };
}

// Helper function to determine overall payment status
function getOverallPaymentStatus(participants: Participant[]): PaymentStatus {
  if (participants.every((p) => p.paymentStatus === "COMPLETED")) {
    return "COMPLETED";
  }
  if (participants.some((p) => p.paymentStatus === "CANCELLED")) {
    return "CANCELLED";
  }
  return "PENDING";
}

export default async function RegistrationConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const registration = (await prisma.registration.findUnique({
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
  })) as Registration | null;

  if (!registration) {
    notFound();
  }

  const paymentStatus = getOverallPaymentStatus(registration.participants);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Registration Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for registering for {registration.race.name}{" "}
              {registration.race.year}
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block">
              <p className="text-sm text-gray-600">Confirmation Number</p>
              <p className="text-xl font-mono font-bold text-blue-600">
                {registration.id}
              </p>
              <div
                className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  paymentStatus === "PAID"
                    ? "bg-green-100 text-green-800"
                    : paymentStatus === "PARTIAL"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                Payment Status:{" "}
                {paymentStatus === "PAID"
                  ? "Completed"
                  : paymentStatus === "PARTIAL"
                  ? "Partially Paid"
                  : "Pending"}
              </div>
            </div>
          </div>

          {paymentStatus !== "PAID" && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                Payment Required
              </h3>
              <p className="text-yellow-700 mb-4">
                Your registration is not finalized until payment is received.
                Please send your payment via Venmo to:
              </p>
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <a
                  href={`https://venmo.com/jenniferjli?txn=pay&note=Race%20The%20Rails%20Registration%20${registration.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-lg text-center mb-2 block hover:text-blue-600 transition-colors"
                >
                  @jenniferjli
                </a>
                <p className="text-sm text-gray-600 text-center">
                  Please include your confirmation number ({registration.id}) in
                  the payment note.
                </p>
              </div>
              <p className="mt-4 text-sm text-yellow-700 text-center">
                If you need to use a different payment method, please email{" "}
                <a
                  href="mailto:racetherails@gmail.com"
                  className="text-yellow-800 underline hover:text-yellow-900"
                >
                  racetherails@gmail.com
                </a>
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Registration Details</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="text-sm text-gray-900">{registration.type}</dd>
              </div>
              {registration.teamName && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Team Name
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {registration.teamName}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Participants</h2>
            <div className="space-y-6">
              {registration.participants.map(
                (participant: Participant, index: number) => {
                  // Calculate participant's total amount
                  const addOnsTotal = participant.addOns.reduce(
                    (total, addon) => {
                      return total + addon.addOn.price;
                    },
                    0
                  );
                  const participantTotal =
                    registration.pricePerPerson + addOnsTotal;

                  return (
                    <div
                      key={participant.id}
                      className="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {registration.type === "TEAM"
                          ? `Team Member ${index + 1}`
                          : "Participant"}
                      </h3>
                      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Name
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {participant.firstName} {participant.lastName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Email
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {participant.email}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Phone
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {participant.phoneNumber}
                          </dd>
                        </div>
                        {participant.venmoUsername && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Venmo Username
                            </dt>
                            <dd className="text-sm text-gray-900">
                              @{participant.venmoUsername}
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Emergency Contact
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {participant.emergencyContact?.name} (
                            {participant.emergencyContact?.relationship}) -{" "}
                            {participant.emergencyContact?.phoneNumber}
                          </dd>
                        </div>
                        {participant.addOns.length > 0 && (
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Add-ons
                            </dt>
                            <dd className="text-sm text-gray-900">
                              <ul className="list-disc pl-5 mt-1">
                                {participant.addOns.map((addon) => (
                                  <li key={addon.id}>
                                    {addon.addOn.name} ($
                                    {addon.addOn.price.toFixed(2)})
                                    {addon.size && ` - Size: ${addon.size}`}
                                  </li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                        )}
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Payment Status
                          </dt>
                          <dd className="text-sm text-gray-900">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                participant.paymentStatus === "PAID"
                                  ? "bg-green-100 text-green-800"
                                  : participant.paymentStatus === "PARTIAL"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {participant.paymentStatus === "PAID"
                                ? "Paid"
                                : participant.paymentStatus === "PARTIAL"
                                ? "Partially Paid"
                                : "Payment Pending"}
                            </span>
                          </dd>
                        </div>
                        {participant.paymentStatus !== "PAID" && (
                          <div className="sm:col-span-2 mt-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-sm font-medium text-yellow-800">
                                Amount Due:
                              </p>
                              <ul className="list-disc pl-5 mt-1 text-sm text-yellow-700">
                                <li>
                                  Registration Fee: $
                                  {registration.pricePerPerson.toFixed(2)}
                                </li>
                                {addOnsTotal > 0 && (
                                  <li>
                                    Add-ons Total: ${addOnsTotal.toFixed(2)}
                                  </li>
                                )}
                                <li className="font-bold mt-2">
                                  Total Due: ${participantTotal.toFixed(2)}
                                </li>
                              </ul>
                              <div className="mt-3">
                                <a
                                  href={`https://venmo.com/jenniferjli?txn=pay&note=Race%20The%20Rails%20Registration%20${registration.id}&amount=${participantTotal}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  Pay with Venmo →
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </dl>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Please save your confirmation number for your records.</p>
            <p className="mt-2">
              We will send a confirmation email with these details to all
              participants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
