"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, XCircle } from "lucide-react";

type ConsentFailedRedirectProps = {
  status: "rejected" | "failed";
  redirectDelay?: number;
};

export function ConsentFailedRedirect({
  status,
  redirectDelay = 5,
}: ConsentFailedRedirectProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(redirectDelay);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/import");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  const isRejected = status === "rejected";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          {isRejected ? (
            <XCircle className="h-16 w-16 text-orange-500" />
          ) : (
            <AlertCircle className="h-16 w-16 text-destructive" />
          )}
        </div>

        <h1 className="mb-2 text-xl font-semibold text-foreground">
          {isRejected ? "Consent Rejected" : "Something Went Wrong"}
        </h1>

        <p className="mb-6 text-muted-foreground">
          {isRejected
            ? "You have rejected the consent request. No data will be imported from your account."
            : "An error occurred while processing your consent. Please try again."}
        </p>

        <div className="mb-4 text-sm text-muted-foreground">
          Redirecting to import page in{" "}
          <span className="font-medium text-foreground">{countdown}</span>{" "}
          {countdown === 1 ? "second" : "seconds"}...
        </div>

        <button
          onClick={() => router.push("/import")}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Go to Import Page Now
        </button>
      </div>
    </div>
  );
}
