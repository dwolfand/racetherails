"use client";

import { useState } from "react";

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 inline-block"
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
  );
}

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
        } font-medium focus:outline-none focus:underline transition-colors inline-flex items-center`}
      >
        {isLoading && <SpinnerIcon />}
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
