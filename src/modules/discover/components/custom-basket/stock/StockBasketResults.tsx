import {
  ArrowLeft,
  Target,
  Share,
  Download,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStockBasketBuilderContext } from "../../../hooks/useStockBasketBuilderContext";
import { StockBasketHero } from "./results/StockBasketHero";
import { StockConfigSummary } from "./results/StockConfigSummary";
import { PortfolioAnalyticsTabs } from "@/modules/core/portfolio/components";
import { generateBasketName } from "../../../utils/generateBasketName";
import { useImportStrategyMutation } from "@/modules/discover/hooks/useImportStrategyMutation";

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

  const importMutation = useImportStrategyMutation();

  const handleAddToChat = () => {
    if (!generatedBasket) return;

    importMutation.mutate({
      strategy: generatedBasket,
      type: "stock-basket",
      customIntro: `I have created a custom stock portfolio with ${basketConfig.investmentStyle} style. Here are the created portfolio holdings:`,
    });
  };

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
      <div className="bg-bg-subtle flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="text-accent-blue mx-auto h-12 w-12 animate-spin" />
          <div>
            <h3 className="text-text-primary text-lg font-semibold">
              Generating Your Basket
            </h3>
            <p className="text-text-secondary mt-2 text-sm">
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
      <div className="bg-bg-subtle flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md space-y-4 text-center">
          <div className="bg-error-bg mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <span className="text-3xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-text-primary text-lg font-semibold">
              Generation Failed
            </h3>
            <p className="text-text-secondary mt-2 text-sm">
              {generationError}
            </p>
          </div>
          <Button
            onClick={handleModify}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state if no basket generated yet
  if (!generatedBasket) {
    return (
      <div className="bg-bg-subtle flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md space-y-4 text-center">
          <p className="text-text-secondary text-sm">
            No basket data available. Please complete the form first.
          </p>
          <Button onClick={handleModify}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

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
              Your Stock Basket
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

      {/* Basket Hero — identity + all key metrics */}
      <StockBasketHero
        basketName={generateBasketName(generatedBasket.investment_style)}
        description={description}
        analytics={generatedBasket.analytics}
      />

      {/* Configuration Summary */}
      <StockConfigSummary basketConfig={basketConfig} />

      {/* Portfolio Analytics Tabs - Overview, Holdings, Analytics */}
      <PortfolioAnalyticsTabs
        analytics={generatedBasket.analytics}
        showMissingHoldingsWarning={false}
      />

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
