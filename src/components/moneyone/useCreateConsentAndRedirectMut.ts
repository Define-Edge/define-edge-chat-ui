"use client";
import { createConsentRequestV3 } from "@/lib/moneyone/moneyone.actions";
import { getUserId } from "@/lib/moneyone/moneyone.storage";
import {
  createNewConsentFormSchema,
  CreateNewConsentFormValues,
} from "@/lib/moneyone/moneyone.types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useImportHoldingsContext } from "./import-holdings.context";
import { useQueryState } from "nuqs";

export function useCreateConsentAndRedirectMut() {
  const { consentType } = useImportHoldingsContext();
  const [threadId] = useQueryState("threadId");

  return useMutation({
    mutationFn: async (input: CreateNewConsentFormValues) => {
      const formValues = createNewConsentFormSchema.parse(input);
      const userId = getUserId();

      // Construct redirect URL with accountID and optional threadId in the path
      // Pattern: /moneyone/{consentType}~{accountID} or /moneyone/{consentType}~{accountID}~{threadId}
      // Using ~ as delimiter since accountID and threadID may contain dashes
      const redirectPath = threadId
        ? `/moneyone/${consentType}~${userId}~${threadId}`
        : `/moneyone/${consentType}~${userId}`;

      const redirectUrl = new URL(redirectPath, window.location.origin);

      // V3 API combines consent creation + encrypted URL generation
      const createConsentReqRes = await createConsentRequestV3(
        formValues.number,
        consentType,
        userId,
        formValues.pan,
        redirectUrl.toString()
      );

      if ("error" in createConsentReqRes) {
        throw new Error(createConsentReqRes.error);
      }

      // New consent created
      if (createConsentReqRes?.status === "success") {
        const consentHandle = createConsentReqRes.data.consent_handle;
        const webRedirectionUrl = createConsentReqRes.data.webRedirectionUrl;

        // IMPORTANT: Store pending consent BEFORE redirecting
        // We'll save the full consent after redirect when we have the real consentID
        localStorage.setItem(
          `moneyone:pending-consent:${consentHandle}`,
          JSON.stringify({
            consentHandle,
            mobileNo: formValues.number,
            consentType,
            userId: userId,
            consentCreationData: new Date().toISOString(),
            consentExpiry: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
            name: formValues.number,
          })
        );

        toast.success("Consent created successfully, Redirecting to MoneyOne.");

        // Redirect to MoneyOne OAuth page
        window.location.href = webRedirectionUrl;
      } else {
        throw new Error("Failed to create consent. Please try again.");
      }
    },
    onError: (error: Error) => {
      // Log detailed error for debugging (only in development)
      if (process.env.NODE_ENV === "development") {
        console.error("Consent creation error:", error.message);
      }

      // Extract user-friendly error message
      const errorMessage = getConsentErrorMessage(error.message);
      toast.error(errorMessage, {
        description: "Please check your details and try again.",
        duration: 5000,
      });
    },
  });
}

/**
 * Extract user-friendly error message from MoneyOne API error
 */
function getConsentErrorMessage(errorMsg: string): string {
  // Handle specific MoneyOne error codes/messages
  if (errorMsg.includes("503")) {
    return "MoneyOne service is temporarily unavailable";
  }

  if (errorMsg.includes("InternalError") || errorMsg.includes("failed to generate consent")) {
    return "Unable to create consent at this time";
  }

  if (errorMsg.includes("Invalid") || errorMsg.includes("invalid")) {
    return "Invalid mobile number or PAN";
  }

  // Default error message
  return "Failed to create consent";
}
