"use client";
import { getAllFiData } from "@/lib/moneyone/moneyone.actions";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { getUserConsent } from "@/lib/moneyone/moneyone.storage";
import { useMutation } from "@tanstack/react-query";

export function useCheckConsentMut(consentType: ConsentType) {
  return useMutation({
    mutationFn: async () => {
      // Check localStorage for existing consent
      const consent = getUserConsent(consentType);

      if (!consent) {
        // No consent found, return null to trigger modal
        return null;
      }

      console.log("Found existing consent:", consent);

      // If consent exists and data is ready, fetch FI data
      if (consent.isDataReady) {
        console.log("Data is ready, fetching FI data for consentID:", consent.consentID);

        const fiData = await getAllFiData(consent.consentID);

        if ("error" in fiData) {
          throw new Error(fiData.error);
        }

        // Log raw holdings data
        console.log("Raw holdings data:", fiData);

        return fiData
      }

      // Consent exists but data not ready yet
      console.log("Consent found but data not ready yet");
      return null;
    },
  });
}
