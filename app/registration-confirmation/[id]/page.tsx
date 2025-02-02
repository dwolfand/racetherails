import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

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
  dateOfBirth: Date;
  venmoUsername: string | null;
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
            </div>
          </div>

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
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Total Amount
                </dt>
                <dd className="text-sm text-gray-900">
                  ${registration.totalAmount.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Price Per Person
                </dt>
                <dd className="text-sm text-gray-900">
                  ${registration.pricePerPerson.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Participants</h2>
            <div className="space-y-6">
              {registration.participants.map(
                (participant: Participant, index: number) => (
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
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Date of Birth
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(
                            participant.dateOfBirth
                          ).toLocaleDateString()}
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
                                  {addon.addOn.name}
                                  {addon.size && ` - Size: ${addon.size}`}
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Emergency Contact
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {participant.emergencyContact?.name} (
                          {participant.emergencyContact?.relationship}) -{" "}
                          {participant.emergencyContact?.phoneNumber}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )
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
