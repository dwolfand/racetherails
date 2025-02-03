"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AddOn {
  id: string;
  name: string;
  price: number;
  size: string | null;
  addOn: {
    name: string;
    price: number;
  };
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  venmoUsername: string | null;
  paymentStatus: "PENDING" | "COMPLETED" | "CANCELLED";
  addOns: AddOn[];
}

interface Registration {
  id: string;
  createdAt: string;
  type: "INDIVIDUAL" | "TEAM";
  teamName: string | null;
  totalAmount: number;
  pricePerPerson: number;
  notes: string | null;
  race: {
    name: string;
    year: number;
  };
  participants: Participant[];
}

export default function AdminPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string>("");
  const [accessKey, setAccessKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>(
    {}
  );
  const [savingNotes, setSavingNotes] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    // Check for stored credentials
    const storedName = localStorage.getItem("adminName");
    const storedKey = localStorage.getItem("adminAccessKey");
    if (storedName && storedKey) {
      setAdminName(storedName);
      setAccessKey(storedKey);
      setIsAuthenticated(true);
      fetchRegistrations(storedKey);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchRegistrations = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/registrations", {
        headers: {
          Authorization: `Bearer ${key}`,
          "X-Admin-Name": adminName,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem("adminName");
          localStorage.removeItem("adminAccessKey");
          throw new Error("Invalid access key");
        }
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      setRegistrations(data);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName || !accessKey) {
      setError("Please enter both name and access key");
      return;
    }

    localStorage.setItem("adminName", adminName);
    localStorage.setItem("adminAccessKey", accessKey);
    await fetchRegistrations(accessKey);
  };

  const updatePaymentStatus = async (
    participantId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(
        `/api/admin/participants/${participantId}/payment-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessKey}`,
            "X-Admin-Name": adminName,
          },
          body: JSON.stringify({ paymentStatus: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      // Refresh registrations
      await fetchRegistrations(accessKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const startEditingNotes = (
    registrationId: string,
    currentNotes: string | null
  ) => {
    setEditingNotes({
      ...editingNotes,
      [registrationId]: currentNotes || "",
    });
  };

  const updateNotes = async (registrationId: string) => {
    setSavingNotes({ ...savingNotes, [registrationId]: true });
    try {
      const response = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessKey}`,
          "X-Admin-Name": adminName,
        },
        body: JSON.stringify({
          id: registrationId,
          notes: editingNotes[registrationId],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notes");
      }

      // Refresh registrations
      await fetchRegistrations(accessKey);
      // Clear editing state
      const newEditingNotes = { ...editingNotes };
      delete newEditingNotes[registrationId];
      setEditingNotes(newEditingNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSavingNotes({ ...savingNotes, [registrationId]: false });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Access Key
                </label>
                <input
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Registrations</h1>
            <button
              onClick={() => {
                localStorage.removeItem("adminName");
                localStorage.removeItem("adminAccessKey");
                setIsAuthenticated(false);
                setAdminName("");
                setAccessKey("");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.race.name} {registration.race.year}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.type}
                        {registration.teamName && ` - ${registration.teamName}`}
                      </div>
                      <Link
                        href={`/registration-confirmation/${registration.id}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2 inline-block"
                      >
                        View Confirmation Page ↗
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {registration.participants.map((participant) => {
                          // Calculate participant's total including add-ons
                          const addOnsTotal = participant.addOns.reduce(
                            (sum, addon) => sum + addon.addOn.price,
                            0
                          );
                          const participantTotal =
                            registration.pricePerPerson + addOnsTotal;

                          return (
                            <div
                              key={participant.id}
                              className="text-sm text-gray-900 border-b border-gray-100 pb-2"
                            >
                              <div className="font-medium">
                                {participant.firstName} {participant.lastName}
                              </div>
                              <div className="text-gray-500">
                                {participant.email}
                              </div>
                              <div className="text-gray-500">
                                Registration: $
                                {registration.pricePerPerson.toFixed(2)}
                                {addOnsTotal > 0 && (
                                  <>
                                    {" + "}Add-ons: ${addOnsTotal.toFixed(2)}
                                  </>
                                )}
                                <div className="font-medium">
                                  Total: ${participantTotal.toFixed(2)}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <select
                                  value={participant.paymentStatus}
                                  onChange={(e) =>
                                    updatePaymentStatus(
                                      participant.id,
                                      e.target.value
                                    )
                                  }
                                  className="text-sm border rounded p-1"
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="COMPLETED">Completed</option>
                                  <option value="CANCELLED">Cancelled</option>
                                </select>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    participant.paymentStatus === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : participant.paymentStatus ===
                                        "CANCELLED"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {participant.paymentStatus.toLowerCase()}
                                </span>
                              </div>
                              {participant.addOns.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Add-ons:{" "}
                                  {participant.addOns
                                    .map(
                                      (addon) =>
                                        `${addon.addOn.name}${
                                          addon.size ? ` (${addon.size})` : ""
                                        } - $${addon.addOn.price.toFixed(2)}`
                                    )
                                    .join(", ")}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>Total: ${registration.totalAmount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {editingNotes[registration.id] !== undefined ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingNotes[registration.id]}
                            onChange={(e) =>
                              setEditingNotes({
                                ...editingNotes,
                                [registration.id]: e.target.value,
                              })
                            }
                            className="w-full min-h-[100px] text-sm border rounded-md p-2"
                            placeholder="Add notes..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateNotes(registration.id)}
                              disabled={savingNotes[registration.id]}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                              {savingNotes[registration.id]
                                ? "Saving..."
                                : "Save"}
                            </button>
                            <button
                              onClick={() => {
                                const newEditingNotes = { ...editingNotes };
                                delete newEditingNotes[registration.id];
                                setEditingNotes(newEditingNotes);
                              }}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            startEditingNotes(
                              registration.id,
                              registration.notes
                            )
                          }
                          className="cursor-pointer hover:bg-gray-50 p-2 rounded-md min-h-[100px]"
                        >
                          {registration.notes || "Click to add notes..."}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
