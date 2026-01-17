import { ArrowLeft, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useStockBasketBuilderContext } from "../../../hooks/useStockBasketBuilderContext";
import { useBasketBuilderContext } from "../../../hooks/useBasketBuilderContext";
import { stockBasketSteps } from "../../../constants/stock-basket-data";
import { InvestmentStyleStep } from "./steps/InvestmentStyleStep";
import { MarketCapStep } from "./steps/MarketCapStep";
import { PortfolioSizeStep } from "./steps/PortfolioSizeStep";
import { PortfolioAllocationStep } from "./steps/PortfolioAllocationStep";

/**
 * Multi-step form container for stock basket builder
 * Renders appropriate step based on current state
 */
export function StockBasketForm() {
  const { currentStep, prevStep, totalSteps } =
    useStockBasketBuilderContext();
  const { resetInvestmentType } = useBasketBuilderContext();

  /**
   * Render the current step component
   */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <InvestmentStyleStep />;
      case 2:
        return <MarketCapStep />;
      case 3:
        return <PortfolioSizeStep />;
      case 4:
        return <PortfolioAllocationStep />;
      default:
        return <InvestmentStyleStep />;
    }
  };

  /**
   * Get current step info for display
   */
  const getCurrentStepInfo = () => {
    if (currentStep >= 1 && currentStep <= totalSteps) {
      return stockBasketSteps[currentStep - 1];
    }
    return stockBasketSteps[0];
  };

  const stepInfo = getCurrentStepInfo();

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    if (currentStep === 1) {
      resetInvestmentType();
    } else {
      prevStep();
    }
  };

  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-bg-base px-6 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-bg-hover rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-icon-primary" />
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-text-primary">
                Stock Basket Builder
              </h1>
              <p className="text-xs text-text-secondary">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <div className="w-9"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-bg-base px-6 py-3 border-b border-border-subtle">
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="w-full"
          />
        </div>

        {/* Step Indicator */}
        <div className="bg-bg-base px-6 py-3 border-b border-border-subtle">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-blue" />
              <span className="text-sm font-medium text-text-primary">
                {stepInfo.title}
              </span>
            </div>
          </div>
        </div>

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
