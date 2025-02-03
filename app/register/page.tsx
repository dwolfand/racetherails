"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

enum Size {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

enum RegistrationType {
  INDIVIDUAL = "INDIVIDUAL",
  TEAM = "TEAM",
}

interface AddOn {
  id: string;
  name: string;
  description: string | null;
  price: number;
  requiresSize: boolean;
}

interface PricingTier {
  id: string;
  price: number;
  name: string;
}

// Create a constant for the common input styles
const inputStyles =
  "mt-1 block w-full rounded-md border-gray-400 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:bg-white";
const selectStyles =
  "block w-full rounded-md border-gray-400 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:bg-white";

export default function RegisterPage() {
  const router = useRouter();
  const [registrationType, setRegistrationType] = useState<RegistrationType>(
    RegistrationType.INDIVIDUAL
  );
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [currentPricingTier, setCurrentPricingTier] =
    useState<PricingTier | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    teamName: "",
    participants: [
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        venmoUsername: "",
        selectedAddOns: [] as { addOnId: string; size: Size | null }[],
        emergencyContact: {
          name: "",
          relationship: "",
          phoneNumber: "",
        },
      },
    ],
  });

  useEffect(() => {
    // Fetch available add-ons and current pricing tier
    const fetchRaceData = async () => {
      setIsLoadingPricing(true);
      try {
        const [addOnsResponse, pricingResponse] = await Promise.all([
          fetch("/api/addons"),
          fetch(`/api/pricing-tier?type=${registrationType}`),
        ]);

        const addOnsData = await addOnsResponse.json();
        const pricingData = await pricingResponse.json();

        if (addOnsResponse.ok) {
          setAddOns(addOnsData);
        }

        if (pricingResponse.ok) {
          setCurrentPricingTier(pricingData);
        } else {
          console.error("Error fetching pricing tier:", pricingData);
          setCurrentPricingTier(null);
        }
      } catch (error) {
        console.error("Error fetching race data:", error);
        setCurrentPricingTier(null);
      } finally {
        setIsLoadingPricing(false);
      }
    };

    fetchRaceData();
  }, [registrationType]);

  const calculateTotalAmount = () => {
    if (!currentPricingTier) return 0;

    const baseAmount = currentPricingTier.price * formData.participants.length;

    const addOnsAmount = formData.participants.reduce((total, participant) => {
      return (
        total +
        participant.selectedAddOns.reduce((addOnTotal, selectedAddOn) => {
          const addOn = addOns.find((a) => a.id === selectedAddOn.addOnId);
          return addOnTotal + (addOn?.price || 0);
        }, 0)
      );
    }, 0);

    return baseAmount + addOnsAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPricingTier) {
      alert("Unable to determine pricing. Please try again later.");
      return;
    }

    // Add team size validation
    if (registrationType === RegistrationType.TEAM) {
      if (formData.participants.length < 2) {
        alert("Teams must have at least 2 members");
        return;
      }
      if (formData.participants.length > 6) {
        alert("Teams cannot have more than 6 members");
        return;
      }
    }

    // Validate t-shirt sizes
    const missingTShirtSizes = formData.participants.some((participant) => {
      return participant.selectedAddOns.some((addon) => {
        const addOnDetails = addOns.find((a) => a.id === addon.addOnId);
        return addOnDetails?.requiresSize && !addon.size;
      });
    });

    if (missingTShirtSizes) {
      alert("Please select a size for all t-shirt add-ons");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: registrationType,
          teamName: registrationType === "TEAM" ? formData.teamName : null,
          pricePerPerson: currentPricingTier.price,
          totalAmount: calculateTotalAmount(),
          participants: formData.participants.map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email,
            phoneNumber: p.phoneNumber,
            venmoUsername: p.venmoUsername,
            addOns: p.selectedAddOns,
            emergencyContact: p.emergencyContact,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/registration-confirmation/${data.id}`);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addParticipant = () => {
    if (
      registrationType === RegistrationType.TEAM &&
      formData.participants.length >= 6
    ) {
      alert("Teams cannot have more than 6 members");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      participants: [
        ...prev.participants,
        {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          venmoUsername: "",
          selectedAddOns: [],
          emergencyContact: {
            name: "",
            relationship: "",
            phoneNumber: "",
          },
        },
      ],
    }));
  };

  const handleAddOnChange = (
    participantIndex: number,
    addOnId: string,
    size: Size | null = null
  ) => {
    const newParticipants = [...formData.participants];
    const participant = newParticipants[participantIndex];

    const existingAddOnIndex = participant.selectedAddOns.findIndex(
      (a) => a.addOnId === addOnId
    );

    // If we're changing the size of an existing add-on
    if (size !== null && existingAddOnIndex >= 0) {
      participant.selectedAddOns[existingAddOnIndex].size = size;
    }
    // If we're toggling the add-on checkbox
    else if (size === null) {
      if (existingAddOnIndex >= 0) {
        participant.selectedAddOns.splice(existingAddOnIndex, 1);
      } else {
        participant.selectedAddOns.push({ addOnId, size: null });
      }
    }

    setFormData({ ...formData, participants: newParticipants });
  };

  // Add the remove participant function
  const removeParticipant = (index: number) => {
    if (
      registrationType === RegistrationType.TEAM &&
      formData.participants.length <= 2
    ) {
      alert("Teams must have at least 2 members");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-700 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            Race Registration
          </h1>

          <div className="mb-6 text-center">
            {isLoadingPricing ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-gray-600">Loading pricing...</p>
              </div>
            ) : currentPricingTier ? (
              <>
                <p className="text-lg font-medium text-gray-900">
                  Current Pricing: {currentPricingTier.name}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${currentPricingTier.price} per person
                </p>
              </>
            ) : (
              <p className="text-red-600">
                Unable to load pricing. Please try again later.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Registration Type Selection */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-700">
                Registration Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={async () => {
                    setRegistrationType(RegistrationType.INDIVIDUAL);
                    // Reset to single participant for individual registration
                    setFormData((prev) => ({
                      ...prev,
                      teamName: "",
                      participants: [prev.participants[0]],
                    }));
                  }}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    registrationType === RegistrationType.INDIVIDUAL
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setRegistrationType(RegistrationType.TEAM);
                    // Ensure minimum of 2 participants for team registration
                    if (formData.participants.length < 2) {
                      setFormData((prev) => ({
                        ...prev,
                        participants: [
                          ...prev.participants,
                          {
                            firstName: "",
                            lastName: "",
                            email: "",
                            phoneNumber: "",
                            venmoUsername: "",
                            selectedAddOns: [],
                            emergencyContact: {
                              name: "",
                              relationship: "",
                              phoneNumber: "",
                            },
                          },
                        ],
                      }));
                    }
                  }}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    registrationType === RegistrationType.TEAM
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Team (2-6 members)
                </button>
              </div>
            </div>

            {/* Team Name (only for team registrations) */}
            {registrationType === RegistrationType.TEAM && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  className={inputStyles}
                  value={formData.teamName}
                  onChange={(e) =>
                    setFormData({ ...formData, teamName: e.target.value })
                  }
                />
              </div>
            )}

            {/* Participants */}
            {formData.participants.map((participant, index) => (
              <div key={index} className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {registrationType === "TEAM"
                      ? `Team Member ${index + 1}`
                      : "Participant Information"}
                  </h3>
                  {registrationType === RegistrationType.TEAM && index >= 2 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className={inputStyles}
                      value={participant.firstName}
                      onChange={(e) => {
                        const newParticipants = [...formData.participants];
                        newParticipants[index].firstName = e.target.value;
                        setFormData({
                          ...formData,
                          participants: newParticipants,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className={inputStyles}
                      value={participant.lastName}
                      onChange={(e) => {
                        const newParticipants = [...formData.participants];
                        newParticipants[index].lastName = e.target.value;
                        setFormData({
                          ...formData,
                          participants: newParticipants,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className={inputStyles}
                      value={participant.email}
                      onChange={(e) => {
                        const newParticipants = [...formData.participants];
                        newParticipants[index].email = e.target.value;
                        setFormData({
                          ...formData,
                          participants: newParticipants,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      className={inputStyles}
                      value={participant.phoneNumber}
                      onChange={(e) => {
                        const newParticipants = [...formData.participants];
                        newParticipants[index].phoneNumber = e.target.value;
                        setFormData({
                          ...formData,
                          participants: newParticipants,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Venmo Username
                    </label>
                    <div className="mt-1">
                      <p className="text-sm text-gray-500 mb-2">
                        Optional. If provided, we'll send you a Venmo payment
                        request for easy payment processing.
                      </p>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">@</span>
                        </div>
                        <input
                          type="text"
                          className={`${inputStyles} pl-7`}
                          value={participant.venmoUsername}
                          onChange={(e) => {
                            const newParticipants = [...formData.participants];
                            newParticipants[index].venmoUsername =
                              e.target.value;
                            setFormData({
                              ...formData,
                              participants: newParticipants,
                            });
                          }}
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add-ons Section */}
                {addOns.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Add-ons
                    </h4>
                    <div className="space-y-4">
                      {addOns.map((addOn) => (
                        <div key={addOn.id} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              checked={participant.selectedAddOns.some(
                                (a) => a.addOnId === addOn.id
                              )}
                              onChange={() =>
                                handleAddOnChange(index, addOn.id)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label className="font-medium text-gray-700">
                              {addOn.name} - ${addOn.price}
                            </label>
                            {addOn.description && (
                              <p className="text-gray-500">
                                {addOn.description}
                              </p>
                            )}
                            {addOn.requiresSize && (
                              <div className="mt-1">
                                <select
                                  className={`${selectStyles} ${
                                    participant.selectedAddOns.some(
                                      (a) => a.addOnId === addOn.id
                                    )
                                      ? ""
                                      : "bg-gray-100"
                                  }`}
                                  value={
                                    participant.selectedAddOns.find(
                                      (a) => a.addOnId === addOn.id
                                    )?.size || ""
                                  }
                                  onChange={(e) =>
                                    handleAddOnChange(
                                      index,
                                      addOn.id,
                                      e.target.value as Size
                                    )
                                  }
                                  disabled={
                                    !participant.selectedAddOns.some(
                                      (a) => a.addOnId === addOn.id
                                    )
                                  }
                                  required={participant.selectedAddOns.some(
                                    (a) => a.addOnId === addOn.id
                                  )}
                                >
                                  <option value="">
                                    Select Size (Required)
                                  </option>
                                  {Object.values(Size).map((size) => (
                                    <option key={size} value={size}>
                                      {size}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        className={inputStyles}
                        value={participant.emergencyContact.name}
                        onChange={(e) => {
                          const newParticipants = [...formData.participants];
                          newParticipants[index].emergencyContact.name =
                            e.target.value;
                          setFormData({
                            ...formData,
                            participants: newParticipants,
                          });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Relationship
                      </label>
                      <input
                        type="text"
                        required
                        className={inputStyles}
                        value={participant.emergencyContact.relationship}
                        onChange={(e) => {
                          const newParticipants = [...formData.participants];
                          newParticipants[index].emergencyContact.relationship =
                            e.target.value;
                          setFormData({
                            ...formData,
                            participants: newParticipants,
                          });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        className={inputStyles}
                        value={participant.emergencyContact.phoneNumber}
                        onChange={(e) => {
                          const newParticipants = [...formData.participants];
                          newParticipants[index].emergencyContact.phoneNumber =
                            e.target.value;
                          setFormData({
                            ...formData,
                            participants: newParticipants,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Total Amount Display */}
            <div className="border-t pt-6">
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">
                  Total Amount: ${calculateTotalAmount().toFixed(2)}
                </p>
              </div>
            </div>

            {/* Add Team Member button (only for team registrations) */}
            {registrationType === RegistrationType.TEAM && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-gray-600">
                  Current team size: {formData.participants.length} members
                </p>
                {formData.participants.length < 6 && (
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Team Member
                  </button>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-rtr-bronze text-rtr-dark px-8 py-3 rounded-lg hover:bg-rtr-gold transition-colors font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? "cursor-wait" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-rtr-dark"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
