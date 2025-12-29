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

      if ("error" in createConsentReqRes) throw createConsentReqRes;

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
      }
    },
  });
}
