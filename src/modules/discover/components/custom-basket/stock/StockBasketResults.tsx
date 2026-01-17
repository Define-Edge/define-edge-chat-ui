import { ArrowLeft, Eye, Target, Share, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStockBasketBuilderContext } from "../../../hooks/useStockBasketBuilderContext";
import { StockBasketOverview } from "./results/StockBasketOverview";
import { StockBasketMetrics } from "./results/StockBasketMetrics";
import { StockConfigSummary } from "./results/StockConfigSummary";
import { PortfolioAnalyticsTabs } from "@/modules/core/portfolio/components";
import { generateBasketName } from "../../../utils/generateBasketName";

/**
 * Results view for generated stock basket
 * Displays basket overview, metrics, configuration summary, and holdings
 */
export function StockBasketResults() {
  const {
    basketConfig,
    handleModify,
    generatedBasket,
    isGenerating,
    generationError,
  } = useStockBasketBuilderContext();

  // Generate description for basket
  const description = basketConfig.investmentStyle
    ? `${basketConfig.investmentStyle} investing approach with ${
        basketConfig.portfolioSize === "concentrated"
          ? "concentrated"
          : basketConfig.portfolioSize === "diversified"
            ? "diversified"
            : "custom"
      } portfolio`
    : "Custom stock basket";

  // Show loading state
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-bg-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-accent-blue animate-spin mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Generating Your Basket
            </h3>
            <p className="text-sm text-text-secondary mt-2">
              Creating your personalized stock portfolio...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (generationError) {
    return (
      <div className="min-h-screen bg-bg-subtle flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Generation Failed
            </h3>
            <p className="text-sm text-text-secondary mt-2">
              {generationError}
            </p>
          </div>
          <Button onClick={handleModify} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state if no basket generated yet
  if (!generatedBasket) {
    return (
      <div className="min-h-screen bg-bg-subtle flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-sm text-text-secondary">
            No basket data available. Please complete the form first.
          </p>
          <Button onClick={handleModify}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

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
              Your Stock Basket
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
      <StockBasketOverview
        basketName={generateBasketName(generatedBasket.investment_style)}
        description={description}
        totalStocks={generatedBasket.analytics.total_stocks}
      />

      {/* Key Metrics */}
      <StockBasketMetrics analytics={generatedBasket.analytics} />

      {/* Configuration Summary */}
      <StockConfigSummary basketConfig={basketConfig} />

      {/* Portfolio Analytics Tabs - Overview, Holdings, Analytics */}
      <PortfolioAnalyticsTabs
        analytics={generatedBasket.analytics}
        showMissingHoldingsWarning={false}
      />

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
