"use client";

import { useState } from "react";

export function ResendConfirmationButton({
  registrationId,
  participantEmail,
}: {
  registrationId: string;
  participantEmail: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleResend = async () => {
    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await fetch(
        `/api/registrations/${registrationId}/resend-confirmation`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend");
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error("Failed to resend confirmation:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000); // Reset after 3 seconds
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleResend}
        disabled={isLoading}
        className={`text-sm ${
          isLoading
            ? "text-gray-400"
            : status === "success"
            ? "text-green-600"
            : status === "error"
            ? "text-red-600"
            : "text-blue-600 hover:text-blue-800"
        } font-medium focus:outline-none focus:underline transition-colors`}
      >
        {isLoading
          ? "Sending..."
          : status === "success"
          ? "Email sent!"
          : status === "error"
          ? "Failed to send - try again"
          : "Resend confirmation email"}
      </button>
    </div>
  );
}
