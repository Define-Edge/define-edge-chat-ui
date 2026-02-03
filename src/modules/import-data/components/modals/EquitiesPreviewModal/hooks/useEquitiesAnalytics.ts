import { useCallback } from "react";
import {
  useAnalyzePortfolioApiPortfoliosAnalyzePost,
  analyzePortfolioApiPortfoliosAnalyzePostResponse200,
} from "@/api/generated/portfolio-apis/portfolio-apis/portfolio-apis";
import { AnalysisInputUnit } from "@/api/generated/portfolio-apis/models/analysisInputUnit";
import { EquityHoldingWithQuantity } from "@/modules/import-data/types/equities";
import { transformEquitiesToPortfolioItems } from "../utils/equities-to-portfolio-items";

/**
 * Hook to analyze equity portfolio using the Portfolio Analysis API
 * Uses Tanstack Query mutation for state management
 */
export function useEquitiesAnalytics() {
  const mutation = useAnalyzePortfolioApiPortfoliosAnalyzePost();

  const analyzePortfolio = useCallback(
    (holdings: EquityHoldingWithQuantity[]) => {
      const items = transformEquitiesToPortfolioItems(holdings);

      if (items.length === 0) {
        return; // No valid holdings to analyze
      }

      mutation.mutate({
        data: {
          items,
          input_unit: AnalysisInputUnit.quantity,
          duration: "1y",
        },
      });
    },
    [mutation],
  );

  // Extract analytics data from successful response
  const response = mutation.data;
  const analytics =
    response?.status === 200
      ? (response as analyzePortfolioApiPortfoliosAnalyzePostResponse200).data
      : null;

  return {
    analytics,
    isAnalyzing: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    analyzePortfolio,
    reset: mutation.reset,
  };
}
