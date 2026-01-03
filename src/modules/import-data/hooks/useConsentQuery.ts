"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { getUserConsent } from "@/lib/moneyone/moneyone.storage";

/**
 * Custom hook to query user consent with real-time localStorage tracking
 * @param consentType - The type of consent to query
 * @returns Query result with consent data
 */
export function useConsentQuery(consentType: ConsentType) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["consent", consentType],
    queryFn: () => getUserConsent(consentType),
    staleTime: 1000, // 1 second - refetch if data is older than 1s
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Refetch when component mounts
  });

  // Listen for localStorage changes and invalidate query
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Check if the change is related to MoneyOne consents
      if (e.key?.startsWith("moneyone:consent:") || e.key?.startsWith("moneyone:user:")) {
        queryClient.invalidateQueries({ queryKey: ["consent", consentType] });
      }
    };

    // Listen for storage events (fires when localStorage changes in other tabs)
    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab localStorage changes
    const handleCustomStorageChange = ((e: CustomEvent) => {
      if (e.detail?.consentType === consentType || e.detail?.type === "consent") {
        queryClient.invalidateQueries({ queryKey: ["consent", consentType] });
      }
    }) as EventListener;

    window.addEventListener("moneyone:consent-updated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("moneyone:consent-updated", handleCustomStorageChange);
    };
  }, [consentType, queryClient]);

  return query;
}
