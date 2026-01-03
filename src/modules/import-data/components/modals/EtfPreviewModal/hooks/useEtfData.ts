/**
 * Hook for fetching and transforming ETF data
 *
 * TODO: SET_TYPE - Verify data structure matches actual ETF API response
 */

"use client";
import { useMemo } from "react";
import { useFiData } from "@/modules/import-data/hooks/useFiData";
import {
  ETFHolding,
  ETFHoldingWithQuantity,
  ETFFiDataResponse,
} from "@/modules/import-data/types/etf";
import {
  extractETFsFromFiData,
  transformETFsToFormData,
} from "../utils/etf-transformer";

/**
 * Hook for fetching and transforming ETF data
 * Handles data fetching via useFiData and transforms to form-ready format
 *
 * @param consentID - The consent ID to fetch data for
 * @param isDataReady - Whether the data is ready to be fetched
 * @returns ETFs, form default values, and loading state
 */
export function useEtfData(
  consentID: string | null | undefined,
  isDataReady: boolean,
) {
  // Fetch FI data - always enabled if consentID exists (for cache hydration)
  const { data: fiData, isLoading } = useFiData(consentID, !!isDataReady);

  // Cast to ETF-specific type
  const etfData = fiData as ETFFiDataResponse | undefined;

  // Extract ETFs from FI data (memoized)
  const etfs = useMemo(
    () => extractETFsFromFiData(etfData),
    [etfData],
  );

  // Transform to form data with quantity field (memoized)
  const formDefaultValues = useMemo(
    () => transformETFsToFormData(etfs),
    [etfs],
  );

  return {
    /** Raw ETF holdings */
    etfs,
    /** ETFs transformed for form with quantity field */
    formDefaultValues,
    /** Whether data is currently loading */
    isLoading,
    /** Raw FI data response (ETF-specific type) */
    fiData: etfData,
  };
}

export type UseEtfDataReturn = {
  etfs: ETFHolding[];
  formDefaultValues: ETFHoldingWithQuantity[];
  isLoading: boolean;
  fiData: ETFFiDataResponse | undefined;
};
