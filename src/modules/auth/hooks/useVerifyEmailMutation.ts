import { useMutation } from "@tanstack/react-query";
import { extractApiError } from "../utils/extract-api-error";
import type { AuthResponse, VerifyEmailFormValues } from "../types/auth.types";

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: async (
      values: VerifyEmailFormValues,
    ): Promise<AuthResponse> => {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(extractApiError(data, "Verification failed"));
      return data;
    },
  });
}
