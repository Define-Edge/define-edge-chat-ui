"use client";
import { useState, useEffect } from "react";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { getUserConsent, ConsentData } from "@/lib/moneyone/moneyone.storage";

interface MoneyOneStatus {
  equityConsent: ConsentData | null;
  mfConsent: ConsentData | null;
  isEquityConnected: boolean;
  isMfConnected: boolean;
  refresh: () => void;
}

/**
 * Hook to check MoneyOne consent status for Equity and Mutual Funds
 * Checks localStorage for valid consents with data ready
 */
export function useMoneyOneStatus(): MoneyOneStatus {
  const [equityConsent, setEquityConsent] = useState<ConsentData | null>(null);
  const [mfConsent, setMfConsent] = useState<ConsentData | null>(null);

  const checkConsents = () => {
    const equity = getUserConsent(ConsentType.EQUITIES);
    const mf = getUserConsent(ConsentType.MUTUAL_FUNDS);

    // Only consider as connected if data is ready
    setEquityConsent(equity?.isDataReady ? equity : null);
    setMfConsent(mf?.isDataReady ? mf : null);
  };

  useEffect(() => {
    checkConsents();

    // Listen for storage changes (in case consent is updated in another tab or by redirect)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("moneyone:consent:")) {
        checkConsents();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    equityConsent,
    mfConsent,
    isEquityConnected: equityConsent !== null,
    isMfConnected: mfConsent !== null,
    refresh: checkConsents,
  };
}
