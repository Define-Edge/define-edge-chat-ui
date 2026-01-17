import { ArrowLeft, Eye, Target, Share, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutualFundBasketBuilderContext } from "../../../hooks/useMutualFundBasketBuilderContext";
import { mockMutualFunds } from "../../../constants/mutual-fund-basket-data";
import type { GeneratedMutualFundBasket } from "../../../types/basket-builder.types";
import { MutualFundBasketOverview } from "./results/MutualFundBasketOverview";
import { MutualFundBasketMetrics } from "./results/MutualFundBasketMetrics";
import { MutualFundConfigSummary } from "./results/MutualFundConfigSummary";
import { MutualFundHoldingsList } from "./results/MutualFundHoldingsList";

/**
 * Results view for generated mutual fund basket
 * Displays basket overview, metrics, configuration summary, and holdings
 */
export function MutualFundBasketResults() {
  const { basketConfig, handleModify } = useMutualFundBasketBuilderContext();

  /**
   * Generate basket data based on user configuration
   */
  const generateBasket = (): GeneratedMutualFundBasket => {
    const basketName =
      basketConfig.planType === "direct"
        ? "Direct Plan Mutual Fund Basket"
        : "Regular Plan Mutual Fund Basket";

    // Map fund categories from config and assign weights
    const selectedFunds = basketConfig.fundCategories.flatMap((category) => {
      const matchingFunds = mockMutualFunds.filter(
        (fund) => fund.category.toLowerCase() === category.name.toLowerCase()
      );

      if (matchingFunds.length > 0) {
        // Pick funds based on user's schemesCount preference
        const schemesCount = category.schemesCount || 1;
        const fundsToAdd = matchingFunds.slice(0, schemesCount);
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
  };

  const basketData = generateBasket();
  const description = `${basketConfig.planType.charAt(0).toUpperCase() + basketConfig.planType.slice(1)} plan with ${basketConfig.fundCategories.length} fund ${basketConfig.fundCategories.length === 1 ? "category" : "categories"}`;

  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-bg-base px-6 py-4 border-b border-border-subtle sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={handleModify}
            className="p-2 hover:bg-bg-hover rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-icon-primary" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-text-primary">
              Your Mutual Fund Basket
            </h1>
            <p className="text-xs text-text-secondary">
              AI-generated based on your preferences
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-bg-hover rounded-full transition-colors">
              <Share className="w-4 h-4 text-text-secondary" />
            </button>
            <button className="p-2 hover:bg-bg-hover rounded-full transition-colors">
              <Download className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Basket Overview */}
      <MutualFundBasketOverview basket={basketData} description={description} />

      {/* Key Metrics */}
      <MutualFundBasketMetrics basket={basketData} />

      {/* Configuration Summary */}
      <MutualFundConfigSummary basketConfig={basketConfig} />

      {/* Holdings */}
      <MutualFundHoldingsList funds={basketData.funds} />

      {/* Action Buttons */}
      <div className="px-6 space-y-3 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:max-w-md md:mx-auto">
          <Button variant="outline" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Preview Portfolio
          </Button>
          <Button variant="outline" className="w-full" onClick={handleModify}>
            <Target className="w-4 h-4 mr-2" />
            Modify Basket
          </Button>
        </div>
      </div>
    </div>
  );
}
