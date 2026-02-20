"use client";
import { getAllFiData, requestFiData } from "@/lib/moneyone/moneyone.actions";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import {
  completePendingConsent,
  updateConsent,
} from "@/lib/moneyone/moneyone.storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Shared constants for FI data queries
export const FI_DATA_QUERY_KEY = "fi-data";
// Cache settings (gcTime: 7 days, staleTime: Infinity) are configured in QueryProvider via setQueryDefaults

/**
 * Hook for completing consent flow and fetching FI data
 * Handles the full consent completion workflow including:
 * - Completing pending consent with real consentID
 * - Fetching FI data from MoneyOne API
 * - Marking consent as ready
 * - Cleaning up URL parameters
 * - Managing modal state for fetch status display
 *
 * @returns Object with fetchStatus, modal state (modalOpen, handleClose, handleOpen), and query data
 */
export function useFiDataConsentFlow() {
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const consentCompletedRef = useRef<string | null>(null);

  const consentID = searchParams.get("consentID");
  const consentType = searchParams.get("consentType");

  const isEnabled =
    !!consentID &&
    !!consentType &&
    Object.values(ConsentType).includes(consentType as ConsentType);

  // Complete pending consent once before the query runs (not inside queryFn)
  useEffect(() => {
    if (
      isEnabled &&
      consentID &&
      consentType &&
      consentCompletedRef.current !== consentID
    ) {
      consentCompletedRef.current = consentID;
      const mobileNo = searchParams.get("mobileNo");
      const consentCreationData = searchParams.get("consentCreationData");
      completePendingConsent(
        consentID,
        consentType as ConsentType,
        mobileNo,
        consentCreationData,
      );
    }
  }, [isEnabled, consentID, consentType, searchParams]);

  const query = useQuery({
    queryKey: consentID ? [FI_DATA_QUERY_KEY, consentID] : ["fi-data-disabled"],
    queryFn: async () => {
      setModalOpen(true);

      if (!consentID || !consentType) {
        throw new Error("Invalid consent ID or consent type");
      }

      const data = await getAllFiData(consentID, 3000);

      if ("error" in data) {
        throw new Error(data.error);
      }

      // Mark data as ready after successful fetch
      updateConsent(consentID, { isDataReady: true });

      // Remove search params from url
      const url = new URL(window.location.href);
      url.searchParams.delete("consentID");
      url.searchParams.delete("consentType");
      url.searchParams.delete("mobileNo");
      url.searchParams.delete("consentCreationData");
      history.pushState(null, "", url.toString());

      setTimeout(() => setModalOpen(false), 1500);

      return data;
    },
    enabled: isEnabled,
    retry: true,
    retryDelay: 3000,
    // gcTime (7 days), staleTime (Infinity), and refetchOnWindowFocus inherited from QueryProvider setQueryDefaults
  });

  // Derive fetch status from query state
  const fetchStatus: "fetching" | "success" | "error" = query.isError
    ? "error"
    : query.isLoading || !query.data
      ? "fetching"
      : "success";

  return {
    ...query,
    fetchStatus,
    modalOpen,
    handleClose: () => setModalOpen(false),
    handleOpen: () => setModalOpen(true),
  };
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
  enabled: boolean = true,
) {
  const query = useQuery({
    queryKey: consentID ? [FI_DATA_QUERY_KEY, consentID] : ["fi-data-disabled"],
    queryFn: async () => {
      if (!consentID) {
        throw new Error("Invalid consent ID");
      }

      const data = await getAllFiData(consentID);

      if ("error" in data) {
        throw new Error(data.error);
      }

      return data;
    },
    enabled: enabled && !!consentID,
    // gcTime and staleTime inherited from QueryProvider defaults for ['fi-data'] queries
  });

  return query;
}

/**
 * Hook for refreshing FI data for an existing consent
 * Handles the full refresh workflow including:
 * - Triggering FI data request via requestFiData API
 * - Polling getAllFiData until new data is available
 * - Updating React Query cache with fresh data
 * - All components using useFiData will automatically update
 *
 * @returns Mutation object with refresh functionality
 */
export function useRefreshFiData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (consentID: string) => {
      // Step 1: Trigger FI data request (non-async, just initiates fetch)
      const requestResult = await requestFiData(consentID);

      if ("error" in requestResult) {
        throw new Error(requestResult.error);
      }

      // Clear the cache for this consent to ensure fresh data is fetched
      // This is critical because we have staleTime: Infinity (7-day cache)
      // Without clearing, even if new data is available, we'd serve stale cache
      queryClient.removeQueries({
        queryKey: [FI_DATA_QUERY_KEY, consentID],
      });
      console.log("Cleared FI data cache for consent:", consentID);

      // Step 2: Poll for new data with retries
      // Similar to useFiDataConsentFlow behavior
      const pollData = async (retryCount = 0): Promise<any> => {
        const maxRetries = 20; // ~60 seconds total with 3s delays

        if (retryCount >= maxRetries) {
          throw new Error(
            "Request timeout. The refresh is taking longer than expected. Please try again later.",
          );
        }

        // Wait before fetching (3 seconds like the consent flow)
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const data = await getAllFiData(consentID);

        if ("error" in data) {
          // Retry if error (data not ready yet)
          return pollData(retryCount + 1);
        }

        return data;
      };

      return pollData();
    },
    onSuccess: (data, consentID) => {
      // Update cache with new data - this automatically updates all components
      // using useFiData(consentID) across the app
      queryClient.setQueryData([FI_DATA_QUERY_KEY, consentID], data);

      // Update consent with fresh timestamp and ready state
      updateConsent(consentID, {
        isDataReady: true,
        consentCreationData: new Date().toISOString(),
      });
      console.log("Marked consent data as ready after refresh:", consentID);
    },
  });
}
