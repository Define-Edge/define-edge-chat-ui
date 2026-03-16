"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RESEND_COOLDOWN = 60;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(
      () => setResendCountdown((c) => c - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleResend = useCallback(async () => {
    if (resendCountdown > 0 || !email) return;
    setResendMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setResendMessage("Verification code sent!");
        setResendCountdown(RESEND_COOLDOWN);
      } else {
        const data = await res.json();
        setError(data.detail || data.error || "Failed to resend code");
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    }
  }, [email, resendCountdown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.error || "Verification failed");
        return;
      }

      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>
          {email ? (
            <>
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </>
          ) : (
            "Enter the 6-digit code sent to your email"
          )}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md bg-error-bg px-3 py-2 text-sm text-error-fg">
              {error}
            </div>
          )}

          {resendMessage && (
            <div className="rounded-md bg-success-bg px-3 py-2 text-sm text-success-fg">
              {resendMessage}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="token">Verification code</Label>
            <Input
              id="token"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={token}
              onChange={(e) =>
                setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
              autoFocus
              className="text-center text-lg tracking-[0.3em]"
            />
          </div>

          <Button
            type="submit"
            variant="brand"
            className="w-full"
            disabled={isSubmitting || token.length !== 6}
          >
            {isSubmitting ? "Verifying..." : "Verify email"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              disabled={resendCountdown > 0}
              onClick={handleResend}
              className="text-sm"
            >
              {resendCountdown > 0
                ? `Resend code in ${resendCountdown}s`
                : "Resend code"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
