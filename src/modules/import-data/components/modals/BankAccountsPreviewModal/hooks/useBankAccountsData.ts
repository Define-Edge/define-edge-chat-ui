/**
 * Hook for fetching and transforming bank accounts data
 */

"use client";
import { useMemo } from "react";
import { useFiData } from "@/modules/import-data/hooks/useFiData";
import {
  BankAccount,
  BankAccountWithFormData,
  BankAccountsFiDataResponse,
} from "@/modules/import-data/types/bank-accounts";
import {
  extractBankAccountsFromFiData,
  transformBankAccountsToFormData,
} from "../utils/bank-accounts-transformer";

/**
 * Hook for fetching and transforming bank accounts data
 * Handles data fetching via useFiData and transforms to form-ready format
 *
 * @param consentID - The consent ID to fetch data for
 * @param isDataReady - Whether the data is ready to be fetched
 * @returns Bank accounts, form default values, and loading state
 */
export function useBankAccountsData(
  consentID: string | null | undefined,
  isDataReady: boolean,
) {
  // Fetch FI data - always enabled if consentID exists (for cache hydration)
  const { data: fiData, isLoading } = useFiData(consentID, !!isDataReady);

  // Cast to bank account-specific type
  const bankAccountsData = fiData as BankAccountsFiDataResponse | undefined;

  // Extract bank accounts from FI data (memoized)
  const bankAccounts = useMemo(
    () => extractBankAccountsFromFiData(bankAccountsData),
    [bankAccountsData],
  );

  // Transform to form data with display fields (memoized)
  const formDefaultValues = useMemo(
    () => transformBankAccountsToFormData(bankAccounts),
    [bankAccounts],
  );

  return {
    /** Raw bank account data */
    bankAccounts,
    /** Bank accounts transformed for form with display fields */
    formDefaultValues,
    /** Whether data is currently loading */
    isLoading,
    /** Raw FI data response (bank account-specific type) */
    fiData: bankAccountsData,
  };
}

export type UseBankAccountsDataReturn = {
  bankAccounts: BankAccount[];
  formDefaultValues: BankAccountWithFormData[];
  isLoading: boolean;
  fiData: BankAccountsFiDataResponse | undefined;
};
