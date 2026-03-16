import { useMutation } from "@tanstack/react-query";
import { extractApiError } from "../utils/extract-api-error";
import type { AuthResponse, RegisterFormValues } from "../types/auth.types";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (values: RegisterFormValues): Promise<AuthResponse> => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(extractApiError(data, "Registration failed"));
      return data;
    },
  });
}
