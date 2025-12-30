"use client";
import { useMemo } from "react";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { useFiData } from "@/modules/import-data/hooks/useFiData";
import {
  extractHoldingsFromFiData,
  transformHoldingsToFormData,
  HoldingWithQuantity,
} from "../utils/holdings-transformer";

/**
 * Hook for fetching and transforming holdings data
 * Handles data fetching via useFiData and transforms to form-ready format
 *
 * @param consentID - The consent ID to fetch data for
 * @param consentType - Type of consent (EQUITIES or MUTUAL_FUNDS)
 * @param isDataReady - Whether the data is ready to be fetched
 * @returns Holdings, form default values, and loading state
 */
export function useHoldingsData(
  consentID: string | null | undefined,
  consentType: ConsentType,
  isDataReady: boolean,
) {
  // Fetch FI data - always enabled if consentID exists (for cache hydration)
  const { data: fiData, isLoading } = useFiData(consentID, !!isDataReady);

  // Extract holdings from FI data (memoized)
  const holdings = useMemo(
    () => extractHoldingsFromFiData(fiData),
    [fiData],
  );

  // Transform to form data with quantity field (memoized)
  const formDefaultValues = useMemo(
    () => transformHoldingsToFormData(holdings, consentType),
    [holdings, consentType],
  );

  return {
    /** Raw holdings data */
    holdings,
    /** Holdings transformed for form with quantity field */
    formDefaultValues,
    /** Whether data is currently loading */
    isLoading,
    /** Raw FI data response */
    fiData,
  };
}

export type UseHoldingsDataReturn = {
  holdings: ReturnType<typeof extractHoldingsFromFiData>;
  formDefaultValues: HoldingWithQuantity[];
  isLoading: boolean;
  fiData: ReturnType<typeof useFiData>["data"];
};
