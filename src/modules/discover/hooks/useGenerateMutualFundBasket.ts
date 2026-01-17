import { useMutation } from "@tanstack/react-query";
import type {
  MutualFundBasketConfig,
  GeneratedMutualFundBasket,
} from "../types/basket-builder.types";
import { mockMutualFunds } from "../constants/mutual-fund-basket-data";

/**
 * Generate mock mutual fund basket (placeholder for API integration)
 * TODO: Replace with actual API call when backend is ready
 */
function generateMockMutualFundBasket(
  config: MutualFundBasketConfig
): GeneratedMutualFundBasket {
  const basketName =
    config.planType === "direct"
      ? "Direct Plan Mutual Fund Basket"
      : "Regular Plan Mutual Fund Basket";

  // Map fund categories from config and assign weights
  const selectedFunds = config.fundCategories.flatMap((category) => {
    const matchingFunds = mockMutualFunds.filter(
      (fund) => fund.category.toLowerCase() === category.name.toLowerCase()
    );

    if (matchingFunds.length > 0) {
      const fundsToAdd = matchingFunds.slice(0, 2);
      const weightPerFund = category.percentage / fundsToAdd.length;

      return fundsToAdd.map((fund) => ({
        ...fund,
        weight: Number(weightPerFund.toFixed(1)),
      }));
    }

    return [];
  });

  // If no matching funds found, use a default set
  if (selectedFunds.length === 0) {
    const defaultFunds = mockMutualFunds.slice(0, 5).map((fund, idx) => ({
      ...fund,
      weight:
        idx === 0 ? 24 : idx === 1 ? 23 : idx === 2 ? 21 : idx === 3 ? 17 : 15,
    }));
    selectedFunds.push(...defaultFunds);
  }

  const metrics = {
    expectedReturn: "14.5%",
    riskLevel: "Medium" as const,
    volatility: "12.5%",
    sharpeRatio: "1.42",
  };

  return {
    type: "mutualFunds",
    name: basketName,
    funds: selectedFunds,
    ...metrics,
  };
}

/**
 * Hook to generate mutual fund basket
 * Currently uses mock data, will be replaced with actual API call
 */
export function useGenerateMutualFundBasket() {
  return useMutation({
    mutationFn: async (config: MutualFundBasketConfig) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      // const response = await fetch('/api/baskets/mutual-fund/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(config),
      // });
      // return response.json();

      return generateMockMutualFundBasket(config);
    },
  });
}
