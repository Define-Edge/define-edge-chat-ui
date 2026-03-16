import { useMutation } from "@tanstack/react-query";
import { extractApiError } from "../utils/extract-api-error";
import type { AuthResponse } from "../types/auth.types";

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: async (email: string): Promise<AuthResponse> => {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(extractApiError(data, "Failed to resend code"));
      return data;
    },
  });
}
