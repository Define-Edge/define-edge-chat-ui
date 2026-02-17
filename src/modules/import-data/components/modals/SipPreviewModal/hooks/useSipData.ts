/**
 * Hook for fetching and transforming SIP data
 */

"use client";
import { useMemo } from "react";
import { useFiData } from "@/modules/import-data/hooks/useFiData";
import { SIPFiDataResponse } from "@/modules/import-data/types/sip";
import { transformSipAccountsToDisplayData } from "../utils/sip-transformer";

/**
 * Hook for fetching and transforming SIP data
 * Handles data fetching via useFiData and transforms to display-ready format
 *
 * @param consentID - The consent ID to fetch data for
 * @param isDataReady - Whether the data is ready to be fetched
 * @returns SIP display data, loading state, and raw FI data
 */
export function useSipData(
  consentID: string | null | undefined,
  isDataReady: boolean,
) {
  // Fetch FI data - always enabled if consentID exists (for cache hydration)
  const { data: fiData, isLoading } = useFiData(consentID, !!isDataReady);

  // Cast to SIP-specific type
  const sipData = fiData as SIPFiDataResponse | undefined;

  // Transform to display data (memoized)
  const displayData = useMemo(
    () => transformSipAccountsToDisplayData(sipData),
    [sipData],
  );

  return {
    /** SIP accounts transformed for display */
    displayData,
    /** Whether data is currently loading */
    isLoading,
    /** Raw FI data response (SIP-specific type) */
    fiData: sipData,
  };
}
