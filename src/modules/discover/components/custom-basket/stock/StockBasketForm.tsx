import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { stockBasketSteps } from "../../../constants/stock-basket-data";
import { useBasketBuilderContext } from "../../../hooks/useBasketBuilderContext";
import { useStockBasketBuilderContext } from "../../../hooks/useStockBasketBuilderContext";
import { InvestmentStyleStep } from "./steps/InvestmentStyleStep";
import { MarketCapStep } from "./steps/MarketCapStep";
import { PortfolioAllocationStep } from "./steps/PortfolioAllocationStep";
import { PortfolioSizeStep } from "./steps/PortfolioSizeStep";

/**
 * Multi-step form container for stock basket builder
 * Renders appropriate step based on current state
 */
export function StockBasketForm() {
  const { currentStep, prevStep, totalSteps } = useStockBasketBuilderContext();
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
    <div className="bg-bg-subtle flex flex-col">
      <div className="mx-auto flex w-full max-w-md flex-col md:max-w-2xl">
        {/* Header */}
        <div className="bg-bg-base border-border-subtle border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="hover:bg-bg-hover rounded-full p-2 transition-colors"
            >
              <ArrowLeft className="text-icon-primary h-5 w-5" />
            </button>
            <div className="text-center">
              <h1 className="text-text-primary text-lg font-semibold">
                Stock Basket Builder
              </h1>
              <p className="text-text-secondary text-xs">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <div className="w-9"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-bg-base border-border-subtle border-b px-6 py-3">
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="w-full"
          />
        </div>

        {/* Step Indicator */}
        <div className="bg-bg-base border-border-subtle border-b px-6 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-accent-blue h-4 w-4" />
              <span className="text-text-primary text-sm font-medium">
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
