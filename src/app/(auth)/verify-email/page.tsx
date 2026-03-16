"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useVerifyEmailMutation, useResendOtpMutation } from "@/modules/auth";
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from "@/modules/auth/types/auth.types";

const RESEND_COOLDOWN = 60;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendOtpMutation();

  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email, token: "" },
  });

  const tokenValue = watch("token");

  // Keep email in sync with search params
  useEffect(() => {
    if (email) setValue("email", email);
  }, [email, setValue]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(
      () => setResendCountdown((c) => c - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const onSubmit = (values: VerifyEmailFormValues) => {
    verifyMutation.mutate(values, {
      onSuccess: () => router.push("/"),
    });
  };

  const handleResend = useCallback(() => {
    if (resendCountdown > 0 || !email) return;
    setResendMessage(null);

    resendMutation.mutate(email, {
      onSuccess: () => {
        setResendMessage("Verification code sent!");
        setResendCountdown(RESEND_COOLDOWN);
      },
    });
  }, [email, resendCountdown, resendMutation]);

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

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-4">
          {verifyMutation.error && (
            <div className="rounded-md bg-error-bg px-3 py-2 text-sm text-error-fg">
              {verifyMutation.error.message}
            </div>
          )}

          {resendMutation.error && (
            <div className="rounded-md bg-error-bg px-3 py-2 text-sm text-error-fg">
              {resendMutation.error.message}
            </div>
          )}

          {resendMessage && (
            <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              {resendMessage}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="token">Verification code</Label>
            <Input
              id="token"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              autoFocus
              className="text-center text-lg tracking-[0.3em]"
              {...register("token")}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6);
                setValue("token", cleaned, { shouldValidate: true });
              }}
            />
            {errors.token && (
              <p className="text-xs text-error-fg">{errors.token.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="brand"
            className="w-full"
            disabled={verifyMutation.isPending || tokenValue.length !== 6}
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify email"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              disabled={resendCountdown > 0 || resendMutation.isPending}
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
