"use client";
import {
  createConsentRequest,
  getEncryptedUrl
} from "@/lib/moneyone/moneyone.actions";
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

      const createConsentReqRes = await createConsentRequest(
        formValues.number,
        consentType,
        userId
      );

      if ("error" in createConsentReqRes) throw createConsentReqRes;

      // New consent created
      if (createConsentReqRes?.status === "success") {
        const consentHandle = createConsentReqRes.data.consent_handle;

        // Store pending consent info temporarily
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

        // Construct redirect URL with accountID and optional threadId in the path
        // Pattern: /moneyone/{consentType}~{accountID} or /moneyone/{consentType}~{accountID}~{threadId}
        // Using ~ as delimiter since accountID and threadID may contain dashes
        const redirectPath = threadId
          ? `/moneyone/${consentType}~${userId}~${threadId}`
          : `/moneyone/${consentType}~${userId}`;

        const redirectUrl = new URL(redirectPath, window.location.origin);

        toast.success("Consent created successfully, Redirecting to MoneyOne.");

        // getEncryptedUrl calls Next.js redirect() on success
        // If it returns with an error object, handle it
        const response = await getEncryptedUrl(
          consentHandle,
          redirectUrl.toString(),
          formValues.pan,
          consentType
        );

        // If we reach here, redirect didn't happen - check for errors
        if (response && "error" in response) {
          toast.error(response.error);
          throw new Error(response.error);
        }
      }
    },
  });
}
