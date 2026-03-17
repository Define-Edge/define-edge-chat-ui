import { useMutation } from "@tanstack/react-query";
import { extractApiError } from "../utils/extract-api-error";
import type { AuthLoginResponse, LoginFormValues } from "../types/auth.types";

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (values: LoginFormValues): Promise<AuthLoginResponse> => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(extractApiError(data, "Login failed"));
      return data;
    },
  });
}
