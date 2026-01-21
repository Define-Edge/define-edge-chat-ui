import {
  ArrowLeft,
  Target,
  Share,
  Download,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutualFundBasketBuilderContext } from "../../../hooks/useMutualFundBasketBuilderContext";
import { MutualFundBasketOverview } from "./results/MutualFundBasketOverview";
import { MutualFundConfigSummary } from "./results/MutualFundConfigSummary";
import { MFPortfolioAnalyticsTabs } from "@/modules/core/portfolio/mf-portfolio/components";
import { useImportStrategyMutation } from "@/modules/discover/hooks/useImportStrategyMutation";

/**
 * Results view for generated mutual fund basket
 * Displays basket overview, metrics, configuration summary, and holdings
 */
export function MutualFundBasketResults() {
  const { basketConfig, handleModify, portfolioResponse } =
    useMutualFundBasketBuilderContext();

  const importMutation = useImportStrategyMutation();

  const handleAddToChat = () => {
    if (!portfolioResponse) return;

    importMutation.mutate({
      strategy: portfolioResponse,
      type: "mf-basket",
      customIntro: `I have created a custom mutual fund portfolio with ${basketConfig.planType} plan. Here are the created portfolio holdings:`,
    });
  };

  // Handle case where API response is not available yet
  if (!portfolioResponse) {
    return (
      <div className="bg-bg-subtle flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Loading portfolio data...</div>
      </div>
    );
  }

  const description = `${basketConfig.planType.charAt(0).toUpperCase() + basketConfig.planType.slice(1)} plan with ${portfolioResponse.categories.length} fund ${portfolioResponse.categories.length === 1 ? "category" : "categories"}`;

  return (
    <div className="bg-bg-subtle mx-auto flex min-h-screen max-w-md flex-col md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      {/* Header */}
      <div className="bg-bg-base border-border-subtle sticky top-0 z-10 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleModify}
            className="hover:bg-bg-hover rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="text-icon-primary h-5 w-5" />
          </button>
          <div className="text-center">
            <h1 className="text-text-primary text-lg font-semibold">
              Your Mutual Fund Basket
            </h1>
            <p className="text-text-secondary text-xs">
              AI-generated based on your preferences
            </p>
          </div>
          <div className="flex gap-2">
            <button className="hover:bg-bg-hover rounded-full p-2 transition-colors">
              <Share className="text-text-secondary h-4 w-4" />
            </button>
            <button className="hover:bg-bg-hover rounded-full p-2 transition-colors">
              <Download className="text-text-secondary h-4 w-4" />
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
      <div className="space-y-3 px-6 pb-20">
        <div className="grid grid-cols-2 gap-3 md:mx-auto md:max-w-md md:grid-cols-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAddToChat}
            disabled={importMutation.isPending}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {importMutation.isPending ? "Adding..." : "Add to chat"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleModify}
          >
            <Target className="mr-2 h-4 w-4" />
            Modify Basket
          </Button>
        </div>
      </div>
    </div>
  );
}
