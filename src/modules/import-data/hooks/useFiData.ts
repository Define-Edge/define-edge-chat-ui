"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getAllFiData } from "@/lib/moneyone/moneyone.actions";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import {
  completePendingConsent,
  updateConsent,
} from "@/lib/moneyone/moneyone.storage";

// Shared constants for FI data queries
export const FI_DATA_QUERY_KEY = "fi-data";
export const FI_DATA_GC_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days
export const FI_DATA_STALE_TIME = Infinity; // Never refetch

/**
 * Hook for completing consent flow and fetching FI data
 * Handles the full consent completion workflow including:
 * - Completing pending consent with real consentID
 * - Fetching FI data from MoneyOne API
 * - Marking consent as ready
 * - Cleaning up URL parameters
 *
 * @param consentID - The consent ID from URL params
 * @param consentType - The consent type from URL params
 * @param onSuccess - Callback when data is successfully fetched
 * @returns Query result with FI data
 */
export function useFiDataConsentFlow(
  consentID: string | null,
  consentType: string | null,
  onSuccess?: () => void
) {
  const searchParams = useSearchParams();

  const query = useQuery({
    queryKey: consentID ? [FI_DATA_QUERY_KEY, consentID] : ["fi-data-disabled"],
    queryFn: async () => {
      if (!consentID || !consentType) {
        throw new Error("Invalid consent ID or consent type");
      }

      // Complete pending consent by saving with real consentID
      const mobileNo = searchParams.get("mobileNo");
      const consentCreationData = searchParams.get("consentCreationData");

      completePendingConsent(
        consentID,
        consentType as ConsentType,
        mobileNo,
        consentCreationData
      );

      const data = await getAllFiData(consentID, 3000);

      if ("error" in data) {
        throw new Error(data.error);
      }

      // Mark data as ready after successful fetch
      updateConsent(consentID, { isDataReady: true });
      console.log("Marked consent data as ready:", consentID);

      // Call success callback after a delay
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }

      // Remove search params from url
      const url = new URL(window.location.href);
      url.searchParams.delete("consentID");
      url.searchParams.delete("consentType");
      url.searchParams.delete("mobileNo");
      url.searchParams.delete("consentCreationData");
      history.pushState(null, "", url.toString());

      return data;
    },
    enabled:
      !!consentID &&
      !!consentType &&
      Object.values(ConsentType).includes(consentType as ConsentType),
    retry: true,
    retryDelay: 3000,
    refetchOnWindowFocus: false,
    gcTime: FI_DATA_GC_TIME,
    staleTime: FI_DATA_STALE_TIME,
  });

  return query;
}

/**
 * Hook for accessing FI data from cache or API
 * Simple data fetching hook that shares cache with useFiDataConsentFlow.
 * Use this when you just need to access FI data without consent flow logic.
 *
 * @param consentID - The consent ID to fetch FI data for
 * @param enabled - Whether the query should run
 * @returns Query result with FI data
 */
export function useFiData(
  consentID: string | null | undefined,
  enabled: boolean = true
) {
  const query = useQuery({
    queryKey: consentID ? [FI_DATA_QUERY_KEY, consentID] : ["fi-data-disabled"],
    queryFn: async () => {
      if (!consentID) {
        throw new Error("Invalid consent ID");
      }

      const data = await getAllFiData(consentID, 3000);

      if ("error" in data) {
        throw new Error(data.error);
      }

      return data;
    },
    enabled: enabled && !!consentID,
    retry: false,
    refetchOnWindowFocus: false,
    gcTime: FI_DATA_GC_TIME,
    staleTime: FI_DATA_STALE_TIME,
  });

  return query;
}
