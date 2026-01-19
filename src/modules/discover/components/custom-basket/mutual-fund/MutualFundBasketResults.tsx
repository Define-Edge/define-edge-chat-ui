import { ArrowLeft, Eye, Target, Share, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutualFundBasketBuilderContext } from "../../../hooks/useMutualFundBasketBuilderContext";
import { MutualFundBasketOverview } from "./results/MutualFundBasketOverview";
import { MutualFundConfigSummary } from "./results/MutualFundConfigSummary";
import { MFPortfolioAnalyticsTabs } from "@/modules/core/portfolio/mf-portfolio/components";

/**
 * Results view for generated mutual fund basket
 * Displays basket overview, metrics, configuration summary, and holdings
 */
export function MutualFundBasketResults() {
  const { basketConfig, handleModify, portfolioResponse } =
    useMutualFundBasketBuilderContext();

  // Handle case where API response is not available yet
  if (!portfolioResponse) {
    return (
      <div className="min-h-screen bg-bg-subtle flex items-center justify-center">
        <div className="text-text-secondary">Loading portfolio data...</div>
      </div>
    );
  }

  const description = `${basketConfig.planType.charAt(0).toUpperCase() + basketConfig.planType.slice(1)} plan with ${portfolioResponse.categories.length} fund ${portfolioResponse.categories.length === 1 ? "category" : "categories"}`;

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
      <MutualFundBasketOverview
        response={portfolioResponse}
        description={description}
      />

      {/* Configuration Summary */}
      <MutualFundConfigSummary basketConfig={basketConfig} />

      {/* Portfolio Analytics Tabs */}
      <MFPortfolioAnalyticsTabs analytics={portfolioResponse.analytics} />

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
