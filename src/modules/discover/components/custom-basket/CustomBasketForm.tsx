import { useBasketBuilderContext } from "../../hooks/useBasketBuilderContext";
import { StepIndicator } from "./StepIndicator";
import { ThemeStep } from "./steps/ThemeStep";
import { InvestmentStyleStep } from "./steps/InvestmentStyleStep";
import { MarketCapStep } from "./steps/MarketCapStep";
import { PortfolioSizeStep } from "./steps/PortfolioSizeStep";
import { ConsiderationsStep } from "./steps/ConsiderationsStep";

/**
 * Multi-step form container for custom basket builder
 * Renders appropriate step based on current state
 */
export function CustomBasketForm() {
  const { currentStep } = useBasketBuilderContext();

  /**
   * Render the current step component
   */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ThemeStep />;
      case 2:
        return <InvestmentStyleStep />;
      case 3:
        return <MarketCapStep />;
      case 4:
        return <PortfolioSizeStep />;
      case 5:
        return <ConsiderationsStep />;
      default:
        return <ThemeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full flex flex-col min-h-screen">
        {/* Progress Bar */}
        <StepIndicator />

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
